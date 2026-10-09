---
id: 2024-01-microsoft-midnight-blizzard
target: Microsoft
domain: microsoft.com
status: CONFIRMED
first_seen: '2024-01-12'
last_updated: '2026-10-01'
threat_actor: Midnight Blizzard (APT29)
industry: Technology
incident_type: Nation-State Password Spray & Cloud Access
affected_records: null
compromised_data:
  - Senior Leadership Corporate Email Accounts
  - Cybersecurity Strategy Communications
  - Source Code Repositories
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0000789019-24-000004
    filing_date: '2024-01-19'
    url: >-
      https://www.sec.gov/Archives/edgar/data/789019/000078901924000004/msft-20240119.htm
    description: >-
      Item 1.05 Material Cybersecurity Incident disclosure filed by Microsoft
      Corporation regarding Russian state-sponsored threat actor Midnight
      Blizzard accessing senior leadership email accounts and internal
      cybersecurity communications.
vendor_advisories:
  - publisher: Microsoft Security Response Center (MSRC)
    advisory_id: MSRC Incident Advisory
    title: Microsoft Actions Following Attack by Nation-State Actor Midnight Blizzard
    severity: Critical
    release_date: '2024-01-19'
    url: https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/
    description: >-
      Official Microsoft Security Response Center disclosure detailing password
      spray operations by Nobelium / Midnight Blizzard against non-production legacy
      test tenants, privilege granting to malicious OAuth applications, and access
      to corporate email accounts.
summary: >-
  Microsoft disclosed an intrusion by Russian foreign intelligence threat group
  Midnight Blizzard (APT29), accessing senior leadership corporate emails and
  source code.
tags:
  - regulatory
  - sec-8k
  - nation-state
  - apt29
  - confirmed
  - threat-intel
  - developing
---
## Incident Overview

Microsoft disclosed an intrusion by Russian foreign intelligence threat group Midnight Blizzard (APT29), accessing senior leadership corporate emails and source code.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Senior Leadership Corporate Email Accounts, Cybersecurity Strategy Communications, Source Code Repositories.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0000789019-24-000004.

## Timeline

### 2024-01-12 18:00 UTC
- **Event:** Microsoft security team detects Russian state-sponsored threat actor Midnight Blizzard accessing corporate email systems via legacy OAuth tenant test account.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Microsoft Security Response Center (MSRC) Advisory](https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/)

### 2024-01-19 21:00 UTC
- **Event:** Microsoft files Form 8-K Item 1.05 detailing Midnight Blizzard intrusion into senior executive email accounts and cybersecurity staff communications.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0000789019-24-000004)](https://www.sec.gov/Archives/edgar/data/789019/000078901924000004/msft-20240119.htm)

### 2024-03-08 17:00 UTC
- **Event:** Microsoft Form 8-K update discloses threat actor used exfiltrated email secrets to gain unauthorized access to internal source code repositories.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 Update (Adsh 0000789019-24-000008)](https://www.sec.gov/Archives/edgar/data/789019/000078901924000008/msft-20240308.htm)

### 2026-10-01 19:32 UTC
- **Event:** Microsoft says threat actors are ahead in the early AI race
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/microsoft-says-threat-actors-are-ahead-in-the-early-ai-race/)
