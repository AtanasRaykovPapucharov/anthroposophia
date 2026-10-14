<script setup>
import PageIntro from '@/components/PageIntro.vue'
import { useContent } from '@/composables/useContent'
import { useSettingsStore, LOCALE_OPTIONS } from '@/stores/settings-store'
import logo from '@/assets/logo.svg'

const { t, list } = useContent()
const settings = useSettingsStore()
const version = '1.0.0'
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro :title="t('about.title')" :lead="t('about.lead')" icon="sym_r_info" :seed="1" />

      <section class="reading">
        <p v-for="(p, i) in list('about.paragraphs')" :key="i">{{ p }}</p>
      </section>

      <section class="settings surface">
        <h2>{{ t('about.settings') }}</h2>
        <div class="row-set">
          <span class="set-label">{{ t('nav.language') }}</span>
          <q-btn-toggle
            :model-value="settings.locale"
            :options="LOCALE_OPTIONS.map((l) => ({ label: l.label, value: l.value }))"
            no-caps
            unelevated
            rounded
            toggle-color="primary"
            class="toggle"
            @update:model-value="settings.setLocale"
          />
        </div>
        <div class="row-set">
          <span class="set-label">{{ t('about.theme') }}</span>
          <q-btn-toggle
            :model-value="settings.theme"
            :options="[
              { label: t('nav.theme.auto'), value: 'auto', icon: 'sym_r_brightness_auto' },
              { label: t('nav.theme.light'), value: 'light', icon: 'sym_r_light_mode' },
              { label: t('nav.theme.dark'), value: 'dark', icon: 'sym_r_dark_mode' },
            ]"
            no-caps
            unelevated
            rounded
            toggle-color="primary"
            class="toggle"
            @update:model-value="settings.setTheme"
          />
        </div>
      </section>

      <section class="reading">
        <h2>{{ t('about.disclaimerTitle') }}</h2>
        <p>{{ t('about.disclaimer') }}</p>
        <h2>{{ t('about.creditsTitle') }}</h2>
        <p>{{ t('about.credits') }}</p>
      </section>

      <footer class="colophon">
        <img :src="logo" alt="" width="44" height="44" />
        <span>{{ t('appName') }} {{ version }}</span>
      </footer>
    </div>
  </q-page>
</template>

<style scoped>
.settings {
  padding: 8px 24px 20px;
  margin: 24px 0;
}

.settings h2 {
  margin-top: 0.8em;
  font-size: var(--fs-h3);
}

.row-set {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  margin-bottom: 14px;
}

.set-label {
  min-width: 90px;
  color: var(--app-muted);
}

.toggle {
  flex-wrap: wrap;
  border: 1px solid var(--app-border);
}

.colophon {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  color: var(--app-muted);
  font-family: var(--font-serif);
}
</style>
