---
id: 2026-10-fortinet
target: Fortinet
domain: fortinet.com
status: CONFIRMED
first_seen: 2026-08-12
last_updated: 2026-10-16
threat_actor: null
summary: Fortinet is warning customers of a critical FortiMail vulnerability,
  tracked as CVE-2026-104286, that is being actively exploited in zero-day
  attacks to execute unauthorized code or commands on vulnerable devices. [...]
tags:
  - threat-intel
  - developing
  - regulatory
  - media-pickup
  - cve-2026-104286
  - agency-advisory
  - cve-2025-61624
  - cve-2026-102764
cve_ids:
  - CVE-2026-104286
  - CVE-2025-61624
  - CVE-2026-102764
vendor_advisories:
  - publisher: Fortinet
    advisory_id: Fortinet FortiMail Advisory
    title: Fortinet FortiMail Critical Remote Code Execution Advisory
    severity: Critical (CVSS 9.8)
    release_date: 2026-10-01
    cve_ids:
      - CVE-2026-104286
    affected_products:
      - Fortinet FortiMail
    fixed_versions:
      - Refer to FortiGuard PSIRT advisory for remediated firmware builds
    workarounds: Restrict external management interface access until firmware is upgraded.
    exploitation_status: Active zero-day exploitation confirmed in the wild prior to
      patch disclosure.
    url: https://www.fortiguard.com/psirt
    description: Official vendor security advisory disclosing critical remote
      command execution vulnerability affecting FortiMail appliances.
compromised_data:
  - Authentication Credentials
agency_advisories:
  - agency: CISA Cybersecurity Advisories
    advisory_id: CISA Adds Two Known Exploited Vulnerabilities to Catalog
    advisory_type: Government Cyber Advisory
    url: https://www.cisa.gov/news-events/alerts/2026/10/16/cisa-adds-two-known-exploited-vulnerabilities-catalog
    release_date: 2026-10-16
    cve_ids:
      - CVE-2025-61624
      - CVE-2026-102764
    description: "CISA has added two new vulnerabilities to its Known Exploited
      Vulnerabilities (KEV) Catalog , based on evidence of active exploitation.
      CVE-2025-61624 Fortinet Multiple Products Path Traversal Vulnerability
      CVE-2026-102764 BeyondTrust Remote Support Authentication Bypass by
      Spoofing Vulnerability These types of vulnerabilities are a frequent
      attack vector for malicious cyber actors and pose significant risks to the
      federal enterprise. Binding Operational Directive (BOD) 26-04:
      Prioritizing Security Updates Based on Risk establishes vulnerability
      management requirements for Federal Civilian Executive Branch (FCEB)
      agencies. BOD 26-04 reinforces the importance of the KEV Catalog and
      requires federal agencies to prioritize rapid remediation of high-risk
      vulnerabilities, specifically those identified by Common Vulnerabilities
      and Exposures (CVEs) listed in CISA’s KEV Catalog on publicly exposed
      assets that grant total control of the asset post-exploitation, while
      deferring action for lower-risk vulnerabilities. BOD 26-04 further
      establishes basic expectations for when agencies must check whether threat
      actors compromised the system before the patch was applied. While BOD
      26-04 applies only to FCEB agencies, CISA encourages all organizations to
      adopt risk-based vulnerability management and prioritize remediation of
      KEV Catalog vulnerabilities . CISA will continue to add vulnerabilities to
      the catalog that meet the specified criteria . Aware of an exploited
      vulnerability not currently listed in the KEV Catalog? Submit it for
      potential addition through CISA’s KEV Nomination Form . Potential KEV
      additions must have a CVE ID, evidence of exploitation, and clear
      mitigation guidance."
---

## Incident Overview

Fortinet, within its operating sector, has been subject to a cybersecurity incident initially observed on 2026-10-01. Ground-truth telemetry indicates the threat activity is currently unconfirmed or under forensic attribution. Active vulnerability telemetry tracks associated Common Vulnerabilities and Exposures: CVE-2026-104286.

Fortinet is warning customers of a critical FortiMail vulnerability, tracked as CVE-2026-104286, that is being actively exploited in zero-day attacks to execute unauthorized code or commands on vulnerable devices. [...]

## Compromised Assets & Data Scope

The specific volume of affected customer or organizational records remains under active forensic investigation. Primary affected online infrastructure and perimeter domains include `fortinet.com`.

Specific classes of compromised records, credentials, or proprietary information continue to be audited through ongoing forensic investigation.

## Authoritative Directives & Vendor Disclosures

- **Fortinet Security Bulletin:** Fortinet FortiMail Advisory - [Vendor Bulletin Link](https://www.fortiguard.com/psirt)


## Timeline

### 2026-10-01 22:42 UTC
- **Event:** Fortinet warns of critical FortiMail flaw exploited in zero-day attacks
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/fortinet-warns-of-critical-fortimail-flaw-exploited-in-zero-day-attacks/)

### 2026-10-01 12:00 UTC
- **Event:** CISA Adds One Known Exploited Vulnerability to Catalog
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [CISA Cybersecurity Advisories Report](https://www.cisa.gov/news-events/alerts/2026/10/01/cisa-adds-one-known-exploited-vulnerability-catalog)

### 2026-10-02 05:49 UTC
- **Event:** Press Coverage: Critical FortiMail Zero-Day Flaw Exploited in Attacks Allows Unauthenticated Arbitrary File Writes
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/critical-fortimail-zero-day-flaw.html)

### 2026-08-12 13:15 UTC
- **Event:** Press Coverage: Gunra Ransomware Exploits Fortinet Flaws to Target Critical Infrastructure
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/gunra-ransomware-fortinet-flaws/)

### 2026-10-07 13:43 UTC
- **Event:** Press Coverage: FortiBleed is still active, with attackers locking admins out of Fortinet firewalls
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/07/fortinet-fortibleed-campaign-fbi-advisory/)

### 2026-10-08 07:52 UTC
- **Event:** Press Coverage: FortiBleed Attackers Locking Victims Out of Fortinet Devices
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/fortibleed-attackers-locking-victims-out-of-fortinet-devices/)

### 2026-10-02 10:53 UTC
- **Event:** Press Coverage: Fortinet sounds the alarm over actively exploited FortiMail zero-day
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Register Security Report](https://www.theregister.com/security/2026/10/02/fortinet-sounds-the-alarm-over-actively-exploited-fortimail-zero-day/5300803)

### 2026-10-16 12:00 UTC
- **Event:** CISA Adds Two Known Exploited Vulnerabilities to Catalog
- **Verification:** GOVERNMENT ADVISORY
- **Source:** [CISA Cybersecurity Advisories Report](https://www.cisa.gov/news-events/alerts/2026/10/16/cisa-adds-two-known-exploited-vulnerabilities-catalog)
