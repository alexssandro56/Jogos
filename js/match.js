import * as THREE from 'three'
import { Player } from './player.js'
import { Ball } from './ball.js'
import { makeMatchSquads, TEAMS } from './teams.js'

const PITCH = {
  halfLength: 52.5,
  halfWidth: 34,
  goalHalf: 3.66,
  goalHeight: 2.44
}

const HALF_REAL_TIME = 54
const MATCH_MINUTES = 90

const clamp = THREE.MathUtils.clamp

export class Match {
  constructor(scene, audio) {
    this.scene = scene
    this.audio = audio
    this.ball = new Ball(scene)
    this.homePlayers = []
    this.awayPlayers = []
    this.homeTeam = TEAMS[0]
    this.awayTeam = TEAMS[1]
    this.active = null
    this.input = { x: 0, z: 0, sprint: false }
    this.phase = 'menu'
    this.half = 1
    this.clock = 0
    this.realTimer = 0
    this.kickoffTimer = 0
    this.restartTimer = 0
    this.goalTimer = 0
    this.replayTimer = 0
    this.replayIndex = 0
    this.recordTimer = 0
    this.recordBuffer = []
    this.replayFrames = []
    this.score = { home: 0, away: 0 }
    this.shots = { home: 0, away: 0 }
    this.saves = { home: 0, away: 0 }
    this.possession = { home: 0, away: 0 }
    this.goals = new Map()
    this.lastShotBy = null
    this.kickoffTeam = 'home'
    this.goalSide = 1
    this.replaySide = 1
    this.replayActive = false
    this.matchEnded = false
    this.onEvent = null
    this.playerById = new Map()
    this.time = 0
    this.tackleTimer = 0
    this.keeperCooldown = { home: 0, away: 0 }
    this.postCooldown = 0
    this.pendingGoal = null
    this.setupTeams(this.homeTeam, this.awayTeam, true)
  }

  emit(type, payload = {}) {
    if (this.onEvent) this.onEvent(type, payload)
  }

  setupTeams(homeTeam, awayTeam, menu = false) {
    this.homeTeam = homeTeam
    this.awayTeam = awayTeam
    for (const player of [...this.homePlayers, ...this.awayPlayers]) {
      this.scene.remove(player.root)
    }
    this.homePlayers = []
    this.awayPlayers = []
    this.playerById.clear()

    const squads = makeMatchSquads(homeTeam, awayTeam)
    for (const data of squads.home) {
      const player = new Player({ data, team: homeTeam, isHome: true, isKeeper: data.group === 'GK' })
      player.setPosition(data.x, data.z)
      this.homePlayers.push(player)
      this.playerById.set(player.data.id, player)
      this.scene.add(player.root)
    }

    for (const data of squads.away) {
      const player = new Player({ data, team: awayTeam, isHome: false, isKeeper: data.group === 'GK' })
      player.setPosition(-data.x, -data.z)
      this.awayPlayers.push(player)
      this.playerById.set(player.data.id, player)
      this.scene.add(player.root)
    }

    this.resetStats()
    this.score.home = 0
    this.score.away = 0
    this.half = 1
    this.clock = 0
    this.matchEnded = false
    this.phase = menu ? 'menu' : 'kickoff'
    this.active = this.homePlayers.find((player) => player.group === 'FWD') || this.homePlayers[0]
    this.setActive(this.active)
    this.ball.reset(0, 0)
    this.kickoffTeam = 'home'
    this.pendingGoal = null
    this.placeKickoff('home', !menu)
    if (menu) {
      this.phase = 'menu'
      this.kickoffTimer = 0
    }
  }

  resetStats() {
    this.shots = { home: 0, away: 0 }
    this.saves = { home: 0, away: 0 }
    this.possession = { home: 0, away: 0 }
    this.goals = new Map()
    this.lastShotBy = null
    this.recordBuffer = []
    this.replayFrames = []
  }

  startMatch() {
    this.resetStats()
    this.score.home = 0
    this.score.away = 0
    this.half = 1
    this.clock = 0
    this.matchEnded = false
    this.pendingGoal = null
    this.replayFrames = []
    this.replayIndex = 0
    this.phase = 'kickoff'
    this.placeKickoff('home', true)
    this.emit('start')
  }

