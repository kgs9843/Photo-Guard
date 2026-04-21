import { defineConfig, devices } from '@playwright/test'

/** Dev 손작업 포트(5231)와 겹치지 않게 E2E 전용 포트 사용 */
const e2ePort = process.env.PLAYWRIGHT_E2E_PORT ?? '5237'
const e2eOrigin = `http://127.0.0.1:${e2ePort}`

/**
 * Playwright E2E / 스크린샷.
 * @see AGENTS.md — Playwright E2E
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: e2eOrigin,
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: {
    command: `npx vite --host 127.0.0.1 --port ${e2ePort}`,
    url: e2eOrigin,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
