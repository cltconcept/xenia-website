#!/usr/bin/env node
// Astro copie dans dist/_astro l'original de chaque image importée, même quand seules ses variantes
// optimisées sont servies. On retire les originaux qu'aucun fichier texte de la sortie ne référence.
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
const dist = path.resolve(process.env.DIST ?? 'dist');
const fichiers = [];
const parcourir = async dossier => {
  for (const e of await readdir(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) await parcourir(p); else fichiers.push(p);
  }
};
await parcourir(dist);
const textes = (await Promise.all(fichiers.filter(f => /\.(html|css|js|xml|txt|json|webmanifest)$/.test(f)).map(f => readFile(f, 'utf8')))).join('\n');
let n = 0, octets = 0;
for (const f of fichiers.filter(f => f.includes(`${path.sep}_astro${path.sep}`) && /\.(jpe?g|png|webp)$/i.test(f))) {
  if (textes.includes(path.basename(f))) continue;
  octets += (await stat(f)).size; await rm(f); n++;
}
console.log(`Originaux non référencés retirés : ${n} (${(octets / 1e6).toFixed(1)} Mo)`);