  placeKickoff(team, countdown = true) {
    this.kickoffTeam = team
    const home = team === 'home'
    this.ball.reset(0, 0)
    this.kickoffTimer = countdown ? 1.7 : 0.1

    for (const player of this.homePlayers) {
      const x = player.data.x
      const z = player.data.z
      player.setPosition(x, z)
      player.hasBall = false
      player.cooldown = 0
    }
    for (const player of this.awayPlayers) {
      const x = -player.data.x
      const z = -player.data.z
      player.setPosition(x, z)
      player.hasBall = false
      player.cooldown = 0
    }

    const roster = home ? this.homePlayers : this.awayPlayers
    const striker = roster.find((player) => player.role === 'ATA') || roster.find((player) => player.group === 'FWD')
    if (striker) {
      const sign = home ? 1 : -1
      striker.setPosition(sign * -1.1, 0)
      this.setOwner(striker)
      if (home) this.setActive(striker)
    }
    if (!home) {
      const nearest = this.nearestToBall(this.homePlayers)
      if (nearest) this.setActive(nearest)
    }
    this.phase = countdown ? 'kickoff' : 'play'
    this.emit('kickoff', { team })
  }

  setActive(player) {
    if (!player) return
    if (this.active !== player) {
      if (this.active) this.active.setActive(false)
      this.active = player
      this.emit('active', { player })
    }
    player.setActive(true)
  }

  nearestToBall(players, exclude = null) {
    let best = null
    let bestDistance = Infinity
    for (const player of players) {
      if (player === exclude) continue
      const distance = player.distanceTo(this.ball.position.x, this.ball.position.z)
      if (distance < bestDistance) {
        bestDistance = distance
        best = player
      }
    }
    return best
  }

  setOwner(player) {
    if (this.ball.owner === player) return
    if (this.ball.owner) this.ball.owner.hasBall = false
    this.ball.owner = player
    if (player) {
      player.hasBall = true
      this.ball.lastTouch = player
      player.lastTouch = this.time
      if (player.isHome) {
        if (player !== this.active) this.setActive(player)
      } else {
        const nearest = this.nearestToBall(this.homePlayers)
        if (nearest && (!this.active || this.active.distanceTo(this.ball.position.x, this.ball.position.z) > 10)) {
          this.setActive(nearest)
        }
      }
      this.emit('possession', { team: player.isHome ? 'home' : 'away' })
    }
  }

  switchPlayer() {
    if (this.phase !== 'play' && this.phase !== 'kickoff') return
    const sorted = [...this.homePlayers]
      .filter((player) => !player.isKeeper)
      .sort((a, b) => a.distanceTo(this.ball.position.x, this.ball.position.z) - b.distanceTo(this.ball.position.x, this.ball.position.z))
    if (!sorted.length) return
    const index = sorted.indexOf(this.active)
    const next = sorted[(index + 1) % Math.min(3, sorted.length)] || sorted[0]
    if (next) {
      this.setActive(next)
      this.audio.switchPlayer()
    }
  }

  humanPass() {
    if (this.phase !== 'play' || !this.active || this.ball.owner !== this.active) return
    this.pass(this.active, true)
  }

  humanShoot() {
    if (this.phase !== 'play' || !this.active || this.ball.owner !== this.active) return
    this.shoot(this.active, true)
  }

  pass(player, human = false) {
    const team = player.isHome ? this.homePlayers : this.awayPlayers
    const attack = player.isHome ? 1 : -1
    let best = null
    let bestScore = -Infinity
    for (const mate of team) {
      if (mate === player || mate.isKeeper) continue
      const dx = mate.position.x - player.position.x
      const dz = mate.position.z - player.position.z
      const distance = Math.hypot(dx, dz)
      if (distance < 4 || distance > 38) continue
      const forward = dx * attack
      const nearest = this.nearestOpponent(mate, player.isHome)
      const pressure = nearest ? nearest.distanceTo(mate.position.x, mate.position.z) : 8
      const score = forward * 0.7 - distance * 0.12 + Math.min(pressure, 10) * 0.5 + (mate.group === 'FWD' ? 3 : 0)
      if (score > bestScore) {
        bestScore = score
        best = mate
      }
    }

    const playerHasBall = this.ball.owner === player
    if (!playerHasBall) return
    const target = best ? best.position.clone() : player.position.clone().add(new THREE.Vector3(attack * 14, 0, 0))
    if (best && best.velocity.lengthSq() > 1) {
      target.x += best.velocity.x * 0.35
      target.z += best.velocity.y * 0.35
    }
    const dx = target.x - player.position.x
    const dz = target.z - player.position.z
    const distance = Math.max(2, Math.hypot(dx, dz))
    const dir = new THREE.Vector2(dx / distance, dz / distance)
    const power = clamp(10 + distance * 0.62, 10, 24)
    const loft = distance > 20 ? 1.4 : 0.15
    const spin = new THREE.Vector3(0, human ? 0 : (Math.random() - 0.5) * 5, 0)
    this.ball.lastTouch = player
    this.ball.kick(dir, power, loft, spin)
    player.hasBall = false
    player.cooldown = 0.4
    player.kick()
    this.audio.pass()
    this.emit('pass', { player })
  }

