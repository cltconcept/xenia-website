# Xénia Van Outryve — site vitrine
> Site de présentation d'une psychologue clinicienne (santé, périnatalité, nutrition) en Brabant wallon — design « L'éclaircie », Astro statique.

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Astro 5 (statique, 9 pages + 404) |
| Animations | GSAP 3 + ScrollTrigger, Lenis — **imports différés uniquement** |
| Typographies | Fraunces Variable (display) + Hanken Grotesk Variable (body), Fontsource |
| Styles | CSS vanilla, tokens dans `src/styles/global.css` |
| Sitemap | @astrojs/sitemap |
| Médias générés | Kie `nano-banana-pro` (aquarelles) · Higgsfield Seedance 2.5 (film du hero) · ffmpeg all-intra · sharp (WebP) |
| Conteneur | Docker multi-étages → nginx:alpine (EXPOSE 80) |
| Déploiement | Coolify maquettes (46.224.83.139) → `*.chris-ia.com` |

## Démarrage rapide
```bash
# Installation
pnpm install

# Développement — port dédié 4331 (4330 = dentalexpert, cf. mémoire sites-vitrines)
pnpm dev          # http://localhost:4331

# Build production + aperçu
pnpm build
pnpm preview
```

## Architecture
```
xenia/
├── brief/                  ← matériau client (mail, moodboard, refs) — GITIGNORÉ (privé)
├── chartes/xenia/          ← charte graphique relevée (charte.json = source, PDF, CHARTE.md, tokens.css)
├── docs/
│   ├── DESIGN.md           ← design system « L'éclaircie »
│   ├── dossier.html        ← source du dossier client unifié (09/09, 8 pages)
│   ├── dossier-img/        ← captures du site et références en JPEG légers (dossier)
│   ├── dossier-xenia-van-outryve.pdf ← LE document remis à la cliente
│   ├── audit-seo-geo.html  ← source de l'audit SEO/GEO (09/09)
│   ├── audit-seo-geo-xenia-van-outryve.pdf
│   └── rapport-qa-xenia-chris-ia-com-2026-09-09.pdf ← contrôle qualité Noveo
├── public/                 ← favicon, robots, llms.txt, og.png, copie du PDF
└── src/
    ├── layouts/Base.astro  ← SEO, OG, JSON-LD, boot des reveals / traits / parallaxe
    ├── data/               ← site.ts (lieux, RDV), themes.ts (bandeau), accompagnements.ts
    │                          (carrousel), etapes.ts (première séance) — sources uniques
    ├── lib/                ← motion.ts (GSAP différé, reveals, traits), blobs.ts
    │                          (parallaxe), carte.ts (contour du Brabant wallon figé)
    ├── components/         ← Header, Footer (LA vague unique), PageHero (médaillon + Blob),
    │                          Blob (forme organique, parallaxe), Portrait, Bandeau (thèmes
    │                          qui défilent), Carrousel (onglets ARIA, auto pausable),
    │                          Etapes (frise / liste, ligne tracée), CarteCabinets (carte
    │                          dessinée scrubée), LieuxCards (teintes, itinéraire, compact),
    │                          Domaines, Tagline, Manuscrit, Closing, Logo, Wave
    └── pages/              ← index, approche, accompagnements/×3,
                               nutrition-sante, a-propos, lieux-contact, 404
```
- **Flux** : contenu figé au build → HTML statique ; GSAP/Lenis se chargent à l'idle
  (le site est complet sans JS).
- **Design** : aurore pastel (pêche/rose/lilas/eau) + aubergine `#43324B` +
  framboise `#C13D63` + sauge `#5E8E75` sur ivoire `#FDFBF8`. Signature : la
  **traversée** (scène épinglée scrubée au scroll, deux phrases sur le film
  d'aquarelle, indice de défilement) et le **halo qui respire** (cycle 7 s, coupé si
  `prefers-reduced-motion`). Logo : deux pétales translucides croisés.
- **Système de surfaces (recomposition 2026-09-09)** : plus de bandes ivoire à
  vagues ; chaque section est `.section--blob` avec un `<Blob>` dégradé posé
  derrière le contenu (5 formes, 7 teintes, mobile = grand lavis centré), cartes
  teintées par thème (`.card--rose/lilac/aqua/peach`), verre dépoli toujours
  posé sur un blob, une seule vague (avant le footer). Jetons neufs :
  `--tint-*`, `--scrim-hero(-mobile)`, `--muted-hero`, `--radius-organique`,
  `--petale-rose/sage`.
- **Blocs et animations de l'accueil (2026-09-09, spec du même jour)** : ordre
  « histoire d'abord » — hero → bandeau des thèmes → Ce qui vous amène →
  carrousel des accompagnements → Qui je suis → première séance en 3 étapes →
  nutrition → tagline → carte dessinée + cabinets → closing. Chaque section
  bouge : bandeau en défilement CSS (pause au survol/focus), carrousel en
  fondu-glissé (auto 7 s, pause, clavier), ligne des étapes et carte tracées
  au scroll, **parallaxe** des blobs (`bootBlobs`, `gsap.matchMedia`), **trait**
  sous le mot pivot des titres (`bootTraits`, IntersectionObserver).
- **Scripts** : `scripts/illustration_hero.sh` (3 candidats Kie → `brief/illu-src/`),
  `scripts/convertir_hero.mjs` (→ `public/media/illu/hero-cabinet-{640,1040,1600}.webp`),
  `scripts/convertir_illustrations.mjs` (les autres aquarelles ; mode
  `--vignette` = 3 tailles), `scripts/icones/decouper.mjs` (planche Recraft →
  SVG mono-chemin, grille détectée, potrace), `scripts/compter_mots.mjs`
  (mots visibles par page vs cibles).
- **Iconographie (2026-09-13)** : `src/icons/*.svg` (33 pictos, style B) rendus
  par `components/Icon.astro` (`name`, `size`, `petale` rose/sage/none,
  `label`), vignettes aquarelle `public/media/illu/vignettes/` rendues par
  `components/Vignette.astro` (`name`, `alt`, `size`, `rotate`, `eager`) ;
  données `situations.ts` (6), `reperes.ts` (3), champs `icone` dans
  `themes.ts` (8), `accompagnements.ts`, `etapes.ts`. Masters dans
  `brief/illu-src/{icones,vignettes}/` (hors dépôt).

