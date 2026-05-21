#!/usr/bin/env node
/**
 * Renders the social-sharing OG image (1200x630 PNG).
 *
 * Source-of-truth design lives in this file as an inline SVG template — it
 * embeds the Bastion wordmark paths directly (no font dependency) so the
 * output is pixel-identical across machines.
 *
 * Re-run with: `pnpm --filter @bastion/landing build:og`
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const wordmarkSvg = readFileSync(path.join(repoRoot, 'src/assets/bastion-logo.svg'), 'utf8');

// Pull out just the <path …/> elements from the source wordmark so we can
// inline them inside our larger composition. The original SVG is 140×56.
const pathTags = [...wordmarkSvg.matchAll(/<path[\s\S]*?\/>/g)].map((m) => m[0]);
if (pathTags.length < 3) {
  throw new Error(`Expected 3 paths in source wordmark, got ${pathTags.length}`);
}

// Logo: scale 140×56 → 560×224, position top-centred-ish.
const LOGO_SCALE = 4;
const LOGO_W = 140 * LOGO_SCALE;
const LOGO_H = 56 * LOGO_SCALE;
const LOGO_X = (1200 - LOGO_W) / 2;
const LOGO_Y = 200;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="65%">
      <stop offset="0%" stop-color="#26F27B" stop-opacity="0.22"/>
      <stop offset="70%" stop-color="#26F27B" stop-opacity="0"/>
    </radialGradient>
    <style>
      .cls-0 { fill: #F1F5F9; }
      .cls-1 { fill: #26F27B; }
      .cls-2 { fill: #06090E; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="#06090E"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${LOGO_SCALE})">
    ${pathTags.join('\n    ')}
  </g>
  <g transform="translate(600, ${LOGO_Y + LOGO_H + 64})" text-anchor="middle">
    <text font-family="Inter, Helvetica, Arial, sans-serif" font-size="40" font-weight="500" fill="#F1F5F9">Security by default.</text>
  </g>
</svg>`;

const resvg = new Resvg(og, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
  background: '#06090E',
});

const png = resvg.render().asPng();
const outPath = path.join(repoRoot, 'public/og-image.png');
writeFileSync(outPath, png);

const size = (png.length / 1024).toFixed(1);
console.log(`✓ Wrote ${path.relative(process.cwd(), outPath)} (${size} KB)`);
