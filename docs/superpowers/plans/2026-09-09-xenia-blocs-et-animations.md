# Xenia — blocs et animations de l'accueil : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Appliquer la spec `docs/superpowers/specs/2026-09-09-xenia-blocs-et-animations-design.md` : bandeau des thèmes, carrousel des accompagnements à onglets, frise de la première séance, carte dessinée des cabinets, parallaxe des blobs et trait sous les titres — sur l'accueil, avec les étapes réutilisées sur la page Approche.

**Architecture:** Astro 5 statique, données en source unique (`src/data/*.ts`, `src/lib/carte.ts`), un composant par bloc (`Bandeau`, `Carrousel`, `Etapes`, `CarteCabinets`), scripts GSAP différés par composant (patron `onFirstIdle` → `loadGsap`), parallaxe dans `src/lib/blobs.ts` booté depuis `Base.astro`, traits de titre en CSS + `IntersectionObserver` dans `motion.ts`.

**Tech Stack:** Astro ^5.12, GSAP 3 + ScrollTrigger, CSS vanilla à jetons, gstack `browse` pour la QA.

**Règles du chantier :** dossier `C:/Dev/Noveo/_autres/website/xenia` ; **aucun commit/push/redéploiement** (validation à l'écran d'abord) ; aucune couleur en dur hors jetons ; un serveur de dev tourne déjà sur http://localhost:4331 (ne pas en relancer, il sert le HMR) ; deux agents peuvent builder en même temps → **`pnpm astro build --outDir "<scratchpad>/dist-<tache>"`**, jamais deux `pnpm build` concurrents sur `dist/`. Si le dev répond `504 Outdated Optimize Dep` sur GSAP : le lead purge `node_modules/.vite` et relance le dev. Le daemon `browse` est partagé : **toujours `newtab` en tête de chaîne**, et attendre ≥ 3 s après un saut de scroll avant une capture.

---

## Structure des fichiers

