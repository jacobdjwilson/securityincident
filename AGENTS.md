# AGENTS.md - Development Philosophy & Agent Guidelines

> **Project:** `securityincident.net` (Security Event / Incident Status & Milestone Tracker)  
> **Repository:** A neutral, high-signal index of security incident statuses and verifiable milestone timelines, powered by open weights correlation and community-driven GitHub PR editing.  
> **Audience:** AI Coding Agents & Human Contributors

---

## 1. Project Mission & Identity

**`securityincident.net`** is a neutral, high-signal index tracking the real-time status and verifiable milestone timelines of cybersecurity incidents across the open web.

Modern security incidents are plagued by misinformation, premature categorization, and corporate PR ambiguity. This project provides a reliable and neutral source of cybersecurity intelligence by curating security data across its entire lifecycle, ranging from early rumors to formal regulatory filings.

To deliver maximum clarity, we establish clear levels of confidence and correlate diverse data sources using open weights. Built entirely on open editing through GitHub pull requests, **securityincident.net** empowers security professionals, researchers, and organizations to maintain a transparent, verifiable, and high-signal record of security incidents without corporate bias or editorial filler.

---

## 2. Core Development Philosophy

### I. Neutral Intelligence Through Open Curation
* Curating security data across its entire lifecycle, ranging from early rumors to formal regulatory filings.
* Establishing clear levels of confidence and correlating diverse data sources using open weights without corporate bias or editorial filler.

### II. Status & Timeline Over Speculative Categorization
* In early stages, the "category" or "type" of an incident is almost always inaccurate or fluid. An incident initially announced as an "unplanned IT outage" frequently morphs into an "unauthorized access event," which later becomes a "data exfiltration" or "ransomware extortion."
* We do **not** force incidents into speculative classifications.
* Instead, we index two fundamental ground truths:
  1. **Current Observable Status** (`EMERGING`, `DEVELOPING`, `ACKNOWLEDGED`, `CONFIRMED`, `REFUTED`).
  2. **Chronological Milestone Timeline** with explicit primary-source attribution and verification badges.

### III. 100% Git-Native & Flat Files (Zero Database)
* **Zero Databases:** No SQL, NoSQL, or external database services. The filesystem is the single source of truth.
* All incident data resides in plain Markdown files with YAML frontmatter inside `/incidents/`.
* Every update, status change, and milestone addition is tracked through Git history, making every revision fully auditable, attributable, and open to Pull Requests.

### IV. High-Density Telemetry Aesthetic
* Designed with a professional, dark-mode cybersecurity telemetry aesthetic:
  * Curated color palettes with functional status hues (emerald green, amber orange, crimson red, slate gray).
  * High information density suited for threat intelligence analysts and security engineers.
  * Instant, client-side zero-latency search and status filtering (pure Vanilla JS).
  * Subtle micro-animations, glassmorphic card borders, and clear typographic hierarchy using modern system-first typography.

### V. Source Truth & Verifiability
* We never report unverified rumors as established facts.
* Every milestone in a timeline must have a verification tag and a direct public source link (regulatory filing, official target disclosure, or archived threat actor leak post).

---

## 3. Status & Verification Model

### Macro Incident Statuses (5-Tier Telemetry Model)

| Status | Icon | Color | Description | Primary Sources |
| :--- | :---: | :---: | :--- | :--- |
| **`CONFIRMED`** | `fa-circle-check` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach portals (CA, WA, OR), HHS OCR healthcare disclosures, formal press releases. |
| **`ACKNOWLEDGED`** | `fa-bullhorn` | 🟡 Yellow | Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss. | Target status pages, banner notices, initial press replies. |
| **`DEVELOPING`** | `fa-satellite-dish` | 🟠 Orange | Corroborated intelligence: independent researchers verify samples or observable outages align with claims. | Independent technical telemetry, sample schema audits. |
| **`EMERGING`** | `fa-bolt` | 🔴 Red | Early threat actor claims, dark web extortion blogs, or unverified community chatter before target comment. | Dark web ransomware leak sites, extortion blogs, threat actor forum posts. |
| **`REFUTED`** | `fa-ban` | 🔘 Gray | Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach. | Target verification, HaveIBeenPwned research, researcher audits. |

