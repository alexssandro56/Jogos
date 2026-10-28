import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const limbMaterial = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.03 })
const bootMaterial = new THREE.MeshStandardMaterial({ color: 0x0c1016, roughness: 0.4, metalness: 0.25 })

function makeNumberTexture(number, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 128, 128)
  ctx.fillStyle = color
  ctx.font = '700 82px Rajdhani, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(number), 64, 68)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export class Player {
  constructor({ data, team, isHome, isKeeper = false }) {
    this.data = data
    this.team = team
    this.isHome = isHome
    this.isKeeper = isKeeper
    this.number = data.number
    this.name = data.name
    this.role = data.role
    this.group = data.group
    this.overall = data.overall
    this.velocity = new THREE.Vector2()
    this.desired = new THREE.Vector2()
    this.facing = new THREE.Vector2(isHome ? 1 : -1, 0)
    this.hasBall = false
    this.kickTimer = 0
    this.tackleTimer = 0
    this.phase = Math.random() * Math.PI * 2
    this.baseSpeed = 5.7 + (data.pace / 99) * 2.6
    this.sprinting = false
    this.active = false
    this.stamina = 1
    this.lastTouch = 0
    this.cooldown = 0
    this.homeX = data.x
    this.homeZ = data.z
    this.targetX = data.x
    this.targetZ = data.z
    this.build()
  }

  build() {
    const root = new THREE.Group()
    const body = new THREE.Group()
    root.add(body)
    this.body = body

    const jersey = new THREE.MeshStandardMaterial({
      color: this.isKeeper ? this.team.keeper : this.team.primary,
      roughness: 0.68,
      metalness: 0.02
    })
    const trim = new THREE.MeshStandardMaterial({
      color: this.isKeeper ? this.team.secondary : this.team.secondary,
      roughness: 0.72
    })
    const shortsMat = limbMaterial(this.isKeeper ? this.team.secondary : this.team.shorts)
    const skinMat = limbMaterial(this.data.skin)
    const sockMat = limbMaterial(this.team.primary)

    const upper = new THREE.Mesh(new RoundedBoxGeometry(0.48, 0.58, 0.28, 4, 0.1), jersey)
    upper.position.y = 1.13
    upper.castShadow = true
    body.add(upper)

    const trimBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.29), trim)
    trimBar.position.y = 1.38
    body.add(trimBar)

    const shorts = new THREE.Mesh(new RoundedBoxGeometry(0.43, 0.25, 0.27, 3, 0.07), shortsMat)
    shorts.position.y = 0.79
    shorts.castShadow = true
    body.add(shorts)

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.12, 8), skinMat)
    neck.position.y = 1.47
    body.add(neck)

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 16, 12), skinMat)
    head.position.y = 1.61
    head.scale.set(0.94, 1.06, 0.96)
    head.castShadow = true
    body.add(head)
    this.head = head

    const hairMat = limbMaterial(this.data.hair)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.162, 14, 10), hairMat)
    hair.position.y = 1.65
    hair.scale.set(0.96, 0.64, 1)
    body.add(hair)

    if (this.data.hairStyle === 1) {
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), hairMat)
      top.position.y = 1.73
      top.scale.set(1.1, 0.8, 1.2)
      body.add(top)
    }

    const numberTexture = makeNumberTexture(this.number, this.team.secondary)
    const numberMat = new THREE.MeshBasicMaterial({ map: numberTexture, transparent: true, depthWrite: false })
    const number = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), numberMat)
    number.position.set(0, 1.16, 0.146)
    body.add(number)
    this.numberMesh = number

    this.arms = []
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group()
      pivot.position.set(side * 0.29, 1.36, 0)
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.24, 8), jersey)
      sleeve.position.y = -0.11
      pivot.add(sleeve)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.34, 8), skinMat)
      arm.position.y = -0.36
      arm.castShadow = true
      pivot.add(arm)
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), skinMat)
      hand.position.y = -0.54
      pivot.add(hand)
      body.add(pivot)
      this.arms.push(pivot)
    }

    this.legs = []
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group()
      pivot.position.set(side * 0.13, 0.72, 0)
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.083, 0.07, 0.4, 8), skinMat)
      thigh.position.y = -0.18
      thigh.castShadow = true
      pivot.add(thigh)
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.32, 8), sockMat)
      sock.position.y = -0.51
      sock.castShadow = true
      pivot.add(sock)
      const boot = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.1, 0.3, 3, 0.04), bootMaterial)
      boot.position.set(0, -0.7, 0.07)
      boot.castShadow = true
      pivot.add(boot)
      body.add(pivot)
      this.legs.push(pivot)
    }

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x55e6ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide
    })
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.66, 40), ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.025
    ring.visible = false
    root.add(ring)
    this.ring = ring
    this.ringMat = ringMat

    this.root = root
    this.root.userData.player = this
  }

  setActive(value) {
    this.active = value
    this.ring.visible = value
  }

  setPosition(x, z) {
    this.root.position.set(x, 0, z)
    this.velocity.set(0, 0)
  }

  kick() {
    this.kickTimer = 0.26
  }

  tackle() {
    this.tackleTimer = 0.35
  }

  update(dt, inputX, inputZ, sprint = false) {
    if (this.cooldown > 0) this.cooldown -= dt
    if (this.kickTimer > 0) this.kickTimer -= dt
    if (this.tackleTimer > 0) this.tackleTimer -= dt

    const input = new THREE.Vector2(inputX, inputZ)
    const inputLength = input.length()
    if (inputLength > 1) input.normalize()
    this.desired.copy(input)
    this.sprinting = sprint && inputLength > 0.1

    const speed = this.baseSpeed * (this.sprinting ? 1.28 : 1) * (0.7 + this.stamina * 0.3)
    const target = input.clone().multiplyScalar(speed)
    const accel = inputLength > 0.05 ? 13 : 8
    this.velocity.lerp(target, Math.min(1, dt * accel))

    if (this.velocity.lengthSq() > 0.002) {
      this.root.position.x += this.velocity.x * dt
      this.root.position.z += this.velocity.y * dt
      this.facing.lerp(new THREE.Vector2(this.velocity.x, this.velocity.y).normalize(), Math.min(1, dt * 9))
      if (this.facing.lengthSq() < 0.01) this.facing.set(this.isHome ? 1 : -1, 0)
      this.facing.normalize()
      const yaw = Math.atan2(this.facing.x, this.facing.y)
      this.root.rotation.y = yaw
    }

    const planarSpeed = this.velocity.length()
    const run = THREE.MathUtils.clamp(planarSpeed / 7.4, 0, 1.4)
    this.phase += dt * (3.2 + planarSpeed * 1.35)

    const stride = Math.sin(this.phase) * (0.12 + run * 0.6)
    let left = stride
    let right = -stride
    if (this.kickTimer > 0) {
      const k = 1 - this.kickTimer / 0.26
      right = -1.25 * Math.sin(k * Math.PI)
    }
    if (this.tackleTimer > 0) {
      const k = 1 - this.tackleTimer / 0.35
      left = -1.15 * Math.sin(k * Math.PI)
      this.body.rotation.x = -0.3 * Math.sin(k * Math.PI)
    } else {
      this.body.rotation.x *= 0.8
    }

    this.legs[0].rotation.x = left
    this.legs[1].rotation.x = right
    this.arms[0].rotation.x = -right * 0.7
    this.arms[1].rotation.x = -left * 0.7
    this.arms[0].rotation.z = -0.08
    this.arms[1].rotation.z = 0.08
    this.body.position.y = Math.abs(Math.sin(this.phase * 2)) * run * 0.035
    this.body.rotation.z = Math.sin(this.phase) * run * 0.025

    if (this.ring.visible) {
      const pulse = 1 + Math.sin(this.phase * 0.8) * 0.02
      this.ring.scale.setScalar(pulse)
      this.ringMat.opacity = 0.6 + Math.abs(Math.sin(this.phase * 1.6)) * 0.25
    }
  }

  moveTowards(x, z, dt, { sprint = false, stopDistance = 0.25 } = {}) {
    const dx = x - this.root.position.x
    const dz = z - this.root.position.z
    const distance = Math.hypot(dx, dz)
    if (distance <= stopDistance) {
      this.update(dt, 0, 0, false)
      return true
    }
    this.update(dt, dx / distance, dz / distance, sprint)
    return false
  }

  distanceTo(x, z) {
    return Math.hypot(this.root.position.x - x, this.root.position.z - z)
  }

  get position() {
    return this.root.position
  }

  setColors(team) {
    this.team = team
    this.root.traverse((child) => {
      if (!child.material) return
      if (child.material === this.team) return
    })
  }
}
