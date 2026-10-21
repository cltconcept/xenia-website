/* Contenu commun aux trois directions (seconde proposition, 2026-10-20) — LECTURE SEULE pour les habillages.
   Source : mail de la cliente du 27/07/2026 (sa description à la 1re personne, ses listes, ses cabinets), son profil
   Doctoranytime (diplôme), le site v1 (étiquette git `v1-eclaircie`) pour les réponses pratiques.
   Règles posées par sa remarque du 14/09/2026 (« ces petites phrases entre guillemets […] un aspect un peu trop
   commercial, alors qu'on cherche plutôt à transmettre une idée d'accompagnement bienveillant ») :
   - AUCUNE phrase entre guillemets, aucune accroche qui nie une objection pour la retourner ;
   - des titres qui DÉCRIVENT, sa voix (« je ») quand c'est elle qui parle, « vous » pour le lecteur ;
   - « van » en minuscule après le prénom (sa propre signature, les annuaires) ; « Van Outryve » seul en début de phrase.
   Ne rien inventer : aucun tarif, aucun avis, aucune durée, aucun nombre d'années, aucun diplôme hors de ce fichier. */

export const identite = {
  nom: 'Xénia van Outryve',
  prenom: 'Xénia',
  titre: 'Psychologue clinicienne',
  domaines: 'Santé, périnatalité et nutrition',
  zone: 'Brabant wallon',
  telephone: '0475 67 03 50',
  telephoneLien: 'tel:+32475670350',
  email: 'xenia.vanoutryve@gmail.com',
  agrement: '9422118125',
  tva: 'BE 1039.769.328',
  diplome: 'Master en psychologie clinique de la santé (UCLouvain)',
  formationEnCours: 'Formation en nutrition pédiatrique (en cours)',
};

export const emailLien = (sujet?: string) =>
  `mailto:${identite.email}${sujet ? `?subject=${encodeURIComponent(sujet)}` : ''}`;

/* Plateformes de rendez-vous (vérifiées en ligne le 2026-08-11) */
export const plateformes = {
  doctoranytime: { nom: 'Doctoranytime', url: 'https://www.doctoranytime.be/d/psychologue/xenia-van-outryve' },
  rosa: { nom: 'Rosa', url: 'https://rosa.be/fr/hp/xenia-van-outryve/' },
} as const;

/* Le hero de chaque direction : CES TEXTES EXACTEMENT (le présentoir les reprend). */
export const heros = {
  a: {
    titre: 'Psychologue clinicienne en Brabant wallon',
    ligne: 'Enfants, adolescents, adultes et futurs parents, en cabinet ou en visio.',
  },
  b: {
    titre: 'Un espace d’écoute, à votre rythme',
    ligne: 'Xénia van Outryve, psychologue clinicienne à Court-Saint-Étienne, Nivelles et La Hulpe.',
  },
  c: {
    titre: 'Xénia van Outryve, psychologue clinicienne',
    ligne: 'Santé, périnatalité et nutrition, en Brabant wallon et en visio.',
  },
} as const;

/* Les deux actions, partout les mêmes libellés */
export const actions = {
  rendezVous: 'Prendre rendez-vous',
  appeler: 'Appeler',
  ecrire: 'Écrire un e-mail',
};

/* Présentation — sa description du 27/07, resserrée, à la 1re personne. Sans guillemets. */
export const presentation = {
  titre: 'Bonjour, je suis Xénia',
  paragraphes: [
    'Je suis avant tout passionnée par chaque personne, avec son histoire, ses forces et ses fragilités. Psychologue clinicienne en santé et en périnatalité, j’accompagne celles et ceux qui traversent une période difficile vers un mieux-être durable.',
    'Ma pratique est intégrative et holistique : elle considère la personne dans sa globalité. La santé mentale est étroitement liée à la santé physique, c’est pourquoi j’accorde une place particulière au sommeil, à l’alimentation et à l’activité physique.',
    'Je vous propose un espace d’écoute bienveillant, sécurisant et sans jugement, pour mieux comprendre votre fonctionnement et développer vos ressources, dans le respect de votre rythme, de vos besoins et de vos valeurs.',
  ],
  reperes: [
    { libelle: 'Formation', valeur: 'Master en psychologie clinique de la santé (UCLouvain)' },
    { libelle: 'Agrément', valeur: 'Psychologue agréée par la Commission des psychologues, n° 9422118125' },
    { libelle: 'En cours', valeur: 'Formation en nutrition pédiatrique' },
  ],
};

