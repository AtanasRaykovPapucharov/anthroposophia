# Anthroposophia

A multilingual Quasar (Vue 3) app introducing anthroposophy: its ideas, history, fields of practice,
practical health information for patients and carers, the festivals of the year, key books and a
world map of centres.

Languages: **English, Bulgarian, Russian, German, Japanese**.

## Features

| Page               | What it offers                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home               | Veil-painted hero, starting points by visitor type, Steiner sayings (with German originals), next festival                                                                                  |
| Ideas              | What anthroposophy is, core ideas, interactive four members diagram, threefold human being, seven-year life phases, perspectives and criticism                                              |
| History            | Biography of Rudolf Steiner and a 24-event timeline with theme filters                                                                                                                      |
| Fields of practice | Waldorf education, medicine, biodynamics, curative education, arts, architecture, social life, science, Christian Community                                                                 |
| Health             | Anthroposophic medicine explained, 8 therapies, what to expect at an appointment, a tick-and-copy list of questions for your doctor, self-care, safety notes, tap-to-call emergency numbers |
| Map                | Leaflet + OpenStreetMap, 36 centres, category filters, search, sort by distance ("Near me"), directions links, shareable `?cat=` filter URLs                                                |
| Festivals          | Interactive year circle; Easter, Ascension, Whitsun and Advent are calculated for the current year                                                                                          |
| Library            | Steiner's basic books, trusted organisations, searchable glossary                                                                                                                           |
| About              | Language and theme settings, disclaimer, credits                                                                                                                                            |

Design: light, dark and automatic themes; mobile bottom navigation with safe-area support;
visible keyboard focus; `prefers-reduced-motion` respected.

## Stack

- Quasar CLI with Vite (`@quasar/app-vite`), Sass
- vue-i18n (Composition API) — locales in `src/i18n/<locale>/index.js`
- Pinia — `src/stores/settings-store.js` (language and theme, saved to localStorage)
- Leaflet — map on `src/pages/MapPage.vue`
- Icons: Material Symbols Rounded (`sym_r_*`) from `@quasar/extras`
- Fonts: Alegreya, Alegreya Sans, Zen Old Mincho, Zen Kaku Gothic New (Google Fonts, loaded in `index.html`)

## Requirements

Node.js `^22.12`, `^24` or `>= 26`.

## Commands

```bash
npm install
npm run dev          # development server
npm run build        # production build to dist/spa
npm run lint         # format and fix
node scripts/check-i18n.mjs   # verify all locales have the same keys as en-US
```

## Project structure

```
src/
  assets/logo.svg           app logo (PNG icons in public/icons are rendered from it)
  boot/i18n.js              vue-i18n setup and browser-language detection
  components/               VeilBackdrop, PageIntro, FourMembers, LifePhases, YearCircle, SafetyNote
  composables/              useContent (i18n lists), useFestivalDates (Easter etc.)
  data/                     language-independent data: centres, timeline, fields, books, festivals
  i18n/<locale>/index.js    all translatable text
  layouts/MainLayout.vue    header, drawer, mobile bottom navigation
  pages/                    one file per page
```

Texts live in `src/i18n`, structure and numbers in `src/data`. To add a centre to the map, add an
entry to `src/data/centers.js` and a one-line description under `map.centers.<id>` in every locale.

## Adding a language

1. Copy `src/i18n/en-US/index.js` to `src/i18n/<locale>/index.js` and translate the values.
2. Register it in `src/i18n/index.js`.
3. Add the Quasar language pack and a label in `src/stores/settings-store.js`, and a browser-language
   match in `src/boot/i18n.js`.
4. Run `node scripts/check-i18n.mjs`.

Avoid the characters `@ | $ { }` in messages (vue-i18n syntax), except for placeholders like `{n}`.

## Content notes

- Health content is educational and repeatedly states that anthroposophic medicine complements,
  and does not replace, conventional care. Please have it reviewed by a qualified professional
  before publishing, and keep the emergency numbers correct for your audience.
- Map positions are approximate (street or town level). Entries marked `cityLevel` show a city where
  several initiatives exist. Verify details with the organisations before publishing.
- Rudolf Steiner died in 1925; his German texts are in the public domain. The translations of his
  sayings in this app are original.

## Deploy

`vercel.json` builds to `dist/spa` with SPA rewrites for history-mode routing. Any static host works
if all routes are rewritten to `index.html`.
