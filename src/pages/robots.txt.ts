import { site } from '../data/site';
export function GET() {
  return new Response(`User-agent: *\n${site.noindex ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${site.site}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
