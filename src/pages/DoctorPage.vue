<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import { useI18n } from 'vue-i18n'
import DoctorAvatar from '@/components/DoctorAvatar.vue'
import SafetyNote from '@/components/SafetyNote.vue'
import VeilBackdrop from '@/components/VeilBackdrop.vue'
import ChatDialog from '@/components/ChatDialog.vue'
import CallDialog from '@/components/CallDialog.vue'
import { useChatStore } from '@/stores/chat-store'
import { useDoctor } from '@/composables/useDoctor'
import { useContent } from '@/composables/useContent'

const { t, locale } = useI18n()
const { list } = useContent()
const { doctor } = useDoctor()
const $q = useQuasar()
const route = useRoute()

const contact = computed(() => doctor.value.contact)

// chat and in-app call (demo for now, see src/services)
const chat = useChatStore()
const callOpen = ref(false)

// ---------------------------------------------------------------- form state
const kinds = ['first', 'followup', 'online', 'group']
const times = ['morning', 'afternoon', 'any']

const form = ref({
  kind: 'first',
  group: '',
  name: '',
  phone: '',
  email: '',
  days: [],
  time: 'any',
  note: '',
  consent: false,
})
const formRef = ref(null)
const bookEl = ref(null)
const prepared = ref(false)

const dayOptions = computed(() => {
  const fmt = new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
  // 2024-01-01 was a Monday
  return Array.from({ length: 6 }, (_, i) => ({
    value: i + 1,
    label: fmt.format(new Date(2024, 0, 1 + i)),
  }))
})

const groupOptions = computed(() =>
  doctor.value.groups
    .filter((g) => g.status !== 'full')
    .map((g) => ({ label: g.title, value: g.id })),
)

const rules = {
  required: (v) => (!!v && String(v).trim().length > 1) || t('doctor.form.required'),
  phone: (v) =>
    /^[+\d][\d\s()/-]{6,}$/.test(String(v || '').trim()) || t('doctor.form.phoneInvalid'),
  email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || t('doctor.form.emailInvalid'),
  group: (v) => form.value.kind !== 'group' || !!v || t('doctor.form.required'),
}

// open the form for a particular group (from a group card or ?group=)
async function joinGroup(id) {
  form.value.kind = 'group'
  form.value.group = id
  prepared.value = false
  await nextTick()
  bookEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  if (route.query.group) joinGroup(String(route.query.group))
})

watch(
  () => form.value.kind,
  (k) => {
    if (k !== 'group') form.value.group = ''
  },
)

// ---------------------------------------------------------------- message
const message = computed(() => {
  const f = form.value
  const m = (k) => t(`doctor.form.msg.${k}`)
  const group = doctor.value.groups.find((g) => g.id === f.group)
  const days = dayOptions.value
    .filter((d) => f.days.includes(d.value))
    .map((d) => d.label)
    .join(', ')
  const lines = [
    `${m('greeting')} ${t(`doctor.form.kinds.${f.kind}`)}.`,
    '',
    group ? `${m('group')}: ${group.title}` : null,
    `${m('name')}: ${f.name.trim()}`,
    `${m('phone')}: ${f.phone.trim()}`,
    f.email ? `${m('email')}: ${f.email.trim()}` : null,
    days ? `${m('days')}: ${days}` : null,
    `${m('time')}: ${t(`doctor.form.times.${f.time}`)}`,
    f.note.trim() ? `${m('note')}: ${f.note.trim()}` : null,
    '',
    m('thanks'),
  ]
  return lines.filter((l) => l !== null).join('\n')
})

const subject = computed(() => `${t('doctor.form.subject')}: ${form.value.name.trim()}`)

const channels = computed(() => {
  const c = contact.value
  const text = encodeURIComponent(message.value)
  const out = []
  if (c.email)
    out.push({
      id: 'email',
      icon: 'sym_r_mail',
      href: `mailto:${c.email}?subject=${encodeURIComponent(subject.value)}&body=${text}`,
    })
  if (c.whatsapp)
    out.push({
      id: 'whatsapp',
      icon: 'sym_r_chat',
      href: `https://wa.me/${c.whatsapp}?text=${text}`,
    })
  if (c.viber) out.push({ id: 'viber', icon: 'sym_r_forum', href: `viber://forward?text=${text}` })
  if (c.phone)
    out.push({
      id: 'sms',
      icon: 'sym_r_sms',
      href: `sms:${c.phone.replace(/\s/g, '')}?&body=${text}`,
    })
  return out
})

