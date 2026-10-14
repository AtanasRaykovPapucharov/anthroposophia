<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LIFE_PHASES } from '@/data/ideas'

const { t } = useI18n()
const open = ref('p1')
const label = (p) => (p.to ? `${p.from}–${p.to}` : `${p.from}+`)
</script>

<template>
  <ol class="phases">
    <li
      v-for="(p, i) in LIFE_PHASES"
      :key="p.id"
      class="phase"
      :class="{ 'is-open': open === p.id }"
    >
      <button
        type="button"
        class="phase-head"
        :aria-expanded="open === p.id"
        @click="open = open === p.id ? '' : p.id"
      >
        <span class="phase-dot" :style="{ '--size': `${18 + i * 6}px` }" aria-hidden="true" />
        <span class="phase-age">{{ label(p) }}</span>
        <span class="phase-title">{{ t(`ideas.phases.items.${p.id}.title`) }}</span>
        <q-icon
          :name="open === p.id ? 'sym_r_expand_less' : 'sym_r_expand_more'"
          class="phase-chevron"
        />
      </button>
      <q-slide-transition>
        <p v-show="open === p.id" class="phase-text prose">
          {{ t(`ideas.phases.items.${p.id}.text`) }}
        </p>
      </q-slide-transition>
    </li>
  </ol>
</template>

<style scoped>
.phases {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.phases::before {
  content: '';
  position: absolute;
  left: 27px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: linear-gradient(var(--c-peach), var(--c-violet), var(--c-indigo));
  opacity: 0.5;
}

.phase-head {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  width: 100%;
  display: grid;
  grid-template-columns: 56px 4.2em 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 10px 6px 10px 0;
  cursor: pointer;
  text-align: left;
  border-radius: 14px;
}

.phase-dot {
  justify-self: center;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    var(--c-gold),
    var(--c-peach) 55%,
    var(--c-violet)
  );
  position: relative;
  box-shadow: 0 0 0 4px var(--app-page);
}

.phase-age {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--app-muted);
  font-variant-numeric: lining-nums tabular-nums;
}

.phase-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
}

.phase-chevron {
  color: var(--app-muted);
}

.phase-text {
  margin: 0 0 12px 64px;
  max-width: 60ch;
}

@media (max-width: 420px) {
  .phase-head {
    grid-template-columns: 56px 1fr auto;
  }
  .phase-age {
    grid-column: 2;
    grid-row: 1;
    font-size: 1rem;
  }
  .phase-title {
    grid-column: 2;
    grid-row: 2;
  }
  .phase-chevron {
    grid-row: 1 / span 2;
    grid-column: 3;
  }
  .phase-text {
    margin-left: 56px;
  }
}
</style>
