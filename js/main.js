import { createStadium } from './stadium.js'
import { SoundKit } from './audio.js'
import { Match } from './match.js'
import { TEAMS } from './teams.js'

const $ = (id) => document.getElementById(id)
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const pad = (value) => String(value).padStart(2, '0')

const stadium = createStadium()
const audio = new SoundKit()
const match = new Match(stadium.scene, audio)

const state = {
  mode: 'menu',
  home: TEAMS[0],
  away: TEAMS[1],
  muted: false,
  touch: { x: 0, z: 0, sprint: false, pointer: null },
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  toastTimer: 0
}

const keys = new Set()

const els = {
  menu: $('menu'),
  match: $('match'),
  results: $('results'),
  loading: $('loading'),
  playBtn: $('playBtn'),
  nextBtn: $('nextBtn'),
  menuBtn: $('menuBtn'),
  homePickName: $('homePickName'),
  homePickMeta: $('homePickMeta'),
  awayPickName: $('awayPickName'),
  awayPickMeta: $('awayPickMeta'),
  homeCrest: $('homeCrest'),
  awayCrest: $('awayCrest'),
  hudHomeName: $('hudHomeName'),
  hudAwayName: $('hudAwayName'),
  hudHomeCrest: $('hudHomeCrest'),
  hudAwayCrest: $('hudAwayCrest'),
  scoreHome: $('scoreHome'),
  scoreAway: $('scoreAway'),
  clock: $('clock'),
  halfLabel: $('halfLabel'),
  posHome: $('posHome'),
  posAway: $('posAway'),
  posHomeText: $('posHomeText'),
  posAwayText: $('posAwayText'),
  activeName: $('activeName'),
  activeRole: $('activeRole'),
  goalOverlay: $('goalOverlay'),
  goalTeam: $('goalTeam'),
  goalScorer: $('goalScorer'),
  replayBadge: $('replayBadge'),
  toast: $('toast'),
  flash: $('flash'),
  soundBtn: $('soundBtn'),
  soundIcon: $('soundIcon'),
  replayBtn: $('replayBtn'),
  joystick: $('joystick'),
  stick: $('stick'),
  passBtn: $('passBtn'),
  shootBtn: $('shootBtn'),
  switchBtn: $('switchBtn'),
  sprintBtn: $('sprintBtn'),
  resultEyebrow: $('resultEyebrow'),
  resultTitle: $('resultTitle'),
  resultHomeCrest: $('resultHomeCrest'),
  resultAwayCrest: $('resultAwayCrest'),
  resultHomeName: $('resultHomeName'),
  resultAwayName: $('resultAwayName'),
  resultScore: $('resultScore'),
  statPossession: $('statPossession'),
  statShots: $('statShots'),
  statSaves: $('statSaves'),
  resultMvp: $('resultMvp'),
  nextLabel: $('nextLabel'),
  nextSub: $('nextSub')
}

const shortName = (name) => name.split(' ').slice(-1)[0].toUpperCase()
const teamFor = (side) => (side === 'home' ? state.home : state.away)

function setCrest(element, team) {
  element.textContent = team.letter
  element.style.setProperty('--crest-a', team.crestA)
  element.style.setProperty('--crest-b', team.crestB)
}

function renderTeams() {
  els.homePickName.textContent = state.home.name
  els.homePickMeta.textContent = `OVR ${state.home.rating} · ${state.home.formation} · ${state.home.country.slice(0, 3).toUpperCase()}`
  els.awayPickName.textContent = state.away.name
  els.awayPickMeta.textContent = `OVR ${state.away.rating} · ${state.away.formation} · ${state.away.country.slice(0, 3).toUpperCase()}`
  els.hudHomeName.textContent = state.home.name
  els.hudAwayName.textContent = state.away.name
  els.resultHomeName.textContent = state.home.name
  els.resultAwayName.textContent = state.away.name
  setCrest(els.homeCrest, state.home)
  setCrest(els.awayCrest, state.away)
  setCrest(els.hudHomeCrest, state.home)
  setCrest(els.hudAwayCrest, state.away)
  setCrest(els.resultHomeCrest, state.home)
  setCrest(els.resultAwayCrest, state.away)
}

function updateScoreboard() {
  els.scoreHome.textContent = String(match.score.home)
  els.scoreAway.textContent = String(match.score.away)
}

function updatePossession() {
  const home = match.possession.home
  const away = match.possession.away
  const total = home + away
  const homePercent = total > 0 ? Math.round((home / total) * 100) : 50
  const awayPercent = 100 - homePercent
  els.posHome.style.width = `${homePercent}%`
  els.posAway.style.width = `${awayPercent}%`
  els.posHomeText.textContent = `CASA ${homePercent}%`
  els.posAwayText.textContent = `${awayPercent}% VISITANTE`
}

