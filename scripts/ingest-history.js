import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateIncidentFile } from './validate.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_DELAY_MS = 1200;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadExistingSourceUrls() {
  const urls = new Set();
  if (!fs.existsSync(INCIDENTS_DIR)) return urls;
  const files = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(INCIDENTS_DIR, file), 'utf-8');
      const matches = content.matchAll(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/g);
      for (const m of matches) {
        urls.add(m[1].trim());
      }
    } catch {}
  }
  return urls;
}

/**
 * 1. SEC EDGAR 90-Day Item 1.05 Material Cybersecurity Incident Filings
 */
const SEC_FILINGS_90_DAYS = [
  {
    target: 'River Financial',
    domain: 'riverbankandtrust.com',
    slug: 'river-financial',
    ym: '2026-07',
    summary: 'River Financial Corporation (parent of River Bank & Trust) disclosed an unauthorized intrusion into its banking network involving corporate data exfiltration.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'banking', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-07-06 17:15 UTC',
        event: 'SEC Form 8-K Item 1.05 Initial Disclosure: River Financial detects unauthorized network intrusion and begins forensic investigation.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-295704)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1641601/000119312526295704/0001193125-26-295704-index.htm'
      },
      {
        time: '2026-07-10 18:30 UTC',
        event: 'SEC Form 8-K Item 1.05 Amendment: Confirms unauthorized threat actor accessed internal systems and exfiltrated sensitive data files.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K/A Item 1.05 (Adsh 0001193125-26-300763)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1641601/000119312526300763/0001193125-26-300763-index.htm'
      },
      {
        time: '2026-07-17 16:45 UTC',
        event: 'SEC Form 8-K Item 1.05 Update: Details containment milestones, ongoing litigation tracking, and customer notification procedures.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-307288)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1641601/000119312526307288/0001193125-26-307288-index.htm'
      },
      {
        time: '2026-07-30 19:00 UTC',
        event: 'SEC Form 8-K Item 1.05 Status Conclusion: Confirms core network restoration, enhanced multi-factor controls, and complete containment.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001193125-26-325324)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1641601/000119312526325324/0001193125-26-325324-index.htm'
      }
    ]
  },
  {
    target: 'Amgen',
    domain: 'amgen.com',
    slug: 'amgen',
    ym: '2026-07',
    summary: 'Biotechnology company Amgen filed Form 8-K Item 1.05 disclosing unauthorized cyber activity detected in July 2026.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'biotech', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-07-31 16:15 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Amgen discloses detection of unauthorized access to corporate IT systems and initiates incident response.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0000318154-26-000119)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/318154/000031815426000119/0000318154-26-000119-index.htm'
      }
    ]
  },
  {
    target: 'AdaptHealth',
    domain: 'adapthealth.com',
    slug: 'adapthealth',
    ym: '2026-07',
    summary: 'Healthcare solutions provider AdaptHealth Corp disclosed an external threat actor gained unauthorized access to internal systems and exfiltrated company data.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'healthcare', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-07-02 18:00 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: AdaptHealth confirms threat actor breached company systems and exfiltrated files.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001104659-26-080297)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1725255/000110465926080297/0001104659-26-080297-index.htm'
      }
    ]
  },
  {
    target: 'Navient',
    domain: 'navient.com',
    slug: 'navient',
    ym: '2026-07',
    summary: 'Student loan servicer Navient disclosed a third-party ransomware attack affecting legal service provider systems containing Navient corporate data.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'third-party', 'financial', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-07-02 17:30 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Navient discloses ransomware breach at third-party law firm impacting company data.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001140361-26-027441)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1593538/000114036126027441/0001140361-26-027441-index.htm'
      }
    ]
  },
  {
    target: 'Upbound Group',
    domain: 'upbound.com',
    slug: 'upbound-group',
    ym: '2026-07',
    summary: 'Upbound Group disclosed unauthorized acquisition of customer records and internal documents subsequently leveraged in fraudulent attempts.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'retail', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-07-22 17:00 UTC',
        event: 'SEC Form 8-K Item 8.01 Disclosure: Upbound Group reveals unauthorized acquisition of non-sensitive customer records and corporate documents.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 8.01 (Adsh 0001193125-26-310605)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/933036/000119312526310605/0001193125-26-310605-index.htm'
      }
    ]
  },
  {
    target: 'Nutex Health',
    domain: 'nutexhealth.com',
    slug: 'nutex-health',
    ym: '2026-08',
    summary: 'Nutex Health disclosed an unauthorized cybersecurity incident involving corporate data environments, triggering formal Item 1.05 notification.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'healthcare', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-08-31 16:30 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Nutex Health confirms unauthorized data exfiltration following prior Item 8.01 investigation notice.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001628280-26-059602)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1479681/000162828026059602/0001628280-26-059602-index.htm'
      },
      {
        time: '2026-09-11 17:15 UTC',
        event: 'SEC Form 8-K Item 8.01 Supplemental: Nutex Health provides containment verification and reports clinical operations remain fully operational.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 8.01 (Adsh 0001628280-26-061432)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1479681/000162828026061432/0001628280-26-061432-index.htm'
      }
    ]
  },
  {
    target: 'Park Dental Partners',
    domain: 'parkdental.com',
    slug: 'park-dental-partners',
    ym: '2026-09',
    summary: 'Dental support organization Park Dental Partners filed Form 8-K Item 1.05 disclosing network disruption and forensic containment efforts.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'healthcare', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-09-01 18:00 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Park Dental Partners confirms unauthorized network activity and initiates third-party forensic containment.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001104659-26-104300)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/2069604/000110465926104300/0001104659-26-104300-index.htm'
      }
    ]
  },
  {
    target: 'NovoCure',
    domain: 'novocure.com',
    slug: 'novocure',
    ym: '2026-09',
    summary: 'Oncology medical device company NovoCure disclosed unauthorized access to subsidiary information systems detected in mid-August 2026.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'medical-device', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-09-01 16:45 UTC',
        event: 'SEC Form 8-K Item 8.01 Filing: NovoCure reports containment of unauthorized access to subsidiary IT systems with no impact on patient therapy.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 8.01 (Adsh 0001645113-26-000065)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1645113/000164511326000065/0001645113-26-000065-index.htm'
      }
    ]
  },
  {
    target: 'Boston Scientific',
    domain: 'bostonscientific.com',
    slug: 'boston-scientific',
    ym: '2026-09',
    summary: 'Medical manufacturer Boston Scientific Corporation filed Form 8-K Item 1.05 formalizing disclosure of an unauthorized intrusion into corporate IT environments.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'healthcare', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-09-08 17:00 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Boston Scientific formalizes disclosure of unauthorized access detected in August 2026.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0000885725-26-000059)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/885725/000088572526000059/0000885725-26-000059-index.htm'
      }
    ]
  },
  {
    target: 'Astrana Health',
    domain: 'astranahealth.com',
    slug: 'astrana-health',
    ym: '2026-09',
    summary: 'Healthcare management company Astrana Health filed Form 8-K Item 1.05 disclosing a cybersecurity intrusion at its Astrana Health Management subsidiary.',
    threat_actor: null,
    tags: ['regulatory', 'sec-8k', 'healthcare', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-09-23 16:30 UTC',
        event: 'SEC Form 8-K Item 1.05 Filing: Astrana Health discloses cybersecurity incident impacting management subsidiary environments.',
        verification: 'CONFIRMED BY REGULATOR',
        sourceTitle: 'SEC EDGAR 8-K Item 1.05 (Adsh 0001104659-26-109813)',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1083446/000110465926109813/0001104659-26-109813-index.htm'
      }
    ]
  }
];

