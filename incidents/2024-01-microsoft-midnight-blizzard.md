---
id: 2024-01-microsoft-midnight-blizzard
target: Microsoft
domain: microsoft.com
status: CONFIRMED
first_seen: 2024-01-12
last_updated: 2026-11-20
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
  - publisher: Microsoft
    advisory_id: Microsoft November 2026 Patch Tuesday fixes 1,235 flaws, Out
    title: Microsoft November 2026 Patch Tuesday fixes 1,235 flaws, Outlook zero-day
    severity: Critical
    release_date: 2026-11-10
    cve_ids: []
    url: https://www.bleepingcomputer.com/news/microsoft/microsoft-november-2026-patch-tuesday-fixes-1-235-flaws-outlook-zero-day/
    description: Today is Microsoft's November 2026 Patch Tuesday, with security
      updates addressing a record-breaking 1,235 flaws, including one actively
      exploited Microsoft Outlook zero-day vulnerability. [...]
  - publisher: Microsoft
    advisory_id: Microsoft Fixes Nearly 1,100 Security Vulnerabilities
    title: Microsoft Fixes Nearly 1,100 Security Vulnerabilities
    severity: Critical
    release_date: 2026-11-10
    cve_ids: []
    url: https://krebsonsecurity.com/2026/11/microsoft-fixes-nearly-1100-security-vulnerabilities/
    description: Microsoft did another four-digit patch drop today, releasing
      updates to fix almost 1,100 security vulnerabilities in its Windows
      operating systems and supported software. This month's Patch Tuesday
      addresses 63 critical flaws -- including a zero-day in Microsoft Outlook
      -- and comes amid important security updates from other software makers,
      including Adobe, Apple, Google and Mozilla.
  - publisher: Microsoft
    advisory_id: Microsoft Patches 1,259 Flaws, Including Exploited Outlook B
    title: Microsoft Patches 1,259 Flaws, Including Exploited Outlook Bug That May
      Expose NTLMv2 Hashes
    severity: Critical
    release_date: 2026-11-11
    cve_ids: []
    url: https://thehackernews.com/2026/11/microsoft-patches-1259-flaws-including.html
    description: Microsoft on Tuesday released patches for a total of 1,259
      vulnerabilities spanning its software portfolio, the second consecutive
      month where the patch volume has exceeded 1,000 flaws. These cover 726
      flaws in Windows, 174 in Office, 61 in Developer Tools, 59 in SQL Server,
      53 in Developer Tools, and 27 in SharePoint Server. The patches also
      include 165 non-Microsoft-issued CVE identifiers.
  - publisher: Microsoft
    advisory_id: "Faxes, phones and Bluetooth: Microsoft outage forces busines"
    title: "Faxes, phones and Bluetooth: Microsoft outage forces businesses to find
      fixes - Reuters"
    severity: Critical
    release_date: 2026-11-13
    cve_ids: []
    url: https://news.google.com/rss/articles/CBMivgFBVV95cUxNWTd4RWIwQ1RNZXNmZzVFT3czU0dhcjBGNlBvV0RmNkQtdExIaWdNeEpZQ2NzR2MwS3J4R0g0MTdxaDVUSGlyRG1LZGxuNTNsb3pLTTBfZzhLZ1l2amJKdnhLLUhJUXp5NXdUalNCSHd4LWJMc05zbDBaeUI2TGhsN0ZDNVdwdTJxV0NDeG5qejNtcUxDWTRfU0ExQ19QeEFtZGJhd05oVUI3WG54WmxvbmlQYXNUSGs1NmlGLUhB?oc=5
    description: "Faxes, phones and Bluetooth: Microsoft outage forces businesses to
      find fixes Reuters"
  - publisher: Microsoft
    advisory_id: "Microsoft Warns of Coordinated Phishing Campaign Leveraging "
    title: Microsoft Warns of Coordinated Phishing Campaign Leveraging M365 Service
      Outage
    severity: Critical
    release_date: 2026-11-17
    cve_ids: []
    url: https://www.infosecurity-magazine.com/news/microsoft-phishing-service-outage/
    description: Microsoft said the high volume campaign was likely designed to
      capture user credentials, and urged organizations to investigate signs of
      compromise
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
  - cve-2026-124194
  - acknowledged
