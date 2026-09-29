import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT_DIR = process.cwd();
const INCIDENTS_DIR = path.join(ROOT_DIR, 'incidents');

const VALID_STATUSES = ['EMERGING', 'DEVELOPING', 'ACKNOWLEDGED', 'CONFIRMED', 'REFUTED'];
const VALID_VERIFICATIONS = [
  'CONFIRMED BY REGULATOR',
  'CONFIRMED BY TARGET',
  'INDEPENDENT VERIFICATION',
  'UNVERIFIED CLAIM',
  'REFUTED'
];

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const FILENAME_REGEX = /^\d{4}-\d{2}-[a-z0-9-]+\.md$/;
const URL_REGEX = /^https?:\/\/.+/i;

function cleanVerification(verifText) {
  return (verifText || '').replace(/^[🟢🟡🔵⚪🔴\s]+/, '').trim().toUpperCase();
}

export function validateIncidentFile(filename) {
  const filePath = path.join(INCIDENTS_DIR, filename);
  const errors = [];

  // 1. Filename validation
  if (!FILENAME_REGEX.test(filename)) {
    errors.push(`Invalid filename format '${filename}'. Expected 'YYYY-MM-<slug>.md' (lowercase alphanumeric with hyphens).`);
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    errors.push(`Could not read file: ${err.message}`);
    return errors;
  }

  // 2. Parse frontmatter
  let parsed;
  try {
    parsed = matter(content);
  } catch (err) {
    errors.push(`YAML frontmatter parsing failed: ${err.message}`);
    return errors;
  }

  const { data, content: body } = parsed;

  if (!data || Object.keys(data).length === 0) {
    errors.push('Missing YAML frontmatter block (enclosed in ---).');
    return errors;
  }

  // 3. Required fields check
  const expectedId = filename.replace(/\.md$/, '');
  if (!data.id) {
    errors.push("Missing required field: 'id'");
  } else if (data.id !== expectedId) {
    errors.push(`'id' ('${data.id}') does not match filename base ('${expectedId}')`);
  }

  if (!data.target || typeof data.target !== 'string' || !data.target.trim()) {
    errors.push("Missing or empty required field: 'target' (string)");
  }

  if (data.domain === undefined || typeof data.domain !== 'string') {
    errors.push("Missing required field: 'domain' (string)");
  }

  // 4. Status validation
  if (!data.status) {
    errors.push(`Missing required field: 'status' (must be one of: ${VALID_STATUSES.join(', ')})`);
  } else if (!VALID_STATUSES.includes(String(data.status).toUpperCase())) {
    errors.push(`Invalid status '${data.status}'. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // 5. Date validation
  if (!data.first_seen || !ISO_DATE_REGEX.test(String(data.first_seen).trim())) {
    errors.push(`Invalid or missing 'first_seen' date '${data.first_seen}'. Expected format: YYYY-MM-DD`);
  }

  if (!data.last_updated || !ISO_DATE_REGEX.test(String(data.last_updated).trim())) {
    errors.push(`Invalid or missing 'last_updated' date '${data.last_updated}'. Expected format: YYYY-MM-DD`);
  }

  if (
    data.first_seen &&
    data.last_updated &&
    ISO_DATE_REGEX.test(String(data.first_seen).trim()) &&
    ISO_DATE_REGEX.test(String(data.last_updated).trim())
  ) {
    if (String(data.last_updated).trim() < String(data.first_seen).trim()) {
      errors.push(`'last_updated' (${data.last_updated}) cannot be earlier than 'first_seen' (${data.first_seen})`);
    }
  }

  // 6. Summary validation
  if (!data.summary || typeof data.summary !== 'string' || !data.summary.trim()) {
    errors.push("Missing or empty required field: 'summary'");
  } else if (data.summary.trim().length < 20) {
    errors.push(`'summary' is too short (${data.summary.trim().length} chars). Provide an informative 1-2 sentence summary.`);
  }

  // 7. Tags validation (optional array)
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push("'tags' must be a list/array of string tags if present.");
  }

  // 8. Body Timeline Validation
  if (!body.includes('## Timeline')) {
    errors.push("Markdown body must contain a '## Timeline' section.");
  }

  const sections = body.split(/###\s+/);
  const milestones = [];

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].trim();
    const lines = section.split('\n');
    const time = lines[0].trim();

    let event = '';
    let verification = '';
    let sourceTitle = '';
    let sourceUrl = '';

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (line.startsWith('- **Event:**')) {
        event = line.replace('- **Event:**', '').trim();
      } else if (line.startsWith('- **Verification:**')) {
        verification = line.replace('- **Verification:**', '').trim();
      } else if (line.startsWith('- **Source:**')) {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          sourceTitle = match[1].trim();
          sourceUrl = match[2].trim();
        }
      }
    }

    milestones.push({ time, event, verification, sourceTitle, sourceUrl, index: i });
  }

  if (milestones.length === 0) {
    errors.push("Timeline must contain at least one milestone event formatted with '### YYYY-MM-DD HH:MM UTC'");
  }

  milestones.forEach(m => {
    if (!m.time) {
      errors.push(`Milestone #${m.index}: Missing timestamp header after '### '`);
    }

    if (!m.event) {
      errors.push(`Milestone #${m.index} (${m.time || 'unknown'}): Missing '- **Event:**' description`);
    }

    if (!m.verification) {
      errors.push(`Milestone #${m.index} (${m.time || 'unknown'}): Missing '- **Verification:**' tag`);
    } else {
      const cleanVerif = cleanVerification(m.verification);
      if (!VALID_VERIFICATIONS.includes(cleanVerif)) {
        errors.push(
          `Milestone #${m.index} (${m.time}): Invalid verification tier '${m.verification}'. Must be one of:\n  - ${VALID_VERIFICATIONS.join('\n  - ')}`
        );
      }
    }

    if (!m.sourceUrl) {
      errors.push(`Milestone #${m.index} (${m.time}): Missing '- **Source:** [Title](URL)' markdown link`);
    } else if (!URL_REGEX.test(m.sourceUrl)) {
      errors.push(`Milestone #${m.index} (${m.time}): Source URL '${m.sourceUrl}' is not a valid absolute HTTP/HTTPS URL`);
    }
  });

  return errors;
}

