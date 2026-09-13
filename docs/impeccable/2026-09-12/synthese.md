# Impeccable — critique + audit du site Xénia Van Outryve (2026-09-12)

Plugin `impeccable` 4.3.1 (pbakaus/impeccable), commandes `critique` et `audit`, sur le HEAD `97749fe` (identique à la maquette xenia.chris-ia.com), serveur local 127.0.0.1:4331. Trois agents isolés : A revue design (sans voir le détecteur), B détecteur déterministe + mesures au pixel, C audit technique. Navigateur : Chromium headless via Playwright Python (le `browse` de gstack n'est pas installé sur la machine). Rapports détaillés : `rapport-A-revue-design.md`, `rapport-B-detecteur.md`, `rapport-C-audit-technique.md`, captures dans `preuves/`. Instantané impeccable : `.impeccable/critique/2026-09-12T14-30-47Z__src.md`.

Deux limites de l'outil constatées : le détecteur d'impeccable **ne lit pas les fichiers `.astro`** (scan de `src` = vide ; on scanne `dist/` et les pages rendues à la place) et **le scan en URL de l'accueil desktop expire** trois fois sur trois (cause probable : le film de 7 Mo récupéré en Blob dès le chargement).

---

# 1. Critique (design)

Method: dual-agent (A: impeccable-A-design · B: impeccable-B-detector)

## Design Health Score

| # | Heuristique | Note | Constat clé |
|---|---|---|---|
| 1 | Visibilité de l'état du système | 3 | Page active, onglet sélectionné, « Faites défiler ». Six liens `target=_blank`, aucune mention « nouvel onglet ». |
| 2 | Adéquation au monde réel | 4 | Le visiteur parle avant le métier (« Je suis épuisé·e, je n'y arrive plus »). |
| 3 | Contrôle et liberté | 3 | Scène épinglée dès l'arrivée, carrousel auto 7 s, bandeau sans pause au doigt ; compensé par pause, Échap, reduced-motion. |
| 4 | Cohérence et standards | 3 | Quatre sémantiques pour une même pilule ; « Prendre rendez-vous » mène à une page, pas à l'annuaire. |
| 5 | Prévention des erreurs | 3 | Chaque carte nomme sa plateforme ; la réponse « Doctoranytime ou Rosa ? » est 1 000 px plus bas. |
| 6 | Reconnaissance plutôt que rappel | 3 | Horaires, plateforme, itinéraire sur chaque carte. |
| 7 | Flexibilité et efficacité | 3 | CTA collant desktop, `tel:` mobile, capsules vers des ancres. Pas de raccourci vers l'annuaire. |
| 8 | Esthétique et minimalisme | 3 | Jetons impeccables, mais trois listes des mêmes motifs et un accueil à 8 230 px (cible ≤ 6 800). |
| 9 | Reconnaître et réparer les erreurs | 2 | « Demander une visio » = `mailto:` sans adresse visible : sans client mail, rien ne se passe. |
| 10 | Aide et documentation | 3 | FAQ bien placée ; « Comment payer ? » sans montant, rien sur l'après-clic annuaire. |
| **Total** | | **29/40** | **Bon (72 %)** |

## Verdict de spécificité

**Revue (A).** Ancré dans ce produit : la traversée joue « L'éclaircie » avant tout argument ; le logo à deux pétales se cite partout (puces, pétales du hero, diagramme nutrition, pastille du footer) ; carte du Brabant wallon dessinée, médaillon aquarelle, phrases à la première personne. Trois retombées dans le générique : les trois feature cards d'Approche, la rangée de confiance sous le hero (`src/pages/index.astro:101-106`), le carrousel à onglets/flèches/pause. Occasion manquée majeure : la signature n'existe qu'en desktop ; sur mobile (`src/pages/index.astro:430-442`) le hero redevient un site de psy bien fait, ordinaire.

**Détecteur (B).** 191 constats bruts sur le HTML construit (10 pages), 93 en rendu desktop (4 pages), 122 en rendu mobile (5 pages), ramenés à **13 constats uniques** après vérification au pixel. Vrais positifs : pied de page (12 textes `--muted` par page à 4,03–4,48:1 sur le dégradé `Footer.astro:67`), hero mobile (paragraphe 3,2–4,5:1 ; eyebrow 3,1–3,8:1, **jamais signalée par le détecteur**, trouvée par mesure), placeholder « Portrait à venir » 3,7:1, longueur de ligne (`.copy` 93 caractères, visio 108), lilas du hero hors jeton (`rgba(203,181,238)`, `index.astro:60`). À la lettre de la règle mais choix documentés : 15 eyebrows/kickers, point respirant du footer, grain 0,04 (apport ≤ 4/255), bandeau défilant, Fraunces, tirets cadratins, bordure 1 px + ombre 60 px du menu déroulant. Faux positifs : `cramped-padding` (var/clamp non résolus), « pixel contrast » sur verre (non reproductible), cartes teintées (détecteur pessimiste d'un point), `all-caps-body` (libellés d'une ligne), icône pause, point de « Faites défiler ».

**Overlay.** Non présenté : navigateur headless seulement, pas d'onglet visible. Preuves = captures ciblées dans `preuves/`.

## Impression générale

Un site qui a une âme et une exécution soignée, dont les défauts sont concentrés là où l'on convertit : le mobile (pas de CTA dans l'en-tête, hero sans signature, textes secondaires sous le seuil sur les lavis), le clic (une capsule du bandeau ne navigue pas au premier tap) et la sortie vers l'annuaire (sans un mot). La plus grande opportunité : rendre l'action unique du site aussi soignée que son ouverture.

## Ce qui marche

- **La copy fait le travail thérapeutique** (`index.astro:16-25`, `perinatalite-parentalite.astro:10-35`) : les mots du patient, jamais ceux du DSM.
- **Un langage visuel qui se cite lui-même** : pétales → puces → hero → nutrition → footer, plus la carte dessinée (`CarteCabinets.astro`).
- **La couche d'animation dégrade proprement** : reduced-motion réel, site complet sans JS, garde-fou 3 s, onglets ARIA complets, GSAP jamais dans le bundle initial.

## Problèmes prioritaires

1. **[P1] Le premier tap ou clic sur une capsule du bandeau ne navigue pas.** `Bandeau.astro:38-41` : au focus du lien, `:focus-within` replie la piste (2 843 → 390 px), l'élément sous le doigt change et le `click` tombe sur le `ul`. Reproduit 4/4 en tactile et souris (agent C) et contre-vérifié (4/4, navigue dès que la règle est neutralisée). Correctif : `.bandeau:has(.chip:focus-visible)` à la place de `:focus-within`, ou simple pause de l'animation sans reflow. Commande : `harden`.
2. **[P1] L'action unique du site est la moins accessible.** `Header.astro:244` masque `.nav__cta` sous 960 px ; la pilule du hero mobile n'apparaît qu'à 1,45 s ; sur desktop, Tab 12 et 13 tombent sur « Prendre rendez-vous » et « Découvrir mon approche » à opacité 0 dans la scène épinglée. Correctif : pilule compacte « RDV » à côté du burger ou barre basse collante après le hero ; `autoAlpha` côté GSAP pour sortir les CTA invisibles de l'ordre de tabulation. Commandes : `layout`, `harden`.
3. **[P1] Le texte secondaire tombe sous 4,5:1 dès que le fond n'est pas l'ivoire.** `--muted #7A6B82` tient 4,78:1 sur ivoire, aucune marge : footer 4,03–4,33, lavis mobiles 4,04–4,28, FAQ sur verre 4,41, légende du portrait 3,50 ; eyebrow du hero mobile 3,1–3,8 (scrim transparent sur les 28 % du haut, `global.css:47`). Correctif : aligner `--muted` sur `--muted-hero #6E5F76` (5,7:1 ivoire, 4,9:1 footer) et `--framboise-deep` pour le petit texte framboise sur teinte ; scrim mobile plus haut. Commande : `colorize`.
4. **[P1] L'écran 0 desktop ne dit ni qui, ni quoi, ni où.** L'eyebrow « Psychologue clinicienne · Brabant wallon » (`index.astro:88`) ne monte qu'à 60 % de la scène (`:419`). Correctif : la poser dès la phrase 1, en petites capitales framboise, fondue avec elle. Commande : `clarify`.
5. **[P1] La sortie vers l'annuaire n'est ni annoncée ni rassurante.** `LieuxCards.astro:22` ouvre Doctoranytime ou Rosa dans un nouvel onglet sans glyphe ni mention ; la réassurance vit dans la FAQ. L'`aria-label` réécrit le texte visible (WCAG 2.5.3). Correctif : une ligne au-dessus des boutons (« Rendez-vous sur Doctoranytime ou Rosa, nouvel onglet, disponibilités en direct, sans prescription »), glyphe de lien externe, texte visible en tête du nom accessible. Commande : `harden`.

Autres, P2 : le `mailto:` « Demander une visio » sans adresse visible (`lieux-contact.astro:85`) ; trois listes des mêmes motifs à la suite (10 capsules, 8 phrases, 4 onglets) avec bandeau sans pause au doigt et carrousel qui avance seul (`distill`, `quieter`) ; page Lieux sans closing, elle finit sur un numéro de TVA.

## Drapeaux rouges par persona

- **Jordan (première visite)** : ne sait pas qu'il est chez une psychologue avant 600 px ; « Prendre rendez-vous » cache trois étapes (page → cabinet → plateforme) ; portrait placeholder juste après les phrases qui touchent.
- **Riley (testeur)** : six liens externes sans convention ; « Comment payer ? » sans montant, aucun tarif nulle part ; quatre sémantiques de pilule ; « Nutrition & Santé » atteignable par quatre entrées.
- **Casey (mobile distrait)** : pas de CTA dans l'en-tête ; accueil de 9 722 px avec vidéo en boucle ; capsules qui bougent sous le doigt et ne naviguent pas au premier tap ; menu à 9 entrées, téléphone tout en bas ; un tap immédiat sur le hero tombe sur un bouton à opacité 0.
- **Nour (jeune mère en post-partum, 3 h du matin, téléphone ; persona dérivée du contenu des pages)** : aucun créneau du soir dans `site.ts` ; la visio, seule option compatible avec un nourrisson, ne se réserve que par e-mail sans promesse de délai ; rien n'annonce le compte à créer sur l'annuaire.

## Observations mineures

- Grilles de trois cartes centrées identiques en bas de « À propos », « Lieux » et « Repères ».
- Le hero mobile n'a plus d'indice de défilement ; rien n'annonce le médaillon sous le pli.
- « 3 cabinets + visio » et « RDV en ligne » répètent la copy juste au-dessus.
- Texte secondaire entre 12,5 et 14,7 px (capsules, tags, adresses, footer).
- La chip « Nutrition & santé » emprunte la teinte eau alors que le volet a sa propre sauge (`global.css:221`).
- Le lilas du hero `rgba(203,181,238)` est plus saturé que le jeton `--lilac #DFD2F4` (seul déclencheur d'« ai-color-palette »).
- `.copy` à 36 em donne 93 caractères par ligne avec Hanken Grotesk ; 108 dans la carte visio (`lieux-contact.astro:182`).
- Deux animations survivent au reduced-motion : les pétales du hero (`index.astro:547-558`).

## Questions à se poser

1. Si la majorité des visites vient de téléphones, la traversée est-elle la signature du site ou celle de la démonstration au client ?
2. Deux cabinets sur trois passent par le même profil Doctoranytime : pourquoi « Prendre rendez-vous » n'ouvre-t-il pas directement l'annuaire, avec La Hulpe en exception nommée ?
3. Capsules, phrases, onglets : laquelle des trois listes le visiteur lit-il vraiment, et que perd-on à supprimer les deux autres ?

---

# 2. Audit (technique)

## Audit Health Score

| # | Dimension | Score | Constat clé |
|---|---|---|---|
| 1 | Accessibilité | 2 | Trois violations AA mesurées : `--muted` sous 4,5:1 (footer, lavis mobiles, verre), focus clavier sur des CTA à opacité 0, premier clic du bandeau perdu. Fondations solides par ailleurs. |
| 2 | Performance | 2 | Film du hero de 7 Mo récupéré en Blob 294 ms après la navigation sur tout écran ≥ 1 024 px, sans test réseau ; 22 `will-change` au repos dont 6 lavis mobiles inertes. Le reste est propre. |
| 3 | Responsive | 3 | Aucun débordement à 390/768/1440, hero non épinglé sur mobile, zoom texte 200 % tenu à 1440. Burger 38 px, Pause 32 px, capsules 41 px ; nav coupée à 1024 px avec zoom 200 %. |
| 4 | Theming | 3 | Jetons respectés pour encres, accents, rayons, typo. 35 `rgba()` retapés et 4 teintes d'aurore hors jetons, `#F1E9E4` du footer. Pas de mode sombre (non prévu, non pénalisé). |
| 5 | Intégrité d'implémentation | 3 | Système cohérent et propre au produit ; sur 191 constats bruts, 13 uniques vérifiés, la plupart = choix documentés dans DESIGN.md ; dérive isolée (lilas du hero hors jeton, alphas recomposés à la main). |
| **Total** | | **13/20** | **Acceptable (travail significatif)** |

## Verdict d'intégrité d'implémentation

**Passe.** L'implémentation exprime un système propre à ce produit : jetons `--tint-*`, `--scrim-hero`, `--radius-organique`, composants d'ambiance (Blob, pétales, carte dessinée), signature scrubée, reduced-motion réel. Le détecteur ne trouve aucun motif « SaaS générique » hors le menu déroulant (bordure 1 px + ombre 60 px, advisory) ; ses vrais positifs sont des calibrations (contrastes, longueur de ligne), pas une dérive de système.

## Résumé

- Score : **13/20** (Acceptable) ; critique design **29/40** (Bon).
- Constats : **0 P0 · 8 P1 · 8 P2 · 6 P3**.
- Les cinq critiques : clic du bandeau perdu ; contraste du texte secondaire (`--muted`, framboise petite sur teinte, eyebrow mobile) ; CTA invisible (en-tête mobile, ordre de tabulation desktop) ; film de 7 Mo d'office sur desktop ; `will-change` inertes sur mobile.
- Prochaines étapes : `harden` → `colorize` → `optimize` → `clarify`/`layout` → `quieter`/`distill` → `adapt` → `polish`.

## Constats par sévérité

**P1, majeurs**

1. **Premier clic ou tap perdu sur le bandeau** · `Bandeau.astro:38-41` · A11y/tactile · la navigation par thèmes échoue au premier essai (Chromium, Edge, Firefox) · WCAG 2.1.1, 2.5.2 par effet · `:has(.chip:focus-visible)` ou pause sans reflow · `harden`.
2. **`--muted` sous 4,5:1 hors ivoire pur** · `global.css:13`, `Footer.astro:67`, `Blob.astro:75-81`, `lieux-contact.astro:195` · A11y · tout le texte secondaire 13–17 px du footer, des lavis mobiles et du verre (25 mesures en échec ou limite sur 111) · WCAG 1.4.3 · aligner sur `--muted-hero #6E5F76` ou `--muted-strong` · `colorize`.
3. **Framboise en petit texte sur teinte** · `Etapes.astro:73-74` (4,37), `index.astro:655-658` + `global.css:47` (eyebrow hero mobile 3,44–3,80), `index.astro:718-724` (citation mobile 4,02) · A11y · WCAG 1.4.3 · `--framboise-deep #A83355` sous 24 px sur teinte, scrim mobile plus haut · `colorize`.
4. **CTA invisibles** · `Header.astro:244` (nav CTA masqué < 960), `index.astro:423, :653` (CTA du hero à opacité 0 dans l'ordre de tabulation) · A11y/conversion · WCAG 2.4.7, 2.4.3 · pilule « RDV » mobile ou barre basse ; `autoAlpha` ; fin de scène au focus · `layout`, `harden`.
5. **Film du hero : 7 095 962 octets récupérés d'office** · `index.astro:333-353` · Perf · 4,5 × tout le reste de la page, sans `saveData`/`effectiveType` (testés seulement sur mobile `:358`), servi aussi aux tablettes en paysage · fetch au premier scroll, test réseau, master 720p plus léger ou séquence WebP · `optimize`.
6. **`will-change` au repos** · `Blob.astro:61` (6 lavis mobiles inertes ≈ 57 Mo de textures à DPR 2), `global.css:261, 273, 358` (7 `.swi` après l'intro) · Perf · `will-change` sous `(min-width: 961px)` seulement, `clearProps: 'willChange'` · `optimize`.
7. **Écran 0 desktop sans identité** · `index.astro:88, :419` · UX (critique) · `clarify`.
8. **Sortie vers l'annuaire non annoncée, `aria-label` qui réécrit le texte visible** · `LieuxCards.astro:21-22` · A11y/UX · WCAG 2.5.3 · `harden`.

**P2, mineurs**

9. Pétales du hero animés malgré reduced-motion (`index.astro:547-558`) · `quieter`.
10. Menu déroulant « Accompagnements » non refermable par Échap, sans `aria-controls` (`Header.astro:78, :162-167, :17`) · WCAG 1.4.13 · `harden`.
11. Verre dépoli (3 `backdrop-filter`) dans un élément qui respire en continu (`index.astro:758, :766-767`) ; 8 à 10 `backdrop-filter` par page · `optimize`.
12. Vingt animations infinies permanentes, y compris hors viewport (blobs, halos, pétales, bandeau, rencontre) · pause hors viewport par IntersectionObserver · `quieter`.
13. Cibles tactiles sous 44 px à 390 : burger 38×38, Pause 76×32, capsules 41 px, `link-arrow` 25 px, pilules `--sm` 39 px, liens du footer 23 px espacés de 8 px · 2.5.8 AA tenu par exception, 44 px non · `adapt`.
14. Nav desktop coupée à 1024 px avec zoom texte 200 % (`Header.astro:243` : bascule burger à 960 seulement) · WCAG 1.4.4 · `adapt`.
15. `mailto:` « Demander une visio » sans adresse visible (`lieux-contact.astro:85`) · `harden`.
16. Trois listes des mêmes motifs, bandeau sans pause au doigt, carrousel auto 7 s · `distill`, `quieter`.

**P3, finition**

17. Couleurs hors jetons : 4 teintes d'aurore (`index.astro:59-63`), stops SVG en attribut (`:90`), `#F1E9E4` (`Footer.astro:67`), `#3C5F4E` (`global.css:160`), 11 `#fff`, 35 `rgba()` dans 9 fichiers · `colorize`.
18. Breakpoint 700 px hors canon (`mentions-legales.astro:108`) · `adapt`.
19. `lenis` déclaré mais jamais importé ; `Manuscrit.astro` monté nulle part · `distill`.
20. `sizes` du médaillon (`index.astro:115`, 1600w jamais choisi) ; illustrations de PageHero sans `srcset` · `optimize`.
21. `aria-label` sur des `div` sans rôle (`Footer.astro:36, 46`), cabinets sans titre de niveau (`LieuxCards.astro:15`) · `harden`.
22. « Portrait à venir » à 3,7:1 (provisoire, disparaît avec la photo cliente) · `polish`.

## Patterns systémiques

- **Un jeton calibré pour un seul fond** : `--muted` et `--framboise` tiennent 4,5:1 sur ivoire pur et tombent sur chaque carte teintée, verre, lavis ou footer.
- **Le mobile hérite d'optimisations pensées desktop** : lavis avec `will-change`, états pré-paint du hero, test `saveData` sur une seule branche.
- **Des états d'entrée larges servent d'interrupteurs de mise en page** : `:focus-within` et `:hover` déclenchent des reflows ; cause directe du bug du bandeau et du déroulant non refermable.
- **Alphas des jetons recomposés à la main** dans neuf fichiers.
- **Décoration jamais mise en pause**, même hors viewport.

## Points positifs

- Carrousel en patron ARIA tabs complet (rôles, `aria-selected`, flèches clavier vérifiées, pause `aria-pressed`, auto suspendu au survol/focus/hors viewport).
- Reduced-motion réellement pensé : hero complet et statique, zéro octet de GSAP ni de film, bandeau replié, transitions coupées.
- GSAP et ScrollTrigger hors du bundle initial (6 modules ≈ 9 Ko ; 115 Ko de GSAP par `import()`), console vide.
- Aucune animation de propriété de layout ; scrub du film en rAF avec seuil 1/30 s.
- Polices : 3 woff2 grâce aux `unicode-range`, 2 préchargées, `font-display: swap`.
- Médias : poster préchargé, `<video preload="none" muted playsinline>`, mobile 160 Ko respectant `saveData`, `loading="lazy"` avec dimensions, médaillon en `srcset` + `fetchpriority`.
- Structure : skip-link, `lang`, landmarks nommés, aucune image informative sans `alt`, aucun contrôle sans nom, anneau de focus 2,5 px framboise, H1 conservé par `aria-label` malgré le split, DOM léger (503 nœuds).

## Actions recommandées

1. **[P1] `/impeccable harden`** : bandeau (`:has(:focus-visible)`), CTA du hero hors tabulation + fin de scène au focus, liens externes (nom accessible + annonce), Échap et `aria-controls` du déroulant, `mailto:` visio avec adresse visible, sémantique mineure.
2. **[P1] `/impeccable colorize`** : `--muted` → `--muted-hero` ou `--muted-strong` ; `--framboise-deep` sur teinte ; scrim mobile du hero ; tokeniser aurore et `rgba()`.
3. **[P1] `/impeccable optimize`** : film différé au premier scroll + test réseau + master plus léger ; `will-change` conditionné ; verre des cartes FAQ et pétales ; `sizes`/`srcset`.
4. **[P1] `/impeccable clarify`** : identité dès l'écran 0 de la traversée.
5. **[P1] `/impeccable layout`** : CTA « RDV » dans l'en-tête mobile ou barre basse.
6. **[P2] `/impeccable distill` puis `quieter`** : une liste de motifs au lieu de trois, carrousel sans auto-avance, pétales en reduced-motion, pause hors viewport.
7. **[P2] `/impeccable adapt`** : cibles 44 px, bascule burger sous 1100 px, breakpoint 700.
8. **`/impeccable polish`** en dernière passe.

## Non vérifié

Appareil physique et Safari (le bug du bandeau y est probablement absent sur desktop, à confirmer sur iOS) ; fréquence d'images et mémoire GPU réelles (ordres de grandeur calculés, pas profilés) ; timings derrière nginx (mesures sur Vite) ; lecteur d'écran à l'oreille.

---

# 3. Corrections du 12/09 après-midi (8 P1, en local, non committées)

Décisions utilisateur : les 8 P1 seulement ; garder les trois listes de motifs ; pilule « RDV » dans l'en-tête mobile ; `--muted` aligné sur `--muted-hero` ; film différé sans réencodage. Deux implémenteurs isolés (index.astro / composants + jetons), diff relu, build OK, vérifications sur `pnpm preview`.

| P1 | Correctif | Preuve après correction |
|---|---|---|
| Bandeau : premier tap perdu | `Bandeau.astro` : repli clavier en `:has(.chip:focus-visible)`, pause sans reflow à tout focus | tap mobile et clic desktop sur « Burn-out » → navigation 2/2 ; `:has()` conservé dans le CSS construit |
| CTA invisible | `Header.astro` : pilule « RDV » 58×44 px (nom accessible « Prendre rendez-vous »), burger 44×44 ; `index.astro` : `.hero .actions` en `autoAlpha` + `visibility: hidden` pré-paint, scène terminée au `focusin` | capsule 314 px, bord droit 352/390 et 337/360, aucun débordement ; tabulation desktop : nav CTA → capsules, les CTA du hero à opacité 0 ne prennent plus le focus |
| Contrastes `--muted` | `global.css` : `--muted: #6E5F76` ; scrim mobile `0,62 → 0,9 à 46 %` | pixel : footer 4,92–5,25 (avant 4,03–4,33), lavis mobiles 4,88–5,41 (avant 4,04–4,28), FAQ verre 5,25, hero mobile copy 5,35 |
| Framboise petit texte | `.overline`, `.footer__head`, `.etapes__num`, `.amene__tag`, `.qui__citation`, `.hero__eyebrow` → `--framboise-deep` | pixel : eyebrow mobile 5,52 (avant 3,1–3,8), numéro d'étape 5,50 (4,37), citation mobile 5,05 (4,02), têtes footer 5,63 (4,50), tags 6,04 |
| Écran 0 sans identité | `index.astro` : `<span class="hero__phase-id">Psychologue clinicienne · Brabant wallon</span>` dans la phrase 1 | capture `verif-hero-desktop-0` : ligne visible sous « un peu trop. » |
| Sortie annuaire | `LieuxCards.astro` : texte visible en tête du nom, « , {ville}, nouvel onglet » en `.sr-only`, glyphe ↗ ; `lieux-contact.astro` : note de réassurance (mot pour mot la FAQ) | captures `verif-lieux-rdv(-mobile)` ; note à 5,71:1 |
| Film 7 Mo d'office | `index.astro` : fetch desktop armé sur `wheel`/`touchstart`/`keydown`/`scroll` (once), sortie si `saveData` ou 2g/3g | réseau : `hero-film.mp4` absent avant le scroll, présent après une molette |
| `will-change` inertes | `Blob.astro` : `will-change` sous `(min-width: 961px)` seulement ; `index.astro` : `willChange: auto` sur les `.swi` à la fin de l'intro mobile | — |

Détecteur après correction (site construit) : `dist` **191 → 67** constats ; accueil desktop enfin scannable (20 constats, dont 4 « low-contrast » = estimations analytiques du détecteur sur cartes teintées, mesurées 6,0–6,4 au pixel) ; accueil mobile 122 → 22 ; lieux-contact 1280 : 12. Les deux `low-contrast` restants de `dist` sont la légende « Portrait à venir » (4,3 estimé, 4,53 mesuré, placeholder provisoire). Constats nouveaux mais préexistants : `pulsing-dot` sur l'indice « Faites défiler » (faux positif, indice de défilement) et `tight-leading` 1,16 sur le titre display de la traversée.

Console vide sur les 4 pages capturées. Non vérifié : appareil physique et Safari ; lecteur d'écran à l'oreille.

Reste (P2/P3, non corrigés) : `mailto:` visio sans adresse visible, pétales en reduced-motion, déroulant non refermable par Échap, verre dans l'élément qui respire, animations infinies sans pause hors viewport, cibles tactiles < 44 px (capsules 41, Pause 32, liens du footer), nav coupée à 1024 px avec zoom texte 200 %, couleurs hors jetons, `lenis`/`Manuscrit.astro` morts, breakpoint 700 px, `sizes` du médaillon.
