import { defineStore, acceptHMRUpdate } from 'pinia'
import { createChatService } from '@/services/chatService'

// The conversation lives only in memory for this visit (nothing is saved on the device).
let service = null

export const useChatStore = defineStore('chat', {
  state: () => ({
    open: false,
    status: 'offline',
    typing: false,
    messages: [],
  }),

  getters: {
    hasPatientMessages: (s) => s.messages.some((m) => m.from === 'patient'),
  },

  actions: {
    ensureConnected() {
      if (service) return
      service = createChatService()
      service.connect((event) => {
        if (event.type === 'status') this.status = event.status
        if (event.type === 'typing') this.typing = event.typing
        if (event.type === 'message') this.messages.push(event.message)
      })
      if (!this.messages.length) {
        this.messages.push({ id: 'welcome', from: 'practice', at: new Date(), intent: 'welcome' })
      }
    },

    openChat() {
      this.ensureConnected()
      this.open = true
    },

    send(text) {
      const clean = text.trim()
      if (!clean) return
      this.ensureConnected()
      this.messages.push(service.send(clean))
    },

    clear() {
      service?.disconnect()
      service = null
      this.messages = []
      this.typing = false
      this.ensureConnected()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