## Variables d'environnement
Aucune. Site 100 % statique, aucun secret.

## Roadmap & Features

| Feature | Statut | Date |
|---------|--------|------|
| Design system « L'éclaircie » + logo | ✅ Done | 2026-08-11 |
| 8 pages + 404, contenus du mail cliente | ✅ Done | 2026-08-11 |
| SEO/GEO : JSON-LD, FAQPage, sitemap, llms.txt, OG | ✅ Done | 2026-08-11 |
| Dossier client PDF unifié et vulgarisé (8 pages, 2026-09-09) | ✅ Done | 2026-09-09 |
| Dockerfile + nginx (prêt à déployer) | ✅ Done | 2026-08-11 |
| Dépôt GitHub public + déploiement Coolify (HTTPS) | ✅ Done | 2026-08-11 |
| Recomposition design (spec 2026-09-08) | ✅ Done | 2026-09-09 |
| Blocs et animations de l'accueil (spec 2026-09-09) | ✅ Done | 2026-09-09 |
| Mise en ligne de la maquette recomposée (GitHub + Coolify) | ✅ Done | 2026-09-09 |
| Vérification impeccable (critique 29/40, audit 13/20) + 8 P1 corrigés | ✅ Done | 2026-09-12 |
| Allègement du texte (−30/40 %) + iconographie sur mesure (33 pictos, 5 vignettes) | ✅ Done | 2026-09-13 |
| Reste impeccable P2/P3 (mailto visio, Échap, pétales RM, cibles 44 px…) | 📋 Planned | — |
| Photo de la cliente dans le hero + bloc tarifs (attendent ses éléments) | 📋 Planned | — |
| Photos de la cliente (portrait « à venir ») | 📋 Planned | — |
| Nom de domaine final + bascule DNS + Search Console | 📋 Planned | — |
| Textes validés par la cliente | 📋 Planned | — |

## Journal des changements

### 2026-09-13 (soir — plus aucune mention de l'agence sur le site)
- 🗑️ **« Site conçu et hébergé par Noveo Digital (noveodigital.be) » retiré des
  mentions légales** (`src/pages/mentions-legales.astro`, carte Hébergement) :
  règle posée par l'utilisateur le même jour — **aucun site client ne porte de
  signature d'agence** (ni Noveo, ni noveodigital.be, ni CLT Concept, ni
  chris-ia). La carte ne nomme plus que l'hébergeur (Hetzner Online GmbH,
  adresse, données dans l'UE), ce que la loi demande.
- ✅ Vérifié : build 10 pages, `grep -rniE "noveo" dist/` vide, PDF servi
  `public/dossier-xenia-van-outryve.pdf` déjà propre (0 occurrence au texte
  extrait). Règle gravée dans `_autres/website/CLAUDE.md`, le skill
  `site-vitrine` et le contrôleur de référence (`dailypopsociety/scripts/verifier.mjs`).
- 🚀 Committé, poussé et redéployé sur la maquette, page vérifiée en ligne.

### 2026-09-13 (allègement du texte −30/40 % + iconographie sur mesure)
- 🎯 **Déclencheur** : deux retours du responsable de l'utilisateur sur la
  maquette, « trop de texte » et « pas d'iconographie personnalisée
  (Higgsfield) ». Brainstorming (4 questions + 2 écrans du compagnon visuel),
  spec `docs/superpowers/specs/2026-09-13-xenia-allegement-iconographie-design.md`,
  plan du même nom, exécution par sous-agents (socle, accueil, composants +
  pages) et par le lead (génération Higgsfield, découpe, vérification).
- ✨ **Set de 33 pictogrammes propres au site** (`src/icons/`, style B : trait
  aubergine + pétale du logo posé par `Icon.astro`) : 4 planches Recraft V4.1
  `vector` via Higgsfield (10 crédits pièce, SVG natif rasterisé), découpées
  par projection d'encre (grille DÉTECTÉE : Recraft a livré du 3×3 et du 2×4)
  et vectorisées par potrace (`scripts/icones/decouper.mjs`, 52,6 Ko les 33).
  `diplome` trop plat → `livre` pour le master.
- ✨ **5 vignettes aquarelle « objets du cabinet »** (plaid, carnet, fauteuils,
  porte, fenêtre) : Nano Banana Pro via Higgsfield avec deux illustrations
  d'août en référence de style, 2 candidats par sujet (choix dans
  `brief/illu-src/vignettes/CHOIX.md`), WebP 320/640/960 ≤ 20 Ko en 640
  (`Vignette.astro`, `scripts/convertir_illustrations.mjs --vignette`).
  60 crédits Higgsfield au total.
- ✂️ **Textes** : accueil 994 → 651 mots visibles (−35 % ; 739 sur la base de
  comptage du 12/09, textes cachés compris), Approche 492 → 317, À propos
  403 → 270, accompagnements ≈ 410 → 259-273, Nutrition 411 → 272, Lieux
  545 → 360 ; FAQ 6 → 4 questions (JSON-LD resynchronisé), bandeau 10 → 8
  capsules, situations 8 → 6, ligne « Où » une seule fois sous le carrousel,
  adresses retirées des cartes compactes et du pied de page. Faits, H1/H2,
  meta et phrases-patients intacts. ⚠️ **Cibles recalibrées de +65** pendant
  l'implémentation : le texte fixe (nav rendue deux fois + footer) pèse 163
  mots, pas 100 ; `scripts/compter_mots.mjs` (texte visible : sr-only, tiroir
  mobile et copie du bandeau exclus) prouve toutes les cibles.
- 📐 **Emplacements** : pictos dans les repères du hero, les 6 cartes, les
  onglets, les repères « Qui je suis », les cercles des étapes (numéro en
  sr-only), les cartes de lieux, les piliers d'Approche (le logo répété
  disparaît), les heros de page, le closing, le contact du footer ; vignettes
  à l'opposé du texte en desktop, 168 px au-dessus du titre en mobile (carnet
  et fenêtre masquées sur téléphone pour la hauteur).
