# Xenia — allègement du texte et iconographie sur mesure (design)

> Spec validée le 2026-09-13 avec l'utilisateur, à la suite de deux retours de
> son responsable sur la maquette : « trop de texte » et « il manque une
> iconographie personnalisée (Higgsfield) ». Brainstorming en quatre questions
> (étendue du texte, nature de l'iconographie, cible de coupe, sujet des
> vignettes) et deux écrans du compagnon visuel (style des pictos, approche).
> Décisions : **approche A « alléger et ponctuer »**, pictos **style B**,
> vignettes **objets du cabinet**, coupe **−30 à 40 % partout**.

## 1. Pourquoi

Le site a une âme et un système de surfaces cohérent (spec du 2026-09-08),
mais il parle trop : 994 mots et 8 230 px sur l'accueil, 400 à 550 mots par
page intérieure, trois listes des mêmes motifs à la suite (capsules, phrases,
onglets), et la critique impeccable du 2026-09-12 relevait déjà « 3 échecs de
charge cognitive sur 8 ». Sa seule iconographie est le logo répété en pastille
(trois fois sur Approche) et sept aquarelles. Le responsable de l'utilisateur
veut moins de mots et une iconographie propre au site ; les textes ne sont pas
encore validés par la cliente, on a la main.

## 2. Décisions figées (2026-09-13)

| Sujet | Décision |
|---|---|
| Étendue du texte | **Tout le site** : accueil, Approche, les 3 accompagnements, Nutrition, À propos, Lieux. Mentions légales inchangées. |
| Cible de coupe | **−40 % sur l'accueil, −30 à 35 % ailleurs.** Toutes les pages restent. |
| Structure de l'accueil | **Approche A** : mêmes sections, mêmes blocs validés le 09/09 (bandeau, onglets, étapes, carte). On coupe la copy, on ponctue par l'iconographie. L'approche B (fusionner, retirer le bandeau et les étapes) est écartée : elle défait deux blocs demandés par la cliente. |
| Iconographie | **Les deux registres** : un set de pictogrammes + des vignettes aquarelle. |
| Style des pictos | **B — trait aubergine `--ink` 1,7 px, bouts ronds, avec derrière un pétale translucide du logo** (rose `--petale-rose` ou sauge `--petale-sage`, `mix-blend-mode: multiply`). Le pétale est posé par le composant, jamais généré. |
| Sujet des vignettes | **Objets du cabinet**, aucun personnage : même registre que le médaillon du hero (nature morte aquarelle). Aucun mot sensible pour la modération (baby, child…). |
| Outil | **Higgsfield** (MCP `higgsfield`, plan ultra, 4 094 crédits au 2026-09-12) : Recraft V4.1 `vector` pour les pictos, Nano Banana Pro pour les vignettes, 2 candidats par vignette. Budget ≈ 50 crédits, plafond 80. |
| Méthode | Plan par tâches, sous-agents implémenteur + revues, `pnpm dev` sur 4331, **pas de commit avant validation à l'écran** ; les corrections P1 impeccable du 12/09 (en attente) sont committées **avant** ce chantier, en un commit séparé. |

## 3. Le set de pictogrammes — `src/icons/` + `Icon.astro`

### 3.1 Motifs (24 en service + 8 de réserve)

