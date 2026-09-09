# Xenia — blocs et animations de l'accueil (design)

> Spec validée le 2026-09-09 avec l'utilisateur, après comparaison avec la
> référence aimée par la cliente (template « Yoga studio » : grandes formes
> pastel, photo dans un blob, sections centrées, carte de « classes » à onglets,
> portraits ronds, boutons capsule). Décision : **faire maintenant tout ce qui
> ne dépend pas de la cliente** (option 1) ; photo du hero et bloc tarifs
> attendent ses éléments, leurs emplacements restent prêts.

## 1. Pourquoi

Le site recomposé (spec du 2026-09-08) a le bon système de surfaces mais
manque de **blocs** par rapport à la référence : rien qui présente les
accompagnements en un seul objet feuilletable, rien sur le déroulé d'une
première séance dès l'accueil, rien qui situe les trois cabinets d'un coup
d'œil ; et trop de sections ne bougent que par leur reveal d'entrée.

## 2. Décisions figées (2026-09-09)

| Sujet | Décision |
|---|---|
| Périmètre | L'accueil (nouveaux blocs + animations) + composants réutilisables ; la page Approche réutilise le composant des étapes. Rien qui dépende de la cliente (photos, tarifs). |
| Ordre de l'accueil | **A — histoire d'abord** : Hero → Bandeau des thèmes → Ce qui vous amène → Carrousel des accompagnements (remplace les 3 cartes) → Qui je suis → Première séance en 3 étapes → Nutrition (rencontre) → Tagline → Carte dessinée + les 3 cabinets → Closing |
| Carte | **A — contour du Brabant wallon** en trait fin sur un blob, 3 pastilles qui s'allument, courbe qui les relie. Évocation dessinée, aucune carte tierce, aucun cookie. |
| Carrousel | **A — 4 onglets, défilement auto lent** (7 s), pause au survol / focus / hors écran, bouton pause. |
| Méthode | localhost 4331, pas de commit/push/redéploiement avant validation à l'écran. |

## 3. Bandeau des thèmes — `Bandeau.astro`

- **Place** : juste sous le hero (avant « Ce qui vous amène »), pleine largeur, hauteur ≈ 72 px.
- **Contenu** : des capsules `a.chip` teintées par thème (classes `chip--rose/lilac/aqua/peach/sage`), texte Hanken 0,86 rem 600, liées à leur page. Source unique **`src/data/themes.ts`** :

| Libellé | Teinte | Lien |
|---|---|---|
| Stress & anxiété | rose | `/accompagnements/adolescents-adultes/` |
| Burn-out | rose | `/accompagnements/adolescents-adultes/` |
| Douleur & maladie chronique | peach | `/accompagnements/adolescents-adultes/` |
| Sommeil & insomnies | peach | `/accompagnements/adolescents-adultes/` |
| TDAH | aqua | `/accompagnements/adolescents-adultes/#tdah` |
| Périnatalité | lilac | `/accompagnements/perinatalite-parentalite/` |
| Parentalité | lilac | `/accompagnements/perinatalite-parentalite/` |
| Enfants & famille | aqua | `/accompagnements/enfants-famille/` |
| Nutrition & santé | sage | `/nutrition-sante/` |
| Transitions de vie | rose | `/accompagnements/adolescents-adultes/` |