const FEED_PATH = path.join(ROOT_DIR, 'dist', 'feed.xml');

function validateFeedXml(filePath) {
  const errors = [];
  if (!fs.existsSync(filePath)) {
    return errors;
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    errors.push(`Could not read feed file: ${err.message}`);
    return errors;
  }

  if (!content.trim().startsWith('<?xml version="1.0"')) {
    errors.push("feed.xml must start with XML declaration '<?xml version=\"1.0\" encoding=\"UTF-8\"?>'");
  }

  if (!content.includes('<rss version="2.0"') || !content.includes('</rss>')) {
    errors.push('feed.xml missing valid <rss version="2.0"> root tags');
  }

  if (!content.includes('<channel>') || !content.includes('</channel>')) {
    errors.push('feed.xml missing <channel> tags');
  }

  if (!content.includes('<atom:link')) {
    errors.push('feed.xml missing atom:link self reference');
  }

  const items = content.split('<item>');
  for (let i = 1; i < items.length; i++) {
    const itemContent = items[i].split('</item>')[0];
    if (!itemContent.includes('<title>') || !itemContent.includes('</title>')) {
      errors.push(`Item #${i} in feed.xml is missing <title> tag`);
    }
    if (!itemContent.includes('<link>') || !itemContent.includes('</link>')) {
      errors.push(`Item #${i} in feed.xml is missing <link> tag`);
    }
    if (!itemContent.includes('<guid') || !itemContent.includes('</guid>')) {
      errors.push(`Item #${i} in feed.xml is missing <guid> tag`);
    }
    if (!itemContent.includes('<pubDate>') || !itemContent.includes('</pubDate>')) {
      errors.push(`Item #${i} in feed.xml is missing <pubDate> tag`);
    } else {
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      if (pubDateMatch) {
        const d = new Date(pubDateMatch[1]);
        if (isNaN(d.getTime())) {
          errors.push(`Item #${i} in feed.xml has invalid pubDate: '${pubDateMatch[1]}'`);
        }
      }
    }
    if (!itemContent.includes('<description>') || !itemContent.includes('</description>')) {
      errors.push(`Item #${i} in feed.xml is missing <description> tag`);
    }
  }

  return errors;
}

const JSON_FEED_PATH = path.join(ROOT_DIR, 'dist', 'feed.json');
const STIX_PATH = path.join(ROOT_DIR, 'dist', 'api', 'v1', 'stix21.json');
const API_DIR = path.join(ROOT_DIR, 'dist', 'api', 'v1');
const BADGES_DIR = path.join(ROOT_DIR, 'dist', 'badges');

