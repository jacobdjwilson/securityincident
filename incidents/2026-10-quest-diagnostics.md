---
id: 2026-10-quest-diagnostics
target: Quest Diagnostics
domain: questdiagnostics.com
status: CONFIRMED
first_seen: 2026-10-22
last_updated: 2026-10-23
threat_actor: null
summary: Official SEC Form 8-K Item 8.01 cybersecurity event disclosure filed by
  Quest Diagnostics.
tags:
  - regulatory
  - sec-8k
  - confirmed
  - threat-intel
  - media-pickup
  - investigative
  - developing
regulatory_filings:
  - regulator: SEC
    form: Form 8-K Item 8.01
    accession_number: 0000947871-26-000941
    url: https://www.sec.gov/Archives/edgar/data/1022079/000094787126000941/0000947871-26-000941-index.htm
    filing_date: 2026-10-22
    description: |
      Item 8.01. Other Events.

      On October 21, 2026, Quest Diagnostics Incorporated (the “Company”) learned of unauthorized access to its Quanum LSM system, which certain clients use to place test orders, receive and look up results. The Company promptly initiated its cybersecurity incident response procedures to contain the activity, assess and investigate the nature and scope of the incident and implement appropriate remedial measures. The Company has notified federal law enforcement authorities and engaged external cybersecurity experts to assist in the investigation and response. While the full scope of unauthorized access remains under investigation, at this time the Company believes that an unauthorized party accessed certain patient records. This incident has not materially disrupted the Company’s business operations or its ability to serve patients.

      The statements in this report which are not historical facts may be forward-looking statements. Readers are cautioned not to place undue reliance on forward-looking statements, which speak only as of the date that they are made and which reflect management’s current estimates, projections, expectations or beliefs and which involve risks and uncertainties that could cause actual results and outcomes to be materially different. Risks and uncertainties that may affect the future results of the company include, but are not limited to, the impact of the incident described in this report, uncertain and volatile economic conditions, adverse results from pending or future government investigations, lawsuits or private actions, the competitive environment, the complexity of billing, reimbursement and revenue recognition for clinical laboratory testing, changes in government policies, including related to trade, and regulations, changing relationships with customers, payers, suppliers or strategic partners, acquisitions and other factors discussed in the company's most recently filed Annual Report on Form 10-K and in any of the company’s subsequently filed Quarterly Reports on Form 10-Q and Current Reports on Form 8-K, including those discussed in the “Business,” “Risk Factors,” “Cautionary Factors that May Affect Future Results” and “Management’s Discussion and Analysis of Financial Condition and Results of Operations” sections of those reports.
industry: Healthcare
incident_type: Unauthorized System Access
compromised_data:
  - Diagnostic Test Orders & Results (Quanum LSM)
---

## Incident Overview

Quest Diagnostics, within its operating sector, has been subject to a cybersecurity incident. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution.

Official SEC Form 8-K Item 8.01 cybersecurity event disclosure filed by Quest Diagnostics.

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `questdiagnostics.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Statutory Disclosures & Compliance

- **SEC Filing:** Form 8-K Item 8.01 (0000947871-26-000941) - [Filing Link](https://www.sec.gov/Archives/edgar/data/1022079/000094787126000941/0000947871-26-000941-index.htm)

## Timeline

### 2026-10-22 16:00 UTC
- **Event:** SEC Form 8-K Item 8.01 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 8.01 Filing (0000947871-26-000941)](https://www.sec.gov/Archives/edgar/data/1022079/000094787126000941/0000947871-26-000941-index.htm)

### 2026-10-23 16:40 UTC
- **Event:** Press Coverage: Quest Diagnostics confirms data breach exposed patient records
- **Verification:** CONFIRMED BY TARGET
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/quest-diagnostics-confirms-data-breach-exposed-patient-records/)

### 2026-10-23 12:52 UTC
- **Event:** Press Coverage: Quest Diagnostics warns of potential data theft after attack on lab service system
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Record by Recorded Future Report](https://therecord.media/quest-diagnostics-network-intrusion)

### 2026-10-23 08:25 UTC
- **Event:** Press Coverage: Quest Diagnostics Data Breach Exposed 'Certain Patient Records'
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/quest-diagnostics-reports-cyber-breach-affecting-certain-patient-records/)
