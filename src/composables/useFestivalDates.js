// Calendar helpers for the festivals of the year (northern hemisphere).

// Easter Sunday, Gregorian calendar (anonymous Gregorian algorithm / Meeus)
export function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const n = h + l - 7 * m + 114
  return new Date(year, Math.floor(n / 31) - 1, (n % 31) + 1)
}

const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

// First Sunday of Advent: the fourth Sunday before Christmas Day
export function firstAdvent(year) {
  const christmas = new Date(year, 11, 25)
  const back = christmas.getDay() === 0 ? 7 : christmas.getDay()
  return addDays(christmas, -back - 21)
}

export function festivalDate(id, year) {
  switch (id) {
    case 'epiphany':
      return new Date(year, 0, 6)
    case 'easter':
      return easterSunday(year)
    case 'ascension':
      return addDays(easterSunday(year), 39)
    case 'whitsun':
      return addDays(easterSunday(year), 49)
    case 'stJohn':
      return new Date(year, 5, 24)
    case 'michaelmas':
      return new Date(year, 8, 29)
    case 'martinmas':
      return new Date(year, 10, 11)
    case 'advent':
      return firstAdvent(year)
    case 'holyNights':
      return new Date(year, 11, 24)
    default:
      return null
  }
}

export function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 1)
  return Math.round((date - start) / 864e5)
}

export function daysInYear(year) {
  return (new Date(year + 1, 0, 1) - new Date(year, 0, 1)) / 864e5
}

/** Next occurrence of a festival on or after `from` */
export function nextOccurrence(id, from = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const thisYear = festivalDate(id, today.getFullYear())
  return thisYear >= today ? thisYear : festivalDate(id, today.getFullYear() + 1)
}

export function daysUntil(date, from = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((date - today) / 864e5)
}
