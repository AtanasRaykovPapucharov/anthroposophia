// Key books by Rudolf Steiner (original German titles, public domain)
// and reliable organisations (names per language). Texts: i18n library.books.<id> / library.links.<id>
export const BOOKS = [
  { id: 'freedom', original: 'Die Philosophie der Freiheit', year: '1894', ga: 'GA 4' },
  { id: 'theosophy', original: 'Theosophie', year: '1904', ga: 'GA 9' },
  {
    id: 'higherWorlds',
    original: 'Wie erlangt man Erkenntnisse der höheren Welten?',
    year: '1904–05',
    ga: 'GA 10',
  },
  {
    id: 'childEducation',
    original: 'Die Erziehung des Kindes vom Gesichtspunkte der Geisteswissenschaft',
    year: '1907',
    ga: 'GA 34',
  },
  { id: 'occultScience', original: 'Die Geheimwissenschaft im Umriss', year: '1910', ga: 'GA 13' },
  { id: 'calendar', original: 'Anthroposophischer Seelenkalender', year: '1912', ga: 'GA 40' },
  {
    id: 'socialQuestion',
    original: 'Die Kernpunkte der sozialen Frage',
    year: '1919',
    ga: 'GA 23',
  },
  {
    id: 'agriculture',
    original: 'Geisteswissenschaftliche Grundlagen zum Gedeihen der Landwirtschaft',
    year: '1924',
    ga: 'GA 327',
  },
  {
    id: 'therapy',
    original: 'Grundlegendes für eine Erweiterung der Heilkunst (mit Ita Wegman)',
    year: '1925',
    ga: 'GA 27',
  },
  { id: 'autobiography', original: 'Mein Lebensgang', year: '1925', ga: 'GA 28' },
]

export const LINKS = [
  {
    id: 'goetheanum',
    name: {
      'en-US': 'Goetheanum',
      bg: 'Гьотеанум',
      ru: 'Гётеанум',
      de: 'Goetheanum',
      ja: 'ゲーテアヌム',
    },
    url: 'https://goetheanum.ch',
    icon: 'sym_r_account_balance',
  },
  {
    id: 'rsarchive',
    name: {
      'en-US': 'Rudolf Steiner Archive',
      bg: 'Онлайн архив „Рудолф Щайнер“',
      ru: 'Архив Рудольфа Штайнера',
      de: 'Rudolf Steiner Archive',
      ja: 'ルドルフ・シュタイナー・アーカイブ',
    },
    url: 'https://rsarchive.org',
    icon: 'sym_r_menu_book',
  },
  {
    id: 'medsection',
    name: {
      'en-US': 'Medical Section at the Goetheanum',
      bg: 'Медицинска секция при Гьотеанума',
      ru: 'Медицинская секция Гётеанума',
      de: 'Medizinische Sektion am Goetheanum',
      ja: 'ゲーテアヌム医学部門',
    },
    url: 'https://medsektion-goetheanum.org',
    icon: 'sym_r_healing',
  },
  {
    id: 'ivaa',
    name: { 'en-US': 'IVAA', bg: 'IVAA', ru: 'IVAA', de: 'IVAA', ja: 'IVAA' },
    url: 'https://www.ivaa.info',
    icon: 'sym_r_stethoscope',
  },
  {
    id: 'waldorf',
    name: {
      'en-US': 'Friends of Waldorf Education',
      bg: 'Приятели на валдорфската педагогика',
      ru: 'Друзья вальдорфской педагогики',
      de: 'Freunde der Erziehungskunst Rudolf Steiners',
      ja: 'シュタイナー教育友の会',
    },
    url: 'https://www.freunde-waldorf.de',
    icon: 'sym_r_school',
  },
  {
    id: 'demeter',
    name: {
      'en-US': 'Demeter International',
      bg: 'Demeter International',
      ru: 'Demeter International',
      de: 'Demeter International',
      ja: 'デメター・インターナショナル',
    },
    url: 'https://www.demeter.net',
    icon: 'sym_r_eco',
  },
  {
    id: 'agriSection',
    name: {
      'en-US': 'Section for Agriculture',
      bg: 'Секция по земеделие при Гьотеанума',
      ru: 'Сельскохозяйственная секция Гётеанума',
      de: 'Sektion für Landwirtschaft am Goetheanum',
      ja: 'ゲーテアヌム農業部門',
    },
    url: 'https://www.sektion-landwirtschaft.org',
    icon: 'sym_r_agriculture',
  },
  {
    id: 'camphill',
    name: {
      'en-US': 'Camphill',
      bg: 'Кемпхил',
      ru: 'Кэмпхилл',
      de: 'Camphill',
      ja: 'キャンプヒル',
    },
    url: 'https://www.camphill.net',
    icon: 'sym_r_diversity_1',
  },
  {
    id: 'asa',
    name: {
      'en-US': 'Anthroposophical Society in America',
      bg: 'Антропософско общество в Америка',
      ru: 'Антропософское общество в Америке',
      de: 'Anthroposophische Gesellschaft in Amerika',
      ja: 'アメリカ・アントロポゾフィー協会',
    },
    url: 'https://anthroposophy.org',
    icon: 'sym_r_public',
  },
]

export const GLOSSARY = [
  'anthroposophy',
  'spiritualScience',
  'etheric',
  'astral',
  'ego',
  'eurythmy',
  'lazure',
  'goetheanism',
  'threefolding',
  'biodynamic',
  'demeter',
  'camphill',
  'christmasConference',
  'mainLesson',
  'soulCalendar',
]
