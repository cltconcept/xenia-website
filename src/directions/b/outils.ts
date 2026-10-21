// Petites mises en forme de la direction B (jours, plages, adresses), à partir des données du socle.
import type { Cabinet, Jour, Plage } from '../../data/contenu';
import { plateformes } from '../../data/contenu';

export const majuscule = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ordreMoment: Record<Plage['moment'], number> = { matin: 0, 'journée': 1, 'après-midi': 2 };
export const triPlages = <T extends Plage>(plages: T[]) => [...plages].sort((a, b) => ordreMoment[a.moment] - ordreMoment[b.moment]);

/** « Lundi matin », « Mardi », « Vendredi après-midi » (la journée entière se lit dans les heures). */
export const jourEtMoment = (p: Plage) => majuscule(p.moment === 'journée' ? p.jour : `${p.jour} ${p.moment}`);
/** « 8 h – 13 h », « Toute la journée ». */
export const heures = (p: Plage) => majuscule(p.heures);

/** Les jours d'un cabinet en une ligne : « Lundi matin et vendredi après-midi », « Mardi et jeudi, toute la journée ». */
export function joursDuCabinet(c: Cabinet): string {
  const jour = (j: Jour) => j;
  if (c.plages.every(p => p.moment === 'journée')) {
    return majuscule(`${c.plages.map(p => jour(p.jour)).join(' et ')}, toute la journée`);
  }
  return majuscule(c.plages.map(p => p.moment === 'journée' ? p.jour : `${p.jour} ${p.moment}`).join(' et '));
}

export const adresseComplete = (c: Cabinet) => `${c.adresse}, ${c.codePostal} ${c.ville}`;
export const nomPlateforme = (c: Cabinet) => plateformes[c.plateforme].nom;

/** Dans le module de la semaine (le jour est déjà affiché) : « Matin · 8 h – 13 h », « Toute la journée ». */
export const momentEtHeures = (p: Plage) => p.moment === 'journée' ? majuscule(p.heures) : `${majuscule(p.moment)} · ${p.heures}`;

/** Typographie française : espace insécable (U+00A0) avant « ? : ; ! » (les polices n'ont pas l'espace fine). */
export const fr = (s: string) => s.replace(/ ([?:;!])/g, ' $1').replace(/La Hulpe/g, 'La Hulpe');
