// Petits utilitaires de mise en page de la direction A (aucun texte ajouté : on met en forme ceux de contenu.ts).
import { cabinets, plateformes, type Cabinet, type Plage } from '../../data/contenu';
import type { NomIcone } from './icones';

/** Espace insécable (U+00A0) avant ? : ; ! et après n° : les polices n'ont pas l'espace fine (U+202F). */
export const insecables = (t: string): string => t
  .replace(/ ([?:;!])/g, ' $1').replace(/n° /g, 'n° ')
  // Jamais de coupure au trait d'union de ces deux mots courts (gluon U+2060 après le trait).
  .replace(/\b(e|rendez)-(mail|vous)\b/gi, '$1-⁠$2');

/** Le numéro de téléphone sans coupure de ligne. */
export const sansCoupure = (t: string): string => t.replace(/ /g, ' ');

const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Lundi matin, Mardi (journée entière) : le jour et le moment d'une plage. */
export const jourMoment = (p: Plage): string => majuscule(p.moment === 'journée' ? p.jour : `${p.jour} ${p.moment}`);

/** Toute la journée ou 8 h – 13 h. */
export const heures = (p: Plage): string =>
  majuscule(p.heures).replace(/(\d) h/g, '$1 h').replace(/h (\d)/g, 'h $1').replace(/ – /g, ' – ');

/** Les jours d'un cabinet en une ligne : lundi matin et vendredi après-midi, mardi et jeudi, toute la journée. */
export const joursEnLigne = (c: Cabinet): string => {
  const et = (l: string[]) => l.length > 1 ? `${l.slice(0, -1).join(', ')} et ${l[l.length - 1]}` : l[0];
  if (c.plages.every(p => p.moment === 'journée')) return `${et(c.plages.map(p => p.jour))}, toute la journée`;
  return et(c.plages.map(p => p.moment === 'journée' ? `${p.jour} (toute la journée)` : `${p.jour} ${p.moment}`));
};

/** Nom affiché de la plateforme d'un cabinet. */
export const nomPlateforme = (c: Cabinet): string => plateformes[c.plateforme].nom;

/** L'icône de chaque accompagnement (et de la porte du module qui y mène). */
export const iconeDe: Record<string, NomIcone> = {
  'adolescents-adultes': 'personnes',
  'perinatalite-parentalite': 'landau',
  'enfants-famille': 'cerfVolant',
  'nutrition-sante': 'pomme',
};

export { cabinets };
