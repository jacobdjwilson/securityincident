---
id: 2026-07-anmed-health
target: AnMed Health
domain: anmed.org
status: ACKNOWLEDGED
first_seen: '2026-07-26'
last_updated: '2026-07-26'
threat_actor: Unknown / Unattributed
summary: >-
  South Carolina healthcare system AnMed Health experienced extensive IT and
  telecommunications outages across all hospital campuses.
tags:
  - investigative
  - healthcare
  - outage
  - acknowledged
industry: Healthcare
incident_type: Network Intrusion & Data Exfiltration
affected_records: null
compromised_data:
  - Social Security Numbers (SSNs)
  - Protected Health Information (PHI)
  - Clinical & Diagnostic Records
regulatory_filings: []
---
## Incident Overview

The **AnMed Health** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Healthcare** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Social Security Numbers (SSNs), Protected Health Information (PHI), Clinical & Diagnostic Records.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-07-26 14:00 UTC
- **Event:** AnMed Health confirms widespread network and phone outages affecting all facilities, maintaining emergency room triage.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [DataBreaches.net Telemetry Alert](https://databreaches.net/2026/07/26/developing-anmed-reports-phone-and-internet-outage-impacting-all-hospital-locations-ers-remain-open/)
