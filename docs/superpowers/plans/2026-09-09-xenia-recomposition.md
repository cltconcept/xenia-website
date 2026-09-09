# Xenia — recomposition du site : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Appliquer la spec `docs/superpowers/specs/2026-09-08-xenia-recomposition-site-design.md` (validée le 2026-09-08) : hero en deux colonnes avec médaillon aquarelle et scrim, traversée resserrée, bandes à vagues remplacées par des blobs dégradés, section « Qui je suis », rencontre nutrition en verre, cartes teintées, mêmes composants sur les 8 pages intérieures + 404, film régénéré, hauteurs réduites.

**Architecture:** Astro 5 statique, CSS vanilla à jetons (`src/styles/global.css`), GSAP + ScrollTrigger en import différé (`src/lib/motion.ts`). Deux composants neufs (`Blob.astro`, `Portrait.astro`), trois composants retouchés (`PageHero`, `Domaines`, `LieuxCards`), la vague unique déménage dans `Footer.astro`, l'accueil est recomposé, chaque page intérieure reçoit le même système. Les textes ne bougent pas (sauf les micro-ajouts §11 de la spec).

**Tech Stack:** Astro ^5.12, GSAP 3, sharp (WebP), Kie.ai `nano-banana-pro` (aquarelle du hero), Higgsfield Seedance 2.5 (film), ffmpeg 9 (encodage all-intra), gstack `browse` (QA).

**Règles de ce chantier (non négociables) :**
- **Aucun commit, aucun push, aucun redéploiement** : phase de réglage visuel en localhost (port 4331), l'utilisateur valide à l'écran d'abord (règle du 2026-09-08, mémoire `iterer-en-localhost`). Les tâches se terminent par `pnpm build` vert, jamais par un commit.
- Dossier du site : `C:/Dev/Noveo/_autres/website/xenia`. Toutes les commandes s'y exécutent (`cd` en tête).
- Aucune couleur en dur hors du bloc de jetons de `global.css` : nouvelle surface = nouveau jeton.
- `brief/` est gitignoré et hors image Docker : les PNG sources et le master du film y vivent, jamais dans `public/` ni dans un commit.
- Un serveur de dev tourne peut-être déjà sur 4331 (lancé par la session principale) : ne pas en relancer un ; vérifier par `curl -s -o /dev/null -w "%{http_code}" http://localhost:4331/`.
- Deux agents peuvent builder en même temps : builder vers un dossier de sortie propre à la tâche (`pnpm astro build --outDir <scratchpad>/dist-<tache>`), jamais deux `pnpm build` concurrents sur `dist/`.

---

## Structure des fichiers

| Fichier | Responsabilité après ce plan |
|---|---|
| `src/styles/global.css` | Jetons (rythme resserré, teintes, scrim, `--muted-hero`), `.section--blob`, cartes teintées `.card--rose/lilac/aqua/peach/lilac-soft`, `.puce-petale`, `text-wrap: pretty` global, `.section--soft` retiré |
| `src/components/Blob.astro` | **Neuf.** Forme organique dégradée (5 variantes, 7 teintes), masque SVG en data-URI, dérive CSS, reduced-motion |
| `src/components/Portrait.astro` | **Neuf.** Cadre blob 4/5 du portrait (placeholder sans `src`, image avec `src`), réutilisé par l'accueil et À propos |
| `src/components/PageHero.astro` | Padding réduit, médaillon fondu sur dégradé (multiply + anneau de verre), Blob derrière, aurore sous le blob |
| `src/components/Footer.astro` | Porte **l'unique vague** du site avant le pied de page |
| `src/components/Domaines.astro` | Prop `teinte`, cartes teintées + `card--spot`, puce-pétale |
| `src/components/LieuxCards.astro` | Cartes teintées (plus de bande 12 px), lien « Itinéraire » Google Maps |
| `src/pages/index.astro` | Hero deux colonnes + scrim + médaillon, traversée resserrée, sections à blobs, « Qui je suis », rencontre nutrition, tagline déplacée |
| `src/pages/approche.astro`, `a-propos.astro`, `nutrition-sante.astro`, `lieux-contact.astro`, `mentions-legales.astro`, `accompagnements/*.astro` | Fin des `.soft-wrap`/`<Wave>`, blobs, cartes teintées, verre sur blob, micro-ajouts §8.2 |
| `scripts/illustration_hero.sh` | **Neuf.** 3 candidats Kie `nano-banana-pro` → `brief/illu-src/hero-cabinet-{1,2,3}.png` |
| `scripts/convertir_hero.mjs` | **Neuf.** `brief/illu-src/hero-cabinet.png` → `public/media/illu/hero-cabinet-{640,1040,1600}.webp` (4/5) |
| `public/media/hero-film.mp4`, `hero-film-poster.webp` | Film régénéré (all-intra 1280×720@20) + poster à 30 % |
| `PROJET.md`, `PROJET.html`, spec | Journal daté « non committé », roadmap |

Ordre d'exécution : Tâche 0 (mesures de référence, session principale) → Tâches 1-3 (socle, un agent) → Tâches M1-M2 (médias, session principale, **en parallèle** du socle) → Tâche 4 (hero) → Tâche 5 (sections accueil) → Tâches 6-7 (composants Domaines/LieuxCards + pages, deux agents en parallèle sur des fichiers disjoints) → Tâche 8 (QA) → Tâche 9 (doc).

---

### Tâche 0 : Mesures de référence AVANT toute modification (session principale)

**Files:** aucun fichier du dépôt ; sortie dans le scratchpad.

- [ ] **Step 1 : Lancer le serveur de dev en arrière-plan et vérifier qu'il répond**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm dev
```
(`run_in_background: true`), puis :
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4331/
```
Expected : `200`.

- [ ] **Step 2 : Mesurer la hauteur de chaque page en 1440×900 (base de la règle « −20 % »)**

