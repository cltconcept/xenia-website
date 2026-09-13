# Assessment B — détecteur impeccable + preuves navigateur

Site : **Xénia Van Outryve** (`C:\Dev\Noveo\_autres\website\xenia`, Astro 5 statique). Maquette scannée : `https://xenia.chris-ia.com` (identique au HEAD). Date : 2026-09-12.

Périmètre respecté : lecture seule absolue sur le projet (aucun fichier touché, pas de git, pas de build, aucun serveur démarré ni arrêté), ni `live-inject`, ni `live-server`, ni outils `mcp__claude-in-chrome__*`. Aucun jugement esthétique : uniquement les faits du détecteur, vérifiés en contexte.

---

## 1. Méthode

Détecteur : `impeccable` 4.3.1 (plugin ; `scripts/VERSION` = 0.1.5 pour l'engine), lancé depuis le dossier du projet pour qu'il charge `docs/DESIGN.md`.

```
SK=~/.claude/plugins/cache/impeccable/impeccable/4.3.1/skills/impeccable
cd /c/Dev/Noveo/_autres/website/xenia
```

| # | Étape | Commande exacte | Résultat |
|---|---|---|---|
| 1 | Sources | `"$SK/scripts/impeccable" detect --json src` | `[]`, exit 0 |
| 1b | Sources, chemins explicites | `detect --json src/pages src/components src/layouts` | `[]`, exit 0 |
| 1c | Sources sans config | `detect --json --no-config src` | `[]`, exit 0 |
| 1d | CSS seule | `detect --json src/styles/global.css` | `[]`, exit 0 |
| 1e | **Contrôle de l'étape 1** | `Header.astro` copié dans le scratchpad et scanné sous trois extensions | `Header.astro` → `[]` · `Header.tsx` → `[]` · **`Header.html` (contenu identique) → 1 constat** (`gpt-thin-border-wide-shadow`). **Le détecteur ne lit pas les fichiers `.astro`** : le « zéro constat » de l'étape 1 n'est pas une preuve de propreté, c'est une non-lecture |
| 2 | Sources effectives | `detect --json dist` (HTML construit + CSS liée, mode statique) | exit 2, **191 constats** sur 10 pages HTML + 2 fichiers CSS |
| 2b | CSS construite seule | `detect --json dist/_astro/index.B2B7Ujat.css` | exit 2, 1 constat (`border-accent-on-rounded`) — confirme que le mode regex CSS fonctionne et que `global.css` seule n'a rien de détectable |
| 3 | Rendu desktop | `timeout 120 detect --json --viewport 1280x800 https://xenia.chris-ia.com<page>` pour `/`, `/approche/`, `/a-propos/`, `/lieux-contact/`, `/accompagnements/perinatalite-parentalite/` | 4 pages OK (exit 2, 5–7 s chacune) ; **`/` échoue** |
| 4 | Rendu mobile | idem `--viewport 390x844` ×5 | 5 pages OK (exit 2, 4–6 s chacune) |
| 4b | Accueil desktop, 3 tentatives | live ×2 (`https://xenia.chris-ia.com/`), local ×1 (`http://127.0.0.1:4331/`) | **`Error: Navigation timeout of 30000 ms exceeded`** à chaque fois, `[]`, exit 1 |
| 5 | Mesures de remplacement | scripts Playwright maison dans `B/` : `mesure.py` (contraste réel au pixel), `grain.py` (apport du grain), `hier.py` (tailles calculées), `ligne.js` via `pw.py eval` (caractères par ligne) | sur le site en ligne, 1280×800, 1440×900, 390×844 (émulation iPhone, DPR 2) |
| 6 | Tests synthétiques | 5 pages HTML minimales dans `B/synth/`, scannées en `file://` à 390×844 ; 3 pages pour la résolution des fonds | isolent le déclencheur de `ai-color-palette` ; vérifient que `var()` et `#hex` de fond sont résolus (aucun constat sur `bg-hex`, `bg-var` ; `buried-raster` reproduit sur `bg-grain`) |

**Contraste réel au pixel (méthode).** Élément repéré par un extrait de son texte (et un sélecteur de proximité si besoin), `scrollIntoView` instantané, attente 1,8 s (les reveals GSAP durent 0,8 s), capture du rectangle de l'élément, puis couleur du texte forcée transparente **dans le navigateur headless seulement** (rien n'est écrit sur disque côté projet), seconde capture ; ratio WCAG entre la couleur calculée du texte et chaque pixel de fond situé sous un glyphe (pixels dont la différence entre les deux captures dépasse 60). Je rapporte **min / p10 / médiane** et le fond médian. Seuil : 4,5:1, ou 3:1 si texte large (≥ 24 px, ou ≥ 18,66 px en graisse ≥ 700).

**Cause probable de l'échec de l'accueil desktop (non prouvée).** Le hero desktop charge le film `public/media/hero-film.mp4` (7,1 Mo) et passe son `preload` à `auto` (`src/pages/index.astro:360-361`) ; la version mobile (`hero-film-mobile.mp4`, 163 Ko) se scanne en 4 s. Le détecteur attend vraisemblablement un état « réseau au repos » que le flux vidéo n'atteint pas en 30 s. Le timeout est identique en local, donc ce n'est pas la maquette.

---

## 2. Tableau récapitulatif

