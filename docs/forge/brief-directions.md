# Xénia van Outryve — seconde proposition : trois directions (brief commun, 2026-10-20)

## Demande

Retours de la cliente (e-mails des 8 et 14/09/2026, transférés par Arnaud le 15/09, dans `remarques/`) :

1. **Typo et couleurs** : à changer (« comme je t'ai déjà dit la typo et les couleurs », remarque orale non transcrite).
2. **« Je m'y perds un peu parmi toutes ces petites phrases entre guillemets, du type “le plus difficile, c'est souvent
   de prendre rendez-vous” ou “il n'y a pas de bon moment pour demander de l'aide”. Elles me donnent un aspect un peu
   trop commercial, alors qu'on cherche plutôt à transmettre une idée d'accompagnement bienveillant. »**
3. **À garder** : « l'ajout des itinéraires et la mise en avant de nos trois cabinets, ça apporte un vrai plus ».
4. **Références** (`brief/references-2026-09-14/`) : `ref-anda.png`, `ref-amarie-lael.png`, `ref-pinterest-therapeutes.png`
   (14/09) et, déjà reçues le 27/07, `ref-yoga-studio.png`, `ref-reimagining-your-story.png`. Elles convergent : tons
   chauds et naturels (lin, sauge, rose poudré, ocre, bleu poudré), titres à empattements fins, **sa photo dans le
   hero** (arche, ovale, rectangle), beaucoup d'air, des titres qui décrivent, une rangée de valeurs, des étapes
   numérotées, des pictos au trait.
5. **Ses photos** (`brief/photos/`, noir et blanc) : à utiliser.

Demande de l'utilisateur (2026-10-20) : « fais 3 DA différentes, change tout et repropose ce qu'elle veut suivant les
remarques ». Décisions : **accueil + page « Cabinets » par direction**, présentoir à la racine ; **ses photos + 12
ambiances générées** (Higgsfield, 33 crédits, faites). La v1 « L'éclaircie » est étiquetée `v1-eclaircie`.

Rappel de son brief d'origine (27/07) : « quelque chose de pas trop carré, avec de l'espace pour donner cette envie de
respirer et prendre soin de soi » ; « j'aime bien ce style de dégradé et l'effet de transparence (il peut être que
d'une couleur) ».

**Ton recherché : un accompagnement bienveillant, pas une page de vente.** Calme, chaleureux, lisible, sérieux.
Qualité de finition maximale, zéro effet gratuit. Aucune coque, aucun état « gabarit ».

## Règles d'écriture (sa remarque n° 2 — non négociables, contrôlées)

- Tous les textes viennent de `src/data/contenu.ts` (**lecture seule**). Réécrire une tournure est permis s'il le faut
  pour la mise en page, jamais ajouter une accroche.
- **Aucun guillemet** (« », “ ”) dans le texte visible. Aucune phrase-choc, aucune « citation » mise en exergue, aucune
  formule qui nie une objection pour la retourner (« Il n'y a pas de… », « Vous n'avez pas à… », « Le plus
  difficile… »), aucune question rhétorique en titre (sauf le module A « Par où commencer ? » et la FAQ).
- Des **titres qui décrivent** (« Mon approche », « Trois cabinets en Brabant wallon »…), sa voix (« je ») quand c'est
  elle, « vous » pour le lecteur.
- Son nom : **« Xénia van Outryve »** (« van » en minuscule). Jamais « Xénia Van ».
- Rien d'inventé : aucun tarif, aucun avis, aucune durée de séance, aucun nombre d'années, aucun diplôme hors
  `contenu.ts`. Jamais « spécialiste » / « spécialisée ».
- **Jamais l'agence** (Noveo, CLT Concept, chris-ia), jamais l'outil de génération, jamais l'ancien domaine
  `mindfoodyou`.
- Les ambiances générées ne sont **jamais présentées comme ses cabinets** (pas de « mon cabinet » à côté d'une image,
  `alt` = ceux de `medias.ts`).

## Règles « sobre et lisible » (mesurées à la relecture)

- Texte courant **≥ 18 px sur ordinateur, ≥ 17 px sur téléphone**, interligne 1,6-1,7, lignes ≤ 70 caractères. Plus
  petit texte ≥ 14 px. Aucune graisse < 400 sous 24 px.
- h1 du hero 48-68 px ordinateur (`clamp`), 34-40 px téléphone ; h2 34-44 px ; h3 21-25 px.
- Contrastes : texte courant **≥ 7:1**, secondaire ≥ 4,5:1, boutons ≥ 4,5:1 (mesurés, notés dans le rapport).
- Liens du texte soulignés. Boutons ≥ 48 px de haut, libellé 17 px, graisse 600 ; contrôles ≥ 44 × 44 px ; focus
  visible (contour 3 px, décalé de 3 px).
- **En-tête** collant, toujours visible : logotype, navigation, **téléphone en clair** (lien `tel:`), bouton plein
  « Prendre rendez-vous ». **Téléphone (≤ 900 px)** : bouton « Menu » (mot visible, `aria-expanded`) → panneau plein
  écran (focus piégé, Échap, défilement bloqué) + **barre fixe en bas** « Appeler » (`tel:`) + « Rendez-vous »
  (`#rendez-vous`), hauteur 60-68 px, `env(safe-area-inset-bottom)`, qui pose `--selecteur-decalage-bas` pour que le
  sélecteur de direction passe au-dessus.
- **Mouvement** : l'entrée du hero (≤ 1,6 s, une fois) + la signature de la direction + une apparition douce des blocs
  (`activerApparitions()` de `src/lib/mouvement.ts`, rien de caché sans `html.js`). **Interdits** : GSAP, Lenis,
  parallaxe, épinglage, défilement détourné, curseur personnalisé, texte découpé mot à mot, transition de page, vidéo.
  `prefers-reduced-motion` : tout est posé, rien ne bouge.
- **Densité** : accueil **≤ 800 mots visibles** dans `<main>`. Une idée par bloc.
- Images : `<img>` avec `width`/`height`, `loading="lazy"` sauf la photo du hero (`fetchpriority="high"`), `srcset`
  720/1200 (ou 960/1920 pour les 16:9), jamais déformées. **Ses photos restent en noir et blanc** (son choix) ; une
  légère teinte par CSS est tolérée (≤ 10 %), jamais une colorisation.

## Contenus et médias

- `src/data/contenu.ts` : `identite`, `emailLien()`, `plateformes`, **`heros.<x>`** (ces textes exactement),
  `actions`, `presentation`, `accompagnements` (4, `id` = ancre), `approche` (4 valeurs), `etapes` (3), `cabinets` (3 :
  plages, plateforme, position sur la carte), `itineraire(c)`, `lienRendezVous(c)`, `cabinetsIntro`, `visio`,
  `semaine` + `jourSansCabinet` (module B), `orientation` (module A), `questions` (4), `contact`, `pageCabinets`,
  `navigation`, `pied`, `carteBrabant` (contour + liaison, module C).
- `src/data/medias.ts` : `photos` (3, noir et blanc) et `ambiances.<x>` (4 par direction : trois 4:5 + une 16:9
  `piece` pour la tête de la page Cabinets), avec `src` 720/1200 (ou 960/1920), dimensions et `alt`. Planche :
  regarder les fichiers dans `public/` avant de cadrer (sujet, zones calmes).

## Pages (mêmes dans les trois directions)

### Accueil — `src/directions/<x>/Accueil.astro`, route `/<x>/`
1. **Hero** (voir la direction) : `heros.<x>.titre` en `<h1>`, `heros.<x>.ligne`, bouton plein « Prendre rendez-vous »
   (`#rendez-vous`) et lien « 0475 67 03 50 » (`tel:`). Rien d'autre.
2. **Qui je suis** (`id="qui-je-suis"`) : `presentation` (titre, 3 paragraphes, 3 repères) + la seconde photo.
3. **Accompagnements** (`id="accompagnements"`) : les 4 (nom, ligne, thèmes en liste, note). Chaque bloc porte son
   `id` d'accompagnement.
4. **Le module de la direction** (A : orientation ; B : semaine ; C : carte des cabinets = la section cabinets de C).
5. **Mon approche** (`id="approche"`) : intro + les 4 valeurs.
6. **Premier rendez-vous** : les 3 étapes numérotées.
7. **Cabinets** (`id="cabinets"`, sauf C où la carte en tient lieu) : `cabinetsIntro` + les 3 cabinets (ville, nom,
   adresse, plages, « Itinéraire » = `itineraire(c)` nouvel onglet, « Rendez-vous sur Doctoranytime/Rosa » =
   `lienRendezVous(c)` nouvel onglet, mention « (nouvel onglet) » pour les lecteurs d'écran) + `visio` + lien « Toutes
   les informations pratiques » vers `/<x>/cabinets/`.
8. **Questions** (`id="questions"`) : les 4 `questions` en `<details>` (summary ≥ 52 px, marqueur dessiné).
9. **Rendez-vous** (`id="rendez-vous"`) : `contact.titre/texte`, un bouton par cabinet (« Court-Saint-Étienne »,
   « Nivelles », « La Hulpe » → plateforme, nouvel onglet), **le numéro écrit en grand** (≥ 28 px, `tel:`), l'e-mail
   (`emailLien()`), « Demander une visio » (`emailLien('Demande de consultation en visio')`).
10. **Pied** : logotype, `identite.titre`, navigation, coordonnées, `pied.ligne`, `pied.copyright`.

### Cabinets — `src/directions/<x>/Cabinets.astro`, route `/<x>/cabinets/`
1. Tête : ambiance `piece` de la direction en bandeau (40-50 svh ordinateur, 30-36 svh téléphone, texte jamais sur le
   sujet), fil d'Ariane « Accueil › Cabinets », `<h1>` `pageCabinets.titre`, `pageCabinets.ligne`.
2. Les 3 cabinets en détail (une section par cabinet, `id` = `cabinet.id`) : ville, nom, adresse complète, jours et
   heures, itinéraire, rendez-vous. Le contour du Brabant wallon avec le point du cabinet est bienvenu (`carteBrabant`).
3. « Doctoranytime ou Rosa ? » (`pageCabinets.plateformesTitre/Texte`), les 4 `modalites`, la `visio`.
4. Questions, Rendez-vous, pied : composants partagés de la direction (mêmes que l'accueil).

### Chrome (deux pages)
- Lien d'évitement « Aller au contenu ». En-tête : logotype (lien `/<x>/`, nom accessible « Xénia van Outryve,
  accueil »), `navigation` (les ancres pointent vers `/<x>/#…` depuis la page Cabinets ; « Cabinets » porte
  `aria-current="page"` sur sa page), téléphone, bouton. Sur ordinateur entre 900 et 1180 px, le téléphone peut ne
  garder que le numéro.
- **Logotype** propre à la direction (typographique, voir chaque direction). Aucun logo existant : la cliente n'en a
  pas (ancien « pétales » de la v1 abandonné).
- En fin de `<body>` : `<SelecteurDirection direction={direction('<x>')} chemin="/" />` (ou `"/cabinets/"`), coin
  bas gauche.

## Les trois directions

Trois mondes réellement différents (composition, palette, typographie, iconographie, cadrage des images, mouvement),
tous tirés de ses références. Les couleurs sont des points de départ : **mesurer** et ajuster d'un cran si un couple
n'atteint pas le seuil.

### A — « Le carnet »
- **Intention** : posé et écrit, une page de carnet qu'on remplit ensemble, claire et aérée. (Sur ses quatre photos,
  elle a le même carnet noir à spirale : c'est son objet.)
- **Palette** : papier `#F5F6F3` (fond), blanc `#FFFFFF` (surfaces), encre `#1D2A3F` (texte, titres ; 13,3:1 sur
  papier), **bleu poudré `#C9D8E6`** (grands aplats, ≥ 25 % de la page ; encre dessus 9,9:1), ardoise `#2E4A72`
  (boutons, liens ; blanc dessus 9:1), gris d'encre `#4A5568` (secondaire, 6,9:1), filet `#D5DCE4` (lignes de carnet).
- **Typographies** : **Literata Variable** (titres, 400-500 ; un mot en italique au plus par titre) ; **Albert Sans
  Variable** (texte). **Manuscrit** : le prénom « Xénia » tracé au stylo en glyphes Hershey Script (un `<path>` par
  lettre, `stroke-dashoffset` séquencé) — recette de la v1 : `git show v1-eclaircie:src/components/Manuscrit.astro`
  (glyphes à figer dans le dépôt, aucun appel réseau). Le manuscrit ne sert qu'au prénom et à au plus deux repères (un
  numéro, une flèche), jamais à une phrase.
- **Composition** : grille éditoriale **à marge** : une colonne de marge à gauche (120-160 px sur ordinateur) qui porte
  le numéro de chaque section (1, 2, 3… en Literata) et une fine ligne verticale de cahier ; le contenu à droite. Lignes
  de carnet très légères (`#D5DCE4`, pas régulier) en fond des bandes bleu poudré. Photos et ambiances en rectangles
  droits, filet fin, ombre de papier à peine visible. Aucune forme organique. Sur téléphone, la marge devient un
  numéro en tête de section.
- **Hero** : deux colonnes. À gauche : h1, ligne, bouton, téléphone. À droite : `photos.carnet` (elle, son carnet sur
  les genoux) en grand rectangle portrait sur une bande bleu poudré (≈ 40 % de la largeur) ; **« Xénia » s'écrit au
  stylo** en ardoise à côté de la photo à l'arrivée (1,4-1,6 s, une fois). Téléphone : photo en tête (≤ 46 svh), texte
  dessous.
- **Iconographie** : trait d'encre 1,6 px, légèrement irrégulier comme tracé à la main, encre ou ardoise, grille 24 px,
  dessinée pour la direction (SVG en ligne), toujours accompagnée d'un mot.
- **Module « Par où commencer ? »** (`orientation`) : quatre onglets en intercalaires de carnet (boutons,
  `aria-pressed` ou `tablist`) ; le panneau montre le texte, les thèmes de l'accompagnement lié, « Où me rencontrer »
  (les trois villes et leurs jours) et « Prendre rendez-vous ». Sans JS : les quatre panneaux lisibles, empilés.
- **Mouvement** : stylo du hero ; un trait souligné à la main sous chaque h2 à son premier passage (0,6 s) ;
  apparitions douces.
- **Médias** : `ambiances.a` (carnet, chaise, tasse, piece) ; photos `carnet` (hero) et `debout` (Qui je suis).

### B — « Respirer »
- **Intention** : de l'air et des courbes douces, la sauge et le lin, une arche pour entrer. (Ses mots du 27/07 :
  « de l'espace pour donner cette envie de respirer ».)
- **Palette** : lin `#F2F1EA` (fond), **sauge claire `#B9C4AF`** (grands aplats, ≥ 30 % de la page ; texte forêt
  dessus 7,7:1), sauge profonde `#4F6248` (secondaire, 5,8:1 sur lin), forêt `#22301F` (texte, 12,3:1), forêt bouton
  `#2F4231` (boutons, texte lin 9,5:1), rose poudré `#E8CFC4` (petites touches), blanc `#FFFFFF`. **Un seul dégradé**,
  monochrome (sauge claire → lin), en voile sur le hero, et **un panneau translucide** (verre dépoli,
  `backdrop-filter`, repli opaque) : c'est son souhait de juillet, dégradé et transparence d'une seule couleur.
- **Typographies** : **Libre Caslon Display** (titres, 400, grands et fins) ; **Figtree Variable** (texte). Sur-titres
  en petites capitales espacées permis dans cette direction seulement (≥ 14 px, 600, interlettrage ≤ 0,12 em).
- **Composition** : centrée, symétrique, beaucoup d'air. **L'arche** est le cadre de la direction (photos et ambiances,
  `border-radius: 999px 999px 0 0` ou équivalent). Rameaux au trait (olivier, dessins SVG originaux, trait 1 px forêt)
  en marge de certaines sections. Valeurs de l'approche en **rangée de 4 colonnes bordées** (référence Anda), étapes
  1-2-3 dans des cartes arrondies rose poudré.
- **Hero** : l'arche avec `photos.canape` au centre-droit, le titre en Libre Caslon à gauche, sur le voile sauge.
  À l'arrivée l'arche s'ouvre de bas en haut (`clip-path`, 1 s) puis un rameau d'olivier se dessine le long de l'arche.
  Téléphone : arche centrée en tête (≤ 46 svh), texte dessous, centré.
- **Iconographie** : trait fin 1,25 px, forêt, extrémités rondes, une petite feuille en accent sur certaines.
- **Module « Quel jour, quel cabinet ? »** (`semaine`, `jourSansCabinet`) : cinq pastilles lundi → vendredi, le jour
  courant présélectionné (le week-end : lundi) ; le panneau donne le ou les cabinets du jour, la plage, l'adresse,
  « Itinéraire » et « Rendez-vous sur Doctoranytime/Rosa ». Sans JS : le tableau de la semaine, lisible.
- **Mouvement** : arche qui s'ouvre, rameau dessiné, apparitions douces. Rien d'autre.
- **Médias** : `ambiances.b` (fauteuil, olivier, arche, piece) ; photos `canape` (hero) et `carnet` (Qui je suis).

### C — « Le salon »
- **Intention** : chaleureux comme chez soi, l'ocre, le rose et la lumière de l'après-midi.
- **Palette** : blanc chaud `#FBF6F0` (fond), **rose blush `#EFD5CA`** (grands aplats ; brun dessus 10,7:1), **ocre
  `#D6A851`** (bandes pleine largeur, ≥ 20 % de la page), brun `#2B1E16` (texte ; **sur l'ocre, mesurer ≥ 7:1**, sinon
  éclaircir l'ocre d'un cran), terracotta `#9A4A2B` (boutons, texte blanc 6,2:1 ; liens sur fond clair 5,8:1 → texte
  courant en brun, terracotta pour les liens soulignés et les accents), rose pâle `#F6E3DA`, noir doux `#1E1915` (motif).
- **Typographies** : **Alice** (titres, 400) ; **Karla Variable** (texte).
- **Composition** : bandes pleine largeur aux **bords ondulés** (vagues douces, aucun coin vif : « pas trop carré »).
  Photos dans des **formes organiques**. Une **bande ocre** porte les 4 accompagnements, chacun avec un objet du salon
  dessiné au trait crème (fauteuil, canapé, tasse, lampe arc), comme sa référence « Reimagining your story ». Le
  **motif du tapis berbère** de son propre salon (losanges au trait noir fin) en texture discrète sur un bandeau.
- **Hero** : fond rose blush ; `photos.debout` dans une forme organique à droite, qui « respire » à l'arrivée
  (morph doux de la forme, 1,2 s, une fois) ; titre Alice à gauche ; une vague ocre part sous le hero. Téléphone :
  forme en tête (≤ 46 svh), texte dessous.
- **Iconographie** : trait 1,75 px arrondi, brun (crème sur l'ocre), objets du quotidien.
- **Module « Les cabinets sur la carte »** (`carteBrabant`, `cabinets`) : le contour du Brabant wallon (trait brun), la
  liaison en pointillés terracotta, trois pastilles ; clic ou focus sur une pastille ou un onglet de ville → fiche :
  nom, adresse, jours, « Itinéraire », « Rendez-vous ». Les trois fiches restent lisibles sans JS (liste sous la
  carte). C'est la section `id="cabinets"` de C.
- **Mouvement** : forme du hero qui respire, contour de la carte tracé au premier passage (1 s), apparitions douces.
- **Médias** : `ambiances.c` (mur, coussins, table, piece) ; photos `debout` (hero) et `canape` (Qui je suis).

## Présentoir — `src/pages/index.astro`
Cahier des charges de `.claude/skills/forge/references/trois-directions.md` § Présentoir, version **sobre** :
ouverture courte (≤ 2,5 s, une fois par onglet, « Passer l'introduction ») : « Xénia van Outryve », « Psychologue
clinicienne », « Votre site, trois directions. » ; triptyque des trois panneaux dans leur charte (photo du hero,
`heros.<x>.titre`, nom de la direction, intention) ; survol/focus élargit ; clic → `/<x>/`. Mobile en bandes. Aucune
direction recommandée. Mention : « Mêmes contenus dans les trois directions : passez de l'une à l'autre à tout moment
avec le sélecteur en bas à gauche. »

## Contrôles (chaque agent, sur son périmètre)
`npm run check`, `npm run build`, `node scripts/verifier.mjs --mode preview` (0 erreur) ; captures 1440 × 900 et
390 × 844 de ses pages (premier écran à 0 s et 2 s, page entière) regardées pour de vrai ; aucun débordement à 360 px ;
clavier (tabulation, onglets du module, menu, Échap) ; sans JS lisible ; `prefers-reduced-motion` posé ; console
vide ; mots visibles de l'accueil ≤ 800 ; contrastes mesurés. Ports : A 4931, B 4932, C 4933, présentoir 4934
(`npx astro dev --port <p>`), jamais 4331, jamais deux builds en même temps dans le dossier (un build = demander à
l'orchestrateur ou utiliser un `--outDir` propre à l'agent).
