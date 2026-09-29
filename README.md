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
| **Confirmed** | `CONFIRMED` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach portals, formal press releases. |
| **Acknowledged** | `ACKNOWLEDGED` | 🟡 Yellow | Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss. | Target status pages, banner notices, initial press replies. |
| **Developing** | `DEVELOPING` | 🟠 Orange | Corroborated intelligence: independent researchers verify samples or observable outages align with claims. | Independent technical telemetry, sample schema audits. |
| **Emerging** | `EMERGING` | 🔴 Red | Early threat actor claims, dark web forum leaks, or unverified community chatter before target comment. | Threat actor leak blogs, dark web forums, social tips. |
| **Refuted** | `REFUTED` | 🔘 Gray | Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach. | Target verification, HaveIBeenPwned research, researcher audits. |

---

## ⚖️ Open Weights Correlation Engine

Unlike opaque proprietary risk ratings, **securityincident.net** computes confidence scores deterministically using open weights defined in [`sources/weights.json`](sources/weights.json) and executed via [`scripts/weights.js`](scripts/weights.js):

* **Base Verification Tier:**
  * 🟢 `CONFIRMED BY REGULATOR`: **1.00 (100%)** — SEC Form 8-K Item 1.05, State AG breach portals, HHS OCR.
  * 🟢 `CONFIRMED BY TARGET`: **0.90 (90%)** — Target press releases, security advisories, status page bulletins.
  * 🟠 `INDEPENDENT VERIFICATION`: **0.65 (65%)** — Forensic research, HaveIBeenPwned audit, technical sample analysis.
  * 🟡 `ACKNOWLEDGED`: **0.45 (45%)** — Target publicly confirms disruption or investigation without breach admission.
  * 🔴 `UNVERIFIED CLAIM`: **0.20 (20%)** — Dark web leak sites, extortion blogs, community chatter.
  * 🔘 `REFUTED`: **0.00 (0%)** — Proven false alarm, recycled historical leak, or mislabeled web scrape.
* **Cross-Domain Corroboration:** +0.05 (+5%) per independent source domain that corroborates an event, capped at +0.15 (+15%).
* **Machine-Readable Syndication:** Real-time feed available in both [RSS 2.0 (`dist/feed.xml`)](feed.xml) and [JSON Feed v1.1 (`dist/feed.json`)](feed.json) with `_open_weights` metadata.

---

## 📁 Repository Structure

```
securityincident/
├── .github/
│   └── workflows/
│       ├── deploy.yml         # Deploys dist/ to GitHub Pages on push to main
│       ├── validate-pr.yml    # Validates incident schemas & build on PRs
│       └── ingest.yml         # Automated threat feed ingestion, SEC 8-K polling & PR proposing
├── incidents/                 # Flat Markdown database (1 file per incident)
│   ├── 2026-07-river-financial.md
│   ├── 2026-07-amgen.md
│   ├── 2026-09-citrix.md
│   └── ...
├── sources/
│   ├── feeds.json             # Active regulatory & investigative feed sources
│   └── weights.json           # Open Weights confidence model configuration
├── scripts/
│   ├── build.js               # SSG: outputs dist/ (HTML, feed.xml, feed.json & search-index.json)
│   ├── weights.js             # Deterministic Open Weights correlation scoring engine
│   ├── validate.js            # Schema, milestone, and feed validator (npm test)
│   ├── ingest.js              # Real-time feed aggregator & SEC 8-K poller
│   ├── ingest-history.js      # 90-day historical data populator with rate-limiting
│   └── serve.js               # Local lightweight HTTP preview server
├── src/
│   └── public/
│       ├── style.css          # High-density dual-mode SOC telemetry CSS
│       └── app.js             # Client-side instant filter, sort, search & theme toggle
├── ARCHITECTURE.md            # Architectural and technical specification
├── CONTRIBUTING.md            # Guide for proposing incidents & milestones via PR
├── package.json
└── README.md
```

---

## 🛠️ Contributing an Incident or Milestone

To add or update an incident, you don't need a database login or admin credentials—**all updates happen via GitHub Pull Requests!**

### 2 Ways to Contribute
1. **Direct In-Browser (No Git Required):** On [securityincident.net](https://securityincident.net), open any incident page and click **"Edit on GitHub →"** at the bottom. Use GitHub's web editor (✎) to add your milestone and click **"Propose changes"** to automatically open a PR!
2. **Local CLI Workflow:** Fork the repository, add/modify files in `incidents/`, test with `npm run build`, and open a Pull Request.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed schema rules, verification standards, and guidelines.

### Adding a New Incident
Create a new file in `incidents/` following the naming convention `YYYY-MM-<target-slug>.md`:

```markdown
---
id: "2026-09-target-slug"
target: "Organization Name"
domain: "target.com"
status: "CONFIRMED" # EMERGING | DEVELOPING | ACKNOWLEDGED | CONFIRMED | REFUTED
first_seen: "2026-09-12"
last_updated: "2026-09-15"
threat_actor: "Actor Name" # Optional
summary: "1-2 sentence high-signal summary of the event."
tags:
  - "sec-8k"
  - "ransomware-claim"
---

## Timeline

### YYYY-MM-DD HH:MM UTC
- **Event:** Single-sentence description of the verified milestone.
- **Verification:** CONFIRMED BY REGULATOR # or CONFIRMED BY TARGET, INDEPENDENT VERIFICATION, UNVERIFIED CLAIM, REFUTED
- **Source:** [Filing / Proof Link](https://example.com)
```

---

## 💻 Local Development

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

4. **Start local preview server:**
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
