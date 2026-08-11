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
| Dépôt GitHub public + déploiement Coolify | 🚧 In Progress | — |
| Photos de la cliente (portrait « à venir ») | 📋 Planned | — |
| Nom de domaine final + bascule DNS + Search Console | 📋 Planned | — |
| Textes validés par la cliente | 📋 Planned | — |

## Journal des changements

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
- ⏸️ Déploiement : bloqué à `gh repo create cltconcept/xenia-website --public`
  (permission refusée en mode auto) — commande à lancer par l'utilisateur,
  la suite (Coolify API) est documentée ci-dessous.

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

## Déploiement (maquette)
- **Cible** : Coolify maquettes `http://46.224.83.139:8000` (⚠️ jamais
  l'instance Noveo `188.245.156.214`), serveur `zw8ck4ckcw08gg00g8wwkkso`,
  wildcard `*.chris-ia.com` → HTTPS auto. Jeton : `~/.claude.json` →
  `mcpServers.coolify.env.COOLIFY_ACCESS_TOKEN`.
- **Étape 1 (à débloquer)** : `gh repo create cltconcept/xenia-website --public --source . --remote origin --push`
- **Étape 2** : `POST /projects` (slug `xenia`) puis `POST /applications/public`
  (build pack `dockerfile`, port 80, domaine `https://xenia.chris-ia.com`,
  `instant_deploy: true`) — cf. skill `/deploy-maquette`.
- **Étape 3** : vérifier le site servi (codes HTTP des 9 pages, JSON-LD dans le
  HTML livré, console sans erreur, PDF accessible).
- **URL visée** : `https://xenia.chris-ia.com` + `/dossier-xenia-van-outryve.pdf`.