cve_ids:
  - CVE-2026-96951
  - CVE-2026-104935
  - CVE-2026-80097
  - CVE-2026-124194
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

### 2026-10-30 11:15 UTC
- **Event:** Press Coverage: Claude Code extension poisoned with persistent SSH backdoor
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/30/claude-code-extension-ssh-backdoor/)

### 2026-10-30 06:30 UTC
- **Event:** Press Coverage: Fake IT help desk callers got by on little more than names and email addresses
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/10/30/cisco-talos-it-help-desk-vishing/)

### 2026-11-02 11:08 UTC
- **Event:** Press Coverage: Attackers Pose as IT Support on Microsoft Teams, Abuse AD CS to Steal Company Data
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/11/attackers-pose-as-it-support-on.html)

### 2026-11-06 07:00 UTC
- **Event:** Press Coverage: November 2026 Patch Tuesday forecast: Old software continues to bite
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/11/06/november-2026-patch-tuesday-forecast/)

### 2026-11-10 10:00 UTC
- **Event:** Press Coverage: Russian Turla group used new toolset to silently pilfer emails from Kazakhstan, Romanian governments
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [CyberScoop Report](https://cyberscoop.com/russian-turla-group-used-new-toolset-to-silently-pilfer-emails-from-kazakhstan-romanian-governments/)

### 2026-11-10 10:00 UTC
- **Event:** Press Coverage: Turla's Cereal malware turns victims' Exchange servers into spy hubs
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/11/10/eset-turla-exchange-malware/)

### 2026-11-10 19:07 UTC
- **Event:** Press Coverage: Microsoft November 2026 Patch Tuesday fixes 1,235 flaws, Outlook zero-day
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/microsoft/microsoft-november-2026-patch-tuesday-fixes-1-235-flaws-outlook-zero-day/)

### 2026-11-10 20:55 UTC
- **Event:** Press Coverage: Microsoft’s Patch Tuesday surpasses 1,000 bugs for second month in a row
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Record by Recorded Future Report](https://therecord.media/patch-tuesday-microsoft-1000-bugs-again)

### 2026-11-10 21:55 UTC
- **Event:** Press Coverage: Microsoft Fixes Nearly 1,100 Security Vulnerabilities
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Krebs on Security Report](https://krebsonsecurity.com/2026/11/microsoft-fixes-nearly-1100-security-vulnerabilities/)

### 2026-11-10 19:19 UTC
- **Event:** Press Coverage: Exploited Outlook Zero-Day Among 1,094 Flaws Patched by Microsoft
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/exploited-outlook-zero-day-among-1094-flaws-patched-by-microsoft/)

### 2026-11-10 22:37 UTC
- **Event:** Press Coverage: November Patch Tuesday boasts over 1,000 bugs but only one zero-day so far
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Register Security Report](https://www.theregister.com/security/2026/11/10/november-patch-tuesday-boasts-over-1000-bugs-but-only-one-zero-day-so-far/5308946)

### 2026-11-10 22:26 UTC
- **Event:** Press Coverage: November Patch Tuesday: An Overflowing Cornucopia of CVEs
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Dark Reading Report](https://www.darkreading.com/vulnerabilities-threats/november-patch-tuesday-cornucopia-cves)

### 2026-11-11 08:17 UTC
- **Event:** Press Coverage: Microsoft Patches 1,259 Flaws, Including Exploited Outlook Bug That May Expose NTLMv2 Hashes
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/11/microsoft-patches-1259-flaws-including.html)

### 2026-11-11 09:03 UTC
- **Event:** Press Coverage: Microsoft November Patch Tuesday: one exploited Outlook bug and 30 wormable flaws
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/202839/hacking/microsoft-november-patch-tuesday-one-exploited-outlook-bug-and-30-wormable-flaws.html)

### 2026-11-12 20:15 UTC
- **Event:** Press Coverage: Massive Microsoft 365 outage disrupts Outlook, Teams, Copilot worldwide
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/microsoft/massive-microsoft-365-outage-disrupts-outlook-teams-copilot-worldwide/)

### 2026-11-13 15:20 UTC
- **Event:** Press Coverage: In Other News: New CISA Director Nominee, Connected Car Hacking, Baker Tilly Data Breach
- **Verification:** GOVERNMENT ADVISORY
- **Source:** [SecurityWeek Report](https://www.securityweek.com/in-other-news-new-cisa-director-nominee-connected-car-hacking-baker-tilly-data-breach/)

### 2026-11-13 13:47 UTC
- **Event:** Press Coverage: Microsoft Struggles to Restore Email and Other Services in a Global Outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/microsoft-struggles-to-restore-email-and-other-services-in-a-global-outage/)

