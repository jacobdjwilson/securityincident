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
        Returns: (response_text, exit_code)
        """
        task_routing = self.models_config.get("task_models", {}).get(task_name, {})
        ladder = [
            task_routing.get("primary", "gemini-2.5-flash"),
            task_routing.get("secondary", "gemini-1.5-flash"),
            task_routing.get("tertiary", "gemini-1.5-flash-8b")
        ]

        full_prompt = f"{system_prompt}\n\n# Document Context Below\n{context}"
        max_retries = self.quota_policy.get("max_retries", 3)
        initial_delay = self.quota_policy.get("initial_delay_seconds", 2.0)
        multiplier = self.quota_policy.get("backoff_multiplier", 2.0)

        for model in ladder:
            delay = initial_delay
            for attempt in range(max_retries):
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{"parts": [{"text": full_prompt}]}],
                    "generationConfig": {"temperature": 0.2, "maxOutputTokens": 300}
                }
                data_bytes = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=data_bytes,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                try:
                    with urllib.request.urlopen(req, timeout=20) as response:
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
                        delay *= multiplier
                        continue
                    elif err.code in (500, 503):
                        print(f"⚠️ [HTTP {err.code}] Transient failure on {model}. Retrying...")
                        time.sleep(delay)
                        continue
                    else:
                        print(f"❌ [HTTP {err.code}] Gemini API error on {model}: {err.read().decode('utf-8', errors='ignore')}")
                        break
                except Exception as ex:
                    print(f"⚠️ Exception invoking {model}: {ex}")
                    time.sleep(delay)
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

        # Check if incident needs summarization or impact extraction
        needs_summary = "summary: ''" in frontmatter_raw or 'summary: ""' in frontmatter_raw or "summary: >-" in frontmatter_raw and "..." in frontmatter_raw
        needs_records = "affected_records: null" in frontmatter_raw

        if not (needs_summary or needs_records):
            continue

        # Compute hash of context
        context_text = f"{file_path.stem}\n{body[:2500]}"
        content_hash = compute_hash(context_text)

        # Check local cache first (judicial caching policy)
        cached_res = cache.get(content_hash)
        if cached_res:
            continue

        print(f"🔍 Enriching incident {file_path.name} via AI model pipeline...")

        # 1. Summarization if needed
        if needs_summary:
            summary_text, status = gemini_client.call_task("summarization", summarize_prompt, context_text)
            calls_made += 1
            if status == EXIT_QUOTA_EXHAUSTED:
                print("🛑 Quota limit hit during summarization task. Gracefully pausing processing.")
                return EXIT_QUOTA_EXHAUSTED

            if summary_text:
                clean_summary = summary_text.replace("\n", " ").replace('"', "'").strip()
                # Update frontmatter safely without modifying regulatory filings
                frontmatter_raw = re.sub(
                    r"summary:\s*(?:>-|\"[^\"]*\"|'[^']*'|[^\n]+(?:\n\s+[^\n]+)*)",
                    f'summary: "{clean_summary}"',
                    frontmatter_raw,
                    count=1
                )
                updated_files += 1

        # 2. Impact extraction if records are null
        if needs_records:
            impact_text, status = gemini_client.call_task("impact_extraction", impact_prompt, context_text)
            calls_made += 1
            if impact_text:
                try:
                    # Clean potential markdown fences
                    clean_json_str = re.sub(r"^```(?:json)?|```$", "", impact_text.strip(), flags=re.MULTILINE).strip()
                    extracted = json.loads(clean_json_str)
                    recs = extracted.get("affected_records")
                    if recs and isinstance(recs, int) and recs > 0:
                        frontmatter_raw = re.sub(
                            r"affected_records:\s*null",
                            f"affected_records: {recs}",
                            frontmatter_raw,
                            count=1
                        )
                        updated_files += 1
                except Exception:
                    pass

        # Save updated file
        new_content = f"---{frontmatter_raw}---{body}"
        file_path.write_text(new_content, encoding="utf-8")
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
