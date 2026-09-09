/* Schémas JSON-LD des pages d'offre (contrôle qualité du 2026-09-09) :
   un `Service` par accompagnement, rattaché au cabinet (`#cabinet` de Base.astro),
   et un `BreadcrumbList`. Tout part des données (`site.ts`, `accompagnements.ts`)
   et de `Astro.site` : rien d'écrit en dur. */
import { LIEUX } from '../data/site';

interface ServiceInput {
  nom: string;
  description: string;
  chemin: string;      // ex. '/accompagnements/enfants-famille/'
  public: string;      // ex. 'Enfants et leurs parents'
  type?: string;       // serviceType, défaut : consultation psychologique
}

export function serviceLd(site: URL | undefined, s: ServiceInput) {
  const base = site?.toString() ?? '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': new URL(s.chemin, base).toString() + '#service',
    name: s.nom,
    description: s.description,
    url: new URL(s.chemin, base).toString(),
    serviceType: s.type ?? 'Consultation psychologique',
    provider: { '@id': `${base}#cabinet` },
    areaServed: LIEUX.map((l) => ({ '@type': 'City', name: l.ville })),
    audience: { '@type': 'Audience', audienceType: s.public },
    availableChannel: [
      { '@type': 'ServiceChannel', name: 'En cabinet', serviceLocation: LIEUX.map((l) => ({ '@type': 'Place', name: l.nom, address: `${l.adresse}, ${l.codePostal} ${l.ville}` })) },
      { '@type': 'ServiceChannel', name: 'En visio' },
    ],
  };
}

export function breadcrumbLd(site: URL | undefined, items: { nom: string; chemin: string }[]) {
  const base = site?.toString() ?? '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nom,
      item: new URL(it.chemin, base).toString(),
    })),
  };
}