Occurrences notées `dist / 1280 / 390` (statique 10 pages / rendu desktop 4 pages / rendu mobile 5 pages).

| Règle | Sévérité | Advisory | Occurrences | Où (fichiers / pages / viewport) | Verdict | Preuve |
|---|---|---|---|---|---|---|
| low-contrast — **pied de page** (`#7a6b82` 4,1:1 et `#c13d63` 4,3:1 sur `#f1e9e4`) | warning | non | 120 / 48 / 60 | `src/components/Footer.astro:67` (`linear-gradient(180deg, var(--ivory-soft), #F1E9E4)`) ; 9 textes `--muted` (13,1–14,7 px) + 3 `.footer__head` (12,5 px, 700) par page, toutes pages, les deux viewports | **VP** | mesuré 4,03–4,28:1 (muted), 4,40–4,48:1 (têtes) — `preuve-2-footer-1280.png` |
| low-contrast — **« Portrait à venir »** (`#7a6b82` sur `#e4d8f5` 3,6:1 et sur `#f7f2ec` 4,4:1) | warning | non | 2 / 1 / 1 | `src/components/Portrait.astro:33-46` (placeholder sans `src`), accueil + À propos | **VP** (provisoire : disparaît quand la photo cliente arrive) | mesuré 3,68–3,81:1 — `preuve-4-portrait-placeholder-1280.png` |
| low-contrast — **hero mobile** (« Stress, épuisement… » 3,6:1 ; `strong` « sécurisant et sans jugement » 1,8:1) | warning | non | – / – / 2 | `src/pages/index.astro:88-96` ; scrim mobile `src/styles/global.css:47` (transparent sur les 28 % du haut) | **VP pour le paragraphe, FP pour le `strong`** ; **l'eyebrow, non signalée, échoue aussi** | copy 3,2–4,2:1 selon l'image du film, 4,24–4,52 en reduced-motion ; strong 7,0–9,0:1 ; eyebrow (14,1 px, 650) **3,1–3,8:1** — `preuve-1-hero-mobile-390.png` |
| low-contrast — « browser contrast 3,3–3,9:1 via analytic-gradient+alpha » sur cartes teintées (piliers d'approche ×3, repères d'À propos ×3, adresses ×3 + « La Hulpe », items périnatalité ×6, tags de l'accueil mobile ×4) | warning | non | – / 16 / 22 | `.card--rose/lilac/aqua` (`global.css:192-195`) ; `approche.astro:31-53`, `a-propos.astro:65-75`, `LieuxCards.astro:17`, `index.astro:702-706` | **FP** (piliers, items, strong, La Hulpe, tags Burn-out/Stress) / **discutable** (repères, adresses, tags Périnatalité/Parentalité mobile : p10 entre 4,40 et 4,49) | mesuré 4,33–4,84:1 là où le détecteur estimait 3,3–3,9 ; « La Hulpe » réel min 10,46 (détecteur : 2,3) |
| low-contrast — « pixel contrast 1,1–1,2:1, médiane 2,1–4,6 on backdrop filter » (cartes verre : h2/em/p d'approche, h2/p visio et dt FAQ de lieux-contact) | warning | non | – / 6 / 6 | `.card--glass` (`global.css:183-189`) ; `approche.astro:68-71`, `lieux-contact.astro:77-79,104-105` | **FP** — non reproductible | 5 mesures à 0, 0, 400 et 1 800 ms après scroll : min 4,16–4,34, médiane 4,62–4,75 (p) ; h2 10,3–11,3 ; em 4,48–4,58 (texte large, seuil 3) — `preuve-5-carte-verre-approche-1280.png` |
| low-contrast — `#c13d63` sur `#fbe9ee` 4,4:1 et sur `#fee8db` 4,3:1 (libellés framboise sur cartes rose/pêche) | warning | non | 6 / – / 1 | `.amene__tag` (`index.astro:702-706`), liens `pourqui` (`approche.astro:95-103`) | **FP** — estimation au point le plus foncé du dégradé de carte ; les libellés sont sur la partie blanche | mesuré 4,71–5,0 desktop, 4,55–4,76 mobile |
| hero-eyebrow-chip | warning | non | 9 / 4 / 0 | `.overline` de `PageHero.astro:23` (`global.css:122-128` : 13,1 px, 700, capitales, 0,14 em) ; `.hero__eyebrow` (`index.astro:88`, `:655-659` : 14,1 px, 650, capitales, 0,1 em) | **VP (lettre de la règle)** — composant du design system, sur les 9 pages + 404 | `preuve-3-eyebrow-perinatalite-1280.png`, `home-1440-rm.png` |
| kicker-above-heading | warning | non | 0 / 4 / 13 | mêmes `.overline` devant les h2 de section (accueil ×6, approche ×2, a-propos ×1, lieux ×1) + les h1 d'approche/a-propos/lieux reclassés ici à 390 | **VP (lettre)** — même élément que la ligne précédente, règle rendu seul | idem |
| all-caps-body (« uppercase on 58/44/39/35 chars of body text ») | warning | non | 4 / 1 / 2 | `hero__eyebrow` 58 car. (accueil) ; `overline` 44 (périnatalité), 39 (adolescents), 35 (enfants) | **FP** — ce sont les libellés ci-dessus, une ligne, pas un paragraphe | comptage exact : « Psychologue clinicienne · Santé · Périnatalité · Nutrition » = 58 ; « Accompagnements · Périnatalité & Parentalité » = 44 |
| pulsing-dot — `.footer__breathe-dot` | warning | non | 10 / 4 / 5 | `Footer.astro:90-94` (10 px, `halo-breathe` 7 s, `aria-hidden`, coupé en reduced-motion `:123-125`) | **VP (lettre)** — écho voulu du halo (DESIGN.md « décliné en pastille dans le footer ») | `preuve-2-footer-1280.png` |
| pulsing-dot — `.hero__indice-point` | warning | non | 1 / – / – | `index.astro:629-641` (4×8 px, 1,6 s, indice « Faites défiler » de la scène épinglée, desktop seulement, effacé au premier scroll `:407`, coupé en reduced-motion) | **FP** — indice de défilement, pas un point de statut | `home-1440-s0.png` |
| buried-raster (« raster background at opacity 0.04 ») | warning | non | 10 / 4 / 5 | `.grain` `global.css:293-300` (div fixe, bruit SVG en data-URI, opacité 0,04) | **VP (mesuré)** — apport ≤ 4 niveaux sur 255 | diff moyenne 0,93/255, max 4, 0,07 % des pixels changent de ≥ 3 niveaux, aucun de ≥ 6 — `preuve-6-grain-zoom-avec.png` / `-sans.png` |
| gpt-thin-border-wide-shadow (« 1px border + 60px shadow blur ») | advisory | oui | 10 / 4 / 5 | `.nav__drop-menu` `Header.astro:157-158` (`border: 1px solid var(--glass-border)` + `box-shadow: 0 24px 60px …`), menu « Accompagnements » caché jusqu'au survol/clic | **VP (lettre)** | code |
| em-dash-overuse | advisory | oui | 6 / – / 1 | accueil 18 (13 en rendu mobile), mentions 9, a-propos / approche / lieux / nutrition 8 | **VP (lettre)** — comptage recalculé identique ; le tiret cadratin est usuel en typographie française | script de comptage sur `dist` (densité 1/318 à 1/417 car.) |
| cramped-padding | warning | non | 8 / 0 / 0 | `.card` de a-propos ×2, lieux-contact ×2, approche ×1, enfants-famille ×1 ; `.portrait__cadre` ×2 | **FP** — chaque carte porte un padding en `var()` / `clamp()` que l'analyse statique ne résout pas ; **absent des 9 scans rendus** ; `portrait__cadre` est un cadre média avec placeholder centré | `a-propos.astro:103`, `approche.astro:119,133`, `lieux-contact.astro:177,190,203`, `enfants-famille.astro:93`, `LieuxCards.astro:38`, `Portrait.astro:40` |
| border-accent-on-rounded (`border-top/bottom: 6px solid`) | warning | non | 2 / – / – | `Carrousel.astro:209-212` : triangle CSS « lecture » du bouton pause, bordures **transparentes** | **FP** | code |
| overused-font (« font-family: Fraunces ») | warning | non | 1 / – / – | `@font-face { font-family: Fraunces Variable }` (fontsource, importé par `Base.astro:2-3`) | **VP (lettre)** — police display choisie et documentée (DESIGN.md « Typographies ») | code |
| flat-type-hierarchy (« body 15.2, h3 17.9, h2 20 ») | warning | non | 1 (adolescents-adultes) / – / – | h2 modal 20 px (×5 titres de cartes), h3 17,9 px (`.tdah__list h3`, `adolescents-adultes.astro:109-111`) | **FP / discutable** — tailles réelles : h1 65,6 px, h2 48 px ×2 et 20 px ×5, h3 17,9 ×3, p 12,5–19,2 ; le détecteur a pris la taille modale de h2 | `hier.py` |
| marquee | warning | non | 1 / – / 1 | `Bandeau.astro:30-34` (`bandeau-defile` 60 s, boucle infinie) | **VP (lettre)** — pause au survol `:35`, liste statique au focus clavier `:38-41` et en reduced-motion `:49-53`, copie `aria-hidden` hors tab-order `:12-15` | code |
| ai-color-palette (« Purple/violet gradient background ») | warning | non | – / – / 1 (accueil mobile) | **`index.astro:60`** : blob d'aurore du hero `rgba(203,181,238,0.65)` | **Discutable** — variante plus saturée du lilas validé ; le jeton `--lilac #DFD2F4` (aurore de `PageHero.astro:13`, `card--lilac`, blob lilas→eau) **ne déclenche pas** | tests synthétiques : seul `aurora-hero-lilac.html` déclenche |
| line-length (« ~92 chars/line ») | warning | non | – / 1 (lieux-contact) / – | `lieux-contact.astro:182` `.rdv__visio p { max-width: 46em }` ; `.copy { max-width: 36em }` (`global.css:116`) | **VP** | 1ʳᵉ ligne mesurée (Range API) : 108 car. (736 px, 16 px) ; `.copy` 93 car. (691 px, 19,2 px — Hanken Grotesk est étroite) |

---

## 3. Détail par règle

### 3.1 low-contrast (128 statique, 71 desktop, 89 mobile)

Le détecteur produit trois familles de constats, à traiter séparément.

**a) Pied de page — le gros du volume (120 / 48 / 60).** Le fond `#f1e9e4` n'est pas dans la palette : c'est la fin du dégradé du footer (`Footer.astro:67`). Le détecteur retient le point le plus foncé du dégradé. Mesure réelle sur `/lieux-contact/` à 1280 :

| Élément | Taille | Couleur | min | p10 | médiane | Seuil |
|---|---|---|---|---|---|---|
| `.footer__tagline` | 14,7 px | `#7A6B82` | 4,19 | 4,24 | 4,28 | 4,5 |
| `.footer__breathe` | 13,4 px | `#7A6B82` | 4,15 | 4,19 | 4,22 | 4,5 |
| `.footer__lieu` (adresse) | 14,1 px | `#7A6B82` | — | — | ≈ 4,2 | 4,5 |
| `.footer__legal-line` | 13,4 px | `#7A6B82` | — | — | ≈ 4,2 | 4,5 |
| `.footer__bottom` p | 13,1 px | `#7A6B82` | 4,03 | 4,08 | 4,11 | 4,5 |
| `.footer__legal-link` | 13,1 px | `#7A6B82` | 4,03 | 4,08 | 4,11 | 4,5 |
| `.footer__head` (×3) | 12,5 px, 700 | `#C13D63` | 4,40 | 4,46 | 4,48 | 4,5 |
| `.footer__lieu strong` (témoin) | 14,1 px, 700 | `#43324B` | 9,95 | 10,01 | 10,07 | 4,5 |

Sur l'ivoire de page (`#FDFBF8`) le même `--muted` donne 4,79:1 et passe ; c'est le fond du footer qui le fait tomber. **Vrai positif**, 12 éléments uniques par page.

**b) Placeholder du portrait (2 / 1 / 1).** `#e4d8f5` est le lilas à 0,85 sur ivoire-doux du radial de `Portrait.astro:37`. Mesure réelle du `<p>Portrait à venir</p>` (15,2 px italique) : 3,68–3,81:1 sur les deux pages et les deux viewports. **Vrai positif**, mais provisoire : le placeholder est « le SEUL à venir du site » (commentaire `Portrait.astro:2-4`) et disparaît avec la photo cliente.

