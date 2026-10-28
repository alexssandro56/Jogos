#!/usr/bin/env bash
# Capture the running app in desktop and mobile viewports.
set -euo pipefail

: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
CAPTURE_DIR="$(cd "$CAPTURE_DIR" && pwd)"
export CAPTURE_URL CAPTURE_DIR

/usr/bin/time -p node --input-type=commonjs - <<'NODE'
const { createRequire } = require('node:module')
const { readFileSync, statSync } = require('node:fs')
const { join } = require('node:path')

const runtime = join(process.env.HOME, '.local/share/omgithub-playwright')
const requireRuntime = createRequire(join(runtime, 'package.json'))
const { chromium } = requireRuntime('playwright')
const config = JSON.parse(readFileSync(join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'))
if (process.platform === 'linux') process.env.DISPLAY ||= ':' + readFileSync(join(runtime, 'display'), 'utf8').trim()

const url = process.env.CAPTURE_URL
const out = process.env.CAPTURE_DIR
const views = [['desktop', 1440, 900], ['mobile', 390, 844]]

function coded(code, message) { return Object.assign(new Error(message), { exitCode: code }) }
const temporary = (message) => coded(75, message)
const defect = (message) => coded(1, message)
const retryableStatus = (status) => status === 408 || status === 425 || status === 429 || status >= 500

async function timed(label, fn) {
  const start = Date.now()
  try { return await fn() } finally { console.log(`[capture] ${label}: ${Date.now() - start}ms`) }
}

;(async () => {
  let browser
  try {
    browser = await timed('launch chromium', () => chromium.launch({ ...config.browser.launchOptions, timeout: 30000 })
      .catch((error) => { throw temporary(`browser launch failed: ${error.message}`) }))

    for (const [name, width, height] of views) {
      const page = await timed(`new page ${name}`, () => browser.newPage({ viewport: { width, height } })
        .catch((error) => { throw temporary(`new page failed: ${error.message}`) }))
      page.setDefaultTimeout(60000)
      page.setDefaultNavigationTimeout(60000)
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))

      let response
      try {
        response = await timed(`goto ${name}`, () => page.goto(url, { waitUntil: 'load', timeout: 60000 }))
      } catch (error) {
        throw temporary(`navigation failed (${name}): ${error.message}`)
      }
      if (!response) throw temporary(`navigation returned no response (${name})`)
      if (!response.ok()) {
        if (retryableStatus(response.status())) throw temporary(`HTTP ${response.status()} (${name})`)
        throw defect(`HTTP ${response.status()} (${name})`)
      }

      await timed(`ready ${name}`, async () => {
        try {
          await page.waitForFunction(
            () => document.body.dataset.ready === 'true' || Boolean(document.querySelector('#loading.done')),
            null,
            { timeout: 45000 }
          )
        } catch (error) {
          throw defect(`render readiness timed out (${name}): ${error.message}`)
        }
        await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => {})
        await page.waitForTimeout(900)
      })

      await timed(`start ${name}`, async () => {
        const play = page.locator('#playBtn').first()
        if (await play.count() === 0) {
          console.log(`[capture] no Play control on ${name}; keeping menu view`)
          return
        }
        let started = false
        for (let attempt = 0; attempt < 3 && !started; attempt += 1) {
          try {
            await play.click({ timeout: 5000 })
            started = true
          } catch {
            try {
              await page.evaluate(() => document.getElementById('playBtn')?.click())
              started = true
            } catch {}
          }
        }
        if (!started) throw defect(`could not activate Play (${name})`)
        try {
          await page.waitForFunction(
            () => document.body.classList.contains('playing') || window.__game?.state?.mode === 'playing',
            null,
            { timeout: 30000 }
          )
        } catch (error) {
          throw defect(`gameplay did not start (${name}): ${error.message}`)
        }
        await page.waitForFunction(() => {
          const menu = document.getElementById('menu')
          if (!menu) return true
          const style = getComputedStyle(menu)
          return style.opacity === '0' && style.visibility === 'hidden'
        }, null, { timeout: 15000 }).catch(() => {})
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        await page.waitForTimeout(900)
      })

      const rendered = await page.evaluate(() => {
        const canvas = document.querySelector('canvas')
        const gl = canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        return {
          canvas: Boolean(canvas),
          width: canvas?.width || 0,
          height: canvas?.height || 0,
          webgl: Boolean(gl),
          mode: window.__game?.state?.mode || ''
        }
      })
      if (!rendered.canvas || !rendered.width || !rendered.height || !rendered.webgl) {
        throw defect(`WebGL canvas not rendered (${name}): ${JSON.stringify(rendered)}`)
      }
      if (pageErrors.length) throw defect(`page error (${name}): ${pageErrors[0]}`)

      const file = join(out, `final-${name}.png`)
      await timed(`screenshot ${name}`, () => page.screenshot({ path: file, timeout: 30000 })
        .catch((error) => {
          if (error.name === 'TimeoutError') throw temporary(`screenshot timed out (${name})`)
          throw defect(`screenshot failed (${name}): ${error.message}`)
        }))
      const info = statSync(file)
      const png = readFileSync(file).subarray(0, 8).toString('hex') === '89504e470d0a1a0a'
      if (!png || info.size < 10000) throw defect(`invalid screenshot (${name}): ${info.size} bytes, png=${png}`)
      console.log(`[capture] ${name}: ${file} (${info.size} bytes, mode=${rendered.mode})`)
      await page.close()
    }
  } catch (error) {
    console.error(`[capture] error: ${error.message}`)
    process.exitCode = error.exitCode || 1
  } finally {
    if (browser) {
      await browser.close().catch((error) => {
        console.error(`[capture] browser close failed: ${error.message}`)
        process.exitCode ||= 75
      })
    }
  }
})()
NODE
