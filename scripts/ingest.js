import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateIncidentFile } from './validate.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');
const SOURCES_FILE = path.join(ROOT_DIR, 'sources', 'feeds.json');
const CACHE_DIR = path.join(ROOT_DIR, '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'feed-cache.json');

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 10000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFeedXml(xml) {
  const items = [];

  // 1. RSS 2.0 (<item>)
  if (xml.includes('<item>')) {
    const rawItems = xml.split('<item>');
    for (let i = 1; i < rawItems.length; i++) {
      const block = rawItems[i].split('</item>')[0];
      const titleMatch = block.match(/<title>(.*?)<\/title>/s);
      const linkMatch = block.match(/<link>(.*?)<\/link>/s);
      const dateMatch = block.match(/<(?:pubDate|dc:date)>(.*?)<\/(?:pubDate|dc:date)>/s);
      const descMatch = block.match(/<(?:description|content:encoded)>(.*?)<\/(?:description|content:encoded)>/s);

      const title = cleanHtml(titleMatch ? titleMatch[1] : '');
      const link = cleanHtml(linkMatch ? linkMatch[1] : '');
      const pubDate = cleanHtml(dateMatch ? dateMatch[1] : '');
      const description = cleanHtml(descMatch ? descMatch[1] : '');

      if (title && link) {
        items.push({ title, link, pubDate, description });
      }
    }
  }
  // 2. Atom (<entry>)
  else if (xml.includes('<entry>')) {
    const rawEntries = xml.split('<entry>');
    for (let i = 1; i < rawEntries.length; i++) {
      const block = rawEntries[i].split('</entry>')[0];
      const titleMatch = block.match(/<title.*?>(.*?)<\/title>/s);
      const linkMatch = block.match(/<link.*?href=["'](.*?)["']/s) || block.match(/<link>(.*?)<\/link>/s);
      const dateMatch = block.match(/<(?:updated|published)>(.*?)<\/(?:updated|published)>/s);
      const summaryMatch = block.match(/<(?:summary|content).*?>(.*?)<\/(?:summary|content)>/s);

      const title = cleanHtml(titleMatch ? titleMatch[1] : '');
      const link = cleanHtml(linkMatch ? linkMatch[1] : '');
      const pubDate = cleanHtml(dateMatch ? dateMatch[1] : '');
      const description = cleanHtml(summaryMatch ? summaryMatch[1] : '');

      if (title && link) {
        items.push({ title, link, pubDate, description });
      }
    }
  }

  return items;
}

const INCIDENT_KEYWORDS = [
  'breach', 'ransomware', 'unauthorized access', 'exfiltrat', 'extort',
  'compromis', 'data leak', 'stolen records', 'hacked', 'cyberattack',
  'exploited', 'zero-day', 'vulnerability exploited', 'outage', 'intrusion',
  'data theft', 'patient data', 'customer data', 'sec 8-k', 'item 1.05',
  'dark web', 'leak site', 'victim', 'crypto heist', 'law firm hacked'
];

const EXCLUSION_KEYWORDS = [
  'how to', 'best practices', 'webinar', 'podcast', 'top 10', 'top 5',
  'roundup', 'newsletter', 'patch tuesday review', 'opinion:', 'sponsor',
  'career', 'hiring', 'salary', 'market report', 'tips for', 'cheat sheet',
  'interview with', 'cyber security month', 'overview of', 'guide to'
];

// Blocklist for non-organization phrases extracted from headlines
const INVALID_TARGETS = new Set([
  'unknown organization', 'us soldier', 'former us', 'still on', '77 of',
  'making forensic', 'critical zeroday', 'two alleged', 'canadian man',
  'personal information', 'prison sentence', 'us uk', 'cisa says',
  'cisa adds', 'cisa orders', 'warning', 'the soc', 'zero trust',
  '3 cyber', 'june 2026', 'exploitation of', 'ghost service', 'carbonato botnet',
  'lunex stealer', 'elementor csrf', 'sharepoint rce', 'attackers bypass',
  'jadepuffer ai', 'jadepufferlinked attackers', 'jadepuffer agentic',
  'shinyhunters uses', 'pentagon data', 'poland', 'orthanc dicom',
  'conti ransomware', 'compromised github', 'cloudflare fixes',
  'chrome store', 'openai agent', 'fbi probes', 'microsoft plugs',
  'reformed hacker', 'vietnamese man', 'reco raises', 'rig security',
  'four cyber', 'official mcp', 'one does', 'critical zero-day',
  'pizza restaurant chain', 'pizza chain', 'restaurant chain',
  'hospital system', 'school district', 'law firm', 'water utility',
  'former soldier', 'dutch national', 'security firm', 'tech giant'
]);

// Curated entity knowledge map for recognized organizations and verified domains
const KNOWN_TARGETS = {
  'hogan lovells': { name: 'Hogan Lovells', domain: 'hoganlovells.com', slug: 'hogan-lovells' },
  'cadwalader': { name: 'Cadwalader', domain: 'cadwalader.com', slug: 'cadwalader' },
  'bitget': { name: 'Bitget', domain: 'bitget.com', slug: 'bitget' },
  'citrix': { name: 'Citrix', domain: 'citrix.com', slug: 'citrix' },
  'kiteworks': { name: 'Kiteworks', domain: 'kiteworks.com', slug: 'kiteworks' },
  'cloudflare': { name: 'Cloudflare', domain: 'cloudflare.com', slug: 'cloudflare' },
  'labcorp': { name: 'Labcorp', domain: 'labcorp.com', slug: 'labcorp' },
  'keio': { name: 'Keio Corporation', domain: 'keio.co.jp', slug: 'keio-corp' },
  'times car': { name: 'Times Car', domain: 'timescar.jp', slug: 'times-car' },
  'dodo': { name: 'Dodo Brands (Dodo Pizza)', domain: 'dodopizza.com', slug: 'dodo-pizza' },
  'pentagon': { name: 'U.S. Department of Defense (Pentagon)', domain: 'defense.gov', slug: 'us-dod-pentagon' },
  'defense manpower': { name: 'Defense Manpower Data Center (DoD)', domain: 'defense.gov', slug: 'us-dod-pentagon' },
  'fbi': { name: 'Federal Bureau of Investigation (FBI)', domain: 'fbi.gov', slug: 'fbi' },
  'arizona supreme court': { name: 'Arizona Supreme Court', domain: 'azcourts.gov', slug: 'arizona-supreme-court' },
  'nhs': { name: 'NHS England', domain: 'nhs.uk', slug: 'nhs-england' },
  'dutch police': { name: 'Dutch Police (Politie)', domain: 'politie.nl', slug: 'dutch-police-politie' },
  'at&t': { name: 'AT&T', domain: 'att.com', slug: 'at-t' },
  't-mobile': { name: 'T-Mobile', domain: 't-mobile.com', slug: 't-mobile' },
  'ticketmaster': { name: 'Ticketmaster', domain: 'ticketmaster.com', slug: 'ticketmaster' },
  'snowflake': { name: 'Snowflake', domain: 'snowflake.com', slug: 'snowflake' },
  'change healthcare': { name: 'Change Healthcare', domain: 'changehealthcare.com', slug: 'change-healthcare' },
  'ascension': { name: 'Ascension Health', domain: 'ascension.org', slug: 'ascension-health' }
};

function isSecurityIncident(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  for (const excl of EXCLUSION_KEYWORDS) {
    if (text.includes(excl)) return false;
  }

  return INCIDENT_KEYWORDS.some(kw => text.includes(kw));
}

function isVendorPatchAdvisory(title, description) {
  // Routine software updates/patches where vendor fixes a flaw (not a victim breach)
  if (/\b(?:patches|plugs|fixes|releases patch for|releases security update for)\b/i.test(title)) {
    if (!/\b(?:breach|extort|stolen data|ransomware|exfiltrat|infiltrat|hacked)\b/i.test(title)) {
      return true;
    }
  }
  // Attributions where a security researcher reported another company's bug
  if (/\b(?:-reported zero-day|reported by|credited with discovering)\b/i.test(title)) {
    return true;
  }
  return false;
}

function isLawEnforcementAction(title) {
  return /^(?:FBI|Police|CISA|NCSC|DOJ|SEC|Europol|Authorities|Feds)\s+(?:probes|arrests|charges|sues|raids|warns|seizes|indicts|orders|unveils)\b/i.test(title);
}

function detectThreatActor(text) {
  const actors = [
    'LockBit', 'Qilin', 'Akira', 'BlackCat', 'ALPHV', 'BlackSuit', 'Play',
    'Rhysida', 'Medusa', 'Silent Ransom Group', 'Clop', 'Scattered Spider',
    'Volt Typhoon', 'Salt Typhoon', 'Midnight Blizzard', 'Lazarus Group',
    'Dark Angels', 'BianLian', 'Dragonfly', 'Embargo', 'RansomHub', 'ShinyHunters'
  ];

  for (const a of actors) {
    if (new RegExp(`\\b${a}\\b`, 'i').test(text)) {
      return a;
    }
  }
  return null;
}

function detectStatus(title, desc) {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('8-k') || text.includes('item 1.05') || text.includes('attorney general') || text.includes('formal filing')) {
    return 'CONFIRMED';
  }
  if (text.includes('confirms breach') || text.includes('confirms hack') || text.includes('confirms data breach') || text.includes('confirms ransomware') || text.includes('notifies customers') || text.includes('admits breach') || text.includes('confirms unauthorized')) {
    return 'CONFIRMED';
  }
  if (text.includes('investigating') || text.includes('reports outage') || text.includes('operational disruption') || text.includes('diverts ambulances') || text.includes('system downtime')) {
    return 'ACKNOWLEDGED';
  }
  if (text.includes('researchers verify') || text.includes('independently verified') || text.includes('corroborated') || text.includes('samples match')) {
    return 'DEVELOPING';
  }
  if (text.includes('debunked') || text.includes('refuted') || text.includes('false alarm') || text.includes('recycled data') || text.includes('fake sample')) {
    return 'REFUTED';
  }
  if (text.includes('claims') || text.includes('leak site') || text.includes('threat actor lists') || text.includes('extortion demand') || text.includes('demands ransom') || text.includes('hackers say')) {
    return 'EMERGING';
  }
  return 'DEVELOPING';
}

function detectVerification(title, desc, defaultVerification) {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('sec 8-k') || text.includes('item 1.05') || text.includes('cisa advisory') || text.includes('attorney general')) {
    return 'CONFIRMED BY REGULATOR';
  }
  if (text.includes('confirms') || text.includes('admits') || text.includes('statement by') || text.includes('official blog') || text.includes('spokesperson said')) {
    return 'CONFIRMED BY TARGET';
  }
  if (text.includes('claims') || text.includes('leak site') || text.includes('forum post') || text.includes('threat actor lists') || text.includes('extortion demand')) {
    return 'UNVERIFIED CLAIM';
  }
  return defaultVerification || 'INDEPENDENT VERIFICATION';
}

function isValidTargetCandidate(candidate) {
  if (!candidate || candidate.length < 3 || candidate.length > 40) return false;
  const lower = candidate.toLowerCase();
  if (INVALID_TARGETS.has(lower)) return false;

  // Reject threat actors (they are adversaries, not targets)
  if (detectThreatActor(candidate) !== null) return false;

  // Reject malware, botnets, campaigns, technical terms
  if (/\b(?:botnet|malware|trojan|stealer|ransomware|backdoor|spyware|exploit|docker|flaw|firmware|scam|scammers|hackers|investigation|phishing|campaign|zero-day|zeroday|vulnerability|payload|botnets)\b/i.test(lower)) {
    return false;
  }

  // Reject trailing prepositions or verbs
  if (/\b(?:on|in|at|by|for|with|puts|uses|linked|targeting|targets|into|from|over|to)$/i.test(lower)) {
    return false;
  }

  // Must have at least one alphabetical character
  if (!/[a-z]/i.test(candidate)) return false;

  return true;
}

function extractTargetEntity(title, link = '', description = '') {
  let cleaned = title
    .replace(/^CISA Adds.*to Catalog:?\s*/i, '')
    .replace(/^Alert:\s*/i, '')
    .replace(/^Breaking:\s*/i, '')
    .replace(/^Update:\s*/i, '')
    .replace(/^UK:\s*/i, '')
    .trim();

  // Strip leading national/geographic qualifiers (e.g. "Japan's Keio", "U.S. Defense", "Russian pizza")
  cleaned = cleaned
    .replace(/^(?:Japan's|UK's|U\.S\.|US|Australia's|Canada's|France's|Germany's|Russian)\s+/i, '')
    .trim();

  const lowerTitle = cleaned.toLowerCase();

  // 1. Check known entities in title
  for (const [key, info] of Object.entries(KNOWN_TARGETS)) {
    // If the entity is preceded by "fake", "impersonating", "spoofing", skip (e.g. "fake Cloudflare lure")
    if (new RegExp(`\\b(?:fake|impersonating|spoofing|masquerading as)\\s+${key}\\b`, 'i').test(lowerTitle)) {
      continue;
    }
    if (new RegExp(`\\b${key}\\b`, 'i').test(lowerTitle)) {
      return { target: info.name, domain: info.domain, slug: info.slug };
    }
  }

  // 2. Pattern: "[Target] hacked by...", "[Target] hit by...", "[Target] confirms...", "[Target] says...", "[Target] suffers..."
  const match1 = cleaned.match(/^([A-Z0-9][a-zA-Z0-9\s&.'-]{2,35}?)\s+(?:hacked|hit by|targeted by|confirms|investigating|suffers|reports|resumes|faces|discloses|breached|warns|says|admits|halts|shuts down)/i);
  if (match1) {
    const candidate = match1[1].trim();
    if (isValidTargetCandidate(candidate)) {
      const slug = slugify(candidate);
      return { target: candidate, domain: `${slug.replace(/-/g, '')}.com`, slug };
    }
  }

  // 3. Pattern: "[Target] Data Breach Impacts...", "[Target] Cyberattack Exposes..."
  const match2 = cleaned.match(/^([A-Z0-9][a-zA-Z0-9\s&.'-]{2,35}?)\s+(?:data breach|cyberattack|security incident|ransomware attack)\s+(?:impacts|exposes|affects|leaves|leads|disrupts)/i);
  if (match2) {
    const candidate = match2[1].trim();
    if (isValidTargetCandidate(candidate)) {
      const slug = slugify(candidate);
      return { target: candidate, domain: `${slug.replace(/-/g, '')}.com`, slug };
    }
  }

  // 4. Pattern: "Cyberattack on [Target]...", "Data breach at [Target]...", "Ransomware attack hits [Target]..."
  const match3 = cleaned.match(/(?:cyberattack on|data breach at|ransomware attack hits|breach at|attack targets|hacked by)\s+([A-Z0-9][a-zA-Z0-9\s&.'-]{2,35}?)(?:\s+(?:exposes|disrupts|hits|impacts|causes|leaves|in|\.|$))/i);
  if (match3) {
    const candidate = match3[1].trim();
    if (isValidTargetCandidate(candidate)) {
      const slug = slugify(candidate);
      return { target: candidate, domain: `${slug.replace(/-/g, '')}.com`, slug };
    }
  }

  // 5. Fallback: check known entities in URL path slug only (e.g. /dodo-confirms-data-breach)
  const urlLower = link.toLowerCase();
  for (const [key, info] of Object.entries(KNOWN_TARGETS)) {
    const slugPattern = new RegExp(`(?:[-_/])${key.replace(/\\s+/g, '-')}(?:[-_/]|\\.html|$)`, 'i');
    if (slugPattern.test(urlLower)) {
      return { target: info.name, domain: info.domain, slug: info.slug };
    }
  }

  return null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

function formatDateIso(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

function formatUtcTimestamp(dateObj) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = dateObj.getUTCFullYear();
  const m = pad(dateObj.getUTCMonth() + 1);
  const d = pad(dateObj.getUTCDate());
  const hh = pad(dateObj.getUTCHours());
  const mm = pad(dateObj.getUTCMinutes());
  return `${y}-${m}-${d} ${hh}:${mm} UTC`;
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

export async function ingestFeeds() {
  console.log('📡 Starting automated cybersecurity incident ingestion...');

  if (!fs.existsSync(SOURCES_FILE)) {
    console.error(`❌ Sources file not found: ${SOURCES_FILE}`);
    return { success: false, newIncidents: 0, updatedIncidents: 0 };
  }

  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8')).filter(s => s.enabled);
  console.log(`📋 Loaded ${sources.length} active feed sources.`);

  // Load existing source URLs across all markdown incident records for stateless deduplication
  const existingSourceUrls = loadExistingSourceUrls();
  console.log(`📑 Indexed ${existingSourceUrls.size} existing source links across incident records.`);

  // Load cache
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  let cache = { etags: {}, lastModified: {}, seenLinks: [] };
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (!Array.isArray(cache.seenLinks)) cache.seenLinks = [];
      if (!cache.etags) cache.etags = {};
      if (!cache.lastModified) cache.lastModified = {};
    } catch {
      cache = { etags: {}, lastModified: {}, seenLinks: [] };
    }
  }

  const seenSet = new Set(cache.seenLinks);
  let totalNew = 0;
  let totalUpdated = 0;

  for (const source of sources) {
    console.log(`\n⏳ Fetching: ${source.name} (${source.url})...`);

    const headers = {
      'User-Agent': USER_AGENT,
      'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
    };

    if (cache.etags[source.id]) {
      headers['If-None-Match'] = cache.etags[source.id];
    }
    if (cache.lastModified[source.id]) {
      headers['If-Modified-Since'] = cache.lastModified[source.id];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(source.url, {
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.status === 304) {
        console.log(`   ⚡ 304 Not Modified - no new updates for ${source.name}`);
        await sleep(REQUEST_DELAY_MS);
        continue;
      }

      if (!response.ok) {
        console.warn(`   ⚠️ HTTP ${response.status} returned for ${source.name}, skipping`);
        await sleep(REQUEST_DELAY_MS);
        continue;
      }

      if (response.headers.get('etag')) {
        cache.etags[source.id] = response.headers.get('etag');
      }
      if (response.headers.get('last-modified')) {
        cache.lastModified[source.id] = response.headers.get('last-modified');
      }

      const xmlText = await response.text();
      const items = parseFeedXml(xmlText);
      console.log(`   📥 Received ${items.length} items from ${source.name}`);

      for (const item of items) {
        if (existingSourceUrls.has(item.link) || seenSet.has(item.link)) {
          continue;
        }

        // Special handling for SEC EDGAR 8-K Form filings
        if (source.id === 'sec-edgar-8k') {
          const descLower = item.description.toLowerCase();
          const isCyberItem = descLower.includes('item 1.05') || descLower.includes('material cybersecurity');
          if (!isCyberItem) {
            continue;
          }

          const filerMatch = item.title.match(/^8-K\s*-\s*(.*?)\s*\(\d+\)/i);
          const rawTarget = filerMatch ? filerMatch[1].trim() : item.title;
          const target = rawTarget
            .replace(/\b(?:INC|CORP|LLC|LTD|PLC|CO)\b\.?/gi, '')
            .trim();
          const targetSlug = slugify(target);

          let itemDate = new Date();
          if (item.pubDate) {
            const parsed = new Date(item.pubDate);
            if (!isNaN(parsed.getTime())) itemDate = parsed;
          }
          const dateIso = formatDateIso(itemDate);
          const dateUtc = formatUtcTimestamp(itemDate);
          const ym = dateIso.slice(0, 7);

          const incidentId = `${ym}-${targetSlug}`;
          const incidentFileName = `${incidentId}.md`;
          const incidentFilePath = path.join(INCIDENTS_DIR, incidentFileName);

          const summary = `Official SEC Form 8-K Item 1.05 disclosure filed by ${target} regarding a material cybersecurity incident.`;
          const verification = 'CONFIRMED BY REGULATOR';
          const status = 'CONFIRMED';

          if (fs.existsSync(incidentFilePath)) {
            const existingRaw = fs.readFileSync(incidentFilePath, 'utf-8');
            const parsed = matter(existingRaw);
            if (!parsed.content.includes(item.link)) {
              console.log(`   ➕ Appending SEC 8-K milestone to: ${incidentId}`);
              const newMilestone = `\n### ${dateUtc}\n- **Event:** SEC Form 8-K Item 1.05 Material Cybersecurity Incident Filing\n- **Verification:** ${verification}\n- **Source:** [SEC EDGAR 8-K Disclosure](${item.link})\n`;
              const updatedContent = parsed.content.trim() + '\n' + newMilestone;
              parsed.data.last_updated = dateIso;
              parsed.data.status = 'CONFIRMED';
              if (!parsed.data.tags.includes('sec-8k')) parsed.data.tags.push('sec-8k');
              fs.writeFileSync(incidentFilePath, matter.stringify(updatedContent, parsed.data), 'utf-8');
              existingSourceUrls.add(item.link);
              seenSet.add(item.link);
              totalUpdated++;
            }
          } else {
            console.log(`   🚨 High-Assurance SEC 8-K Incident: ${target} (${incidentId})`);
            const frontmatter = {
              id: incidentId,
              target,
              domain: `${targetSlug.replace(/-/g, '')}.com`,
              status: 'CONFIRMED',
              first_seen: dateIso,
              last_updated: dateIso,
              threat_actor: null,
              summary,
              tags: ['regulatory', 'sec-8k', 'confirmed']
            };
            const milestoneBody = `## Timeline\n\n### ${dateUtc}\n- **Event:** SEC Form 8-K Item 1.05 Material Cybersecurity Incident Filing\n- **Verification:** ${verification}\n- **Source:** [SEC EDGAR 8-K Disclosure](${item.link})\n`;
            fs.writeFileSync(incidentFilePath, matter.stringify(milestoneBody, frontmatter), 'utf-8');
            const errors = validateIncidentFile(incidentFileName);
            if (errors.length === 0) {
              existingSourceUrls.add(item.link);
              seenSet.add(item.link);
              totalNew++;
            } else {
              console.warn(`   ⚠️ Validation error on SEC incident:`, errors);
              try { fs.unlinkSync(incidentFilePath); } catch {}
            }
          }
          continue;
        }

        // Standard RSS/Atom feed processing
        if (!isSecurityIncident(item.title, item.description)) {
          continue;
        }

        if (isLawEnforcementAction(item.title)) {
          continue;
        }

        // Extract entity
        const entityInfo = extractTargetEntity(item.title, item.link, item.description);
        if (!entityInfo) {
          continue;
        }

        const { target, domain } = entityInfo;
        const targetSlug = entityInfo.slug || slugify(target);
        if (!targetSlug || INVALID_TARGETS.has(targetSlug)) {
          continue;
        }

        let itemDate = new Date();
        if (item.pubDate) {
          const parsed = new Date(item.pubDate);
          if (!isNaN(parsed.getTime())) {
            itemDate = parsed;
          }
        }

        const dateIso = formatDateIso(itemDate);
        const dateUtc = formatUtcTimestamp(itemDate);
        const ym = dateIso.slice(0, 7);

        const incidentId = `${ym}-${targetSlug}`;
        const incidentFileName = `${incidentId}.md`;
        const incidentFilePath = path.join(INCIDENTS_DIR, incidentFileName);

        // Check for routine vendor patch notices
        if (isVendorPatchAdvisory(item.title, item.description)) {
          // Only append if the target already has an open incident record to avoid false positive breach files
          if (!fs.existsSync(incidentFilePath)) {
            continue;
          }
        }

        const status = detectStatus(item.title, item.description);
        const threatActor = detectThreatActor(`${item.title} ${item.description}`);
        const verification = detectVerification(item.title, item.description, source.defaultVerification);

        let summary = cleanHtml(item.description || item.title);
        if (summary.length < 30) {
          summary = `${item.title}. Verified cybersecurity telemetry and event monitoring.`;
        }
        if (summary.length > 250) {
          summary = summary.slice(0, 247).trim() + '...';
        }

        if (fs.existsSync(incidentFilePath)) {
          // Update existing incident
          try {
            const existingRaw = fs.readFileSync(incidentFilePath, 'utf-8');
            const parsed = matter(existingRaw);

            if (!parsed.content.includes(item.link)) {
              console.log(`   ➕ Appending milestone to: ${incidentId}`);

              const newMilestone = `\n### ${dateUtc}\n- **Event:** ${cleanHtml(item.title)}\n- **Verification:** ${verification}\n- **Source:** [${source.name} Intelligence Notice](${item.link})\n`;
              const updatedContent = parsed.content.trim() + '\n' + newMilestone;

              // Ensure date order
              const dates = [parsed.data.first_seen, parsed.data.last_updated, dateIso].filter(Boolean).sort();
              parsed.data.first_seen = dates[0];
              parsed.data.last_updated = dates[dates.length - 1];

              const statusRank = { 'REFUTED': 0, 'EMERGING': 1, 'DEVELOPING': 2, 'ACKNOWLEDGED': 3, 'CONFIRMED': 4 };
              const currentStatus = parsed.data.status || 'EMERGING';
              if ((statusRank[status] || 0) > (statusRank[currentStatus] || 0)) {
                parsed.data.status = status;
              }

              if (threatActor && !parsed.data.threat_actor) {
                parsed.data.threat_actor = threatActor;
              }

              const newFileContent = matter.stringify(updatedContent, parsed.data);
              fs.writeFileSync(incidentFilePath, newFileContent, 'utf-8');

              const errors = validateIncidentFile(incidentFileName);
              if (errors.length === 0) {
                totalUpdated++;
                existingSourceUrls.add(item.link);
                seenSet.add(item.link);
              } else {
                console.warn(`   ⚠️ Validation warning on updated ${incidentFileName}:`, errors);
              }
            }
          } catch (err) {
            console.error(`   ❌ Failed updating incident ${incidentId}:`, err.message);
          }
        } else {
          // Create new incident
          console.log(`   ✨ New Verified Incident Discovered: [${status}] ${target} (${incidentId})`);

          const frontmatter = {
            id: incidentId,
            target,
            domain,
            status,
            first_seen: dateIso,
            last_updated: dateIso,
            threat_actor: threatActor || null,
            summary,
            tags: [source.type, status.toLowerCase()]
          };

          const milestoneBody = `## Timeline\n\n### ${dateUtc}\n- **Event:** ${cleanHtml(item.title)}\n- **Verification:** ${verification}\n- **Source:** [${source.name} Report](${item.link})\n`;

          const markdownContent = matter.stringify(milestoneBody, frontmatter);
          fs.writeFileSync(incidentFilePath, markdownContent, 'utf-8');

          const errors = validateIncidentFile(incidentFileName);
          if (errors.length === 0) {
            totalNew++;
            existingSourceUrls.add(item.link);
            seenSet.add(item.link);
          } else {
            console.warn(`   ⚠️ Validation errors on new ${incidentFileName}, removing:`, errors);
            try { fs.unlinkSync(incidentFilePath); } catch {}
          }
        }
      }

      await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      console.error(`   ❌ Error fetching feed ${source.name}:`, err.message);
      await sleep(REQUEST_DELAY_MS);
    }
  }

  cache.seenLinks = [...seenSet].slice(-500);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');

  console.log(`\n🎉 Ingestion complete: ${totalNew} new incident(s) discovered, ${totalUpdated} incident(s) updated.`);
  return { success: true, newIncidents: totalNew, updatedIncidents: totalUpdated };
}

// Run directly from CLI
if (process.argv[1] && (process.argv[1].endsWith('ingest.js') || process.argv[1].includes('ingest'))) {
  ingestFeeds().catch(err => {
    console.error('Fatal ingestion error:', err);
    process.exit(1);
  });
}