| Fichier | Responsabilité |
|---|---|
| `src/data/themes.ts` | **Neuf.** Les 10 capsules du bandeau (libellé, teinte, lien) |
| `src/data/accompagnements.ts` | **Neuf.** Les 4 entrées du carrousel (textes existants des pages) + la ligne « Où » |
| `src/data/etapes.ts` | **Neuf.** Les 3 étapes de la première séance (textes d'Approche) |
| `src/lib/carte.ts` | **Neuf.** Contour simplifié du Brabant wallon (`d` figé), liaison, positions des 3 cabinets |
| `src/lib/blobs.ts` | **Neuf.** `bootBlobs` : parallaxe scrubée des `.blob[data-parallaxe]` (desktop) |
| `src/lib/motion.ts` | + `bootTraits` (IntersectionObserver → `is-vu`) |
| `src/styles/global.css` | + `.chip*`, `.headline--trait`, règles `html.js` |
| `src/layouts/Base.astro` | + classe `js` pré-paint, boot de `bootBlobs` et `bootTraits` |
| `src/components/Blob.astro` | + prop `parallaxe`, dérive sur `translate` (desktop seulement) |
| `src/components/Bandeau.astro` | **Neuf.** Capsules qui défilent |
| `src/components/Carrousel.astro` | **Neuf.** Onglets + panneaux + flèches + pause, script |
| `src/components/Etapes.astro` | **Neuf.** Frise horizontale / verticale, ligne qui se trace |
| `src/components/CarteCabinets.astro` | **Neuf.** SVG de la carte, script scrub |
| `src/components/LieuxCards.astro` | + prop `compact` |
| `src/pages/index.astro` | Nouvel ordre, carrousel à la place des 3 cartes, frise, carte, traits, parallaxe |
| `src/pages/approche.astro` | Les étapes via `<Etapes vertical />` |

Ordre : T1 (socle, un agent) → T2, T3, T4, T5 en parallèle (fichiers disjoints, `--outDir` propre à chacun) → T6 (accueil) → T7 (QA, lead) → T8 (doc, lead).

---

### Tâche 1 : Socle — données, jetons, parallaxe, traits

**Files:**
- Create: `src/data/themes.ts`, `src/data/accompagnements.ts`, `src/data/etapes.ts`, `src/lib/carte.ts`, `src/lib/blobs.ts`
- Modify: `src/styles/global.css`, `src/lib/motion.ts`, `src/layouts/Base.astro`, `src/components/Blob.astro`

- [ ] **Step 1 : `src/data/themes.ts`**

```ts
/* Les thèmes du bandeau — une capsule = un libellé, une teinte, la page qui en parle.
   Source unique (Bandeau.astro). Teinte « sage » = le volet nutrition. */
export type TeinteChip = 'rose' | 'lilac' | 'aqua' | 'peach' | 'sage';
export interface Theme { label: string; teinte: TeinteChip; href: string }

export const THEMES: Theme[] = [
  { label: 'Stress & anxiété', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Burn-out', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Douleur & maladie chronique', teinte: 'peach', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Sommeil & insomnies', teinte: 'peach', href: '/accompagnements/adolescents-adultes/' },
  { label: 'TDAH', teinte: 'aqua', href: '/accompagnements/adolescents-adultes/#tdah' },
  { label: 'Périnatalité', teinte: 'lilac', href: '/accompagnements/perinatalite-parentalite/' },
  { label: 'Parentalité', teinte: 'lilac', href: '/accompagnements/perinatalite-parentalite/' },
  { label: 'Enfants & famille', teinte: 'aqua', href: '/accompagnements/enfants-famille/' },
  { label: 'Nutrition & santé', teinte: 'sage', href: '/nutrition-sante/' },
  { label: 'Transitions de vie', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
];
```

- [ ] **Step 2 : `src/data/accompagnements.ts`** (textes = ceux des cartes et des heros de pages existants, rien d'inventé)

```ts
/* Les 4 entrées du carrousel de l'accueil. Textes repris tels quels des cartes
   de l'accueil (desc) et des titres des pages (titre + accroche). */
import { LIEUX } from './site';

export type TeinteAcc = 'rose' | 'lilac' | 'aqua' | 'sage';
export interface Accompagnement {
  slug: string;
  onglet: string;
  titre: string;     // début du titre
  accroche: string;  // la partie en italique framboise
  desc: string;
  illu: string;
  illuAlt: string;
  teinte: TeinteAcc;
  href: string;
}

export const ACCOMPAGNEMENTS: Accompagnement[] = [
  {
    slug: 'ado-adultes',
    onglet: 'Adolescents & Adultes',
    titre: 'Stress, anxiété, épuisement :',
    accroche: 'en parler, avancer',
    desc: 'Stress, anxiété, burn-out, insomnies, douleurs chroniques, TDAH : reprendre pied quand le quotidien déborde.',
    illu: '/media/illu/ado-adultes-card.webp',
    illuAlt: 'Aquarelle pastel : un fauteuil près d’une grande fenêtre lumineuse',
    teinte: 'rose',
    href: '/accompagnements/adolescents-adultes/',
  },
  {
    slug: 'perinatalite',
    onglet: 'Périnatalité & Parentalité',
    titre: 'Devenir parent bouscule tout.',
    accroche: 'Vous n’êtes pas seuls.',
    desc: 'Désir d’enfant, grossesse, post-partum, burn-out parental : être soutenu·e dans ces périodes qui transforment tout.',
    illu: '/media/illu/perinatalite-card.webp',
    illuAlt: 'Aquarelle pastel : deux pétales translucides, l’un abritant l’autre',
    teinte: 'lilac',
    href: '/accompagnements/perinatalite-parentalite/',
  },
  {
    slug: 'enfants',
    onglet: 'Enfants & Famille',
    titre: 'Quand votre enfant ne va pas bien,',
    accroche: 'toute la famille le sent',
    desc: 'Comportement, intégration, émotions : aider votre enfant à dire ce qu’il vit, souvent par le jeu et la création.',
    illu: '/media/illu/enfants-card.webp',
    illuAlt: 'Aquarelle pastel : des crayons de cire et un dessin de soleil',
    teinte: 'aqua',
    href: '/accompagnements/enfants-famille/',
  },
  {
    slug: 'nutrition',
    onglet: 'Nutrition & Santé',
    titre: 'Mieux manger, mieux dormir,',
    accroche: 'mieux vivre',
    desc: 'Sommeil, alimentation, mouvement : des leviers concrets de votre équilibre — sans régime culpabilisant, sans injonctions.',
    illu: '/media/illu/nutrition-card.webp',
    illuAlt: 'Aquarelle pastel : un bol de fruits et une tasse de thé fumante sur une table au matin',
    teinte: 'sage',
    href: '/nutrition-sante/',
  },
];

/* La ligne « Où » — identique pour les 4, tirée des lieux */
export const OU = `${LIEUX.map((l) => l.ville).join(' · ')} · visio — rendez-vous en ligne`;
```

- [ ] **Step 3 : `src/data/etapes.ts`**

```ts
/* La première séance en 3 étapes — textes de la page Approche, source unique
   (frise de l'accueil + liste verticale d'Approche). */
export interface Etape { titre: string; desc: string }
export const ETAPES: Etape[] = [
  { titre: 'Vous arrivez comme vous êtes', desc: 'Pas besoin de préparer quoi que ce soit, ni d’avoir «\u00A0les bons mots\u00A0».' },
  { titre: 'On fait connaissance', desc: 'Ce qui vous amène, votre contexte, ce que vous attendez — et vos questions.' },
  { titre: 'On décide ensemble', desc: 'La fréquence, les priorités, la manière de travailler : rien n’est figé d’avance.' },
];
```

- [ ] **Step 4 : `src/lib/carte.ts`** (tracé figé, généré le 2026-09-09 depuis 24 points lissés en cubiques ; viewBox 0 0 400 240 ; positions dérivées des coordonnées réelles)

```ts
/* La carte dessinée des cabinets : contour SIMPLIFIÉ du Brabant wallon (une
   évocation, pas une carte), la courbe qui relie les trois cabinets, et leurs
   positions dans le viewBox 0 0 400 240. Tout est figé : build reproductible. */
export const CONTOUR =
  'M18 128C20 119 31 106 40 96C49 86 60 76 70 70C80 64 89 62 100 58C111 54 123 45 135 44C147 43 159 53 170 52C181 51 188 38 200 36C212 34 228 38 240 42C252 46 262 57 275 58C288 59 305 50 320 48C335 46 354 41 365 44C376 47 384 57 385 66C386 75 378 88 372 100C366 112 358 129 350 140C342 151 333 161 322 168C311 175 297 177 285 182C273 187 262 191 250 196C238 201 227 210 215 212C203 214 191 205 180 205C169 205 162 214 150 214C138 214 122 210 110 206C98 202 90 196 80 190C70 184 59 175 50 168C41 161 33 157 28 150C23 143 16 137 18 128z';

/* Nivelles → Court-Saint-Étienne → La Hulpe */
export const LIAISON = 'M95 178 Q 150 172 198 157 Q 200 110 161 86';

export interface PointCarte { slug: string; nom: string; x: number; y: number; dx: number; dy: number; ancre: 'start' | 'middle' | 'end' }
export const POINTS: PointCarte[] = [
  { slug: 'nivelles', nom: 'Nivelles', x: 95, y: 178, dx: 0, dy: 24, ancre: 'middle' },
  { slug: 'court-saint-etienne', nom: 'Court-Saint-Étienne', x: 198, y: 157, dx: 12, dy: 16, ancre: 'start' },
  { slug: 'la-hulpe', nom: 'La Hulpe', x: 161, y: 86, dx: 12, dy: -6, ancre: 'start' },
];
```

- [ ] **Step 5 : `src/lib/blobs.ts`**

```ts
/* Parallaxe des blobs : chaque .blob[data-parallaxe] glisse de -amp à +amp
   pendant que sa section traverse l'écran. Desktop seulement (en mobile le
   blob est un lavis centré, sans dérive). GSAP écrit `transform` ; la dérive
   CSS du blob vit sur `translate` (Blob.astro), donc pas de conflit. */
import { isDesktop } from './motion';

type GsapModules = {
  gsap: typeof import('gsap').default;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

export function bootBlobs({ gsap, ScrollTrigger }: GsapModules) {
  if (!isDesktop()) return;
  document.querySelectorAll<HTMLElement>('.blob[data-parallaxe]').forEach((blob) => {
    const amp = Number(blob.dataset.parallaxe) || 40;
    const section = blob.parentElement;
    if (!section) return;
    gsap.fromTo(
      blob,
      { y: -amp },
      {
        y: amp,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
      }
    );
  });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
```

- [ ] **Step 6 : `src/lib/motion.ts` — ajouter `bootTraits` à la fin du fichier**

```ts
/* Trait sous le mot pivot des titres de section (.headline--trait) : la classe
   is-vu déclenche la transition CSS (scaleX 0 → 1), une fois, à 60 % de
   visibilité. Sans IntersectionObserver ou en reduced-motion : posé d'emblée. */
export function bootTraits() {
  const titres = document.querySelectorAll<HTMLElement>('.headline--trait');
  if (!titres.length) return;
  if (REDUCED || !('IntersectionObserver' in window)) {
    titres.forEach((t) => t.classList.add('is-vu'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-vu');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  titres.forEach((t) => io.observe(t));
}
```

- [ ] **Step 7 : `src/styles/global.css` — ajouter après le bloc `.puce-petale::before { … }`**

```css
/* Capsules de thème (bandeau sous le hero) */
.chip {
  display: inline-flex; align-items: center;
  padding: 9px 16px; border-radius: var(--radius-pill);
  font-size: 0.86rem; font-weight: 600; color: var(--ink); text-decoration: none;
  white-space: nowrap;
  border: 1px solid var(--glass-border);
  transition: transform 0.25s var(--ease), box-shadow 0.25s ease;
}
.chip:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.chip--rose { background: var(--tint-rose); }
.chip--lilac { background: var(--tint-lilac); }
.chip--aqua { background: var(--tint-aqua); }
.chip--peach { background: var(--tint-peach); }
.chip--sage { background: var(--tint-aqua); color: var(--sage-deep); }

/* Trait de pinceau sous le mot pivot des titres de section : tracé à l'entrée
   (classe is-vu posée par bootTraits). Sans JS : trait visible d'emblée. */
.headline--trait em { position: relative; display: inline-block; }
.headline--trait em::after {
  content: ''; position: absolute; left: -0.04em; right: -0.04em; bottom: -0.04em;
  height: 0.14em; border-radius: 999px; z-index: -1;
  background: linear-gradient(90deg, var(--framboise), var(--rose));
  opacity: 0.55;
  transform-origin: left center;
  transition: transform 0.9s var(--ease) 0.15s;
}
html.js .headline--trait em::after { transform: scaleX(0); }
html.js .headline--trait.is-vu em::after { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  .headline--trait em::after { transition: none; }
  .chip { transition: none; }
}
```

- [ ] **Step 8 : `src/layouts/Base.astro`**

Dans `<head>`, juste après `<meta name="theme-color" …>` : `<script is:inline>document.documentElement.classList.add('js');</script>`.
Remplacer le début du `<script>` du body :
```ts
      import { REDUCED, loadGsap, onFirstIdle, bootReveals, bootTraits } from '../lib/motion';
      import { bootBlobs } from '../lib/blobs';
      bootTraits();
      if (!REDUCED) {
        onFirstIdle(() => {
          loadGsap().then((m) => {
            bootReveals(m);
            bootBlobs(m);
          });
        });
      }
```
(le bloc spotlight qui suit ne change pas).

- [ ] **Step 9 : `src/components/Blob.astro`**

Frontmatter : ajouter à `Props` la ligne `parallaxe?: number | boolean;  // amplitude px de la parallaxe scrubée (true = 40)` ; au destructuring `parallaxe = false` ; sur la `div` : `data-parallaxe={parallaxe ? String(parallaxe === true ? 40 : parallaxe) : undefined}`.
Styles : dans `.blob { … }` retirer la ligne `animation: blob-derive 30s ease-in-out infinite alternate;` et la règle `.blob--inverse { … }` ; remplacer `@keyframes blob-derive { … }` par :
```css
  /* Dérive lente sur `translate` (desktop) : GSAP garde `transform` pour la parallaxe */
  @media (min-width: 961px) {
    .blob { animation: blob-derive 30s ease-in-out infinite alternate; }
    .blob--inverse { animation-direction: alternate-reverse; animation-duration: 26s; }
  }
  @keyframes blob-derive {
    from { translate: 0 0; rotate: 0deg; }
    to { translate: 26px -20px; rotate: 3deg; }
  }
```

- [ ] **Step 10 : Build**

```bash
cd C:/Dev/Noveo/_autres/website/xenia && pnpm astro build --outDir "<scratchpad>/dist-t1" 2>&1 | tail -2
```
Expected : `10 page(s) built`. Puis, sur http://localhost:4331/approche/ (chaîne browse 1440×900) : `document.documentElement.classList.contains('js')` = true ; scroll de 800 px + 1,5 s : `getComputedStyle(document.querySelector('.blob')).translate` non vide (dérive), `document.querySelector('.blob').style.transform` (encore vide : aucun `data-parallaxe` posé avant T6 — normal).

---

### Tâche 2 : `Bandeau.astro`

**Files:** Create `src/components/Bandeau.astro`

- [ ] **Step 1 : Écrire le composant**

```astro
---
/* Bandeau des thèmes : capsules teintées qui défilent lentement sous le hero.
   Tout en CSS : piste = deux copies de la liste, translateX(-50 %) en boucle,
   pause au survol et au focus (on ne perd pas un lien en tabulant), fondu aux
   bords. Reduced-motion : liste statique en flex-wrap. La copie porte
   aria-hidden et ses liens sortent du tab order. */
import { THEMES } from '../data/themes';
---
<nav class="bandeau" aria-label="Thèmes">
  <div class="bandeau__piste">
    {[0, 1].map((copie) => (
      <ul class="bandeau__liste" aria-hidden={copie === 1 ? 'true' : undefined}>
        {THEMES.map((t) => (
          <li>
            <a class:list={['chip', `chip--${t.teinte}`]} href={t.href} tabindex={copie === 1 ? -1 : undefined}>{t.label}</a>
          </li>
        ))}
      </ul>
    ))}
  </div>
</nav>

<style>
  .bandeau {
    position: relative; padding-block: 18px; overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .bandeau__piste {
    display: flex; width: max-content;
    animation: bandeau-defile 60s linear infinite;
    will-change: transform;
  }
  .bandeau:hover .bandeau__piste,
  .bandeau:focus-within .bandeau__piste { animation-play-state: paused; }
  /* padding 6 px de chaque côté + gap 12 px : la couture entre les deux copies
     mesure exactement un gap, la boucle est invisible */
  .bandeau__liste { display: flex; gap: 12px; margin: 0; padding: 0 6px; list-style: none; }
  @keyframes bandeau-defile {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .bandeau { -webkit-mask-image: none; mask-image: none; }
    .bandeau__piste { animation: none; width: auto; justify-content: center; }
    .bandeau__liste { flex-wrap: wrap; justify-content: center; padding-inline: var(--gutter); }
    .bandeau__liste[aria-hidden] { display: none; }
  }
</style>
```

- [ ] **Step 2 : Build (`--outDir <scratchpad>/dist-t2`) → `10 page(s) built`.** Le composant n'est branché qu'en T6 ; pour le voir, l'agent peut l'insérer temporairement dans `src/pages/404.astro` sous `<section class="nf">`, capturer, puis **retirer l'insertion** (vérifier `git diff src/pages/404.astro` vide). Attendu sur la capture : une rangée de capsules pastel, fondue aux bords ; mesure : `getComputedStyle(document.querySelector('.bandeau__piste')).transform` différent à t et t+1 s ; au survol (`hover` browse sur `.bandeau`) la valeur ne bouge plus.

---

### Tâche 3 : `Carrousel.astro`

**Files:** Create `src/components/Carrousel.astro`

- [ ] **Step 1 : Écrire le composant (markup + script + styles)**

```astro
---
/* Carrousel des accompagnements : 4 onglets (patron ARIA tabs), une carte
   par panneau, flèches, défilement auto lent et pausable. Sans JS : les 4
   panneaux se suivent, onglets/flèches/pause masqués. */
import { ACCOMPAGNEMENTS, OU } from '../data/accompagnements';
---
<div class="carrousel" data-carrousel>
  <div class="carrousel__onglets" role="tablist" aria-label="Accompagnements">
    {ACCOMPAGNEMENTS.map((a, i) => (
      <button
        class:list={['carrousel__onglet', `carrousel__onglet--${a.teinte}`]}
        role="tab"
        type="button"
        id={`onglet-${a.slug}`}
        aria-controls={`panneau-${a.slug}`}
        aria-selected={i === 0 ? 'true' : 'false'}
        tabindex={i === 0 ? 0 : -1}
      >{a.onglet}</button>
    ))}
  </div>
  <div class="carrousel__scene">
    <button class="carrousel__fleche carrousel__fleche--prec" type="button" aria-label="Accompagnement précédent">‹</button>
    <div class="carrousel__panneaux">
      {ACCOMPAGNEMENTS.map((a, i) => (
        <div
          class:list={['carrousel__panneau', { 'is-actif': i === 0 }]}
          role="tabpanel"
          id={`panneau-${a.slug}`}
          aria-labelledby={`onglet-${a.slug}`}
          tabindex="0"
        >
          <article class="card card--spot carrousel__carte">
            <figure class:list={['carrousel__illu', `carrousel__illu--${a.teinte}`]}>
              <img src={a.illu} alt={a.illuAlt} width="640" height="480" loading="lazy" />
            </figure>
            <div class="carrousel__txt">
              <span class:list={['overline', { 'overline--sage': a.teinte === 'sage' }]}>{a.onglet}</span>
              <h3 class="headline headline--md">{a.titre} <em>{a.accroche}</em></h3>
              <p class="carrousel__desc">{a.desc}</p>
              <p class="carrousel__ou puce-petale">{OU}</p>
              <a class="link-arrow" href={a.href}>Découvrir</a>
            </div>
          </article>
        </div>
      ))}
    </div>
    <button class="carrousel__fleche carrousel__fleche--suiv" type="button" aria-label="Accompagnement suivant">›</button>
  </div>
  <button class="carrousel__pause" type="button" aria-pressed="false">
    <span class="carrousel__pause-ico" aria-hidden="true"></span>
    <span class="carrousel__pause-txt">Pause</span>
  </button>
</div>

<script>
  import { REDUCED, loadGsap } from '../lib/motion';

  const racine = document.querySelector<HTMLElement>('[data-carrousel]');
  if (racine) {
    racine.classList.add('is-js');
    const onglets = Array.from(racine.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panneaux = Array.from(racine.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const scene = racine.querySelector<HTMLElement>('.carrousel__scene')!;
    const pause = racine.querySelector<HTMLButtonElement>('.carrousel__pause')!;
    const pauseTxt = pause.querySelector<HTMLElement>('.carrousel__pause-txt')!;
    let actif = 0;
    let enTransition = false;
    let visible = false;
    let reprise = 0;
    let enPause = REDUCED;
    let gsapRef: typeof import('gsap').default | null = null;
    if (!REDUCED) loadGsap().then(({ gsap }) => { gsapRef = gsap; });

    /* Toute interaction suspend le défilement automatique 20 s */
    const interaction = () => { reprise = Date.now() + 20000; };

    const montrer = (i: number, sens: 1 | -1) => {
      if (i === actif || enTransition) return;
      const sortant = panneaux[actif];
      const entrant = panneaux[i];
      onglets[actif].setAttribute('aria-selected', 'false');
      onglets[actif].tabIndex = -1;
      onglets[i].setAttribute('aria-selected', 'true');
      onglets[i].tabIndex = 0;
      if (gsapRef) {
        const g = gsapRef;
        enTransition = true;
        scene.classList.add('is-transition');
        entrant.classList.add('is-actif');
        g.to(sortant, {
          x: -24 * sens, opacity: 0, duration: 0.35, ease: 'power2.in',
          onComplete: () => { sortant.classList.remove('is-actif'); g.set(sortant, { clearProps: 'all' }); },
        });
        g.fromTo(entrant, { x: 24 * sens, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.12,
          onComplete: () => { enTransition = false; scene.classList.remove('is-transition'); g.set(entrant, { clearProps: 'all' }); },
        });
      } else {
        sortant.classList.remove('is-actif');
        entrant.classList.add('is-actif');
      }
      actif = i;
    };
    const suivant = (d: 1 | -1) => montrer((actif + d + panneaux.length) % panneaux.length, d);

    onglets.forEach((o, i) => {
      o.addEventListener('click', () => { interaction(); montrer(i, i > actif ? 1 : -1); });
      o.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        interaction();
        suivant(e.key === 'ArrowRight' ? 1 : -1);
        onglets[actif].focus();
      });
    });
    racine.querySelector('.carrousel__fleche--prec')!.addEventListener('click', () => { interaction(); suivant(-1); });
    racine.querySelector('.carrousel__fleche--suiv')!.addEventListener('click', () => { interaction(); suivant(1); });
    pause.addEventListener('click', () => {
      enPause = !enPause;
      pause.setAttribute('aria-pressed', String(enPause));
      pauseTxt.textContent = enPause ? 'Lecture' : 'Pause';
    });

    /* Auto : 7 s, seulement visible, non survolé, sans focus dedans, hors pause */
    new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.4 }).observe(racine);
    window.setInterval(() => {
      if (enPause || !visible || Date.now() < reprise) return;
      if (racine.matches(':hover') || racine.contains(document.activeElement)) return;
      suivant(1);
    }, 7000);
  }
</script>

<style>
  .carrousel { position: relative; margin-top: var(--headline-gap); }
  /* Onglets capsule */
  .carrousel__onglets { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 28px; }
  .carrousel__onglet {
    padding: 10px 18px; border-radius: var(--radius-pill);
    border: 1.5px solid var(--sep); background: transparent;
    font-size: 0.92rem; font-weight: 600; color: var(--ink); cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s var(--ease);
  }
  .carrousel__onglet:hover { transform: translateY(-1px); }
  .carrousel__onglet[aria-selected="true"] { border-color: transparent; }
  .carrousel__onglet--rose[aria-selected="true"] { background: var(--tint-rose); }
  .carrousel__onglet--lilac[aria-selected="true"] { background: var(--tint-lilac); }
  .carrousel__onglet--aqua[aria-selected="true"] { background: var(--tint-aqua); }
  .carrousel__onglet--sage[aria-selected="true"] { background: var(--tint-aqua); color: var(--sage-deep); }
  /* Scène : flèche | panneaux superposés | flèche */
  .carrousel__scene { display: grid; grid-template-columns: 48px 1fr 48px; align-items: center; gap: 12px; }
  .carrousel__panneaux { display: grid; }
  .carrousel__panneau { grid-area: 1 / 1; }
  .carrousel__panneau:focus-visible { outline-offset: 6px; }
  .is-js .carrousel__panneau:not(.is-actif) { visibility: hidden; pointer-events: none; }
  .is-transition .carrousel__panneau { pointer-events: none; }
  /* Sans JS : les panneaux se suivent, les commandes disparaissent */
  .carrousel:not(.is-js) .carrousel__panneaux { display: block; }
  .carrousel:not(.is-js) .carrousel__panneau + .carrousel__panneau { margin-top: var(--gap-grid); }
  .carrousel:not(.is-js) .carrousel__onglets,
  .carrousel:not(.is-js) .carrousel__fleche,
  .carrousel:not(.is-js) .carrousel__pause { display: none; }
  /* La carte */
  .carrousel__carte {
    display: grid; grid-template-columns: 0.8fr 1.2fr;
    gap: clamp(24px, 4vw, 48px); align-items: center;
    padding: var(--pad-card);
  }
  .carrousel__illu {
    margin: 0; overflow: hidden; isolation: isolate; aspect-ratio: 4 / 3;
    border-radius: var(--radius-organique);
    background: linear-gradient(150deg, var(--peach), var(--rose));
    outline: 1px solid var(--glass-border); outline-offset: -1px;
  }
  .carrousel__illu--lilac { background: linear-gradient(150deg, var(--lilac), var(--rose)); }
  .carrousel__illu--aqua { background: linear-gradient(150deg, var(--aqua), var(--lilac)); }
  .carrousel__illu--sage { background: linear-gradient(150deg, var(--aqua), var(--peach)); }
  .carrousel__illu img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }
  .carrousel__txt .headline { margin-top: 8px; }
  .carrousel__desc { margin-top: 14px; color: var(--muted); font-size: 1.02rem; line-height: 1.6; }
  .carrousel__ou { margin-top: 16px; font-size: 0.9rem; color: var(--muted); }
  .carrousel__txt .link-arrow { margin-top: 20px; }
  /* Flèches en verre */
  .carrousel__fleche {
    width: 48px; height: 48px; border-radius: 50%;
    border: 1px solid var(--glass-border); background: var(--glass-bg);
    -webkit-backdrop-filter: var(--glass-blur); backdrop-filter: var(--glass-blur);
    box-shadow: var(--shadow-glass);
    font-family: var(--font-display); font-size: 1.6rem; line-height: 1; color: var(--framboise);
    cursor: pointer; transition: transform 0.25s var(--ease);
  }
  .carrousel__fleche:hover { transform: scale(1.06); }
  /* Pause / lecture — discret, obligatoire pour un contenu qui bouge seul */
  .carrousel__pause {
    margin: 18px auto 0; display: flex; align-items: center; gap: 8px;
    padding: 6px 12px; border: 0; background: transparent; border-radius: var(--radius-pill);
    color: var(--muted); font-size: 0.8rem; cursor: pointer;
  }
  .carrousel__pause:hover { color: var(--framboise); }
  .carrousel__pause-ico { width: 10px; height: 10px; box-sizing: border-box; border-left: 3px solid currentColor; border-right: 3px solid currentColor; }
  .carrousel__pause[aria-pressed="true"] .carrousel__pause-ico {
    width: 0; height: 0; border-left: 10px solid currentColor;
    border-right: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent;
  }
  @media (max-width: 960px) {
    .carrousel__scene { grid-template-columns: 1fr 1fr; row-gap: 16px; }
    .carrousel__panneaux { grid-column: 1 / -1; grid-row: 1; }
    .carrousel__fleche { grid-row: 2; justify-self: center; }
    .carrousel__carte { grid-template-columns: 1fr; }
    .carrousel__illu { max-width: 240px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .carrousel__onglet, .carrousel__fleche { transition: none; }
  }
</style>
```

- [ ] **Step 2 : Build (`--outDir <scratchpad>/dist-t3`) → `10 page(s) built`.** Insertion temporaire dans `404.astro` pour vérifier (puis retrait, `git diff src/pages/404.astro` vide) : 4 onglets, un seul panneau visible, clic sur un onglet → panneau change (mesure `[...document.querySelectorAll('[role=tabpanel]')].map(p => getComputedStyle(p).visibility)`), ArrowRight sur l'onglet actif → suivant, attente 8 s sans survol → panneau suivant tout seul, bouton pause → `aria-pressed="true"` et plus de changement après 8 s, `js document.querySelector('[data-carrousel]').classList.remove('is-js')` → les 4 panneaux visibles empilés. Console vide.

---

### Tâche 4 : `Etapes.astro` + page Approche

**Files:** Create `src/components/Etapes.astro` ; Modify `src/pages/approche.astro`

- [ ] **Step 1 : Écrire le composant**

```astro
---
/* La première séance en 3 étapes : frise horizontale (accueil) ou liste
   verticale (Approche). Une ligne SVG relie les cercles numérotés ; au scroll
   (desktop), la ligne se trace et chaque cercle s'allume quand elle l'atteint.
   Reduced-motion et sans JS : tout visible. */
import { ETAPES } from '../data/etapes';
interface Props { vertical?: boolean }
const { vertical = false } = Astro.props;
---
<ol class:list={['etapes', { 'etapes--vertical': vertical }]} data-etapes>
  <svg class="etapes__ligne" viewBox={vertical ? '0 0 2 100' : '0 0 100 2'} preserveAspectRatio="none" aria-hidden="true">
    <path d={vertical ? 'M1 0 V100' : 'M0 1 H100'} pathLength="1" />
  </svg>
  {ETAPES.map((e, i) => (
    <li class="etapes__etape">
      <span class="etapes__num" aria-hidden="true">{i + 1}</span>
      <div class="etapes__txt">
        <h3>{e.titre}</h3>
        <p>{e.desc}</p>
      </div>
    </li>
  ))}
</ol>

<script>
  import { REDUCED, loadGsap, onFirstIdle } from '../lib/motion';
  if (!REDUCED) {
    onFirstIdle(() => {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        document.querySelectorAll<HTMLElement>('[data-etapes]').forEach((ol) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: ol, start: 'top 78%', end: 'top 30%', scrub: 0.6 },
          });
          tl.fromTo(ol.querySelector('.etapes__ligne path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);
          ol.querySelectorAll('.etapes__num').forEach((n, i) => {
            tl.fromTo(n, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.6)' }, i * 0.4);
          });
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
  }
</script>

<style>
  .etapes {
    position: relative; margin: 0; padding: 0; list-style: none;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  }
  /* La ligne relie les centres des cercles (colonnes à 1/6, 3/6, 5/6) */
  .etapes__ligne {
    position: absolute; top: 23px; left: 16.66%; right: 16.66%;
    width: auto; height: 2px; overflow: visible;
  }
  .etapes__ligne path {
    fill: none; stroke: var(--framboise); stroke-width: 2; stroke-opacity: 0.55;
    stroke-dasharray: 1 1; stroke-dashoffset: 0; vector-effect: non-scaling-stroke;
  }
  .etapes__etape { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
  .etapes__num {
    position: relative; z-index: 1;
    width: 46px; height: 46px; border-radius: 50%; flex: none;
    display: grid; place-items: center;
    background: linear-gradient(135deg, var(--tint-rose), var(--tint-lilac)), var(--ivory);
    font-family: var(--font-display); font-weight: 640; color: var(--framboise);
    box-shadow: var(--shadow-card);
  }
  .etapes__txt h3 { font-size: 1.05rem; font-weight: 700; }
  .etapes__txt p { margin-top: 4px; color: var(--muted); font-size: 0.94rem; line-height: 1.55; text-wrap: pretty; }
  /* Variante verticale (Approche, et mobile) */
  .etapes--vertical, .etapes.is-mobile { grid-template-columns: 1fr; gap: 26px; }
  .etapes--vertical .etapes__ligne { top: 23px; bottom: 23px; left: 22px; right: auto; width: 2px; height: auto; }
  .etapes--vertical .etapes__etape { flex-direction: row; text-align: left; gap: 18px; align-items: flex-start; }
  @media (max-width: 960px) {
    .etapes { grid-template-columns: 1fr; gap: 26px; }
    .etapes__ligne { display: none; }
    .etapes__etape { flex-direction: row; text-align: left; gap: 18px; align-items: flex-start; }
  }
</style>
```
(en mobile la frise horizontale devient une liste verticale sans ligne ; la variante `--vertical` d'Approche garde sa ligne à gauche sur desktop et la perd aussi sous 960 px : cohérent).

- [ ] **Step 2 : `src/pages/approche.astro`** — ajouter `import Etapes from '../components/Etapes.astro';` ; remplacer tout le `<ul class="premiere__steps" data-reveal data-reveal-stagger> … </ul>` par `<div data-reveal><Etapes vertical /></div>` ; supprimer les règles `.premiere__steps`, `.premiere__steps li`, `.premiere__num`, `.premiere__num::after`, `.premiere__steps h3`, `.premiere__steps p` du `<style>`.

- [ ] **Step 3 : Build (`--outDir <scratchpad>/dist-t4`)**, capture de `/approche/` à la section « première séance » (attendre 3 s) : 3 étapes numérotées en colonne avec la ligne à gauche, `getComputedStyle(document.querySelector('.etapes__ligne path')).strokeDashoffset` = `0px` une fois la section passée. Console vide.

---

### Tâche 5 : `CarteCabinets.astro` + `LieuxCards` compact

**Files:** Create `src/components/CarteCabinets.astro` ; Modify `src/components/LieuxCards.astro`

- [ ] **Step 1 : Écrire le composant**

```astro
---
/* La carte dessinée des cabinets : contour simplifié du Brabant wallon, trois
   pastilles et la courbe qui les relie, sur un lavis pastel. Décorative
   (aria-hidden) : les cartes de lieux portent l'information. Au scroll
   (desktop) : le contour se trace, la courbe se dessine, les pastilles
   s'allument une à une. Reduced-motion et sans JS : tout dessiné. */
import { CONTOUR, LIAISON, POINTS } from '../lib/carte';
---
<div class="carte" data-carte aria-hidden="true">
  <svg class="carte__svg" viewBox="0 0 400 240">
    <path class="carte__contour" d={CONTOUR} pathLength="1" />
    <path class="carte__liaison" d={LIAISON} pathLength="1" />
    {POINTS.map((p) => (
      <g class="carte__point">
        <circle class="carte__halo" cx={p.x} cy={p.y} r="14" />
        <circle class="carte__pastille" cx={p.x} cy={p.y} r="6" />
        <text class="carte__nom" x={p.x + p.dx} y={p.y + p.dy} text-anchor={p.ancre}>{p.nom}</text>
      </g>
    ))}
    <text class="carte__titre" x="392" y="230" text-anchor="end">Brabant wallon</text>
  </svg>
</div>

<script>
  import { REDUCED, loadGsap, onFirstIdle } from '../lib/motion';
  if (!REDUCED) {
    onFirstIdle(() => {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        const carte = document.querySelector<HTMLElement>('[data-carte]');
        if (!carte) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: carte, start: 'top 80%', end: 'top 20%', scrub: 0.6 },
        });
        tl.fromTo(carte.querySelector('.carte__contour'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 0)
          .fromTo(carte.querySelector('.carte__liaison'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 0.35);
        carte.querySelectorAll<SVGGElement>('.carte__point').forEach((g, i) => {
          const t = 0.45 + i * 0.2;
          tl.fromTo(g.querySelector('.carte__pastille'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.1, ease: 'back.out(2)' }, t)
            .fromTo(g.querySelector('.carte__halo'), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 0.22, duration: 0.15, ease: 'power2.out' }, t)
            .fromTo(g.querySelector('.carte__nom'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.1 }, t + 0.05);
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
  }
</script>

<style>
  .carte { position: relative; isolation: isolate; }
  /* Le lavis derrière la carte */
  .carte::before {
    content: ''; position: absolute; inset: 6% -4%; z-index: -1;
    border-radius: var(--radius-organique);
    background: linear-gradient(135deg, var(--peach), var(--lilac));
    opacity: 0.45;
  }
  .carte__svg { display: block; width: 100%; height: auto; overflow: visible; }
  .carte__contour {
    fill: var(--ivory); fill-opacity: 0.4;
    stroke: var(--ink); stroke-opacity: 0.55; stroke-width: 1.25; stroke-linejoin: round;
    stroke-dasharray: 1 1; stroke-dashoffset: 0;
  }
  .carte__liaison {
    fill: none; stroke: var(--framboise); stroke-opacity: 0.6; stroke-width: 1.2;
    stroke-dasharray: 1 1; stroke-dashoffset: 0;
  }
  .carte__pastille { fill: var(--framboise); }
  .carte__halo { fill: var(--framboise); opacity: 0.22; }
  .carte__nom { font-family: var(--font-sans); font-size: 11px; font-weight: 600; fill: var(--ink); }
  .carte__titre { font-family: var(--font-display); font-style: italic; font-size: 12px; fill: var(--muted); }
</style>
```

- [ ] **Step 2 : `src/components/LieuxCards.astro` — prop `compact`**

Frontmatter : `interface Props { compact?: boolean }` + `const { compact = false } = Astro.props;` ; racine : `<div class:list={['lieux', { 'lieux--compact': compact }]} data-reveal data-reveal-stagger>`. Styles à ajouter :
```css
  /* Variante compacte (à côté de la carte dessinée) : une carte par ligne, plus basse */
  .lieux--compact { grid-template-columns: 1fr; gap: 14px; margin-top: 0; }
  .lieux--compact .lieux__body { padding: clamp(18px, 2vw, 24px) clamp(20px, 2.4vw, 28px); }
  .lieux--compact .lieux__ville { font-size: 1.25rem; }
  .lieux--compact .lieux__horaires { margin-top: 10px; font-size: 0.88rem; }
  .lieux--compact .lieux__itin { padding-top: 10px; }
  .lieux--compact .lieux__btn { margin-top: 10px; }
```
et dans le `@media (max-width: 960px)` existant : `.lieux--compact { max-width: none; }` (la règle générale pose `max-width: 460px`, gardée pour la variante normale).

- [ ] **Step 3 : Build (`--outDir <scratchpad>/dist-t5`) → `10 page(s) built`.** La carte n'est branchée qu'en T6 : insertion temporaire dans `404.astro` pour capture (puis retrait) : contour visible, 3 pastilles avec noms, « La Hulpe » en haut à droite de « Nivelles », texte « Brabant wallon » en bas à droite ; après scroll (3 s) : `strokeDashoffset` du contour = `0px`.

---

### Tâche 6 : L'accueil — nouvel ordre, carrousel, frise, carte, traits, parallaxe

**Files:** Modify `src/pages/index.astro`

- [ ] **Step 1 : Frontmatter** — remplacer le bloc d'imports par :
```ts
import Base from '../layouts/Base.astro';
import Blob from '../components/Blob.astro';
import Portrait from '../components/Portrait.astro';
import Bandeau from '../components/Bandeau.astro';
import Carrousel from '../components/Carrousel.astro';
import Etapes from '../components/Etapes.astro';
import CarteCabinets from '../components/CarteCabinets.astro';
import LieuxCards from '../components/LieuxCards.astro';
import Closing from '../components/Closing.astro';
import Tagline from '../components/Tagline.astro';
import { IDENTITE } from '../data/site';
```
et **supprimer** le tableau `const accompagnements = [ … ];` (désormais dans `src/data/accompagnements.ts`). Le tableau `situations` reste.

- [ ] **Step 2 : Markup** — juste après le `</section>` du hero, insérer :
```astro
  <!-- ===== BANDEAU DES THÈMES ===== -->
  <Bandeau />
```
Remplacer toute la section `<!-- ===== LES 3 ACCOMPAGNEMENTS ===== --> <section class="section section--blob acc"> … </section>` par :
```astro
  <!-- ===== LES ACCOMPAGNEMENTS — carrousel ===== -->
  <section class="section section--blob acc" id="accompagnements">
    <Blob variante={2} teinte="peach-rose" largeur="44vw" position="top: 20%; right: -12vw;" opacite={0.6} inverse parallaxe />
    <div class="container">
      <span class="overline overline--center">Accompagnements</span>
      <h2 class="headline headline--md headline--center headline--trait">
        Un accompagnement <em>selon l'âge et la vie</em>
      </h2>
      <Carrousel />
    </div>
  </section>
```
Juste après le `</section>` de « Qui je suis », insérer :
```astro
  <!-- ===== LA PREMIÈRE SÉANCE — 3 étapes ===== -->
  <section class="section section--blob premiere-home">
    <Blob variante={4} teinte="lilac-aqua" largeur="44vw" position="top: -12%; right: -10vw;" opacite={0.55} inverse parallaxe />
    <div class="container">
      <span class="overline overline--center">La première séance</span>
      <h2 class="headline headline--md headline--center headline--trait">
        Et si je ne sais pas<br /><em>par où commencer</em> ?
      </h2>
      <p class="copy copy--center">
        C'est très fréquent — et ce n'est pas un problème. La première
        rencontre sert justement à ça : poser ce qui vous amène, avec vos
        mots, sans ordre imposé. Nous définissons ensemble la suite, à votre
        rythme.
      </p>
      <div class="premiere-home__frise"><Etapes /></div>
      <div class="actions actions--center">
        <a class="link-arrow" href="/approche/">Découvrir mon approche</a>
      </div>
    </div>
  </section>
```
Dans la section « Lieux », remplacer `<LieuxCards />` par :
```astro
      <div class="lieux-home__grille">
        <CarteCabinets />
        <LieuxCards compact />
      </div>
```
Ajouter `headline--trait` aux `h2.headline` des sections amene, qui, nutri et lieux-home (ceux du carrousel et de la frise l'ont déjà). Ajouter la prop `parallaxe` aux `<Blob>` des sections amene, qui, nutri et lieux-home.

- [ ] **Step 3 : Styles** — supprimer tout le bloc `/* ===== Accompagnements ===== */` (`.acc__grid` … `.acc__body .link-arrow`, y compris la media query de l'escalier) et la ligne `.acc__grid { grid-template-columns: 1fr; … }` du responsive ; ajouter après le bloc « Qui je suis » :
```css
  /* ===== La première séance ===== */
  .premiere-home__frise { margin-top: var(--headline-gap); max-width: 960px; margin-inline: auto; }
  .premiere-home .actions { margin-top: 40px; }

  /* ===== Lieux : carte dessinée + cartes compactes ===== */
  .lieux-home__grille {
    margin-top: var(--headline-gap);
    display: grid; grid-template-columns: 0.95fr 1.05fr;
    gap: clamp(28px, 4vw, 56px); align-items: center;
  }
```
et dans `@media (max-width: 960px)` : `.lieux-home__grille { grid-template-columns: 1fr; }`.

- [ ] **Step 4 : Build (`--outDir <scratchpad>/dist-t6`) + vérification (chaînes browse, `newtab` en tête, attendre 3 s après chaque saut)**
Desktop 1440×900 : ordre du DOM = hero, `.bandeau`, `.amene`, `.acc` (avec `[data-carrousel].is-js`), `.qui`, `.premiere-home`, `.nutri`, `.tagline`, `.lieux-home` (avec `[data-carte]` et `.lieux--compact`), `.closing` (mesure `[...document.querySelectorAll('main > *')].map(e => e.className.split(' ')[0])`) ; `document.querySelectorAll('.blob[data-parallaxe]').length` = 6 ; après scroll de 3 000 px : un blob avec `style.transform` non vide (parallaxe) et `.headline--trait.is-vu` ≥ 2 ; captures **viewport** (`--viewport`) à `y = 900` (bandeau + « Ce qui vous amène »), `.acc` (carrousel), `.premiere-home` (frise tracée), `.lieux-home` (carte + 3 cartes compactes) — **lues**. Hauteur totale relevée. Mobile 390×844 : `scrollWidth` = 390, capture du carrousel (flèches sous la carte) et de la frise (verticale). Console vide.

---

### Tâche 7 : QA (lead)

- [ ] Build final sur `dist/` : `pnpm build` → 10 pages ; `grep -c "acc__grid\|premiere__steps" dist/index.html dist/approche/index.html` = 0.
- [ ] Chaque point du §11 de la spec, mesuré : bandeau (transform à t/t+1 s, pause au survol), carrousel (onglets, flèches, clavier, auto 8 s, pause, sans `is-js`), étapes (dashoffset 1 → 0), carte (contour/courbe 0, positions), parallaxe (deux valeurs de transform), traits (`scaleX` 0 → 1) ; `scrollWidth` desktop/mobile ; console.
- [ ] Lighthouse desktop (build servi par `pnpm astro preview --port 4339`) : performance ≥ 90, accessibilité ≥ 95 ; arrêter le preview ensuite.

### Tâche 8 : Documentation (lead)

- [ ] `PROJET.md` (journal 2026-09-09 : blocs, animations, hauteur, « non committé »), `PROJET.html` (même entrée), spec §12 amendée si une décision a bougé, mémoire `xenia-etat-reprise`.

---

## Auto-revue du plan (2026-09-09)

- **Couverture spec** : §3 bandeau → T1 (données, chips) + T2 ; §4 carrousel → T1 (données) + T3 + T6 ; §5 étapes → T1 (données) + T4 + T6 ; §6 carte → T1 (carte.ts) + T5 + T6 ; §7 parallaxe → T1 (blobs.ts, Blob, Base) + T6 (prop posée) ; §8 traits → T1 (CSS, motion, Base) + T6 (classe posée) ; §9 inchangé respecté ; §10 mobile/a11y dans chaque composant ; §11 → T6 + T7 ; §12 hors périmètre respecté.
- **Placeholders** : aucun.
- **Cohérence** : `ACCOMPAGNEMENTS`/`OU` (T1) consommés par T3 ; `ETAPES` par T4 ; `THEMES` par T2 ; `CONTOUR`/`LIAISON`/`POINTS` par T5 ; prop `parallaxe` (T1) posée en T6 ; classes `chip--*`, `headline--trait`, `html.js` (T1) utilisées en T2/T6 ; `bootBlobs`/`bootTraits` (T1) bootés dans Base ; `Etapes` prop `vertical` (T4) utilisée par Approche ; `LieuxCards` prop `compact` (T5) utilisée en T6.
- **Écarts validés en cours d'exécution (2026-09-09)** : Carrousel — règle `.carrousel:not(.is-js) .carrousel__scene { display: block; }` ajoutée (sans JS, la grille 48px 1fr 48px envoyait les panneaux dans la colonne des flèches) ; médaillon en teintes 35 % + ombre, onglet actif ombré (retouches visuelles du lead). Etapes — la ligne SVG a des dimensions explicites (`width: 66.68%` horizontal ; `grid-row: 1 / 3; height: calc(100% + 26px)` vertical) et pas de `vector-effect` (un SVG est un élément remplacé : `auto`/`right`/`bottom` ne se résolvent pas comme prévu ; `non-scaling-stroke` cassait le tiret sous `preserveAspectRatio="none"`). CarteCabinets — `<mask>` de tracé pour que la liaison garde son pointillé ; `LIAISON` tangente à Court-Saint-Étienne (`M95 178 Q 150 174 198 157 Q 220 149 161 86`), étiquette de Nivelles à gauche du point. Socle — `bootBlobs` dans `gsap.matchMedia(DESKTOP_MQ)`, `.headline--trait { isolation: isolate }`.
- **Écart de texte assumé** : le titre de la section accompagnements passe de « Trois espaces, selon l'âge et la vie » à « Un accompagnement selon l'âge et la vie » (le carrousel a 4 onglets) — à consigner dans le journal.
