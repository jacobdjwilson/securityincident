---
id: 2026-09-modoc-medical-center
target: Modoc Medical Center
domain: modocmedicalcenter.com
status: CONFIRMED
first_seen: 2026-09-22
last_updated: 2026-09-22
threat_actor: Akira
summary: State of California Department of Justice data breach disclosure notice
  filed by Modoc Medical Center.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
industry: Healthcare
incident_type: Ransomware & Network Intrusion
affected_records: 8400
compromised_data:
  - Patient Clinical Charts
  - Protected Health Information (PHI)
  - Emergency Department Admission Logs
regulatory_filings:
  - regulator: California Attorney General
    notice_id: SC-2026-09160
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-630126
---

## Incident Overview

The **Modoc Medical Center** cybersecurity event represents a confirmed **Ransomware & Network Intrusion** within the **Healthcare** sector, attributed to the **Akira** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **8,400 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Patient Clinical Charts, Protected Health Information (PHI), Emergency Department Admission Logs.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-22 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-630126)
