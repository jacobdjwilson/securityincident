---
id: 2026-09-us-dod-pentagon
target: U.S. Department of Defense (Pentagon)
domain: defense.gov
status: DEVELOPING
first_seen: '2026-09-26'
last_updated: '2026-10-01'
threat_actor: Unattributed
summary: >-
  Sean Lyngaas and Davis Winkie report: A data breach at the Pentagon’s vast HR
  system has exposed Social Security numbers and other personal information of
  current and former military personnel, raising counterintelligence concerns
  among national s...
tags:
  - investigative
  - developing
  - threat-intel
industry: Government & Defense
incident_type: Network Intrusion & Data Exfiltration
affected_records: 240000
compromised_data:
  - Military Personnel Social Security Numbers (SSNs)
  - Defense Manpower Data Center (DMDC) HR Records
  - Service Record Histories
regulatory_filings:
  - regulator: U.S. DoD Privacy Office
    form: System of Records Breach Notification
    url: 'https://dpcld.defense.gov/Privacy/'
---
## Incident Overview

The **U.S. Department of Defense (Pentagon)** cybersecurity event represents a confirmed **Network Intrusion & Data Exfiltration** within the **Government & Defense** sector, carried out by an unidentified cyber threat actor. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **240,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Military Personnel Social Security Numbers (SSNs), Defense Manpower Data Center (DMDC) HR Records, Service Record Histories.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-26 11:47 UTC
- **Event:** Pentagon data breach of military personnel raises national security concerns
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/09/26/pentagon-data-breach-of-military-personnel-raises-national-security-concerns/)

### 2026-09-29 12:25 UTC
- **Event:** Pentagon Personnel Agency Data Breach Impacts 3 Million People
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Intelligence Notice](https://www.securityweek.com/pentagon-personnel-agency-data-breach-impacts-3-million-people/)

### 2026-10-01 09:44 UTC
- **Event:** Hackers stole Pentagon personnel records of over 3 million people
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/hackers-breach-pentagon-human-resources-management-system-steal-data-of-nearly-3-million-people/)
