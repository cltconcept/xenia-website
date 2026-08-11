# Design system — Xénia Van Outryve

> Concept : **« L'éclaircie »** — le moment où la lumière revient après une période
> sombre. Le site respire, littéralement.

## Ce que la cliente a demandé (mail + moodboard du 27/07/2026)

- « Épuré, peps, pas trop chargé, lumineux, qui donne envie »
- « Quelque chose de pas trop “carré”, avec de l'espace pour donner cette envie
  de respirer et prendre soin de soi »
- « J'aime bien ce style de dégradé et l'effet de transparence »
- Couleurs : carte blanche. Logo : faire une proposition.
- 3 références fournies : pastels lumineux, formes organiques, serif élégante.

## Pourquoi pas le défaut du genre

Le site « psy » générique = crème #F4F1EA + serif + terracotta (la réf 3 de la
cliente, précisément). On ne le refait pas. La direction vient de ses deux autres
références et de ses mots : **dégradé lumineux + transparence + organique**.
L'accent n'est pas terracotta mais **framboise** — le « peps » demandé, cohérent
santé/vitalité, inédit dans le secteur.

## Palette

| Token | Hex | Rôle |
|---|---|---|
| `--ivory` | `#FDFBF8` | Fond, lumineux chaud |
| `--ink` | `#43324B` | Texte — aubergine profonde, jamais noir |
| `--muted` | `#7A6B82` | Texte secondaire gris-mauve |
| `--framboise` | `#C13D63` | Accent CTA (texte blanc : contraste ≈ 5,2:1) |
| `--sage` | `#5E8E75` | Accent secondaire (nutrition & santé) |
| Aurore | `#FFD9C4` `#F6C8DB` `#DFD2F4` `#C9E9DE` | Dégradés pêche → rose → lilas → eau |

## Typographies

- **Display : Fraunces Variable** (axes SOFT/WONK, optical sizing) — serif
  chaleureuse, à personnalité. Les mots pivots passent en *italique* Fraunces.
- **Body : Hanken Grotesk Variable** — humaniste, très lisible.

## Signature

**L'éclaircie, jouée à l'ouverture** : le hero raconte l'histoire du site en
~3 secondes de chorégraphie GSAP — la page s'ouvre **voilée** (ce qui pèse),
la lumière **revient** au rythme d'une respiration (le halo s'allume, le voile
se dissout), les **pétales du logo** rejoignent l'aurore, les **mots se
lèvent** de leurs masques, et un **trait de pinceau** (SVG tracé, dégradé
framboise→rose) souligne « mieux-être durable ». C'est la promesse
thérapeutique, incarnée : on n'efface pas ce qui pèse, on laisse revenir la
lumière.

**Le halo qui respire** : le dégradé radial du hero s'étend et se rétracte sur
un cycle de ~7 s (inspiration ~3 s, expiration ~4 s — rythme de cohérence
cardiaque), décliné en pastille dans le footer.

Garde-fous : sans JS ou en `prefers-reduced-motion`, le hero est complet et
statique (la classe `js-intro` n'est jamais posée) ; un timeout de 3 s lève le
voile si GSAP n'arrive pas ; GSAP reste en import dynamique.

Détails d'appui (quiets) : séparateurs de sections en vague organique SVG,
cartes en verre dépoli sur fond d'aurore (la « transparence » demandée),
surlignage organique tracé sous les italiques.

## Logo (proposition)

Deux pétales translucides qui se croisent (rose × eau) : leur recouvrement
dessine une amande aubergine — **la rencontre** (thérapeutique, parent-enfant,
corps-esprit). Le X de Xénia, sans le dire. Wordmark Fraunces.

## Interdits

- Pas de noir pur, pas de blanc pur, pas d'angles vifs (radius ≥ 24 px).
- Une seule action principale par écran : prendre rendez-vous.
- GSAP/Lenis en import différé uniquement (jamais statique — cf. dentalexpert).
- Breakpoints canoniques : 480 · 600 · 960 · 1024 (JS).
