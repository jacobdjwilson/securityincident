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
const REQUEST_TIMEOUT_MS = 8000;

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

// Blocklist for invalid or non-organization entities extracted from headline fragments
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
  'chrome store', 'openai agent', 'fbi probes', 'microsoft plugs'
]);

// Curated entity knowledge map for recognized targets
const KNOWN_TARGETS = {
  'hogan lovells': { name: 'Hogan Lovells', domain: 'hoganlovells.com' },
  'cadwalader': { name: 'Cadwalader', domain: 'cadwalader.com' },
  'bitget': { name: 'Bitget', domain: 'bitget.com' },
  'citrix': { name: 'Citrix', domain: 'citrix.com' },
  'kiteworks': { name: 'Kiteworks', domain: 'kiteworks.com' },
  'cloudflare': { name: 'Cloudflare', domain: 'cloudflare.com' },
  'labcorp': { name: 'Labcorp', domain: 'labcorp.com' },
  'meta': { name: 'Meta', domain: 'meta.com' },
  'facebook': { name: 'Meta', domain: 'meta.com' },
  'nhs': { name: 'NHS England', domain: 'nhs.uk' },
  'dutch police': { name: 'Dutch Police (Politie)', domain: 'politie.nl' },
  'google': { name: 'Google', domain: 'google.com' },
  'microsoft': { name: 'Microsoft', domain: 'microsoft.com' },
  'openai': { name: 'OpenAI', domain: 'openai.com' },
  'github': { name: 'GitHub', domain: 'github.com' },
  'at&t': { name: 'AT&T', domain: 'att.com' },
  't-mobile': { name: 'T-Mobile', domain: 't-mobile.com' },
  'ticketmaster': { name: 'Ticketmaster', domain: 'ticketmaster.com' },
  'snowflake': { name: 'Snowflake', domain: 'snowflake.com' },
  'change healthcare': { name: 'Change Healthcare', domain: 'changehealthcare.com' },
  'ascension': { name: 'Ascension Health', domain: 'ascension.org' }
};

function isSecurityIncident(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  for (const excl of EXCLUSION_KEYWORDS) {
    if (text.includes(excl)) return false;
  }

  return INCIDENT_KEYWORDS.some(kw => text.includes(kw));
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
  if (text.includes('confirms breach') || text.includes('confirms hack') || text.includes('notifies customers') || text.includes('admits breach') || text.includes('confirms unauthorized')) {
    return 'CONFIRMED';
  }
  if (text.includes('investigating') || text.includes('reports outage') || text.includes('operational disruption') || text.includes('diverts ambulances') || text.includes('system downtime')) {
    return 'ACKNOWLEDGED';
  }
  if (text.includes('researchers verify') || text.includes('independently verified') || text.includes('corroborated') || text.includes('samples match') || text.includes('critical zero-day')) {
    return 'DEVELOPING';
  }
  if (text.includes('debunked') || text.includes('refuted') || text.includes('false alarm') || text.includes('recycled data') || text.includes('fake sample')) {
    return 'REFUTED';
  }
  if (text.includes('claims') || text.includes('leak site') || text.includes('threat actor lists') || text.includes('extortion demand') || text.includes('demands ransom')) {
    return 'EMERGING';
  }
  return 'DEVELOPING';
}

function extractTargetEntity(title) {
  const lowerTitle = title.toLowerCase();

  // 1. Check known entities first
  for (const [key, info] of Object.entries(KNOWN_TARGETS)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(lowerTitle)) {
      return { target: info.name, domain: info.domain };
    }
  }

  // 2. Pattern: "[Target] hacked by...", "[Target] hit by...", "[Target] confirms..."
  let cleaned = title
    .replace(/^CISA Adds.*to Catalog:?\s*/i, '')
    .replace(/^Alert:\s*/i, '')
    .replace(/^Breaking:\s*/i, '')
    .replace(/^Update:\s*/i, '')
    .replace(/^UK:\s*/i, '')
    .trim();

  const match1 = cleaned.match(/^([A-Z0-9][a-zA-Z0-9\s&.'-]{2,30}?)\s+(?:hacked|hit by|targeted by|confirms|investigating|suffers|reports|resumes|faces|discloses|breached|warns)/i);
  if (match1) {
    const candidate = match1[1].trim();
    if (!INVALID_TARGETS.has(candidate.toLowerCase()) && candidate.length >= 3) {
      const slug = slugify(candidate);
      return { target: candidate, domain: `${slug.replace(/-/g, '')}.com` };
    }
  }

  // 3. Pattern: "Cyberattack on [Target] exposes...", "Data breach at [Target]..."
  const match2 = cleaned.match(/(?:cyberattack on|data breach at|ransomware attack hits|breach at|attack targets)\s+([A-Z0-9][a-zA-Z0-9\s&.'-]{2,30}?)(?:\s+(?:exposes|disrupts|hits|impacts|causes|leaves|in|\.|$))/i);
  if (match2) {
    const candidate = match2[1].trim();
    if (!INVALID_TARGETS.has(candidate.toLowerCase()) && candidate.length >= 3) {
      const slug = slugify(candidate);
      return { target: candidate, domain: `${slug.replace(/-/g, '')}.com` };
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

export async function ingestFeeds() {
  console.log('📡 Starting automated cybersecurity incident ingestion...');

  if (!fs.existsSync(SOURCES_FILE)) {
    console.error(`❌ Sources file not found: ${SOURCES_FILE}`);
    return { success: false, newIncidents: 0, updatedIncidents: 0 };
  }

  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8')).filter(s => s.enabled);
  console.log(`📋 Loaded ${sources.length} active feed sources.`);

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

      const recentItems = items.slice(0, 15);

      for (const item of recentItems) {
        if (seenSet.has(item.link)) {
          continue;
        }

        if (!isSecurityIncident(item.title, item.description)) {
          continue;
        }

        // Extract entity
        const entityInfo = extractTargetEntity(item.title);
        if (!entityInfo) {
          continue;
        }

        const { target, domain } = entityInfo;
        const targetSlug = slugify(target);
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

        const status = detectStatus(item.title, item.description);
        const threatActor = detectThreatActor(`${item.title} ${item.description}`);
        const verification = source.defaultVerification || 'INDEPENDENT VERIFICATION';

        let summary = cleanHtml(item.description || item.title);
        if (summary.length < 30) {
          summary = `${item.title}. Verified cybersecurity telemetry and event monitoring.`;
        }
        if (summary.length > 250) {
          summary = summary.slice(0, 247) + '...';
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
              let currentStatus = parsed.data.status || 'EMERGING';
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
          console.log(`   ✨ New Real Incident Discovered: [${status}] ${target} (${incidentId})`);

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
