<script setup>
import { ref, computed } from 'vue'
import PageIntro from '@/components/PageIntro.vue'
import YearCircle from '@/components/YearCircle.vue'
import { FESTIVALS } from '@/data/festivals'
import { festivalDate, nextOccurrence, daysUntil } from '@/composables/useFestivalDates'
import { useContent } from '@/composables/useContent'

const { t, locale } = useContent()
const year = new Date().getFullYear()

const upcomingId = computed(() => {
  const list = FESTIVALS.map((f) => ({ id: f.id, date: nextOccurrence(f.id) }))
  list.sort((a, b) => a.date - b.date)
  return list[0].id
})

const selected = ref(upcomingId.value)

const fmt = computed(
  () => new Intl.DateTimeFormat(locale.value, { weekday: 'short', day: 'numeric', month: 'long' }),
)

const rows = computed(() =>
  FESTIVALS.map((f) => {
    const date = festivalDate(f.id, year)
    const next = nextOccurrence(f.id)
    return { ...f, date, label: fmt.value.format(date), days: daysUntil(next) }
  }),
)

const current = computed(() => rows.value.find((r) => r.id === selected.value))

function select(id) {
  selected.value = id
}
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('festivals.title')"
        :lead="t('festivals.lead')"
        icon="sym_r_calendar_month"
        :colors="['#e0b04a', '#3b4a8c', '#6f9e6a', '#b5517a']"
        :seed="4"
      />

      <section class="year-grid">
        <div class="circle-wrap">
          <YearCircle v-model="selected" :year="year" />
          <p class="small muted circle-hint">{{ t('festivals.circleHint') }}</p>
        </div>

        <article
          v-if="current"
          class="detail"
          :style="{ '--tint': current.color }"
          aria-live="polite"
        >
          <q-icon :name="current.icon" size="36px" class="detail-icon" />
          <h2 class="detail-title">{{ t(`festivals.items.${current.id}.title`) }}</h2>
          <p class="detail-date">
            {{ current.label
            }}<template v-if="current.movable">, {{ t('festivals.movable') }}</template>
          </p>
          <p class="prose">{{ t(`festivals.items.${current.id}.text`) }}</p>
          <p class="detail-custom">
            <strong>{{ t('festivals.customs') }}</strong>
            {{ t(`festivals.items.${current.id}.customs`) }}
          </p>
          <p v-if="current.id === upcomingId" class="detail-next">
            {{ current.days === 0 ? t('home.today') : t('home.inDays', { n: current.days }) }}
          </p>
        </article>
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">{{ t('festivals.listTitle', { year }) }}</h2>
        <ol class="flist">
          <li v-for="r in rows" :key="r.id">
            <button
              type="button"
              class="frow"
              :class="{ 'is-active': selected === r.id }"
              :style="{ '--tint': r.color }"
              @click="select(r.id)"
            >
              <span class="frow-dot" />
              <span class="frow-title">{{ t(`festivals.items.${r.id}.title`) }}</span>
              <span class="frow-date">{{ r.label }}</span>
            </button>
          </li>
        </ol>
      </section>

      <section class="reading notes">
        <h2>{{ t('festivals.soulCalendar.title') }}</h2>
        <p>{{ t('festivals.soulCalendar.text') }}</p>
        <h2>{{ t('festivals.south.title') }}</h2>
        <p>{{ t('festivals.south.text') }}</p>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.year-grid {
  display: grid;
  gap: 28px;
  align-items: center;
}

@media (min-width: 860px) {
  .year-grid {
    grid-template-columns: minmax(300px, 420px) 1fr;
    gap: 48px;
  }
}

.circle-hint {
  text-align: center;
  margin-top: 8px;
}

.detail {
  padding: 26px 26px 18px;
  border-radius: 40px 8px 40px 8px;
  background:
    radial-gradient(
      120% 120% at 100% 0%,
      color-mix(in srgb, var(--tint) 30%, transparent),
      transparent 65%
    ),
    var(--app-surface);
  border: 1px solid var(--app-border);
}

.detail-icon {
  color: var(--tint);
  filter: brightness(0.85) saturate(1.3);
}

.detail-title {
  margin: 8px 0 4px;
}

.detail-date {
  color: var(--app-muted);
  margin-bottom: 14px;
}

.detail-custom {
  line-height: 1.55;
}

.detail-next {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--app-muted);
}

.flist {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 720px;
}

.frow {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  width: 100%;
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: 16px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px solid var(--app-border);

  &.is-active {
    background: color-mix(in srgb, var(--tint) 16%, transparent);
    border-radius: 16px 4px 16px 4px;
  }
}

.frow-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--tint);
}

.frow-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
}

.frow-date {
  color: var(--app-muted);
  font-size: 0.95rem;
  text-align: right;
}

.notes {
  margin-top: 16px;
}
</style>
