import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const WEIGHTS_FILE = path.join(ROOT_DIR, 'sources', 'weights.json');

let weightsConfig = null;

export function loadWeightsConfig() {
  if (weightsConfig) return weightsConfig;
  try {
    if (fs.existsSync(WEIGHTS_FILE)) {
      weightsConfig = JSON.parse(fs.readFileSync(WEIGHTS_FILE, 'utf-8'));
      return weightsConfig;
    }
  } catch (err) {
    console.warn('⚠️ Could not load weights.json, using defaults:', err.message);
  }

  // Safe defaults if weights.json is unreadable
  weightsConfig = {
    version: '2.0.0',
    tiers: {
      'CONFIRMED BY REGULATOR': { baseWeight: 0.65 },
      'CONFIRMED BY TARGET': { baseWeight: 0.50 },
      'INDEPENDENT VERIFICATION': { baseWeight: 0.32 },
      'ACKNOWLEDGED': { baseWeight: 0.18 },
      'UNVERIFIED CLAIM': { baseWeight: 0.06 },
      'REFUTED': { baseWeight: 0.00 }
    },
    evidence: {
      statutoryFilingBonus: 0.12,
      verifiedDomainBonus: 0.03,
      compromisedDataBonus: 0.04,
      affectedRecordsBonus: 0.04
    },
    corroboration: {
      twoDomains: 0.07,
      threeDomains: 0.12,
      fourDomains: 0.16,
      fiveOrMoreDomains: 0.20,
      crossTierBonus: 0.05
    },
    temporal: {
      milestoneDepth3: 0.03,
      milestoneDepth5: 0.05,
      uncorroboratedStale14d: -0.03,
      uncorroboratedStale30d: -0.05
    },
    bounds: {
      minScore: 0.02,
      maxScore: 1.00
    }
  };
  return weightsConfig;
}

export function extractDomainFromUrl(urlStr, sourceTitle = '') {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'news.google.com') {
      const lower = (sourceTitle || '').toLowerCase();
      if (lower.includes('ap news') || lower.includes('associated press')) return 'apnews.com';
      if (lower.includes('reuters')) return 'reuters.com';
    }
    return host;
  } catch {
    return 'unknown';
  }
}

/**
 * Calculates deterministic confidence score for an incident based on Granular Open Weights v2.0
 * Evaluates across 4 orthogonal dimensions:
 * 1. Primary Authority Base Weight
 * 2. Evidence Specificity & Data Quality Bonus
 * 3. Corroboration & Multi-Source Domain Curve
 * 4. Temporal Milestone Depth & Uncorroborated Staleness Decay
 *
 * @param {Object} incident - parsed incident object with data or direct frontmatter and milestones array
 * @returns {Object} score breakdown
 */
