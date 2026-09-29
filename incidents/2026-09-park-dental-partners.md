---
id: 2026-09-park-dental-partners
target: Park Dental Partners
domain: parkdental.com
status: CONFIRMED
first_seen: '2026-09-01'
last_updated: '2026-09-01'
threat_actor: Akira
summary: >-
  Dental support organization Park Dental Partners filed Form 8-K Item 1.05
  disclosing network disruption and forensic containment efforts.
tags:
  - regulatory
  - sec-8k
  - healthcare
  - confirmed
industry: Healthcare
incident_type: Network Intrusion & Ransomware
affected_records: 62000
compromised_data:
  - Dental Imaging & X-Rays
  - Patient Social Security Numbers (SSNs)
  - Dental Insurance Claim Details
regulatory_filings:
  - regulator: SEC
    form: Form 8-K (Item 1.05)
    accession_number: 0001193125-26-049812
    url: 'https://www.sec.gov/edgar'
---
## Incident Overview

The **Park Dental Partners** cybersecurity event represents a confirmed **Network Intrusion & Ransomware** within the **Healthcare** sector, attributed to the **Akira** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **62,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Dental Imaging & X-Rays, Patient Social Security Numbers (SSNs), Dental Insurance Claim Details.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with federal and state regulatory authorities to inform affected stakeholders and oversight bodies. Regulatory authorities continue to monitor post-incident technical remediation and audit controls.

## Timeline

### 2026-09-01 18:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Filing: Park Dental Partners confirms unauthorized network activity and initiates third-party forensic containment.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001104659-26-104300)](https://www.sec.gov/Archives/edgar/data/2069604/000110465926104300/0001104659-26-104300-index.htm)
