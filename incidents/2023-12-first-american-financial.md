---
id: 2023-12-first-american-financial
target: First American Financial
domain: firstam.com
status: CONFIRMED
first_seen: '2023-12-20'
last_updated: '2024-01-16'
threat_actor: Unknown / Unattributed
industry: Financial Services
incident_type: Network Intrusion & Disruption
affected_records: 44000
compromised_data:
  - Title Insurance Records
  - Escrow Documents
  - Customer Identifiers
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001472787-23-000072
    filing_date: '2023-12-20'
    url: >-
      https://www.sec.gov/Archives/edgar/data/1472787/000147278723000072/faf-20231220.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by First
      American Financial Corporation regarding cybersecurity incident leading to
      isolation of systems and disruption of title and closing operations.
summary: >-
  First American Financial filed the very first SEC Form 8-K Item 1.05
  disclosure under the SEC mandate following an unauthorized network intrusion
  that disabled title portals.
tags:
  - regulatory
  - sec-8k
  - financial
  - title-insurance
  - confirmed
---
## Incident Overview

First American Financial filed the very first SEC Form 8-K Item 1.05 disclosure under the SEC mandate following an unauthorized network intrusion that disabled title portals.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Title Insurance Records, Escrow Documents, Customer Identifiers.
- **Disclosed Affected Population:** Approximately 44,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001472787-23-000072.

## Timeline

### 2023-12-20 18:00 UTC
- **Event:** First American detects unauthorized cybersecurity activity and isolates systems, taking email, title production, and web portals offline.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [First American Cybersecurity Advisory](https://www.firstam.com/update)

### 2023-12-22 17:15 UTC
- **Event:** First American files SEC Form 8-K Item 1.05—marking the landmark first-ever disclosure under the SEC's material cybersecurity disclosure mandate.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001472787-23-000072)](https://www.sec.gov/Archives/edgar/data/1472787/000147278723000072/faf-20231220.htm)

### 2024-01-16 16:45 UTC
- **Event:** Form 8-K Item 1.05 amendment confirms core title and escrow transaction systems are restored and operational.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K/A Item 1.05 (Adsh 0001472787-24-000003)](https://www.sec.gov/Archives/edgar/data/1472787/000147278724000003/faf-20240116.htm)
