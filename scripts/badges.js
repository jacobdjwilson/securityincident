/**
 * Generates an SVG status badge for an incident
 * @param {Object} incident
 * @returns {string} SVG xml content
 */
export function generateIncidentBadgeSvg(incident) {
  const status = (incident.status || 'EMERGING').toUpperCase();
  const conf = incident.confidence || { confidencePercent: 50 };
  const percent = conf.confidencePercent;

  let rightBgColor = '#ef4444'; // Red for EMERGING
  if (status === 'CONFIRMED') rightBgColor = '#059669'; // Emerald
  else if (status === 'ACKNOWLEDGED') rightBgColor = '#d97706'; // Amber
  else if (status === 'DEVELOPING') rightBgColor = '#ea580c'; // Orange
  else if (status === 'REFUTED') rightBgColor = '#64748b'; // Slate gray

  const leftText = 'securityincident.net';
  const rightText = `${status} ${percent}%`;

  const leftWidth = 126;
  const rightWidth = rightText.length * 8 + 20;
  const totalWidth = leftWidth + rightWidth;

  const leftTextX = Math.round(leftWidth / 2 * 10);
  const rightTextX = Math.round((leftWidth + rightWidth / 2) * 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" role="img" aria-label="${leftText}: ${rightText}">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="a">
    <rect width="${totalWidth}" height="22" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#a)">
    <rect width="${leftWidth}" height="22" fill="#0f172a"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="22" fill="${rightBgColor}"/>
    <rect width="${totalWidth}" height="22" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="${leftTextX}" y="150" transform="scale(.1)" fill="#94a3b8" textLength="${(leftWidth - 14) * 10}">${leftText}</text>
    <text x="${rightTextX}" y="150" transform="scale(.1)" font-weight="700" fill="#ffffff" textLength="${(rightWidth - 14) * 10}">${rightText}</text>
  </g>
</svg>
`;
}
