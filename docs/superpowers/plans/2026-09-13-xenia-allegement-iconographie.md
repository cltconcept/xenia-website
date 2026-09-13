# Allègement du texte + iconographie sur mesure — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ramener chaque page du site Xenia à sa cible de mots (spec §5) et poser une iconographie propre au site : 24 pictogrammes vectorisés (style B, trait aubergine + pétale) et 5 vignettes aquarelle, générés via Higgsfield.

**Architecture:** Les pictos sont des SVG mono-chemin dans `src/icons/`, inlinés par `Icon.astro` (glob Vite) avec un pétale CSS optionnel ; les vignettes sont des WebP à trois tailles servis par `Vignette.astro`. Les données (`src/data/*.ts`) restent la source unique et gagnent un champ `icone`. Les textes sont réécrits dans les pages selon les règles de la spec et prouvés par `scripts/compter_mots.mjs`.

**Tech Stack:** Astro 5, CSS vanilla à jetons, sharp (présent), `potrace` (npm, à ajouter), Playwright Python pour les captures, MCP Higgsfield (Recraft V4.1 vector, Nano Banana Pro).

**Spec :** `docs/superpowers/specs/2026-09-13-xenia-allegement-iconographie-design.md`.

**Règles de travail :** `pnpm dev` sur 4331 seulement par le lead (jamais deux builds concurrents : le cache Vite casse) ; aucun commit par les sous-agents ; `brief/` reste hors dépôt ; aucune couleur en dur, jetons seulement.

---

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `scripts/compter_mots.mjs` (créer) | compte les mots visibles de chaque page de `dist/` et compare aux cibles |
| `scripts/icones/decouper.mjs` (créer) | planche PNG → 8 SVG mono-chemin normalisés dans `src/icons/` |
| `scripts/icones/planches.json` (créer) | pour chaque planche : fichier PNG et les 8 noms dans l'ordre de lecture |
| `scripts/convertir_illustrations.mjs` (modifier) | mode `--vignette` : 3 tailles 320/640/960 |
| `src/icons/*.svg` (créer, 32) | le set |
| `src/components/Icon.astro` (créer) | picto inline + pétale |
| `src/components/Vignette.astro` (créer) | vignette aquarelle responsive |
| `src/data/situations.ts` (créer) | les 6 situations (sortent d'`index.astro`) avec `icone` |
| `src/data/themes.ts`, `accompagnements.ts`, `etapes.ts`, `reperes.ts` (créer) | champ `icone` ; 8 capsules |
| `src/pages/index.astro` | textes, pictos, vignettes |
| `src/pages/approche.astro`, `a-propos.astro`, `nutrition-sante.astro`, `accompagnements/*.astro`, `lieux-contact.astro` | textes, pictos, vignettes |
| `src/components/Closing.astro`, `PageHero.astro`, `Carrousel.astro`, `Etapes.astro`, `LieuxCards.astro`, `Footer.astro` | pictos et vignettes |
| `src/pages/_icones.astro` (créer puis supprimer) | planche de contrôle du set |
| `public/llms.txt` | régénéré |
| `docs/DESIGN.md`, `PROJET.md`, `PROJET.html` | documentation |

---

### Task 0 : commit des corrections P1 du 12/09 (lead)

**Files:** tout ce qui est modifié au 2026-09-13 avant ce plan.

- [ ] **Step 1** : `cd xenia && git status --short` → 12 fichiers `M` + `.impeccable/` + `docs/impeccable/` + `.gitignore` + specs/plan.
- [ ] **Step 2** : `git add -A -- . ':!docs/superpowers' ':!.superpowers'` puis `git commit -m "Corrections impeccable P1 : bandeau, CTA, contrastes, film différé, will-change"` (message complet dans le journal de PROJET.md).
- [ ] **Step 3** : `git status --short` ne montre plus que `docs/superpowers/`.

### Task 1 : script de comptage des mots

**Files:** Create `scripts/compter_mots.mjs`

- [ ] **Step 1** : écrire le script

```js
/* Compte les mots du texte visible de chaque page construite (dist/), nav et
   footer compris — même base que les mesures du 2026-09-12 — et compare aux
   cibles de la spec du 2026-09-13 (§5). Sortie non nulle si une cible est
   dépassée. Usage : node scripts/compter_mots.mjs [--json] */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CIBLES = {
  '/': 600, '/approche/': 320, '/a-propos/': 260,
  '/accompagnements/adolescents-adultes/': 280, '/accompagnements/enfants-famille/': 270,
  '/accompagnements/perinatalite-parentalite/': 280, '/nutrition-sante/': 270,
  '/lieux-contact/': 380, '/mentions-legales/': Infinity, '/404.html': Infinity,
};

function pages(dir, base = '') {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...pages(p, `${base}/${f}`));
    else if (f === 'index.html') out.push([base + '/', p]);
    else if (f === '404.html') out.push(['/404.html', p]);
  }
  return out;
}

function mots(html) {
  const sans = html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ');
  return (sans.match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) || []).length;
}

const json = process.argv.includes('--json');
let echec = false;
const lignes = [];
for (const [route, fichier] of pages('dist').sort()) {
  const n = mots(readFileSync(fichier, 'utf8'));
  const cible = CIBLES[route];
  const ok = cible === undefined || n <= cible;
  if (!ok) echec = true;
  lignes.push({ route, mots: n, cible: cible === Infinity ? null : cible ?? null, ok });
}
if (json) console.log(JSON.stringify(lignes, null, 1));
else for (const l of lignes) console.log(`${l.ok ? 'OK ' : 'DEP'} ${l.route.padEnd(44)} ${String(l.mots).padStart(4)} / ${l.cible ?? '—'}`);
process.exit(echec ? 1 : 0);
```

- [ ] **Step 2** : `pnpm build && node scripts/compter_mots.mjs` → aujourd'hui toutes les lignes sont `DEP` sauf mentions/404 (c'est le point de départ ; le script doit sortir 1).