  shoot(player, human = false) {
    if (this.ball.owner !== player) return
    const attack = player.isHome ? 1 : -1
    const goalX = attack * PITCH.halfLength
    const keeper = (player.isHome ? this.awayPlayers : this.homePlayers).find((item) => item.isKeeper)
    let targetZ
    if (keeper) {
      const awayFromKeeper = keeper.position.z > 0 ? -1 : 1
      targetZ = awayFromKeeper * (1.6 + Math.random() * 1.65)
    } else {
      targetZ = (Math.random() - 0.5) * 5.4
    }
    if (human) {
      targetZ = clamp(player.position.z * 0.22 + (Math.random() - 0.5) * 4.4, -3.1, 3.1)
    }
    const target = new THREE.Vector3(goalX, 0, targetZ)
    const dx = target.x - player.position.x
    const dz = target.z - player.position.z
    const distance = Math.max(1, Math.hypot(dx, dz))
    const dir = new THREE.Vector2(dx / distance, dz / distance)
    const power = clamp(23 + player.data.shooting * 0.1 + (distance > 24 ? 2 : 0), 24, 34)
    const loft = clamp(1.1 + Math.random() * 1.7, 1.1, 2.9)
    const curve = (player.position.z > 0 ? -1 : 1) * (6 + Math.random() * 12)
    const spin = new THREE.Vector3(0, curve, 0)
    this.ball.lastTouch = player
    this.ball.kick(dir, power, loft, spin)
    player.hasBall = false
    player.kick()
    player.cooldown = 0.5
    this.shots[player.isHome ? 'home' : 'away'] += 1
    this.lastShotBy = player
    this.audio.kick(power / 30)
    this.emit('shot', { team: player.isHome ? 'home' : 'away', player })
  }

  nearestOpponent(player, playerIsHome) {
    const opponents = playerIsHome ? this.awayPlayers : this.homePlayers
    let best = null
    let bestDistance = Infinity
    for (const opponent of opponents) {
      const distance = opponent.distanceTo(player.position.x, player.position.z)
      if (distance < bestDistance) {
        bestDistance = distance
        best = opponent
      }
    }
    return best
  }

  update(dt, elapsed) {
    this.time += dt
    if (this.phase === 'menu') {
      for (const player of [...this.homePlayers, ...this.awayPlayers]) player.update(dt, 0, 0)
      this.ball.step(dt)
      return
    }

    if (this.phase === 'replay') {
      this.updateReplay(dt)
      return
    }

    if (this.phase === 'goal') {
      this.goalTimer -= dt
      this.ball.step(dt)
      this.updatePlayersFrozen(dt)
      if (this.goalTimer <= 0) this.beginReplayOrKickoff()
      return
    }

    if (this.phase === 'halftime') {
      this.goalTimer -= dt
      this.ball.step(dt)
      this.updatePlayersFrozen(dt)
      if (this.goalTimer <= 0) {
        this.half = 2
        this.clock = 45
        this.phase = 'kickoff'
        this.placeKickoff('away', true)
        this.emit('half', { half: this.half })
      }
      return
    }

    if (this.phase === 'ended') {
      this.updatePlayersFrozen(dt)
      return
    }

    if (this.phase === 'kickoff' || this.phase === 'restart') {
      const timerKey = this.phase === 'kickoff' ? 'kickoffTimer' : 'restartTimer'
      this[timerKey] -= dt
      this.updatePlayersFrozen(dt)
      this.ball.step(dt)
      if (this.phase === 'kickoff') this.clock += dt * (MATCH_MINUTES / (HALF_REAL_TIME * 2))
      if (this[`${timerKey}`] <= 0) {
        this.phase = 'play'
        this.emit('play')
      }
      this.record(dt)
      return
    }

    if (this.phase !== 'play') return

    this.clock += dt * (MATCH_MINUTES / (HALF_REAL_TIME * 2))
    if (this.clock >= 45 && this.half === 1) {
      this.phase = 'halftime'
      this.goalTimer = 2.4
      this.ball.owner?.hasBall && (this.ball.owner.hasBall = false)
      this.ball.owner = null
      this.emit('halftime')
      this.audio.whistle(true)
      return
    }
    if (this.clock >= 90 && this.half === 2) {
      this.finishMatch()
      return
    }

    this.updatePlayerInput(dt)
    this.updateAI(dt)
    this.updateBallOwner(dt)
    this.checkTackles(dt)
    this.checkGoalkeepers(dt)
    this.checkPosts(dt)
    this.checkGoal()
    if (this.phase !== 'play') return
    this.checkOutOfPlay()
    if (this.phase !== 'play') return
    this.separatePlayers()
    this.ball.step(dt)

    const ownerTeam = this.ball.owner ? (this.ball.owner.isHome ? 'home' : 'away') : null
    if (ownerTeam) this.possession[ownerTeam] += dt
    else if (this.ball.lastTouch) this.possession[this.ball.lastTouch.isHome ? 'home' : 'away'] += dt * 0.4

    this.record(dt)
    this.postCooldown = Math.max(0, this.postCooldown - dt)
    this.keeperCooldown.home = Math.max(0, this.keeperCooldown.home - dt)
    this.keeperCooldown.away = Math.max(0, this.keeperCooldown.away - dt)
  }

