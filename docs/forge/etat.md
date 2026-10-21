# État Forge — Xénia van Outryve

- Mise à jour : 2026-10-21
- Dossier client : `C:\Dev\Noveo\_autres\website\xenia` (dépôt PUBLIC `cltconcept/xenia-website`, branche `main`)
- Mode : refonte à direction ouverte → **trois directions construites** (accueil + page Cabinets) + présentoir
- Étape actuelle : **aperçu en ligne, mail prêt en brouillon** → attente du choix de la cliente (A, B ou C)
- Demande : « fais 3 DA différentes, change tout et repropose ce qu'elle veut suivant les remarques », puis
  « va jusque la mise en ligne, et prepare l'eml au client » (utilisateur, 2026-10-20)
- Spec : `docs/forge/brief-directions.md` ; contrat technique : `src/directions/CONTRAT.md`
- Sources : commit `fd3843b` sur `main` (seconde proposition) ; v1 sous l'étiquette `v1-eclaircie` (poussée)
- Aperçu : **https://xenia.noveo-digital.be** (serveur clients) ; xenia.chris-ia.com sert encore la v1 (aucun webhook)

## Choix visuels actifs (les trois, jusqu'au choix de la cliente)

| Direction | Contenu | Provenance |
|---|---|---|
| A « Le carnet » | papier, encre `#1D2A3F`, bleu poudré `#C9D8E6` ; Literata + Albert Sans ; « Xénia » écrit au stylo (Hershey) ; grille à marge ; module « Par où commencer ? » | Orchestrateur, d'après ses références (14/09) |
| B « Respirer » | lin `#F2F1EA`, sauge `#B9C4AF`, forêt `#22301F` ; Libre Caslon Display + Figtree ; arches, rameau d'olivier, voile sauge + verre dépoli ; module « Quel jour, quel cabinet ? » | idem + son brief du 27/07 (dégradé, transparence) |
| C « Le salon » | blanc chaud, rose blush `#EFD5CA`, ocre `#DAAD58`, terracotta ; Alice + Karla ; formes organiques, vagues, motif du tapis ; carte des cabinets | idem |
| Textes | `src/data/contenu.ts` : aucun guillemet, titres descriptifs, « van » minuscule | Remarque cliente 14/09 |
| Médias | 3 photos N&B (debout, canapé, carnet) + 12 ambiances (33 cr Higgsfield) | Utilisateur 2026-10-20 |

## Décisions et autorisations

| Décision | Provenance | Périmètre |
|---|---|---|
| Trois directions, accueil + Cabinets, ses photos + ambiances | Utilisateur, 2026-10-20 | Fait |
| Mise en ligne de l'aperçu + brouillon `.eml` | Utilisateur, `/goal` du 2026-10-20 | Fait le 2026-10-21 ; mail NON envoyé |
| Aperçu sur le serveur clients : projet `bhhz1q5p59ppef9fjhlcpyq0`, app `qic8nsliymjyzgfg9n4umkk8`, Umami `1f82e5d6-e54c-4d27-b63e-dde05fbb5094` | Règle Forge du 2026-09-28 | — |
| Pré-Prod URL de la carte Asana « XENIA VAN OUTRYVE » renseignée | Pratique Forge | Fait |

## Vérifications (version `fd3843b`)

| Contrôle | Méthode | Résultat |
|---|---|---|
| Types, build, contrôleur de sortie | `npm test` (2026-10-21 10:43) | 0 erreur, 8 pages, 0 avertissement |
| Rendu local (présentoir, 3 pages Cabinets, 1440 et 390) | Playwright sur `astro preview` | console vide, 0 débordement, 0 guillemet, 1 `<h1>` |
| Accueils A, B, C | captures et mesures des agents (`artifacts/<x>/`, gitignoré) | relues ; hero téléphone au-dessus du sélecteur à 390 × 844, 375 × 667, 360 × 640 |
| En ligne | curl + script `verifier-en-ligne-xenia.py --reset` | 7 pages + présentoir 200, 404 vraie, `cf-ray`, `noindex`, canonical domaine final, aucune mention interdite, Umami « JP » puis remis à zéro |
| Non vérifié | — | Safari, vrai téléphone |

## Informations client manquantes

- Son choix de direction ; ce qu'elle a dit de vive voix à Arnaud sur la typo et les couleurs.
- Domaine final (provisoire : xeniavanoutryve.be), tarifs, photos des trois cabinets, confirmation de la phrase sur
  les mutualités.

## Prochaine action

Envoi du mail par l'utilisateur (brouillon `C:\Users\debes\OneDrive - CLT CONCEPT SRL\Bureau\Mails DA 2026-10-05\XENIA
VAN OUTRYVE.eml`, après son appel). À la réponse : retirer les deux directions non retenues (méthode
`.claude/skills/forge/references/trois-directions.md`), décliner les pages, arrêter l'ancienne app maquettes.