### Task 2 : découpe des planches → SVG

**Files:** Create `scripts/icones/decouper.mjs`, `scripts/icones/planches.json` ; modify `package.json` (devDependency `potrace`).

- [ ] **Step 1** : `pnpm add -D potrace` (port JS, sans binaire).
- [ ] **Step 2** : écrire `scripts/icones/planches.json`

```json
[
  { "png": "brief/illu-src/icones/planche-1.png", "noms": ["batterie", "spirale", "pousse", "cerf-volant", "boussole", "assiette", "lune", "fauteuil"] },
  { "png": "brief/illu-src/icones/planche-2.png", "noms": ["outils", "coeur-feuille", "sablier", "porte", "bulle", "carnet", "sceau", "diplome"] },
  { "png": "brief/illu-src/icones/planche-3.png", "noms": ["epingle", "calendrier", "itineraire", "visio", "telephone", "enveloppe", "horloge", "eclaircie"] },
  { "png": "brief/illu-src/icones/planche-4.png", "noms": ["nuage", "feuille", "tasse", "cle", "plante", "main", "etoile", "plaid"] }
]
```

- [ ] **Step 3** : écrire `scripts/icones/decouper.mjs`

```js
/* Planche Recraft (PNG, 8 icônes en 4×2, fond blanc) → 8 SVG mono-chemin
   dans src/icons/. La grille IA n'est jamais alignée sur des quarts exacts :
   on segmente par projection d'encre (colonnes, puis rangées), on recadre
   chaque icône (trim), on vectorise (potrace) et on normalise en 32×32.
   Usage : node scripts/icones/decouper.mjs [scripts/icones/planches.json] [--seuil 200] */
import sharp from 'sharp';
import potrace from 'potrace';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const manifeste = args.find((a) => a.endsWith('.json')) ?? 'scripts/icones/planches.json';
const SEUIL = Number(args[args.indexOf('--seuil') + 1] || 200); // < 200 = encre
const CIBLE = 32, MARGE = 2, OUT = 'src/icons';
mkdirSync(OUT, { recursive: true });

/* Segments d'un profil 1D : suites d'indices où la somme d'encre dépasse `min`,
   séparées par au moins `trou` cases vides. */
function segments(profil, min, trou) {
  const out = []; let debut = -1, vide = 0;
  profil.forEach((v, i) => {
    if (v > min) { if (debut < 0) debut = i; vide = 0; }
    else if (debut >= 0 && ++vide >= trou) { out.push([debut, i - vide]); debut = -1; vide = 0; }
  });
  if (debut >= 0) out.push([debut, profil.length - 1]);
  return out;
}

async function decouper({ png, noms }) {
  const { data, info } = await sharp(png).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const encre = (x, y) => (data[y * W + x] < SEUIL ? 1 : 0);
  const cols = new Array(W).fill(0), rows = new Array(H).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const e = encre(x, y); cols[x] += e; rows[y] += e; }
  const trou = Math.round(W * 0.02);
  const sx = segments(cols, 2, trou), sy = segments(rows, 2, trou);
  if (sx.length !== 4 || sy.length !== 2) {
    throw new Error(`${png} : ${sx.length} colonnes × ${sy.length} rangées détectées (attendu 4 × 2) — ajuster --seuil ou la planche`);
  }
  let k = 0;
  for (const [y0, y1] of sy) for (const [x0, x1] of sx) {
    const nom = noms[k++];
    /* deux passes sharp : extract d'abord, trim ensuite (trim s'applique AVANT extract dans un même pipeline) */
    const cellule = await sharp(png).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer();
    const nette = await sharp(cellule).trim({ threshold: 40 }).png().toBuffer();
    const svg = await new Promise((res, rej) =>
      potrace.trace(nette, { threshold: SEUIL, turdSize: 8, alphaMax: 1, optTolerance: 0.3, color: 'currentColor', background: 'transparent' },
        (err, s) => (err ? rej(err) : res(s))));
    const meta = await sharp(nette).metadata();
    const w = meta.width, h = meta.height, m = Math.max(w, h);
    const s = (CIBLE - 2 * MARGE) / m;
    const dx = MARGE + ((m - w) * s) / 2, dy = MARGE + ((m - h) * s) / 2;
    const d = svg.match(/<path[^>]*d="([^"]+)"/)?.[1];
    if (!d) throw new Error(`${nom} : aucun chemin vectorisé`);
    const sortie = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CIBLE} ${CIBLE}"><path fill="currentColor" fill-rule="evenodd" transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)}) scale(${s.toFixed(4)})" d="${d}"/></svg>\n`;
    writeFileSync(join(OUT, `${nom}.svg`), sortie);
    console.log(`${nom.padEnd(14)} ${w}×${h} → ${OUT}/${nom}.svg (${sortie.length} o)`);
  }
}

