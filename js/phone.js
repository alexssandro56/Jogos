import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  makeWallpaper,
  makeCrackTexture,
  makeBatteryLabel,
  makePcbTexture,
  makeScrewTexture,
  makeGlowTexture
} from './textures.js'

const W = 3.2
const L = 6.24
const FRAME_H = 0.38
const FRAME_TOP = 0.41

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function rounded(w, h, d, r, segments = 4) {
  return new RoundedBoxGeometry(w, h, d, segments, r)
}

export function createPhone({ accent = 0x54e6ff } = {}) {
  const phone = new THREE.Group()
  const tweens = []
  const glowTexture = makeGlowTexture()
  const screwTexture = makeScrewTexture()
  const pcbTexture = makePcbTexture()
  const crackTexture = makeCrackTexture()
  const oldLabel = makeBatteryLabel(false)
  const newLabel = makeBatteryLabel(true)

  function addTween(duration, update, { delay = 0, ease = easeOut } = {}) {
    return new Promise((resolve) => {
      tweens.push({ t: -delay, duration, update, ease, resolve })
    })
  }

  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x24456f,
    metalness: 0.88,
    roughness: 0.26,
    clearcoat: 0.6,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25
  })
  const railMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9fb6c8,
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 1.5
  })
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x596873, metalness: 0.85, roughness: 0.32 })
  const plastic = new THREE.MeshStandardMaterial({ color: 0x0c1116, roughness: 0.52, metalness: 0.2 })
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: pcbTexture,
    roughness: 0.62,
    metalness: 0.25
  })
  const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xb9c6cf, metalness: 0.95, roughness: 0.22 })
  const orangeFlex = new THREE.MeshStandardMaterial({
    color: 0xe8892c,
    roughness: 0.48,
    metalness: 0.1,
    emissive: 0x5c2100,
    emissiveIntensity: 0.25
  })
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c46a,
    metalness: 1,
    roughness: 0.18,
    emissive: 0x3c2400,
    emissiveIntensity: 0.15
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.04,
    transparent: true,
    opacity: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.0,
    depthWrite: false
  })
  const displayMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: null,
    emissive: 0xffffff,
    emissiveMap: null,
    emissiveIntensity: 0.34,
    roughness: 0.42,
    metalness: 0
  })
  const crackMaterial = new THREE.MeshBasicMaterial({
    map: crackTexture,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    toneMapped: false
  })
  const markerMaterials = []
  const accentColor = new THREE.Color(accent)

  const frame = new THREE.Mesh(rounded(W, FRAME_H, L, 0.24, 7), frameMaterial)
  frame.position.y = 0.22
  frame.castShadow = true
  frame.receiveShadow = true
  phone.add(frame)

  const railGeo = rounded(0.075, 0.34, L - 0.14, 0.035, 3)
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(railGeo, railMaterial)
    rail.position.set(side * (W / 2 - 0.025), 0.22, 0)
    rail.castShadow = true
    phone.add(rail)
  }

  const inset = new THREE.Mesh(rounded(W - 0.18, 0.04, L - 0.18, 0.22, 5), plastic)
  inset.position.y = FRAME_TOP
  phone.add(inset)

  for (const [x, z, h] of [
    [-W / 2 - 0.015, -1.2, 0.62],
    [-W / 2 - 0.015, -1.95, 0.62],
    [W / 2 + 0.015, -1.45, 0.86]
  ]) {
    const button = new THREE.Mesh(rounded(0.055, 0.09, h, 0.025, 2), railMaterial)
    button.position.set(x, 0.25, z)
    button.castShadow = true
    phone.add(button)
  }

  const port = new THREE.Mesh(rounded(0.62, 0.1, 0.08, 0.035, 2), darkMetal)
  port.position.set(0, 0.1, L / 2 - 0.01)
  phone.add(port)
  const portHole = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.02), new THREE.MeshBasicMaterial({ color: 0x030508 }))
  portHole.position.set(0, 0.1, L / 2 + 0.04)
  phone.add(portHole)

  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.012, 8), plastic)
      dot.position.set(side * (0.9 + i * 0.075), 0.405, L / 2 - 0.055)
      phone.add(dot)
    }
  }

  const screenGroup = new THREE.Group()
  phone.add(screenGroup)

  const screenSkirt = new THREE.Mesh(rounded(2.99, 0.07, 6.11, 0.2, 5), darkMetal)
  screenSkirt.position.y = 0.445
  screenSkirt.castShadow = true
  screenGroup.add(screenSkirt)

  const screenBack = new THREE.Mesh(rounded(3.0, 0.055, 6.12, 0.2, 5), plastic)
  screenBack.position.y = 0.485
  screenBack.castShadow = true
  screenGroup.add(screenBack)

  const bezel = new THREE.Mesh(rounded(2.98, 0.03, 6.1, 0.19, 5),
    new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.32, metalness: 0.4 }))
  bezel.position.y = 0.517
  screenGroup.add(bezel)

  const display = new THREE.Mesh(new THREE.PlaneGeometry(2.66, 5.78), displayMaterial)
  display.rotation.x = -Math.PI / 2
  display.position.y = 0.537
  screenGroup.add(display)

  const glass = new THREE.Mesh(rounded(2.94, 0.03, 6.07, 0.18, 5), glassMaterial)
  glass.position.y = 0.555
  screenGroup.add(glass)

  const crack = new THREE.Mesh(new THREE.PlaneGeometry(2.84, 5.98), crackMaterial)
  crack.rotation.x = -Math.PI / 2
  crack.position.y = 0.573
  crack.renderOrder = 2
  crack.visible = false
  screenGroup.add(crack)

  const cameraRing = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.014, 10, 28), darkMetal)
  cameraRing.rotation.x = -Math.PI / 2
  cameraRing.position.set(0.62, 0.575, -2.52)
  screenGroup.add(cameraRing)
  const cameraLens = new THREE.Mesh(new THREE.CircleGeometry(0.062, 24),
    new THREE.MeshPhysicalMaterial({ color: 0x060b16, metalness: 0.6, roughness: 0.05, clearcoat: 1 }))
  cameraLens.rotation.x = -Math.PI / 2
  cameraLens.position.set(0.62, 0.576, -2.52)
  screenGroup.add(cameraLens)

  const earpiece = new THREE.Mesh(rounded(0.7, 0.012, 0.07, 0.03, 2), new THREE.MeshBasicMaterial({ color: 0x030507 }))
  earpiece.position.set(0, 0.577, -2.83)
  screenGroup.add(earpiece)

  const heatMaterial = new THREE.MeshBasicMaterial({
    color: 0x6fe7ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  })
  const heatGroup = new THREE.Group()
  const heatPieces = [
    [2.94, 0.07, 0.05, 0.07, -3.0],
    [2.94, 0.07, 0.05, 0.07, 3.0],
    [0.05, 0.07, 5.95, -1.465, 0],
    [0.05, 0.07, 5.95, 1.465, 0]
  ]
  for (const [w, h, d, x, z] of heatPieces) {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), heatMaterial)
    piece.position.set(x, 0.587, z)
    heatGroup.add(piece)
  }
  heatGroup.visible = false
  screenGroup.add(heatGroup)

  const interior = new THREE.Group()
  phone.add(interior)

  const plate = new THREE.Mesh(rounded(2.9, 0.035, 5.94, 0.2, 5),
    new THREE.MeshStandardMaterial({ color: 0x1a2228, roughness: 0.58, metalness: 0.35 }))
  plate.position.y = FRAME_TOP - 0.005
  interior.add(plate)

  const board = new THREE.Mesh(rounded(2.55, 0.055, 2.08, 0.06, 2), boardMaterial)
  board.position.set(0, 0.44, -1.34)
  board.castShadow = true
  interior.add(board)

  const shieldGeo = rounded(1.16, 0.055, 0.88, 0.04, 2)
  for (const [x, z, w] of [[-0.55, -1.6, 1], [0.73, -1.12, 0.82]]) {
    const shield = new THREE.Mesh(shieldGeo, shieldMaterial)
    shield.scale.x = w
    shield.position.set(x, 0.463, z)
    interior.add(shield)
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.9 * w, 0.008, 0.05), darkMetal)
    ridge.position.set(x, 0.486, z)
    interior.add(ridge)
  }

  const chipGeo = new THREE.BoxGeometry(0.32, 0.045, 0.32)
  for (const [x, z, s] of [[-0.95, -0.95, 1], [-0.6, -0.66, 0.72], [1.0, -1.85, 0.82], [0.35, -0.72, 0.54]]) {
    const chip = new THREE.Mesh(chipGeo, plastic)
    chip.scale.set(s, 1, s)
    chip.position.set(x, 0.46, z)
    interior.add(chip)
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.2 * s, 0.009, 0.2 * s), darkMetal)
    top.position.set(x, 0.482, z)
    interior.add(top)
  }

  const camModule = new THREE.Mesh(rounded(0.98, 0.11, 0.64, 0.06, 2), plastic)
  camModule.position.set(0, 0.448, -2.34)
  interior.add(camModule)
  for (let i = 0; i < 3; i++) {
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.022, 10, 26), darkMetal)
    lensRing.rotation.x = -Math.PI / 2
    lensRing.position.set(-0.31 + i * 0.31, 0.49, -2.5 + (i === 1 ? 0.12 : 0))
    interior.add(lensRing)
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.105, 24),
      new THREE.MeshPhysicalMaterial({ color: 0x071324, metalness: 0.7, roughness: 0.04, clearcoat: 1, envMapIntensity: 2 }))
    lens.rotation.x = -Math.PI / 2
    lens.position.set(-0.31 + i * 0.31, 0.491, -2.5 + (i === 1 ? 0.12 : 0))
    interior.add(lens)
  }

  const speaker = new THREE.Mesh(rounded(1.72, 0.06, 0.24, 0.05, 2), darkMetal)
  speaker.position.set(0, 0.43, -2.85)
  interior.add(speaker)
  for (let i = 0; i < 10; i++) {
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 8), plastic)
    hole.position.set(-0.62 + i * 0.138, 0.458, -2.85)
    interior.add(hole)
  }

  const motor = new THREE.Mesh(rounded(0.62, 0.11, 0.42, 0.08, 3), darkMetal)
  motor.position.set(-0.92, 0.43, 2.55)
  interior.add(motor)
  const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.018, 22), plastic)
  motorCap.position.set(-0.92, 0.49, 2.55)
  interior.add(motorCap)

  const chargeBoard = new THREE.Mesh(rounded(0.7, 0.035, 0.5, 0.04, 2), boardMaterial)
  chargeBoard.position.set(0.35, 0.43, 2.72)
  interior.add(chargeBoard)
  const chargePort = new THREE.Mesh(rounded(0.42, 0.08, 0.17, 0.035, 2), darkMetal)
  chargePort.position.set(0.35, 0.46, 2.9)
  interior.add(chargePort)

  function makeBattery(labelTexture, fresh) {
    const group = new THREE.Group()
    const body = new THREE.Mesh(rounded(2.45, 0.14, 2.5, 0.14, 4),
      new THREE.MeshStandardMaterial({
        color: fresh ? 0x1b3a31 : 0x242b30,
        roughness: 0.45,
        metalness: 0.45,
        emissive: fresh ? 0x0b3a2b : 0x000000,
        emissiveIntensity: fresh ? 0.5 : 0
      }))
    body.castShadow = true
    group.add(body)
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.16, 2.16),
      new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.62, metalness: 0.15, transparent: true }))
    label.rotation.x = -Math.PI / 2
    label.position.y = 0.071
    group.add(label)
    const pullTab = new THREE.Mesh(rounded(0.62, 0.012, 0.28, 0.03, 2),
      new THREE.MeshStandardMaterial({ color: fresh ? 0x2ee6a6 : 0xd77a2c, roughness: 0.7 }))
    pullTab.position.set(0.78, 0.075, -1.06)
    group.add(pullTab)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.02, 0.09),
      new THREE.MeshStandardMaterial({ color: fresh ? 0x2ee6a6 : 0xe8892c, roughness: 0.5 }))
    strip.position.set(0, 0.064, 1.2)
    group.add(strip)
    return group
  }

  const oldBattery = makeBattery(oldLabel, false)
  oldBattery.position.set(0, 0.43, 0.94)
  interior.add(oldBattery)
  const newBattery = makeBattery(newLabel, true)
  newBattery.position.set(0, 0.43, 0.94)
  newBattery.visible = false
  interior.add(newBattery)

  function makeFlex(width, length, connectorZ) {
    const group = new THREE.Group()
    group.position.set(0, 0.445, 0)

    const connector = new THREE.Mesh(rounded(width, 0.035, 0.38, 0.035, 2), orangeFlex)
    connector.position.set(0, 0.015, connectorZ)
    group.add(connector)
    const cap = new THREE.Mesh(rounded(width + 0.06, 0.025, 0.16, 0.025, 2), darkMetal)
    cap.position.set(0, 0.04, connectorZ - 0.08)
    group.add(cap)
    for (let i = 0; i < 6; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.008, 0.055), goldMaterial)
      pin.position.set(-width / 2 + 0.09 + i * ((width - 0.18) / 5), 0.066, connectorZ - 0.09)
      group.add(pin)
    }
    const ribbon = new THREE.Mesh(rounded(width * 0.8, 0.02, length, 0.02, 2), orangeFlex)
    ribbon.position.set(0, 0.005, connectorZ + length / 2 + 0.1)
    group.add(ribbon)
    return group
  }

  const batteryFlex = makeFlex(0.64, 0.5, -0.3)
  batteryFlex.position.x = -0.55
  interior.add(batteryFlex)

  const displayFlex = makeFlex(0.58, 0.78, -1.88)
  displayFlex.position.x = 0.62
  interior.add(displayFlex)

  const screwHome = [
    new THREE.Vector3(-1.52, 0.43, 2.58),
    new THREE.Vector3(1.52, 0.43, 2.58)
  ]
  const screws = []
  for (let i = 0; i < 2; i++) {
    const screw = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.065, 0.05, 18), railMaterial)
    screw.add(shaft)
    const head = new THREE.Mesh(new THREE.CircleGeometry(0.062, 24),
      new THREE.MeshStandardMaterial({ map: screwTexture, metalness: 0.8, roughness: 0.3 }))
    head.rotation.x = -Math.PI / 2
    head.position.y = 0.027
    screw.add(head)
    screw.position.copy(screwHome[i])
    phone.add(screw)
    screws.push(screw)
  }

  const hitMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false
  })
  const hitboxes = []

  function addHit(part, geometry, position, parent = interior, extra = {}) {
    const hit = new THREE.Mesh(geometry, hitMaterial)
    hit.position.copy(position)
    hit.userData.part = part
    hit.userData.active = false
    Object.assign(hit.userData, extra)
    parent.add(hit)
    hitboxes.push(hit)
    return hit
  }

  addHit('screen', new THREE.BoxGeometry(2.95, 0.3, 6.05), new THREE.Vector3(0, 0.56, 0), screenGroup)
  addHit('screw', new THREE.CylinderGeometry(0.22, 0.22, 0.32, 12), screwHome[0].clone().add(new THREE.Vector3(0, 0.03, 0)), phone, { index: 0 })
  addHit('screw', new THREE.CylinderGeometry(0.22, 0.22, 0.32, 12), screwHome[1].clone().add(new THREE.Vector3(0, 0.03, 0)), phone, { index: 1 })
  addHit('batteryFlex', new THREE.BoxGeometry(0.95, 0.26, 0.75), new THREE.Vector3(-0.55, 0.48, -0.3))
  addHit('displayFlex', new THREE.BoxGeometry(0.95, 0.26, 0.9), new THREE.Vector3(0.62, 0.48, -1.78))
  addHit('battery', new THREE.BoxGeometry(2.62, 0.24, 2.72), new THREE.Vector3(0, 0.43, 0.94))

  const screwMarkers = new THREE.Group()
  screwMarkers.visible = false
  phone.add(screwMarkers)

  function buildMarker(size, ringColor, glowSize) {
    const group = new THREE.Group()
    const ringMat = new THREE.MeshBasicMaterial({
      color: ringColor,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
    const innerMat = ringMat.clone()
    innerMat.opacity = 0.28
    markerMaterials.push(ringMat, innerMat)

    const ring = new THREE.Mesh(new THREE.RingGeometry(size * 0.76, size, 48), ringMat)
    ring.rotation.x = -Math.PI / 2
    group.add(ring)
    const inner = new THREE.Mesh(new THREE.RingGeometry(size * 0.42, size * 0.5, 40), innerMat)
    inner.rotation.x = -Math.PI / 2
    inner.position.y = 0.005
    group.add(inner)

    const glowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: ringColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
    markerMaterials.push(glowMat)
    const glow = new THREE.Sprite(glowMat)
    glow.scale.setScalar(glowSize)
    glow.position.y = 0.03
    group.add(glow)
    return { group, ringMat, innerMat, glowMat, ring, inner, glow }
  }

  const marker = buildMarker(0.28, accent, 1.5)
  marker.group.visible = false
  phone.add(marker.group)

  const diamondMaterial = new THREE.MeshBasicMaterial({
    color: accent,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  })
  markerMaterials.push(diamondMaterial)
  const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), diamondMaterial)
  diamond.position.y = 0.62
  marker.group.add(diamond)

  const screwMarkerPairs = screwHome.map((home, i) => {
    const m = buildMarker(0.18, accent, 0.72)
    m.group.position.set(home.x, 0.6, home.z)
    m.group.userData.index = i
    screwMarkers.add(m.group)
    return m
  })

  let wallpaperTexture = null
  let markerKind = 'screen'
  let markerOnScreen = false
  let hoverBoost = 0
  let hoverTarget = 0
  let heatValue = 0
  let shakeTime = 0
  let booting = false
  let screenLifted = false
  let screenPower = 0.34

  function disposeWallpaper() {
    if (wallpaperTexture) wallpaperTexture.dispose()
    wallpaperTexture = null
  }

  function applyWallpaper(job) {
    disposeWallpaper()
    wallpaperTexture = makeWallpaper(job.wallpaperA, job.wallpaperB, job.device)
    displayMaterial.map = wallpaperTexture
    displayMaterial.emissiveMap = wallpaperTexture
    displayMaterial.needsUpdate = true
  }

  function setAccent(value) {
    accentColor.set(value)
    for (const mat of markerMaterials) mat.color.copy(accentColor)
    heatMaterial.color.copy(accentColor)
  }

  function setPalette(job) {
    frameMaterial.color.set(job.frame)
    applyWallpaper(job)
    setAccent(job.accent)
    railMaterial.color.set(job.rail || 0xa9bfd0)
  }

  function setMarker(kind, onScreen = false) {
    markerKind = kind
    markerOnScreen = onScreen
    marker.group.visible = false
    screwMarkers.visible = false
    if (kind === 'screw') {
      screwMarkers.visible = true
      return
    }
    let parent = phone
    let pos = new THREE.Vector3(0, 0.62, 0)
    if (kind === 'displayFlex') pos.set(0.62, 0.66, -1.78)
    if (kind === 'batteryFlex') pos.set(-0.55, 0.66, -0.3)
    if (kind === 'battery') pos.set(0, 0.72, 0.94)
    if (kind === 'screen' && onScreen) parent = screenGroup
    marker.group.visible = true
    parent.add(marker.group)
    marker.group.position.copy(pos)
  }

  function hideMarker() {
    marker.group.visible = false
    screwMarkers.visible = false
  }

  function setScrewMarkerVisible(index, visible) {
    if (screwMarkerPairs[index]) screwMarkerPairs[index].group.visible = visible
  }

  function setActiveParts(parts) {
    const set = new Set(parts)
    for (const hit of hitboxes) hit.userData.active = set.has(hit.userData.part)
  }

  function getActiveHitboxes() {
    return hitboxes.filter((hit) => hit.userData.active)
  }

  function setHeat(value) {
    heatValue = clamp01(value)
    heatGroup.visible = heatValue > 0.001
    heatMaterial.opacity = heatValue * 0.75
    heatMaterial.color.copy(new THREE.Color(0x6fe7ff)).lerp(new THREE.Color(0xff7a35), heatValue)
    if (booting) return
    displayMaterial.emissiveIntensity = screenPower + heatValue * 0.22
  }

  function liftScreen() {
    screenLifted = true
    return addTween(900, (k) => {
      screenGroup.position.set(0, 1.52 * k, -1.0 * k)
      screenGroup.rotation.x = -0.42 * k
      screenGroup.rotation.z = 0.07 * k
    }, { ease: easeInOut })
  }

  function installScreen() {
    screenLifted = false
    crack.visible = false
    displayFlex.position.set(0.62, 0.445, 0)
    displayFlex.rotation.set(0, 0, 0)
    return addTween(850, (k) => {
      screenGroup.position.set(0, 1.52 * (1 - k), -1.0 * (1 - k))
      screenGroup.rotation.x = -0.42 * (1 - k)
      screenGroup.rotation.z = 0.07 * (1 - k)
    }, { ease: easeInOut }).then(() => {
      const flash = new THREE.PointLight(0x9fe8ff, 0, 3.2)
      flash.position.set(0, 1.2, 0)
      phone.add(flash)
      let t = 0
      addTween(500, (k) => {
        t = k
        flash.intensity = Math.sin(k * Math.PI) * 10
      }).then(() => phone.remove(flash))
    })
  }

  function unscrew(index, install = false) {
    const screw = screws[index]
    const home = screwHome[index]
    if (install) {
      screw.visible = true
      screw.position.set(home.x, home.y + 1.15, home.z)
      screw.rotation.set(0, 0, 0)
      screw.scale.setScalar(1)
      return addTween(520, (k) => {
        screw.position.y = home.y + 1.15 * (1 - k)
        screw.rotation.y = Math.PI * 4 * k
        screw.rotation.z = Math.sin(k * Math.PI) * 0.15
      }).then(() => {
        screw.position.copy(home)
        screw.rotation.set(0, 0, 0)
      })
    }
    return addTween(520, (k) => {
      screw.position.set(home.x - 0.4 * k, home.y + 0.7 * k, home.z + 0.5 * k)
      screw.rotation.y = Math.PI * 7 * k
      screw.rotation.z = k * 0.6
      screw.scale.setScalar(1 - 0.3 * k)
    }).then(() => { screw.visible = false })
  }

  function animateFlex(group, disconnect) {
    if (disconnect) {
      return addTween(360, (k) => {
        group.rotation.x = -0.5 * k
        group.position.y = 0.445 + 0.11 * k
        group.scale.set(1, 1, 1 - 0.04 * k)
      })
    }
    return addTween(320, (k) => {
      group.rotation.x = -0.5 * (1 - k)
      group.position.y = 0.445 + 0.11 * (1 - k)
      group.scale.set(1, 1, 1 - 0.04 * (1 - k))
    })
  }

  function removeBattery() {
    return addTween(820, (k) => {
      oldBattery.position.set(5.6 * k, 0.43 + 1.0 * k, 0.94 + 0.4 * k)
      oldBattery.rotation.z = 0.55 * k
      oldBattery.rotation.y = 0.4 * k
      oldBattery.scale.setScalar(1 - 0.18 * k)
    }, { ease: easeInOut }).then(() => { oldBattery.visible = false })
  }

  function installBattery() {
    newBattery.visible = true
    newBattery.position.set(5.4, 1.0, 0.94)
    newBattery.rotation.set(0, -0.4, 0.4)
    return addTween(850, (k) => {
      newBattery.position.set(5.4 * (1 - k), 0.43 + 0.57 * (1 - k) * (1 - k), 0.94)
      newBattery.rotation.z = 0.4 * (1 - k)
      newBattery.rotation.y = -0.4 * (1 - k)
    }, { ease: easeOut }).then(() => {
      newBattery.position.set(0, 0.43, 0.94)
      newBattery.rotation.set(0, 0, 0)
    })
  }

  function screenBoot() {
    booting = true
    screenPower = 0.88
    return addTween(1400, (k) => {
      displayMaterial.emissiveIntensity = 0.34 + 0.65 * Math.min(1, k * 1.35) + Math.sin(k * Math.PI * 3) * 0.06
      if (k > 0.6) heatValue = Math.max(0, heatValue - 0.02)
    }, { ease: easeOut }).then(() => {
      displayMaterial.emissiveIntensity = 0.88
      booting = false
    })
  }

  function jolt() {
    shakeTime = 0.5
  }

  function reset(job) {
    tweens.length = 0
    screenLifted = false
    booting = false
    screenPower = 0.34
    displayMaterial.emissiveIntensity = 0.34
    screenGroup.position.set(0, 0, 0)
    screenGroup.rotation.set(0, 0, 0)
    crack.visible = job.symptom === 'screen'
    crackMaterial.opacity = 0.92
    for (let i = 0; i < screws.length; i++) {
      screws[i].visible = true
      screws[i].position.copy(screwHome[i])
      screws[i].rotation.set(0, 0, 0)
      screws[i].scale.setScalar(1)
    }
    oldBattery.visible = true
    oldBattery.position.set(0, 0.43, 0.94)
    oldBattery.rotation.set(0, 0, 0)
    oldBattery.scale.set(1, job.symptom === 'battery' ? 1.22 : 1, 1)
    newBattery.visible = false
    newBattery.position.set(0, 0.43, 0.94)
    newBattery.rotation.set(0, 0, 0)
    batteryFlex.rotation.set(0, 0, 0)
    batteryFlex.position.set(-0.55, 0.445, 0)
    displayFlex.rotation.set(0, 0, 0)
    displayFlex.position.set(0.62, 0.445, 0)
    heatValue = 0
    heatGroup.visible = false
    heatMaterial.opacity = 0
    hoverBoost = 0
    hoverTarget = 0
    shakeTime = 0
    phone.position.set(0, 0, 0)
    hideMarker()
    setActiveParts([])
    setPalette(job)
  }

  function getStepWorldPosition() {
    if (markerKind === 'screw') {
      return screwMarkerPairs[0].group.getWorldPosition(new THREE.Vector3())
    }
    if (markerKind === 'battery' && !oldBattery.visible) {
      return newBattery.getWorldPosition(new THREE.Vector3())
    }
    return marker.group.getWorldPosition(new THREE.Vector3())
  }

  function update(dt, time) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i]
      tw.t += dt
      if (tw.t < 0) continue
      const k = Math.min(1, tw.t / (tw.duration / 1000))
      tw.update(tw.ease(k))
      if (k >= 1) {
        tweens.splice(i, 1)
        tw.resolve()
      }
    }

    if (marker.group.visible) {
      const pulse = 1 + Math.sin(time * 3.4) * 0.06 + hoverBoost * 0.16
      marker.ring.scale.setScalar(pulse)
      marker.inner.scale.setScalar(1 + Math.sin(time * 3.4 + 1.1) * 0.1)
      marker.ringMat.opacity = 0.55 + hoverBoost * 0.35 + Math.sin(time * 3) * 0.1
      marker.innerMat.opacity = 0.2 + hoverBoost * 0.25
      marker.glowMat.opacity = 0.24 + hoverBoost * 0.2 + Math.sin(time * 2.2) * 0.05
      marker.ring.rotation.z = time * 0.35
      diamond.position.y = 0.62 + Math.sin(time * 2.4) * 0.06
      diamond.rotation.y = time * 1.4
      diamond.rotation.x = time * 0.7
    }
    if (screwMarkers.visible) {
      for (const m of screwMarkerPairs) {
        const pulse = 1 + Math.sin(time * 3.6 + m.group.userData.index) * 0.07 + hoverBoost * 0.15
        m.group.scale.setScalar(pulse)
        m.ringMat.opacity = 0.55 + hoverBoost * 0.3 + Math.sin(time * 3.2) * 0.1
        m.glowMat.opacity = 0.24 + hoverBoost * 0.2
        m.ring.rotation.z = time * 0.4
      }
    }
    hoverBoost += (hoverTarget - hoverBoost) * Math.min(1, dt * 10)

    if (shakeTime > 0) {
      shakeTime = Math.max(0, shakeTime - dt)
      const decay = shakeTime / 0.5
      phone.position.x = Math.sin(time * 90) * 0.035 * decay
      phone.position.z = Math.cos(time * 73) * 0.025 * decay
      if (shakeTime === 0) phone.position.set(0, 0, 0)
    }

    if (heatValue > 0) {
      heatGroup.visible = true
      heatMaterial.opacity = (0.3 + Math.sin(time * 18) * 0.12) * heatValue
    }

    if (!booting) {
      const flicker = screenLifted ? 0.22 : 0.34
      displayMaterial.emissiveIntensity += (flicker - displayMaterial.emissiveIntensity) * Math.min(1, dt * 3)
    }
  }

  setPalette({
    frame: 0x24456f,
    rail: 0xa9bfd0,
    wallpaperA: '#0a2d5c',
    wallpaperB: '#37b6f0',
    device: 'AURORA X',
    accent: 0x54e6ff
  })

  return {
    group: phone,
    update,
    setPalette,
    setMarker,
    hideMarker,
    setScrewMarkerVisible,
    setActiveParts,
    getActiveHitboxes,
    setHeat,
    unscrew,
    liftScreen,
    installScreen,
    removeBattery,
    installBattery,
    disconnectBatteryFlex: () => animateFlex(batteryFlex, true),
    reconnectBatteryFlex: () => animateFlex(batteryFlex, false),
    disconnectDisplayFlex: () => animateFlex(displayFlex, true),
    reconnectDisplayFlex: () => animateFlex(displayFlex, false),
    screenBoot,
    jolt,
    reset,
    getStepWorldPosition,
    setHover: (on) => { hoverTarget = on ? 1 : 0 },
    setAccent,
    get screenLifted() { return screenLifted }
  }
}
