# Audit technique impeccable, dimensions 1 à 4 : site Xénia Van Outryve

Périmètre : dimensions Accessibilité, Performance, Theming et Responsive de la commande `/impeccable audit` (grille `audit.md` 4.3.1). La dimension 5 (intégrité d'implémentation) est traitée par un autre agent. Audit en lecture seule : aucun fichier du projet modifié, aucune commande git, serveur de dev laissé tel quel.

Environnement de mesure : Chromium headless via Playwright sur le dev server `http://127.0.0.1:4331/`, viewports desktop 1440×900, mobile 390×844 émulé iPhone (DPR 2, tactile), tablette 768×1024, laptop 1024×768, plus le mode `prefers-reduced-motion: reduce`. Pages mesurées : accueil `/`, `/approche/`, `/lieux-contact/`. Les contrastes sont calculés sur le fond réellement rendu (échantillonnage de pixels après masquage du texte, grain neutralisé), pas sur la couleur CSS déclarée. Les tailles de bundle viennent du `dist/` du 9 septembre 2026.

---

## 1. Tableau des scores

| # | Dimension | Score 0-4 | Constat clé |
|---|---|---|---|
| 1 | Accessibilité | **2** | Fondations solides (tabs ARIA, skip-link, landmarks, alt, focus visible), mais trois violations AA mesurées : `--muted` sous 4,5:1 sur tout le footer et sur les lavis mobiles ; focus clavier posé sur des CTA à opacité 0 dans le hero épinglé ; premier clic sur une capsule du bandeau perdu. |
| 2 | Performance | **2** | Film du hero de 7 Mo téléchargé en entier sur chaque visite desktop avant tout scroll, sans test de connexion ; 22 `will-change` au repos dont 6 lavis mobiles inertes (≈ 57 Mo de textures) ; 20 animations infinies permanentes. Le reste est propre (GSAP différé, DOM léger, polices subsetées, lazy). |
| 3 | Theming | **3** | Système de jetons complet et respecté pour encres, accents, rayons, typo. Une trentaine de `rgba()` dérivés retapés hors jetons, quatre teintes d'aurore hors palette dans le hero, `#F1E9E4` du footer. Pas de mode sombre, non prévu par le DESIGN.md : noté, pas pénalisé. |
| 4 | Responsive | **3** | Aucun débordement horizontal à 390, 768 et 1440, hero non épinglé sur mobile, zoom texte 200 % tenu à 1440. Burger 38 px, bouton Pause 32 px, capsules 41 px, nav desktop coupée à 1024 px avec zoom texte 200 %. |
| **Total (4 dimensions)** | | **10/16** | |

Justification selon la grille : A11y = « partiel : effort réel, lacunes AA significatives » ; Performance = « partiel : optimisations présentes, mais un gouffre (le film) et des couches inutiles » ; Theming = « bon : jetons utilisés, valeurs en dur mineures » ; Responsive = « bon : responsive, cibles tactiles et un cas de zoom ».

---

## 2. Constats détaillés par sévérité

Aucun P0.

### P1, majeurs

#### 1. Le premier clic ou tap sur une capsule du bandeau ne navigue pas
- **Localisation** : `src/components/Bandeau.astro:38-41`, règles `.bandeau:focus-within` (mask retiré, `animation: none`, `width: auto`, listes en `flex-wrap`, copie masquée).
- **Catégorie** : Accessibilité + interaction tactile (Responsive).
- **Mécanisme prouvé** (trace d'événements, script `touch8.py`) :
  - tap mobile : `pointerdown@A:Burn-out` (piste 2843 px, animée) → `pointerup@A:Burn-out` → `focusin@A:Burn-out` (le lien reçoit le focus : `:focus-within` s'applique, piste 390 px, animation none, reflow) → `click@UL.bandeau__liste` : l'élément sous le doigt est devenu « Stress & anxiété », le `click` se résout sur l'ancêtre commun, aucune navigation ;
  - clic souris desktop : `pointerdown@A:Burn-out` → `focusin` (reflow à 1440 px) → `pointerup@A:Stress & anxiété` → `click@UL` ;
  - reproduit 4/4 (tap mobile, clic desktop, avec et sans mask, avec piste figée) ; avec la règle `:focus-within` neutralisée par CSS injecté, `click@A:Burn-out` dans les deux modes.
- **Impact** : la navigation par thèmes échoue au premier essai dans Chromium, Edge et Firefox (navigateurs qui donnent le focus aux liens au clic), et la piste saute sous le pointeur. Un second clic fonctionne, la piste étant alors statique. Safari desktop ne focalise pas les liens au clic, il est probablement épargné (non vérifié).
- **Norme** : défaut fonctionnel ; WCAG 2.1.1 et 2.5.2 par effet (l'action au pointeur n'aboutit pas).
- **Recommandation** : réserver la mise en page clavier au focus visible : `.bandeau:has(.chip:focus-visible)` à la place de `:focus-within` ; ou ne faire que suspendre l'animation au focus (`animation-play-state: paused`) sans reflow, en assurant que la capsule focalisée reste dans le viewport (`scrollIntoView` inline nearest).
- **Commande** : `/impeccable harden`.

#### 2. Contraste de `--muted` insuffisant partout où le fond n'est pas l'ivoire pur
- **Localisation** : `src/styles/global.css:13` (`--muted: #7A6B82`, 4,78:1 sur ivoire, aucune marge) ; `src/components/Footer.astro:67` (dégradé `--ivory-soft` → `#F1E9E4`) et `:82, 105, 107, 113, 115` (textes muted du footer) ; `src/pages/lieux-contact.astro:195` (réponses FAQ sur verre) ; `src/components/Blob.astro:75-81` (lavis mobile 130 vw sous tout le contenu des sections à blob).
- **Catégorie** : Accessibilité.
- **Mesures** (fond réel) : footer 4,12 à 4,33 (tagline, lieux, légal, bas de page, lien mentions, « respirer ») ; FAQ sur verre + blob lilas 4,41 ; sur mobile : copy « première séance » 4,07, descriptions d'étapes 4,09, copy nutrition 4,19, adresse d'un cabinet 4,28, légende du portrait 3,50, copy du PageHero de lieux-contact 4,04.
- **Impact** : tout le texte secondaire du site en 13 à 17 px passe sous le seuil AA dès qu'un fond teinté, un verre ou un lavis se trouve dessous ; sur mobile, la quasi-totalité des sections de l'accueil est concernée.
- **Norme** : WCAG 1.4.3 AA.
- **Recommandation** : le jeton `--muted-hero #6E5F76` existe déjà (`global.css:14`) et tient 5,7:1 sur ivoire et 4,9:1 sur le footer : aligner `--muted` dessus, ou créer un `--muted-strong` employé sur toute carte teintée, verre, lavis et footer.
- **Commande** : `/impeccable colorize`.

#### 3. Framboise en petit texte sur fond teinté sous 4,5:1
- **Localisation** : `src/components/Etapes.astro:73-74` (numéro d'étape 16 px sur dégradé rose → lilas) ; `src/pages/index.astro:655-658` avec `global.css:47` (sur-titre du hero mobile 14 px : le scrim mobile est transparent sur les 28 premiers pour cent, le texte tombe sur l'aurore et le film) ; `src/pages/index.astro:718-724` (citation italique 18 px sur lavis rose-lilas mobile).
- **Catégorie** : Accessibilité.
- **Mesures** : numéro d'étape 4,37 (accueil et approche) ; sur-titre hero mobile 3,80 médian, 3,44 au pire ; citation mobile 4,02 ; tête de colonne du footer 4,50 tout juste.
- **Impact** : les libellés d'identité du hero (« Psychologue clinicienne · Santé · … ») sont les moins lisibles de la page sur téléphone.
- **Norme** : WCAG 1.4.3 AA.
- **Recommandation** : `--framboise-deep #A83355` pour tout texte framboise en dessous de 24 px posé sur une teinte (6,2:1 sur ivoire) ; sur mobile, faire démarrer le scrim du hero plus haut ou poser un scrim local sous le sur-titre.
- **Commande** : `/impeccable colorize`.

#### 4. Focus clavier posé sur des liens invisibles dans le hero épinglé
- **Localisation** : `src/pages/index.astro:423` (`.hero .actions` ne monte qu'à 73 % de la scène), `:653` (état pré-paint `html.js-intro .hero [data-h] { opacity: 0 }`), scène `:371-428`.
- **Catégorie** : Accessibilité.
- **Preuve** : parcours Tab réel (`tab-home.json`) : les 12ᵉ et 13ᵉ tabulations arrivent sur « Prendre rendez-vous » puis « Découvrir mon approche » du hero avec une opacité effective de 0 ; la capture `tab-home-focus-hero.png` ne montre aucun anneau de focus, seule la phrase « Parfois, tout pèse » et l'indice « Faites défiler ». La scène ne bouge pas, le navigateur ne scrolle pas.
- **Impact** : l'utilisateur clavier perd le focus deux fois de suite dès le hero, sur les deux liens les plus importants de la page.
- **Norme** : WCAG 2.4.7 (focus visible) et 2.4.3 (ordre de focus).
- **Recommandation** : sur `focusin` dans `.hero__txt`, amener la scène à sa fin (`ScrollTrigger` de la timeline : `scroll(end)`) ou lever les états GSAP ; et poser `visibility: hidden` sur les éléments tant qu'ils sont à opacité 0 (`autoAlpha` côté GSAP) pour les sortir de l'ordre de tabulation.
- **Commande** : `/impeccable harden`.

#### 5. Film du hero : 7 Mo téléchargés d'office sur desktop
- **Localisation** : `src/pages/index.astro:333-353`, branche `isDesktop()` de `chargerFilm` (`fetch` + Blob) ; le test `navigator.connection.saveData` n'existe que dans la branche mobile (`:358`).
- **Catégorie** : Performance.
- **Mesures** : `fetch` de 7 095 962 octets déclenché 294 ms après la navigation, avant tout scroll, sans test de `saveData` ni d'`effectiveType`, récupéré en Blob donc sans streaming ni lecture progressive. Le film ne devient perceptible qu'à partir de 10 % de la scène et reste à 0,35 à 0,75 d'opacité sous scrim. Il est aussi servi à toute fenêtre ≥ 1024 px, donc à une tablette en paysage.
- **Impact** : la page d'accueil pèse 4,5 fois plus que tout le reste réuni (fonts + JS + CSS + images ≈ 1,5 Mo) ; sur 4G ou partage de connexion, c'est le premier poste de coût du site.
- **Recommandation** : ne lancer le fetch qu'au premier scroll (ou à l'entrée dans la scène), respecter `saveData` et `effectiveType` sur desktop, réencoder un master all-intra plus léger (720p, débit réduit ; l'objectif de seek instantané reste tenu), et envisager une séquence d'images WebP scrubée pour le desktop.
- **Commande** : `/impeccable optimize`.

#### 6. `will-change` au repos et lavis mobiles inertes
- **Localisation** : `src/components/Blob.astro:61` (`will-change: transform` permanent) et `:75-81` (mobile : 130 vw × 105 %, aucune animation sous 961 px, parallaxe GSAP réservée au-dessus de 1024 px) ; `src/styles/global.css:261` (`.aurora__blob`), `:273` (`.halo`), `:358` (`.swi`).
- **Catégorie** : Performance.
- **Mesures** : 22 éléments avec `will-change` au repos sur l'accueil (desktop et mobile). Sur mobile, les 6 blobs mesurent 507 px sur 778 à 1447 px, ne sont animés ni par CSS ni par GSAP, et gardent `will-change: transform` : ≈ 57 Mo de textures composées à DPR 2 pour de la décoration immobile. Les 7 `.swi` du H1 gardent aussi leur `will-change` après l'intro.
- **Impact** : mémoire GPU et risque d'éviction de couches ou de damiers sur iPhone d'entrée de gamme ; sur desktop retina, la même famille de couches (blobs, aurores, halos) représente ≈ 88 Mo, mais ces éléments y sont réellement animés.
- **Recommandation** : `will-change` uniquement sous `@media (min-width: 961px)` pour `.blob` ; retirer celui des `.swi` en fin d'intro (`clearProps: 'willChange'`) ; laisser le navigateur promouvoir seul les éléments animés en CSS (il le fait déjà).
- **Commande** : `/impeccable optimize`.

### P2, mineurs

#### 7. Pétales du hero animés malgré `prefers-reduced-motion`
- **Localisation** : `src/pages/index.astro:547-558` (`petale-drift` sans surcharge reduced-motion).
- **Catégorie** : Accessibilité (mouvement).
- **Mesure** : en mode réduit, ce sont les 2 seules animations encore en cours (`rm-home.json` : `running = [hero__petale--1, hero__petale--2]`), tout le reste est figé.
- **Norme** : WCAG 2.3.3 (AAA) et engagement du DESIGN.md (« reduced-motion = statique »).
- **Recommandation** : ajouter `.hero__petale { animation: none }` dans le bloc reduced-motion existant (`index.astro:638`).
- **Commande** : `/impeccable quieter`.

#### 8. Menu déroulant « Accompagnements » non refermable au clavier
- **Localisation** : `src/components/Header.astro:78` (Échap ne ferme que le menu mobile), `:162-167` (`:hover` / `:focus-within` / `.is-open`), `:17` (bouton avec `aria-haspopup` mais sans `aria-controls`).
- **Catégorie** : Accessibilité.
- **Mesure** : menu visible au focus du bouton, toujours visible après Échap (`tab-home.json`, `dropdown: visibleOnFocus=visible, afterEscape=visible`).
- **Norme** : WCAG 1.4.13 (contenu au survol ou au focus : dismissible).
- **Recommandation** : sur Échap, retirer `.is-open`, rendre le focus au bouton et neutraliser `:focus-within` par une classe d'état ; ajouter `aria-controls` et un `id` sur `.nav__drop-menu`.
- **Commande** : `/impeccable harden`.

#### 9. Verre dépoli à l'intérieur d'un élément qui respire en continu
- **Localisation** : `src/pages/index.astro:758` (`.rencontre`, `rencontre-respire` en scale infini) contenant trois `backdrop-filter: blur(18px) saturate(150%)` (`:766-767`).
- **Catégorie** : Performance.
- **Mesures** : 8 `backdrop-filter` sur l'accueil (nav, 2 flèches, 3 pétales, 2 menus masqués) ; 10 sur `lieux-contact` mobile (nav, visio, 6 cartes FAQ, 2 menus masqués). Les 3 pétales mesurent 164 à 321 px et se re-rasterisent à chaque frame de la respiration, même hors écran.
- **Impact** : coût GPU permanent sur mobile, plus lourd encore sur Safari.
- **Recommandation** : pause de l'animation hors viewport (IntersectionObserver + `animation-play-state`) ; remplacer le verre des cartes FAQ par un fond semi-opaque sans flou (le blob dessous est statique sur mobile).
- **Commande** : `/impeccable optimize`.

#### 10. Vingt animations infinies actives en permanence sur l'accueil
- **Localisation** : `global.css:262, 275` (`blob-drift`, `halo-breathe`), `Blob.astro:65` (`blob-derive`), `index.astro:550` (`petale-drift`), `:758` (`rencontre-respire`), `:632` (`indice-point`), `Bandeau.astro:32` (`bandeau-defile`), `Footer.astro:93`.
- **Catégorie** : Performance.
- **Mesures** : 20 animations infinies desktop, 14 mobile, toutes en transform ou opacité (aucune propriété de layout), donc sans reflow, mais le compositeur ne dort jamais, y compris pour les blobs et halos hors viewport.
- **Recommandation** : un seul IntersectionObserver posant `animation-play-state: paused` hors viewport sur `.blob`, `.aurora__blob`, `.halo`, `.rencontre`.
- **Commande** : `/impeccable quieter`.

#### 11. Cibles tactiles sous 44 px
- **Localisation et mesures à 390** : `button.nav__burger` 38×38 (`Header.astro:182`) ; `button.carrousel__pause` 76×32 (`Carrousel.astro:202-206`) ; `a.chip` 41 px de haut (`global.css:210`) ; `a.lieux__itin` 76×32 à 38 (`LieuxCards.astro:54`) ; `a.btn-pill--sm` 39 px ; liens du footer 23 px de haut espacés de 8 px (`Footer.astro:99-101`) ; `a.footer__legal-link` 17 px, en ligne.
- **Catégorie** : Responsive.
- **Norme** : WCAG 2.5.8 AA respecté grâce à l'exception d'espacement (cercles de 24 px non sécants) et à l'exception des liens en ligne ; 2.5.5 AAA et la grille impeccable (44×44) ne le sont pas.
- **Recommandation** : zone de 44 px sur le burger par padding négatif compensé, hauteur 44 sur Pause, `gap: 12px` dans les colonnes du footer, `padding-block: 11px` sur les capsules.
- **Commande** : `/impeccable adapt`.

#### 12. Nav desktop coupée à 1024 px avec zoom texte 200 %
- **Localisation** : `src/components/Header.astro:243` (les liens ne passent au burger qu'à 960 px).
- **Catégorie** : Responsive.
- **Mesure** (`zoom-home-1024.json`) : à 1024 px et `font-size: 200 %`, pilule de 1370 px de large, bord droit à 1197 px, CTA « Prendre rendez-vous » hors écran ; à 1440 px et 200 %, la pilule fait 1416 px et tient à 12 px près. Le zoom navigateur classique bascule sur le burger et ne pose pas de problème ; seul le zoom texte seul est touché.
- **Norme** : WCAG 1.4.4.
- **Recommandation** : passer au burger sous 1100 px, ou autoriser le retour à la ligne de la pilule (`flex-wrap`) à partir d'un seuil en `em`.
- **Commande** : `/impeccable adapt`.

#### 13. Liens externes sans annonce de nouvel onglet et nom accessible réécrit
- **Localisation** : `src/components/LieuxCards.astro:21-22`, six liens `target="_blank" rel="noopener"`.
- **Catégorie** : Accessibilité.
- **Mesure** : aucun des six noms accessibles ne mentionne l'ouverture d'un nouvel onglet ; l'`aria-label` « Rendez-vous à Nivelles sur Doctoranytime » ne contient pas le texte visible « Rendez-vous sur Doctoranytime » de façon contiguë.
- **Norme** : WCAG 2.5.3 A (label in name), 3.2.5 AAA (changement de contexte).
- **Recommandation** : garder le texte visible en tête du nom (« Rendez-vous sur Doctoranytime, Nivelles, nouvel onglet ») ou utiliser un `<span class="sr-only">` plutôt qu'un `aria-label` qui écrase le texte.
- **Commande** : `/impeccable harden`.

### P3, finition

#### 14. Couleurs hors jetons
- **Localisation** : `index.astro:59-63` (quatre teintes d'aurore hors palette : `rgba(255,197,162)`, `rgba(203,181,238)`, `rgba(174,224,206)`, `rgba(243,177,206)`) ; `index.astro:90` (stops du trait SVG `#C13D63`, `#F3B1CE` en attribut) ; `Footer.astro:67` (`#F1E9E4`) ; `global.css:160` (`#3C5F4E`) ; onze `#fff` dans `global.css` ; 35 valeurs `rgba()` distinctes retapées dans `Header.astro`, `PageHero.astro`, `Closing.astro`, `Portrait.astro`, `index.astro`, `perinatalite-parentalite.astro`.
- **Catégorie** : Theming.
- **Impact** : une retouche de palette ne se propage pas ; la nuance de scrim de la nav (`rgba(253,251,248,0.85/0.92/0.96)`) est écrite trois fois.
- **Recommandation** : jetons `--ivory-deep`, `--white`, `--ink-a10`, `--rose-a35`, etc., et `stop-color: var(--framboise)` en style inline sur les stops SVG.
- **Commande** : `/impeccable colorize`.

#### 15. Breakpoint hors canon
- **Localisation** : `src/pages/mentions-legales.astro:108`, `@media (max-width: 700px)`. Le DESIGN.md n'autorise que 480, 600, 960 et 1024 (480 n'est d'ailleurs jamais utilisé).
- **Catégorie** : Responsive.
- **Commande** : `/impeccable adapt`.

#### 16. Dépendance et composant morts
- **Localisation** : `package.json` déclare `lenis`, importé nulle part et absent du `dist/` ; `src/components/Manuscrit.astro` n'est monté par aucune page.
- **Catégorie** : Performance (bundle) / hygiène. Aucun coût dans le bundle livré, mais le brief parle de « GSAP + Lenis en import différé » alors que Lenis n'existe pas dans le site.
- **Commande** : `/impeccable distill`.

#### 17. `sizes` du médaillon et image du PageHero
- **Localisation** : `index.astro:115` (`sizes="(min-width: 1024px) 402px, 300px"` pour un rendu de 427 px à 1440 ; le fichier 1600w n'est jamais sélectionné) ; `PageHero.astro:30` (`approche.webp` 1200×896 sans `srcset` pour 357 px affichés).
- **Catégorie** : Performance. Les fichiers restent légers (21 à 106 Ko, 36 Ko), l'impact est faible.
- **Commande** : `/impeccable optimize`.

#### 18. Sémantique mineure
- **Localisation** : `Footer.astro:36, 46` (`aria-label` sur des `div` sans rôle, ignoré par les lecteurs d'écran) ; `LieuxCards.astro:15` (la ville d'un cabinet est un `<p>`, les trois cabinets de `lieux-contact` n'ont aucun titre de niveau) ; `Header.astro:17, 33` (boutons sans `type`, sans conséquence hors formulaire).
- **Catégorie** : Accessibilité.
- **Commande** : `/impeccable harden`.

---

## 3. Patterns systémiques

- **Un jeton calibré pour un seul fond.** `--muted` et `--framboise` tiennent tout juste 4,5:1 sur ivoire pur. Le design pose ensuite ces textes sur des cartes teintées, du verre sur blob, un footer plus sombre et des lavis mobiles pleine largeur. Chaque fond teinté fait tomber le ratio : 15 mesures échouent sur l'accueil mobile pour cette seule raison, 7 sur le footer desktop.
- **Le mobile hérite d'optimisations pensées desktop.** Le lavis 130 vw garde son `will-change`, les états pré-paint du hero restent alors que la scène ne s'y joue pas, et le test `saveData` n'existe que sur une branche.
- **Des états d'entrée larges servent d'interrupteurs de mise en page.** `:focus-within` et `:hover` déclenchent des reflows ; le focus souris et tactile les déclenche aussi. C'est la cause directe du bug du bandeau et de l'impossibilité de fermer le déroulant.
- **Variantes alpha des jetons recomposées à la main** dans neuf fichiers plutôt que déclarées une fois.
- **Décoration jamais mise en pause** : blobs, halos, aurores et pétales animent en continu, y compris hors viewport, et gardent leurs couches.

---

## 4. Points positifs à conserver

- **Carrousel en patron ARIA tabs complet** : `role="tablist"` nommé, `aria-selected`, `aria-controls` / `aria-labelledby` appariés, tabindex roulant, flèches clavier vérifiées (ArrowRight sélectionne l'onglet suivant et déplace le focus), Tab sort vers la flèche « précédent », bouton Pause avec `aria-pressed` masqué en reduced-motion, auto-défilement suspendu au survol, au focus, hors viewport et 20 s après toute interaction.
- **Reduced-motion réellement pensé** : `js-intro` jamais posé, hero complet et statique, zéro octet de GSAP ni de film chargé, bandeau replié en liste, traits et reveals posés d'emblée, transitions de mouvement coupées. Seuls les pétales échappent à la règle.
- **GSAP et ScrollTrigger jamais dans le bundle initial** : six modules initiaux pour 9 Ko ; les 115 Ko de GSAP arrivent par `import()` dans `motion.js`. Console vide (hors messages Vite) après scroll complet sur les trois pages, desktop et mobile.
- **Aucune animation de propriété de layout**, ni en CSS ni dans les timelines GSAP. Scrub du film écrit en rAF avec seuil d'un trentième de seconde, `pointermove` du spotlight throttlé au rAF et délégué.
- **Polices** : trois fichiers woff2 seulement grâce aux `unicode-range` (latin normal, latin italique, Hanken), deux préchargés, `font-display: swap` partout.
- **Médias** : poster du film préchargé, `<video>` en `preload="none"`, `muted`, `playsinline`, chargement mobile en 640×360 (160 Ko) qui respecte `saveData` ; images hors viewport en `loading="lazy"` avec dimensions ; médaillon en `srcset` + `fetchpriority="high"` + `decoding="async"`.
- **Responsive** : débordement horizontal coupé une fois pour toutes sur `main` ; aucun `scrollWidth` supérieur au viewport à 390, 768 et 1440, y compris à 200 % de zoom texte à 1440 ; hero non épinglé sous 1024 px, CTA du hero au-dessus de la ligne de flottaison à 390 ; blobs recentrés en lavis sur mobile.
- **Structure** : skip-link fonctionnel vers `#contenu`, `lang="fr"`, landmarks nommés (nav principale, menu mobile, thèmes, pages), aucune image informative sans `alt`, aucun contrôle sans nom accessible, aucun `tabindex` positif, aucun élément focalisable sous `aria-hidden`, anneau de focus visible (framboise 2,5 px, décalage 3 px) sur tous les contrôles parcourus, H1 du hero conservé via `aria-label` malgré le split en mots.
- **DOM léger** : 503 nœuds sur l'accueil, 202 sur approche, 192 sur lieux-contact.

---

## 5. Mesures brutes

### 5.1 Contrastes réels (fond échantillonné sur le rendu)

Seuil 4,5:1 pour le texte courant, 3:1 pour les grands textes (≥ 24 px ou ≥ 18,66 px gras). Colonne « pire » = 5ᵉ percentile de luminance du fond sous le texte.

| Élément | Page, viewport | Texte | Fond médian / pire | Taille | Ratio (pire) | Verdict |
|---|---|---|---|---|---|---|
| Nav lien muted | accueil 1440 | #7A6B82 | #FDFBF6 | 13 px | 4,75 | OK |
| Nav marque ink | accueil 1440 | #43324B | #FEFAF6 | 16 px | 11,25 | OK |
| Bouton blanc sur framboise | toutes | #FFFFFF | #C13D63 | 14 à 16 px | 5,10 | OK |
| Bouton blanc sur sage-deep | accueil | #FFFFFF | #47705C | 16 px | 5,61 | OK |
| Hero sur-titre framboise | accueil 1440 | #C13D63 | #FCF8F5 | 14 px | 4,83 | OK |
| Hero copy `--muted-hero` | accueil 1440 | #6E5F76 | #FBF8F5 | 18 px | 5,50 | OK |
| Hero repères | accueil 1440 | #6E5F76 | #FCFAF8 | 14 px | 5,66 | OK |
| Hero sur-titre framboise | accueil 390 | #C13D63 | #EBDBD6 / #EFCBD4 | 14 px | 3,80 (3,44) | **ÉCHEC** |
| Hero H1 em « mieux-être durable » | accueil 390 | #C13D63 | #EAD9D7 | 37 px | 3,71 | OK (grand) |
| Hero copy `--muted-hero` | accueil 390 | #6E5F76 | #EFDFDE / #ECDBDA | 17 px | 4,57 (4,41) | limite |
| Chips ink sur teinte rose | accueil | #43324B | #FBE9ED | 14 px | 10,0 | OK |
| Chip sage-deep sur aqua | accueil | #47705C | #EBF4EE | 14 px | 5,00 | OK |
| Overline « Ce qui vous amène » | accueil 1440 | #C13D63 | #FDFBF8 / #E6EBEF | 13 px | 4,94 (4,25) | limite |
| Copy muted sur ivoire | accueil 1440 | #7A6B82 | #FDFBF8 | 19,5 px | 4,78 | OK |
| Tag framboise carte | accueil | #C13D63 | #FEFEFE | 12,8 px | 4,90 | OK |
| Carrousel desc muted sur blanc | accueil | #7A6B82 | #FFFFFF | 16 px | 4,94 | OK |
| Bouton Pause muted | accueil 1440 | #7A6B82 | #FCFAF7 | 12,8 px | 4,66 | OK |
| Citation framboise italique | accueil 1440 | #C13D63 | #FDFBF8 | 22 px | 4,94 | OK |
| Citation framboise italique | accueil 390 | #C13D63 | #F1DFEE | 18 px | 4,02 | **ÉCHEC** |
| Repères muted | accueil 390 | #7A6B82 | #FDFBF8 / #EFDFF0 | 15,5 px | 4,78 (3,88) | limite |
| Légende du portrait | accueil 1440 | #7A6B82 | #F8F6F4 / #F1EEEC | 13,6 px | 4,58 (4,27) | limite |
| Légende du portrait | accueil 390 | #7A6B82 | #EEDBE8 / #E7D4E1 | 13,6 px | 3,75 (3,50) | **ÉCHEC** |
| Numéro d'étape framboise | accueil et approche | #C13D63 | #F7EBF2 | 16 px 640 | 4,37 | **ÉCHEC** |
| Copy « première séance » | accueil 390 | #7A6B82 | #E7E9F1 | 17 px | 4,07 | **ÉCHEC** |
| Description d'étape | accueil 390 | #7A6B82 | #E6EBEF | 15 px | 4,09 | **ÉCHEC** |
| Copy nutrition | accueil 390 | #7A6B82 | #ECEEE5 | 17 px | 4,19 | **ÉCHEC** |
| Libellé pétale ink sur verre | accueil | #43324B | #F8E2D2 | 14 px | 9,25 | OK |
| Cœur ink sur aqua | accueil | #43324B | #CEE7DE | 16 px | 8,96 | OK |
| Tagline, titres, closing ink | toutes | #43324B | ivoire | 29 à 66 px | 11,3 | OK |
| Adresse d'un cabinet | accueil 1440 | #7A6B82 | #FDF5F7 | 14,4 px | 4,50 | limite |
| Adresse d'un cabinet | accueil 390 | #7A6B82 | #FBF0F3 / #FAEBEF | 14,4 px | 4,43 (4,28) | **ÉCHEC** |
| Itinéraire framboise | accueil, lieux | #C13D63 | #FEF7F9 | 14,4 px | 4,79 | OK |
| Closing copy muted | accueil, approche 1440 | #7A6B82 | #FDFBF8 / #F0E9F6 | 19,5 px | 4,78 (4,16) | limite |
| PageHero overline | approche 1440 | #C13D63 | #FDFBF8 / #FDF2EA | 13 px | 4,94 (4,63) | OK |
| PageHero copy | approche 1440 | #7A6B82 | #FDFBF8 | 19,5 px | 4,78 | OK |
| Pilier texte muted sur teinte | approche 1440 | #7A6B82 | #FFFDFD / #FEF8FA | 15,5 px | 4,87 (4,71) | OK |
| Copy sur verre + blob pêche-rose | approche 1440 | #7A6B82 | #FEFBF7 / #FEEFEE | 19,5 px | 4,79 (4,42) | limite |
| PageHero copy | lieux 390 | #7A6B82 | #F3E6EE / #F1E5EE | 17 px | 4,08 (4,04) | **ÉCHEC** |
| Visio texte muted sur verre | lieux | #7A6B82 | #FEFBF7 | 16 px | 4,79 | OK |
| Bouton fantôme ink | lieux | #43324B | #FEFBF7 | 16 px | 11,33 | OK |
| FAQ question ink sur verre | lieux 1440 | #43324B | #FAF0F8 | 17,6 px | 10,49 | OK |
| FAQ réponse muted sur verre | lieux 1440 | #7A6B82 | #FAF0F8 / #FAEFF7 | 15 px | 4,44 (4,41) | **ÉCHEC** |
| FAQ réponse muted sur verre | lieux 390 | #7A6B82 | #FDFBF8 | 15 px | 4,78 | OK |
| Coord label framboise | lieux | #C13D63 | #FDF5F7 / #FCF1F4 | 12,5 px | 4,76 (4,62) | OK |
| Footer tagline | accueil 1440 | #7A6B82 | #F5EEE9 | 14,7 px | 4,30 | **ÉCHEC** |
| Footer lien ink | accueil | #43324B | #F5EFEA | 14,7 px | 10,25 | OK |
| Footer lieu muted | accueil 1440 | #7A6B82 | #F5EFEA | 14 px | 4,33 | **ÉCHEC** |
| Footer légal muted | accueil 1440 | #7A6B82 | #F4EEE8 | 13,4 px | 4,29 | **ÉCHEC** |
| Footer bas de page muted | accueil 1440 | #7A6B82 | #F1EAE5 | 13 px | 4,15 (4,12) | **ÉCHEC** |
| Footer lien « Mentions légales » | accueil 1440 | #7A6B82 | #F1EAE5 | 13 px | 4,15 (4,12) | **ÉCHEC** |
| Footer « Prenez le temps de respirer » | accueil 1440 | #7A6B82 | #F4EDE8 | 13,4 px | 4,26 (4,25) | **ÉCHEC** |
| Footer tête framboise | accueil 1440 | #C13D63 | #F6F0EA | 12,5 px 700 | 4,51 (4,50) | limite |

Bilan : 25 échecs ou limites sur 111 mesures, tous liés à `--muted #7A6B82` ou à `--framboise #C13D63` en petit texte sur un fond autre que l'ivoire pur.

### 5.2 Médias, bundles, polices

| Ressource | Poids | Chargement observé |
|---|---|---|
| `public/media/hero-film.mp4` (desktop, 24,1 s, all-intra) | 7 095 962 o (6 932 Ko) | `fetch` Blob complet à 294 ms après navigation, avant tout scroll, sans test réseau, sur toute fenêtre ≥ 1024 px |
| `public/media/hero-film-mobile.mp4` (640×360, 24 s) | 163 486 o (160 Ko) | `<video>` `preload="auto"`, `autoplay`, `loop`, `muted`, `playsinline`, `saveData` respecté |
| `public/media/hero-film-poster.webp` | 18 208 o | `<link rel="preload" as="image">`, attribut `poster` |
| `illu/hero-cabinet-640/1040/1600.webp` | 21 / 48 / 106 Ko | `srcset` 640w/1040w/1600w, `sizes="(min-width:1024px) 402px, 300px"`, `fetchpriority="high"` ; 640w choisi à DPR 1, 1040w à DPR 2, 1600w jamais |
| `illu/*-card.webp` (carrousel, 640×480) | 6 à 14 Ko | `loading="lazy"`, dimensions déclarées, pas de `srcset` |
| `illu/approche.webp` etc. (PageHero, 1200×896) | 36 à 50 Ko | `loading="eager"`, `fetchpriority="high"`, pas de `srcset` |
| `og.jpg` | 42 Ko | balise OG seulement |
| JS prod `dist/_astro/*.js` | 145 Ko total | `index.Bvu9zNsI.js` (GSAP) 71 Ko + `ScrollTrigger` 44 Ko en `import()` depuis `motion.js` ; 6 modules initiaux ≈ 9 Ko (index 4,8, Carrousel 1,8, Base 0,9, CarteCabinets 0,9, Etapes 0,5, Tagline 0,3) |
| CSS prod | 48 Ko | `a-propos.*.css` 25 Ko + `index.*.css` 20 Ko |
| Polices chargées | 121 + 150 + 35 Ko | Fraunces latin normal (préchargée), Fraunces latin italique, Hanken latin (préchargée) ; `font-display: swap` ; les subsets latin-ext et vietnamien restent sur disque sans être demandés |
| HTML `dist/index.html` | 59,5 Ko | styles de composants inline |
| DOM / hauteur | accueil 503 nœuds, 8 230 px desktop, 9 722 px mobile ; approche 202 nœuds, 3 473 px ; lieux 192 nœuds, 4 930 px mobile | |
| Timing dev server (indicatif) | DCL 151 ms, load 162 ms, FCP 232 ms (accueil 1440) | serveur local, non représentatif de la prod |

### 5.3 Compteurs de rendu

| Page, viewport | `will-change` au repos | dont inertes | `backdrop-filter` (dont masqués) | animations infinies | `mix-blend-mode` | masques |
|---|---|---|---|---|---|---|
| accueil 1440 | 22 | 7 `.swi` | 8 (2) | 20 | 15 | 10 |
| accueil 390 | 22 | 6 blobs + 7 `.swi` | 8 (2) | 14 | 15 | 10 |
| approche 1440 | 8 | 0 | 4 (2) | 9 | 11 | |
| lieux-contact 390 | 6 | 3 blobs | 10 (2) | 4 | 4 | |

Détail des `will-change` inertes sur mobile (accueil) : `.blob` 507×1363, 507×1187, 507×1357, 507×778, 507×877, 507×1447 px, `animationName: none`.

### 5.4 Cibles tactiles fautives à 390 px

| Sélecteur | Texte | Taille (px) | Sous 44 | Sous 24 |
|---|---|---|---|---|
| `button.nav__burger` | Ouvrir le menu | 38×38 | oui | non |
| `a.nav__brand` | Xénia Van Outryve | 175×28 | oui | non |
| `a.chip` (10) | thèmes | 69 à 215 × 41 | oui | non |
| `button.carrousel__pause` | Pause | 76×32 | oui | non |
| `a.link-arrow` (6) | Découvrir, etc. | 91 à 274 × 25 | oui | non |
| `a.link-arrow.lieux__itin` (3) | Itinéraire | 76×32 à 38 | oui | non |
| `a.btn-pill--sm` (3) | Rendez-vous sur … | 170 à 232 × 39 | oui | non |
| `a.footer__logo` | marque | 211×34 | oui | non |
| `nav.footer__col a` (7) + contact (2) | liens du footer | 60 à 192 × 23, gap 8 px | oui | oui (exception espacement) |
| `a.footer__legal-link` | Mentions légales | 171×17, en ligne | oui | oui (exception lien en ligne) |

Conformes : flèches du carrousel 48×48, onglets 41 à 232 × 41 (limite), boutons principaux `.btn-pill` 51 px de haut, cartes situations.

### 5.5 Débordements et zoom

| Test | Résultat |
|---|---|
| `scrollWidth` vs `innerWidth`, 390, 3 pages | 390 = 390, aucun débordement ; seuls des éléments `aria-hidden` (blobs, aurores) et la piste du bandeau dépassent, tous coupés par `main { overflow-x: clip }` |
| 768×1024, accueil | 768 = 768, hero non épinglé, hauteur 8 213 px |
| 1440, zoom texte 125 % | aucun débordement, pilule 1185 px, hauteur 9 193 px |
| 1440, zoom texte 200 % | aucun débordement, pilule 1416 px (bord droit 1428), hauteur 12 483 px |
| 1024, zoom texte 200 % | pilule 1370 px, bord droit 1197 > 1024, CTA hors écran ; une carte `.card--spot` clippe de 8 px |
| Largeurs fixes en px dans les feuilles | une seule : `.nav__drop-menu { min-width: 240px }` (desktop) |
| Breakpoints présents | 960 (×15), 600 (×3), 1024/1023 (×4), 961 (×1), 700 (×1, hors canon), `hover: hover and pointer: fine`, `prefers-reduced-motion` (×11) |
| Plus petite taille de texte | 12,48 px (`footer__head`, `coords__label`, capitales espacées) |

### 5.6 Reduced-motion (desktop et mobile, `rm-home.json`, `rm-home-mob.json`)

| Point | Résultat |
|---|---|
| `html.js-intro` | jamais posé |
| Scène `.hero.is-scene` | absente |
| H1, copy, actions, médaillon, scrim | opacité 1, aucun transform |
| Voile | opacité 0 |
| Film | aucune source, `readyState` 0, aucun `.mp4` ni `.js` GSAP demandé |
| Bandeau | `animation: none`, liste repliée |
| Blobs, aurores, halos, rencontre | `animation: none` |
| Bouton Pause du carrousel | `hidden` |
| Tagline, traits, reveals | opacité 1, `is-vu` posé sur les 6 titres |
| Animations encore en cours | 2 : `hero__petale--1` et `--2` (`petale-drift` 11 s / 14 s) |
| Transitions restantes | 26, toutes de couleur ou `top` du skip-link (aucun mouvement) |

Témoin en mode normal après 4,5 s : scène active, copy/actions/médaillon à opacité 0 en attente du scroll, 20 animations en cours, 81 transitions, `hero-film.mp4` et GSAP chargés.

### 5.7 Clavier et gestes

| Test | Résultat |
|---|---|
| Ordre de tabulation accueil 1440 (13 Tab) | skip-link → marque → Mon approche → Accompagnements (menu ouvert au focus) → 3 sous-liens → Nutrition & Santé → À propos → Lieux & Contact → CTA nav → **« Prendre rendez-vous » du hero à opacité 0** → **« Découvrir mon approche » à opacité 0** → capsules du bandeau (piste figée par `:focus-within`) |
| Anneau de focus | `outline: solid 2,5px #C13D63`, offset 3 px, sur tous les contrôles parcourus |
| Carrousel, ArrowRight depuis l'onglet 1 | onglet 2 sélectionné, focus déplacé, panneau 2 visible ; Tab suivant → flèche « précédent » |
| Menu déroulant, Échap | reste visible (focus-within) |
| Burger mobile, tap | ouvert (`aria-expanded=true`, `body overflow hidden`), fermé par Échap |
| Flèche du carrousel, tap | onglet suivant sélectionné |
| Balayage horizontal sur le carrousel (touch synthétisé, 8 pas de 25 px) | aucun effet, aucun scroll horizontal, scroll vertical intact : pas de geste de swipe prévu |
| Tap sur une capsule du bandeau | perdu au premier essai, 4/4, voir constat 1 |

### 5.8 Theming, valeurs hors jetons

| Fichier | Hex hors jetons | `rgba()` retapés |
|---|---|---|
| `global.css` (hors `:root`) | `#fff` ×11, `#3C5F4E` | 12 |
| `index.astro` | `#C13D63`, `#F3B1CE` (stops SVG), `#000` ×6 (masques) | 15 |
| `Header.astro` | | 7 |
| `PageHero.astro` | | 6 |
| `Portrait.astro` | | 4 |
| `Closing.astro`, `404.astro` | | 3 + 3 |
| `Footer.astro` | `#F1E9E4` | |
| `CarteCabinets.astro` | `#fff` (masque SVG) | |
| `Bandeau.astro` | `#000` ×4 (masque) | |
| `Base.astro` | `#FDFBF8` (`theme-color`, miroir de `--ivory`) | |

Aucune déclaration `color-scheme` ni `prefers-color-scheme` : pas de mode sombre, conforme au DESIGN.md.

---

## 6. Ce qui n'a pas pu être vérifié, et pourquoi

- **Appareil physique et Safari.** Tous les gestes ont été synthétisés dans Chromium headless en émulation iPhone (viewport, DPR 2, UA, `has_touch`). Safari desktop ne donne pas le focus aux liens au clic : le bug du bandeau y est probablement absent ; iOS Safari reste à confirmer, ainsi que le coût réel de `backdrop-filter` et des masques sur WebKit.
- **Fréquence d'images réelle** pendant le scrub du film et pendant les animations perpétuelles, et **mémoire GPU exacte** : les ordres de grandeur (57 Mo mobile, 88 Mo desktop retina) sont calculés depuis les dimensions mesurées des couches, pas relevés dans un profileur.
- **Poids et timings en production** derrière nginx : les mesures réseau viennent du dev server Vite (modules non minifiés, HMR). Les tailles de bundle citées viennent du `dist/` du 9 septembre.
- **Lecteur d'écran réel** (NVDA, VoiceOver) : l'arbre ARIA a été vérifié par le DOM et les attributs, pas à l'oreille.
- **Le bouton Pause en mode tactile** : le survol qui suspend le carrousel n'existe pas au doigt, mais le bouton et la suspension de 20 s après interaction couvrent le besoin ; non testé en session tactile longue.
- **Zoom navigateur classique** (ctrl +) : seul le zoom texte seul (`font-size` racine à 125 % et 200 %) a été testé ; le zoom classique réduit le viewport CSS et bascule sur les breakpoints, ce qui est attendu mais non mesuré ici.

---

## 7. Commandes recommandées, par priorité

1. **[P1] `/impeccable harden`** : bandeau, remplacer `:focus-within` par `:has(:focus-visible)` (constat 1) ; hero, sortir les CTA à opacité 0 de l'ordre de tabulation et terminer la scène au focus (constat 4) ; Échap et `aria-controls` sur le déroulant (8) ; noms accessibles des liens externes (13) ; sémantique mineure (18).
2. **[P1] `/impeccable colorize`** : aligner `--muted` sur `--muted-hero` ou créer `--muted-strong` pour teintes, verre, lavis et footer (2) ; `--framboise-deep` pour le petit texte framboise sur teinte, scrim mobile du hero (3) ; tokeniser les 35 `rgba()` et les 4 teintes d'aurore (14).
3. **[P1] `/impeccable optimize`** : film du hero différé au premier scroll, `saveData` / `effectiveType` sur desktop, master plus léger (5) ; `will-change` conditionné aux breakpoints animés et retiré des `.swi` (6) ; verre des cartes FAQ et pétales de la rencontre (9) ; `sizes` et `srcset` (17).
4. **[P2] `/impeccable quieter`** : pétales en reduced-motion (7) ; pause hors viewport des 20 animations perpétuelles (10).
5. **[P2] `/impeccable adapt`** : burger, Pause, capsules et footer à 44 px (11) ; nav à 1024 px + zoom 200 % (12) ; breakpoint 700 px (15).
6. **[P3] `/impeccable distill`** : retirer `lenis` et `Manuscrit.astro` (16).
7. **`/impeccable polish`** en dernière passe après les corrections.

---

## 8. Scripts, données et captures produits

Dossier : `C:\Users\debes\AppData\Local\Temp\claude\C--Dev-Noveo--autres-website\7bac8134-cfb9-4728-96e0-f16cbb14937c\scratchpad\C\`

**Scripts d'évaluation (IIFE JS pour `pw.py eval`)**
- `a11y.js` : titres, landmarks, images, noms accessibles, tabindex, liens externes, règles focus-visible, tabs ARIA, bandeau, burger, menus.
- `perf.js` : `will-change`, `backdrop-filter`, animations, filtres, blend, masques, vidéo, ressources et totaux par type, polices, scripts, images.
- `responsive.js` : débordements, cibles tactiles (< 44 et < 24), hero, largeurs fixes, media queries, blobs, `touch-action`, tailles de texte.
- `zoom.js` : mesures à 100 / 125 / 200 % de taille de police racine.
- `rm.js` : état du hero, du bandeau, des décors et des animations en cours (reduced-motion et témoin).

**Scripts Python**
- `contrast.py` + `sel-home.json`, `sel-approche.json`, `sel-lieux.json` : contraste réel par échantillonnage de pixels.
- `tab.py` : parcours Tab réel, flèches du carrousel, Échap, gestes tactiles (burger, flèche, balayage).
- `touch2.py` à `touch7.py` : isolement progressif du bug du bandeau (tap vs souris, animation figée, sans mask, sans clip, sans will-change, pile `elementsFromPoint`).
- `touch8.py` : preuve finale par trace `pointerdown / focusin / pointerup / click` avec et sans neutralisation de `:focus-within`.

**Résultats JSON**
- `a11y-home-desk.json`, `a11y-home-mob.json`, `a11y-approche.json`, `a11y-lieux.json`
- `perf-home-desk.json`, `perf-home-mob.json`, `perf-approche.json`, `perf-lieux-mob.json`
- `resp-home-mob.json`, `resp-approche-mob.json`, `resp-lieux-mob.json`, `resp-home-768.json`
- `zoom-home.json`, `zoom-lieux.json`, `zoom-home-1024.json`
- `rm-home.json`, `rm-home-mob.json`, `rm-home-normal.json`
- `contrast-home-desk.json`, `contrast-home-mob.json`, `contrast-approche.json`, `contrast-lieux.json`, `contrast-lieux-mob.json`
- `tab-home.json`, `tab-lieux.json`, `tab-home-mob.json`

**Captures (toutes lues avant conclusion)**
- `shot-rm-desk.png` : accueil 1440 en reduced-motion, hero complet et statique.
- `shot-home-desk-0.png`, `shot-home-desk-900.png`, `shot-home-desk-1900.png` : scène du hero à 0, 900 et 1 900 px de scroll.
- `shot-home-mob-0.png` / `-css.png` : accueil mobile après l'intro, CTA au-dessus du pli.
- `shot-home-mob-rm.png` / `-css.png` : accueil mobile en reduced-motion.
- `shot-home-mob-full.png` et tranches `-p1` à `-p4` : accueil mobile pleine page (les zones vides sont des reveals GSAP non déclenchés par la capture sans scroll, pas un défaut).
- `shot-lieux-mob-full.png` et tranches `-p1`, `-p2` : lieux-contact mobile pleine page.
- `shot-approche-desk.png` : approche 1440.
- `shot-home-768.png` : accueil tablette.
- `shot-home-1024-1000.png` : accueil 1024 en fin de scène.
- `tab-home-focus-hero.png` : focus posé sur le CTA invisible du hero (preuve du constat 4).
- `tab-home-tab3.png`, `tab-home-dropdown.png`, `tab-lieux-tab3.png`, `tab-lieux-dropdown.png`, `tab-home-mob-menu.png` : états intermédiaires du parcours clavier et du menu mobile.
- `touch8-apres-tap-mobile.png` : bandeau replié après le tap perdu (preuve du constat 1).