**c) Hero mobile (0 / 0 / 2 signalés, 3 réels).** L'eyebrow (`.hero__eyebrow`, 14,1 px, 650) et les deux premières lignes du paragraphe (`.hero__copy`, `--muted-hero #6E5F76`, 16,8 px) sont dans les 28 % transparents du scrim mobile (`global.css:47`), donc sur le film et l'aurore. Trois instants du film puis reduced-motion (poster fixe) :

| Élément | film t≈6 s | t≈9,5 s | t≈13 s | reduced-motion |
|---|---|---|---|---|
| `.hero__eyebrow` (min / méd.) | 3,19 / 3,56 | 3,24 / 3,55 | 3,09 / 3,28 | 3,23 / 3,76 |
| `.hero__copy` (min / méd.) | 3,83 / 4,19 | 3,22 / 4,01 | 3,28 / 4,11 | 4,24 / 4,52 |
| `strong` (min / méd.) | 6,97 / 8,15 | 7,19 / 8,05 | 7,28 / 8,20 | 8,74 / 9,01 |

Verdict : **VP** pour le paragraphe (signalé à 3,6), **VP non signalé** pour l'eyebrow (jamais remontée par le détecteur), **FP** pour le `strong` (estimé 1,8:1, réel 7–9:1 ; il est en `--ink`). Sur desktop (mesuré en reduced-motion, hero statique, 1440) tout passe : eyebrow 4,69–4,79, copy 5,38–5,51, trust 5,53–5,61, titre 10,7–11,0.

