---
id: 2024-02-prudential-financial
target: Prudential Financial
domain: prudential.com
status: CONFIRMED
first_seen: '2024-02-05'
last_updated: '2024-03-29'
threat_actor: ALPHV / BlackCat
industry: Financial Services
incident_type: Administrative Cloud Intrusion
affected_records: 32183
compromised_data:
  - Employee & Contractor Records
  - Administrative Credentials
  - Limited Customer Identification Data
  - Employee Records
  - Contractor Information
  - Limited Customer PII
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001137774-24-000012
    filing_date: '2024-02-12'
    url: >-
      https://www.sec.gov/Archives/edgar/data/1137774/000113777424000012/pru-20240212.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by Prudential
      Financial, Inc. reporting cybercrime threat group accessing administrative
      systems and user credential data.
summary: >-
  Prudential Financial filed Form 8-K Item 1.05 following an administrative
  system intrusion by the ALPHV / BlackCat ransomware group compromising
  employee and user data.
tags:
  - regulatory
  - sec-8k
  - financial
  - insurance
  - confirmed
---
## Incident Overview

Prudential Financial filed Form 8-K Item 1.05 following an administrative system intrusion by the ALPHV / BlackCat ransomware group compromising employee and user data.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Employee & Contractor Records, Administrative Credentials, Limited Customer Identification Data.
- **Disclosed Affected Population:** Approximately 32,183 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001137774-24-000012.

## Timeline

### 2024-02-05 16:00 UTC
- **Event:** Threat actor breaches internal administrative network environments and exfiltrates corporate data files.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Prudential Information Security Bulletin](https://www.prudential.com/links/security)

### 2024-02-13 18:30 UTC
- **Event:** Prudential files Form 8-K Item 1.05 disclosing unauthorized access to administrative and internal user directories.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001137774-24-000012)](https://www.sec.gov/Archives/edgar/data/1137774/000113777424000012/pru-20240212.htm)

### 2024-03-29 17:00 UTC
- **Event:** Form 8-K Item 1.05 amendment updates scope to confirm 32,183 individuals impacted by exfiltration.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K/A Item 1.05 (Adsh 0001137774-24-000028)](https://www.sec.gov/Archives/edgar/data/1137774/000113777424000028/pru-20240329.htm)