  updatePlayersFrozen(dt) {
    for (const player of [...this.homePlayers, ...this.awayPlayers]) {
      if (player === this.ball.owner) {
        player.update(dt, 0, 0, false)
        this.ball.position.set(
          player.position.x + player.facing.x * 0.52,
          this.ball.radius,
          player.position.z + player.facing.y * 0.52
        )
        this.ball.syncMesh()
      } else {
        player.update(dt, 0, 0, false)
      }
    }
  }

  updatePlayerInput(dt) {
    const active = this.active
    if (!active) return
    if (this.ball.owner === active) {
      active.update(dt, this.input.x, this.input.z, this.input.sprint)
      this.ball.position.set(
        active.position.x + active.facing.x * 0.52,
        this.ball.radius,
        active.position.z + active.facing.y * 0.52
      )
      this.ball.syncMesh()
    } else {
      active.update(dt, this.input.x, this.input.z, this.input.sprint)
    }
    active.root.position.x = clamp(active.root.position.x, -56, 56)
    active.root.position.z = clamp(active.root.position.z, -36, 36)
  }

  updateAI(dt) {
    const owner = this.ball.owner
    const ball = this.ball.position

    for (const teamKey of ['home', 'away']) {
      const players = teamKey === 'home' ? this.homePlayers : this.awayPlayers
      const isHome = teamKey === 'home'
      const attack = isHome ? 1 : -1
      const hasPossession = owner && owner.isHome === isHome
      const chaser = this.pickChaser(players, owner, isHome)
      const sorted = [...players]
        .filter((player) => !player.isKeeper)
        .sort((a, b) => a.distanceTo(ball.x, ball.z) - b.distanceTo(ball.x, ball.z))

      for (const player of players) {
        if (player === this.active && isHome) continue
        if (player.isKeeper) {
          this.updateKeeper(player, dt)
          continue
        }
        if (this.phase !== 'play') continue

        if (player === owner) {
          this.aiDribble(player, dt)
          continue
        }

        if (chaser === player) {
          const target = owner && !hasPossession
            ? new THREE.Vector2(owner.position.x, owner.position.z)
            : new THREE.Vector2(ball.x, ball.z)
          const nearestOpponent = this.nearestOpponent(player, isHome)
          if (nearestOpponent && nearestOpponent !== owner && player.distanceTo(ball.x, ball.z) < 6) {
            const side = new THREE.Vector2(player.position.x - nearestOpponent.position.x, player.position.z - nearestOpponent.position.z)
            target.add(side.multiplyScalar(0.35))
          }
          const dist = player.distanceTo(target.x, target.y)
          if (dist > 0.55) {
            player.moveTowards(target.x, target.y, dt, {
              sprint: !hasPossession || dist > 6,
              stopDistance: 0.35
            })
          } else {
            player.update(dt, 0, 0, false)
          }
          continue
        }

        const baseX = player.data.x * (isHome ? 1 : -1)
        const baseZ = player.data.z * (isHome ? 1 : -1)
        let targetX = baseX + (ball.x - baseX) * (hasPossession ? 0.24 : 0.17)
        let targetZ = baseZ + (ball.z - baseZ) * (hasPossession ? 0.3 : 0.42)
        if (hasPossession) {
          targetX += attack * (player.group === 'FWD' ? 9 : player.group === 'MID' ? 5 : 2)
          if (player.group === 'FWD') targetZ += Math.sin(this.time * 0.9 + player.data.index) * 4
        } else {
          targetX -= attack * 3
        }

        if (!hasPossession && chaser) {
          const cover = this.nearestOpponent(player, isHome)
          if (cover && cover === owner) {
            targetX = player.position.x + (owner.position.x - player.position.x) * 0.12
            targetZ = player.position.z + (owner.position.z - player.position.z) * 0.22
          }
        }

        targetX = clamp(targetX, -50, 50)
        targetZ = clamp(targetZ, -31, 31)
        const distance = player.distanceTo(targetX, targetZ)
        if (distance > 0.8) {
          player.moveTowards(targetX, targetZ, dt, { sprint: hasPossession && distance > 9, stopDistance: 0.45 })
        } else {
          player.update(dt, 0, 0, false)
        }
      }

      if (hasPossession && owner && !owner.isKeeper && owner.isHome === isHome) {
        const support = sorted[1]
        if (support && support !== owner && support.distanceTo(ball.x, ball.z) < 14) {
          const ahead = owner.position.x + attack * 4
          const side = owner.position.z + (support.position.z > owner.position.z ? 5 : -5)
          support.moveTowards(clamp(ahead, -50, 50), clamp(side, -30, 30), dt, { sprint: true, stopDistance: 1.4 })
        }
      }
    }
  }

