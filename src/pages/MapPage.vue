<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CENTERS, CATEGORIES } from '@/data/centers'
import { useContent } from '@/composables/useContent'

const { t, locale } = useContent()
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const mapEl = ref(null)
const search = ref('')
const activeCats = ref(new Set(route.query.cat ? [String(route.query.cat)] : []))
const selectedId = ref('')
const userPos = ref(null)
const locating = ref(false)

let map = null
let resizeObserver = null
let markerLayer = null
const markers = new Map()

const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

const regionNames = computed(() => {
  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' })
  } catch {
    return null
  }
})
const countryName = (cc) => regionNames.value?.of(cc) ?? cc

// great-circle distance in km
function distanceKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

const numberFmt = computed(() => new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }))

const visible = computed(() => {
  const q = search.value.trim().toLowerCase()
  let rows = CENTERS.filter((c) => {
    if (activeCats.value.size && !activeCats.value.has(c.cat)) return false
    if (!q) return true
    const hay = [c.name, c.place, countryName(c.cc), t(`map.centers.${c.id}`)]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  }).map((c) => ({ ...c, km: userPos.value ? distanceKm(userPos.value, c) : null }))
  if (userPos.value) rows = rows.sort((a, b) => a.km - b.km)
  return rows
})

function toggleCat(id) {
  const next = new Set(activeCats.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  activeCats.value = next
}

function clearFilters() {
  activeCats.value = new Set()
  search.value = ''
}

// keep ?cat= in the URL so a filtered map can be shared
watch(activeCats, (cats) => {
  const cat = cats.size === 1 ? [...cats][0] : undefined
  if (route.query.cat !== cat) router.replace({ query: cat ? { cat } : {} })
})

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  )
}

function popupHtml(c) {
  const cat = catById[c.cat]
  const since = c.since
    ? `<span class="pop-since">${escapeHtml(t('map.since', { year: c.since }))}</span>`
    : ''
  const city = c.cityLevel ? `<p class="pop-note">${escapeHtml(t('map.cityLevel'))}</p>` : ''
  const site = c.url
    ? `<a class="pop-btn" href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('map.website'))}</a>`
    : ''
  const dir = `<a class="pop-btn" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('map.directions'))}</a>`
  return `
    <div class="pop">
      <div class="pop-cat" style="--cat:${cat.color}">${escapeHtml(t(`map.categories.${c.cat}`))}</div>
      <div class="pop-name">${escapeHtml(c.name)}</div>
      <div class="pop-place">${escapeHtml(c.place)}, ${escapeHtml(countryName(c.cc))} ${since}</div>
      <p class="pop-desc">${escapeHtml(t(`map.centers.${c.id}`))}</p>
      ${city}
      <div class="pop-actions">${site}${dir}</div>
    </div>`
}

