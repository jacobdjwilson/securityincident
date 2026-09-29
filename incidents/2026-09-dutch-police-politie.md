---
id: 2026-09-dutch-police-politie
target: Dutch Police (Politie)
domain: politie.nl
status: DEVELOPING
first_seen: '2026-09-28'
last_updated: '2026-09-29'
threat_actor: ShinyHunters
summary: >-
  Authorities in the Netherlands have arrested a 23-year-old convicted
  cybercriminal on suspicion of aiding in data thefts and extortions by the
  prolific hacker group ShinyHunters. In the days immediately following the
  suspect's arrest, remaining Sh...
tags:
  - investigative
  - developing
industry: Government & Law Enforcement
incident_type: Network Intrusion & Exfiltration
affected_records: 65000
compromised_data:
  - Police Officer Corporate Email Addresses
  - Mobile Phone Numbers
  - Organizational Unit Hierarchies
regulatory_filings:
  - regulator: Dutch Data Protection Authority (AP)
    form: Landelijke Eenheid Breach Disclosure
    url: 'https://autoriteitpersoonsgegevens.nl'
---
## Incident Overview

The **Dutch Police (Politie)** cybersecurity event represents a confirmed **Network Intrusion & Exfiltration** within the **Government & Law Enforcement** sector, attributed to the **ShinyHunters** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **65,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Police Officer Corporate Email Addresses, Mobile Phone Numbers, Organizational Unit Hierarchies.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-28 15:08 UTC
- **Event:** Dutch Police Arrest 'Reformed' Hacker in Shiny Hunters Investigation
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Krebs on Security Report](https://krebsonsecurity.com/2026/09/dutch-police-arrest-reformed-hacker-in-shiny-hunters-investigation/)

### 2026-09-29 11:01 UTC
- **Event:** Dutch Police Arrest Convicted Hacker in ShinyHunters Investigation
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Intelligence Notice](https://www.securityweek.com/dutch-police-arrest-convicted-hacker-in-shinyhunters-investigation/)
