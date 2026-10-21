// Les trois habillages de la seconde proposition (brief docs/forge/brief-directions.md, 2026-10-20). Retirés avec les deux non retenus.
export type IdDirection = 'a' | 'b' | 'c';
export interface Direction { id: IdDirection; lettre: 'A' | 'B' | 'C'; nom: string; intention: string }

export const directions: Direction[] = [
  { id: 'a', lettre: 'A', nom: 'Le carnet', intention: 'Posé et écrit : une page de carnet qu’on remplit ensemble, claire et aérée.' },
  { id: 'b', lettre: 'B', nom: 'Respirer', intention: 'De l’air et des courbes douces : la sauge, le lin, une arche pour entrer.' },
  { id: 'c', lettre: 'C', nom: 'Le salon', intention: 'Chaleureux comme chez soi : l’ocre, le rose et la lumière de l’après-midi.' },
];
export const idsDirections = directions.map(d => d.id);
export function direction(id: string): Direction {
  const d = directions.find(x => x.id === id);
  if (!d) throw new Error(`Direction inconnue : ${id}`);
  return d;
}
export const cheminDans = (id: IdDirection, chemin: string) => `/${id}${chemin.startsWith('/') ? chemin : `/${chemin}`}`;