async function prepare() {
  const ok = await formRef.value.validate()
  if (!ok) return
  if (!form.value.consent) {
    $q.notify({ message: t('doctor.form.consentRequired'), color: 'negative' })
    return
  }
  prepared.value = true
  await nextTick()
  document.getElementById('send-options')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function copyMessage() {
  try {
    await copyToClipboard(message.value)
    $q.notify({ message: t('doctor.form.copied'), icon: 'sym_r_check', color: 'positive' })
  } catch {
    $q.notify({ message: t('health.questions.copyFailed'), color: 'negative' })
  }
}

// editing the form after preparing hides the send buttons until prepared again
watch(
  () => ({ ...form.value }),
  () => {
    if (prepared.value) prepared.value = false
  },
  { deep: true },
)

const faq = ['bring', 'cost', 'cancel', 'privacy']
</script>

<template>
  <q-page>
    <!-- profile -->
    <section class="profile">
      <VeilBackdrop class="profile-veil" :colors="['#e9a89b', '#e0b04a', '#6f9e6a', '#8a6bb8']" />
      <div class="profile-inner">
        <DoctorAvatar
          :src="doctor.photo"
          :alt="t('doctor.photoAlt', { name: doctor.name })"
          :initials="doctor.initials"
          :size="$q.screen.lt.sm ? 148 : 200"
        />
        <div class="profile-body">
          <p class="profile-kicker">{{ t('doctor.pageTitle') }}</p>
          <h1 class="profile-name">{{ doctor.name }}</h1>
          <p v-if="doctor.title" class="profile-title">{{ doctor.title }}</p>
          <ul v-if="doctor.highlights.length" class="highlights">
            <li v-for="(h, i) in doctor.highlights" :key="i">{{ h }}</li>
          </ul>
          <div class="profile-actions">
            <q-btn
              unelevated
              no-caps
              size="lg"
              icon="sym_r_event_available"
              :label="t('doctor.bookCta')"
              class="btn-book"
              @click="bookEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })"
            />
            <q-btn
              v-if="contact.bookingUrl"
              outline
              no-caps
              size="lg"
              icon="sym_r_calendar_month"
              :label="t('doctor.onlineBooking')"
              :href="contact.bookingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ghost-btn"
            />
            <q-btn
              outline
              no-caps
              size="lg"
              icon="sym_r_chat"
              :label="t('doctor.chat.open')"
              class="ghost-btn"
              @click="chat.openChat()"
            />
            <q-btn
              outline
              no-caps
              size="lg"
              icon="sym_r_call"
              :label="t('doctor.callUi.open')"
              class="ghost-btn"
              @click="callOpen = true"
            />
            <q-btn
              v-if="contact.phone"
              flat
              no-caps
              size="lg"
              icon="sym_r_phone_in_talk"
              :label="t('doctor.callUi.phone')"
              :href="`tel:${contact.phone.replace(/\s/g, '')}`"
              class="ghost-btn"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="page-wrap">
      <!-- about -->
      <section class="about" aria-labelledby="about-title">
        <div class="reading">
          <h2 id="about-title">{{ t('doctor.about') }}</h2>
          <p v-for="(p, i) in doctor.bio" :key="i">{{ p }}</p>
          <q-btn
            v-if="contact.facebook"
            flat
            no-caps
            icon="sym_r_open_in_new"
            :label="t('doctor.facebook')"
            :href="contact.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="fb-btn"
          />
        </div>
        <dl class="facts surface">
          <div v-if="doctor.address">
            <dt><q-icon name="sym_r_pin_drop" /> {{ t('doctor.location') }}</dt>
            <dd>
              {{ doctor.address }}
              <a
                v-if="contact.mapUrl"
                :href="contact.mapUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('map.directions') }}
              </a>
            </dd>
          </div>
          <div v-if="doctor.hours">
            <dt><q-icon name="sym_r_schedule" /> {{ t('doctor.hours') }}</dt>
            <dd>{{ doctor.hours }}</dd>
          </div>
          <div v-if="doctor.languages">
            <dt><q-icon name="sym_r_translate" /> {{ t('doctor.languages') }}</dt>
            <dd>{{ doctor.languages }}</dd>
          </div>
          <div v-if="contact.phone">
            <dt><q-icon name="sym_r_call" /> {{ t('doctor.form.phone') }}</dt>
            <dd>
              <a :href="`tel:${contact.phone.replace(/\s/g, '')}`">{{ contact.phone }}</a>
            </dd>
          </div>
        </dl>
      </section>

      <!-- how it works -->
      <section aria-labelledby="how-title">
        <h2 id="how-title">{{ t('doctor.howTitle') }}</h2>
        <ol class="how">
          <li v-for="(s, i) in list('doctor.howSteps')" :key="i">
            <span class="how-n">{{ i + 1 }}</span>
            <span>{{ s }}</span>
          </li>
        </ol>
      </section>

      <!-- groups -->
      <section id="groups" class="anchor" aria-labelledby="groups-title">
        <h2 id="groups-title">{{ t('doctor.groups.title') }}</h2>
        <p class="lead small-lead">{{ t('doctor.groups.lead') }}</p>
        <p v-if="!doctor.groups.length" class="muted">{{ t('doctor.groups.empty') }}</p>
        <div class="groups">
          <article v-for="g in doctor.groups" :key="g.id" class="group" :data-status="g.status">
            <span class="group-status">{{ t(`doctor.groups.status.${g.status}`) }}</span>
            <h3 class="group-title">{{ g.title }}</h3>
            <p class="group-text">{{ g.text }}</p>
            <dl class="group-meta">
              <div v-if="g.when">
                <dt>{{ t('doctor.groups.when') }}</dt>
                <dd>{{ g.when }}</dd>
              </div>
              <div v-if="g.where">
                <dt>{{ t('doctor.groups.where') }}</dt>
                <dd>{{ g.where }}</dd>
              </div>
            </dl>
            <q-btn
              v-if="g.status !== 'full'"
              unelevated
              no-caps
              icon="sym_r_group_add"
              :label="
                g.status === 'waitlist' ? t('doctor.groups.joinWaitlist') : t('doctor.groups.join')
              "
              class="btn-book"
              @click="joinGroup(g.id)"
            />
          </article>
        </div>
      </section>

      <!-- booking form -->
      <section id="book" ref="bookEl" class="book anchor" aria-labelledby="book-title">
        <h2 id="book-title">{{ t('doctor.form.title') }}</h2>
        <p class="muted book-lead">{{ t('doctor.form.lead') }}</p>

        <q-form ref="formRef" class="form" greedy @submit.prevent="prepare">
          <fieldset class="field-set">
            <legend>{{ t('doctor.form.kind') }}</legend>
            <div class="kind-grid">
              <label v-for="k in kinds" :key="k" class="kind" :class="{ 'is-on': form.kind === k }">
                <input v-model="form.kind" type="radio" name="kind" :value="k" />
                <q-icon
                  :name="
                    {
                      first: 'sym_r_person_add',
                      followup: 'sym_r_event_repeat',
                      online: 'sym_r_videocam',
                      group: 'sym_r_groups',
                    }[k]
                  "
                  size="22px"
                />
                <span>{{ t(`doctor.form.kinds.${k}`) }}</span>
              </label>
            </div>
          </fieldset>

          <q-select
            v-if="form.kind === 'group'"
            v-model="form.group"
            outlined
            emit-value
            map-options
            :options="groupOptions"
            :label="t('doctor.form.group')"
            :rules="[rules.group]"
          />

          <div class="row-2">
            <q-input
              v-model="form.name"
              outlined
              autocomplete="name"
              :label="t('doctor.form.name')"
              :rules="[rules.required]"
            />
            <q-input
              v-model="form.phone"
              outlined
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              :label="t('doctor.form.phone')"
              :rules="[rules.phone]"
            />
          </div>
          <q-input
            v-model="form.email"
            outlined
            type="email"
            autocomplete="email"
            :label="t('doctor.form.email')"
            :rules="[rules.email]"
          />

          <fieldset class="field-set">
            <legend>{{ t('doctor.form.days') }}</legend>
            <div class="chips">
              <label
                v-for="d in dayOptions"
                :key="d.value"
                class="chip"
                :class="{ 'is-on': form.days.includes(d.value) }"
              >
                <input v-model="form.days" type="checkbox" :value="d.value" />
                {{ d.label }}
              </label>
            </div>
          </fieldset>

          <fieldset class="field-set">
            <legend>{{ t('doctor.form.time') }}</legend>
            <div class="chips">
              <label
                v-for="tm in times"
                :key="tm"
                class="chip"
                :class="{ 'is-on': form.time === tm }"
              >
                <input v-model="form.time" type="radio" name="time" :value="tm" />
                {{ t(`doctor.form.times.${tm}`) }}
              </label>
            </div>
          </fieldset>

          <q-input
            v-model="form.note"
            outlined
            autogrow
            type="textarea"
            maxlength="400"
            counter
            :label="t('doctor.form.note')"
            :hint="t('doctor.form.noteHint')"
          />

          <q-checkbox v-model="form.consent" class="consent" :label="t('doctor.form.consent')" />

          <q-btn
            type="submit"
            unelevated
            no-caps
            size="lg"
            icon="sym_r_edit_note"
            :label="t('doctor.form.send')"
            class="btn-book submit"
          />
        </q-form>

        <q-slide-transition>
          <div v-show="prepared" id="send-options" class="send" aria-live="polite">
            <h3>{{ t('doctor.form.sendVia') }}</h3>
            <div class="send-buttons">
              <q-btn
                v-for="c in channels"
                :key="c.id"
                unelevated
                no-caps
                color="primary"
                :icon="c.icon"
                :label="t(`doctor.form.via.${c.id}`)"
                :href="c.href"
                :target="c.id === 'whatsapp' ? '_blank' : undefined"
                rel="noopener noreferrer"
              />
              <q-btn
                outline
                no-caps
                icon="sym_r_content_copy"
                :label="t('doctor.form.via.copy')"
                class="ghost-btn"
                @click="copyMessage"
              />
            </div>
            <p v-if="!channels.length" class="small muted">{{ t('doctor.form.noChannels') }}</p>
            <p class="send-note">{{ t('doctor.form.sentNote') }}</p>
            <pre class="preview">{{ message }}</pre>
          </div>
        </q-slide-transition>
      </section>

      <!-- FAQ -->
      <section aria-labelledby="faq-title">
        <h2 id="faq-title">{{ t('doctor.faqTitle') }}</h2>
        <q-list class="faq">
          <q-expansion-item
            v-for="f in faq"
            :key="f"
            :label="t(`doctor.faq.${f}.q`)"
            expand-icon="sym_r_expand_more"
            class="faq-item"
          >
            <p class="faq-a">{{ t(`doctor.faq.${f}.a`) }}</p>
          </q-expansion-item>
        </q-list>
      </section>

      <div class="safety-wrap">
        <SafetyNote compact />
        <p class="small muted emergency-line">{{ t('health.emergency.text') }}</p>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-show="!chat.open"
        round
        unelevated
        size="lg"
        icon="sym_r_chat"
        class="btn-book chat-fab"
        :aria-label="t('doctor.chat.open')"
        @click="chat.openChat()"
      >
        <q-tooltip anchor="center left" self="center right">{{ t('doctor.chat.open') }}</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <ChatDialog />
    <CallDialog v-model="callOpen" />
  </q-page>
</template>

<style scoped lang="scss">
.profile {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 44px 20px 48px;
  border-radius: 0 0 64px 18px;
}

@media (min-width: 600px) {
  .profile {
    padding: 72px 40px 76px;
    border-radius: 0 0 110px 24px;
  }
}

.profile-veil {
  z-index: -1;
}

.profile-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  display: flex;
  gap: 36px;
  align-items: center;
}

