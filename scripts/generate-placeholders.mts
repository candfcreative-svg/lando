/**
 * Generates neutral, brand-free placeholder product images:
 *   public/placeholders/products/<slug>-<1|2|3>.svg
 *
 * Run:  npm run placeholders
 * Each category gets its own silhouette; each item gets its own accent color.
 * View 1 = front, 2 = angle, 3 = detail (zoomed crop).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { productSeeds, type ProductSeed } from "../data/products.ts";

const OUT = join(import.meta.dirname, "..", "public", "placeholders", "products");
mkdirSync(OUT, { recursive: true });

const INK = "#0b2a2e";
const ACCENTS = ["#f4741b", "#1d5c64", "#c23b3b", "#2f6fd1", "#e2b93b", "#6b4fbf", "#2e8b57", "#2a2a2a", "#d9d2c3", "#b5476b"];
const BGS = [
  ["#f5f2ea", "#e6e0d2"],
  ["#eef1f1", "#d9e1e2"],
  ["#f6efe7", "#eadbca"],
];

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Math.abs(h);
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ───────── Silhouettes (drawn in a 600×600 box) ───────── */

function sneaker(a: string, b: string) {
  return `
  <g transform="translate(-45 -40) scale(1.15)" stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M92 388c-6-34 4-70 30-92 20-16 44-22 62-42 22-24 32-60 64-66 26-5 44 12 58 32 14 21 36 34 62 40 52 12 96 26 124 58 22 25 22 52 14 70z" fill="${a}"/>
    <path d="M86 388h428c8 0 14 6 14 14v8c0 14-12 26-26 26H120c-20 0-36-14-36-34v-2c0-7 0-12 2-12z" fill="#f7f7f2"/>
    <path d="M86 412h440" fill="none" stroke-width="4"/>
    <path d="M150 352c56-14 132-12 196 2 50 11 98 14 146 4" fill="none" stroke="${b}" stroke-width="16"/>
    <path d="M232 214l24 30M260 202l24 30M288 196l22 30" fill="none" stroke-width="5"/>
    <path d="M110 296c26 8 46 8 64-4" fill="none" stroke-width="5"/>
  </g>`;
}

function shirt(a: string, b: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <path d="M222 120c18 22 46 32 78 32s60-10 78-32l112 48 34 104-70 26-20-46v268H166V252l-20 46-70-26 34-104z" fill="${a}"/>
    <path d="M222 120c18 22 46 32 78 32s60-10 78-32" fill="none" stroke-width="8"/>
    <rect x="240" y="250" width="120" height="70" rx="6" fill="${b}"/>
    <path d="M258 286h84" stroke="${INK}" stroke-width="5"/>
  </g>`;
}

function slab(a: string, b: string, label: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <rect x="160" y="70" width="280" height="460" rx="18" fill="#ffffff" fill-opacity="0.6"/>
    <rect x="178" y="88" width="244" height="70" rx="6" fill="#ffffff"/>
    <rect x="198" y="182" width="204" height="326" rx="10" fill="${a}"/>
    <rect x="212" y="196" width="176" height="230" rx="6" fill="${b}"/>
    <circle cx="300" cy="290" r="48" fill="${a}" stroke-width="5"/>
    <path d="M250 426c10-40 30-60 50-60s40 20 50 60" fill="${a}" stroke-width="5"/>
    <rect x="212" y="440" width="176" height="52" rx="4" fill="#f7f7f2" stroke-width="4"/>
  </g>
  <text x="300" y="132" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="26" fill="${INK}">${esc(label)}</text>
  <path d="M190 92l18 0" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`;
}

function box(a: string, b: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <path d="M140 200l170-60 160 50v250l-170 70-160-60z" fill="${a}"/>
    <path d="M140 200l160 60 170-70" fill="none"/>
    <path d="M300 260v250" fill="none"/>
    <path d="M140 200l160 60v250l-160-60z" fill="${b}"/>
    <rect x="170" y="290" width="100" height="120" rx="8" transform="skewY(20)" fill="#ffffff" fill-opacity=".85" stroke-width="5"/>
    <path d="M330 300l110-44M330 340l110-44" stroke="#ffffff" stroke-width="8" opacity=".85"/>
  </g>`;
}

function figure(a: string, b: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="300" cy="500" rx="140" ry="30" fill="${b}"/>
    <path d="M262 160a38 42 0 1 1 76 0a38 42 0 1 1-76 0z" fill="${a}"/>
    <path d="M240 216h120l26 120-30 6-14-70-8 118h-36l-8-90-8 90h-36l-8-118-14 70-30-6z" fill="${a}"/>
    <path d="M254 388l-12 102h40l18-80 18 80h40l-12-102z" fill="${a}"/>
    <path d="M270 236l30 30 30-30" fill="none" stroke="${b}" stroke-width="10"/>
    <path d="M286 152h28" stroke="${b}" stroke-width="10"/>
  </g>`;
}

