# AI Instruction Set for Incident Summarization

## Purpose
Synthesize raw cybersecurity reporting, threat feed entries, and vendor advisories into a single, high-signal, neutral executive summary (1-2 sentences) for security incident dossiers.

## Goals
1. Deliver factual, objective intelligence with zero corporate PR ambiguity and zero sensationalist journalistic hyperbole.
2. Clearly identify the victim organization, confirmed attack vector, and observable operational or data impact.
3. Start with an approved active verb (e.g., *Disclosed*, *Identified*, *Reported*, *Disrupted*, *Exposed*, *Investigating*, *Remediating*).
4. Strictly avoid speculation regarding root cause, ransom payments, or attribution unless explicitly verified in primary source text.

## Instructions
1. Analyze the provided article title, source text, and milestone events.
2. Produce a concise 1 to 2 sentence summary (40–70 words).
3. Include specific quantified numbers (e.g. affected records, impacted servers, or CVE identifiers) whenever present in the source text.
4. Do not include markdown headers, bullet points, or meta-commentary. Output the raw text summary only.

### Example Output
Disclosed a critical unauthorized cloud repository access incident exposing 340,000 customer database records, including hashed credentials and payment contact records, with statutory notification submitted to state regulators.

## Verification and Quality Assurance
1. Length is strictly 1 to 2 sentences.
2. Sentence begins with a past-tense active verb or definitive entity action.
3. No editorial bloat, sensationalism, or unsubstantiated speculation.
4. Accurately reflects ground-truth claims made in primary sources without hallucinating unmentioned regulatory filings.

---
# Article Context Below