/* Les quatre accompagnements (ses listes du 27/07). `id` = ancre de la section sur l'accueil. */
export interface Accompagnement { id: string; nom: string; ligne: string; themes: string[]; note?: string }
export const accompagnements: Accompagnement[] = [
  {
    id: 'adolescents-adultes',
    nom: 'Adolescents et adultes',
    ligne: 'Quand le stress, la fatigue ou les émotions prennent trop de place.',
    themes: [
      'Stress, anxiété et gestion des émotions',
      'Burn-out et épuisement',
      'Douleurs et maladies chroniques',
      'Fatigue chronique et insomnies',
      'TDAH : accompagnement psychologique, nutritionnel et habitudes de vie',
      'Changement de comportement : tabac, activité physique, habitudes de vie',
    ],
  },
  {
    id: 'perinatalite-parentalite',
    nom: 'Périnatalité et parentalité',
    ligne: 'Du désir d’enfant aux premières années, un soutien à chaque étape.',
    themes: [
      'Désir d’enfant et parcours de PMA',
      'Interruption de grossesse et fausse couche',
      'Anxiété pendant la grossesse',
      'Dépression parentale et post-partum',
      'Burn-out parental',
      'Acceptation du changement corporel',
      'Le couple à l’arrivée de l’enfant',
    ],
  },
  {
    id: 'enfants-famille',
    nom: 'Enfants et famille',
    ligne: 'Aider l’enfant à exprimer ce qu’il vit, avec ses parents.',
    themes: [
      'Troubles du comportement',
      'Difficultés d’intégration dans un groupe ou en famille',
      'Expression du vécu à travers des moments créatifs',
    ],
    note: 'Les parents sont associés au travail : la place de chacun se définit ensemble.',
  },
  {
    id: 'nutrition-sante',
    nom: 'Nutrition et santé',
    ligne: 'L’alimentation, le sommeil et le mouvement comme leviers de bien-être.',
    themes: [
      'Énergie et fatigue',
      'Concentration',
      'Confort digestif',
      'Bien-être global',
      'Alimentation de l’enfant (formation en nutrition pédiatrique en cours)',
    ],
  },
];

/* Mon approche : quatre repères tirés de sa description (rangée de valeurs, cf. référence Anda). */
export const approche = {
  titre: 'Mon approche',
  intro: 'Une approche intégrative et holistique, qui tient compte de votre histoire, de votre contexte et de vos ressources.',
  valeurs: [
    { nom: 'Intégrative', texte: 'Des outils choisis selon vous, plutôt qu’une méthode unique.' },
    { nom: 'Corps et esprit', texte: 'Le sommeil, l’alimentation et le mouvement font partie du travail.' },
    { nom: 'Sans jugement', texte: 'Un espace d’écoute bienveillant et sécurisant.' },
    { nom: 'À votre rythme', texte: 'Vos besoins et vos valeurs fixent le cap.' },
  ],
};

/* La première séance : trois étapes factuelles */
export const etapes = {
  titre: 'Comment se passe un premier rendez-vous',
  liste: [
    { titre: 'Prendre rendez-vous', texte: 'En ligne sur la plateforme du cabinet choisi, ou par téléphone. Aucune prescription médicale n’est nécessaire.' },
    { titre: 'Faire connaissance', texte: 'La première séance permet de parler de ce qui vous amène, de votre contexte et de vos questions.' },
    { titre: 'Décider ensemble', texte: 'Le rythme des séances, les priorités et la façon de travailler se définissent avec vous.' },
  ],
};