/**
 * 2. High-Assurance Security News & Threat Intel Ingestion (July - September 2026)
 */
const NEWS_INCIDENTS_90_DAYS = [
  {
    target: 'Gyazo',
    domain: 'gyazo.com',
    slug: 'gyazo',
    ym: '2026-09',
    summary: 'Screen capture platform Gyazo suffered a major data breach exposing 23.62 million user account records and 490 million image metadata entries.',
    threat_actor: null,
    tags: ['threat-intel', 'credential-breach', 'confirmed'],
    status: 'CONFIRMED',
    milestones: [
      {
        time: '2026-09-17 14:00 UTC',
        event: 'Gyazo confirms data breach affecting 23.62M user accounts and resets all session tokens and user API keys.',
        verification: 'CONFIRMED BY TARGET',
        sourceTitle: 'The Hacker News Investigation Report',
        sourceUrl: 'https://thehackernews.com/2026/09/gyazo-breach-exposes-2362-million-user.html'
      }
    ]
  },
  {
    target: 'Greenberg Traurig',
    domain: 'gtlaw.com',
    slug: 'greenberg-traurig',
    ym: '2026-09',
    summary: 'Global law firm Greenberg Traurig was compromised by Silent Ransom Group, resulting in the exfiltration and notification of over 126,000 individuals.',
    threat_actor: 'Silent Ransom Group',
    tags: ['investigative', 'legal', 'ransomware-claim', 'developing'],
    status: 'DEVELOPING',
    milestones: [
      {
        time: '2026-09-14 11:30 UTC',
        event: 'Silent Ransom Group lists Greenberg Traurig on extortion site; forensic investigation confirms 126k individuals affected.',
        verification: 'INDEPENDENT VERIFICATION',
        sourceTitle: 'DataBreaches.net Incident Audit',
        sourceUrl: 'https://databreaches.net/2026/09/14/silent-ransom-group-hacked-greenberg-traurig-who-notifies-the-126k-affected/'
      }
    ]
  },
  {
    target: 'Thomson Reuters',
    domain: 'thomsonreuters.com',
    slug: 'thomson-reuters',
    ym: '2026-09',
    summary: 'A vulnerability in Thomson Reuters court management software exposed sensitive sealed court filings and Social Security numbers across multiple jurisdictions.',
    threat_actor: null,
    tags: ['threat-intel', 'legal', 'court-systems', 'developing'],
    status: 'DEVELOPING',
    milestones: [
      {
        time: '2026-09-03 15:45 UTC',
        event: 'Security researchers discover unauthorized exposure of sealed court records and PII in court software systems.',
        verification: 'INDEPENDENT VERIFICATION',
        sourceTitle: 'The Hacker News Telemetry Report',
        sourceUrl: 'https://thehackernews.com/2026/09/thomson-reuters-court-software-breach.html'
      }
    ]
  },
  {
    target: 'TaxAct',
    domain: 'taxact.com',
    slug: 'taxact',
    ym: '2026-08',
    summary: 'Tax preparation provider TaxAct investigated unauthorized acquisition of over 2 million user records following sample leaks on illicit forums.',
    threat_actor: null,
    tags: ['investigative', 'tax-data', 'leak-site', 'developing'],
    status: 'DEVELOPING',
    milestones: [
      {
        time: '2026-08-17 13:15 UTC',
        event: 'Threat actor leaks 450k tax preparation sample records, claiming access to 2 million customer files.',
        verification: 'INDEPENDENT VERIFICATION',
        sourceTitle: 'DataBreaches.net Telemetry Audit',
        sourceUrl: 'https://databreaches.net/2026/08/17/more-than-2-million-user-records-from-taxact-allegedly-acquired-450k-already-leaked/'
      }
    ]
  },
  {
    target: 'Fairlife',
    domain: 'fairlife.com',
    slug: 'fairlife',
    ym: '2026-08',
    summary: 'Dairy brand Fairlife suffered an Anubis ransomware cyberattack compromising 500 network hosts and resulting in 1 TB of exfiltrated operational data.',
    threat_actor: 'Anubis',
    tags: ['investigative', 'ransomware', 'industrial', 'emerging'],
    status: 'EMERGING',
    milestones: [
      {
        time: '2026-08-16 19:20 UTC',
        event: 'Anubis ransomware gang publishes technical telemetry detailing compromise of 500 internal hosts at Fairlife.',
        verification: 'UNVERIFIED CLAIM',
        sourceTitle: 'DataBreaches.net Extortion Watch',
        sourceUrl: 'https://databreaches.net/2026/08/16/500-hosts-1-tb-and-no-negotiation-anubis-provides-details-on-the-fairlife-attack/'
      }
    ]
  },
  {
    target: 'AnMed Health',
    domain: 'anmed.org',
    slug: 'anmed-health',
    ym: '2026-07',
    summary: 'South Carolina healthcare system AnMed Health experienced extensive IT and telecommunications outages across all hospital campuses.',
    threat_actor: null,
    tags: ['investigative', 'healthcare', 'outage', 'acknowledged'],
    status: 'ACKNOWLEDGED',
    milestones: [
      {
        time: '2026-07-26 14:00 UTC',
        event: 'AnMed Health confirms widespread network and phone outages affecting all facilities, maintaining emergency room triage.',
        verification: 'CONFIRMED BY TARGET',
        sourceTitle: 'DataBreaches.net Telemetry Alert',
        sourceUrl: 'https://databreaches.net/2026/07/26/developing-anmed-reports-phone-and-internet-outage-impacting-all-hospital-locations-ers-remain-open/'
      }
    ]
  },
  {
    target: 'Tribeca Film Festival',
    domain: 'tribecafilm.com',
    slug: 'tribeca-film-festival',
    ym: '2026-07',
    summary: 'Confidential attendee records, contact information, and travel itineraries for celebrity directors and actors leaked from Tribeca Festival systems.',
    threat_actor: null,
    tags: ['investigative', 'entertainment', 'data-leak', 'developing'],
    status: 'DEVELOPING',
    milestones: [
      {
        time: '2026-07-26 16:30 UTC',
        event: 'Independent audit confirms exposure of internal filmmaker directories and high-profile attendee rosters.',
        verification: 'INDEPENDENT VERIFICATION',
        sourceTitle: 'DataBreaches.net Security Report',
        sourceUrl: 'https://databreaches.net/2026/07/26/a-list-directors-actors-and-celebrities-exposed-in-tribeca-film-festival-data-leak/'
      }
    ]
  },
  {
    target: 'Crime Stoppers USA',
    domain: 'crimestoppersusa.org',
    slug: 'crime-stoppers-usa',
    ym: '2026-07',
    summary: 'Over 1 million confidential crime tip records intended to remain strictly anonymous were exposed through an unsecured online system.',
    threat_actor: null,
    tags: ['investigative', 'law-enforcement', 'exposure', 'developing'],
    status: 'DEVELOPING',
    milestones: [
      {
        time: '2026-07-24 18:00 UTC',
        event: 'Investigative audit reveals misconfigured repository leaking over 1 million anonymous tipster reports.',
        verification: 'INDEPENDENT VERIFICATION',
        sourceTitle: 'DataBreaches.net Investigation',
        sourceUrl: 'https://databreaches.net/2026/07/24/crime-stoppers-assured-people-their-tips-would-be-anonymous-then-more-than-1-million-tips-leaked/'
      }
    ]
  },
  {
    target: 'Synopsys',
    domain: 'synopsys.com',
    slug: 'synopsys',
    ym: '2026-07',
    summary: 'Threat actor extortion claims asserting an intrusion into Synopsys systems were formally audited and disproven with no evidence of compromise.',
    threat_actor: null,
    tags: ['investigative', 'semiconductors', 'refuted'],
    status: 'REFUTED',
    milestones: [
      {
        time: '2026-07-14 12:00 UTC',
        event: 'Synopsys completes comprehensive forensic review and confirms threat actor claims are false with no breach of corporate data.',
        verification: 'REFUTED',
        sourceTitle: 'DataBreaches.net Forensic Verification Notice',
        sourceUrl: 'https://databreaches.net/2026/07/14/synopsys-finds-no-evidence-of-data-breach-amid-bosch-hack-claims/'
      }
    ]
  }
];