- ✅ **Vérifié** : build 10 pages, 0 erreur console, 0 débordement à 390,
  contrastes des nouveaux libellés ≥ 4,90:1 au pixel, **hauteur de l'accueil
  stable, pas réduite** : 8 230 → 8 370 px desktop (scène épinglée comprise,
  mesuré en ligne) et 9 722 → 10 021 px mobile — les cinq vignettes reprennent
  la place libérée par le texte ; la cible ≤ 6 000 px de la spec n'est pas
  atteinte (levier : vignettes en position absolue dans la zone du blob plutôt
  qu'en flux, ≈ −500 px, ou approche B). HTML
  de l'accueil 114 Ko brut / 30 Ko gzip avec 45 SVG inline, détecteur
  impeccable `dist` 67 → 59 constats (aucune règle nouvelle), FAQ JSON-LD = HTML,
  H1 inchangés, `llms.txt` à jour.
- 📚 `docs/DESIGN.md` : section « Iconographie ». Reste : audit SEO/GEO complet
  (`/noveo-checkquality`) à repasser, dossier client PDF à régénérer (captures).
- 🚀 **Committé (`99aea48`, après `528fa01` pour les P1 du 12/09), poussé et
  redéployé** (déploiement Coolify `xkkcjibyhjfherd9mfzfnafm`, ⚠️ l'API veut
  désormais `POST /api/v1/deploy?uuid=…`, le GET répond 405) : vérifié en
  ligne sur https://xenia.chris-ia.com — 9 pages 200, vraie 404, vignettes et
  `llms.txt` servis, 45 pictos inline sur l'accueil, console vide.

### 2026-09-12 (après-midi — les 8 P1 impeccable corrigés, EN LOCAL, non committés)
- ✅ **Décisions utilisateur** : corriger les 8 P1 seulement, garder les trois
  listes de motifs, pilule « RDV » dans l'en-tête mobile (pas de barre basse),
  `--muted` aligné sur `--muted-hero`, film différé sans réencodage.
- 🐛 **Bandeau** (`Bandeau.astro`) : le repli en liste statique passe de
  `:focus-within` à `:has(.chip:focus-visible)` (clavier seulement) + pause sans
  reflow à tout focus → **le premier tap/clic navigue (vérifié 2/2, tactile et
  souris)**.
- ♿ **CTA** : pilule compacte « RDV » (44 px, nom accessible « Prendre
  rendez-vous ») et burger 44×44 dans l'en-tête mobile (`Header.astro`) ; CTA
  du hero en `autoAlpha` (+ `visibility: hidden` pré-paint) → hors de l'ordre
  de tabulation tant qu'ils sont invisibles ; un focus dans le hero termine la
  scène (`index.astro`).
- 🎨 **Contrastes** : `--muted` → `#6E5F76`, `.overline` / têtes du footer /
  numéros d'étapes / tags / citation / eyebrow → `--framboise-deep`, scrim
  mobile du hero couvrant aussi le haut (0,62 → 0,9). **Mesuré au pixel après
  correction : tout ≥ 4,53:1** (eyebrow mobile 5,52 contre 3,1–3,8 ; footer
  4,92–5,25 contre 4,03–4,33 ; lavis mobiles 4,88–5,41 contre 4,04–4,28).
- 🔎 **Identité dès l'écran 0** : « Psychologue clinicienne · Brabant wallon »
  dans la phrase 1 de la traversée, s'efface avec elle.
- 🔗 **Liens annuaire / itinéraire** (`LieuxCards.astro`) : texte visible en
  tête du nom accessible + « nouvel onglet » en `.sr-only`, glyphe de lien
  externe, note de réassurance au-dessus des cartes sur Lieux (reprend la FAQ
  mot pour mot).
- ⚡ **Perf** : film desktop chargé au premier geste de défilement seulement
  (wheel/touch/touche/scroll) avec test `saveData`/`effectiveType` — **vérifié :
  aucune requête `hero-film.mp4` avant le scroll, une après** ; `will-change`
  des lavis sous 961 px retiré (`Blob.astro`), celui des mots du H1 relâché
  après l'intro mobile.
- 📚 `docs/DESIGN.md` : palette (`--muted`, `--framboise-deep`) et interdit
  « pas de framboise ni de muted sous 4,5:1 ».
- ✅ Vérifié sur le build (`pnpm build` OK, `pnpm preview`) : console vide,
  aucun débordement à 360/390, tabulation desktop = nav → capsules (les CTA
  invisibles ne prennent plus le focus), `:has()` conservé par le compilateur
  Astro. Détecteur impeccable : `dist` **191 → 67 constats** ; l'accueil
  desktop se scanne enfin (le film ne bloque plus le réseau au repos).
  ⏳ **À valider à l'écran par l'utilisateur, puis commit + redéploiement.**

### 2026-09-12 (vérification impeccable — critique + audit, rien corrigé)
- 🔍 **Plugin `impeccable` 4.3.1 (pbakaus) installé et passé sur le site**
  (commandes `critique` + `audit`, trois agents isolés : revue design,
  détecteur + mesures au pixel, audit technique) : **critique 29/40 (Bon)**,
  **audit 13/20 (Acceptable)**, 0 P0 · 8 P1 · 8 P2 · 6 P3. Synthèse et
  rapports détaillés dans `docs/impeccable/2026-09-12/` (`synthese.md`,
  rapports A/B/C, `preuves/`, `pw.py`), instantané impeccable dans
  `.impeccable/critique/` — dossiers **non committés**, aucune ligne de code
  touchée : l'ordre des corrections est à décider.
- 🐛 **Bug fonctionnel P1 confirmé par reproduction (4/4, tactile et souris)** :
  le premier tap ou clic sur une capsule du bandeau ne navigue pas —
  `Bandeau.astro:38-41`, la règle `:focus-within` replie la piste au focus du
  lien, l'élément sous le doigt change et le `click` tombe sur le `ul`. Navigue
  dès que la règle est neutralisée (fix : `.bandeau:has(.chip:focus-visible)`
  ou pause de l'animation sans reflow).
- ⚠️ Autres P1 : `--muted #7A6B82` sous 4,5:1 sur le footer, les lavis mobiles
  et le verre (aligner sur `--muted-hero`), eyebrow du hero mobile à 3,1–3,8:1
  (scrim transparent sur 28 %), CTA absent de l'en-tête mobile + CTA du hero à
  opacité 0 dans l'ordre de tabulation desktop, film de 7 Mo récupéré en Blob
  d'office sur tout écran ≥ 1024 px sans test réseau, 22 `will-change` au repos,
  écran 0 desktop sans le mot « psychologue » avant 60 % de la scène, sortie
  vers l'annuaire non annoncée.
- 🧰 Outillage : le `browse` de gstack n'est pas installé sur la machine →
  captures et mesures par Playwright Python (`pw.py`). Le détecteur impeccable
  ne lit pas les `.astro` (scanner `dist/` et les URL) et expire sur l'accueil
  desktop (film en Blob).

### 2026-09-09 (mise en ligne de la maquette recomposée)
- 🚀 **Poussé sur GitHub et redéployé** (demande utilisateur) : trois commits
  sur `main` de `cltconcept/xenia-website` (`62c0199` le site, `a4bebd8` la
  documentation, `ce66d45` les scripts de médias), puis déploiement de l'app
  Coolify `seetu6uqg4tnkjg8do4f1f8n` — **25 s**, sur le sous-domaine existant
  **https://xenia.chris-ia.com** (aucune nouvelle app créée).
- ✅ Vérifié EN LIGNE : les 9 pages en 200, vraie 404, robots / llms.txt /
  sitemap / favicon.ico / og.jpg / film mobile / aquarelle du hero servis
  (l'ancien `og.png` répond bien 404) ; **les 5 en-têtes de sécurité sont
  actifs** et `Server: nginx` n'annonce plus sa version ; JSON-LD `Service` +
  `BreadcrumbList` présents sur les pages d'offre ; carrousel, bandeau, blobs
  et parallaxe rendus, console vide, aucun débordement.
- 🧹 Avant commit : audit SEO/GEO ramené de 4,6 Mo à 675 Ko (même cause que le
  dossier : grain, ombres et dégradés arrondis rasterisés par Chromium) ; les
  polices rapatriées de la charte sont gitignorées (re-téléchargeables depuis
  `chartes/xenia/assets.json`). Contrôle anti-secret passé : aucune clé dans
  les fichiers versionnés, `brief/` toujours hors dépôt.

### 2026-09-09 (soir — dossier client unifié, vulgarisé)
- 📘 **Un seul document pour la cliente** (demande utilisateur, remplace le
  dossier de 5 planches du 11/08) : `docs/dossier-xenia-van-outryve.pdf`,
  **8 pages A4** aux couleurs du site, sans jargon — 1 couverture ;
  2 « Votre demande, notre réponse » (ses mots du moodboard → ce que ça donne,
  ses 3 références et ce qu'on en a gardé / écarté) ; 3 les couleurs (10
  swatches à rôle simple, pourquoi framboise et ivoire) ; 4 écritures + logo
  « la rencontre » (3 versions) ; 5 l'accueil raconte une histoire (4
  captures) ; 6 les pages et le téléphone (6 captures) ; 7 contrôle qualité
  (score 96, contrôlé / corrigé / reste à faire et qui) ; 8 Google et IA (SEO
  93, GEO 91 expliqués, ce qui est en place, la suite, ce qu'on attend d'elle).
  Source `docs/dossier.html`, images dans `docs/dossier-img/`, copie servie
  dans `public/`. Les audits techniques restent en documents séparés.
- ⏳ **Document rendu INTEMPOREL** (demande utilisateur : « les corrections, le
  client s'en fout, c'est mon job ») : aucune date nulle part (pieds de page,
  moodboard, passes de contrôle), la page 7 décrit **l'état du site** et non
  l'historique (« Un site vérifié, page par page » ; la carte « corrigé le
  jour même » devient « Léger, et fait pour durer », faits présentés comme des
  caractéristiques) ; le tableau « ce qui reste » ne liste plus que ce qui
  dépend de la cliente (photo, domaine, adresse, tarifs) — la colonne « qui »
  et la ligne « mise en ligne / Noveo » sont retirées. À REGÉNÉRER tel quel
  quand le contenu change : ne jamais y remettre de date ni de tâche Noveo.
- 📉 **PDF allégé de 9 Mo à 1,4 Mo, sans post-traitement** (demande
  utilisateur). Cause : Chromium rasterise à l'impression tout fond à filtre
  SVG (le grain feTurbulence = 457 Ko × 8 pages), toute ombre portée et tout
  dégradé posé sur une boîte arrondie (cartes teintées, encadrés, jauges).
  Correctifs à la source uniquement : grain retiré, ombres retirées, fonds de
  cartes en **teintes unies** (`#FCF0F5`, `#F5F1FC`, `#EEF8F4`, `#FFF2EA`),
  couverture en dégradé linéaire opaque. La barre d'aurore garde son dégradé.
  ⚠️ Post-traitement PyMuPDF **abandonné** : `subset_fonts`/`garbage≥3`
  rendent le texte illisible, et même `garbage=1` + `rewrite_images` perdent
  des dégradés (« cannot find Pattern resource »). Contrôle du rendu avec
  **pypdfium2** (moteur de Chrome), pas avec PyMuPDF ni le lecteur Chrome
  headless (page blanche).

### 2026-09-09 (soir — corrections du contrôle qualité)
- 🐛 **Cinq constats du rapport Noveo corrigés et revérifiés** (seconde passe
  complète du contrôle) : film du hero servi en **640×360 / 163 Ko** sur mobile
  (`hero-film-mobile.mp4`, rien en mode économie de données ; le master
  all-intra reste au desktop) ; image Open Graph **og.jpg 42 Ko** (og.png 503 Ko
  supprimé) ; **favicon.ico** 16/32/48 ; **JSON-LD `Service` + `BreadcrumbList`**
  sur les 4 pages d'offre (`src/lib/schema.ts`, alimenté par
  `accompagnements.ts`, passé au layout par la prop `extraLd`) ; bloc
  **Hébergement** dans les mentions (Noveo Digital, Hetzner Online GmbH —
  identifié par l'IP de la maquette) ; **llms.txt** enrichi (thèmes, première
  séance, horaires, FAQ) et daté.