/* Les trois cabinets. `carte` : position dans le viewBox 0 0 400 240 de `carteBrabant` (plus bas). */
export type Jour = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';
export interface Plage { jour: Jour; moment: 'matin' | 'après-midi' | 'journée'; heures: string }
export interface Cabinet {
  id: string; ville: string; nom: string; adresse: string; codePostal: string;
  plages: Plage[]; plateforme: keyof typeof plateformes;
  carte: { x: number; y: number; dx: number; dy: number; ancre: 'start' | 'middle' | 'end' };
}
export const cabinets: Cabinet[] = [
  {
    id: 'court-saint-etienne', ville: 'Court-Saint-Étienne', nom: 'Le Village parental',
    adresse: 'Avenue des Combattants 70B', codePostal: '1490',
    plages: [
      { jour: 'lundi', moment: 'matin', heures: '8 h – 13 h' },
      { jour: 'vendredi', moment: 'après-midi', heures: '13 h 30 – 18 h 30' },
    ],
    plateforme: 'doctoranytime',
    carte: { x: 198, y: 157, dx: 12, dy: 16, ancre: 'start' },
  },
  {
    id: 'nivelles', ville: 'Nivelles', nom: 'Citron, cabinets pluridisciplinaires',
    adresse: 'Rue de Soignies 20', codePostal: '1400',
    plages: [
      { jour: 'mardi', moment: 'journée', heures: 'toute la journée' },
      { jour: 'jeudi', moment: 'journée', heures: 'toute la journée' },
    ],
    plateforme: 'doctoranytime',
    carte: { x: 95, y: 178, dx: -12, dy: 5, ancre: 'end' },
  },
  {
    id: 'la-hulpe', ville: 'La Hulpe', nom: 'Centre Hypno’santé',
    adresse: 'Chaussée de Bruxelles 40', codePostal: '1310',
    plages: [{ jour: 'vendredi', moment: 'matin', heures: '8 h 30 – 13 h 30' }],
    plateforme: 'rosa',
    carte: { x: 161, y: 86, dx: 12, dy: -6, ancre: 'start' },
  },
];

export const itineraire = (c: Cabinet) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${c.adresse}, ${c.codePostal} ${c.ville}, Belgique`)}`;
export const lienRendezVous = (c: Cabinet) => plateformes[c.plateforme].url;

export const cabinetsIntro = {
  titre: 'Trois cabinets en Brabant wallon',
  ligne: 'Court-Saint-Étienne, Nivelles et La Hulpe, ou en visio. Le rendez-vous se prend en ligne, sur la plateforme du cabinet.',
};

export const visio = {
  titre: 'En visio',
  texte: 'Quand la distance ou l’agenda compliquent le déplacement, la séance peut se faire en vidéo. Demandez-la par téléphone ou par e-mail.',
};

