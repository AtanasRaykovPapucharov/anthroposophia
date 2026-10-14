<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FESTIVALS } from '@/data/festivals'
import { festivalDate, dayOfYear, daysInYear } from '@/composables/useFestivalDates'

const props = defineProps({
  modelValue: { type: String, default: '' },
  year: { type: Number, default: () => new Date().getFullYear() },
})
const emit = defineEmits(['update:modelValue'])

const { t, locale } = useI18n()

const C = 180 // centre
const R = 128 // ring radius
const total = computed(() => daysInYear(props.year))

// angle 0 = top (1 January), clockwise
function point(angleDeg, radius) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)]
}

const angleOfDate = (date) => (dayOfYear(date) / total.value) * 360

const months = computed(() => {
  const fmt = new Intl.DateTimeFormat(locale.value, { month: 'short' })
  return Array.from({ length: 12 }, (_, m) => {
    const start = angleOfDate(new Date(props.year, m, 1))
    const mid = angleOfDate(new Date(props.year, m, 15))
    const [x, y] = point(mid, R + 34)
    const [x1, y1] = point(start, R - 8)
    const [x2, y2] = point(start, R + 8)
    return { label: fmt.format(new Date(props.year, m, 15)), x, y, tick: [x1, y1, x2, y2] }
  })
})

// seasons drawn as soft arcs (solstices and equinoxes, approximate)
const seasons = computed(() => {
  const d = (m, day) => angleOfDate(new Date(props.year, m, day))
  return [
    { id: 'winter', from: d(11, 21) - 360, to: d(2, 20), color: 'var(--c-indigo)' },
    { id: 'spring', from: d(2, 20), to: d(5, 21), color: 'var(--c-green)' },
    { id: 'summer', from: d(5, 21), to: d(8, 22), color: 'var(--c-gold)' },
    { id: 'autumn', from: d(8, 22), to: d(11, 21), color: 'var(--c-rose)' },
  ].map((s) => {
    const [x1, y1] = point(s.from, R)
    const [x2, y2] = point(s.to, R)
    const large = s.to - s.from > 180 ? 1 : 0
    return { ...s, path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}` }
  })
})

const dots = computed(() =>
  FESTIVALS.map((f) => {
    const date = festivalDate(f.id, props.year)
    const [x, y] = point(angleOfDate(date), R)
    return { ...f, x, y, date }
  }),
)

const today = computed(() => {
  const now = new Date()
  if (now.getFullYear() !== props.year) return null
  const a = angleOfDate(now)
  const [x1, y1] = point(a, R - 22)
  const [x2, y2] = point(a, R + 18)
  return { x1, y1, x2, y2 }
})

const selected = computed(() => dots.value.find((d) => d.id === props.modelValue))
const dateFmt = computed(
  () => new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long' }),
)
</script>

<template>
  <svg viewBox="0 0 360 360" class="year" role="group" :aria-label="t('festivals.circleLabel')">
    <circle :cx="C" :cy="C" :r="R" fill="none" stroke="var(--app-border)" stroke-width="18" />
    <path
      v-for="s in seasons"
      :key="s.id"
      :d="s.path"
      fill="none"
      :stroke="s.color"
      stroke-width="18"
      stroke-opacity="0.32"
    />
    <g class="months">
      <line
        v-for="(m, i) in months"
        :key="`t${i}`"
        :x1="m.tick[0]"
        :y1="m.tick[1]"
        :x2="m.tick[2]"
        :y2="m.tick[3]"
        stroke="var(--app-page)"
        stroke-width="2"
      />
      <text
        v-for="(m, i) in months"
        :key="`m${i}`"
        :x="m.x"
        :y="m.y"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ m.label }}
      </text>
    </g>

    <line v-if="today" :x1="today.x1" :y1="today.y1" :x2="today.x2" :y2="today.y2" class="today" />

    <g
      v-for="d in dots"
      :key="d.id"
      class="dot"
      :class="{ 'is-active': d.id === modelValue }"
      tabindex="0"
      role="button"
      :aria-pressed="d.id === modelValue"
      :aria-label="t(`festivals.items.${d.id}.title`)"
      @click="emit('update:modelValue', d.id)"
      @keydown.enter.prevent="emit('update:modelValue', d.id)"
      @keydown.space.prevent="emit('update:modelValue', d.id)"
    >
      <circle :cx="d.x" :cy="d.y" r="16" fill="transparent" />
      <circle
        :cx="d.x"
        :cy="d.y"
        :r="d.id === modelValue ? 11 : 7.5"
        :fill="d.color"
        class="dot-core"
      />
    </g>

    <foreignObject v-if="selected" :x="C - 82" :y="C - 52" width="164" height="104">
      <div class="centre">
        <div class="centre-title">{{ t(`festivals.items.${selected.id}.title`) }}</div>
        <div class="centre-date">{{ dateFmt.format(selected.date) }}</div>
      </div>
    </foreignObject>
  </svg>
</template>

<style scoped>
.year {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 0 auto;
  overflow: visible;
}

.months text {
  font-family: var(--font-sans);
  font-size: 11.5px;
  fill: var(--app-muted);
}

.today {
  stroke: var(--app-text);
  stroke-width: 2;
  stroke-linecap: round;
}

.dot {
  cursor: pointer;
  outline: none;
}

.dot-core {
  stroke: var(--app-page);
  stroke-width: 3;
  transition: r 0.2s ease;
}

.dot:focus-visible .dot-core {
  stroke: var(--app-text);
}

.centre {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--app-text);
}

.centre-title {
  font-family: var(--font-serif);
  font-size: 19px;
  line-height: 1.15;
}

.centre-date {
  font-size: 13px;
  color: var(--app-muted);
  margin-top: 4px;
}
</style>
