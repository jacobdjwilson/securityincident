---
id: 2024-06-advance-auto-parts
target: Advance Auto Parts
domain: advanceautoparts.com
status: CONFIRMED
first_seen: '2024-05-23'
last_updated: '2024-06-05'
threat_actor: UNC5537
industry: Retail & Consumer Goods
incident_type: Third-Party Cloud Account Takeover
affected_records: 380000000
compromised_data:
  - Customer Profiles
  - Social Security Numbers (SSNs)
  - Driver License Numbers
  - Purchasing & Loyalty Data
regulatory_filings:
  - regulator: SEC
    form: Form 8-K (Item 1.05)
    accession_number: 0001158449-24-000163
    url: 'https://www.sec.gov/edgar'
summary: >-
  Automotive retailer Advance Auto Parts filed Form 8-K Item 1.05 after
  cybercriminals compromised its cloud database tenant, stealing 380 million
  customer profiles.
tags:
  - regulatory
  - sec-8k
  - retail
  - snowflake-cloud
  - confirmed
---
## Incident Overview

Automotive retailer Advance Auto Parts filed Form 8-K Item 1.05 after cybercriminals compromised its cloud database tenant, stealing 380 million customer profiles.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Customer Profiles, Social Security Numbers (SSNs), Driver License Numbers, Purchasing & Loyalty Data.
- **Disclosed Affected Population:** Approximately 380,000,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001158449-24-000163.

## Timeline

### 2024-05-23 16:30 UTC
- **Event:** Unauthorized actor accesses company's cloud data environment via stolen contractor credentials.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Advance Auto Parts Security Notice](https://corp.advanceautoparts.com/investors)

### 2024-06-04 18:00 UTC
- **Event:** Threat actor offers 380 million customer records for sale on dark web breach forums for $1.5 million.
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Mandiant Threat Intelligence Audit (UNC5537)](https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft)

### 2024-06-05 17:30 UTC
- **Event:** Advance Auto Parts files Form 8-K Item 1.05 confirming exfiltration of customer and employee data files.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001158449-24-000163)](https://www.sec.gov/Archives/edgar/data/1158449/000115844924000163/aap-20240605.htm)