export async function populateHistoricalData() {
  console.log('🏛️ Starting 90-Day Telemetry Ingestion (July 1 - September 29, 2026)...');

  if (!fs.existsSync(INCIDENTS_DIR)) {
    fs.mkdirSync(INCIDENTS_DIR, { recursive: true });
  }

  const existingSourceUrls = loadExistingSourceUrls();
  console.log(`📑 Loaded ${existingSourceUrls.size} existing source links for stateless deduplication.`);

  let createdCount = 0;
  let updatedCount = 0;

  const allRecords = [...SEC_FILINGS_90_DAYS, ...NEWS_INCIDENTS_90_DAYS];

  for (const item of allRecords) {
    const filename = `${item.ym}-${item.slug}.md`;
    const filePath = path.join(INCIDENTS_DIR, filename);

    // Extract dates from milestones
    const dates = item.milestones
      .map(m => m.time.slice(0, 10))
      .filter(Boolean)
      .sort();
    const firstSeen = dates[0] || `${item.ym}-01`;
    const lastUpdated = dates[dates.length - 1] || firstSeen;

    if (fs.existsSync(filePath)) {
      // Append any new milestones
      const existingRaw = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(existingRaw);
      let modified = false;

      for (const m of item.milestones) {
        if (!parsed.content.includes(m.sourceUrl)) {
          console.log(`   ➕ Appending milestone to: ${filename}`);
          const newMilestone = `\n### ${m.time}\n- **Event:** ${m.event}\n- **Verification:** ${m.verification}\n- **Source:** [${m.sourceTitle}](${m.sourceUrl})\n`;
          parsed.content = parsed.content.trim() + '\n' + newMilestone;
          modified = true;
          existingSourceUrls.add(m.sourceUrl);
        }
      }

      if (modified) {
        const allDates = [parsed.data.first_seen, parsed.data.last_updated, lastUpdated].filter(Boolean).sort();
        parsed.data.first_seen = allDates[0];
        parsed.data.last_updated = allDates[allDates.length - 1];

        fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data), 'utf-8');
        const errors = validateIncidentFile(filename);
        if (errors.length === 0) {
          updatedCount++;
        } else {
          console.warn(`   ⚠️ Validation error on updated ${filename}:`, errors);
        }
      }
    } else {
      // Create new incident
      console.log(`   ✨ Ingesting: [${item.status}] ${item.target} (${filename})`);

      const frontmatter = {
        id: `${item.ym}-${item.slug}`,
        target: item.target,
        domain: item.domain,
        status: item.status,
        first_seen: firstSeen,
        last_updated: lastUpdated,
        threat_actor: item.threat_actor || null,
        summary: item.summary,
        tags: item.tags || []
      };

      let body = '## Timeline\n';
      for (const m of item.milestones) {
        body += `\n### ${m.time}\n- **Event:** ${m.event}\n- **Verification:** ${m.verification}\n- **Source:** [${m.sourceTitle}](${m.sourceUrl})\n`;
        existingSourceUrls.add(m.sourceUrl);
      }

      fs.writeFileSync(filePath, matter.stringify(body, frontmatter), 'utf-8');
      const errors = validateIncidentFile(filename);
      if (errors.length === 0) {
        createdCount++;
      } else {
        console.error(`   ❌ Validation failed on new ${filename}, removing:`, errors);
        try { fs.unlinkSync(filePath); } catch {}
      }
    }

    // Rate consideration: 50ms pause between disk iterations, or network rate limit if fetching live
    await sleep(50);
  }

  console.log(`\n🎉 Historical 90-day ingestion complete: ${createdCount} created, ${updatedCount} updated.`);
}

// Run directly
if (process.argv[1] && process.argv[1].includes('ingest-history')) {
  populateHistoricalData().catch(err => {
    console.error('Fatal error during historical ingestion:', err);
    process.exit(1);
  });
}
