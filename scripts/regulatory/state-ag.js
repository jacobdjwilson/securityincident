/**
 * State Attorney General Data Breach Notice Scrapers
 * Collects formal regulatory breach disclosures from state government portals
 */

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_TIMEOUT_MS = 12000;

function cleanCompanyName(raw) {
  if (!raw) return '';
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s*\([^)]*\)/g, '') // remove parenthetical like (“GT”) or (U.S.A.)
    .replace(/\s*,\s*a [A-Za-z\s]+ (?:limited liability company|corporation|company|comp)\b.*$/gi, '')
    .replace(/\b(?:INC|CORP|LLC|LTD|PLC|CO|CORPORATION|INCORPORATED|HOLDINGS|LLP|PC)\b\.?/gi, '')
    .replace(/^[,\s.-]+|[,\s.-]+$/g, '')
    .trim();
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

function parseUsDate(usDateStr) {
  // MM/DD/YYYY -> YYYY-MM-DD
  const parts = (usDateStr || '').trim().split('/');
  if (parts.length === 3) {
    const mm = parts[0].padStart(2, '0');
    const dd = parts[1].padStart(2, '0');
    const yyyy = parts[2];
    return `${yyyy}-${mm}-${dd}`;
  }
  return new Date().toISOString().slice(0, 10);
}

const KNOWN_AG_ALIASES = {
  'upbound group': { name: 'Upbound Group', slug: 'upbound-group' },
  'greenberg traurig': { name: 'Greenberg Traurig', slug: 'greenberg-traurig' }
};

/**
 * Fetch recent California Department of Justice / Attorney General data breach disclosures
 * @returns {Promise<Array>} array of regulatory breach records
 */
export async function fetchCaliforniaOagNotices() {
  const url = 'https://oag.ca.gov/privacy/databreach/list';
  console.log('🏛️ Polling California Department of Justice Data Breach Portal...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`   ⚠️ California OAG portal returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const regex = /<td class="views-field views-field-field-sb24-org-name"[^>]*>\s*<a href="([^"]+)">([^<]+)<\/a>[\s\S]*?<td class="views-field views-field-created[^>]*>\s*([0-9\/]+)/gi;

    const notices = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      const reportUrl = match[1].trim();
      const rawOrgName = match[2].trim();
      const rawNoticeDate = match[3].trim();

      let target = cleanCompanyName(rawOrgName);
      if (!target || target.length < 3) continue;

      let targetSlug = slugify(target);

      // Check alias overrides
      const lower = target.toLowerCase();
      if (KNOWN_AG_ALIASES[lower]) {
        target = KNOWN_AG_ALIASES[lower].name;
        targetSlug = KNOWN_AG_ALIASES[lower].slug;
      }

      const dateIso = parseUsDate(rawNoticeDate);
      const ym = dateIso.slice(0, 7);
      const timeUtc = `${dateIso} 17:00 UTC`;

      notices.push({
        id: `${ym}-${targetSlug}`,
        target,
        targetSlug,
        domain: `${targetSlug.replace(/-/g, '')}.com`,
        status: 'CONFIRMED',
        verification: 'CONFIRMED BY REGULATOR',
        fileDate: dateIso,
        timeUtc,
        sourceTitle: `California Attorney General Data Breach Notice (SB-24)`,
        sourceUrl: reportUrl,
        summary: `State of California Department of Justice data breach disclosure notice filed by ${target}.`,
        tags: ['regulatory', 'state-ag', 'california', 'confirmed'],
        regulatoryFilings: [
          {
            regulator: 'California Department of Justice',
            form: 'SB-24 Data Breach Notice',
            url: reportUrl,
            filing_date: dateIso
          }
        ]
      });
    }

    console.log(`   📥 Received ${notices.length} California OAG breach notices.`);
    return notices;
  } catch (err) {
    console.error(`   ❌ Failed polling California OAG portal:`, err.message);
    return [];
  }
}

/**
 * Fetch recent Washington State Attorney General data breach disclosures
 * @returns {Promise<Array>} array of regulatory breach records
 */
