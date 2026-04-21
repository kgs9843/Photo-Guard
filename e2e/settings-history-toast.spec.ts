import path from 'node:path'

import { test } from '@playwright/test'

const outDir = path.join(
  process.cwd(),
  'docs/references/screenshots/settings-history-toast'
)

test('settings: clear history + toast screenshots', async ({ page }) => {
  await page.goto('/settings', { waitUntil: 'load', timeout: 90_000 })
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
})
