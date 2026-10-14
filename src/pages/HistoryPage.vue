<script setup>
import { ref, computed } from 'vue'
import PageIntro from '@/components/PageIntro.vue'
import { TIMELINE, KIND_COLORS } from '@/data/history'
import { useContent } from '@/composables/useContent'

const { t, list } = useContent()

const kinds = ['all', 'life', 'work', 'movement', 'practice', 'world']
const kind = ref('all')

const events = computed(() =>
  kind.value === 'all' ? TIMELINE : TIMELINE.filter((e) => e.kind === kind.value),
)
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('history.title')"
        :lead="t('history.lead')"
        icon="sym_r_history_edu"
        :colors="['#e0b04a', '#6f86b5', '#e9a89b', '#3b4a8c']"
        :seed="2"
      />

      <section class="bio" aria-labelledby="bio-title">
        <div class="bio-years" aria-hidden="true">
          <span>1861</span>
          <span class="bio-line" />
          <span>1925</span>
        </div>
        <div class="reading">
          <h2 id="bio-title">{{ t('history.bioTitle') }}</h2>
          <p v-for="(p, i) in list('history.bio')" :key="i">{{ p }}</p>
        </div>
      </section>

      <section aria-labelledby="tl-title">
        <h2 id="tl-title">{{ t('history.timelineTitle') }}</h2>

        <div class="filters" role="group" :aria-label="t('history.filterLabel')">
          <q-chip
            v-for="k in kinds"
            :key="k"
            clickable
            :selected="kind === k"
            :outline="kind !== k"
            class="filter-chip"
            :style="k !== 'all' ? { '--chip': KIND_COLORS[k] } : {}"
            @click="kind = k"
          >
            <span v-if="k !== 'all'" class="chip-dot" />
            {{ t(`history.kinds.${k}`) }}
          </q-chip>
        </div>

        <ol class="timeline">
          <li
            v-for="e in events"
            :key="e.id"
            class="event"
            :style="{ '--kind': KIND_COLORS[e.kind] }"
          >
            <div class="event-year">{{ e.year }}</div>
            <div class="event-body">
              <h3 class="event-title">{{ t(`history.events.${e.id}.title`) }}</h3>
              <p class="event-text">{{ t(`history.events.${e.id}.text`) }}</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.bio {
  display: grid;
  gap: 24px;
}

@media (min-width: 760px) {
  .bio {
    grid-template-columns: 120px 1fr;
    gap: 40px;
  }
}

.bio h2 {
  margin-top: 0;
}

.bio-years {
  display: none;
}

@media (min-width: 760px) {
  .bio-years {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--font-serif);
    font-size: 1.7rem;
    color: var(--app-muted);
    padding-top: 8px;
  }
  .bio-line {
    width: 2px;
    flex: 1;
    min-height: 120px;
    margin: 10px 0;
    background: linear-gradient(var(--c-peach), var(--c-indigo));
    border-radius: 2px;
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 -4px 20px;
}

.filter-chip {
  --chip: var(--q-primary);
  font-size: 0.95rem;
}

.filter-chip.q-chip--outline {
  border-color: var(--app-border);
  color: var(--app-text);
}

.filter-chip.q-chip--selected {
  background: var(--app-surface-tint);
  color: var(--app-text);
}

.filter-chip :deep(.q-chip__icon--left) {
  display: none;
}

.chip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--chip);
  margin-right: 8px;
  display: inline-block;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 84px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--app-border);
}

.event {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 30px;
  padding: 10px 0 18px;
  position: relative;
}

.event::before {
  content: '';
  position: absolute;
  left: 78px;
  top: 18px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--kind);
  box-shadow: 0 0 0 4px var(--app-page);
}

.event-year {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  text-align: right;
  line-height: 1.2;
  padding-top: 6px;
  font-variant-numeric: lining-nums tabular-nums;
}

.event-title {
  font-size: 1.3rem;
  margin: 6px 0 4px;
}

.event-text {
  margin: 0;
  color: var(--app-muted);
  max-width: 62ch;
  line-height: 1.55;
}

@media (max-width: 480px) {
  .timeline::before {
    left: 7px;
  }
  .event {
    grid-template-columns: 1fr;
    gap: 0;
    padding-left: 30px;
  }
  .event::before {
    left: 1px;
    top: 16px;
  }
  .event-year {
    text-align: left;
    font-size: 1.25rem;
  }
}
</style>
