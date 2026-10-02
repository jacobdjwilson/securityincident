---
id: 2023-12-vf-corporation
target: VF Corporation
domain: vfc.com
status: CONFIRMED
first_seen: '2023-12-13'
last_updated: '2024-01-18'
threat_actor: ALPHV / BlackCat
industry: Retail & Consumer Goods
incident_type: Ransomware Extortion & Encryption
affected_records: 35500000
compromised_data:
  - Customer Personal Information
  - Order History Records
  - Account Contact Details
  - Order Records
  - Account Details
regulatory_filings:
  - regulator: SEC
    form: Form 8-K (Item 1.05)
    accession_number: 0000103379-23-000039
    url: 'https://www.sec.gov/edgar'
summary: >-
  VF Corporation (parent of Vans, The North Face, and Timberland) filed Form 8-K
  Item 1.05 following an ALPHV ransomware attack compromising 35.5 million
  customer records.
tags:
  - regulatory
  - sec-8k
  - retail
  - ransomware
  - confirmed
---
## Incident Overview

VF Corporation (parent of Vans, The North Face, and Timberland) filed Form 8-K Item 1.05 following an ALPHV ransomware attack compromising 35.5 million customer records.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Customer Personal Information, Order History Records, Account Contact Details.
- **Disclosed Affected Population:** Approximately 35,500,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0000103379-23-000039.

## Timeline

### 2023-12-13 19:00 UTC
- **Event:** Threat actor encrypts operational IT systems and exfiltrates corporate data from apparel conglomerate VF Corp.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [VF Corporation Incident Briefing](https://www.vfc.com/news)

### 2023-12-18 17:30 UTC
- **Event:** VF Corp files Form 8-K Item 1.05 disclosing material disruption to retail logistics and e-commerce order processing.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0000103379-23-000039)](https://www.sec.gov/Archives/edgar/data/103379/000010337923000039/vfc-20231215.htm)

### 2024-01-18 18:00 UTC
- **Event:** Form 8-K Item 1.05 update confirms 35.5 million individual customer records compromised during the intrusion.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 Update (Adsh 0000103379-24-000003)](https://www.sec.gov/Archives/edgar/data/103379/000010337924000003/vfc-20240118.htm)
