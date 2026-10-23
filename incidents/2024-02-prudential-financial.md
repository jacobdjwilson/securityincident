---
id: 2024-02-prudential-financial
target: Prudential Financial
domain: prudential.com
status: CONFIRMED
first_seen: 2024-02-05
last_updated: 2024-03-29
threat_actor: ALPHV / BlackCat
industry: Financial Services
incident_type: Administrative Cloud Intrusion
affected_records: 32183
compromised_data:
  - Employee & Contractor Records
  - Administrative Credentials
  - Limited Customer Identification Data
  - Employee Records
  - Contractor Information
  - Limited Customer PII
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001137774-24-000012
    filing_date: 2024-02-12
    url: https://www.sec.gov/Archives/edgar/data/1137774/000113777424000012/pru-20240212.htm
    description: Item 1.05 Material Cybersecurity Incident disclosure filed by
      Prudential Financial, Inc. reporting cybercrime threat group accessing
      administrative systems and user credential data.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001193125-24-033753
    url: https://www.sec.gov/Archives/edgar/data/1137774/000119312524033753/0001193125-24-033753-index.htm
    filing_date: 2024-02-13
    description: >-
      Item 1.05

      Material Cybersecurity Incidents. 


      On February 5, 2024, Prudential Financial, Inc. (the "Company" or "we")
      detected that, beginning February 4, 2024, a threat actor had gained
      unauthorized access to certain of our systems. With assistance from
      external cybersecurity experts, we immediately activated our cybersecurity
      incident response process to investigate, contain, and remediate the
      incident. As of the date of this Report, we believe that the threat actor,
      who we suspect to be a cybercrime group, accessed Company administrative
      and user data from certain information technology systems and a small
      percentage of Company user accounts associated with employees and
      contractors. 


      We continue to investigate the extent of the incident, including whether
      the threat actor accessed any additional information or systems, to
      determine the impact of the incident. On the basis of the investigation to
      date, we do not have any evidence that the threat actor has taken customer
      or client data. We have reported this matter to relevant law enforcement
      and are informing regulatory authorities. As of the date of this Report,
      the incident has not had a material impact on the Company's operations,
      and the Company has not determined the incident is reasonably likely to
      materially impact the Company's financial condition or results of
      operations. 


      Cautionary Statement Regarding Forward Looking Statements 


      Certain of the statements included in this Report constitute
      forward-looking statements within the meaning of the U.S. Private
      Securities Litigation Reform Act of 1995. Forward-looking statements are
      made based on management's current expectations and beliefs concerning
      future developments and their potential effects upon the Company and its
      subsidiaries. The Company's actual results may differ, possibly
      materially, from expectations or estimates reflected in such
      forward-looking statements. Certain important factors that could cause
      actual results to differ, possibly materially, from expectations or
      estimates reflected in such forward-looking statements can be found in the
      "Risk Factors" and "Forward-Looking Statements" sections included in the
      Company's Annual Reports on Form 10-K and Quarterly Reports on Form 10-Q.
      The Company does not undertake to update any particular forward-looking
      statement included in this document.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001193125-24-040749
    url: https://www.sec.gov/Archives/edgar/data/1137774/000119312524040749/0001193125-24-040749-index.htm
    filing_date: 2024-02-21
    description: >-
      Item 1.05

      Material Cybersecurity Incidents. 


      As disclosed in the Original Report, on February 5, 2024, we detected
      that, beginning February 4, 2024, a threat actor had gained unauthorized
      access to certain of our systems. With assistance from external
      cybersecurity experts, we immediately activated our cybersecurity incident
      response process to investigate, contain, and remediate the incident. As
      of the date of this Report, we believe the threat actor is a cybercrime
      group, and our investigation has identified that the group accessed and
      exfiltrated from a platform limited data that includes some client
      information and personally identifiable information. The threat actor also
      accessed and exfiltrated Company administrative and user data from certain
      information technology systems and accessed a small percentage of Company
      user accounts associated with employees and contractors. We reported this
      matter to relevant law enforcement and have been informing regulatory
      authorities. 


      On the basis of the investigation to date, we have not found any evidence
      of malware, ransomware, data destruction or alteration, or that the threat
      actor currently has access to our systems. We continue to investigate the
      extent and impact of the incident, including whether the threat actor
      accessed any additional information or systems. 


      As of the date of this Report, the incident has not had a material impact
      on the Company's operations, and the Company has not determined the
      incident is reasonably likely to materially impact the Company's financial
      condition or results of operations. 


      Cautionary Statement Regarding Forward Looking Statements 


      Certain of the statements included in this Report, including with respect
      to the threat actor's access to our systems, constitute forward-looking
      statements within the meaning of the U.S. Private Securities Litigation
      Reform Act of 1995. Forward-looking statements are made based on
      management's current expectations and beliefs concerning future
      developments and their potential effects upon the Company and its
      subsidiaries. The Company's actual results may differ, possibly
      materially, from expectations or estimates reflected in such
      forward-looking statements. Certain important factors that could cause
      actual results to differ, possibly materially, from expectations or
      estimates reflected in such forward-looking statements can be found in the
      "Risk Factors" and "Forward-Looking Statements" sections included in the
      Company's Annual Reports on Form 10-K and Quarterly Reports on Form 10-Q.
      The Company does not undertake to update any particular forward-looking
      statement included in this document.
summary: Prudential Financial filed Form 8-K Item 1.05 following an
  administrative system intrusion by the ALPHV / BlackCat ransomware group
  compromising employee and user data.
tags:
  - regulatory
  - sec-8k
  - financial
  - insurance
  - confirmed
---

## Incident Overview

Prudential Financial filed Form 8-K Item 1.05 following an administrative system intrusion by the ALPHV / BlackCat ransomware group compromising employee and user data.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Employee & Contractor Records, Administrative Credentials, Limited Customer Identification Data.
- **Disclosed Affected Population:** Approximately 32,183 individuals or records.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001137774-24-000012.

## Timeline

### 2024-02-05 16:00 UTC
- **Event:** Threat actor breaches internal administrative network environments and exfiltrates corporate data files.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Prudential Information Security Bulletin](https://www.prudential.com/links/security)

### 2024-02-13 18:30 UTC
- **Event:** Prudential files Form 8-K Item 1.05 disclosing unauthorized access to administrative and internal user directories.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001137774-24-000012)](https://www.sec.gov/Archives/edgar/data/1137774/000113777424000012/pru-20240212.htm)

### 2024-03-29 17:00 UTC
- **Event:** Form 8-K Item 1.05 amendment updates scope to confirm 32,183 individuals impacted by exfiltration.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K/A Item 1.05 (Adsh 0001137774-24-000028)](https://www.sec.gov/Archives/edgar/data/1137774/000113777424000028/pru-20240329.htm)

### 2024-02-13 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001193125-24-033753)](https://www.sec.gov/Archives/edgar/data/1137774/000119312524033753/0001193125-24-033753-index.htm)

### 2024-02-21 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001193125-24-040749)](https://www.sec.gov/Archives/edgar/data/1137774/000119312524040749/0001193125-24-040749-index.htm)