for (const planche of JSON.parse(readFileSync(manifeste, 'utf8'))) await decouper(planche);
```

- [ ] **Step 4** : test à blanc sans planche réelle : créer une planche synthétique avec sharp (8 cercles noirs sur blanc 2048²) dans le scratchpad, la déclarer dans un manifeste temporaire, lancer le script → 8 SVG, chacun un cercle centré. Supprimer les SVG de test.

### Task 3 : génération des 4 planches (lead, MCP Higgsfield)

- [ ] **Step 1** : `generate_image_batch` × 4, modèle `recraft_v4_1`, `model_type: "vector"`, `aspect_ratio: "1:1"`, `resolution: "2k"`, `colors: ["#43324B"]`, `background_color: "#FFFFFF"`. Prompt commun : « Icon sheet: 8 minimal line icons arranged in a 4 by 2 grid on a plain white background, generous even spacing, each icon centered in an invisible square cell. Style: thin rounded strokes of identical weight, soft rounded corners, outline only, no fill, single dark plum color, no shadows, no text, no labels, no frame, no numbers, no decorative background. Icons, left to right — top row: … ; bottom row: … » avec les 8 motifs de `planches.json`.
- [ ] **Step 2** : `jobs_wait` puis `show_generation_by_ids` ; télécharger chaque PNG (`curl -L -o brief/illu-src/icones/planche-N.png`).
- [ ] **Step 3** : regarder chaque planche (Read) : 8 motifs, 4×2, lisibles ; relancer au plus une fois une planche ratée ; un motif isolé raté se regénère seul (planche 1×1, même prompt) et remplace la cellule.

### Task 4 : vectoriser et contrôler le set

**Files:** Create `src/icons/*.svg`, `src/pages/_icones.astro`.

- [ ] **Step 1** : `node scripts/icones/decouper.mjs` → 32 SVG.
- [ ] **Step 2** : page de contrôle `src/pages/_icones.astro`

```astro
---
import Base from '../layouts/Base.astro';
import Icon from '../components/Icon.astro';
const icones = Object.keys(import.meta.glob('../icons/*.svg')).map((p) => p.split('/').pop()!.replace('.svg', ''));
---
<Base title="Set d'icônes (contrôle)" description="Page temporaire" noindex>
  <main class="container" style="padding-block: 140px 80px">
    {[18, 24, 32].map((size) => (
      <div style="display:flex;flex-wrap:wrap;gap:22px;margin-bottom:40px;align-items:center">
        {icones.map((n) => (
          <span style="display:grid;place-items:center;gap:6px;font-size:11px;color:var(--muted)">
            <Icon name={n} size={size} petale={size === 24 ? 'rose' : size === 32 ? 'sage' : 'none'} />{n}
          </span>
        ))}
      </div>
    ))}
  </main>
</Base>
```

(si `Base` n'a pas de prop `noindex`, l'omettre : la page est supprimée avant commit.)

- [ ] **Step 3** : `pnpm dev`, capture `/_icones/` à 1440, LUE : chaque motif reconnaissable à 18 px, trait régulier, aucun cache blanc (trous rendus). Corriger `--seuil` ou regénérer les motifs fautifs.
- [ ] **Step 4** : supprimer `src/pages/_icones.astro` avant le commit final (Task 11).

### Task 5 : `Icon.astro`

**Files:** Create `src/components/Icon.astro` ; modify `src/styles/global.css` (bloc « Pastille d'icône »).

- [ ] **Step 1** : composant

```astro
---
/* Pictogramme du site (set src/icons, style B) : SVG inline mono-chemin en
   currentColor, avec un pétale du logo derrière (rose ou sauge) en option.
   Décoratif par défaut (aria-hidden) ; `label` le rend porteur de sens. */
