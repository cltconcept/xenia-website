# Xénia Van Outryve — site vitrine
> Site de présentation d'une psychologue clinicienne (santé, périnatalité, nutrition) en Brabant wallon — design « L'éclaircie », Astro statique.

## Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Astro 5 (statique, 9 pages) |
| Animations | GSAP 3 + ScrollTrigger, Lenis — **imports différés uniquement** |
| Typographies | Fraunces Variable (display) + Hanken Grotesk Variable (body), Fontsource |
| Styles | CSS vanilla, tokens dans `src/styles/global.css` |
| Sitemap | @astrojs/sitemap |
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
├── docs/
│   ├── DESIGN.md           ← design system « L'éclaircie »
│   ├── dossier.html        ← source du dossier client
│   └── dossier-xenia-van-outryve.pdf
├── public/                 ← favicon, robots, llms.txt, og.png, copie du PDF
└── src/
    ├── data/site.ts        ← LA source des lieux, horaires, liens RDV, coordonnées
    ├── layouts/Base.astro  ← SEO, OG, JSON-LD MedicalBusiness
    ├── lib/motion.ts       ← socle GSAP différé (repris de dentalexpert)
    ├── components/         ← Header (menu déroulant), Footer, Wave, PageHero,
    │                          LieuxCards, Domaines, Closing, Logo
    └── pages/              ← index, approche, accompagnements/×3,
                               nutrition-sante, a-propos, lieux-contact, 404
```
- **Flux** : contenu figé au build → HTML statique ; GSAP/Lenis se chargent à l'idle
  (le site est complet sans JS).
- **Design** : aurore pastel (pêche/rose/lilas/eau) + aubergine `#43324B` +
  framboise `#C13D63` + sauge `#5E8E75` sur ivoire `#FDFBF8`. Signature : le
  **halo qui respire** (cycle 7 s, coupé si `prefers-reduced-motion`).
  Logo proposé : deux pétales translucides croisés (le X de Xénia).

## Variables d'environnement
Aucune. Site 100 % statique, aucun secret.

## Roadmap & Features

| Feature | Statut | Date |
|---------|--------|------|
| Design system « L'éclaircie » + logo | ✅ Done | 2026-08-11 |
| 8 pages + 404, contenus du mail cliente | ✅ Done | 2026-08-11 |
| SEO/GEO : JSON-LD, FAQPage, sitemap, llms.txt, OG | ✅ Done | 2026-08-11 |
| Dossier client PDF (5 planches) | ✅ Done | 2026-08-11 |
| Dockerfile + nginx (prêt à déployer) | ✅ Done | 2026-08-11 |
| Dépôt GitHub public + déploiement Coolify (HTTPS) | ✅ Done | 2026-08-11 |
| Photos de la cliente (portrait « à venir ») | 📋 Planned | — |
| Nom de domaine final + bascule DNS + Search Console | 📋 Planned | — |
| Textes validés par la cliente | 📋 Planned | — |

## Journal des changements

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
