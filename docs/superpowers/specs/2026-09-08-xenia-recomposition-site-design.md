# Xenia — recomposition du site (design)

> Spec validée le 2026-09-08 avec l'utilisateur, après diagnostic sur 41 captures
> du site en ligne (desktop 1440, mobile 390, 6 pages intérieures), le brief et
> les 3 références de la cliente. Périmètre B « recomposer », **élargi à tout le
> site** sur demande de l'utilisateur (« fait tout le site ») : l'accueil est
> recomposé (§3-§7), chaque page intérieure reçoit le même système (§8).

## 1. Pourquoi

La cliente a demandé « épuré, peps, lumineux, qui donne envie », avec « du
dégradé et de la transparence ». Ses trois références partagent un trait : **un
sujet visuel (fauteuil, personne, lieu) sur fond pastel, avec beaucoup de
lumière**. Le site livré le 2026-08-11 est riche mécaniquement (scène épinglée,
stylo, film) mais visuellement il est **du texte sur ivoire, sans sujet, avec un
hero gris**.

Défauts constatés, par impact :

1. **Premier écran vide** : ivoire quasi blanc + une phrase (voile à 88 %).
   Ressemble à une page non chargée ; 2 écrans de scroll avant une information.
2. **Film gris** : la fumée beige-grise assombrit le hero, le copy gris-mauve
   devient illisible dessus (pire en mobile, fond brun).
3. **Couture dure** sous le hero : le film se coupe en ligne droite sur l'ivoire.
4. **Vides géants** : 9 014 px pour 6 sections, 4 positions de scroll quasi vides.
5. **Personne** : zéro visage, zéro place réservée au portrait sur l'accueil.
6. **Ornements faibles** : pétales = ellipses plates flottantes ; cercles
   nutrition « PowerPoint » ; médaillons intérieurs sur fond crème plat.
7. Détails : guillemets orphelins, 14 cartes blanches identiques, vague ×4.

Ce qui est bon et **ne change pas** : Fraunces + Hanken, l'accent framboise, le
stylo « Respirez. » (glyphes Hershey), la nav en capsule, les textes, le socle
SEO/JSON-LD/légal, la signature **pilotée par le scroll** (pin + scrub, jamais
une intro au chargement — décision utilisateur du 2026-08-11), le mode
mobile (intro courte au load), sans JS / reduced-motion = statique.

## 2. Décisions figées (2026-09-08)

| Sujet | Décision |
|---|---|
| Périmètre | **B** — recomposer (pas seulement corriger), **tout le site** : accueil + 8 pages intérieures + 404 |
| Film du hero | **Régénéré** (pas re-gradé en CSS) : Seedance 2.5, 1 clip de 24 s, 1080p, 216 crédits, sans raccord ni upscale 4K |
| Médaillon du hero | **Aquarelle permanente** (coin de cabinet lumineux). Le portrait vit dans « Qui je suis » et À propos |
| Teaser « Mon approche » | **Fusionné** dans « Qui je suis » (les 3 principes deviennent les 3 repères) |
| Méthode | localhost (port 4331), pas de commit/push/redéploiement tant que l'utilisateur n'a pas validé à l'écran |

## 3. Le hero

### 3.1 Composition (desktop ≥ 1024)

Deux colonnes dans `.container` (1080 px) : texte à gauche (`1.15fr`), médaillon
à droite (`0.85fr`), `align-items: center`, `gap: clamp(32px, 5vw, 72px)`.

- **Gauche** (inchangé en contenu) : eyebrow, H1 (« Psychologue en Brabant
  wallon, vers un *mieux-être durable* » + trait de pinceau), copy, actions,
  repères. Nouveau : un **scrim** ivoire derrière la colonne texte —
  `linear-gradient(90deg, rgba(253,251,248,0.92) 0 55%, rgba(253,251,248,0.55) 78%, transparent)`
  posé en `::before` du hero (pleine hauteur, largeur 100 %). Il garantit la
  lisibilité quoi que montre le film. Contraste du copy : `--muted` passe à
  `#6E5F76` sur le hero (≥ 4,5:1 sur ivoire 92 %).
