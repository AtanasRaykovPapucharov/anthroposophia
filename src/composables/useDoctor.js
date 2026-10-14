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
    qualifications: (DOCTOR.qualifications || []).map((q) => ({ ...q, title: loc(q.title) })),
    method: DOCTOR.method
      ? {
          approach: loc(DOCTOR.method.approach) || [],
          suitable: loc(DOCTOR.method.suitable) || [],
          notSuitable: loc(DOCTOR.method.notSuitable) || [],
          firstVisit: loc(DOCTOR.method.firstVisit) || [],
          firstVisitNote: loc(DOCTOR.method.firstVisitNote),
        }
      : null,
    requestKinds: DOCTOR.requestKinds?.length
      ? DOCTOR.requestKinds
      : ['first', 'followup', 'online', 'group'],
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
