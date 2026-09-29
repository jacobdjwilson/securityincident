---
id: 2026-07-river-financial
target: River Financial
domain: riverbankandtrust.com
status: CONFIRMED
first_seen: '2026-07-06'
last_updated: '2026-07-30'
threat_actor: Unknown / Unattributed
summary: >-
  River Financial Corporation (parent of River Bank & Trust) disclosed an
  unauthorized intrusion into its banking network involving corporate data
  exfiltration.
tags:
  - regulatory
  - sec-8k
  - banking
  - confirmed
industry: Financial Services
incident_type: Network Intrusion & Data Exfiltration
affected_records: null
compromised_data:
  - Social Security Numbers (SSNs)
  - Financial Account Numbers
  - Direct Deposit & Banking Details
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K (Item 1.05 Material Cybersecurity Incidents)
    url: 'https://www.sec.gov/edgar/browse/?CIK=RiverFinancial'
---
## Incident Overview

The **River Financial** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Financial Services** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Social Security Numbers (SSNs), Financial Account Numbers, Direct Deposit & Banking Details.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-07-06 17:15 UTC
- **Event:** SEC Form 8-K Item 1.05 Initial Disclosure: River Financial detects unauthorized network intrusion and begins forensic investigation.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-295704)](https://www.sec.gov/Archives/edgar/data/1641601/000119312526295704/0001193125-26-295704-index.htm)

### 2026-07-10 18:30 UTC
- **Event:** SEC Form 8-K Item 1.05 Amendment: Confirms unauthorized threat actor accessed internal systems and exfiltrated sensitive data files.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K/A Item 1.05 (Adsh 0001193125-26-300763)](https://www.sec.gov/Archives/edgar/data/1641601/000119312526300763/0001193125-26-300763-index.htm)

### 2026-07-17 16:45 UTC
- **Event:** SEC Form 8-K Item 1.05 Update: Details containment milestones, ongoing litigation tracking, and customer notification procedures.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-307288)](https://www.sec.gov/Archives/edgar/data/1641601/000119312526307288/0001193125-26-307288-index.htm)

### 2026-07-30 19:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Status Conclusion: Confirms core network restoration, enhanced multi-factor controls, and complete containment.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-325324)](https://www.sec.gov/Archives/edgar/data/1641601/000119312526325324/0001193125-26-325324-index.htm)
