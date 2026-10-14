<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import DoctorAvatar from './DoctorAvatar.vue'
import { useChatStore } from '@/stores/chat-store'
import { useDoctor } from '@/composables/useDoctor'
import { IS_CHAT_MOCK } from '@/services/chatService'

const { t, locale } = useI18n()
const $q = useQuasar()
const chat = useChatStore()
const { doctor } = useDoctor()

const draft = ref('')
const listEl = ref(null)
const inputRef = ref(null)

const quick = ['book', 'group', 'price', 'hours']

const timeFmt = computed(
  () => new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit' }),
)

// practice replies are stored as intents and translated when shown
function textOf(m) {
  if (m.text) return m.text
  // without set consultation hours, answer with how times are arranged instead
  const intent = m.intent === 'hours' && !doctor.value.hours ? 'hoursAsk' : m.intent
  return t(`doctor.chat.replies.${intent}`, {
    name: doctor.value.name,
    hours: doctor.value.hours,
  })
}

function send(text = draft.value) {
  if (!text.trim()) return
  chat.send(text)
  draft.value = ''
  inputRef.value?.focus()
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function scrollToEnd() {
  await nextTick()
  const el = listEl.value
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
}

watch(() => [chat.messages.length, chat.typing], scrollToEnd)
watch(
  () => chat.open,
  (open) => {
    if (open) {
      scrollToEnd()
      setTimeout(() => inputRef.value?.focus(), 250)
    }
  },
)
</script>

<template>
  <q-dialog
    v-model="chat.open"
    :maximized="$q.screen.lt.sm"
    :position="$q.screen.lt.sm ? 'standard' : 'right'"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <div class="chat" role="dialog" :aria-label="t('doctor.chat.title')">
      <header class="chat-head">
        <DoctorAvatar
          :src="doctor.photo"
          :alt="t('doctor.photoAlt', { name: doctor.name })"
          :initials="doctor.initials"
          :size="44"
        />
        <div class="chat-who">
          <div class="chat-name">{{ doctor.name }}</div>
          <div class="chat-status" :class="{ 'is-online': chat.status === 'online' }">
            {{ chat.typing ? t('doctor.chat.typing') : t(`doctor.chat.status.${chat.status}`) }}
          </div>
        </div>
        <q-btn
          flat
          round
          dense
          icon="sym_r_delete_sweep"
          :aria-label="t('doctor.chat.clear')"
          @click="chat.clear()"
        >
          <q-tooltip>{{ t('doctor.chat.clear') }}</q-tooltip>
        </q-btn>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="sym_r_close"
          :aria-label="t('doctor.chat.close')"
        />
      </header>

      <p v-if="IS_CHAT_MOCK" class="chat-demo" role="note">
        <q-icon name="sym_r_science" size="18px" />
        {{ t('doctor.chat.demo') }}
      </p>

      <ol ref="listEl" class="chat-list" aria-live="polite">
        <li
          v-for="m in chat.messages"
          :key="m.id"
          class="msg"
          :class="m.from === 'patient' ? 'msg--me' : 'msg--them'"
        >
          <div class="bubble" :class="{ 'bubble--urgent': m.intent === 'urgent' }">
            {{ textOf(m) }}
          </div>
          <time class="msg-time">{{ timeFmt.format(m.at) }}</time>
        </li>
        <li v-if="chat.typing" class="msg msg--them" :aria-label="t('doctor.chat.typing')">
          <div class="bubble bubble--typing"><span /><span /><span /></div>
        </li>
      </ol>

      <div v-if="!chat.hasPatientMessages" class="quick">
        <button
          v-for="q in quick"
          :key="q"
          type="button"
          class="quick-btn"
          @click="send(t(`doctor.chat.quick.${q}`))"
        >
          {{ t(`doctor.chat.quick.${q}`) }}
        </button>
      </div>

      <form class="chat-input" @submit.prevent="send()">
        <q-input
          ref="inputRef"
          v-model="draft"
          outlined
          dense
          autogrow
          maxlength="1000"
          :placeholder="t('doctor.chat.placeholder')"
          :aria-label="t('doctor.chat.placeholder')"
          class="chat-field"
          @keydown="onKeydown"
        />
        <q-btn
          type="submit"
          round
          unelevated
          icon="sym_r_send"
          class="btn-book"
          :disable="!draft.trim()"
          :aria-label="t('doctor.chat.send')"
        />
      </form>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-page);
  color: var(--app-text);
}

@media (min-width: 600px) {
  .chat {
    width: 420px;
    max-width: 100vw;
    height: 100vh;
    border-radius: 28px 0 0 28px;
    overflow: hidden;
  }
}

.chat-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: calc(12px + env(safe-area-inset-top, 0px)) 10px 12px 16px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
}

.chat-head :deep(.avatar) {
  padding: 2px;
}

.chat-head :deep(.avatar-img),
.chat-head :deep(.avatar-fallback) {
  border-width: 2px;
}

.chat-who {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-status {
  font-size: 0.85rem;
  color: var(--app-muted);
  display: flex;
  align-items: center;
  gap: 6px;

  &.is-online::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--q-positive);
  }
}

.chat-demo {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0;
  padding: 10px 16px;
  font-size: 0.85rem;
  line-height: 1.4;
  background: color-mix(in srgb, var(--c-teal) 14%, var(--app-surface));
  border-bottom: 1px solid var(--app-border);

  .q-icon {
    margin-top: 1px;
    flex: none;
  }
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 18px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overscroll-behavior: contain;
}

.msg {
  display: flex;
  flex-direction: column;
  max-width: 82%;
}

.msg--me {
  align-self: flex-end;
  align-items: flex-end;
}

.msg--them {
  align-self: flex-start;
}

.bubble {
  padding: 10px 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.msg--them .bubble {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px 20px 20px 6px;
}

.msg--me .bubble {
  background: var(--c-book);
  color: #fff;
  border-radius: 20px 20px 6px 20px;
}

.bubble--urgent {
  border-color: var(--q-negative) !important;
  background: color-mix(in srgb, var(--q-negative) 12%, var(--app-surface)) !important;
  font-weight: 600;
}

.msg-time {
  font-size: 0.72rem;
  color: var(--app-muted);
  margin: 3px 6px 0;
}

.bubble--typing {
  display: inline-flex;
  gap: 4px;
  padding: 14px 16px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--app-muted);
    animation: blink 1.2s infinite ease-in-out;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}

.quick {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 14px 8px;
}

.quick-btn {
  appearance: none;
  font: inherit;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--c-book) 45%, var(--app-border));
  background: var(--app-surface);
  color: var(--app-text);
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 10px 12px calc(12px + env(safe-area-inset-bottom, 0px));
  background: var(--app-surface);
  border-top: 1px solid var(--app-border);
}

.chat-field {
  flex: 1;
}

.chat-field :deep(.q-field__control) {
  border-radius: 22px;
  background: var(--app-page);
}
</style>
