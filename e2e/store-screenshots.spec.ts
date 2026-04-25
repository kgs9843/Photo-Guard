import path from 'node:path'

import { test } from '@playwright/test'

/**
 * Play 스토어·문서용 참고 스크린샷.
 * 뷰포트·DPR은 playwright.config.ts 의 chromium 프로젝트와 동일 (390×844, deviceScaleFactor 2).
 *
 * 갱신: npm run test:e2e:store-shots
 */
const outDir = path.join(process.cwd(), 'docs/references/screenshot')

async function setLocaleKo(page: {
  addInitScript: (...args: unknown[]) => unknown
}) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('photo-guard:locale', 'ko')
    } catch {
      /* ignore */
    }
  })
}

test.describe('@store-shots', () => {
  test('docs/references/screenshot — Play Store frame size', async ({
    page,
  }) => {
    test.setTimeout(180_000)
    await setLocaleKo(page)

    const capture = async (
      fileName: string,
      url: string,
      ready?: () => Promise<void>
    ) => {
      await page.goto(url, { waitUntil: 'load', timeout: 90_000 })
      if (ready) await ready()
      await page.screenshot({
        path: path.join(outDir, fileName),
        fullPage: true,
      })
    }

    await capture('01-dashboard.png', '/')
    await capture('02-clean.png', '/clean')
    await capture('03-cleaning.png', '/cleaning')
    await capture('04-history.png', '/history')

    await capture(
      '05-history-detail.png',
      '/history/00000000-0000-0000-0000-000000000000',
      async () => {
        await page
          .getByText('기록을 찾을 수 없습니다.', { exact: true })
          .waitFor({ state: 'visible', timeout: 60_000 })
      }
    )

    await capture('06-settings.png', '/settings')

    await capture('07-privacy.png', '/privacy', async () => {
      await page
        .getByRole('heading', { name: '이용약관', exact: true })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })

    await capture('08-licenses.png', '/licenses', async () => {
      await page
        .getByRole('heading', { name: '오픈소스 라이선스', exact: true })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })
  })
})
