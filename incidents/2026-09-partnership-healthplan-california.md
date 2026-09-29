---
id: 2026-09-partnership-healthplan-california
target: Partnership HealthPlan of California
domain: partnershiphp.net
status: CONFIRMED
first_seen: '2026-09-17'
last_updated: '2026-09-17'
threat_actor: Hive / Successor Affiliate
summary: >-
  State of California Department of Justice data breach disclosure notice filed
  by Partnership HealthPlan of California.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
industry: Healthcare
incident_type: Ransomware Extortion
affected_records: 854000
compromised_data:
  - Medi-Cal Beneficiary Social Security Numbers
  - Medical Treatment Authorizations
  - Prescription Claim Records
regulatory_filings:
  - regulator: California Attorney General
    notice_id: SC-2026-09199
    url: 'https://oag.ca.gov/ecrime/databreach/reports'
  - regulator: HHS Office for Civil Rights
    form: HIPAA Breach Portal
    url: 'https://ocrportal.hhs.gov/ocr/cp/breach'
---
## Incident Overview

The **Partnership HealthPlan of California** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Healthcare** sector, attributed to the **Hive / Successor Affiliate** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **854,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Medi-Cal Beneficiary Social Security Numbers, Medical Treatment Authorizations, Prescription Claim Records.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-17 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-629908)