function memorabilia(a: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <path d="M170 470h260l30 50H140z" fill="#ffffff" fill-opacity=".7"/>
    <circle cx="300" cy="300" r="150" fill="#fbfaf5"/>
    <path d="M196 192c40 40 40 176 0 216M404 192c-40 40-40 176 0 216" fill="none" stroke="#c23b3b" stroke-width="6" stroke-dasharray="10 8"/>
    <path d="M232 318c18-34 30-40 36-24s-12 40 4 34 22-44 36-40 0 36 14 34 20-24 34-30 4 22 18 20" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/>
  </g>`;
}

function art(a: string, b: string) {
  return `
  <g stroke="${INK}" stroke-width="6" stroke-linejoin="round">
    <rect x="110" y="90" width="380" height="430" rx="4" fill="#3b2c22"/>
    <rect x="134" y="114" width="332" height="382" fill="#fbfaf5" stroke-width="4"/>
    <circle cx="370" cy="210" r="56" fill="${a}" stroke="none"/>
    <path d="M134 420l90-120 70 80 60-50 112 110v56H134z" fill="${b}" stroke="none"/>
    <path d="M160 160l120 40" stroke="${a}" stroke-width="14" stroke-linecap="round"/>
  </g>`;
}

function silhouette(seed: ProductSeed, a: string, b: string) {
  switch (seed.category) {
    case "sneakers":
      return sneaker(a, b);
    case "clothing":
      return shirt(a, b);
    case "cards": {
      const grade = seed.attrs.grading_company ? `${seed.attrs.grading_company} ${seed.attrs.grade}` : "RAW";
      return slab(a, b, `${seed.attrs.year ?? ""} · ${grade}`);
    }
    case "collectibles":
      return box(a, b);
    case "figures":
      return figure(a, b);
    case "memorabilia":
      return memorabilia(a);
    case "art":
      return art(a, b);
  }
}

function svg(seed: ProductSeed, view: 1 | 2 | 3) {
  const h = hash(seed.slug);
  const a = ACCENTS[h % ACCENTS.length];
  const b = ACCENTS[(h >> 4) % ACCENTS.length] === a ? ACCENTS[(h + 3) % ACCENTS.length] : ACCENTS[(h >> 4) % ACCENTS.length];
  const [bg1, bg2] = BGS[(h + view) % BGS.length];

  const transform =
    view === 1
      ? "translate(0 0)"
      : view === 2
        ? "translate(30 36) scale(0.9) rotate(-9 300 300)"
        : "translate(-300 -330) scale(2)";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="1200" height="1200" role="img" aria-label="Placeholder image">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </radialGradient>
    <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${INK}" fill-opacity=".05"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <rect width="600" height="600" fill="url(#dots)"/>
  ${view !== 3 ? `<ellipse cx="300" cy="${seed.category === "sneakers" ? 476 : 540}" rx="230" ry="18" fill="${INK}" fill-opacity=".12"/>` : ""}
  <g transform="${transform}">${silhouette(seed, a, b)}</g>
  <g font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${INK}" fill-opacity=".45" letter-spacing="2">
    <text x="24" y="576">PLACEHOLDER · ${["FRONT", "ANGLE", "DETAIL"][view - 1]}</text>
    <text x="576" y="576" text-anchor="end">LANDO RIPSDAY</text>
  </g>
</svg>
`;
}

let n = 0;
for (const seed of productSeeds) {
  for (const view of [1, 2, 3] as const) {
    writeFileSync(join(OUT, `${seed.slug}-${view}.svg`), svg(seed, view));
    n++;
  }
}
console.log(`Wrote ${n} placeholder images to ${OUT}`);
