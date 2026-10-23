---
id: 2024-02-change-healthcare
target: Change Healthcare
domain: changehealthcare.com
status: CONFIRMED
first_seen: 2024-02-21
last_updated: 2024-10-24
threat_actor: ALPHV / BlackCat
industry: Healthcare
incident_type: Ransomware Extortion & Healthcare Pipeline Disruption
affected_records: 100000000
compromised_data:
  - Protected Health Information (PHI)
  - Social Security Numbers (SSNs)
  - Medical Claims & Diagnostic Data
  - Banking & Direct Deposit Information
  - Medical Claims
  - Billing Information
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0000731766-24-000010
    filing_date: 2024-02-21
    url: https://www.sec.gov/Archives/edgar/data/731766/000073176624000010/uhg-20240221.htm
    description: Item 1.05 Material Cybersecurity Incident disclosure filed by
      UnitedHealth Group reporting suspected cybercrime intrusion into Change
      Healthcare IT environments resulting in nationwide healthcare billing and
      pharmacy disruptions.
  - regulator: HHS OCR
    form: HIPAA Breach Portal Report
    accession_number: HHS-OCR-2024-001
    url: https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf
    description: Formal healthcare data breach notification submitted by Change
      Healthcare to the U.S. Department of Health and Human Services (HHS)
      Office for Civil Rights (OCR) under HIPAA Breach Notification Rule 45 CFR
      §§ 164.400-414.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0000731766-24-000045
    url: https://www.sec.gov/Archives/edgar/data/731766/000073176624000045/0000731766-24-000045-index.htm
    filing_date: 2024-02-22
    description: >-
      Item 1.05. Material Cybersecurity Incidents.


      On February 21, 2024, UnitedHealth Group (the "Company") identified a
      suspected nation-state associated cyber security threat actor had gained
      access to some of the Change Healthcare information technology systems.
      Immediately upon detection of this outside threat, the Company proactively
      isolated the impacted systems from other connecting systems in the
      interest of protecting our partners and patients, to contain, assess and
      remediate the incident. 


      The Company is working diligently to restore those systems and resume
      normal operations as soon as possible, but cannot estimate the duration or
      extent of the disruption at this time. The Company has retained leading
      security experts, is working with law enforcement and notified customers,
      clients and certain government agencies. At this time, the Company
      believes the network interruption is specific to Change Healthcare
      systems, and all other systems across the Company are operational. 


      During the disruption, certain networks and transactional services may not
      be accessible. The Company is providing updates on the incident at
      https://status.changehealthcare.com/incidents/hqpjz25fn3n7. Please access
      that site for further information.


      As of the date of this report, the Company has not determined the incident
      is reasonably likely to materially impact the Company's financial
      condition or results of operations.


      Forward-Looking Statements 


      This Current Report on Form 8-K contains "forward-looking statements"
      which are intended to take advantage of the "safe harbor" provisions of
      the federal securities law. The words "believe," "expect," "intend,"
      "estimate," "anticipate," "forecast," "outlook," "plan," "project,"
      "should" and similar expressions identify forward-looking statements.
      These forward-looking statements are based on management's current
      expectations and assumptions; however, by their nature, forward-looking
      statements are subject to risks, uncertainties and assumptions that are
      difficult to predict or quantify. You should not place undue reliance on
      forward-looking statements, which speak only as of the date they are made.
      Certain important factors that could cause actual results to differ,
      possibly materially, from expectations or estimates reflected in such
      forward-looking statements can be found in the "Risk Factors" and
      "Forward-Looking Statements" sections included in the Company's Annual
      Reports on Form 10-K and Quarterly Reports on Form 10-Q. We do not
      undertake to update or revise any forward-looking statements, except as
      required by law.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0000731766-24-000085
    url: https://www.sec.gov/Archives/edgar/data/731766/000073176624000085/0000731766-24-000085-index.htm
    filing_date: 2024-03-08
    description: >-
      Item 1.05. Material Cybersecurity Incidents.


      As an update to the Original Report, the Company identified that
      cybercrime threat actors had gained access to certain Change Healthcare
      information technology systems. Immediately upon detection of this outside
      threat, the Company isolated the impacted systems from other connected
      systems in order to protect the Company's partners and customers. The
      Company promptly notified customers, law enforcement and government
      agencies. 


      The Company is making substantial progress in mitigating the impact to
      consumers and care providers of the unprecedented cyberattack on the U.S.
      health system and certain Change Healthcare services. The Company's focus
      has been on ensuring patient access to care and medications by addressing
      challenges to pharmacy, medical claims and payment services targeted by
      the attack. The Company is working tirelessly to restore affected services
      and resume normal operations and along with law enforcement is
      investigating the extent of impacted data. The Company continues to
      believe the issue is specific to Change Healthcare. All other systems
      across the Company are operational.


      The progress the Company is making, including interim measures and an
      expected timeline for restoration of key Change Healthcare systems, is
      described in a press release which the Company issued on March 7, 2024, a
      copy of which is attached to the Amendment as Exhibit 99.1. 


      As of the date of this Amendment, the Company has not determined the
      incident is reasonably likely to materially impact the Company's financial
      condition or results of operations.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0000731766-24-000150
    url: https://www.sec.gov/Archives/edgar/data/731766/000073176624000150/0000731766-24-000150-index.htm
    filing_date: 2024-04-24
    description: >-
      Item 1.05. Material Cybersecurity Incidents.


      As an update to information concerning the Change Healthcare cyberattack
      contained in the Filed Reports, the Company issued a press release on
      April 22, 2024, regarding its ongoing data assessment and support for
      impacted individuals, support for providers and customers with
      notifications, and Change Healthcare service restoration progress. A copy
      of the press release is attached to the Amendment as Exhibit 99.1 and
      incorporated by reference herein.
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA30075.pdf
    filing_date: 2024-08-03
    description: Official statutory data breach notification submitted by Change
      Healthcare to the Washington State Office of the Attorney General pursuant
      to RCW 19.255.010, disclosing unauthorized system access impacting
      3,121,209 residents.