export function calculateConfidenceScore(incident) {
  const config = loadWeightsConfig();
  const data = incident.data || incident;
  const status = (data.status || 'EMERGING').toUpperCase();

  if (status === 'REFUTED') {
    return {
      score: 0.0,
      confidencePercent: 0,
      baseWeight: 0.0,
      evidenceBonus: 0.0,
      corroborationBonus: 0.0,
      temporalFactor: 0.0,
      uniqueSourcesCount: 0,
      topTier: 'REFUTED',
      badgeClass: 'refuted',
      tierLabel: 'Refuted (0%)'
    };
  }

  const milestones = incident.milestones || [];
  let maxBaseWeight = config.tiers['UNVERIFIED CLAIM']?.baseWeight || 0.06;
  let topTier = 'UNVERIFIED CLAIM';

  const uniqueDomains = new Set();
  let hasRegulator = false;
  let hasTarget = false;
  let hasResearcher = false;
  let hasClaim = false;

  for (const m of milestones) {
    const rawTier = (m.verification || '').replace(/^[🟢🟡🔵⚪🔴\s]+/, '').trim().toUpperCase();
    const tierConfig = config.tiers[rawTier];
    if (tierConfig && tierConfig.baseWeight > maxBaseWeight) {
      maxBaseWeight = tierConfig.baseWeight;
      topTier = rawTier;
    }

    if (rawTier.includes('REGULATOR') || rawTier.includes('8-K')) hasRegulator = true;
    if (rawTier.includes('TARGET')) hasTarget = true;
    if (rawTier.includes('INDEPENDENT')) hasResearcher = true;
    if (rawTier.includes('CLAIM') || rawTier.includes('UNVERIFIED')) hasClaim = true;

    if (m.sourceUrl) {
      const domain = extractDomainFromUrl(m.sourceUrl, m.sourceTitle);
      if (domain && domain !== 'unknown') {
        uniqueDomains.add(domain);
      }
    }
  }

  // 1. Evidence Specificity & Data Quality Bonus
  let evidenceBonus = 0.0;
  const filings = data.regulatory_filings || [];
  if (filings.length > 0) evidenceBonus += config.evidence?.statutoryFilingBonus || 0.12;
  if (data.domain && data.domain !== 'unknown' && data.domain.includes('.')) evidenceBonus += config.evidence?.verifiedDomainBonus || 0.03;
  if (data.compromised_data && data.compromised_data.length > 0) evidenceBonus += config.evidence?.compromisedDataBonus || 0.04;
  if (data.affected_records && Number(data.affected_records) > 0) evidenceBonus += config.evidence?.affectedRecordsBonus || 0.04;

  // 2. Corroboration & Multi-Source Domain Curve
  let corroborationBonus = 0.0;
  const numDomains = uniqueDomains.size;
  if (numDomains === 2) corroborationBonus = config.corroboration?.twoDomains || 0.07;
  else if (numDomains === 3) corroborationBonus = config.corroboration?.threeDomains || 0.12;
  else if (numDomains === 4) corroborationBonus = config.corroboration?.fourDomains || 0.16;
  else if (numDomains >= 5) corroborationBonus = config.corroboration?.fiveOrMoreDomains || 0.20;

  // Cross-tier validation boost (adversary claim corroborated by target or regulator)
  if ((hasClaim || hasResearcher) && (hasTarget || hasRegulator)) {
    corroborationBonus += config.corroboration?.crossTierBonus || 0.05;
  }

  // 3. Temporal Dynamics & Milestone Depth
  let temporalFactor = 0.0;
  if (milestones.length >= 5) temporalFactor += config.temporal?.milestoneDepth5 || 0.05;
  else if (milestones.length >= 3) temporalFactor += config.temporal?.milestoneDepth3 || 0.03;

  // Stale unverified claim decay
  if (topTier === 'UNVERIFIED CLAIM' && (data.first_seen || data.last_updated)) {
    const recordDate = new Date(data.first_seen || data.last_updated).getTime();
    if (!isNaN(recordDate)) {
      const ageDays = (Date.now() - recordDate) / (1000 * 60 * 60 * 24);
      if (ageDays > 30) temporalFactor += config.temporal?.uncorroboratedStale30d || -0.05;
      else if (ageDays > 14) temporalFactor += config.temporal?.uncorroboratedStale14d || -0.03;
    }
  }

  // Composite raw score and bounding
  const minScore = config.bounds?.minScore || 0.02;
  const maxScore = config.bounds?.maxScore || 1.00;
  const rawComposite = maxBaseWeight + evidenceBonus + corroborationBonus + temporalFactor;
  const compositeScore = Math.min(maxScore, Math.max(minScore, rawComposite));
  const confidencePercent = Math.round(compositeScore * 100);

  // Badge classification for UI styling
  let badgeClass = 'emerging';
  if (confidencePercent >= 75) badgeClass = 'confirmed';
  else if (confidencePercent >= 50) badgeClass = 'developing';
  else if (confidencePercent >= 25) badgeClass = 'acknowledged';

  return {
    score: Number(compositeScore.toFixed(2)),
    confidencePercent,
    baseWeight: Number(maxBaseWeight.toFixed(2)),
    evidenceBonus: Number(evidenceBonus.toFixed(2)),
    corroborationBonus: Number(corroborationBonus.toFixed(2)),
    temporalFactor: Number(temporalFactor.toFixed(2)),
    uniqueSourcesCount: uniqueDomains.size,
    topTier,
    badgeClass,
    tierLabel: `${confidencePercent}% Confidence`
  };
}
