/* Les thèmes du bandeau — une capsule = un libellé, une teinte, la page qui en parle.
   Source unique (Bandeau.astro). Teinte « sage » = le volet nutrition. */
export type TeinteChip = 'rose' | 'lilac' | 'aqua' | 'peach' | 'sage';
export interface Theme { label: string; teinte: TeinteChip; href: string }

export const THEMES: Theme[] = [
  { label: 'Stress & anxiété', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Burn-out', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Douleur & maladie chronique', teinte: 'peach', href: '/accompagnements/adolescents-adultes/' },
  { label: 'Sommeil & insomnies', teinte: 'peach', href: '/accompagnements/adolescents-adultes/' },
  { label: 'TDAH', teinte: 'aqua', href: '/accompagnements/adolescents-adultes/#tdah' },
  { label: 'Périnatalité', teinte: 'lilac', href: '/accompagnements/perinatalite-parentalite/' },
  { label: 'Parentalité', teinte: 'lilac', href: '/accompagnements/perinatalite-parentalite/' },
  { label: 'Enfants & famille', teinte: 'aqua', href: '/accompagnements/enfants-famille/' },
  { label: 'Nutrition & santé', teinte: 'sage', href: '/nutrition-sante/' },
  { label: 'Transitions de vie', teinte: 'rose', href: '/accompagnements/adolescents-adultes/' },
];
