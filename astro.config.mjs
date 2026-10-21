import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
const site = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));

// Démonstration : tout le site est en noindex (site.noindex) ; seule la 404 est hors sitemap.
const horsSitemap = [/\/404\/?$/];

// Plusieurs serveurs de dev tournent en parallèle (un par habillage, --port 4931…4934) : un cache Vite PAR PORT, sinon
// le regroupement des dépendances d'un serveur rend celles des autres « 504 Outdated Optimize Dep » (scripts non chargés,
// vu le 2026-10-09).
const iPort = process.argv.indexOf('--port');
const cacheVite = `node_modules/.vite${iPort > -1 ? `-${process.argv[iPort + 1]}` : ''}`;

export default defineConfig({
  site: site.site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: page => !horsSitemap.some(motif => motif.test(page)) })],
  server: { host: '127.0.0.1', port: site.port },
  vite: {
    cacheDir: cacheVite,
    server: { strictPort: true },
    preview: { strictPort: true },
  },
  // Pages internes préchargées au survol.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
