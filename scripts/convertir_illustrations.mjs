/* Convertit les PNG Higgsfield (scratchpad) en webp optimisés pour le site.
   Usage : node scripts/convertir_illustrations.mjs <dossier-source>
   Sortie : public/media/illu/<nom>.webp (1200 px de large, qualité 82)
   + variante -card.webp (640 px) pour les bandeaux de cartes. */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) { console.error('dossier source manquant'); process.exit(1); }
const out = 'public/media/illu';
await mkdir(out, { recursive: true });

for (const f of await readdir(src)) {
  if (!f.endsWith('.png')) continue;
  const base = path.basename(f, '.png');
  const input = path.join(src, f);
  await sharp(input).resize(1200).webp({ quality: 82 }).toFile(path.join(out, `${base}.webp`));
  await sharp(input).resize(640).webp({ quality: 78 }).toFile(path.join(out, `${base}-card.webp`));
  console.log(`${base} → webp (1200 + 640)`);
}
