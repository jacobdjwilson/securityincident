---
id: 2024-01-microsoft-midnight-blizzard
target: Microsoft
domain: microsoft.com
status: CONFIRMED
first_seen: 2024-01-12
last_updated: 2026-10-27
threat_actor: Midnight Blizzard (APT29)
industry: Technology
incident_type: Nation-State Password Spray & Cloud Access
affected_records: null
compromised_data:
  - Senior Leadership Corporate Email Accounts
  - Cybersecurity Strategy Communications
  - Source Code Repositories
regulatory_filings:
  - regulator: U.S. Securities and Exchange Commission (SEC)
    form: Form 8-K Item 1.05 (Material Cybersecurity Incidents)
    accession_number: 0001193125-24-011295
    filing_date: 2024-01-19
    url: https://www.sec.gov/Archives/edgar/data/789019/000119312524011295/0001193125-24-011295-index.htm
    description: >-
      Item 1.05. Material Cybersecurity Incidents


      On January 12, 2024, Microsoft (the "Company" or "we") detected that
      beginning in late November 2023, a nation-state associated threat actor
      had gained access to and exfiltrated information from a very small
      percentage of employee email accounts including members of our senior
      leadership team and employees in our cybersecurity, legal, and other
      functions, on the basis of preliminary analysis. We were able to remove
      the threat actor's access to the email accounts on or about January 13,
      2024. We are examining the information accessed to determine the impact of
      the incident. We also continue to investigate the extent of the incident.
      We have notified and are working with law enforcement. We are also
      notifying relevant regulatory authorities with respect to unauthorized
      access to personal information. As of the date of this filing, the
      incident has not had a material impact on the Company's operations. The
      Company has not yet determined whether the incident is reasonably likely
      to materially impact the Company's financial condition or results of
      operations.


      This Form 8-K contains forward-looking statements, which are any
      predictions, projections or other statements about future events based on
      current expectations and assumptions that are subject to risks and
      uncertainties, which are described in our filings with the Securities and
      Exchange Commission. Forward-looking statements speak only as of the date
      they are made. Readers are cautioned not to put undue reliance on
      forward-looking statements, and the Company undertakes no duty to update
      any forward-looking statement to conform the statement to actual results
      or changes in the Company's expectations.
  - regulator: SEC
    form: Form 8-K Item 1.05
    accession_number: 0001193125-24-062997
    url: https://www.sec.gov/Archives/edgar/data/789019/000119312524062997/0001193125-24-062997-index.htm
    filing_date: 2024-03-08
    description: >-
      Item 1.05.

      Material Cybersecurity Incidents


      As disclosed in the Original Filing, the Company detected that beginning
      in late November 2023, a nation-state threat actor had gained access to
      and exfiltrated information from a very small percentage of employee email
      accounts including members of our senior leadership team and employees in
      our cybersecurity, legal, and other functions. Since the date of the
      Original Filing, the Company has determined that the threat actor used and
      continues to use information it obtained to gain, or attempt to gain,
      unauthorized access to some of the Company's source code repositories and
      internal systems. The threat actor's ongoing attack is characterized by a
      sustained, significant commitment of the threat actor's resources,
      coordination, and focus. Our active investigations of the threat actor's
      activities are ongoing, findings of our investigations will continue to
      evolve, and further unauthorized access may occur.


      We have increased our security investments, cross-enterprise coordination
      and mobilization, and have enhanced our ability to defend ourselves and
      secure and harden our environment against this advanced persistent threat.
      We continue to coordinate with federal law enforcement with respect to its
      ongoing investigation of the threat actor and the incident.


      As of the date of this filing, the incident has not had a material impact
      on the Company's operations. The Company has not yet determined that the
      incident is reasonably likely to materially impact the Company's financial
      condition or results of operations.


      This Form 8-K contains forward-looking statements, which are any
      predictions, projections or other statements about future events based on
      current expectations and assumptions that are subject to risks and
      uncertainties, which are described in our filings with the SEC.
      Forward-looking statements speak only as of the date they are made.
      Readers are cautioned not to put undue reliance on forward-looking
      statements, and the Company undertakes no duty to update any
      forward-looking statement to conform the statement to actual results or
      changes in the Company's expectations.