export async function fetchWashingtonAgNotices() {
  const url = 'https://www.atg.wa.gov/data-breach-notifications';
  console.log('🏛️ Polling Washington State Office of the Attorney General Data Breach Directory...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`   ⚠️ Washington AG portal returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    const notices = [];
    let match;

    while ((match = rowRegex.exec(html)) !== null) {
      const row = match[1];
      const dateMatch = row.match(/headers="view-field-report-date-table-column"[^>]*><time datetime="([^"]+)"/);
      const linkMatch = row.match(/headers="view-field-full-title-table-column"[^>]*><a href="([^"]+)">([^<]+)<\/a>/);
      const affectedMatch = row.match(/headers="view-field-number-wa-affected-table-column"[^>]*>([\s\S]*?)<\/td>/);

      if (!dateMatch || !linkMatch) continue;

      const reportUrl = linkMatch[1].trim();
      const rawOrgName = linkMatch[2].trim();
      const reportDate = dateMatch[1].slice(0, 10);
      const affected = affectedMatch ? affectedMatch[1].trim() : '';

      let target = cleanCompanyName(rawOrgName);
      if (!target || target.length < 3) continue;

      let targetSlug = slugify(target);

      const lower = target.toLowerCase();
      if (KNOWN_AG_ALIASES[lower]) {
        target = KNOWN_AG_ALIASES[lower].name;
        targetSlug = KNOWN_AG_ALIASES[lower].slug;
      }

      const ym = reportDate.slice(0, 7);
      const timeUtc = `${reportDate} 16:30 UTC`;

      let affectedCount = null;
      if (affected && affected !== 'Unknown') {
        const parsed = parseInt(affected.replace(/,/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) affectedCount = parsed;
      }

      let summary = `Washington State Attorney General formal data breach disclosure notice filed by ${target}.`;
      if (affectedCount) {
        summary = `Washington State Attorney General formal data breach disclosure notice filed by ${target} affecting ${affectedCount.toLocaleString()} residents.`;
      }

      notices.push({
        id: `${ym}-${targetSlug}`,
        target,
        targetSlug,
        domain: `${targetSlug.replace(/-/g, '')}.com`,
        status: 'CONFIRMED',
        verification: 'CONFIRMED BY REGULATOR',
        fileDate: reportDate,
        timeUtc,
        affectedRecords: affectedCount,
        sourceTitle: `Washington State Attorney General Breach Notice (RCW 19.255)`,
        sourceUrl: reportUrl,
        summary,
        tags: ['regulatory', 'state-ag', 'washington', 'confirmed'],
        regulatoryFilings: [
          {
            regulator: 'Washington Attorney General',
            form: 'RCW 19.255 Data Breach Notice',
            url: reportUrl,
            filing_date: reportDate
          }
        ]
      });
    }

    console.log(`   📥 Received ${notices.length} Washington State AG breach notices.`);
    return notices;
  } catch (err) {
    console.error(`   ❌ Failed polling Washington State AG portal:`, err.message);
    return [];
  }
}

/**
 * Fetch recent Oregon Department of Justice data breach disclosures
 * @returns {Promise<Array>} array of regulatory breach records
 */
export async function fetchOregonDojNotices({ limit = 40 } = {}) {
  const url = 'https://justice.oregon.gov/consumer/databreach/';
  console.log('🏛️ Polling Oregon Department of Justice Data Breach Directory...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`   ⚠️ Oregon DOJ portal returned HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    const notices = [];
    let match;
    let count = 0;

    while ((match = rowRegex.exec(html)) !== null && count < limit) {
      const row = match[1];
      const tdMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m =>
        m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      );

      if (tdMatches.length < 6) continue;

      const rawOrgName = tdMatches[0];
      const reportedDateStr = tdMatches[1]; // MM/DD/YYYY
      const numAffectedStr = tdMatches[5];

      let target = cleanCompanyName(rawOrgName);
      if (!target || target.length < 3) continue;

      let targetSlug = slugify(target);
      const lower = target.toLowerCase();
      if (KNOWN_AG_ALIASES[lower]) {
        target = KNOWN_AG_ALIASES[lower].name;
        targetSlug = KNOWN_AG_ALIASES[lower].slug;
      }

      const reportDate = parseUsDate(reportedDateStr);
      const ym = reportDate.slice(0, 7);
      const timeUtc = `${reportDate} 17:00 UTC`;

      let affectedCount = null;
      if (numAffectedStr && numAffectedStr !== 'Unknown') {
        const parsed = parseInt(numAffectedStr.replace(/,/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) affectedCount = parsed;
      }

      let summary = `Oregon Department of Justice formal data breach disclosure notice filed by ${target}.`;
      if (affectedCount) {
        summary = `Oregon Department of Justice formal data breach disclosure notice filed by ${target} affecting ${affectedCount.toLocaleString()} Oregon residents.`;
      }

      notices.push({
        id: `${ym}-${targetSlug}`,
        target,
        targetSlug,
        domain: `${targetSlug.replace(/-/g, '')}.com`,
        status: 'CONFIRMED',
        verification: 'CONFIRMED BY REGULATOR',
        fileDate: reportDate,
        timeUtc,
        affectedRecords: affectedCount,
        sourceTitle: `Oregon Department of Justice Breach Notice`,
        sourceUrl: url,
        summary,
        tags: ['regulatory', 'state-ag', 'oregon', 'confirmed'],
        regulatoryFilings: [
          {
            regulator: 'Oregon Department of Justice',
            form: 'ORS 646A.604 Data Breach Notice',
            url: url,
            filing_date: reportDate
          }
        ]
      });

      count++;
    }

    console.log(`   📥 Received ${notices.length} Oregon DOJ breach notices.`);
    return notices;
  } catch (err) {
    console.error(`   ❌ Failed polling Oregon DOJ portal:`, err.message);
    return [];
  }
}

/**
 * Unified multi-state regulatory breach scraper
 * @returns {Promise<Array>}
 */
export async function fetchAllStateAgNotices() {
  const [caNotices, waNotices, orNotices] = await Promise.all([
    fetchCaliforniaOagNotices(),
    fetchWashingtonAgNotices(),
    fetchOregonDojNotices()
  ]);
  return [...caNotices, ...waNotices, ...orNotices];
}

