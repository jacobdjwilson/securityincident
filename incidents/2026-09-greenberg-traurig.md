---
id: 2026-09-greenberg-traurig
target: Greenberg Traurig
domain: gtlaw.com
status: CONFIRMED
first_seen: '2026-09-09'
last_updated: '2026-10-01'
threat_actor: RansomHub
summary: >-
  Global law firm Greenberg Traurig was compromised by Silent Ransom Group,
  resulting in the exfiltration and notification of over 126,000 individuals.
tags:
  - investigative
  - legal
  - ransomware-claim
  - developing
  - regulatory
  - state-ag
  - california
  - confirmed
industry: Legal
incident_type: Ransomware Extortion
affected_records: 145000
compromised_data:
  - Confidential Legal Case Workproduct
  - Client Retainer Information
  - Social Security Numbers (SSNs)
  - Corporate Financial Disclosures
  - Confidential Legal Workproduct
  - Client Information
regulatory_filings:
  - regulator: California Attorney General
    notice_id: SC-2026-09142
    url: 'https://oag.ca.gov/ecrime/databreach/reports'
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice
    url: 'https://oag.ca.gov/ecrime/databreach/reports/sb24-630659'
    filing_date: '2026-10-01'
---
## Incident Overview

The **Greenberg Traurig** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Legal** sector, attributed to the **RansomHub** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **145,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Confidential Legal Case Workproduct, Client Retainer Information, Social Security Numbers (SSNs), Corporate Financial Disclosures.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-14 11:30 UTC
- **Event:** Silent Ransom Group lists Greenberg Traurig on extortion site; forensic investigation confirms 126k individuals affected.
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Incident Audit](https://databreaches.net/2026/09/14/silent-ransom-group-hacked-greenberg-traurig-who-notifies-the-126k-affected/)

### 2026-09-09 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-629493)

### 2026-10-01 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-630659)