vendor_advisories:
  - publisher: Microsoft Security Response Center (MSRC)
    advisory_id: MSRC Incident Advisory
    title: Microsoft Actions Following Attack by Nation-State Actor Midnight Blizzard
    severity: Critical
    release_date: 2024-01-19
    url: https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/
    description: Official Microsoft Security Response Center disclosure detailing
      password spray operations by Nobelium / Midnight Blizzard against
      non-production legacy test tenants, privilege granting to malicious OAuth
      applications, and access to corporate email accounts.
  - publisher: Microsoft
    advisory_id: Microsoft October 2026 Patch Tuesday fixes 1,411 flaws, 3 ze
    title: Microsoft October 2026 Patch Tuesday fixes 1,411 flaws, 3 zero-days
    severity: Critical
    release_date: 2026-10-13
    cve_ids: []
    url: https://www.bleepingcomputer.com/news/microsoft/microsoft-october-2026-patch-tuesday-fixes-1-411-flaws-3-zero-days/
    description: Today is Microsoft's October 2026 Patch Tuesday, with security
      updates addressing a record-breaking 1,411 flaws, including one actively
      exploited and two publicly disclosed zero-day vulnerabilities. [...]
  - publisher: Microsoft
    advisory_id: Microsoft Patches Record 1,413 Vulnerabilities, Including Ex
    title: Microsoft Patches Record 1,413 Vulnerabilities, Including Exploited
      Windows Zero-Day
    severity: Critical
    release_date: 2026-10-14
    cve_ids:
      - CVE-2026-96951
    url: https://www.securityweek.com/microsoft-patches-record-1413-vulnerabilities-including-exploited-windows-zero-day/
    description: The most important is CVE-2026-96951, a security feature bypass
      flaw in Windows that has been exploited in the wild. The post Microsoft
      Patches Record 1,413 Vulnerabilities, Including Exploited Windows Zero-Day
      appeared first on SecurityWeek .
  - publisher: Microsoft
    advisory_id: Microsoft Patches Record 1,413 Flaws, Including Exploited Wi
    title: Microsoft Patches Record 1,413 Flaws, Including Exploited Windows Shell Bug
    severity: Critical
    release_date: 2026-10-14
    cve_ids: []
    url: https://thehackernews.com/2026/10/microsoft-patches-record-1413-flaws.html
    description: Microsoft on Tuesday shattered its own Patch Tuesday record by
      shipping patches for a whopping 1,413 vulnerabilities, including one that
      it said has come under active exploitation. These include 1,102 flaws in
      Windows, 134 in Office, 61 in Developer Tools, 36 in SharePoint Server,
      and 22 in SQL Server. Of these, more than 670 relate to privilege
      escalation, followed by over 300 remote code
  - publisher: Microsoft
    advisory_id: Microsoft fixes exploited Mark of the Web bypass vulnerabili
    title: Microsoft fixes exploited Mark of the Web bypass vulnerability
      (CVE-2026-96951)
    severity: Critical
    release_date: 2026-10-14
    cve_ids:
      - CVE-2026-96951
    url: https://www.helpnetsecurity.com/2026/10/14/microsoft-patch-tuesday-cve-2026-96951-motw-bypass/
    description: In another record-breaking Patch Tuesday, Microsoft has squashed
      over 1,400 security bugs, including a Mark of the Web bypass vulnerability
      (CVE-2026-96951) exploited by attackers in the wild. CVE-2026-96951 is a
      command injection vulnerability in Windows Shell that can be triggered by
      remote attackers via a file that is designed to exploit the vulnerability.
      Such a file can be sent to the user via email, instant message, or
      collaboration tools like Teams and Slack. Alternatively, users &#8230;
      More &#8594; The post Microsoft fixes exploited Mark of the Web bypass
      vulnerability (CVE-2026-96951) appeared first on Help Net Security .
  - publisher: Microsoft
    advisory_id: Microsoft releases Windows OOB updates to distrust eMudhra c
    title: Microsoft releases Windows OOB updates to distrust eMudhra certificates
    severity: Critical
    release_date: 2026-10-27
    cve_ids: []
    url: https://www.bleepingcomputer.com/news/microsoft/microsoft-releases-windows-oob-updates-to-distrust-emudhra-certificates/
    description: Microsoft has released out-of-band (OOB) Windows updates to remove
      trust in certificates tied to compromised eMudhra certificate authority
      keys, protecting systems that do not receive automatic certificate trust
      updates. [...]
