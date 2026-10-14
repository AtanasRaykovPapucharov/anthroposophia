<script setup>
import { useI18n } from 'vue-i18n'
import DoctorAvatar from './DoctorAvatar.vue'
import { useDoctor } from '@/composables/useDoctor'

// Prominent invitation to book with the doctor (home page and health page)
defineProps({
  variant: { type: String, default: 'home' }, // 'home' | 'health'
})

const { t } = useI18n()
const { doctor } = useDoctor()
</script>

<template>
  <section class="feature" :class="`feature--${variant}`" aria-labelledby="doctor-feature-title">
    <DoctorAvatar
      :src="doctor.photo"
      :alt="t('doctor.photoAlt', { name: doctor.name })"
      :initials="doctor.initials"
      :size="variant === 'home' ? 132 : 96"
    />
    <div class="feature-body">
      <h2 id="doctor-feature-title" class="feature-title">
        {{ variant === 'home' ? t('doctor.feature.title') : t('doctor.healthCta.title') }}
      </h2>
      <p class="feature-name">
        {{ doctor.name }}<span v-if="doctor.title">, {{ doctor.title }}</span>
      </p>
      <p class="feature-text">
        {{ variant === 'home' ? t('doctor.feature.text') : t('doctor.healthCta.text') }}
      </p>
      <div class="feature-actions">
        <q-btn
          unelevated
          no-caps
          size="lg"
          icon="sym_r_event_available"
          :label="t('doctor.bookCta')"
          :to="{ path: '/doctor', hash: '#book' }"
          class="feature-btn btn-book"
        />
        <q-btn
          outline
          no-caps
          size="lg"
          icon="sym_r_groups"
          :label="t('doctor.joinGroupCta')"
          :to="{ path: '/doctor', hash: '#groups' }"
          class="feature-btn feature-btn--ghost"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 26px 28px;
  border-radius: 40px 10px 40px 10px;
  background:
    radial-gradient(
      120% 160% at 0% 0%,
      color-mix(in srgb, var(--c-peach) 38%, transparent),
      transparent 60%
    ),
    radial-gradient(
      90% 120% at 100% 100%,
      color-mix(in srgb, var(--c-violet) 22%, transparent),
      transparent 60%
    ),
    var(--app-surface);
  border: 1px solid color-mix(in srgb, var(--c-peach) 55%, var(--app-border));
}

.feature--home {
  margin-top: 28px;
}

.feature--health {
  margin: 28px 0 8px;
}

.feature-body {
  min-width: 0;
}

.feature-title {
  margin: 0 0 4px;
  font-size: clamp(1.5rem, 3.2vw, 2rem);
  line-height: 1.15;
}

.feature-name {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--app-muted);
  margin: 0 0 8px;
}

.feature-text {
  margin: 0 0 16px;
  max-width: 56ch;
}

.feature-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-btn--ghost {
  color: var(--app-text);
}

@media (max-width: 600px) {
  .feature {
    flex-direction: column;
    align-items: flex-start;
    padding: 22px 20px;
  }
  .feature-actions .feature-btn {
    width: 100%;
  }
}
</style>
