---
id: 2026-10-revolve-group
target: Revolve Group
domain: revolvegroup.com
status: CONFIRMED
first_seen: 2026-10-29
last_updated: 2026-10-30
threat_actor: null
summary: State of California Department of Justice data breach disclosure notice
  filed by Revolve Group.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
  - washington
  - sec-8k
  - acknowledged
regulatory_filings:
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice (sb24-632070)
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-632070
    filing_date: 2026-10-29
    description: Official statutory data breach notification submitted by Revolve
      Group to the California Department of Justice under California Civil Code
      § 1798.82 (SB-24), disclosing unauthorized access to personal identifiable
      information of California residents.
    accession_number: sb24-632070
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice (BreachA43565)
    accession_number: BreachA43565
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA43565.pdf
    filing_date: 2026-10-29
    description: Official statutory data breach notification submitted by Revolve
      Group to the Washington State Office of the Attorney General pursuant to
      RCW 19.255.010, disclosing unauthorized system access impacting 24,859
      residents.
  - regulator: SEC
    form: Form 8-K Item 8.01
    accession_number: 0001193125-26-439022
    url: https://www.sec.gov/Archives/edgar/data/1746618/000119312526439022/0001193125-26-439022-index.htm
    filing_date: 2026-10-30
    description: >-
      Item 8.01 Other Events.


      Revolve Group, Inc. (the "Company") recently became aware of unauthorized
      access to certain of its systems. The Company promptly initiated its cyber
      incident response protocols and confirmed the unauthorized activity was
      remediated. The Company proceeded to assess and investigate the scope of
      the incident and to identify and implement enhanced security measures
      designed to prevent a similar event from occurring. The Company also
      notified federal law enforcement authorities and engaged leading external
      cybersecurity experts to assist with the investigation and response
      efforts. 


      Based on its investigation, the Company believes that an unauthorized
      actor may have obtained, through automated means, the name, contact
      information, payment card number and payment card expiration date for
      certain customers who saved payment information associated with their
      online shopping account on the Company's e-commerce platform.


      This incident has not resulted in operational disruption or interrupted
      service to any customers, and as of the date of this report, the Company
      does not believe this incident will have a material impact on its
      business.


      Cautionary Note Regarding Forward-Looking Statements


      This Current Report on Form 8-K contains "forward-looking statements"
      within the meaning of the safe harbor provisions of the U.S. Private
      Securities Litigation Reform Act of 1995. All statements other than
      statements of historical or current fact included in this Current Report
      on Form 8-K are forward-looking statements, including but not limited to
      statements regarding the Company's current beliefs, understanding and
      expectations regarding the cybersecurity incident discussed in this
      Current Report on Form 8-K and its impact on the Company's business.
      Forward-looking statements include statements containing words such as
      "expect," "anticipate," "believe," "project," "will" and similar
      expressions intended to identify forward-looking statements. These
      forward-looking statements are based on the Company's current
      expectations. Forward-looking statements involve risks and uncertainties.
      The Company's actual results could differ materially from those
      anticipated in such forward-looking statements as a result of these risks
      and uncertainties, which include, without limitation, risks related to the
      outcome of the Company's ongoing assessment of the incident and its
      ability to address the impact of this incident; legal, regulatory,
      reputational and financial risks resulting from this incident or
      additional incidents; and other risks and uncertainties included under the
      caption "Risk Factors" and elsewhere in the Company's filings with the
      Securities and Exchange Commission ("SEC"), including, without limitation,
      the Annual Report on Form 10-K for the year ended December 31, 2025, and
      subsequent Quarterly Reports on Form 10-Q, including for the quarter ended
      June 30, 2026, filed with the SEC on August 4, 2026. You are cautioned not
      to place undue reliance on these forward-looking statements, which speak
      only as of the date of this Current Report on Form 8-K. All
      forward-looking statements are qualified in their entirety by this
      cautionary statement, and the Company undertakes no obligation to revise
      or update any forward-looking statements to reflect events or
      circumstances after the date hereof.
compromised_data:
  - Authentication Credentials
affected_records: 24859
---

## Incident Overview

Revolve Group, within its operating sector, has been subject to a cybersecurity incident. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution.

State of California Department of Justice data breach disclosure notice filed by Revolve Group.

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `revolvegroup.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Statutory Disclosures & Compliance

- **California Department of Justice Filing:** SB-24 Data Breach Notice (2026-10-29) - [Filing Link](https://oag.ca.gov/ecrime/databreach/reports/sb24-632070)

## Timeline

### 2026-10-29 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-632070)

### 2026-10-29 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA43565.pdf)

### 2026-10-30 16:00 UTC
- **Event:** SEC Form 8-K Item 8.01 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 8.01 Filing (0001193125-26-439022)](https://www.sec.gov/Archives/edgar/data/1746618/000119312526439022/0001193125-26-439022-index.htm)
