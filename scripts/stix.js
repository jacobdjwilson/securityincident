import crypto from 'crypto';

/**
 * Generate a deterministic UUIDv4-formatted string from a namespace and value
 */
function deterministicUuid(namespace, value) {
  const hash = crypto.createHash('sha256').update(`${namespace}:${value}`).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function formatIso(dateStr) {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return new Date().toISOString();
}

/**
 * Converts a list of security incident records into an authentic STIX 2.1 JSON Bundle
 * @param {Array} incidents - list of incident objects with confidence and milestones
 * @param {string} siteUrl - base website URL
 * @returns {Object} STIX 2.1 bundle object
 */
export function generateStix21Bundle(incidents, siteUrl = 'https://securityincident.net') {
  const bundleId = `bundle--${deterministicUuid('securityincident-bundle', new Date().toISOString().slice(0, 10))}`;
  const objects = [];

  // 1. Author Identity: securityincident.net
  const authorIdentityId = `identity--${deterministicUuid('identity', 'securityincident.net')}`;
  objects.push({
    type: 'identity',
    spec_version: '2.1',
    id: authorIdentityId,
    created: '2026-09-01T00:00:00.000Z',
    modified: '2026-09-29T00:00:00.000Z',
    name: 'securityincident.net',
    description: 'Neutral open-web cybersecurity incident status and verified milestone timeline intelligence platform.',
    identity_class: 'organization',
    sectors: ['technology', 'cybersecurity'],
    contact_information: 'intelligence@securityincident.net',
    external_references: [
      {
        source_name: 'securityincident.net',
        url: siteUrl
      }
    ]
  });

  for (const inc of incidents) {
    const createdTime = formatIso(inc.first_seen);
    const modifiedTime = formatIso(inc.last_updated);
    const confScore = inc.confidence ? Math.round(inc.confidence.score * 100) : 50;

    // 2. Victim Organization Identity
    const victimIdentityId = `identity--${deterministicUuid('victim', inc.id)}`;
    objects.push({
      type: 'identity',
      spec_version: '2.1',
      id: victimIdentityId,
      created: createdTime,
      modified: modifiedTime,
      created_by_ref: authorIdentityId,
      name: inc.target,
      description: `Target organization for incident ${inc.id}`,
      identity_class: 'organization',
      contact_information: inc.domain ? `domain: ${inc.domain}` : undefined,
      external_references: inc.domain ? [
        {
          source_name: 'corporate-domain',
          url: `https://${inc.domain}`
        }
      ] : []
    });

    // 3. STIX Incident Object
    const incidentId = `incident--${deterministicUuid('incident', inc.id)}`;
    const extRefs = [
      {
        source_name: 'securityincident.net-dossier',
        url: `${siteUrl}/incidents/${inc.id}.html`,
        description: `Verified Timeline & Open Weights Telemetry Dossier for ${inc.target}`
      }
    ];

    if (inc.milestones) {
      for (const m of inc.milestones) {
        if (m.sourceUrl) {
          extRefs.push({
            source_name: m.sourceTitle || 'Primary Source Evidence',
            url: m.sourceUrl,
            description: `[${m.verification}] ${m.event}`
          });
        }
      }
    }

    const stixIncident = {
      type: 'incident',
      spec_version: '2.1',
      id: incidentId,
      created: createdTime,
      modified: modifiedTime,
      created_by_ref: authorIdentityId,
      name: `[${inc.status}] ${inc.target} Security Incident`,
      description: inc.summary,
      confidence: confScore,
      labels: [
        `status:${inc.status.toLowerCase()}`,
        ...(inc.tags || []).map(t => `tag:${t.toLowerCase()}`)
      ],
      external_references: extRefs
    };
    objects.push(stixIncident);

    // 4. Targets Relationship (Incident -> Victim Identity)
    const relTargetsId = `relationship--${deterministicUuid('rel-targets', `${incidentId}-${victimIdentityId}`)}`;
    objects.push({
      type: 'relationship',
      spec_version: '2.1',
      id: relTargetsId,
      created: createdTime,
      modified: modifiedTime,
      created_by_ref: authorIdentityId,
      relationship_type: 'targets',
      source_ref: incidentId,
      target_ref: victimIdentityId
    });

    // 5. Threat Actor Object & Attribution Relationship (if known)
    if (inc.threat_actor) {
      const threatActorId = `threat-actor--${deterministicUuid('threat-actor', inc.threat_actor.toLowerCase())}`;
      objects.push({
        type: 'threat-actor',
        spec_version: '2.1',
        id: threatActorId,
        created: createdTime,
        modified: modifiedTime,
        created_by_ref: authorIdentityId,
        name: inc.threat_actor,
        threat_actor_types: ['cybercrime', 'ransomware-operator']
      });

      const relAttrId = `relationship--${deterministicUuid('rel-attributed', `${incidentId}-${threatActorId}`)}`;
      objects.push({
        type: 'relationship',
        spec_version: '2.1',
        id: relAttrId,
        created: createdTime,
        modified: modifiedTime,
        created_by_ref: authorIdentityId,
        relationship_type: 'attributed-to',
        source_ref: incidentId,
        target_ref: threatActorId
      });
    }
  }

  return {
    type: 'bundle',
    id: bundleId,
    objects
  };
}
