---
id: 2026-10-palo-alto-networks
target: Palo Alto Networks
domain: paloaltonetworks.com
status: DEVELOPING
first_seen: 2026-10-14
last_updated: 2026-10-16
threat_actor: null
summary: Palo Alto Networks has released security updates for a high-severity
  PAN-OS RCE zero-day, tracked as CVE-2026-0322, that has been exploited in
  attacks targeting firewalls. [...]
tags:
  - threat-intel
  - developing
  - cve-2026-0322
  - agency-advisory
  - cve-2026-76519
  - cve-2026-105133
  - cve-2026-105134
  - media-pickup
cve_ids:
  - CVE-2026-0322
  - CVE-2026-76519
  - CVE-2026-105133
  - CVE-2026-105134
compromised_data:
  - Authentication Credentials
agency_advisories:
  - agency: CISA Cybersecurity Advisories
    advisory_id: CISA Adds Four Known Exploited Vulnerabilities to Catalog
    advisory_type: Government Cyber Advisory
    url: https://www.cisa.gov/news-events/alerts/2026/10/14/cisa-adds-four-known-exploited-vulnerabilities-catalog
    release_date: 2026-10-14
    cve_ids:
      - CVE-2026-0322
      - CVE-2026-76519
      - CVE-2026-105133
      - CVE-2026-105134
    description: "CISA has added four new vulnerabilities to its Known Exploited
      Vulnerabilities (KEV) Catalog , based on evidence of active exploitation.
      CVE-2026-0322 Palo Alto Networks PAN-OS Code Injection Vulnerability
      CVE-2026-76519 Cisco Secure Email Gateway Relative Path Traversal
      Vulnerability CVE-2026-105133 Ahsay AhsayCBS Improper Authentication
      Vulnerability CVE-2026-105134 Ahsay AhsayCBS Command Injection
      Vulnerability These types of vulnerabilities are a frequent attack vector
      for malicious cyber actors and pose significant risks to the federal
      enterprise. Binding Operational Directive (BOD) 26-04: Prioritizing
      Security Updates Based on Risk establishes vulnerability management
      requirements for Federal Civilian Executive Branch (FCEB) agencies. BOD
      26-04 reinforces the importance of the KEV Catalog and requires federal
      agencies to prioritize rapid remediation of high-risk vulnerabilities,
      specifically those identified by Common Vulnerabilities and Exposures
      (CVEs) listed in CISA’s KEV Catalog on publicly exposed assets that grant
      total control of the asset post-exploitation, while deferring action for
      lower-risk vulnerabilities. BOD 26-04 further establishes basic
      expectations for when agencies must check whether threat actors
      compromised the system before the patch was applied. While BOD 26-04
      applies only to FCEB agencies, CISA encourages all organizations to adopt
      risk-based vulnerability management and prioritize remediation of KEV
      Catalog vulnerabilities . CISA will continue to add vulnerabilities to the
      catalog that meet the specified criteria . Aware of an exploited
      vulnerability not currently listed in the KEV Catalog? Submit it for
      potential addition through CISA’s KEV Nomination Form . Potential KEV
      additions must have a CVE ID, evidence of exploitation, and clear
      mitigation guidance."
vendor_advisories:
  - publisher: Palo Alto Networks
    advisory_id: Palo Alto Networks Patches PAN-OS Zero-Day Exploited for Rem
    title: Palo Alto Networks Patches PAN-OS Zero-Day Exploited for Remote Code
      Execution
    severity: Critical
    release_date: 2026-10-15
    cve_ids: []
    url: https://www.securityweek.com/palo-alto-networks-patches-pan-os-zero-day-exploited-for-remote-code-execution/
    description: The company says it’s aware of limited exploitation against
      customers’ firewalls, and it has made IoCs available. The post Palo Alto
      Networks Patches PAN-OS Zero-Day Exploited for Remote Code Execution
      appeared first on SecurityWeek .
---

## Incident Overview

Palo Alto Networks, within its operating sector, has been subject to a cybersecurity incident. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution. Active vulnerability telemetry tracks associated Common Vulnerabilities and Exposures: CVE-2026-0322.

Palo Alto Networks has released security updates for a high-severity PAN-OS RCE zero-day, tracked as CVE-2026-0322, that has been exploited in attacks targeting firewalls. [...]

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `paloaltonetworks.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Authoritative Directives & Vendor Disclosures

- **Continuous Telemetry Monitoring:** Formal statutory regulatory filings (SEC Form 8-K, State AG portals) and sovereign agency advisories (CISA, NCSC) are continuously monitored via automated ingestion pipeline.

## Timeline

### 2026-10-14 22:56 UTC
- **Event:** Palo Alto Networks warns of PAN-OS RCE flaw exploited in attacks
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/palo-alto-networks-warns-of-pan-os-rce-flaw-exploited-in-attacks/)

### 2026-10-14 12:00 UTC
- **Event:** CISA Adds Four Known Exploited Vulnerabilities to Catalog
- **Verification:** GOVERNMENT ADVISORY
- **Source:** [CISA Cybersecurity Advisories Report](https://www.cisa.gov/news-events/alerts/2026/10/14/cisa-adds-four-known-exploited-vulnerabilities-catalog)

### 2026-10-15 06:59 UTC
- **Event:** Press Coverage: Palo Alto Networks Patches PAN-OS Zero-Day Exploited for Remote Code Execution
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/palo-alto-networks-patches-pan-os-zero-day-exploited-for-remote-code-execution/)

### 2026-10-15 10:43 UTC
- **Event:** Press Coverage: CISA flags exploited flaws in Palo Alto, Cisco and Ahsay products
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/15/cve-2026-0322-cve-2026-76519-cve-2026-105133-cve-2026-105134-exploted/)

### 2026-10-15 19:21 UTC
- **Event:** Press Coverage: U.S. CISA adds Palo Alto Networks PAN-OS, Ahsay AhsayCBS, and Cisco Secure Email Gateway flaws to its Known Exploited Vulnerabilities catalog
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/201041/security/u-s-cisa-adds-palo-alto-networks-pan-os-ahsay-ahsaycbs-and-cisco-secure-email-gateway-flaws-to-its-known-exploited-vulnerabilities-catalog.html)

### 2026-10-16 09:08 UTC
- **Event:** Press Coverage: PEERSTITCH malware: How Attackers Compromised 500 Firewalls Through FortiManager
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/201077/malware/peerstitch-malware-how-attackers-compromised-500-firewalls-through-fortimanager.html)