  pickChaser(players, owner, isHome) {
    const candidates = players.filter((player) => !player.isKeeper)
    let best = null
    let bestDistance = Infinity
    const target = owner && owner.isHome !== isHome ? owner.position : this.ball.position
    for (const player of candidates) {
      const distance = player.distanceTo(target.x, target.z)
      const bias = player.group === 'DEF' ? -1 : 0
      const score = distance + bias
      if (score < bestDistance) {
        bestDistance = score
        best = player
      }
    }
    if (best && bestDistance > 28) return best
    return best
  }

  aiDribble(player, dt) {
    const goalX = (player.isHome ? 1 : -1) * PITCH.halfLength
    const dx = goalX - player.position.x
    const dz = -player.position.z * 0.4
    const length = Math.max(1, Math.hypot(dx, dz))
    let dirX = dx / length
    let dirZ = dz / length
    const nearest = this.nearestOpponent(player, player.isHome)
    if (nearest) {
      const distance = nearest.distanceTo(player.position.x, player.position.z)
      if (distance < 4.2) {
        const awayX = player.position.x - nearest.position.x
        const awayZ = player.position.z - nearest.position.z
        const awayLength = Math.max(0.001, Math.hypot(awayX, awayZ))
        dirX += (awayX / awayLength) * 0.8
        dirZ += (awayZ / awayLength) * 1.2
      }
    }
    if (Math.abs(player.position.z) > 24) dirZ -= Math.sign(player.position.z) * 0.8
    const normalize = Math.max(0.001, Math.hypot(dirX, dirZ))
    dirX /= normalize
    dirZ /= normalize
    player.update(dt, dirX, dirZ, true)
    player.root.position.x = clamp(player.root.position.x, -50, 50)
    player.root.position.z = clamp(player.root.position.z, -33, 33)
    this.ball.position.set(
      player.position.x + player.facing.x * 0.52,
      this.ball.radius,
      player.position.z + player.facing.y * 0.52
    )
    this.ball.syncMesh()

    player.aiTimer = (player.aiTimer || 0) - dt
    if (player.aiTimer > 0) return
    player.aiTimer = 0.45 + Math.random() * 0.5
    const distanceGoal = Math.hypot(goalX - player.position.x, player.position.z)
    const pressure = nearest ? nearest.distanceTo(player.position.x, player.position.z) : 10
    if (player.isKeeper) {
      this.pass(player)
      return
    }
    if (distanceGoal < 27 && Math.abs(player.position.z) < 20 && (pressure < 5 || Math.random() < 0.55)) {
      this.shoot(player)
      return
    }
    if (pressure < 3.4 && Math.random() < 0.78) {
      this.pass(player)
      return
    }
    if (Math.random() < 0.22) this.pass(player)
  }

