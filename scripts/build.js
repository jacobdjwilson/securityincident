import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');
const PUBLIC_DIR = path.join(ROOT_DIR, 'src', 'public');
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_INCIDENTS_DIR = path.join(DIST_DIR, 'incidents');
const DIST_IMAGES_DIR = path.join(DIST_DIR, 'images');

// GitHub repository info for community links
const GITHUB_REPO_URL = 'https://github.com/jacobdjwilson/securityincident';

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
  if (s === 'CONFIRMED') icon = 'fa-solid fa-triangle-exclamation';
  else if (s === 'ACKNOWLEDGED') icon = 'fa-solid fa-bullhorn';
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

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-credits">
        <strong>securityincident.net</strong> &bull; Git-native open-web security intelligence index.<br>
        Zero speculative categorization. Ground truth status & milestone verification.
      </div>
      <div class="footer-links">
        <a href="${GITHUB_REPO_URL}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Audit on GitHub</a>
        <a href="${GITHUB_REPO_URL}/tree/main/incidents" target="_blank" rel="noopener"><i class="fa-solid fa-code-pull-request"></i> Add Incident via PR</a>
      </div>
    </div>
  </footer>`;
}

function generateIndexHtml(incidents) {
  const counts = {
    ALL: incidents.length,
    CONFIRMED: incidents.filter(i => i.status === 'CONFIRMED').length,
    ACKNOWLEDGED: incidents.filter(i => i.status === 'ACKNOWLEDGED').length,
    EMERGING: incidents.filter(i => i.status === 'EMERGING').length,
    REFUTED: incidents.filter(i => i.status === 'REFUTED').length
  };

  const cardsHtml = incidents.map(inc => {
    const latestMilestone = inc.milestones && inc.milestones.length > 0 ? inc.milestones[0] : null;
    const actorHtml = inc.threat_actor ? `<span class="footer-actor"><i class="fa-solid fa-user-secret"></i> ${inc.threat_actor}</span>` : '';

    return `
      <a href="incidents/${inc.id}.html" class="incident-card" 
         data-status="${inc.status}" 
         data-target="${inc.target}" 
         data-domain="${inc.domain}" 
         data-summary="${inc.summary}" 
         data-actor="${inc.threat_actor || ''}" 
         data-tags="${(inc.tags || []).join(' ')}">
        <div class="card-top">
          <div class="card-title-group">
            <h2 class="card-target-name">${inc.target}</h2>
            <span class="card-domain">${inc.domain}</span>
          </div>
          ${getStatusBadgeHtml(inc.status)}
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
  <title>securityincident.net | Open Web Incident Status & Milestone Tracker</title>
  <meta name="description" content="A 100% Git-native clearinghouse tracking real-time status and verified milestone timelines for cybersecurity incidents on the open web.">
  <link rel="icon" type="image/svg+xml" href="images/favicon.svg">
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
      <div class="hero-pill"><i class="fa-solid fa-satellite-dish"></i> OPEN-WEB SECURITY TELEMETRY &bull; GIT-NATIVE</div>
      <h1 class="hero-title">Real-Time Incident Status &amp; Timeline Index</h1>
      <p class="hero-desc">
        Tracking cybersecurity events from initial dark web claim to regulatory 8-K confirmation. 
        Zero speculative categorization—strictly verified public milestones and current ground truth.
      </p>
    </section>

    <div class="controls-bar">
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" id="search-input" class="search-input" placeholder="Search by organization, domain, threat actor, or keyword..." autocomplete="off">
        <span class="search-kbd">/</span>
      </div>

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
        <button class="filter-btn" data-filter="EMERGING">
          <span class="status-dot-indicator emerging"></span> Emerging <span class="filter-count">${counts.EMERGING}</span>
        </button>
        <button class="filter-btn" data-filter="REFUTED">
          <span class="status-dot-indicator refuted"></span> Refuted <span class="filter-count">${counts.REFUTED}</span>
        </button>
        <span id="results-count" style="margin-left: auto; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
          ${counts.ALL} incidents
        </span>
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

  ${renderFooter()}

  <script src="app.js"></script>
