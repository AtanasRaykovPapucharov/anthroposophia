import { useI18n } from 'vue-i18n'

/**
 * Helpers for structured i18n content.
 * - list(key): an array of translated strings (e.g. paragraphs)
 * - has(key):  whether a key exists in the current or fallback locale
 */
export function useContent() {
  const { t, tm, rt, te, locale } = useI18n()

  function list(key) {
    const value = tm(key)
    if (!Array.isArray(value)) return []
    return value.map((item) => (typeof item === 'string' ? item : rt(item)))
  }

  function has(key) {
    return te(key) || te(key, 'en-US')
  }

  return { t, list, has, locale }
}