| # | Nom du fichier | Motif | Où il sert |
|---|---|---|---|
| 1 | `batterie` | batterie presque vide | situation « épuisé·e » |
| 2 | `spirale` | spirale légère | situation « tout me stresse » |
| 3 | `pousse` | jeune pousse à deux feuilles | situation « on attend un enfant / être parent » ; onglet Périnatalité ; page Périnatalité |
| 4 | `cerf-volant` | cerf-volant | situation « mon enfant ne va pas bien » ; onglet Enfants & famille ; page Enfants |
| 5 | `boussole` | boussole | situation « TDAH » |
| 6 | `assiette` | assiette avec une feuille | situation « manger et dormir mieux » (avec `lune`) ; onglet Nutrition ; page Nutrition |
| 7 | `lune` | croissant de lune | sommeil (avec `assiette`) |
| 8 | `fauteuil` | fauteuil arrondi | onglet Ados & adultes ; page Ados & adultes |
| 9 | `outils` | trois outils croisés (crayon, règle, pinceau) | repère « Intégrative » ; pilier Approche « Holistique » |
| 10 | `coeur-feuille` | cœur d'où part une feuille | repère « Corps et esprit » ; pilier Approche « Le corps » |
| 11 | `sablier` | sablier doux | repère « À votre rythme » ; pilier Approche « Sans jugement » |
| 12 | `porte` | porte entrouverte | étape 1 « Vous arrivez comme vous êtes » |
| 13 | `bulle` | bulle de dialogue | étape 2 « On fait connaissance » |
| 14 | `carnet` | carnet avec une coche | étape 3 « On décide ensemble » |
| 15 | `sceau` | sceau / ruban | repère hero « Agrément » |
| 16 | `livre` | livre ouvert | repère hero « Master UCLouvain » ; repère « Formation » d'À propos (le `diplome` généré, 28×11 dans son viewBox, est illisible à 18 px : mis en réserve) |
| 17 | `epingle` | épingle de carte | repère hero « 3 cabinets » ; cartes de lieux |
| 18 | `calendrier` | calendrier | repère hero « RDV en ligne » |
| 19 | `itineraire` | route sinueuse avec flèche | lien « Itinéraire » des cartes de lieux |
| 20 | `visio` | écran avec caméra | carte « la visio » |
| 21 | `telephone` | combiné | contact (Lieux, footer) |
| 22 | `enveloppe` | enveloppe | contact (Lieux, footer) |
| 23 | `horloge` | horloge | horaires des cabinets |
| 24 | `eclaircie` | soleil qui perce un nuage | closing, 404 |
| réserve | `diplome`, `nuage`, `feuille`, `tasse`, `cle`, `plante`, `main`, `etoile`, `plaid` | disponibles sans regénérer (33 SVG au total) |

Règles de dessin : viewBox `0 0 32 32`, un seul `<path fill="currentColor">`
(sortie potrace, règle `evenodd`), trait apparent ≈ 1,7 px à 32 px, aucune
grille, aucun texte, aucun glyphe Unicode, aucun symbole médical
(croix, caducée) ni personnage.

### 3.2 Composant `Icon.astro`

```astro
<Icon name="pousse" size={28} petale="rose" />
<Icon name="telephone" size={18} label="Téléphone" />
```

- `name` (obligatoire, un fichier de `src/icons/`), `size` (px, défaut 24),
  `petale` = `rose` | `sage` | `none` (défaut `none`), `label` (si donné, le
  SVG porte `role="img"` + `aria-label` ; sinon `aria-hidden="true"`).
- Rendu : `<span class="icon icon--petale-rose">` contenant le SVG inline
  (`color: currentColor`, donc `--ink` par défaut) et, si pétale, un
  `<i class="icon__petale">` : ellipse `rx 10 / ry 6` tournée de −30° (rose)
  ou +25° (sauge), opacité 0,55, `mix-blend-mode: multiply`, décalée vers le
  haut-droite. Deux variantes CSS seulement, jetons `--petale-rose/sage`.
- La pastille `.icon-badge` existante (46 px, dégradé rose→lilas) reste le
  conteneur des pictos de cartes ; elle perd le logo.
- Mode sans JS et reduced-motion : identiques (aucune animation sur les
  pictos ; au survol d'une carte, le pétale peut se déplacer de 2 px par
  transition CSS, coupée en reduced-motion).

### 3.3 Génération et post-traitement