  updateKeeper(player, dt) {
    const isHome = player.isHome
    const ownGoalX = isHome ? -PITCH.halfLength : PITCH.halfLength
    const ball = this.ball
    const ballDistance = player.distanceTo(ball.position.x, ball.position.z)
    let targetX = ownGoalX + (isHome ? 3.2 : -3.2)
    let targetZ = clamp(ball.position.z * 0.2, -2.7, 2.7)
    const ballInBox = isHome ? ball.position.x < -36 : ball.position.x > 36

    if (ballInBox && ballDistance < 15) {
      targetX = ownGoalX + (isHome ? 1.4 : -1.4)
      targetZ = clamp(ball.position.z * 0.35, -3.4, 3.4)
    }
    if (ball.owner === player) {
      player.aiTimer = (player.aiTimer || 0) - dt
      if (player.aiTimer <= 0) {
        player.aiTimer = 0.8
        this.pass(player)
      }
      return
    }

    const distance = player.distanceTo(targetX, targetZ)
    if (distance > 0.35) player.moveTowards(targetX, targetZ, dt, { sprint: ballInBox, stopDistance: 0.25 })
    else player.update(dt, 0, 0, false)

    if (ball.owner && ball.owner.isHome !== isHome && ballDistance < 3.2 && !ball.owner.isKeeper) {
      const dx = ball.position.x - player.position.x
      const dz = ball.position.z - player.position.z
      const length = Math.max(0.01, Math.hypot(dx, dz))
      player.kick()
      player.update(dt, dx / length, dz / length, true)
    }
  }

  updateBallOwner(dt) {
    const owner = this.ball.owner
    if (owner) {
      owner.hasBall = true
      this.ball.position.set(
        owner.position.x + owner.facing.x * 0.52,
        this.ball.radius,
        owner.position.z + owner.facing.y * 0.52
      )
      this.ball.syncMesh()
      if (this.ball.position.x > PITCH.halfLength + 0.15 || this.ball.position.x < -PITCH.halfLength - 0.15) this.checkGoal()
      return
    }

    if (this.ball.position.y > 1.05) return
    const speed = Math.hypot(this.ball.velocity.x, this.ball.velocity.z)
    const all = [...this.homePlayers, ...this.awayPlayers]
    let best = null
    let bestDistance = Infinity
    for (const player of all) {
      if (player.cooldown > 0) continue
      const distance = player.distanceTo(this.ball.position.x, this.ball.position.z)
      const reach = player.isKeeper ? 1.15 : 0.9 + Math.min(0.35, speed * 0.008)
      if (distance < reach && distance < bestDistance) {
        bestDistance = distance
        best = player
      }
    }
    if (!best) return
    if (speed > 19 && !best.isKeeper) return
    this.setOwner(best)
    this.ball.velocity.set(0, 0, 0)
    this.audio.touch()
  }

  checkTackles(dt) {
    const owner = this.ball.owner
    if (!owner || this.phase !== 'play') return
    this.tackleTimer -= dt
    if (this.tackleTimer > 0) return
    this.tackleTimer = 0.22
    const opponents = owner.isHome ? this.awayPlayers : this.homePlayers
    for (const opponent of opponents) {
      if (opponent.isKeeper || opponent.cooldown > 0) continue
      const distance = opponent.distanceTo(owner.position.x, owner.position.z)
      if (distance < 0.85) {
        const chance = 0.3 + (opponent.data.defending - owner.data.pace * 0.55) / 260
        if (Math.random() < chance) {
          owner.hasBall = false
          owner.cooldown = 0.9
          opponent.cooldown = 0.8
          opponent.tackle()
          this.setOwner(opponent)
          this.audio.tackle()
          this.emit('tackle', { player: opponent })
          return
        }
        opponent.cooldown = 1.1
      }
    }
  }

  checkGoalkeepers(dt) {
    const ball = this.ball
    if (ball.owner) return
    const speed = Math.hypot(ball.velocity.x, ball.velocity.z)
    if (speed < 7) return

    for (const teamKey of ['home', 'away']) {
      if (this.keeperCooldown[teamKey] > 0) continue
      const players = teamKey === 'home' ? this.homePlayers : this.awayPlayers
      const keeper = players.find((player) => player.isKeeper)
      if (!keeper) continue
      const side = teamKey === 'home' ? -1 : 1
      const movingToGoal = ball.velocity.x * side > 2
      if (!movingToGoal) continue
      const distance = keeper.distanceTo(ball.position.x, ball.position.z)
      if (distance > 1.5) continue
      if (Math.abs(ball.position.x - side * PITCH.halfLength) > 18) continue
      const saveChance = 0.55 + keeper.data.overall / 400
      if (Math.random() < saveChance) {
        ball.velocity.x *= -0.55
        ball.velocity.z += (Math.random() - 0.5) * 7
        ball.velocity.y = 2.2 + Math.random() * 2
        ball.spin.multiplyScalar(0.3)
        ball.lastTouch = keeper
        this.saves[teamKey] += 1
        this.keeperCooldown[teamKey] = 1.1
        keeper.kick()
        this.audio.save()
        this.emit('save', { team: teamKey, player: keeper })
      }
    }
  }

