import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calculateConfidenceScore, extractDomainFromUrl } from './weights.js';
import { generateStix21Bundle } from './stix.js';
import { generateIncidentBadgeSvg } from './badges.js';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');
const PUBLIC_DIR = path.join(ROOT_DIR, 'src', 'public');
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_INCIDENTS_DIR = path.join(DIST_DIR, 'incidents');
const DIST_IMAGES_DIR = path.join(DIST_DIR, 'images');
const DIST_API_DIR = path.join(DIST_DIR, 'api', 'v1');
const DIST_API_INCIDENTS_DIR = path.join(DIST_API_DIR, 'incidents');
const DIST_BADGES_DIR = path.join(DIST_DIR, 'badges');

// GitHub repository and domain info
const GITHUB_REPO_URL = 'https://github.com/jacobdjwilson/securityincident';
const SITE_URL = 'https://securityincident.net';

function cleanVerification(verifText) {
  return (verifText || '').replace(/^[🟢🟡🔵⚪🔴\s]+/, '').trim();
}

function getVerificationIcon(verifText) {
  const text = (verifText || '').toUpperCase();
  if (text.includes('REGULATOR') || text.includes('8-K')) return 'fa-solid fa-building-shield';
  if (text.includes('TARGET')) return 'fa-solid fa-bullhorn';
  if (text.includes('INDEPENDENT')) return 'fa-solid fa-microscope';
  if (text.includes('REFUTED')) return 'fa-solid fa-ban';
  return 'fa-solid fa-circle-question';
}

function getVerificationClass(verifText) {
  const text = (verifText || '').toUpperCase();
  if (text.includes('REGULATOR') || text.includes('8-K')) return 'regulator';
  if (text.includes('TARGET')) return 'target';
  if (text.includes('INDEPENDENT')) return 'independent';
  if (text.includes('REFUTED')) return 'refuted';
  return 'unverified';
}

function getStatusBadgeHtml(status) {
  const s = (status || 'EMERGING').toUpperCase();
  let icon = 'fa-solid fa-bolt';
  if (s === 'CONFIRMED') icon = 'fa-solid fa-circle-check';
  else if (s === 'ACKNOWLEDGED') icon = 'fa-solid fa-bullhorn';
  else if (s === 'DEVELOPING') icon = 'fa-solid fa-satellite-dish';
  else if (s === 'REFUTED') icon = 'fa-solid fa-ban';

  return `<span class="status-badge status-${s}"><i class="${icon}"></i> ${s}</span>`;
}

function parseMilestones(markdownContent) {
  const milestones = [];
  const sections = markdownContent.split(/###\s+/);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].trim();
    const lines = section.split('\n');
    const time = lines[0].trim();

    let event = '';
    let verification = 'UNVERIFIED CLAIM';
    let sourceTitle = '';
    let sourceUrl = '';

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (line.startsWith('- **Event:**')) {
        event = line.replace('- **Event:**', '').trim();
      } else if (line.startsWith('- **Verification:**')) {
        const raw = line.replace('- **Verification:**', '').trim();
        verification = raw;
      } else if (line.startsWith('- **Source:**')) {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          sourceTitle = match[1];
          sourceUrl = match[2];
        }
      }
    }

    if (time && event) {
      milestones.push({
        time,
        event,
        verification,
        sourceTitle,
        sourceUrl
      });
    }
  }

  return milestones;
}

function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssPubDate(dateStr, milestones) {
  if (milestones && milestones.length > 0 && milestones[0].time) {
    const rawTime = milestones[0].time.trim();
    const match = rawTime.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2})(?:\s*UTC)?)?/i);
    if (match) {
      const d = match[1];
      const t = match[2] ? match[2] + ':00Z' : '00:00:00Z';
      const parsed = new Date(`${d}T${t}`);
      if (!isNaN(parsed.getTime())) {
        return parsed.toUTCString();
      }
    }
  }

  if (dateStr) {
    const parsed = new Date(`${dateStr.trim()}T00:00:00Z`);
    if (!isNaN(parsed.getTime())) {
      return parsed.toUTCString();
    }
  }

  return new Date().toUTCString();
}

function generateRssFeed(incidents) {
  const buildDate = new Date().toUTCString();
  const itemsXml = incidents.map(inc => {
    const permalink = `${SITE_URL}/incidents/${inc.id}.html`;
    const pubDate = formatRssPubDate(inc.last_updated, inc.milestones);
    const title = `[${inc.status}] ${inc.target} — ${inc.summary}`;

    // Clean CDATA body
    const safeSummary = (inc.summary || '').replace(/]]>/g, ']]&gt;');
    let descriptionHtml = `<![CDATA[`;
    descriptionHtml += `<p><strong>Status:</strong> ${escapeXml(inc.status)}<br/>\n`;
    descriptionHtml += `<strong>Target Domain:</strong> ${escapeXml(inc.domain)}<br/>\n`;
    if (inc.threat_actor) {
      descriptionHtml += `<strong>Threat Actor:</strong> ${escapeXml(inc.threat_actor)}<br/>\n`;
    }
    if (inc.confidence) {
      descriptionHtml += `<strong>Open Weights Confidence:</strong> ${inc.confidence.confidencePercent}% (${escapeXml(inc.confidence.topTier)})<br/>\n`;
      descriptionHtml += `<strong>Corroborated Source Domains:</strong> ${inc.confidence.uniqueSourcesCount}<br/>\n`;
    }
    descriptionHtml += `<strong>First Seen:</strong> ${escapeXml(inc.first_seen)}<br/>\n`;
    descriptionHtml += `<strong>Last Updated:</strong> ${escapeXml(inc.last_updated)}</p>\n`;
    descriptionHtml += `<p>${safeSummary}</p>\n`;

    if (inc.milestones && inc.milestones.length > 0) {
      descriptionHtml += `<h3>Milestone Timeline</h3>\n<ul>\n`;
      inc.milestones.forEach(m => {
        const safeEvent = (m.event || '').replace(/]]>/g, ']]&gt;');
        descriptionHtml += `  <li><strong>${escapeXml(m.time)}</strong> [${escapeXml(m.verification)}]: ${safeEvent}`;
        if (m.sourceUrl) {
          descriptionHtml += ` (<a href="${escapeXml(m.sourceUrl)}">${escapeXml(m.sourceTitle || 'Evidence Link')}</a>)`;
        }
        descriptionHtml += `</li>\n`;
      });
      descriptionHtml += `</ul>\n`;
    }

    descriptionHtml += `<p><a href="${permalink}">View Full Verified Timeline &amp; Evidence on securityincident.net</a></p>`;
    descriptionHtml += `]]>`;

    const categories = [inc.status, ...(inc.tags || [])]
      .filter(Boolean)
      .map(cat => `      <category>${escapeXml(cat)}</category>`)
      .join('\n');

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${permalink}</link>
      <guid isPermaLink="true">${permalink}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${descriptionHtml}</description>
${categories}
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>securityincident.net | Real-Time Incident Status &amp; Milestone Timeline Index</title>
    <link>${SITE_URL}/</link>
    <description>A neutral, high-signal index tracking real-time status and verified milestone timelines for cybersecurity incidents across the open web, powered by open weights correlation and community PR editing.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>securityincident.net static generator</generator>
${itemsXml}
  </channel>
