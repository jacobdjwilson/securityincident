---
id: 2025-05-coinbase
target: Coinbase
domain: coinbase.com
status: CONFIRMED
first_seen: 2025-05-15
last_updated: 2025-05-20
threat_actor: null
summary: Official SEC Form 8-K Item 1.05 disclosure filed by Coinbase regarding
  a material cybersecurity incident.
tags:
  - regulatory
  - sec-8k
  - confirmed
  - state-ag
  - washington
regulatory_filings:
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001679788-25-000094
    url: https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/0001679788-25-000094-index.htm
    filing_date: 2025-05-15
    description: >-
      Item 1.05 Material Cybersecurity Incident. 


      On May 11, 2025, Coinbase, Inc., a subsidiary of Coinbase Global, Inc.
      ("Coinbase" or the "Company"), received an email communication from an
      unknown threat actor claiming to have obtained information about certain
      Coinbase customer accounts, as well as internal Coinbase documentation,
      including materials relating to customer-service and account-management
      systems. The communication demanded money in exchange for not publicly
      disclosing the information. The threat actor appears to have obtained this
      information by paying multiple contractors or employees working in support
      roles outside the United States to collect information from internal
      Coinbase systems to which they had access in order to perform their job
      responsibilities. These instances of such personnel accessing data without
      business need were independently detected by the Company's security
      monitoring in the previous months. Upon discovery, the Company had
      immediately terminated the personnel involved and also implemented
      heightened fraud-monitoring protections and warned customers whose
      information was potentially accessed in order to prevent misuse of any
      compromised information. Since receipt of the email, the Company has
      assessed the email to be credible, and has concluded that these prior
      instances of improper data access were part of a single campaign (the
      "Incident") that succeeded in taking data from internal systems. The
      Company has not paid the threat actor's demand and is cooperating with law
      enforcement in the investigation of this Incident. 


      The Incident did not involve the compromise of passwords or private keys,
      and at no time were any of the targeted contractors or employees able to
      access customer funds. While the Company is still investigating the
      affected data, it included:


      &#8226;Name, address, phone, and email; 


      &#8226;Masked Social Security (last 4 digits only); 


      &#8226;Masked bank-account numbers and some bank account identifiers; 


      &#8226;Government&#8209;ID images (e.g., driver's license, passport); 


      &#8226;Account data (balance snapshots and transaction history); and


      &#8226;Limited corporate data (including documents, training material, and
      communications available to support agents).


      The Company is continuing to review and bolster its anti-fraud protections
      to mitigate the risk that the compromised information could be used in
      social-engineering attempts. To the extent any eligible retail customers
      previously sent funds to the threat actor as a direct result of this
      Incident, the Company intends to voluntarily reimburse them after it
      completes its review to confirm the facts. The Company is also in the
      process of opening a new support hub in the United States and taking other
      measures to harden its defenses to prevent this type of incident.


      While Coinbase has not experienced material operational impacts from these
      events as of the date hereof, the full financial impact of the Incident on
      the Company is still in the process of being assessed. Based on the
      information available to the Company on the date hereof and based on facts
      that continue to evolve, the Company has preliminarily estimated expenses
      to be within the range of approximately $180 million to $400 million
      relating to remediation costs and voluntary customer reimbursements
      relating to this Incident, prior to further review of potential losses,
      indemnification claims, and potential recoveries, which could meaningfully
      increase or decrease this estimate. The Company plans to aggressively
      pursue all remedies. As the Company's investigation is ongoing, the full
      impact of these events are not yet known.


      Forward-Looking Statements


      This Current Report on Form 8-K contains forward-looking statements,
      including, but not limited to, statements regarding the Company's current
      beliefs, understanding and expectations regarding the Incident, including
      but not limited to, a preliminary estimate of certain expenses relating to
      the Incident. Factors that could cause actual results to differ from those
      expressed in these forward-looking statements include the ongoing
      assessment of the Incident; legal, reputational and financial risks
      resulting from the Incident or additional cybersecurity incidents; and the
      risks described in the Company's Annual Report on Form 10-K for the year
      ended December 31, 2024 and subsequent Quarterly Reports on Form 10-Q. All
      forward looking statements are based on information and estimates
      available 


      to us as of the date hereof. Unless required by law, the Company expressly
      disclaims any obligation to update publicly any forward-looking
      statements, whether as result of new information, future events or
      otherwise.
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA33375.pdf
    filing_date: 2025-05-20
    description: Official statutory data breach notification submitted by Coinbase
      to the Washington State Office of the Attorney General pursuant to RCW
      19.255.010, disclosing unauthorized system access impacting 3,337
      residents.
incident_type: Material Cybersecurity Incident
affected_records: 3337
---

## Incident Overview

Coinbase, within its operating sector, has been subject to a cybersecurity incident disclosed to federal securities regulators. Ground-truth telemetry indicates the event prompted statutory disclosure under SEC cybersecurity reporting mandates.

Official SEC Form 8-K Item 1.05 disclosure filed by Coinbase regarding a material cybersecurity incident.

## Compromised Assets & Data Scope

The specific volume of affected customer, employee, or organizational records remains under active technical audit or disclosed in primary filings. Primary online perimeter and corporate domains include `coinbase.com`.

Specific classes of compromised records, infrastructure, or operational systems are detailed in the official statutory filings below.

## Statutory Disclosures & Compliance

- **SEC Filing:** Form 8-K Item 1.05 (0001679788-25-000094) - [Filing Link](https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/0001679788-25-000094-index.htm)

## Timeline

### 2025-05-15 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001679788-25-000094)](https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/0001679788-25-000094-index.htm)

### 2025-05-20 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA33375.pdf)
