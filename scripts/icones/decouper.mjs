/* Planche Recraft (PNG, fond blanc, N×M icônes) → un SVG mono-chemin par cellule
   dans src/icons/. La grille IA n'est ni alignée ni toujours 4×2 (4×2, 3×3, 2×4
   au 2026-09-13) : on segmente par projection d'encre — les RANGÉES sur toute la
   largeur, puis les COLONNES de chaque rangée sur sa seule bande — on recadre
   chaque cellule (trim), on vectorise (potrace) et on normalise en 32×32.
   Les cellules reçoivent les noms du manifeste dans l'ORDRE DE LECTURE (rangée
   par rangée, gauche → droite) ; leur nombre doit être celui des noms, sinon
   erreur explicite. Le diagnostic signale les cellules de taille anormale
   (fragment d'icône coupée, ou deux icônes fusionnées).
   Usage : node scripts/icones/decouper.mjs [scripts/icones/planches.json] [--seuil 200] [--trou 0.03] */
import sharp from 'sharp';
import potrace from 'potrace';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const manifeste = args.find((a) => a.endsWith('.json')) ?? 'scripts/icones/planches.json';
const option = (nom, defaut) => { const i = args.indexOf(nom); return i >= 0 ? Number(args[i + 1]) : defaut; };
const SEUIL = option('--seuil', 200); // gris < 200 = encre
/* Blanc continu (fraction de la dimension) qui sépare deux cellules : 3 % = 61 px
   sur 2048. Les rangées de la planche 2×4 ne sont espacées que de ~85 px. */
const TROU = option('--trou', 0.03);
const CIBLE = 32, MARGE = 2, OUT = 'src/icons';
mkdirSync(OUT, { recursive: true });

/* Segments d'un profil 1D : suites d'indices où l'encre dépasse `min`, séparées
   par au moins `trou` cases vides ; les segments plus courts que `minLong`
   (poussières, bavures) sont écartés. */
function segments(profil, { min = 2, trou, minLong }) {
  const out = []; let debut = -1, vide = 0;
  profil.forEach((v, i) => {
    if (v > min) { if (debut < 0) debut = i; vide = 0; }
    else if (debut >= 0 && ++vide >= trou) { out.push([debut, i - vide]); debut = -1; vide = 0; }
  });
  if (debut >= 0) out.push([debut, profil.length - 1]);
  return out.filter(([a, b]) => b - a + 1 >= minLong);
}

/* Cellules d'une planche en ordre de lecture : [{ x0, y0, x1, y1, rangee, colonne }] */
function cellules(data, W, H) {
  const encre = (x, y) => (data[y * W + x] < SEUIL ? 1 : 0);
  const rows = new Array(H).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) rows[y] += encre(x, y);
  const sy = segments(rows, { trou: Math.round(H * TROU), minLong: Math.round(H * 0.02) });
  const out = [];
  sy.forEach(([y0, y1], rangee) => {
    const cols = new Array(W).fill(0);
    for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) cols[x] += encre(x, y);
    const sx = segments(cols, { trou: Math.round(W * TROU), minLong: Math.round(W * 0.02) });
    sx.forEach(([x0, x1], colonne) => out.push({ x0, y0, x1, y1, rangee, colonne }));
  });
  return { bandes: sy, parRangee: sy.map((_, r) => out.filter((c) => c.rangee === r).length), cellules: out };
}

function vectoriser(png) {
  return new Promise((res, rej) =>
    /* optTolerance 0.8 (décision 2026-09-13, était 0.3) : moins de nœuds, −35 % de poids, invisible à 32 px */
    potrace.trace(png, { threshold: SEUIL, turdSize: 8, alphaMax: 1, optTolerance: 0.8, color: 'currentColor', background: 'transparent' },
      (err, s) => (err ? rej(err) : res(s))));
}

async function decouper({ png, noms }) {
  const { data, info } = await sharp(png).flatten({ background: '#fff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const g = cellules(data, W, H);
  console.log(`\n${png} : ${g.bandes.length} rangée(s) × [${g.parRangee.join(', ')}] colonne(s) = ${g.cellules.length} cellule(s), ${noms.length} nom(s)`);
  console.log(`  rangées (y) : ${g.bandes.map(([a, b]) => `${a}-${b}`).join('  ')}`);
  if (g.cellules.length !== noms.length) {
    throw new Error(`${png} : ${g.cellules.length} cellules détectées, ${noms.length} noms — ajuster --seuil / --trou ou la planche`);
  }
  /* Taille de référence = médiane des côtés, pour signaler les cellules anormales */
  const cotes = g.cellules.map((c) => Math.max(c.x1 - c.x0, c.y1 - c.y0)).sort((a, b) => a - b);
  const mediane = cotes[Math.floor(cotes.length / 2)];
  const suspects = [];
  for (const [k, c] of g.cellules.entries()) {
    const nom = noms[k];
    /* deux passes sharp : extract d'abord, trim ensuite (trim s'applique AVANT extract dans un même pipeline) */
    const cellule = await sharp(png).extract({ left: c.x0, top: c.y0, width: c.x1 - c.x0 + 1, height: c.y1 - c.y0 + 1 }).png().toBuffer();
    const nette = await sharp(cellule).trim({ threshold: 40 }).png().toBuffer();
    const meta = await sharp(nette).metadata();
    const w = meta.width, h = meta.height, m = Math.max(w, h);
    const svg = await vectoriser(nette);
    /* potrace écrit 3 décimales dans l'espace source (~300 px) : 1 décimale suffit
       (0,03 px avant réduction ×0,1), et les séparateurs se resserrent — ≈ −40 % de poids */
    const d = svg.match(/<path[^>]*d="([^"]+)"/)?.[1]
      ?.replace(/-?\d+(?:\.\d+)?/g, (n) => String(Math.round(Number(n) * 10) / 10))
      .replace(/,\s+/g, ',').replace(/\s+/g, ' ').trim();
    if (!d) throw new Error(`${nom} : aucun chemin vectorisé`);
    const s = (CIBLE - 2 * MARGE) / m;
    const dx = MARGE + ((m - w) * s) / 2, dy = MARGE + ((m - h) * s) / 2;
    const sortie = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CIBLE} ${CIBLE}"><path fill="currentColor" fill-rule="evenodd" transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)}) scale(${s.toFixed(4)})" d="${d}"/></svg>\n`;
    writeFileSync(join(OUT, `${nom}.svg`), sortie);
    const ratio = m / mediane;
    const alerte = ratio < 0.55 ? '  ⚠ petite (fragment d’icône coupée ?)' : ratio > 1.6 ? '  ⚠ grande (deux icônes fusionnées ?)' : '';
    if (alerte) suspects.push(nom);
    console.log(`  r${c.rangee + 1}c${c.colonne + 1} ${nom.padEnd(14)} x ${String(c.x0).padStart(4)}-${String(c.x1).padEnd(4)} ${String(w).padStart(4)}×${String(h).padEnd(4)} → ${OUT}/${nom}.svg (${sortie.length} o)${alerte}`);
  }
  return suspects;
}

let echecs = 0; const suspects = [];
for (const planche of JSON.parse(readFileSync(manifeste, 'utf8'))) {
  try { suspects.push(...(await decouper(planche))); }
  catch (e) { echecs++; console.error(`ERREUR ${e.message}`); }
}
if (suspects.length) console.log(`\nÀ vérifier à l'œil : ${suspects.join(', ')}`);
process.exit(echecs ? 1 : 0);