function updateClock() {
  const gameMinute = clamp(match.clock, 0, 90)
  const minutes = Math.floor(gameMinute)
  const seconds = Math.floor((gameMinute - minutes) * 60)
  els.clock.textContent = `${pad(minutes)}:${pad(seconds)}`
  if (match.phase === 'halftime') els.halfLabel.textContent = 'INTERVALO'
  else if (match.phase === 'ended') els.halfLabel.textContent = 'FINAL'
  else els.halfLabel.textContent = match.half === 2 ? '2º TEMPO' : '1º TEMPO'
}

function setActiveTag(player) {
  if (!player) return
  els.activeName.textContent = `#${player.number} ${shortName(player.name)}`
  els.activeRole.textContent = player.role
}

function showToast(message, tone = '', duration = 1800) {
  window.clearTimeout(state.toastTimer)
  els.toast.textContent = message
  els.toast.className = `toast show${tone ? ` ${tone}` : ''}`
  state.toastTimer = window.setTimeout(() => {
    els.toast.className = 'toast'
  }, duration)
}

function flashScreen() {
  els.flash.classList.add('show')
  window.setTimeout(() => els.flash.classList.remove('show'), 150)
}

function showGoal(payload) {
  const team = teamFor(payload.team)
  const scorer = payload.scorer
  const minute = clamp(Math.round(match.clock), 1, 90)
  els.goalTeam.textContent = team.name.toUpperCase()
  els.goalScorer.textContent = scorer
    ? `#${scorer.number} ${shortName(scorer.name)} · ${minute}'`
    : `GOL · ${minute}'`
  els.goalOverlay.classList.remove('hidden')
  flashScreen()
}

function hideGoal() {
  els.goalOverlay.classList.add('hidden')
}

function setReplayBadge(visible) {
  els.replayBadge.classList.toggle('hidden', !visible)
}

function handleEvent(type, payload) {
  switch (type) {
    case 'active':
      setActiveTag(payload.player)
      break
    case 'goal':
      updateScoreboard()
      showGoal(payload)
      stadium.setMode('replay', { side: payload.side })
      break
    case 'replayStart':
      hideGoal()
      setReplayBadge(true)
      stadium.setMode('replay', { side: payload.side })
      break
    case 'replayEnd':
      setReplayBadge(false)
      stadium.setMode('match')
      break
    case 'goalEnd':
      hideGoal()
      setReplayBadge(false)
      stadium.setMode('match')
      break
    case 'halftime':
      showToast('INTERVALO · 45 MINUTOS', '', 2200)
      break
    case 'half':
      showToast('SEGUNDO TEMPO · BOLA EM JOGO', 'good', 1800)
      break
    case 'save':
      showToast('GRANDE DEFESA', 'good', 1200)
      break
    case 'post':
      showToast('NA TRAVE!', 'bad', 1300)
      break
    case 'out':
      if (payload.type === 'corner') showToast('ESCANTEIO', '', 1100)
      else if (payload.type === 'goalkick') showToast('TIRO DE META', '', 1000)
      break
    case 'end':
      showResults(payload)
      break
    default:
      break
  }
}

match.onEvent = handleEvent
match.setupTeams(state.home, state.away, true)

function startGame() {
  if (state.mode === 'playing') return
  audio.init()
  audio.setMuted(state.muted)
  match.setupTeams(state.home, state.away, true)
  match.startMatch()
  state.mode = 'playing'
  document.body.classList.add('playing')
  document.body.classList.remove('finished')
  els.menu.classList.add('hidden')
  els.menu.style.opacity = '0'
  els.menu.style.visibility = 'hidden'
  els.match.classList.remove('hidden')
  els.results.classList.add('hidden')
  hideGoal()
  setReplayBadge(false)
  stadium.setMode('match')
  updateScoreboard()
  updatePossession()
  updateClock()
  setActiveTag(match.active)
  clearInput()
  showToast('KICK-OFF · BOLA EM JOGO', 'good', 1400)
  audio.whistle(true)
}

function returnToMenu() {
  state.mode = 'menu'
  document.body.classList.remove('playing')
  document.body.classList.remove('finished')
  match.setupTeams(state.home, state.away, true)
  stadium.setMode('menu')
  els.results.classList.add('hidden')
  els.match.classList.add('hidden')
  els.menu.classList.remove('hidden')
  els.menu.style.opacity = ''
  els.menu.style.visibility = ''
  hideGoal()
  setReplayBadge(false)
  clearInput()
  updateScoreboard()
  updatePossession()
  updateClock()
}

