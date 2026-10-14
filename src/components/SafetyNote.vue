<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps({ compact: { type: Boolean, default: false } })
</script>

<template>
  <aside class="safety" :class="{ 'safety--compact': compact }" role="note">
    <q-icon name="sym_r_info" size="26px" class="safety-icon" />
    <div>
      <p class="safety-title">{{ t('health.notice.title') }}</p>
      <p class="safety-text">{{ t('health.notice.text') }}</p>
    </div>
  </aside>
</template>

<style scoped>
.safety {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px 20px;
  border-radius: 24px 6px 24px 6px;
  background: color-mix(in srgb, var(--c-gold) 18%, var(--app-surface));
  border: 1px solid color-mix(in srgb, var(--c-gold) 45%, transparent);
}

.safety-icon {
  color: #9b6f12;
  flex: none;
  margin-top: 2px;
}

body.body--dark .safety-icon {
  color: var(--c-gold);
}

.safety-title {
  font-weight: 700;
  margin: 0 0 4px;
}

.safety-text {
  margin: 0;
  line-height: 1.5;
}

.safety--compact {
  padding: 12px 16px;
  font-size: 0.95rem;
}
</style>
