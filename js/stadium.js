import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  grassTexture,
  adTexture,
  crowdTexture,
  netTexture,
  skyTexture,
  makeRadialTexture
} from './textures.js'

const PITCH = {
  length: 105,
  width: 68,
  halfLength: 52.5,
  halfWidth: 34,
  goalWidth: 7.32,
  goalHeight: 2.44,
  goalDepth: 2.2,
  boxDepth: 16.5,
  boxWidth: 40.32,
  sixDepth: 5.5,
  sixWidth: 18.32
}

export function createStadium() {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05111b, 0.0038)

  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 500)
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene'),
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  scene.background = new THREE.Color(0x02060b)

  const world = new THREE.Group()
  scene.add(world)

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(240, 32, 18),
    new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog: false })
  )
  sky.position.y = -6
  scene.add(sky)

  const hemi = new THREE.HemisphereLight(0x8fd7ff, 0x07170d, 1.1)
  scene.add(hemi)

  const keyLight = new THREE.DirectionalLight(0xe8f8ff, 2.6)
  keyLight.position.set(34, 66, 28)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(2048, 2048)
  keyLight.shadow.camera.left = -72
  keyLight.shadow.camera.right = 72
  keyLight.shadow.camera.top = 62
  keyLight.shadow.camera.bottom = -62
  keyLight.shadow.camera.near = 1
  keyLight.shadow.camera.far = 160
  keyLight.shadow.bias = -0.0004
  keyLight.shadow.normalBias = 0.02
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0x5f9dff, 0.65)
  fillLight.position.set(-50, 34, -26)
  scene.add(fillLight)

  const cyanLight = new THREE.PointLight(0x55e6ff, 120, 140, 1.6)
  cyanLight.position.set(-52, 24, 28)
  scene.add(cyanLight)

  const magentaLight = new THREE.PointLight(0x8a5cff, 95, 140, 1.6)
  magentaLight.position.set(52, 22, -30)
  scene.add(magentaLight)

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(150, 64),
    new THREE.MeshStandardMaterial({ color: 0x071018, roughness: 0.94, metalness: 0.05 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.08
  ground.receiveShadow = true
  world.add(ground)

  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(PITCH.length, PITCH.width),
    new THREE.MeshStandardMaterial({ map: grassTexture(), roughness: 0.88, metalness: 0.02 })
  )
  pitch.rotation.x = -Math.PI / 2
  pitch.position.y = 0.01
  pitch.receiveShadow = true
  world.add(pitch)

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xe9f8ff,
    transparent: true,
    opacity: 0.82
  })

  const lineGroup = new THREE.Group()
  world.add(lineGroup)

  const line = (points, closed = false) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const mesh = new THREE.Line(geometry, lineMaterial)
    mesh.position.y = 0.035
    lineGroup.add(mesh)
    if (closed) {
      const first = points[0]
      const last = points[points.length - 1]
      if (first.distanceTo(last) > 0.01) {
        const closing = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([last, first]),
          lineMaterial
        )
        closing.position.y = 0.035
        lineGroup.add(closing)
      }
    }
  }

  const seg = (x1, z1, x2, z2) => line([
    new THREE.Vector3(x1, 0, z1),
    new THREE.Vector3(x2, 0, z2)
  ])

  const arcPoints = (cx, cz, radius, start, end, steps = 48) => {
    const pts = []
    for (let i = 0; i <= steps; i += 1) {
      const a = start + (end - start) * (i / steps)
      pts.push(new THREE.Vector3(cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius))
    }
    return pts
  }

  const {
    halfLength: L,
    halfWidth: W,
    boxDepth,
    boxWidth,
    sixDepth,
    sixWidth,
    goalWidth
  } = PITCH

  seg(-L, -W, L, -W)
  seg(-L, W, L, W)
  seg(-L, -W, -L, W)
  seg(L, -W, L, W)
  seg(0, -W, 0, W)

  line([...arcPoints(0, 0, 9.15, 0, Math.PI * 2, 80)], true)
  const spot = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), new THREE.MeshBasicMaterial({ color: 0xe9f8ff }))
  spot.rotation.x = -Math.PI / 2
  spot.position.y = 0.04
  world.add(spot)

  for (const side of [-1, 1]) {
    const goalX = side * L
    const boxX = side * (L - boxDepth)
    const sixX = side * (L - sixDepth)
    const boxHalf = boxWidth / 2
    const sixHalf = sixWidth / 2
    seg(boxX, -boxHalf, boxX, boxHalf)
    seg(goalX, -boxHalf, boxX, -boxHalf)
    seg(goalX, boxHalf, boxX, boxHalf)
    seg(sixX, -sixHalf, sixX, sixHalf)
    seg(goalX, -sixHalf, sixX, -sixHalf)
    seg(goalX, sixHalf, sixX, sixHalf)

    const penX = side * (L - 11)
    const penSpot = new THREE.Mesh(new THREE.CircleGeometry(0.13, 16), new THREE.MeshBasicMaterial({ color: 0xe9f8ff }))
    penSpot.rotation.x = -Math.PI / 2
    penSpot.position.set(penX, 0.04, 0)
    world.add(penSpot)

    const arcStart = side > 0 ? 2.214 : -0.927
    const arcEnd = side > 0 ? 4.069 : 0.927
    line(arcPoints(penX, 0, 9.15, arcStart, arcEnd, 32))

    line(arcPoints(side * L, -W, 1, side > 0 ? Math.PI : 0, side > 0 ? Math.PI * 1.5 : Math.PI * 0.5, 12))
    line(arcPoints(side * L, W, 1, side > 0 ? Math.PI * 0.5 : Math.PI * 1.5, side > 0 ? Math.PI : Math.PI * 2, 12))
  }

  const goalFrameMaterial = new THREE.MeshStandardMaterial({ color: 0xf1fbff, roughness: 0.32, metalness: 0.2 })
  const netMap = netTexture()
  const netMaterial = new THREE.MeshBasicMaterial({
    map: netMap,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    depthWrite: false,
    color: 0xcdeeff
  })

  const goals = []

  for (const side of [-1, 1]) {
    const group = new THREE.Group()
    const goalLineX = side * L
    const backX = side * (L + PITCH.goalDepth)
    const half = goalWidth / 2 + 0.08

    const postGeo = new THREE.CylinderGeometry(0.075, 0.075, PITCH.goalHeight, 12)
    for (const z of [-half, half]) {
      const post = new THREE.Mesh(postGeo, goalFrameMaterial)
      post.position.set(goalLineX, PITCH.goalHeight / 2, z)
      post.castShadow = true
      group.add(post)
      const backPost = new THREE.Mesh(postGeo, goalFrameMaterial)
      backPost.position.set(backX, PITCH.goalHeight / 2, z)
      backPost.scale.y = 0.95
      backPost.castShadow = true
      group.add(backPost)
      const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, PITCH.goalDepth, 10), goalFrameMaterial)
      topBar.rotation.z = Math.PI / 2
      topBar.position.set(side * (L + PITCH.goalDepth / 2), PITCH.goalHeight, z)
      group.add(topBar)
    }

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, goalWidth + 0.16, 12), goalFrameMaterial)
    crossbar.rotation.x = Math.PI / 2
    crossbar.position.set(goalLineX, PITCH.goalHeight, 0)
    crossbar.castShadow = true
    group.add(crossbar)

    const backNet = new THREE.Mesh(new THREE.PlaneGeometry(goalWidth + 0.16, PITCH.goalHeight), netMaterial)
    backNet.rotation.y = Math.PI / 2
    backNet.position.set(backX, PITCH.goalHeight / 2, 0)
    group.add(backNet)

    for (const z of [-half, half]) {
      const sideNet = new THREE.Mesh(new THREE.PlaneGeometry(PITCH.goalDepth, PITCH.goalHeight), netMaterial)
      sideNet.position.set(side * (L + PITCH.goalDepth / 2), PITCH.goalHeight / 2, z)
      group.add(sideNet)
    }

    const topNet = new THREE.Mesh(new THREE.PlaneGeometry(PITCH.goalDepth, goalWidth + 0.16), netMaterial)
    topNet.rotation.x = -Math.PI / 2
    topNet.position.set(side * (L + PITCH.goalDepth / 2), PITCH.goalHeight, 0)
    group.add(topNet)

    const backBar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, goalWidth + 0.16, 10), goalFrameMaterial)
    backBar.rotation.x = Math.PI / 2
    backBar.position.set(backX, PITCH.goalHeight * 0.95, 0)
    group.add(backBar)

    world.add(group)
    goals.push({ side, group })
  }

  const adTextures = [
    adTexture('ARENA PRISMA', '#55e6ff'),
    adTexture('FOOTBALL 3D', '#8a5cff'),
    adTexture('PRISMA SPORTS', '#46f0b4'),
    adTexture('KICK-OFF 2026', '#ffcf5c')
  ].map((texture) => {
    texture.wrapS = THREE.ClampToEdgeWrapping
    return texture
  })

  function buildAdBoards() {
    const group = new THREE.Group()
    const adGeometry = new THREE.BoxGeometry(7.6, 0.9, 0.24)
    let index = 0
    for (const z of [-W - 1.5, W + 1.5]) {
      for (let x = -48; x <= 48; x += 8) {
        const texture = adTextures[index++ % adTextures.length]
        const mesh = new THREE.Mesh(adGeometry, new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: 0xffffff,
          emissiveIntensity: 0.45,
          roughness: 0.55,
          metalness: 0.1
        }))
        mesh.position.set(x, 0.47, z)
        if (z > 0) mesh.rotation.y = Math.PI
        group.add(mesh)
      }
    }
    for (const side of [-1, 1]) {
      const endGeometry = new THREE.BoxGeometry(0.24, 0.9, 7.6)
      for (let z = -27; z <= 27; z += 8) {
        const texture = adTextures[index++ % adTextures.length]
        const mesh = new THREE.Mesh(endGeometry, new THREE.MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          emissive: 0xffffff,
          emissiveIntensity: 0.42,
          roughness: 0.55
        }))
        mesh.position.set(side * (L + 4.2), 0.47, z)
        group.add(mesh)
      }
    }
    return group
  }

  world.add(buildAdBoards())

  const crowdMap = crowdTexture()
  const crowdMaterial = new THREE.MeshStandardMaterial({
    map: crowdMap,
    emissiveMap: crowdMap,
    emissive: 0x8fc7e8,
    emissiveIntensity: 0.28,
    roughness: 0.95,
    side: THREE.DoubleSide
  })

  const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0x0b1822, roughness: 0.82, metalness: 0.1 })
  const steelMaterial = new THREE.MeshStandardMaterial({ color: 0x1c2d3a, roughness: 0.55, metalness: 0.55 })

  function standSlope(width, depth, position, rotationY, invert = false) {
    const group = new THREE.Group()
    group.position.copy(position)
    group.rotation.y = rotationY

    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, 5.2, 0.9), concreteMaterial)
    wall.position.set(0, 2.6, 0)
    group.add(wall)

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), crowdMaterial)
    plane.rotation.x = invert ? -Math.PI / 2 - 0.34 : -Math.PI / 2 + 0.34
    plane.position.set(0, 5.4 + depth * 0.17, invert ? -depth * 0.42 : depth * 0.42)
    plane.material.map.repeat.set(width / 10, depth / 8)
    group.add(plane)

    const back = new THREE.Mesh(new THREE.BoxGeometry(width, 15, 0.8), concreteMaterial)
    back.position.set(0, 9, invert ? -depth * 0.9 : depth * 0.9)
    group.add(back)

    const roof = new THREE.Mesh(new THREE.BoxGeometry(width, 0.5, depth * 1.34), steelMaterial)
    roof.position.set(0, 18.5, invert ? -depth * 0.36 : depth * 0.36)
    group.add(roof)

    return group
  }

  world.add(standSlope(126, 17, new THREE.Vector3(0, 0, W + 7.5), 0))
  world.add(standSlope(126, 17, new THREE.Vector3(0, 0, -W - 7.5), Math.PI, true))
  world.add(standSlope(88, 16, new THREE.Vector3(L + 9.5, 0, 0), -Math.PI / 2))
  world.add(standSlope(88, 16, new THREE.Vector3(-L - 9.5, 0, 0), Math.PI / 2, true))

  const glowTexture = makeRadialTexture('rgba(255,255,255,1)', 'rgba(160,235,255,0)')
  const flashTexture = makeRadialTexture('rgba(255,255,255,1)', 'rgba(190,235,255,0)')

  function floodlight(x, z) {
    const group = new THREE.Group()
    group.position.set(x, 0, z)
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.55, 28, 8), steelMaterial)
    tower.position.y = 14
    group.add(tower)
    const panel = new THREE.Mesh(new THREE.BoxGeometry(9, 2.2, 0.5), new THREE.MeshStandardMaterial({
      color: 0x111a21,
      metalness: 0.7,
      roughness: 0.4
    }))
    panel.position.y = 28.4
    panel.lookAt(new THREE.Vector3(0, 2, 0))
    group.add(panel)
    for (let i = 0; i < 6; i += 1) {
      const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.5, 12), new THREE.MeshBasicMaterial({ color: 0xf2fdff }))
      lamp.position.set((i - 2.5) * 1.25, 28.4, 0.28)
      lamp.lookAt(new THREE.Vector3(0, 2, 0))
      group.add(lamp)
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xbfeeff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    }))
    glow.scale.set(20, 9, 1)
    glow.position.y = 28.4
    group.add(glow)
    world.add(group)
    return group
  }

  floodlight(-L - 6, -W - 12)
  floodlight(-L - 6, W + 12)
  floodlight(L + 6, -W - 12)
  floodlight(L + 6, W + 12)

  const flags = []
  const flagColors = [0x55e6ff, 0x8a5cff, 0xffffff, 0x46f0b4]
  for (let i = 0; i < 18; i += 1) {
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.2),
      new THREE.MeshBasicMaterial({ color: flagColors[i % flagColors.length], side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    )
    const side = i % 2 === 0 ? 1 : -1
    flag.position.set(-45 + (i * 9) % 90, 15 + (i % 3) * 0.6, side * (W + 20))
    flag.rotation.y = side > 0 ? Math.PI : 0
    flag.userData.phase = i * 0.7
    world.add(flag)
    flags.push(flag)
  }

  const flashPositions = []
  for (let i = 0; i < 38; i += 1) {
    const side = i % 4
    if (side === 0) flashPositions.push([-55 + Math.random() * 110, 8 + Math.random() * 11, W + 10 + Math.random() * 8])
    else if (side === 1) flashPositions.push([-55 + Math.random() * 110, 8 + Math.random() * 11, -W - 10 - Math.random() * 8])
    else if (side === 2) flashPositions.push([L + 8 + Math.random() * 8, 8 + Math.random() * 11, -30 + Math.random() * 60])
    else flashPositions.push([-L - 8 - Math.random() * 8, 8 + Math.random() * 11, -30 + Math.random() * 60])
  }

  const flashGeometry = new THREE.BufferGeometry()
  flashGeometry.setAttribute('position', new THREE.Float32BufferAttribute(flashPositions.flat(), 3))
  const flashMaterial = new THREE.PointsMaterial({
    map: flashTexture,
    color: 0xe8fbff,
    size: 1.8,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  })
  const flashes = new THREE.Points(flashGeometry, flashMaterial)
  world.add(flashes)

  const rig = {
    position: new THREE.Vector3(28, 76, 88),
    target: new THREE.Vector3(0, 1.2, 0),
    goalPosition: new THREE.Vector3(28, 76, 88),
    goalTarget: new THREE.Vector3(0, 1.2, 0)
  }

  const state = {
    mode: 'menu',
    aspect: 1,
    side: 0,
    replayGoal: 1,
    menuOrbit: 0
  }

  function setMode(mode, data = {}) {
    const previous = state.mode
    state.mode = mode
    if (mode === 'menu') {
      rig.goalPosition.set(28, 76, state.aspect < 0.9 ? 106 : 88)
      rig.goalTarget.set(3, 1.4, 0)
    } else if (mode === 'match') {
      rig.goalPosition.set(0, state.aspect < 0.8 ? 44 : 34, state.aspect < 0.8 ? 40 : 39)
      rig.goalTarget.set(0, 0, 0)
    } else if (mode === 'results') {
      rig.goalPosition.set(-28, 76, state.aspect < 0.9 ? 106 : 88)
      rig.goalTarget.set(0, 1, 0)
    } else if (mode === 'replay') {
      state.replayGoal = data.side || 1
      const side = state.replayGoal
      rig.goalPosition.set(side * 34, 12, 30)
      rig.goalTarget.set(side * 50, 1.4, 0)
    }
    if (mode === 'match' && (previous === 'menu' || previous === 'results')) {
      rig.position.copy(rig.goalPosition)
      rig.target.copy(rig.goalTarget)
    }
  }

  function orbit(dx, dy) {
    if (state.mode !== 'match' && state.mode !== 'menu') return
    state.side = THREE.MathUtils.clamp(state.side + dx * 0.00032, -0.22, 0.22)
    rig.goalPosition.y = THREE.MathUtils.clamp(rig.goalPosition.y + dy * 0.02, 20, 40)
  }

  function zoom(delta) {
    if (state.mode !== 'match') return
    rig.goalPosition.z = THREE.MathUtils.clamp(rig.goalPosition.z + delta * 0.006, 34, 40.5)
  }

  function resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    state.aspect = width / height
    camera.aspect = state.aspect
    camera.fov = state.aspect < 0.8 ? 52 : 44
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    renderer.setSize(width, height)
    if (state.mode === 'menu') {
      rig.goalPosition.set(28, 76, state.aspect < 0.9 ? 106 : 88)
      rig.goalTarget.set(3, 1.4, 0)
    }
  }

  function update(dt, elapsed, focus) {
    if (state.mode === 'menu') {
      const angle = Math.sin(elapsed * 0.11) * 0.12
      const radius = state.aspect < 0.9 ? 106 : 88
      rig.goalPosition.set(28 + Math.sin(angle) * 8, 76, radius)
      rig.goalTarget.set(3, 1.4, 0)
    } else if (state.mode === 'match' && focus) {
      const fx = THREE.MathUtils.clamp(focus.x, -38, 38)
      const fz = THREE.MathUtils.clamp(focus.z, -16, 16)
      const baseZ = state.aspect < 0.8 ? 40 : 39
      rig.goalPosition.x = fx * 0.7 + state.side * 22
      rig.goalPosition.z = baseZ + fz * 0.1
      rig.goalTarget.set(fx * 0.83, 0, fz * 0.3)
    }

    const damp = Math.min(1, dt * 3.4)
    rig.position.lerp(rig.goalPosition, damp)
    rig.target.lerp(rig.goalTarget, Math.min(1, dt * 4.2))
    camera.position.copy(rig.position)
    camera.lookAt(rig.target)

    for (const flag of flags) flag.rotation.z = Math.sin(elapsed * 1.4 + flag.userData.phase) * 0.07
    flashMaterial.opacity = 0.35 + Math.abs(Math.sin(elapsed * 2.7)) * 0.35
    flashes.position.y = Math.sin(elapsed * 0.7) * 0.03
    sky.position.x = camera.position.x * 0.1
    sky.position.z = camera.position.z * 0.1
  }

  window.addEventListener('resize', resize)
  resize()
  setMode('menu')

  return {
    scene,
    camera,
    renderer,
    pitch,
    goals,
    setMode,
    orbit,
    zoom,
    resize,
    update,
    PITCH,
    get mode() { return state.mode },
    get aspect() { return state.aspect }
  }
}
