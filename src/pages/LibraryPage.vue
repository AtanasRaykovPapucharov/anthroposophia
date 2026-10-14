<script setup>
import { ref, computed } from 'vue'
import PageIntro from '@/components/PageIntro.vue'
import { BOOKS, LINKS, GLOSSARY } from '@/data/library'
import { useContent } from '@/composables/useContent'

const { t, pick } = useContent()
const term = ref('')

const glossary = computed(() => {
  const q = term.value.trim().toLowerCase()
  const rows = GLOSSARY.map((id) => ({
    id,
    word: t(`library.glossary.${id}.term`),
    text: t(`library.glossary.${id}.text`),
  }))
  rows.sort((a, b) => a.word.localeCompare(b.word))
  return q ? rows.filter((r) => `${r.word} ${r.text}`.toLowerCase().includes(q)) : rows
})
</script>

<template>
  <q-page>
    <div class="page-wrap">
      <PageIntro
        :title="t('library.title')"
        :lead="t('library.lead')"
        icon="sym_r_menu_book"
        :colors="['#3b4a8c', '#8a6bb8', '#e9a89b', '#e0b04a']"
        :seed="5"
      />

      <section aria-labelledby="books-title">
        <h2 id="books-title">{{ t('library.booksTitle') }}</h2>
        <p class="muted">{{ t('library.booksLead') }}</p>
        <ol class="books">
          <li v-for="b in BOOKS" :key="b.id" class="book">
            <div class="book-year">{{ b.year }}</div>
            <div>
              <h3 class="book-title">{{ t(`library.books.${b.id}.title`) }}</h3>
              <p class="book-original" lang="de">
                <em>{{ b.original }}</em> <span class="muted">({{ b.ga }})</span>
              </p>
              <p class="book-text">{{ t(`library.books.${b.id}.text`) }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="links-title">
        <h2 id="links-title">{{ t('library.linksTitle') }}</h2>
        <ul class="links">
          <li v-for="l in LINKS" :key="l.id">
            <a :href="l.url" target="_blank" rel="noopener noreferrer" class="link">
              <q-icon :name="l.icon" size="24px" class="link-icon" />
              <span class="link-main">
                <span class="link-name">{{ pick(l.name) }}</span>
                <span class="link-text">{{ t(`library.links.${l.id}`) }}</span>
                <span class="link-url">{{ l.url.replace('https://', '') }}</span>
              </span>
              <q-icon name="sym_r_open_in_new" size="18px" class="link-out" />
            </a>
          </li>
        </ul>
      </section>

      <section aria-labelledby="gloss-title">
        <h2 id="gloss-title">{{ t('library.glossaryTitle') }}</h2>
        <q-input
          v-model="term"
          outlined
          dense
          clearable
          :placeholder="t('library.glossarySearch')"
          :aria-label="t('library.glossarySearch')"
          class="gloss-search"
        >
          <template #prepend><q-icon name="sym_r_search" /></template>
        </q-input>
        <p v-if="!glossary.length" class="muted">{{ t('library.glossaryEmpty') }}</p>
        <dl class="gloss">
          <div v-for="g in glossary" :key="g.id" class="gloss-item">
            <dt>{{ g.word }}</dt>
            <dd>{{ g.text }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.books {
  list-style: none;
  margin: 0;
  padding: 0;
}

.book {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 18px;
  padding: 16px 0;
  border-top: 1px solid var(--app-border);
}

.book-year {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: var(--app-muted);
  padding-top: 4px;
  font-variant-numeric: lining-nums;
}

.book-title {
  font-size: 1.3rem;
  margin: 0 0 2px;
}

.book-original {
  margin: 0 0 6px;
  font-family: var(--font-serif);
}

.book-text {
  margin: 0;
  color: var(--app-muted);
  max-width: 64ch;
  line-height: 1.55;
}

@media (max-width: 480px) {
  .book {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}

.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

@media (min-width: 760px) {
  .links {
    grid-template-columns: 1fr 1fr;
  }
}

.link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 22px 4px 22px 4px;
  text-decoration: none;
  color: var(--app-text) !important;
  align-items: start;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  height: 100%;

  &:hover {
    border-color: var(--q-primary);
  }
}

.link-icon {
  color: var(--c-violet);
  margin-top: 2px;
}

.link-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.link-name {
  font-family: var(--font-serif);
  font-size: 1.15rem;
}

.link-text {
  color: var(--app-muted);
  font-size: 0.95rem;
  line-height: 1.4;
}

.link-url {
  font-size: 0.82rem;
  color: var(--app-muted);
  margin-top: 4px;
  overflow-wrap: anywhere;
}

.link-out {
  color: var(--app-muted);
}

.gloss-search {
  max-width: 420px;
  margin-bottom: 14px;
}

.gloss-search :deep(.q-field__control) {
  border-radius: 999px;
  background: var(--app-surface);
}

.gloss {
  margin: 0;
  columns: 1;
}

@media (min-width: 860px) {
  .gloss {
    columns: 2;
    column-gap: 48px;
  }
}

.gloss-item {
  break-inside: avoid;
  padding: 10px 0 12px;

  dt {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
  }

  dd {
    margin: 2px 0 0;
    color: var(--app-muted);
    line-height: 1.5;
  }
}
</style>
