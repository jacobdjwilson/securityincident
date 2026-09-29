/**
 * SEC EDGAR Form 8-K Item 1.05 Material Cybersecurity Incident Scraper
 * Leverages the SEC EFTS API for high-assurance regulatory filings
 */

const USER_AGENT = 'securityincident-telemetry-bot/1.0 (+https://securityincident.net; intelligence@securityincident.net)';
const REQUEST_TIMEOUT_MS = 12000;

function cleanCompanyName(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*\([A-Z0-9,\s]+\)\s*\(CIK\s*\d+\)/gi, '') // strip ticker and CIK
    .replace(/\b(?:INC|CORP|LLC|LTD|PLC|CO|CORPORATION|INCORPORATED|HOLDINGS)\b\.?/gi, '')
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

/**
 * Fetch SEC Form 8-K Item 1.05 cybersecurity filings within a given rolling window
 * @param {Object} options
 * @param {number} options.days - number of days to look back (default 30)
 * @returns {Promise<Array>} array of structured regulatory incident records
 */
export async function fetchSecItem105Filings({ days = 30 } = {}) {
  const endDateObj = new Date();
  const startDateObj = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const startdt = startDateObj.toISOString().slice(0, 10);
  const enddt = endDateObj.toISOString().slice(0, 10);

  const url = `https://efts.sec.gov/LATEST/search-index?q=%22Item%201.05%22&forms=8-K&startdt=${startdt}&enddt=${enddt}`;
  console.log(`🏛️ Polling SEC EDGAR EFTS API (${startdt} to ${enddt})...`);

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
      console.warn(`   ⚠️ SEC EFTS API returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const hits = data.hits?.hits || [];
    console.log(`   📥 Received ${hits.length} SEC Form 8-K search hits.`);

    const filings = [];

    for (const hit of hits) {
      const s = hit._source;
      if (!s) continue;

      const items = Array.isArray(s.items) ? s.items : [];
      // Only process filings where items array contains 1.05 (or cyber disclosures)
      const hasItem105 = items.includes('1.05');
      if (!hasItem105) continue;

      const rawFiler = s.display_names?.[0] || 'Unknown Organization';
      const target = cleanCompanyName(rawFiler);
      if (!target || target.length < 3) continue;

      const targetSlug = slugify(target);
      const cik = Array.isArray(s.ciks) ? s.ciks[0] : s.ciks;
      const adsh = s.adsh;
      const fileDate = s.file_date; // YYYY-MM-DD

      if (!cik || !adsh || !fileDate) continue;

      const cleanCik = parseInt(cik, 10);
      const cleanAdsh = adsh.replace(/-/g, '');
      const permanentUrl = `https://www.sec.gov/Archives/edgar/data/${cleanCik}/${cleanAdsh}/${adsh}-index.htm`;

      const ym = fileDate.slice(0, 7);
      const timeUtc = `${fileDate} 16:00 UTC`;

      filings.push({
        id: `${ym}-${targetSlug}`,
        target,
        targetSlug,
        domain: `${targetSlug.replace(/-/g, '')}.com`,
        status: 'CONFIRMED',
        verification: 'CONFIRMED BY REGULATOR',
        fileDate,
        timeUtc,
        sourceTitle: `SEC EDGAR 8-K Item 1.05 Filing (${adsh})`,
        sourceUrl: permanentUrl,
        summary: `Official SEC Form 8-K Item 1.05 disclosure filed by ${target} regarding a material cybersecurity incident.`,
        tags: ['regulatory', 'sec-8k', 'confirmed']
      });
    }

    return filings;
  } catch (err) {
    console.error(`   ❌ Failed polling SEC EDGAR EFTS API:`, err.message);
    return [];
  }
}
