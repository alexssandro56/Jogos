import * as THREE from 'three'
import { ballTexture } from './textures.js'

export class Ball {
  constructor(scene) {
    this.radius = 0.26
    this.position = new THREE.Vector3(0, this.radius, 0)
    this.velocity = new THREE.Vector3()
    this.spin = new THREE.Vector3()
    this.owner = null
    this.lastTouch = null
    this.outTimer = 0
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 28, 20),
      new THREE.MeshStandardMaterial({
        map: ballTexture(),
        roughness: 0.55,
        metalness: 0.02,
        emissive: 0x101820,
        emissiveIntensity: 0.12
      })
    )
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    scene.add(this.mesh)

    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(this.radius * 1.5, 20),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.24,
        depthWrite: false
      })
    )
    this.shadow.rotation.x = -Math.PI / 2
    scene.add(this.shadow)

    this.trailPoints = []
    this.trail = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x9fefff, transparent: true, opacity: 0.22 })
    )
    this.trail.frustumCulled = false
    scene.add(this.trail)

    this.kickFlash = new THREE.Mesh(
      new THREE.RingGeometry(this.radius * 0.9, this.radius * 1.25, 24),
      new THREE.MeshBasicMaterial({
        color: 0x9fefff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false
      })
    )
    this.kickFlash.rotation.x = -Math.PI / 2
    scene.add(this.kickFlash)
    this.flash = 0

    this.syncMesh()
  }

  reset(x = 0, z = 0, y = this.radius) {
    this.owner = null
    this.lastTouch = null
    this.position.set(x, y, z)
    this.velocity.set(0, 0, 0)
    this.spin.set(0, 0, 0)
    this.outTimer = 0
    this.syncMesh()
  }

  kick(direction, power, loft = 0, spin = new THREE.Vector3()) {
    this.owner = null
    this.velocity.set(direction.x * power, Math.max(0, loft), direction.y * power)
    this.spin.copy(spin)
    this.position.y = Math.max(this.position.y, this.radius + 0.02)
    this.flash = 0.5
    this.syncMesh()
  }

  step(dt) {
    if (this.owner) {
      this.syncMesh()
      return
    }

    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2.4)

    const speed = this.velocity.length()
    if (speed > 0.25) {
      const drag = this.velocity.clone().multiplyScalar(-0.0075 * speed)
      this.velocity.addScaledVector(drag, dt)
      if (speed > 1 && this.spin.lengthSq() > 1) {
        const magnus = new THREE.Vector3().crossVectors(this.spin, this.velocity).multiplyScalar(0.0034)
        this.velocity.addScaledVector(magnus, dt)
      }
    }

    this.velocity.y -= 13.5 * dt
    this.position.addScaledVector(this.velocity, dt)

    if (this.position.y <= this.radius) {
      this.position.y = this.radius
      if (this.velocity.y < -0.4) {
        this.velocity.y *= -0.52
        this.velocity.x *= 0.86
        this.velocity.z *= 0.86
        this.spin.multiplyScalar(0.78)
        if (Math.abs(this.velocity.y) < 1.2) this.velocity.y = 0
      } else {
        this.velocity.y = 0
      }
      const roll = Math.exp(-1.25 * dt)
      this.velocity.x *= roll
      this.velocity.z *= roll
      this.spin.multiplyScalar(Math.exp(-0.85 * dt))
      if (Math.hypot(this.velocity.x, this.velocity.z) < 0.08) {
        this.velocity.x = 0
        this.velocity.z = 0
      }
    }

    const angularSpeed = this.spin.length()
    if (angularSpeed > 0.05) {
      const axis = this.spin.clone().normalize()
      const quat = new THREE.Quaternion().setFromAxisAngle(axis, angularSpeed * dt)
      this.mesh.quaternion.premultiply(quat)
    }

    const horizontal = Math.hypot(this.velocity.x, this.velocity.z)
    if (horizontal > 0.2 && this.position.y < this.radius + 0.1) {
      const axis = new THREE.Vector3(this.velocity.z, 0, -this.velocity.x).normalize()
      const quat = new THREE.Quaternion().setFromAxisAngle(axis, (horizontal / this.radius) * dt)
      this.mesh.quaternion.premultiply(quat)
    }

    this.syncMesh()

    if (horizontal > 10 || this.velocity.y > 4) {
      this.trailPoints.push(this.position.clone())
      if (this.trailPoints.length > 12) this.trailPoints.shift()
    } else if (this.trailPoints.length) {
      this.trailPoints.shift()
    }

    const trailGeometry = this.trail.geometry
    trailGeometry.setFromPoints(this.trailPoints)
    this.trail.material.opacity = Math.min(0.22, this.trailPoints.length * 0.018)
  }

  syncMesh() {
    this.mesh.position.copy(this.position)
    this.shadow.position.set(this.position.x, 0.03, this.position.z)
    const height = Math.max(0, this.position.y - this.radius)
    const scale = 1 / (1 + height * 0.28)
    this.shadow.scale.setScalar(scale)
    this.shadow.material.opacity = 0.26 * scale
    this.kickFlash.position.set(this.position.x, 0.05, this.position.z)
    this.kickFlash.material.opacity = this.flash * 0.5
    this.kickFlash.scale.setScalar(1 + (0.5 - this.flash) * 2.2)
  }
}
