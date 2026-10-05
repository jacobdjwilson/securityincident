#!/usr/bin/env python3
"""
Operational Purpose:
    Automated CI release gate that validates repository code integrity, script docstrings,
    JSON artifact schemas, and AI prompt formatting in under 1 minute without external dependencies.

Required Environment Variables:
    None.

Outputs:
    None (Standard exit code 0 on pass, exit code 1 with actionable diagnostic logs on failure).

JSON Artifact Dependencies:
    .github/artifacts/workflow-config.json
    .github/artifacts/ai-models.json
    .github/artifacts/incident-categories.json
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CONFIG_DIR = ROOT_DIR / ".github" / "artifacts"
PROMPTS_DIR = ROOT_DIR / ".github" / "ai-prompts"
SCRIPTS_DIR = ROOT_DIR / ".github" / "scripts"

EXIT_SUCCESS = 0
EXIT_ERROR = 1


def verify_json_artifacts() -> List[str]:
    """Validates that all JSON configuration artifacts in .github/artifacts/ are valid and self-documenting."""
    errors = []
    if not CONFIG_DIR.exists():
        return [f"Directory {CONFIG_DIR} does not exist."]

    json_files = list(CONFIG_DIR.glob("*.json"))
    if not json_files:
        return [f"No JSON artifacts found in {CONFIG_DIR}."]

    for jf in json_files:
        try:
            with open(jf, "r", encoding="utf-8") as f:
                data = json.load(f)
            if not isinstance(data, dict):
                errors.append(f"{jf.name}: Root JSON element must be an object/dict.")
            if "_comment" not in data and "comment" not in data:
                errors.append(f"{jf.name}: Missing self-documenting '_comment' attribute.")
        except json.JSONDecodeError as err:
            errors.append(f"{jf.name}: Invalid JSON syntax: {err}")
        except Exception as err:
            errors.append(f"{jf.name}: Could not read artifact: {err}")

    return errors


def verify_ai_prompts() -> List[str]:
    """Validates that all AI instruction sets in .github/ai-prompts/ adhere to standardized prompt architecture."""
    errors = []
    if not PROMPTS_DIR.exists():
        return [f"Directory {PROMPTS_DIR} does not exist."]

    prompt_files = list(PROMPTS_DIR.glob("*.md"))
    if not prompt_files:
        return [f"No AI prompt markdown files found in {PROMPTS_DIR}."]

    for pf in prompt_files:
        try:
            content = pf.read_text(encoding="utf-8")
            if not re.search(r"^#\s+AI Instruction Set for\s+", content, re.MULTILINE):
                errors.append(f"{pf.name}: Missing required H1 '# AI Instruction Set for <Task Name>'.")
            if "## Purpose" not in content:
                errors.append(f"{pf.name}: Missing required '## Purpose' section.")
            if "## Goals" not in content:
                errors.append(f"{pf.name}: Missing required '## Goals' section.")
            if not re.search(r"##\s+(?:Instructions|Extraction Instructions|Conversion Instructions)", content):
                errors.append(f"{pf.name}: Missing required '## Instructions' section.")
            if "## Verification and Quality Assurance" not in content:
                errors.append(f"{pf.name}: Missing required '## Verification and Quality Assurance' section.")
            if "---" not in content:
                errors.append(f"{pf.name}: Missing runtime sentinel delimiter '---'.")
        except Exception as err:
            errors.append(f"{pf.name}: Could not read prompt file: {err}")

    return errors


def verify_python_scripts() -> List[str]:
    """Validates that all Python scripts in .github/scripts/ declare the 4 required docstring sections."""
    errors = []
    if not SCRIPTS_DIR.exists():
        return [f"Directory {SCRIPTS_DIR} does not exist."]

    py_files = list(SCRIPTS_DIR.glob("*.py"))
    for py_file in py_files:
        try:
            content = py_file.read_text(encoding="utf-8")
            # Compile check
            compile(content, str(py_file), "exec")

            # Docstring verification
            docstring_match = re.search(r'"""(.*?)"""', content, re.DOTALL)
            if not docstring_match:
                errors.append(f"{py_file.name}: Missing module docstring.")
                continue

            docstring = docstring_match.group(1)
            required_sections = [
                "Operational Purpose:",
                "Required Environment Variables:",
                "Outputs:",
                "JSON Artifact Dependencies:"
            ]
            for section in required_sections:
                if section not in docstring:
                    errors.append(f"{py_file.name}: Docstring missing required section '{section}'.")

            # Entrypoint verification
            if 'if __name__ == "__main__":' not in content:
                errors.append(f"{py_file.name}: Missing standardized entrypoint 'if __name__ == \"__main__\":'.")

        except SyntaxError as syn_err:
            errors.append(f"{py_file.name}: Python syntax error: {syn_err}")
        except Exception as err:
            errors.append(f"{py_file.name}: Could not verify script: {err}")

    return errors


def main() -> int:
    print("🔍 Running Agent Architecture & Code Integrity Release Gate...")

    all_errors = []

    json_errs = verify_json_artifacts()
    all_errors.extend(json_errs)
    if json_errs:
        print(f"❌ JSON Artifact Violations ({len(json_errs)}):")
        for e in json_errs:
            print(f"   • {e}")
    else:
        print("✅ JSON configuration artifacts verified (.github/artifacts/).")

    prompt_errs = verify_ai_prompts()
    all_errors.extend(prompt_errs)
    if prompt_errs:
        print(f"❌ AI Prompt Architecture Violations ({len(prompt_errs)}):")
        for e in prompt_errs:
            print(f"   • {e}")
    else:
        print("✅ AI prompt instruction sets verified (.github/ai-prompts/).")

    script_errs = verify_python_scripts()
    all_errors.extend(script_errs)
    if script_errs:
        print(f"❌ Script Architecture Violations ({len(script_errs)}):")
        for e in script_errs:
            print(f"   • {e}")
    else:
        print("✅ Python script architecture verified (.github/scripts/).")

    if all_errors:
        print(f"\n❌ Code integrity release gate failed with {len(all_errors)} violation(s).")
        return EXIT_ERROR

    print("\n🎉 All integrity checks passed successfully (0 violations).")
    return EXIT_SUCCESS


if __name__ == "__main__":
    sys.exit(main())
