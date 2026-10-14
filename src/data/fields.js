// Fields of practice. Texts: i18n fields.items.<id>.{title, short, text}
// `color` tints the veil behind each field; `route` links to a related page
export const FIELDS = [
  {
    id: 'education',
    icon: 'sym_r_school',
    color: 'var(--c-peach)',
    since: 1919,
    mapCat: 'education',
  },
  {
    id: 'medicine',
    icon: 'sym_r_healing',
    color: 'var(--c-rose)',
    since: 1920,
    route: '/health',
    mapCat: 'medicine',
  },
  {
    id: 'agriculture',
    icon: 'sym_r_eco',
    color: 'var(--c-green)',
    since: 1924,
    mapCat: 'agriculture',
  },
  {
    id: 'curative',
    icon: 'sym_r_diversity_1',
    color: 'var(--c-gold)',
    since: 1924,
    mapCat: 'social',
  },
  { id: 'arts', icon: 'sym_r_palette', color: 'var(--c-violet)', since: 1912, mapCat: 'arts' },
  { id: 'architecture', icon: 'sym_r_architecture', color: 'var(--c-earth)', since: 1913 },
  { id: 'social', icon: 'sym_r_handshake', color: 'var(--c-teal)', since: 1917 },
  {
    id: 'science',
    icon: 'sym_r_psychiatry',
    color: 'var(--c-green)',
    since: 1883,
    mapCat: 'research',
  },
  { id: 'religion', icon: 'sym_r_church', color: 'var(--c-indigo)', since: 1922 },
]
