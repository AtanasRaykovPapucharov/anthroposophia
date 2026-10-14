<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import DoctorAvatar from './DoctorAvatar.vue'
import { useDoctor } from '@/composables/useDoctor'
import { createCallService, IS_CALL_MOCK } from '@/services/callService'

const model = defineModel({ type: Boolean, default: false })

const { t } = useI18n()
const { doctor } = useDoctor()

const state = ref('idle') // idle | dialing | ringing | connected | ended
const muted = ref(false)
const speaker = ref(false)
const video = ref(false)
const seconds = ref(0)
let timer = null

const service = createCallService()
service.onEvent = (e) => {
  if (e.type === 'state') state.value = e.state
}

// ------------------------------------------------- soft ringback tone (Web Audio)
let audio = null
let ringTimer = null
function startRingback() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)()
    const beep = () => {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.frequency.value = 425 // European ringback tone
      gain.gain.setValueAtTime(0.0001, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.05)
      gain.gain.setValueAtTime(0.06, audio.currentTime + 0.95)
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 1)
      osc.connect(gain).connect(audio.destination)
      osc.start()
      osc.stop(audio.currentTime + 1.05)
    }
    beep()
    ringTimer = setInterval(beep, 3000)
  } catch {
    // audio not available — the call still works silently
  }
}
function stopRingback() {
  clearInterval(ringTimer)
  ringTimer = null
}

// ------------------------------------------------- state handling
watch(state, (s) => {
  if (s === 'ringing') startRingback()
  else stopRingback()

  if (s === 'connected') {
    seconds.value = 0
    timer = setInterval(() => seconds.value++, 1000)
  } else {
    clearInterval(timer)
  }
})

watch(model, (open) => {
  if (open) call()
  else service.hangup()
})

function call() {
  muted.value = false
  speaker.value = false
  video.value = false
  seconds.value = 0
  service.start({ video: false })
}

function hangup() {
  service.hangup()
}

function toggle(which) {
  if (which === 'mute') service.setMuted((muted.value = !muted.value))
  if (which === 'speaker') service.setSpeaker((speaker.value = !speaker.value))
  if (which === 'video') service.setVideo((video.value = !video.value))
}

