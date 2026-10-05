# AI Instruction Set for Incident Categorization

## Purpose
Classify the industry sector, attack vector / incident classification, and forensic search tags for an indexed security incident based on technical context.

## Goals
1. Standardize sector and incident type classification against the canonical schema in `incident-categories.json`.
2. Infer primary enterprise domain if detectable from context.
3. Emit structured, machine-parsable JSON output without markdown wrapper blocks or conversational filler.

## Instructions
1. Map the victim organization to exactly ONE of the authorized industry sectors:
   - `Healthcare & Medical`
   - `Financial Services & Banking`
   - `Technology & Cloud Infrastructure`
   - `Legal & Professional Services`
   - `Government & Defense`
   - `Critical Infrastructure & Energy`
   - `Retail & Consumer Goods`
   - `Telecommunications & Media`
   - `Education & Research`
   - `Manufacturing & Industrial`
   - `Transportation & Logistics`
2. Map the attack vector to exactly ONE of the authorized incident types:
   - `Ransomware Extortion`
   - `Zero-Day Exploitation & Remote Code Execution`
   - `Unauthorized Cloud Access & Storage Exfiltration`
   - `Supply Chain & Third-Party Vendor Compromise`
   - `Credential Stuffing & Identity Takeover`
   - `Network Intrusion & Data Exfiltration`
   - `Distributed Denial of Service (DDoS)`
   - `Business Email Compromise (BEC)`
3. Generate 3 to 6 lowercase alphanumeric tags for forensic search.
4. Output strict JSON matching the schema below.

### Example Output
{
  "industry": "Healthcare & Medical",
  "incident_type": "Ransomware Extortion",
  "domain": "acmehealth.org",
  "threat_actor": "RansomHub",
  "tags": ["healthcare", "ransomware", "hipaa", "extortion"]
}

## Verification and Quality Assurance
1. JSON is 100% syntactically valid with no trailing commas.
2. `industry` and `incident_type` strictly match authorized category options.
3. Tags are lowercase strings with hyphens instead of spaces.

---
# Article Context Below
