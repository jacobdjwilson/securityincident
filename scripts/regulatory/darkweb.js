/**
 * Real-Time Dark Web & Ransomware Data Leak Site Telemetry Scraper
 * Directly monitors threat actor onion leak portals and open telemetry collectors
 */

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_TIMEOUT_MS = 15000;

function slugify(text) {
  let slug = (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length > 50) {
    slug = slug.slice(0, 50).replace(/-[^-]*$/, '');
  }
  return slug.replace(/-+$/, '');
}

function cleanDomain(rawDomain, targetSlug) {
  if (!rawDomain) return `${targetSlug.replace(/-/g, '')}.com`;
  let cleaned = rawDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  if (cleaned.includes('.') && !cleaned.includes('*')) {
    return cleaned;
  }
  return `${targetSlug.replace(/-/g, '')}.com`;
}

function parseDataVolume(description) {
  if (!description) return null;
  const match = description.match(/\b(\d+(?:\.\d+)?\s*(?:TB|GB|MB|terabytes|gigabytes))\b/i);
  return match ? match[1].toUpperCase() : null;
}

function parseAffectedCount(description) {
  if (!description) return null;
  const match = description.match(/\b([\d,]+)\s*(?:records|patients|clients|employees|users|citizens|victims)\b/i);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
}

/**
 * Fetch latest extortion disclosures from real-time dark web ransomware leak feeds
 * @param {Object} options
 * @param {number} options.limit - maximum number of recent victims to process (default 50)
 * @returns {Promise<Array>} array of structured emerging incident claims
 */
export async function fetchDarkWebVictims({ limit = 50 } = {}) {
  const url = 'https://api.ransomware.live/v2/recentvictims';
  console.log('📡 Polling real-time dark web ransomware leak site telemetry...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`   ⚠️ Dark web telemetry feed returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const victims = [];
    const slice = data.slice(0, limit);

    for (const item of slice) {
      const target = (item.victim || '').trim();
      if (!target || target.length < 3 || target.includes('***') || target.toLowerCase() === 'not found') {
        continue;
      }

      const targetSlug = slugify(target);
      if (!targetSlug || targetSlug.length < 3) continue;

      const dateStr = item.discovered || item.attackdate || new Date().toISOString();
      const dateObj = new Date(dateStr);
      const dateIso = !isNaN(dateObj.getTime()) ? dateObj.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      const ym = dateIso.slice(0, 7);
      const timeUtc = !isNaN(dateObj.getTime())
        ? `${dateIso} ${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(dateObj.getUTCMinutes()).padStart(2, '0')} UTC`
        : `${dateIso} 12:00 UTC`;

      const domain = cleanDomain(item.domain, targetSlug);
      const groupName = item.group ? item.group.charAt(0).toUpperCase() + item.group.slice(1) : 'Unknown Threat Actor';
      const dataVolume = parseDataVolume(item.description);
      const affectedRecords = parseAffectedCount(item.description);

      // Prefer public mirror / archive URL for general browser verifiability; fallback to onion or ransomware live id
      const sourceUrl = item.url || (item.claim_url && item.claim_url.startsWith('http') ? item.claim_url : `https://www.ransomware.live/id/${Buffer.from(`${target}@${item.group}`).toString('base64')}`);
      const sourceTitle = `${groupName} Ransomware Leak Site Claim`;

      let summaryText = `${target} was listed on the ${groupName} ransomware extortion leak portal.`;
      if (dataVolume) {
        summaryText += ` Threat actor claims exfiltration of ${dataVolume} of internal data files.`;
      } else if (item.description && item.description.length > 20 && item.description.length < 200) {
        summaryText += ` ${item.description.replace(/\n+/g, ' ').trim()}`;
      } else {
        summaryText += ` Unverified extortion claim alleging unauthorized network access and data compromise.`;
      }

      if (summaryText.length > 250) {
        summaryText = summaryText.slice(0, 247).trim() + '...';
      }

      victims.push({
        id: `${ym}-${targetSlug}`,
        target,
        targetSlug,
        domain,
        status: 'EMERGING',
        verification: 'UNVERIFIED CLAIM',
        threatActor: groupName,
        industry: item.activity && item.activity !== 'Not Found' ? item.activity : undefined,
        affectedRecords,
        dataVolume,
        fileDate: dateIso,
        timeUtc,
        event: `${target} Listed on ${groupName} Ransomware Extortion Portal`,
        sourceTitle,
        sourceUrl,
        summary: summaryText,
        tags: ['extortion', 'ransomware-claim', item.group ? item.group.toLowerCase() : 'threat-intel', 'emerging']
      });
    }

    console.log(`   📥 Received ${victims.length} valid dark web extortion records.`);
    return victims;
  } catch (err) {
    console.error(`   ❌ Failed polling dark web leak site telemetry:`, err.message);
    return [];
  }
}
