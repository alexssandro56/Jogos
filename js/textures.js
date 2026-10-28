import * as THREE from 'three'

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function canvasTexture(width, height, draw, { repeat = [1, 1], filter = true } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat[0], repeat[1])
  texture.anisotropy = filter ? 8 : 1
  return texture
}

export function grassTexture() {
  const rand = mulberry32(7)
  return canvasTexture(1024, 768, (ctx, w, h) => {
    ctx.fillStyle = '#1c592b'
    ctx.fillRect(0, 0, w, h)
    const bands = 12
    for (let i = 0; i < bands; i += 1) {
      const shade = i % 2 === 0 ? '#1f6230' : '#1a5227'
      ctx.fillStyle = shade
      ctx.fillRect((i * w) / bands, 0, w / bands + 1, h)
      ctx.fillStyle = 'rgba(255,255,255,0.018)'
      ctx.fillRect((i * w) / bands, 0, 2, h)
    }
    for (let i = 0; i < 26000; i += 1) {
      const x = rand() * w
      const y = rand() * h
      const light = rand()
      ctx.fillStyle = light > 0.55
        ? `rgba(126, 200, 112, ${0.025 + rand() * 0.05})`
        : `rgba(4, 30, 10, ${0.03 + rand() * 0.06})`
      ctx.fillRect(x, y, 1 + rand() * 2, 1 + rand() * 2)
    }
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.7)
    grd.addColorStop(0, 'rgba(120,200,120,0.06)')
    grd.addColorStop(1, 'rgba(0,0,0,0.16)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
  }, { repeat: [1, 1] })
}

export function ballTexture() {
  const rand = mulberry32(31)
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#f4f1e8'
    ctx.fillRect(0, 0, w, h)
    const grd = ctx.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, 'rgba(0,0,0,0.05)')
    grd.addColorStop(0.5, 'rgba(255,255,255,0.06)')
    grd.addColorStop(1, 'rgba(0,0,0,0.12)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)

    const pentagon = (cx, cy, r, rotation) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i += 1) {
        const a = rotation + (i / 5) * Math.PI * 2
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    }

    ctx.fillStyle = '#11151a'
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const cx = (col + 0.5) * (w / 5) + (row % 2 ? w / 10 : 0)
        const cy = (row + 0.5) * (h / 3)
        pentagon(cx, cy, 30 + rand() * 4, rand() * Math.PI)
      }
    }
    ctx.strokeStyle = 'rgba(20, 24, 30, 0.22)'
    ctx.lineWidth = 3
    for (let i = 0; i < 16; i += 1) {
      ctx.beginPath()
      ctx.arc(rand() * w, rand() * h, 40 + rand() * 70, rand() * 6, rand() * 6 + 2)
      ctx.stroke()
    }
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.font = '700 22px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PRISMA', w * 0.5, h * 0.11)
  })
}

export function adTexture(text, accent = '#55e6ff') {
  return canvasTexture(1024, 128, (ctx, w, h) => {
    const grd = ctx.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, '#050b12')
    grd.addColorStop(0.5, '#0b1c2b')
    grd.addColorStop(1, '#050b12')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = accent
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 3
    ctx.strokeRect(12, 12, w - 24, h - 24)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#eaf8ff'
    ctx.font = '700 54px Rajdhani, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w * 0.5, h * 0.52)
    ctx.fillStyle = accent
    ctx.fillRect(34, h * 0.5 - 3, 80, 6)
    ctx.fillRect(w - 114, h * 0.5 - 3, 80, 6)
  }, { filter: false })
}

export function crowdTexture() {
  const rand = mulberry32(99)
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#03070d'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#2a5a78', '#7c5cff', '#55e6ff', '#9fb6c8', '#c084fc', '#ff5d73', '#ffcf5c', '#d7e5ee']
    for (let i = 0; i < 9000; i += 1) {
      const x = rand() * w
      const y = rand() * h
      const color = colors[Math.floor(rand() * colors.length)]
      ctx.globalAlpha = 0.25 + rand() * 0.7
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 0.7 + rand() * 2.4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    for (let i = 0; i < 20; i += 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.fillRect(rand() * w, 0, 2 + rand() * 5, h)
    }
  })
}

export function netTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(225,245,255,0.55)'
    ctx.lineWidth = 1.4
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
  }, { repeat: [6, 2], filter: false })
}

export function skyTexture() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    const grd = ctx.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#01040a')
    grd.addColorStop(0.5, '#061421')
    grd.addColorStop(0.76, '#0c2a3b')
    grd.addColorStop(1, '#123444')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
    const rand = mulberry32(5)
    for (let i = 0; i < 500; i += 1) {
      ctx.fillStyle = `rgba(190,235,255,${0.08 + rand() * 0.5})`
      ctx.fillRect(rand() * w, rand() * h * 0.55, 1 + rand(), 1 + rand())
    }
    const glow = ctx.createRadialGradient(w * 0.7, h * 0.6, 10, w * 0.7, h * 0.6, w * 0.4)
    glow.addColorStop(0, 'rgba(85,230,255,0.12)')
    glow.addColorStop(1, 'rgba(85,230,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)
  }, { filter: false })
}

export function makeRadialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  return canvasTexture(128, 128, (ctx, w, h) => {
    const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    grd.addColorStop(0, inner)
    grd.addColorStop(1, outer)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
  }, { filter: false })
}
