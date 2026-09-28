# Contributing to securityincident.net

> **A 100% Git-native, zero-database index of security incident status and milestone verification timelines.**

Thank you for your interest in contributing! This project runs entirely on flat files tracked in Git. There is no SQL database, no CMS, and no private admin portal—**GitHub Pull Requests are our database transactions.**

---

## Table of Contents
1. [Why a Flat-File Database?](#why-a-flat-file-database)
2. [How Anyone Can Contribute (2 Methods)](#how-anyone-can-contribute-2-methods)
   - [Method 1: Direct In-Browser Edit (Zero Git Setup)](#method-1-direct-in-browser-edit-zero-git-setup)
   - [Method 2: Local CLI & PR Workflow](#method-2-local-cli--pr-workflow)
3. [Incident Schema & Verification Standards](#incident-schema--verification-standards)
4. [What Happens After You Open a PR](#what-happens-after-you-open-a-pr)
5. [Reporting Tips via GitHub Issues](#reporting-tips-via-github-issues)

---

## Why a Flat-File Database?

Most threat intelligence trackers rely on opaque internal databases. We chose a 100% Git-native model because:

* **Auditability:** Every status change and milestone edit has a permanent, cryptographic Git commit hash.
* **Tamper-Resistance:** Changes cannot be quietly altered or deleted without an auditable Git history.
* **Open to Everyone:** Any security researcher, journalist, or engineer can propose additions or corrections with a single click.

All incidents reside in plain Markdown files with YAML frontmatter inside the [`/incidents/`](./incidents/) directory.

---

## How Anyone Can Contribute (2 Methods)

### Method 1: Direct In-Browser Edit (Zero Git Setup)

You don't need Git installed on your computer to add a milestone or update a status:

1. **Find the incident:**
   - On [securityincident.net](https://securityincident.net), navigate to any incident page.
   - Scroll to the bottom and click the **"Edit on GitHub →"** button.
   - *(Or browse directly to the file in the [`incidents/`](./incidents/) directory on GitHub).*
2. **Click the Edit Button:**
   - In GitHub's web interface, click the **Pencil icon** (✎) at the top-right of the file.
3. **Make your update:**
   - Add a new milestone entry to the `## Timeline` section, or update the `status:` in the frontmatter.
   - Be sure to include the direct source link!
4. **Propose changes:**
   - At the bottom of the page, write a short title (e.g., `Add SEC 8-K filing milestone`).
   - Click **"Propose changes"**.
   - Click **"Create pull request"**.

GitHub handles the fork and branch creation automatically. Maintainers will review and merge it.

---

### Method 2: Local CLI & PR Workflow

For adding brand-new incidents or making multiple edits:

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/securityincident.git
   cd securityincident
   npm install
   ```

2. **Create a new branch:**
   ```bash
   git checkout -b incident/<target-slug>
   ```

3. **Add or modify an incident file:**
   Create a new file in `incidents/` named `YYYY-MM-<target-slug>.md` (e.g. `2026-09-example-corp.md`).

4. **Verify the build locally:**
   ```bash
   npm run build
   npm run serve
   ```
   Open `http://localhost:3000` in your browser to verify that your incident displays properly and links work.

5. **Commit and open a Pull Request:**
   ```bash
   git add incidents/
   git commit -m "feat(incident): add Example Corp incident record"
   git push origin incident/<target-slug>
   ```
   Open a Pull Request on GitHub against `main`.

---

## Incident Schema & Verification Standards

Every incident file follows this strict standard:

```markdown
---
id: "YYYY-MM-<target-slug>"
target: "Organization Name"
domain: "organization.com"
status: "CONFIRMED" # EMERGING | ACKNOWLEDGED | CONFIRMED | REFUTED
first_seen: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
threat_actor: "Actor Name" # Optional or "Unknown"
summary: "1-2 sentence high-signal summary of the event."
tags:
  - "sec-8k"
  - "ransomware-claim"
---

## Timeline

### YYYY-MM-DD HH:MM UTC
- **Event:** Single-sentence description of the verified milestone.
- **Verification:** 🟢 CONFIRMED BY REGULATOR # Pick one from the table below
- **Source:** [Primary Source Title](https://example.com/source-url)
```

### The 4 Observable Macro Statuses

| Status | Badge | When to Use |
| :--- | :--- | :--- |
| **`EMERGING`** | 🟡 Emerging | Unilateral claim on a dark web forum, leak site listing, or chatter. Target has not acknowledged or commented. |
| **`ACKNOWLEDGED`** | 🟠 Acknowledged | Target publicly reports an "IT disruption" or active investigation, but has not confirmed an unauthorized intrusion or data loss. |
| **`CONFIRMED`** | 🔴 Confirmed | Officially confirmed by the target organization or a government regulator (SEC Form 8-K, State AG breach notice, HHS portal). |
| **`REFUTED`** | ⚪ Refuted | Proven false alarm, recycled historical data dump, or public web scrape mislabeled as an intrusion. |

### Milestone Verification Tiers

* `🟢 CONFIRMED BY REGULATOR`: SEC Form 8-K Item 1.05, State AG breach notice, HHS OCR portal, CISA advisory.
* `🟢 CONFIRMED BY TARGET`: Target press release, official blog post, status page bulletin.
* `🟡 UNVERIFIED CLAIM`: Threat actor leak site listing, dark web forum post, anonymous paste.
* `🔵 INDEPENDENT VERIFICATION`: Cybersecurity researcher analysis, HaveIBeenPwned audit, reputable investigative reporting.
* `⚪ REFUTED`: Explicitly disproven with forensic or public evidence.

> [!IMPORTANT]
> **Source Link Requirement:** Every milestone in a timeline **must** link directly to a publicly verifiable primary source. We do not accept milestones based solely on secondary commentary or unsourced tweets.

---

## What Happens After You Open a PR

1. **Automated Build Check:** GitHub Actions verifies that the Markdown parses correctly, required frontmatter fields exist, and `npm run build` succeeds.
2. **Review:** A maintainer reviews the source links and verification tiers.
3. **Instant Live Deployment:** As soon as your PR is merged to `main`, GitHub Actions rebuilds the static site and deploys the update live to [securityincident.net](https://securityincident.net) in under 60 seconds!

---

## Reporting Tips via GitHub Issues

If you have information about an incident or milestone but don't want to edit Markdown directly:

* Open a **[New Incident Tip](https://github.com/jacobdjwilson/securityincident/issues/new?template=new_incident.md)** issue.
* Open a **[Milestone / Status Correction](https://github.com/jacobdjwilson/securityincident/issues/new?template=milestone_update.md)** issue.

Please provide direct links to primary sources whenever possible.
