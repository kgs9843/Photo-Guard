import path from 'node:path'

import { test, type Page } from '@playwright/test'

/**
 * Play 스토어·문서용 참고 스크린샷.
 * 뷰포트·DPR은 playwright.config.ts 의 chromium 프로젝트와 동일 (390×844, deviceScaleFactor 2).
 *
 * 갱신: npm run test:e2e:store-shots
 */
const outDir = path.join(process.cwd(), 'docs/references/screenshot')

/** 로딩 스피너·IDB·비동기 상태가 끝난 뒤 레이아웃/폰트가 안정되도록 */
const SETTLE_MS = 900

async function setLocaleKo(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('photo-guard:locale', 'ko')
    } catch {
      /* ignore */
    }
  })
}

async function settleForScreenshot(page: Page) {
  await page.waitForTimeout(SETTLE_MS)
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
      await settleForScreenshot(page)
      await page.screenshot({
        path: path.join(outDir, fileName),
        fullPage: true,
      })
    }

    await capture('01-dashboard.png', '/', async () => {
      await page
        .getByRole('heading', { name: '사진 선택' })
        .waitFor({ state: 'visible', timeout: 60_000 })
      await page
        .getByRole('heading', { name: '개인정보 가이드' })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })

    await capture('02-clean.png', '/clean', async () => {
      await page
        .getByText('선택된 사진이 없습니다', { exact: true })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })

    await capture('03-cleaning.png', '/cleaning', async () => {
      // 사진 없이 진입 시 잠깐 '메타데이터 제거 중' 스피너가 보이므로 완료 헤더까지 대기
      await page
        .getByRole('heading', { name: '삭제 완료' })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })

    await capture('04-history.png', '/history', async () => {
      // ready 전에는 제목만 있고 본문이 비어 있음 — 빈 상태 또는 목록 행이 뜰 때까지 대기
      await page.waitForFunction(
        () => {
          const t = document.body.innerText
          return t.includes('아직 기록이 없습니다') || t.includes('정제됨')
        },
        { timeout: 60_000 }
      )
    })

    await capture(
      '05-history-detail.png',
      '/history/00000000-0000-0000-0000-000000000000',
      async () => {
        await page.waitForFunction(
          () => !document.body.innerText.includes('불러오는 중'),
          { timeout: 60_000 }
        )
        await page
          .getByText('기록을 찾을 수 없습니다.', { exact: true })
          .waitFor({ state: 'visible', timeout: 60_000 })
      }
    )

    await capture('06-settings.png', '/settings', async () => {
      await page
        .getByText('언어', { exact: true })
        .waitFor({ state: 'visible', timeout: 60_000 })
    })

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
