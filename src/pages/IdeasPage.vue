<script setup>
import PageIntro from '@/components/PageIntro.vue'
import FourMembers from '@/components/FourMembers.vue'
import LifePhases from '@/components/LifePhases.vue'
import { CORE_IDEAS } from '@/data/ideas'
import { useContent } from '@/composables/useContent'

const { t, list } = useContent()

const threefold = ['thinking', 'feeling', 'willing']
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('ideas.title')"
        :lead="t('ideas.lead')"
        icon="sym_r_emoji_objects"
        :colors="['#8a6bb8', '#e9a89b', '#3b4a8c', '#e0b04a']"
      />

      <section class="reading">
        <p class="word">
          <span lang="el">ἄνθρωπος</span> <span class="muted">anthropos</span> +
          <span lang="el">σοφία</span> <span class="muted">sophia</span>
          <span class="word-gloss">{{ t('ideas.wordGloss') }}</span>
        </p>
        <p v-for="(p, i) in list('ideas.intro')" :key="i">{{ p }}</p>
      </section>

      <section aria-labelledby="core-title">
        <h2 id="core-title">{{ t('ideas.coreTitle') }}</h2>
        <dl class="core">
          <div v-for="idea in CORE_IDEAS" :key="idea.id" class="core-item">
            <dt>
              <q-icon :name="idea.icon" size="24px" class="core-icon" />
              {{ t(`ideas.core.${idea.id}.title`) }}
            </dt>
            <dd>{{ t(`ideas.core.${idea.id}.text`) }}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="members-title">
        <h2 id="members-title">{{ t('ideas.members.title') }}</h2>
        <p class="lead small-lead">{{ t('ideas.members.lead') }}</p>
        <FourMembers />
      </section>

      <section aria-labelledby="three-title">
        <h2 id="three-title">{{ t('ideas.three.title') }}</h2>
        <p class="lead small-lead">{{ t('ideas.three.lead') }}</p>
        <div class="three">
          <div v-for="(k, i) in threefold" :key="k" class="three-row" :data-i="i">
            <div class="three-soul">{{ t(`ideas.three.items.${k}.soul`) }}</div>
            <div class="three-arrow" aria-hidden="true">⟷</div>
            <div class="three-body">
              <strong>{{ t(`ideas.three.items.${k}.system`) }}</strong>
              <span class="muted">{{ t(`ideas.three.items.${k}.where`) }}</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="phases-title">
        <h2 id="phases-title">{{ t('ideas.phases.title') }}</h2>
        <p class="lead small-lead">{{ t('ideas.phases.lead') }}</p>
        <LifePhases />
      </section>

      <section aria-labelledby="persp-title" class="perspectives">
        <h2 id="persp-title">{{ t('ideas.perspectives.title') }}</h2>
        <div class="reading">
          <p v-for="(p, i) in list('ideas.perspectives.paragraphs')" :key="i">{{ p }}</p>
        </div>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.word {
  font-family: var(--font-serif);
  font-size: 1.5rem !important;
  line-height: 1.4;
  margin-bottom: 1.2em;

  .muted {
    font-style: italic;
    font-size: 1.1rem;
  }
}

.word-gloss {
  display: block;
  font-size: 1.05rem;
  color: var(--app-muted);
}

.small-lead {
  font-size: 1.12rem;
  margin-bottom: 24px;
}

.core {
  margin: 0;
  display: grid;
  gap: 8px 40px;
}

@media (min-width: 760px) {
  .core {
    grid-template-columns: 1fr 1fr;
  }
}

.core-item {
  padding: 14px 0 12px;
  border-top: 1px solid var(--app-border);
}

.core-item dt {
  font-family: var(--font-serif);
  font-size: 1.28rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.core-icon {
  color: var(--c-violet);
}

.core-item dd {
  margin: 0 0 0 34px;
  color: var(--app-muted);
  line-height: 1.55;
}

.three {
  display: grid;
  gap: 10px;
  max-width: 760px;
}

.three-row {
  display: grid;
  grid-template-columns: 1fr auto 1.5fr;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: var(--shape-organic);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
}

.three-row[data-i='0'] {
  --tint: var(--c-indigo);
}
.three-row[data-i='1'] {
  --tint: var(--c-rose);
}
.three-row[data-i='2'] {
  --tint: var(--c-gold);
}

.three-row {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--tint) 20%, transparent), transparent 60%),
    var(--app-surface);
}

.three-soul {
  font-family: var(--font-serif);
  font-size: 1.35rem;
}

.three-arrow {
  color: var(--app-muted);
  font-size: 1.2rem;
}

.three-body {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

@media (max-width: 520px) {
  .three-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .three-arrow {
    display: none;
  }
}

.perspectives {
  margin-top: 24px;
  padding-top: 8px;
}
</style>
