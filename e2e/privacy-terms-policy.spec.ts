import path from 'node:path'

import { test } from '@playwright/test'

const outDir = path.join(
  process.cwd(),
  'docs/references/screenshots/privacy-terms-policy'
)

async function setLocale(
  page: { addInitScript: (...args: any[]) => any },
  locale: 'ko' | 'en'
) {
  await page.addInitScript(l => {
    try {
      localStorage.setItem('photo-guard:locale', l)
    } catch {
      /* ignore */
    }
  }, locale)
}

test('privacy: terms & privacy page screenshots (ko/en)', async ({ page }) => {
  await setLocale(page, 'ko')
  await page.goto('/privacy', { waitUntil: 'load', timeout: 90_000 })
  await page.getByRole('heading', { name: '이용약관', exact: true }).waitFor({
    state: 'visible',
    timeout: 60_000,
  })
  await page.screenshot({
    path: path.join(outDir, '01-privacy-ko.png'),
    fullPage: true,
  })

  await setLocale(page, 'en')
  await page.goto('/privacy', { waitUntil: 'load', timeout: 90_000 })
  await page
    .getByRole('heading', { name: 'Terms of service', exact: true })
    .waitFor({
      state: 'visible',
      timeout: 60_000,
    })
  await page.screenshot({
    path: path.join(outDir, '02-privacy-en.png'),
    fullPage: true,
  })
})