- Higgsfield **Recraft V4.1**, `model_type: "vector"`, `aspect_ratio: "1:1"`,
  `resolution: "2k"`, `colors: ["#43324B"]`, `background_color: "#FFFFFF"`.
  Une planche = 8 motifs demandés en 4 colonnes × 2 rangées, prompt en
  anglais : « Icon sheet: 8 minimal line icons arranged in a 4 by 2 grid…
  thin rounded strokes of identical weight, outline only, no fill, single dark
  plum color, no text… » + la liste des motifs. 4 planches (3 + réserve),
  **10 crédits chacune en 2k** (mesuré, pas 2,5) ; une relance par planche au
  plus. ⚠️ Constaté le 2026-09-13 : Recraft rend un **SVG natif** (rasterisé
  en 2048 px par sharp avant découpe) et **ne respecte pas la grille demandée**
  (planche 2 livrée en 3×3 avec un 9e motif, planche 4 en 2×4) : la découpe
  détecte la grille au lieu de l'imposer.
- **Chaque planche est montrée dans le compagnon visuel avant découpe** ; un
  motif raté se redemande à l'unité (2,5 crédits) sans refaire la planche.
- Script `scripts/icones/decouper.mjs` (Node, `sharp` déjà présent + paquet
  npm `potrace` 2.1.8, port JavaScript en devDependency : aucun binaire
  potrace sur la machine, et le script de dentalexpert n'a pas survécu à son
  scratchpad) : PNG 2k → **rangées par projection d'encre sur toute la
  largeur, puis colonnes de chaque rangée** (grille détectée, noms attribués en
  ordre de lecture, erreur explicite si le compte ne tombe pas juste) →
  `extract` puis `trim` en deux passes sharp → seuil → potrace (`turdSize` 8,
  `alphaMax` 1, `optTolerance` 0,8, coordonnées arrondies) → SVG mono-chemin
  normalisé 32×32, marge 2 px, `fill="currentColor"` → `src/icons/`.
- Contrôle : une page temporaire `src/pages/controle-icones.astro` (Astro
  ignore les pages préfixées `_` ; supprimée avant commit) affiche le set à
  18, 24, 32 px, avec et sans pétale, et sert de capture de validation.

## 4. Les vignettes aquarelle — `Vignette.astro`

| Nom | Sujet (objets, sans personnage) | Où |
|---|---|---|
| `plaid` | un plaid plié et une tasse fumante sur l'accoudoir d'un fauteuil | accueil « Ce qui vous amène » |
| `carnet` | un carnet ouvert, un stylo, des lunettes posées | accueil « Qui je suis » ; page À propos (hero) |
| `fauteuils` | deux fauteuils arrondis face à face, un coussin framboise | accueil « Première séance » ; page Approche (section étapes) |
| `porte` | une porte entrouverte d'où entre la lumière du matin | accueil « Carte + cabinets » ; page Lieux (hero) |
| `fenetre` | une fenêtre au matin, rideau léger, une plante sur le rebord | closing (toutes pages) |

- Génération : Higgsfield **Nano Banana Pro**, `aspect_ratio: "1:1"`,
  `resolution: "1k"`, `image_references` = `approche.webp` + `nutrition.webp`
  (style), prompt = celui des aquarelles d'août (« Entirely hand-painted
  watercolor illustration on white paper, soft pastel, loose wet-on-wet
  washes, visible paper grain, no photorealism, no text, no letters ») +
  le sujet + la palette (pêche, rose, lilas, eau, une touche framboise).
  **2 candidats par sujet**, montrés côte à côte dans le compagnon visuel,
  l'utilisateur choisit ; une relance au plus par sujet.
- Fichiers : masters PNG dans `brief/illu-src/` (gitignoré),
  `public/media/illu/<nom>-{320,640,960}.webp` (qualité 80/78/76), chaque
  640 px ≤ 60 Ko. Extension de `scripts/convertir_illustrations.mjs`
  (un mode `--vignette` à trois tailles).
- Composant `Vignette.astro` : `name`, `alt` (descriptif, l'image est
  informative : « Aquarelle : deux fauteuils face à face »), `sizes`,
  `loading="lazy"`, `decoding="async"`, dimensions déclarées (pas de CLS),
  `data-reveal`.
- Placement : dans les sections `.section--blob`, à l'opposé du texte sur
  desktop (colonne libre, 260 à 360 px, léger `rotate` −2° à 2° pour casser
  la grille), **au-dessus du titre sur mobile** (200 px, centrée). Le blob
  reste derrière, la vignette ne touche jamais le verre.

