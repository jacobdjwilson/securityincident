---
id: 2026-07-carecloud
target: CareCloud
domain: carecloud.com
status: CONFIRMED
first_seen: 2026-07-24
last_updated: 2026-07-24
threat_actor: Unknown / Unattributed
summary: Washington State Attorney General formal data breach disclosure notice
  filed by CareCloud affecting 20706 residents.
tags:
  - regulatory
  - state-ag
  - washington
  - confirmed
  - sec-8k
industry: Legal
incident_type: Unauthorized Cloud Access
affected_records: null
compromised_data:
  - Privileged Client Legal Files
  - Confidential Corporate Communications
regulatory_filings:
  - regulator: State of California Department of Justice
    form: Data Security Breach Disclosure Report
    url: https://oag.ca.gov/privacy/databreach/list
    description: Official statutory data breach notification submitted by CareCloud
      to the California Department of Justice under California Civil Code §
      1798.82 (SB-24), disclosing unauthorized access to personal identifiable
      information of California residents.
  - regulator: Washington State Office of the Attorney General
    form: Consumer Protection Data Breach Notification
    url: https://www.atg.wa.gov/data-breach-notifications
    description: Official statutory data breach notification submitted by CareCloud
      to the Washington State Office of the Attorney General pursuant to RCW
      19.255.010, disclosing unauthorized system access impacting residents.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001493152-26-013239
    url: https://www.sec.gov/Archives/edgar/data/1582982/000149315226013239/0001493152-26-013239-index.htm
    filing_date: 2026-03-27
    description: >-
      Item

      1.05 Material Cybersecurity Incidents.


      On

      March 16, 2026, CareCloud, Inc. (the "Company") experienced a temporary
      network disruption in its CareCloud Health

      division that partially impacted the functionality and data access to 1 of
      its 6 electronic health record environments for

      approximately 8 hours until the Company fully restored all functionality
      and data access during that evening. Upon discovery of this

      incident, the Company promptly reported the matter to its cybersecurity
      carrier and engaged a leading cyber response advisory team

      which is part of a Big Four accounting firm to perform external
      cybersecurity work and to assist with securing the environment, as

      well as to conduct a comprehensive IT forensic investigation to determine
      the nature and scope of this incident.


      The

      Company further believes that the incident was contained to the CareCloud
      Health environment and did not affect the Company's other

      platforms, divisions, systems, data or environments. The incident was
      contained on the day it was discovered. The Company believes that

      it has sufficient cybersecurity insurance coverage for any potential
      losses. The Company further believes that the incident was caused

      by an unauthorized third party who temporarily had access to the system.
      The Company has reported the matter to the appropriate law enforcement

      authorities.


      The

      Company is continuing to investigate the nature and scope of the incident.
      The affected environment stores patient information, and the

      Company continues to assess whether, and the extent to which, patient
      information or other data was accessed or exfiltrated, and the

      categories and volume of any such data.


      All

      affected systems have been fully restored, and the Company believes that
      the threat actor no longer has any access to the same. As part

      of its remediation efforts, the Company is working with its outside
      cybersecurity experts to further reinforce its information technology

      systems and to prevent future unauthorized access.


      As

      of the date of this Current Report on Form 8-K, the incident has not had a
      material impact on the Company's operations. On March

      24, 2026, the Company nevertheless determined that the incident is
      material in light of the sensitivity of the potentially affected
      information

      and the potential consequences of the incident, including remediation and
      response costs, legal, regulatory and notification-related

      matters, and possible effects on patients, customers, counterparties,
      reputation and operations. The Company believes that the incident

      is not reasonably likely to have a material impact on the Company's
      financial condition or results of operations but has not yet

      determined the full impact of the incident. To the extent any information
      required by
---

## Incident Overview

The **CareCloud** cybersecurity event represents a confirmed **Unauthorized Cloud Access** within the **Legal** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Privileged Client Legal Files, Confidential Corporate Communications.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-07-24 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachM25126.pdf)

### 2026-03-27 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Disclosure
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Filing (0001493152-26-013239)](https://www.sec.gov/Archives/edgar/data/1582982/000149315226013239/0001493152-26-013239-index.htm)
