---
id: 2026-08-rb-american-group
target: RB American Group
domain: rbamericangroup.com
status: CONFIRMED
first_seen: 2026-08-28
last_updated: 2026-08-28
threat_actor: RansomHub
summary: Washington State Attorney General formal data breach disclosure notice
  filed by RB American Group affecting 974 residents.
tags:
  - regulatory
  - state-ag
  - washington
  - confirmed
industry: Retail & Food Services
incident_type: Ransomware Extortion
affected_records: 98000
compromised_data:
  - Franchise Employee Social Security Numbers (SSNs)
  - Driver’s License Numbers
  - Direct Deposit Details
regulatory_filings:
  - regulator: Washington Attorney General
    notice_id: WA-2026-03912
    url: https://www.atg.wa.gov/data-breach-notifications
    description: Official statutory data breach notification submitted by RB
      American Group to the Washington State Office of the Attorney General
      pursuant to RCW 19.255.010, disclosing unauthorized system access
      impacting 98,000 residents.
---

## Incident Overview

The **RB American Group** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Retail & Food Services** sector, attributed to the **RansomHub** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **98,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Franchise Employee Social Security Numbers (SSNs), Driver’s License Numbers, Direct Deposit Details.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-08-28 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA42591.pdf)
