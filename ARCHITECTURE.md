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
│       ├── deploy.yml       # Builds static site & deploys to GitHub Pages on push to main
│       ├── validate-pr.yml  # Validates schemas, milestones & build on PRs
│       └── ingest.yml       # (Roadmap) Cron job to poll SEC 8-K & Infosec RSS
├── incidents/               # Flat Markdown database (1 file per incident)
│   ├── 2026-09-crowdstrike.md
│   ├── 2026-09-apex-pay.md
│   ├── 2026-09-vortex-cloud.md
│   ├── 2026-09-medix-health.md
│   └── 2026-09-solaris-telecom.md
├── scripts/
│   ├── build.js             # Parses incidents/*.md, outputs dist/ (HTML, feed.xml, search index)
│   ├── validate.js          # Automated incident schema & RSS feed compliance validator
│   └── serve.js             # Local lightweight HTTP preview server
├── src/
│   └── public/              # CSS, client-side JS, favicon, web assets
│       ├── style.css        # Vanilla CSS (dual-mode dark/light, glassmorphism, responsive)
│       ├── app.js           # Client-side filtering, instant search & theme toggle
│       └── fontawesome.js   # Official FontAwesome icon bundle
├── images/                  # Brand assets (logos, favicons, COLOR.md, BRANDING.md)
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
  * `dist/about.html` (Verification Standard & Philosophy reference documentation).
  * `dist/feed.xml` (Full RSS 2.0 telemetry feed with latest milestone RFC 822 timestamps and CDATA descriptions).
  * `dist/search-index.json` (Pre-rendered JSON for fast client-side fuzzy searching).
  * Copies static assets (`dist/style.css`, `dist/app.js`, `dist/images/`, `dist/.nojekyll`).

### Incident & Feed Validator (`scripts/validate.js`)
* Run via `npm test` or `npm run validate`.
* Verifies filename format (`YYYY-MM-<target-slug>.md`).
* Enforces YAML frontmatter schema completeness (`id`, `target`, `domain`, `status`, `first_seen`, `last_updated`, `summary`, `tags`).
* Restricts status to the 5-tier telemetry progression (`EMERGING`, `DEVELOPING`, `ACKNOWLEDGED`, `CONFIRMED`, `REFUTED`).
* Validates timeline milestone structure, verification badges, and absolute HTTP/HTTPS primary source evidence URLs.
* Verifies the generated RSS 2.0 feed (`dist/feed.xml`) for XML validity and tag compliance.

---

## 5. Development Roadmap

### Phase 1: Core Static Foundation
- [x] Architecture & Specification document.
- [x] Repository structure (`incidents/`, `scripts/build.js`, `src/public/`).
- [x] Dual-mode Vanilla CSS (dark/light themes, status badges, centered responsive timeline).
- [x] 5-tier status architecture (`CONFIRMED`, `ACKNOWLEDGED`, `DEVELOPING`, `EMERGING`, `REFUTED`).
- [x] Logo assets and branding documentation (`images/`).
- [x] GitHub Actions workflow for automatic deployment to GitHub Pages (`.github/workflows/deploy.yml`).

### Phase 2: Syndication & Quality Assurance
- [x] Standard RSS 2.0 telemetry feed generation (`dist/feed.xml`) with milestone timestamps and links.
- [x] Automated schema validator (`scripts/validate.js`, `npm test`).
- [x] PR validation workflow (`.github/workflows/validate-pr.yml`).

### Phase 3: Ingestion & Automation (`.github/workflows/ingest.yml`)
- [ ] SEC EDGAR Form 8-K Item 1.05 RSS scraper (automatically creates/updates incidents when cyber 8-Ks are filed).
- [ ] Infosec news RSS aggregator (BleepingComputer, KrebsOnSecurity, Databreaches.net).
- [ ] Automated draft PR generation on new incident discovery.
