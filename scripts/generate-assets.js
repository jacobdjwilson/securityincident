import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, 'images');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'src', 'public', 'images');

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

// Shield contour paths (viewBox 0 0 800 950)
// Outer shield path
const SHIELD_OUTER_PATH = `M 400 30 C 500 55, 650 90, 750 115 C 755 240, 745 420, 680 570 C 610 730, 480 850, 400 920 C 320 850, 190 730, 120 570 C 55 420, 45 240, 50 115 C 150 90, 300 55, 400 30 Z`;

// Inner shield path (inset border)
const SHIELD_INNER_PATH = `M 400 65 C 490 88, 620 120, 715 142 C 720 250, 710 405, 650 545 C 585 695, 470 810, 400 875 C 330 810, 215 695, 150 545 C 90 405, 80 250, 85 142 C 180 120, 310 88, 400 65 Z`;

// Core inner shield fill
const SHIELD_CORE_PATH = `M 400 85 C 480 106, 600 135, 685 156 C 690 255, 680 395, 625 525 C 565 665, 460 770, 400 835 C 340 770, 235 665, 175 525 C 120 395, 110 255, 115 156 C 200 135, 320 106, 400 85 Z`;

function getShieldSvg({
  mode = 'dark', // 'dark' | 'light' | 'monochrome'
  width = 800,
  height = 950
}) {
  let outerBorderColor, innerBorderColor, coreFill;
  let timelineLineColor, node1, node2, node3, node4;

  if (mode === 'dark') {
    outerBorderColor = '#020617';
    innerBorderColor = '#94a3b8';
    coreFill = '#070b14';
    timelineLineColor = '#334155';
    node1 = { fill: '#fbbf24', stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', ring: '#fef08a' }; // Amber (Emerging)
    node2 = { fill: '#fb923c', stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', ring: '#ffedd5' }; // Orange (Acknowledged)
    node3 = { fill: '#f87171', stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.45)', ring: '#fee2e2' }; // Crimson (Confirmed)
    node4 = { fill: '#34d399', stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', ring: '#d1fae5' }; // Emerald (Verified)
  } else if (mode === 'light') {
    outerBorderColor = '#0f172a';
    innerBorderColor = '#475569';
    coreFill = '#ffffff';
    timelineLineColor = '#94a3b8';
    node1 = { fill: '#d97706', stroke: '#b45309', glow: 'rgba(217, 119, 6, 0.25)', ring: '#fef3c7' };
    node2 = { fill: '#ea580c', stroke: '#c2410c', glow: 'rgba(234, 88, 12, 0.25)', ring: '#ffedd5' };
    node3 = { fill: '#dc2626', stroke: '#b91c1c', glow: 'rgba(220, 38, 38, 0.25)', ring: '#fee2e2' };
    node4 = { fill: '#059669', stroke: '#047857', glow: 'rgba(5, 150, 105, 0.25)', ring: '#d1fae5' };
  } else {
    // Monochrome print (100% black and white)
    outerBorderColor = '#000000';
    innerBorderColor = '#000000';
    coreFill = '#ffffff';
    timelineLineColor = '#000000';
    node1 = { fill: '#000000', stroke: '#000000', glow: 'none', ring: '#ffffff' };
    node2 = { fill: '#000000', stroke: '#000000', glow: 'none', ring: '#ffffff' };
    node3 = { fill: '#000000', stroke: '#000000', glow: 'none', ring: '#ffffff' };
    node4 = { fill: '#000000', stroke: '#000000', glow: 'none', ring: '#ffffff' };
  }

  const nodes = [
    { y: 240, ...node1, label: 'EMERGING' },
    { y: 390, ...node2, label: 'ACKNOWLEDGED' },
    { y: 540, ...node3, label: 'CONFIRMED' },
    { y: 690, ...node4, label: 'VERIFIED' }
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 950" width="${width}" height="${height}" fill="none">
  <defs>
    <filter id="glow-${mode}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="shield-rim-${mode}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${mode === 'monochrome' ? '#000000' : (mode === 'light' ? '#64748b' : '#cbd5e1')}" />
      <stop offset="50%" stop-color="${mode === 'monochrome' ? '#000000' : (mode === 'light' ? '#334155' : '#64748b')}" />
      <stop offset="100%" stop-color="${mode === 'monochrome' ? '#000000' : (mode === 'light' ? '#0f172a' : '#1e293b')}" />
    </linearGradient>
  </defs>

  <!-- Outer Black Shield Contour -->
  <path d="${SHIELD_OUTER_PATH}" fill="${outerBorderColor}" />

  <!-- Inner Trim Contour (Silver Rim) -->
  <path d="${SHIELD_INNER_PATH}" fill="url(#shield-rim-${mode})" />

  <!-- Core Shield Interior -->
  <path d="${SHIELD_CORE_PATH}" fill="${coreFill}" />

  <!-- Central Chronological Timeline Line -->
  <line x1="400" y1="180" x2="400" y2="760" stroke="${timelineLineColor}" stroke-width="${mode === 'monochrome' ? '8' : '6'}" stroke-linecap="round" stroke-dasharray="${mode === 'monochrome' ? 'none' : 'none'}" />

  <!-- Telemetry Milestone Nodes (Top to Bottom) -->
  ${nodes.map(n => `
  <!-- Milestone Node at Y=${n.y} -->
  <g class="timeline-node">
    ${n.glow !== 'none' ? `<circle cx="400" cy="${n.y}" r="38" fill="${n.glow}" />` : ''}
    <circle cx="400" cy="${n.y}" r="28" fill="${coreFill}" stroke="${n.stroke}" stroke-width="${mode === 'monochrome' ? '8' : '6'}" />
    <circle cx="400" cy="${n.y}" r="16" fill="${n.fill}" />
    ${mode === 'monochrome' ? `<circle cx="400" cy="${n.y}" r="6" fill="#ffffff" />` : ''}
    <!-- Telemetry Horizontal Hash Marks -->
    <line x1="330" y1="${n.y}" x2="360" y2="${n.y}" stroke="${timelineLineColor}" stroke-width="4" stroke-linecap="round" />
    <line x1="440" y1="${n.y}" x2="470" y2="${n.y}" stroke="${timelineLineColor}" stroke-width="4" stroke-linecap="round" />
  </g>`).join('\n')}
</svg>`;
}

function getFaviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 950" width="64" height="64" fill="none">
  <path d="${SHIELD_OUTER_PATH}" fill="#020617" />
  <path d="${SHIELD_INNER_PATH}" fill="#cbd5e1" />
  <path d="${SHIELD_CORE_PATH}" fill="#0b1120" />
  <line x1="400" y1="200" x2="400" y2="750" stroke="#475569" stroke-width="24" stroke-linecap="round" />
  <circle cx="400" cy="270" r="60" fill="#f59e0b" />
  <circle cx="400" cy="430" r="60" fill="#f97316" />
  <circle cx="400" cy="590" r="60" fill="#ef4444" />
  <circle cx="400" cy="730" r="60" fill="#10b981" />
</svg>`;
}

function getHorizontalLockupSvg(mode = 'dark') {
  const isDark = mode === 'dark';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const dotColor = isDark ? '#38bdf8' : '#0284c7';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="1000" height="240" fill="none">
  <!-- Embedded Shield Symbol -->
  <g transform="translate(10, 5) scale(0.24)">
    ${getShieldSvg({ mode, width: 800, height: 950 }).replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Wordmark & Subtitle -->
  <text x="240" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="62" fill="${textColor}" letter-spacing="-1">
    securityincident<tspan fill="${dotColor}">.net</tspan>
  </text>
  <text x="245" y="160" font-family="'JetBrains Mono', Consolas, monospace" font-size="20" font-weight="600" fill="${textMuted}" letter-spacing="3">
    OBSERVABLE STATUS &bull; VERIFIABLE MILESTONES
  </text>
</svg>`;
}

// Generate all vector files
const logoDarkSvg = getShieldSvg({ mode: 'dark' });
const logoLightSvg = getShieldSvg({ mode: 'light' });
const logoMonoSvg = getShieldSvg({ mode: 'monochrome' });
const faviconSvg = getFaviconSvg();
const lockupDarkSvg = getHorizontalLockupSvg('dark');
const lockupLightSvg = getHorizontalLockupSvg('light');
const lockupMonoSvg = getHorizontalLockupSvg('monochrome');

// Write to images/
fs.writeFileSync(path.join(IMAGES_DIR, 'logo.svg'), logoDarkSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-dark.svg'), logoDarkSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-light.svg'), logoLightSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-monochrome.svg'), logoMonoSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'favicon.svg'), faviconSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-horizontal-dark.svg'), lockupDarkSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-horizontal-light.svg'), lockupLightSvg);
fs.writeFileSync(path.join(IMAGES_DIR, 'logo-horizontal-monochrome.svg'), lockupMonoSvg);

// Write to src/public/images/ for the live site
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'logo.svg'), logoDarkSvg);
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'logo-dark.svg'), logoDarkSvg);
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'logo-light.svg'), logoLightSvg);
fs.writeFileSync(path.join(PUBLIC_IMAGES_DIR, 'favicon.svg'), faviconSvg);

console.log('✅ Generated all vector SVG logo variants in images/ and src/public/images/');
