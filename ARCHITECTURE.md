# securityincident.net - Architecture & Technical Specification

> **Mission:** A neutral, high-signal index of security incident statuses and verifiable milestone timelines, powered by open weights correlation and community-driven GitHub PR editing.

---

## 1. Core Principles & Philosophy

### Core Principles
1. **Neutral Intelligence Through Open Curation:** We provide a reliable and neutral source of cybersecurity intelligence by curating security data across its entire lifecycle, ranging from early rumors to formal regulatory filings.
2. **Open Weights Correlation & Community PR Editing:** To deliver maximum clarity, we establish clear levels of confidence and correlate diverse data sources using open weights. Built entirely on open editing through GitHub pull requests, we empower security professionals, researchers, and organizations to maintain a transparent, verifiable, and high-signal record of security incidents without corporate bias or editorial filler.
3. **Status & Timeline Over Speculative Categorization:** Security incident classifications change constantly during an investigation. Instead of speculative types, we track the observable ground truth of what has been claimed, acknowledged, or officially confirmed.
4. **100% Git-Native & Flat Files:** Zero databases. All data lives in `incidents/*.md` as plain Markdown with YAML frontmatter. Every update is tracked with Git history, auditable, and PR-friendly.
5. **Zero-Cost & Serverless Hosting:** Built statically and deployed to **GitHub Pages** via **GitHub Actions**.

### Non-Goals
* No complex SQL or NoSQL databases.
* No speculative tracking of internal mitigation/remediation unless officially documented in primary sources.
* No editorial bloat or unverified re-blogging.

---

## 2. Status & Verification Model

### Macro Incident Statuses (5-Tier Telemetry Model)
Every incident is categorized into exactly one of five top-level ground-truth statuses:

```
[ 🔴 EMERGING ] ──> [ 🟠 DEVELOPING ] ──> [ 🟡 ACKNOWLEDGED ] ──> [ 🟢 CONFIRMED ]
       │                     │                      │
       └─────────────────────┴──────────────────────┴─────────> [ 🔘 REFUTED ]
```

| Status | Badge | Color | Description | Primary Sources |
| :--- | :--- | :---: | :--- | :--- |
| **Confirmed** | `CONFIRMED` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach portals, formal press releases. |
| **Acknowledged** | `ACKNOWLEDGED` | 🟡 Yellow | Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss. | Target status pages, banner notices, initial press replies. |
| **Developing** | `DEVELOPING` | 🟠 Orange | Corroborated intelligence: independent researchers verify samples or observable outages align with claims. | Independent technical telemetry, sample schema audits. |
| **Emerging** | `EMERGING` | 🔴 Red | Early threat actor claims, dark web forum leaks, or unverified community chatter before target comment. | Threat actor leak blogs, dark web forums, social tips. |
| **Refuted** | `REFUTED` | 🔘 Gray | Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach. | Target verification, HaveIBeenPwned research, researcher audits. |

### Milestone Verification Badges
Each milestone entry in the timeline is labeled with its verification level:
* `CONFIRMED BY REGULATOR` (🟢 Green): SEC Form 8-K, State Attorney General notice, HHS breach portal, CISA advisory.
* `CONFIRMED BY TARGET` (🟢 Green / Teal): Target press release, official blog post, status page.
* `INDEPENDENT VERIFICATION` (🟠 Orange): Independent researcher or news outlet verifying data validity.
* `UNVERIFIED CLAIM` (🔴 Red): Threat actor leak post, breach forum listing, anonymous leak.
* `REFUTED` (🔘 Gray): Explicitly disproven or denied with evidence.

---

## 3. Open Weights Mathematical Correlation Model

Unlike opaque proprietary risk ratings, `securityincident.net` relies on an open-source, deterministic mathematical correlation model configured in [`sources/weights.json`](sources/weights.json) and executed via [`scripts/weights.js`](scripts/weights.js).

### Composite Confidence Score Formula

The confidence score $C$ for any incident is calculated as:

$$C = \min\left(1.00, \max\left(0.00, W_{\text{base}} + B_{\text{corroboration}}\right)\right)$$

Where:
* **$W_{\text{base}}$** is the highest verification tier achieved across all logged milestones:
  * `CONFIRMED BY REGULATOR`: $1.00$ ($100\%$)
  * `CONFIRMED BY TARGET`: $0.90$ ($90\%$)
  * `INDEPENDENT VERIFICATION`: $0.65$ ($65\%$)
  * `ACKNOWLEDGED`: $0.45$ ($45\%$)
  * `UNVERIFIED CLAIM`: $0.20$ ($20\%$)
  * `REFUTED`: $0.00$ ($0\%$)
* **$B_{\text{corroboration}}$** is the cross-domain corroboration bonus awarded when multiple independent domains verify or report on the incident:

$$B_{\text{corroboration}} = \min\left(0.15, \max\left(0, (N_{\text{domains}} - 1) \times 0.05\right)\right)$$

Where $N_{\text{domains}}$ is the count of unique, independent hostnames among all cited primary source URLs (e.g., `sec.gov`, `bleepingcomputer.com`, `thehackernews.com`).

---

## 4. Flat File Specification (`incidents/<id>.md`)

Every incident is stored as a standalone Markdown file inside `/incidents/`.

### File Naming Convention
`YYYY-MM-<target-slug>.md` (e.g., `2026-07-river-financial.md`, `2026-09-citrix.md`)

### Schema Structure
```markdown
---
id: "2026-07-river-financial"
target: "River Financial"
domain: "riverbankandtrust.com"
status: "CONFIRMED" # EMERGING | DEVELOPING | ACKNOWLEDGED | CONFIRMED | REFUTED
first_seen: "2026-07-06"
last_updated: "2026-07-30"
threat_actor: null # Optional or threat actor string
summary: "River Financial Corporation disclosed an unauthorized network intrusion into its banking network involving corporate data exfiltration."
tags:
  - "regulatory"
  - "sec-8k"
  - "banking"
  - "confirmed"
---

## Timeline

### 2026-07-06 17:15 UTC
- **Event:** SEC Form 8-K Item 1.05 Initial Disclosure: River Financial detects unauthorized network intrusion and begins forensic investigation.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-295704)](https://www.sec.gov/Archives/edgar/data/1641601/000119312526295704/0001193125-26-295704-index.htm)
```

---

## 5. Technical Architecture & Ingestion

```
securityincident/
├── .github/
│   └── workflows/
│       ├── deploy.yml         # Builds static site & deploys to GitHub Pages on push to main
│       ├── validate-pr.yml    # Validates schemas, milestones & build on PRs
│       └── ingest.yml         # Scheduled cron polling for SEC 8-Ks & multi-state AG notices
├── incidents/                 # Flat Markdown database (1 file per incident)
│   ├── 2026-07-river-financial.md
│   ├── 2026-09-at-t.md
│   ├── 2026-09-crowdstrike.md
│   ├── 2026-09-greenberg-traurig.md
│   └── ...
├── sources/
│   ├── feeds.json             # Curated regulatory & threat intelligence feed sources
│   └── weights.json           # Open Weights deterministic confidence scoring weights
├── scripts/
│   ├── build.js               # Static generator: outputs dist/ (HTML, search index, RSS 2.0)
│   ├── weights.js             # Deterministic Open Weights correlation calculation engine
│   ├── enrich-incidents.js    # Data upgrade engine for forensic frontmatter & narrative dossiers
│   ├── validate.js            # Automated incident schema, milestone & RSS compliance validator
│   ├── ingest.js              # Real-time threat feed & SEC 8-K aggregator
│   ├── ingest-history.js      # Historical data populator with rate-limiting
│   ├── regulatory/
│   │   ├── sec-edgar.js       # SEC EDGAR Form 8-K Item 1.05 EFTS client
│   │   └── state-ag.js        # Multi-state breach notification portal scrapers
│   └── serve.js               # Local lightweight HTTP preview server
├── src/
│   └── public/                # CSS, client-side JS, favicon, web assets
│       ├── style.css          # Vanilla CSS (dual-mode dark/light, high-density telemetry, responsive)
│       ├── app.js             # Client-side filtering, instant search, sorting, charts & pagination
│       └── fontawesome.js     # FontAwesome icon bundle
├── images/                    # Brand assets (logos, favicons, COLOR.md, BRANDING.md)
├── package.json               # Build scripts and minimal dependencies (gray-matter, marked)
└── README.md
```

### Rate Considerations & Network Politeness
All automated ingest scripts adhere to strict network politeness rules:
1. **Request Delays:** Minimum 1200ms delay between consecutive HTTP requests.
2. **Identification:** User-Agent explicitly identifies the crawler: `securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)`.
3. **Stateless Deduplication:** URLs across all markdown records are pre-indexed before ingestion to eliminate redundant network overhead and avoid duplicate milestones.

---

## 6. High-Value Flat-File Intelligence Specification

Rather than merely linking to external third-party articles or serving superficial stubs, `securityincident.net` stores complete, self-contained forensic dossiers directly in Git-tracked flat Markdown files:

### 1. Granular Structured Metadata
* **Industry / Sector:** Standardized taxonomy (`Healthcare`, `Financial Services`, `Technology`, `Legal`, `Retail & Consumer Goods`, `Manufacturing & Construction`, `Transportation & Logistics`, `Government & Public Sector`, `Education & Research`).
* **Incident Classification:** Explicit attack vector (`Ransomware Extortion`, `Unauthorized Cloud Access`, `Third-Party Vendor Compromise`, `Credential Stuffing Attack`, `Zero-Day Vulnerability Exploitation`, `Business Email Compromise`).
* **Attributed Threat Actor:** Threat group identification when corroborated (e.g. `ShinyHunters`, `RansomHub`, `Akira`, `LockBit 3.0`) or neutral attribution labeling.
* **Affected Population Scope:** Disclosed number of impacted individuals or systems.
* **Compromised Asset Categories:** Specific exposed data categories (e.g. `Social Security Numbers (SSNs)`, `Protected Health Information (PHI)`, `Banking Details`, `Call Detail Records (CDRs)`).
* **Statutory Regulatory Filings:** Direct references to formal SEC Form 8-K Item 1.05 accession numbers, State Attorney General breach notices, and HHS OCR records with direct links.

### 2. Forensic Markdown Dossiers
Each flat file in `incidents/` includes structured technical narrative sections:
* `## Incident Overview`: Objective briefing detailing organizational footprint, root cause, and disruption.
* `## Compromised Assets & Data Scope`: Itemized breakdown of exposed systems and threat risk.
* `## Statutory Disclosures & Compliance`: Chronological log of regulatory filings and notifications.
* `## Timeline`: Verifiable milestones with timestamps, verification badges, and primary source links.

### 3. High-Density Telemetry & Client-Side Interactivity
* **Interactive Trend Charts:** Pure CSS/JS telemetry charts (Status distribution, monthly velocity, primary regulatory sources, targeted sectors) with click-to-filter capability.
* **Dual View Presentation:** High-density incident cards and ultra-dense triage table with sortable columns.
* **Instant Client-Side Search:** Zero-latency fuzzy search across target names, domains, industries, attack vectors, and threat actors.
* **Client-Side Pagination:** Smooth client-side pagination (20, 50, 100 items per page) without page reloads.

---

## 7. Multi-Phase Development Roadmap

### Phase 1: Open Weights Correlation Engine & High-Assurance Telemetry (COMPLETED)
- [x] Defined open-source correlation model in `sources/weights.json`.
- [x] Built deterministic scoring engine in `scripts/weights.js`.
- [x] High-density telemetry cards with visual confidence meters and source counts.
- [x] Dedicated Open Weights Telemetry breakdown component on detail pages.
- [x] Client-side sorting controls in `src/public/app.js` (Sort by: Latest Update, Highest Confidence, First Seen, Most Milestones).
- [x] Populated 90 days of security incident data across July - September 2026.
- [x] Dual-mode Vanilla CSS styling for dark SOC mode and light analyst mode.

### Phase 2: Automated Ingestion & Regulatory Pipelines (COMPLETED)
- [x] Scheduled SEC EDGAR Form 8-K Item 1.05 EFTS polling (`scripts/regulatory/sec-edgar.js` & `.github/workflows/ingest.yml`).
- [x] Multi-State Attorney General data breach portal scrapers (`scripts/regulatory/state-ag.js` for California DOJ SB-24 and Washington State AG RCW 19.255 statutory disclosures).
- [x] Canonical entity resolution across historical months (`findExistingIncidentFilePath` in `scripts/ingest.js`).
- [x] Automated PR proposing workflow for verified regulatory disclosures (`.github/workflows/ingest.yml`).
- [x] Rate limiting (1200ms delay), HTTP 304 conditional cache validation, and User-Agent identification.

### Phase 3: High-Value Flat-File Intelligence & Trend Telemetry (COMPLETED)
- [x] Comprehensive flat-file data upgrade across all 117 incident files with rich forensic frontmatter (`industry`, `incident_type`, `threat_actor`, `affected_records`, `compromised_data`, `regulatory_filings`).
- [x] Full technical narrative dossiers (`## Incident Overview`, `## Compromised Assets & Data Scope`, `## Statutory Disclosures & Compliance`, and verifiable `## Timeline`).
- [x] Purged all unrequested features and "AI slop" (markdown badges, fake REST API directories, STIX exports).
- [x] High-density data-driven telemetry dashboard with 4 interactive charts (Status Breakdown, Ingestion Velocity, Regulatory Sources, Targeted Sectors).
- [x] Dense telemetry triage table view with dual-mode toggle (Cards vs Table) and client-side pagination (20, 50, 100 items/page).
- [x] Comprehensive test automation suite in `scripts/validate.js` covering markdown schemas, rich frontmatter fields, milestones, and RSS 2.0 compliance.

### Phase 4: Decentralized Verification & Cryptographic Attribution
- [ ] Signed Git commits for immutable cryptographic attribution of incident milestones.
- [ ] Community-driven weights proposal and vote through GitHub PR governance.