</rss>
`;
}

function generateJsonFeed(incidents) {
  return JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: 'securityincident.net | Real-Time Incident Status & Milestone Timeline Index',
    home_page_url: `${SITE_URL}/`,
    feed_url: `${SITE_URL}/feed.json`,
    description: 'A neutral, high-signal index tracking real-time status and verified milestone timelines for cybersecurity incidents across the open web, powered by open weights correlation and community PR editing.',
    items: incidents.map(inc => ({
      id: `${SITE_URL}/incidents/${inc.id}.html`,
      url: `${SITE_URL}/incidents/${inc.id}.html`,
      title: `[${inc.status}] ${inc.target} - Security Incident Timeline`,
      summary: inc.summary,
      date_modified: inc.last_updated ? `${inc.last_updated}T00:00:00Z` : undefined,
      date_published: inc.first_seen ? `${inc.first_seen}T00:00:00Z` : undefined,
      tags: [inc.status, ...(inc.tags || [])],
      _open_weights: inc.confidence ? {
        confidence_percent: inc.confidence.confidencePercent,
        score: inc.confidence.score,
        base_weight: inc.confidence.baseWeight,
        corroboration_bonus: inc.confidence.corroborationBonus,
        unique_sources_count: inc.confidence.uniqueSourcesCount,
        top_tier: inc.confidence.topTier
      } : undefined
    }))
  }, null, 2);
}

function renderHeader(isSubpage = false) {
  const prefix = isSubpage ? '../' : './';
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${prefix}" class="brand" title="securityincident.net — Real-Time Incident Status & Timeline Index">
        <img src="${prefix}images/logo.svg" alt="securityincident.net logo" class="brand-logo-img logo-dark-img">
        <img src="${prefix}images/logo-light.svg" alt="securityincident.net logo" class="brand-logo-img logo-light-img">
        <div class="brand-title">securityincident<span>.net</span></div>
      </a>
      <nav class="nav-links">
        <a href="${prefix}" class="nav-link">Live Index</a>
        <a href="${prefix}about.html" class="nav-link">Verification Standard</a>
        <a href="${prefix}api/v1/incidents.json" target="_blank" class="nav-link nav-rss" title="REST Flat-File API">
          <i class="fa-solid fa-bolt"></i>
          <span>API</span>
        </a>
        <a href="${prefix}api/v1/stix21.json" target="_blank" class="nav-link nav-rss" title="STIX 2.1 Threat Intel Feed">
          <i class="fa-solid fa-shield-halved"></i>
          <span>STIX 2.1</span>
        </a>
        <a href="${prefix}feed.xml" target="_blank" rel="alternate" type="application/rss+xml" class="nav-link nav-rss" title="RSS Telemetry Feed">
          <i class="fa-solid fa-rss"></i>
          <span>RSS</span>
        </a>
        <a href="${prefix}feed.json" target="_blank" rel="alternate" type="application/feed+json" class="nav-link nav-rss" title="JSON Feed v1.1">
          <i class="fa-solid fa-code"></i>
          <span>JSON</span>
        </a>
        
        <!-- Sophisticated Theme Switch Toggle with Sun & Moon Icons -->
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle light and dark mode" title="Toggle theme">
          <span class="theme-toggle-track">
            <span class="theme-toggle-thumb">
              <i class="fa-solid fa-moon icon-moon"></i>
              <i class="fa-solid fa-sun icon-sun"></i>
            </span>
          </span>
        </button>

        <a href="${GITHUB_REPO_URL}" target="_blank" rel="noopener" class="github-badge">
          <i class="fa-brands fa-github"></i>
          <span>GitHub</span>
        </a>
      </nav>
    </div>
  </header>`;
}

