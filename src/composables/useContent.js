import { useI18n } from 'vue-i18n'

/**
 * Helpers for structured i18n content.
 * - list(key): an array of translated strings (e.g. paragraphs)
 * - has(key):  whether a key exists in the current or fallback locale
 * - pick(obj):  the current language's value from a per-language object in src/data
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

  // pick the current language from a { 'en-US', bg, ru, de, ja } object (data files)
  function pick(field) {
    if (field == null || typeof field !== 'object') return field
    return field[locale.value] ?? field['en-US'] ?? field.bg ?? ''
  }

  return { t, list, has, pick, locale }
}
