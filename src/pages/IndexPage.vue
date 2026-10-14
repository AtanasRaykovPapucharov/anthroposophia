<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VeilBackdrop from '@/components/VeilBackdrop.vue'
import DoctorFeature from '@/components/DoctorFeature.vue'
import { QUOTES } from '@/data/quotes'
import { FESTIVALS } from '@/data/festivals'
import { nextOccurrence, daysUntil } from '@/composables/useFestivalDates'
import logo from '@/assets/logo.svg'

const { t, locale } = useI18n()

// "Where would you like to begin?" — one path per kind of visitor
const paths = [
  { id: 'curious', icon: 'sym_r_emoji_objects', to: '/ideas', color: 'var(--c-violet)' },
  { id: 'patient', icon: 'sym_r_healing', to: '/health', color: 'var(--c-rose)' },
  { id: 'parent', icon: 'sym_r_school', to: '/fields#education', color: 'var(--c-peach)' },
  { id: 'grower', icon: 'sym_r_eco', to: '/fields#agriculture', color: 'var(--c-green)' },
]

const milestones = [
  { year: '1861', id: 'birth' },
  { year: '1913', id: 'society' },
  { year: '1919', id: 'waldorf' },
  { year: '1924', id: 'agriculture' },
  { year: '1928', id: 'secondGoetheanum' },
]

const more = [
  { to: '/history', icon: 'sym_r_history_edu', id: 'history' },
  { to: '/fields', icon: 'sym_r_local_florist', id: 'fields' },
  { to: '/festivals', icon: 'sym_r_calendar_month', id: 'festivals' },
  { to: '/library', icon: 'sym_r_menu_book', id: 'library' },
]

const quoteIndex = ref(new Date().getDate() % QUOTES.length)
const quote = computed(() => QUOTES[quoteIndex.value])
function nextQuote() {
  quoteIndex.value = (quoteIndex.value + 1) % QUOTES.length
}

// the next festival of the year, as a gentle reminder
const upcoming = computed(() => {
  const list = FESTIVALS.map((f) => ({ ...f, date: nextOccurrence(f.id) }))
  list.sort((a, b) => a.date - b.date)
  const f = list[0]
  return {
    ...f,
    days: daysUntil(f.date),
    label: new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long' }).format(f.date),
  }
})
</script>

<template>
  <q-page>
    <section class="hero">
      <VeilBackdrop class="hero-veil" />
      <div class="hero-inner">
        <img :src="logo" alt="" class="hero-logo" width="88" height="88" />
        <h1 class="hero-title">{{ t('appName') }}</h1>
        <p class="hero-lead">{{ t('home.lead') }}</p>
        <div class="hero-actions">
          <q-btn
            unelevated
            color="primary"
            size="lg"
            :label="t('home.ctaIdeas')"
            icon="sym_r_emoji_objects"
            to="/ideas"
            class="hero-btn"
          />
          <q-btn
            outline
            size="lg"
            :label="t('home.ctaMap')"
            icon="sym_r_map"
            to="/map"
            class="hero-btn hero-btn--ghost"
          />
        </div>
      </div>
    </section>

    <div class="page-wrap">
      <DoctorFeature variant="home" />

      <section aria-labelledby="paths-title">
        <h2 id="paths-title" class="section-title">{{ t('home.pathsTitle') }}</h2>
        <div class="paths">
          <router-link
            v-for="p in paths"
            :key="p.id"
            :to="p.to"
            class="path"
            :style="{ '--tint': p.color }"
          >
            <q-icon :name="p.icon" size="30px" class="path-icon" />
            <span class="path-title">{{ t(`home.paths.${p.id}.title`) }}</span>
            <span class="path-text">{{ t(`home.paths.${p.id}.text`) }}</span>
          </router-link>
        </div>
      </section>

      <section class="saying" aria-labelledby="saying-title">
        <h2 id="saying-title" class="visually-hidden">{{ t('home.sayingTitle') }}</h2>
        <blockquote>
          <p class="saying-text">{{ t(`quotes.${quote.id}`) }}</p>
          <p v-if="locale !== 'de'" class="saying-original" lang="de">{{ quote.de }}</p>
          <footer class="saying-source">{{ t('home.sayingSource') }}</footer>
        </blockquote>
        <q-btn
          flat
          no-caps
          icon="sym_r_refresh"
          :label="t('home.anotherSaying')"
          class="saying-btn"
          @click="nextQuote"
        />
      </section>

      <section class="ribbon-wrap" aria-labelledby="ribbon-title">
        <h2 id="ribbon-title" class="section-title">{{ t('home.ribbonTitle') }}</h2>
        <ol class="ribbon">
          <li v-for="m in milestones" :key="m.id">
            <span class="ribbon-year">{{ m.year }}</span>
            <span class="ribbon-text">{{ t(`history.events.${m.id}.title`) }}</span>
          </li>
        </ol>
        <q-btn
          flat
          no-caps
          color="primary"
          icon-right="sym_r_arrow_forward"
          :label="t('home.ribbonMore')"
          to="/history"
        />
      </section>

      <section class="split">
        <router-link to="/festivals" class="festival-next" :style="{ '--tint': upcoming.color }">
          <q-icon :name="upcoming.icon" size="34px" />
          <div>
            <div class="muted small">{{ t('home.nextFestival') }}</div>
            <div class="festival-name">{{ t(`festivals.items.${upcoming.id}.title`) }}</div>
            <div class="small">
              {{ upcoming.label }},
              {{ upcoming.days === 0 ? t('home.today') : t('home.inDays', { n: upcoming.days }) }}
            </div>
          </div>
        </router-link>

        <nav class="more" :aria-label="t('home.moreTitle')">
          <router-link v-for="m in more" :key="m.id" :to="m.to" class="more-link">
            <q-icon :name="m.icon" size="22px" />
            <span>
              <strong>{{ t(`nav.${m.id}`) }}</strong>
              <span class="muted">{{ t(`home.more.${m.id}`) }}</span>
            </span>
          </router-link>
        </nav>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 56px 20px 64px;
  border-radius: 0 0 64px 18px;
}

