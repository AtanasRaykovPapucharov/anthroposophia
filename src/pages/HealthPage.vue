<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar, copyToClipboard, LocalStorage } from 'quasar'
import PageIntro from '@/components/PageIntro.vue'
import SafetyNote from '@/components/SafetyNote.vue'
import DoctorFeature from '@/components/DoctorFeature.vue'
import { THERAPIES, EMERGENCY } from '@/data/health'
import { LINKS } from '@/data/library'
import { useContent } from '@/composables/useContent'

const { t, list, pick } = useContent()
const $q = useQuasar()

const visitSteps = computed(() => list('health.visit.steps'))
const questions = computed(() => list('health.questions.items'))
const selfCare = ['rhythm', 'warmth', 'sleep', 'nature', 'arts', 'nutrition']

// questions the person wants to take to their appointment (kept on this device only)
const KEY = 'anthroposophia-questions'
const picked = ref(readPicked())
function readPicked() {
  try {
    const v = LocalStorage.getItem(KEY)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}
watch(
  picked,
  (v) => {
    try {
      LocalStorage.set(KEY, v)
    } catch {
      // ignore
    }
  },
  { deep: true },
)

async function copyQuestions() {
  const chosen = picked.value.length
    ? picked.value.map((i) => questions.value[i]).filter(Boolean)
    : questions.value
  const text = `${t('health.questions.title')}\n\n${chosen.map((q) => `• ${q}`).join('\n')}`
  try {
    await copyToClipboard(text)
    $q.notify({ message: t('health.questions.copied'), icon: 'sym_r_check', color: 'positive' })
  } catch {
    $q.notify({ message: t('health.questions.copyFailed'), color: 'negative' })
  }
}

const findLinks = LINKS.filter((l) => ['medsection', 'ivaa'].includes(l.id))
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('health.title')"
        :lead="t('health.lead')"
        icon="sym_r_healing"
        :colors="['#b5517a', '#e9a89b', '#6f9e6a', '#8a6bb8']"
        :seed="3"
      />

      <SafetyNote />

      <DoctorFeature variant="health" />

      <section aria-labelledby="am-title" class="reading">
        <h2 id="am-title">{{ t('health.what.title') }}</h2>
        <p v-for="(p, i) in list('health.what.paragraphs')" :key="i">{{ p }}</p>
      </section>

      <section aria-labelledby="ther-title">
        <h2 id="ther-title">{{ t('health.therapiesTitle') }}</h2>
        <q-list class="therapies">
          <q-expansion-item
            v-for="th in THERAPIES"
            :key="th.id"
            :icon="th.icon"
            :label="t(`health.therapies.${th.id}.title`)"
            :caption="t(`health.therapies.${th.id}.short`)"
            header-class="therapy-head"
            expand-icon="sym_r_expand_more"
            class="therapy"
          >
            <div class="therapy-body prose">{{ t(`health.therapies.${th.id}.text`) }}</div>
          </q-expansion-item>
        </q-list>
      </section>

      <section aria-labelledby="visit-title">
        <h2 id="visit-title">{{ t('health.visit.title') }}</h2>
        <ol class="steps">
          <li v-for="(s, i) in visitSteps" :key="i">
            <span class="step-n">{{ i + 1 }}</span>
            <span>{{ s }}</span>
          </li>
        </ol>
      </section>

      <section aria-labelledby="q-title" class="questions surface">
        <h2 id="q-title">{{ t('health.questions.title') }}</h2>
        <p class="muted">{{ t('health.questions.lead') }}</p>
        <q-list>
          <q-item v-for="(q, i) in questions" :key="i" tag="label" class="q-row">
            <q-item-section side top>
              <q-checkbox v-model="picked" :val="i" color="primary" />
            </q-item-section>
            <q-item-section>{{ q }}</q-item-section>
          </q-item>
        </q-list>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="sym_r_content_copy"
          :label="
            picked.length
              ? t('health.questions.copySelected', { n: picked.length })
              : t('health.questions.copyAll')
          "
          class="q-mt-md"
          @click="copyQuestions"
        />
      </section>

      <section aria-labelledby="self-title">
        <h2 id="self-title">{{ t('health.selfCare.title') }}</h2>
        <p class="lead small-lead">{{ t('health.selfCare.lead') }}</p>
        <dl class="care">
          <div v-for="c in selfCare" :key="c" class="care-item">
            <dt>{{ t(`health.selfCare.items.${c}.title`) }}</dt>
            <dd>{{ t(`health.selfCare.items.${c}.text`) }}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="find-title" class="reading">
        <h2 id="find-title">{{ t('health.find.title') }}</h2>
        <p v-for="(p, i) in list('health.find.paragraphs')" :key="i">{{ p }}</p>
        <div class="find-actions">
          <q-btn
            v-for="l in findLinks"
            :key="l.id"
            outline
            no-caps
            :icon="l.icon"
            :label="pick(l.name)"
            :href="l.url"
            target="_blank"
            rel="noopener noreferrer"
            class="ghost-btn"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="sym_r_map"
            :label="t('health.find.map')"
            :to="{ path: '/map', query: { cat: 'medicine' } }"
          />
        </div>
      </section>

      <section aria-labelledby="safe-title" class="reading">
        <h2 id="safe-title">{{ t('health.safety.title') }}</h2>
        <ul class="safe-list">
          <li v-for="(s, i) in list('health.safety.items')" :key="i">{{ s }}</li>
        </ul>
      </section>

      <section class="emergency" aria-labelledby="em-title">
        <q-icon name="sym_r_emergency" size="30px" />
        <div>
          <h2 id="em-title">{{ t('health.emergency.title') }}</h2>
          <p>{{ t('health.emergency.text') }}</p>
          <div class="em-numbers">
            <a v-for="e in EMERGENCY" :key="e.region" :href="`tel:${e.number.split(' ')[0]}`">
              <strong>{{ e.number }}</strong> <span>{{ e.region }}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.small-lead {
  font-size: 1.12rem;
  margin-bottom: 20px;
}

.therapies {
  border-top: 1px solid var(--app-border);
}

.therapy {
  border-bottom: 1px solid var(--app-border);
}

.therapy :deep(.therapy-head) {
  padding: 14px 8px;
  min-height: 64px;
}

.therapy :deep(.q-item__section--avatar) {
  color: var(--c-rose);
}

.therapy :deep(.q-item__label--caption) {
  color: var(--app-muted);
  font-size: 0.95rem;
}

.therapy-body {
  padding: 0 16px 20px 64px;
  max-width: 72ch;
}

@media (max-width: 600px) {
  .therapy-body {
    padding-left: 16px;
  }
}

.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
  max-width: 68ch;

  li {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 12px;
    align-items: start;
    line-height: 1.55;
  }
}