function renderFooter(isSubpage = false) {
  const prefix = isSubpage ? '../' : './';
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-credits">
        <strong>securityincident.net</strong> &bull; Neutral open-web security intelligence index.<br>
        Powered by open weights correlation and community-driven GitHub PR editing.
      </div>
      <div class="footer-links">
        <a href="${prefix}api/v1/incidents.json" target="_blank"><i class="fa-solid fa-bolt" style="color: var(--status-acknowledged);"></i> REST API</a>
        <a href="${prefix}api/v1/stix21.json" target="_blank"><i class="fa-solid fa-shield-halved" style="color: var(--status-confirmed);"></i> STIX 2.1 Feed</a>
        <a href="${prefix}feed.xml" target="_blank" rel="alternate" type="application/rss+xml"><i class="fa-solid fa-rss" style="color: var(--status-developing);"></i> RSS Feed</a>
        <a href="${prefix}feed.json" target="_blank" rel="alternate" type="application/feed+json"><i class="fa-solid fa-code" style="color: var(--cyan-accent);"></i> JSON Feed</a>
        <a href="${GITHUB_REPO_URL}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Audit on GitHub</a>
        <a href="${GITHUB_REPO_URL}/tree/main/incidents" target="_blank" rel="noopener"><i class="fa-solid fa-code-pull-request"></i> Add Incident via PR</a>
      </div>
    </div>
  </footer>`;
}

function computeTelemetryStats(incidents) {
  const total = incidents.length;
  const statusCounts = {
    CONFIRMED: incidents.filter(i => i.status === 'CONFIRMED').length,
    ACKNOWLEDGED: incidents.filter(i => i.status === 'ACKNOWLEDGED').length,
    DEVELOPING: incidents.filter(i => i.status === 'DEVELOPING').length,
    EMERGING: incidents.filter(i => i.status === 'EMERGING').length,
    REFUTED: incidents.filter(i => i.status === 'REFUTED').length
  };

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  let active30d = 0;
  let active90d = 0;
  let multiSourceCount = 0;
  let totalConfidence = 0;

  const threatActorCounts = {};
  const monthlyCounts = {};

  const sectorCounts = {
    'regulatory': 0,
    'state-ag': 0,
    'sec-8k': 0,
    'healthcare': 0,
    'legal': 0,
    'financial': 0,
    'technology': 0,
    'retail': 0
  };

  const sourceCategoryCounts = {
    'State AG Breach Disclosures': 0,
    'Investigative Threat Telemetry': 0,
    'SEC EDGAR Form 8-K': 0,
    'Technical Telemetry / Outage': 0
  };

  for (const inc of incidents) {
    if (inc.last_updated) {
      const upTime = new Date(inc.last_updated).getTime();
      if (!isNaN(upTime)) {
        if (now - upTime <= thirtyDaysMs) active30d++;
        if (now - upTime <= ninetyDaysMs) active90d++;
      }
    }

    if (inc.confidence) {
      totalConfidence += inc.confidence.confidencePercent || 0;
      if (inc.confidence.uniqueSourcesCount >= 2) {
        multiSourceCount++;
      }
    }

    // Monthly velocity
    const month = (inc.first_seen || inc.last_updated || '').slice(0, 7);
    if (month && month.startsWith('202')) {
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }

    // Threat actors
    if (inc.threat_actor && inc.threat_actor !== 'Unknown') {
      threatActorCounts[inc.threat_actor] = (threatActorCounts[inc.threat_actor] || 0) + 1;
    }

    // Tags & Sectors
    const allTags = (inc.tags || []).map(t => t.toLowerCase());
    if (allTags.includes('state-ag') || allTags.includes('california') || allTags.includes('washington')) {
      sectorCounts['state-ag']++;
      sourceCategoryCounts['State AG Breach Disclosures']++;
    }
    if (allTags.includes('sec-8k')) {
      sectorCounts['sec-8k']++;
      sourceCategoryCounts['SEC EDGAR Form 8-K']++;
    }
    if (allTags.includes('healthcare') || allTags.includes('health') || allTags.includes('medical-device')) {
      sectorCounts['healthcare']++;
    }
    if (allTags.includes('legal') || allTags.includes('law')) {
      sectorCounts['legal']++;
    }
    if (allTags.includes('banking') || allTags.includes('financial')) {
      sectorCounts['financial']++;
    }
    if (allTags.includes('retail') || allTags.includes('consumer')) {
      sectorCounts['retail']++;
    }
    if (allTags.includes('technology') || allTags.includes('tech') || allTags.includes('semiconductors')) {
      sectorCounts['technology']++;
    }
    if (allTags.includes('investigative') || allTags.includes('threat-intel')) {
      sourceCategoryCounts['Investigative Threat Telemetry']++;
    }
    if (allTags.includes('outage') || allTags.includes('exposure') || allTags.includes('leak-site')) {
      sourceCategoryCounts['Technical Telemetry / Outage']++;
    }
  }

  const topThreatActors = Object.entries(threatActorCounts)
    .map(([actor, count]) => ({ actor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSectors = [
    { key: 'state-ag', label: 'State AG Breach Notices', count: sectorCounts['state-ag'] },
    { key: 'sec-8k', label: 'SEC Form 8-K Filings', count: sectorCounts['sec-8k'] },
    { key: 'healthcare', label: 'Healthcare & Medical', count: sectorCounts['healthcare'] },
    { key: 'legal', label: 'Legal & Law Firms', count: sectorCounts['legal'] },
    { key: 'financial', label: 'Banking & Financial', count: sectorCounts['financial'] },
    { key: 'technology', label: 'Technology & Cloud', count: sectorCounts['technology'] },
    { key: 'retail', label: 'Retail & Commercial', count: sectorCounts['retail'] }
  ].filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  const velocityTimeline = [
    { month: '2026-07', label: 'Jul 2026', count: monthlyCounts['2026-07'] || 0 },
    { month: '2026-08', label: 'Aug 2026', count: monthlyCounts['2026-08'] || 0 },
    { month: '2026-09', label: 'Sep 2026', count: monthlyCounts['2026-09'] || 0 }
  ];

  const sourceCategories = Object.entries(sourceCategoryCounts)
    .map(([label, count]) => ({ label, count }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const avgConfidence = total > 0 ? Math.round(totalConfidence / total) : 0;

  return {
    total_incidents: total,
    status_distribution: statusCounts,
    confirmed_percent: total > 0 ? Math.round((statusCounts.CONFIRMED / total) * 100) : 0,
    corroborated_count: multiSourceCount,
    corroborated_percent: total > 0 ? Math.round((multiSourceCount / total) * 100) : 0,
    avg_confidence: avgConfidence,
    active_30d_count: active30d,
    active_90d_count: active90d,
    velocity_timeline: velocityTimeline,
    source_categories: sourceCategories,
    top_threat_actors: topThreatActors,
    top_sectors: topSectors,
    generated_at: new Date().toISOString()
  };
}

function generateIndexHtml(incidents, stats) {
  const counts = {
    ALL: incidents.length,
    CONFIRMED: incidents.filter(i => i.status === 'CONFIRMED').length,
    ACKNOWLEDGED: incidents.filter(i => i.status === 'ACKNOWLEDGED').length,
    DEVELOPING: incidents.filter(i => i.status === 'DEVELOPING').length,
    EMERGING: incidents.filter(i => i.status === 'EMERGING').length,
    REFUTED: incidents.filter(i => i.status === 'REFUTED').length
  };

  const cardsHtml = incidents.map(inc => {
    const latestMilestone = inc.milestones && inc.milestones.length > 0 ? inc.milestones[0] : null;
    const actorHtml = inc.threat_actor ? `<span class="footer-actor"><i class="fa-solid fa-user-secret"></i> ${inc.threat_actor}</span>` : '';
    const conf = inc.confidence || { confidencePercent: 20, badgeClass: 'emerging', uniqueSourcesCount: 1, topTier: 'UNVERIFIED CLAIM' };
    const month = (inc.first_seen || inc.last_updated || '').slice(0, 7);

    return `
      <a href="incidents/${inc.id}.html" class="incident-card" 
         data-status="${inc.status}" 
         data-target="${inc.target}" 
         data-domain="${inc.domain}" 
         data-summary="${inc.summary}" 
         data-actor="${inc.threat_actor || ''}" 
         data-tags="${(inc.tags || []).join(' ')}"
         data-confidence="${conf.confidencePercent}"
         data-updated="${inc.last_updated || ''}"
         data-first-seen="${inc.first_seen || ''}"
         data-month="${month}"
         data-milestones="${inc.milestones.length}">
        <div class="card-top">
          <div class="card-title-group">
            <h2 class="card-target-name">${inc.target}</h2>
            <span class="card-domain">${inc.domain}</span>
          </div>
          <div class="card-status-cluster">
            ${getStatusBadgeHtml(inc.status)}
          </div>
        </div>

        <div class="card-confidence-bar-wrap" title="Open Weights Confidence Score: ${conf.confidencePercent}% (${conf.topTier})">
          <div class="card-confidence-meter">
            <div class="confidence-fill ${conf.badgeClass}" style="width: ${conf.confidencePercent}%;"></div>
          </div>
          <div class="card-confidence-meta">
            <span class="confidence-badge ${conf.badgeClass}">
              <i class="fa-solid fa-shield-halved"></i> ${conf.confidencePercent}% Confidence
            </span>
            <span class="sources-count-badge" title="${conf.uniqueSourcesCount} independent domain(s) corroborated">
              <i class="fa-solid fa-network-wired"></i> ${conf.uniqueSourcesCount} source${conf.uniqueSourcesCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <p class="card-summary">${inc.summary}</p>

        ${latestMilestone ? `
        <div class="card-milestone-preview">
          <div class="label"><i class="fa-solid fa-clock-rotate-left"></i> Latest Milestone &bull; ${latestMilestone.time}</div>
          <div class="text">${latestMilestone.event}</div>
        </div>
        ` : ''}

        <div class="card-footer">
          <div class="footer-left">
            <span><i class="fa-solid fa-timeline"></i> ${inc.milestones.length} milestone${inc.milestones.length === 1 ? '' : 's'}</span>
            <span><i class="fa-regular fa-clock"></i> ${inc.last_updated}</span>
            ${actorHtml}
          </div>
          <span class="view-link">Dossier <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  }).join('\n');

  const tableRowsHtml = incidents.map(inc => {
    const conf = inc.confidence || { confidencePercent: 20, badgeClass: 'emerging', uniqueSourcesCount: 1 };
    const month = (inc.first_seen || inc.last_updated || '').slice(0, 7);

    return `
      <tr class="telemetry-row" 
          data-status="${inc.status}" 
          data-target="${inc.target}" 
          data-domain="${inc.domain}" 
          data-summary="${inc.summary}" 
          data-actor="${inc.threat_actor || ''}" 
          data-tags="${(inc.tags || []).join(' ')}"
          data-confidence="${conf.confidencePercent}"
          data-updated="${inc.last_updated || ''}"
          data-first-seen="${inc.first_seen || ''}"
          data-month="${month}"
          data-milestones="${inc.milestones.length}">
        <td class="col-target">
          <a href="incidents/${inc.id}.html" class="table-target-name">${inc.target}</a>
          <span class="table-target-domain">${inc.domain}</span>
        </td>
        <td class="col-status">${getStatusBadgeHtml(inc.status)}</td>
        <td class="col-confidence">
          <div class="table-conf-cell">
            <span class="confidence-badge ${conf.badgeClass}"><i class="fa-solid fa-shield-halved"></i> ${conf.confidencePercent}%</span>
            <span class="table-source-count">${conf.uniqueSourcesCount} src</span>
          </div>
        </td>
        <td class="col-actor font-mono">${inc.threat_actor ? `<i class="fa-solid fa-user-secret"></i> ${inc.threat_actor}` : '<span class="text-muted">—</span>'}</td>
        <td class="col-date font-mono">${inc.last_updated}</td>
        <td class="col-milestones"><span class="milestone-count-pill">${inc.milestones.length}</span></td>
        <td class="col-action">
          <a href="incidents/${inc.id}.html" class="btn-table-dossier">Dossier <i class="fa-solid fa-arrow-right"></i></a>
        </td>
      </tr>
    `;
  }).join('\n');

  // Compute maximums for relative chart bar widths
  const maxStatusCount = Math.max(...Object.values(stats.status_distribution));
  const maxVelocityCount = Math.max(...stats.velocity_timeline.map(v => v.count));
  const maxSourceCount = Math.max(...stats.source_categories.map(s => s.count));
  const maxSectorCount = Math.max(...stats.top_sectors.map(s => s.count));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>securityincident.net | Real-Time Incident Status &amp; Milestone Timeline Index</title>
  <meta name="description" content="A neutral, high-signal index tracking real-time status and verified milestone timelines for cybersecurity incidents across the open web, powered by open weights correlation and community PR editing.">
  <link rel="icon" type="image/svg+xml" href="images/favicon.svg">
  <link rel="alternate" type="application/rss+xml" title="securityincident.net RSS Feed" href="feed.xml">
  <link rel="alternate" type="application/feed+json" title="securityincident.net JSON Feed" href="feed.json">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="fontawesome.js"></script>
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
<body>
  ${renderHeader(false)}

  <main class="container">
    <!-- Top Telemetry Strip -->
    <section class="telemetry-bar">
      <div class="telemetry-metric">
        <span class="tm-label">Indexed Incidents</span>
        <span class="tm-val">${stats.total_incidents}</span>
        <span class="tm-sub font-mono"><i class="fa-solid fa-arrow-trend-up text-cyan"></i> +${stats.active_30d_count} active (30d)</span>
      </div>
      <div class="telemetry-divider"></div>
      <div class="telemetry-metric">
        <span class="tm-label">Confirmed Assurance</span>
        <span class="tm-val text-confirmed">${stats.confirmed_percent}%</span>
        <span class="tm-sub">${stats.status_distribution.CONFIRMED} Statutory Disclosures</span>
      </div>
      <div class="telemetry-divider"></div>
      <div class="telemetry-metric">
        <span class="tm-label">Cross-Domain Corroboration</span>
        <span class="tm-val text-cyan">${stats.corroborated_percent}%</span>
        <span class="tm-sub">${stats.corroborated_count} Multi-Source Events</span>
      </div>
      <div class="telemetry-divider"></div>
      <div class="telemetry-metric">
        <span class="tm-label">Mean Confidence Score</span>
        <span class="tm-val text-developing">${stats.avg_confidence}%</span>
        <span class="tm-sub">Deterministic Open Weights</span>
      </div>
    </section>

    <!-- Interactive Data-Driven Telemetry Charts Deck -->
    <section class="charts-section">
      <div class="charts-section-header">
        <div class="csh-title-group">
          <h2 class="csh-title"><i class="fa-solid fa-chart-line"></i> Telemetry Analytics Deck</h2>
          <span class="csh-desc">Interactive distributions across observable status, ingestion velocity, regulatory pipelines, and industry sectors. Click any chart element to filter data.</span>
        </div>
      </div>

      <div class="charts-grid">
        <!-- Chart 1: Status & Assurance Breakdown -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title"><i class="fa-solid fa-chart-pie"></i> Observable Status Breakdown</span>
            <span class="chart-action-hint">Click status to filter</span>
          </div>
          <div class="chart-hbars">
            <div class="chart-hbar-row chart-click-filter" data-chart-type="status" data-chart-val="CONFIRMED" title="Filter by CONFIRMED">
              <span class="hbar-label"><span class="dot dot-confirmed"></span> Confirmed</span>
              <div class="hbar-track">
                <div class="hbar-fill bar-confirmed" style="width: ${(stats.status_distribution.CONFIRMED / maxStatusCount * 100).toFixed(1)}%;"></div>
              </div>
              <span class="hbar-value font-mono">${stats.status_distribution.CONFIRMED} <small>(${(stats.status_distribution.CONFIRMED / stats.total_incidents * 100).toFixed(0)}%)</small></span>
            </div>
            <div class="chart-hbar-row chart-click-filter" data-chart-type="status" data-chart-val="DEVELOPING" title="Filter by DEVELOPING">
              <span class="hbar-label"><span class="dot dot-developing"></span> Developing</span>
              <div class="hbar-track">
                <div class="hbar-fill bar-developing" style="width: ${(stats.status_distribution.DEVELOPING / maxStatusCount * 100).toFixed(1)}%;"></div>
              </div>
              <span class="hbar-value font-mono">${stats.status_distribution.DEVELOPING} <small>(${(stats.status_distribution.DEVELOPING / stats.total_incidents * 100).toFixed(0)}%)</small></span>
            </div>
            <div class="chart-hbar-row chart-click-filter" data-chart-type="status" data-chart-val="EMERGING" title="Filter by EMERGING">
              <span class="hbar-label"><span class="dot dot-emerging"></span> Emerging</span>
              <div class="hbar-track">
                <div class="hbar-fill bar-emerging" style="width: ${(stats.status_distribution.EMERGING / maxStatusCount * 100).toFixed(1)}%;"></div>
              </div>
              <span class="hbar-value font-mono">${stats.status_distribution.EMERGING} <small>(${(stats.status_distribution.EMERGING / stats.total_incidents * 100).toFixed(0)}%)</small></span>
            </div>
            <div class="chart-hbar-row chart-click-filter" data-chart-type="status" data-chart-val="ACKNOWLEDGED" title="Filter by ACKNOWLEDGED">
              <span class="hbar-label"><span class="dot dot-acknowledged"></span> Acknowledged</span>
              <div class="hbar-track">
                <div class="hbar-fill bar-acknowledged" style="width: Math.max(4, ${(stats.status_distribution.ACKNOWLEDGED / maxStatusCount * 100).toFixed(1)})%;"></div>
              </div>
              <span class="hbar-value font-mono">${stats.status_distribution.ACKNOWLEDGED} <small>(${(stats.status_distribution.ACKNOWLEDGED / stats.total_incidents * 100).toFixed(0)}%)</small></span>
            </div>
            <div class="chart-hbar-row chart-click-filter" data-chart-type="status" data-chart-val="REFUTED" title="Filter by REFUTED">
              <span class="hbar-label"><span class="dot dot-refuted"></span> Refuted</span>
              <div class="hbar-track">
                <div class="hbar-fill bar-refuted" style="width: Math.max(4, ${(stats.status_distribution.REFUTED / maxStatusCount * 100).toFixed(1)})%;"></div>
              </div>
              <span class="hbar-value font-mono">${stats.status_distribution.REFUTED} <small>(${(stats.status_distribution.REFUTED / stats.total_incidents * 100).toFixed(0)}%)</small></span>
            </div>
          </div>
        </div>

        <!-- Chart 2: Ingestion & Incident Velocity Timeline -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title"><i class="fa-solid fa-chart-column"></i> Ingestion Velocity Timeline</span>
            <span class="chart-action-hint">Click month to filter</span>
          </div>
          <div class="chart-vbars">
            ${stats.velocity_timeline.map(v => {
              const heightPct = Math.round((v.count / maxVelocityCount) * 100);
              return `
              <div class="vbar-col chart-click-filter" data-chart-type="month" data-chart-val="${v.month}" title="Filter by ${v.label}">
                <span class="vbar-count font-mono">${v.count}</span>
                <div class="vbar-track">
                  <div class="vbar-fill" style="height: ${heightPct}%;"></div>
                </div>
                <span class="vbar-label">${v.label}</span>
              </div>`;
            }).join('\n')}
          </div>
        </div>

        <!-- Chart 3: Primary Regulatory & Intelligence Sources -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title"><i class="fa-solid fa-landmark"></i> Primary Regulatory &amp; Telemetry Sources</span>
            <span class="chart-action-hint">Click source to filter</span>
          </div>
          <div class="chart-hbars">
            ${stats.source_categories.map(s => {
              const widthPct = Math.round((s.count / maxSourceCount) * 100);
              let chipVal = 'state-ag';
              if (s.label.includes('8-K')) chipVal = 'sec-8k';
              else if (s.label.includes('Investigative')) chipVal = 'investigative';
              else if (s.label.includes('Technical')) chipVal = 'outage';
              return `
              <div class="chart-hbar-row chart-click-filter" data-chart-type="source" data-chart-val="${chipVal}" title="Filter by ${s.label}">
                <span class="hbar-label">${s.label}</span>
                <div class="hbar-track">
                  <div class="hbar-fill bar-cyan" style="width: ${widthPct}%;"></div>
                </div>
                <span class="hbar-value font-mono">${s.count}</span>
              </div>`;
            }).join('\n')}
          </div>
        </div>

        <!-- Chart 4: Targeted Industry Sectors -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title"><i class="fa-solid fa-industry"></i> Targeted Industry Sectors</span>
            <span class="chart-action-hint">Click sector to filter</span>
          </div>
          <div class="chart-hbars">
            ${stats.top_sectors.slice(0, 5).map(s => {
              const widthPct = Math.round((s.count / maxSectorCount) * 100);
              return `
              <div class="chart-hbar-row chart-click-filter" data-chart-type="sector" data-chart-val="${s.key}" title="Filter by ${s.label}">
                <span class="hbar-label">${s.label}</span>
                <div class="hbar-track">
                  <div class="hbar-fill bar-orange" style="width: ${widthPct}%;"></div>
                </div>
                <span class="hbar-value font-mono">${s.count}</span>
              </div>`;
            }).join('\n')}
          </div>
        </div>
      </div>

      <!-- Active Filter Banner (Visible when any filter is engaged) -->
      <div id="active-filter-bar" class="active-filter-bar" style="display: none;">
        <div class="af-left">
          <span class="af-icon"><i class="fa-solid fa-filter"></i></span>
          <span class="af-text">Active Filter:</span>
          <span id="active-filter-pill" class="active-filter-pill">None</span>
        </div>
        <button id="btn-clear-filter" class="btn-clear-filter" title="Reset all filters">
          <i class="fa-solid fa-xmark"></i> Clear Filter
        </button>
      </div>
    </section>

    <!-- Anchors & Controls Bar -->
    <div id="incidents-anchor"></div>
    <div class="controls-bar">
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="search-input" class="search-input" placeholder="Search by organization, domain, threat actor, or keyword..." autocomplete="off">
        <span class="search-kbd">/</span>
      </div>

      <div class="controls-action-row">
        <div class="filter-pills">
          <button class="filter-btn active" data-filter="ALL">
            All <span class="filter-count">${counts.ALL}</span>
          </button>
          <button class="filter-btn" data-filter="CONFIRMED">
            <span class="status-dot-indicator confirmed"></span> Confirmed <span class="filter-count">${counts.CONFIRMED}</span>
          </button>
          <button class="filter-btn" data-filter="ACKNOWLEDGED">
            <span class="status-dot-indicator acknowledged"></span> Acknowledged <span class="filter-count">${counts.ACKNOWLEDGED}</span>
          </button>
          <button class="filter-btn" data-filter="DEVELOPING">
            <span class="status-dot-indicator developing"></span> Developing <span class="filter-count">${counts.DEVELOPING}</span>
          </button>
          <button class="filter-btn" data-filter="EMERGING">
            <span class="status-dot-indicator emerging"></span> Emerging <span class="filter-count">${counts.EMERGING}</span>
          </button>
          <button class="filter-btn" data-filter="REFUTED">
            <span class="status-dot-indicator refuted"></span> Refuted <span class="filter-count">${counts.REFUTED}</span>
          </button>
        </div>

        <div class="controls-right-group">
          <!-- View Toggle: Cards vs Table -->
          <div class="view-toggle-wrap">
            <button id="btn-view-cards" class="view-btn active" title="Card Grid View">
              <i class="fa-solid fa-table-cells-large"></i> Cards
            </button>
            <button id="btn-view-table" class="view-btn" title="Dense Telemetry Table View">
              <i class="fa-solid fa-table-list"></i> Table
            </button>
          </div>

          <!-- Sort Select -->
          <div class="sort-wrapper">
            <label for="sort-select" class="sort-label"><i class="fa-solid fa-arrow-down-short-wide"></i></label>
            <select id="sort-select" class="sort-select" aria-label="Sort security incidents">
              <option value="recent">Latest Update</option>
              <option value="confidence">Highest Confidence</option>
              <option value="first_seen">First Seen</option>
              <option value="milestones">Most Milestones</option>
            </select>
          </div>

          <!-- Page Size Select -->
          <div class="page-size-wrap">
            <label for="page-size-select" class="sort-label"><i class="fa-solid fa-list-ol"></i></label>
            <select id="page-size-select" class="sort-select" aria-label="Items per page">
              <option value="20" selected>20 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Presentation View 1: Incident Cards Grid -->
    <div class="incidents-grid" id="incidents-grid">
      ${cardsHtml}
    </div>

    <!-- Presentation View 2: Dense Telemetry Table View -->
    <div class="telemetry-table-wrap" id="incidents-table-wrap" style="display: none;">
      <table class="telemetry-table">
        <thead>
          <tr>
            <th class="col-target">Organization &amp; Domain</th>
            <th class="col-status">Status</th>
            <th class="col-confidence">Confidence Score</th>
            <th class="col-actor">Threat Actor</th>
            <th class="col-date">Last Updated</th>
            <th class="col-milestones">Milestones</th>
            <th class="col-action">Action</th>
          </tr>
        </thead>
        <tbody id="telemetry-tbody">
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div id="empty-state" style="display: none; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
      <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-filter-circle-xmark"></i> No matching security incidents found</p>
      <p style="font-size: 0.9rem;">Try modifying your search query or clicking "Clear Filter".</p>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-bar" id="pagination-bar">
      <div class="pagination-info" id="pagination-info">
        Showing 1–20 of 125 incidents
      </div>
      <div class="pagination-nav" id="pagination-nav">
        <!-- Rendered by app.js -->
      </div>
    </div>
  </main>

  ${renderFooter(false)}

  <script src="app.js"></script>
