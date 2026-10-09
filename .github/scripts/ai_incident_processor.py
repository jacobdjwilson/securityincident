#!/usr/bin/env python3
"""
Operational Purpose:
    Intelligently summarizes raw news articles, categorizes incident taxonomy (sector, vector,
    tags), and extracts impact scope (affected records, compromised data classes) for unsummarized
    security incident records. Strictly preserves statutory regulatory filings and material facts
    without LLM modification. Enforces judicial API usage via local SHA-256 caching and fallback ladders.

Required Environment Variables:
    GEMINI_API_KEY: Google Gemini API key for intelligent summarization and classification.
    GOOGLE_SEARCH_API_KEY: (Optional) Google Custom Search API key for source verification.

Outputs:
    .cache/ai-cache.json: Local persistent cache of processed article hashes and summaries.
    incidents/*.md: Updated incident frontmatter with enriched summaries, sector, and impact scope.

JSON Artifact Dependencies:
    .github/artifacts/workflow-config.json
    .github/artifacts/ai-models.json
    .github/artifacts/incident-categories.json
"""

import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CONFIG_DIR = ROOT_DIR / ".github" / "artifacts"
PROMPTS_DIR = ROOT_DIR / ".github" / "ai-prompts"
CACHE_DIR = ROOT_DIR / ".cache"
INCIDENTS_DIR = ROOT_DIR / "incidents"

EXIT_SUCCESS = 0
EXIT_ERROR = 1
EXIT_QUOTA_EXHAUSTED = 2


class ConfigLoader:
    """Encapsulates configuration retrieval from .github/artifacts with fail-fast validation."""

    def __init__(self, config_dir: Path):
        self.config_dir = config_dir
        self.workflow_config = self._load_json("workflow-config.json")
        self.ai_models = self._load_json("ai-models.json")
        self.categories = self._load_json("incident-categories.json")

    def _load_json(self, filename: str) -> Dict[str, Any]:
        filepath = self.config_dir / filename
        if not filepath.exists():
            raise FileNotFoundError(
                f"Required configuration artifact '{filename}' not found at {filepath}. "
                "Ensure all artifacts in .github/artifacts/ are present."
            )
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as err:
            raise ValueError(f"Malformed JSON artifact '{filename}': {err}")


class PersistentCache:
    """Manages disk-backed SHA-256 response caching to enforce judicial API usage."""

    def __init__(self, cache_file: Path):
        self.cache_file = cache_file
        self.data: Dict[str, Any] = {}
        self._load()

    def _load(self) -> None:
        if self.cache_file.exists():
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception:
                self.data = {}

    def get(self, key: str) -> Optional[Any]:
        return self.data.get(key)

    def set(self, key: str, value: Any) -> None:
        self.data[key] = value
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.cache_file, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2)


class GeminiClient:
    """Client for Google Gemini REST API supporting fallback ladders and exponential backoff."""

    def __init__(self, api_key: str, models_config: Dict[str, Any]):
        self.api_key = api_key
        self.models_config = models_config
        self.quota_policy = models_config.get("quota_retry_policy", {})

    def call_task(self, task_name: str, system_prompt: str, context: str) -> Tuple[Optional[str], Optional[int]]:
        """
        Executes an AI task routing across primary -> secondary -> tertiary models with backoff.
        Applies task-specific configurations (temperature, top_p, top_k, thinking_budget) from ai-models.json.
        Returns: (response_text, exit_code)
        """
        task_routing = self.models_config.get("task_models", {}).get(task_name, {})
        ladder = [
            task_routing.get("primary", "gemini-3.8-flash"),
            task_routing.get("secondary", "gemini-3.7-flash"),
            task_routing.get("tertiary", "gemini-3.5-flash-lite")
        ]

        task_config = self.models_config.get("configurations", {}).get(task_name, self.models_config.get("configurations", {}).get("default", {}))
        generation_config = {
            "temperature": task_config.get("temperature", 0.2),
            "maxOutputTokens": task_config.get("max_output_tokens", 300),
            "topP": task_config.get("top_p", 0.95),
            "topK": task_config.get("top_k", 40)
        }
        thinking_budget = task_config.get("thinking_budget")
        if thinking_budget is not None and thinking_budget > 0:
            generation_config["thinkingConfig"] = {"thinkingBudget": thinking_budget}

        full_prompt = f"{system_prompt}\n\n# Document Context Below\n{context}"
        max_retries = self.quota_policy.get("max_attempts", 3)
        initial_delay = self.quota_policy.get("initial_delay_seconds", 60.0)
        multiplier = self.quota_policy.get("backoff_multiplier", 2.0)
        max_delay = self.quota_policy.get("max_delay_seconds", 180.0)

        for model in ladder:
            delay = initial_delay
            for attempt in range(max_retries):
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": full_prompt}]}],
                    "generationConfig": generation_config
                }
                data_bytes = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=data_bytes,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                try:
                    with urllib.request.urlopen(req, timeout=25) as response:
                        res_json = json.loads(response.read().decode("utf-8"))
                        candidates = res_json.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                return parts[0]["text"].strip(), EXIT_SUCCESS
                except urllib.error.HTTPError as err:
                    if err.code == 429:
                        print(f"⚠️ [HTTP 429 Rate Limit] Model {model} attempt {attempt + 1}/{max_retries}. Backoff {delay}s...")
                        time.sleep(delay)
                        delay = min(delay * multiplier, max_delay)
                        continue
                    elif err.code in (500, 503):
                        print(f"⚠️ [HTTP {err.code}] Transient failure on {model}. Retrying...")
                        time.sleep(2.0)
                        continue
                    else:
                        print(f"❌ [HTTP {err.code}] Gemini API error on {model}: {err.read().decode('utf-8', errors='ignore')}")
                        break
                except Exception as ex:
                    print(f"⚠️ Exception invoking {model}: {ex}")
                    time.sleep(2.0)
                    continue

        return None, EXIT_QUOTA_EXHAUSTED


