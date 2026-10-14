<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '@/components/PageIntro.vue'
import { FIELDS } from '@/data/fields'
import { useContent } from '@/composables/useContent'

const { t } = useContent()
const route = useRoute()

// open the field named in the URL hash (e.g. /fields#education)
const open = ref(new Set())
function syncHash() {
  const id = route.hash?.slice(1)
  if (id && FIELDS.some((f) => f.id === id)) open.value = new Set([id])
}
onMounted(syncHash)
watch(() => route.hash, syncHash)

function toggle(id) {
  const next = new Set(open.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  open.value = next
}
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('fields.title')"
        :lead="t('fields.lead')"
        icon="sym_r_local_florist"
        :colors="['#6f9e6a', '#e0b04a', '#e9a89b', '#3e8e9a']"
        :seed="1"
      />

      <ul class="fields">
        <li
          v-for="f in FIELDS"
          :id="f.id"
          :key="f.id"
          class="field"
          :class="{ 'is-open': open.has(f.id) }"
          :style="{ '--tint': f.color }"
        >
          <button
            type="button"
            class="field-head"
            :aria-expanded="open.has(f.id)"
            :aria-controls="`${f.id}-body`"
            @click="toggle(f.id)"
          >
            <span class="field-icon"><q-icon :name="f.icon" size="26px" /></span>
            <span class="field-titles">
              <span class="field-title">{{ t(`fields.items.${f.id}.title`) }}</span>
              <span class="field-short">{{ t(`fields.items.${f.id}.short`) }}</span>
            </span>
            <span class="field-since">{{ t('fields.since', { year: f.since }) }}</span>
            <q-icon
              :name="open.has(f.id) ? 'sym_r_expand_less' : 'sym_r_expand_more'"
              class="field-chevron"
              size="24px"
            />
          </button>

          <q-slide-transition>
            <div v-show="open.has(f.id)" :id="`${f.id}-body`" class="field-body">
              <p class="prose">{{ t(`fields.items.${f.id}.text`) }}</p>
              <div class="field-actions">
                <q-btn
                  v-if="f.route"
                  unelevated
                  no-caps
                  color="primary"
                  icon="sym_r_healing"
                  :label="t('fields.toHealth')"
                  :to="f.route"
                />
                <q-btn
                  v-if="f.mapCat"
                  outline
                  no-caps
                  icon="sym_r_map"
                  :label="t('fields.onMap')"
                  :to="{ path: '/map', query: { cat: f.mapCat } }"
                  class="ghost-btn"
                />
              </div>
            </div>
          </q-slide-transition>
        </li>
      </ul>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.fields {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.field {
  border-radius: var(--shape-leaf);
  background:
    radial-gradient(
      90% 140% at 0% 0%,
      color-mix(in srgb, var(--tint) 26%, transparent),
      transparent 70%
    ),
    var(--app-surface);
  border: 1px solid var(--app-border);
  scroll-margin-top: 80px;
  transition: border-color 0.2s ease;
}

.field.is-open {
  border-color: color-mix(in srgb, var(--tint) 60%, var(--app-border));
}

.field-head {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: inherit;
}

.field-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px 6px 24px 6px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--tint) 30%, var(--app-surface));
  color: var(--app-text);
}

.field-titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.field-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  line-height: 1.2;
}

.field-short {
  color: var(--app-muted);
  line-height: 1.4;
  margin-top: 2px;
}

.field-since {
  font-family: var(--font-serif);
  color: var(--app-muted);
  white-space: nowrap;
}

.field-chevron {
  color: var(--app-muted);
}

.field-body {
  padding: 0 24px 22px 84px;
}

.field-body .prose {
  max-width: 64ch;
}

.field-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ghost-btn {
  color: var(--app-text);
}

@media (max-width: 600px) {
  .field-head {
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    padding: 16px;
  }
  .field-since {
    display: none;
  }
  .field-body {
    padding: 0 18px 20px;
  }
}
</style>