  checkPosts(dt) {
    if (this.postCooldown > 0) return
    const ball = this.ball
    for (const side of [-1, 1]) {
      if (Math.abs(ball.position.x - side * PITCH.halfLength) > 0.5) continue
      for (const zSide of [-1, 1]) {
        const postZ = zSide * PITCH.goalHalf
        if (Math.abs(ball.position.z - postZ) < 0.38 && ball.position.y < 2.6) {
          const dot = ball.velocity.x * -side
          if (dot < 0) {
            ball.velocity.x *= -0.55
            ball.velocity.z += zSide * 3.4
            ball.velocity.y = Math.max(ball.velocity.y, 2)
            this.postCooldown = 0.5
            this.audio.post()
            this.emit('post', { side })
          }
        }
      }
    }
  }

  checkGoal() {
    if (this.phase !== 'play') return
    const ball = this.ball
    const side = ball.position.x > 0 ? 1 : -1
    const overLine = Math.abs(ball.position.x) > PITCH.halfLength + 0.12
    if (!overLine) return
    if (Math.abs(ball.position.z) < PITCH.goalHalf + ball.radius && ball.position.y < PITCH.goalHeight) {
      const scoringTeam = side > 0 ? 'home' : 'away'
      this.score[scoringTeam] += 1
      const scorer = ball.lastTouch || this.lastShotBy
      if (scorer) {
        this.goals.set(scorer, (this.goals.get(scorer) || 0) + 1)
      }
      this.pendingGoal = { team: scoringTeam, scorer, side }
      this.phase = 'goal'
      this.goalTimer = 1.15
      this.goalSide = side
      this.ball.owner = null
      if (scorer) scorer.hasBall = false
      this.ball.velocity.multiplyScalar(0.35)
      this.replayFrames = this.recordBuffer.slice(-58)
      this.audio.goal()
      this.emit('goal', {
        team: scoringTeam,
        scorer,
        score: { ...this.score },
        side
      })
      return
    }
    this.checkOutOfPlay()
  }

  checkOutOfPlay() {
    if (this.phase !== 'play') return
    const ball = this.ball
    const outZ = Math.abs(ball.position.z) > PITCH.halfWidth + ball.radius + 0.1
    const outX = Math.abs(ball.position.x) > PITCH.halfLength + ball.radius + 0.05
    if (!outZ && !outX) return

    const lastTeam = ball.lastTouch ? (ball.lastTouch.isHome ? 'home' : 'away') : null
    if (ball.owner) {
      ball.owner.hasBall = false
      ball.owner = null
    }

    if (outZ) {
      const zSide = Math.sign(ball.position.z) || 1
      const team = lastTeam === 'home' ? 'away' : 'home'
      const x = clamp(ball.position.x, -48, 48)
      ball.reset(x, zSide * (PITCH.halfWidth - 0.5))
      const roster = team === 'home' ? this.homePlayers : this.awayPlayers
      const taker = this.nearestToBall(roster)
      if (taker) {
        taker.setPosition(x, zSide * (PITCH.halfWidth - 1.4))
        this.setOwner(taker)
        if (team === 'home') this.setActive(taker)
      }
      this.phase = 'restart'
      this.restartTimer = 0.55
      this.emit('out', { type: 'throw', team })
      return
    }

    const side = Math.sign(ball.position.x) || 1
    const defendingTeam = side > 0 ? 'away' : 'home'
    if (lastTeam === defendingTeam) {
      const attackingTeam = side > 0 ? 'home' : 'away'
      const zSide = Math.sign(ball.position.z) || 1
      ball.reset(side * (PITCH.halfLength - 0.7), zSide * (PITCH.halfWidth - 0.7))
      const roster = attackingTeam === 'home' ? this.homePlayers : this.awayPlayers
      const taker = this.nearestToBall(roster)
      if (taker) {
        taker.setPosition(side * (PITCH.halfLength - 1.5), zSide * (PITCH.halfWidth - 1.6))
        this.setOwner(taker)
        if (attackingTeam === 'home') this.setActive(taker)
      }
      this.phase = 'restart'
      this.restartTimer = 0.7
      this.emit('out', { type: 'corner', team: attackingTeam })
      return
    }

    const roster = defendingTeam === 'home' ? this.homePlayers : this.awayPlayers
    const keeper = roster.find((player) => player.isKeeper)
    ball.reset(side * (PITCH.halfLength - 5), 0)
    if (keeper) {
      keeper.setPosition(side * (PITCH.halfLength - 3.4), 0)
      this.setOwner(keeper)
    }
    this.phase = 'restart'
    this.restartTimer = 0.75
    this.emit('out', { type: 'goalkick', team: defendingTeam })
  }

