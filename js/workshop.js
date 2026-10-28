import * as THREE from 'three'
import { createPhone } from './phone.js'
import {
  makeWoodTexture,
  makeMatTexture,
  makeSignTexture,
  makeEnvTexture,
  makeGlowTexture
} from './textures.js'

export function createWorkshop() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05070d)
  scene.fog = new THREE.FogExp2(0x05070d, 0.016)

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 90)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.id = 'scene'
  document.getElementById('app').prepend(renderer.domElement)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTexture = makeEnvTexture()
  const envMap = pmrem.fromEquirectangular(envTexture).texture
  scene.environment = envMap
  envTexture.dispose()
  pmrem.dispose()

  const hemi = new THREE.HemisphereLight(0x77a6c9, 0x05070a, 0.65)
  scene.add(hemi)

  const key = new THREE.DirectionalLight(0xffe3c2, 2.7)
  key.position.set(4.5, 9.5, 5.2)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -9
  key.shadow.camera.right = 9
  key.shadow.camera.top = 9
  key.shadow.camera.bottom = -9
  key.shadow.camera.near = 1
  key.shadow.camera.far = 30
  key.shadow.bias = -0.0002
  key.shadow.normalBias = 0.025
  scene.add(key)

  const cyanLight = new THREE.SpotLight(0x54c8ff, 230, 32, 0.72, 0.85, 1.8)
  cyanLight.position.set(-6.5, 7.5, -3.5)
  cyanLight.target.position.set(0, 0, 0)
  scene.add(cyanLight, cyanLight.target)

  const magentaLight = new THREE.PointLight(0xff4fd8, 42, 16, 2)
  magentaLight.position.set(5.6, 3.2, 2.2)
  scene.add(magentaLight)

  const ringLight = new THREE.PointLight(0xffe3bd, 55, 11, 2)
  ringLight.position.set(-2.2, 3.7, -0.4)
  scene.add(ringLight)

  const topFill = new THREE.PointLight(0xbfe6ff, 30, 12, 2)
  topFill.position.set(0.5, 5.2, 1.5)
  scene.add(topFill)

  const woodTexture = makeWoodTexture()
  woodTexture.repeat.set(2.4, 2)
  const desk = new THREE.Mesh(
    new THREE.PlaneGeometry(52, 38),
    new THREE.MeshStandardMaterial({ map: woodTexture, color: 0xcbb49c, roughness: 0.7, metalness: 0.06 })
  )
  desk.rotation.x = -Math.PI / 2
  desk.receiveShadow = true
  scene.add(desk)

  const matTexture = makeMatTexture()
  const mat = new THREE.Mesh(
    new THREE.PlaneGeometry(7.6, 10.8),
    new THREE.MeshStandardMaterial({ map: matTexture, transparent: true, roughness: 0.88, metalness: 0.05 })
  )
  mat.rotation.x = -Math.PI / 2
  mat.position.set(0, 0.022, 0.2)
  mat.receiveShadow = true
  scene.add(mat)

  const phone = createPhone()
  phone.group.position.set(0, 0.02, 0)
  scene.add(phone.group)

  const metal = new THREE.MeshStandardMaterial({ color: 0x3a4854, metalness: 0.9, roughness: 0.32 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x111820, roughness: 0.55, metalness: 0.4 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0f13, roughness: 0.88, metalness: 0.05 })
  const brass = new THREE.MeshStandardMaterial({ color: 0xc8a456, metalness: 1, roughness: 0.25 })
  const red = new THREE.MeshStandardMaterial({ color: 0xb8473c, roughness: 0.42, metalness: 0.3 })
  const blue = new THREE.MeshStandardMaterial({ color: 0x2b6d9e, roughness: 0.36, metalness: 0.45 })
  const blackMatte = new THREE.MeshStandardMaterial({ color: 0x0e1216, roughness: 0.72, metalness: 0.15 })

  const tray = new THREE.Group()
  tray.position.set(4.55, 0.075, 1.85)
  tray.rotation.y = -0.22
  scene.add(tray)
  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.12, 1.7), metal)
  trayBase.castShadow = true
  trayBase.receiveShadow = true
  tray.add(trayBase)
  const trayInset = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.04, 1.52), dark)
  trayInset.position.y = 0.075
  tray.add(trayInset)
  const trayGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4),
    new THREE.MeshBasicMaterial({ color: 0x1d4f63, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }))
  trayGlow.rotation.x = -Math.PI / 2
  trayGlow.position.y = 0.098
  tray.add(trayGlow)

  function toolAt(mesh, x, z, rot = 0) {
    mesh.position.set(x, 0.14, z)
    mesh.rotation.y = rot
    mesh.traverse((o) => { if (o.isMesh) o.castShadow = true })
    tray.add(mesh)
  }

  const screwdriver = new THREE.Group()
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.62, 18), blue)
  handle.rotation.z = Math.PI / 2
  handle.position.x = -0.15
  screwdriver.add(handle)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.55, 12), metal)
  shaft.rotation.z = Math.PI / 2
  shaft.position.x = 0.42
  screwdriver.add(shaft)
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.11, 10), brass)
  tip.rotation.z = -Math.PI / 2
  tip.position.x = 0.74
  screwdriver.add(tip)
  toolAt(screwdriver, -0.88, -0.42, 0.15)

  const spudger = new THREE.Group()
  const spudBody = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.055, 0.1), blackMatte)
  spudger.add(spudBody)
  const spudTip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.06), blackMatte)
  spudTip.position.set(0.58, -0.005, 0)
  spudger.add(spudTip)
  toolAt(spudger, 0.15, -0.46, 0.05)

  const tweezers = new THREE.Group()
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.03, 0.05), metal)
    arm.position.z = side * 0.055
    arm.rotation.y = side * 0.05
    tweezers.add(arm)
  }
  const tweezerJoin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), metal)
  tweezerJoin.rotation.z = Math.PI / 2
  tweezerJoin.position.x = -0.4
  tweezers.add(tweezerJoin)
  toolAt(tweezers, 1.02, -0.45, -0.08)

  const suction = new THREE.Group()
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.07, 26), rubber)
  suction.add(cup)
  const cupHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.35, 14), red)
  cupHandle.position.y = 0.2
  suction.add(cupHandle)
  toolAt(suction, -0.2, 0.43, 0)

  const heatGun = new THREE.Group()
  const heatBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.3), red)
  heatGun.add(heatBody)
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.32, 18), metal)
  nozzle.rotation.z = Math.PI / 2
  nozzle.position.x = 0.45
  heatGun.add(nozzle)
  const heatGrip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.22), blackMatte)
  heatGrip.position.set(-0.05, -0.18, 0)
  heatGun.add(heatGrip)
  toolAt(heatGun, 0.95, 0.46, -0.3)

  const dish = new THREE.Group()
  dish.position.set(-4.15, 0.02, 2.1)
  scene.add(dish)
  const dishBase = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.7, 0.09, 40), metal)
  dishBase.castShadow = true
  dish.add(dishBase)
  const dishInner = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.045, 40), dark)
  dishInner.position.y = 0.06
  dish.add(dishInner)
  const dishRim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 8, 48), brass)
  dishRim.rotation.x = Math.PI / 2
  dishRim.position.y = 0.075
  dish.add(dishRim)
  for (let i = 0; i < 3; i++) {
    const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12), brass)
    bit.position.set(-0.2 + i * 0.2, 0.1, 0.1 - i * 0.08)
    bit.rotation.z = Math.PI / 2
    dish.add(bit)
  }

  const lamp = new THREE.Group()
  lamp.position.set(-4.7, 0, -2.0)
  // The lamp is built for reference but kept out of the default camera framing.
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.82, 0.12, 32), dark)
  lampBase.position.y = 0.08
  lampBase.receiveShadow = true
  lamp.add(lampBase)
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 3.9, 14), metal)
  pole.position.y = 2.0
  lamp.add(pole)
  const armStart = new THREE.Vector3(0, 3.75, 0)
  const armEnd = new THREE.Vector3(2.35, 4.05, 0.95)
  const armDir = armEnd.clone().sub(armStart)
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, armDir.length(), 12), metal)
  arm.position.copy(armStart.clone().add(armEnd).multiplyScalar(0.5))
  arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), armDir.clone().normalize())
  lamp.add(arm)
  const head = new THREE.Group()
  head.position.copy(armEnd)
  lamp.add(head)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.075, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0xdfe8ee, emissive: 0xffe4bd, emissiveIntensity: 1.6, roughness: 0.35 }))
  ring.rotation.x = Math.PI / 2
  head.add(ring)
  const lightDisc = new THREE.Mesh(new THREE.CircleGeometry(0.65, 40),
    new THREE.MeshBasicMaterial({ color: 0xffe9c9, transparent: true, opacity: 0.85, toneMapped: false }))
  lightDisc.rotation.x = Math.PI / 2
  lightDisc.position.y = -0.02
  head.add(lightDisc)
  const headLight = new THREE.PointLight(0xffe3b8, 24, 9, 2)
  headLight.position.set(0, -0.2, 0)
  head.add(headLight)

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 20),
    new THREE.MeshStandardMaterial({ color: 0x0a1018, roughness: 0.95, metalness: 0.05 })
  )
  wall.position.set(0, 8, -9.5)
  wall.receiveShadow = true
  scene.add(wall)

  for (let i = -4; i <= 4; i++) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.04, 16, 0.06), dark)
    seam.position.set(i * 4.2, 7, -9.44)
    scene.add(seam)
  }

  const signTexture = makeSignTexture()
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 2.3),
    new THREE.MeshBasicMaterial({ map: signTexture, transparent: true, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false }))
  sign.position.set(0, 6.6, -9.3)
  scene.add(sign)
  const signLight = new THREE.PointLight(0x54dcff, 35, 14, 2)
  signLight.position.set(0, 6.0, -8.2)
  scene.add(signLight)

  const shelf = new THREE.Group()
  shelf.position.set(-7.4, 0, -8.7)
  scene.add(shelf)
  for (let i = 0; i < 3; i++) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 1.0), dark)
    board.position.set(0, 2.1 + i * 1.35, 0)
    board.castShadow = true
    shelf.add(board)
    for (let b = 0; b < 2 + (i % 2); b++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.62), i % 2 ? dark : metal)
      box.position.set(-0.9 + b * 0.85, 2.38 + i * 1.35, 0)
      box.castShadow = true
      box.rotation.y = (b - 1) * 0.12
      shelf.add(box)
    }
  }

  const rightShelf = shelf.clone()
  rightShelf.position.x = 7.6
  rightShelf.scale.x = -1
  scene.add(rightShelf)

  const glowTexture = makeGlowTexture()
  const bokehColors = [0x54dcff, 0xff4fd8, 0xffc37a, 0x6dffb5]
  for (let i = 0; i < 10; i++) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color: bokehColors[i % bokehColors.length],
      transparent: true,
      opacity: 0.1 + (i % 3) * 0.03,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    }))
    sprite.position.set(-13 + (i * 3.1) % 26, 2.5 + (i % 5) * 1.3, -7.5 - (i % 3))
    sprite.scale.setScalar(2.4 + (i % 4))
    scene.add(sprite)
  }

  const dustGeometry = new THREE.BufferGeometry()
  const dustCount = 200
  const dustPositions = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 26
    dustPositions[i * 3 + 1] = Math.random() * 9 + 0.3
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
    color: 0x9fd8ff,
    size: 0.035,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  }))
  scene.add(dust)

  const burstGeometry = new THREE.BufferGeometry()
  const burstCount = 60
  const burstPositions = new Float32Array(burstCount * 3)
  burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3))
  const burstMaterial = new THREE.PointsMaterial({
    color: 0x54e6ff,
    size: 0.09,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  })
  const burst = new THREE.Points(burstGeometry, burstMaterial)
  burst.frustumCulled = false
  burst.visible = false
  scene.add(burst)
  const burstVel = []
  let burstLife = 0
  for (let i = 0; i < burstCount; i++) burstVel.push(new THREE.Vector3())

  function spawnBurst(position, color = 0x54e6ff) {
    burstMaterial.color.set(color)
    burstMaterial.opacity = 1
    burstLife = 1
    burst.visible = true
    const arr = burstGeometry.attributes.position.array
    for (let i = 0; i < burstCount; i++) {
      arr[i * 3] = position.x
      arr[i * 3 + 1] = position.y
      arr[i * 3 + 2] = position.z
      const a = Math.random() * Math.PI * 2
      const b = Math.random() * Math.PI * 0.5
      const speed = 0.6 + Math.random() * 1.8
      burstVel[i].set(
        Math.cos(a) * Math.cos(b) * speed,
        Math.sin(b) * speed + 0.6,
        Math.sin(a) * Math.cos(b) * speed
      )
    }
    burstGeometry.attributes.position.needsUpdate = true
  }

  const rig = {
    theta: 0.42,
    phi: 0.94,
    radius: 15.2,
    target: new THREE.Vector3(-1.25, 1.0, 0.1)
  }
  const goal = {
    theta: 0.42,
    phi: 0.94,
    radius: 15.2,
    target: new THREE.Vector3(-1.25, 1.0, 0.1)
  }
  let mode = 'menu'
  let aspect = window.innerWidth / window.innerHeight
  let timeAcc = 0

  function fitFactor() {
    if (aspect < 0.75) return 1.34
    if (aspect < 1) return 1.18
    if (aspect > 2.1) return 0.92
    return 1
  }

  function setMode(next) {
    mode = next
    if (next === 'menu') {
      goal.theta = aspect < 0.9 ? 0.2 : 0.42
      goal.phi = 0.94
      if (aspect < 0.9) {
        goal.radius = 16.5
        goal.target.set(0, -0.9, 0.1)
      } else {
        goal.radius = 15.2
        goal.target.set(-1.25, 1.0, 0.1)
      }
    } else if (next === 'game') {
      goal.theta = 0
      goal.phi = 0.63
      goal.radius = 10.9 * fitFactor()
      goal.target.set(0, 0.5, 0.18)
    } else if (next === 'results') {
      goal.theta = 0.12
      goal.phi = 0.68
      goal.radius = 11.8 * fitFactor()
      goal.target.set(0, 0.55, 0.1)
    }
  }

  function orbit(dx, dy) {
    if (mode === 'menu') return
    goal.theta = THREE.MathUtils.clamp(goal.theta - dx * 0.005, -0.9, 0.9)
    goal.phi = THREE.MathUtils.clamp(goal.phi - dy * 0.0035, 0.34, 1.18)
  }

  function zoom(delta) {
    if (mode === 'menu') return
    const min = 7.2 * fitFactor()
    const max = 14 * fitFactor()
    goal.radius = THREE.MathUtils.clamp(goal.radius + delta, min, max)
  }

  function resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    aspect = width / height
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    renderer.setSize(width, height)
    if (mode === 'menu') {
      goal.radius = aspect < 0.9 ? 16.5 : 15.2
      goal.target.set(aspect < 0.9 ? 0 : -1.25, aspect < 0.9 ? -0.9 : 1.0, 0.1)
    } else if (mode === 'game') goal.radius = Math.max(goal.radius, 10.9 * fitFactor())
    else goal.radius = 11.8 * fitFactor()
  }

  function update(dt, elapsed) {
    timeAcc += dt
    if (mode === 'menu') {
      goal.theta = (aspect < 0.9 ? 0.2 : 0.42) + Math.sin(elapsed * 0.16) * (aspect < 0.9 ? 0.07 : 0.18)
      goal.phi = 0.94 + Math.sin(elapsed * 0.11) * 0.022
    }

    const damp = Math.min(1, dt * 3.2)
    rig.theta += (goal.theta - rig.theta) * damp
    rig.phi += (goal.phi - rig.phi) * damp
    rig.radius += (goal.radius - rig.radius) * damp
    rig.target.lerp(goal.target, Math.min(1, dt * 2.6))

    const sinPhi = Math.sin(rig.phi)
    camera.position.set(
      rig.target.x + rig.radius * sinPhi * Math.sin(rig.theta),
      rig.target.y + rig.radius * Math.cos(rig.phi),
      rig.target.z + rig.radius * sinPhi * Math.cos(rig.theta)
    )
    camera.lookAt(rig.target)

    phone.update(dt, elapsed)

    dust.rotation.y += dt * 0.006
    dust.position.y = Math.sin(elapsed * 0.2) * 0.05

    if (burstLife > 0) {
      burstLife -= dt * 0.9
      const arr = burstGeometry.attributes.position.array
      for (let i = 0; i < burstCount; i++) {
        arr[i * 3] += burstVel[i].x * dt
        arr[i * 3 + 1] += burstVel[i].y * dt
        arr[i * 3 + 2] += burstVel[i].z * dt
        burstVel[i].y -= dt * 2.2
        burstVel[i].multiplyScalar(1 - dt * 0.8)
      }
      burstGeometry.attributes.position.needsUpdate = true
      burstMaterial.opacity = Math.max(0, burstLife)
      if (burstLife <= 0) burst.visible = false
    }

    ringLight.intensity = 55 + Math.sin(elapsed * 1.7) * 1.5
    magentaLight.intensity = 42 + Math.sin(elapsed * 0.9) * 3
    signLight.intensity = 35 + Math.sin(elapsed * 0.6) * 2
  }

  window.addEventListener('resize', resize)
  setMode('menu')

  return {
    scene,
    camera,
    renderer,
    phone,
    setMode,
    orbit,
    zoom,
    resize,
    update,
    spawnBurst,
    get mode() { return mode },
    get aspect() { return aspect }
  }
}
