// ============================================================================
//  Данни за д-р Докова — попълнете тук (един-единствен файл за редакция)
//  Doctor details — fill in here (the only file you need to edit)
// ============================================================================
//
//  1. Снимка: копирайте снимката като  public/images/dokova.jpg
//     (квадратна, поне 600×600 px). Докато я няма, се показват инициали.
//  2. Заменете всичко в [квадратни скоби] с истинската информация.
//  3. Текстовете са по езици: bg, 'en-US', ru, de, ja. Ако някой език липсва,
//     се показва английският, а ако и него няма — българският.
//  4. Контакти: оставете празно ('') това, което не използвате — съответният
//     бутон просто няма да се покаже.
//
// ============================================================================

export const DOCTOR = {
  photo: '/images/dokova.jpg',
  initials: 'ДД',

  name: {
    bg: 'д-р [Име] Докова',
    'en-US': 'Dr [First name] Dokova',
    ru: 'д-р [Имя] Докова',
    de: 'Dr. [Vorname] Dokova',
    ja: '[名]・ドコヴァ医師',
  },

  // специалност / професионално заглавие
  title: {
    bg: '[Специалност], антропософска медицина',
    'en-US': '[Specialty], anthroposophic medicine',
  },

  // кратко представяне — 1–3 абзаца
  bio: {
    bg: [
      '[Кратко представяне: образование, специалност и години практика.]',
      '[С какво се занимава в антропософската медицина: какви пациенти приема, какви терапии и групи води.]',
    ],
    'en-US': [
      '[Short introduction: education, specialty and years in practice.]',
      '[Focus in anthroposophic medicine: which patients she sees, which therapies and groups she leads.]',
    ],
  },

  // кратки отличителни белези, напр. „Приема деца и възрастни“
  highlights: {
    bg: ['[Приема деца и възрастни]', '[Онлайн консултации]'],
    'en-US': ['[Sees children and adults]', '[Online consultations]'],
  },

  languages: {
    bg: 'български, [английски]',
    'en-US': 'Bulgarian, [English]',
  },

  address: {
    bg: '[Кабинет, улица, град]',
    'en-US': '[Practice, street, city]',
  },

  hours: {
    bg: '[пон.–пет., 9:00–17:00, с предварителен час]',
    'en-US': '[Mon–Fri, 9:00–17:00, by appointment]',
  },

  contact: {
    phone: '', // напр. '+359888123456' — за бутоните „Обади се“ и SMS
    email: '', // напр. 'kabinet@example.bg'
    whatsapp: '', // номер в международен формат без +, напр. '359888123456'
    viber: true, // true = показва бутон Viber (пациентът избира контакта в Viber)
    facebook: 'https://www.facebook.com/profile.php?id=100017810952725',
    mapUrl: '', // връзка към Google Maps за кабинета (по желание)
    bookingUrl: '', // външна онлайн система за записване, напр. Superdoc (по желание)
  },

  // Терапевтични групи. status: 'open' | 'waitlist' | 'full'
  groups: [
    {
      id: 'eurythmy',
      status: 'open',
      title: {
        bg: '[Група по лечебна евритмия]',
        'en-US': '[Eurythmy therapy group]',
      },
      text: {
        bg: '[За кого е групата, какво се прави, колко срещи включва.]',
        'en-US': '[Who the group is for, what happens, how many sessions.]',
      },
      when: { bg: '[всеки вторник, 18:00]', 'en-US': '[every Tuesday, 6 pm]' },
      where: { bg: '[зала, адрес]', 'en-US': '[room, address]' },
    },
    {
      id: 'art',
      status: 'waitlist',
      title: {
        bg: '[Група по арттерапия]',
        'en-US': '[Art therapy group]',
      },
      text: {
        bg: '[За кого е групата, какво се прави, колко срещи включва.]',
        'en-US': '[Who the group is for, what happens, how many sessions.]',
      },
      when: { bg: '[всеки четвъртък, 17:30]', 'en-US': '[every Thursday, 5:30 pm]' },
      where: { bg: '[зала, адрес]', 'en-US': '[room, address]' },
    },
  ],
}
