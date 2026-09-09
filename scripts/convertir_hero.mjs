// brief/illu-src/hero-cabinet.png → public/media/illu/hero-cabinet-{640,1040,1600}.webp (4/5 recadré)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('public/media/illu', { recursive: true });
for (const w of [640, 1040, 1600]) {
  await sharp('brief/illu-src/hero-cabinet.png')
    .resize(w, Math.round((w * 5) / 4), { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(`public/media/illu/hero-cabinet-${w}.webp`);
  console.log('✓ hero-cabinet', w);
}
