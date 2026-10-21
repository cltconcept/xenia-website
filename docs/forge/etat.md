# État Forge — Xénia van Outryve

- Mise à jour : 2026-10-20
- Dossier client : `C:\Dev\Noveo\_autres\website\xenia` (dépôt PUBLIC `cltconcept/xenia-website`, branche `main`)
- Mode : refonte à direction ouverte → **trois directions construites** (accueil + page Cabinets) + présentoir
- Étape actuelle : socle (lot 1) en cours
- Demande en cours : « fais 3 DA différentes, change tout et repropose ce qu'elle veut suivant les remarques »
  (utilisateur, 2026-10-20), sur les retours de la cliente des 8 et 14/09 (`remarques/`, ignoré par git)
- Spec : `docs/forge/brief-directions.md` (brief commun = spec de cette proposition)
- État Git initial : `main` propre à `71889f1` (v1 « L'éclaircie », en ligne sur xenia.chris-ia.com) ; étiquette
  locale `v1-eclaircie` posée le 2026-10-20 (non poussée) ; `.gitignore` + `remarques/` modifié (non committé)
- Sources courantes : travail local non committé ; rien de poussé ni de redéployé

## Choix visuels actifs

| Axe | Choix | Provenance |
|---|---|---|
| Directions | A « Le carnet » (papier, encre, bleu poudré ; Literata + Albert Sans + prénom au stylo Hershey) · B « Respirer » (lin, sauge, arches, voile sauge + verre ; Libre Caslon Display + Figtree) · C « Le salon » (blanc chaud, rose blush, ocre, vagues, motif du tapis berbère ; Alice + Karla) | Orchestrateur, d'après les références de la cliente (14/09) ; à juger par l'utilisateur sur le site |
| Textes | `src/data/contenu.ts` : aucun guillemet, titres descriptifs, sa voix du 27/07, « van » en minuscule | Remarque cliente 14/09 + signature de ses e-mails |
| Médias | Ses 3 photos N&B (debout, canapé, carnet ; la 4e, salon avec cadres « as », écartée) + 12 ambiances générées (gpt_image_2_5 high 2k, 33 cr, solde 1 016 → ≈ 983) ; sources `brief/v2-staging/` | Utilisateur 2026-10-20 (« Photos + ambiances ») |
| Mouvement | Sobre : entrée du hero + signature + apparitions douces ; ni GSAP, ni vidéo, ni épinglage | Brief (public d'un psychologue, mémoire `forge-sobre-public-age`) |

## Décisions et autorisations

| Décision | Provenance | Périmètre |
|---|---|---|
| Trois directions, tout change | Utilisateur, 2026-10-20 | Local ; publication à demander |
| Accueil + page Cabinets par direction ; déclinaison des autres pages après le choix de la cliente | Utilisateur, 2026-10-20 | |
| Ses photos + ~12 ambiances Higgsfield (≈ 35-40 cr) | Utilisateur, 2026-10-20 | Faites : 33 cr |
| Refonte en place dans `xenia/`, v1 conservée par l'étiquette `v1-eclaircie` | Orchestrateur (patron georges-et-fils v2) | |
| Aller jusqu'à la mise en ligne + préparer l'`.eml` au client | Utilisateur, `/goal` du 2026-10-20 | Aperçu `noindex` ; mail en brouillon, jamais envoyé |
| Aperçu sur le serveur clients `https://xenia.noveo-digital.be` (règle Forge du 2026-09-28) ; projet Coolify `bhhz1q5p59ppef9fjhlcpyq0`, app `qic8nsliymjyzgfg9n4umkk8` (dépôt `cltconcept/xenia-website`, `main`, Dockerfile, `VERIFICATION=preview`) ; Umami `1f82e5d6-e54c-4d27-b63e-dde05fbb5094` | Orchestrateur, 2026-10-20 | ⚠️ l'ancienne app maquettes `seetu6uqg4tnkjg8do4f1f8n` (xenia.chris-ia.com) a l'auto-déploiement actif : un push sur `main` la met aussi à jour |

## Travail en cours

| Lot | Responsable | Fichiers | Dépendances | État |
|---|---|---|---|---|
| 1. Socle (mécanique MDC, données, routes, contrôleur) | agent `forge-developpement` | tout `xenia/` sauf docs, brief, remarques, PROJET | brief, contenu, médias | en cours |
| 2. Habillages A, B, C (accueil + cabinets + chrome) | 3 agents en parallèle, ports 4931-4933 | `src/directions/<x>/`, `public/<x>/` | socle | à lancer |
| 3. Présentoir | 1 agent, port 4934 | `src/pages/index.astro`, `src/components/partage/presentoir/` | habillages | à lancer |
| 4. Relecture, captures, contrôles | orchestrateur + `forge-qa` | — | 2, 3 | à faire |

## Informations client manquantes

- Ce qu'elle a dit de vive voix à Arnaud sur la typo et les couleurs (non transcrit).
- Domaine final (provisoire : xeniavanoutryve.be), tarifs, photos des trois cabinets, accord pour la mention des
  mutualités (reprise de la v1).

## Prochaine action

Attendre le rapport du socle, vérifier le build, puis lancer les trois habillages avec le brief commun.
