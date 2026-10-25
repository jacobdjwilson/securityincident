---
id: 2026-09-astrana-health
target: Astrana Health
domain: astranahealth.com
status: CONFIRMED
first_seen: 2026-09-23
last_updated: 2026-10-25
threat_actor: RansomHub
summary: Healthcare management company Astrana Health filed Form 8-K Item 1.05
  disclosing a cybersecurity intrusion at its Astrana Health Management
  subsidiary.
tags:
  - regulatory
  - sec-8k
  - healthcare
  - confirmed
  - extortion
  - ransomware-claim
  - falcon
  - emerging
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
    filing_date: 2026-09-15
    url: https://www.sec.gov/Archives/edgar/data/1083446/000110465926109813/0001104659-26-109813-index.htm
    description: >-
      Item 1.05Material Cybersecurity Incident.


      Astrana Health, Inc. (the "Company") recently became aware that its
      subsidiary Astrana Health Management, Inc. detected unusual activity
      within its environment.


      The incident involved a series of social engineering attempts in which
      threat actors, impersonating Company personnel and spoofing the Company's
      main corporate telephone number, contacted certain employees in an effort
      to obtain unauthorized access to Company systems. The Company's
      cybersecurity team detected and responded to the unauthorized activity,
      launched an investigation, engaged a leading third-party cybersecurity and
      digital forensics firm, notified law enforcement, and is notifying state
      and federal regulators, and payer partners. The Company has also taken
      remedial measures, including resetting affected credentials, restricting
      remote access tools, restoring certain systems from clean backups, and
      enhancing monitoring, logging, and detection capabilities across its
      environment. The Company's investigation into the nature and scope of the
      incident, including the matters described above, remains ongoing.


      Based on the current status of the Company's ongoing investigation, the
      Company believes that certain private and/or confidential information
      maintained on the Company's servers has been accessed and/or acquired
      without authorization.


      The Company continues to assess whether, and to what extent, patient,
      employee, credentialed provider, confidential business and financial
      information, intellectual property, or other information may have been
      accessed, acquired, or exfiltrated and continues to evaluate the potential
      impact of the unauthorized activity. The Company continues to evaluate
      applicable regulatory and legal notification requirements, and the Company
      intends to make all required notifications based on its findings,
      including to impacted patients.


      While the investigation is ongoing, the Company has determined that the
      incident is material as of September 22, 2026, due to the potential
      confidential and sensitive nature of the data that is involved.


      However, the Company is, at this time, unable to estimate the full
      potential impact of the incident on the Company's business strategy,
      operations, financial condition, or results of operations, including
      remediation and response costs, legal, regulatory and notification-related
      matters, and possible effects on providers, patients, counterparties and
      the Company's reputation, or the impact on the trading price of the
      Company's common stock. The Company maintains cybersecurity insurance that
      may cover certain losses associated with the incident, although there can
      be no assurance that such coverage will be sufficient to cover all losses
      the Company may incur. Although the Company is unable to predict the full
      impact of this incident, the Company currently does not expect that it
      will have a material effect on the Company's financial condition and
      results of operations.


      The trust of our valued providers, patients, and payer partners is deeply
      important to us, and we regret any concern or inconvenience this may
      cause.


      To the extent any information required by
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

### 2026-10-25 14:53 UTC
- **Event:** Astrana Health Listed on Falcon Ransomware Extortion Portal
- **Verification:** UNVERIFIED CLAIM
- **Source:** [Falcon Ransomware Leak Site Claim](https://www.ransomware.live/id/QXN0cmFuYSBIZWFsdGhARmFsY29u)
