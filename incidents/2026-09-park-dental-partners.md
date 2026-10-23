---
id: 2026-09-park-dental-partners
target: Park Dental Partners
domain: parkdental.com
status: CONFIRMED
first_seen: 2026-09-01
last_updated: 2026-10-13
threat_actor: Akira
summary: Dental support organization Park Dental Partners filed Form 8-K Item
  1.05 disclosing network disruption and forensic containment efforts.
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
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001104659-26-104300
    filing_date: 2026-09-22
    url: https://www.sec.gov/Archives/edgar/data/2069604/000110465926104300/0001104659-26-104300-index.htm
    description: Item 1.05 Material Cybersecurity Incident disclosure filed by Park
      Dental Partners reporting ransomware extortion attack resulting in
      clinical system encryption and patient record exfiltration.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001104659-26-115541
    url: https://www.sec.gov/Archives/edgar/data/2069604/000110465926115541/0001104659-26-115541-index.htm
    filing_date: 2026-10-13
    description: |
      Item 1.05 Material Cybersecurity Incidents.

      As previously reported, on August 28, 2026, Park Dental Partners, Inc. ("Company") identified unauthorized access to its computer network. The Company promptly initiated its incident response protocols, engaged external cybersecurity experts and forensic specialists and notified law enforcement. The investigation has determined that data was subject to unauthorized acquisition as a result of the incident. The Company has identified impacted patients whose protected health information was involved and is completing notifications pursuant to applicable state and federal law.

      The Company is aware of four state court lawsuits related to the August 2026 data breach, the first of which was filed on September 3, 2026: Julienne Wyckoff, on behalf of himself and all others similarly situated v. Park Dental Partners, Inc. (62-CV-26-6341), Second Judicial District, County of Ramsey, State of Minnesota; Thomas Jahnke and Nathaniel Sonia, on behalf of themselves and all others similarly situated v. Park Dental Partners, Inc. (62-CV-26-6381), Second Judicial District, County of Ramsey, State of Minnesota; Norbu Lama, on behalf of himself and all others similarly situated v. Park Dental Partners, Inc. (62-CV-26-6384), Second Judicial District, County of Ramsey, State of Minnesota; and Becky Murphy and Debbie Palm, on behalf of themselves and all others similarly situated v. Park Dental Partners, Inc. (62-CV-26-7111), Second Judicial District, County of Ramsey, State of Minnesota.

      Each lawsuit is a putative class action alleging the Company failed to safeguard patients' protected health information or failed to implement reasonable security measures that resulted in the August 2026 data breach and increased the risk of identity theft. The lawsuits also allege that the Company failed to timely notify affected individuals. Claims include negligence, negligence per se, invasion of privacy, breach of fiduciary duty, unjust enrichment, breach of implied contract, and breach of confidence. The Company intends to vigorously defend its positions in the litigation. On October 7, 2026, the plaintiffs filed a motion to consolidate the four actions and appoint interim lead class counsel. The Company also anticipates regulatory responses. To date, the Company is not aware of any unauthorized use of protected health information or any damages as a result of the incident.

      Security is a top priority for Park Dental Partners, Inc. and the Company continues to focus on protecting the privacy of protected health information in its care and mitigating cybersecurity risk, maintaining safeguards designed to protect data, continuously reviewing and enhancing those protections to address evolving threats, and providing ongoing and regular cybersecurity awareness training and testing for all employees. The Company maintains a cybersecurity risk-management program designed to assess, identify, and manage material risks arising from cybersecurity threats, consistent with the standards reported by peer companies in the dental and medical industries, which commonly leverage the National Institute of Standards and Technology ("NIST") Cybersecurity Framework as a basis for security posture measurement and risk management.

      To date, the Company has not identified any material impact on its financial condition or results of operations as a result of this incident, including the current expected legal and advisor cost to address the incident.

      To the extent additional information becomes available that could affect the Company's assessment of the incident and its impact, the Company will update this disclosure in a timely manner.
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

### 2026-10-13 16:00 UTC
- **Event:** SEC Form 8-K Item 1.05 Material Cybersecurity Incident Filing
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 Filing (0001104659-26-115541)](https://www.sec.gov/Archives/edgar/data/2069604/000110465926115541/0001104659-26-115541-index.htm)
