/* Les 4 entrées du carrousel de l'accueil. Titre + accroche repris des pages ;
   desc ≤ 18 mots (spec 2026-09-13 §5) ; `icone` = picto du set (§3.1). */
import { LIEUX } from './site';

export type TeinteAcc = 'rose' | 'lilac' | 'aqua' | 'sage';
export interface Accompagnement {
  slug: string;
  onglet: string;
  titre: string;     // début du titre
  accroche: string;  // la partie en italique framboise
  desc: string;
  illu: string;
  illuAlt: string;
  teinte: TeinteAcc;
  href: string;
  icone: string;     // picto de src/icons/ (onglet du carrousel, PageHero)
}

export const ACCOMPAGNEMENTS: Accompagnement[] = [
  {
    slug: 'ado-adultes',
    onglet: 'Adolescents & Adultes',
    titre: 'Stress, anxiété, épuisement :',
    accroche: 'en parler, avancer',
    desc: 'Stress, burn-out, insomnies, douleurs, TDAH : reprendre pied.',
    illu: '/media/illu/ado-adultes-card.webp',
    illuAlt: 'Aquarelle pastel : un fauteuil près d’une grande fenêtre lumineuse',
    teinte: 'rose',
    href: '/accompagnements/adolescents-adultes/',
    icone: 'fauteuil',
  },
  {
    slug: 'perinatalite',
    onglet: 'Périnatalité & Parentalité',
    titre: 'Devenir parent bouscule tout.',
    accroche: 'Vous n’êtes pas seuls.',
    desc: 'Désir d’enfant, grossesse, post-partum, burn-out parental : être soutenu·e.',
    illu: '/media/illu/perinatalite-card.webp',
    illuAlt: 'Aquarelle pastel : deux pétales translucides, l’un abritant l’autre',
    teinte: 'lilac',
    href: '/accompagnements/perinatalite-parentalite/',
    icone: 'pousse',
  },
  {
    slug: 'enfants',
    onglet: 'Enfants & Famille',
    titre: 'Quand votre enfant ne va pas bien,',
    accroche: 'toute la famille le sent',
    desc: 'Comportement, intégration, émotions : dire ce qu’il vit, par le jeu.',
    illu: '/media/illu/enfants-card.webp',
    illuAlt: 'Aquarelle pastel : des crayons de cire et un dessin de soleil',
    teinte: 'aqua',
    href: '/accompagnements/enfants-famille/',
    icone: 'cerf-volant',
  },
  {
    slug: 'nutrition',
    onglet: 'Nutrition & Santé',
    titre: 'Mieux manger, mieux dormir,',
    accroche: 'mieux vivre',
    desc: 'Sommeil, alimentation, mouvement : des leviers concrets, sans régime.',
    illu: '/media/illu/nutrition-card.webp',
    illuAlt: 'Aquarelle pastel : un bol de fruits et une tasse de thé fumante sur une table au matin',
    teinte: 'sage',
    href: '/nutrition-sante/',
    icone: 'assiette',
  },
];

/* La ligne « Où » — identique pour les 4, tirée des lieux */
export const OU = `${LIEUX.map((l) => l.ville).join(' · ')} · visio — rendez-vous en ligne`;
