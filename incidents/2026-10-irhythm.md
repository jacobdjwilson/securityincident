---
id: 2026-10-irhythm
target: iRhythm
domain: irhythm.com
status: CONFIRMED
first_seen: 2026-10-09
last_updated: 2026-10-29
threat_actor: null
summary: Hackers stole patients’ personal information, including names,
  addresses, email addresses, dates of birth, and phone numbers. The post
  iRhythm Data Breach Impacts at Least 360,000 People appeared first on
  SecurityWeek .
tags:
  - threat-intel
  - developing
  - investigative
  - media-pickup
  - regulatory
  - sec-8k
  - confirmed
  - state-ag
  - california
  - washington
compromised_data:
  - Authentication Credentials
  - Customer / Employee PII
regulatory_filings:
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001388658-26-000055
    url: https://www.sec.gov/Archives/edgar/data/1388658/000138865826000055/0001388658-26-000055-index.htm
    filing_date: 2026-06-15
    description: >-
      Item 1.05 Material Cybersecurity Incidents.


      On June 8, 2026, iRhythm Holdings, Inc. (the "Company") identified
      unauthorized activity involving data maintained on certain
      third-party-hosted business applications. The Company promptly activated
      its cybersecurity response plan and launched an investigation with the
      support of external advisors and cybersecurity experts to assess and
      contain the threat. 


      On June 9, 2026, the Company received communications from a threat actor
      claiming to have obtained sensitive information, including proprietary
      data, patient protected health information and other personal information.
      The communications from the threat actor demanded payment in exchange for
      not publicly disclosing this information. Since receipt of the
      communications, the Company has confirmed that certain data was
      exfiltrated from those applications. On June 10, 2026, the Company
      determined that the incident is material in light of the volume of the
      potentially affected data. 


      Based on its investigation as of the date of this Current Report on Form
      8-K, (1) the Company has not identified any impact to its products,
      clinical or medical device systems, patient safety, manufacturing and
      distribution operations, financial reporting systems, or the Company's
      ability to meet patient needs and (2) the affected data was obtained
      through social engineering and is from certain third-party-hosted business
      applications. The incident does not involve the Company's clinical or
      medical device systems or connections to customers and the Company does
      not store or retain individual financial account information or payment
      card information.


      As of the date of this Current Report on Form 8-K, the Company has not
      identified evidence of ongoing unauthorized access to its systems. The
      Company is continuing to investigate the nature and scope of the incident,
      including the categories and volume of the data involved and the
      individuals affected. 


      The Company believes, as of the date of this Current Report on Form 8-K,
      that the incident is not reasonably likely to have a material impact on
      the Company's financial condition or results of operations. The Company
      maintains cybersecurity insurance that may cover certain losses associated
      with the incident, although there can be no assurance that such coverage
      will be sufficient to cover all losses the Company may incur.


      To the extent any information required by
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-630879
    filing_date: 2026-10-06
    description: Official statutory data breach notification submitted by iRhythm
      Technologies to the California Department of Justice under California
      Civil Code § 1798.82 (SB-24), disclosing unauthorized access to personal
      identifiable information of California residents.
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA43155.pdf
    filing_date: 2026-10-06
    description: Official statutory data breach notification submitted by iRhythm
      Technologies to the Washington State Office of the Attorney General
      pursuant to RCW 19.255.010, disclosing unauthorized system access
      impacting 220,745 residents.
affected_records: 220745
---

## Incident Overview

iRhythm, within its operating sector, has been subject to a cybersecurity incident. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution.

Hackers stole patients’ personal information, including names, addresses, email addresses, dates of birth, and phone numbers. The post iRhythm Data Breach Impacts at Least 360,000 People appeared first on SecurityWeek .

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `irhythm.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Authoritative Directives & Vendor Disclosures

- **Continuous Telemetry Monitoring:** Formal statutory regulatory filings (SEC Form 8-K, State AG portals) and sovereign agency advisories (CISA, NCSC) are continuously monitored via automated ingestion pipeline.

## Timeline

### 2026-10-12 11:05 UTC
- **Event:** iRhythm Data Breach Impacts at Least 360,000 People
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/irhythm-data-breach-impacts-over-360000-people/)

### 2026-10-09 16:06 UTC
- **Event:** Press Coverage: Hundreds of thousands impacted by data breach at biosensor firm iRhythm
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Record by Recorded Future Report](https://therecord.media/irhythm-data-breach-reports)

### 2026-06-15 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001388658-26-000055)](https://www.sec.gov/Archives/edgar/data/1388658/000138865826000055/0001388658-26-000055-index.htm)

### 2026-10-06 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-630879)

### 2026-10-06 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA43155.pdf)

### 2026-10-29 08:27 UTC
- **Event:** Press Coverage: HHS Filing Puts iRhythm Data Breach Toll at 8.2 Million
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/hhs-filing-puts-irhythm-data-breach-toll-at-8-2-million/)