- **Droite** : `figure.hero__medaillon`, 520 px max, ratio 4/5,
  `border-radius: 58% 42% 55% 45% / 48% 55% 45% 52%` (le blob du site),
  ombre `0 24px 64px rgba(67,50,75,0.16)`, un **anneau de verre**
  (`outline: 1px solid rgba(255,255,255,0.75)` + `outline-offset: -1px`)
  et un halo respirant derrière (`.halo`, 60 % de la largeur, décalé haut-droite).
  Contenu : `/media/illu/hero-cabinet.webp` (voir §7), `mix-blend-mode:
  multiply` sur un fond dégradé pêche→rose pour fondre le papier crème.
  Le médaillon monte en acte 3 avec le reste (y: 24 → 0, opacity 0 → 1,
  légère rotation −3° → 0).

### 3.2 La traversée (scène épinglée, desktop)

Inchangée dans son principe, resserrée :

| Réglage | Avant | Après |
|---|---|---|
| `end` du pin | `+=215%` | `+=140%` |
| Voile initial (`.hero__voile`) | ivoire 0,88 | ivoire **0,55** |
| Film à la première image | opacité 0 (invisible) | **0,35 dès le pré-paint** (poster + vidéo) |
| Acte 1 « Parfois, tout pèse… » | 0 → 0,08 | 0 → 0,10 |
| Acte 2 « Respirez. » (stylo) | 0,15 → 0,47 | 0,14 → 0,44 |
| Pétales | 0,34 | 0,36 |
| Acte 3 « La lumière revient… » | 0,57 → 0,69 | 0,50 → 0,62 |
| Hero réel (mot à mot + médaillon) | 0,77 → 1 | 0,68 → 1 |

Le film reste scrubé par `progress` (cible posée en `onUpdate`, lissage 0,14
en rAF, seuil 1/30 s — recette conservée). Son opacité va 0,35 → 0,75 en actes
1-2, puis **redescend à 0,45** en acte 3 (le scrim fait le reste).

**Premier écran** : parce que le voile est à 0,55 et que le poster du film est
déjà visible (image de fond CSS du `.aurora`, remplacée par la vidéo quand elle
est prête), l'écran 0 est **coloré** : aurore + lavis pâles + phrase 1. Plus
jamais blanc.

**Sortie du hero** : `mask-image: linear-gradient(to bottom, #000 72%, transparent 100%)`
sur `.hero__film` **et** sur `.aurora` ; la nappe de fond du hero garde son
fondu vers l'ivoire. Plus de ligne droite.

**Pétales** : remplacer les 3 ellipses plates par **2 groupes** de deux
ellipses croisées (le logo : rose × eau, recouvrement aubergine à 18 %),
`filter: blur(0.6px)`, opacité 0,35-0,45, tailles 140 px et 96 px, dérive
CSS conservée. Ils apparaissent en acte 2.

### 3.3 Mobile (< 1024)

Intro courte au chargement conservée (les pins sont fragiles au tactile). Le
médaillon passe **sous** le texte (max 300 px, centré), le film en boucle est
**limité aux 55 % supérieurs** du hero (`mask-image` vertical) et le scrim
devient horizontal (haut transparent → bas ivoire 0,9) pour que le copy et les
CTA soient toujours sur fond clair.

### 3.4 Garde-fous inchangés

`js-intro` posé avant le premier paint + timeout 3 s ; reduced-motion et sans
JS = hero complet statique (médaillon visible, film absent, poster visible) ;
GSAP en import dynamique ; `sort()+refresh()` après le pin.

## 4. Rythme et fond des sections

Jetons dans `global.css` :

| Jeton | Avant | Après |
|---|---|---|
| `--section-pad` | `clamp(84px, 11vw, 150px)` | `clamp(64px, 8vw, 104px)` |
| `--headline-gap` | `clamp(40px, 6vw, 68px)` | `clamp(32px, 4.5vw, 52px)` |
| `.tagline` padding-block | `clamp(70px, 10vw, 130px)` | `clamp(48px, 6vw, 84px)` |
| `.copy` margin-top | 22 px | 18 px |

**Bandes ivoire à vagues** (`.soft-wrap` + `<Wave>` ×4) : supprimées sur
l'accueil. À la place, un composant **`Blob.astro`** : forme organique SVG
(path déterministe, 5 variantes numérotées), remplie d'un dégradé pastel doux
(pêche→rose, lilas→eau, eau→pêche), `opacity` 0,5-0,7, posée en absolu,
débordant du conteneur, `aria-hidden`, `pointer-events: none`. Une par
section, placée asymétriquement (référence n° 2 de la cliente) :