const duration = computed(() => {
  const m = String(Math.floor(seconds.value / 60)).padStart(2, '0')
  const s = String(seconds.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

const statusText = computed(() => {
  if (state.value === 'connected') return duration.value
  if (state.value === 'ended') return t('doctor.callUi.duration', { time: duration.value })
  if (state.value === 'idle') return ''
  return t(`doctor.callUi.${state.value}`)
})

const active = computed(() => ['dialing', 'ringing', 'connected'].includes(state.value))

onBeforeUnmount(() => {
  service.hangup()
  stopRingback()
  clearInterval(timer)
  audio?.close?.()
})
</script>

<template>
  <q-dialog
    v-model="model"
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <div
      class="call"
      :class="`call--${state}`"
      role="dialog"
      :aria-label="t('doctor.callUi.title')"
    >
      <p v-if="IS_CALL_MOCK" class="call-demo" role="note">
        <q-icon name="sym_r_science" size="18px" />
        {{ t('doctor.callUi.demo') }}
      </p>

      <div class="call-main">
        <div
          class="ring-wrap"
          :class="{ 'is-ringing': state === 'ringing' || state === 'dialing' }"
        >
          <DoctorAvatar
            :src="doctor.photo"
            :alt="t('doctor.photoAlt', { name: doctor.name })"
            :initials="doctor.initials"
            :size="168"
          />
        </div>
        <h2 class="call-name">{{ doctor.name }}</h2>
        <p class="call-status" aria-live="polite">
          <span v-if="state === 'ended'">{{ t('doctor.callUi.ended') }}</span>
          <span v-else-if="state === 'connected'">{{ t('doctor.callUi.connected') }}</span>
          <span class="call-time">{{ statusText }}</span>
        </p>
        <p v-if="video && state === 'connected'" class="call-video-note">
          <q-icon name="sym_r_videocam_off" /> {{ t('doctor.callUi.noVideo') }}
        </p>
      </div>

      <div v-if="active" class="controls">
        <button
          type="button"
          class="ctl"
          :class="{ 'is-on': muted }"
          :aria-pressed="muted"
          @click="toggle('mute')"
        >
          <q-icon :name="muted ? 'sym_r_mic_off' : 'sym_r_mic'" size="28px" />
          <span>{{ muted ? t('doctor.callUi.unmute') : t('doctor.callUi.mute') }}</span>
        </button>
        <button
          type="button"
          class="ctl"
          :class="{ 'is-on': speaker }"
          :aria-pressed="speaker"
          @click="toggle('speaker')"
        >
          <q-icon name="sym_r_volume_up" size="28px" />
          <span>{{ t('doctor.callUi.speaker') }}</span>
        </button>
        <button
          type="button"
          class="ctl"
          :class="{ 'is-on': video }"
          :aria-pressed="video"
          @click="toggle('video')"
        >
          <q-icon :name="video ? 'sym_r_videocam' : 'sym_r_videocam_off'" size="28px" />
          <span>{{ t('doctor.callUi.video') }}</span>
        </button>
        <button type="button" class="ctl ctl--hangup" @click="hangup">
          <q-icon name="sym_r_call_end" size="30px" />
          <span>{{ t('doctor.callUi.hangup') }}</span>
        </button>
      </div>

      <div v-else class="after">
        <q-btn
          unelevated
          no-caps
          size="lg"
          icon="sym_r_call"
          :label="t('doctor.callUi.again')"
          class="btn-book"
          @click="call"
        />
        <q-btn
          v-close-popup
          outline
          no-caps
          size="lg"
          :label="t('doctor.callUi.close')"
          class="after-close"
        />
      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.call {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #f3f1fb;
  background:
    radial-gradient(70% 50% at 50% 30%, rgba(176, 63, 104, 0.35), transparent 70%),
    radial-gradient(60% 50% at 20% 90%, rgba(95, 168, 201, 0.25), transparent 70%),
    linear-gradient(180deg, #1d2450, #10142b);
  padding: env(safe-area-inset-top, 0px) 20px calc(28px + env(safe-area-inset-bottom, 0px));
}

.call-demo {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: center;
  margin: 14px auto 0;
  padding: 8px 14px;
  max-width: 520px;
  font-size: 0.85rem;
  line-height: 1.4;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  text-align: left;
}

.call-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
}

.ring-wrap {
  position: relative;
  border-radius: 50%;
  margin-bottom: 18px;

  &.is-ringing::before,
  &.is-ringing::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(244, 169, 196, 0.6);
    animation: pulse 2.4s ease-out infinite;
  }

  &.is-ringing::after {
    animation-delay: 1.2s;
  }
}

.ring-wrap :deep(.avatar-img),
.ring-wrap :deep(.avatar-fallback) {
  border-color: #1d2450;
}

@keyframes pulse {
  from {
    transform: scale(1);
    opacity: 0.9;
  }
  to {
    transform: scale(1.45);
    opacity: 0;
  }
}

.call-name {
  color: #fff;
  margin: 0;
  font-size: clamp(1.8rem, 6vw, 2.6rem);
}

.call-status {
  margin: 0;
  font-size: 1.1rem;
  color: rgba(243, 241, 251, 0.8);
}

.call-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.call-time {
  font-variant-numeric: tabular-nums;
}

.call-video-note {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(243, 241, 251, 0.7);
}

.controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
}

.ctl {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  min-width: 0;

  .q-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    transition: background 0.2s ease;
  }

  &.is-on .q-icon {
    background: #f3f1fb;
    color: #1d2450;
  }

  &:focus-visible {
    outline: none;

    .q-icon {
      outline: 2px solid var(--c-gold);
      outline-offset: 3px;
    }
  }
}

.ctl--hangup .q-icon {
  background: #d23c4f;
  color: #fff;
}

.after {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 460px;
  width: 100%;
  margin: 0 auto;

  .q-btn {
    flex: 1 1 180px;
  }
}

.after-close {
  color: #f3f1fb;
}
</style>
