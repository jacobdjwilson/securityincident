---
id: 2026-09-fairwinds-credit-union
target: Fairwinds Credit Union
domain: fairwindscreditunion.com
status: CONFIRMED
first_seen: '2026-09-23'
last_updated: '2026-09-23'
threat_actor: Unattributed
summary: >-
  State of California Department of Justice data breach disclosure notice filed
  by Fairwinds Credit Union.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
industry: Financial Services
incident_type: Third-Party Vendor Cloud Compromise
affected_records: 65000
compromised_data:
  - Member Checking Account Numbers
  - Routing Transit Numbers
  - Debit Card Identifiers
regulatory_filings:
  - regulator: California Attorney General
    notice_id: SC-2026-09118
    url: 'https://oag.ca.gov/ecrime/databreach/reports'
---
## Incident Overview

The **Fairwinds Credit Union** cybersecurity event represents a confirmed **Third-Party Vendor Cloud Compromise** within the **Financial Services** sector, carried out by an unidentified cyber threat actor. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **65,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Member Checking Account Numbers, Routing Transit Numbers, Debit Card Identifiers.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-23 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-630165)
