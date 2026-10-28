export class SoundKit {
  constructor() {
    this.ctx = null
    this.master = null
    this.crowdBus = null
    this.muted = false
    this.noiseBuffer = null
    this.ambientStarted = false
    this.crowdSwell = 0
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.5
    this.master.connect(this.ctx.destination)
    this.noiseBuffer = this.createNoise(3)
    this.startAmbient()
  }

  createNoise(seconds) {
    const length = Math.floor(this.ctx.sampleRate * seconds)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      last = last * 0.72 + white * 0.28
      data[i] = last
    }
    return buffer
  }

  setMuted(value) {
    this.muted = value
    if (!this.master) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.linearRampToValueAtTime(value ? 0 : 0.5, t + 0.15)
  }

  startAmbient() {
    if (!this.ctx || this.ambientStarted) return
    this.ambientStarted = true
    const t = this.ctx.currentTime
    this.crowdBus = this.ctx.createGain()
    this.crowdBus.gain.value = 0.16
    this.crowdBus.connect(this.master)

    const crowd = this.ctx.createBufferSource()
    crowd.buffer = this.noiseBuffer
    crowd.loop = true
    const band = this.ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 520
    band.Q.value = 0.45
    const high = this.ctx.createBiquadFilter()
    high.type = 'highpass'
    high.frequency.value = 220
    const gain = this.ctx.createGain()
    gain.gain.value = 0.09
    crowd.connect(band).connect(high).connect(gain).connect(this.crowdBus)
    crowd.start(t)

    const murmur = this.ctx.createBufferSource()
    murmur.buffer = this.noiseBuffer
    murmur.loop = true
    const murmurFilter = this.ctx.createBiquadFilter()
    murmurFilter.type = 'lowpass'
    murmurFilter.frequency.value = 320
    const murmurGain = this.ctx.createGain()
    murmurGain.gain.value = 0.05
    murmur.connect(murmurFilter).connect(murmurGain).connect(this.crowdBus)
    murmur.start(t)

    const lfo = this.ctx.createOscillator()
    lfo.frequency.value = 0.13
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 0.03
    lfo.connect(lfoGain).connect(this.crowdBus.gain)
    lfo.start(t)
  }

  tone(freq, duration, { type = 'sine', gain = 0.12, slide = null, delay = 0, destination = null } = {}) {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + duration)
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.connect(env).connect(destination || this.master)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  }

  noise(duration, { gain = 0.1, freq = 1600, q = 0.8, delay = 0, type = 'bandpass', sweep = null } = {}) {
    if (!this.ctx || this.muted) return
    const t = this.ctx.currentTime + delay
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = type
    filter.frequency.setValueAtTime(freq, t)
    filter.Q.value = q
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(40, sweep), t + duration)
    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(gain, t + 0.01)
    env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(filter).connect(env).connect(this.master)
    src.start(t)
    src.stop(t + duration + 0.05)
  }

  ui() { this.tone(1180, 0.04, { type: 'square', gain: 0.035, slide: 900 }) }

  switchPlayer() {
    this.tone(520, 0.06, { type: 'triangle', gain: 0.05, slide: 760 })
    this.tone(880, 0.06, { type: 'sine', gain: 0.03, delay: 0.03 })
  }

  pass() {
    this.noise(0.06, { gain: 0.075, freq: 900, q: 1.2 })
    this.tone(190, 0.08, { type: 'triangle', gain: 0.06, slide: 110 })
  }

  kick(power = 1) {
    const p = Math.min(1.35, power)
    this.noise(0.09, { gain: 0.09 * p, freq: 550, q: 0.9, sweep: 180 })
    this.tone(150, 0.12, { type: 'sine', gain: 0.1 * p, slide: 62 })
    this.tone(420, 0.04, { type: 'square', gain: 0.025, slide: 260 })
  }

  touch() {
    this.noise(0.035, { gain: 0.035, freq: 1100, q: 1.5 })
  }

  whistle(long = false) {
    const duration = long ? 0.65 : 0.34
    this.tone(2050, duration, { type: 'sine', gain: 0.075 })
    this.tone(2260, duration * 0.9, { type: 'triangle', gain: 0.035, delay: 0.015 })
    this.tone(2480, duration * 0.75, { type: 'sine', gain: 0.02, delay: 0.03 })
  }

  goal() {
    this.whistle(false)
    this.noise(2.2, { gain: 0.16, freq: 900, q: 0.4, type: 'bandpass', sweep: 450 })
    this.noise(1.6, { gain: 0.08, freq: 2400, q: 0.5, type: 'highpass', delay: 0.05 })
    const notes = [523, 659, 784, 1046, 1318]
    notes.forEach((note, index) => {
      this.tone(note, 0.55, { type: 'sine', gain: 0.06, delay: index * 0.09 })
    })
  }

  save() {
    this.noise(0.16, { gain: 0.1, freq: 700, q: 0.7, sweep: 220 })
    this.tone(220, 0.14, { type: 'triangle', gain: 0.06, slide: 120 })
  }

  post() {
    this.tone(1400, 0.35, { type: 'sine', gain: 0.08, slide: 780 })
    this.tone(2100, 0.2, { type: 'triangle', gain: 0.04, delay: 0.01 })
  }

  miss() {
    this.noise(0.35, { gain: 0.06, freq: 1200, q: 0.4, sweep: 300 })
    this.tone(180, 0.3, { type: 'triangle', gain: 0.05, slide: 90 })
  }

  tackle() {
    this.noise(0.14, { gain: 0.09, freq: 380, q: 0.8, sweep: 120 })
    this.tone(120, 0.16, { type: 'square', gain: 0.04, slide: 70 })
  }

  finalWhistle() {
    this.whistle(true)
    this.tone(1800, 0.15, { type: 'sine', gain: 0.05, delay: 0.7 })
    this.tone(2100, 0.4, { type: 'sine', gain: 0.05, delay: 0.8 })
    this.noise(2.4, { gain: 0.08, freq: 780, q: 0.4, delay: 0.4 })
  }

  fanfare() {
    const notes = [392, 523, 659, 784]
    notes.forEach((note, index) => this.tone(note, 0.6, { type: 'sine', gain: 0.07, delay: index * 0.11 }))
    this.tone(1046, 0.9, { type: 'triangle', gain: 0.045, delay: 0.48 })
  }
}
