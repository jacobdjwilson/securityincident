# securityincident.net

> **A neutral, high-signal index of security incident statuses and verifiable milestone timelines, powered by open weights correlation and community-driven GitHub PR editing.**

Visit the live site: [securityincident.net](https://securityincident.net)

---

## 🎯 Our Philosophy: Neutral Intelligence Through Open Curation

We provide a reliable and neutral source of cybersecurity intelligence by curating security data across its entire lifecycle, ranging from early rumors to formal regulatory filings. 

To deliver maximum clarity, we establish clear levels of confidence and correlate diverse data sources using open weights. Built entirely on open editing through GitHub pull requests, **securityincident.net** empowers security professionals, researchers, and organizations to maintain a transparent, verifiable, and high-signal record of security incidents without corporate bias or editorial filler.

---

## 🚦 The 5 Observable Statuses

| Status | Badge | Color | Description | Primary Sources |
| :--- | :--- | :---: | :--- | :--- |
| **Confirmed** | `CONFIRMED` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach portals (CA, WA, OR), HHS OCR healthcare disclosures, formal press releases. |
| **Acknowledged** | `ACKNOWLEDGED` | 🟡 Yellow | Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss. | Target status pages, banner notices, initial press replies. |
| **Developing** | `DEVELOPING` | 🟠 Orange | Corroborated intelligence: independent researchers verify samples or observable outages align with claims. | Independent technical telemetry, sample schema audits. |
| **Emerging** | `EMERGING` | 🔴 Red | Early threat actor claims, dark web extortion blogs, or unverified community chatter before target comment. | Dark web ransomware leak sites, extortion blogs, threat actor forum posts. |
| **Refuted** | `REFUTED` | 🔘 Gray | Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach. | Target verification, HaveIBeenPwned research, researcher audits. |

---

## ⚖️ Open Weights Correlation Engine

Unlike opaque proprietary risk ratings, **securityincident.net** computes confidence scores deterministically using open weights defined in [`sources/weights.json`](sources/weights.json) and executed via [`scripts/weights.js`](scripts/weights.js):

* **Base Verification Tier:**
  * 🟢 `CONFIRMED BY REGULATOR`: **1.00 (100%)** — SEC Form 8-K Item 1.05, State AG breach portals (CA DOJ, WA AG, OR DOJ), HHS OCR breach records.
  * 🟢 `CONFIRMED BY TARGET`: **0.90 (90%)** — Target press releases, security advisories, status page bulletins.
  * 🟠 `INDEPENDENT VERIFICATION`: **0.65 (65%)** — Forensic research, HaveIBeenPwned audit, technical sample analysis.
  * 🟡 `ACKNOWLEDGED`: **0.45 (45%)** — Target publicly confirms disruption or investigation without breach admission.
  * 🔴 `UNVERIFIED CLAIM`: **0.20 (20%)** — Dark web leak sites, extortion blogs, community chatter.
  * 🔘 `REFUTED`: **0.00 (0%)** — Proven false alarm, recycled historical leak, or mislabeled web scrape.
* **Machine-Readable Syndication:** Real-time verifiable feeds available in standard [RSS 2.0 (`dist/feed.xml`)](feed.xml) and [JSON Feed v1.1 (`dist/feed.json`)](feed.json) with full milestone timelines and Open Weights confidence metrics.

---

## 🏛️ High-Value Flat-File Intelligence Architecture

Rather than merely linking to external third-party articles or serving superficial 1-line stubs, **securityincident.net** stores complete, self-contained forensic dossiers directly in Git-tracked flat Markdown files:

* **⚡ 100% Git-Native & Flat Files (Zero Database):**
  * Every incident is an auditable, transparent Markdown file in `incidents/YYYY-MM-<target-slug>.md`.
  * Security analysts, researchers, and automation scripts can clone the repo and immediately grep, query, or audit the dataset using standard POSIX and Git tooling.
* **🔍 Rich Forensic Frontmatter:**
  * **Target Classification:** Proper organization name, primary domain, and standardized industry sector (`Healthcare`, `Financial Services`, `Technology`, `Legal`, etc.).
  * **Forensic Taxonomy:** Specific incident classification (`Ransomware Extortion`, `Unauthorized Cloud Access`, `Third-Party Vendor Compromise`, `Credential Stuffing`, `Zero-Day Exploitation`, `Network Intrusion & Data Exfiltration`).
  * **Attributed Threat Actor:** Threat group attribution when corroborated (e.g. `ShinyHunters`, `RansomHub`, `Akira`, `LockBit 3.0`) or neutral unattributed labeling.
  * **Quantified Scope:** Disclosed affected records/individual count.
  * **Compromised Data Categories:** Granular asset tags (`Social Security Numbers (SSNs)`, `Protected Health Information (PHI)`, `Banking Details`, `Customer Call Records`, etc.).
  * **Statutory Regulatory Filings:** Direct references to formal SEC Form 8-K Item 1.05 accession numbers, State Attorney General breach notices, and HHS OCR records with direct links.
* **📑 Structured Technical Dossiers:**
  * `## Incident Overview`: Narrative forensic briefing of the event, vector, and operational disruption.
  * `## Compromised Assets & Data Scope`: Concrete breakdown of exposed assets, systems impacted, and threat risk.
  * `## Statutory Disclosures & Compliance`: Itemized record of statutory filings and regulatory monitoring.
  * `## Timeline`: Chronological milestones with verification tiers and direct primary source links.
* **📊 Data-Driven Telemetry Dashboard & Forensic UI:**
  * **Disclosed Impact Metric:** Aggregate real-time counter of total cumulative impacted records and confirmed disclosure scopes.
  * **Forensic Filtering Controls:** Instant filtering by Sector dropdown, Compromised Data Class dropdown, and quick High-Impact toggle (>100K records).
  * **Sorting Capabilities:** Instant client-side sorting by Latest Update, Highest Impact (Records), Highest Confidence, First Seen, and Most Milestones.
  * 4 interactive charts (Status breakdown, Ingestion velocity timeline, Primary regulatory sources, Targeted sectors).
  * Dual view modes: High-density interactive cards and dense triage telemetry table.
  * Instant zero-latency search across target names, domains, industries, attack vectors, compromised data, and threat actors.
  * Client-side responsive pagination (20, 50, 100 items per page).

---

## 📁 Repository Structure

```
securityincident/
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Deploys dist/ to GitHub Pages on push to main
│       ├── validate-pr.yml            # Validates incident schemas, feeds & build on PRs
│       └── ingest.yml                 # Automated 6-stage raw ingestion & PR proposing
├── incidents/                         # Flat Markdown intelligence dossiers (1 file per incident)
│   ├── 2026-07-river-financial.md
│   ├── 2026-09-at-t.md
│   ├── 2026-09-crowdstrike.md
│   ├── 2026-09-greenberg-traurig.md
│   └── ...
├── sources/
│   ├── feeds.json                     # Active regulatory & investigative feed sources
│   └── weights.json                   # Open Weights confidence model configuration
├── scripts/
│   ├── build.js                       # SSG: outputs dist/ (HTML, search index, RSS 2.0 feed)
│   ├── weights.js                     # Deterministic Open Weights correlation scoring engine
│   ├── validate.js                    # Comprehensive schema, milestone & RSS validator (npm test)
│   ├── ingest.js                      # 6-stage raw feed aggregator & regulatory poller
│   ├── ingest-history.js              # Historical data populator with rate-limiting & reconciliation
│   ├── reconcile-enrichment.js        # Downstream cross-checking & forensic reconciliation engine
│   ├── regulatory/
│   │   ├── sec-edgar.js               # SEC EDGAR Form 8-K Item 1.05 EFTS client
│   │   ├── state-ag.js                # Multi-state breach notification scrapers (CA, WA, OR)
│   │   ├── hhs-ocr.js                 # HHS OCR federal healthcare breach syndication
│   │   └── darkweb.js                 # Real-time dark web extortion & ransomware disclosures
│   └── serve.js                       # Local lightweight HTTP preview server
├── src/
│   └── public/
│       ├── style.css                  # High-density dual-mode SOC telemetry CSS (zero-dependency)
│       ├── app.js                     # Instant client-side search, filtering, table toggle & pagination
│       └── fontawesome.js             # FontAwesome icon bundle
├── ARCHITECTURE.md                    # Architectural and technical specification
├── CONTRIBUTING.md                    # Guide for proposing incidents & milestones via PR
├── package.json
└── README.md
```

---

## 🛠️ Contributing an Incident or Milestone

To add or update an incident, you don't need a database login or admin credentials—**all updates happen via GitHub Pull Requests!**

### 2 Ways to Contribute
1. **Direct In-Browser (No Git Required):** On [securityincident.net](https://securityincident.net), open any incident page and click **"Propose Update via GitHub →"** at the bottom. Use GitHub's web editor (✎) to add your milestone and click **"Propose changes"** to automatically open a PR!
2. **Local CLI Workflow:** Fork the repository, add/modify files in `incidents/`, test with `npm run build`, and open a Pull Request.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed schema rules, verification standards, and guidelines.

### Standard Incident Markdown Schema
Create a new file in `incidents/` following the naming convention `YYYY-MM-<target-slug>.md`:

```markdown
---
id: "2026-09-target-slug"
target: "Organization Name"
domain: "target.com"
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
first_seen: "2026-09-12"
last_updated: "2026-09-15"
summary: "1-2 sentence high-signal executive forensic summary of the incident."
tags:
  - "regulatory"
  - "sec-8k"
  - "healthcare"
---

## Incident Overview

Detailed technical briefing describing the target profile, discovery vector, operational disruption, and response actions.

## Compromised Assets & Data Scope

- Breakdown of exposed systems, databases, and sensitive PII/PHI categories.

## Statutory Disclosures & Compliance

- Statutory filings submitted to federal/state regulators and status of notifications.

## Timeline

### YYYY-MM-DD HH:MM UTC
- **Event:** Single-sentence description of the verified milestone.
- **Verification:** CONFIRMED BY REGULATOR # or CONFIRMED BY TARGET, INDEPENDENT VERIFICATION, UNVERIFIED CLAIM, REFUTED
- **Source:** [Filing / Proof Link](https://example.com)
```

---

## 💻 Local Development & Telemetry Tooling

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Validate schemas and milestone integrity:**
   ```bash
   npm test
   ```

3. **Build the static site and RSS feed:**
   ```bash
   npm run build
   ```

4. **Run downstream forensic reconciliation audit:**
   ```bash
   npm run reconcile
   ```

5. **Execute multi-source live ingestion:**
   ```bash
   npm run ingest
   ```

6. **Start local preview server:**
   ```bash
   npm run serve
   # Or run build + serve together:
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. (The live RSS 2.0 telemetry feed is served at `http://localhost:3000/feed.xml`).

---

## 🚀 Deployment

The site is built as purely static HTML/CSS/JS and deployed directly to **GitHub Pages** via the included [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To activate on GitHub:
1. Go to repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. Push to `main` branch to trigger the build.

