# Contrat des habillages (seconde proposition, 2026-10-20)

Le brief commun fait foi : `docs/forge/brief-directions.md` (pages, chrome, règles d'écriture et de lisibilité, les
trois directions). Ce fichier dit seulement comment un habillage se branche sur le socle.

## Périmètre d'écriture

- L'agent de la direction `x` n'écrit **que** dans `src/directions/<x>/` et `public/<x>/`.
- Tout le reste est au socle, en lecture seule : `src/data/`, `src/lib/`, `src/components/partage/`, `src/styles/`,
  `src/pages/`, `public/photos/`, `public/fonts/`, la configuration et `scripts/`. Un besoin dans ces fichiers se
  demande à l'orchestrateur.
- Les fichiers `Gabarit.astro`, `Accueil.astro` et `Cabinets.astro` de la direction sont des **coques** à remplacer
  entièrement. Elles portent `data-coque-provisoire` : le contrôleur l'accepte en aperçu (avertissement) et le refuse en
  livraison. Aucun habillage livré ne garde ce marqueur.

## Ce que l'habillage fournit

| Fichier | Rôle | Branché par |
|---|---|---|
| `src/directions/<x>/Accueil.astro` | page `/<x>/`, sans props | `src/pages/<x>/index.astro` |
| `src/directions/<x>/Cabinets.astro` | page `/<x>/cabinets/`, sans props | `src/pages/<x>/cabinets.astro` |

Le reste (gabarit, en-tête, menu, pied, composants, script, CSS, icônes) est libre à l'intérieur du dossier.

Obligations de chaque page :
- `<!doctype html>`, `<html lang="fr-BE">`, `<Tete titre=… description=… couleurTheme=… />` dans le `<head>` (titre,
  description, canonical, noindex, Open Graph, icônes et statistiques en dépendent).
- Un seul `<h1>` : `heros.<x>.titre` sur l'accueil, `pageCabinets.titre` sur la page Cabinets.
- Lien d'évitement vers `<main id="contenu">`.
- En fin de `<body>` : `<SelecteurDirection direction={direction('<x>')} chemin="/" />` (accueil) ou
  `chemin="/cabinets/"` (page Cabinets).
- Ancres de l'accueil : `#qui-je-suis`, `#accompagnements` (et l'`id` de chaque accompagnement), `#approche`,
  `#cabinets` (en C, la section de la carte), `#questions`, `#rendez-vous`. Page Cabinets : l'`id` de chaque cabinet
  (`court-saint-etienne`, `nivelles`, `la-hulpe`), `#questions`, `#rendez-vous`. Depuis la page Cabinets, la
  navigation pointe vers `/<x>/#…` ; le contrôleur vérifie que chaque ancre existe.
- Barre d'appel du téléphone : poser `--selecteur-decalage-bas` (sa hauteur) sur `:root` ou `body` pour que le
  sélecteur passe au-dessus.

## Ce que le socle met à disposition

- **Données** (`src/data/`) :
  - `contenu.ts` : tous les textes (lecture seule) — `identite`, `emailLien()`, `plateformes`, `heros`, `actions`,
    `presentation`, `accompagnements`, `approche`, `etapes`, `cabinets`, `itineraire(c)`, `lienRendezVous(c)`,
    `cabinetsIntro`, `visio`, `jours`, `semaine`, `jourSansCabinet`, `orientation`, `questions`, `contact`,
    `pageCabinets`, `navigation`, `pied`, `carteBrabant`.
  - `medias.ts` : `photos` (`debout`, `canape`, `carnet`, noir et blanc) et `ambiances.<x>` (trois 4:5 + `piece`
    16:9), chacun `{ src, largeur, hauteur, variantes, alt, format, sujet }` ; `srcset(media)` donne l'attribut
    `srcset`. Exemple :
    `<img src={m.src} srcset={srcset(m)} sizes="(min-width: 900px) 40vw, 100vw" width={m.largeur} height={m.hauteur} alt={m.alt} loading="lazy" />`.
    La photo du hero : `fetchpriority="high"` et pas de `loading="lazy"`.
  - `directions.ts` : `direction('<x>')`, `directions`, `cheminDans()`. `site.ts` : `site.nom`, `site.description`.
- **Composants** (`src/components/partage/`) : `Tete.astro`, `SelecteurDirection.astro` (la tête inclut
  `Statistiques.astro`, inerte sans identifiant Umami).
- **Styles** : `src/styles/socle.css` (`.visuellement-cache`, `html.defilement-arrete`) et les `@font-face` prêts à
  importer depuis le gabarit de la direction :
  - A : `src/styles/polices/literata.css` (« Literata », 200-900, romain et italique) et `albert-sans.css`
    (« Albert Sans », 100-900, romain et italique) ;
  - B : `libre-caslon-display.css` (« Libre Caslon Display », 400 seulement, pas d'italique) et `figtree.css`
    (« Figtree », 300-900, romain et italique) ;
  - C : `alice.css` (« Alice », 400 seulement, pas d'italique) et `karla.css` (« Karla », 200-800, romain et italique).
  Sous-ensembles latin + latin-ext, servis depuis `/fonts/<id>/`. Préchargement conseillé de la police du `<h1>` :
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/<id>/<id>-latin-…-normal.woff2" />`.
  ⚠️ Aucune des six polices n'a l'espace fine insécable (U+202F) : avant « : ; ? ! », utiliser l'espace insécable
  U+00A0 (présente partout).
- **Mouvement** (`src/lib/mouvement.ts`, côté navigateur) : `activerApparitions()` (classe `visible` sur
  `[data-apparait]`, le CSS de l'habillage ne cache rien sans `html.js`), `arreterDefilement()` /
  `reprendreDefilement()`, `pieger(conteneur, exclus)` (focus gardé dans le menu ouvert, renvoie la fonction qui le
  retire), `mouvementReduit()`, `REDUIT`, `sansSurvol()`. Pas de vidéo, pas de GSAP ni de Lenis.
- `html.js` est posé par `Tete.astro` avant le rendu.

## Contrôles et ports

- Serveur de travail : `npx astro dev --port <p> --ignore-lock` — A **4931**, B **4932**, C **4933**, présentoir
  **4934**. Jamais 4331 (port du site).
- Jamais deux builds en même temps dans le dossier : pour un build, demander à l'orchestrateur ou construire ailleurs
  (`npx astro build --outDir dist-<x>`, puis `DIST=dist-<x> node scripts/verifier.mjs --mode preview` ; supprimer
  `dist-<x>` ensuite).
- `npm run check`, `npm run build`, `node scripts/verifier.mjs --mode preview` : 0 erreur. Le contrôleur refuse
  notamment les guillemets « » “ ”, « Xénia Van » (casse exacte), « spécialis », « Le plus difficile », « bon moment »,
  « bonne raison », le nom de l'agence et des outils (`forge-checks.json`).