### 2026-11-12 20:09 UTC
- **Event:** Press Coverage: Extortion Group Luna Moth Flits Into Law Firms a Second Time
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Dark Reading Report](https://www.darkreading.com/data-privacy/extortion-luna-moth-law-firms-second-time)

### 2026-11-14 09:21 UTC
- **Event:** Mainstream Media Pickup: Microsoft says services fully restored after hourslong global outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [AP News Report](https://news.google.com/rss/articles/CBMipAFBVV95cUxNZHlYRjJoX0RfREJ3UFBlQ3pacWMwMjBXeGJETGNBTFIzbHZMd1o0UFpMR00tQ25kb0x3YlBjZk4wd25hQTVoQ0FQdTVydERxenNBbkx0YVU5VGtnMUJwcW0tc2FFZ0tsMk0wbFc4TjRHWFhid01xWmljT0tZMVFicUVWRk1ueWdscFMyZXdHWGVJWjdSQ1ozLWJGdXpNMFRQdFc2Mw?oc=5)

### 2026-11-15 19:10 UTC
- **Event:** Mainstream Media Pickup: Could everything be broken? Grounded jets, Microsoft outage, AI chaos make some wonder
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [AP News Report](https://news.google.com/rss/articles/CBMimwFBVV95cUxQbUFCdzU3WWxqWDJyOThxR0pfSENwbHdjWE50LVZfX0xSUUZFZnpTemtWN2RRckNlOW56TnZwT2pmUHpPYnU0cGtiaUJ4aFpzLXZ4OHN0a3UxVEpNenFlc0VETFE2UDJkdy1Ld0ZSU2V2MHJxNE9WN3VFMjA2U1lLRThOdE5kSWk2UVdpektzb00yV3ZjUjhOeWpiNA?oc=5)

### 2026-11-13 22:43 UTC
- **Event:** Mainstream Media Pickup: Microsoft outage shows the risks of relying on a single technology provider for essential services
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [AP News Report](https://news.google.com/rss/articles/CBMiqgFBVV95cUxPYWY5MnRXdTRCaHJZT3BKRWs4TzQxdUR3NEZzQ3ZsTmxCLW9wcFJJMzFaLS1pVGhtb3BabWdhN3pvQUhPU0FNbDJMV2I0a3BWaGtuQWpxVVNxRTZIUGhNS3c5RG5oVHNGaGg3XzJDdkE1V0RBWFJKVzMzTFVnN3otc0xZNWhCWWducmlfS2dXZ3lGcUtWcFJQWkxnejVqWjFxTlZKbENDamJfUQ?oc=5)

### 2026-11-12 18:32 UTC
- **Event:** Mainstream Media Pickup: Microsoft restores service to Outlook and Teams after global outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Reuters Report](https://news.google.com/rss/articles/CBMisAFBVV95cUxPQWpWeUZnbllhcFk4WktZS0s3T1N6T3k3Vnhhd3pfSE9SWF9iRmRIQUljdHZXN0UtWS1uZS1rbUNZSlVPd1NXLXRtVUVtc3NQNTgxMVFMWjVnT3pPb09EX1g1YUx3WkF2VHk0bUMwWlhkRHdpT0JFRE5SQ3pQRkdmSnpUOHNXLUo1dXNSY3lFdkpSdU5laDdwSlhWRDVnNjBFcUh2Y0FwMXNldE8tSFpPaw?oc=5)

### 2026-11-13 03:08 UTC
- **Event:** Mainstream Media Pickup: Australia's spy agency, federal police hit by Microsoft outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Reuters Report](https://news.google.com/rss/articles/CBMiswFBVV95cUxPQ0x3UHpOT2FfZW9tc1Zia0F3NmNsZzUzUUJqd25Kcl9JdUFlOVhOMEFXR2ctazRoVXlkMFF4V1hIbGlLdnNQc3ZMRlBTeGZBVmxwSGx6a2cxVXgtZDhFUE80WFkxLUhfRjNMRmhtcGZvaGxlWjItSXpibmVXSkxrT1N4eWI4U3JzRDJnTXQ0SzBTMkFTYnBKT3JBWEQ1V0RMNzFoRDR6ckdvSTVRekw1SlU5SQ?oc=5)

### 2026-11-13 15:15 UTC
- **Event:** Mainstream Media Pickup: Faxes, phones and Bluetooth: Microsoft outage forces businesses to find fixes
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Reuters Report](https://news.google.com/rss/articles/CBMivgFBVV95cUxNWTd4RWIwQ1RNZXNmZzVFT3czU0dhcjBGNlBvV0RmNkQtdExIaWdNeEpZQ2NzR2MwS3J4R0g0MTdxaDVUSGlyRG1LZGxuNTNsb3pLTTBfZzhLZ1l2amJKdnhLLUhJUXp5NXdUalNCSHd4LWJMc05zbDBaeUI2TGhsN0ZDNVdwdTJxV0NDeG5qejNtcUxDWTRfU0ExQ19QeEFtZGJhd05oVUI3WG54WmxvbmlQYXNUSGs1NmlGLUhB?oc=5)

### 2026-11-14 06:42 UTC
- **Event:** Mainstream Media Pickup: Microsoft says services fully restored after day-long global outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/articles/c6rrg51rkz09o?at_medium=RSS&at_campaign=rss)

### 2026-11-13 21:15 UTC
- **Event:** Mainstream Media Pickup: Microsoft outage 'stark reminder' of how much we rely on tech
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/articles/cxzd9171m51qo?at_medium=RSS&at_campaign=rss)

### 2026-11-13 18:36 UTC
- **Event:** Mainstream Media Pickup: Why is Microsoft's outage lasting so long and will emails be lost?
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/articles/cwvg238zrnm5o?at_medium=RSS&at_campaign=rss)

### 2026-11-13 17:34 UTC
- **Event:** Mainstream Media Pickup: Courts, spies and MPs: How the Microsoft outage has been felt around the world
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/articles/cqp9d58eldlro?at_medium=RSS&at_campaign=rss)