summary: Microsoft disclosed an intrusion by Russian foreign intelligence threat
  group Midnight Blizzard (APT29), accessing senior leadership corporate emails
  and source code.
tags:
  - regulatory
  - sec-8k
  - nation-state
  - apt29
  - confirmed
  - threat-intel
  - developing
  - investigative
  - media-pickup
  - general-media
  - agency-advisory
  - cve-2026-96951
  - cve-2026-104935
  - cve-2026-80097
cve_ids:
  - CVE-2026-96951
  - CVE-2026-104935
  - CVE-2026-80097
agency_advisories:
  - agency: CISA Cybersecurity Advisories
    advisory_id: CISA Adds Two Known Exploited Vulnerabilities to Catalog
    advisory_type: Government Cyber Advisory
    url: https://www.cisa.gov/news-events/alerts/2026/10/13/cisa-adds-two-known-exploited-vulnerabilities-catalog
    release_date: 2026-10-13
    cve_ids:
      - CVE-2026-96951
      - CVE-2026-104935
    description: "CISA has added two new vulnerabilities to its Known Exploited
      Vulnerabilities (KEV) Catalog , based on evidence of active exploitation.
      CVE-2026-96951 Microsoft Windows Command Injection Vulnerability
      CVE-2026-104935 Ivanti Connect Secure Authentication Bypass by Spoofing
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
---

## Incident Overview

Microsoft disclosed an intrusion by Russian foreign intelligence threat group Midnight Blizzard (APT29), accessing senior leadership corporate emails and source code.

## Compromised Assets & Data Scope

- **Primary Data Classes:** Senior Leadership Corporate Email Accounts, Cybersecurity Strategy Communications, Source Code Repositories.

## Statutory Disclosures & Compliance

- Statutory filing submitted to SEC (Form 8-K (Item 1.05)) under accession 0001193125-24-011295.

## Timeline

### 2024-01-12 18:00 UTC
- **Event:** Microsoft security team detects Russian state-sponsored threat actor Midnight Blizzard accessing corporate email systems via legacy OAuth tenant test account.
- **Verification:** CONFIRMED BY TARGET
- **Source:** [Microsoft Security Response Center (MSRC) Advisory](https://msrc.microsoft.com/blog/2024/01/microsoft-actions-following-attack-by-nation-state-actor-midnight-blizzard/)

### 2024-01-19 21:00 UTC
- **Event:** Microsoft files Form 8-K Item 1.05 detailing Midnight Blizzard intrusion into senior executive email accounts and cybersecurity staff communications.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-24-011295)](https://www.sec.gov/Archives/edgar/data/789019/000119312524011295/0001193125-24-011295-index.htm)

### 2024-03-08 17:00 UTC
- **Event:** Microsoft Form 8-K update discloses threat actor used exfiltrated email secrets to gain unauthorized access to internal source code repositories.
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [SEC EDGAR 8-K Item 1.05 Update (Adsh 0001193125-24-062997)](https://www.sec.gov/Archives/edgar/data/789019/000119312524062997/0001193125-24-062997-index.htm)

### 2026-10-01 19:32 UTC
- **Event:** Microsoft says threat actors are ahead in the early AI race
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/microsoft-says-threat-actors-are-ahead-in-the-early-ai-race/)

### 2026-09-25 12:00 UTC
- **Event:** CISA Adds Two Known Exploited Vulnerabilities to Catalog
- **Verification:** CONFIRMED BY REGULATOR
- **Source:** [CISA Cybersecurity Advisories Report](https://www.cisa.gov/news-events/alerts/2026/09/25/cisa-adds-two-known-exploited-vulnerabilities-catalog)

### 2026-08-11 21:28 UTC
- **Event:** Press Coverage: Microsoft Plugs Nearly 400 Security Holes
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Krebs on Security Report](https://krebsonsecurity.com/2026/08/microsoft-plugs-nearly-400-security-holes/)

### 2026-10-06 05:22 UTC
- **Event:** Press Coverage: ClickFix Smuggles Payloads Through Browser Cache to Bypass Windows Run Limits
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/clickfix-smuggles-payloads-through.html)

### 2026-10-03 14:36 UTC
- **Event:** Press Coverage: Warlock Exploits SharePoint Flaws to Disable Security Tools and Deploy Ransomware
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/warlock-exploits-sharepoint-flaws-to.html)

