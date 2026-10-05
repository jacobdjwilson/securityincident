---
id: 2024-01-hewlett-packard-enterprise
target: Hewlett Packard Enterprise
domain: hpe.com
status: CONFIRMED
first_seen: '2024-01-19'
last_updated: '2024-01-24'
threat_actor: Midnight Blizzard (APT29)
industry: Technology
incident_type: Nation-State Cloud Intrusion
affected_records: null
compromised_data:
  - Cybersecurity Team Mailboxes
  - Executive Communications
  - Legal & Business Unit Records
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001645590-24-000003
    filing_date: '2024-01-19'
    url: >-
      https://www.sec.gov/Archives/edgar/data/1645590/000164559024000003/hpe-20240119.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by Hewlett
      Packard Enterprise Company reporting nation-state actor Midnight Blizzard
      accessing corporate cloud email environment and exfiltrating messages.
summary: >-
  Hewlett Packard Enterprise filed Form 8-K Item 1.05 disclosing that
  nation-state actor Midnight Blizzard compromised its cloud-based Office 365
  email environment.
tags:
  - regulatory
  - sec-8k
  - technology
  - nation-state
  - confirmed
---
## Incident Overview

Hewlett Packard Enterprise filed Form 8-K Item 1.05 disclosing that nation-state actor Midnight Blizzard compromised its cloud-based Office 365 email environment.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Cybersecurity Team Mailboxes, Executive Communications, Legal & Business Unit Records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001645590-24-000003.

## Timeline

### 2024-01-19 16:30 UTC
- **Event:** HPE notified that nation-state actor Midnight Blizzard gained unauthorized access to Office 365 cloud email environment.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [HPE Press & Security Disclosure Notice](https://www.hpe.com/us/en/newsroom/press-releases/2024/01/hpe-security-update.html)

### 2024-01-24 17:00 UTC
- **Event:** HPE files Form 8-K Item 1.05 disclosing data exfiltration from cybersecurity, legal, and operational team mailboxes dating back to May 2023.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001645590-24-000003)](https://www.sec.gov/Archives/edgar/data/1645590/000164559024000003/hpe-20240119.htm)
