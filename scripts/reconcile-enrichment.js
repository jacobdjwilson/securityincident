/**
 * Downstream Cross-Checking & Forensic Reconciliation Engine
 * Audits all incident dossiers against secondary intelligence, normalizes fields,
 * extracts missing forensic metadata (affected_records, compromised_data, industry),
 * and corrects status discrepancies across incident timelines.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateIncidentFile } from './validate.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');

// Curated entity enrichment catalog with known metadata
const ENTITY_ENRICHMENT_CATALOG = {
  'crowdstrike': {
    industry: 'Technology',
    incident_type: 'IT Outage / Configuration Fault',
    threat_actor: null,
    affected_records: 8500000,
    compromised_data: ['Windows Kernel Driver Configuration', 'Global Infrastructure Availability']
  },
  'at-t': {
    industry: 'Telecommunications',
    incident_type: 'Third-Party Cloud Compromise',
    threat_actor: 'ShinyHunters',
    affected_records: 110000000,
    compromised_data: ['Call Detail Records (CDRs)', 'Customer Telephone Numbers', 'Cell Site Location Identification (CSLI)']
  },
  'snowflake': {
    industry: 'Technology',
    incident_type: 'Credential Stuffing / Cloud Account Takeover',
    threat_actor: 'UNC5537',
    affected_records: 165000000,
    compromised_data: ['Customer Data Warehouses', 'Authentication Credentials']
  },
  'greenberg-traurig': {
    industry: 'Legal',
    incident_type: 'Ransomware Extortion',
    threat_actor: 'RansomHub',
    affected_records: 145000,
    compromised_data: ['Confidential Legal Workproduct', 'Client Information', 'Social Security Numbers (SSNs)']
  },
  'upbound-group': {
    industry: 'Financial Services',
    incident_type: 'Unauthorized Network Intrusion',
    affected_records: 76327,
    compromised_data: ['Customer Personal Identifiable Information (PII)', 'Social Security Numbers (SSNs)']
  },
  'medimpact-healthcare-systems': {
    industry: 'Healthcare',
    incident_type: 'Data Breach',
    affected_records: 327082,
    compromised_data: ['Protected Health Information (PHI)', 'Prescription Drug Records']
  },
  'lamb-weston': {
    industry: 'Food & Agriculture',
    incident_type: 'Data Breach',
    affected_records: 7175
  },
  'change-healthcare': {
    industry: 'Healthcare',
    incident_type: 'Ransomware Extortion',
    threat_actor: 'BlackCat',
    affected_records: 100000000,
    compromised_data: ['Protected Health Information (PHI)', 'Medical Claims', 'Billing Information']
  },
  'ascension-health': {
    industry: 'Healthcare',
    incident_type: 'Ransomware Extortion',
    threat_actor: 'BlackSuit',
    compromised_data: ['Clinical Health Records', 'Patient Names', 'Staff Credentials']
  },
  'ticketmaster': {
    industry: 'Entertainment',
    incident_type: 'Third-Party Cloud Compromise',
    threat_actor: 'ShinyHunters',
    affected_records: 560000000,
    compromised_data: ['Customer Names', 'Email Addresses', 'Payment Card Details', 'Order Histories']
  },
  'microsoft-midnight-blizzard': {
    industry: 'Technology',
    incident_type: 'Nation-State Password Spray & Cloud Access',
    threat_actor: 'Midnight Blizzard',
    compromised_data: ['Senior Leadership Corporate Email Accounts', 'Source Code Repositories']
  },
  'hewlett-packard-enterprise': {
    industry: 'Technology',
    incident_type: 'Nation-State Cloud Intrusion',
    threat_actor: 'Midnight Blizzard',
    compromised_data: ['Cybersecurity Team Mailboxes', 'Executive Communications']
  },
  'loandepot': {
    industry: 'Financial Services',
    incident_type: 'Ransomware Extortion & Encryption',
    affected_records: 16600000,
    compromised_data: ['Social Security Numbers (SSNs)', 'Mortgage Applications', 'Customer PII']
  },
  'prudential-financial': {
    industry: 'Financial Services',
    incident_type: 'Administrative Cloud Intrusion',
    threat_actor: 'ALPHV',
    affected_records: 32183,
    compromised_data: ['Employee Records', 'Contractor Information', 'Limited Customer PII']
  },
  'first-american-financial': {
    industry: 'Financial Services',
    incident_type: 'Network Intrusion & Disruption',
    affected_records: 44000,
    compromised_data: ['Title Insurance Records', 'Escrow Documents', 'Customer Identifiers']
  },
  'vf-corporation': {
    industry: 'Retail & Consumer Goods',
    incident_type: 'Ransomware Extortion & Encryption',
    threat_actor: 'ALPHV',
    affected_records: 35500000,
    compromised_data: ['Customer Personal Information', 'Order Records', 'Account Details']
  },
  'halliburton': {
    industry: 'Energy & Oil Field Services',
    incident_type: 'Network Intrusion & Ransomware',
    threat_actor: 'RansomHub',
    compromised_data: ['Internal Business Applications', 'Corporate Telemetry']
  },
  'advance-auto-parts': {
    industry: 'Retail & Consumer Goods',
    incident_type: 'Third-Party Cloud Account Takeover',
    threat_actor: 'UNC5537',
    affected_records: 380000000,
    compromised_data: ['Customer Profiles', 'Social Security Numbers (SSNs)', 'Driver License Numbers']
  },
  'cdk-global': {
    industry: 'Automotive & Software Services',
    incident_type: 'Ransomware Extortion & Software Outage',
    threat_actor: 'BlackSuit',
    affected_records: 15000000,
    compromised_data: ['Dealership Management Systems', 'Customer Records']
  }
};

const DATA_TYPE_PATTERNS = [
  { type: 'Social Security Numbers (SSNs)', regex: /\b(?:SSN|Social Security|SSNs)\b/i },
  { type: 'Protected Health Information (PHI)', regex: /\b(?:PHI|Protected Health|medical records|patient data|clinical diagnoses|health records)\b/i },
  { type: 'Financial & Banking Data', regex: /\b(?:bank account|credit card|payment card|ACH routing|wire transfer|financial records)\b/i },
  { type: 'Driver\'s License / State ID', regex: /\b(?:driver'?s license|state ID|passport numbers?)\b/i },
  { type: 'Authentication Credentials', regex: /\b(?:passwords|credentials|hashes|API keys|tokens)\b/i },
  { type: 'Proprietary Source Code & IP', regex: /\b(?:source code|proprietary IP|trade secrets|blueprints)\b/i },
  { type: 'Customer / Employee PII', regex: /\b(?:personally identifiable|personal information|customer names|dates of birth|DOB)\b/i }
];

const KNOWN_THREAT_ACTORS = [
  'LockBit', 'Qilin', 'Akira', 'BlackCat', 'ALPHV', 'BlackSuit', 'Play',
  'Rhysida', 'Medusa', 'Silent Ransom Group', 'Clop', 'Scattered Spider',
  'Volt Typhoon', 'Salt Typhoon', 'Midnight Blizzard', 'Lazarus Group',
  'Dark Angels', 'BianLian', 'Dragonfly', 'Embargo', 'RansomHub', 'ShinyHunters',
  'Interlock', 'Emperador', 'Aurora', 'Lamashtu', 'Chaos'
];

/**
 * Reconciles and upgrades incident dossiers by extracting forensic fields,
 * checking against downstream catalog intelligence, and fixing status discrepancies.
 * @returns {Object} statistics on updated and reconciled records
 */
