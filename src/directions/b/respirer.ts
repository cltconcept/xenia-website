// Direction B, Respirer : menu plein écran du téléphone, onglets de la semaine, apparitions douces, ombre de l'en-tête.
// Le hero (arche et rameau) est animé en CSS seul : rien ici ne conditionne son affichage.
import { activerApparitions, arreterDefilement, pieger, reprendreDefilement } from '../../lib/mouvement';

// ---------- Menu ----------
const bouton = document.querySelector<HTMLButtonElement>('[data-menu-bouton]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const libelle = bouton?.querySelector<HTMLElement>('[data-menu-libelle]');
let retirerPiege: (() => void) | null = null;

function ouvrirMenu() {
  if (!bouton || !menu) return;
  menu.hidden = false;
  bouton.setAttribute('aria-expanded', 'true');
  if (libelle) libelle.textContent = 'Fermer';
  arreterDefilement();
  retirerPiege = pieger(menu, [bouton]);
  menu.querySelector<HTMLElement>('a')?.focus();
}
function fermerMenu(rendreFocus = true) {
  if (!bouton || !menu || menu.hidden) return;
  menu.hidden = true;
  bouton.setAttribute('aria-expanded', 'false');
  if (libelle) libelle.textContent = 'Menu';
  reprendreDefilement();
  retirerPiege?.();
  retirerPiege = null;
  if (rendreFocus) bouton.focus();
}
if (bouton && menu) {
  bouton.addEventListener('click', () => (menu.hidden ? ouvrirMenu() : fermerMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { e.preventDefault(); fermerMenu(); } });
  // Un lien du menu ferme le panneau avant de suivre l'ancre ou la page.
  menu.addEventListener('click', e => { if ((e.target as HTMLElement).closest('a')) fermerMenu(false); });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) fermerMenu(false); });
}

// ---------- Ombre de l'en-tête au défilement ----------
const entete = document.querySelector<HTMLElement>('[data-entete]');
if (entete) {
  const maj = () => entete.classList.toggle('b-entete--ombre', window.scrollY > 8);
  maj();
  addEventListener('scroll', maj, { passive: true });
}

// ---------- Module de la semaine (tablist) ----------
for (const module of document.querySelectorAll<HTMLElement>('[data-semaine]')) {
  const onglets = [...module.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panneaux = onglets.map(o => document.getElementById(o.getAttribute('aria-controls') ?? ''));
  const choisir = (i: number, focus = false) => {
    onglets.forEach((o, k) => {
      const actif = k === i;
      o.setAttribute('aria-selected', String(actif));
      o.tabIndex = actif ? 0 : -1;
      const p = panneaux[k];
      if (p) p.hidden = !actif;
    });
    if (focus) onglets[i].focus();
  };
  onglets.forEach((o, i) => {
    o.addEventListener('click', () => choisir(i));
    o.addEventListener('keydown', e => {
      const n = onglets.length;
      let cible = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') cible = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') cible = (i - 1 + n) % n;
      else if (e.key === 'Home') cible = 0;
      else if (e.key === 'End') cible = n - 1;
      if (cible < 0) return;
      e.preventDefault();
      choisir(cible, true);
    });
  });
  // Jour courant (lundi = 1 … vendredi = 5) ; le week-end, on reste sur lundi.
  const j = new Date().getDay();
  const aujourdhui = j >= 1 && j <= 5 ? j - 1 : -1;
  if (aujourdhui >= 0) {
    const o = onglets[aujourdhui];
    o.dataset.estAujourdhui = '';
    o.querySelector<HTMLElement>('[data-aujourdhui]')?.removeAttribute('hidden');
    panneaux[aujourdhui]?.querySelector<HTMLElement>('[data-aujourdhui-titre]')?.removeAttribute('hidden');
  }
  choisir(Math.max(aujourdhui, 0));
}

// ---------- Apparitions douces ----------
activerApparitions();
