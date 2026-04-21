---
branch: 'exec-plan/playwright-e2e-setup'
body_source: 'pr-body.local.md'
archived_at: '2026-04-21T05:12:08Z'
pr_url: 'https://github.com/kgs9843/Photo-Guard/pull/7'
---

# PR

## 📝 변경 사항

- `playwright` 패키지를 **`@playwright/test`** 로 전환하고 **`playwright.config.ts`** + **`e2e/`** 스펙으로 스크린샷 플로우를 옮김.
- **`npm run test:e2e`** 한 줄로 실행. `screenshots:settings-toast` 및 `scripts/capture-settings-toast-screenshots.mjs` 제거.
- E2E 전용 Vite 포트 **5237**(`PLAYWRIGHT_E2E_PORT`) — `dev:5231` 점유와 충돌 방지.
- **`AGENTS.md`**, **`docs/workflows/pull-request-template.md`**, **`scripts/README.md`**, Playwright MCP 스킬에 관례 반영.
- **`.gitignore`**: `test-results`, `playwright-report`
- **ESLint**: `e2e/`, `playwright.config.ts` 제외

## 🔗 관련 이슈

(없음)

## 🎯 변경 유형

- [ ] 🐛 버그 수정
- [ ] ✨ 새로운 기능 추가
- [x] ♻️ 리팩토링
- [x] 📝 문서 수정
- [ ] 🎨 스타일 변경
- [ ] ⚡️ 성능 개선
- [ ] 🧪 테스트 추가/수정
- [x] 🔧 빌드/설정 변경

## 🎯 플랫폼

- [ ] 📱 모바일
- [x] 💻 웹
- [ ] 🔄 공통

## 📸 스크린샷

`npm run test:e2e` 또는 `npx playwright test e2e/settings-history-toast.spec.ts` 로 `docs/references/screenshots/settings-history-toast/` PNG 재생성.

## 📝 추가 정보

최초 클론 후: `npx playwright install chromium`
