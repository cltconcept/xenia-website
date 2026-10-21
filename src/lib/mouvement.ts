// Petits utilitaires d'accessibilité et de mouvement discret, sans dépendance (brief : ni GSAP, ni Lenis, ni parallaxe,
// ni épinglage, ni transition de page, ni vidéo). À importer depuis le script d'un habillage (côté navigateur).
export const mouvementReduit = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Préférence « réduire les animations » lue au chargement du module (false hors navigateur). */
export const REDUIT: boolean = typeof matchMedia === 'function' && mouvementReduit();
export const economieDonnees = (): boolean => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
/** Écran tactile ou sans survol fiable. */
export const sansSurvol = (): boolean => matchMedia('(hover: none), (pointer: coarse)').matches;

/** Bloque le défilement (menu plein écran) ; `reprendreDefilement()` le rend. */
export function arreterDefilement(): void { document.documentElement.classList.add('defilement-arrete'); }
export function reprendreDefilement(): void { document.documentElement.classList.remove('defilement-arrete'); }

const FOCALISABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * Garde la tabulation dans `conteneur` (menu plein écran ouvert) : Tab sur le dernier élément revient au premier,
 * Maj+Tab sur le premier va au dernier. `exclus` : éléments hors du conteneur à inclure dans le cycle (le bouton
 * « Menu » qui ferme, par exemple). Renvoie la fonction qui retire le piège.
 */
export function pieger(conteneur: HTMLElement, exclus: HTMLElement[] = []): () => void {
  const surTouche = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const elements = [...exclus, ...conteneur.querySelectorAll<HTMLElement>(FOCALISABLES)]
      .filter(el => !el.hidden && el.getClientRects().length > 0);
    if (!elements.length) return;
    const premier = elements[0], dernier = elements[elements.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  };
  document.addEventListener('keydown', surTouche);
  return () => document.removeEventListener('keydown', surTouche);
}

/**
 * Apparition discrète des éléments `[data-apparait]` à l'entrée dans l'écran : la classe `visible` est posée une fois
 * (l'habillage écrit le CSS : opacité + translation de 12 à 16 px, ≤ 0,5 s, et seulement sous `html.js`). Sans JS,
 * mouvement réduit ou sans IntersectionObserver : tout est visible d'emblée.
 */
export function activerApparitions(racine: ParentNode = document): void {
  const els = [...racine.querySelectorAll<HTMLElement>('[data-apparait]')];
  if (mouvementReduit() || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entrees => {
    for (const e of entrees) if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}