  separatePlayers() {
    const all = [...this.homePlayers, ...this.awayPlayers]
    for (let i = 0; i < all.length; i += 1) {
      for (let j = i + 1; j < all.length; j += 1) {
        const a = all[i]
        const b = all[j]
        const dx = b.position.x - a.position.x
        const dz = b.position.z - a.position.z
        const distance = Math.hypot(dx, dz)
        if (distance > 0.001 && distance < 0.95) {
          const push = (0.95 - distance) * 0.5
          const nx = dx / distance
          const nz = dz / distance
          a.root.position.x -= nx * push
          a.root.position.z -= nz * push
          b.root.position.x += nx * push
          b.root.position.z += nz * push
        }
      }
    }
  }

  record(dt) {
    this.recordTimer += dt
    if (this.recordTimer < 0.05) return
    this.recordTimer = 0
    const frame = {
      ball: { x: this.ball.position.x, y: this.ball.position.y, z: this.ball.position.z },
      players: [...this.homePlayers, ...this.awayPlayers].map((player) => ({
        x: player.position.x,
        z: player.position.z,
        ry: player.root.rotation.y,
        legL: player.legs[0].rotation.x,
        legR: player.legs[1].rotation.x
      }))
    }
    this.recordBuffer.push(frame)
    if (this.recordBuffer.length > 90) this.recordBuffer.shift()
  }

  beginReplayOrKickoff() {
    const goal = this.pendingGoal
    if (!goal) {
      this.kickoffAfterGoal()
      return
    }
    if (this.replayFrames.length > 12) {
      this.replayFrames = this.replayFrames.slice(-52)
      this.replayIndex = 0
      this.replayTimer = 0
      this.phase = 'replay'
      this.replaySide = goal.side
      this.audio.whistle(false)
      this.emit('replayStart', { side: goal.side })
    } else {
      this.kickoffAfterGoal()
    }
  }

  updateReplay(dt) {
    this.replayTimer += dt
    const interval = 0.075
    while (this.replayTimer >= interval) {
      this.replayTimer -= interval
      const frame = this.replayFrames[this.replayIndex]
      if (!frame) break
      this.applyFrame(frame)
      this.replayIndex += 1
    }
    if (this.replayIndex >= this.replayFrames.length) {
      this.emit('replayEnd')
      this.kickoffAfterGoal()
    }
  }

  applyFrame(frame) {
    this.ball.position.set(frame.ball.x, frame.ball.y, frame.ball.z)
    this.ball.syncMesh()
    const all = [...this.homePlayers, ...this.awayPlayers]
    frame.players.forEach((data, index) => {
      const player = all[index]
      if (!player) return
      player.root.position.set(data.x, 0, data.z)
      player.root.rotation.y = data.ry
      player.legs[0].rotation.x = data.legL
      player.legs[1].rotation.x = data.legR
    })
  }

  kickoffAfterGoal() {
    const goal = this.pendingGoal
    this.pendingGoal = null
    this.emit('goalEnd')
    const conceding = goal ? (goal.team === 'home' ? 'away' : 'home') : 'home'
    this.phase = 'kickoff'
    this.placeKickoff(conceding, true)
  }

  finishMatch() {
    if (this.matchEnded) return
    this.matchEnded = true
    this.phase = 'ended'
    if (this.ball.owner) {
      this.ball.owner.hasBall = false
      this.ball.owner = null
    }
    this.audio.finalWhistle()
    const mvp = this.calculateMvp()
    this.emit('end', {
      score: { ...this.score },
      stats: {
        possession: { ...this.possession },
        shots: { ...this.shots },
        saves: { ...this.saves }
      },
      mvp
    })
  }

  calculateMvp() {
    let best = null
    let bestScore = -Infinity
    for (const player of [...this.homePlayers, ...this.awayPlayers]) {
      const goals = this.goals.get(player) || 0
      const score = goals * 20 + player.overall + (player.isKeeper ? 4 : 0)
      if (score > bestScore) {
        bestScore = score
        best = player
      }
    }
    return best
  }

  get focus() {
    return this.ball.position
  }

  get timeClock() {
    return this.clock
  }
}