### 2026-09-29 15:12 UTC
- **Event:** Press Coverage: 'NeedyMantis' Provides Long-Term Access to Compromised Networks
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Dark Reading Report](https://www.darkreading.com/threat-intelligence/needymantis-long-term-access-compromised-networks)

### 2026-10-02 14:15 UTC
- **Event:** Press Coverage: Microsoft: AI Cuts Post-Compromise Attack Time to Minutes
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/microsoft-ai-attack-time-minutes/)

### 2026-08-28 09:30 UTC
- **Event:** Press Coverage: Window to Tackle Surge in AI-Enabled Cyber Attacks Narrowing, Tech Giants Warn
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/window-ai-attacks-narrowing-tech/)

### 2026-10-09 06:32 UTC
- **Event:** Press Coverage: October 2026 Patch Tuesday forecast: Time for an Office cleanup
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/09/october-2026-patch-tuesday-forecast/)

### 2026-10-11 06:00 UTC
- **Event:** Mainstream Media Pickup: ‘You have a meeting’: the calendar phishing scam growing exponentially
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/money/2026/oct/11/calendar-phishing-scam-meeting-renewal-google-microsoft-paypal)

### 2026-10-12 07:52 UTC
- **Event:** Mainstream Media Pickup: AI less regulated than milk, Microsoft president says in warning over safety
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/technology/2026/oct/12/ai-less-regulated-than-milk-microsoft-president-calls-for-tougher-rules)

### 2026-10-13 12:00 UTC
- **Event:** CISA Adds Two Known Exploited Vulnerabilities to Catalog
- **Verification:** GOVERNMENT ADVISORY
- **Source:** [CISA Cybersecurity Advisories Report](https://www.cisa.gov/news-events/alerts/2026/10/13/cisa-adds-two-known-exploited-vulnerabilities-catalog)

### 2026-10-13 19:56 UTC
- **Event:** Press Coverage: Microsoft October 2026 Patch Tuesday fixes 1,411 flaws, 3 zero-days
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/microsoft/microsoft-october-2026-patch-tuesday-fixes-1-411-flaws-3-zero-days/)

### 2026-10-13 13:12 UTC
- **Event:** Press Coverage: Xandr Fined a Record €8.6 Million for Relaying Grindr Data Revealing Sexual Orientation
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/xandr-fined-record-86-million-for.html)

### 2026-10-13 22:29 UTC
- **Event:** Press Coverage: Zero-Days Lurk in Microsoft's Overgrown October Patch Tuesday
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Dark Reading Report](https://www.darkreading.com/vulnerabilities-threats/zero-days-microsoft-october-patch-tuesday)

### 2026-10-14 07:16 UTC
- **Event:** Press Coverage: Microsoft Patches Record 1,413 Vulnerabilities, Including Exploited Windows Zero-Day
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/microsoft-patches-record-1413-vulnerabilities-including-exploited-windows-zero-day/)

### 2026-10-14 04:34 UTC
- **Event:** Press Coverage: Microsoft Patches Record 1,413 Flaws, Including Exploited Windows Shell Bug
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/microsoft-patches-record-1413-flaws.html)

