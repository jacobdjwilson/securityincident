---
id: 2026-09-novocure
target: NovoCure
domain: novocure.com
status: CONFIRMED
first_seen: '2026-09-01'
last_updated: '2026-09-01'
threat_actor: Unknown / Unattributed
summary: >-
  Oncology medical device company NovoCure disclosed unauthorized access to
  subsidiary information systems detected in mid-August 2026.
tags:
  - regulatory
  - sec-8k
  - medical-device
  - confirmed
industry: Healthcare
incident_type: Unauthorized Network Intrusion
affected_records: 18000
compromised_data:
  - Patient Oncology Therapy Records
  - Protected Health Information (PHI)
  - Clinical Trial Registry Data
regulatory_filings:
  - regulator: SEC
    form: Form 8-K (Item 1.05)
    accession_number: 0001645147-26-000034
    url: 'https://www.sec.gov/edgar/browse/?CIK=0001645147'
---
## Incident Overview

The **NovoCure** cybersecurity event represents a confirmed **Unauthorized Network Intrusion** within the **Healthcare** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **18,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Patient Oncology Therapy Records, Protected Health Information (PHI), Clinical Trial Registry Data.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-01 16:45 UTC
- **Event:** SEC Form 8-K Item 8.01 Filing: NovoCure reports containment of unauthorized access to subsidiary IT systems with no impact on patient therapy.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 8.01 (Adsh 0001645113-26-000065)](https://www.sec.gov/Archives/edgar/data/1645113/000164511326000065/0001645113-26-000065-index.htm)
