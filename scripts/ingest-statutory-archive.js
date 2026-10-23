/**
 * Automated Statutory Regulatory Archive Ingestion Pipeline
 * Ingests all confirmed statutory disclosures from State AG Portals (WA, CA, OR)
 * and the HHS OCR Federal Healthcare Breach Pipeline from December 18, 2023 to present.
 */

import fs from 'fs';
import path from 'path';
import {
  fetchCaliforniaOagNotices,
  fetchWashingtonAgNotices,
  fetchOregonDojNotices
} from './regulatory/state-ag.js';
import { fetchHhsOcrBreaches } from './regulatory/hhs-ocr.js';
import {
  upsertIncidentMilestone,
  findExistingIncidentFilePath,
  isValidTargetCandidate,
  loadExistingSourceUrls
} from './ingest.js';
import { reconcileIncidents } from './reconcile-enrichment.js';

const MIN_DATE = '2023-12-18'; // Effective date of SEC cyber disclosure rules & statutory benchmark

export async function ingestStatutoryArchive({
  minDate = MIN_DATE,
  waPages = 14,
  caPages = 16,
  hhsPages = 30
} = {}) {
  console.log(`🏛️ Starting Statutory Regulatory Archive Ingestion (Min Date: ${minDate})...`);
  const existingSourceUrls = loadExistingSourceUrls();
  console.log(`📑 Indexed ${existingSourceUrls.size} existing source links across incident dossiers.\n`);

  let totalNew = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  // ---------------------------------------------------------------------------
  // 1. Washington State Attorney General Archive (RCW 19.255)
  // ---------------------------------------------------------------------------
  console.log(`\n=============================================================================`);
  console.log(`🏛️ 1. Washington State Attorney General Regulatory Archive (Pages: ${waPages})`);
  console.log(`=============================================================================`);
  try {
    const waNotices = await fetchWashingtonAgNotices({ pages: waPages, minDate });
    console.log(`   Fetched ${waNotices.length} qualifying Washington AG breach notices.`);

    for (const notice of waNotices) {
      if (existingSourceUrls.has(notice.sourceUrl)) {
        totalSkipped++;
        continue;
      }

      if (!isValidTargetCandidate(notice.target)) {
        totalSkipped++;
        continue;
      }

      const existingFile = findExistingIncidentFilePath(notice.targetSlug, notice.target);
      const incidentId = existingFile
        ? path.basename(existingFile, '.md')
        : `${notice.fileDate.slice(0, 7)}-${notice.targetSlug}`;

      const res = upsertIncidentMilestone({
        incidentId,
        target: notice.target,
        domain: notice.domain,
        status: notice.status,
        verification: notice.verification,
        event: notice.sourceTitle,
        sourceTitle: notice.sourceTitle,
        sourceUrl: notice.sourceUrl,
        timeUtc: notice.timeUtc,
        dateIso: notice.fileDate,
        summary: notice.summary,
        tags: notice.tags,
        affectedRecords: notice.affectedRecords,
        regulatoryFilings: notice.regulatoryFilings
      });

      if (res.action === 'created') {
        totalNew++;
        existingSourceUrls.add(notice.sourceUrl);
      } else if (res.action === 'updated') {
        totalUpdated++;
        existingSourceUrls.add(notice.sourceUrl);
      } else {
        totalSkipped++;
      }
    }
  } catch (err) {
    console.error('❌ Washington AG archive ingestion error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // 2. California Department of Justice Regulatory Archive (SB-24)
  // ---------------------------------------------------------------------------
  console.log(`\n=============================================================================`);
  console.log(`🏛️ 2. California Department of Justice Regulatory Archive (Pages: ${caPages})`);
  console.log(`=============================================================================`);
  try {
    const caNotices = await fetchCaliforniaOagNotices({ pages: caPages, minDate });
    console.log(`   Fetched ${caNotices.length} qualifying California OAG breach notices.`);

    for (const notice of caNotices) {
      if (existingSourceUrls.has(notice.sourceUrl)) {
        totalSkipped++;
        continue;
      }

      if (!isValidTargetCandidate(notice.target)) {
        totalSkipped++;
        continue;
      }

      const existingFile = findExistingIncidentFilePath(notice.targetSlug, notice.target);
      const incidentId = existingFile
        ? path.basename(existingFile, '.md')
        : `${notice.fileDate.slice(0, 7)}-${notice.targetSlug}`;

      const res = upsertIncidentMilestone({
        incidentId,
        target: notice.target,
        domain: notice.domain,
        status: notice.status,
        verification: notice.verification,
        event: notice.sourceTitle,
        sourceTitle: notice.sourceTitle,
        sourceUrl: notice.sourceUrl,
        timeUtc: notice.timeUtc,
        dateIso: notice.fileDate,
        summary: notice.summary,
        tags: notice.tags,
        affectedRecords: notice.affectedRecords,
        regulatoryFilings: notice.regulatoryFilings
      });

      if (res.action === 'created') {
        totalNew++;
        existingSourceUrls.add(notice.sourceUrl);
      } else if (res.action === 'updated') {
        totalUpdated++;
        existingSourceUrls.add(notice.sourceUrl);
      } else {
        totalSkipped++;
      }
    }
  } catch (err) {
    console.error('❌ California OAG archive ingestion error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // 3. Oregon Department of Justice Regulatory Notices
  // ---------------------------------------------------------------------------
  console.log(`\n=============================================================================`);
  console.log(`🏛️ 3. Oregon Department of Justice Regulatory Notices`);
  console.log(`=============================================================================`);
  try {
    const orNotices = await fetchOregonDojNotices({ limit: 60 });
    console.log(`   Fetched ${orNotices.length} qualifying Oregon DOJ breach notices.`);

    for (const notice of orNotices) {
      if (notice.fileDate < minDate) continue;
      if (existingSourceUrls.has(notice.sourceUrl)) {
        totalSkipped++;
        continue;
      }

      if (!isValidTargetCandidate(notice.target)) {
        totalSkipped++;
        continue;
      }

      const existingFile = findExistingIncidentFilePath(notice.targetSlug, notice.target);
      const incidentId = existingFile
        ? path.basename(existingFile, '.md')
        : `${notice.fileDate.slice(0, 7)}-${notice.targetSlug}`;

      const res = upsertIncidentMilestone({
        incidentId,
        target: notice.target,
        domain: notice.domain,
        status: notice.status,
        verification: notice.verification,
        event: notice.sourceTitle,
        sourceTitle: notice.sourceTitle,
        sourceUrl: notice.sourceUrl,
        timeUtc: notice.timeUtc,
        dateIso: notice.fileDate,
        summary: notice.summary,
        tags: notice.tags,
        affectedRecords: notice.affectedRecords,
        regulatoryFilings: notice.regulatoryFilings
      });

      if (res.action === 'created') {
        totalNew++;
        existingSourceUrls.add(notice.sourceUrl);
      } else if (res.action === 'updated') {
        totalUpdated++;
        existingSourceUrls.add(notice.sourceUrl);
      } else {
        totalSkipped++;
      }
    }
  } catch (err) {
    console.error('❌ Oregon DOJ archive ingestion error:', err.message);
  }

  // ---------------------------------------------------------------------------
  // 4. HHS OCR Federal Healthcare Breach Pipeline (HIPAA Breach Disclosures)
  // ---------------------------------------------------------------------------
  console.log(`\n=============================================================================`);
  console.log(`🏛️ 4. HHS OCR Federal Healthcare Regulatory Pipeline (Pages: ${hhsPages})`);
  console.log(`=============================================================================`);
  try {
    const hhsBreaches = await fetchHhsOcrBreaches({ pages: hhsPages, minDate });
    console.log(`   Fetched ${hhsBreaches.length} qualifying HHS OCR healthcare breach reports.`);

    for (const breach of hhsBreaches) {
      if (existingSourceUrls.has(breach.sourceUrl)) {
        totalSkipped++;
        continue;
      }

      if (!isValidTargetCandidate(breach.target)) {
        totalSkipped++;
        continue;
      }

      const existingFile = findExistingIncidentFilePath(breach.targetSlug, breach.target);
      const incidentId = existingFile
        ? path.basename(existingFile, '.md')
        : `${breach.fileDate.slice(0, 7)}-${breach.targetSlug}`;

      const res = upsertIncidentMilestone({
        incidentId,
        target: breach.target,
        domain: breach.domain,
        status: breach.status,
        verification: breach.verification,
        industry: breach.industry,
        incidentType: breach.incidentType,
        affectedRecords: breach.affectedRecords,
        compromisedData: breach.compromisedData,
        event: breach.event,
        sourceTitle: breach.sourceTitle,
        sourceUrl: breach.sourceUrl,
        timeUtc: breach.timeUtc,
        dateIso: breach.fileDate,
        summary: breach.summary,
        tags: breach.tags,
        regulatoryFilings: breach.regulatoryFilings
      });

      if (res.action === 'created') {
        totalNew++;
        existingSourceUrls.add(breach.sourceUrl);
      } else if (res.action === 'updated') {
        totalUpdated++;
        existingSourceUrls.add(breach.sourceUrl);
      } else {
        totalSkipped++;
      }
    }
  } catch (err) {
    console.error('❌ HHS OCR archive ingestion error:', err.message);
  }

  console.log(`\n=============================================================================`);
  console.log(`✨ Statutory Archive Summary:`);
  console.log(`   - New Confirmed Incidents Created: ${totalNew}`);
  console.log(`   - Existing Incidents Corroborated:  ${totalUpdated}`);
  console.log(`   - Items Skipped / Already Present: ${totalSkipped}`);
  console.log(`=============================================================================\n`);

  // Run reconciliation to ensure forensic normalization across all dossiers
  console.log('🔄 Reconciling forensic enrichment across all dossiers...');
  await reconcileIncidents();

  return { success: true, totalNew, totalUpdated };
}

if (process.argv[1] && process.argv[1].endsWith('ingest-statutory-archive.js')) {
  ingestStatutoryArchive().catch(err => {
    console.error('Fatal statutory archive ingestion error:', err);
    process.exit(1);
  });
}
