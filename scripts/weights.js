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
    tiers: {
      'CONFIRMED BY REGULATOR': { baseWeight: 1.00 },
      'CONFIRMED BY TARGET': { baseWeight: 0.90 },
      'INDEPENDENT VERIFICATION': { baseWeight: 0.65 },
      'ACKNOWLEDGED': { baseWeight: 0.45 },
      'UNVERIFIED CLAIM': { baseWeight: 0.20 },
      'REFUTED': { baseWeight: 0.00 }
    },
    corroboration: {
      bonusPerAdditionalSource: 0.05,
      maxBonus: 0.15
    }
  };
  return weightsConfig;
}

export function extractDomainFromUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return 'unknown';
  }
}

/**
 * Calculates deterministic confidence score for an incident based on Open Weights correlation
 * @param {Object} incident - parsed incident object with data (frontmatter) and milestones array
 * @returns {Object} score breakdown
 */
export function calculateConfidenceScore(incident) {
  const config = loadWeightsConfig();
  const status = (incident.data?.status || 'EMERGING').toUpperCase();

  if (status === 'REFUTED') {
    return {
      score: 0.0,
      confidencePercent: 0,
      baseWeight: 0.0,
      corroborationBonus: 0.0,
      uniqueSourcesCount: 0,
      topTier: 'REFUTED',
      badgeClass: 'refuted',
      tierLabel: 'Refuted (0%)'
    };
  }

  const milestones = incident.milestones || [];
  let maxBaseWeight = 0.20; // default for emerging
  let topTier = 'UNVERIFIED CLAIM';

  const uniqueDomains = new Set();

  for (const m of milestones) {
    const rawTier = (m.verification || '').replace(/^[🟢🟡🔵⚪🔴\s]+/, '').trim().toUpperCase();
    const tierConfig = config.tiers[rawTier];
    if (tierConfig && tierConfig.baseWeight > maxBaseWeight) {
      maxBaseWeight = tierConfig.baseWeight;
      topTier = rawTier;
    }

    if (m.sourceUrl) {
      const domain = extractDomainFromUrl(m.sourceUrl);
      if (domain && domain !== 'unknown') {
        uniqueDomains.add(domain);
      }
    }
  }

  // Corroboration bonus for multiple independent source domains
  let corroborationBonus = 0.0;
  if (uniqueDomains.size > 1) {
    const additionalSources = uniqueDomains.size - 1;
    corroborationBonus = Math.min(
      config.corroboration.maxBonus,
      additionalSources * config.corroboration.bonusPerAdditionalSource
    );
  }

  // Final composite score (capped at 1.00)
  const compositeScore = Math.min(1.00, Math.max(0.0, maxBaseWeight + corroborationBonus));
  const confidencePercent = Math.round(compositeScore * 100);

  let badgeClass = 'emerging';
  if (confidencePercent >= 90) badgeClass = 'confirmed';
  else if (confidencePercent >= 60) badgeClass = 'developing';
  else if (confidencePercent >= 40) badgeClass = 'acknowledged';

  return {
    score: Number(compositeScore.toFixed(2)),
    confidencePercent,
    baseWeight: Number(maxBaseWeight.toFixed(2)),
    corroborationBonus: Number(corroborationBonus.toFixed(2)),
    uniqueSourcesCount: uniqueDomains.size,
    topTier,
    badgeClass,
    tierLabel: `${confidencePercent}% Confidence`
  };
}
