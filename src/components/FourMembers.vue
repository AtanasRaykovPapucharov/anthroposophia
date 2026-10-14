<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FOUR_MEMBERS } from '@/data/ideas'

const { t } = useI18n()
const active = ref('ego')
// outer ring = physical, inner core = I (ego)
const radii = [150, 112, 76, 40]
</script>

<template>
  <div class="members">
    <svg
      viewBox="0 0 320 320"
      class="members-svg"
      role="img"
      :aria-label="t('ideas.members.title')"
    >
      <g v-for="(m, i) in FOUR_MEMBERS" :key="m.id">
        <circle
          cx="160"
          cy="160"
          :r="radii[i]"
          :fill="m.color"
          :fill-opacity="active === m.id ? 0.62 : 0.28"
          :stroke="m.color"
          :stroke-width="active === m.id ? 3 : 1"
          class="ring"
          tabindex="0"
          role="button"
          :aria-pressed="active === m.id"
          :aria-label="t(`ideas.members.items.${m.id}.title`)"
          @click="active = m.id"
          @keydown.enter.prevent="active = m.id"
          @keydown.space.prevent="active = m.id"
        />
      </g>
    </svg>

    <div class="members-legend">
      <button
        v-for="m in FOUR_MEMBERS"
        :key="m.id"
        type="button"
        class="legend-item"
        :class="{ 'is-active': active === m.id }"
        @click="active = m.id"
      >
        <span class="swatch" :style="{ background: m.color }" />
        <span class="legend-text">
          <strong>{{ t(`ideas.members.items.${m.id}.title`) }}</strong>
          <span class="muted">{{ t(`ideas.members.items.${m.id}.kingdom`) }}</span>
        </span>
      </button>
      <p class="members-detail prose">{{ t(`ideas.members.items.${active}.text`) }}</p>
    </div>
  </div>
</template>

<style scoped>
.members {
  display: grid;
  gap: 24px;
  align-items: center;
}

@media (min-width: 760px) {
  .members {
    grid-template-columns: minmax(240px, 320px) 1fr;
    gap: 40px;
  }
}

.members-svg {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: block;
}

.ring {
  cursor: pointer;
  transition:
    fill-opacity 0.25s ease,
    stroke-width 0.25s ease;
}

.ring:focus-visible {
  outline: none;
  stroke: var(--app-text);
  stroke-width: 3;
}

.members-legend {
  display: grid;
  gap: 6px;
}

.legend-item {
  appearance: none;
  border: 1px solid transparent;
  background: none;
  font: inherit;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 18px 4px 18px 4px;
  cursor: pointer;
  text-align: left;
}

.legend-item.is-active {
  background: var(--app-surface);
  border-color: var(--app-border);
}

.swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex: none;
}

.legend-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0 10px;
  align-items: baseline;
}

.members-detail {
  margin: 10px 0 0;
  min-height: 5.5em;
}
</style>