function validateJsonFeed(filePath) {
  const errors = [];
  if (!fs.existsSync(filePath)) return errors;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.version || !parsed.version.includes('jsonfeed.org')) {
      errors.push("feed.json missing valid 'version' specifier (https://jsonfeed.org/version/1.1)");
    }
    if (!parsed.title) {
      errors.push("feed.json missing 'title' property");
    }
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
      errors.push("feed.json must have non-empty 'items' array");
    } else {
      parsed.items.forEach((item, idx) => {
        if (!item.id) errors.push(`feed.json item #${idx} missing 'id'`);
        if (!item.title) errors.push(`feed.json item #${idx} missing 'title'`);
        if (!item.url) errors.push(`feed.json item #${idx} missing 'url'`);
      });
    }
  } catch (err) {
    errors.push(`Invalid JSON syntax in feed.json: ${err.message}`);
  }
  return errors;
}

function validateStix21(filePath) {
  const errors = [];
  if (!fs.existsSync(filePath)) return errors;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const bundle = JSON.parse(raw);
    if (bundle.type !== 'bundle') {
      errors.push(`STIX 2.1 top-level type must be 'bundle', found '${bundle.type}'`);
    }
    if (!bundle.id || !bundle.id.startsWith('bundle--')) {
      errors.push(`STIX 2.1 bundle id must start with 'bundle--', found '${bundle.id}'`);
    }
    if (!Array.isArray(bundle.objects) || bundle.objects.length === 0) {
      errors.push("STIX 2.1 bundle must contain non-empty 'objects' array");
    } else {
      const types = new Set(bundle.objects.map(o => o.type));
      if (!types.has('identity')) errors.push("STIX bundle missing required 'identity' objects");
      if (!types.has('incident')) errors.push("STIX bundle missing required 'incident' objects");
      if (!types.has('relationship')) errors.push("STIX bundle missing required 'relationship' objects");

      bundle.objects.forEach((obj, idx) => {
        if (!obj.type) errors.push(`STIX object #${idx} missing 'type'`);
        if (obj.spec_version !== '2.1') errors.push(`STIX object #${idx} spec_version must be '2.1', found '${obj.spec_version}'`);
        if (!obj.id || !obj.id.startsWith(`${obj.type}--`)) errors.push(`STIX object #${idx} invalid ID prefix: '${obj.id}'`);
        if (!obj.created) errors.push(`STIX object #${idx} missing 'created' timestamp`);
        if (!obj.modified) errors.push(`STIX object #${idx} missing 'modified' timestamp`);
      });
    }
  } catch (err) {
    errors.push(`Invalid JSON syntax in STIX bundle: ${err.message}`);
  }
  return errors;
}

function validateApiFiles(apiDir) {
  const errors = [];
  if (!fs.existsSync(apiDir)) return errors;

  const incidentsJsonPath = path.join(apiDir, 'incidents.json');
  const statsJsonPath = path.join(apiDir, 'stats.json');

  if (fs.existsSync(incidentsJsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(incidentsJsonPath, 'utf-8'));
      if (!Array.isArray(parsed) || parsed.length === 0) {
        errors.push("api/v1/incidents.json must be a non-empty array");
      }
    } catch (err) {
      errors.push(`api/v1/incidents.json invalid JSON: ${err.message}`);
    }
  }

  if (fs.existsSync(statsJsonPath)) {
    try {
      const stats = JSON.parse(fs.readFileSync(statsJsonPath, 'utf-8'));
      if (typeof stats.total_incidents !== 'number' || stats.total_incidents <= 0) {
        errors.push("api/v1/stats.json missing valid 'total_incidents' count");
      }
      if (!stats.status_distribution) {
        errors.push("api/v1/stats.json missing 'status_distribution'");
      }
    } catch (err) {
      errors.push(`api/v1/stats.json invalid JSON: ${err.message}`);
    }
  }

  return errors;
}

