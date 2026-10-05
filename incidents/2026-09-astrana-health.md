---
id: 2026-09-astrana-health
target: Astrana Health
domain: astranahealth.com
status: CONFIRMED
first_seen: '2026-09-23'
last_updated: '2026-09-23'
threat_actor: RansomHub
summary: >-
  Healthcare management company Astrana Health filed Form 8-K Item 1.05
  disclosing a cybersecurity intrusion at its Astrana Health Management
  subsidiary.
tags:
  - regulatory
  - sec-8k
  - healthcare
  - confirmed
industry: Healthcare
incident_type: Ransomware Extortion
affected_records: 92000
compromised_data:
  - Patient Demographic Files
  - Social Security Numbers (SSNs)
  - Medical Diagnosis Codes
  - Clinical Care Authorizations
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001104659-26-109813
    filing_date: '2026-09-15'
    url: >-
      https://www.sec.gov/Archives/edgar/data/1083446/000110465926109813/0001104659-26-109813-index.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by Astrana
      Health, Inc. reporting provider network server access and HIPAA patient
      notification procedures.
---
## Incident Overview

The **Astrana Health** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Healthcare** sector, attributed to the **RansomHub** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **92,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Patient Demographic Files, Social Security Numbers (SSNs), Medical Diagnosis Codes, Clinical Care Authorizations.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-23 16:30 UTC
- **Event:** SEC Form 8-K Item 1.05 Filing: Astrana Health discloses cybersecurity incident impacting management subsidiary environments.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001104659-26-109813)](https://www.sec.gov/Archives/edgar/data/1083446/000110465926109813/0001104659-26-109813-index.htm)
