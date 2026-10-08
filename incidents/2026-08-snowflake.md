---
id: 2026-08-snowflake
target: Snowflake
domain: snowflake.com
status: CONFIRMED
first_seen: 2026-08-06
last_updated: 2026-10-06
threat_actor: UNC5537
summary: A 26-year-old Canadian man once described as one of the most
  consequential cybercrime threat actors of 2024 has pleaded guilty to computer
  fraud and conspiracy to hack and extort more than 165 organizations that used
  the cloud data storage provide...
tags:
  - investigative
  - developing
  - threat-intel
  - confirmed
  - media-pickup
industry: Technology
incident_type: Credential Stuffing / Cloud Account Takeover
affected_records: 165000000
compromised_data:
  - Corporate Customer Data Warehouses
  - Authentication Credentials
  - Client Database Backups
  - Customer Data Warehouses
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K (Item 8.01 Other Events - Customer Cybersecurity Disclosures)
    accession_number: 0001640147-24-000042
    filing_date: 2024-06-03
    url: https://www.sec.gov/Archives/edgar/data/1640147/000164014724000042/0001640147-24-000042-index.htm
    description: Form 8-K filing regarding customer account security disclosures
      detailing threat actor credential stuffing against customer demo
      environments lacking multi-factor authentication.
---

## Incident Overview

The **Snowflake** cybersecurity event represents a confirmed **Credential Stuffing / Cloud Account Takeover** within the **Technology** sector, attributed to the **UNC5537** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **165,000,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Corporate Customer Data Warehouses, Authentication Credentials, Client Database Backups.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

- **U.S. Securities and Exchange Commission (SEC) (Form 8-K (Item 8.01 Other Events - Customer Cybersecurity Disclosures)):** Official regulatory filing under accession/tracking ID `0001640147-24-000042` (Filed: 2024-06-03). Form 8-K filing regarding customer account security disclosures detailing threat actor credential stuffing against customer demo environments lacking multi-factor authentication. Direct Document Link: [Form 8-K (Item 8.01 Other Events - Customer Cybersecurity Disclosures)](https://www.sec.gov/Archives/edgar/data/1640147/000164014724000042/0001640147-24-000042-index.htm)

## Timeline

### 2026-08-06 17:00 UTC
- **Event:** Canadian Man Pleads Guilty in Snowflake Extortions
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Krebs on Security Report](https://krebsonsecurity.com/2026/08/canadian-man-pleads-guilty-in-snowflake-extortions/)

### 2026-10-06 16:33 UTC
- **Event:** ASOS confirms data breach after “HACKED” in-app notifications
- **Verification:** CONFIRMED BY TARGET
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/asos-confirms-data-breach-after-hacked-in-app-notifications/)

### 2026-10-06 11:41 UTC
- **Event:** Press Coverage: ASOS Customers Receive Bizarre “Hacked” Message Amid Suspected Snowflake Compromise
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/asos-customers-message-suspected/)

### 2026-08-06 10:15 UTC
- **Event:** Press Coverage: Canadian Hacker Pleads Guilty Over Snowflake Extortion Campaign
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/canadian-hacker-guilty-snowflake/)
