// Timeline of anthroposophy. Text for each id lives in i18n under history.events.<id>
// kind: life (Steiner's biography), work (books & research), movement (society & buildings),
//       practice (education, medicine, agriculture…), world (later spread)
export const TIMELINE = [
  { id: 'birth', year: '1861', kind: 'life' },
  { id: 'vienna', year: '1879', kind: 'life' },
  { id: 'goethe', year: '1883', kind: 'work' },
  { id: 'weimar', year: '1890', kind: 'work' },
  { id: 'freedom', year: '1894', kind: 'work' },
  { id: 'theosophy', year: '1902', kind: 'movement' },
  { id: 'books', year: '1904', kind: 'work' },
  { id: 'society', year: '1913', kind: 'movement' },
  { id: 'firstGoetheanum', year: '1913', kind: 'movement' },
  { id: 'waldorf', year: '1919', kind: 'practice' },
  { id: 'medicine', year: '1920', kind: 'practice' },
  { id: 'christianCommunity', year: '1922', kind: 'movement' },
  { id: 'fire', year: '1922', kind: 'movement' },
  { id: 'christmas', year: '1923', kind: 'movement' },
  { id: 'agriculture', year: '1924', kind: 'practice' },
  { id: 'death', year: '1925', kind: 'life' },
  { id: 'secondGoetheanum', year: '1928', kind: 'movement' },
  { id: 'ban', year: '1935', kind: 'world' },
  { id: 'camphill', year: '1940', kind: 'practice' },
  { id: 'herdecke', year: '1969', kind: 'practice' },
  { id: 'banks', year: '1974', kind: 'world' },
  { id: 'sekem', year: '1977', kind: 'world' },
  { id: 'university', year: '1982', kind: 'world' },
  { id: 'centenary', year: '2019', kind: 'world' },
]

export const KIND_COLORS = {
  life: 'var(--c-peach)',
  work: 'var(--c-violet)',
  movement: 'var(--c-indigo)',
  practice: 'var(--c-green)',
  world: 'var(--c-gold)',
}