</body>
</html>`;
}

function generateIncidentDetailHtml(inc) {
  const conf = inc.confidence || {
    confidencePercent: 20,
    score: 0.20,
    baseWeight: 0.20,
    corroborationBonus: 0.0,
    uniqueSourcesCount: 1,
    topTier: 'UNVERIFIED CLAIM',
    badgeClass: 'emerging'
  };

  const uniqueDomains = [...new Set(
    (inc.milestones || [])
      .map(m => m.sourceUrl ? extractDomainFromUrl(m.sourceUrl) : null)
      .filter(d => d && d !== 'unknown')
  )];

  const milestonesHtml = (inc.milestones || []).map(m => {
    const verifClass = getVerificationClass(m.verification);
    const verifIcon = getVerificationIcon(m.verification);
    const verifClean = cleanVerification(m.verification);

    const sourceHtml = m.sourceUrl ? `
      <div class="milestone-source">
        <span class="source-label"><i class="fa-solid fa-link"></i> Source:</span>
        <a href="${m.sourceUrl}" target="_blank" rel="noopener nofollow">
          ${m.sourceTitle || 'View Evidence Link'} <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    ` : '';

    return `
      <div class="milestone-node">
        <div class="milestone-marker">
          <span class="marker-dot"></span>
        </div>
        <div class="milestone-card">
          <div class="milestone-header">
            <span class="milestone-time"><i class="fa-regular fa-clock" style="margin-right: 0.4rem;"></i>${m.time}</span>
            <span class="verify-badge ${verifClass}"><i class="${verifIcon}"></i> ${verifClean}</span>
          </div>
          <p class="milestone-event">${m.event}</p>
          ${sourceHtml}
        </div>
      </div>
    `;
  }).join('\n');

  const githubEditUrl = `${GITHUB_REPO_URL}/blob/main/incidents/${inc.fileName}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${inc.target} Security Incident Timeline | securityincident.net</title>
  <meta name="description" content="Verified status and chronological milestone timeline for the ${inc.target} security incident.">
  <link rel="icon" type="image/svg+xml" href="../images/favicon.svg">
  <link rel="alternate" type="application/rss+xml" title="securityincident.net RSS Feed" href="../feed.xml">
  <link rel="alternate" type="application/feed+json" title="securityincident.net JSON Feed" href="../feed.json">
  <link rel="stylesheet" href="../style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="../fontawesome.js"></script>
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
<body>
  ${renderHeader(true)}

  <main class="container detail-page">
    <a href="../" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to all incidents</a>

    <div class="detail-header">
      <div class="detail-top">
        <div>
          <h1 class="detail-title">${inc.target}</h1>
          <span class="card-domain" style="font-size: 0.95rem;">${inc.domain}</span>
        </div>
        ${getStatusBadgeHtml(inc.status)}
      </div>

      <p class="detail-summary">${inc.summary}</p>

      <div class="detail-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Current Status</span>
          <span class="meta-val">${inc.status}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">First Seen</span>
          <span class="meta-val">${inc.first_seen}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Last Updated</span>
          <span class="meta-val">${inc.last_updated}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Threat Actor</span>
          <span class="meta-val">${inc.threat_actor || 'Unattributed / Unknown'}</span>
        </div>
      </div>
    </div>

    <!-- Phase 1: Open Weights Telemetry & Confidence Breakdown Card -->
    <div class="open-weights-card">
      <div class="open-weights-header">
        <div class="ow-title-group">
          <div class="ow-pill"><i class="fa-solid fa-scale-balanced"></i> OPEN WEIGHTS TELEMETRY &bull; DETERMINISTIC CONFIDENCE</div>
          <h2 class="ow-headline">Confidence &amp; Source Corroboration</h2>
        </div>
        <div class="ow-score-badge ${conf.badgeClass}">
          <span class="ow-score-num">${conf.confidencePercent}%</span>
          <span class="ow-score-label">CONFIDENCE</span>
        </div>
      </div>

      <div class="ow-meter-track">
        <div class="ow-meter-fill ${conf.badgeClass}" style="width: ${conf.confidencePercent}%;"></div>
      </div>

      <div class="ow-metrics-grid">
        <div class="ow-metric-box">
          <span class="ow-metric-label">Top Verification Tier</span>
          <span class="ow-metric-val ${conf.badgeClass}"><i class="${getVerificationIcon(conf.topTier)}"></i> ${conf.topTier}</span>
          <span class="ow-metric-sub">Base weight: ${(conf.baseWeight * 100).toFixed(0)}%</span>
        </div>
        <div class="ow-metric-box">
          <span class="ow-metric-label">Cross-Domain Corroboration</span>
          <span class="ow-metric-val font-mono">+${(conf.corroborationBonus * 100).toFixed(0)}%</span>
          <span class="ow-metric-sub">${conf.uniqueSourcesCount} independent domain${conf.uniqueSourcesCount === 1 ? '' : 's'}</span>
        </div>
        <div class="ow-metric-box">
          <span class="ow-metric-label">Composite Score</span>
          <span class="ow-metric-val font-mono">${(conf.score * 100).toFixed(0)}%</span>
          <span class="ow-metric-sub">Open-weights deterministic formula</span>
        </div>
        <div class="ow-metric-box">
          <span class="ow-metric-label">Observable Status</span>
          <span class="ow-metric-val">${inc.status}</span>
          <span class="ow-metric-sub">Ground Truth Telemetry</span>
        </div>
      </div>

      ${uniqueDomains.length > 0 ? `
      <div class="ow-domains-row">
        <span class="ow-domains-title"><i class="fa-solid fa-network-wired"></i> Corroborated Source Domains:</span>
        <div class="ow-domains-list">
          ${uniqueDomains.map(d => `<span class="ow-domain-tag"><i class="fa-solid fa-shield-halved"></i> ${d}</span>`).join('')}
        </div>
      </div>
      ` : ''}
    </div>

    <h2 class="timeline-section-title">
      <span>Milestone Timeline</span>
      <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted); font-family: var(--font-mono);">
        (${inc.milestones.length} events logged)
      </span>
    </h2>

    <div class="timeline-container">
      ${milestonesHtml}
    </div>

    <!-- Phase 3: First-Party Intelligence & Dossier Export Section -->
    <div class="dossier-export-box">
      <div class="dossier-export-header">
        <div class="dossier-title-group">
          <h3><i class="fa-solid fa-database"></i> First-Party Intelligence &amp; Dossier Export</h3>
          <p>Authoritative machine-readable endpoints and citations for threat intelligence platforms, SIEM/SOAR pipelines, and security researchers.</p>
        </div>
        <div class="dossier-btn-group">
          <a href="../api/v1/incidents/${inc.id}.json" target="_blank" download="${inc.id}-dossier.json" class="btn-dossier-download">
            <i class="fa-solid fa-file-arrow-down"></i> Download JSON Dossier
          </a>
        </div>
      </div>

      <div class="dossier-grid">
        <!-- Direct API Box -->
        <div class="dossier-card">
          <div class="dossier-card-title"><i class="fa-solid fa-bolt"></i> REST API Endpoint</div>
          <div class="copy-field">
            <code id="api-url-code">${SITE_URL}/api/v1/incidents/${inc.id}.json</code>
            <button class="btn-copy" data-copy-target="api-url-code" title="Copy API URL">
              <i class="fa-regular fa-copy"></i> Copy URL
            </button>
          </div>
        </div>

        <!-- Live SVG Status Badge -->
        <div class="dossier-card">
          <div class="dossier-card-title"><i class="fa-solid fa-shield-halved"></i> Live SVG Status Badge</div>
          <div class="badge-preview-row">
            <img src="../badges/${inc.id}.svg" alt="Live Status Badge for ${inc.target}" class="live-svg-badge">
            <button class="btn-copy btn-badge-copy" data-copy-text="[![${inc.target} Incident Status](${SITE_URL}/badges/${inc.id}.svg)](${SITE_URL}/incidents/${inc.id}.html)" title="Copy Markdown Embed">
              <i class="fa-regular fa-copy"></i> Copy Markdown Badge
            </button>
          </div>
        </div>

        <!-- Cite This Record -->
        <div class="dossier-card dossier-card-wide">
          <div class="dossier-card-title"><i class="fa-solid fa-quote-left"></i> Academic &amp; Investigative Citation</div>
          <div class="citation-code-wrap">
            <code id="citation-apa">securityincident.net (${inc.last_updated ? inc.last_updated.slice(0, 4) : '2026'}). Incident Intelligence Dossier: ${inc.target} [Status: ${inc.status}, Confidence: ${conf.confidencePercent}%]. Retrieved from ${SITE_URL}/incidents/${inc.id}.html</code>
            <button class="btn-copy" data-copy-target="citation-apa" title="Copy Citation">
              <i class="fa-regular fa-copy"></i> Copy APA
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="github-cta-box">
      <div class="cta-left">
        <h3>Have updated information or a new verifiable source?</h3>
        <p>This incident record is a flat Markdown file tracked in Git. Propose an update or add a milestone via Pull Request.</p>
      </div>
      <a href="${githubEditUrl}" target="_blank" rel="noopener" class="btn-github">
        <i class="fa-brands fa-github"></i> Propose Update via GitHub <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </main>

  ${renderFooter(true)}

  <script src="../app.js"></script>
