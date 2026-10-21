# Xénia van Outryve — site vitrine
> Site de présentation d'une psychologue clinicienne (santé, périnatalité, nutrition) en Brabant wallon — **seconde proposition (2026-10-20) : trois directions construites** (A « Le carnet », B « Respirer », C « Le salon ») + page présentoir, Astro statique. La v1 « L'éclaircie » est conservée sous l'étiquette git `v1-eclaircie`.

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Astro 7.3.5 (statique, 8 routes : présentoir `/`, `/a/ /b/ /c/` + `/a|b|c/cabinets/`, 404), npm |
| Mouvement | CSS + WAAPI seulement (aucun GSAP, Lenis ni vidéo) ; `src/lib/mouvement.ts` (apparitions, menu, mouvement réduit) |
| Typographies (auto-hébergées, latin + latin-ext) | A : Literata + Albert Sans (+ prénom au stylo, glyphes Hershey) · B : Libre Caslon Display + Figtree · C : Alice + Karla |
| Styles | CSS vanilla, jetons par direction dans `src/directions/<x>/` |
| Sitemap | @astrojs/sitemap |
| Médias | 3 photos N&B de la cliente (reçues le 08/09) + 12 ambiances générées (Higgsfield `gpt_image_2_5`, high 2k, 33 cr) → WebP 720/1200 et 960/1920 (PIL) |
| Contrôle de sortie | `scripts/verifier.mjs` + `forge-checks.json` (refuse « » “ ”, « Xénia Van », « spécialis », le nom de l'agence…) |
| Statistiques | Umami « Noveo Analytics » via le relais nginx `/stats/` (site `1f82e5d6-e54c-4d27-b63e-dde05fbb5094`) |
| Conteneur | Docker multi-étages → nginx:alpine (EXPOSE 80) |
| Déploiement | Serveur clients Coolify `srv.noveodigital.be` → `https://xenia.noveo-digital.be` (+ ancienne app maquettes `xenia.chris-ia.com`, auto-déployée par le même push) |

## Démarrage rapide
```bash
# Installation
npm install

# Développement — port dédié 4331
npm run dev          # http://127.0.0.1:4331  (présentoir) ; /a/ /b/ /c/

# Contrôles : check + build + contrôleur de sortie (mode aperçu)
npm test
```

## Architecture
```
xenia/
├── brief/                 ← matériau client PRIVÉ, gitignoré : mail du 27/07, photos/, references-2026-09-14/,
│                             v2-staging/ (contenu.ts source, ambiances-src/, manuscrit-xenia.svg)
├── remarques/             ← e-mails de la cliente des 8 et 14/09 (gitignoré)
├── docs/forge/            ← brief-directions.md (spec de la seconde proposition), etat.md
├── public/                ← photos/ (N&B), a/ b/ c/ (ambiances par direction), fonts/, favicons
├── scripts/               ← verifier.mjs, copier-polices.mjs, nettoyer-originaux.mjs, projet-html.py
└── src/
    ├── data/              ← contenu.ts (TOUS les textes, sans guillemets), medias.ts, directions.ts, site.ts
    ├── lib/mouvement.ts   ← apparitions, piège du focus, défilement bloqué, mouvement réduit
    ├── components/partage ← Tete (SEO, noindex, OG, stats), SelecteurDirection, Statistiques, presentoir/
    ├── directions/
    │   ├── CONTRAT.md     ← comment un habillage se branche (ancres, imports, ports)
    │   ├── a/             ← « Le carnet » : grille à marge, prénom au stylo, module « Par où commencer ? »
    │   ├── b/             ← « Respirer » : arches, rameau d'olivier, voile sauge + verre, module « Quel jour, quel cabinet ? »
    │   └── c/             ← « Le salon » : formes organiques, vagues, motif du tapis, carte des cabinets
    └── pages/             ← index (présentoir), a|b|c/index + cabinets, 404, robots.txt
```
- **Flux** : `contenu.ts` + `medias.ts` → trois habillages indépendants (chaque route n'importe que le sien) → HTML
  statique ; tout est lisible sans JS.
- **Contenu** : réécrit le 2026-10-20 sur la remarque de la cliente (« ces petites phrases entre guillemets […] un
  aspect un peu trop commercial ») : aucun guillemet, titres descriptifs, sa voix (mail du 27/07), « van » en
  minuscule.
- **Choix du client** : quand elle aura choisi A, B ou C, retirer les deux autres habillages, le sélecteur et le
  présentoir, servir la direction retenue à la racine, puis décliner les autres pages (approche, accompagnements,
  nutrition, à propos, mentions légales) — voir `.claude/skills/forge/references/trois-directions.md`.

## Variables d'environnement
Aucune au runtime. Variable de build Coolify `VERIFICATION=preview` (contrôleur de sortie en mode aperçu).

## Roadmap & Features

| Feature | Statut | Date |
|---------|--------|------|
| v1 « L'éclaircie » (design, 9 pages, SEO/GEO, dossier PDF, impeccable, allègement) | ✅ Done | 2026-08-11 → 2026-09-13 |
| Seconde proposition : trois directions (accueil + Cabinets) + présentoir, d'après les remarques du 14/09 | ✅ Done | 2026-10-20 |
| Aperçu en ligne `xenia.noveo-digital.be` + mail « trois propositions » (brouillon) | ✅ Done | 2026-10-20 |
| Choix de direction par la cliente, puis retrait des deux autres | 📋 Planned | — |
| Déclinaison des autres pages dans la direction retenue + mentions légales | 📋 Planned | — |
| Nom de domaine final + bascule DNS + Search Console | 📋 Planned | — |
| Tarifs, photos des cabinets (attendent la cliente) | 📋 Planned | — |

## Journal des changements

### 2026-10-21 (seconde proposition EN LIGNE + mail à la cliente)
- 🚀 Aperçu en ligne : **https://xenia.noveo-digital.be** (serveur clients, commit `fd3843b`, déploiement Coolify
  `u2cjhwfzn4old6d7cxrbsrw1` en ≈ 20 s). Vérifié en ligne : 7 pages + présentoir en 200, vraie 404, `cf-ray`
  présent (Cloudflare devant), `noindex` en en-tête et en balise, canonical vers `www.xeniavanoutryve.be`, un seul
  `<h1>` par page, aucune mention de l'agence, aucun guillemet, aucun « Xénia Van ». Statistiques : visite relayée
  avec une IP japonaise → « JP » dans Umami, puis site remis à zéro.
- 🗂️ Asana : Pré-Prod URL de la carte « XENIA VAN OUTRYVE » renseignée.
- ✉️ Brouillon `XENIA VAN OUTRYVE.eml` (skill `forge-mail-da`) dans `Bureau\Mails DA 2026-10-05` : « Madame van
  Outryve », trois descriptions, rien envoyé.
- ℹ️ L'ancienne app maquettes (xenia.chris-ia.com) n'a PAS de webhook : elle sert toujours la v1, qui reste
  consultable en archive. Étiquette `v1-eclaircie` poussée sur GitHub.
- 🐛 Deux agents (habillage C, présentoir) figés pendant la nuit (PC en veille) : arrêtés, leur travail relu et
  repris tel quel (correctif du hero téléphone de C fait, présentoir complet).

### 2026-10-20 (seconde proposition : trois directions construites)
- 📨 Retours de la cliente (e-mails des 8 et 14/09, transférés par Arnaud le 15/09, rangés dans `remarques/`,
  gitignoré) : 4 photos N&B ; changer typo et couleurs ; « ces petites phrases entre guillemets […] un aspect un peu
  trop commercial, alors qu'on cherche plutôt à transmettre une idée d'accompagnement bienveillant » ; garder les
  itinéraires et les trois cabinets ; 3 nouvelles références (Anda, Amarie Lael, planche Pinterest de gabarits
  pour thérapeutes).
- ✨ Décision utilisateur : « fais 3 DA différentes, change tout et repropose ce qu'elle veut suivant les
  remarques » ; accueil + page Cabinets par direction ; ses photos + 12 ambiances générées (33 cr Higgsfield).
- ♻️ v1 étiquetée `v1-eclaircie` puis retirée du dossier de travail ; socle Astro 7.3.5 (npm) repris de la
  mécanique de medicaldietcenter ; contrôleur de sortie qui refuse « » “ ” et « Xénia Van ».
- ✍️ Contenu commun réécrit (`src/data/contenu.ts`) : plus aucune phrase entre guillemets ni accroche qui retourne
  une objection, titres descriptifs, sa voix à la 1re personne (mail du 27/07), « van » en minuscule.
- 🎨 Trois habillages en parallèle (un agent par direction) : A « Le carnet » (prénom « Xénia » écrit au stylo en
  glyphes Hershey, préparé par l'orchestrateur), B « Respirer » (arches, rameau d'olivier, voile sauge + verre
  dépoli, le souhait de juillet), C « Le salon » (formes organiques, vagues, motif du tapis de son salon, carte des
  cabinets). Présentoir à la racine (ouverture ≤ 2,5 s, triptyque dans les trois chartes).
- ✅ `npm test` : check 0 erreur, 8 pages, contrôleur 0 erreur 0 avertissement. Mots visibles à l'accueil : A 756,
  B 773, C 625. Contrastes du texte courant ≥ 7,66:1. Hero téléphone mesuré à 390 × 844, 375 × 667 et 360 × 640 :
  bouton et téléphone au-dessus du sélecteur de direction dans les trois directions.

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
- **Choix de direction (A, B ou C) attendu** de la cliente ; ensuite retirer les deux autres habillages, le
  sélecteur et le présentoir, puis décliner les autres pages (approche, accompagnements, nutrition, à propos,
  **mentions légales**, absentes de la démonstration `noindex`).
- Sa remarque orale à Arnaud sur « la typo et les couleurs » n'a jamais été transcrite : les trois directions
  suivent ses références écrites.
- **Nom de domaine non tranché** (placeholder `xeniavanoutryve.be` dans `site.config.json`).
- **Tarifs, photos des trois cabinets** : à demander. La phrase sur les mutualités est reprise de la v1, à confirmer.
- Nom d'état civil complet « van Outryve d'Ydewalle » vu sur les annuaires ; le site suit sa signature
  (« Xénia van Outryve »).
- Rendu vérifié en Chromium seulement : à voir sur Safari (verre dépoli de B) et sur un vrai téléphone (barre
  d'appel, sélecteur).
- Les points ouverts de la v1 (impeccable P2/P3, hauteurs, aquarelle du hero) sont caducs avec la refonte ; détail
  dans le journal ci-dessous et sous l'étiquette `v1-eclaircie`.

## Déploiement

### Aperçu de la seconde proposition — en ligne depuis le 2026-10-21
**https://xenia.noveo-digital.be** (serveur clients, Cloudflare devant, `noindex`).

| Élément | Valeur |
|---|---|
| Coolify | `https://srv.noveodigital.be` (serveur clients Hetzner `167.233.243.35` ; jeton `C:\Dev\Noveo\_secrets\coolify-clients.env`) |
| Serveur | `zb2n7reassfqrqfozo9tlfw4` |
| Projet | `bhhz1q5p59ppef9fjhlcpyq0` |
| Application | `qic8nsliymjyzgfg9n4umkk8` (GitHub App `cplvqlbjxfey5mkidppiadol`, branche `main`, auto-déploiement au push) |
| Dépôt | `github.com/cltconcept/xenia-website` (public) |
| Build pack | `dockerfile` (multi-étages → nginx:alpine, port 80) ; variable de build `VERIFICATION=preview` |
| Statistiques | Umami `https://stats.noveo-digital.be`, site `1f82e5d6-e54c-4d27-b63e-dde05fbb5094`, relais `/stats/` |

Redéployer : un push sur `main` suffit ; sinon `POST https://srv.noveodigital.be/api/v1/deploy?uuid=qic8nsliymjyzgfg9n4umkk8`.
Vérifier : `python <scratchpad>/verifier-en-ligne-xenia.py --reset` (modèle : `medicaldietcenter/artifacts/verifier-en-ligne.py`).

⚠️ Les `canonical` et le sitemap pointent volontairement vers `www.xeniavanoutryve.be` (domaine provisoire) : ne pas
« corriger ».

### Ancienne maquette v1 — https://xenia.chris-ia.com
Instance maquettes `46.224.83.139` (projet `p124wf4ynk21bns4c8153iaj`, app `seetu6uqg4tnkjg8do4f1f8n`). **Aucun
webhook** : elle sert toujours la v1 « L'éclaircie » (commit `71889f1`) malgré le push du 2026-10-21. Ne plus y
déployer (règle Forge du 2026-09-28) ; à arrêter quand la cliente aura choisi.
