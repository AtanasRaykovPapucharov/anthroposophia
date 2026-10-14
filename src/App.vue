<template>
  <router-view />
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings-store'

// Sync vue-i18n, Quasar's language pack, <html lang> and the colour theme on startup
const settings = useSettingsStore()
const { t } = useI18n()
settings.setLocale(settings.locale)
settings.setTheme(settings.theme)

useMeta(() => ({
  title: t('appName'),
  meta: { description: { name: 'description', content: t('tagline') } },
}))
</script>