/* La semaine (module « Quel jour, quel cabinet ? ») — dérivée des plages ci-dessus, du lundi au vendredi. */
export const jours: Jour[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
export const semaine = jours.map(jour => ({
  jour,
  plages: cabinets.flatMap(c => c.plages.filter(p => p.jour === jour).map(p => ({ ...p, cabinet: c }))),
}));
export const jourSansCabinet = 'Pas de consultation en cabinet ce jour-là. La visio reste possible sur demande.';

/* Orientation (module « Par où commencer ? ») — quatre portes, chacune vers un accompagnement. */
export const orientation = {
  titre: 'Par où commencer ?',
  intro: 'Choisissez ce qui vous ressemble le plus : vous verrez l’accompagnement qui correspond et où me rencontrer.',
  portes: [
    { id: 'moi', libelle: 'Pour moi', accompagnement: 'adolescents-adultes', texte: 'Stress, épuisement, émotions, sommeil ou douleur : nous commençons par ce qui vous pèse le plus aujourd’hui.' },
    { id: 'enfant', libelle: 'Pour mon enfant', accompagnement: 'enfants-famille', texte: 'Votre enfant s’exprime par le jeu et le dessin ; vous êtes associés au travail.' },
    { id: 'parents', libelle: 'Nous attendons un enfant, ou nous venons d’être parents', accompagnement: 'perinatalite-parentalite', texte: 'Désir d’enfant, grossesse, post-partum, vie de couple : un soutien adapté à chaque étape.' },
    { id: 'alimentation', libelle: 'Mon alimentation, mon sommeil', accompagnement: 'nutrition-sante', texte: 'Énergie, concentration, confort digestif : l’alimentation et le sommeil comme leviers concrets.' },
  ],
};

/* Questions pratiques (reprises du site v1, réécrites) */
export const questions = [
  { q: 'Faut-il une prescription médicale ?', r: 'Non. Vous pouvez prendre rendez-vous directement, sans passer par un médecin.' },
  { q: 'Comment prendre rendez-vous ?', r: 'En ligne, sur la plateforme du cabinet choisi : Doctoranytime pour Court-Saint-Étienne et Nivelles, Rosa pour La Hulpe. Vous pouvez aussi m’appeler ou m’écrire.' },
  { q: 'Proposez-vous des consultations en visio ?', r: 'Oui, quand la distance ou l’agenda compliquent le déplacement. Demandez-la par téléphone ou par e-mail.' },
  { q: 'Comment se passe le paiement ?', r: 'Le paiement mobile est accepté en cabinet. Je suis psychologue agréée (n° 9422118125) : la plupart des mutualités interviennent, et un justificatif vous est remis sur demande.' },
];

/* Bloc rendez-vous / contact */
export const contact = {
  titre: 'Prendre rendez-vous',
  texte: 'Choisissez le cabinet et le jour qui vous conviennent : le rendez-vous se prend en ligne. Pour une question ou une visio, appelez-moi ou écrivez-moi.',
};

/* Page « Cabinets et rendez-vous » (/<x>/cabinets/) */
export const pageCabinets = {
  titre: 'Les cabinets et les rendez-vous',
  ligne: 'Trois cabinets en Brabant wallon, et la visio. Chaque cabinet a ses jours et sa plateforme de rendez-vous.',
  modalites: [
    { titre: 'Sans prescription', texte: 'Vous pouvez prendre rendez-vous directement.' },
    { titre: 'Paiement mobile', texte: 'Accepté dans les cabinets.' },
    { titre: 'Mutualités', texte: 'Psychologue agréée : la plupart des mutualités interviennent. Justificatif sur demande.' },
    { titre: 'Visio', texte: 'Sur demande, par téléphone ou par e-mail.' },
  ],
  plateformesTitre: 'Doctoranytime ou Rosa ?',
  plateformesTexte: 'Selon le cabinet : Doctoranytime pour Court-Saint-Étienne et Nivelles, Rosa pour La Hulpe. Les deux affichent mes disponibilités en direct.',
};

/* Navigation (les deux pages de la démonstration) : ancres de l'accueil + la page cabinets */
export const navigation = [
  { libelle: 'Accompagnements', ancre: '#accompagnements' },
  { libelle: 'Mon approche', ancre: '#approche' },
  { libelle: 'Qui je suis', ancre: '#qui-je-suis' },
  { libelle: 'Cabinets', page: '/cabinets/' },
  { libelle: 'Questions', ancre: '#questions' },
];

export const pied = {
  ligne: 'Psychologue clinicienne agréée, n° 9422118125 · TVA BE 1039.769.328',
  copyright: '© 2026 Xénia van Outryve',
};

/* Le contour SIMPLIFIÉ du Brabant wallon (une évocation, pas une carte), viewBox 0 0 400 240, et la courbe qui relie
   Nivelles → Court-Saint-Étienne → La Hulpe. Repris tel quel du site v1 (src/lib/carte.ts). */
export const carteBrabant = {
  viewBox: '0 0 400 240',
  contour: 'M18 128C20 119 31 106 40 96C49 86 60 76 70 70C80 64 89 62 100 58C111 54 123 45 135 44C147 43 159 53 170 52C181 51 188 38 200 36C212 34 228 38 240 42C252 46 262 57 275 58C288 59 305 50 320 48C335 46 354 41 365 44C376 47 384 57 385 66C386 75 378 88 372 100C366 112 358 129 350 140C342 151 333 161 322 168C311 175 297 177 285 182C273 187 262 191 250 196C238 201 227 210 215 212C203 214 191 205 180 205C169 205 162 214 150 214C138 214 122 210 110 206C98 202 90 196 80 190C70 184 59 175 50 168C41 161 33 157 28 150C23 143 16 137 18 128z',
  liaison: 'M95 178 Q 150 174 198 157 Q 220 149 161 86',
};
