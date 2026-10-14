<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useSettingsStore, LOCALE_OPTIONS } from '@/stores/settings-store'
import logo from '@/assets/logo.svg'

const { t } = useI18n()
const $q = useQuasar()
const route = useRoute()
const settings = useSettingsStore()

const drawerOpen = ref(false)
const isMobile = computed(() => $q.screen.lt.md)

const navGroups = [
  {
    id: 'learn',
    items: [
      { to: '/', label: 'nav.home', icon: 'sym_r_home' },
      { to: '/ideas', label: 'nav.ideas', icon: 'sym_r_emoji_objects' },
      { to: '/history', label: 'nav.history', icon: 'sym_r_history_edu' },
      { to: '/fields', label: 'nav.fields', icon: 'sym_r_local_florist' },
    ],
  },
  {
    id: 'live',
    items: [
      { to: '/doctor', label: 'nav.doctor', icon: 'sym_r_event_available', accent: true },
      { to: '/health', label: 'nav.health', icon: 'sym_r_healing' },
      { to: '/map', label: 'nav.map', icon: 'sym_r_map' },
      { to: '/festivals', label: 'nav.festivals', icon: 'sym_r_calendar_month' },
      { to: '/library', label: 'nav.library', icon: 'sym_r_menu_book' },
    ],
  },
  {
    id: 'app',
    items: [{ to: '/about', label: 'nav.about', icon: 'sym_r_info' }],
  },
]

// the most used destinations live in the phone's bottom bar; booking sits in the middle
const bottomItems = [
  { to: '/', label: 'nav.home', icon: 'sym_r_home' },
  { to: '/ideas', label: 'nav.ideasShort', icon: 'sym_r_emoji_objects' },
  { to: '/doctor', label: 'nav.doctorShort', icon: 'sym_r_event_available', accent: true },
  { to: '/map', label: 'nav.map', icon: 'sym_r_map' },
  { to: '/health', label: 'nav.health', icon: 'sym_r_healing' },
]

const bottomPaths = bottomItems.map((i) => i.to)
const moreActive = computed(() => !bottomPaths.includes(route.path))

const currentLocale = computed(
  () => LOCALE_OPTIONS.find((l) => l.value === settings.locale) ?? LOCALE_OPTIONS[0],
)

// the button shows the mode it switches to
const themeIcon = computed(() =>
  settings.theme === 'dark' ? 'sym_r_light_mode' : 'sym_r_dark_mode',
)
const themeLabel = computed(() =>
  t(settings.theme === 'dark' ? 'nav.theme.light' : 'nav.theme.dark'),
)
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <router-link to="/" class="brand" :aria-label="t('nav.home')">
          <img :src="logo" alt="" class="brand-logo" width="38" height="38" />
          <span class="brand-name">{{ t('appName') }}</span>
        </router-link>

        <q-space />

        <q-btn
          v-if="!isMobile && route.path !== '/doctor'"
          unelevated
          no-caps
          rounded
          icon="sym_r_event_available"
          :label="t('nav.doctor')"
          to="/doctor"
          class="btn-book header-book"
        />

        <q-btn
          flat
          round
          dense
          class="tool-btn"
          :icon="themeIcon"
          :aria-label="themeLabel"
          @click="settings.toggleTheme()"
        >
          <q-tooltip>{{ themeLabel }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          no-caps
          dense
          class="tool-btn lang-btn"
          icon="sym_r_translate"
          :label="$q.screen.gt.xs ? currentLocale.label : currentLocale.short"
          :aria-label="t('nav.language')"
        >
          <q-menu anchor="bottom right" self="top right" class="lang-menu">
            <q-list style="min-width: 180px">
              <q-item
                v-for="loc in LOCALE_OPTIONS"
                :key="loc.value"
                v-close-popup
                clickable
                :active="settings.locale === loc.value"
                active-class="lang-active"
                @click="settings.setLocale(loc.value)"
              >
                <q-item-section>
                  <span :lang="loc.value">{{ loc.label }}</span>
                </q-item-section>
                <q-item-section v-if="settings.locale === loc.value" side>
                  <q-icon name="sym_r_check" size="18px" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="!isMobile"
          flat
          round
          dense
          class="tool-btn"
          icon="sym_r_menu"
          :aria-label="t('nav.openMenu')"
          @click="drawerOpen = !drawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above :breakpoint="1023" :width="280" class="app-drawer">
      <div class="drawer-inner">
        <div class="drawer-head">
          <img :src="logo" alt="" width="52" height="52" />
          <div>
            <div class="drawer-title">{{ t('appName') }}</div>
            <div class="drawer-sub">{{ t('tagline') }}</div>
          </div>
        </div>

        <nav :aria-label="t('nav.menu')">
          <template v-for="(group, gi) in navGroups" :key="group.id">
            <div class="drawer-group">{{ t(`nav.groups.${group.id}`) }}</div>
            <q-list>
              <q-item
                v-for="item in group.items"
                :key="item.to"
                clickable
                :to="item.to"
                exact
                class="drawer-item"
                :class="{ 'drawer-item--accent': item.accent }"
                active-class="drawer-item--active"
                @click="isMobile && (drawerOpen = false)"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>{{ t(item.label) }}</q-item-section>
              </q-item>
            </q-list>
            <q-separator v-if="gi < navGroups.length - 1" spaced inset />
          </template>
        </nav>

        <p class="drawer-note">{{ t('common.drawerNote') }}</p>
      </div>
    </q-drawer>

    <q-footer v-if="isMobile" class="app-footer">
      <nav class="bottom-nav" :aria-label="t('nav.menu')">
        <router-link
          v-for="item in bottomItems"
          :key="item.to"
          :to="item.to"
          class="bottom-link"
          :class="{ 'bottom-link--accent': item.accent }"
          exact-active-class="is-active"
        >
          <q-icon :name="item.icon" size="24px" />
          <span>{{ t(item.label) }}</span>
        </router-link>
        <button
          type="button"
          class="bottom-link"
          :class="{ 'is-active': moreActive || drawerOpen }"
          :aria-expanded="drawerOpen"
          @click="drawerOpen = !drawerOpen"
        >
          <q-icon name="sym_r_menu" size="24px" />
          <span>{{ t('nav.more') }}</span>
        </button>
      </nav>
    </q-footer>

    <q-page-container>
      <router-view #default="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.app-header {
  background: var(--app-header);
  color: var(--app-text);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  border-bottom: 1px solid var(--app-border);
  padding-top: env(safe-area-inset-top, 0px);
}

