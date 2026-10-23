---
id: 2026-08-virta-health-and-virta-medical
target: Virta Health  and Virta Medical
domain: virtahealthandvirtamedical.com
status: CONFIRMED
first_seen: 2026-06-12
last_updated: 2026-09-03
threat_actor: Unattributed
summary: State of California Department of Justice data breach disclosure notice
  filed by Virta Health  and Virta Medical.
tags:
  - regulatory
  - state-ag
  - california
  - confirmed
  - washington
industry: Healthcare
incident_type: Third-Party Cloud Repository Compromise
affected_records: 36000
compromised_data:
  - Patient Clinical Telehealth Notes
  - Metabolic Health Biomarkers
  - Protected Health Information (PHI)
regulatory_filings:
  - regulator: California Attorney General
    notice_id: SC-2026-08819
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-629093
    description: Official statutory data breach notification submitted by Virta
      Health  and Virta Medical to the California Department of Justice under
      California Civil Code § 1798.82 (SB-24), disclosing unauthorized access to
      personal identifiable information of California residents.
  - regulator: Washington Attorney General
    notice_id: WA-2026-03822
    url: https://www.atg.wa.gov/data-breach-notifications
    description: Official statutory data breach notification submitted by Virta
      Health  and Virta Medical to the Washington State Office of the Attorney
      General pursuant to RCW 19.255.010, disclosing unauthorized system access
      impacting 36,000 residents.
  - regulator: California Department of Justice
    form: SB-24 Data Breach Notice
    url: https://oag.ca.gov/ecrime/databreach/reports/sb24-624890
    filing_date: 2026-06-12
    description: Official statutory data breach notification submitted by Virta
      Medical to the California Department of Justice under California Civil
      Code § 1798.82 (SB-24), disclosing unauthorized access to personal
      identifiable information of California residents.
---

## Incident Overview

The **Virta Health  and Virta Medical** cybersecurity event represents a confirmed **Third-Party Cloud Repository Compromise** within the **Healthcare** sector, carried out by an unidentified cyber threat actor. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **36,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Patient Clinical Telehealth Notes, Metabolic Health Biomarkers, Protected Health Information (PHI).
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-08-31 17:00 UTC
- **Event:** California Attorney General Data Breach Disclosure Notice
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-629093)

### 2026-09-03 16:30 UTC
- **Event:** Washington State Attorney General Breach Notice (RCW 19.255)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [Washington State Attorney General Breach Notice (RCW 19.255)](https://agportal-s3bucket.s3.amazonaws.com/databreach/BreachA42682.pdf)

### 2026-06-12 17:00 UTC
- **Event:** California Attorney General Data Breach Notice (SB-24)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [California Attorney General Data Breach Notice (SB-24)](https://oag.ca.gov/ecrime/databreach/reports/sb24-624890)