@media (max-width: 700px) {
  .profile-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
  }
}

.profile-kicker {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.15rem;
  margin: 0 0 4px;
  color: var(--app-muted);
}

.profile-name {
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  margin: 0 0 6px;
  line-height: 1.05;
}

.profile-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin: 0 0 14px;
}

.highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    padding: 5px 14px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--app-surface) 70%, transparent);
    border: 1px solid var(--app-border);
    font-size: 0.95rem;
  }
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 480px) {
  .profile-actions .q-btn {
    width: 100%;
  }
}

.ghost-btn {
  color: var(--app-text);
  background: color-mix(in srgb, var(--app-surface) 55%, transparent) !important;
}

.about {
  display: grid;
  gap: 24px;
  align-items: start;
}

@media (min-width: 860px) {
  .about {
    grid-template-columns: 1.5fr 1fr;
    gap: 40px;
  }
  .facts {
    margin-top: 2.6em;
  }
}

.fb-btn {
  margin-left: -12px;
  color: var(--app-muted);
}

.facts {
  margin: 0;
  padding: 18px 22px;
  display: grid;
  gap: 14px;

  dt {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--app-muted);
    font-size: 0.92rem;
  }

  dd {
    margin: 2px 0 0 28px;
    line-height: 1.45;

    a {
      display: inline-block;
      margin-left: 6px;
    }
  }
}

