/**
 * Automated SEC EDGAR Historical Archive Ingestion Pipeline
 * Ingests all Form 8-K Item 1.05 and verified Item 8.01 cybersecurity filings
 * from December 18, 2023 (effective date of the SEC rule) to the present.
 * Downloads primary filing documents and extracts verbatim statutory disclosures.
 */

import fs from 'fs';
import path from 'path';
import matter from './matter.js';
import { validateIncidentFile } from './validate.js';
import { reconcileIncidents } from './reconcile-enrichment.js';
import { fetchSecDocText, extractItemDisclosureText } from './regulatory/sec-edgar.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_TIMEOUT_MS = 15000;
const PACE_DELAY_MS = 250; // Respect SEC fair-access limits

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const KNOWN_EDGAR_TARGETS = {
  'quest diagnostics': { name: 'Quest Diagnostics', domain: 'questdiagnostics.com', slug: 'quest-diagnostics' },
  'astrana health': { name: 'Astrana Health', domain: 'astranahealth.com', slug: 'astrana-health' },
  'park dental partners': { name: 'Park Dental Partners', domain: 'parkdental.com', slug: 'park-dental-partners' },
  'boston scientific': { name: 'Boston Scientific', domain: 'bostonscientific.com', slug: 'boston-scientific' },
  'unitedhealth group': { name: 'Change Healthcare', domain: 'changehealthcare.com', slug: 'change-healthcare' },
  'unitedhealth': { name: 'Change Healthcare', domain: 'changehealthcare.com', slug: 'change-healthcare' },
  'loandepot': { name: 'LoanDepot', domain: 'loandepot.com', slug: 'loandepot' },
  'hewlett packard enterprise': { name: 'Hewlett Packard Enterprise', domain: 'hpe.com', slug: 'hewlett-packard-enterprise' },
  'advance auto parts': { name: 'Advance Auto Parts', domain: 'advanceautoparts.com', slug: 'advance-auto-parts' },
  'prudential financial': { name: 'Prudential Financial', domain: 'prudential.com', slug: 'prudential-financial' },
  'first american financial': { name: 'First American Financial', domain: 'firstam.com', slug: 'first-american-financial' },
  'v f corp': { name: 'VF Corporation', domain: 'vfc.com', slug: 'vf-corporation' },
  'v f': { name: 'VF Corporation', domain: 'vfc.com', slug: 'vf-corporation' },
  'at&t': { name: 'AT&T', domain: 'att.com', slug: 'at-t' },
  'globe life': { name: 'Globe Life', domain: 'globelifeinsurance.com', slug: 'globe-life' },
  'halliburton': { name: 'Halliburton', domain: 'halliburton.com', slug: 'halliburton' },
  'coinbase global': { name: 'Coinbase', domain: 'coinbase.com', slug: 'coinbase' },
  'frontier communications parent': { name: 'Frontier Communications', domain: 'frontier.com', slug: 'frontier-communications' }
};

function cleanCompanyName(raw) {
  if (!raw) return '';
  let cleaned = raw
    .replace(/\s*\([^)]*\)/g, '') // strip all parentheticals (tickers, CIK, share classes)
    .replace(/\b(?:INC|CORP|LLC|LTD|PLC|CO|CORPORATION|INCORPORATED|HOLDINGS|COMPANY)\b\.?/gi, '')
    .replace(/^[,\s.-]+|[,\s.-]+$/g, '')
    .trim();
  cleaned = cleaned.replace(/\bV\s+F\b/i, 'VF');
  if (cleaned.length > 2 && cleaned === cleaned.toUpperCase()) {
    cleaned = cleaned.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  return cleaned;
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
    .replace(/-+$/, '');
}