| Section | Blob |
|---|---|
| Ce qui vous amène | n° 1, lilas→eau, haut-gauche, 52 vw, derrière la grille |
| Accompagnements | n° 2, pêche→rose, droite, 44 vw, entre les cartes 2 et 3 |
| Qui je suis | n° 3, rose→lilas, derrière le portrait |
| Nutrition | n° 4, eau→pêche, derrière la composition en verre |
| Lieux | n° 5, pêche→lilas, bas-droite |

Les blobs dérivent lentement (`transform` CSS 26-34 s, alterné), coupés en
reduced-motion. **Une seule vague** conservée : avant le pied de page (fond
`--ivory-soft` du footer).

Objectif mesuré : hauteur de la page d'accueil desktop **≤ 6 800 px** (9 014
aujourd'hui) avec une section de plus, et **aucune position de scroll** où
l'écran 1440×900 montre moins d'un élément de contenu.

## 5. Ordre et contenu des sections de l'accueil

1. **Hero** (§3)
2. **Ce qui vous amène** — 8 cartes conservées, **teintées par thème** :
   fond `linear-gradient(160deg, <teinte> 0%, #fff 70%)` avec teinte rose
   (burn-out, stress), lilas (périnatalité, parentalité), eau (enfants, TDAH),
   pêche (nutrition, maladie chronique) à 35 % ; `card--spot` conservé.
   Guillemets : `«&nbsp;…&nbsp;»` (insécables) et `text-wrap: pretty`.
3. **Trois espaces** (accompagnements) — inchangés (escalier conservé).
4. **Qui je suis** (nouvelle, remplace le teaser « Mon approche ») —
   deux colonnes, `1fr 1.2fr` :
   - gauche : `figure.qui__portrait`, cadre blob 4/5 (le style
     `apropos__portrait-ph` **extrait en composant `Portrait.astro`** réutilisé
     par À propos), placeholder aurore + logo + « Portrait à venir ». **Le
     seul « à venir » du site.** Quand la photo arrive : même composant,
     prop `src`.
   - droite : overline « Qui je suis », H2 « Xénia Van Outryve, *psychologue
     clinicienne* », citation de son mail « Je suis avant tout passionnée par
     chaque personne, avec son histoire, ses forces et ses fragilités. », puis
     **3 repères** en liste avec puce-pétale : *Intégrative* (des outils
     choisis pour votre situation), *Corps et esprit* (sommeil, alimentation,
     mouvement font partie du travail), *À votre rythme* (vos besoins et vos
     valeurs fixent le cap) — textes actuels du teaser, raccourcis à une ligne
     et demie ; sous la liste, 2 faits : Master UCLouvain · Agrément
     n° 9422118125 ; lien-flèche « En savoir plus sur moi » → `/a-propos/`
     et « Comprendre ma façon de travailler » → `/approche/`.
5. **Nutrition & Santé** — texte inchangé (split-scroll conservé) ; visuel
   remplacé par **la rencontre** : 3 pétales en verre (`backdrop-filter`,
   bord blanc 75 %) — Sommeil (lilas), Alimentation (pêche), Mouvement (rose)
   — disposés à 120° et se recouvrant au centre ; l'intersection porte un
   disque eau « Équilibre psychologique » (Fraunces 640). Les pétales sont
   des ellipses `rotate` (comme le logo), pas des cercles. Légère respiration
   (scale 0,98 → 1,02, 7 s, coupée en reduced-motion).
