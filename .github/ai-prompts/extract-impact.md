# AI Instruction Set for Impact Scope and Data Extraction

## Purpose
Extract quantified affected individual/record counts and specific compromised data classes from unstructured cybersecurity news articles, researcher write-ups, or vendor notifications.

## Goals
1. Extract exact numerical record counts (convert "5.2 million" to `5200000`, "120K" to `120000`).
2. Map compromised data into standardized categorical tags from `incident-categories.json`.
3. Never invent or hallucinate impact figures if not explicitly stated in the context (emit `null` for affected_records if unquantified).
4. Never modify or override statutory regulatory filing data.

## Extraction Instructions
1. Scrutinize the provided context for mentions of affected records, users, patients, accounts, or consumers.
2. If an exact or estimated number is stated, parse it as an integer in `affected_records`. If not stated, return `null`.
3. Identify exposed sensitive information and classify into authorized classes:
   - `Social Security Numbers (SSNs)`
   - `Protected Health Information (PHI)`
   - `Financial & Banking Account Details`
   - `Payment Card Information (PCI)`
   - `Driver's License & State ID Numbers`
   - `Authentication Credentials & Password Hashes`
   - `Customer Account & Contact Records`
   - `Proprietary Source Code & Intellectual Property`
   - `Internal Corporate Communications & Emails`
4. Output strict JSON only.

### Example Output
{
  "affected_records": 485000,
  "compromised_data": [
    "Social Security Numbers (SSNs)",
    "Protected Health Information (PHI)",
    "Authentication Credentials & Password Hashes"
  ]
}

## Verification and Quality Assurance
1. `affected_records` is an integer or null, never a string with commas or letters.
2. `compromised_data` contains only authorized category strings.
3. Output is pure JSON without markdown code fences.

---
# Article Context Below