### Milestone Verification Tiers & Granular Open Weights (v2.0)

Confidence scores are computed deterministically across four orthogonal dimensions (Primary Authority Base, Evidence Specificity, Corroboration Curve, and Temporal Dynamics):

* `CONFIRMED BY REGULATOR` (🟢 Green, Base 0.65): SEC Form 8-K Item 1.05, State Attorney General portal (CA DOJ, WA AG, OR DOJ), HHS OCR breach report, CISA KEV advisory.
* `CONFIRMED BY TARGET` (🟢 Green / Teal, Base 0.50): Target press release, official blog post, status page bulletin.
* `INDEPENDENT VERIFICATION` (🟠 Orange, Base 0.32): Cybersecurity researcher analysis, HaveIBeenPwned audit, reputable investigative reporting.
* `ACKNOWLEDGED` (🟡 Yellow, Base 0.18): Target public confirmation of IT disruption or active investigation.
* `UNVERIFIED CLAIM` (🔴 Red, Base 0.06): Threat actor forum post, leak site listing, unverified community chatter (low baseline floor).
* `REFUTED` (🔘 Gray, Base 0.00): Explicitly disproven with evidence.

#### Multi-Dimensional Scoring Dimensions
1. **Primary Authority Base Floor:** 0.06 to 0.65 base weight depending on top verification tier.
2. **Evidence Specificity Bonus (+0% to +23%):** Statutory regulatory filing on record (+12%), verified primary domain (+3%), disclosed compromised data classes (+4%), and quantified affected records count (+4%).
3. **Corroboration & Multi-Source Curve (+0% to +25%):** Logarithmic scale for independent domains (2 domains: +7%, 3 domains: +12%, 4 domains: +16%, 5+ domains: +20%), plus a +5% cross-tier boost when threat telemetry is corroborated by target or regulator.
4. **Temporal Dynamics & Milestone Depth (-10% to +5%):** Milestone depth (&ge;3: +3%, &ge;5: +5%). Dormant uncorroborated claims decay (-3% at 14d, -5% at 30d).

---

## 4. Repository & File Structure

```
securityincident/
├── .github/
│   ├── artifacts/                     # Versioned JSON configuration artifacts & schemas
│   │   ├── workflow-config.json       # Pipeline cadence, operational thresholds, caching & git config
│   │   ├── ai-models.json             # Task-based AI routing, fallback chains & retry policies
│   │   └── incident-categories.json   # Standardized sector, attack type, and data class taxonomies
│   ├── ai-prompts/                    # Standalone standardized Markdown AI instruction sets
│   │   ├── summarize-incident.md      # Executive briefing instruction set with active verbs
│   │   ├── categorize-incident.md     # Sector, attack type & domain classification schema
│   │   └── extract-impact.md          # Quantified affected records & sensitive data class parser
│   ├── scripts/                       # Standardized Python CI/CD automation & release gate scripts
│   │   ├── ai_incident_processor.py   # Cached, quota-aware AI enrichment preserving regulatory filings
│   │   ├── git_ingest_publisher.py    # Zero-inline branch sync, change check & PR publishing engine
│   │   └── verify_code_integrity.py   # CI release gate validating docstrings, prompts & JSON artifacts
│   └── workflows/
│       ├── deploy.yml                 # GitHub Actions: build & deploy dist/ to GitHub Pages
│       ├── validate-pr.yml            # GitHub Actions: PR validation & build checks
│       └── ingest.yml                 # Automated 6-stage raw ingestion & PR proposing
├── incidents/                         # Dynamic flat-file database (YYYY-MM-<target-slug>.md)
│   └── [Dynamically synchronized incident dossiers via automated ingestion & PRs]
├── sources/
│   ├── feeds.json                     # Curated regulatory & threat intelligence feed sources
│   ├── pipeline-status.json           # Live pipeline sync timestamps and operational telemetry
│   └── weights.json                   # Open Weights deterministic confidence scoring weights
├── scripts/
│   ├── build.js                       # Static generator: outputs dist/ (HTML, search index, RSS 2.0, JSON Feed)
│   ├── weights.js                     # Deterministic Open Weights correlation calculation engine
│   ├── validate.js                    # Automated incident schema, milestone & RSS compliance validator
│   ├── ingest.js                      # 6-stage real-time raw feed & regulatory aggregator
│   ├── ingest-history.js              # Historical data populator with rate-limiting & reconciliation
│   ├── reconcile-enrichment.js        # Downstream cross-checking & forensic reconciliation engine
│   ├── regulatory/
│   │   ├── sec-edgar.js               # SEC EDGAR Form 8-K Item 1.05 EFTS client
│   │   ├── state-ag.js                # Multi-state breach notification scrapers (CA, WA, OR)
│   │   ├── hhs-ocr.js                 # HHS OCR federal healthcare data breach syndication
│   │   └── darkweb.js                 # Real-time dark web extortion & ransomware disclosures
│   └── serve.js                       # Local lightweight HTTP preview server
├── src/
│   └── public/
│       ├── style.css                  # Vanilla CSS dual-mode telemetry styling & export toolbar
│       ├── app.js                     # Vanilla JS search, multi-field filtering & JSON/CSV export
│       └── fontawesome.js             # FontAwesome icon bundle
├── ARCHITECTURE.md                    # Detailed technical specification
├── AGENTS.md                          # Development philosophy & agent working guidelines
├── package.json                       # Minimal dependencies (gray-matter, marked)
└── README.md                          # Project overview & quickstart
```

