// Présentoir : ouverture, panneaux actifs et signatures des trois directions. Aucune vidéo dans cette proposition.
// - Ouverture : html.pr-intro est posé avant le rendu par index.astro (une fois par onglet). Les entrées sont en CSS ;
//   ce module joue ensuite la signature de chaque panneau visible, puis retire pr-intro quand tout est posé (≤ 2,5 s).
//   « Passer l'introduction », un clic, une touche ou le défilement l'interrompent : tout se pose aussitôt.
// - Panneaux : au survol (souris) ou au focus, le panneau devient actif (.est-actif : il s'élargit en CSS) et sa
//   signature se rejoue. Sur téléphone, un panneau encore hors de l'écran joue la sienne à son premier passage.
// - Signatures : A, le stylo écrit Xénia ; B, le rameau se dessine le long de l'arche ; C, la forme respire (son
//   tracé est interpolé ici, la forme ocre et le contour suivent en CSS).
// Sous « réduire les animations » : rien ne se joue, tout est posé.

type Id = 'a' | 'b' | 'c';

/** Début de la signature de chaque panneau pendant l'ouverture (ms après le début des animations CSS). */
const DEBUT_OUVERTURE: Record<Id, number> = { a: 1050, b: 1150, c: 1250 };
/** Durée d'une signature (ms) : première fois, puis quand elle se rejoue. */
const DUREE: Record<Id, { premiere: number; rejoue: number }> = {
  a: { premiere: 1350, rejoue: 1350 },
  b: { premiere: 1200, rejoue: 1200 },
  c: { premiere: 1200, rejoue: 1600 },
};

interface Signatures {
  armer(p: HTMLElement): void;
  jouer(p: HTMLElement): void;
  poser(p: HTMLElement): void;
}

export function demarrerPresentoir(): void {
  const racine = document.querySelector<HTMLElement>('[data-pr]');
  if (!racine) return;
  const panneaux = [...racine.querySelectorAll<HTMLElement>('[data-pr-panneau]')];
  const mouvement = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Le module prend la main : les signatures ne dépendent plus de l'attente posée en CSS pendant l'ouverture.
  document.documentElement.classList.add('pr-pilote');

  const signatures = creerSignatures(racine, mouvement);
  const enOuverture = ouverture(racine, panneaux, signatures, mouvement);
  premierPassage(panneaux, signatures, mouvement, enOuverture);
  activerPanneaux(panneaux, signatures);
}

/* ── Signatures ─────────────────────────────────────────────────────────────────────────────────────────────── */

function creerSignatures(racine: HTMLElement, mouvement: boolean): Signatures {
  const minuteurs = new Map<HTMLElement, number>();
  const forme = racine.querySelector<SVGPathElement>('[data-pr-forme]');
  const nombre = /-?\d*\.?\d+/g;
  const depart = forme?.dataset.depart?.match(nombre)?.map(Number) ?? [];
  const arrivee = forme?.dataset.arrivee?.match(nombre)?.map(Number) ?? [];
  const morceaux = (forme?.dataset.arrivee ?? '').split(nombre);
  const morphable = !!forme && depart.length > 0 && depart.length === arrivee.length;
  let image = 0;

  // e = 0 : forme de départ (resserrée) ; e = 1 : forme de repos (celle de son accueil).
  const tracer = (e: number) => {
    if (!morphable) return;
    let d = morceaux[0];
    for (let i = 0; i < arrivee.length; i++) d += (depart[i] + (arrivee[i] - depart[i]) * e).toFixed(4) + morceaux[i + 1];
    forme!.setAttribute('d', d);
  };
  const adoucir = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // Première fois : départ → repos ; ensuite, une respiration : repos → départ → repos.
  const respirer = (premiere: boolean, duree: number) => {
    if (!morphable) return;
    cancelAnimationFrame(image);
    let debut = 0;
    const pas = (maintenant: number) => {
      if (!debut) debut = maintenant;
      const t = Math.min(1, (maintenant - debut) / duree);
      tracer(premiere ? adoucir(t) : 1 - adoucir(t < 0.5 ? t * 2 : 2 - t * 2));
      if (t < 1) image = requestAnimationFrame(pas);
    };
    image = requestAnimationFrame(pas);
  };

  const idDe = (p: HTMLElement) => p.dataset.prPanneau as Id;

  const poser = (p: HTMLElement) => {
    clearTimeout(minuteurs.get(p));
    minuteurs.delete(p);
    p.classList.remove('pr-arme', 'pr-joue', 'pr-premiere');
    delete p.dataset.prJoue;
    if (idDe(p) === 'c') { cancelAnimationFrame(image); tracer(1); }
  };

  return {
    armer(p) {
      if (!mouvement || p.dataset.prJoue) return;
      p.classList.add('pr-arme');
      if (idDe(p) === 'c') tracer(0);
    },
    jouer(p) {
      if (!mouvement || p.dataset.prJoue) return;
      const id = idDe(p);
      const premiere = p.classList.contains('pr-arme');
      const duree = premiere ? DUREE[id].premiere : DUREE[id].rejoue;
      p.dataset.prJoue = '1';
      p.classList.remove('pr-joue', 'pr-premiere');
      void p.offsetWidth; // les animations CSS repartent de zéro
      p.classList.add('pr-joue');
      if (premiere) p.classList.add('pr-premiere');
      p.classList.remove('pr-arme');
      if (id === 'c') respirer(premiere, duree);
      minuteurs.set(p, window.setTimeout(() => poser(p), duree + 50));
    },
    poser,
  };
}