.how {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;

  li {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 12px;
    align-items: start;
    line-height: 1.55;
    max-width: 66ch;
  }
}

@media (min-width: 900px) {
  .how {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    li {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
}

.how-n {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  background: color-mix(in srgb, var(--c-peach) 34%, var(--app-surface));
}

.anchor {
  scroll-margin-top: 76px;
}

.small-lead {
  font-size: 1.12rem;
  margin-bottom: 20px;
}

.groups {
  display: grid;
  gap: 14px;
}

@media (min-width: 760px) {
  .groups {
    grid-template-columns: 1fr 1fr;
  }
}

.group {
  --st: var(--c-green);
  padding: 20px 22px;
  border-radius: var(--shape-leaf);
  background:
    radial-gradient(
      100% 120% at 100% 0%,
      color-mix(in srgb, var(--st) 20%, transparent),
      transparent 65%
    ),
    var(--app-surface);
  border: 1px solid var(--app-border);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &[data-status='waitlist'] {
    --st: var(--c-gold);
  }
  &[data-status='full'] {
    --st: var(--app-muted);
  }
}

.group-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--app-muted);

  &::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--st);
  }
}

.group-title {
  margin: 6px 0 6px;
  font-size: 1.35rem;
}

.group-text {
  margin: 0 0 10px;
  color: var(--app-muted);
  line-height: 1.5;
}

