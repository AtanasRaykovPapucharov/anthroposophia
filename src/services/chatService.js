// ============================================================================
//  Chat service
// ============================================================================
//  Today there is no server, so `createChatService()` returns a MOCK that answers
//  locally with a few prepared replies. When a backend exists, write a class with
//  the same three methods (e.g. over WebSocket or REST) and return it instead.
//
//  Interface
//    connect(onEvent)   start listening; onEvent({ type, ... }) receives:
//                         { type: 'status', status: 'online' | 'offline' }
//                         { type: 'typing', typing: boolean }
//                         { type: 'message', message }
//    send(text)         send the patient's message (returns the stored message)
//    disconnect()
//
//  Message shape
//    { id, from: 'patient' | 'practice', at: Date, text?: string,
//      intent?: string, params?: object }
//  Practice replies carry an `intent` instead of text, so the UI can show them
//  in the current language (i18n key doctor.chat.replies.<intent>).
// ============================================================================

const uid = () => Math.random().toString(36).slice(2, 10)

// keywords in all five app languages (lower case)
const INTENTS = [
  {
    intent: 'urgent',
    words: [
      'спешн',
      'болка в гърд',
      'emergency',
      'urgent',
      'chest pain',
      'срочн',
      'неотлож',
      'боль в груди',
      'notfall',
      'dringend',
      'brustschmerz',
      '緊急',
      '救急',
      '胸の痛み',
    ],
  },
  {
    intent: 'hours',
    words: [
      'работн',
      'приемн',
      'кога работ',
      'hours',
      'opening',
      'часы при',
      'часы работ',
      'когда работ',
      'sprechzeit',
      'öffnungszeit',
      'wann',
      '診療時間',
      '何時',
    ],
  },

  {
    intent: 'group',
    words: ['груп', 'group', 'gruppe', 'グループ'],
  },
  {
    intent: 'price',
    words: [
      'цена',
      'струва',
      'плащ',
      'price',
      'cost',
      'fee',
      'стоим',
      'сколько',
      'kosten',
      'preis',
      '費用',
      '料金',
      '値段',
    ],
  },

  {
    intent: 'booking',
    words: [
      'час',
      'запиш',
      'преглед',
      'appointment',
      'book',
      'visit',
      'запис',
      'приём',
      'прием',
      'termin',
      'buchen',
      '予約',
      '診察',
    ],
  },
  {
    intent: 'thanks',
    words: ['благодар', 'мерси', 'thank', 'спасиб', 'danke', 'ありがとう'],
  },
]

export function detectIntent(text) {
  const t = text.toLowerCase()
  // urgent always wins, so the safety message is never missed
  for (const { intent, words } of INTENTS) {
    if (words.some((w) => t.includes(w))) return intent
  }
  return 'fallback'
}

class MockChatService {
  constructor() {
    this.onEvent = () => {}
    this.timers = []
  }

  connect(onEvent) {
    this.onEvent = onEvent
    this.later(150, () => this.onEvent({ type: 'status', status: 'online' }))
  }

  send(text) {
    const message = { id: uid(), from: 'patient', at: new Date(), text }
    const intent = detectIntent(text)
    // pretend the practice reads, types and answers
    this.later(700, () => this.onEvent({ type: 'typing', typing: true }))
    this.later(700 + 900 + Math.min(text.length * 12, 1200), () => {
      this.onEvent({ type: 'typing', typing: false })
      this.onEvent({
        type: 'message',
        message: { id: uid(), from: 'practice', at: new Date(), intent },
      })
    })
    return message
  }

  disconnect() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  later(ms, fn) {
    this.timers.push(setTimeout(fn, ms))
  }
}

export const IS_CHAT_MOCK = true

export function createChatService() {
  return new MockChatService()
}