6. **Tagline** (« Vous n'avez pas à attendre… ») — déplacée **ici**, comme
   respiration avant les lieux, padding réduit (§4).
7. **Trois cabinets** — cartes inchangées + blob n° 5.
8. **Closing** — inchangé.
9. **Vague** + **Footer** — inchangés.

## 6. Le film

- **Génération** : Seedance 2.5, `t2v`, 24 s, 1080p, 16:9, sans audio,
  `bitrate_mode: high`. Prompt (anglais, sans les mots filtrés par la modération
  Higgsfield — `petal`, `translucent`, `plant`…) : papier aquarelle blanc en
  vue macro, lavis pêche / rose / lilas / menthe qui s'épanouissent en
  mouillé-sur-mouillé, presque vide au début (une goutte pêche au centre) et
  aurore pastel rayonnante à la fin, très lumineux, beaucoup de blanc aux bords,
  mouvement lent continu, caméra fixe, ni gris, ni encre sombre, ni fumée.
- **Critère d'acceptation à l'œil** (lecture des frames 0 / 6 s / 12 s / 24 s) :
  fond blanc dominant sur toute la durée, aucune zone grise ou brune, montée
  de couleur monotone (pas de retour au vide), pas de forme figurative.
  Sinon : une seconde génération avec le prompt corrigé (216 crédits), jamais
  plus de deux sans en reparler.
- **Encodage web** (recette du 2026-08-11) : `ffmpeg -i master.mp4 -vf
  scale=1280:720 -r 20 -c:v libx264 -g 1 -tune fastdecode -crf 22 -pix_fmt
  yuv420p -movflags +faststart -an public/media/hero-film.mp4`, vérifié au
  `ffprobe` : **100 % frames I**, ≤ 8 Mo. Poster = frame à 30 % en WebP
  (`hero-film-poster.webp`), utilisé aussi en fond CSS du hero (§3.2).
- **Master** livré dans `brief/masters/` (gitignoré, hors image Docker).

## 7. L'aquarelle du hero

- **Sujet** : coin de cabinet baigné de lumière du matin — fauteuil doux,
  voilage, un rai de lumière, une petite plante verte en pot, pêche et rose
  dominants, un accent framboise (coussin), sur papier blanc.
- **Style** : exactement celui des 4 aquarelles existantes (« entirely
  hand-painted watercolor, soft pastel, white paper, no photorealism »).
  Génération Kie nano-banana-pro (0,04 $/image, 3 candidats), repli Higgsfield
  seedream 4.5. Mots filtrés à éviter dans le prompt (`plant` → « small green
  leaves in a pot »).
- **Format** : source ≥ 1600 px de large, ratio 4/5, convertie en WebP 3
  tailles (640 / 1040 / 1600) par `scripts/convertir_illustrations.mjs`,
  servie en `srcset`, `fetchpriority="high"` (c'est le LCP).

## 8. Pages intérieures — le même système partout

Principe : **les textes ne bougent pas** (sauf les micro-ajouts listés), la
structure de chaque page reste ; ce qui change, c'est le fond, le rythme, les
surfaces et les visuels, avec les mêmes composants que l'accueil. Le diagnostic
des pages intérieures est le même que l'accueil en plus léger : bandes ivoire à
vagues (×2 par page), cartes toutes blanches, verre dépoli posé sur de l'ivoire
uni (donc invisible), médaillons sur crème plat, heros trop hauts.

### 8.1 Commun à toutes les pages

- **Jetons de rythme** (§4) : appliqués partout.
- **`PageHero`** : padding-top `clamp(150px, 18vw, 220px)` → `clamp(120px, 14vw, 168px)` ;
  médaillon fondu sur aurore (fond dégradé pêche→lilas, ou eau→lilas en
  variante `sage`, image en `mix-blend-mode: multiply`, anneau de verre comme
  le hero de l'accueil, §3.1) ; un **`Blob`** derrière le médaillon ; le halo
  respirant conservé. Les pages sans médaillon (À propos, Lieux, Mentions)
  reçoivent le blob seul, à droite.
- **Fin des bandes** : tous les `.soft-wrap` + `<Wave>` des pages sont
  retirés ; chaque ancienne bande devient une section sur ivoire avec **un
  `Blob`** posé asymétriquement (variante et côté alternés d'une section à
  l'autre). L'unique vague du site vit dans `Footer.astro` (avant le pied de
  page ivoire-doux), plus dans les pages.
- **Le verre retrouve un fond** : toute `.card--glass` est placée **sur** le
  blob de sa section (la transparence demandée par la cliente n'existe que
  devant de la couleur).
- **Cartes** : `Domaines.astro` (les motifs de consultation des 3 pages
  d'accompagnement) reçoit une **teinte par page** (rose = ado-adultes,
  lilas = périnatalité, eau = enfants) en dégradé haut de carte à 35 % + une
  puce-pétale devant le titre + `card--spot`. Les autres grilles de cartes
  blanches (piliers, motifs nutrition, repères, coordonnées) reçoivent la
  teinte de leur page de la même façon. Jamais deux cartes voisines de la
  même teinte quand la grille en compte ≥ 4 (alternance rose/lilas/eau/pêche).
- **`Closing`** : inchangé (déjà sur aurore).
- Guillemets insécables et `text-wrap: pretty` sur tous les `.copy` et
  titres de cartes (règle globale dans `global.css`).

### 8.2 Page par page

| Page | Ce qui change (au-delà du commun) |
|---|---|
| **Mon approche** | 3 piliers : cartes teintées + `icon-badge` pétale. « La première séance » : sur blob, les 3 étapes numérotées gardent leurs pastilles ; le bloc texte gauche reçoit une `card--glass` légère. « Pour qui » : les 3 publics deviennent **3 liens-cartes** compacts (Adolescents & Adultes / Périnatalité & Parentalité / Enfants & Famille) au lieu d'un seul lien-flèche — micro-ajout de navigation, pas de texte nouveau. |
| **Adolescents & Adultes** | Domaines (5) teintés rose. Section TDAH : sur blob rose→lilas, les 3 fronts deviennent des `card--glass` (aujourd'hui blanches sur ivoire-doux). |
| **Périnatalité & Parentalité** | Domaines (6) teintés lilas. « Il n'y a pas de bon moment » : texte centré sur un blob lilas→rose plein cadre, halo respirant (c'est la section la plus émotionnelle du site, elle mérite la lumière). |
| **Enfants & Famille** | Domaines (3) teintés eau. « Et les parents ? » : la note `card--glass` passe sur blob eau→lilas (elle est enfin visible comme du verre). |
| **Nutrition & Santé** | 4 motifs teintés eau/pêche alternés, titre sauge conservé. Focus TDAH + nutrition pédiatrique : 2 `card--glass` sur blob eau→pêche. |
| **À propos** | Portrait via `Portrait.astro` (même placeholder qu'à l'accueil, une seule source). « Repères » : 3 cartes teintées sur blob. Rien d'autre : le texte est celui de la cliente. |
| **Lieux & Contact** | `LieuxCards` : chaque carte gagne un lien **« Itinéraire → »** vers Google Maps (URL `maps/search/?api=1&query=<adresse>`, aucun embed, aucun cookie — cohérent avec la page vie privée) ; la bande de teinte 12 px passe en dégradé haut de carte à 35 % comme les autres. Visio : `card--glass` sur blob. FAQ : les 6 Q/R deviennent `card--glass` sur blob pêche→lilas. Coordonnées : 3 cartes teintées. |
| **Mentions légales** | Jetons de rythme + cartes teintées douces (lilas 20 %). Rien d'autre. |
| **404** | Déjà sur aurore : jetons de rythme seulement. |

### 8.3 Objectif mesuré

Chaque page intérieure perd **≥ 20 % de hauteur** à contenu égal (mesure
`scrollHeight` avant/après, desktop 1440), n'a plus aucune bande `.soft-wrap`,
et toute `card--glass` est posée devant un `Blob` (vérifiable au DOM).

## 9. Accessibilité, performance, garde-fous

- Contraste ≥ 4,5:1 pour tout texte courant (copy du hero sur scrim, texte
  sur cartes teintées, libellés des pétales nutrition).
- Blobs, pétales, film : `aria-hidden`, `pointer-events: none`.
- LCP = l'aquarelle du hero (préchargée) ; le film reste hors chemin critique
  (Blob à l'idle en desktop, `preload="none"`).
- Lighthouse accueil à la livraison : Performance ≥ 85 desktop, A11y ≥ 95.
- Aucune couleur en dur hors du bloc de jetons : nouvelles surfaces = nouveaux
  jetons (`--tint-rose`, `--tint-lilac`, `--tint-aqua`, `--tint-peach`,
  `--scrim-hero`).

## 10. Vérification (preuve au navigateur, jamais « fini » sans)

Par `browse`, desktop 1440×900 et mobile 390×844, console vide :

1. Écran 0 : coloré (pas blanc), phrase 1 lisible, film/poster visible.
2. Actes 1-3 : captures à 25 / 50 / 75 / 100 % du pin ; « Respirez. » écrit ;
   médaillon monté en fin d'acte 3 ; copy lisible (contraste mesuré).
3. Sortie du hero : aucune ligne droite (capture à pin + 200 px).
4. Hauteur de page ≤ 6 800 px ; captures tous les 800 px : chaque écran
   montre du contenu.
5. Section « Qui je suis » : portrait placeholder, 3 repères, 2 liens actifs.
6. Nutrition : les 3 pétales et l'intersection lisibles à 1440 et 390.
7. Pages intérieures, **chacune des 8 + la 404**, desktop et mobile : capture
   du hero (médaillon fondu, blob visible), capture de chaque ancienne bande
   (blob présent, verre lisible), hauteur ≤ 80 % de l'avant, aucun
   `.soft-wrap` dans le DOM, console vide.
8. Lieux & Contact : les 3 liens « Itinéraire » ouvrent la bonne adresse.
9. `pnpm build` vert ; `ffprobe` du film : 100 % frames I.

## 11. Hors périmètre

- Textes (sauf : raccourcis des 3 repères de l'accueil, libellés des 3
  liens-cartes « Pour qui », le mot « Itinéraire ») ; navigation ; SEO/JSON-LD ;
  formulaire ; nom de domaine ; carte interactive (embed = cookies tiers).
- Toute photo réelle : attend la cliente.

## 12. Reste à faire côté cliente (inchangé + 1)

- Photos (portrait pour « Qui je suis » et À propos).
- Nom de domaine final (placeholder `xeniavanoutryve.be` à ne pas « corriger »).
- Tarifs et moyens de paiement ; orthographe du nom ; réseaux sociaux.
- **Nouveau** : valider l'aquarelle du hero (elle restera même après les photos).

## 13. Notes d'implémentation (2026-09-09)

Écarts au texte de la spec, décidés en cours d'implémentation, à confirmer à l'écran :

- **« Respirez. » retiré** (demande utilisateur du 2026-09-09) : la traversée
  n'a plus que deux phrases, et un **indice de défilement** (« Faites défiler »
  + souris animée) apparaît sur l'écran 0 puis s'efface au premier scroll —
  sinon le visiteur ne comprend pas que la scène est épinglée.
- **Pin de la traversée : `+=100%`** (pas 140 %) et `--section-pad: clamp(56px, 6.5vw, 88px)`,
  tagline `clamp(40px, 5vw, 64px)` — pour approcher l'objectif de hauteur ;
  l'accueil est à **7 197 px** (−20 %), les pages intérieures à −9/−17 % :
  les cibles « ≤ 6 800 » et « −20 % » ne sont pas atteintes, resserrer davantage
  toucherait la respiration des sections (arbitrage utilisateur).
- **Blobs sur mobile (≤ 960 px)** : plutôt que des lobes dans un coin (le verre
  retombait sur l'ivoire uni en une colonne), le blob devient un grand lavis
  centré qui couvre la section (`Blob.astro`, règle mobile qui écrase le
  positionnement inline).
- **Formes des blobs** : les 5 tracés dessinés à la main rendaient des cercles ;
  remplacés par des formes à rayon modulé (graines 11/37/71/13/29), figées.
- **Plus de clip par section** (retour utilisateur du 2026-09-09 : le découpage
  cassait la fluidité) : les blobs débordent librement d'une section à l'autre,
  seul le débordement horizontal est coupé sur `<main>`. Le §4 « débordant du
  conteneur » se lit désormais « débordant de la section ».
- Hero : H1 `clamp(2.3rem, 4.6vw, 3.6rem)`, padding de la scène réduit, repères
  en grille 2×2, pétale 1 réduit et déporté en mobile, pétale 2 masqué en
  mobile, `sizes` 402 px — pour que le hero complet tienne sur 1366×768.
- Rencontre nutrition : libellés à 80 % du pétale (à 66 % le disque les masquait).
- Film : crf 27 (7,1 Mo) — à crf 22 le all-intra pesait 17 Mo.
- FAQ sur blob `lilac-rose` et RDV sur `peach-lilac` (le plan a inversé les
  teintes de la spec §8.2, sans conséquence visible).
- Domaines monochrome par page (5-6 cartes) : la règle « jamais deux voisines
  de même teinte » de §8.1 s'applique aux grilles mixtes, pas aux grilles
  thématiques.
