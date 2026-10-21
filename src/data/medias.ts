// Médias de la seconde proposition (2026-10-20), servis depuis public/ en WebP (dimensions relues sur les fichiers).
// - `photos` : SES photos, en noir et blanc (son choix) : jamais colorisées, au plus une légère teinte CSS (≤ 10 %).
// - `ambiances.<x>` : images GÉNÉRÉES pour la direction x, trois en 4:5 et `piece` en 16:9 (tête de la page Cabinets).
//   Ce sont des illustrations d'atmosphère : jamais présentées ni légendées comme ses cabinets (« mon cabinet » interdit
//   à côté d'une image), `alt` = ceux d'ici.
// `sujet` : où se trouve le sujet dans l'image (pour poser le texte HORS du sujet et choisir object-position).

export interface Variante { src: string; largeur: number; hauteur: number }
export interface Media {
  /** Plus grande variante : `src` de repli de l'<img>. */
  src: string;
  /** Dimensions de la plus grande variante : attributs width/height (rapport exact, aucune déformation). */
  largeur: number;
  hauteur: number;
  /** Variantes de la plus petite à la plus grande (720/1200 ou 960/1920). */
  variantes: Variante[];
  alt: string;
  format: 'portrait' | '4:5' | '16:9';
  sujet: string;
}

const media = (format: Media['format'], variantes: Variante[], alt: string, sujet: string): Media => {
  const grande = variantes[variantes.length - 1];
  return { src: grande.src, largeur: grande.largeur, hauteur: grande.hauteur, variantes, alt, format, sujet };
};

/** Attribut `srcset` d'un média : « /a/carnet-720.webp 720w, /a/carnet-1200.webp 1200w ». */
export const srcset = (m: Media): string => m.variantes.map(v => `${v.src} ${v.largeur}w`).join(', ');

/** Une ambiance 4:5 de la direction x : 720 × 900 et 1200 × 1500. */
const ambiance45 = (x: string, nom: string, alt: string, sujet: string) => media('4:5', [
  { src: `/${x}/${nom}-720.webp`, largeur: 720, hauteur: 900 },
  { src: `/${x}/${nom}-1200.webp`, largeur: 1200, hauteur: 1500 },
], alt, sujet);

/** La pièce 16:9 de la direction x (tête de la page Cabinets) : 960 × 543 et 1920 × 1086. */
const piece = (x: string, alt: string, sujet: string) => media('16:9', [
  { src: `/${x}/piece-960.webp`, largeur: 960, hauteur: 543 },
  { src: `/${x}/piece-1920.webp`, largeur: 1920, hauteur: 1086 },
], alt, sujet);

/** Ses trois photos (portrait, noir et blanc). */
export const photos = {
  debout: media('portrait', [
    { src: '/photos/xenia-1-debout-720.webp', largeur: 720, hauteur: 960 },
    { src: '/photos/xenia-1-debout-1200.webp', largeur: 1200, hauteur: 1600 },
  ], 'Xénia van Outryve, debout, un ordinateur portable à la main', 'en pied, au centre-gauche ; fond blanc libre à droite'),
  canape: media('portrait', [
    { src: '/photos/xenia-3-canape-720.webp', largeur: 720, hauteur: 961 },
    { src: '/photos/xenia-3-canape-1200.webp', largeur: 1086, hauteur: 1449 },
  ], 'Xénia van Outryve, assise dans un canapé, souriante', 'assise au centre, visage dans le tiers supérieur ; étagère noire en haut à droite'),
  carnet: media('portrait', [
    { src: '/photos/xenia-4-carnet-720.webp', largeur: 720, hauteur: 958 },
    { src: '/photos/xenia-4-carnet-1200.webp', largeur: 1200, hauteur: 1597 },
  ], 'Xénia van Outryve, assise, un carnet sur les genoux', 'assise au centre, visage dans le tiers supérieur ; mur clair au-dessus'),
} as const;
export type IdPhoto = keyof typeof photos;

/** Les ambiances générées, quatre par direction. */
export const ambiances = {
  a: {
    carnet: ambiance45('a', 'carnet', 'Un carnet ouvert et un stylo sur une nappe bleu clair', 'carnet au centre ; plante en haut à droite ; nappe bleue tout autour'),
    chaise: ambiance45('a', 'chaise', 'Une chaise en bois et une petite table contre un mur bleu clair', 'chaise et table au centre-bas ; mur bleu libre en haut à gauche'),
    tasse: ambiance45('a', 'tasse', 'Une tasse de thé sur un rebord de fenêtre, au matin', 'tasse en bas au centre ; ciel et fenêtre au-dessus ; voilage à gauche'),
    piece: piece('a', 'Une pièce claire aux murs bleu pâle, un bureau et un fauteuil', 'bureau à gauche, fauteuil bleu à droite, fenêtre au centre ; mur bleu libre en haut'),
  },
  b: {
    fauteuil: ambiance45('b', 'fauteuil', 'Un fauteuil en lin près d’une grande fenêtre en arche', 'fauteuil en bas au centre-droit ; fenêtre à gauche ; mur sauge en haut'),
    olivier: ambiance45('b', 'olivier', 'Un rameau d’olivier dans un vase blanc, contre un mur vert sauge', 'vase et rameau au centre-droit ; mur sauge libre à gauche et en haut'),
    arche: ambiance45('b', 'arche', 'Une porte en arche entre deux pièces vert sauge', 'arche au centre-droit ; mur sauge libre à gauche'),
    piece: piece('b', 'Un salon vert sauge, un canapé en lin et une table basse', 'canapé et table basse en bas au centre, niche en arche au fond ; mur sauge en haut'),
  },
  c: {
    mur: ambiance45('c', 'mur', 'La lumière de l’après-midi sur un mur ocre, le coin d’un canapé', 'lumière sur le mur ocre en haut ; canapé en bas à gauche'),
    coussins: ambiance45('c', 'coussins', 'Des coussins rose et moutarde sur un canapé gris, un tapis à losanges', 'coussins en haut à gauche, canapé au centre, tapis en bas'),
    table: ambiance45('c', 'table', 'Une tasse de thé et un carnet sur une table basse en bois sombre', 'table basse au centre ; tapis autour'),
    piece: piece('c', 'Un salon chaleureux, un canapé gris, une lampe arc et un tapis à losanges', 'canapé en bas au centre, lampe arc à gauche du centre ; mur ocre en haut'),
  },
} as const;