</body>
</html>`;
}

function generateAboutHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Standard &amp; Philosophy | securityincident.net</title>
  <meta name="description" content="How securityincident.net verifies security incident statuses and milestones on the open web using deterministic open weights.">
  <link rel="icon" type="image/svg+xml" href="images/favicon.svg">
  <link rel="alternate" type="application/rss+xml" title="securityincident.net RSS Feed" href="feed.xml">
  <link rel="alternate" type="application/feed+json" title="securityincident.net JSON Feed" href="feed.json">
  <link rel="stylesheet" href="style.css">
  <script src="fontawesome.js"></script>
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
<body>
  ${renderHeader(false)}

  <main class="container detail-page">
    <a href="./" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to all incidents</a>

    <div class="detail-header">
      <h1 class="detail-title">Verification Standard &amp; Philosophy</h1>
      <p class="detail-summary">
        A neutral, high-signal index of security incident statuses and verifiable milestone timelines, powered by open weights correlation and community-driven GitHub PR editing.
      </p>
    </div>

    <div class="about-panel">
      <h2>1. Neutral Intelligence Through Open Curation</h2>
      <p>
        Modern security incident reporting is plagued by corporate PR ambiguity, premature categorization, and recycled claims. We provide a reliable and neutral source of cybersecurity intelligence by curating security data across its entire lifecycle, ranging from early dark web rumors to formal regulatory disclosures.
      </p>
      <p>
        To deliver maximum clarity, we establish clear levels of confidence and correlate diverse data sources using open weights. Built entirely on open editing through GitHub pull requests, <strong>securityincident.net</strong> empowers security professionals, researchers, and organizations to maintain a transparent, verifiable, and high-signal record of security incidents without corporate bias or editorial filler.
      </p>

      <h2>2. Open Weights Correlation Model</h2>
      <p>
        Unlike opaque black-box AI scores or proprietary vendor risk ratings, our confidence scoring is 100% deterministic, auditable, and open-source. The scoring model is defined in <code>sources/weights.json</code> and calculates a composite score based on the highest verification tier achieved and independent cross-domain corroboration:
      </p>

      <div class="about-weights-table-wrap">
        <table class="about-weights-table">
          <thead>
            <tr>
              <th>Verification Tier</th>
              <th>Base Weight</th>
              <th>Primary Sources</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="verify-badge regulator"><i class="fa-solid fa-building-shield"></i> CONFIRMED BY REGULATOR</span></td>
              <td class="font-mono"><strong>1.00 (100%)</strong></td>
              <td>SEC Form 8-K Item 1.05, State AG breach portals, HHS OCR, CISA advisory.</td>
            </tr>
            <tr>
              <td><span class="verify-badge target"><i class="fa-solid fa-bullhorn"></i> CONFIRMED BY TARGET</span></td>
              <td class="font-mono"><strong>0.90 (90%)</strong></td>
              <td>Official corporate press release, company security blog, direct target status bulletin.</td>
            </tr>
            <tr>
              <td><span class="verify-badge independent"><i class="fa-solid fa-microscope"></i> INDEPENDENT VERIFICATION</span></td>
              <td class="font-mono"><strong>0.65 (65%)</strong></td>
              <td>Reputable cybersecurity researcher analysis, HaveIBeenPwned audit, forensic investigative reporting.</td>
            </tr>
            <tr>
              <td><span class="verify-badge" style="color: var(--status-acknowledged); background: var(--status-acknowledged-bg);"><i class="fa-solid fa-bullhorn"></i> ACKNOWLEDGED</span></td>
              <td class="font-mono"><strong>0.45 (45%)</strong></td>
              <td>Target publicly confirms operational disruption or active investigation without confirming data compromise.</td>
            </tr>
            <tr>
              <td><span class="verify-badge unverified"><i class="fa-solid fa-bolt"></i> UNVERIFIED CLAIM</span></td>
              <td class="font-mono"><strong>0.20 (20%)</strong></td>
              <td>Threat actor leak blog, dark web forum listing, unverified community chatter.</td>
            </tr>
            <tr>
              <td><span class="verify-badge refuted"><i class="fa-solid fa-ban"></i> REFUTED</span></td>
              <td class="font-mono"><strong>0.00 (0%)</strong></td>
              <td>Proven false alarm, recycled historical data, or web scrape mislabeled as a breach.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style="margin-top: 1rem;">
        <strong>Cross-Domain Corroboration Bonus:</strong> For every independent source domain that corroborates an event (e.g. SEC EDGAR + BleepingComputer + Krebs on Security), a +0.05 (+5%) corroboration bonus is awarded, up to a maximum boost of +0.15 (+15%), capped at 1.00 (100%).
      </p>

      <h2>3. The 5 Observable Statuses</h2>
      <div class="about-status-grid">
        <div class="about-status-card">
          <span class="status-badge status-CONFIRMED"><i class="fa-solid fa-circle-check"></i> CONFIRMED</span>
          <p><strong>Highest assurance:</strong> Officially verified by the target or government regulator (e.g. SEC Form 8-K Item 1.05, State AG breach portals, formal press releases).</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-ACKNOWLEDGED"><i class="fa-solid fa-bullhorn"></i> ACKNOWLEDGED</span>
          <p>Target publicly confirms an "IT disruption" or active investigation, but has not yet confirmed a breach or data loss.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-DEVELOPING"><i class="fa-solid fa-satellite-dish"></i> DEVELOPING</span>
          <p>Corroborated intelligence: independent researchers verify samples or observable outages align with claims before target response.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-EMERGING"><i class="fa-solid fa-bolt"></i> EMERGING</span>
          <p>Early threat actor claims, dark web forum leaks, or unverified community chatter before target comment.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-REFUTED"><i class="fa-solid fa-ban"></i> REFUTED</span>
          <p>Proven false alarm, recycled historical leak, or public web scrape mislabeled as a breach.</p>
        </div>
      </div>

      <h2>4. 100% Git-Native &amp; Transparent</h2>
      <p>
        Every incident is stored as an open Markdown document in our GitHub repository. We use GitHub Actions to automate indexing from regulatory RSS and infosec feeds, with zero complex databases. Anyone can audit our sources, examine historical revisions in Git, or submit updates via Pull Request.
      </p>

      <h2>5. How to Contribute via GitHub PR</h2>
      <p>
        Because all incidents are stored as flat Markdown files in Git, you don't need special permissions or database access to contribute. You can propose updates in two easy ways:
      </p>
      <ul style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>In-Browser (Zero Setup):</strong> On any incident detail page, click the <em>"Propose Update via GitHub"</em> button at the bottom of the timeline. Use GitHub's web editor to add your milestone with a verified primary source link and click <em>"Propose changes"</em> to automatically submit a Pull Request.</li>
        <li><strong>Local PR Workflow:</strong> Fork the repository, create a new incident in <code style="color: var(--cyan-accent);">incidents/YYYY-MM-&lt;slug&gt;.md</code>, and open a Pull Request.</li>
      </ul>
      <p>
        For detailed schema requirements and verification standards, read our <a href="${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" style="color: var(--cyan-accent); text-decoration: underline;">Contributing Guidelines</a> on GitHub.
      </p>
    </div>
  </main>

  ${renderFooter(false)}

  <script src="app.js"></script>
</body>
</html>`;
}