**d) Cartes teintées, estimation « analytic-gradient+alpha » (0 / 16 / 22).** Le détecteur compose analytiquement la carte semi-transparente (`--tint-* à 0,35` → blanc à 70 %) sur le blob de section et prend le pire point ; il annonce 3,3–3,9:1. Au pixel, après animations :

| Cible | Détecteur | Réel min | p10 | médiane | Verdict |
|---|---|---|---|---|---|
| Piliers d'approche p ×3 (15,5 px, muted) | 3,3 / 3,4 / 3,8 | 4,52–4,62 | 4,64–4,73 | 4,80–4,84 | FP |
| Repères d'À propos labels ×3 (12,5 px, 700, framboise) | 3,5 / 3,6 / 3,9 | 4,33–4,50 | 4,40–4,57 | 4,57–4,68 | discutable (« En cours » p10 4,40) |
| Adresses des cabinets ×3 (14,4 px, muted) | 3,3 / 3,4 / 3,8 | 4,36–4,52 | 4,49–4,59 | 4,56–4,64 | discutable (Court-Saint-Étienne p10 4,49) |
| « La Hulpe » `.lieux__ville` (24 px, 600) | 2,3 (méd. 9,0) | 10,46 | 10,61 | 10,68 | FP |
| Items périnatalité p ×6 (15,2 px, muted) | 3,4 ×6 | 4,42–4,44 | 4,57 | 4,69–4,72 | FP |
| Tags accueil mobile Burn-out / Stress (12,8 px, 700) | 3,5 | 4,55–4,62 | 4,63–4,68 | 4,75–4,76 | FP |
| Tags accueil mobile Périnatalité / Parentalité | 3,6 | 4,37 | 4,47 | 4,58 | discutable |

L'estimation du détecteur est pessimiste d'environ un point ; la réalité se tient autour du seuil.

