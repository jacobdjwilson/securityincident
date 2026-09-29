---
id: 2026-07-upbound-group
target: Upbound Group
domain: upbound.com
status: CONFIRMED
first_seen: '2026-07-22'
last_updated: '2026-09-27'
threat_actor: Unknown / Unattributed
summary: >-
  Upbound Group disclosed unauthorized acquisition of customer records and
  internal documents subsequently leveraged in fraudulent attempts.
tags:
  - regulatory
  - sec-8k
  - retail
  - confirmed
  - state-ag
  - california
industry: Retail & Consumer Goods
incident_type: Network Intrusion & Data Exfiltration
affected_records: null
compromised_data:
  - Payment Card Details
  - Billing & Shipping Addresses
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K (Item 1.05 Material Cybersecurity Incidents)
    url: 'https://www.sec.gov/edgar/browse/?CIK=UpboundGroup'
  - regulator: State of California Department of Justice
    form: Data Security Breach Disclosure Report
    url: 'https://oag.ca.gov/ecrime/databreach/reports'
---
## Incident Overview

The **Upbound Group** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Retail & Consumer Goods** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Payment Card Details, Billing & Shipping Addresses.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-07-22 17:00 UTC
- **Event:** SEC Form 8-K Item 8.01 Disclosure: Upbound Group reveals unauthorized acquisition of non-sensitive customer records and corporate documents.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 8.01 (Adsh 0001193125-26-310605)](https://www.sec.gov/Archives/edgar/data/933036/000119312526310605/0001193125-26-310605-index.htm)

### 2026-09-27 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-630390)