### 2026-11-13 11:43 UTC
- **Event:** Mainstream Media Pickup: What we know so far about the Microsoft outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BBC News Technology Report](https://www.bbc.co.uk/news/videos/cqzjr903n01po?at_medium=RSS&at_campaign=rss)

### 2026-11-14 11:54 UTC
- **Event:** Mainstream Media Pickup: Microsoft says services fully restored after global outage hits governments
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/technology/2026/nov/14/microsoft-says-services-fully-restored-after-global-outage)

### 2026-11-13 21:06 UTC
- **Event:** Mainstream Media Pickup: Microsoft outage disrupts work and gives some a chance to unplug
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [NPR Technology Report](https://www.npr.org/2026/11/13/nx-s1-6040004/microsoft-outage-disrupts-work-and-gives-some-a-chance-to-unplug)

### 2026-11-13 09:43 UTC
- **Event:** Mainstream Media Pickup: Microsoft investigating widespread outage that took email and other apps offline
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [NPR Technology Report](https://www.npr.org/2026/11/13/nx-s1-6039350/microsoft-investigating-widespread-outage-that-took-email-and-other-apps-offline)

### 2026-11-13 01:26 UTC
- **Event:** Mainstream Media Pickup: A negative Outlook: Microsoft scrambles to fix email outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [NPR Technology Report](https://www.npr.org/2026/11/12/nx-s1-6039343/outlook-down-widespread-outage-microsoft-email)

### 2026-11-13 19:08 UTC
- **Event:** Press Coverage: Microsoft 365 Crawls Back to Life After a 24-Hour Outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Wired Security Report](https://www.wired.com/story/microsoft-365-crawls-back-to-life-after-a-24-hour-outage/)

### 2026-11-13 17:15 UTC
- **Event:** Press Coverage: The Microsoft Outage Is a Warning for the World
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Wired Security Report](https://www.wired.com/story/the-microsoft-outage-is-a-warning-for-the-world/)

### 2026-11-12 20:01 UTC
- **Event:** Press Coverage: Major Microsoft Outlook Outage Leaves People With Email Jobs Unable to Email
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Wired Security Report](https://www.wired.com/story/major-microsoft-outlook-outage-hits-365-customers-north-america/)

### 2026-11-13 12:29 UTC
- **Event:** Press Coverage: Microsoft 365 Outage Set to Ramp up Security Risks to Organizations
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/microsoft-365-outage-security/)

### 2026-11-13 06:15 UTC
- **Event:** Press Coverage: How attackers turned a Teams meeting booking into a device code phishing trap
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/11/13/microsoft-teams-device-code-phishing/)

### 2026-11-13 14:48 UTC
- **Event:** Press Coverage: Hospitals, airlines and governments hit by Microsoft outage as employee risk warnings mount
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/11/13/hospitals-airlines-and-governments-hit-by-microsoft-outage-as-employee-risk-warnings-mount/)