export function reconcileIncidents() {
  console.log('🔄 Running Downstream Intelligence Reconciliation & Forensic Audit...');

  if (!fs.existsSync(INCIDENTS_DIR)) {
    return { reconciled: 0, errors: 0 };
  }

  const files = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md'));
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(INCIDENTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data;
    const body = parsed.content;
    let modified = false;

    // 1. Slug matching against Entity Catalog
    const fileSlug = file.replace(/^\d{4}-\d{2}-/, '').replace(/\.md$/, '');
    for (const [catSlug, catInfo] of Object.entries(ENTITY_ENRICHMENT_CATALOG)) {
      if (fileSlug.includes(catSlug) || (data.target && data.target.toLowerCase().includes(catSlug.replace(/-/g, ' ')))) {
        if (!data.industry && catInfo.industry) {
          data.industry = catInfo.industry;
          modified = true;
        }
        if (!data.incident_type && catInfo.incident_type) {
          data.incident_type = catInfo.incident_type;
          modified = true;
        }
        if ((data.affected_records === undefined || data.affected_records === null) && catInfo.affected_records) {
          data.affected_records = catInfo.affected_records;
          modified = true;
        }
        if ((!data.threat_actor || data.threat_actor === 'Unknown') && catInfo.threat_actor) {
          data.threat_actor = catInfo.threat_actor;
          modified = true;
        }
        if (catInfo.compromised_data && Array.isArray(catInfo.compromised_data)) {
          if (!data.compromised_data) data.compromised_data = [];
          for (const item of catInfo.compromised_data) {
            if (!data.compromised_data.includes(item)) {
              data.compromised_data.push(item);
              modified = true;
            }
          }
        }
      }
    }

    // 2. Extract missing compromised_data classes from full text if undefined
    const fullText = `${data.summary || ''} ${body}`.toLowerCase();
    if (!data.compromised_data || data.compromised_data.length === 0) {
      const extractedTypes = [];
      for (const pattern of DATA_TYPE_PATTERNS) {
        if (pattern.regex.test(fullText)) {
          extractedTypes.push(pattern.type);
        }
      }
      if (extractedTypes.length > 0) {
        data.compromised_data = extractedTypes;
        modified = true;
      }
    }

    // 3. Extract missing threat actor from full text if undefined
    if (!data.threat_actor || data.threat_actor === 'Unknown') {
      for (const actor of KNOWN_THREAT_ACTORS) {
        if (new RegExp(`\\b${actor}\\b`, 'i').test(fullText)) {
          data.threat_actor = actor;
          modified = true;
          break;
        }
      }
    }

    // 4. Status Hierarchy Reconciliation
    // If timeline contains a verified regulatory notice or confirmed target statement,
    // ensure status is elevated to CONFIRMED or ACKNOWLEDGED
    const statusRank = { 'REFUTED': 0, 'EMERGING': 1, 'DEVELOPING': 2, 'ACKNOWLEDGED': 3, 'CONFIRMED': 4 };
    const currentRank = statusRank[data.status] || 0;

    if (body.includes('CONFIRMED BY REGULATOR') || body.includes('CONFIRMED BY TARGET')) {
      if (currentRank < statusRank['CONFIRMED']) {
        data.status = 'CONFIRMED';
        modified = true;
      }
    } else if (body.includes('INDEPENDENT VERIFICATION') && currentRank < statusRank['DEVELOPING']) {
      data.status = 'DEVELOPING';
      modified = true;
    }

    // 5. Extract affected_records from timeline text if missing
    if (data.affected_records === undefined || data.affected_records === null) {
      const countMatch = body.match(/affecting\s+([\d,]+)\s+(?:residents|individuals|patients|people|victims)/i);
      if (countMatch) {
        const parsedCount = parseInt(countMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(parsedCount) && parsedCount > 0) {
          data.affected_records = parsedCount;
          modified = true;
        }
      }
    }

    // 6. Write back if changes were applied and validate
    if (modified) {
      const newFileContent = matter.stringify(body, data);
      fs.writeFileSync(filePath, newFileContent, 'utf-8');
      const errs = validateIncidentFile(file);
      if (errs.length > 0) {
        console.warn(`⚠️ Reconcile validation warning on ${file}:`, errs);
        fs.writeFileSync(filePath, raw, 'utf-8'); // rollback if invalid
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`✅ Reconciliation complete: ${updatedCount} incident dossiers enriched/reconciled.`);
  return { reconciled: updatedCount };
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('reconcile-enrichment.js')) {
  reconcileIncidents();
}
