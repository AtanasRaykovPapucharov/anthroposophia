<script setup>
import { useI18n } from 'vue-i18n'
import VeilBackdrop from '@/components/VeilBackdrop.vue'
const { t } = useI18n()
</script>

<template>
  <div class="nf">
    <VeilBackdrop class="nf-veil" />
    <div class="nf-body">
      <div class="nf-code">404</div>
      <h1>{{ t('notFound.title') }}</h1>
      <p class="lead">{{ t('notFound.text') }}</p>
      <q-btn
        unelevated
        color="primary"
        size="lg"
        icon="sym_r_home"
        :label="t('notFound.back')"
        to="/"
      />
    </div>
  </div>
</template>

<style scoped>
.nf {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
  background: var(--app-page);
}
.nf-veil {
  z-index: -1;
}
.nf-body {
  max-width: 520px;
  text-align: center;
}
.nf-code {
  font-family: var(--font-serif);
  font-size: 6rem;
  line-height: 1;
  opacity: 0.5;
}
.nf .lead {
  margin: 0 auto 24px;
}
</style>
