// Mécanique de la direction A Le carnet, sans dépendance : apparitions douces (et traits soulignés des titres),
// filet de l'en-tête au défilement, menu plein écran du téléphone, intercalaires du module Par où commencer ?.
// Sans JS, tout reste lisible : le menu renvoie au pied, les quatre panneaux du module sont empilés (voir a.css).
import { activerApparitions, arreterDefilement, mouvementReduit, pieger, reprendreDefilement } from '../../lib/mouvement';

activerApparitions();

// ——— En-tête collant : un filet apparaît dès que la page défile ———
const entete = document.querySelector<HTMLElement>('[data-entete]');
let attente = false;
const suivreEntete = () => { attente = false; entete?.classList.toggle('a-entete--defile', scrollY > 4); };
addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(suivreEntete); } }, { passive: true });
suivreEntete();

// ——— Menu plein écran (≤ 900 px) : focus gardé, Échap ferme, défilement bloqué ———
const bouton = document.querySelector<HTMLButtonElement>('[data-menu-bouton]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const mot = document.querySelector<HTMLElement>('[data-menu-mot]');
let libererPiege: (() => void) | null = null;
const ouvert = () => bouton?.getAttribute('aria-expanded') === 'true';
function basculerMenu(ouvrir: boolean, rendreFocus = false): void {
  if (!bouton || !menu) return;
  bouton.setAttribute('aria-expanded', String(ouvrir));
  if (mot) mot.textContent = ouvrir ? 'Fermer' : 'Menu';
  menu.hidden = !ouvrir;
  document.body.classList.toggle('a-menu-ouvert', ouvrir);
  if (ouvrir) {
    arreterDefilement();
    libererPiege = pieger(menu, [bouton]);
    menu.querySelector<HTMLElement>('a[href]')?.focus();
  } else {
    reprendreDefilement();
    libererPiege?.();
    libererPiege = null;
    if (rendreFocus) bouton.focus();
  }
}
bouton?.addEventListener('click', () => basculerMenu(!ouvert(), true));
// Un lien du menu le ferme ; l'ancre mène ensuite à la section.
menu?.addEventListener('click', e => { if ((e.target as Element).closest('a')) basculerMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ouvert()) { e.preventDefault(); basculerMenu(false, true); } });
matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches && ouvert()) basculerMenu(false); });

// ——— Module Par où commencer ? : intercalaires (tablist vertical) ———
const classeur = document.querySelector<HTMLElement>('[data-orientation]');
if (classeur) {
  const onglets = [...classeur.querySelectorAll<HTMLButtonElement>('[data-onglet]')];
  const panneaux = [...classeur.querySelectorAll<HTMLElement>('[data-panneau]')];
  for (const p of panneaux) {
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('tabindex', '0');
    p.setAttribute('aria-labelledby', `a-onglet-${p.dataset.panneau}`);
  }
  const choisir = (i: number, focus = false) => {
    onglets.forEach((o, j) => {
      const actif = j === i;
      o.setAttribute('aria-selected', String(actif));
      o.tabIndex = actif ? 0 : -1;
      panneaux[j].hidden = !actif;
    });
    if (focus) onglets[i].focus();
  };
  classeur.classList.add('a-classeur--actif');
  choisir(Math.max(0, onglets.findIndex(o => o.getAttribute('aria-selected') === 'true')));

  onglets.forEach((o, i) => {
    o.addEventListener('click', () => {
      choisir(i);
      // Sur téléphone, le panneau est sous les intercalaires : l'amener à l'écran s'il est trop bas.
      if (!matchMedia('(max-width: 760px)').matches) return;
      const p = panneaux[i];
      requestAnimationFrame(() => {
        if (p.getBoundingClientRect().top > innerHeight * 0.75) p.scrollIntoView({ behavior: mouvementReduit() ? 'auto' : 'smooth', block: 'start' });
      });
    });
    o.addEventListener('keydown', e => {
      const n = onglets.length;
      const cible = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
      if (cible === undefined) return;
      e.preventDefault();
      choisir((cible + n) % n, true);
    });
  });
}
