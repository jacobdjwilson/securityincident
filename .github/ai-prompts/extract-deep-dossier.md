# AI Instruction Set for Deep Incident Dossier Extraction

## Purpose
Extract rich forensic security intelligence, technical vulnerability telemetry, authoritative directives, vendor security bulletins, and structured multi-section dossier briefings from unstructured cybersecurity disclosures, technical write-ups, or news reports.

## Goals
1. Extract all specific CVE identifiers (`CVE-YYYY-NNNNN`) and CVSS severity metrics mentioned in the context.
2. Disentangle and structure Authoritative Sources into their correct taxonomy:
   - `agency_advisories`: Sovereign government directives and alerts (CISA KEV/BOD, UK NCSC, FBI PIN/Flash, BSI, CCCS).
   - `vendor_advisories`: Target vendor official security bulletins (e.g. Citrix CTX, Microsoft MSRC, Cisco PSIRT), capturing bulletin ID, affected products, fixed versions, workarounds, and exploitation status.
   - `consortium_bulletins`: Industry ISAC or consortium alerts (Health-ISAC, FS-ISAC, FIRST).
3. Quantify affected population count (`affected_records` as integer or null) and map compromised data into authorized classes.
4. Synthesize a 3-part technical narrative dossier:
   - `overview`: A 2-3 paragraph technical briefing describing the target profile, discovery vector, adversary actions, and operational disruption.
   - `assets_scope`: Detailed breakdown of exposed infrastructure, network perimeters, credentials, and data classes.
   - `directives_summary`: Summary of regulatory filings, agency directives, and vendor remediation packages.
5. Strict Invariance: Never modify statutory regulatory filings (SEC 8-K Item 1.05, State AG breach notices, HHS OCR).

## Extraction Instructions
1. Scrutinize the input context for CVE numbers (`CVE-\d{4}-\d{4,7}`), CVSS scores, software products, and affected version ranges.
2. Identify any vendor security bulletins or patch notices, extracting:
   - `publisher`: Target vendor or company name
   - `advisory_id`: Bulletin identifier (e.g., `CTX697096`, `ADV240001`)
   - `title`: Bulletin title
   - `severity`: Severity string (e.g., `Critical (CVSS 9.5)`)
   - `affected_products`: Array of impacted software/hardware editions
   - `fixed_versions`: Array of patched releases
   - `workarounds`: Actionable mitigation workarounds or statement of no workarounds
   - `verification_guidance`: Appliance audit, log check, or memory verification instructions
   - `exploitation_status`: In-the-wild exploitation details, zero-day status, webshell indicators
   - `url`: Direct link to official bulletin
3. Identify any sovereign government directives (CISA, NCSC, FBI), extracting:
   - `agency`: Agency name (e.g., `CISA (Cybersecurity and Infrastructure Security Agency)`)
   - `advisory_id`: Directive or alert ID (e.g., `BOD 22-01 / KEV Catalog Directive`)
   - `advisory_type`: Directive classification
   - `mandate`: Statutory mandate or compliance deadline (e.g., FCEB 72-hour remediation)
   - `cve_ids`: Array of targeted CVEs
   - `url`: Direct link to agency alert
4. Parse affected records (convert text like "1.2M" to integer `1200000`, or `null` if unstated).
5. Output strict JSON only.

### Example Output
```json
{
  "cve_ids": ["CVE-2026-88771", "CVE-2026-88772"],
  "affected_records": null,
  "compromised_data": [
    "In-Memory Session Tokens & Cookies",
    "SSL/TLS Private Keys & Cryptographic Secrets"
  ],
  "threat_actor": "State-Sponsored Advanced Persistent Threat (APT)",
  "agency_advisories": [
    {
      "agency": "CISA (Cybersecurity and Infrastructure Security Agency)",
      "advisory_id": "BOD 22-01 / KEV Catalog Directive",
      "advisory_type": "Binding Operational Directive / Known Exploited Vulnerabilities",
      "cve_ids": ["CVE-2026-88771", "CVE-2026-88772"],
      "mandate": "FCEB agencies must isolate or remediate internet-facing appliances within 72 hours under 44 U.S.C. § 3553(b)(2).",
      "release_date": "2026-09-27",
      "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      "description": "CISA confirmed active in-the-wild zero-day exploitation."
    }
  ],
  "vendor_advisories": [
    {
      "publisher": "Cloud Software Group (Citrix)",
      "advisory_id": "CTX697096",
      "title": "Citrix NetScaler ADC and Gateway Security Bulletin",
      "severity": "Critical (CVSS 9.5)",
      "release_date": "2026-09-27",
      "cve_ids": ["CVE-2026-88771", "CVE-2026-88772"],
      "affected_products": ["NetScaler ADC 14.1 (< 14.1-73.37)", "NetScaler ADC 13.1 (< 13.1-64.23)"],
      "fixed_versions": ["NetScaler ADC 14.1-73.37 and later", "NetScaler ADC 13.1-64.23 and later"],
      "workarounds": "No configuration workaround eliminates RCE; upgrading firmware is mandatory.",
      "verification_guidance": "Inspect /var/netscaler/bins/ for webshell scripts and capture memory dumps.",
      "exploitation_status": "Active zero-day exploitation in the wild.",
      "url": "https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX697096",
      "description": "Official vendor bulletin disclosing unauthenticated remote code execution zero-days."
    }
  ],
  "narrative_overview": "Technical briefing of the event...",
  "compromised_assets_detail": "Detailed breakdown of exposed systems..."
}
```

## Verification and Quality Assurance
1. Strict JSON format: No markdown code blocks, explanatory preamble, or trailing text.
2. All extracted URLs must be direct, specific links from the source text.
3. Regulators must NOT include CISA, NCSC, FBI, or vendor bulletins.
4. Record counts must be positive integers or null.

---
# Document Context Below
