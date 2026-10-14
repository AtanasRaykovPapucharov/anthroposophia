<script setup>
import { ref, watch } from 'vue'

// Photo of the doctor with an organic frame; shows initials until the photo exists.
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  initials: { type: String, default: '' },
  size: { type: Number, default: 160 },
})

const failed = ref(!props.src)
watch(
  () => props.src,
  (v) => (failed.value = !v),
)
</script>

<template>
  <div class="avatar" :style="{ '--size': `${size}px` }">
    <img v-if="!failed" :src="src" :alt="alt" class="avatar-img" @error="failed = true" />
    <div v-else class="avatar-fallback" role="img" :aria-label="alt">{{ initials }}</div>
  </div>
</template>

<style scoped>
.avatar {
  width: var(--size);
  height: var(--size);
  flex: none;
  padding: 5px;
  border-radius: 50%;
  background: conic-gradient(
    from 200deg,
    var(--c-peach),
    var(--c-gold),
    var(--c-green),
    var(--c-violet),
    var(--c-peach)
  );
}

.avatar-img,
.avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  display: block;
  object-fit: cover;
  border: 4px solid var(--app-page);
}

.avatar-fallback {
  display: grid;
  place-items: center;
  background: var(--app-surface-tint);
  color: var(--app-text);
  font-family: var(--font-serif);
  font-size: calc(var(--size) * 0.32);
}
</style>
