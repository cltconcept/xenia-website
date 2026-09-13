/* « Qui je suis » — les 3 repères de l'accueil (sortis d'index.astro), un picto
   et un pétale chacun (spec 2026-09-13 §6). */
export interface Repere { titre: string; desc: string; icone: string; petale: 'rose' | 'sage' }
export const REPERES: Repere[] = [
  { titre: 'Intégrative', desc: 'Des outils choisis pour vous, pas une méthode unique.', icone: 'outils', petale: 'rose' },
  { titre: 'Corps et esprit', desc: 'Sommeil, alimentation, mouvement : on s’en occupe aussi.', icone: 'coeur-feuille', petale: 'sage' },
  { titre: 'À votre rythme', desc: 'Vos besoins fixent le cap, sans jugement.', icone: 'sablier', petale: 'rose' },
];
