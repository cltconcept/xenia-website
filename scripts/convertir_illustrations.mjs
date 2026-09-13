/* Convertit les PNG Higgsfield (scratchpad ou brief/illu-src) en webp optimisés pour le site.
   Usage : node scripts/convertir_illustrations.mjs <dossier | fichier.png> [--vignette]
   Mode illustration (défaut) : public/media/illu/<nom>.webp (1200 px de large, qualité 82)
   + variante -card.webp (640 px) pour les bandeaux de cartes.
   Mode --vignette (2026-09-13) : public/media/illu/vignettes/<nom>-{320,640,960}.webp
   (qualité 80/78/76), les trois tailles du srcset de Vignette.astro. */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const vignette = args.includes('--vignette');
const src = args.find((a) => !a.startsWith('--'));
if (!src) { console.error('dossier source ou fichier .png manquant'); process.exit(1); }

/* Un .png seul, ou tous les .png d'un dossier */
const fichiers = (await stat(src)).isDirectory()
  ? (await readdir(src)).filter((f) => f.endsWith('.png')).map((f) => path.join(src, f))
  : [src];

const out = vignette ? 'public/media/illu/vignettes' : 'public/media/illu';
await mkdir(out, { recursive: true });

for (const input of fichiers) {
  const base = path.basename(input, '.png');
  if (vignette) {
    for (const [w, q] of [[320, 80], [640, 78], [960, 76]]) {
      await sharp(input).resize(w).webp({ quality: q }).toFile(path.join(out, `${base}-${w}.webp`));
    }
    console.log(`${base} → vignettes (320 + 640 + 960)`);
  } else {
    await sharp(input).resize(1200).webp({ quality: 82 }).toFile(path.join(out, `${base}.webp`));
    await sharp(input).resize(640).webp({ quality: 78 }).toFile(path.join(out, `${base}-card.webp`));
    console.log(`${base} → webp (1200 + 640)`);
  }
}