**e) Cartes verre, « pixel contrast » (0 / 6 / 6).** Valeurs annoncées : min 1,1–1,2:1, médiane 2,1–4,6 sur `backdrop-filter`. Cinq prises sur le paragraphe « C'est très fréquent… » d'approche, à 0, 0, 400 et 1 800 ms après un scroll instantané : min 4,16 / 4,32 / 4,33 / 4,34, médiane 4,70 / 4,72 / 4,66 / 4,66. Visio de lieux-contact : p min 4,68, médiane 4,75 ; h2 11,1–11,3 ; dt FAQ 10,4–11,2. **Non reproductible ; FP.** Cause côté détecteur non identifiée (échantillonnage sur le flou du fond, probablement).

**f) Libellés framboise sur cartes rose/pêche, statique (6 / 0 / 1).** `#fbe9ee` = `--tint-rose` sur ivoire, `#fee8db` = pêche à ~0,56. Le détecteur prend le point le plus foncé du dégradé de carte ; `.amene__tag` est en bas de carte (`margin-top: auto`), sur la partie blanche. Mesuré 4,71–5,0 desktop, 4,55–4,76 mobile. **FP.**

### 3.2 hero-eyebrow-chip (9 / 4 / 0), kicker-above-heading (0 / 4 / 13), all-caps-body (4 / 1 / 2)

Un seul motif, trois règles. Le composant `.overline` (`global.css:122-128` : 0,82 rem = 13,1 px, graisse 700, `text-transform: uppercase`, `letter-spacing: 0.14em`, framboise) est posé par `PageHero.astro:23` au-dessus de chaque h1 et par les pages au-dessus des h2 de section ; l'accueil a son propre `.hero__eyebrow` (`index.astro:88`, 14,1 px, 650, 0,1 em).

- Le **même** `<span class="overline">` d'approche, a-propos et lieux-contact est classé « hero-eyebrow-chip » à 1280 et « kicker-above-heading » à 390 (le seuil « oversized hero headline » dépend du viewport).
- Sur les 5 pages rendues : 15 éléments uniques (5 eyebrows de page + 10 kickers de section, dont 6 sur l'accueil : « Ce qui vous amène », « Accompagnements », « Qui je suis », « Nutrition & Santé », « Où me trouver », « La première séance »).
- Le scan statique voit les 9 eyebrows de page (dont 404 et mentions légales) et aucun kicker : la règle kicker est rendu seul.
- `all-caps-body` retombe exactement sur ces éléments : 58 caractères = « Psychologue clinicienne · Santé · Périnatalité · Nutrition » (`site.ts:6-7`), 44 = « Accompagnements · Périnatalité & Parentalité », 39 = « … Adolescents & Adultes », 35 = « … Enfants & Famille ». Une ligne de libellé, pas un paragraphe : **FP** au regard de l'intention de la règle (« reserve uppercase for short labels »).

Verdict eyebrow/kicker : **VP sur la lettre** (le motif est bien là, sur toutes les pages), élément assumé du design system. Contraste de ces libellés : 4,45–4,90:1 (mesuré sur 7 cas), tous ≥ 4,5 sauf « La première séance » min 4,45 / p10 4,51.

### 3.3 pulsing-dot (11 / 4 / 5)

- `.footer__breathe-dot` (`Footer.astro:90-94`) : 10×10 px, `halo-breathe` 7 s (le cycle de respiration du hero, `global.css:277-281`), dans un `<p aria-hidden>`, animation coupée en reduced-motion. DESIGN.md le documente (« décliné en pastille dans le footer »). **VP sur la lettre** (petit point pulsant, non lié à une donnée vivante).
- `.hero__indice-point` (`index.astro:629-641`) : 4×8 px, 1,6 s, dans la « souris » de l'indice « Faites défiler », affiché seulement en scène épinglée (`.hero.is-scene`), effacé au premier scroll (`:407`), coupé en reduced-motion. Capture `home-1440-s0.png`. **FP** : indice de défilement, pas un point de statut.

### 3.4 buried-raster (10 / 4 / 5)

`.grain` (`global.css:293-300`) : div fixe, bruit `feTurbulence` en data-URI, `opacity: 0.04`, commenté « brise la platitude numérique, compositor-only, ~4 % d'opacité ». Mesure sur `/mentions-legales/` à 1440, même vue avec puis sans le calque (masqué à l'exécution) :

| Mesure | Valeur |
|---|---|
| Différence moyenne par canal | 0,93 / 0,95 / 0,95 sur 255 |
| Différence maximale par canal | 4 / 4 / 3 |
| Pixels modifiés d'au moins 1 niveau | 83,1 % |
| Pixels modifiés d'au moins 3 niveaux | 0,07 % |
| Pixels modifiés d'au moins 6 niveaux | 0 % |
| Écart-type d'une zone 200×180 px, avec / sans | 4,23 / 4,24 (dominé par le dégradé du fond) |

La règle dit « never reaches the screen » ; au pixel, l'apport est de 1 niveau en moyenne, 4 au maximum. **VP sur la mesure** ; choix documenté, à trancher côté design.

### 3.5 gpt-thin-border-wide-shadow (advisory, 10 / 4 / 5)

`.nav__drop-menu` (`Header.astro:147-161`) : `border: 1px solid var(--glass-border)` + `box-shadow: 0 24px 60px rgba(67,50,75,0.18)`. C'est le menu déroulant « Accompagnements », `opacity: 0; visibility: hidden` tant qu'on ne survole/clique pas. Une occurrence par page. Reproduit à l'identique sur `Header.html` synthétique. **VP sur la lettre**, advisory.

