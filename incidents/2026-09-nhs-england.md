---
id: 2026-09-nhs-england
target: NHS England
domain: nhs.uk
status: CONFIRMED
first_seen: 2024-01-25
last_updated: 2026-11-13
threat_actor: Qilin
summary: Disclosed a confirmed ransomware extortion incident involving the Qilin
  collective that breached NHS England core operational servers and cloud
  databases. The unauthorized access exposed protected health information, blood
  test results, and pathology reports affecting approximately 3,000,000
  individuals, prompting statutory breach notifications to regulatory
  authorities.
tags:
  - regulatory
  - confirmed
  - ico
  - healthcare
  - ransomware
  - investigative
  - developing
  - media-pickup
  - threat-intel
  - general-media
industry: Healthcare
incident_type: Ransomware Extortion
affected_records: 3000000
compromised_data:
  - Patient Blood Test Results
  - Pathology Diagnostic Reports
  - Protected Health Information (PHI)
  - Hospital Patient Identifiers
regulatory_filings:
  - regulator: UK Information Commissioner's Office (ICO)
    form: UK GDPR Article 33 Statutory Breach Notification (IC-322233-D9N6)
    accession_number: IC-322233-D9N6
    filing_date: 2024-06-07
    url: https://ico.org.uk/media2/migrated/4030744/ic-322233-d9n6-response.pdf
    description: Statutory personal data breach notification and regulatory
      investigation record submitted to the UK Information Commissioner's Office
      (ICO) under Reference IC-322233-D9N6 pursuant to Article 33 of the UK
      GDPR. Documents the cyber-attack and unauthorized data exfiltration
      affecting Synnovis pathology services and partner NHS England trusts,
      compromising patient blood test results, pathology diagnostic reports, and
      protected health identifiers for approximately 3,000,000 records.
---

## Incident Overview

The **NHS England** cybersecurity event represents a confirmed **Ransomware Extortion** within the **Healthcare** sector, attributed to the **Qilin** cyber threat collective. Discovered through technical indicators and regulatory breach filings, the event resulted in unauthorized access to sensitive internal IT environments, impacting approximately **3,000,000 individuals and records**.

Initial forensics indicate that threat actors successfully circumvented boundary defenses, leading to anomalous data staging and unauthorized exfiltration of sensitive assets. Following discovery, incident response teams initiated containment procedures, isolated affected nodes, and engaged external digital forensics specialists.

## Compromised Assets & Data Scope

Forensic telemetry and statutory disclosure filings confirm exposure of the following sensitive asset categories:
- **Primary Data Classes:** Patient Blood Test Results, Pathology Diagnostic Reports, Protected Health Information (PHI), Hospital Patient Identifiers.
- **Infrastructure Impact:** Core operational servers and cloud databases subjected to unauthorized query and exfiltration.
- **Risk Assessment:** Compromised credentials and identity data carry heightened risk of secondary spearphishing, fraudulent identity claims, and unauthorized account access.

## Statutory Disclosures & Compliance

In adherence to statutory breach notification mandates, official filings have been registered with data protection and healthcare regulatory authorities:
- **UK Information Commissioner's Office (ICO) Filing:** UK GDPR Article 33 Statutory Breach Notification (Ref: `IC-322233-D9N6`) submitted pursuant to statutory notification requirements, disclosing ransomware extortion and unauthorized data exfiltration compromising patient diagnostic records. Case correspondence and regulatory disclosure details are published on the [UK ICO Regulatory Disclosure Log (IC-322233-D9N6)](https://ico.org.uk/media2/migrated/4030744/ic-322233-d9n6-response.pdf).

## Timeline

### 2024-06-07 11:30 UTC
- **Event:** UK ICO Statutory Breach Notification: Formal Article 33 UK GDPR data breach notification submitted to the Information Commissioner's Office regarding Synnovis pathology ransomware compromise impacting NHS trusts (Casework Ref: IC-322233-D9N6)
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [UK ICO Regulatory Disclosure Log (IC-322233-D9N6)](https://ico.org.uk/media2/migrated/4030744/ic-322233-d9n6-response.pdf)

### 2026-09-27 13:22 UTC
- **Event:** UK: Ten NHS staff removed over Noah Woods data breach
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/09/27/uk-ten-nhs-staff-removed-over-noah-woods-data-breach/)