## 5. Le texte — règles et cibles

Règles (toutes pages) :

- Une idée par phrase ; paragraphe de **deux phrases au plus** ; copy de
  section **≤ 40 mots** ; carte ou étape = **une ligne (≤ 14 mots)**.
- Ce qui ne bouge pas : les faits (agrément, master, adresses, horaires,
  plateformes, téléphone, e-mail), les phrases dans les mots des patients
  (guillemets de « Ce qui vous amène »), les titres H1/H2 (SEO), les meta
  descriptions, la phrase pivot du closing « Le plus difficile, c'est souvent
  de prendre le premier rendez-vous ».
- FAQ de Lieux : **6 → 4 questions**. On garde « Doctoranytime ou Rosa ? »,
  « Faut-il une prescription ? », « Proposez-vous des consultations en
  visio ? » et « Comment payer ? » (dont la réponse absorbe en une phrase
  celle de « Les séances sont-elles remboursées ? ») ; « Qui consultez-vous ? »
  disparaît (les accompagnements y répondent). Réponses ≤ 30 mots, `faqLd`
  resynchronisé sur les 4 entrées.
- Bandeau : **10 → 8 capsules** (« Transitions de vie » retiré, aucune page ;
  « Périnatalité » + « Parentalité » fusionnées en « Périnatalité & parentalité »).
- « Ce qui vous amène » : **8 → 6 cartes** (fusion des deux phrases
  périnatalité / parentalité en une : « On attend un enfant, ou être parent me
  dépasse. » ; « Je vis avec la douleur ou la maladie » quitte les cartes,
  reste dans le bandeau et sur la page Ados & adultes).
- Closing : titre + une phrase + les deux boutons (≤ 45 mots).

Cibles (mots du texte visible de la page construite, nav et footer compris —
même base que les valeurs « aujourd'hui », mesurées le 2026-09-12 ; script
`scripts/compter_mots.mjs` sur `dist/`) :

| Page | Aujourd'hui | Cible (spec) | Cible recalibrée (2026-09-13, option A) |
|---|---|---|---|
| Accueil | 994 | ≤ 600 (et ≤ 6 000 px desktop) | ≤ 660 |
| Approche | 492 | ≤ 320 | ≤ 385 |
| À propos | 403 | ≤ 260 | ≤ 325 |
| Ados & adultes | 427 | ≤ 280 | ≤ 345 |
| Enfants & famille | 394 | ≤ 270 | ≤ 335 |
| Périnatalité | 414 | ≤ 280 | ≤ 345 |
| Nutrition | 411 | ≤ 270 | ≤ 335 |
| Lieux & contact | 545 | ≤ 380 | ≤ 445 |
| Mentions légales | 403 | inchangé | inchangé |

