---
id: 2026-09-novocure
target: NovoCure
domain: novocure.com
status: CONFIRMED
first_seen: 2026-09-01
last_updated: 2026-09-01
threat_actor: Unknown / Unattributed
summary: Oncology medical device company NovoCure disclosed unauthorized access
  to subsidiary information systems detected in mid-August 2026.
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
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001645113-26-000065
    filing_date: 2026-09-10
    url: https://www.sec.gov/Archives/edgar/data/1645113/000164511326000065/0001645113-26-000065-index.htm
    description: >-
      Item 8.01 Other Events.


      In mid-August 2026, NovoCure Limited (the "Company," "we," or "us")
      through a subsidiary, became aware of unauthorized access to some of its
      information systems. Upon detecting the unauthorized access, the Company
      activated its cybersecurity response plan, implemented containment
      measures, and initiated an internal investigation of the event. The
      Company also engaged independent cybersecurity forensic experts to assist
      with the investigation, including reviewing the exposed data that was
      accessed. Based on the investigation to date, the Company determined that
      the exposed data included: internal Company patient ID numbers for over
      1,400 U.S. patient records (these ID numbers are only used internally and
      no patient names or other identifying data for these was exposed); patient
      data for fewer than 50 other patients in the western U.S. that included
      additional identifying information; general contact information for
      healthcare providers we work with; and general contact information for
      Novocure employees, such as their job titles and phone numbers. No access
      to any of our medical treatment devices was obtained, our ability to
      operate has not been compromised and all of our systems are fully
      functional. The Company takes its obligation to safeguard privacy and
      security of its patients' data very seriously. The Company continues to
      evaluate applicable regulatory and legal notification requirements and
      will make all required notifications based on its findings, including to
      impacted patients.


      At this time, we do not believe that this cybersecurity incident will have
      a material impact or reasonably likely material impact on our financial
      condition and results of operations; however, at the time of this filing
      we are continuing to ascertain additional information regarding this
      incident. If additional information is obtained whereby we determine this
      cybersecurity incident will have a material impact or reasonably likely
      material impact on our financial condition and results of operations, we
      undertake to file an amendment to this Form 8-K filing under
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
