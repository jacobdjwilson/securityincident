---
id: 2026-08-rockwood-retirement-communities
target: Rockwood Retirement Communities
domain: rockwoodretirement.org
status: CONFIRMED
first_seen: '2026-08-20'
last_updated: '2026-08-20'
threat_actor: Unattributed
summary: >-
  Washington State Attorney General formal data breach disclosure notice filed
  by Rockwood Retirement Communities affecting 7136 residents.
tags:
  - regulatory
  - state-ag
  - washington
  - confirmed
industry: Healthcare & Senior Living
incident_type: Ransomware Extortion
affected_records: 6200
compromised_data:
  - Resident Medical Care Directives
  - Social Security Numbers (SSNs)
  - Emergency Family Contact Details
regulatory_filings:
  - regulator: Washington Attorney General
    notice_id: WA-2026-03890
    url: 'https://www.atg.wa.gov/data-breach-notifications'
---
## Incident Overview

The **Rockwood Retirement Communities** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Healthcare & Senior Living** sector, carried out by an unidentified cyber threat actor. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **6,200 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Resident Medical Care Directives, Social Security Numbers (SSNs), Emergency Family Contact Details.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-08-20 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA42441.pdf)