function makeIcon(c, active = false) {
  const cat = catById[c.cat]
  return L.divIcon({
    className: 'center-marker-wrap',
    html: `<span class="center-marker${active ? ' is-active' : ''}" style="--cat:${cat.color}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  })
}

function renderMarkers() {
  if (!map) return
  markerLayer.clearLayers()
  markers.clear()
  for (const c of visible.value) {
    const m = L.marker([c.lat, c.lng], {
      icon: makeIcon(c, c.id === selectedId.value),
      title: c.name,
      alt: c.name,
      keyboard: true,
    })
    m.bindPopup(() => popupHtml(c), { maxWidth: 280, autoPanPadding: [24, 80] })
    m.on('click', () => {
      selectedId.value = c.id
    })
    m.addTo(markerLayer)
    markers.set(c.id, m)
  }
}

function fitVisible() {
  if (!map || !visible.value.length) return
  const bounds = L.latLngBounds(visible.value.map((c) => [c.lat, c.lng]))
  if (userPos.value) bounds.extend([userPos.value.lat, userPos.value.lng])
  map.fitBounds(bounds, { padding: [36, 36], maxZoom: 10 })
}

function focusCenter(c) {
  selectedId.value = c.id
  if (!map) return
  if ($q.screen.lt.md) mapEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  map.flyTo([c.lat, c.lng], Math.max(map.getZoom(), 11), { duration: 0.9 })
  map.once('moveend', () => markers.get(c.id)?.openPopup())
}

let userMarker = null
function locate() {
  if (!('geolocation' in navigator)) {
    $q.notify({ message: t('map.locateUnsupported'), color: 'negative' })
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      locating.value = false
      userPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      if (userMarker) userMarker.remove()
      userMarker = L.circleMarker([userPos.value.lat, userPos.value.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: '#3b4a8c',
        fillOpacity: 1,
      })
        .bindTooltip(t('map.you'))
        .addTo(map)
      const nearest = visible.value[0]
      if (nearest) {
        const bounds = L.latLngBounds([
          [userPos.value.lat, userPos.value.lng],
          [nearest.lat, nearest.lng],
        ])
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 })
      }
    },
    () => {
      locating.value = false
      $q.notify({ message: t('map.locateFailed'), color: 'negative' })
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
  )
}

onMounted(async () => {
  await nextTick()
  map = L.map(mapEl.value, {
    zoomControl: false,
    worldCopyJump: true,
    minZoom: 2,
  }).setView([40, 10], 3)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()
  fitVisible()

  // the page fades in, so measure the container again once it has its final size
  resizeObserver = new ResizeObserver(() => map?.invalidateSize())
  resizeObserver.observe(mapEl.value)
  setTimeout(() => {
    map?.invalidateSize()
    fitVisible()
  }, 300)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  map?.remove()
  map = null
})

watch(visible, () => {
  renderMarkers()
})
watch([activeCats], () => fitVisible())
watch(selectedId, () => {
  for (const c of visible.value) markers.get(c.id)?.setIcon(makeIcon(c, c.id === selectedId.value))
})
// re-render popups and tooltips in the new language
watch(locale, () => renderMarkers())
</script>

<template>
  <q-page>
    <div class="page-wrap map-page">
      <header class="map-intro">
        <h1>{{ t('map.title') }}</h1>
        <p class="lead">{{ t('map.lead') }}</p>
      </header>

      <div class="map-tools">
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          :placeholder="t('map.searchPlaceholder')"
          class="map-search"
          :aria-label="t('map.searchPlaceholder')"
        >
          <template #prepend><q-icon name="sym_r_search" /></template>
        </q-input>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="sym_r_my_location"
          :label="t('map.nearMe')"
          :loading="locating"
          @click="locate"
        />
      </div>

      <div class="cats" role="group" :aria-label="t('map.filterLabel')">
        <button
          v-for="c in CATEGORIES"
          :key="c.id"
          type="button"
          class="cat"
          :class="{ 'is-on': activeCats.has(c.id) }"
          :style="{ '--cat': c.color }"
          :aria-pressed="activeCats.has(c.id)"
          @click="toggleCat(c.id)"
        >
          <q-icon :name="c.icon" size="18px" />
          {{ t(`map.categories.${c.id}`) }}
        </button>
      </div>

      <div class="map-grid">
        <div ref="mapEl" class="map" role="region" :aria-label="t('map.title')" />

        <section class="results" aria-live="polite">
          <div class="results-head">
            <span>{{ t('map.count', { n: visible.length }) }}</span>
            <q-btn
              v-if="activeCats.size || search"
              flat
              dense
              no-caps
              size="sm"
              icon="sym_r_filter_alt_off"
              :label="t('map.clear')"
              @click="clearFilters"
            />
          </div>

          <p v-if="!visible.length" class="empty">{{ t('map.empty') }}</p>

          <ul class="result-list">
            <li v-for="c in visible" :key="c.id">
              <button
                type="button"
                class="result"
                :class="{ 'is-selected': selectedId === c.id }"
                @click="focusCenter(c)"
              >
                <span class="result-dot" :style="{ background: catById[c.cat].color }" />
                <span class="result-main">
                  <span class="result-name">{{ c.name }}</span>
                  <span class="result-place">{{ c.place }}, {{ countryName(c.cc) }}</span>
                  <span class="result-desc">{{ t(`map.centers.${c.id}`) }}</span>
                </span>
                <span v-if="c.km !== null" class="result-km">
                  {{ t('map.km', { n: numberFmt.format(c.km) }) }}
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      <p class="map-note small muted">{{ t('map.note') }}</p>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.map-page {
  max-width: 1280px;
}

.map-intro h1 {
  margin-bottom: 0.2em;
}

.map-intro .lead {
  font-size: 1.15rem;
  margin-bottom: 18px;
}

.map-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.map-search {
  flex: 1 1 240px;
}

.map-search :deep(.q-field__control) {
  border-radius: 999px;
  background: var(--app-surface);
}

.cats {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 10px;
  margin: 0 -2px 6px;
  scrollbar-width: thin;
}

.cat {
  appearance: none;
  font: inherit;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
  padding: 6px 14px;
  min-height: 38px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  color: var(--app-text);

  .q-icon {
    color: var(--cat);
  }

  &.is-on {
    background: color-mix(in srgb, var(--cat) 22%, var(--app-surface));
    border-color: var(--cat);
    font-weight: 600;
  }
}

.map-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 1024px) {
  .map-grid {
    grid-template-columns: 1.7fr 1fr;
    align-items: start;
  }
}

.map {
  height: 56vh;
  min-height: 320px;
  border-radius: 28px 8px 28px 8px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  background: var(--app-surface-soft);
  z-index: 0;
}

@media (min-width: 1024px) {
  .map {
    height: 70vh;
    position: sticky;
    top: 80px;
  }
}

.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--app-muted);
  font-size: 0.95rem;
  padding: 0 4px 6px;
  min-height: 32px;
}

.empty {
  padding: 18px;
  color: var(--app-muted);
}

.result-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 1024px) {
  .result-list {
    max-height: calc(70vh - 40px);
    overflow-y: auto;
    padding-right: 4px;
  }
}

.result {
  appearance: none;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: grid;
  grid-template-columns: 14px 1fr auto;
  gap: 12px;
  padding: 12px 10px;
  border-radius: 18px 4px 18px 4px;
  align-items: start;

  &:hover {
    background: var(--app-surface-soft);
  }

  &.is-selected {
    background: var(--app-surface-tint);
  }
}

.result-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 7px;
}

.result-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-name {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  line-height: 1.25;
}

.result-place {
  font-size: 0.9rem;
  color: var(--app-muted);
}

.result-desc {
  font-size: 0.92rem;
  line-height: 1.4;
  margin-top: 2px;
}

.result-km {
  font-size: 0.85rem;
  color: var(--app-muted);
  white-space: nowrap;
  margin-top: 4px;
}

.map-note {
  margin-top: 18px;
  max-width: 70ch;
}
</style>

<style lang="scss">
// Leaflet content is rendered outside Vue's scope, so these styles are global
.center-marker-wrap {
  background: none;
  border: 0;
}

.center-marker {
  display: block;
  width: 22px;
  height: 22px;
  margin: 3px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  background: var(--cat);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(20, 24, 51, 0.35);
  transition: transform 0.2s ease;
}

.center-marker.is-active {
  transform: rotate(-45deg) scale(1.35);
}

.leaflet-container {
  font-family: var(--font-sans);
}

.leaflet-popup-content-wrapper {
  border-radius: 20px 6px 20px 6px;
  background: var(--app-surface);
  color: var(--app-text);
}

.leaflet-popup-tip {
  background: var(--app-surface);
}

.leaflet-popup-content {
  margin: 14px 16px;
}

.pop-cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--app-muted);

  &::before {
    content: '';
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--cat);
  }
}

.pop-name {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  line-height: 1.2;
  margin: 4px 0 2px;
}

.pop-place {
  font-size: 0.85rem;
  color: var(--app-muted);
}

.pop-since {
  white-space: nowrap;
}

.pop-desc {
  margin: 8px 0 !important;
  font-size: 0.92rem;
  line-height: 1.45;
}

.pop-note {
  margin: 0 0 8px !important;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--app-muted);
}

.pop-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pop-btn {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  text-decoration: none;
  font-size: 0.85rem;
  color: var(--app-text) !important;
}

body.body--dark .leaflet-tile-pane {
  filter: invert(1) hue-rotate(200deg) brightness(0.85) contrast(0.9) saturate(0.6);
}

body.body--dark .leaflet-control-zoom a,
body.body--dark .leaflet-control-attribution {
  background: var(--app-surface);
  color: var(--app-text);
}
</style>
