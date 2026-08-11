/* Données partagées — une seule source pour les pages, le footer et le JSON-LD.
   Tout ce qui vient du brief client du 27/07/2026 (moodboard + mail). */

export const IDENTITE = {
  nom: 'Xénia Van Outryve',
  titre: 'Psychologue clinicienne',
  sousTitre: 'Santé · Périnatalité · Nutrition',
  telephone: '0475 67 03 50',
  telephoneIntl: '+32475670350',
  email: 'xenia.vanoutryve@gmail.com',
  agrement: '9422118125',
  tva: 'BE 1039.769.328',
  // Vérifié sur son profil Doctoranytime le 2026-08-11
  diplome: 'Master en psychologie clinique de la santé (UCLouvain)',
};

export const RDV = {
  doctoranytime: 'https://www.doctoranytime.be/d/psychologue/xenia-van-outryve',
  rosa: 'https://rosa.be/fr/hp/xenia-van-outryve/',
};

export type Lieu = {
  slug: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  horaires: string[];
  plateforme: 'Doctoranytime' | 'Rosa';
  lienRdv: string;
  couleur: 'rose' | 'lilac' | 'aqua';
};

export const LIEUX: Lieu[] = [
  {
    slug: 'court-saint-etienne',
    nom: 'Le Village parental',
    adresse: 'Avenue des Combattants 70B',
    codePostal: '1490',
    ville: 'Court-Saint-Étienne',
    horaires: ['Lundi matin · 8h – 13h', 'Vendredi après-midi · 13h30 – 18h30'],
    plateforme: 'Doctoranytime',
    lienRdv: RDV.doctoranytime,
    couleur: 'rose',
  },
  {
    slug: 'nivelles',
    nom: 'Citron — Cabinets pluridisciplinaires',
    adresse: 'Rue de Soignies 20',
    codePostal: '1400',
    ville: 'Nivelles',
    horaires: ['Mardi · toute la journée', 'Jeudi · toute la journée'],
    plateforme: 'Doctoranytime',
    lienRdv: RDV.doctoranytime,
    couleur: 'lilac',
  },
  {
    slug: 'la-hulpe',
    nom: 'Centre Hypno’santé',
    adresse: 'Chaussée de Bruxelles 40',
    codePostal: '1310',
    ville: 'La Hulpe',
    horaires: ['Vendredi matin · 8h30 – 13h30'],
    plateforme: 'Rosa',
    lienRdv: RDV.rosa,
    couleur: 'aqua',
  },
];

/* Navigation principale — l'ordre du brief (6 entrées, Accompagnements en menu déroulant) */
export const NAV = [
  { href: '/approche/', label: 'Mon approche' },
  {
    label: 'Accompagnements',
    children: [
      { href: '/accompagnements/adolescents-adultes/', label: 'Adolescents & Adultes' },
      { href: '/accompagnements/perinatalite-parentalite/', label: 'Périnatalité & Parentalité' },
      { href: '/accompagnements/enfants-famille/', label: 'Enfants & Famille' },
    ],
  },
  { href: '/nutrition-sante/', label: 'Nutrition & Santé' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/lieux-contact/', label: 'Lieux & Contact' },
];
