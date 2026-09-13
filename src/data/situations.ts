/* « Ce qui vous amène » — 6 situations dans les mots du visiteur (brief), une
   ligne chacune, un picto (spec 2026-09-13 §3.1). Source unique (index.astro). */
export type TeinteSit = 'rose' | 'lilac' | 'aqua' | 'peach';
export interface Situation { txt: string; href: string; tag: string; teinte: TeinteSit; icone: string }
export const SITUATIONS: Situation[] = [
  { txt: '«\u00A0Je suis épuisé·e, je n’y arrive plus.\u00A0»', href: '/accompagnements/adolescents-adultes/', tag: 'Burn-out', teinte: 'rose', icone: 'batterie' },
  { txt: '«\u00A0Tout me stresse, même les petites choses.\u00A0»', href: '/accompagnements/adolescents-adultes/', tag: 'Stress & anxiété', teinte: 'rose', icone: 'spirale' },
  { txt: '«\u00A0On attend un enfant, ou être parent me dépasse.\u00A0»', href: '/accompagnements/perinatalite-parentalite/', tag: 'Périnatalité & parentalité', teinte: 'lilac', icone: 'pousse' },
  { txt: '«\u00A0Mon enfant ne va pas bien, je le sens.\u00A0»', href: '/accompagnements/enfants-famille/', tag: 'Enfants', teinte: 'aqua', icone: 'cerf-volant' },
  { txt: '«\u00A0Le TDAH complique notre quotidien.\u00A0»', href: '/accompagnements/adolescents-adultes/#tdah', tag: 'TDAH', teinte: 'aqua', icone: 'boussole' },
  { txt: '«\u00A0Je veux manger et dormir mieux, sans me battre.\u00A0»', href: '/nutrition-sante/', tag: 'Nutrition & sommeil', teinte: 'peach', icone: 'assiette' },
];