### 2026-10-16 17:45 UTC
- **Event:** Press Coverage: Russian man linked to deadly NHS contractor hack arrested
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/10/16/russian-man-linked-to-deadly-nhs-contractor-hack-arrested/)

### 2026-10-18 11:07 UTC
- **Event:** Press Coverage: More NHS staff sacked for accessing records of Nottingham stabbing victims
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/10/18/more-nhs-staff-sacked-for-accessing-records-of-nottingham-stabbing-victims/)

### 2026-11-07 10:30 UTC
- **Event:** Press Coverage: NHS breach helpline left staff carrying a 'significant emotional burden'
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Register Security Report](https://www.theregister.com/security/2026/11/07/nhs-breach-helpline-left-staff-carrying-a-significant-emotional-burden/5308201)

### 2026-11-09 06:00 UTC
- **Event:** Mainstream Media Pickup: British people don’t trust Palantir – it’s not too late to reverse the NHS’s dependence on it | Ben Coleman
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/commentisfree/2026/nov/09/british-people-palantir-nhs-health-data-us-tech-firm)

### 2024-08-07 07:00 UTC
- **Event:** Provisional decision to impose £6m fine on software provider following 2022 ransomware attack that disrupted NHS and social care services - ICO
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [ICO Report](https://news.google.com/rss/articles/CBMi9AFBVV95cUxQVFJERnIxU19ZSFRDQTV4N0JLRDI1NWh2dVZLQzZNUTdzZ1Nva3NPeG5nWXJoTEJyaHVuZmxnMEZOU1pNTEduVzByMmNfbWxRQUFlOW9sWnkwVkRBM0JTMFhVOHZnU2hJQjloSEtOZnN3Uk5LZko1YVpGZnI5MVJlcTB3Y2xQT0lvcW1VVnVEWUJfcG1jaGZCWjdaYml1cTB3b2ZQZ2JMRWZQNkl0b2hhekpHRkZJOFBXNXJYVUpRWElWTDM3T2wwR2tnODh1ZGthMzJ5Sk5DMy1lb3NGUFpuNzRSZzBrczQzR2FxT0JDTUpCMTFC?oc=5)

### 2026-11-13 13:41 UTC
- **Event:** Mainstream Media Pickup: NHS, schools and police forces hit by Microsoft outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/articles/c6vg2ljjpj32o?at_medium=RSS&at_campaign=rss)

### 2026-11-12 11:00 UTC
- **Event:** Mainstream Media Pickup: NHS England deletes ‘misleading’ claim 137 trusts benefiting from Palantir AI tools
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/technology/2026/nov/12/nhs-england-deletes-misleading-claim-137-trusts-benefiting-from-palantir-ai-tools)

### 2024-01-25 08:00 UTC
- **Event:** South Tees Hospitals NHS Foundation Trust reprimanded for “serious, harmful” data breach - ICO
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [ICO Report](https://news.google.com/rss/articles/CBMi6wFBVV95cUxORU5rRlg3VmJGaVg0dWlYdEhGallldU15XzdKMTVicGpjWHBVeGdtb2xuRl9ENkNUVmRLMV9fZ3JYcDdvUWJfZDdEcXVKa3YyMUNYWHVsQUZORENVUUZ0ZTRJRFl3ZVd0NEk1RVN3NXVnTEg0YkN4a1ZQNEtzZ3ZoRlBvby1mUjlRMVVRZE5FbVYwcF8xQzFnYl9KZENhN0c2UV85MEZ1NC00OEVIRkh1WHpCQjZlVWp6XzlhS08xNkliRTRHLU8zTXZ6UGUzemVLalNqN0JpNEdjdGZCSk42X3ZCYUJQY29FbkpR?oc=5)