---

## 5. Incident Markdown Schema Standard

Every incident file in `/incidents/` follows the filename format `YYYY-MM-<target-slug>.md` and contains the following structure:

```markdown
---
id: "YYYY-MM-<target-slug>"
target: "Organization Name"
domain: "organization.com"
status: "CONFIRMED" # EMERGING | DEVELOPING | ACKNOWLEDGED | CONFIRMED | REFUTED
industry: "Healthcare" # Healthcare | Financial Services | Technology | Legal | Retail & Consumer Goods | ...
incident_type: "Ransomware Extortion" # Ransomware Extortion | Unauthorized Cloud Access | Supply Chain | ...
threat_actor: "RansomHub" # Actor name or "Unknown / Unattributed"
affected_records: 125000 # Quantified count or null
compromised_data:
  - "Social Security Numbers (SSNs)"
  - "Protected Health Information (PHI)"
regulatory_filings:
  - regulator: "SEC"
    form: "Form 8-K (Item 1.05)"
    accession_number: "0001193125-26-049812"
    url: "https://www.sec.gov/edgar"
first_seen: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
summary: "1-2 sentence high-signal summary of the event."
tags:
  - "regulatory"
  - "sec-8k"
  - "healthcare"
---

## Incident Overview

Technical briefing describing the target profile, discovery vector, operational disruption, and response actions.

## Compromised Assets & Data Scope

- Breakdown of exposed systems, databases, and sensitive PII/PHI categories.

## Statutory Disclosures & Compliance

- Statutory filings submitted to federal/state regulators and status of notifications.

## Timeline

### YYYY-MM-DD HH:MM UTC
- **Event:** Exact description of the verified milestone.
- **Verification:** CONFIRMED BY REGULATOR # or CONFIRMED BY TARGET, INDEPENDENT VERIFICATION, UNVERIFIED CLAIM, REFUTED
- **Source:** [Primary Source Title](https://example.com/source)
```

---

## 6. Agent Architecture & Coding Standards

To ensure operational resilience, CI/CD predictability, and security across autonomous agent runs, all scripts, configurations, and workflows must strictly adhere to the following architecture standards:

### I. Workflow Architecture & Script Modularity
* **Zero Inline Scripts in Workflows:** GitHub Actions workflows must reference external scripts (e.g. in `.github/scripts/` or `npm run ...`) rather than embedding inline multi-line bash or shell logic.
* **Single Responsibility & Cohesive Modules:** Each script in `.github/scripts/` must fulfill a focused operational domain. Common operational utilities must be unified into cohesive modules with clear CLI arguments (e.g. `git_ingest_publisher.py --sync`, `--check-changes`, `--publish`) rather than sprawling into one-off micro-scripts.
* **Standardized Script Architecture:** All Python scripts in `.github/scripts/` must implement:
  1. **Header & Docstring:** Declare `Operational Purpose:`, `Required Environment Variables:`, `Outputs:`, and `JSON Artifact Dependencies:`.
  2. **Imports:** Standard Library -> Third-party -> Typing.
  3. **Configuration Loader:** Dedicated `ConfigLoader` class loading strictly from `.github/artifacts/` with fail-fast validation.
  4. **Domain Logic:** Modular, type-annotated functions with explicit error handling.
  5. **Standardized Process Entrypoint:** `if __name__ == "__main__":` with clean exit codes (`0`: Success, `1`: Error, `2`: Quota exhaustion/pipeline retry).

