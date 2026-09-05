// Renders public/og.png (1200×630) from an inline SVG using the design tokens.
// Run: npm run og
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#101E2E"/><stop offset=".5" stop-color="#0B1622"/><stop offset="1" stop-color="#03070C"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="30%" r="55%">
      <stop offset="0" stop-color="#6FA8BF" stop-opacity=".28"/><stop offset="1" stop-color="#6FA8BF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g stroke="#D4A054" stroke-opacity=".55" stroke-width="2">
    <line x1="700" y1="420" x2="850" y2="300"/><line x1="850" y1="300" x2="960" y2="360"/><line x1="960" y1="360" x2="1040" y2="220"/>
  </g>
  <g stroke="#6FA8BF" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="5 6">
    <line x1="850" y1="300" x2="930" y2="470"/><line x1="1040" y1="220" x2="1110" y2="150"/>
  </g>
  <circle cx="700" cy="420" r="16" fill="#D4A054"/><circle cx="700" cy="420" r="36" fill="#D4A054" fill-opacity=".18"/>
  <circle cx="850" cy="300" r="12" fill="#D4A054"/><circle cx="960" cy="360" r="10" fill="#D4A054"/><circle cx="1040" cy="220" r="9" fill="#D4A054"/>
  <circle cx="930" cy="470" r="8" fill="#6FA8BF"/><circle cx="1110" cy="150" r="7" fill="#6FA8BF"/>
  <text x="80" y="300" font-family="Georgia, 'IBM Plex Serif', serif" font-size="72" fill="#EEF2F5" font-weight="500" letter-spacing="-1">AI for Digital</text>
  <text x="80" y="380" font-family="Georgia, 'IBM Plex Serif', serif" font-size="72" fill="#EEF2F5" font-weight="500" letter-spacing="-1">Transformation</text>
  <text x="80" y="450" font-family="Arial, 'IBM Plex Sans', sans-serif" font-size="26" fill="#9FB0BE">Associate in Science · Long Beach City College</text>
  <text x="80" y="540" font-family="Arial, 'IBM Plex Sans', sans-serif" font-size="22" fill="#D4A054" font-weight="600">Ethics-first · No code required · Six stackable courses</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(new URL('../public/og.png', import.meta.url), png);
console.log('wrote public/og.png', png.length, 'bytes');
