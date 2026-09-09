/* La première séance en 3 étapes — textes de la page Approche, source unique
   (frise de l'accueil + liste verticale d'Approche). */
export interface Etape { titre: string; desc: string }
export const ETAPES: Etape[] = [
  { titre: 'Vous arrivez comme vous êtes', desc: 'Pas besoin de préparer quoi que ce soit, ni d’avoir «\u00A0les bons mots\u00A0».' },
  { titre: 'On fait connaissance', desc: 'Ce qui vous amène, votre contexte, ce que vous attendez — et vos questions.' },
  { titre: 'On décide ensemble', desc: 'La fréquence, les priorités, la manière de travailler : rien n’est figé d’avance.' },
];