function validateBadges(badgesDir) {
  const errors = [];
  if (!fs.existsSync(badgesDir)) return errors;

  const badgeFiles = fs.readdirSync(badgesDir).filter(f => f.endsWith('.svg'));
  if (badgeFiles.length === 0) {
    errors.push("dist/badges/ contains no SVG files");
    return errors;
  }

  const sampleBadges = badgeFiles.slice(0, 5);
  for (const b of sampleBadges) {
    const raw = fs.readFileSync(path.join(badgesDir, b), 'utf-8');
    if (!raw.includes('<svg') || !raw.includes('</svg>')) {
      errors.push(`dist/badges/${b} does not contain valid SVG markup`);
    }
  }
  return errors;
}

export function validateAll() {
  console.log('🔍 Validating incident schema and verification compliance...');

  if (!fs.existsSync(INCIDENTS_DIR)) {
    console.error(`❌ Incidents directory not found: ${INCIDENTS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(INCIDENTS_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.warn('⚠️ No incident markdown files found in incidents/');
    process.exit(0);
  }

  let totalErrors = 0;
  const failureReports = [];

  for (const file of files) {
    const errors = validateIncidentFile(file);
    if (errors.length > 0) {
      totalErrors += errors.length;
      failureReports.push({ file: `incidents/${file}`, errors });
    }
  }

  // If dist/feed.xml exists, validate it too
  if (fs.existsSync(FEED_PATH)) {
    console.log('📡 Validating generated RSS 2.0 feed (dist/feed.xml)...');
    const feedErrors = validateFeedXml(FEED_PATH);
    if (feedErrors.length > 0) {
      totalErrors += feedErrors.length;
      failureReports.push({ file: 'dist/feed.xml', errors: feedErrors });
    } else {
      console.log('✅ RSS feed (dist/feed.xml) passed structure and compliance validation.');
    }
  }

  // If dist/feed.json exists, validate it
  if (fs.existsSync(JSON_FEED_PATH)) {
    console.log('📋 Validating JSON Feed v1.1 (dist/feed.json)...');
    const jsonFeedErrors = validateJsonFeed(JSON_FEED_PATH);
    if (jsonFeedErrors.length > 0) {
      totalErrors += jsonFeedErrors.length;
      failureReports.push({ file: 'dist/feed.json', errors: jsonFeedErrors });
    } else {
      console.log('✅ JSON Feed (dist/feed.json) passed structure validation.');
    }
  }

  // If dist/api/v1/stix21.json exists, validate it
  if (fs.existsSync(STIX_PATH)) {
    console.log('🛡️ Validating STIX 2.1 Threat Intel Bundle (dist/api/v1/stix21.json)...');
    const stixErrors = validateStix21(STIX_PATH);
    if (stixErrors.length > 0) {
      totalErrors += stixErrors.length;
      failureReports.push({ file: 'dist/api/v1/stix21.json', errors: stixErrors });
    } else {
      console.log('✅ STIX 2.1 bundle passed CTI compliance validation.');
    }
  }

  // If dist/api/v1 exists, validate REST APIs
  if (fs.existsSync(API_DIR)) {
    console.log('⚡ Validating first-party REST APIs (dist/api/v1/)...');
    const apiErrors = validateApiFiles(API_DIR);
    if (apiErrors.length > 0) {
      totalErrors += apiErrors.length;
      failureReports.push({ file: 'dist/api/v1/', errors: apiErrors });
    } else {
      console.log('✅ First-party REST APIs passed validation.');
    }
  }

  // If dist/badges exists, validate badges
  if (fs.existsSync(BADGES_DIR)) {
    console.log('🎨 Validating SVG status badges (dist/badges/)...');
    const badgeErrors = validateBadges(BADGES_DIR);
    if (badgeErrors.length > 0) {
      totalErrors += badgeErrors.length;
      failureReports.push({ file: 'dist/badges/', errors: badgeErrors });
    } else {
      console.log('✅ SVG status badges passed validation.');
    }
  }

  if (totalErrors > 0) {
    console.error(`\n❌ Validation failed: ${totalErrors} issue(s) detected across ${failureReports.length} file(s):\n`);
    failureReports.forEach(report => {
      console.error(`📄 ${report.file}:`);
      report.errors.forEach(err => console.error(`   ✖ ${err}`));
      console.error('');
    });
    process.exit(1);
  }

  console.log(`✅ All ${files.length} incident records passed schema and verification validation.`);
  process.exit(0);
}

// Run validation when executed directly
if (process.argv[1] && (process.argv[1].endsWith('validate.js') || process.argv[1].includes('validate'))) {
  validateAll();
}
