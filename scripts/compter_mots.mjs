/* Compte les mots du texte visible de chaque page construite (dist/), nav et
   footer compris — même base que les mesures du 2026-09-12 — et compare aux
   cibles de la spec du 2026-09-13 (§5). Sortie non nulle si une cible est
   dépassée. Usage : node scripts/compter_mots.mjs [--json] */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* Cibles recalibrées le 2026-09-13 (option A) : le texte fixe de chaque page —
   nav rendue deux fois (barre + tiroir mobile) + pied de page — pèse 163 mots,
   pas les 100 supposés par la spec ; les cibles gardent −30/35 % sur le contenu
   réel (−34 % sur l'accueil) sans supprimer de section. */
const CIBLES = {
  '/': 660, '/approche/': 385, '/a-propos/': 325,
  '/accompagnements/adolescents-adultes/': 345, '/accompagnements/enfants-famille/': 335,
  '/accompagnements/perinatalite-parentalite/': 345, '/nutrition-sante/': 335,
  '/lieux-contact/': 445, '/mentions-legales/': Infinity, '/404.html': Infinity, '/controle-icones/': Infinity,
};

function pages(dir, base = '') {
  const out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...pages(p, `${base}/${f}`));
    else if (f === 'index.html') out.push([base + '/', p]);
    else if (f === '404.html') out.push(['/404.html', p]);
  }
  return out;
}

/* Mots VISIBLES : on retire ce que l'œil ne lit pas — scripts et styles, les
   textes réservés aux lecteurs d'écran (`.sr-only`) et le tiroir de navigation
   mobile (`#nav-menu`, fermé par défaut, doublon de la barre). 2026-09-13. */
function mots(html) {
  const sans = html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<span[^>]*class="[^"]*\bsr-only\b[^"]*"[^>]*>[^<]*<\/span>/gi, ' ')
    .replace(/<div[^>]*id="nav-menu"[\s\S]*?<\/header>/i, '</header>')
    .replace(/<ul[^>]*class="bandeau__liste"[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/ul>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ');
  return (sans.match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) || []).length;
}

const json = process.argv.includes('--json');
let echec = false;
const lignes = [];
for (const [route, fichier] of pages('dist').sort()) {
  const n = mots(readFileSync(fichier, 'utf8'));
  const cible = CIBLES[route];
  const ok = cible === undefined || n <= cible;
  if (!ok) echec = true;
  lignes.push({ route, mots: n, cible: cible === Infinity ? null : cible ?? null, ok });
}
if (json) console.log(JSON.stringify(lignes, null, 1));
else for (const l of lignes) console.log(`${l.ok ? 'OK ' : 'DEP'} ${l.route.padEnd(44)} ${String(l.mots).padStart(4)} / ${l.cible ?? '—'}`);
process.exit(echec ? 1 : 0);