> **Amendement du 2026-09-13 (pendant l'implémentation)** : le texte fixe de
> chaque page (nav rendue deux fois, barre + tiroir mobile, et pied de page)
> pèse **163 mots**, pas les 100 supposés. Tenir les cibles initiales aurait
> imposé de supprimer des sections, contraire à l'approche A validée. Les
> cibles sont donc relevées de 65 mots ; la coupe reste de −30/35 % sur le
> contenu réel (−34 % sur l'accueil). Option B (retirer des sections) écartée.

SEO / GEO : H1, H2 et meta inchangés ; `llms.txt` régénéré ; JSON-LD FAQ à
4 entrées ; audit SEO/GEO (`/noveo-checkquality`) repassé après coup, écart
attendu ≤ 2 points.

## 6. Emplacements, page par page

| Page | Pictos | Vignette |
|---|---|---|
| Accueil — hero | 4 repères (`sceau`, `livre`, `epingle`, `calendrier`, 18 px, sans pétale) | médaillon existant |
| Accueil — situations | 6 cartes : pastille 46 px avec picto 26 px + pétale de la teinte de la carte | `plaid` |
| Accueil — carrousel | 4 onglets : picto 20 px devant le libellé (pas de pétale) | illustrations `-card` existantes |
| Accueil — Qui je suis | 3 repères : picto 24 px + pétale remplace la puce-pétale | `carnet` |
| Accueil — Première séance | 3 cercles : picto 22 px remplace le numéro (le numéro passe en `sr-only`) | `fauteuils` |
| Accueil — Nutrition | — | illustration existante |
| Accueil — Carte + cabinets | `epingle` devant la ville, `itineraire` sur le lien | `porte` |
| Closing (toutes pages) | `eclaircie` 28 px au-dessus du titre | `fenetre` |
| Approche | 3 piliers : pictos `outils`, `coeur-feuille`, `sablier` dans la pastille (le logo répété disparaît) ; étapes comme l'accueil | `fauteuils` |
| Accompagnements ×3 | picto de la page dans le PageHero (28 px, sous l'overline) | illustrations existantes |
| Nutrition | `assiette` + `lune` dans le PageHero | existante |
| À propos | 3 repères officiels : `livre` (formation), `sceau` (agrément), `pousse` (formation en cours) | `carnet` |
| Lieux & contact | cartes : `epingle`, `horloge`, `itineraire`, `visio` ; contact : `telephone`, `enveloppe` | `porte` |
| 404 | `eclaircie` | — |

## 7. Ce qui ne change pas

La traversée du hero, le système de surfaces et de jetons, le film, les
animations existantes (bandeau, carrousel, étapes tracées, carte, parallaxe,
traits), les corrections P1 du 12/09, le contrat de données (`site.ts`,
`accompagnements.ts`, `etapes.ts`, `themes.ts` ne font que gagner un champ
`icone`), les routes, le Dockerfile et nginx.

## 8. Mobile, accessibilité, performance

- Pictos décoratifs `aria-hidden` ; les seuls pictos porteurs de sens (contact
  du footer) ont un `label`. Le numéro d'étape reste lisible aux lecteurs
  d'écran (`sr-only`).
- Contraste : trait `--ink` sur pastille ≥ 9:1 ; le pétale (0,55) ne passe
  jamais sous un texte.
- Poids : set complet ≤ 24 Ko de SVG inline par page (les pictos non utilisés
  sur une page ne sont pas émis : import à la demande côté Astro) ; 5
  vignettes ≤ 60 Ko chacune en 640 px, lazy hors viewport.
- Mobile : vignettes 200 px au-dessus des titres, pictos 22 px minimum,
  cibles tactiles inchangées.
- Reduced-motion : rien de nouveau ne bouge.

## 9. Vérification (preuve au navigateur)

1. `pnpm build` vert ; `scripts/compter_mots.mjs` sous les cibles du §5 pour
   chaque page (tableau dans le rapport).
2. Captures 1440 et 390 des 9 pages, lues ; console vide ; aucun débordement.
3. Page `_icones` : le set entier lisible à 18 px ; supprimée ensuite.
4. Contrastes au pixel (script `contrast.py` du 12/09) sur les nouveaux
   libellés courts et les pastilles.
5. Détecteur impeccable sur `dist` et les URL : aucun constat nouveau hors
   `hero-eyebrow-chip`/`kicker` documentés.
6. Audit SEO/GEO repassé, `llms.txt` à jour.
7. Reduced-motion et sans JS : hero complet, vignettes visibles.

## 10. Livraison

Validation à l'écran sur 4331 → commit 1 « Corrections impeccable P1 du
12/09 » → commit 2 « Allègement du texte + iconographie sur mesure »
(+ commit des specs/plan/scripts) → redéploiement de la maquette
(`GET /deploy?uuid=seetu6uqg4tnkjg8do4f1f8n`) → vérification en ligne →
régénération du dossier client PDF (captures) dans un chantier suivant.

## 11. Hors périmètre

Photo de la cliente, tarifs, domaine final (toujours en attente cliente) ;
les P2/P3 impeccable (mailto visio, Échap du déroulant, pétales en
reduced-motion, cibles 44 px…) ; toute refonte de structure (approche B) ;
un mode sombre.