interface Props { name: string; size?: number; petale?: 'rose' | 'sage' | 'none'; label?: string; class?: string }
const { name, size = 24, petale = 'none', label, class: cls } = Astro.props;
const svgs = import.meta.glob('../icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const brut = svgs[`../icons/${name}.svg`];
if (!brut) throw new Error(`Icon : « ${name} » absent de src/icons/`);
const svg = brut
  .replace('<svg ', `<svg width="${size}" height="${size}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"'} `)
  .trim();
---
<span class:list={['icon', { [`icon--petale-${petale}`]: petale !== 'none' }, cls]} style={`--icon-size: ${size}px`} set:html={svg} />
```

- [ ] **Step 2** : CSS dans `global.css`, sous « Pastille d'icône »

```css
/* ===== Pictogrammes (set src/icons, style B : trait aubergine + pétale) ===== */
.icon { position: relative; display: inline-grid; place-items: center; width: var(--icon-size); height: var(--icon-size); color: var(--ink); flex: none; }
.icon svg { position: relative; z-index: 1; display: block; width: 100%; height: 100%; }
.icon--petale-rose::before, .icon--petale-sage::before {
  content: ''; position: absolute; z-index: 0;
  width: calc(var(--icon-size) * 0.95); height: calc(var(--icon-size) * 0.55);
  top: 8%; left: 22%; border-radius: 50%;
  mix-blend-mode: multiply; opacity: 0.55;
  transition: transform 0.35s var(--ease);
}
.icon--petale-rose::before { background: var(--petale-rose); transform: rotate(-30deg); }
.icon--petale-sage::before { background: var(--petale-sage); transform: rotate(25deg); }
.card:hover .icon--petale-rose::before { transform: rotate(-30deg) translate(2px, -2px); }
.card:hover .icon--petale-sage::before { transform: rotate(25deg) translate(2px, -2px); }
.icon-badge > .icon { color: var(--ink); }
@media (prefers-reduced-motion: reduce) { .icon::before { transition: none; } .card:hover .icon::before { transform: none; } }
```

- [ ] **Step 3** : `pnpm build` vert avec `_icones.astro` en place.

### Task 6 : vignettes aquarelle (lead, MCP) + `Vignette.astro`

**Files:** modify `scripts/convertir_illustrations.mjs` ; create `src/components/Vignette.astro`, `public/media/illu/vignettes/*.webp`.

- [ ] **Step 1** : `media_import_url` sur `https://xenia.chris-ia.com/media/illu/approche.webp` et `…/nutrition.webp` → 2 `media_id` (rôle `image_references`).
- [ ] **Step 2** : `generate_image_batch` × 10 (5 sujets × 2), modèle `nano_banana_pro`, `aspect_ratio: "1:1"`, `resolution: "1k"`, medias = les 2 refs. Prompt = « Entirely hand-painted watercolor illustration on white paper, soft pastel palette (peach, pale rose, lilac, aqua, a touch of raspberry), loose wet-on-wet washes, visible paper grain, generous white margins, no photorealism, no text, no letters, no people. Subject: … » + sujet (spec §4). `jobs_wait`, `show_generation_by_ids`, téléchargement dans `brief/illu-src/vignettes/<nom>-{a,b}.png`.
- [ ] **Step 3** : choisir un candidat par sujet (Read des 10 PNG) : cohérence de palette avec les 7 existantes, objet lisible à 260 px, marges blanches. Noter le choix dans PROJET.md.
- [ ] **Step 4** : mode `--vignette` dans `scripts/convertir_illustrations.mjs`

```js
/* Vignettes (2026-09-13) : trois tailles pour srcset, dossier vignettes/ */
if (process.argv.includes('--vignette')) {
  const outV = 'public/media/illu/vignettes'; mkdirSync(outV, { recursive: true });
  for (const [w, q] of [[320, 80], [640, 78], [960, 76]]) {
    await sharp(input).resize(w).webp({ quality: q }).toFile(path.join(outV, `${base}-${w}.webp`));
  }
  console.log(`${base} → vignettes (320 + 640 + 960)`);
}
```

(adapter aux variables du script existant : `input`, `base`, `path`, `mkdirSync` importé de `node:fs`.) Contrôle : chaque `-640.webp` ≤ 60 Ko (`ls -l`).

- [ ] **Step 5** : composant

```astro
---
/* Vignette aquarelle (objets du cabinet) : image informative, 3 tailles,
   chargée à la demande, dimensions déclarées (pas de CLS), reveal comme les grilles. */
interface Props { name: 'plaid' | 'carnet' | 'fauteuils' | 'porte' | 'fenetre'; alt: string; size?: number; class?: string; rotate?: number }
const { name, alt, size = 320, class: cls, rotate = 0 } = Astro.props;
const src = (w: number) => `/media/illu/vignettes/${name}-${w}.webp`;
---
<figure class:list={['vignette', cls]} style={`--vignette-size: ${size}px; --vignette-rot: ${rotate}deg`} data-reveal>
  <img src={src(640)} srcset={`${src(320)} 320w, ${src(640)} 640w, ${src(960)} 960w`} sizes={`(max-width: 960px) 200px, ${size}px`} width="640" height="640" alt={alt} loading="lazy" decoding="async" />
</figure>

<style>
  .vignette { margin: 0; width: min(var(--vignette-size), 100%); rotate: var(--vignette-rot); }
  .vignette img { display: block; width: 100%; height: auto; border-radius: var(--radius-organique); }
  @media (max-width: 960px) { .vignette { width: 200px; margin-inline: auto; margin-bottom: 22px; rotate: 0deg; } }
</style>
```

### Task 7 : données

**Files:** Create `src/data/situations.ts`, `src/data/reperes.ts` ; modify `src/data/themes.ts`, `accompagnements.ts`, `etapes.ts`.

- [ ] **Step 1** : `situations.ts` (les 6, sorties d'`index.astro:16-25`)

```ts
/* « Ce qui vous amène » — 6 situations dans les mots du visiteur (brief), une
   ligne chacune, un picto (spec 2026-09-13 §3.1). */
export type TeinteSit = 'rose' | 'lilac' | 'aqua' | 'peach';
export interface Situation { txt: string; href: string; tag: string; teinte: TeinteSit; icone: string }
export const SITUATIONS: Situation[] = [
  { txt: '« Je suis épuisé·e, je n’y arrive plus. »', href: '/accompagnements/adolescents-adultes/', tag: 'Burn-out', teinte: 'rose', icone: 'batterie' },
  { txt: '« Tout me stresse, même les petites choses. »', href: '/accompagnements/adolescents-adultes/', tag: 'Stress & anxiété', teinte: 'rose', icone: 'spirale' },
  { txt: '« On attend un enfant, ou être parent me dépasse. »', href: '/accompagnements/perinatalite-parentalite/', tag: 'Périnatalité & parentalité', teinte: 'lilac', icone: 'pousse' },
  { txt: '« Mon enfant ne va pas bien, je le sens. »', href: '/accompagnements/enfants-famille/', tag: 'Enfants', teinte: 'aqua', icone: 'cerf-volant' },
  { txt: '« Le TDAH complique notre quotidien. »', href: '/accompagnements/adolescents-adultes/#tdah', tag: 'TDAH', teinte: 'aqua', icone: 'boussole' },
  { txt: '« Je veux manger et dormir mieux, sans me battre. »', href: '/nutrition-sante/', tag: 'Nutrition & sommeil', teinte: 'peach', icone: 'assiette' },
];
```

- [ ] **Step 2** : `themes.ts` → 8 capsules : retirer « Transitions de vie » ; remplacer « Périnatalité » + « Parentalité » par `{ label: 'Périnatalité & parentalité', teinte: 'lilac', href: '/accompagnements/perinatalite-parentalite/' }`.
- [ ] **Step 3** : `accompagnements.ts` : ajouter `icone: string` à l'interface et `icone: 'fauteuil' | 'pousse' | 'cerf-volant' | 'assiette'` aux 4 entrées ; raccourcir chaque `desc` à ≤ 18 mots (ex. : « Stress, burn-out, insomnies, douleurs, TDAH : reprendre pied quand le quotidien déborde. »).
- [ ] **Step 4** : `etapes.ts` : ajouter `icone` (`porte`, `bulle`, `carnet`) ; `desc` ≤ 12 mots chacune.
- [ ] **Step 5** : `reperes.ts` (les 3 repères de « Qui je suis », sortis d'`index.astro:188-197`)

```ts
export interface Repere { titre: string; desc: string; icone: string; petale: 'rose' | 'sage' }
export const REPERES: Repere[] = [
  { titre: 'Intégrative', desc: 'Des outils choisis pour votre situation, pas une méthode unique.', icone: 'outils', petale: 'rose' },
  { titre: 'Corps et esprit', desc: 'Sommeil, alimentation, mouvement pèsent sur l’humeur : on s’en occupe aussi.', icone: 'coeur-feuille', petale: 'sage' },
  { titre: 'À votre rythme', desc: 'Vos besoins et vos valeurs fixent le cap, sans jugement.', icone: 'sablier', petale: 'rose' },
];
```

- [ ] **Step 6** : `pnpm build` vert (les pages consomment encore les anciens champs : rien ne casse tant que `situations` local existe ; il est retiré en Task 8).

### Task 8 : accueil — textes, pictos, vignettes

**Files:** Modify `src/pages/index.astro`.

- [ ] **Step 1** : importer `Icon`, `Vignette`, `SITUATIONS`, `REPERES` ; supprimer le tableau `situations` local et les 3 repères en dur.
- [ ] **Step 2** : hero : `.hero__copy` ramené à une phrase (≤ 22 mots, garder « sécurisant et sans jugement » en `<strong>`) ; repères `.hero__trust li` : `<Icon name="sceau" size={18} />` etc. devant le texte (`sceau`, `diplome`, `epingle`, `calendrier`), la puce dégradée `::before` retirée pour ces li.
- [ ] **Step 3** : « Ce qui vous amène » : copy d'intro ≤ 30 mots ; boucle sur `SITUATIONS` ; dans chaque carte, avant le texte : `<span class="icon-badge amene__ico" aria-hidden="true"><Icon name={s.icone} size={26} petale={s.teinte === 'aqua' ? 'sage' : 'rose'} /></span>` ; `<Vignette name="plaid" alt="Aquarelle : un plaid plié et une tasse fumante sur l'accoudoir d'un fauteuil" size={300} rotate={-2} class="amene__vignette" />` posée dans la colonne libre (CSS : `.amene__vignette { position: absolute; right: var(--gutter); top: 0; }` en desktop dans la section `position: relative` ; en flux au-dessus du titre sous 960 px).
- [ ] **Step 4** : « Qui je suis » : citation ≤ 20 mots ; `REPERES` en boucle avec `<Icon name={r.icone} size={24} petale={r.petale} />` à la place de `.puce-petale` ; `<Vignette name="carnet" … size={260} rotate={2} />` sous le portrait.
- [ ] **Step 5** : « Première séance » : copy ≤ 30 mots ; `<Vignette name="fauteuils" … size={300} />` ; (les pictos des cercles viennent d'`Etapes.astro`, Task 9).
- [ ] **Step 6** : nutrition : copy ≤ 35 mots. Carte + cabinets : copy ≤ 25 mots, `<Vignette name="porte" … size={260} rotate={-2} />` sous la carte dessinée.
- [ ] **Step 7** : `pnpm build && node scripts/compter_mots.mjs` → `/` ≤ 600 ; capture 1440 et 390, lues.

### Task 9 : composants partagés et pages intérieures

**Files:** Modify `Closing.astro`, `PageHero.astro`, `Carrousel.astro`, `Etapes.astro`, `LieuxCards.astro`, `Footer.astro`, `approche.astro`, `a-propos.astro`, `nutrition-sante.astro`, `accompagnements/*.astro` (×3), `lieux-contact.astro`.

- [ ] **Step 1** `Closing.astro` : `<Icon name="eclaircie" size={28} class="closing__ico" />` au-dessus du titre ; copy → « Si quelque chose vous pèse, c'est déjà une raison suffisante d'en parler. » ; `<Vignette name="fenetre" alt="Aquarelle : une fenêtre au matin, un rideau léger et une plante sur le rebord" size={240} class="closing__vignette" />` à droite du bloc en desktop (grid 1fr auto), au-dessus en mobile.
- [ ] **Step 2** `PageHero.astro` : prop `icone?: string` → `<Icon name={icone} size={28} petale={sage ? 'sage' : 'rose'} class="phero__ico" />` entre l'overline et le H1 ; prop `vignette?: { name; alt }` pour les pages sans image (À propos → `carnet`, Lieux → `porte`), rendue à la place du `figure.phero__media`.
- [ ] **Step 3** `Carrousel.astro` : dans chaque bouton `role="tab"`, `<Icon name={a.icone} size={20} />` devant le libellé (`gap: 8px`).
- [ ] **Step 4** `Etapes.astro` : `<span class="etapes__num"><Icon name={e.icone} size={22} /><span class="sr-only">Étape {i + 1}</span></span>` (retirer `aria-hidden` du span, garder le style du cercle).
- [ ] **Step 5** `LieuxCards.astro` : `<Icon name="epingle" size={18} />` devant `.lieux__ville` (flex), `<Icon name="horloge" size={16} />` devant la liste des horaires, `<Icon name="itineraire" size={16} />` dans le lien Itinéraire (avant le texte). `Footer.astro` : `<Icon name="telephone" size={16} label="Téléphone" />` et `<Icon name="enveloppe" size={16} label="E-mail" />` devant les deux liens de contact.
- [ ] **Step 6** `approche.astro` : les 3 `icon-badge` reçoivent `outils`, `coeur-feuille`, `sablier` (pétale rose/sage/rose) à la place de `<Logo>` ; chaque pilier ≤ 35 mots ; section « Pour qui » ≤ 40 mots ; `<Vignette name="fauteuils" …>` à côté des étapes ; cible ≤ 320 mots.
- [ ] **Step 7** `a-propos.astro` : PageHero avec `icone="carnet"` et `vignette={{ name: 'carnet', alt: '…' }}` ; texte de présentation ≤ 150 mots (4 paragraphes → 3 de 2 phrases) ; repères officiels : pictos `diplome`, `sceau`, `epingle` (pétales rose/sage/rose) ; cible ≤ 260.
- [ ] **Step 8** `accompagnements/*.astro` : `icone` du PageHero (`fauteuil`, `pousse`, `cerf-volant`) ; chaque section ≤ 40 mots, listes de domaines à une ligne par item ; cibles 280/270/280. `nutrition-sante.astro` : `icone="assiette"`, cible ≤ 270.
- [ ] **Step 9** `lieux-contact.astro` : copy du hero ≤ 20 mots ; FAQ → les 4 questions de la spec §5, réponses ≤ 30 mots, `faqLd` (lignes ~30-56) réduit aux 4 mêmes ; carte visio avec `<Icon name="visio" size={24} petale="sage" />` ; « Me contacter » avec `telephone`/`enveloppe` ; cible ≤ 380.
- [ ] **Step 10** : `pnpm build && node scripts/compter_mots.mjs` → toutes les lignes `OK`.

### Task 10 : vérification (lead)

- [ ] **Step 1** : `node scripts/compter_mots.mjs` → 0 `DEP` (tableau dans le rapport).
- [ ] **Step 2** : captures 1440 + 390 des 9 pages via `docs/impeccable/2026-09-12/scripts/pw.py`, lues ; console vide ; `scrollWidth` = viewport à 390.
- [ ] **Step 3** : poids : `ls -l public/media/illu/vignettes/*-640.webp` ≤ 60 Ko ; `du -k src/icons` ; taille de `dist/index.html`.
- [ ] **Step 4** : contrastes au pixel (`contrast.py`) sur `.amene__card p`, `.reperes__item`, `.etapes__txt p`, `.closing .copy` ; reduced-motion : capture `--rm` de l'accueil (vignettes visibles, rien qui bouge).
- [ ] **Step 5** : détecteur impeccable sur `dist` et sur `/`, `/lieux-contact/` (preview) : aucun constat nouveau hors kicker/eyebrow.
- [ ] **Step 6** : régénérer `public/llms.txt` (reprendre la structure existante, textes courts) ; audit SEO/GEO `/noveo-checkquality` sur le preview.

### Task 11 : documentation, commit 2, déploiement (lead)

- [ ] **Step 1** : supprimer `src/pages/_icones.astro` ; `docs/DESIGN.md` : section « Iconographie » (style B, set, vignettes, règles) ; `PROJET.md` + `PROJET.html` : journal, architecture (`src/icons/`, composants), roadmap ; mémoire.
- [ ] **Step 2** : `git add -A && git commit -m "Allègement du texte (−30/40 %) + iconographie sur mesure : 32 pictos, 5 vignettes aquarelle"`.
- [ ] **Step 3** : `git push origin HEAD` ; `GET http://46.224.83.139:8000/api/v1/deploy?uuid=seetu6uqg4tnkjg8do4f1f8n` (jeton dans `~/.claude.json`) ; vérifier en ligne : 9 pages 200, une vignette et un SVG servis, console vide, capture de l'accueil.
