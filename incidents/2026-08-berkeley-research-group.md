---
id: 2026-08-berkeley-research-group
target: Berkeley Research Group
domain: berkeleyresearchgroup.com
status: CONFIRMED
first_seen: 2025-10-30
last_updated: 2026-08-31
threat_actor: Unknown / Unattributed
summary: State of California Department of Justice data breach disclosure notice
  filed by Berkeley Research Group.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
  - washington
industry: Education & Research
incident_type: Network Intrusion & Data Exfiltration
affected_records: 17188
compromised_data:
  - Personal Identifiable Information (PII)
  - Corporate Contact Records
regulatory_filings:
  - regulator: State of California Department of Justice
    form: Data Security Breach Disclosure Report
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-629096
    description: Official statutory data breach notification submitted by Berkeley
      Research Group to the California Department of Justice under California
      Civil Code § 1798.82 (SB-24), disclosing unauthorized access to personal
      identifiable information of California residents.
  - regulator: Washington Attorney General
    form: RCW 19.255 Data Breach Notice
    url: https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA35277.pdf
    filing_date: 2025-10-30
    description: Official statutory data breach notification submitted by Berkeley
      Research Group to the Washington State Office of the Attorney General
      pursuant to RCW 19.255.010, disclosing unauthorized system access
      impacting 17,188 residents.
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-613595
    filing_date: 2025-10-30
    description: Official statutory data breach notification submitted by Berkeley
      Research Group to the California Department of Justice under California
      Civil Code § 1798.82 (SB-24), disclosing unauthorized access to personal
      identifiable information of California residents.
---

## Incident Overview

The **Berkeley Research Group** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Education & Research** sector, attributed to the **Unknown / Unattributed** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, with the exact population scope undergoing regulatory audit.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Personal Identifiable Information (PII), Corporate Contact Records.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-08-31 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-629096)

### 2025-10-30 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA35277.pdf)

### 2025-10-30 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-613595)
