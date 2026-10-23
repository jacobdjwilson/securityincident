---
id: 2024-01-hewlett-packard-enterprise
target: Hewlett Packard Enterprise
domain: hpe.com
status: CONFIRMED
first_seen: 2024-01-19
last_updated: 2024-01-24
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
    filing_date: 2024-01-19
    url: https://www.sec.gov/Archives/edgar/data/1645590/000164559024000003/hpe-20240119.htm
    description: Item 1.05 Material Cybersecurity Incident disclosure filed by
      Hewlett Packard Enterprise Company reporting nation-state actor Midnight
      Blizzard accessing corporate cloud email environment and exfiltrating
      messages.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001645590-24-000009
    url: https://www.sec.gov/Archives/edgar/data/1645590/000164559024000009/0001645590-24-000009-index.htm
    filing_date: 2024-01-24
    description: >-
      Item 1.05Material Cybersecurity Incidents


      On December 12, 2023, Hewlett Packard Enterprise Company (the "Company,"
      "HPE," or "we") was notified that a suspected nation-state actor, believed
      to be the threat actor Midnight Blizzard, the state-sponsored actor also
      known as Cozy Bear, had gained unauthorized access to HPE's cloud-based
      email environment. The Company, with assistance from external
      cybersecurity experts, immediately activated our response process to
      investigate, contain, and remediate the incident, eradicating the
      activity. Based on our investigation, we now believe that the threat actor
      accessed and exfiltrated data beginning in May 2023 from a small
      percentage of HPE mailboxes belonging to individuals in our cybersecurity,
      go-to-market, business segments, and other functions.


      While our investigation of this incident and its scope remains ongoing,
      the Company now understands this incident is likely related to earlier
      activity by this threat actor, of which we were notified in June 2023,
      involving unauthorized access to and exfiltration of a limited number of
      SharePoint files as early as May 2023. Following the notice in June, we
      immediately investigated with the assistance of external cybersecurity
      experts and took containment and remediation measures intended to
      eradicate the activity. Upon undertaking such actions, we determined that
      such activity did not materially impact the Company. 


      We have notified and are cooperating with law enforcement and are also
      assessing our regulatory notification obligations, and we will make
      notifications as appropriate based on our investigation findings. As of
      the date of this filing, the incident has not had a material impact on the
      Company's operations, and the Company has not determined the incident is
      reasonably likely to materially impact the Company's financial condition
      or results of operations. 


      Forward-looking statements.


      This Form 8-K contains forward-looking statements within the meaning of
      the safe harbor provisions of the Private Securities Litigation Reform Act
      of 1995. Such statements involve risks, uncertainties, and assumptions. If
      the risks or uncertainties ever materialize or the assumptions prove
      incorrect, the results of Hewlett Packard Enterprise Company and its
      consolidated subsidiaries ("Hewlett Packard Enterprise") may differ
      materially from those expressed or implied by such forward-looking
      statements and assumptions. The words "believe," "expect," "anticipate,"
      "intend," "will," "may," and similar expressions are intended to identify
      such forward-looking statements. If the risks or uncertainties ever
      materialize or the assumptions prove incorrect, the results of Hewlett
      Packard Enterprise may differ materially from those expressed or implied
      by such forward-looking statements and assumptions. All statements other
      than statements of historical fact are statements that could be deemed
      forward-looking statements, including but not limited to any ongoing
      investigations, potential findings, or potential financial or operational
      impacts of the aforementioned incident. Risks, uncertainties and
      assumptions include those that are described in Hewlett Packard
      Enterprise's Annual Report on Form 10-K for the fiscal year ended October
      31, 2023, Quarterly Reports on Form 10-Q, Current Reports on Form 8-K, and
      that are otherwise described or updated from time to time in Hewlett
      Packard Enterprise's Securities and Exchange Commission reports. Hewlett
      Packard Enterprise assumes no obligation and does not intend to update
      these forward-looking statements, except as required by applicable law.
summary: Hewlett Packard Enterprise filed Form 8-K Item 1.05 disclosing that
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

### 2024-01-24 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001645590-24-000009)](https://www.sec.gov/Archives/edgar/data/1645590/000164559024000009/0001645590-24-000009-index.htm)
