#!/usr/bin/env node
// Contrôleur de sortie (repris de medicaldietcenter, lui-même de jonckeu/gogalo/funelefe) : pages attendues, head, un seul h1,
// canonical, noindex, textes interdits (agence, restes de gabarit, faits contredits ; `forbiddenText` sans tenir compte de la
// casse, `forbiddenTextCase` à la casse exacte), contenus provisoires (avertissement en aperçu,
// bloquant en livraison), liens et médias locaux, budgets des médias, sitemap (hors 404), robots.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export async function listFiles(root, prefix = '') {
  const result = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Lien symbolique interdit dans la sortie : ${relative}`);
    if (entry.isDirectory()) result.push(...await listFiles(root, relative));
    else result.push(relative);
  }
  return result;
}
export const routeOf = filename => filename === 'index.html' ? '/' : '/' + filename.replace(/\/index\.html$/, '/');
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function attrs(tag) {
  const values = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) values[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  return values;
}
export async function verify({ cwd = process.cwd(), mode = 'preview' } = {}) {
  if (!['preview', 'livraison'].includes(mode)) throw new Error('Mode attendu : preview ou livraison.');
  const config = JSON.parse(await readFile(path.join(cwd, 'forge-checks.json'), 'utf8'));
  const site = JSON.parse(await readFile(path.join(cwd, 'site.config.json'), 'utf8'));
  // DIST (variable d'environnement) : vérifier une sortie construite ailleurs (build hors de dist/).
  const root = path.resolve(cwd, process.env.DIST ?? config.dist);
  const files = await listFiles(root);
  const available = new Set(files);
  const errors = [], warnings = [];
  const fail = (file, message) => errors.push(`${file} : ${message}`);
  const textFiles = new Map();
  const forbidden = config.forbiddenText.map(value => value.toLocaleLowerCase());
  // À la casse exacte : « Xénia Van » est une faute, « Xénia van Outryve » la bonne graphie.
  const forbiddenCase = config.forbiddenTextCase ?? [];
  const placeholders = config.placeholderPatterns.map(value => new RegExp(value, 'iu'));
  const privatePaths = config.privatePathPatterns.map(value => new RegExp(value, 'iu'));
  const resolveLocal = (reference, from) => {
    if (!reference || /^(data|mailto|tel|javascript|blob):/i.test(reference)) return null;
    // Référence interne au document (filtre, masque ou dégradé SVG en ligne : url(#id), éventuellement encodée %23id).
    if (/^(#|%23)/i.test(reference)) return null;
    let url;
    try { url = new URL(reference, new URL(routeOf(from), site.site)); } catch { fail(from, `URL invalide ${reference}`); return null; }
    if (url.origin !== new URL(site.site).origin) return null;
    let pathname;
    try { pathname = decodeURIComponent(url.pathname).replace(/^\/+/, ''); } catch { fail(from, `URL mal encodée ${reference}`); return null; }
    const candidates = [pathname, pathname + (pathname.endsWith('/') || !pathname ? '' : '/') + 'index.html'];
    const found = candidates.find(value => available.has(value));
    if (!found) fail(from, `cible locale absente ${reference}`);
    return found;
  };
  for (const file of files) {
    if (privatePaths.some(pattern => pattern.test(file))) fail(file, 'document privé dans la sortie');
    const ext = path.extname(file).toLowerCase();
    const budget = config.mediaBudgetsBytes[ext];
    if (budget && (await stat(path.join(root, file))).size > budget) fail(file, `budget ${budget} octets dépassé`);
    let source;
    if (/\.(html|css|js|json|xml|txt|svg|map|webmanifest)$/i.test(file)) source = await readFile(path.join(root, file), 'utf8');
    if (ext === '.pdf') {
      if (!config.pdfTextCommand) { fail(file, 'PDF présent : configurer pdfTextCommand (pdftotext) ou fournir un contrôle dédié'); continue; }
      try { source = execFileSync(config.pdfTextCommand, [path.join(root, file), '-'], { encoding: 'utf8', timeout: 30000 }); }
      catch { fail(file, 'extraction PDF impossible'); continue; }
    }
    if (source === undefined) continue;
    textFiles.set(file, source);
    const normalized = decode(source).toLocaleLowerCase();
    for (const value of forbidden) if (normalized.includes(value)) fail(file, `texte interdit « ${value} »`);
    for (const value of forbiddenCase) if (decode(source).includes(value)) fail(file, `texte interdit à la casse exacte « ${value} »`);
    if (placeholders.some(pattern => pattern.test(source))) (mode === 'livraison' ? errors : warnings).push(`${file} : contenu provisoire`);
    if (ext === '.css') for (const match of source.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) resolveLocal(match[1], file);
  }
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  if (!htmlFiles.length) fail(config.dist, 'aucune page HTML');
  const routes = new Set(htmlFiles.map(routeOf));
  for (const route of config.expectedRoutes) if (!routes.has(route)) fail(route, 'page attendue absente');
  for (const file of htmlFiles) {
    const html = textFiles.get(file);
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const tags = [...html.matchAll(/<[a-z][^>]*>/gi)].map(match => ({ tag: match[0], attr: attrs(match[0]) }));
    const headTags = [...head.matchAll(/<[a-z][^>]*>/gi)].map(match => attrs(match[0]));
    if (!/<title>\s*[^<\s][\s\S]*?<\/title>/i.test(head)) fail(file, 'title absent ou vide dans head');
    if (!headTags.some(tag => tag.name === 'description' && tag.content?.trim())) fail(file, 'description absente');
    if ([...html.matchAll(/<h1\b/gi)].length !== 1) fail(file, 'exactement un h1 requis');
    const canonical = headTags.find(tag => tag.rel === 'canonical')?.href;
    const expectedCanonical = new URL(routeOf(file), site.site).href;
    // Une vraie 404 ne déclare pas de canonical ; toute autre page pointe vers elle-même.
    if (file === '404.html' || file.endsWith('/404.html')) { if (canonical) fail(file, 'canonical interdit sur la 404'); }
    else if (canonical !== expectedCanonical) fail(file, `canonical attendu ${expectedCanonical}`);
    const is404 = /(^|\/)404(?:\.html|\/index\.html)$/.test(file);
    const noindex = headTags.some(tag => tag.name === 'robots' && /noindex/i.test(tag.content));
    if ((site.noindex || is404) && !noindex) fail(file, 'noindex attendu');
    if (!site.noindex && !is404 && noindex) fail(file, 'noindex inattendu sur site indexable');
    for (const { tag, attr } of tags) {
      // `alt` sans valeur (sortie d'Astro pour alt="") vaut un texte alternatif vide.
      if (/^<img\b/i.test(tag) && !/\salt(\s*=|[\s/>])/i.test(tag)) fail(file, 'image sans alt');
      for (const key of ['src', 'href', 'poster']) {
        const target = resolveLocal(attr[key], file);
        if (target?.endsWith('.html') && attr[key]?.includes('#')) {
          const id = decodeURIComponent(new URL(attr[key], site.site).hash.slice(1));
          const destination = textFiles.get(target) ?? '';
          const ids = [...destination.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match => decode(match[1]));
          if (id && !ids.includes(id)) fail(file, `ancre absente ${attr[key]}`);
        }
      }
      if (attr.srcset && !attr.srcset.startsWith('data:')) for (const candidate of attr.srcset.split(',')) resolveLocal(candidate.trim().split(/\s+/)[0], file);
    }
    for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) if (attrs(script[1]).type === 'application/ld+json') {
      try { JSON.parse(script[2]); } catch { fail(file, 'JSON-LD invalide'); }
    }
  }
  const robots = textFiles.get('robots.txt');
  if (!robots || !robots.includes(`Sitemap: ${site.site}/sitemap-index.xml`)) fail('robots.txt', 'référence sitemap absente ou incorrecte');
  if (site.noindex && !/^Disallow:\s*\/\s*$/m.test(robots ?? '')) fail('robots.txt', 'Disallow / attendu en maquette');
  if (!site.noindex && /^Disallow:\s*\/\s*$/m.test(robots ?? '')) fail('robots.txt', 'indexation bloquée');
  if (!available.has('sitemap-index.xml')) fail('sitemap-index.xml', 'absent');
  const sitemapLocations = [];
  for (const [file, source] of textFiles) if (/sitemap.*\.xml$/.test(file)) for (const match of source.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const location = decode(match[1]);
    sitemapLocations.push(location);
    if (!location.startsWith(site.site + '/')) fail(file, `domaine sitemap incorrect ${location}`);
    else resolveLocal(location, file);
    if (/\/404(?:\/|\.html)?$/.test(location)) fail(file, '404 dans sitemap');
  }
  const horsSitemap = (config.sitemapExclusions ?? []).map(value => new RegExp(value));
  for (const route of routes) {
    const exclue = horsSitemap.some(motif => motif.test(route));
    const presente = sitemapLocations.includes(new URL(route, site.site).href);
    if (/\/404(?:\.html|\/)$/.test(route)) continue;
    if (exclue && presente) fail(route, 'page exclue présente dans le sitemap');
    if (!exclue && !presente) fail(route, 'page absente des sitemaps');
  }
  return { mode, errors, warnings, pages: htmlFiles.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== '--mode')) throw new Error('Usage : node scripts/verifier.mjs --mode preview|livraison');
    const result = await verify({ mode: args[1] ?? 'preview' });
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.errors.length ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