### 3.6 em-dash-overuse (advisory, 6 / 0 / 1)

Comptage indépendant des `—` dans le texte visible de `dist` (scripts et styles retirés) :

| Page | Tirets | Caractères | Densité |
|---|---|---|---|
| index | 18 | 6 533 | 1/362 |
| mentions-legales | 9 | 2 863 | 1/318 |
| a-propos | 8 | 2 881 | 1/360 |
| approche | 8 | 3 337 | 1/417 |
| lieux-contact | 8 | 3 231 | 1/403 |
| nutrition-sante | 8 | 2 892 | 1/361 |
| enfants-famille | 7 | 2 725 | non signalé |
| perinatalite | 7 | 2 910 | non signalé |
| adolescents | 6 | 2 965 | non signalé |
| 404 | 4 | 1 432 | non signalé |

Le seuil du détecteur (≥ 8 tirets, ≈ 1/500 car.) est appliqué exactement. Le rendu mobile de l'accueil en compte 13 (les phrases desktop de la scène épinglée et le texte masqué ne sont pas rendus). Le tiret cadratin est la ponctuation d'incise standard en français ; le comptage reste un fait. **VP sur la lettre**, advisory.

### 3.7 cramped-padding (8 / 0 / 0)

Constats statiques : « card : children flush against bg on right/bottom/left » (a-propos ×2, lieux-contact ×2), « card : children flush against border+bg on right/left » (approche, enfants-famille), « portrait__cadre : children flush against outline » (a-propos, accueil). Paddings réels :

| Carte | Déclaration |
|---|---|
| `.reperes__item` (a-propos) | `padding: clamp(24px, 2.6vw, 34px)` — `a-propos.astro:103` |
| `.coords__item` (lieux-contact) | `padding: clamp(24px, 2.6vw, 34px)` — `lieux-contact.astro:203` |
| `.lieux__card` → enfant `.lieux__body` | `padding: var(--pad-card)` — `LieuxCards.astro:38` |
| `.rdv__visio`, `.pratique__qa` | `var(--pad-card)` / `22px 26px` — `lieux-contact.astro:177,190` |
| `.premiere__intro`, `.piliers__card` (approche) | `var(--pad-card)` — `approche.astro:133,119` |
| `.parents__note` (enfants-famille) | `var(--pad-card)` — `enfants-famille.astro:93` |
| `.portrait__cadre` | cadre média 4/5 ; le placeholder `.portrait__ph` remplit 100 % avec `place-items: center` — `Portrait.astro:26-41` |

L'analyse statique ne résout ni `var()` ni `clamp()` et lit 0 ; les 9 scans rendus n'ont produit aucun `cramped-padding`. **FP.**

### 3.8 border-accent-on-rounded (2 / 0 / 0)

`dist/_astro/index.B2B7Ujat.css` : `border-top: 6px solid` / `border-bottom: 6px solid`. Source : `Carrousel.astro:209-212`, icône « lecture » du bouton pause dessinée en CSS (`border-left: 10px solid currentColor; border-top/bottom: 6px solid transparent`). Bordures transparentes formant un triangle, aucune carte. **FP.**

### 3.9 overused-font (1 / 0 / 0)

`dist/_astro/a-propos.Y7P92MqE.css` : `@font-face { font-family: Fraunces Variable; … }` (déclarations fontsource, importées `Base.astro:2-3`). Le regex du détecteur matche la déclaration `@font-face`, pas un usage. Fraunces est la police display retenue et justifiée dans DESIGN.md. **VP sur la lettre** (la règle liste Fraunces nommément), décision de design system.

### 3.10 flat-type-hierarchy (1 / 0 / 0, adolescents-adultes)

Tailles calculées à 1280 : h1 65,6 px ×1 ; h2 48 px ×2 et **20 px ×5** ; h3 17,9 px ×3 (`.tdah__list h3`, 1,12 rem) ; p de 12,5 à 19,2 px (15,2 px ×5 le plus fréquent). Le détecteur retient la taille modale par rôle (h2 = 20 px, les titres de cartes) et conclut à un pas de 1,18. La page a pourtant deux paliers forts (65,6 et 48 px). **FP / discutable** selon qu'on juge les titres de cartes comme « le » h2 de la page. Page non couverte par les scans rendus (hors liste).

### 3.11 marquee (1 / 0 / 1)

`.bandeau__piste` (`Bandeau.astro:30-34`) : `animation: bandeau-defile 60s linear infinite`, translation de −50 % sur deux copies de la liste des thèmes. Garde-fous dans le même fichier : pause au survol (`:35`), liste statique centrée au focus clavier (`:38-41`, la copie passe en `display: none`), même repli en reduced-motion (`:49-53`), copie `aria-hidden` et `tabindex=-1` (`:12-15`). **VP sur la lettre** (défilement automatique continu).

### 3.12 ai-color-palette (0 / 0 / 1, accueil mobile)

Cinq pages synthétiques scannées en `file://` à 390×844, chacune avec un seul dégradé :

