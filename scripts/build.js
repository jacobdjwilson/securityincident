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
  let highConfCount = 0;

  const threatActorCounts = {};
  const sectorCounts = {};

  for (const inc of incidents) {
    if (inc.last_updated) {
      const upTime = new Date(inc.last_updated).getTime();
      if (!isNaN(upTime)) {
        if (now - upTime <= thirtyDaysMs) active30d++;
        if (now - upTime <= ninetyDaysMs) active90d++;
      }
    }

    if (inc.confidence && inc.confidence.uniqueSourcesCount >= 2) {
      multiSourceCount++;
    }

    if (inc.confidence && inc.confidence.confidencePercent >= 90) {
      highConfCount++;
    }

    if (inc.threat_actor && inc.threat_actor !== 'Unknown') {
      threatActorCounts[inc.threat_actor] = (threatActorCounts[inc.threat_actor] || 0) + 1;
    }

    for (const tag of (inc.tags || [])) {
      const t = tag.toLowerCase();
      if (!['confirmed', 'acknowledged', 'developing', 'emerging', 'refuted', 'regulatory', 'investigative'].includes(t)) {
        sectorCounts[t] = (sectorCounts[t] || 0) + 1;
      }
    }
  }

  const topThreatActors = Object.entries(threatActorCounts)
    .map(([actor, count]) => ({ actor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSectors = Object.entries(sectorCounts)
    .map(([sector, count]) => ({ sector, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Top spotlight incidents: select top 4 high confidence, multi-source or critical enterprise incidents
  const topIncidents = [...incidents]
    .filter(i => i.status === 'CONFIRMED' || i.confidence?.confidencePercent >= 80)
    .sort((a, b) => {
      const confDiff = (b.confidence?.confidencePercent || 0) - (a.confidence?.confidencePercent || 0);
      if (confDiff !== 0) return confDiff;
      const msDiff = (b.milestones?.length || 0) - (a.milestones?.length || 0);
      if (msDiff !== 0) return msDiff;
      return (b.last_updated || '').localeCompare(a.last_updated || '');
    })
    .slice(0, 4);

  return {
    total_incidents: total,
    status_distribution: statusCounts,
    confirmed_percent: total > 0 ? Math.round((statusCounts.CONFIRMED / total) * 100) : 0,
    corroborated_count: multiSourceCount,
    corroborated_percent: total > 0 ? Math.round((multiSourceCount / total) * 100) : 0,
    high_confidence_count: highConfCount,
    high_confidence_percent: total > 0 ? Math.round((highConfCount / total) * 100) : 0,
    active_30d_count: active30d,
    active_90d_count: active90d,
    top_threat_actors: topThreatActors,
    top_sectors: topSectors,
    top_incidents: topIncidents,
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
            <span><i class="fa-regular fa-clock"></i> Updated ${inc.last_updated}</span>
            ${actorHtml}
          </div>
          <span class="view-link">View Timeline <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  }).join('\n');

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
    <section class="hero">
      <div class="hero-pill"><i class="fa-solid fa-scale-balanced"></i> OPEN-WEB SECURITY INTELLIGENCE &bull; OPEN WEIGHTS ENGINE</div>
      <h1 class="hero-title">Real-Time Incident Status &amp; Timeline Index</h1>
      <p class="hero-desc">
        A neutral, high-signal index of security incident statuses and verifiable milestone timelines, powered by open weights correlation and community-driven GitHub PR editing.
      </p>
    </section>

    <!-- Phase 3: Executive Telemetry & Trends Dashboard -->
    <section class="telemetry-dashboard">
      <!-- 4 KPI Metrics Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrap kpi-blue"><i class="fa-solid fa-layer-group"></i></div>
          <div class="kpi-body">
            <div class="kpi-value">${stats.total_incidents}</div>
            <div class="kpi-label">Indexed Incidents</div>
            <div class="kpi-sub">100% Flat Git Files</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon-wrap kpi-green"><i class="fa-solid fa-certificate"></i></div>
          <div class="kpi-body">
            <div class="kpi-value">${stats.confirmed_percent}%</div>
            <div class="kpi-label">Confirmed Assurance</div>
            <div class="kpi-sub">${stats.status_distribution.CONFIRMED} Statutory Disclosures</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon-wrap kpi-cyan"><i class="fa-solid fa-network-wired"></i></div>
          <div class="kpi-body">
            <div class="kpi-value">${stats.corroborated_percent}%</div>
            <div class="kpi-label">Multi-Source Corroborated</div>
            <div class="kpi-sub">${stats.corroborated_count} Cross-Jurisdiction</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon-wrap kpi-orange"><i class="fa-solid fa-gauge-high"></i></div>
          <div class="kpi-body">
            <div class="kpi-value">${stats.active_30d_count}</div>
            <div class="kpi-label">Active (Last 30 Days)</div>
            <div class="kpi-sub">Real-Time Velocity</div>
          </div>
        </div>
      </div>

      <!-- Segmented Status Distribution Bar -->
      <div class="telemetry-bar-card">
        <div class="bar-header">
          <span class="bar-title"><i class="fa-solid fa-chart-simple"></i> Telemetry Status Breakdown</span>
          <div class="bar-legend">
            <span class="legend-item"><span class="dot dot-confirmed"></span> Confirmed (${stats.status_distribution.CONFIRMED})</span>
            <span class="legend-item"><span class="dot dot-acknowledged"></span> Acknowledged (${stats.status_distribution.ACKNOWLEDGED})</span>
            <span class="legend-item"><span class="dot dot-developing"></span> Developing (${stats.status_distribution.DEVELOPING})</span>
            <span class="legend-item"><span class="dot dot-emerging"></span> Emerging (${stats.status_distribution.EMERGING})</span>
            <span class="legend-item"><span class="dot dot-refuted"></span> Refuted (${stats.status_distribution.REFUTED})</span>
          </div>
        </div>
        <div class="telemetry-segmented-bar">
          <div class="bar-segment bar-seg-confirmed" data-filter="CONFIRMED" style="width: ${(stats.status_distribution.CONFIRMED / stats.total_incidents * 100).toFixed(1)}%;" title="Confirmed: ${stats.status_distribution.CONFIRMED} (${(stats.status_distribution.CONFIRMED / stats.total_incidents * 100).toFixed(1)}%)"></div>
          <div class="bar-segment bar-seg-acknowledged" data-filter="ACKNOWLEDGED" style="width: ${(stats.status_distribution.ACKNOWLEDGED / stats.total_incidents * 100).toFixed(1)}%;" title="Acknowledged: ${stats.status_distribution.ACKNOWLEDGED} (${(stats.status_distribution.ACKNOWLEDGED / stats.total_incidents * 100).toFixed(1)}%)"></div>
          <div class="bar-segment bar-seg-developing" data-filter="DEVELOPING" style="width: ${(stats.status_distribution.DEVELOPING / stats.total_incidents * 100).toFixed(1)}%;" title="Developing: ${stats.status_distribution.DEVELOPING} (${(stats.status_distribution.DEVELOPING / stats.total_incidents * 100).toFixed(1)}%)"></div>
          <div class="bar-segment bar-seg-emerging" data-filter="EMERGING" style="width: ${(stats.status_distribution.EMERGING / stats.total_incidents * 100).toFixed(1)}%;" title="Emerging: ${stats.status_distribution.EMERGING} (${(stats.status_distribution.EMERGING / stats.total_incidents * 100).toFixed(1)}%)"></div>
          <div class="bar-segment bar-seg-refuted" data-filter="REFUTED" style="width: ${(stats.status_distribution.REFUTED / stats.total_incidents * 100).toFixed(1)}%;" title="Refuted: ${stats.status_distribution.REFUTED} (${(stats.status_distribution.REFUTED / stats.total_incidents * 100).toFixed(1)}%)"></div>
        </div>
      </div>

      <!-- Spotlight High-Impact Incidents -->
      <div class="spotlight-section">
        <div class="spotlight-header">
          <h2 class="spotlight-title"><i class="fa-solid fa-fire-flame-curved"></i> High-Impact Incident Spotlight</h2>
          <span class="spotlight-desc">Highest confidence &amp; multi-source corroborated intelligence</span>
        </div>
        <div class="spotlight-grid">
          ${stats.top_incidents.map(inc => {
            const conf = inc.confidence || { confidencePercent: 100, badgeClass: 'confirmed', uniqueSourcesCount: 2 };
            return `
            <a href="incidents/${inc.id}.html" class="spotlight-card">
              <div>
                <div class="spotlight-top">
                  <div class="spotlight-target">${inc.target}</div>
                  ${getStatusBadgeHtml(inc.status)}
                </div>
                <div class="spotlight-domain">${inc.domain}</div>
                <div class="spotlight-meta-row">
                  <span class="confidence-badge ${conf.badgeClass}">
                    <i class="fa-solid fa-shield-halved"></i> ${conf.confidencePercent}%
                  </span>
                  <span class="sources-count-badge">
                    <i class="fa-solid fa-network-wired"></i> ${conf.uniqueSourcesCount} source${conf.uniqueSourcesCount === 1 ? '' : 's'}
                  </span>
                </div>
                <p class="spotlight-summary">${inc.summary}</p>
              </div>
              <div class="spotlight-footer">
                <span>Updated ${inc.last_updated}</span>
                <span class="spotlight-cta">Dossier <i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </a>`;
          }).join('\n')}
        </div>
      </div>

      <!-- Quick Filter Sector Chips -->
      <div class="sector-chips-wrap">
        <span class="chips-label"><i class="fa-solid fa-tags"></i> Quick Filters:</span>
        <div class="chips-row">
          <button class="chip-btn active" data-chip="all">All Sectors</button>
          <button class="chip-btn" data-chip="sec-8k"><i class="fa-solid fa-building-shield"></i> SEC Form 8-K</button>
          <button class="chip-btn" data-chip="state-ag"><i class="fa-solid fa-landmark"></i> State AG Portals</button>
          <button class="chip-btn" data-chip="healthcare"><i class="fa-solid fa-heart-pulse"></i> Healthcare</button>
          <button class="chip-btn" data-chip="financial"><i class="fa-solid fa-building-columns"></i> Financial</button>
          <button class="chip-btn" data-chip="legal"><i class="fa-solid fa-scale-balanced"></i> Legal</button>
          <button class="chip-btn" data-chip="retail"><i class="fa-solid fa-cart-shopping"></i> Retail</button>
          <button class="chip-btn" data-chip="threat-actor"><i class="fa-solid fa-user-secret"></i> Attributed Actor</button>
        </div>
      </div>
    </section>

    <div class="controls-bar">
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="search-input" class="search-input" placeholder="Search by organization, domain, threat actor, or keyword..." autocomplete="off">
        <span class="search-kbd">/</span>
      </div>

      <div class="controls-action-row">
        <div class="filter-pills">
          <button class="filter-btn active" data-filter="ALL">
            <i class="fa-solid fa-layer-group"></i> All <span class="filter-count">${counts.ALL}</span>
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

        <div class="sort-wrapper">
          <label for="sort-select" class="sort-label"><i class="fa-solid fa-arrow-down-short-wide"></i> Sort:</label>
          <select id="sort-select" class="sort-select" aria-label="Sort security incidents">
            <option value="recent">Latest Update</option>
            <option value="confidence">Highest Confidence</option>
            <option value="first_seen">First Seen</option>
            <option value="milestones">Most Milestones</option>
          </select>
          <span id="results-count" class="results-counter">
            ${counts.ALL} incidents
          </span>
        </div>
      </div>
    </div>

    <div class="incidents-grid" id="incidents-grid">
      ${cardsHtml}
    </div>

    <div id="empty-state" style="display: none; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
      <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-filter-circle-xmark"></i> No matching security incidents found</p>
      <p style="font-size: 0.9rem;">Try modifying your search query or filter selection.</p>
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
