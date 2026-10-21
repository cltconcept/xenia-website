#!/usr/bin/env node
// Copie les polices listées dans polices.json (Fontsource, licence SIL OFL, WOFF2, sous-ensembles latin + latin-ext)
// dans public/fonts/<id>/ et écrit, pour chaque famille, les @font-face prêts à l'emploi dans
// src/styles/polices/<id>.css. Aucune requête externe au runtime. Reproductible : `npm run polices`.
//
// Format d'une entrée de polices.json :
//   { "id": "zilla-slab", "nom": "Zilla Slab", "pour": "a", "paquet": "@fontsource/zilla-slab",
//     "styles": [["600", "normal"], ["700", "italic"]] }
//   Police variable (paquet @fontsource-variable/…) : "variable": true, "styles": [["wght", "normal"]] (ou "italic")
//   → un seul fichier par sous-ensemble, plage de graisses relue dans le CSS de Fontsource.
// Le nom de famille déclaré est `nom` (sans « Variable ») : font-family: 'Public Sans'.
// Le paquet doit être installé (npm i -D -E <paquet>).
//   Axes chasse + graisse (paquet qui fournit standard.css) : "styles": [["standard", "normal"]] → font-stretch recopié.
//   Option "sousEnsembles": ["latin"] : seulement ces sous-ensembles (le latin couvre le français, œ et espaces fines compris).
import { copyFile, mkdir, readFile, writeFile, access } from 'node:fs/promises';

const SOUS_ENSEMBLES = ['latin', 'latin-ext'];
const familles = JSON.parse(await readFile('polices.json', 'utf8'));
if (!Array.isArray(familles)) throw new Error('polices.json : tableau attendu');
if (!familles.length) { console.log('polices.json est vide : aucune police copiée.'); process.exit(0); }

/** Bloc CSS Fontsource commençant par le commentaire « /* <cle> *\/ » : unicode-range et font-weight. */
async function bloc(fichierCss, cle) {
  const css = await readFile(fichierCss, 'utf8');
  const debut = css.indexOf(`/* ${cle} */`);
  if (debut < 0) throw new Error(`bloc « ${cle} » introuvable dans ${fichierCss}`);
  const morceau = css.slice(debut, css.indexOf('}', debut));
  const plage = morceau.match(/unicode-range:\s*([^;]+);/)?.[1].trim();
  const graisse = morceau.match(/font-weight:\s*([^;]+);/)?.[1].trim();
  // Axe de chasse (fichiers « standard » : wdth + wght) : plage font-stretch recopiée si présente.
  const chasse = morceau.match(/font-stretch:\s*([^;]+);/)?.[1].trim();
  if (!plage || !graisse) throw new Error(`unicode-range ou font-weight absent : ${fichierCss} (${cle})`);
  return { plage, graisse, chasse };
}

await mkdir('src/styles/polices', { recursive: true });
for (const f of familles) {
  const racine = `node_modules/${f.paquet}`;
  await access(racine).catch(() => { throw new Error(`Paquet absent : ${f.paquet} (npm i -D -E ${f.paquet})`); });
  await mkdir(`public/fonts/${f.id}`, { recursive: true });
  const blocs = [`/* ${f.nom} (direction ${String(f.pour).toUpperCase()}) — Fontsource ${f.paquet}, SIL OFL. Généré par scripts/copier-polices.mjs depuis polices.json. */`];
  for (const [poids, style] of f.styles) {
    for (const sous of (f.sousEnsembles ?? SOUS_ENSEMBLES)) {
      // Statique : zilla-slab-latin-600-normal ; variable : public-sans-latin-wght-normal (poids = axe).
      const cle = `${f.id}-${sous}-${poids}-${style}`;
      const nom = `${cle}.woff2`;
      const source = `${racine}/files/${nom}`;
      await access(source).catch(() => { throw new Error(`Fichier absent : ${source}`); });
      await copyFile(source, `public/fonts/${f.id}/${nom}`);
      // CSS Fontsource : 600.css / 600-italic.css (statique) ou wght.css / wght-italic.css (variable).
      const css = `${racine}/${poids}${style === 'italic' ? '-italic' : ''}.css`;
      const { plage, graisse, chasse } = await bloc(css, cle);
      blocs.push(`@font-face {
  font-family: '${f.nom}';
  font-style: ${style};
  font-weight: ${graisse};${chasse ? `
  font-stretch: ${chasse};` : ''}
  font-display: swap;
  src: url('/fonts/${f.id}/${nom}') format('woff2');
  unicode-range: ${plage};
}`);
    }
  }
  await writeFile(`src/styles/polices/${f.id}.css`, blocs.join('\n') + '\n');
  console.log(`${f.nom} (${f.pour}) : ${f.styles.length} style(s) × ${(f.sousEnsembles ?? SOUS_ENSEMBLES).length} sous-ensembles → public/fonts/${f.id}/, src/styles/polices/${f.id}.css`);
}