agency_advisories:
  - agency: CISA & FBI (Joint Advisory)
    advisory_id: AA24-060A (#StopRansomware ALPHV BlackCat)
    advisory_type: Joint Cybersecurity Advisory (CSA)
    release_date: 2024-02-28
    url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060a
    description: Joint CISA and FBI Cybersecurity Advisory providing technical
      indicators of compromise (IOCs), tactics, techniques, and procedures
      (TTPs) associated with the ALPHV BlackCat ransomware deployment targeting
      Change Healthcare and the Healthcare and Public Health (HPH) Sector.
summary: Change Healthcare (UnitedHealth Group) suffered a devastating ALPHV /
  BlackCat ransomware extortion attack halting healthcare clearinghouse networks
  nationwide and impacting 100M individuals.
tags:
  - regulatory
  - sec-8k
  - hhs-ocr
  - healthcare
  - ransomware
  - confirmed
  - state-ag
  - washington
---

## Incident Overview

Change Healthcare (UnitedHealth Group) suffered a devastating ALPHV / BlackCat ransomware extortion attack halting healthcare clearinghouse networks nationwide and impacting 100M individuals.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Protected Health Information (PHI), Social Security Numbers (SSNs), Medical Claims & Diagnostic Data, Banking & Direct Deposit Information.
- **Disclosed Affected Population:** Approximately 100,000,000 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0000731766-24-000010.
- Statutory filing submitted to HHS OCR (HIPAA Breach Portal Report) under accession HHS-OCR-2024-001.

## Timeline

### 2024-02-21 14:00 UTC
- **Event:** Change Healthcare confirms widespread network disruption to prescription routing, claims processing, and clinical operations.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [UnitedHealth Group Official Disruption Bulletin](https://www.unitedhealthgroup.com/changehealthcarecyberresponse)

### 2024-02-22 17:30 UTC
- **Event:** UnitedHealth Group files SEC Form 8-K Item 1.05 disclosing suspected cybercrime intrusion into Change Healthcare IT environments.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0000731766-24-000010)](https://www.sec.gov/Archives/edgar/data/731766/000073176624000010/uhg-20240221.htm)

### 2024-02-28 19:00 UTC
- **Event:** CISA and the FBI issue joint emergency cybersecurity advisory detailing ALPHV / BlackCat indicators and tactics used against healthcare networks.
- **Verification:** GOVERNMENT ADVISORY
- **Source:** [CISA & FBI Joint Cybersecurity Advisory (AA24-060A)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060a)

### 2024-10-24 18:00 UTC
- **Event:** HHS OCR breach portal registers confirmed affected population of approximately 100,000,000 individuals.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [HHS OCR Data Breach Portal Entry (Change Healthcare)](https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf)

### 2024-02-22 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0000731766-24-000045)](https://www.sec.gov/Archives/edgar/data/731766/000073176624000045/0000731766-24-000045-index.htm)

### 2024-03-08 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0000731766-24-000085)](https://www.sec.gov/Archives/edgar/data/731766/000073176624000085/0000731766-24-000085-index.htm)

### 2024-04-24 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0000731766-24-000150)](https://www.sec.gov/Archives/edgar/data/731766/000073176624000150/0000731766-24-000150-index.htm)

### 2024-08-03 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA30075.pdf)