| Fichier | Dégradé | Constat |
|---|---|---|
| `blob-lilac-aqua.html` | `linear-gradient(135deg, #DFD2F4, #C9E9DE)` à 0,55 (blob de section mobile) | aucun |
| `blob-peach-rose.html` | pêche → rose à 0,55 | aucun |
| `aurora-phero-lilac.html` | `radial-gradient(… rgba(223,210,244,0.75) …)` (aurore des pages intérieures, = jeton) | aucun |
| `card-lilac.html` | `linear-gradient(160deg, rgba(223,210,244,.35), #fff 70%)` | aucun |
| **`aurora-hero-lilac.html`** | **`radial-gradient(… rgba(203,181,238,0.65) …)`** (`index.astro:60`) | **ai-color-palette** |

Le déclencheur est donc une couleur propre au hero de l'accueil, `rgba(203,181,238,…)`, plus saturée que le jeton `--lilac #DFD2F4` de la palette validée par la cliente ; le jeton lui-même ne déclenche pas. L'élément existe aussi sur desktop (non scanné). **Discutable** : même famille de teinte que l'aurore validée, mais hors jeton.

### 3.13 line-length (0 / 1 / 0, lieux-contact)

Mesure de la première ligne rendue (Range API, caractères réels) à 1280 :

| Bloc | Largeur | Taille | 1ʳᵉ ligne | Moyenne |
|---|---|---|---|---|
| `.rdv__visio p` (`max-width: 46em`, `lieux-contact.astro:182`) | 736 px | 16 px | **108 car.** | 61 (2 lignes) |
| `.copy` du hero de page (`max-width: 36em`, `global.css:116`) | 691 px | 19,2 px | **93 car.** | 66 |
| `dd` de la FAQ | 458 px | 15 px | 74–83 | 52–66 |

Le « ~92 » du détecteur correspond au `.copy`. Hanken Grotesk étant étroite, 36 em donnent 93 caractères et non les ~72 attendus ; `.copy` est global, donc le même fait vaut sur toutes les pages même si la règle n'a tiré qu'ici. **VP.**

---

## 4. Comptes

| Source | Total | Primaires | Advisories | FP retirés | Discutables | Primaires restants |
|---|---|---|---|---|---|---|
| `dist` (10 pages, statique) | 191 | 175 | 16 | 22 | 0 | **153** (dont 122 = footer + portrait) |
| rendu 1280 (4 pages) | 93 | 89 | 4 | 17 | 6 | **66** (dont 49 = footer + portrait) |
| rendu 390 (5 pages) | 122 | 116 | 6 | 21 | 9 | **86** (dont 62 = footer + portrait) |

Détail des retraits. `dist` : 6 contrastes `#fbe9ee`, 1 `indice-point`, 8 `cramped-padding`, 4 `all-caps-body`, 2 `border-accent`, 1 `flat-type-hierarchy`. Rendu 1280 : 3 piliers, 1 La Hulpe, 6 items périnatalité, 6 « pixel contrast », 1 `all-caps-body` (FP) ; 3 repères + 3 adresses (discutables). Rendu 390 : 1 `#fee8db`, 1 `strong` hero, 2 tags, 3 piliers, 3 + 3 « pixel contrast », 6 items périnatalité, 2 `all-caps-body` (FP) ; 3 repères, 3 adresses-mobile, 2 tags, 1 `ai-color-palette` (discutables).

**En éléments uniques** (les doublons par page retirés), ce qui reste après vérification :

1. Pied de page : 12 textes sous 4,5:1 sur toutes les pages (VP, mesuré 4,03–4,48).
2. Hero mobile : eyebrow 3,1–3,8:1 et paragraphe 3,2–4,5:1 (VP ; l'eyebrow n'était pas signalée).
3. Placeholder « Portrait à venir » 3,7–3,8:1 (VP, provisoire).
4. 15 eyebrows/kickers `.overline` + `.hero__eyebrow` (VP lettre, design system).
5. Point respirant du footer (VP lettre, signature documentée).
6. Grain à 0,04 : apport ≤ 4/255 (VP mesuré, choix documenté).
7. Bandeau défilant 60 s avec ses garde-fous (VP lettre).
8. Menu déroulant bordure 1 px + ombre 60 px (advisory).
9. Tirets cadratins : 18 sur l'accueil, 8–9 ailleurs (advisory).
10. Fraunces en `@font-face` (VP lettre, décision DESIGN.md).
11. Longueur de ligne : visio 108 car., `.copy` 93 car. (VP).
12. Blob lilas hors jeton du hero `rgba(203,181,238,0.65)` (discutable).
13. Bordeline ±0,1 autour de 4,5 : labels des repères, adresses des cabinets, deux tags mobiles (discutables).

---

## 5. Constats sources vs rendu

- **Seul le rendu a vu** : `kicker-above-heading` (13 en mobile, 4 en desktop), `line-length`, `ai-color-palette`, tous les contrastes « analytic-gradient+alpha » et « pixel contrast » sur cartes teintées et verre, et les deux constats du hero mobile.
- **Seul le statique a vu** : `cramped-padding` (8, tous FP faute de résoudre `var()`/`clamp()`), `border-accent-on-rounded` (2 FP), `overused-font`, `flat-type-hierarchy`, le point de l'indice de scroll desktop (l'accueil desktop n'ayant pas pu être rendu), et les eyebrows des 5 pages non rendues (404, mentions, nutrition, adolescents, enfants).
- **Vu par les deux, chiffres identiques** : le footer (le fond `#f1e9e4` est résolu pareil), le grain, le point respirant, le marquee, le menu déroulant, les eyebrows de page.
- **Ni l'un ni l'autre** : le défaut de contraste de l'eyebrow du hero mobile (3,1–3,8:1), trouvé seulement par la mesure au pixel ; la longueur de ligne de `.copy` sur les autres pages (même CSS, règle tirée une seule fois).
- **Le scan « sources » (`src`) est aveugle par construction** : `.astro` non supporté (démontré en 1e). Le scan de `dist` en tient lieu.