.step-n {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-serif);
  font-size: 1.15rem;
  background: color-mix(in srgb, var(--c-rose) 22%, var(--app-surface));
}

.questions {
  margin-top: 40px;
  padding: 8px 24px 24px;

  h2 {
    margin-top: 0.8em;
  }
}

@media (max-width: 600px) {
  .questions {
    padding: 4px 14px 20px;
  }
}

.q-row {
  padding-left: 0;
  line-height: 1.45;
}

.care {
  display: grid;
  gap: 16px 36px;
  margin: 0;
}

@media (min-width: 700px) {
  .care {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1000px) {
  .care {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.care-item {
  padding-left: 16px;
  border-left: 3px solid color-mix(in srgb, var(--c-green) 60%, transparent);

  dt {
    font-family: var(--font-serif);
    font-size: 1.22rem;
    margin-bottom: 2px;
  }

  dd {
    margin: 0;
    color: var(--app-muted);
    line-height: 1.5;
  }
}

.find-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ghost-btn {
  color: var(--app-text);
}

.safe-list {
  padding-left: 1.2em;
  margin: 0;

  li {
    margin-bottom: 10px;
    line-height: 1.55;
  }
}

.emergency {
  margin-top: 40px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px 22px;
  border-radius: 26px 6px 26px 6px;
  background: color-mix(in srgb, var(--q-negative) 12%, var(--app-surface));
  border: 1px solid color-mix(in srgb, var(--q-negative) 40%, transparent);

  > .q-icon {
    color: var(--q-negative);
    flex: none;
  }

  h2 {
    margin: 0 0 6px;
    font-size: 1.4rem;
  }

  p {
    margin: 0 0 12px;
  }
}

.em-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  a {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    padding: 6px 14px;
    border-radius: 999px;
    background: var(--app-surface);
    border: 1px solid var(--app-border);
    color: var(--app-text);
    text-decoration: none;
    min-height: 40px;
    align-items: center;
  }

  strong {
    font-size: 1.1rem;
  }

  span {
    color: var(--app-muted);
    font-size: 0.9rem;
  }
}
</style>