function findExistingIncidentFilePath(targetSlug, targetName) {
  if (!fs.existsSync(INCIDENTS_DIR)) return null;
  const files = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md'));

  for (const f of files) {
    if (f.endsWith(`-${targetSlug}.md`)) {
      return path.join(INCIDENTS_DIR, f);
    }
  }

  const targetLower = (targetName || '').toLowerCase().trim();
  if (targetLower) {
    for (const f of files) {
      try {
        const content = fs.readFileSync(path.join(INCIDENTS_DIR, f), 'utf-8');
        const { data } = matter(content);
        if (data && data.target && data.target.toLowerCase().trim() === targetLower) {
          return path.join(INCIDENTS_DIR, f);
        }
      } catch {}
    }
  }

  return null;
}

async function queryEftsWindow(queryStr, startdt, enddt) {
  const url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(queryStr)}&forms=8-K&startdt=${startdt}&enddt=${enddt}&from=0&size=100`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`   ⚠️ SEC EFTS API returned HTTP ${res.status} for [${startdt} to ${enddt}]`);
      return [];
    }

    const data = await res.json();
    return data.hits?.hits || [];
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`   ❌ Failed polling SEC EFTS [${startdt} to ${enddt}]:`, err.message);
    return [];
  }
}

/**
 * Builds standard 3-part structured incident dossier
 */
function buildStructuredDossier({
  id,
  target,
  domain,
  status,
  first_seen,
  last_updated,
  summary,
  tags,
  regulatory_filings,
  timeline
}) {
  const frontmatterObj = {
    id,
    target,
    domain,
    status,
    first_seen,
    last_updated,
    threat_actor: null,
    summary,
    tags,
    regulatory_filings,
    incident_type: 'Material Cybersecurity Incident'
  };

  const frontmatterYaml = matter.stringify('', frontmatterObj).trim();

  const filingsList = regulatory_filings.map(f =>
    `- **${f.regulator} Filing:** ${f.form} (${f.accession_number}) - [Filing Link](${f.url})`
  ).join('\n');

  const body = `

## Incident Overview

${target}, within its operating sector, has been subject to a cybersecurity incident disclosed to federal securities regulators. Ground-truth telemetry indicates the event prompted statutory disclosure under SEC cybersecurity reporting mandates.

${summary}

## Compromised Assets & Data Scope

The specific volume of affected customer, employee, or organizational records remains under active technical audit or disclosed in primary filings. Primary online perimeter and corporate domains include \`${domain}\`.

Specific classes of compromised records, infrastructure, or operational systems are detailed in the official statutory filings below.

## Statutory Disclosures & Compliance

${filingsList}

## Timeline

${timeline.trim()}
`;

  return `${frontmatterYaml}\n${body}\n`;
}

/**
 * Ingests all historical SEC cyber filings from 2023-12-18 to present
 */