async function build() {
  console.log('⚡ Starting securityincident.net build (Phase 3 First-Party Intelligence, STIX 2.1 & Trend Telemetry)...');

  // Ensure directories exist
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(DIST_INCIDENTS_DIR, { recursive: true });
  fs.mkdirSync(DIST_IMAGES_DIR, { recursive: true });
  fs.mkdirSync(DIST_API_DIR, { recursive: true });
  fs.mkdirSync(DIST_API_INCIDENTS_DIR, { recursive: true });
  fs.mkdirSync(DIST_BADGES_DIR, { recursive: true });

  // Copy static frontend assets
  fs.copyFileSync(path.join(PUBLIC_DIR, 'style.css'), path.join(DIST_DIR, 'style.css'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'app.js'), path.join(DIST_DIR, 'app.js'));
  if (fs.existsSync(path.join(PUBLIC_DIR, 'fontawesome.js'))) {
    fs.copyFileSync(path.join(PUBLIC_DIR, 'fontawesome.js'), path.join(DIST_DIR, 'fontawesome.js'));
  }

  // Copy images from images/ to dist/images/
  if (fs.existsSync(IMAGES_DIR)) {
    const imgFiles = fs.readdirSync(IMAGES_DIR);
    for (const f of imgFiles) {
      const srcPath = path.join(IMAGES_DIR, f);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, path.join(DIST_IMAGES_DIR, f));
      }
    }
  }

  // Create .nojekyll for GitHub Pages
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '');

  // Read incidents
  const files = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md'));
  const incidents = [];

  for (const file of files) {
    const filePath = path.join(INCIDENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    const milestones = parseMilestones(body);

    const incidentObj = {
      id: data.id || file.replace('.md', ''),
      fileName: file,
      target: data.target || 'Unknown Target',
      domain: data.domain || '',
      status: (data.status || 'EMERGING').toUpperCase(),
      first_seen: data.first_seen || '',
      last_updated: data.last_updated || '',
      threat_actor: data.threat_actor || null,
      summary: data.summary || '',
      tags: data.tags || [],
      milestones
    };

    // Calculate deterministic Open Weights Confidence Score
    incidentObj.confidence = calculateConfidenceScore(incidentObj);

    incidents.push(incidentObj);

    // Generate individual incident HTML page with confidence telemetry & dossier tools
    const incidentHtml = generateIncidentDetailHtml(incidentObj);
    fs.writeFileSync(path.join(DIST_INCIDENTS_DIR, `${incidentObj.id}.html`), incidentHtml, 'utf-8');

    // Generate first-party machine-readable JSON dossier per incident
    fs.writeFileSync(path.join(DIST_API_INCIDENTS_DIR, `${incidentObj.id}.json`), JSON.stringify(incidentObj, null, 2), 'utf-8');

    // Generate embeddable live SVG status badge
    const badgeSvg = generateIncidentBadgeSvg(incidentObj);
    fs.writeFileSync(path.join(DIST_BADGES_DIR, `${incidentObj.id}.svg`), badgeSvg, 'utf-8');
  }

  // Sort incidents by last_updated descending by default
  incidents.sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));

  // Compute global telemetry stats & trends
  const stats = computeTelemetryStats(incidents);

  // Generate homepage index.html with trend metrics & spotlight
  const indexHtml = generateIndexHtml(incidents, stats);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml, 'utf-8');

  // Generate about.html
  const aboutHtml = generateAboutHtml();
  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), aboutHtml, 'utf-8');

  // Output first-party flat-file APIs
  fs.writeFileSync(path.join(DIST_API_DIR, 'incidents.json'), JSON.stringify(incidents, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DIST_API_DIR, 'stats.json'), JSON.stringify(stats, null, 2), 'utf-8');

  // Output STIX 2.1 Threat Intel Bundle
  const stixBundle = generateStix21Bundle(incidents, SITE_URL);
  fs.writeFileSync(path.join(DIST_API_DIR, 'stix21.json'), JSON.stringify(stixBundle, null, 2), 'utf-8');

  // Output search index JSON with confidence scores for instant client search
  fs.writeFileSync(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(incidents, null, 2), 'utf-8');

  // Output RSS 2.0 Feed
  const rssXml = generateRssFeed(incidents);
  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), rssXml, 'utf-8');

  // Output JSON Feed v1.1 with Open Weights Telemetry
  const jsonFeed = generateJsonFeed(incidents);
  fs.writeFileSync(path.join(DIST_DIR, 'feed.json'), jsonFeed, 'utf-8');

  // Copy CNAME if present
  if (fs.existsSync(path.join(ROOT_DIR, 'CNAME'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'CNAME'), path.join(DIST_DIR, 'CNAME'));
  }

  console.log(`✅ Successfully built ${incidents.length} incident dossiers, REST APIs, STIX 2.1 feed, SVG badges & static site to dist/`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