- **Mouvement** : défilement horizontal continu vers la gauche, ~60 s par tour (`@keyframes` sur `translateX(-50%)` d'une piste dupliquée deux fois, `will-change: transform`), pause au survol et au focus clavier (`animation-play-state: paused`), `mask-image` linéaire aux deux bords pour un fondu. En `prefers-reduced-motion` : pas d'animation, capsules en `flex-wrap` centrées. Sans JS : identique (tout est CSS).
- **Accessibilité** : la piste dupliquée porte `aria-hidden="true"`, le `nav` a `aria-label="Thèmes"`, les capsules gardent leur focus visible ; la pause au focus évite de perdre le lien en tabulant.

## 4. Carrousel des accompagnements — `Carrousel.astro`

- **Données** : **`src/data/accompagnements.ts`** (extrait du frontmatter d'`index.astro`, +Nutrition) : `{ slug, onglet, titre, desc, illu, illuAlt, teinte, ou, href }`. Textes : ceux des 3 cartes actuelles + pour Nutrition « Sommeil, alimentation, mouvement : des leviers concrets de votre équilibre — sans régime culpabilisant, sans injonctions. » (la phrase de la section nutrition) ; `ou` = « Court-Saint-Étienne · Nivelles · La Hulpe · visio — rendez-vous en ligne » (identique pour les 4, ordre de `LIEUX`).
- **Structure** (patron WAI-ARIA *tabs*) : `div.carrousel` → `div[role=tablist]` de 4 `button[role=tab]` capsule (teinte de l'onglet actif : rose / lilas / eau / sauge) → `div.carrousel__scene` → 4 `div[role=tabpanel]` superposés (`grid-area: 1/1`), chacun une **carte blanche** `card card--spot` : à gauche l'aquarelle `-card.webp` dans un médaillon `var(--radius-organique)` fondu sur la teinte (multiply, comme les heros), à droite overline (onglet), titre `headline--md`, `desc`, ligne « Où » avec puce-pétale, lien `link-arrow` « Découvrir ». Flèches `button.carrousel__fleche` ‹ › de part et d'autre (capsules verre), **bouton pause/lecture** discret sous les onglets (`aria-pressed`).
- **Comportement** : onglet cliqué, flèche, ←/→ au clavier sur le tablist → panneau suivant. **Auto** : toutes les 7 s si le carrousel est visible (`IntersectionObserver`), non survolé, sans focus dedans, et si `prefers-reduced-motion` est absent ; toute interaction coupe l'auto pour 20 s ; le bouton pause l'arrête jusqu'au clic suivant. Transition GSAP : sortant `x: 0 → -24, opacity 1 → 0` (0,35 s), entrant `x: 24 → 0, opacity 0 → 1` (0,45 s), `pointer-events` coupés pendant la transition. Panneau inactif : `visibility: hidden` (hors tab order).
- **Sans JS** : les 4 panneaux affichés les uns sous les autres (classe `is-js` posée par le script pour passer en scène superposée) ; onglets, flèches et bouton pause masqués (`display: none` hors `.is-js`), inutiles quand tout est visible.
- **Mobile** : onglets sur 2 lignes (flex-wrap), carte en une colonne (médaillon 200 px puis texte), flèches sous la carte.

## 5. Première séance en 3 étapes — `Etapes.astro`

- **Données** : **`src/data/etapes.ts`** = les 3 étapes actuelles d'`approche.astro` (« Vous arrivez comme vous êtes » / « On fait connaissance » / « On décide ensemble », textes inchangés).
- **Accueil** : section `section--blob` « La première séance » : overline, H2 « Et si je ne sais pas *par où commencer* ? » (le titre d'Approche), puis la **frise** : 3 colonnes, un cercle numéroté (46 px, dégradé rose→lilas, chiffre Fraunces framboise) au-dessus de chaque titre + texte, une **ligne** SVG horizontale entre les cercles (`pathLength="1"`). Blob n° 4 lilac-aqua derrière.
- **Animation** (scrub, desktop) : la ligne se trace de gauche à droite (`stroke-dashoffset` 1 → 0) sur `start: 'top 75%', end: 'top 25%'` ; chaque cercle passe de `scale 0.6 / opacité 0` à `1 / 1` quand la ligne l'atteint (à 0 / 0,5 / 1 du tracé) ; mobile : frise verticale (ligne à gauche, cercles alignés), même tracé ; reduced-motion et sans JS : tout visible.
- **Page Approche** : la liste `.premiere__steps` est remplacée par `<Etapes vertical />` (variante verticale, même composant) ; le texte d'intro reste dans sa carte de verre.

## 6. Carte dessinée des cabinets — `CarteCabinets.astro`

- **Place** : section « Où me trouver » de l'accueil, en deux colonnes desktop : la carte à gauche (≈ 46 %), les 3 `LieuxCards` en colonne à droite (variante `compact` : une carte par ligne, plus basse). Mobile : carte au-dessus, cartes en dessous.
- **Dessin** : SVG inline `viewBox 0 0 400 240`, `aria-hidden` (les cartes de lieux portent l'information). Un **blob** pastel (forme 2, peach-lilac) derrière ; le **contour simplifié du Brabant wallon** (province allongée est-ouest, ~25 points, tracé à la main dans `src/lib/carte.ts` comme chaîne `d`, trait `--ink` 1,25 px à 55 % d'opacité, remplissage ivoire à 40 %) ; 3 **pastilles** framboise (r 6) avec halo (r 14, 25 %) aux positions normalisées **Nivelles (0,21 ; 0,80)**, **Court-Saint-Étienne (0,49 ; 0,68)**, **La Hulpe (0,39 ; 0,28)** — dérivées des coordonnées réelles, avec leur nom en Hanken 0,8 rem `--ink` ; une **courbe** fine framboise en pointillé qui relie Nivelles → Court-Saint-Étienne → La Hulpe (`pathLength="1"`). En haut à droite, en petit, « Brabant wallon » en Fraunces italique `--muted`.
- **Animation** (scrub, desktop, `start: 'top 80%', end: 'top 20%'`) : le contour se trace (0 → 0,5), la courbe se trace (0,35 → 0,85), les pastilles s'allument en séquence (scale 0 → 1 avec halo qui pulse une fois) à 0,45 / 0,65 / 0,85, les noms montent en fondu juste après. Reduced-motion et sans JS : tout dessiné.

## 7. Parallaxe des blobs

- `Blob.astro` accepte `parallaxe?: number` (défaut 40 = amplitude en px). Un module **`src/lib/blobs.ts`** (booté à l'idle depuis `Base.astro`, desktop seulement, `!REDUCED`) crée pour chaque `.blob[data-parallaxe]` un tween `y: -amp → +amp` scrubé sur `trigger: section parente, start: 'top bottom', end: 'bottom top'`, `ease: 'none'`, `invalidateOnRefresh`. La dérive CSS existante (`@keyframes` sur `transform`) est remplacée par une dérive sur la propriété `translate`, **desktop seulement** (en mobile `translate` sert déjà au centrage du lavis, et il n'y a ni dérive ni parallaxe), pour ne pas entrer en conflit avec le `y` de GSAP (qui écrit `transform`).
- L'accueil et les pages posent `parallaxe` sur leurs blobs de section (pas sur ceux du PageHero, ni en mobile où le blob est centré).

## 8. Trait sous les titres

- Tout `h2.headline` d'une section reçoit la classe `headline--trait` : son `em` porte un `::after` (dégradé framboise → rose, `height: 0.14em`, `border-radius`, `bottom: -0.04em`, `transform: scaleX(0)` origine gauche, `transition: transform 0.9s var(--ease) 0.15s`). Un `IntersectionObserver` unique dans `motion.ts` (`bootTraits`) pose `is-vu` à l'entrée (seuil 60 %), une fois. Reduced-motion : `is-vu` posé sans transition. Sans JS : trait visible (`scaleX(1)` par défaut, `scaleX(0)` seulement sous `html.js`).
- Le hero garde son trait SVG animé dans la timeline.

## 9. Ce qui ne change pas

Textes existants, navigation, SEO/JSON-LD, système de blobs et cartes teintées, hero, sections « Ce qui vous amène », « Qui je suis », Nutrition, Tagline, Closing, pages intérieures (hors Approche : étapes via le composant).

## 10. Mobile, accessibilité, performance

- Aucune image nouvelle : les aquarelles `-card.webp` existantes pour le carrousel ; carte et frise en SVG inline ; bandeau en CSS.
- Contrastes ≥ 4,5:1 (capsules : texte `--ink` sur teinte 35 %) ; onglets et flèches ≥ 44 px de zone cliquable ; tout contrôle au clavier ; contenu mobile automatique pausable (bouton) et arrêté en reduced-motion.
- `scrollWidth` = viewport partout (le bandeau est `overflow: hidden` sur sa piste).
- Lighthouse accueil : performance ≥ 90, accessibilité ≥ 95.

## 11. Vérification (preuve au navigateur)

Desktop 1440×900 et mobile 390×844, console vide :
1. Bandeau : défile (mesure de `transform` à t et t+1 s), s'arrête au survol, capsules cliquables vers les bonnes pages.
2. Carrousel : 4 onglets, panneau actif unique, ←/→ et flèches changent de panneau, auto en 7 s (mesure à t+8 s sans survol), pause au survol et via le bouton, panneaux inactifs hors tab order, sans JS = 4 panneaux visibles (test `js` qui retire `is-js`).
3. Étapes : ligne à `dashoffset` 1 avant, 0 après le scroll ; 3 cercles à scale 1 ; page Approche = même composant vertical.
4. Carte : contour et courbe tracés, 3 pastilles allumées avec leurs noms, positions relatives correctes (La Hulpe en haut à droite de Nivelles).
5. Parallaxe : `transform` d'un blob différent à deux positions de scroll ; aucun saut au refresh.
6. Traits : `scaleX` 0 puis 1 sur un titre entré.
7. `pnpm build` vert, hauteur de l'accueil mesurée et consignée.

## 12. Notes d'implémentation (2026-09-09)

- Étapes : la ligne SVG est un élément remplacé, ses dimensions sont
  explicites (`width: 66.68%` horizontal, `grid-row: 1 / 3` vertical) et le
  scrub finit à `top 45%` (en colonne, le 3e cercle s'allumait trop tard).
- Carte : liaison révélée par un `<mask>` tracé (le pointillé reste visible),
  courbe tangente à Court-Saint-Étienne, contour à 80 % d'opacité, lavis à
  60 % ; la carte est **collante** (`sticky`, 120 px) pendant qu'on parcourt
  les trois cartes compactes, via un conteneur de la page.
- Carrousel : règle sans-JS `.carrousel__scene { display: block }`, médaillon
  en teintes 35 % + ombre, onglet actif ombré.
- Parallaxe dans `gsap.matchMedia(DESKTOP_MQ)` ; `.headline--trait` isolé.
- Bandeau : `overflow: clip` (un focus clavier ne doit pas faire défiler le
  conteneur) et, au `:focus-within`, disposition statique repliée (la pause
  seule laissait la capsule focalisée hors champ sur petit écran).
- Carrousel : en `reduced-motion`, pas d'auto et bouton pause masqué ; les
  `tabpanel` n'ont pas de `tabindex` (ils contiennent un lien focalisable).
- Titre « Qui je suis » sorti du `data-reveal` pour recevoir son trait (le
  reveal porte sur la citation, les repères et les liens).

## 13. Hors périmètre

Photo du hero (le médaillon prend `src` quand elle arrive), bloc tarifs (attend la cliente), témoignages (déontologie), portraits ronds (photos des lieux à fournir), pages intérieures autres qu'Approche.