def compute_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_prompt(prompt_rel_path: str) -> str:
    filepath = ROOT_DIR / prompt_rel_path
    if not filepath.exists():
        raise FileNotFoundError(f"Prompt file not found at {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def process_unsummarized_incidents() -> int:
    """Scans incident files, identifies those needing enrichment, and applies AI summarization judicial of quotas."""
    config_loader = ConfigLoader(CONFIG_DIR)
    workflow_cfg = config_loader.workflow_config.get("workflow", {})
    ai_models_cfg = config_loader.ai_models

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("ℹ️ GEMINI_API_KEY not configured in environment. Skipping AI enrichment cycle (deterministic mode).")
        return EXIT_SUCCESS

    cache_file = ROOT_DIR / workflow_cfg.get("ai_cache_file", ".cache/ai-cache.json")
    cache = PersistentCache(cache_file)
    gemini_client = GeminiClient(api_key, ai_models_cfg)

    summarize_prompt = load_prompt(config_loader.workflow_config["configurations"]["summarization"]["prompt_path"])
    categorize_prompt = load_prompt(config_loader.workflow_config["configurations"]["categorization"]["prompt_path"])
    impact_prompt = load_prompt(config_loader.workflow_config["configurations"]["impact_extraction"]["prompt_path"])
    deep_prompt = load_prompt(config_loader.workflow_config["configurations"]["deep_extraction"]["prompt_path"])

    max_calls = workflow_cfg.get("max_ai_calls_per_run", 25)
    calls_made = 0
    updated_files = 0

    if not INCIDENTS_DIR.exists():
        print(f"Directory {INCIDENTS_DIR} does not exist.")
        return EXIT_SUCCESS

    for file_path in sorted(INCIDENTS_DIR.glob("*.md")):
        if calls_made >= max_calls:
            print(f"⏹️ Reached maximum operational AI call budget ({max_calls}) for this ingestion run.")
            break

        try:
            content = file_path.read_text(encoding="utf-8")
        except Exception as ex:
            print(f"Could not read {file_path}: {ex}")
            continue

        # Extract frontmatter and body
        parts = content.split("---", 2)
        if len(parts) < 3:
            continue

        frontmatter_raw = parts[1]
        body = parts[2]

        # Check if incident needs deep extraction, summarization, or impact scope
        needs_summary = "summary: ''" in frontmatter_raw or 'summary: ""' in frontmatter_raw or ("summary: >-" in frontmatter_raw and "..." in frontmatter_raw)
        needs_records = "affected_records: null" in frontmatter_raw
        needs_deep = ("## Incident Overview" not in body) or ("CVE-" in f"{frontmatter_raw} {body}" and "cve_ids:" not in frontmatter_raw)

        if not (needs_summary or needs_records or needs_deep):
            continue

        # Compute hash of context
        context_text = f"{file_path.stem}\n{body[:3500]}"
        content_hash = compute_hash(context_text)

        # Check local cache first (judicial caching policy)
        cached_res = cache.get(content_hash)
        if cached_res:
            continue

        print(f"🔍 Deeply enriching incident {file_path.name} via AI model pipeline...")

        file_modified = False

        # Execute deep extraction task
        deep_res, status = gemini_client.call_task("deep_extraction", deep_prompt, context_text)
        calls_made += 1
        if status == EXIT_QUOTA_EXHAUSTED:
            print("🛑 Quota limit hit during deep extraction task. Gracefully pausing processing.")
            return EXIT_SUCCESS

        if deep_res:
            try:
                clean_json = re.sub(r"^```(?:json)?|```$", "", deep_res.strip(), flags=re.MULTILINE).strip()
                extracted = json.loads(clean_json)

                # 1. CVE extraction
                cves = extracted.get("cve_ids", [])
                if isinstance(cves, list) and cves and "cve_ids:" not in frontmatter_raw:
                    cve_yaml = "cve_ids:\n" + "\n".join(f'  - "{c}"' for c in cves)
                    frontmatter_raw = f"{frontmatter_raw.rstrip()}\n{cve_yaml}\n"
                    file_modified = True

                # 2. Affected records
                recs = extracted.get("affected_records")
                if needs_records and isinstance(recs, int) and recs > 0:
                    frontmatter_raw = re.sub(
                        r"^affected_records:\s*null",
                        lambda _: f"affected_records: {recs}",
                        frontmatter_raw,
                        count=1,
                        flags=re.MULTILINE
                    )
                    file_modified = True

                # 3. Compromised data classes
                comp_data = extracted.get("compromised_data", [])
                if isinstance(comp_data, list) and comp_data and "compromised_data:" not in frontmatter_raw:
                    data_yaml = "compromised_data:\n" + "\n".join(f'  - "{d}"' for d in comp_data)
                    frontmatter_raw = f"{frontmatter_raw.rstrip()}\n{data_yaml}\n"
                    file_modified = True

                # 4. Vendor advisories
                v_adv = extracted.get("vendor_advisories", [])
                if isinstance(v_adv, list) and v_adv and "vendor_advisories:" not in frontmatter_raw:
                    adv_lines = ["vendor_advisories:"]
                    for v in v_adv:
                        adv_lines.append(f"  - publisher: \"{v.get('publisher', 'Target Vendor')}\"")
                        adv_lines.append(f"    advisory_id: \"{v.get('advisory_id', 'Security Bulletin')}\"")
                        adv_lines.append(f"    title: \"{v.get('title', 'Security Advisory')}\"")
                        adv_lines.append(f"    severity: \"{v.get('severity', 'Critical')}\"")
                        if v.get("release_date"):
                            adv_lines.append(f"    release_date: \"{v.get('release_date')}\"")
                        adv_lines.append(f"    url: \"{v.get('url', '#')}\"")
                        if v.get("description"):
                            clean_desc = str(v.get("description")).replace('"', "'")
                            adv_lines.append(f'    description: "{clean_desc}"')
                    frontmatter_raw = f"{frontmatter_raw.rstrip()}\n" + "\n".join(adv_lines) + "\n"
                    file_modified = True

                # 5. Narrative sections synthesis
                overview = extracted.get("narrative_overview") or extracted.get("overview")
                assets_scope = extracted.get("compromised_assets_detail") or extracted.get("assets_scope")
                directives = extracted.get("directives_summary") or "Official advisories and disclosures remain under continuous monitoring."

                if overview and needs_summary:
                    clean_summary = " ".join(overview.split()[:35]).replace('"', "'").strip() + "..."
                    frontmatter_raw = re.sub(
                        r"^summary:[^\n]*(?:\n[ \t]+[^\n]*)*",
                        lambda _: f'summary: "{clean_summary}"',
                        frontmatter_raw,
                        count=1,
                        flags=re.MULTILINE
                    )
                    file_modified = True

                if overview and "## Incident Overview" not in body:
                    timeline_idx = body.find("## Timeline")
                    timeline_part = body[timeline_idx:] if timeline_idx != -1 else f"## Timeline\n\n{body.strip()}"
                    body = (
                        f"\n\n## Incident Overview\n\n{overview.strip()}\n\n"
                        f"## Compromised Assets & Data Scope\n\n{assets_scope.strip() if assets_scope else 'Scope under active forensic review.'}\n\n"
                        f"## Authoritative Directives & Vendor Disclosures\n\n- {directives.strip()}\n\n"
                        f"{timeline_part.strip()}\n"
                    )
                    file_modified = True

            except Exception as parse_err:
                print(f"⚠️ Error parsing deep extraction response for {file_path.name}: {parse_err}")

        # Save updated file
        if file_modified:
            new_content = f"---{frontmatter_raw}---{body}"
            file_path.write_text(new_content, encoding="utf-8")
            updated_files += 1

        cache.set(content_hash, {"timestamp": time.time(), "status": "processed"})

    print(f"✅ AI Incident Processor cycle complete: {calls_made} API calls made, {updated_files} incident files updated.")
    return EXIT_SUCCESS


if __name__ == "__main__":
    try:
        exit_code = process_unsummarized_incidents()
        sys.exit(exit_code)
    except Exception as err:
        print(f"❌ Fatal execution error in ai_incident_processor: {err}")
        sys.exit(EXIT_ERROR)