function showResults(payload) {
  state.mode = 'results'
  document.body.classList.remove('playing')
  document.body.classList.add('finished')
  els.match.classList.add('hidden')
  els.menu.classList.add('hidden')
  els.results.classList.remove('hidden')
  hideGoal()
  setReplayBadge(false)
  stadium.setMode('results')

  const homeScore = payload.score.home
  const awayScore = payload.score.away
  if (homeScore > awayScore) els.resultTitle.textContent = `${state.home.name} vence`
  else if (awayScore > homeScore) els.resultTitle.textContent = `${state.away.name} vence`
  else els.resultTitle.textContent = 'Empate no Prisma'

  const homePossession = payload.stats.possession.home
  const awayPossession = payload.stats.possession.away
  const total = homePossession + awayPossession
  const homePercent = total > 0 ? Math.round((homePossession / total) * 100) : 50

  els.resultEyebrow.textContent = 'APITO FINAL · ESTÁDIO PRISMA'
  els.resultScore.textContent = `${homeScore} — ${awayScore}`
  els.statPossession.textContent = `${homePercent}% · ${100 - homePercent}%`
  els.statShots.textContent = `${payload.stats.shots.home} · ${payload.stats.shots.away}`
  els.statSaves.textContent = `${payload.stats.saves.home} · ${payload.stats.saves.away}`
  els.nextLabel.textContent = 'JOGAR NOVAMENTE'
  els.nextSub.textContent = 'NOVO KICK-OFF'

  const mvp = payload.mvp
  if (mvp) {
    const team = mvp.isHome ? state.home : state.away
    els.resultMvp.textContent = `#${mvp.number} ${shortName(mvp.name)} · ${team.short}`
  } else {
    els.resultMvp.textContent = 'SEM DESTAQUE'
  }

  updateScoreboard()
  updateClock()
  audio.fanfare()
}

function cycleTeam(side, direction) {
  const other = side === 'home' ? state.away : state.home
  let index = TEAMS.indexOf(teamFor(side))
  do {
    index = (index + direction + TEAMS.length) % TEAMS.length
  } while (TEAMS[index] === other)
  if (side === 'home') state.home = TEAMS[index]
  else state.away = TEAMS[index]
  renderTeams()
  match.setupTeams(state.home, state.away, true)
  stadium.setMode('menu')
}

function toggleSound() {
  state.muted = !state.muted
  audio.setMuted(state.muted)
  els.soundBtn.classList.toggle('off', state.muted)
  els.soundBtn.setAttribute('aria-label', state.muted ? 'Ativar som' : 'Desativar som')
  els.soundIcon.setAttribute('href', state.muted ? '#i-mute' : '#i-volume')
  if (!state.muted) audio.ui()
}

function replayNotice() {
  if (match.phase === 'replay') showToast('REPLAY EM ANDAMENTO', '', 1400)
  else showToast('REPLAY AUTOMÁTICO APÓS O GOL', '', 1700)
}

function clearInput() {
  keys.clear()
  state.touch.x = 0
  state.touch.z = 0
  state.touch.sprint = false
  resetJoystick()
}

function updateInput() {
  const keyX = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0)
  const keyZ = (keys.has('s') ? 1 : 0) - (keys.has('w') ? 1 : 0)
  if (keyX || keyZ) {
    const length = Math.hypot(keyX, keyZ)
    match.input.x = keyX / length
    match.input.z = keyZ / length
  } else {
    match.input.x = state.touch.x
    match.input.z = state.touch.z
  }
  match.input.sprint = keys.has('shift') || state.touch.sprint
}

function resetJoystick() {
  state.touch.pointer = null
  state.touch.x = 0
  state.touch.z = 0
  els.stick.style.transform = 'translate(0px, 0px)'
}

function moveJoystick(event) {
  const rect = els.joystick.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const max = rect.width * 0.34
  let dx = event.clientX - centerX
  let dy = event.clientY - centerY
  const distance = Math.hypot(dx, dy)
  if (distance > max) {
    dx = (dx / distance) * max
    dy = (dy / distance) * max
  }
  els.stick.style.transform = `translate(${dx}px, ${dy}px)`
  let nx = dx / max
  let nz = dy / max
  const length = Math.hypot(nx, nz)
  if (length > 1) {
    nx /= length
    nz /= length
  }
  state.touch.x = Math.abs(nx) > 0.16 ? nx : 0
  state.touch.z = Math.abs(nz) > 0.16 ? nz : 0
}

function updateHud(now) {
  if (state.mode !== 'playing') return
  if (now - updateHud.last < 100) return
  updateHud.last = now
  updateScoreboard()
  updateClock()
  updatePossession()
  setActiveTag(match.active)
}
updateHud.last = 0

