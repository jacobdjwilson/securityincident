# securityincident.net

> **A 100% Git-native, zero-database index of security incident statuses and verifiable milestone timelines on the open web.**

Visit the live site: [securityincident.net](https://securityincident.net)

---

## 🎯 The Philosophy: Status & Timeline Over Categorization

In the real world, the "category" or "type" of a security incident is almost always inaccurate or subjective in its early stages. An incident that begins as a reported "system outage" frequently evolves into an "unauthorized access event," which later becomes a "data exfiltration" or "ransomware extortion."

Instead of pinning incidents to rigid categories, **securityincident.net** focuses on the observable ground truth:
1. **Current Observable Status:** Is it an unverified dark web claim, has the target acknowledged an ongoing investigation, has an official regulator confirmed it, or was it debunked?
2. **Chronological Milestone Timeline:** A sequence of public events with source attribution and verification badges.

---

## 🚦 The 5 Observable Statuses

| Status | Badge | Color | Description | Primary Sources |
| :--- | :--- | :---: | :--- | :--- |
| **Confirmed** | `CONFIRMED` | 🟢 Green | **Highest assurance:** Officially verified by the target or government regulator. | SEC Form 8-K Item 1.05, State AG breach portals, formal press releases. |
| **Acknowledged** | `ACKNOWLEDGED` | 🟡 Yellow | Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss. | Target status pages, banner notices, initial press replies. |
| **Developing** | `DEVELOPING` | 🟠 Orange | Corroborated intelligence: independent researchers verify samples or observable outages align with claim. | Independent technical telemetry, sample schema audits. |
| **Emerging** | `EMERGING` | 🔴 Red | Early threat actor claims, dark web forum leaks, or unverified community chatter. Target has not commented. | Threat actor leak blogs, dark web forums, social tips. |
| **Refuted** | `REFUTED` | 🔘 Gray | Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach. | Target verification, HaveIBeenPwned research, researcher audits. |

---

## 📁 Repository Structure

```
securityincident/
├── .github/
│   └── workflows/
│       ├── deploy.yml       # Deploys dist/ to GitHub Pages on push to main
│       └── ingest.yml       # (Roadmap) Cron workflow polling SEC 8-K & RSS
├── incidents/               # Flat Markdown database (1 file per incident)
│   ├── 2026-09-crowdstrike.md
│   ├── 2026-09-apex-pay.md
│   ├── 2026-09-medix-health.md
│   └── 2026-09-solaris-telecom.md
├── scripts/
│   ├── build.js             # Parses incidents/*.md, outputs dist/ (HTML & search-index.json)
│   └── serve.js             # Local lightweight HTTP preview server
├── src/
│   └── public/
│       ├── style.css        # High-density dark-mode telemetry CSS
│       └── app.js           # Client-side instant filter & search
├── ARCHITECTURE.md          # Architectural and technical specification
├── CONTRIBUTING.md          # Guide for proposing incidents & milestones via PR
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

2. **Build the static site:**
   ```bash
   npm run build
   ```

3. **Start local preview server:**
   ```bash
   npm run serve
   # Or run both build + serve:
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🚀 Deployment

The site is built as purely static HTML/CSS/JS and deployed directly to **GitHub Pages** via the included [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To activate on GitHub:
1. Go to repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. Push to `main` branch to trigger the build.
