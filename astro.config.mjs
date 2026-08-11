import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap()],
  // À CONFIRMER CLIENT : nom de domaine final (Mindfoodyou.be ne sera pas repris,
  // la cliente y réfléchit). Placeholder cohérent avec son nom — la maquette
  // chris-ia.com ne peut ainsi pas se faire indexer à la place du futur domaine.
  site: 'https://xeniavanoutryve.be',
  // Port dédié : 4321-4324 disputés, 4330 = dentalexpert (cf. mémoire sites-vitrines)
  server: { port: 4331 },
  devToolbar: { enabled: false },
});
