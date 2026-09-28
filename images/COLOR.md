# Color Guide — securityincident.net

> **Palette Architecture:** Functional Telemetry, Dual-Theme UI & Print Standards

---

## 1. Ground-Truth Status Colors

These 4 functional status hues define the core telemetry across cards, badges, and logo timeline dots:

| Status | Swatch | HEX | RGB | HSL | Functional Meaning |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`EMERGING`** | 🟡 | `#F59E0B` | `245, 158, 11` | `38°, 92%, 50%` | Dark web forum claims, leak postings, unverified rumors |
| **`ACKNOWLEDGED`** | 🟠 | `#F97316` | `249, 115, 22` | `25°, 95%, 53%` | Target confirms IT disruption or active investigation |
| **`CONFIRMED`** | 🔴 | `#EF4444` | `239, 68, 68` | `0°, 84%, 60%` | SEC Form 8-K, state AG breach notice, target admission |
| **`REFUTED`** | ⚪ | `#64748B` | `100, 116, 139` | `215°, 16%, 47%` | Disproven claim, recycled historical dump, hoax |

---

## 2. Verification Badge Accents

| Verification Tier | HEX | RGB | Purpose |
| :--- | :--- | :--- | :--- |
| **Regulator / SEC 8-K** | `#10B981` | `16, 185, 129` | Highest assurance: Regulatory filings & government notices |
| **Independent Research** | `#06B6D4` | `6, 182, 212` | Analyst audits, HaveIBeenPwned verification, telemetry |
| **Target Statement** | `#3B82F6` | `59, 130, 246` | Official bulletins, status pages, target advisories |

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
