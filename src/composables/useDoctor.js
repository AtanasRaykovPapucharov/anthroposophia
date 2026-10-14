import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DOCTOR } from '@/data/doctor'

/**
 * Doctor data in the current language.
 * Each text field in data/doctor.js is an object keyed by locale;
 * missing languages fall back to English, then Bulgarian.
 */
export function useDoctor() {
  const { locale } = useI18n()

  function loc(field) {
    if (field == null || typeof field !== 'object' || Array.isArray(field)) return field
    return field[locale.value] ?? field['en-US'] ?? field.bg ?? ''
  }

  const doctor = computed(() => ({
    ...DOCTOR,
    name: loc(DOCTOR.name),
    title: loc(DOCTOR.title),
    bio: loc(DOCTOR.bio) || [],
    highlights: loc(DOCTOR.highlights) || [],
    languages: loc(DOCTOR.languages),
    address: loc(DOCTOR.address),
    hours: loc(DOCTOR.hours),
    groups: DOCTOR.groups.map((g) => ({
      ...g,
      title: loc(g.title),
      text: loc(g.text),
      when: loc(g.when),
      where: loc(g.where),
    })),
  }))

  return { doctor, loc }
}
