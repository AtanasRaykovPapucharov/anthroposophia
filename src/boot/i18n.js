import { defineBoot } from '#q-app'
import { createI18n } from 'vue-i18n'
import messages from '@/i18n'

export const SUPPORTED_LOCALES = Object.keys(messages)
export const DEFAULT_LOCALE = 'en-US'
const STORAGE_KEY = 'anthroposophia-locale'

// map a browser language tag (e.g. "de-AT", "ja-JP") to one of our locales
function matchLocale(tag = '') {
  const lower = tag.toLowerCase()
  if (lower.startsWith('bg')) return 'bg'
  if (lower.startsWith('ru')) return 'ru'
  if (lower.startsWith('de')) return 'de'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('en')) return 'en-US'
  return null
}

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved
  } catch {
    // storage unavailable — fall through
  }
  if (typeof navigator !== 'undefined') {
    const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of candidates) {
      const match = matchLocale(tag)
      if (match) return match
    }
  }
  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages,
})

export function saveLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore
  }
}

export default defineBoot(({ app }) => {
  app.use(i18n)
})