---

## 6. Étapes sautées ou échouées

- **Overlay visuel « [Human] » d'impeccable : sauté.** Navigateur headless uniquement, aucun onglet visible par l'utilisateur, et les outils qui l'auraient permis (`live-inject`, `live-server`, `mcp__claude-in-chrome__*`) étaient interdits. Remplacé par les captures ciblées listées en §7.
- **Rendu de `/` à 1280×800 : échoué 3 fois** (`Navigation timeout of 30000 ms exceeded`, deux fois en ligne, une fois sur `http://127.0.0.1:4331/`). Couvert par : scan statique de `dist/index.html`, rendu mobile de `/`, mesures desktop maison à 1440 (hero statique en reduced-motion : tout ≥ 4,69:1 ; captures de la scène épinglée à scroll 0 et 2 400).
- **Mesure du hero desktop dans la scène animée : non aboutie.** Avec la scène épinglée (GSAP scrub), le texte du hero n'est pas visible aux positions de scroll essayées (0 et 2 400 par paliers) ; la mesure a été faite sur le hero statique (reduced-motion), qui partage le même CSS de scrim et de couleurs.
- **Premier essai de la mesure « timing » (attente 0 ms) : planté** sur le `scroll-behavior: smooth` du site (élément encore hors écran) ; corrigé en scroll instantané, cinq prises valides ensuite.
- **Mesure du chip du bandeau : invalide** (le marquee bouge entre les deux captures, min 1,0 artefactuel) ; non retenue.
- Aucun timeout sur les 9 scans rendus réussis ni sur `dist`.

---

## 7. Fichiers produits

Racine : `C:\Users\debes\AppData\Local\Temp\claude\C--Dev-Noveo--autres-website\7bac8134-cfb9-4728-96e0-f16cbb14937c\scratchpad\B\`

**JSON du détecteur**

- `dist.json` (191 constats, statique 10 pages) · `dist-css-alone.json`
- `url-approche-1280.json` · `url-a-propos-1280.json` · `url-lieux-contact-1280.json` · `url-perinatalite-1280.json`
- `url-home-390.json` · `url-approche-390.json` · `url-a-propos-390.json` · `url-lieux-contact-390.json` · `url-perinatalite-390.json`
- Vides (aucun constat ou échec) : `src.json`, `src-explicit.json`, `src-css.json`, `src-noconfig.json`, `src-header.json`, `url-home-1280.json`, `url-home-1280-local.json` (+ leurs `.stderr.txt` avec l'erreur de timeout)

**Consolidations**

- `summary-dist.txt` · `summary-url-1280.txt` · `summary-url-390.txt` (par règle : occurrences, extrait, pages)
- `tableau-mesures.txt` (toutes les mesures de contraste réel, une ligne par cible)

**Mesures brutes** (`mes/`)

- `*-resultats.json` : `approche-1280`, `lieux-1280`, `apropos-1280`, `perinat-1280`, `home-390`, `home-1440`, `homehero-1440`, `homehero-1440-rm`, `heroM-6000`, `heroM-9500`, `heroM-13000`, `heroM-rm`, `timing-approche`
- par cible : `<run>-<cible>-txt.png` (avec texte), `-bg.png` (fond seul), `-ctx.png` (carte ou section entière)

**Captures de preuve**

- `preuve-1-hero-mobile-390.png` — hero mobile : eyebrow et paragraphe sur la zone transparente du scrim
- `preuve-2-footer-1280.png` — pied de page complet, textes `--muted` et têtes framboise, point respirant
- `preuve-3-eyebrow-perinatalite-1280.png` — `.overline` au-dessus du h1 (eyebrow / all-caps 44 car.)
- `preuve-4-portrait-placeholder-1280.png` — « Portrait à venir » sur le placeholder
- `preuve-5-carte-verre-approche-1280.png` — carte verre « Et si je ne sais pas par où commencer ? » (pixel contrast non reproduit)
- `preuve-6-grain-zoom-avec.png` / `preuve-6-grain-zoom-sans.png` — zone 200×180 px agrandie ×4, avec et sans grain ; `grain-avec-grain.png` / `grain-sans-grain.png` (vues complètes)
- `home-1440-s0.png` — scène épinglée du hero desktop, indice « Faites défiler » avec son point
- `home-1440-rm.png` — hero desktop statique (reduced-motion), eyebrow et scrim
- `home-1440-s2400.png` — accueil desktop à scroll 2 400

**Scripts et tests**

- `mesure.py`, `grain.py`, `hier.py`, `ligne.js`, `summarize.py`
- `synth/` : `bg-hex.html`, `bg-var.html`, `bg-grain.html`, `Header.astro|html|tsx`, `blob-lilac-aqua.html`, `blob-peach-rose.html`, `aurora-hero-lilac.html`, `aurora-phero-lilac.html`, `card-lilac.html`