const estVisible = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight * 0.85;
};

/* ── Ouverture ──────────────────────────────────────────────────────────────────────────────────────────────── */

/** Renvoie les panneaux joués par l'ouverture (vide s'il n'y en a pas). */
function ouverture(racine: HTMLElement, panneaux: HTMLElement[], signatures: Signatures, mouvement: boolean): Set<HTMLElement> {
  const html = document.documentElement;
  const joues = new Set<HTMLElement>();
  if (!html.classList.contains('pr-intro')) return joues;

  const passer = racine.querySelector<HTMLButtonElement>('[data-pr-passer]');
  const principal = racine.querySelector<HTMLElement>('[data-pr-panneaux]');
  const minuteurs: number[] = [];
  let fini = false;

  // Temps zéro : le départ des animations CSS de l'ouverture (et non le début de la navigation).
  const animations = document.getAnimations().filter(a => {
    const nom = (a as CSSAnimation).animationName;
    return typeof nom === 'string' && nom.startsWith('pr-');
  });
  const maintenant = () => Number(document.timeline.currentTime ?? performance.now());
  const departs = animations.map(a => a.startTime).filter((t): t is number => typeof t === 'number');
  const zero = departs.length ? Math.min(...departs) : maintenant();

  let finSignatures = 0;
  if (mouvement) {
    for (const p of panneaux) {
      if (!estVisible(p)) continue;
      const id = p.dataset.prPanneau as Id;
      joues.add(p);
      signatures.armer(p);
      const attente = Math.max(0, DEBUT_OUVERTURE[id] - (maintenant() - zero));
      minuteurs.push(window.setTimeout(() => signatures.jouer(p), attente));
      finSignatures = Math.max(finSignatures, attente + DUREE[id].premiere);
    }
  }

  const terminer = (interrompue: boolean, versContenu = false) => {
    if (fini) return;
    fini = true;
    const avaitFocus = document.activeElement === passer;
    minuteurs.forEach(m => clearTimeout(m));
    if (interrompue) joues.forEach(p => signatures.poser(p));
    html.classList.remove('pr-intro');
    // Le bouton disparaît : le focus va au début des panneaux (Tab mène alors à « Voir la direction » A).
    if (avaitFocus || versContenu) principal?.focus({ preventScroll: true });
    removeEventListener('wheel', interrompre);
    removeEventListener('touchmove', interrompre);
    removeEventListener('pointerdown', surPointeur);
    removeEventListener('keydown', surTouche, true);
  };
  const interrompre = () => terminer(true);
  const surPointeur = (e: PointerEvent) => { if (!passer?.contains(e.target as Node)) terminer(true); };
  const surTouche = (e: KeyboardEvent) => {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    // Entrée ou Espace sur « Passer l'introduction » : le clic s'en charge.
    if (e.target === passer && (e.key === 'Enter' || e.key === ' ')) return;
    terminer(true);
  };

  passer?.addEventListener('click', () => terminer(true, true));
  addEventListener('wheel', interrompre, { passive: true });
  addEventListener('touchmove', interrompre, { passive: true });
  addEventListener('pointerdown', surPointeur);
  addEventListener('keydown', surTouche, true);

  // Fin naturelle : les entrées CSS terminées (celles qu'on annule rejettent) et les signatures jouées.
  const signaturesJouees = new Promise<void>(r => minuteurs.push(window.setTimeout(r, finSignatures + 60)));
  Promise.all([...animations.map(a => a.finished), signaturesJouees]).then(() => terminer(false), () => { /* interrompue */ });
  return joues;
}

/* ── Premier passage à l'écran (téléphone, tablette) ────────────────────────────────────────────────────────── */

function premierPassage(panneaux: HTMLElement[], signatures: Signatures, mouvement: boolean, dejaJoues: Set<HTMLElement>): void {
  if (!mouvement || !('IntersectionObserver' in window)) return;
  const attente = panneaux.filter(p => !dejaJoues.has(p) && !estVisible(p));
  if (!attente.length) return;
  const observateur = new IntersectionObserver(entrees => {
    for (const e of entrees) {
      if (!e.isIntersecting) continue;
      observateur.unobserve(e.target);
      signatures.jouer(e.target as HTMLElement);
    }
  }, { threshold: 0.35 });
  for (const p of attente) {
    signatures.armer(p);
    observateur.observe(p);
  }
}

/* ── Panneaux actifs ────────────────────────────────────────────────────────────────────────────────────────── */

function activerPanneaux(panneaux: HTMLElement[], signatures: Signatures): void {
  let actif: HTMLElement | null = null;

  const activer = (p: HTMLElement | null) => {
    if (actif === p) return;
    actif?.classList.remove('est-actif');
    actif = p;
    if (!p) return;
    p.classList.add('est-actif');
    signatures.jouer(p);
  };

  for (const p of panneaux) {
    p.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') activer(p); });
    p.addEventListener('pointerleave', e => {
      if (e.pointerType === 'mouse' && actif === p && !p.contains(document.activeElement)) activer(null);
    });
    p.addEventListener('focusin', () => activer(p));
    p.addEventListener('focusout', e => {
      if (!p.contains(e.relatedTarget as Node | null) && !p.matches(':hover')) activer(null);
    });
  }

  // Retour par le bouton Précédent (page restaurée du cache) : aucun panneau ne reste élargi.
  addEventListener('pageshow', e => { if (e.persisted) activer(null); });
}