### 2026-11-13 14:47 UTC
- **Event:** Press Coverage: Microsoft Outage 2026: What Happened and What the Law Says
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [DataBreaches.net Report](https://databreaches.net/2026/11/13/microsoft-outage-2026-what-happened-and-what-the-law-says/)

### 2026-11-15 22:38 UTC
- **Event:** Press Coverage: The Microsoft Outage Left 15 Hotel Guests Poisoned by Chlorine
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/203189/security/the-microsoft-outage-left-15-hotel-guests-poisoned-by-chlorine.html)

### 2026-11-16 08:15 UTC
- **Event:** Press Coverage: Microsoft Rules Out Cyberattack in Outage, Warns of Phishing Campaign
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [SecurityWeek Report](https://www.securityweek.com/microsoft-rules-out-cyberattack-in-outage-warns-of-phishing-campaign/)

### 2026-11-16 11:57 UTC
- **Event:** Press Coverage: Microsoft previews remote lock for lost or stolen Windows devices
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Help Net Security Report](https://www.helpnetsecurity.com/2026/11/16/microsoft-remote-lock-feature-preview/)

### 2026-11-16 16:43 UTC
- **Event:** Press Coverage: Microsoft says months-old bug caused global Microsoft 365 outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [BleepingComputer Report](https://www.bleepingcomputer.com/news/microsoft/microsoft-says-months-old-bug-caused-global-microsoft-365-outage/)

### 2026-11-17 11:20 UTC
- **Event:** Press Coverage: New GitDoor and GraphDoor Backdoors Turn GitHub and SharePoint Into Covert C2 Channels
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/11/new-gitdoor-and-graphdoor-backdoors.html)

### 2026-11-16 20:54 UTC
- **Event:** Mainstream Media Pickup: Microsoft identifies months-old bug as a root cause of global outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/technology/2026/nov/16/microsoft-global-outage-cause)

### 2026-11-17 13:00 UTC
- **Event:** Press Coverage: Microsoft Warns of Coordinated Phishing Campaign Leveraging M365 Service Outage
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Infosecurity Magazine Report](https://www.infosecurity-magazine.com/news/microsoft-phishing-service-outage/)

### 2026-11-18 06:45 UTC
- **Event:** Press Coverage: Attackers Compromise Microsoft's Agent Framework PyPI Package to Steal Cloud Credentials
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Hacker News Report](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html)

### 2026-11-20 10:00 UTC
- **Event:** Mainstream Media Pickup: Will AI break the internet? | Garrison Lovely
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Guardian Technology Report](https://www.theguardian.com/commentisfree/2026/nov/20/ai-internet-outages-apocalypse)

### 2026-11-19 00:18 UTC
- **Event:** Mainstream Media Pickup: Microsoft CEO Satya Nadella calls Outlook outage a &apos;perfect storm.&apos; Here&apos;s what went wrong
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [CNBC Technology Report](https://www.cnbc.com/2026/11/18/microsoft-put-the-ai-threat-to-software-behind-it-then-came-the-outage.html)

### 2026-11-18 17:23 UTC
- **Event:** Press Coverage: Microsoft's official Python agent framework hijacked to distribute malware
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [The Register Security Report](https://www.theregister.com/security/2026/11/18/microsofts-official-python-agent-framework-hijacked-to-distribute-malware/5310858)

### 2026-11-20 11:23 UTC
- **Event:** Press Coverage: Trump's First Move After the Outages: Fire the Cyber Director
- **Verification:** INDEPENDENT VERIFICATION
- **Source:** [Security Affairs Report](https://securityaffairs.com/203581/intelligence/trumps-first-move-after-the-outages-fire-the-cyber-director.html)
