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

  // 7. Optional Rich Forensic Fields validation
  if (data.industry !== undefined && typeof data.industry !== 'string') {
    errors.push("'industry' must be a string if specified.");
  }
  if (data.incident_type !== undefined && typeof data.incident_type !== 'string') {
    errors.push("'incident_type' must be a string if specified.");
  }
  if (data.threat_actor !== undefined && data.threat_actor !== null && typeof data.threat_actor !== 'string') {
    errors.push("'threat_actor' must be a string or null if specified.");
  }
  if (data.affected_records !== undefined && data.affected_records !== null && typeof data.affected_records !== 'number') {
    errors.push("'affected_records' must be an integer count or null if specified.");
  }
  if (data.compromised_data !== undefined && !Array.isArray(data.compromised_data)) {
    errors.push("'compromised_data' must be an array of strings if specified.");
  }
  if (data.regulatory_filings !== undefined && !Array.isArray(data.regulatory_filings)) {
    errors.push("'regulatory_filings' must be an array of objects if specified.");
  }

  // 8. Tags validation (optional array)
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push("'tags' must be a list/array of string tags if present.");
  }

  // 9. Body Timeline Validation
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

function validateFeedJson(filePath) {
  const errors = [];
  if (!fs.existsSync(filePath)) {
    return errors;
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    errors.push(`Could not read JSON feed: ${err.message}`);
    return errors;
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    errors.push(`JSON feed parsing failed: ${err.message}`);
    return errors;
  }

  if (json.version !== 'https://jsonfeed.org/version/1.1') {
    errors.push(`JSON feed must specify version 'https://jsonfeed.org/version/1.1', found: '${json.version}'`);
  }
  if (!json.title) errors.push("JSON feed missing 'title'");
  if (!json.home_page_url) errors.push("JSON feed missing 'home_page_url'");
  if (!json.feed_url) errors.push("JSON feed missing 'feed_url'");
  if (!Array.isArray(json.items)) {
    errors.push("JSON feed 'items' must be an array");
  } else {
    for (let i = 0; i < json.items.length; i++) {
      const item = json.items[i];
      if (!item.id) errors.push(`JSON feed item #${i} missing 'id'`);
      if (!item.url) errors.push(`JSON feed item #${i} missing 'url'`);
      if (!item.title) errors.push(`JSON feed item #${i} missing 'title'`);
      if (!item.content_html && !item.content_text) errors.push(`JSON feed item #${i} missing 'content_html' or 'content_text'`);
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

  // If dist/feed.json exists, validate it too
  if (fs.existsSync(JSON_FEED_PATH)) {
    console.log('📡 Validating generated JSON Feed v1.1 (dist/feed.json)...');
    const jsonFeedErrors = validateFeedJson(JSON_FEED_PATH);
    if (jsonFeedErrors.length > 0) {
      totalErrors += jsonFeedErrors.length;
      failureReports.push({ file: 'dist/feed.json', errors: jsonFeedErrors });
    } else {
      console.log('✅ JSON Feed (dist/feed.json) passed structure and compliance validation.');
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