`B="$HOME/.claude/skills/gstack/browse/dist/browse"`, une chaîne par page (toujours `newtab` puis `viewport` puis `goto`) :
```bash
for p in / /approche/ /accompagnements/adolescents-adultes/ /accompagnements/perinatalite-parentalite/ /accompagnements/enfants-famille/ /nutrition-sante/ /a-propos/ /lieux-contact/ /mentions-legales/ /404; do
  printf '%s ' "$p"
  echo "[[\"newtab\"],[\"viewport\",\"1440x900\"],[\"goto\",\"http://localhost:4331$p\"],[\"wait\",\"--networkidle\"],[\"js\",\"window.scrollTo({top: 1e6, behavior: 'instant'}); new Promise(r => setTimeout(r, 1200))\"],[\"js\",\"document.documentElement.scrollHeight\"]]" | "$B" chain | tail -1
done | tee "$SCRATCH/hauteurs-avant.txt"
```
Expected : dix lignes `<page> <hauteur>` (l'accueil ≈ 9 014). Ce fichier sert à la Tâche 8.

---

### Tâche 1 : Jetons et classes communes dans `global.css`

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1 : Remplacer le bloc de jetons de rythme et ajouter les jetons neufs (lignes 8-49)**

Dans `:root`, remplacer les deux lignes
```css
  --headline-gap: clamp(40px, 6vw, 68px);
  --section-pad: clamp(84px, 11vw, 150px);
```
par
```css
  --headline-gap: clamp(32px, 4.5vw, 52px);
  --section-pad: clamp(64px, 8vw, 104px);
```
et, juste après la ligne `--muted: #7A6B82;`, ajouter :
```css
  --muted-hero: #6E5F76; /* copy du hero sur scrim : ≥ 4,5:1 sur ivoire */
```
et, juste après la ligne `--sep: rgba(67, 50, 75, 0.10);`, ajouter :
```css
  /* Teintes de cartes (35 % de l'aurore, fondues vers le blanc) */
  --tint-rose: rgba(246, 200, 219, 0.35);
  --tint-lilac: rgba(223, 210, 244, 0.35);
  --tint-aqua: rgba(201, 233, 222, 0.35);
  --tint-peach: rgba(255, 217, 196, 0.35);
  --tint-lilac-soft: rgba(223, 210, 244, 0.2);
  /* Scrim du hero : garantit la lisibilité du texte quoi que montre le film */
  --scrim-hero: linear-gradient(90deg, rgba(253, 251, 248, 0.92) 0 55%, rgba(253, 251, 248, 0.55) 78%, transparent);
  --scrim-hero-mobile: linear-gradient(180deg, transparent 0 28%, rgba(253, 251, 248, 0.9) 52%);
```

- [ ] **Step 2 : Rythme du copy et fin des bandes ivoire**

Remplacer `margin-top: 22px;` par `margin-top: 18px;` dans `.copy`. Supprimer la ligne `.section--soft { background: var(--ivory-soft); }`.

- [ ] **Step 3 : Ajouter les classes communes après le bloc `/* ===== Cartes ===== */` (après `.card--glass { … }`)**

```css
/* Cartes teintées par thème : dégradé haut → blanc à 70 % (spec §5.2, §8.1) */
.card--rose { background: linear-gradient(160deg, var(--tint-rose) 0%, #fff 70%); }
.card--lilac { background: linear-gradient(160deg, var(--tint-lilac) 0%, #fff 70%); }
.card--aqua { background: linear-gradient(160deg, var(--tint-aqua) 0%, #fff 70%); }
.card--peach { background: linear-gradient(160deg, var(--tint-peach) 0%, #fff 70%); }
.card--lilac-soft { background: linear-gradient(160deg, var(--tint-lilac-soft) 0%, #fff 70%); }
.card p, .card h2, .card h3, .card dt, .card dd { text-wrap: pretty; }

/* Puce-pétale : l'ellipse du logo devant un titre (le titre est en flex) */
.puce-petale { display: flex; align-items: flex-start; gap: 12px; }
.puce-petale::before {
  content: ''; flex: none; width: 16px; height: 9px; margin-top: 0.5em;
  border-radius: 50%; rotate: -32deg;
  background: linear-gradient(135deg, #E8799F, var(--lilac));
}

/* ===== Section à blob : fond ivoire + forme dégradée derrière le contenu =====
   position relative + isolation : le Blob (z-index -1) passe sous le contenu
   mais au-dessus du fond ; overflow clip : le blob déborde du conteneur sans
   jamais élargir la page. */
.section--blob { position: relative; isolation: isolate; overflow: clip; }
.section--blob > .halo { z-index: -1; }
```

- [ ] **Step 4 : Vérifier que le build passe encore**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -5
```
Expected : `10 page(s) built` sans erreur.

---

### Tâche 2 : Composants `Blob.astro` et `Portrait.astro`

**Files:**
- Create: `src/components/Blob.astro`
- Create: `src/components/Portrait.astro`

- [ ] **Step 1 : Écrire `src/components/Blob.astro`**

```astro
---
/* Forme organique dégradée, posée en absolu derrière le contenu d'une section
   `.section--blob` (position relative + isolation, cf. global.css). Le parent
   la positionne (`position` = déclarations top/left/right/bottom) et la
   dimensionne (`largeur`, plafonnée à 92vw en CSS pour le mobile).
   Masque SVG en data-URI (déterministe, zéro id de gradient à dédoublonner),
   dégradé en CSS, dérive lente en transform, coupée en reduced-motion.
   Décorative : aria-hidden, pointer-events none. */
const TEINTES = {
  'lilac-aqua': 'linear-gradient(135deg, var(--lilac), var(--aqua))',
  'peach-rose': 'linear-gradient(135deg, var(--peach), var(--rose))',
  'rose-lilac': 'linear-gradient(135deg, var(--rose), var(--lilac))',
  'aqua-peach': 'linear-gradient(135deg, var(--aqua), var(--peach))',
  'peach-lilac': 'linear-gradient(135deg, var(--peach), var(--lilac))',
  'aqua-lilac': 'linear-gradient(135deg, var(--aqua), var(--lilac))',
  'lilac-rose': 'linear-gradient(135deg, var(--lilac), var(--rose))',
} as const;
/* Cinq formes fermées, viewBox 0 0 200 200, dessinées à la main (build reproductible) */
const FORMES = {
  1: 'M104 12c38-6 74 18 84 52 10 36-8 70-34 96-28 28-72 34-106 14C14 154 2 112 14 76 26 40 62 18 104 12z',
  2: 'M92 8c44-10 92 14 100 56 8 38-14 62-30 92-18 34-58 46-96 32C26 174 4 132 10 90 16 46 50 18 92 8z',
  3: 'M110 18c34 4 70 26 78 62 8 34-16 60-40 84-26 26-64 40-98 22C14 168 0 120 12 80 24 42 72 14 110 18z',
  4: 'M86 14c40-14 88 6 102 44 12 36 2 74-24 100-26 28-66 40-104 24C20 166 2 122 12 80 20 44 50 26 86 14z',
  5: 'M98 10c42 2 84 22 92 60 8 36-10 66-36 92-26 26-62 38-96 22C18 166-2 122 8 82 18 40 58 8 98 10z',
} as const;
interface Props {
  variante?: keyof typeof FORMES;
  teinte?: keyof typeof TEINTES;
  largeur?: string;   // ex. '52vw'
  position?: string;  // ex. 'top: -8%; left: -14vw;'
  opacite?: number;   // 0,5-0,7 (spec §4)
  inverse?: boolean;  // dérive en sens contraire : alterner d'une section à l'autre
  class?: string;
}
const {
  variante = 1, teinte = 'lilac-aqua', largeur = '48vw', position = '',
  opacite = 0.6, inverse = false, class: cls,
} = Astro.props;
const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><path d='${FORMES[variante]}'/></svg>`;
const forme = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
---
<div
  class:list={['blob', { 'blob--inverse': inverse }, cls]}
  aria-hidden="true"
  style={`--blob-forme: ${forme}; --blob-grad: ${TEINTES[teinte]}; --blob-largeur: ${largeur}; --blob-opacite: ${opacite}; ${position}`}
></div>

<style>
  .blob {
    position: absolute; z-index: -1;
    width: min(var(--blob-largeur), 92vw); aspect-ratio: 1;
    pointer-events: none;
    background: var(--blob-grad);
    -webkit-mask: var(--blob-forme) center / 100% 100% no-repeat;
    mask: var(--blob-forme) center / 100% 100% no-repeat;
    opacity: var(--blob-opacite);
    will-change: transform;
    animation: blob-derive 30s ease-in-out infinite alternate;
  }
  .blob--inverse { animation-direction: alternate-reverse; animation-duration: 26s; }
  @keyframes blob-derive {
    from { transform: translate(0, 0) rotate(0deg); }
    to { transform: translate(26px, -20px) rotate(3deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .blob { animation: none; }
  }
</style>
```

- [ ] **Step 2 : Écrire `src/components/Portrait.astro`**

```astro
---
/* Le portrait de la cliente : cadre blob 4/5 réutilisé par l'accueil (« Qui je
   suis ») et par À propos — UNE seule source. Sans `src` : placeholder aurore
   + logo, le SEUL « à venir » du site. Quand la photo arrive : passer `src`. */
import Logo from './Logo.astro';
interface Props { src?: string; alt?: string; legende?: string; class?: string }
const { src, alt = 'Portrait de Xénia Van Outryve', legende, class: cls } = Astro.props;
---
<figure class:list={['portrait', cls]}>
  <div class="portrait__cadre">
    {src ? (
      <img src={src} alt={alt} width="800" height="1000" loading="lazy" />
    ) : (
      <div class="portrait__ph" role="img" aria-label="Portrait de Xénia Van Outryve, à venir">
        <Logo size={72} />
        <p>Portrait<br />à venir</p>
      </div>
    )}
  </div>
  {legende && <figcaption>{legende}</figcaption>}
</figure>

<style>
  .portrait { margin: 0; }
  /* Cadre organique « pas trop carré » + anneau de verre */
  .portrait__cadre {
    position: relative; aspect-ratio: 4 / 5; overflow: hidden;
    border-radius: 58% 42% 55% 45% / 48% 55% 45% 52%;
    box-shadow: 0 24px 64px rgba(67, 50, 75, 0.16);
    outline: 1px solid rgba(255, 255, 255, 0.75); outline-offset: -1px;
  }
  .portrait__cadre img { width: 100%; height: 100%; object-fit: cover; }
  .portrait__ph {
    height: 100%;
    background:
      radial-gradient(circle at 30% 25%, rgba(255, 217, 196, 0.9), transparent 60%),
      radial-gradient(circle at 75% 30%, rgba(223, 210, 244, 0.85), transparent 62%),
      radial-gradient(circle at 55% 80%, rgba(201, 233, 222, 0.8), transparent 60%),
      var(--ivory-soft);
    display: grid; place-items: center; align-content: center; gap: 14px;
    text-align: center;
  }
  .portrait__ph p {
    font-family: var(--font-display); font-style: italic;
    color: var(--muted); font-size: 0.95rem; line-height: 1.4;
  }
  .portrait figcaption { margin-top: 16px; font-size: 0.85rem; color: var(--muted); text-align: center; }
</style>
```

- [ ] **Step 3 : Build**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3
```
Expected : `10 page(s) built` (les composants ne sont pas encore utilisés : pas d'erreur possible autre que de syntaxe).

---

### Tâche 3 : `PageHero.astro` et la vague unique dans `Footer.astro`

**Files:**
- Modify: `src/components/PageHero.astro` (fichier entier)
- Modify: `src/components/Footer.astro:1-6`

- [ ] **Step 1 : Réécrire `src/components/PageHero.astro`**

```astro
---
/* Hero des pages intérieures : aurore douce + halo respirant + un Blob derrière
   le médaillon (ou seul, à droite, pour les pages sans image).
   `image` (optionnelle) : illustration fondue sur un dégradé d'aurore
   (mix-blend multiply) dans un médaillon organique à anneau de verre. */
import Blob from './Blob.astro';
interface Props { overline: string; sage?: boolean; image?: string; imageAlt?: string }
const { overline, sage = false, image, imageAlt = '' } = Astro.props;
---
<section class="phero" data-hero>
  <div class="aurora phero__aurora" aria-hidden="true">
    <div class="aurora__blob" style={`--blob-c: ${sage ? 'rgba(201,233,222,0.85)' : 'rgba(255,217,196,0.8)'}; width: 46vw; height: 46vw; top: -18vw; left: -10vw;`}></div>
    <div class="aurora__blob aurora__blob--slow" style={`--blob-c: rgba(223,210,244,0.75); width: 40vw; height: 40vw; top: -12vw; right: -8vw;`}></div>
    <div class="halo" style={`--halo-c: ${sage ? 'rgba(201,233,222,0.7)' : 'rgba(246,200,219,0.65)'}; width: 34vw; height: 34vw; top: -6vw; right: 14vw;`}></div>
  </div>
  {image ? (
    <Blob variante={2} teinte={sage ? 'aqua-lilac' : 'peach-rose'} largeur="36vw" position="top: 6%; right: -6vw;" opacite={0.6} />
  ) : (
    <Blob variante={3} teinte={sage ? 'aqua-peach' : 'peach-lilac'} largeur="40vw" position="top: -6%; right: -10vw;" opacite={0.55} />
  )}
  <div class:list={['container', 'phero__inner', { 'phero__inner--media': !!image }]}>
    <div class="phero__txt">
      <span class:list={['overline', { 'overline--sage': sage }]}>{overline}</span>
      <h1 class="headline"><slot name="title" /></h1>
      <p class="copy"><slot name="copy" /></p>
      <slot />
    </div>
    {image && (
      <figure class:list={['phero__media', { 'phero__media--sage': sage }]} data-reveal>
        <img src={image} alt={imageAlt} width="800" height="600" loading="eager" fetchpriority="high" />
      </figure>
    )}
  </div>
</section>

<style>
  .phero {
    position: relative; isolation: isolate;
    padding-block: clamp(120px, 14vw, 168px) clamp(40px, 6vw, 70px);
    overflow: clip;
  }
  /* L'aurore passe SOUS le blob (z-index -1), le contenu au-dessus des deux */
  .phero__aurora { z-index: -2; }
  .phero__inner { position: relative; max-width: 880px; }
  /* Variante avec médaillon : deux colonnes sur desktop */
  .phero__inner--media {
    max-width: var(--container);
    display: grid; grid-template-columns: 1.25fr 0.75fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: center;
  }
  /* Médaillon fondu : dégradé d'aurore sous l'aquarelle (multiply), anneau de verre */
  .phero__media {
    margin: 0; position: relative; overflow: hidden;
    border-radius: 58% 42% 55% 45% / 48% 55% 45% 52%;
    background: linear-gradient(150deg, var(--peach), var(--lilac));
    box-shadow: 0 18px 48px rgba(67, 50, 75, 0.14);
    outline: 1px solid rgba(255, 255, 255, 0.75); outline-offset: -1px;
  }
  .phero__media--sage { background: linear-gradient(150deg, var(--aqua), var(--lilac)); }
  .phero__media img {
    width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover;
    mix-blend-mode: multiply;
  }
  @media (max-width: 960px) {
    .phero__inner--media { grid-template-columns: 1fr; }
    .phero__media { max-width: 380px; }
  }
</style>
```

- [ ] **Step 2 : Poser la vague unique dans `src/components/Footer.astro`**

Remplacer les lignes 1-6 :
```astro
---
import Logo from './Logo.astro';
import Wave from './Wave.astro';
import { IDENTITE, LIEUX, NAV } from '../data/site';
const year = new Date().getFullYear();
---
<Wave fill="var(--ivory-soft)" />
<footer class="footer">
```

- [ ] **Step 3 : Build et capture d'une page intérieure**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3
```
Expected : `10 page(s) built`. Puis capture `browse` (`newtab` → `viewport 1440x900` → `goto http://localhost:4331/approche/` → `wait --networkidle` → `screenshot <scratchpad>/t3-approche.png`) et **lire** la capture : médaillon fondu sur dégradé pêche→lilas, blob visible à droite, deux vagues encore présentes dans la page (elles partent en Tâche 7), une vague avant le footer.

---

### Tâche M1 : L'aquarelle du hero (Kie `nano-banana-pro`, 3 candidats) — session principale

**Files:**
- Create: `scripts/illustration_hero.sh`, `scripts/convertir_hero.mjs`
- Create (hors git) : `brief/illu-src/hero-cabinet-{1,2,3}.png`, `brief/illu-src/hero-cabinet.png`
- Create : `public/media/illu/hero-cabinet-{640,1040,1600}.webp`

- [ ] **Step 1 : Préflight Kie (clé + solde), sans rien générer**

```bash
[ -n "$KIE_API_KEY" ] && echo "KIE_API_KEY: presente" || echo "KIE_API_KEY: ABSENTE"
curl -sS --max-time 5 -H "Authorization: Bearer $KIE_API_KEY" "https://api.kie.ai/api/v1/chat/credit"
```
Expected : `presente` et `{"code":200,"data":<crédits>}` > 0.

- [ ] **Step 2 : Écrire `scripts/illustration_hero.sh`** (3 tâches Kie, jamais de retry sur une tâche créée, un fichier présent n'est jamais regénéré)

```bash
#!/usr/bin/env bash
# L'aquarelle du hero (spec §7) : 3 candidats nano-banana-pro, 4:5, 2K (repli 1K).
# Sortie : brief/illu-src/hero-cabinet-<n>.png (hors git). Un fichier présent n'est jamais regénéré.
set -u
cd "$(dirname "$0")/.."
[ -n "${KIE_API_KEY:-}" ] || { echo "KIE_API_KEY absente" >&2; exit 1; }
mkdir -p brief/illu-src
API="https://api.kie.ai/api/v1"
PROMPT="Entirely hand-painted watercolor illustration on white paper, soft pastel, loose wet-on-wet washes, visible paper grain, no photorealism, no text, no letters. A quiet corner of a therapist's consulting room bathed in morning light: a soft rounded armchair in peach and pale rose, a sheer white curtain glowing with daylight, a diagonal ray of warm light on a pale floor, a small ceramic pot with a few green leaves on a side table, one raspberry-pink cushion as the only strong accent. Lots of white paper left visible at the edges, airy, luminous, peaceful. Palette: peach, pale rose, lilac, mint green, a touch of raspberry."
creer() { # $1 = résolution
  python3 -c 'import json,sys; print(json.dumps({"model":"nano-banana-pro","input":{"prompt":sys.argv[1],"aspect_ratio":"4:5","resolution":sys.argv[2],"output_format":"png"}}))' "$PROMPT" "$1" \
  | curl -sS --max-time 30 -X POST "$API/jobs/createTask" -H "Authorization: Bearer $KIE_API_KEY" -H "Content-Type: application/json" -d @- \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("data",{}).get("taskId","") if d.get("code")==200 else "")'
}
for n in 1 2 3; do
  out="brief/illu-src/hero-cabinet-$n.png"
  if [ -s "$out" ]; then echo "= candidat $n déjà présent"; continue; fi
  task=$(creer 2K); [ -n "$task" ] || task=$(creer 1K)
  [ -n "$task" ] || { echo "✗ candidat $n : création refusée" >&2; continue; }
  url=""
  for i in $(seq 1 40); do
    sleep 6
    rep=$(curl -sS --max-time 20 -H "Authorization: Bearer $KIE_API_KEY" "$API/jobs/recordInfo?taskId=$task")
    etat=$(printf '%s' "$rep" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("data",{}).get("state",""))' 2>/dev/null || echo "")
    if [ "$etat" = "success" ]; then
      url=$(printf '%s' "$rep" | python3 -c 'import json,sys; d=json.load(sys.stdin)["data"]; print((json.loads(d.get("resultJson") or "{}").get("resultUrls") or [""])[0])'); break
    elif [ "$etat" = "fail" ]; then echo "✗ candidat $n : $(printf '%s' "$rep" | head -c 300)" >&2; break; fi
  done
  if [ -n "$url" ] && curl -sS --max-time 90 -o "$out" "$url" && [ -s "$out" ]; then echo "✓ candidat $n"; else rm -f "$out"; echo "✗ candidat $n : pas de résultat" >&2; fi
done
```

- [ ] **Step 3 : Générer, puis LIRE les 3 candidats (outil Read sur chaque PNG) et choisir**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && bash scripts/illustration_hero.sh
```
Critères (spec §7) : aquarelle visible (pas une photo), papier blanc dominant, fauteuil + voilage + rai de lumière + feuilles vertes + coussin framboise, pêche/rose dominants. Copier l'élu : `cp brief/illu-src/hero-cabinet-<n>.png brief/illu-src/hero-cabinet.png`. Si aucun ne convient : une seule seconde salve après correction du prompt, pas plus.

- [ ] **Step 4 : Écrire `scripts/convertir_hero.mjs` et l'exécuter**

```js
// brief/illu-src/hero-cabinet.png → public/media/illu/hero-cabinet-{640,1040,1600}.webp (4/5 recadré)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('public/media/illu', { recursive: true });
for (const w of [640, 1040, 1600]) {
  await sharp('brief/illu-src/hero-cabinet.png')
    .resize(w, Math.round((w * 5) / 4), { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(`public/media/illu/hero-cabinet-${w}.webp`);
  console.log('✓ hero-cabinet', w);
}
```
```bash
cd C:/Dev/Noveo/_autres/website/xenia && node scripts/convertir_hero.mjs && ls -la public/media/illu/hero-cabinet-*
```
Expected : trois `.webp`, le 1600 sous ~350 Ko.

---

### Tâche M2 : Le film régénéré (Seedance 2.5 via Higgsfield) — session principale

**Files:**
- Create (hors git) : `brief/masters/hero-film-master.mp4`
- Replace : `public/media/hero-film.mp4`, `public/media/hero-film-poster.webp`

- [ ] **Step 1 : Solde Higgsfield (`mcp__higgsfield__balance`) — il faut ≥ 216 crédits, sinon arrêt et message à l'utilisateur.**

- [ ] **Step 2 : Générer (`mcp__higgsfield__generate_video`)** : Seedance 2.5, texte → vidéo, **24 s**, 1080p, 16:9, sans audio, `bitrate_mode: high` si le paramètre existe. Prompt (mots filtrés par la modération évités — pas de `petal`, `translucent`, `plant`) :

> Macro view of white watercolor paper. Soft pastel washes of peach, pale rose, lilac and mint bloom slowly wet-on-wet. It starts almost empty — one small peach drop of pigment in the center — and colors keep spreading and layering into a bright, radiant pastel aurora by the end. Very luminous, lots of white paper at the edges, continuous slow motion, fixed camera, no gray, no dark ink, no smoke, no figurative shapes, no text.

Attendre la fin (`mcp__higgsfield__jobs_wait` puis `mcp__higgsfield__show_generation_by_ids`), télécharger le mp4 dans `brief/masters/hero-film-master.mp4`.

- [ ] **Step 3 : Critère d'acceptation à l'œil (spec §6) — lire 4 frames**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && mkdir -p "$SCRATCH/film" && for t in 0 6 12 23.5; do ffmpeg -y -loglevel error -ss $t -i brief/masters/hero-film-master.mp4 -frames:v 1 "$SCRATCH/film/f-$t.png"; done
```
Lire les 4 PNG (outil Read) : fond blanc dominant partout, aucune zone grise ou brune, montée de couleur monotone, rien de figuratif. Sinon : **une** seconde génération avec prompt corrigé, jamais plus de deux sans en reparler à l'utilisateur.

- [ ] **Step 4 : Encodage web ALL-INTRA + poster à 30 %, vérification ffprobe**

```bash
cd C:/Dev/Noveo/_autres/website/xenia
ffmpeg -y -loglevel error -i brief/masters/hero-film-master.mp4 -vf "scale=1280:720" -r 20 -an -c:v libx264 -g 1 -tune fastdecode -crf 22 -pix_fmt yuv420p -movflags +faststart public/media/hero-film.mp4
ffmpeg -y -loglevel error -ss 7.2 -i brief/masters/hero-film-master.mp4 -frames:v 1 -vf "scale=1280:720" -c:v libwebp -quality 82 public/media/hero-film-poster.webp
ffprobe -v error -select_streams v -show_entries frame=pict_type -of csv=p=0 public/media/hero-film.mp4 | sort | uniq -c
ls -la public/media/hero-film.mp4
```
Expected : une seule ligne `<N> I` (100 % frames I, N ≈ 480), taille ≤ 8 Mo.

---

### Tâche 4 : Le hero de l'accueil (deux colonnes, scrim, médaillon, traversée resserrée)

**Files:**
- Modify: `src/pages/index.astro` — lignes 65-127 (markup du hero), 257-421 (script de la scène), 452-574 (styles du hero)

Prérequis : Tâches 1-2 faites ; les fichiers `public/media/illu/hero-cabinet-*.webp` existent (Tâche M1) — sinon le médaillon affiche une image cassée, ce n'est pas bloquant pour cette tâche.

- [ ] **Step 1 : Remplacer le markup du hero (de `<!-- ===== HERO SIGNATURE` jusqu'au `</section>` du hero, lignes 65-127)**

```astro
  <!-- ===== HERO SIGNATURE — « L'éclaircie » =====
       Desktop : la traversée (scène épinglée, 3 phrases au fil du scroll), puis
       le vrai hero se lève : texte à gauche sur son scrim, médaillon aquarelle
       à droite. L'écran 0 est coloré (voile à 0,55, poster du film visible). -->
  <section class="hero" id="hero">
    <div class="aurora hero__aurora" aria-hidden="true">
      <!-- Le film d'aquarelle (généré) — couche la plus profonde ; poster visible
           dès le pré-paint, scrubé par le scroll en desktop, joué en mobile. -->
      <video
        class="hero__film"
        muted
        playsinline
        preload="none"
        poster="/media/hero-film-poster.webp"
        data-film="/media/hero-film.mp4"
      ></video>
      <div class="aurora__blob" style="--blob-c: rgba(255,197,162,0.7); width: 60vw; height: 60vw; top: -22vw; left: -16vw;"></div>
      <div class="aurora__blob aurora__blob--slow" style="--blob-c: rgba(203,181,238,0.65); width: 54vw; height: 54vw; top: -16vw; right: -14vw;"></div>
      <div class="aurora__blob" style="--blob-c: rgba(174,224,206,0.6); width: 40vw; height: 40vw; bottom: -12vw; right: 18vw; animation-duration: 26s;"></div>
      <div class="hero__halo-wrap" style="width: 50vw; height: 50vw; top: 0; right: 2vw;">
        <div class="halo" style="--halo-c: rgba(243,177,206,0.9); width: 100%; height: 100%;"></div>
      </div>
      <!-- Les pétales du logo, échappés dans l'aurore : deux « rencontres » -->
      <div class="hero__petale hero__petale--1" style="width: 140px; top: 16%; right: 10%;">
        <svg viewBox="0 0 64 64"><g style="mix-blend-mode: multiply;"><ellipse cx="27" cy="32" rx="23" ry="12.5" transform="rotate(-38 27 32)" fill="#E8799F" /></g><g style="mix-blend-mode: multiply;"><ellipse cx="37" cy="32" rx="23" ry="12.5" transform="rotate(38 37 32)" fill="#84C7AE" /></g></svg>
      </div>
      <div class="hero__petale hero__petale--2" style="width: 96px; top: 58%; right: 30%;">
        <svg viewBox="0 0 64 64"><g style="mix-blend-mode: multiply;"><ellipse cx="27" cy="32" rx="23" ry="12.5" transform="rotate(-38 27 32)" fill="#E8799F" /></g><g style="mix-blend-mode: multiply;"><ellipse cx="37" cy="32" rx="23" ry="12.5" transform="rotate(38 37 32)" fill="#84C7AE" /></g></svg>
      </div>
      <div class="hero__voile"></div>
    </div>
    <!-- Le scrim : ivoire derrière la colonne texte, quoi que montre le film -->
    <div class="hero__scrim" aria-hidden="true"></div>
    <!-- La traversée — 3 phrases pilotées par le scroll (desktop, scène épinglée) -->
    <div class="hero__phases" aria-hidden="true">
      <p class="hero__phase" data-phase="1">Parfois, tout pèse<br /><em>un peu trop</em>.</p>
      <p class="hero__phase hero__phase--manuscrit" data-phase="2"><Manuscrit /></p>
      <p class="hero__phase" data-phase="3">La lumière revient,<br /><em>à votre rythme</em>.</p>
    </div>
    <div class="container hero__inner">
      <div class="hero__txt">
        <p class="hero__eyebrow" data-h>{IDENTITE.titre} · {IDENTITE.sousTitre}</p>
        <h1 class="headline hero__title" data-h-title>
          Psychologue en Brabant wallon,<br />vers un <em class="hero__em">mieux-être durable<svg class="hero__trait" viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="trait-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C13D63" /><stop offset="1" stop-color="#F3B1CE" /></linearGradient></defs><path d="M3 9 C 42 3.5, 92 2.5, 132 5.5 C 166 8, 196 7, 217 4.5" pathLength="1" fill="none" stroke="url(#trait-grad)" stroke-width="4.5" stroke-linecap="round" /></svg></em>
        </h1>
        <p class="copy hero__copy" data-h>
          Stress, épuisement, parentalité, alimentation… Ce qui vous pèse mérite un
          espace d'écoute <strong>sécurisant et sans jugement</strong>. Je vous reçois à
          Nivelles, La Hulpe et Court-Saint-Étienne — ou en visio.
        </p>
        <div class="actions" data-h>
          <a class="btn-pill" href="/lieux-contact/#rdv">Prendre rendez-vous</a>
          <a class="link-arrow" href="/approche/">Découvrir mon approche</a>
        </div>
        <ul class="hero__trust" aria-label="Repères">
          <li data-h>Agrément n° {IDENTITE.agrement}</li>
          <li data-h>Master UCLouvain</li>
          <li data-h>3 cabinets + visio</li>
          <li data-h>RDV en ligne</li>
        </ul>
      </div>
      <!-- Le médaillon : l'aquarelle permanente du cabinet (le portrait vit dans « Qui je suis ») -->
      <div class="hero__visuel">
        <div class="halo hero__visuel-halo" style="--halo-c: rgba(246,200,219,0.8); width: 60%; height: 60%; top: -12%; right: -10%;" aria-hidden="true"></div>
        <figure class="hero__medaillon">
          <img
            src="/media/illu/hero-cabinet-1040.webp"
            srcset="/media/illu/hero-cabinet-640.webp 640w, /media/illu/hero-cabinet-1040.webp 1040w, /media/illu/hero-cabinet-1600.webp 1600w"
            sizes="(min-width: 1024px) 520px, 300px"
            width="1040"
            height="1300"
            alt="Aquarelle pastel : un coin de cabinet baigné de lumière du matin, fauteuil doux, voilage et coussin framboise"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </div>
  </section>
```

- [ ] **Step 2 : Remplacer la timeline desktop (lignes 360-402) et la timeline mobile (lignes 404-415) dans le `<script>`**

Timeline desktop — remplacer depuis `const tl = gsap.timeline({` jusqu'à `ScrollTrigger.refresh();` inclus :
```ts
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=140%',
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              cibleFilm = self.progress;
              if (!rafFilm) rafFilm = requestAnimationFrame(peindreFilm);
            },
          },
        });
        /* Acte 1 — tout pèse : phrase 1 sur le voile, le film s'éveille (0,35 → 0,75) */
        tl.fromTo('.hero__film', { opacity: 0.35 }, { opacity: 0.75, duration: 0.44, ease: 'none' }, 0)
          .to('[data-phase="1"]', { opacity: 0, y: -46, duration: 0.08, ease: 'power2.in' }, 0.1)
          /* Acte 2 — l'éclaircie : le voile se lève, le halo s'allume, le stylo écrit */
          .fromTo('.hero__voile', { opacity: 1 }, { opacity: 0, duration: 0.38, ease: 'none' }, 0.08)
          .fromTo('.hero__halo-wrap', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.42, ease: 'none' }, 0.08)
          .fromTo('[data-phase="2"]', { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.14)
          .fromTo(
            '.hero__manuscrit .ecrit',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.05, stagger: 0.026, ease: 'none' },
            0.16
          )
          .to('[data-phase="2"]', { opacity: 0, y: -46, duration: 0.09, ease: 'power2.in' }, 0.44)
          .fromTo('.hero__petale', { opacity: 0 }, { opacity: 0.42, stagger: 0.04, duration: 0.14 }, 0.36)
          .fromTo('[data-phase="3"]', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.08 }, 0.5)
          .to('[data-phase="3"]', { opacity: 0, y: -46, duration: 0.09, ease: 'power2.in' }, 0.62)
          /* Le film redescend (0,45) : le scrim fait le reste */
          .to('.hero__film', { opacity: 0.45, duration: 0.18, ease: 'none' }, 0.5)
          /* Acte 3 — le vrai hero se lève, mot à mot, sur son scrim ; le médaillon monte */
          .fromTo('.hero__scrim', { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, 0.66)
          .fromTo('.hero__eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06 }, 0.68)
          .fromTo('.hero__title .swi', { yPercent: 115 }, { yPercent: 0, duration: 0.12, stagger: 0.01 }, 0.7)
          .fromTo('.hero__visuel', { y: 24, opacity: 0, rotation: -3 }, { y: 0, opacity: 1, rotation: 0, duration: 0.16 }, 0.72)
          .fromTo('.hero__copy', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.07 }, 0.76)
          .fromTo('.hero .actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.07 }, 0.81)
          .fromTo('.hero__trait path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.09, ease: 'power2.inOut' }, 0.82)
          .fromTo('.hero__trust li', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.05, stagger: 0.012 }, 0.86);
        /* Duo obligatoire après chaque création de pin (cf. motion.ts) */
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
```
Timeline mobile — remplacer le bloc `const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });` … `.fromTo('.hero__trust li', …);` par :
```ts
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero__voile', { opacity: 1 }, { autoAlpha: 0, duration: 1.7, ease: 'power2.inOut' }, 0)
          .fromTo('.hero__halo-wrap', { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 0.1)
          .fromTo('.hero__scrim', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'none' }, 0.3)
          .fromTo('.hero__petale', { opacity: 0 }, { opacity: 0.42, duration: 1.1, stagger: 0.18 }, 0.5)
          .fromTo('.hero__eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.55)
          .fromTo('.hero__title .swi', { yPercent: 115 }, { yPercent: 0, duration: 0.85, stagger: 0.055 }, 0.62)
          .fromTo('.hero__copy', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.25)
          .fromTo('.hero__visuel', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 1.3)
          .fromTo('.hero__trait path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, 1.35)
          .fromTo('.hero .actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.45)
          .fromTo('.hero__trust li', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 }, 1.6);
```
Le reste du script (split du H1, chargement du film en Blob, `peindreFilm`, split-scroll nutrition) ne change pas.

- [ ] **Step 3 : Remplacer les styles du hero (du commentaire `/* ===== Hero ===== */` jusqu'à la fermeture de `.hero__trust li::before { … }`, lignes 453-573)**

```css
  /* ===== Hero ===== */
  .hero {
    position: relative;
    min-height: 92svh;
    display: flex; align-items: center;
    padding-block: clamp(120px, 14vw, 168px) clamp(56px, 7vw, 90px);
    overflow: clip;
    /* Nappe d'aurore générale, fondue vers l'ivoire en bas : la couture douce */
    background:
      linear-gradient(180deg, transparent 62%, var(--ivory)),
      linear-gradient(160deg,
        rgba(255, 217, 196, 0.55),
        rgba(246, 200, 219, 0.38) 34%,
        rgba(223, 210, 244, 0.3) 62%,
        rgba(201, 233, 222, 0.42));
  }
  /* Deux colonnes : texte 1,15 / médaillon 0,85 */
  .hero__inner {
    position: relative; width: 100%;
    display: grid; grid-template-columns: 1.15fr 0.85fr;
    gap: clamp(32px, 5vw, 72px);
    align-items: center;
  }
  .hero__txt { max-width: 620px; }

  /* ===== Signature « L'éclaircie » ===== */
  /* L'aurore (film, blobs, halo, pétales, voile) s'efface en bas : plus de ligne droite */
  .hero__aurora {
    -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
  }
  /* Le film d'aquarelle — couche profonde ; poster visible dès le pré-paint (0,35) */
  .hero__film {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.35;
    -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
    transition: opacity 0.6s ease;
  }
  /* En mobile (pas de scène) : un peu plus présent dès qu'il joue */
  .hero__film.is-pret { opacity: 0.5; }
  @media (min-width: 1024px) {
    /* En scène, c'est la timeline qui pilote l'opacité (état inline) */
    .hero__film { transition: none; }
    .hero__film.is-pret { opacity: 0.35; }
  }

  /* Le voile : l'état d'avant (ivoire à 0,55 — l'écran 0 reste coloré).
     Inerte sans JS (opacity 0), levé par GSAP. */
  .hero__voile {
    position: absolute; inset: 0;
    background: rgba(253, 251, 248, 0.55);
    opacity: 0; pointer-events: none;
  }
  /* Le scrim : lisibilité du texte garantie. Statique = visible ; en scène,
     GSAP le fait monter à l'acte 3. */
  .hero__scrim {
    position: absolute; inset: 0;
    background: var(--scrim-hero);
    pointer-events: none;
  }
  .hero__halo-wrap { position: absolute; }
  /* Les pétales : deux rencontres du logo, floutées, dérive continue en CSS
     (GSAP n'anime que leur opacité) */
  .hero__petale {
    position: absolute; opacity: 0.42;
    filter: blur(0.6px);
    animation: petale-drift 11s ease-in-out infinite alternate;
  }
  .hero__petale svg { display: block; width: 100%; height: auto; overflow: visible; }
  .hero__petale--1 { rotate: -14deg; }
  .hero__petale--2 { rotate: 22deg; animation-duration: 14s; animation-delay: -5s; }
  @keyframes petale-drift {
    from { transform: translateY(0) rotate(0deg); }
    to { transform: translateY(-22px) rotate(9deg); }
  }
  /* Le trait de pinceau sous la promesse */
  .hero__em { position: relative; display: inline-block; }
  .hero__trait {
    position: absolute; left: -0.06em; right: -0.06em; bottom: -0.02em;
    width: calc(100% + 0.12em); height: 0.16em;
    overflow: visible;
  }
  .hero__trait path { stroke-dasharray: 1 1; stroke-dashoffset: 0; }

  /* Le médaillon : aquarelle permanente du cabinet, fondue sur pêche→rose,
     anneau de verre, halo respirant derrière (haut-droite) */
  .hero__visuel { position: relative; width: 100%; max-width: 520px; justify-self: end; }
  .hero__visuel-halo { z-index: 0; }
  .hero__medaillon {
    position: relative; margin: 0; overflow: hidden;
    aspect-ratio: 4 / 5;
    border-radius: 58% 42% 55% 45% / 48% 55% 45% 52%;
    background: linear-gradient(150deg, var(--peach), var(--rose));
    box-shadow: 0 24px 64px rgba(67, 50, 75, 0.16);
    outline: 1px solid rgba(255, 255, 255, 0.75); outline-offset: -1px;
  }
  .hero__medaillon img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }

  /* La traversée — phrases de la scène épinglée (desktop, activées par JS) */
  .hero__phases {
    position: absolute; inset: 0;
    display: none;
    place-items: center;
    pointer-events: none;
    text-align: center;
  }
  .hero.is-scene .hero__phases { display: grid; }
  .hero__phase {
    grid-area: 1 / 1;
    font-family: var(--font-display);
    font-variation-settings: 'SOFT' 90, 'opsz' 80;
    font-size: clamp(2rem, 4.6vw, 3.6rem);
    font-weight: 560; line-height: 1.16; letter-spacing: -0.014em;
    color: var(--ink);
    opacity: 0;
    padding-inline: var(--gutter);
    text-wrap: balance;
  }
  .hero__phase em {
    font-style: italic; font-weight: 480;
    font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 80;
    color: var(--framboise);
  }
  .hero__phase[data-phase="1"] { opacity: 1; }
  .hero__phase--manuscrit { display: flex; justify-content: center; }
  @media (min-width: 1024px) {
    .hero.is-scene { min-height: 100svh; }
  }

  /* États pré-paint (classe posée avant le premier rendu, retirée dès que
     GSAP a pris le relais — garde-fou 3 s dans le script inline) */
  :global(html.js-intro) .hero__voile { opacity: 1; }
  :global(html.js-intro) .hero__halo-wrap { opacity: 0; }
  :global(html.js-intro) .hero__petale { opacity: 0; }
  :global(html.js-intro) .hero__scrim { opacity: 0; }
  :global(html.js-intro) .hero__visuel { opacity: 0; }
  :global(html.js-intro) .hero__title,
  :global(html.js-intro) .hero [data-h] { opacity: 0; }
  :global(html.js-intro) .hero__trait path { stroke-dashoffset: 1; }
  .hero__eyebrow {
    font-size: 0.88rem; font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--framboise);
  }
  .hero__title { margin-top: 18px; font-size: clamp(2.4rem, 5.4vw, 4.15rem); }
  .hero__copy { font-size: clamp(1.1rem, 1.6vw, 1.28rem); color: var(--muted-hero); }
  .hero__trust {
    margin: 40px 0 0; padding: 0; list-style: none;
    display: flex; gap: 10px 26px; flex-wrap: wrap;
    font-size: 0.86rem; color: var(--muted-hero);
  }
  .hero__trust li { display: flex; align-items: center; gap: 8px; }
  .hero__trust li::before {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, var(--rose), var(--lilac));
  }
  /* Mobile : médaillon sous le texte, film limité au haut, scrim vertical */
  @media (max-width: 1023px) {
    .hero__inner { grid-template-columns: 1fr; }
    .hero__visuel { max-width: 300px; justify-self: center; margin-top: 8px; }
    .hero__film {
      -webkit-mask-image: linear-gradient(to bottom, #000 35%, transparent 55%);
      mask-image: linear-gradient(to bottom, #000 35%, transparent 55%);
    }
    .hero__scrim { background: var(--scrim-hero-mobile); }
  }
```
Puis, dans le bloc `@media (max-width: 600px)` en fin de fichier, garder `.hero { min-height: auto; }`.

- [ ] **Step 4 : Build + captures de la scène à 5 positions et lecture**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3
```
Expected : `10 page(s) built`. Chaîne `browse` (desktop 1440×900) : `newtab` → `viewport 1440x900` → `goto http://localhost:4331/` → `wait --networkidle` → `js new Promise(r => setTimeout(r, 1500))` → `screenshot t4-0.png` → puis pour chaque `y` de `315, 630, 945, 1260, 1500` : `js window.scrollTo({top: <y>, behavior: 'instant'}); new Promise(r => setTimeout(r, 900))` → `screenshot t4-<y>.png`. Lire les 6 captures : écran 0 coloré (pas blanc) avec la phrase 1 ; « Respirez. » écrit vers 630 ; phrase 3 vers 945 ; à 1260 le hero complet en deux colonnes, médaillon visible, copy lisible ; à 1500 la sortie sans ligne droite. Mesure : `js document.querySelector('.hero__copy') && getComputedStyle(document.querySelector('.hero__copy')).color` → `rgb(110, 95, 118)`. Console : `console --errors` vide.

Mobile : `newtab` → `viewport 390x844` → `goto` → `wait --networkidle` → `js new Promise(r => setTimeout(r, 2800))` → `screenshot t4-mobile.png` : texte lisible sur scrim, médaillon sous le texte (≤ 300 px), `js document.documentElement.scrollWidth` = 390.

---

### Tâche 5 : Les sections de l'accueil (blobs, cartes teintées, « Qui je suis », rencontre nutrition, tagline déplacée)

**Files:**
- Modify: `src/pages/index.astro` — frontmatter (imports + `situations`), markup des sections (après le hero jusqu'à `</Base>`), styles hors hero

- [ ] **Step 1 : Frontmatter — imports et teintes des situations**

Remplacer les imports (lignes 2-8) par :
```ts
import Base from '../layouts/Base.astro';
import Blob from '../components/Blob.astro';
import Portrait from '../components/Portrait.astro';
import LieuxCards from '../components/LieuxCards.astro';
import Closing from '../components/Closing.astro';
import Tagline from '../components/Tagline.astro';
import Manuscrit from '../components/Manuscrit.astro';
import { IDENTITE } from '../data/site';
```
Remplacer le tableau `situations` par (guillemets **insécables** `\u00A0`, teinte par thème — spec §5.2) :
```ts
const situations = [
  { txt: '«\u00A0Je suis épuisé·e, je n’y arrive plus.\u00A0»', href: '/accompagnements/adolescents-adultes/', tag: 'Burn-out', teinte: 'rose' },
  { txt: '«\u00A0Tout me stresse, même les petites choses.\u00A0»', href: '/accompagnements/adolescents-adultes/', tag: 'Stress & anxiété', teinte: 'rose' },
  { txt: '«\u00A0On attend un enfant, et tout bouge.\u00A0»', href: '/accompagnements/perinatalite-parentalite/', tag: 'Périnatalité', teinte: 'lilac' },
  { txt: '«\u00A0Être parent me dépasse en ce moment.\u00A0»', href: '/accompagnements/perinatalite-parentalite/', tag: 'Parentalité', teinte: 'lilac' },
  { txt: '«\u00A0Mon enfant ne va pas bien, je le sens.\u00A0»', href: '/accompagnements/enfants-famille/', tag: 'Enfants', teinte: 'aqua' },
  { txt: '«\u00A0Le TDAH complique notre quotidien.\u00A0»', href: '/accompagnements/adolescents-adultes/#tdah', tag: 'TDAH', teinte: 'aqua' },
  { txt: '«\u00A0Je veux manger et dormir mieux, sans me battre.\u00A0»', href: '/nutrition-sante/', tag: 'Nutrition & sommeil', teinte: 'peach' },
  { txt: '«\u00A0Je vis avec la douleur ou la maladie.\u00A0»', href: '/accompagnements/adolescents-adultes/', tag: 'Maladie chronique', teinte: 'peach' },
];
```
Le tableau `accompagnements` ne change pas.

- [ ] **Step 2 : Remplacer tout le markup après le hero (de `<!-- ===== CE QUI VOUS AMÈNE =====` jusqu'à `<Closing />` inclus)**

```astro
  <!-- ===== CE QUI VOUS AMÈNE ===== -->
  <section class="section section--blob amene">
    <Blob variante={1} teinte="lilac-aqua" largeur="52vw" position="top: -10%; left: -16vw;" opacite={0.55} />
    <div class="container">
      <span class="overline overline--center">Ce qui vous amène</span>
      <h2 class="headline headline--md headline--center">
        Vous vous reconnaissez<br />dans <em>l'une de ces phrases</em> ?
      </h2>
      <p class="copy copy--center">
        Il n'y a pas de «&nbsp;bonne raison&nbsp;» de consulter. Il y a ce que vous vivez,
        maintenant — et c'est suffisant.
      </p>
      <div class="amene__grid" data-reveal data-reveal-stagger>
        {situations.map((s) => (
          <a class:list={['card', 'card--spot', `card--${s.teinte}`, 'amene__card']} href={s.href}>
            <p class="amene__txt">{s.txt}</p>
            <p class="amene__tag">{s.tag} <span aria-hidden="true">→</span></p>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- ===== LES 3 ACCOMPAGNEMENTS ===== -->
  <section class="section section--blob acc">
    <Blob variante={2} teinte="peach-rose" largeur="44vw" position="top: 28%; right: -12vw;" opacite={0.6} inverse />
    <div class="container">
      <span class="overline">Accompagnements</span>
      <h2 class="headline headline--md">
        Trois espaces, <em>selon l'âge et la vie</em>
      </h2>
      <div class="acc__grid" data-reveal data-reveal-stagger>
        {accompagnements.map((a) => (
          <a class="card card--spot acc__card" href={a.href}>
            <div class="acc__tint" style={`background: ${a.tint}`}>
              <img src={a.illu} alt={a.illuAlt} width="640" height="480" loading="lazy" />
            </div>
            <div class="acc__body">
              <h3 class="headline--sm acc__titre">{a.titre}</h3>
              <p class="acc__desc">{a.desc}</p>
              <span class="link-arrow">Découvrir</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- ===== QUI JE SUIS (remplace le teaser « Mon approche ») ===== -->
  <section class="section section--blob qui" id="qui-je-suis">
    <Blob variante={3} teinte="rose-lilac" largeur="42vw" position="top: -8%; left: -10vw;" opacite={0.6} />
    <div class="container qui__grid">
      <div class="qui__portrait" data-reveal>
        <Portrait legende="Xénia Van Outryve — psychologue clinicienne en santé et périnatalité" />
      </div>
      <div class="qui__txt" data-reveal>
        <span class="overline">Qui je suis</span>
        <h2 class="headline headline--md">
          Xénia Van Outryve,<br /><em>psychologue clinicienne</em>
        </h2>
        <blockquote class="qui__citation">
          «&nbsp;Je suis avant tout passionnée par chaque personne, avec son
          histoire, ses forces et ses fragilités.&nbsp;»
        </blockquote>
        <ul class="qui__reperes">
          <li>
            <h3 class="puce-petale">Intégrative</h3>
            <p>Des outils choisis pour votre situation, votre histoire, vos ressources — pas une méthode unique.</p>
          </li>
          <li>
            <h3 class="puce-petale">Corps et esprit</h3>
            <p>Sommeil, alimentation, mouvement font partie du travail : ils pèsent sur l'humeur et l'énergie.</p>
          </li>
          <li>
            <h3 class="puce-petale">À votre rythme</h3>
            <p>Vos besoins et vos valeurs fixent le cap, dans un espace sécurisant et sans jugement.</p>
          </li>
        </ul>
        <p class="qui__faits">Master UCLouvain · Agrément n°&nbsp;{IDENTITE.agrement}</p>
        <div class="actions">
          <a class="link-arrow" href="/a-propos/">En savoir plus sur moi</a>
          <a class="link-arrow" href="/approche/">Comprendre ma façon de travailler</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== NUTRITION & SANTÉ — la rencontre ===== -->
  <section class="section section--blob nutri">
    <Blob variante={4} teinte="aqua-peach" largeur="46vw" position="top: -4%; right: -8vw;" opacite={0.55} inverse />
    <div class="container nutri__grid">
      <div class="nutri__txt" data-split="up">
        <span class="overline overline--sage">Nutrition & Santé</span>
        <h2 class="headline headline--md">
          Ce que vous mangez parle<br />aussi de <em>comment vous allez</em>
        </h2>
        <p class="copy">
          La santé mentale est étroitement liée à la santé physique. Sommeil,
          alimentation, mouvement : j'en fais des <strong>leviers concrets</strong> de
          votre équilibre — sans régime culpabilisant, sans injonctions.
        </p>
        <div class="actions">
          <a class="btn-pill btn-pill--sage" href="/nutrition-sante/">Explorer ce volet</a>
        </div>
      </div>
      <div class="nutri__visual" data-split="down" aria-hidden="true">
        <!-- Trois pétales en verre qui se recouvrent : leur intersection, c'est l'équilibre -->
        <div class="rencontre">
          <div class="rencontre__petale rencontre__petale--sommeil" style="--a: -90deg;"><span>Sommeil</span></div>
          <div class="rencontre__petale rencontre__petale--alim" style="--a: 30deg;"><span>Alimentation</span></div>
          <div class="rencontre__petale rencontre__petale--mouv" style="--a: 150deg;"><span>Mouvement</span></div>
          <div class="rencontre__coeur"><span>Équilibre<br />psychologique</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== TAGLINE — la respiration avant les lieux ===== -->
  <Tagline />

  <!-- ===== LIEUX ===== -->
  <section class="section section--blob lieux-home" id="lieux">
    <Blob variante={5} teinte="peach-lilac" largeur="40vw" position="bottom: -14%; right: -12vw;" opacite={0.55} />
    <div class="container">
      <span class="overline overline--center">Où me trouver</span>
      <h2 class="headline headline--md headline--center">
        Trois cabinets <em>près de chez vous</em>
      </h2>
      <p class="copy copy--center">
        Court-Saint-Étienne, Nivelles, La Hulpe — et la visio quand la route ou
        l'agenda compliquent les choses.
      </p>
      <LieuxCards />
    </div>
  </section>

  <Closing />
```

- [ ] **Step 3 : Styles — remplacer tout ce qui suit le hero dans `<style>` (de `/* ===== Ce qui vous amène ===== */` jusqu'à la fin du `<style>`)**

```css
  /* ===== Ce qui vous amène ===== */
  .amene__grid {
    margin-top: var(--headline-gap);
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-grid);
  }
  .amene__card {
    padding: clamp(20px, 2.2vw, 28px);
    text-decoration: none;
    display: flex; flex-direction: column; gap: 16px;
    border-radius: var(--radius-media);
  }
  .amene__txt {
    font-family: var(--font-display);
    font-style: italic; font-weight: 480;
    font-variation-settings: 'SOFT' 100, 'opsz' 30;
    font-size: 1.06rem; line-height: 1.35;
    color: var(--ink);
    text-wrap: pretty;
  }
  .amene__tag {
    margin-top: auto;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--framboise);
    display: flex; align-items: center; gap: 6px;
  }
  .amene__tag span { transition: transform 0.2s var(--ease); }
  .amene__card:hover .amene__tag span { transform: translateX(4px); }

  /* ===== Accompagnements ===== */
  .acc__grid {
    margin-top: var(--headline-gap);
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-grid);
  }
  .acc__card { text-decoration: none; display: flex; flex-direction: column; }
  .acc__tint { position: relative; overflow: hidden; }
  .acc__tint img {
    width: 100%; height: 100%; object-fit: cover;
    mix-blend-mode: multiply; opacity: 0.92;
    transition: transform 0.6s var(--ease);
  }
  .acc__card:hover .acc__tint img { transform: scale(1.04); }
  /* Symétrie cassée : les trois cartes descendent en escalier (desktop) */
  @media (min-width: 961px) {
    .acc__card:nth-child(2) { transform: translateY(26px); }
    .acc__card:nth-child(3) { transform: translateY(52px); }
    .acc__card:nth-child(2):hover { transform: translateY(22px); }
    .acc__card:nth-child(3):hover { transform: translateY(48px); }
    .acc__grid { padding-bottom: 52px; }
  }
  .acc__tint { height: 172px; }
  .acc__body {
    padding: var(--pad-card);
    display: flex; flex-direction: column; align-items: flex-start; gap: 14px; flex: 1;
  }
  .acc__titre { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; }
  .acc__desc { color: var(--muted); font-size: 0.97rem; line-height: 1.55; }
  .acc__body .link-arrow { margin-top: auto; }

  /* ===== Qui je suis ===== */
  .qui__grid {
    display: grid; grid-template-columns: 1fr 1.2fr;
    gap: clamp(40px, 6vw, 80px);
    align-items: center;
  }
  .qui__portrait { width: 100%; max-width: 400px; justify-self: center; }
  .qui__citation {
    margin: 22px 0 0;
    font-family: var(--font-display); font-style: italic; font-weight: 480;
    font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 40;
    font-size: clamp(1.15rem, 1.8vw, 1.4rem); line-height: 1.4;
    color: var(--framboise);
    text-wrap: pretty;
  }
  .qui__reperes {
    margin: 28px 0 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 16px;
  }
  .qui__reperes h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 620; letter-spacing: -0.01em; }
  .qui__reperes p { margin-top: 4px; padding-left: 28px; color: var(--muted); font-size: 0.97rem; line-height: 1.55; text-wrap: pretty; }
  .qui__faits { margin-top: 24px; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.02em; color: var(--muted); }
  .qui .actions { margin-top: 22px; gap: 14px 28px; }

  /* ===== Nutrition — la rencontre ===== */
  .nutri__grid {
    display: grid; grid-template-columns: 1.1fr 1fr;
    gap: clamp(40px, 6vw, 80px);
    align-items: center;
  }
  .nutri__visual { max-width: 440px; justify-self: center; width: 100%; }
  .rencontre {
    position: relative; aspect-ratio: 1; width: 100%;
    animation: rencontre-respire 7s cubic-bezier(0.45, 0, 0.4, 1) infinite;
  }
  /* Trois ellipses (comme le logo) à 120°, décalées le long de leur axe pour
     se recouvrir au centre ; verre dépoli, bord blanc */
  .rencontre__petale {
    position: absolute; left: 50%; top: 50%;
    width: 64%; height: 38%; border-radius: 50%;
    transform: translate(-50%, -50%) rotate(var(--a)) translateX(17%);
    -webkit-backdrop-filter: var(--glass-blur);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
  }
  .rencontre__petale--sommeil { background: rgba(223, 210, 244, 0.5); }
  .rencontre__petale--alim { background: rgba(255, 217, 196, 0.55); }
  .rencontre__petale--mouv { background: rgba(246, 200, 219, 0.5); }
  /* Le libellé vit sur la moitié extérieure du pétale, remis à l'horizontale */
  .rencontre__petale span {
    position: absolute; left: 66%; top: 50%;
    transform: translate(-50%, -50%) rotate(calc(-1 * var(--a)));
    font-size: 0.88rem; font-weight: 650; color: var(--ink); white-space: nowrap;
  }
  .rencontre__coeur {
    position: absolute; left: 50%; top: 50%;
    width: 36%; aspect-ratio: 1; border-radius: 50%;
    transform: translate(-50%, -50%);
    background: rgba(201, 233, 222, 0.9);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-card);
    display: grid; place-items: center; text-align: center;
    font-family: var(--font-display); font-weight: 640; font-size: 1rem; line-height: 1.2;
    color: var(--ink);
  }
  @keyframes rencontre-respire {
    0%, 100% { transform: scale(0.98); }
    43% { transform: scale(1.02); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rencontre { animation: none; }
  }

  /* ===== Responsive ===== */
  @media (max-width: 960px) {
    .amene__grid { grid-template-columns: repeat(2, 1fr); }
    .acc__grid { grid-template-columns: 1fr; max-width: 520px; margin-inline: auto; }
    .qui__grid { grid-template-columns: 1fr; }
    .qui__portrait { max-width: 320px; }
    .nutri__grid { grid-template-columns: 1fr; }
    .nutri__visual { max-width: 360px; }
  }
  @media (max-width: 600px) {
    .amene__grid { grid-template-columns: 1fr; }
    .hero { min-height: auto; }
    .rencontre__petale span { font-size: 0.8rem; }
  }
```

- [ ] **Step 4 : Build, hauteur, captures tous les 800 px et lecture**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3 && grep -c "soft-wrap" dist/index.html
```
Expected : `10 page(s) built` puis `0`. Chaîne `browse` desktop : `newtab` → `viewport 1440x900` → `goto http://localhost:4331/` → `wait --networkidle` → `js window.scrollTo({top: 1e6, behavior: 'instant'}); new Promise(r => setTimeout(r, 1500))` → `js document.documentElement.scrollHeight` (**≤ 6 800**) → puis captures à `y = 1400, 2200, 3000, 3800, 4600, 5400, 6200` (`js window.scrollTo({top: y, behavior:'instant'}); new Promise(r => setTimeout(r, 900))` puis `screenshot t5-<y>.png`). Lire chaque capture : chaque écran montre du contenu ; blobs visibles derrière les sections ; cartes teintées ; « Qui je suis » avec portrait placeholder, 3 repères, 2 liens ; les 3 pétales de la rencontre lisibles avec le disque central ; une seule vague (avant le footer). Mobile 390×844 : `scrollWidth` = 390, capture de la rencontre lisible. `console --errors` vide.

---

### Tâche 6 : `Domaines.astro` et `LieuxCards.astro`

**Files:**
- Modify: `src/components/Domaines.astro` (fichier entier)
- Modify: `src/components/LieuxCards.astro` (fichier entier)

- [ ] **Step 1 : Réécrire `src/components/Domaines.astro`**

```astro
---
/* Grille des motifs de consultation d'une page accompagnement.
   `teinte` : la couleur de la page (rose = ado-adultes, lilas = périnatalité,
   eau = enfants) en dégradé haut de carte. */
interface Item { titre: string; desc: string }
interface Props { items: Item[]; teinte: 'rose' | 'lilac' | 'aqua' }
const { items, teinte } = Astro.props;
---
<div class="domaines" data-reveal data-reveal-stagger>
  {items.map((d) => (
    <article class:list={['card', 'card--spot', `card--${teinte}`, 'domaines__card']}>
      <h2 class="puce-petale">{d.titre}</h2>
      <p>{d.desc}</p>
    </article>
  ))}
</div>

<style>
  .domaines {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-grid);
  }
  .domaines__card { padding: clamp(24px, 2.6vw, 34px); }
  /* Nombre impair d'items : la dernière carte occupe toute la largeur */
  .domaines__card:last-child:nth-child(odd) { grid-column: 1 / -1; }
  .domaines__card h2 {
    font-family: var(--font-display);
    font-size: 1.25rem; font-weight: 620; letter-spacing: -0.01em;
  }
  .domaines__card p { margin-top: 10px; color: var(--muted); font-size: 0.95rem; line-height: 1.6; }
  @media (max-width: 960px) {
    .domaines { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2 : Réécrire `src/components/LieuxCards.astro`**

```astro
---
/* Les trois cabinets : carte teintée par lieu, horaires, itinéraire Google
   Maps (URL de recherche, aucun embed, aucun cookie — cohérent avec la page
   vie privée) et rendez-vous sur la plateforme du cabinet. */
import { LIEUX, type Lieu } from '../data/site';
const itineraire = (l: Lieu) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.adresse}, ${l.codePostal} ${l.ville}, Belgique`)}`;
---
<div class="lieux" data-reveal data-reveal-stagger>
  {LIEUX.map((l) => (
    <article class:list={['card', 'card--spot', `card--${l.couleur}`, 'lieux__card']}>
      <div class="lieux__body">
        <p class="lieux__ville">{l.ville}</p>
        <p class="lieux__nom">{l.nom}</p>
        <p class="lieux__adresse">{l.adresse} · {l.codePostal} {l.ville}</p>
        <ul class="lieux__horaires">
          {l.horaires.map((h) => <li>{h}</li>)}
        </ul>
        <a class="link-arrow lieux__itin" href={itineraire(l)} target="_blank" rel="noopener">Itinéraire</a>
        <a class="btn-pill btn-pill--sm lieux__btn" href={l.lienRdv} target="_blank" rel="noopener">
          Rendez-vous sur {l.plateforme}
        </a>
      </div>
    </article>
  ))}
</div>

<style>
  .lieux {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-grid);
    margin-top: var(--headline-gap);
  }
  .lieux__card { display: flex; flex-direction: column; }
  .lieux__body {
    padding: var(--pad-card);
    display: flex; flex-direction: column; align-items: flex-start;
    flex: 1;
  }
  .lieux__ville {
    font-family: var(--font-display);
    font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em;
  }
  .lieux__nom { margin-top: 4px; font-weight: 650; font-size: 0.95rem; }
  .lieux__adresse { margin-top: 2px; color: var(--muted); font-size: 0.9rem; }
  .lieux__horaires {
    margin: 16px 0 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 5px;
    font-size: 0.92rem; color: var(--ink);
  }
  .lieux__horaires li::before { content: '·'; color: var(--framboise); font-weight: 700; margin-right: 8px; }
  .lieux__itin { margin-top: auto; padding-top: 16px; font-size: 0.9rem; }
  .lieux__btn { margin-top: 14px; }
  @media (max-width: 960px) {
    .lieux { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; }
  }
</style>
```

- [ ] **Step 3 : Build (les pages accompagnement cassent tant que `teinte` n'est pas passé — c'est la Tâche 7 ; Astro ne type-checke pas au build, donc le build passe)**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3
```
Expected : `10 page(s) built`.

---

### Tâche 7 : Les pages intérieures — le même système partout

Deux agents en parallèle sur des fichiers disjoints, chacun avec son `--outDir` :
- **7A** : `approche.astro`, `accompagnements/adolescents-adultes.astro`, `accompagnements/perinatalite-parentalite.astro`, `accompagnements/enfants-famille.astro`
- **7B** : `nutrition-sante.astro`, `a-propos.astro`, `lieux-contact.astro`, `mentions-legales.astro`

Règle commune (spec §8.1) : retirer `import Wave`, remplacer chaque `<div class="soft-wrap"><Wave … /><section class="section section--soft X">…</section><Wave … flip /></div>` par `<section class="section section--blob X"><Blob … />…</section>` ; toute `.card--glass` est posée sur le blob de sa section ; cartes teintées, jamais deux voisines de même teinte dans une grille ≥ 4.

#### 7A — Step 1 : `src/pages/approche.astro` (fichier entier)

```astro
---
import Base from '../layouts/Base.astro';
import PageHero from '../components/PageHero.astro';
import Blob from '../components/Blob.astro';
import Closing from '../components/Closing.astro';
import Logo from '../components/Logo.astro';
---
<Base
  title="Mon approche — Xénia Van Outryve, psychologue"
  description="Une approche intégrative et holistique : la personne dans sa globalité, corps et esprit. Un espace sécurisant, sans jugement, à votre rythme."
>
  <PageHero
    overline="Mon approche"
    image="/media/illu/approche.webp"
    imageAlt="Aquarelle pastel : un petit arrosoir arrose une jeune pousse dans un pot rose"
  >
    <Fragment slot="title">
      Une approche <em>intégrative</em>,<br />qui vous considère en entier
    </Fragment>
    <Fragment slot="copy">
      Vous n'êtes pas «&nbsp;un symptôme à corriger&nbsp;». Vous êtes une personne, avec
      son histoire, ses forces et ses fragilités — et c'est avec tout cela que
      nous travaillons.
    </Fragment>
  </PageHero>

  <section class="section piliers">
    <div class="container">
      <div class="piliers__grid" data-reveal data-reveal-stagger>
        <article class="card card--spot card--rose piliers__card">
          <span class="icon-badge" aria-hidden="true"><Logo size={24} /></span>
          <h2>Holistique, concrètement</h2>
          <p>
            Une approche <strong>intégrative et holistique</strong>, qui considère la
            personne dans sa globalité : ce que vous vivez, ce que vous ressentez,
            votre contexte familial et professionnel. Les outils s'adaptent à votre
            situation — pas l'inverse.
          </p>
        </article>
        <article class="card card--spot card--lilac piliers__card">
          <span class="icon-badge" aria-hidden="true"><Logo size={24} /></span>
          <h2>Le corps fait partie du travail</h2>
          <p>
            La santé mentale est <strong>étroitement liée à la santé physique</strong>.
            Sommeil, alimentation, activité physique : ces habitudes de vie pèsent
            directement sur l'humeur, l'énergie et l'anxiété. On s'en occupe aussi,
            à petits pas réalistes.
          </p>
        </article>
        <article class="card card--spot card--aqua piliers__card">
          <span class="icon-badge icon-badge--sage" aria-hidden="true"><Logo size={24} /></span>
          <h2>Sans jugement, à votre rythme</h2>
          <p>
            Un espace d'écoute <strong>bienveillant, sécurisant et sans jugement</strong>,
            où explorer vos difficultés, mieux comprendre votre fonctionnement et
            développer vos ressources. Le cap : un mieux-être durable, dans le
            respect de vos besoins et de vos valeurs.
          </p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--blob premiere">
    <Blob variante={2} teinte="peach-rose" largeur="46vw" position="top: -6%; left: -12vw;" opacite={0.6} />
    <div class="container premiere__grid">
      <div class="card card--glass premiere__intro" data-reveal>
        <span class="overline">La première séance</span>
        <h2 class="headline headline--md">
          Et si je ne sais pas<br /><em>par où commencer</em> ?
        </h2>
        <p class="copy">
          C'est très fréquent — et ce n'est pas un problème. La première
          rencontre sert justement à ça : poser ce qui vous amène, avec vos
          mots, sans ordre imposé. Nous définissons ensemble la suite, à votre
          rythme.
        </p>
      </div>
      <ul class="premiere__steps" data-reveal data-reveal-stagger>
        <li>
          <span class="premiere__num" aria-hidden="true"></span>
          <div>
            <h3>Vous arrivez comme vous êtes</h3>
            <p>Pas besoin de préparer quoi que ce soit, ni d'avoir «&nbsp;les bons mots&nbsp;».</p>
          </div>
        </li>
        <li>
          <span class="premiere__num" aria-hidden="true"></span>
          <div>
            <h3>On fait connaissance</h3>
            <p>Ce qui vous amène, votre contexte, ce que vous attendez — et vos questions.</p>
          </div>
        </li>
        <li>
          <span class="premiere__num" aria-hidden="true"></span>
          <div>
            <h3>On décide ensemble</h3>
            <p>La fréquence, les priorités, la manière de travailler : rien n'est figé d'avance.</p>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <section class="section pourqui">
    <div class="container">
      <span class="overline overline--center">Pour qui</span>
      <h2 class="headline headline--md headline--center">
        Enfants, adolescents, adultes,<br /><em>futurs et jeunes parents</em>
      </h2>
      <p class="copy copy--center">
        Chaque âge a sa porte d'entrée : retrouvez le détail dans les trois
        accompagnements, ou contactez-moi si vous hésitez sur la formule.
      </p>
      <div class="pourqui__grid" data-reveal data-reveal-stagger>
        <a class="card card--spot card--rose pourqui__card" href="/accompagnements/adolescents-adultes/">
          <span class="pourqui__titre">Adolescents &amp; Adultes</span>
          <span class="link-arrow">Découvrir</span>
        </a>
        <a class="card card--spot card--lilac pourqui__card" href="/accompagnements/perinatalite-parentalite/">
          <span class="pourqui__titre">Périnatalité &amp; Parentalité</span>
          <span class="link-arrow">Découvrir</span>
        </a>
        <a class="card card--spot card--aqua pourqui__card" href="/accompagnements/enfants-famille/">
          <span class="pourqui__titre">Enfants &amp; Famille</span>
          <span class="link-arrow">Découvrir</span>
        </a>
      </div>
    </div>
  </section>

  <Closing />
</Base>

<style>
  .piliers__grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-grid);
  }
  .piliers__card { padding: var(--pad-card); }
  .piliers__card h2 {
    margin-top: 18px;
    font-family: var(--font-display);
    font-size: 1.35rem; font-weight: 620; letter-spacing: -0.01em;
  }
  .piliers__card p { margin-top: 14px; color: var(--muted); font-size: 0.97rem; line-height: 1.6; }
  .piliers__card strong { color: var(--ink); }

  .premiere__grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: start;
  }
  .premiere__intro { padding: var(--pad-card); }
  .premiere__steps {
    margin: 0; padding: 0; list-style: none;
    display: flex; flex-direction: column; gap: 26px;
    counter-reset: step;
  }
  .premiere__steps li { display: flex; gap: 18px; counter-increment: step; }
  .premiere__num {
    width: 46px; height: 46px; border-radius: 50%; flex: none;
    display: grid; place-items: center;
    background: linear-gradient(135deg, rgba(246,200,219,0.55), rgba(223,210,244,0.55));
    font-family: var(--font-display); font-weight: 640; color: var(--framboise);
  }
  .premiere__num::after { content: counter(step); }
  .premiere__steps h3 { font-size: 1.05rem; font-weight: 700; }
  .premiere__steps p { margin-top: 4px; color: var(--muted); font-size: 0.94rem; line-height: 1.55; }

  .pourqui__grid {
    margin-top: var(--headline-gap);
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-grid);
  }
  .pourqui__card {
    padding: clamp(22px, 2.4vw, 30px);
    text-decoration: none;
    display: flex; flex-direction: column; gap: 14px; align-items: flex-start;
    border-radius: var(--radius-media);
  }
  .pourqui__titre {
    font-family: var(--font-display);
    font-size: 1.2rem; font-weight: 620; letter-spacing: -0.01em;
  }

  @media (max-width: 960px) {
    .piliers__grid { grid-template-columns: 1fr; max-width: 520px; margin-inline: auto; }
    .premiere__grid { grid-template-columns: 1fr; }
    .pourqui__grid { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; }
  }
</style>
```

#### 7A — Step 2 : `src/pages/accompagnements/adolescents-adultes.astro`

Remplacer les imports (lignes 2-6) par :
```ts
import Base from '../../layouts/Base.astro';
import PageHero from '../../components/PageHero.astro';
import Blob from '../../components/Blob.astro';
import Closing from '../../components/Closing.astro';
import Domaines from '../../components/Domaines.astro';
```
Ligne 52 : `<Domaines items={domaines} teinte="rose" />`.
Remplacer le bloc `<div class="soft-wrap" id="tdah">` … `</div>` (lignes 56-88) par :
```astro
  <section class="section section--blob tdah" id="tdah">
    <Blob variante={3} teinte="rose-lilac" largeur="48vw" position="top: -10%; right: -14vw;" opacite={0.6} inverse />
    <div class="container tdah__grid">
      <div data-reveal>
        <span class="overline">TDAH</span>
        <h2 class="headline headline--md">
          Le TDAH ne se «&nbsp;répare&nbsp;» pas.<br />Le quotidien, <em>si</em>.
        </h2>
        <p class="copy">
          Pour les personnes présentant un TDAH, je propose un accompagnement
          personnalisé sur trois fronts à la fois — parce qu'ils se renforcent
          l'un l'autre.
        </p>
      </div>
      <ul class="tdah__list" data-reveal data-reveal-stagger>
        <li class="card card--glass">
          <h3>Psychologique</h3>
          <p>Comprendre son fonctionnement, apprivoiser l'estime de soi, gérer la surcharge.</p>
        </li>
        <li class="card card--glass">
          <h3>Habitudes de vie</h3>
          <p>Sommeil, routines, organisation : des habitudes adaptées à votre fonctionnement — pas des to-do lists de plus.</p>
        </li>
        <li class="card card--glass">
          <h3>Nutritionnel</h3>
          <p>Des menus conçus pour soutenir la concentration, l'énergie et le bien-être au quotidien.</p>
        </li>
      </ul>
    </div>
  </section>
```
Dans `<style>`, remplacer la règle `.tdah__list li { background: #fff; border-radius: var(--radius-media); box-shadow: var(--shadow-card); padding: 22px 26px; }` par `.tdah__list li { border-radius: var(--radius-media); padding: 22px 26px; }`.

#### 7A — Step 3 : `src/pages/accompagnements/perinatalite-parentalite.astro`

Mêmes imports que 7A-2 (remplacer `Wave` par `Blob`). Ligne 56 : `<Domaines items={domaines} teinte="lilac" />`. Remplacer le bloc `<div class="soft-wrap">` … `</div>` (lignes 60-75) par :
```astro
  <section class="section section--blob note">
    <Blob variante={1} teinte="lilac-rose" largeur="72vw" position="top: -20%; left: 14vw;" opacite={0.55} />
    <div class="halo" style="--halo-c: rgba(246,200,219,0.55); width: 34vw; height: 34vw; top: 10%; right: 8vw;" aria-hidden="true"></div>
    <div class="container note__inner" data-reveal>
      <h2 class="headline headline--md headline--center">
        Il n'y a pas de «&nbsp;bon moment&nbsp;»<br />pour <em>demander de l'aide</em>
      </h2>
      <p class="copy copy--center">
        Avant la conception, pendant la grossesse, trois mois ou trois ans
        après la naissance : si quelque chose pèse — sur vous, sur votre couple,
        sur votre famille — c'est le bon moment.
      </p>
    </div>
  </section>
```
Ajouter en fin de fichier :
```astro
<style>
  .note { padding-block: clamp(80px, 10vw, 130px); }
  .note__inner { position: relative; }
</style>
```

#### 7A — Step 4 : `src/pages/accompagnements/enfants-famille.astro`

Mêmes imports (remplacer `Wave` par `Blob`). Ligne 44 : `<Domaines items={domaines} teinte="aqua" />`. Remplacer le bloc `<div class="soft-wrap">` … `</div>` (lignes 48-77) par :
```astro
  <section class="section section--blob parents">
    <Blob variante={4} teinte="aqua-lilac" largeur="44vw" position="top: 0; right: -10vw;" opacite={0.6} inverse />
    <div class="container parents__grid">
      <div data-reveal>
        <span class="overline">Et les parents ?</span>
        <h2 class="headline headline--md">
          Vous faites partie<br />de <em>la solution</em>
        </h2>
        <p class="copy">
          Un enfant ne consulte jamais «&nbsp;tout seul&nbsp;» : votre regard, votre
          histoire et votre quotidien font partie du travail. La place de
          chacun se définit ensemble, selon l'âge de votre enfant et la
          situation.
        </p>
      </div>
      <div class="card card--glass parents__note" data-reveal>
        <h3>Côté assiette aussi</h3>
        <p>
          Actuellement en formation en nutrition pédiatrique, je développe une
          expertise spécifique pour accompagner les enfants et leurs familles
          dans les questionnements autour de l'alimentation — en complément de
          ma pratique de psychologue.
        </p>
        <a class="link-arrow" href="/nutrition-sante/">Voir le volet Nutrition & Santé</a>
      </div>
    </div>
  </section>
```
Le `<style>` ne change pas.

#### 7A — Step 5 : Build vers un dossier propre et captures

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm astro build --outDir "$SCRATCH/dist-7a" 2>&1 | tail -3 && grep -c "soft-wrap" "$SCRATCH/dist-7a/approche/index.html" "$SCRATCH/dist-7a/accompagnements/adolescents-adultes/index.html" "$SCRATCH/dist-7a/accompagnements/perinatalite-parentalite/index.html" "$SCRATCH/dist-7a/accompagnements/enfants-famille/index.html"
```
Expected : `10 page(s) built`, puis `0` pour les 4 fichiers. Captures `browse` 1440×900 de chaque page (hero + l'ancienne bande, en scrollant à `y = 900` et `y = 1700`) **lues** : blob visible, verre lisible devant lui, cartes teintées, pas de vague dans la page (une seule avant le footer).

#### 7B — Step 1 : `src/pages/nutrition-sante.astro`

Imports : remplacer `import Wave from '../components/Wave.astro';` par `import Blob from '../components/Blob.astro';`. Dans la grille des motifs, remplacer `{motifs.map((m) => (<article class="card motifs__card">` par :
```astro
        {motifs.map((m, i) => (
          <article class:list={['card', 'card--spot', i % 2 ? 'card--peach' : 'card--aqua', 'motifs__card']}>
```
Remplacer le bloc `<div class="soft-wrap">` … `</div>` (lignes 52-80) par :
```astro
  <section class="section section--blob focus">
    <Blob variante={4} teinte="aqua-peach" largeur="56vw" position="top: -12%; left: 22vw;" opacite={0.6} />
    <div class="container focus__grid">
      <article class="card card--glass focus__card" data-reveal>
        <span class="overline">TDAH</span>
        <h2 class="headline--sm">Des menus qui aident vraiment</h2>
        <p>
          Pour les personnes présentant un TDAH : des habitudes de vie adaptées
          et des menus alimentaires conçus pour favoriser la concentration,
          l'énergie et le bien-être au quotidien.
        </p>
        <a class="link-arrow" href="/accompagnements/adolescents-adultes/#tdah">L'accompagnement TDAH complet</a>
      </article>
      <article class="card card--glass focus__card" data-reveal>
        <span class="overline overline--sage">Nutrition pédiatrique</span>
        <h2 class="headline--sm">Pour les enfants et leurs familles</h2>
        <p>
          Actuellement en formation en nutrition pédiatrique, je développe une
          expertise spécifique pour accompagner les problématiques et les
          questionnements des enfants autour de l'alimentation — en complément
          de ma pratique de psychologue.
        </p>
        <a class="link-arrow" href="/accompagnements/enfants-famille/">L'accompagnement Enfants & Famille</a>
      </article>
    </div>
  </section>
```
Le `<style>` ne change pas.

#### 7B — Step 2 : `src/pages/a-propos.astro`

Imports (lignes 2-7) :
```ts
import Base from '../layouts/Base.astro';
import PageHero from '../components/PageHero.astro';
import Blob from '../components/Blob.astro';
import Closing from '../components/Closing.astro';
import Portrait from '../components/Portrait.astro';
import { IDENTITE } from '../data/site';
```
Remplacer la `<figure class="apropos__portrait" …>…</figure>` (lignes 25-32) par :
```astro
      <div class="apropos__portrait" data-reveal>
        <Portrait legende="Xénia Van Outryve — psychologue clinicienne en santé et périnatalité" />
      </div>
```
Remplacer le bloc `<div class="soft-wrap">` … `</div>` (lignes 62-87) par :
```astro
  <section class="section section--blob reperes">
    <Blob variante={2} teinte="peach-lilac" largeur="46vw" position="top: -10%; right: -12vw;" opacite={0.6} inverse />
    <div class="container">
      <span class="overline overline--center">Repères</span>
      <h2 class="headline headline--md headline--center">
        Un cadre <em>clair et officiel</em>
      </h2>
      <div class="reperes__grid" data-reveal data-reveal-stagger>
        <div class="card card--spot card--rose reperes__item">
          <p class="reperes__label">Formation</p>
          <p class="reperes__val">{IDENTITE.diplome}</p>
        </div>
        <div class="card card--spot card--lilac reperes__item">
          <p class="reperes__label">Agrément psychologue</p>
          <p class="reperes__val">N° {IDENTITE.agrement}<br /><span>Commission des psychologues</span></p>
        </div>
        <div class="card card--spot card--aqua reperes__item">
          <p class="reperes__label">En cours</p>
          <p class="reperes__val">Formation en nutrition pédiatrique</p>
        </div>
      </div>
    </div>
  </section>
```
Dans `<style>` : supprimer les règles `.apropos__portrait-ph { … }`, `.apropos__portrait-ph p { … }` et `.apropos__portrait figcaption { … }` (le composant les porte). Garder `.apropos__grid`, `.apropos__txt*`, `.reperes__*` et le responsive.

#### 7B — Step 3 : `src/pages/lieux-contact.astro`

Imports : remplacer `import Wave from '../components/Wave.astro';` par `import Blob from '../components/Blob.astro';`.
Section RDV (ligne 73) : `<section class="section section--blob rdv" id="rdv">` et, juste après, avant `<div class="container">` : `<Blob variante={5} teinte="peach-lilac" largeur="44vw" position="bottom: -16%; right: -12vw;" opacite={0.6} />`.
Remplacer le bloc `<div class="soft-wrap">` … `</div>` (lignes 89-153) par :
```astro
  <section class="section section--blob pratique">
    <Blob variante={1} teinte="lilac-rose" largeur="52vw" position="top: -8%; right: -10vw;" opacite={0.6} inverse />
    <div class="container pratique__grid">
      <div data-reveal>
        <span class="overline">Côté pratique</span>
        <h2 class="headline headline--md">
          Les questions qu'on<br />me pose <em>avant de venir</em>
        </h2>
        <div class="actions">
          <a class="btn-pill" href={`tel:${IDENTITE.telephoneIntl}`}>Appeler le {IDENTITE.telephone}</a>
          <a class="link-arrow" href={`mailto:${IDENTITE.email}`}>Écrire un e-mail</a>
        </div>
      </div>
      <dl class="pratique__faq" data-reveal data-reveal-stagger>
        <div class="card card--glass pratique__qa">
          <dt>Comment payer ?</dt>
          <dd>
            Le paiement mobile est accepté en cabinet.
            <!-- À CONFIRMER CLIENTE : tarifs exacts + autres moyens de paiement -->
          </dd>
        </div>
        <div class="card card--glass pratique__qa">
          <dt>Les séances sont-elles remboursées ?</dt>
          <dd>
            Psychologue agréée (n° {IDENTITE.agrement}) : la plupart des
            mutualités interviennent dans le coût des séances. Le montant varie
            selon la vôtre — un justificatif vous est fourni sur demande.
          </dd>
        </div>
        <div class="card card--glass pratique__qa">
          <dt>Faut-il une prescription ?</dt>
          <dd>
            Non : vous pouvez prendre rendez-vous directement, sans passer par
            un médecin.
          </dd>
        </div>
        <div class="card card--glass pratique__qa">
          <dt>Doctoranytime ou Rosa ?</dt>
          <dd>
            Cela dépend simplement du cabinet : Doctoranytime pour
            Court-Saint-Étienne et Nivelles, Rosa pour La Hulpe. Les deux
            montrent mes disponibilités en direct.
          </dd>
        </div>
        <div class="card card--glass pratique__qa">
          <dt>Proposez-vous des consultations en visio ?</dt>
          <dd>
            Oui : quand la distance, l'agenda ou la situation compliquent le
            déplacement, la consultation peut se faire en vidéo. Demandez-le
            par e-mail ou par téléphone.
          </dd>
        </div>
        <div class="card card--glass pratique__qa">
          <dt>Qui consultez-vous ?</dt>
          <dd>
            Les enfants, les adolescents et les adultes — ainsi que les futurs
            et jeunes parents. Si vous hésitez sur la formule, contactez-moi.
          </dd>
        </div>
      </dl>
    </div>
  </section>
```
Coordonnées : les trois `class="card coords__item"` deviennent, dans l'ordre, `class="card card--spot card--rose coords__item"`, `class="card card--spot card--lilac coords__item"`, `class="card card--spot card--aqua coords__item"`.
Dans `<style>` : remplacer `.pratique__qa { background: #fff; border-radius: var(--radius-media); box-shadow: var(--shadow-card); padding: 22px 26px; }` par `.pratique__qa { border-radius: var(--radius-media); padding: 22px 26px; }`.

#### 7B — Step 4 : `src/pages/mentions-legales.astro`

Les quatre `class="card legal__card…"` reçoivent `card--lilac-soft` : `class="card card--lilac-soft legal__card"` (×2) et `class="card card--lilac-soft legal__card legal__card--wide"` (×2). Rien d'autre (les jetons de rythme font le reste ; la 404 ne change pas).

#### 7B — Step 5 : Build vers un dossier propre et captures

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm astro build --outDir "$SCRATCH/dist-7b" 2>&1 | tail -3 && grep -c "soft-wrap" "$SCRATCH/dist-7b/nutrition-sante/index.html" "$SCRATCH/dist-7b/a-propos/index.html" "$SCRATCH/dist-7b/lieux-contact/index.html" "$SCRATCH/dist-7b/mentions-legales/index.html" && grep -o 'maps/search/?api=1&amp;query=[^"]*' "$SCRATCH/dist-7b/lieux-contact/index.html"
```
Expected : `10 page(s) built`, `0` ×4, trois URL d'itinéraire (Combattants, Soignies, Chaussée de Bruxelles). Captures `browse` 1440×900 de chaque page (hero, ancienne bande) **lues** : portrait placeholder sur À propos, FAQ en verre sur blob, cartes teintées, aucune vague dans la page.

---

### Tâche 8 : QA complète (spec §10) — session principale

**Files:** aucun ; corrections ponctuelles dans les fichiers concernés si un point échoue.

- [ ] **Step 1 : Build final sur `dist/` et contrôle statique**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm build 2>&1 | tail -3 && grep -rlc "soft-wrap" dist/ ; echo "vagues par page :" && for f in $(find dist -name index.html); do printf '%s %s\n' "$(grep -o 'class="wave' "$f" | wc -l)" "$f"; done
```
Expected : `10 page(s) built`, aucun fichier avec `soft-wrap`, exactement `1` vague par page (celle du footer).

- [ ] **Step 2 : Hauteurs après (même chaîne qu'en Tâche 0) et comparaison**

```bash
# même boucle qu'en Tâche 0, sortie dans "$SCRATCH/hauteurs-apres.txt", puis :
paste "$SCRATCH/hauteurs-avant.txt" "$SCRATCH/hauteurs-apres.txt" | awk '{printf "%-48s %6d -> %6d  (%+.0f %%)\n", $1, $2, $4, ($4-$2)/$2*100}'
```
Expected : accueil ≤ 6 800 ; chaque page intérieure ≤ 80 % de l'avant. Sinon : réduire `--section-pad` d'un cran ou le padding du hero de la page concernée, rebâtir, remesurer.

- [ ] **Step 3 : Accueil desktop — écran 0, actes, sortie, écrans tous les 800 px, contraste (chaînes de la Tâche 4 Step 4 et Tâche 5 Step 4), console vide.**

- [ ] **Step 4 : Les 8 pages intérieures + 404, desktop ET mobile** : capture du hero et de chaque ancienne bande, `js document.querySelectorAll('.soft-wrap').length` = 0, `js [...document.querySelectorAll('.card--glass')].every(c => c.closest('.section--blob'))` = `true` (sur les pages qui ont du verre), `js document.documentElement.scrollWidth` = largeur du viewport, `console --errors` vide.

- [ ] **Step 5 : Lieux & Contact — les trois liens « Itinéraire »** : `js [...document.querySelectorAll('.lieux__itin')].map(a => a.href)` → trois URL `google.com/maps/search/?api=1&query=…` contenant chacune l'adresse.

- [ ] **Step 6 : Film** : `ffprobe … | sort | uniq -c` = une seule ligne `I` (déjà vérifié en M2) ; sur l'accueil desktop, après 3 s : `js document.querySelector('.hero__film').classList.contains('is-pret')` = `true`.

- [ ] **Step 7 : Lighthouse accueil** (`~/.claude/skills/gstack/browse/dist/browse` a-t-il un `lighthouse` ? sinon `npx lighthouse http://localhost:4331/ --preset=desktop --only-categories=performance,accessibility --quiet --chrome-flags="--headless" --output=json --output-path="$SCRATCH/lh.json"` puis lire `categories.*.score`). Expected : Performance ≥ 0,85, A11y ≥ 0,95.

---

### Tâche 9 : Documentation (PROJET.md, PROJET.html, spec, mémoire)

**Files:**
- Modify: `PROJET.md` (Roadmap + Journal + Architecture), `PROJET.html` (régénéré depuis le MD), `docs/superpowers/specs/2026-09-08-xenia-recomposition-site-design.md` (note datée si une décision a bougé)

- [ ] **Step 1 : Journal `PROJET.md`** — entrée `### 2026-09-09` en tête : ✨ recomposition (hero deux colonnes + scrim + médaillon aquarelle, traversée `+=140%`, blobs, « Qui je suis », rencontre nutrition, cartes teintées, 8 pages, itinéraires), 🎬 film régénéré (crédits dépensés, all-intra vérifié), 🖼️ aquarelle du hero (Kie, candidats), 📏 hauteurs avant → après par page, ⚠️ **« non committé — en attente de validation à l'écran »**. Roadmap : ligne « Recomposition design (spec 2026-09-08) | 🚧 In Progress | 2026-09-09 ». Architecture : `Blob.astro`, `Portrait.astro`, `scripts/illustration_hero.sh`, `scripts/convertir_hero.mjs`.
- [ ] **Step 2 : Régénérer `PROJET.html`** à partir du MD à jour (même structure que l'existant : header, sidebar, badges, timeline).
- [ ] **Step 3 : Mémoire** `xenia-etat-reprise.md` : état « recomposition implémentée en local le 2026-09-09, non committée, à faire valider », pièges rencontrés.

---

## Auto-revue du plan (faite le 2026-09-09)

- **Couverture de la spec** : §3.1 composition → T4 ; §3.2 traversée (tableau des réglages, film, sortie masquée, pétales) → T4 ; §3.3 mobile → T4 ; §3.4 garde-fous → T4 (pré-paint étendu au scrim et au visuel) ; §4 jetons et blobs → T1, T2, T5 ; §5 ordre des sections, « Qui je suis », rencontre, tagline → T5 ; §6 film → M2 ; §7 aquarelle → M1 ; §8.1 commun (PageHero, fin des bandes, verre sur blob, cartes teintées, vague unique, guillemets) → T1, T3, T6, T7 ; §8.2 page par page → T7A/T7B ; §8.3 objectif mesuré → T0 + T8 ; §9 accessibilité/perf → T8 ; §10 vérification → T8 ; §11 hors périmètre respecté (textes inchangés hors micro-ajouts) ; §12 → T9.
- **Placeholders** : aucun « TODO/TBD » ; chaque étape de code porte son code.
- **Cohérence des noms** : `Blob` props `variante/teinte/largeur/position/opacite/inverse` identiques dans T2, T3, T5, T7 ; teintes utilisées (`lilac-aqua`, `peach-rose`, `rose-lilac`, `aqua-peach`, `peach-lilac`, `aqua-lilac`, `lilac-rose`) toutes définies dans `TEINTES` ; `Domaines` prop `teinte` passée sur les 3 pages ; `Portrait` prop `legende` ; classes `card--rose/lilac/aqua/peach/lilac-soft`, `puce-petale`, `section--blob` définies en T1 avant tout usage ; `--muted-hero`, `--scrim-hero(-mobile)` définis en T1, utilisés en T4.