.group-meta {
  margin: 0 0 16px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 14px;

  > div {
    display: contents;
  }

  dt {
    color: var(--app-muted);
  }

  dd {
    margin: 0;
  }
}

.book {
  margin-top: 40px;
  padding: 8px 26px 28px;
  border-radius: 40px 10px 40px 10px;
  background: var(--app-surface);
  border: 2px solid color-mix(in srgb, var(--c-peach) 60%, var(--app-border));

  h2 {
    margin-top: 0.8em;
  }
}

@media (max-width: 600px) {
  .book {
    padding: 4px 16px 22px;
    margin-left: -6px;
    margin-right: -6px;
  }
}

.book-lead {
  max-width: 62ch;
}

.form {
  display: grid;
  gap: 6px;
  max-width: 720px;
}

.form :deep(.q-field__control) {
  border-radius: 16px;
}

.row-2 {
  display: grid;
  gap: 6px 14px;
}

@media (min-width: 600px) {
  .row-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.field-set {
  border: 0;
  padding: 0;
  margin: 4px 0 16px;

  legend {
    font-weight: 600;
    margin-bottom: 10px;
    padding: 0;
  }
}

.kind-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

@media (min-width: 760px) {
  .kind-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.kind,
.chip {
  position: relative;
  cursor: pointer;
  border: 1px solid var(--app-border);
  background: var(--app-page);
  color: var(--app-text);

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:focus-within {
    outline: 2px solid var(--c-gold);
    outline-offset: 2px;
  }

  &.is-on {
    border-color: var(--c-book);
    background: color-mix(in srgb, var(--c-peach) 26%, var(--app-surface));
    font-weight: 600;
  }
}

.kind {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border-radius: 20px 6px 20px 6px;
  line-height: 1.3;
  min-height: 84px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 16px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
}

.consent {
  margin: 4px 0 14px -8px;
  line-height: 1.4;
}

.submit {
  justify-self: start;
}

@media (max-width: 480px) {
  .submit {
    justify-self: stretch;
  }
}

.send {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--app-border);

  h3 {
    margin-top: 0;
    font-size: 1.3rem;
  }
}

.send-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.send-note {
  margin: 14px 0 10px;
  max-width: 62ch;
}

.preview {
  white-space: pre-wrap;
  font-family: var(--font-sans);
  font-size: 0.92rem;
  background: var(--app-page);
  border: 1px dashed var(--app-border);
  border-radius: 14px;
  padding: 14px 16px;
  margin: 0;
  max-width: 720px;
  overflow-x: auto;
}

.faq {
  border-top: 1px solid var(--app-border);
  max-width: 760px;
}

.faq-item {
  border-bottom: 1px solid var(--app-border);
}

.faq-a {
  padding: 0 16px 16px;
  margin: 0;
  line-height: 1.55;
  color: var(--app-muted);
}

.safety-wrap {
  margin-top: 36px;
}

.chat-fab {
  box-shadow: 0 6px 18px rgba(176, 63, 104, 0.4);
}

.emergency-line {
  margin-top: 10px;
}
</style>
