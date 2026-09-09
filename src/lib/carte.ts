/* La carte dessinée des cabinets : contour SIMPLIFIÉ du Brabant wallon (une
   évocation, pas une carte), la courbe qui relie les trois cabinets, et leurs
   positions dans le viewBox 0 0 400 240. Tout est figé : build reproductible. */
export const CONTOUR =
  'M18 128C20 119 31 106 40 96C49 86 60 76 70 70C80 64 89 62 100 58C111 54 123 45 135 44C147 43 159 53 170 52C181 51 188 38 200 36C212 34 228 38 240 42C252 46 262 57 275 58C288 59 305 50 320 48C335 46 354 41 365 44C376 47 384 57 385 66C386 75 378 88 372 100C366 112 358 129 350 140C342 151 333 161 322 168C311 175 297 177 285 182C273 187 262 191 250 196C238 201 227 210 215 212C203 214 191 205 180 205C169 205 162 214 150 214C138 214 122 210 110 206C98 202 90 196 80 190C70 184 59 175 50 168C41 161 33 157 28 150C23 143 16 137 18 128z';

/* Nivelles → Court-Saint-Étienne → La Hulpe */
export const LIAISON = 'M95 178 Q 150 174 198 157 Q 220 149 161 86';

export interface PointCarte { slug: string; nom: string; x: number; y: number; dx: number; dy: number; ancre: 'start' | 'middle' | 'end' }
export const POINTS: PointCarte[] = [
  { slug: 'nivelles', nom: 'Nivelles', x: 95, y: 178, dx: -12, dy: 5, ancre: 'end' },
  { slug: 'court-saint-etienne', nom: 'Court-Saint-Étienne', x: 198, y: 157, dx: 12, dy: 16, ancre: 'start' },
  { slug: 'la-hulpe', nom: 'La Hulpe', x: 161, y: 86, dx: 12, dy: -6, ancre: 'start' },
];