function frame(now) {
  requestAnimationFrame(frame)
  const dt = Math.min(0.05, (now - frame.last) / 1000)
  frame.last = now
  const elapsed = now / 1000
  updateInput()
  match.update(dt, elapsed)
  stadium.update(dt, elapsed, match.focus)
  stadium.renderer.render(stadium.scene, stadium.camera)
  updateHud(now)
  if (frame.first) {
    frame.first = false
    const finishLoading = () => {
      els.loading.classList.add('done')
      document.body.dataset.ready = 'true'
      window.__gameReady = true
    }
    if (document.fonts?.ready) document.fonts.ready.then(finishLoading).catch(finishLoading)
    else finishLoading()
  }
}
frame.last = performance.now()
frame.first = true

els.playBtn.addEventListener('click', startGame)
els.nextBtn.addEventListener('click', startGame)
els.menuBtn.addEventListener('click', returnToMenu)
els.soundBtn.addEventListener('click', () => {
  audio.init()
  toggleSound()
})
els.replayBtn.addEventListener('click', () => {
  audio.ui()
  replayNotice()
})

document.querySelectorAll('.team-arrow').forEach((button) => {
  button.addEventListener('click', () => {
    const side = button.closest('.team-pick')?.dataset.side
    if (!side) return
    cycleTeam(side, Number(button.dataset.dir) || 1)
  })
})

const canvas = stadium.renderer.domElement

canvas.addEventListener('pointerdown', (event) => {
  if (state.mode !== 'playing') return
  state.dragging = true
  state.pointerX = event.clientX
  state.pointerY = event.clientY
  canvas.setPointerCapture?.(event.pointerId)
})

canvas.addEventListener('pointermove', (event) => {
  if (!state.dragging) return
  const dx = event.clientX - state.pointerX
  const dy = event.clientY - state.pointerY
  state.pointerX = event.clientX
  state.pointerY = event.clientY
  stadium.orbit(dx, dy)
})

const stopDrag = () => {
  state.dragging = false
}

canvas.addEventListener('pointerup', stopDrag)
canvas.addEventListener('pointercancel', stopDrag)
canvas.addEventListener('lostpointercapture', stopDrag)
canvas.addEventListener('contextmenu', (event) => event.preventDefault())
canvas.addEventListener('wheel', (event) => {
  if (state.mode !== 'playing') return
  event.preventDefault()
  stadium.zoom(event.deltaY)
}, { passive: false })

els.joystick.addEventListener('pointerdown', (event) => {
  event.preventDefault()
  state.touch.pointer = event.pointerId
  els.joystick.setPointerCapture?.(event.pointerId)
  moveJoystick(event)
})

els.joystick.addEventListener('pointermove', (event) => {
  if (state.touch.pointer !== event.pointerId) return
  event.preventDefault()
  moveJoystick(event)
})

for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  els.joystick.addEventListener(type, (event) => {
    if (state.touch.pointer !== event.pointerId) return
    resetJoystick()
  })
}

const tapAction = (element, action) => {
  element.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    if (state.mode !== 'playing') return
    action()
  })
}

tapAction(els.passBtn, () => match.humanPass())
tapAction(els.shootBtn, () => match.humanShoot())
tapAction(els.switchBtn, () => match.switchPlayer())

els.sprintBtn.addEventListener('pointerdown', (event) => {
  event.preventDefault()
  state.touch.sprint = true
  els.sprintBtn.setPointerCapture?.(event.pointerId)
})
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  els.sprintBtn.addEventListener(type, () => {
    state.touch.sprint = false
  })
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()
  const movement = key === 'w' || key === 'a' || key === 's' || key === 'd'
  if (movement) {
    keys.add(key)
    if (state.mode === 'playing') event.preventDefault()
    return
  }
  if (key === 'shift') {
    keys.add('shift')
    if (state.mode === 'playing') event.preventDefault()
    return
  }
  if (event.repeat) return
  if (event.code === 'Space') {
    if (state.mode === 'playing') {
      event.preventDefault()
      match.humanPass()
    }
    return
  }
  if (key === 'j') {
    if (state.mode === 'playing') match.humanShoot()
  } else if (key === 'q') {
    if (state.mode === 'playing') match.switchPlayer()
  } else if (key === 'm') {
    toggleSound()
  } else if (key === 'r') {
    replayNotice()
  } else if (key === 'enter') {
    if (state.mode === 'menu' || state.mode === 'results') startGame()
  }
})

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase()
  if (key === 'shift' || key === 'w' || key === 'a' || key === 's' || key === 'd') {
    keys.delete(key)
  }
})
window.addEventListener('blur', clearInput)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInput()
})

window.__game = {
  state,
  match,
  stadium,
  audio,
  TEAMS,
  start: startGame,
  startGame,
  returnToMenu,
  cycleTeam
}

renderTeams()
updateScoreboard()
updatePossession()
updateClock()
setActiveTag(match.active)
requestAnimationFrame(frame)
