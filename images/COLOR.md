# Color Guide — securityincident.net

> **Palette Architecture:** Functional Telemetry, Dual-Theme UI & Print Standards

---

## 1. Ground-Truth Status Colors (5-Tier Telemetry Model)

These 5 functional status hues define the core telemetry across cards, badges, and logo timeline dots:

| Status | Tier | HEX (Dark) | HEX (Light) | Functional Meaning |
| :--- | :---: | :--- | :--- | :--- |
| **`CONFIRMED`** | 🟢 Green | `#10B981` | `#047857` | **Highest assurance:** SEC Form 8-K, state AG notice, target formal admission |
| **`ACKNOWLEDGED`** | 🟡 Yellow | `#FACC15` | `#A16207` | Target acknowledges IT disruption or active cybersecurity investigation |
| **`DEVELOPING`** | 🟠 Orange | `#FB923C` | `#C2410C` | Independent researcher corroboration, sample verification, or telemetry alignment |
| **`EMERGING`** | 🔴 Red | `#F87171` | `#B91C1C` | Unilateral dark web claims, extortion site countdowns, uncorroborated chatter |
| **`REFUTED`** | 🔘 Gray | `#94A3B8` | `#475569` | Disproven claim, recycled historical marketing dump, extortion hoax |

---

## 2. Verification Badge Accents

| Verification Tier | HEX (Dark) | HEX (Light) | Purpose |
| :--- | :--- | :--- | :--- |
| **Regulator / SEC 8-K** | `#10B981` | `#047857` | Highest assurance: Regulatory filings & government notices |
| **Target Statement** | `#06B6D4` | `#0284C7` | Official bulletins, status pages, target advisories |
| **Independent Research** | `#FB923C` | `#C2410C` | Analyst audits, HaveIBeenPwned research, telemetry |
| **Unverified Claim** | `#F87171` | `#B91C1C` | Threat actor forum claims, leak blog postings, uncorroborated |
| **Refuted** | `#94A3B8` | `#475569` | Explicitly disproven with forensic evidence |

---

## 3. Dark Mode UI Palette

Optimized for high-density, low-eye-strain security operations center (SOC) environments:

| Token | HEX | Description |
| :--- | :--- | :--- |
| `--bg-canvas` | `#090D16` | Main background deep space canvas |
| `--bg-surface` | `#0E1526` | Card backgrounds and panels |
| `--bg-surface-elevated` | `#151F38` | Dropdown menus, tooltips, active filter pills |
| `--border-subtle` | `#1E293B` | Structural dividers and card borders |
| `--border-hover` | `#334155` | Focused inputs, card hover borders |
| `--text-primary` | `#F8FAFC` | Main headings and incident titles |
| `--text-secondary` | `#94A3B8` | Card summaries, timeline body copy |
| `--text-muted` | `#64748B` | Timestamps, metadata labels, footnotes |

---

## 4. Light Mode UI Palette

Optimized for high-contrast readability in daylight and documentation viewing:

| Token | HEX | Description |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F8FAFC` | Light slate background |
| `--bg-surface` | `#FFFFFF` | Crisp white card surface |
| `--bg-surface-elevated` | `#F1F5F9` | Elevated panels, pill hover backgrounds |
| `--border-subtle` | `#E2E8F0` | Card borders and horizontal rules |
| `--border-hover` | `#CBD5E1` | Focused inputs and card hover states |
| `--text-primary` | `#0F172A` | High-contrast dark slate body and headings |
| `--text-secondary` | `#334155` | Incident summaries and descriptions |
| `--text-muted` | `#64748B` | Timestamps, metadata labels, footnotes |

---

## 5. Print & Monochrome Specification

For black-and-white documents, laser printers, newsprint, and legal discovery:

| Element | Specification | Grayscale Equivalent |
| :--- | :--- | :--- |
| **Shield Outer Contour** | 100% Black (`#000000`) | 100% K |
| **Shield Inner Surface** | 100% White (`#FFFFFF`) | 0% K |
| **Timeline Axis Line** | 100% Black (`#000000`, 6pt stroke) | 100% K |
| **Timeline Nodes** | Solid black circle with white center cutout | High contrast 1-bit |
| **Body Text** | 100% Black (`#000000`) | Minimum 10pt font |
