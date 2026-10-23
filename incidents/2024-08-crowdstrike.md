---
id: 2024-08-crowdstrike
target: CrowdStrike
domain: crowdstrike.com
status: CONFIRMED
first_seen: 2024-08-08
last_updated: 2026-09-07
threat_actor: null
summary: Healthcare data breach disclosure submitted to federal regulators by
  CrowdStrike.
tags:
  - regulatory
  - hhs-ocr
  - healthcare
  - confirmed
  - threat-intel
  - developing
  - media-pickup
industry: Healthcare
incident_type: Protected Health Information (PHI) Breach
compromised_data:
  - Protected Health Information (PHI)
  - Patient Medical Records
  - Windows Kernel Driver Configuration
  - Global Infrastructure Availability
regulatory_filings:
  - regulator: HHS OCR
    form: HIPAA Breach Portal Disclosure
    url: https://www.hipaajournal.com/crowdstrike-issues-update-on-outage-cause-healthcare-hit-hardest-with-estimated-1-94b-in-losses/
    filing_date: 2024-08-08
    description: As promised, CrowdStrike has published the root cause analysis of
      the faulty Falcon Sensor software update that caused Windows devices
      [&#8230;] The post CrowdStrike Confirms Root Cause of Falcon Sensor
      Outage; Healthcare Losses Anticipated to be $1.94B appeared first on The
      HIPAA Journal .
affected_records: 8500000
---

## Incident Overview

CrowdStrike, operating within the Healthcare sector, has been subject to a cybersecurity incident classified as Protected Health Information (PHI) Breach. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution.

Healthcare data breach disclosure submitted to federal regulators by CrowdStrike.

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `crowdstrike.com`.

Identified categories of compromised data and impacted assets include:
- Protected Health Information (PHI)
- Patient Medical Records

## Statutory Disclosures & Compliance

- **HHS OCR Filing:** HIPAA Breach Portal Disclosure (2024-08-08) - [Filing Link](https://www.hipaajournal.com/crowdstrike-issues-update-on-outage-cause-healthcare-hit-hardest-with-estimated-1-94b-in-losses/)

## Timeline

### 2024-08-08 15:00 UTC
- **Event:** HHS OCR Healthcare Data Breach Disclosure: CrowdStrike Confirms Root Cause of Falcon Sensor Outage; Healthcare Losses Anticipated to be $1.94B
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [HHS OCR Regulatory Healthcare Breach Report](https://www.hipaajournal.com/crowdstrike-issues-update-on-outage-cause-healthcare-hit-hardest-with-estimated-1-94b-in-losses/)

### 2026-09-07 08:28 UTC
- **Event:** Press Coverage: Researcher Publishes CrowdStrike Privilege Escalation Zero Day
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/crowdstrike-privilege-escalation/)