### II. Configuration Artifacts & Zero Hardcoding
* **No Hardcoded Values:** Scripts must never hardcode configuration values, timeouts, thresholds, model names, prompt paths, branch names, or API endpoints in script source.
* **Versioned JSON Artifacts:** All configuration must be loaded from JSON artifacts in `.github/artifacts/` (`workflow-config.json`, `ai-models.json`, `incident-categories.json`).
* **Self-Documenting Schemas:** Artifacts must declare `_comment` attributes explaining operational rationale, explicit units (`_seconds`, `_mb`, `_days`, `_limit`), and POSIX path conventions (`/`).

### III. Standalone AI Prompts & Instruction Sets
* **No Inline Prompts:** AI calls must never define prompt strings inline within application source code.
* **Standalone Markdown Prompts:** All instruction sets reside in `.github/ai-prompts/*.md` adhering to the standardized prompt structure:
  1. `# AI Instruction Set for <Task Name>`
  2. `## Purpose`
  3. `## Goals`
  4. `## Instructions` / `## Extraction Instructions` / `## Conversion Instructions`
  5. `## Verification and Quality Assurance`
  6. **Runtime Sentinel:** Horizontal rule `---` followed by a terminal context delimiter.

### IV. Judicial API Quotas, Task Routing & Persistent Caching
* **Persistent SHA-256 Caching:** To prevent quota exhaustion and duplicate processing, all AI calls must be queried against a persistent disk cache (`.cache/ai-cache.json`). Identical raw articles or prompts must never be sent to the API more than once.
* **Task-Based Routing & Fallback Ladders:** Operations route to capable models for complex extraction and high-throughput models for summarization, governed by `.github/artifacts/ai-models.json` with exponential backoff on HTTP 429 (`RESOURCE_EXHAUSTED`).
* **Deterministic Fallback:** When `GEMINI_API_KEY` is not present, scripts must execute graceful deterministic fallback without halting the build.

### V. Regulatory Invariance Standard
* **Regulatory Truth Invariance:** Material statutory filings (SEC Form 8-K Item 1.05, State AG breach portal disclosures, HHS OCR disclosures) are legal ground truths. They must be parsed deterministically and **NEVER** modified, overridden, or synthesized by AI models.

---

## 7. Agent Working Guidelines & Invariants

When contributing to or modifying this codebase, all autonomous agents and human developers MUST adhere to the following rules:

1. **Strict Review Before Commit**:
   * **NEVER** automatically commit or push code to GitHub without explicit review and approval from the repository owner.
   * Always present file diffs and summaries of changes for review prior to staging or committing.

2. **Zero Dependency Bloat**:
   * Do not introduce heavy frontend frameworks (React, Vue, Tailwind, Angular, etc.) into the static client.
   * Keep runtime zero-dependency; use standard Vanilla CSS and Vanilla JS for frontend behavior.
   * Limit build dependencies to minimal, well-maintained tools (`gray-matter`, `marked`).

3. **Validate Builds & Schema Compliance Before Proposing**:
   * Always execute `npm test` and `npm run build` after modifying scripts, styles, workflows, or incident files to verify zero schema violations, clean RSS feed generation, and valid output generation in `dist/`.

4. **Preserve Documentation Integrity**:
   * Maintain cross-references across `README.md`, `ARCHITECTURE.md`, and `AGENTS.md`.
   * Update schema descriptions if new frontmatter fields or milestone verification tiers are added.

5. **Security & Privacy First**:
   * In private development mode, ensure no private API tokens, keys, or sensitive unreleased data are exposed in public workflows or links.
