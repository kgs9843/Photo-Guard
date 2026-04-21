/**
 * Playwright screenshots for settings clear-history + toast (PR / docs).
 * Requires dev or preview server. Example:
 *   npm run dev -- --port 5231
 *   npm run screenshots:settings-toast
 *
 * Env:
 *   PLAYWRIGHT_BASE_URL — default http://127.0.0.1:${PLAYWRIGHT_PORT||PORT||5231}
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(
  root,
  'docs/references/screenshots/settings-history-toast'
)

const port =
  process.env.PLAYWRIGHT_PORT || process.env.PORT || '5231'
const base =
  process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})

try {
  await page.goto(`${base}/settings`, {
    waitUntil: 'load',
    timeout: 90_000,
  })
  await page
    .getByTestId('settings-clear-history')
    .waitFor({ state: 'visible', timeout: 60_000 })
  await page.screenshot({
    path: path.join(outDir, '01-settings.png'),
    fullPage: true,
  })

  await page.getByTestId('settings-clear-history').click()
  await page
    .getByTestId('clear-history-confirm')
    .waitFor({ state: 'visible', timeout: 15_000 })
  await page.screenshot({
    path: path.join(outDir, '02-clear-history-modal.png'),
  })

  await page.getByTestId('clear-history-confirm').click()
  await page
    .getByTestId('app-toast')
    .waitFor({ state: 'visible', timeout: 15_000 })
  await page.screenshot({
    path: path.join(outDir, '03-history-toast.png'),
  })
} finally {
  await browser.close()
}

console.log('screenshots ok:', outDir)