- 🔐 **nginx.conf** : `server_tokens off` + HSTS, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, répétés dans
  chaque `location` à `add_header` (sinon annulés). ⚠️ Syntaxe non testée en
  local (Docker arrêté) : à valider au premier redéploiement, puis `curl -sI`.
- 📊 Rapport Noveo reconstruit : **score 96/100**, 4 constats restants
  (portrait à venir, en-têtes à déployer, domaine à trancher, adresse de
  l'éditrice). Audit SEO/GEO mis à jour : **SEO 93 / GEO 91**.

### 2026-09-09 (soir — audit SEO/GEO + contrôle qualité Noveo)
- 🔎 **Audit SEO & GEO du build recomposé** : `docs/audit-seo-geo-xenia-van-outryve.pdf`
  (4 pages aux couleurs du site, source `docs/audit-seo-geo.html`). **SEO 89**
  (91 le 11/08 : deux médias lourds apparus), **GEO 89** (86 : plus de matière
  lisible sans JS). Relevé statique des 9 pages : balises, canoniques, h1, alt,
  JSON-LD complets ; sitemap = 9 pages ; Lighthouse desktop 100/97. À corriger :
  film 6,9 Mo téléchargé en mobile, og.png 503 Ko, pas de `Service` /
  `BreadcrumbList`, intentions locales sans page dédiée ; domaine à trancher.
- ✅ **Contrôle qualité Noveo Digital** (`/noveo-checkquality` sur le build servi
  en local) : `docs/rapport-qa-xenia-chris-ia-com-2026-09-09.pdf` (14 pages),
  **score santé 93/100**, 0 critique. 21 liens / 0 cassé, 0 erreur console,
  0 cookie, 0 script tiers, menu mobile complet, aucun débordement. 8 constats :
  portrait « à venir » (H1, cliente), film mobile (H2), en-têtes de sécurité
  nginx absents + version exposée (M1), og.png (M2), domaine provisoire (M3),
  mentions légales sans hébergeur (B1), favicon.ico (B2), JSON-LD Service (B3).
  Faux positifs écartés : h1 « multiple » (retours à la ligne), mailto
  « incohérent » (libellé E-mail), hero mobile vide (cliché pris pendant l'intro).

### 2026-09-09 (soir — charte graphique)
- 📘 **Charte de marque relevée sur le site recomposé** (skill `/charte-url`, 3
  pages relevées en local : accueil, Adolescents & Adultes, Lieux & Contact) :
  `chartes/xenia/Charte-Xenia-Van-Outryve.pdf` (9 pages A4 aux couleurs du
  site), `CHARTE.md` (pour l'agent qui code), `tokens.css`, `charte.json`
  (source de vérité, toute retouche s'y fait puis `build.cjs`), polices
  WOFF2 et logo SVG dans `assets/`. 10 couleurs, 6 niveaux typographiques,
  thème clair seul. **Proposé** (à faire valider) : base d'espacement 8 px
  (le site est en `clamp()` fluides), monospace JetBrains Mono, couleurs
  d'état ambre et rouge sombre, textes vide/échec. Le wordmark n'existe
  qu'en HTML : le lockup livré est le symbole seul.

### 2026-09-09 (soir — blocs et animations de l'accueil)
- ✨ **Six pièces ajoutées** (spec `docs/superpowers/specs/2026-09-09-xenia-blocs-et-animations-design.md`,
  plan du même nom, sous-agents + double revue) après comparaison avec la
  référence aimée par la cliente (template « Yoga studio ») : **bandeau des
  thèmes** (10 capsules teintées qui défilent, source `themes.ts`),
  **carrousel des accompagnements** à 4 onglets (patron ARIA tabs, flèches en
  verre, auto 7 s pausable, clavier, sans JS = 4 cartes empilées ; remplace
  les 3 cartes en escalier, titre « Un accompagnement selon l'âge et la vie »),
  **première séance en 3 étapes** (frise horizontale dont la ligne se trace au
  scroll ; même composant en liste verticale sur Approche, textes en source
  unique `etapes.ts`), **carte dessinée du Brabant wallon** (contour simplifié
  figé dans `carte.ts`, 3 pastilles qui s'allument, liaison pointillée
  révélée par masque, collante à côté des 3 cartes compactes ; aucun service
  tiers, aucun cookie), **parallaxe** des blobs et **trait de pinceau** sous
  les titres de section. Ordre A « histoire d'abord » validé par
  l'utilisateur. Rien qui dépende de la cliente (photo, tarifs : emplacements
  prêts).
- 📏 Accueil 1440×900 : **8 230 px** (7 017 avant, +2 blocs) ; mobile 9 722.
- ✅ QA : build 10 pages sans résidu, ordre du DOM conforme, 6 blobs en
  parallaxe, traits tracés, carrousel (onglets, clavier, auto, pause, sans
  JS), bandeau (défile, pause au survol), étapes et carte tracées, mobile
  sans débordement, console vide, **Lighthouse desktop (build) : performance 100,
  accessibilité 97** (seul défaut : la tagline atténuée, préexistante).
- ♻️ Corrections en cours de route : ligne SVG des étapes à dimensions
  explicites (élément remplacé), fin du scrub à mi-écran (le 3e cercle
  s'allumait trop tard en colonne), carte enveloppée dans un conteneur de la
  page pour le `sticky` (la racine d'un composant ne reçoit pas le scope
  Astro du parent), contour de la carte plus affirmé, `bootBlobs` dans
  `gsap.matchMedia`, `isolation` sur les titres à trait, règle sans-JS du
  carrousel, médaillon du carrousel en teintes 35 %.
- ♿ Revue des composants (2 points importants corrigés) : le bandeau ne peut
  plus être défilé par le focus clavier (`overflow: clip`) et se replie en
  liste statique au `:focus-within` (toutes les capsules visibles) ; en
  `reduced-motion` le carrousel n'a plus d'auto ni de bouton pause (le bouton
  naissait inversé) ; panneaux du carrousel retirés du tab order ; ligne des
  étapes exactement de centre à centre ; trait posé aussi sur « Qui je suis »
  (titre sorti du reveal). Textes du carrousel = les données (`accompagnements.ts`),
  spec alignée.

### 2026-09-09 (recomposition du site)
- ♻️ **Les blobs ne sont plus coupés aux bords des sections** (retour
  utilisateur : « le tronçage casse la fluidité ») : `.section--blob` et le
  `PageHero` perdent leur `overflow: clip`, les formes coulent d'une section à
  l'autre sous le contenu (fonds transparents) ; le débordement horizontal est
  coupé une seule fois sur `<main>` (`overflow-x: clip`, aucun effet sur le pin
  ni sur le header fixe). Les trois blobs réduits pour tenir dans leur section
  (périnatalité, TDAH, enfants) reprennent une taille généreuse.
- 🗑️ **« Respirez. » retiré de la traversée** (demande utilisateur) : la scène
  passe à deux phrases (« Parfois, tout pèse un peu trop. » → « La lumière
  revient, à votre rythme. ») et le pin à `+=100%` ; accueil à **7 017 px**.
  `Manuscrit.astro` reste sur le disque (recette du stylo Hershey), plus importé.
- ✨ **Indice de défilement** sur l'écran 0 (« Faites défiler » + souris à
  point animé, framboise) : la scène étant épinglée, il dit qu'il faut scroller ;
  visible seulement en scène desktop, effacé dès 2 % de progression, animation
  coupée en reduced-motion.
- ✨ **Recomposition complète selon la spec du 2026-09-08** (plan
  `docs/superpowers/plans/2026-09-09-xenia-recomposition.md`, exécuté par
  sous-agents avec double revue conformité + qualité par tâche) : hero en deux
  colonnes (texte sur **scrim** ivoire, **médaillon aquarelle** permanent du
  cabinet, halo derrière), traversée resserrée (`+=120%`, voile à 0,55, poster
  du film visible dès l'écran 0 : plus jamais blanc), sortie du hero masquée
  (plus de ligne droite), pétales = deux « rencontres » du logo. Fin des bandes
  ivoire à vagues : **`Blob.astro`** (forme organique dégradée, 5 tracés
  générés par harmoniques et figés, 7 teintes, dérive lente, mobile = lavis
  centré qui couvre la section) derrière chaque section, **cartes teintées** par
  thème, verre dépoli toujours sur un blob, **une seule vague** (dans le Footer).
  Accueil : 8 cartes « Ce qui vous amène » teintées, section **« Qui je suis »**
  (remplace le teaser Approche : `Portrait.astro`, citation, 3 repères à
  puce-pétale, 2 liens), **rencontre nutrition** (3 pétales en verre à 120° +
  disque « Équilibre psychologique »), tagline déplacée avant les lieux.
  Pages intérieures : `PageHero` à médaillon fondu (multiply sur dégradé,
  anneau de verre) + blob, `Domaines` teinté par page, cartes teintées,
  FAQ/TDAH/focus en verre sur blob, « Pour qui » en 3 liens-cartes,
  **« Itinéraire »** Google Maps sur chaque cabinet (URL de recherche, zéro
  cookie), mentions en lilas doux. Textes inchangés hors guillemets insécables
  et micro-ajouts prévus.
- 🎬 **Film régénéré** : Seedance 2.5 via Higgsfield, 24 s, 1080p, **216
  crédits** (1 seule génération, acceptée à l'œil sur 4 frames : papier blanc,
  aucune zone grise, montée de couleur monotone). Encodage all-intra
  1280×720@20 crf 27 → **7,1 Mo, 482 frames I** ; poster à 30 %. Master dans
  `brief/masters/` (hors git).
- 🖼️ **Aquarelle du hero** : Kie `nano-banana-pro`, 3 candidats 4:5 2K
  (`scripts/illustration_hero.sh`), le n° 1 retenu (fauteuil pêche, voilage,
  rai de lumière, feuilles, coussin framboise, beaucoup de blanc), WebP 640 /
  1040 / 1600 (`scripts/convertir_hero.mjs`).
- 📏 **Hauteurs mesurées** (1440×900, avant → après) : accueil 9 014 → **7 017**
  (−22 %, après le retrait de « Respirez. »), approche 3 799 → 3 473 (−9 %, +3 liens-cartes), ado-adultes
  3 422 → 2 906 (−15 %), périnatalité 3 316 → 2 874 (−13 %), enfants
  3 133 → 2 611 (−17 %), nutrition 3 325 → 2 805 (−16 %), à propos
  3 288 → 2 750 (−16 %), lieux 4 059 → 3 539 (−13 %), mentions 2 213 → 2 123.
  ⚠️ Pages intérieures en deçà de l'objectif −20 % de la spec, accueil à 7 017
  contre ≤ 6 800 : la scène épinglée pèse 1 800 px et la vague du footer
  ajoute 90 px partout — resserrer
  davantage se décide à l'écran (leviers : `--section-pad`, pin, padding du
  PageHero).
- ✅ **QA** : build 10 pages, 0 résidu `soft-wrap`/`section--soft`/
  `card--undefined`, 1 vague par page, verre sur blob desktop ET mobile,
  `scrollWidth` = viewport partout, console vide, hero complet visible sur
  1366×768, **Lighthouse desktop (build) : performance 99, accessibilité 96**
  (seul défaut : l'état atténué initial des mots de la tagline, préexistant).
- ♻️ Correctifs issus des revues : `isolation: isolate` sur les médaillons,
  jetons `--radius-organique` / `--petale-rose` / `--petale-sage`, `will-change`
  coupé en reduced-motion, `aria-label` sur les liens Itinéraire / RDV, blobs
  redimensionnés pour tenir dans leurs sections (périnatalité, TDAH, enfants),
  libellés de la rencontre à 80 % du pétale, `<link rel="preload">` du poster
  sur l'accueil, `sizes` du médaillon à 402 px.
- ⚠️ **Rien n'est committé ni redéployé** : phase de réglage visuel en
  localhost (`pnpm dev`, http://localhost:4331), validation à l'écran d'abord.

### 2026-08-11 (nuit — le film d'aquarelle dans le hero)
- 🎬 **Film génératif dans la traversée** (demande utilisateur « comme pour
  capital car ») : Seedance 2.5 via Higgsfield (78 crédits, 12 s — encres
  pastel qui fleurissent sur ivoire, l'arc de l'éclaircie) + upscale 4K
  ByteDance. Couche profonde de l'aurore, révélé quand le voile se lève ;
  desktop : préchargé en Blob, `currentTime` scrubé par la scène (cible via
  `onUpdate`, lissage 0,14 en rAF) ; mobile : boucle ; sans JS : poster.
- 🐛 **« Pas fluide du tout » (retour utilisateur) → réglé** : le film web
  était en GOP par défaut → chaque seek décodait depuis la keyframe. Ré-encodé
  **ALL-INTRA** 1280×720@20 depuis le master 4K (recette du journey-scrub de
  capitale-cars, ffprobe : 100 % frames I, 6,6 Mo) + seuil de seek 1/30 s.
- 📦 Masters livrés : film aquarelle 4K (27 Mo) + vidéo du hero complet 4K.

### 2026-08-11 (nuit — le stylo écrit « Respirez. »)
- ✍️ **Écriture manuscrite scrubée** (demande utilisateur « comme un stylo qui
  écrit ») : l'acte 2 de la traversée écrit « Respirez. » lettre après lettre
  en cursive liée — glyphes **single-stroke Hershey Script** (fonte de traceur
  monoligne, domaine public — une vraie trajectoire de plume, pas un contour
  de police), un `<path pathLength="1">` par lettre assemblé dans
  `Manuscrit.astro`, `stroke-dashoffset` séquencé dans la timeline épinglée.
  Recette réutilisable : `hersheytextjs` (JSON), décaler chaque glyphe de
  l'avancement `o`, les liaisons cursives se recouvrent naturellement.

### 2026-08-11 (nuit — la traversée, scène épinglée au scroll)
- ✨ **Le hero desktop devient une scène pin + scrub** (patron Capitale Cars,
  demandé par l'utilisateur — l'intro au chargement se ratait trop
  facilement) : « Parfois, tout pèse un peu trop. » sur le voile → le scroll
  lève le voile et allume le halo → « Respirez. » → pétales + « La lumière
  revient, à votre rythme. » → le vrai hero se lève mot à mot. ~2 écrans de
  scroll, rejouable en remontant. `sort()+refresh()` après le pin.
  Mobile : intro courte au chargement. Sans JS / reduced-motion : statique.
- 📸 Vérifié par captures à 5 positions de scroll + console propre.

### 2026-08-11 (nuit — hero signature « L'éclaircie »)
- ✨ **Chorégraphie d'ouverture GSAP** (~3 s) : voile qui se dissout, halo qui
  s'allume, pétales du logo en dérive dans l'aurore, mots du H1 levés en
  masques (split JS, aria-label intégral conservé), **trait de pinceau tracé**
  sous « mieux-être durable » (SVG pathLength, dégradé framboise→rose).
  Parallax de sortie scrubée (sans pin). Vérifié par captures à t≈0 / 0,8 s /
  2,8 s + mesures (7 mots splittés, voile à 0, dashoffset 0, console propre).
- 🛡️ Garde-fous : classe `js-intro` posée **avant le premier paint** (script
  inline — zéro flash), timeout 3 s anti-voile-bloqué, reduced-motion et
  sans-JS = hero complet statique, GSAP toujours en import dynamique.
- 🖼️ **Aquarelle Approche** (Kie, 0,04 $ — arrosoir + jeune pousse : grandir
  à son rythme) en médaillon du hero de la page.

### 2026-08-11 (soir — upgrade techniques + aquarelles générées)
- ✨ **Upgrade techniques** (chapitre du skill redesign) : **grain** fixe global
  (feTurbulence 4 %), **spotlight borders** (liseré illuminé sous le curseur,
  masque de bordure + `--sx/--sy` posés au pointermove/rAF — prouvé),
  **split-scroll** opposé sur la section nutrition (dérives mesurées
  +13,9 px / −1,9 px, scrub sans pin).
- 🖼️ **Série de 4 aquarelles pastel** (palette charte, sur ivoire) : cartes
  accueil (voile multiply) + médaillons organiques des heros intérieurs.
  Higgsfield seedream 4.5 (chaussons, fruits-thé) + Kie nano-banana-pro
  (fauteuil, crayons — 0,12 $). Webp via `scripts/convertir_illustrations.mjs`.
  ⚠️ Modération Higgsfield **erratique** : « nsfw » en faux positif sur des
  natures mortes ; les mots « baby/child/herbs/plant/powder/petal » bloquent en
  entrée, et un classifieur de sortie retoque au hasard — reformuler en
  scènes-objets et retenter, ou basculer sur Kie.
- 🔎 Ancien site mindfoodyou.be inspecté : thème WordPress de démo (images
  tyler.com), **aucune vraie photo** — seul upload : l'ancien logotype.
  Le portrait attend toujours les photos de la cliente.

### 2026-08-11 (soir — itération design, skills elayadesign)
- ✨ **Audit appliqué** (skills `redesign-existing-projects` + `landing-page-design`
  de github.com/elayadesign, installés dans `website/.claude/skills/`) en
  **préservant la charte cliente** (aurore, italiques Fraunces — leurs Design
  Values par défaut ne s'appliquent pas, la grille d'audit si) :
  section **tagline reveal** sur l'accueil (mots activés un à un au scroll,
  prouvé par opacités mesurées 0,45/0,22/0,22 en mi-parcours), **escalier**
  des 3 cartes accompagnements (symétrie générique cassée), skip-link +
  `<main>`, états `:active`, **FAQ 4 → 6** questions + JSON-LD synchronisé,
  page **/mentions-legales/** (vie privée honnête : zéro cookie, zéro
  collecte) + lien footer. 10 pages au build.
- ⚠️ Piège documenté : `clearProps` ajouté à `bootReveals` — sans lui, le
  transform inline résiduel de GSAP écrase les offsets CSS (escalier).

### 2026-08-11 (après-midi — maquette en ligne)
- 🚀 **Maquette déployée : https://xenia.chris-ia.com** (dépôt public
  `cltconcept/xenia-website`, Docker → nginx, Coolify, HTTPS auto). Vérifié sur
  le site servi : les 9 pages + sitemap/robots/llms.txt/og.png/PDF en 200,
  JSON-LD `MedicalBusiness` + `FAQPage` dans le HTML livré, canonical vers le
  domaine provisoire, zéro erreur console.
- 🐛 **Vraie 404** : le fallback SPA de nginx servait l'accueil en 200 pour
  toute URL inconnue (soft-404) → `try_files =404` + `error_page 404 /404.html`,
  re-vérifié en prod après redéploiement.
- 📄 Dossier PDF servi : https://xenia.chris-ia.com/dossier-xenia-van-outryve.pdf

### 2026-08-11
- ✨ Création complète du site (design system, 8 pages + 404, header à menu
  déroulant, footer, animations différées) à partir du moodboard et du mail
  cliente du 27/07/2026 — méthode boucle visuelle `/browse` (desktop + mobile
  + burger + dropdown vérifiés sur captures).
- ✨ Liens de prise de RDV **réels vérifiés en ligne** : Doctoranytime
  (`/d/psychologue/xenia-van-outryve`) et Rosa (`/fr/hp/xenia-van-outryve/`).
  Bonus vérifié : Master en psychologie clinique de la santé (UCLouvain).
- ✨ SEO/GEO : JSON-LD `MedicalBusiness` (3 adresses, 2 ReserveAction),
  `FAQPage` sur Lieux & Contact, sitemap, robots, llms.txt, OG 1200×630
  rendue depuis la charte. Vérifié **dans le build** (`dist/`).
- 📄 Dossier client : `docs/dossier-xenia-van-outryve.pdf` — scores SEO 91 /
  GEO 86, gains rapides appliqués le jour même. Copie servie dans `public/`
  (à refaire à chaque régénération), `Disallow` dans robots.txt.
- 🔧 Dockerfile multi-étages → nginx:alpine + `.dockerignore` (piège
  node_modules hôte) ; `brief/` exclu du dépôt **et** de l'image (fil privé).
- 🔧 Déploiement débloqué après accord utilisateur sur la création du dépôt
  public (le classifieur auto l'avait refusée une première fois).

## Problèmes connus / à confirmer cliente
- **Nom de domaine non tranché** (Mindfoodyou.be abandonné) — placeholder
  `xeniavanoutryve.be` dans `astro.config.mjs` (canonical/sitemap/JSON-LD).
- **Tarifs et moyens de paiement précis** : seule certitude vérifiée
  (Doctoranytime) : « paiement mobile accepté ». Remboursement mutualité
  formulé prudemment.
- **Portrait** : placeholder élégant en attendant les photos.
- Nom d'état civil complet « van Outryve d'Ydewalle » vu sur les annuaires —
  le site suit le brief (« Xenia Van Outryve ») ; à confirmer.
- Réseaux sociaux « à venir » (brief) : rien d'affiché pour l'instant.
- **Aquarelle du hero à valider par la cliente** (elle reste même après les
  photos ; le portrait vit dans « Qui je suis » et À propos).
- Hauteurs : accueil à 8 230 px après les nouveaux blocs — au-dessus des
  cibles de la spec du 08/09 (≤ 6 800). À trancher à l'écran.
- **Reste du contrôle qualité du 09/09** : redéployer pour activer les en-têtes
  nginx (et valider la syntaxe), adresse de siège de l'éditrice à demander.
- **Corrections impeccable du 12/09 (8 P1) committées le 13/09** (`528fa01`),
  puis allègement + iconographie (commit du même jour).
- **Accueil desktop à 8 370 px (mobile 10 021)** : hauteur stable malgré −35 %
  de texte, les cinq vignettes occupant la place libérée ; cible ≤ 6 000 px de
  la spec du 13/09 non atteinte. Leviers : vignettes en position absolue dans
  la zone du blob plutôt qu'en flux (≈ −500 px), tailles réduites, ou retirer
  des blocs (approche B, écartée).
- **Reste impeccable (P2/P3, non corrigés)** (`docs/impeccable/2026-09-12/synthese.md`) :
  `mailto:` visio sans adresse visible, pétales animés en reduced-motion,
  déroulant non refermable par Échap, verre dans l'élément qui respire, 20
  animations infinies sans pause hors viewport, cibles tactiles < 44 px
  (capsules, Pause, liens du footer), nav coupée à 1024 px avec zoom texte
  200 %, couleurs hors jetons, `lenis` et `Manuscrit.astro` morts, breakpoint
  700 px, `sizes` du médaillon. Commandes : quieter/distill → adapt → polish.

## Déploiement (maquette) — en ligne depuis le 2026-08-11
**https://xenia.chris-ia.com** — HTTPS automatique (wildcard `*.chris-ia.com`),
aucun DNS à créer.

| Élément | Valeur |
|---|---|
| Coolify | `http://46.224.83.139:8000` (instance **maquettes**, ⚠️ jamais la prod Noveo `188.245.156.214`) |
| Serveur | `zw8ck4ckcw08gg00g8wwkkso` |
| Projet | `p124wf4ynk21bns4c8153iaj` |
| Application | `seetu6uqg4tnkjg8do4f1f8n` |
| Dépôt | `github.com/cltconcept/xenia-website` (**public** — requis par Coolify sans clé SSH) |
| Build pack | `dockerfile` (multi-étages → nginx:alpine, port 80) |

Redéployer après un `git push` : `GET {base}/api/v1/deploy?uuid=seetu6uqg4tnkjg8do4f1f8n`
(jeton d'API Coolify requis — `~/.claude.json` → `mcpServers.coolify.env` —
jamais stocké dans le dépôt).

⚠️ Les `canonical` et le sitemap pointent volontairement vers le domaine
provisoire `xeniavanoutryve.be` : la maquette ne peut pas se faire indexer.
Ne pas « corriger ».
📄 Dossier client en ligne : `https://xenia.chris-ia.com/dossier-xenia-van-outryve.pdf`
(copie de `docs/` vers `public/` — **à refaire à chaque régénération** — et
`Disallow` dans robots.txt).
