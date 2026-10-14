import { defineStore, acceptHMRUpdate } from 'pinia'
import { Quasar, Dark, LocalStorage } from 'quasar'
import quasarLangEn from 'quasar/lang/en-US.js'
import quasarLangBg from 'quasar/lang/bg.js'
import quasarLangRu from 'quasar/lang/ru.js'
import quasarLangDe from 'quasar/lang/de-DE.js'
import quasarLangJa from 'quasar/lang/ja.js'
import { i18n, saveLocale, SUPPORTED_LOCALES } from '@/boot/i18n'

// Quasar's own language packs (labels inside built-in components)
const quasarLangPacks = {
  'en-US': quasarLangEn,
  bg: quasarLangBg,
  ru: quasarLangRu,
  de: quasarLangDe,
  ja: quasarLangJa,
}

export const LOCALE_OPTIONS = [
  { value: 'en-US', label: 'English', short: 'EN' },
  { value: 'bg', label: 'Български', short: 'BG' },
  { value: 'ru', label: 'Русский', short: 'RU' },
  { value: 'de', label: 'Deutsch', short: 'DE' },
  { value: 'ja', label: '日本語', short: 'JA' },
]

const THEME_KEY = 'anthroposophia-theme'
const THEMES = ['light', 'dark']

// first visit: start with the device's preference, then remember the person's choice
function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function readTheme() {
  try {
    const saved = LocalStorage.getItem(THEME_KEY)
    return THEMES.includes(saved) ? saved : systemTheme()
  } catch {
    return systemTheme()
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: i18n.global.locale.value,
    theme: readTheme(),
  }),

  getters: {
    locales: () => SUPPORTED_LOCALES,
  },

  actions: {
    setLocale(locale) {
      if (!SUPPORTED_LOCALES.includes(locale)) return
      this.locale = locale
      i18n.global.locale.value = locale
      saveLocale(locale)
      if (typeof document !== 'undefined') document.documentElement.lang = locale
      if (quasarLangPacks[locale]) Quasar.lang.set(quasarLangPacks[locale])
    },

    setTheme(theme) {
      if (!THEMES.includes(theme)) return
      this.theme = theme
      try {
        LocalStorage.set(THEME_KEY, theme)
      } catch {
        // ignore
      }
      Dark.set(theme === 'dark')
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