</body>
</html>`;
}

function generateIncidentDetailHtml(inc) {
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

    <h2 class="timeline-section-title">
      <span>Milestone Timeline</span>
      <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted); font-family: var(--font-mono);">
        (${inc.milestones.length} events logged)
      </span>
    </h2>

    <div class="timeline-container">
      ${milestonesHtml}
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

  ${renderFooter()}

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
  <meta name="description" content="How securityincident.net verifies security incident statuses and milestones on the open web.">
  <link rel="icon" type="image/svg+xml" href="images/favicon.svg">
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
        Why securityincident.net prioritizes observable public status and verifiable milestone timelines over subjective categorization.
      </p>
    </div>

    <div class="about-panel">
      <h2>1. Status Over Categorization</h2>
      <p>
        In early stages of a security incident, the "type" is almost always subjective or inaccurate. An incident that begins as an "unplanned IT maintenance outage" frequently evolves into an "unauthorized access event," which later becomes a "data exfiltration" or "ransomware extortion."
      </p>
      <p>
        Rather than pinning incidents to rigid categories, we focus on what people actually need to know:
        <strong>Is it an unconfirmed rumor, has the target acknowledged an investigation, or has an official regulator confirmed it?</strong>
      </p>

      <h2>2. The 4 Observable Statuses</h2>
      <div class="about-status-grid">
        <div class="about-status-card">
          <span class="status-badge status-EMERGING"><i class="fa-solid fa-bolt"></i> EMERGING</span>
          <p>Early dark web claim, extortion countdown, or unverified community chatter. Target organization has not commented.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-ACKNOWLEDGED"><i class="fa-solid fa-bullhorn"></i> ACKNOWLEDGED</span>
          <p>Target organization publicly acknowledges an IT disruption or active investigation, without yet confirming data loss.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-CONFIRMED"><i class="fa-solid fa-triangle-exclamation"></i> CONFIRMED</span>
          <p>Confirmed by official regulatory filings (e.g. SEC Form 8-K Item 1.05, State AG registry) or explicit target admission.</p>
        </div>
        <div class="about-status-card">
          <span class="status-badge status-REFUTED"><i class="fa-solid fa-ban"></i> REFUTED</span>
          <p>Confirmed hoax, recycled public data dump, or proven false alarm.</p>
        </div>
      </div>

      <h2>3. 100% Git-Native &amp; Transparent</h2>
      <p>
        Every incident is stored as an open Markdown document in our GitHub repository. We use GitHub Actions to automate indexing from regulatory RSS and infosec feeds, with zero complex databases. Anyone can audit our sources or submit updates via Pull Request.
      </p>

      <h2>4. How to Contribute via GitHub PR</h2>
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

  ${renderFooter()}

  <script src="app.js"></script>
</body>
</html>`;
}

async function build() {
  console.log('⚡ Starting securityincident.net build...');

  // Ensure directories exist
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(DIST_INCIDENTS_DIR, { recursive: true });
  fs.mkdirSync(DIST_IMAGES_DIR, { recursive: true });

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

    incidents.push(incidentObj);

    // Generate individual incident HTML page
    const incidentHtml = generateIncidentDetailHtml(incidentObj);
    fs.writeFileSync(path.join(DIST_INCIDENTS_DIR, `${incidentObj.id}.html`), incidentHtml, 'utf-8');
  }

  // Sort incidents by last_updated descending
  incidents.sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));

  // Generate homepage index.html
  const indexHtml = generateIndexHtml(incidents);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml, 'utf-8');

  // Generate about.html
  const aboutHtml = generateAboutHtml();
  fs.writeFileSync(path.join(DIST_DIR, 'about.html'), aboutHtml, 'utf-8');

  // Output search index JSON for fast searching or external consumption
  fs.writeFileSync(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(incidents, null, 2), 'utf-8');

  console.log(`✅ Successfully built ${incidents.length} incident pages & assets to dist/`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
