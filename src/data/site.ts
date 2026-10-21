// Configuration du site (lue dans site.config.json) : domaine canonique, langue, indexation, statistiques.
import config from '../../site.config.json';

export const site = {
  site: config.site,
  nom: config.name,
  lang: config.lang,
  description: config.description,
  /** Démonstration : jamais indexée. */
  noindex: config.noindex,
  /** Identifiant du site Umami du serveur clients (vide = statistiques coupées). */
  umami: (config as { umami?: string }).umami ?? '',
} as const;
