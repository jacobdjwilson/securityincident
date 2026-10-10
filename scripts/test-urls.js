#!/usr/bin/env node
/**
 * scripts/test-urls.js
 * 
 * Operational Purpose:
 *   Automated link reachability and content verification engine for securityincident.net.
 *   Tests URLs in incident frontmatter (regulatory_filings, agency_advisories, vendor_advisories,
 *   consortium_bulletins) and timeline milestone evidence links. Flags 404s, broken links,
 *   and connectivity errors to ensure dossier integrity.
 * 
 * Usage:
 *   node scripts/test-urls.js incidents/2026-09-citrix.md
 *   node scripts/test-urls.js --all
 */

import fs from 'fs';
import path from 'path';
import matter from './matter.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (securityincident-verifier/1.0)';
const TIMEOUT_MS = 10000;

export async function testUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': USER_AGENT, 'Accept': '*/*' },
      signal: controller.signal,
      redirect: 'follow'
    });

    // Some sites (Cloudflare, Akamai, Citrix, etc.) return 403 or 405 to HEAD requests
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      const getController = new AbortController();
      const getTimeout = setTimeout(() => getController.abort(), TIMEOUT_MS);
      try {
        res = await fetch(url, {
          method: 'GET',
          headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
          signal: getController.signal,
          redirect: 'follow'
        });
      } finally {
        clearTimeout(getTimeout);
      }
    }

    clearTimeout(timeout);
    return {
      url,
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      statusText: res.statusText
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      url,
      status: 0,
      ok: false,
      error: err.name === 'AbortError' ? 'Timeout' : err.message
    };
  }
}

export function extractIncidentUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const items = [];

  // 1. Regulatory filings
  if (Array.isArray(data.regulatory_filings)) {
    for (const f of data.regulatory_filings) {
      if (f.url) items.push({ type: 'regulatory_filing', label: `${f.regulator} (${f.form || 'Notice'})`, url: f.url });
    }
  }

  // 2. Agency advisories
  if (Array.isArray(data.agency_advisories)) {
    for (const a of data.agency_advisories) {
      if (a.url) items.push({ type: 'agency_advisory', label: `${a.agency} (${a.advisory_id || 'Alert'})`, url: a.url });
    }
  }

  // 3. Vendor advisories
  if (Array.isArray(data.vendor_advisories)) {
    for (const v of data.vendor_advisories) {
      if (v.url) items.push({ type: 'vendor_advisory', label: `${v.publisher || v.vendor} (${v.advisory_id || 'Bulletin'})`, url: v.url });
    }
  }

  // 4. Consortium bulletins
  if (Array.isArray(data.consortium_bulletins)) {
    for (const c of data.consortium_bulletins) {
      if (c.url) items.push({ type: 'consortium_bulletin', label: `${c.organization} (${c.bulletin_id || 'Notice'})`, url: c.url });
    }
  }

  // 5. Timeline milestone markdown links
  const lines = body.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('- **Source:**')) {
      const match = line.match(/\[(.*?)\]\((https?:\/\/.*?)\)/);
      if (match) {
        items.push({ type: 'milestone_source', label: match[1], url: match[2] });
      }
    }
  }

  return items;
}

async function runCli() {
  const args = process.argv.slice(2);
  let targetFiles = [];

  if (args.includes('--changed')) {
    try {
      const { execSync } = await import('child_process');
      const gitStatus = execSync('git status --porcelain incidents/', { encoding: 'utf-8' });
      const changed = gitStatus.split('\n')
        .filter(l => l.includes('incidents/'))
        .map(l => l.slice(l.indexOf('incidents/')).trim())
        .filter(l => l.endsWith('.md'))
        .map(l => path.join(ROOT_DIR, l));
      targetFiles = [...new Set(changed)];
    } catch {
      targetFiles = [];
    }
    if (targetFiles.length === 0) {
      console.log('🌐 No changed incident dossiers detected. Running sanity check on sample...');
      targetFiles = [path.join(INCIDENTS_DIR, '2026-09-citrix.md')];
    }
  } else if (args.includes('--all')) {
    targetFiles = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md')).map(f => path.join(INCIDENTS_DIR, f));
  } else if (args.length === 0 || args.includes('2026-09-citrix.md') || args.some(a => a.includes('citrix'))) {
    targetFiles = [path.join(INCIDENTS_DIR, '2026-09-citrix.md')];
  } else {
    targetFiles = args.map(a => path.isAbsolute(a) ? a : path.join(ROOT_DIR, a));
  }

  console.log(`🌐 Testing source URL integrity for ${targetFiles.length} incident file(s)...`);

  let totalUrls = 0;
  let totalFailed = 0;

  for (const file of targetFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    const relName = path.relative(ROOT_DIR, file);
    console.log(`\n📄 Auditing: ${relName}`);
    const urls = extractIncidentUrls(file);
    totalUrls += urls.length;

    for (const item of urls) {
      const res = await testUrl(item.url);
      if (res.ok) {
        console.log(`   ✅ [${res.status}] ${item.type}: ${item.label} -> ${item.url}`);
      } else if (res.status === 403 || res.status === 401 || res.status === 429) {
        console.log(`   🟡 [${res.status} Bot Protected] ${item.type}: ${item.label} -> ${item.url}`);
      } else {
        console.error(`   ❌ [${res.status || 'ERR'}] ${item.type}: ${item.label} -> ${item.url} (${res.error || res.statusText || 'Failed'})`);
        totalFailed++;
      }
    }
  }

  console.log(`\n📊 URL Test Summary: ${totalUrls} link(s) checked, ${totalFailed} failure(s).`);
  if (totalFailed > 0) {
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('test-urls.js')) {
  runCli().catch(err => {
    console.error('Fatal URL test error:', err);
    process.exit(1);
  });
}
