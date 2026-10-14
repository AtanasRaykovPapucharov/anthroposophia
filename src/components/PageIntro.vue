<script setup>
import VeilBackdrop from './VeilBackdrop.vue'

defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  icon: { type: String, default: '' },
  colors: { type: Array, default: undefined },
  seed: { type: Number, default: 0 },
})
</script>

<template>
  <header class="intro">
    <VeilBackdrop :colors="colors" :seed="seed" :animated="false" class="intro-veil" />
    <div class="intro-body">
      <q-icon v-if="icon" :name="icon" size="34px" class="intro-icon" />
      <h1>{{ title }}</h1>
      <p v-if="lead" class="lead">{{ lead }}</p>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.intro {
  position: relative;
  overflow: hidden;
  border-radius: 0 0 48px 12px;
  margin: 0 -20px 28px;
  padding: 40px 20px 34px;
  isolation: isolate;
}

@media (min-width: 600px) {
  .intro {
    margin: -12px 0 36px;
    border-radius: 48px 12px 48px 12px;
    padding: 56px 44px 46px;
  }
}

.intro-veil {
  z-index: -1;
}

.intro-body {
  position: relative;
  max-width: 62ch;
}

.intro-icon {
  color: var(--app-text);
  opacity: 0.75;
  margin-bottom: 10px;
}

.intro h1 {
  margin-bottom: 0.25em;
}

.intro .lead {
  color: var(--app-text);
  opacity: 0.86;
  margin: 0;
}
</style>
