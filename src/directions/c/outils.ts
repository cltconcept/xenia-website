// Petits utilitaires de rendu de la direction C (côté serveur).
import type { Cabinet, Plage } from '../../data/contenu';
import { plateformes } from '../../data/contenu';

const INSECABLE = '\u00A0';

/** Typographie française : espace insécable avant « : ; ? ! », après « n° », entre un nombre et « h ». */
export const typo = (texte: string): string =>
  texte
    .replace(/ ([:;?!])/g, `${INSECABLE}$1`)
    .replace(/n° /g, `n°${INSECABLE}`)
    .replace(/(\d) h\b/g, `$1${INSECABLE}h`)
    .replace(/ – /g, `${INSECABLE}– `)
    // Mots composés courts jamais coupés au trait d'union (gluon U+2060).
    .replace(/\b(e|post|bien)-(?=\p{L})/gu, '$1-\u2060');

const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** « Lundi matin », « Mardi » (journée entière). */
export const jourEtMoment = (p: Plage): string => (p.moment === 'journée' ? majuscule(p.jour) : `${majuscule(p.jour)} ${p.moment}`);

/** « 8 h – 13 h », « toute la journée ». */
export const heures = (p: Plage): string => typo(p.heures);

/** Nom de la plateforme de rendez-vous d'un cabinet. */
export const plateforme = (c: Cabinet): string => plateformes[c.plateforme].nom;

/** Lien vers une ancre de l'accueil, depuis l'accueil (« #x ») ou depuis la page Cabinets (« /c/#x »). */
export const ancre = (page: 'accueil' | 'cabinets', id: string): string => (page === 'accueil' ? id : `/c/${id}`);

/** Le numéro sans retour à la ligne. */
export const numero = (tel: string): string => tel.replace(/ /g, INSECABLE);
