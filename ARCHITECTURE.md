# securityincident.net - Architecture & Technical Specification

> **Mission:** A lightweight, high-signal, Git-native index of cybersecurity incidents on the open web, focusing strictly on **incident status** (Emerging, Acknowledged, Confirmed, Refuted) and **milestone verification timelines**.

---

## 1. Core Principles & Non-Goals

### Core Principles
1. **Status & Timeline Over Subjective Categorization:** Security incident classifications change constantly during an investigation. Instead of static types, we track the *observable ground truth* of what has been claimed, acknowledged, or officially confirmed.
2. **Open-Web Reality:** We only index publicly observable information (regulatory filings, dark web leak postings, target public statements, official bulletins). We do not speculate on internal containment or recovery.
3. **100% Git-Native & Flat Files:** Zero databases. All data lives in `incidents/*.md` as plain Markdown with YAML frontmatter. Every update is tracked with Git history, auditable, and PR-friendly.
4. **Zero-Cost & Serverless Hosting:** Built statically and deployed to **GitHub Pages** via **GitHub Actions**.
5. **High-Signal, Zero Fluff:** Clean, fast, high-density interface with dark-mode aesthetic. No corporate filler.

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

| Status | Icon | Color | Description | Trigger Event |
| :--- | :---: | :---: | :--- | :--- |
| `EMERGING` | `fa-bolt` | 🔴 Red | Unilateral claim by threat actor, dark web forum listing, or unverified rumor. Target has not responded. | Threat actor leaks sample data, claims victim on extortion site. |
| `DEVELOPING` | `fa-satellite-dish` | 🟠 Orange | Corroborated intelligence: independent researchers verify sample data, or observed outages align with claims before target response. | Independent researcher analysis, sample verification, or telemetry alignment. |
| `ACKNOWLEDGED` | `fa-bullhorn` | 🟡 Yellow | Target publicly reports "an IT disruption" or investigation, but has not confirmed an intrusion or data theft. | Status page alert, banner on company homepage, press statement. |
| `CONFIRMED` | `fa-circle-check` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach notice, company press release. |
| `REFUTED` | `fa-ban` | 🔘 Gray | The claim was proven false, data was recycled/public scraping, or target proved no breach occurred. | Forensic analysis shows data was old dump; threat actor retracts. |

### Milestone Verification Badges
Each milestone entry in the timeline is labeled with its verification level:
* `CONFIRMED BY REGULATOR` (🟢 Green): SEC Form 8-K, State Attorney General notice, HHS breach portal, CISA advisory.
* `CONFIRMED BY TARGET` (🟢 Green / Teal): Target press release, official blog post, status page.
* `INDEPENDENT VERIFICATION` (🟠 Orange): Independent researcher or news outlet verifying data validity.
* `UNVERIFIED CLAIM` (🔴 Red): Threat actor leak post, breach forum listing, anonymous leak.
* `REFUTED` (🔘 Gray): Explicitly disproven or denied with evidence.

---

## 3. Flat File Specification (`incidents/<id>.md`)

Every incident is stored as a standalone Markdown file inside `/incidents/`.

### File Naming Convention
`YYYY-MM-<target-slug>.md` (e.g., `2026-09-crowdstrike.md`)

### Schema Structure
```markdown
---
id: "2026-09-crowdstrike"
target: "CrowdStrike"
domain: "crowdstrike.com"
status: "CONFIRMED" # EMERGING | DEVELOPING | ACKNOWLEDGED | CONFIRMED | REFUTED
first_seen: "2026-09-12"
last_updated: "2026-09-15"
threat_actor: "USDoD" # Optional
summary: "Threat actor claimed breach on dark web; company filed 8-K confirming unauthorized access to non-production test environment."
tags:
  - "sec-8k"
  - "dark-web-claim"
---

## Timeline

### 2026-09-15 17:00 UTC
- **Event:** Form 8-K filed with SEC confirming unauthorized access to non-production environment. No customer data impacted.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing](https://www.sec.gov/edgar/example)

### 2026-09-13 09:15 UTC
- **Event:** Company statement acknowledging investigation into threat actor claims.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Official Company Notice](https://crowdstrike.com/blog/example)

### 2026-09-12 14:30 UTC
- **Event:** Threat actor claims 1GB data theft on dark web forum.
- **Verification:** UNVERIFIED CLAIM
- **Source:** [BreachForums Archive](https://archive.is/example)
```

---

## 4. Technical Architecture

```
securityincident/
├── .github/
│   └── workflows/
│       ├── deploy.yml       # Builds static site & deploys to GitHub Pages
│       └── ingest.yml       # (Step 2) Cron job to poll SEC 8-K & Infosec RSS
├── incidents/               # Flat Markdown database (1 file per incident)
│   ├── 2026-09-sample-1.md
│   └── 2026-09-sample-2.md
├── scripts/
│   ├── build.js             # Parses incidents/*.md, outputs dist/ (HTML + search-index.json)
│   └── ingest/              # (Step 2) Feed fetchers & deduplication logic
├── src/
│   ├── templates/           # HTML templates (index, incident detail, about)
│   └── public/              # CSS, client-side JS, favicon, web assets
│       ├── style.css        # Vanilla CSS (dark theme, glassmorphism, responsive)
│       └── app.js           # Client-side filtering & instant search
├── package.json             # Build scripts and minimal dev dependencies
└── README.md
```

### Static Site Generator (`scripts/build.js`)
* Reads all files in `incidents/*.md`.
* Parses YAML frontmatter with `gray-matter`.
* Parses Markdown timeline entries into structured milestone objects.
* Sorts incidents by `last_updated` (most recent first).
* Generates:
  * `dist/index.html` (Full catalog with live client-side search, status filter pills, and cards).
  * `dist/incidents/<id>.html` (Dedicated incident timeline detail pages with full SEO tags and direct permalinks).
  * `dist/search-index.json` (Pre-rendered JSON for fast client-side fuzzy searching).
  * Copies static assets (`dist/style.css`, `dist/app.js`).

---

## 5. Development Roadmap

### Phase 1: Core Static Foundation (Current Step)
- [x] Architecture & Specification document.
- [ ] Initialize repository structure (`incidents/`, `scripts/build.js`, `src/`).
- [ ] Implement modern, high-density Vanilla CSS (dark theme, status badges, timeline styling).
- [ ] Add sample incidents covering all 4 statuses (`EMERGING`, `ACKNOWLEDGED`, `CONFIRMED`, `REFUTED`).
- [ ] Configure GitHub Actions workflow for automatic deployment to GitHub Pages.

### Phase 2: Ingestion & Automation (`.github/workflows/ingest.yml`)
- [ ] SEC EDGAR Form 8-K Item 1.05 RSS scraper (automatically creates/updates incidents when cyber 8-Ks are filed).
- [ ] Infosec news RSS aggregator (BleepingComputer, KrebsOnSecurity, Databreaches.net).
- [ ] Automatic PR generation / commit on new incident discovery.

### Phase 3: Community & Verification Tooling
- [ ] "Submit Update via GitHub" button on every incident page (pre-fills a GitHub Issue or PR).
- [ ] Automated validation linter for `incidents/*.md` to ensure required frontmatter and source links.
