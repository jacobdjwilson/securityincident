---
id: 2026-02-drivestream
target: Drivestream
domain: drivestream.com
status: CONFIRMED
first_seen: 2025-12-19
last_updated: 2026-02-27
threat_actor: null
summary: Washington State Attorney General formal data breach disclosure notice
  filed by Drivestream affecting 505 residents.
tags:
  - regulatory
  - state-ag
  - washington
  - confirmed
  - california
affected_records: 505
regulatory_filings:
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA36840.pdf
    filing_date: 2026-02-27
    description: Official statutory data breach notification submitted by
      Drivestream to the Washington State Office of the Attorney General
      pursuant to RCW 19.255.010, disclosing unauthorized system access
      impacting 505 residents.
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-616043
    filing_date: 2025-12-19
    description: Official statutory data breach notification submitted by
      Drivestream to the California Department of Justice under California Civil
      Code § 1798.82 (SB-24), disclosing unauthorized access to personal
      identifiable information of California residents.
compromised_data:
  - Authentication Credentials
---

## Incident Overview

Drivestream, within its operating sector, has been subject to a cybersecurity incident. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution.

Washington State Attorney General formal data breach disclosure notice filed by Drivestream affecting 505 residents.

## Compromised Assets & Data Scope

Current disclosures quantify the affected population at approximately 505 records/individuals. Primary affected online infrastructure and perimeter domains include `drivestream.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Statutory Disclosures & Compliance

- **Washington Attorney General Filing:** RCW 19.255 Data Breach Notice (2026-02-27) - [Filing Link](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA36840.pdf)

## Timeline

### 2026-02-27 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA36840.pdf)

### 2025-12-19 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-616043)
