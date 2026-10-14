// ============================================================================
//  Call service
// ============================================================================
//  There is no server yet, so `createCallService()` returns a MOCK that only
//  simulates the states of a call (ringing → connected → ended). No audio or video
//  leaves the device. A real implementation (e.g. WebRTC with a signalling server)
//  should keep the same interface.
//
//  Interface
//    start({ video })  begin a call; emits { type: 'state', state } with
//                      'dialing' → 'ringing' → 'connected' → 'ended'
//    setMuted(bool)    setSpeaker(bool)    setVideo(bool)
//    hangup()
//    onEvent           assign a callback before calling start()
// ============================================================================

class MockCallService {
  constructor() {
    this.onEvent = () => {}
    this.timers = []
    this.state = 'idle'
  }

  start() {
    this.clear()
    this.set('dialing')
    this.later(900, () => this.set('ringing'))
    this.later(900 + 4200, () => this.set('connected'))
  }

  setMuted() {}
  setSpeaker() {}
  setVideo() {}

  hangup() {
    this.clear()
    if (this.state !== 'idle' && this.state !== 'ended') this.set('ended')
  }

  set(state) {
    this.state = state
    this.onEvent({ type: 'state', state })
  }

  later(ms, fn) {
    this.timers.push(setTimeout(fn, ms))
  }

  clear() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }
}

export const IS_CALL_MOCK = true

export function createCallService() {
  return new MockCallService()
}
