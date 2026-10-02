---
id: 2024-01-loandepot
target: LoanDepot
domain: loandepot.com
status: CONFIRMED
first_seen: '2024-01-08'
last_updated: '2024-01-22'
threat_actor: Unknown / Unattributed
industry: Financial Services
incident_type: Ransomware Extortion & Encryption
affected_records: 16600000
compromised_data:
  - Social Security Numbers (SSNs)
  - Mortgage Applications & Financial Statements
  - Bank Account Numbers
  - Personal Identifiable Information (PII)
  - Mortgage Applications
  - Customer PII
regulatory_filings:
  - regulator: SEC
    form: Form 8-K (Item 1.05)
    accession_number: 0001831631-24-000002
    url: 'https://www.sec.gov/edgar'
summary: >-
  LoanDepot filed Form 8-K Item 1.05 disclosing a major ransomware extortion
  attack encrypting mortgage servicing systems and compromising 16.6 million
  customers.
tags:
  - regulatory
  - sec-8k
  - financial
  - mortgage
  - confirmed
---
## Incident Overview

LoanDepot filed Form 8-K Item 1.05 disclosing a major ransomware extortion attack encrypting mortgage servicing systems and compromising 16.6 million customers.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Social Security Numbers (SSNs), Mortgage Applications & Financial Statements, Bank Account Numbers, Personal Identifiable Information (PII).
- **Disclosed Affected Population:** Approximately 16,600,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001831631-24-000002.

## Timeline

### 2024-01-08 15:00 UTC
- **Event:** LoanDepot detects unauthorized cyber incident that encrypted company systems and took loan servicing portals offline.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [LoanDepot Cybersecurity Response Bulletin](https://www.loandepot.com/cybersecurity-notice)

### 2024-01-11 17:15 UTC
- **Event:** LoanDepot files Form 8-K Item 1.05 confirming unauthorized third-party access and ransomware encryption.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001831631-24-000002)](https://www.sec.gov/Archives/edgar/data/1831631/000183163124000002/lndi-20240108.htm)

### 2024-01-22 18:00 UTC
- **Event:** Form 8-K Item 1.05 amendment confirms sensitive personal data of approximately 16.6 million individuals was exfiltrated.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K/A Item 1.05 (Adsh 0001831631-24-000004)](https://www.sec.gov/Archives/edgar/data/1831631/000183163124000004/lndi-20240122.htm)