.app-toolbar {
  min-height: 60px;
  gap: 4px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  min-width: 0;
}

.brand-logo {
  flex: none;
  display: block;
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-btn {
  color: var(--app-text);
}

.lang-btn :deep(.q-btn__content) {
  gap: 6px;
}

.drawer-inner {
  padding: calc(16px + env(safe-area-inset-top, 0px)) 10px 24px;
}

.drawer-head {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 6px 10px 18px;
}

.drawer-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  line-height: 1.1;
}

.drawer-sub {
  font-size: 0.85rem;
  color: var(--app-muted);
  line-height: 1.3;
  margin-top: 2px;
}

.drawer-group {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--app-muted);
  padding: 8px 16px 4px;
}

.drawer-item {
  border-radius: 22px 6px 22px 6px;
  margin: 2px 4px;
  min-height: 46px;
}

.drawer-item--active {
  background: var(--app-surface-tint);
  color: var(--q-primary);
  font-weight: 600;
}

body.body--dark .drawer-item--active {
  color: #c9d1ff;
}

.drawer-note {
  margin: 24px 16px 0;
  font-size: 0.82rem;
  color: var(--app-muted);
  line-height: 1.45;
}

.app-footer {
  background: var(--app-header);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--app-border);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  height: 62px;
}

.bottom-link {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--app-muted);
  text-decoration: none;
  font-size: 0.72rem;
  line-height: 1.1;
  padding: 4px 2px;
  position: relative;
  isolation: isolate;
  min-width: 0;

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is-active {
    color: var(--q-primary);
    font-weight: 700;
  }

  // a small leaf-shaped mark under the active destination
  &.is-active::before {
    content: '';
    position: absolute;
    top: 6px;
    width: 46px;
    height: 30px;
    border-radius: 16px 4px 16px 4px;
    background: var(--app-surface-tint);
    z-index: -1;
  }
}

// the booking tab: a raised round button in the middle of the bar
.bottom-link--accent {
  color: var(--app-text);

  .q-icon {
    width: 46px;
    height: 46px;
    margin-top: -20px;
    border-radius: 50%;
    background: var(--c-book);
    color: #fff;
    box-shadow:
      0 0 0 4px var(--app-page),
      0 4px 12px rgba(176, 63, 104, 0.35);
  }

  &.is-active {
    color: var(--c-book);
  }

  &.is-active::before {
    display: none;
  }
}

body.body--dark .bottom-link--accent.is-active {
  color: var(--c-book-soft);
}

.header-book {
  margin-right: 8px;
  padding: 0 14px;
}

.drawer-item--accent {
  border: 1px solid color-mix(in srgb, var(--c-book) 45%, transparent);
  margin-bottom: 6px;

  :deep(.q-icon) {
    color: var(--c-book);
  }
}

body.body--dark .drawer-item--accent :deep(.q-icon) {
  color: var(--c-book-soft);
}

body.body--dark .bottom-link.is-active {
  color: #c9d1ff;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
.lang-active {
  color: var(--q-primary);
  font-weight: 600;
}
.app-drawer,
.q-drawer {
  border-color: var(--app-border) !important;
}
</style>