@media (min-width: 600px) {
  .hero {
    padding: 96px 40px 104px;
    border-radius: 0 0 120px 24px;
  }
}

.hero-veil {
  z-index: -1;
}

.hero-inner {
  max-width: var(--page-max);
  margin: 0 auto;
}

.hero-logo {
  display: block;
  margin-bottom: 18px;
}

.hero-title {
  font-size: var(--fs-hero);
  line-height: 0.98;
  font-weight: 500;
  margin: 0 0 18px;
  letter-spacing: -0.02em;
  // the name is the signature element: set large, in the calligraphic serif, with
  // a slow ink-like reveal that is played once
  animation: ink 1.8s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

:lang(ja) .hero-title {
  letter-spacing: 0.04em;
}

@keyframes ink {
  from {
    opacity: 0;
    filter: blur(10px);
    letter-spacing: 0.04em;
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

.hero-lead {
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2.6vw, 1.55rem);
  line-height: 1.45;
  max-width: 34ch;
  margin: 0 0 30px;
}

:lang(ja) .hero-lead,
:lang(ru) .hero-lead,
:lang(bg) .hero-lead,
:lang(de) .hero-lead {
  max-width: 40ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-btn {
  padding: 4px 22px;
}

.hero-btn--ghost {
  color: var(--app-text);
  background: color-mix(in srgb, var(--app-surface) 55%, transparent) !important;
}

@media (max-width: 480px) {
  .hero-actions .hero-btn {
    width: 100%;
  }
}

.section-title {
  font-size: var(--fs-h3);
  margin: 1.4em 0 0.7em;
}

.paths {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .paths {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1000px) {
  .paths {
    grid-template-columns: repeat(4, 1fr);
  }
}

.path {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 14px;
  padding: 20px 22px;
  text-decoration: none;
  color: var(--app-text);
  border-radius: var(--shape-leaf);
  background:
    radial-gradient(
      120% 140% at 0% 0%,
      color-mix(in srgb, var(--tint) 34%, transparent),
      transparent 70%
    ),
    var(--app-surface);
  border: 1px solid color-mix(in srgb, var(--tint) 30%, var(--app-border));
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--tint);
  }
}

@media (min-width: 1000px) {
  .path {
    grid-template-columns: 1fr;
    row-gap: 6px;
    min-height: 190px;
    align-content: start;
  }
}

.path-icon {
  grid-row: span 2;
  color: var(--tint);
  filter: saturate(1.3) brightness(0.85);
}

body.body--dark .path-icon {
  filter: saturate(1.1) brightness(1.2);
}

@media (min-width: 1000px) {
  .path-icon {
    grid-row: auto;
    margin-bottom: 6px;
  }
}

.path-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  line-height: 1.2;
}

.path-text {
  color: var(--app-muted);
  font-size: 0.98rem;
  line-height: 1.45;
}

.saying {
  margin: 56px 0 24px;
  padding: 0 0 0 24px;
  border-left: 3px solid var(--c-peach);
  max-width: 62ch;

  blockquote {
    margin: 0;
  }
}

.saying-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  line-height: 1.35;
  margin: 0 0 12px;
}

:lang(ja) .saying-text {
  font-style: normal;
  line-height: 1.6;
}

.saying-original {
  color: var(--app-muted);
  font-family: var(--font-serif);
  font-size: 1rem;
  margin: 0 0 6px;
}

.saying-source {
  font-size: 0.92rem;
  color: var(--app-muted);
}

.saying-btn {
  margin-left: -12px;
  margin-top: 6px;
  color: var(--app-muted);
}

.ribbon {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  display: flex;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 6px;

  li {
    flex: 1 0 168px;
    scroll-snap-align: start;
    padding: 14px 18px 4px 0;
    border-top: 2px solid var(--app-border);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  li::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--c-gold);
    box-shadow: 0 0 0 3px var(--app-page);
  }
}

.ribbon-year {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  line-height: 1;
  font-variant-numeric: lining-nums;
}

.ribbon-text {
  font-size: 0.95rem;
  color: var(--app-muted);
  line-height: 1.35;
}

.split {
  display: grid;
  gap: 18px;
  margin-top: 40px;
}

@media (min-width: 800px) {
  .split {
    grid-template-columns: 1fr 1.4fr;
    align-items: start;
  }
}

.festival-next {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 22px;
  border-radius: 999px 999px 999px 24px;
  text-decoration: none;
  color: var(--app-text);
  background: color-mix(in srgb, var(--tint) 22%, var(--app-surface));

  .q-icon {
    color: var(--tint);
    filter: brightness(0.8) saturate(1.4);
  }
}

.festival-name {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  line-height: 1.15;
}

.more {
  display: grid;
  gap: 2px;
}

@media (min-width: 600px) {
  .more {
    grid-template-columns: 1fr 1fr;
  }
}

.more-link {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px 4px 18px 4px;
  text-decoration: none;
  color: var(--app-text);
  align-items: flex-start;

  .q-icon {
    margin-top: 2px;
    color: var(--app-muted);
  }

  > span {
    display: flex;
    flex-direction: column;
    line-height: 1.35;
  }

  strong {
    font-weight: 600;
  }

  .muted {
    font-size: 0.92rem;
  }

  &:hover {
    background: var(--app-surface-soft);
  }
}
</style>
