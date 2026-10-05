---
id: 2024-02-change-healthcare
target: Change Healthcare
domain: changehealthcare.com
status: CONFIRMED
first_seen: '2024-02-21'
last_updated: '2024-10-24'
threat_actor: ALPHV / BlackCat
industry: Healthcare
incident_type: Ransomware Extortion & Healthcare Pipeline Disruption
affected_records: 100000000
compromised_data:
  - Protected Health Information (PHI)
  - Social Security Numbers (SSNs)
  - Medical Claims & Diagnostic Data
  - Banking & Direct Deposit Information
  - Medical Claims
  - Billing Information
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0000731766-24-000010
    filing_date: '2024-02-21'
    url: >-
      https://www.sec.gov/Archives/edgar/data/731766/000073176624000010/uhg-20240221.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by UnitedHealth
      Group reporting suspected cybercrime intrusion into Change Healthcare IT
      environments resulting in nationwide healthcare billing and pharmacy
      disruptions.
  - regulator: HHS OCR
    form: HIPAA Breach Portal Report
    accession_number: HHS-OCR-2024-001
    url: 'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf'
summary: >-
  Change Healthcare (UnitedHealth Group) suffered a devastating ALPHV / BlackCat
  ransomware extortion attack halting healthcare clearinghouse networks
  nationwide and impacting 100M individuals.
tags:
  - regulatory
  - sec-8k
  - hhs-ocr
  - healthcare
  - ransomware
  - confirmed
---
## Incident Overview

Change Healthcare (UnitedHealth Group) suffered a devastating ALPHV / BlackCat ransomware extortion attack halting healthcare clearinghouse networks nationwide and impacting 100M individuals.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Protected Health Information (PHI), Social Security Numbers (SSNs), Medical Claims & Diagnostic Data, Banking & Direct Deposit Information.
- **Disclosed Affected Population:** Approximately 100,000,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0000731766-24-000010.
- Statutory filing submitted to HHS OCR (HIPAA Breach Portal Report) under accession HHS-OCR-2024-001.

## Timeline

### 2024-02-21 14:00 UTC
- **Event:** Change Healthcare confirms widespread network disruption to prescription routing, claims processing, and clinical operations.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [UnitedHealth Group Official Disruption Bulletin](https://www.unitedhealthgroup.com/changehealthcarecyberresponse)

### 2024-02-22 17:30 UTC
- **Event:** UnitedHealth Group files SEC Form 8-K Item 1.05 disclosing suspected cybercrime intrusion into Change Healthcare IT environments.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0000731766-24-000010)](https://www.sec.gov/Archives/edgar/data/731766/000073176624000010/uhg-20240221.htm)

### 2024-02-28 19:00 UTC
- **Event:** ALPHV / BlackCat ransomware extortion gang claims responsibility, stating 6 TB of sensitive patient and financial records were exfiltrated.
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [CISA & FBI Joint Cybersecurity Advisory (AA24-060A)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060a)

### 2024-10-24 18:00 UTC
- **Event:** HHS OCR breach portal registers confirmed affected population of approximately 100,000,000 individuals.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [HHS OCR Data Breach Portal Entry (Change Healthcare)](https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf)
