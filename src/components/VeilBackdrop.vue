<script setup>
// Lazure ("veil") painting: translucent washes of colour laid over one another,
// as on the walls of Waldorf classrooms. Drawn once, softly, when the page opens.
const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#e9a89b', '#8a6bb8', '#e0b04a', '#6f9e6a', '#3b4a8c'],
  },
  animated: { type: Boolean, default: true },
  seed: { type: Number, default: 0 },
})

// fixed, hand-placed shapes (x, y, rx, ry, rotation) — a seed rotates which colour goes where
const shapes = [
  [140, 120, 260, 170, -18],
  [620, 90, 280, 160, 14],
  [420, 330, 300, 150, -6],
  [80, 400, 220, 140, 22],
  [720, 380, 240, 170, -24],
]

const uid = `veil-${Math.random().toString(36).slice(2, 8)}`
const colorAt = (i) => props.colors[(i + props.seed) % props.colors.length]
</script>

<template>
  <svg
    class="veil"
    :class="{ 'veil--animated': animated }"
    viewBox="0 0 800 500"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <filter :id="`${uid}-blur`" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="38" />
      </filter>
      <radialGradient v-for="(s, i) in shapes" :id="`${uid}-g${i}`" :key="i">
        <stop offset="0" :stop-color="colorAt(i)" stop-opacity="0.95" />
        <stop offset="0.65" :stop-color="colorAt(i)" stop-opacity="0.55" />
        <stop offset="1" :stop-color="colorAt(i)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g :filter="`url(#${uid}-blur)`">
      <ellipse
        v-for="(s, i) in shapes"
        :key="i"
        class="veil-shape"
        :style="{ animationDelay: `${i * 0.28}s` }"
        :cx="s[0]"
        :cy="s[1]"
        :rx="s[2]"
        :ry="s[3]"
        :transform="`rotate(${s[4]} ${s[0]} ${s[1]})`"
        :fill="`url(#${uid}-g${i})`"
      />
    </g>
  </svg>
</template>

<style scoped>
.veil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: var(--veil-opacity);
  mix-blend-mode: var(--veil-blend);
}

.veil-shape {
  transform-box: fill-box;
  transform-origin: center;
}

.veil--animated .veil-shape {
  animation: veil-in 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes veil-in {
  from {
    opacity: 0;
    scale: 0.7;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
</style>
