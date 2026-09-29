---
id: 2026-08-nutex-health
target: Nutex Health
domain: nutexhealth.com
status: CONFIRMED
first_seen: '2026-08-31'
last_updated: '2026-09-11'
threat_actor: Unknown / Unattributed
summary: >-
  Nutex Health disclosed an unauthorized cybersecurity incident involving
  corporate data environments, triggering formal Item 1.05 notification.
tags:
  - regulatory
  - sec-8k
  - healthcare
  - confirmed
industry: Healthcare
incident_type: Network Intrusion & Data Exfiltration
affected_records: null
compromised_data:
  - Social Security Numbers (SSNs)
  - Protected Health Information (PHI)
  - Clinical & Diagnostic Records
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K (Item 1.05 Material Cybersecurity Incidents)
    url: 'https://www.sec.gov/edgar/browse/?CIK=NutexHealth'
---
## Incident Overview

The **Nutex Health** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Healthcare** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Social Security Numbers (SSNs), Protected Health Information (PHI), Clinical & Diagnostic Records.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-08-31 16:30 UTC
- **Event:** SEC Form 8-K Item 1.05 Filing: Nutex Health confirms unauthorized data exfiltration following prior Item 8.01 investigation notice.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001628280-26-059602)](https://www.sec.gov/Archives/edgar/data/1479681/000162828026059602/0001628280-26-059602-index.htm)

### 2026-09-11 17:15 UTC
- **Event:** SEC Form 8-K Item 8.01 Supplemental: Nutex Health provides containment verification and reports clinical operations remain fully operational.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 8.01 (Adsh 0001628280-26-061432)](https://www.sec.gov/Archives/edgar/data/1479681/000162828026061432/0001628280-26-061432-index.htm)
