// Verifies that every locale has exactly the same keys (and array lengths) as en-US,
// and that no message contains characters vue-i18n treats as syntax (@ | $ or stray braces).
// Run: node scripts/check-i18n.mjs
import en from '../src/i18n/en-US/index.js'
import bg from '../src/i18n/bg/index.js'
import ru from '../src/i18n/ru/index.js'
import de from '../src/i18n/de/index.js'
import ja from '../src/i18n/ja/index.js'

const locales = { bg, ru, de, ja }
let problems = 0

function walk(ref, other, path, name) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(other)) return report(name, path, 'should be an array')
    if (ref.length !== other.length)
      report(name, path, `array length ${other.length}, expected ${ref.length}`)
    ref.forEach((v, i) => walk(v, other[i], `${path}[${i}]`, name))
  } else if (ref && typeof ref === 'object') {
    if (!other || typeof other !== 'object') return report(name, path, 'missing object')
    for (const k of Object.keys(ref)) walk(ref[k], other[k], path ? `${path}.${k}` : k, name)
    for (const k of Object.keys(other)) if (!(k in ref)) report(name, `${path}.${k}`, 'extra key')
  } else if (typeof other !== 'string') {
    report(name, path, 'missing string')
  } else {
    const refTokens = (ref.match(/\{\w+\}/g) || []).sort().join()
    const tokens = (other.match(/\{\w+\}/g) || []).sort().join()
    if (refTokens !== tokens)
      report(name, path, `placeholders ${tokens || 'none'}, expected ${refTokens}`)
    if (/[@|$]/.test(other.replace(/\{\w+\}/g, '')) || /[{}]/.test(other.replace(/\{\w+\}/g, '')))
      report(name, path, 'contains vue-i18n syntax characters')
  }
}

function report(name, path, msg) {
  problems++
  console.log(`${name}: ${path} — ${msg}`)
}

walk(en, en, '', 'en-US')
for (const [name, msgs] of Object.entries(locales)) walk(en, msgs, '', name)
console.log(problems ? `\n${problems} problem(s)` : 'All locales match en-US.')
process.exit(problems ? 1 : 0)