### 2026-10-14 07:53 UTC
- **Event:** Press Coverage: Microsoft fixes exploited Mark of the Web bypass vulnerability (CVE-2026-96951)
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/14/microsoft-patch-tuesday-cve-2026-96951-motw-bypass/)

### 2026-10-14 14:01 UTC
- **Event:** Press Coverage: Microsoft Patch Tuesday Sets New Record with 1,415 CVEs in October 2026 Updates
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/200953/security/microsoft-patch-tuesday-sets-new-record-with-1415-cves-in-october-2026-updates.html)

### 2026-10-14 17:42 UTC
- **Event:** Press Coverage: Microsoft drops an actively exploited zero-day among record high of 1,413 vulnerabilities
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [CyberScoop Report](https://cyberscoop.com/microsoft-patch-tuesday-october-2026/)

### 2026-10-14 21:15 UTC
- **Event:** Press Coverage: U.S. CISA adds Microsoft Windows Shell flaw to its Known Exploited Vulnerabilities catalog
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/200965/hacking/u-s-cisa-adds-microsoft-windows-shell-flaw-to-its-known-exploited-vulnerabilities-catalog.html)

### 2026-10-22 11:28 UTC
- **Event:** Press Coverage: Microsoft says ConnectWise breach let Chinese spies loose on 2,250 cloud tenants
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Register Security Report](https://www.theregister.com/security/2026/10/22/microsoft-says-connectwise-breach-let-chinese-spies-loose-on-2250-cloud-tenants/5304687)

### 2026-10-20 16:17 UTC
- **Event:** Press Coverage: ConnectWise customers hit by supply-chain attack linked to compromised API secret
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [CyberScoop Report](https://cyberscoop.com/connectwise-cloud-backup-supply-chain-attack/)

### 2026-10-23 10:30 UTC
- **Event:** Press Coverage: Widespread Token-Spraying Attacks Target Microsoft 365 Accounts For Email Compromise
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/tokenspraying-attacks-target/)

### 2026-10-22 11:00 UTC
- **Event:** Press Coverage: Microsoft: Chinese State Actor Used AI to Compromise ConnectWise Tenants
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/microsoft-chinese-ai-connectwise/)

### 2026-10-19 10:30 UTC
- **Event:** Press Coverage: ConnectWise Shuts Off Cloud Services After ‘Unauthorized Access’ to Microsoft 365 Tenants
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/connectwise-shuts-off-cloud/)

### 2026-10-23 11:45 UTC
- **Event:** Press Coverage: Microsoft 365 accounts compromised at 79 organizations, no passwords needed
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/23/microsoft-365-accounts-stolen-sessions/)

### 2026-10-22 20:47 UTC
- **Event:** Press Coverage: Microsoft Links ConnectWise Breach to China-Linked Group Using AI Pentesting Tool ARTEX
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/201501/apt/microsoft-links-connectwise-breach-to-china-linked-group-using-ai-pentesting-tool-artex.html)

### 2026-10-26 08:35 UTC
- **Event:** Press Coverage: Microsoft 365 Token-Replay Attacks Compromise 97 Accounts at 79 Organizations
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/microsoft-365-token-replay-attacks.html)

### 2026-10-26 15:52 UTC
- **Event:** Press Coverage: Attackers Use Microsoft Teams IT Support Scams to Deploy Malware and Ransomware
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/attackers-use-microsoft-teams-it.html)

### 2026-10-27 14:01 UTC
- **Event:** Press Coverage: The Huntress Tragic Quadrant: Ranking Threats Hitting Businesses Hardest
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/security/the-huntress-tragic-quadrant-ranking-threats-hitting-businesses-hardest/)

### 2026-10-27 12:09 UTC
- **Event:** Press Coverage: Microsoft Authenticator Flaw Let Permissionless Android Apps Steal Work Account Tokens
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/10/microsoft-authenticator-flaw-let.html)

### 2026-10-27 18:20 UTC
- **Event:** Press Coverage: Microsoft releases Windows OOB updates to distrust eMudhra certificates
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/microsoft/microsoft-releases-windows-oob-updates-to-distrust-emudhra-certificates/)