export async function ingestSecArchive() {
  console.log('🏛️ Starting Comprehensive Historical SEC Cybersecurity Ingestion Pipeline (2023-12-18 to Present)...');

  const nowIso = new Date().toISOString().slice(0, 10);
  const windows = [
    ['2023-12-18', '2024-03-31'],
    ['2024-04-01', '2024-06-30'],
    ['2024-07-01', '2024-09-30'],
    ['2024-10-01', '2024-12-31'],
    ['2025-01-01', '2025-06-30'],
    ['2025-07-01', '2025-12-31'],
    ['2026-01-01', '2026-06-30'],
    ['2026-07-01', nowIso]
  ];

  const processedAccessions = new Set();
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const [startdt, enddt] of windows) {
    console.log(`\n📅 Querying SEC EDGAR Window: ${startdt} to ${enddt}...`);

    // 1. All Item 1.05 filings
    const hits105 = await queryEftsWindow('"Item 1.05"', startdt, enddt);
    await sleep(PACE_DELAY_MS);

    // 2. High-signal Item 8.01 cyber filings
    const hits801 = await queryEftsWindow('"Item 8.01" AND ("cybersecurity" OR "ransomware" OR "unauthorized access")', startdt, enddt);
    await sleep(PACE_DELAY_MS);

    const allHits = [...hits105, ...hits801];

    for (const hit of allHits) {
      const s = hit._source;
      if (!s) continue;

      const items = Array.isArray(s.items) ? s.items : [];
      const hasItem105 = items.includes('1.05');
      const hasItem801 = items.includes('8.01') && !items.includes('2.02') && !items.includes('1.01') && !items.includes('5.02');
      if (!hasItem105 && !hasItem801) continue;

      const adsh = s.adsh;
      if (!adsh || processedAccessions.has(adsh)) continue;
      processedAccessions.add(adsh);

      const rawFiler = s.display_names?.[0] || 'Unknown Organization';
      let target = cleanCompanyName(rawFiler);
      if (!target || target.length < 3) continue;

      let targetSlug = slugify(target);
      let domain = `${targetSlug.replace(/-/g, '')}.com`;

      const lowerTarget = target.toLowerCase();
      if (KNOWN_EDGAR_TARGETS[lowerTarget]) {
        target = KNOWN_EDGAR_TARGETS[lowerTarget].name;
        targetSlug = KNOWN_EDGAR_TARGETS[lowerTarget].slug;
        domain = KNOWN_EDGAR_TARGETS[lowerTarget].domain;
      }

      const cik = Array.isArray(s.ciks) ? s.ciks[0] : s.ciks;
      const fileDate = s.file_date; // YYYY-MM-DD
      if (!cik || !fileDate) continue;

      const cleanCik = parseInt(cik, 10);
      const cleanAdsh = adsh.replace(/-/g, '');
      const permanentUrl = `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAdsh}/${adsh}-index.htm`;
      const docName = hit._id ? hit._id.split(':')[1] : null;

      // Extract verbatim filing text
      console.log(`   📄 Ingesting ${target} (${fileDate}) - ${hasItem105 ? 'Item 1.05' : 'Item 8.01'}...`);
      let verbatimText = null;
      try {
        verbatimText = await fetchSecDocText({ cik, adsh, docName });
        await sleep(PACE_DELAY_MS);
      } catch (e) {
        console.warn(`      ⚠️ Could not fetch doc text for ${adsh}:`, e.message);
      }

      const formName = hasItem105 ? 'Form 8-K Item 1.05' : 'Form 8-K Item 8.01';
      const defaultDesc = `Official statutory Form 8-K filing submitted by ${target} to the SEC pursuant to cybersecurity disclosure mandates.`;
      const description = verbatimText || defaultDesc;

      const regFilingObj = {
        regulator: 'SEC',
        form: formName,
        accession_number: adsh,
        url: permanentUrl,
        filing_date: fileDate,
        description
      };

      const ym = fileDate.slice(0, 7);
      const timeUtc = `${fileDate} 16:00 UTC`;
      const verificationTier = hasItem105 ? 'CONFIRMED BY REGULATOR' : 'ACKNOWLEDGED';
      const milestoneBlock = `### ${timeUtc}\n- **Event:** SEC ${formName} Disclosure\n- **Verification:** ${verificationTier}\n- **Source:** [SEC EDGAR 8-K Filing (${adsh})](${permanentUrl})\n`;

      const summaryText = hasItem105
        ? `Official SEC Form 8-K Item 1.05 disclosure filed by ${target} regarding a material cybersecurity incident.`
        : `Official SEC Form 8-K Item 8.01 cybersecurity event disclosure filed by ${target} acknowledging an ongoing investigation or operational disruption.`;

      // Check if incident dossier already exists
      const existingPath = findExistingIncidentFilePath(targetSlug, target);

      if (existingPath && fs.existsSync(existingPath)) {
        try {
          const raw = fs.readFileSync(existingPath, 'utf-8');
          const parsed = matter(raw);
          let modified = false;

          // Elevate status: Item 1.05 -> CONFIRMED, Item 8.01 -> ACKNOWLEDGED (if not already CONFIRMED)
          if (hasItem105 && parsed.data.status !== 'CONFIRMED') {
            parsed.data.status = 'CONFIRMED';
            modified = true;
          } else if (!hasItem105 && parsed.data.status !== 'CONFIRMED' && parsed.data.status !== 'ACKNOWLEDGED') {
            parsed.data.status = 'ACKNOWLEDGED';
            modified = true;
          }

          // Ensure tags
          if (!Array.isArray(parsed.data.tags)) parsed.data.tags = [];
          const requiredTags = hasItem105 ? ['regulatory', 'sec-8k', 'confirmed'] : ['regulatory', 'sec-8k', 'acknowledged'];
          for (const t of requiredTags) {
            if (!parsed.data.tags.includes(t)) {
              parsed.data.tags.push(t);
              modified = true;
            }
          }

          // Update regulatory_filings
          if (!Array.isArray(parsed.data.regulatory_filings)) parsed.data.regulatory_filings = [];
          const existingFiling = parsed.data.regulatory_filings.find(f =>
            f.accession_number === adsh || f.url === permanentUrl
          );

          if (!existingFiling) {
            parsed.data.regulatory_filings.push(regFilingObj);
            modified = true;
          } else if (verbatimText && (!existingFiling.description || existingFiling.description.length < verbatimText.length)) {
            existingFiling.description = verbatimText;
            modified = true;
          }

          // Add milestone to timeline if not present
          if (!parsed.content.includes(permanentUrl) && !parsed.content.includes(adsh)) {
            parsed.content = parsed.content.trim() + '\n\n' + milestoneBlock;
            modified = true;
          }

          // Ensure statutory disclosures section is updated in body if missing
          if (!parsed.content.includes(permanentUrl)) {
            if (parsed.content.includes('## Statutory Disclosures & Compliance')) {
              parsed.content = parsed.content.replace(
                '## Statutory Disclosures & Compliance',
                `## Statutory Disclosures & Compliance\n\n- **SEC Filing:** ${formName} (${adsh}) - [Filing Link](${permanentUrl})`
              );
              modified = true;
            }
          }

          if (modified) {
            const updatedRaw = matter.stringify(parsed.content.trim() + '\n', parsed.data);
            fs.writeFileSync(existingPath, updatedRaw, 'utf-8');
            validateIncidentFile(existingPath);
            updatedCount++;
            console.log(`      ✅ Updated existing dossier: ${path.basename(existingPath)}`);
          } else {
            skippedCount++;
          }
        } catch (e) {
          console.error(`      ❌ Error updating ${existingPath}:`, e.message);
        }
      } else {
        // Create new incident dossier
        const newIncidentId = `${ym}-${targetSlug}`;
        const newFilePath = path.join(INCIDENTS_DIR, `${newIncidentId}.md`);

        const dossierContent = buildStructuredDossier({
          id: newIncidentId,
          target,
          domain,
          status: hasItem105 ? 'CONFIRMED' : 'ACKNOWLEDGED',
          first_seen: fileDate,
          last_updated: fileDate,
          summary: summaryText,
          tags: hasItem105 ? ['regulatory', 'sec-8k', 'confirmed'] : ['regulatory', 'sec-8k', 'acknowledged'],
          regulatory_filings: [regFilingObj],
          timeline: milestoneBlock
        });

        try {
          fs.writeFileSync(newFilePath, dossierContent, 'utf-8');
          validateIncidentFile(newFilePath);
          createdCount++;
          console.log(`      ✨ Created new ${hasItem105 ? 'confirmed' : 'acknowledged'} dossier: ${newIncidentId}.md`);
        } catch (e) {
          console.error(`      ❌ Error creating ${newFilePath}:`, e.message);
        }
      }
    }
  }

  console.log('\n======================================================');
  console.log(`🎉 Historical SEC Ingestion Complete!`);
  console.log(`   Created new dossiers: ${createdCount}`);
  console.log(`   Updated dossiers:     ${updatedCount}`);
  console.log(`   Already up to date:   ${skippedCount}`);
  console.log('======================================================\n');

  // Run forensic reconciliation
  console.log('🔄 Running downstream reconciliation and forensic catalog check...');
  reconcileIncidents();
}

if (process.argv[1] && process.argv[1].endsWith('ingest-sec-archive.js')) {
  ingestSecArchive().catch(err => {
    console.error('Fatal SEC archive ingestion error:', err);
    process.exit(1);
  });
}
