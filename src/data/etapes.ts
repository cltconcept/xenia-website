/* La première séance en 3 étapes — source unique (frise de l'accueil + liste
   verticale d'Approche). desc ≤ 12 mots, `icone` = picto du cercle (spec 2026-09-13). */
export interface Etape { titre: string; desc: string; icone: string }
export const ETAPES: Etape[] = [
  { titre: 'Vous arrivez comme vous êtes', desc: 'Rien à préparer, pas de «\u00A0bons mots\u00A0» à trouver.', icone: 'porte' },
  { titre: 'On fait connaissance', desc: 'Ce qui vous amène, votre contexte, vos questions.', icone: 'bulle' },
  { titre: 'On décide ensemble', desc: 'Fréquence, priorités, façon de travailler : rien n’est figé.', icone: 'carnet' },
];
