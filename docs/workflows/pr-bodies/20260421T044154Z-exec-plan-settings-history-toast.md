---
branch: 'exec-plan/settings-history-toast'
body_source: 'pr-body.local.md'
archived_at: '2026-04-21T04:41:54Z'
pr_url: 'https://github.com/kgs9843/Photo-Guard/pull/6'
---

# Pull request 본문 (SoT)

## 📝 변경 사항

- 설정 **활동 기록 삭제** 후 피드백을 `window.alert` 대신 **인앱 토스트**(`shared/ui/Toast`)로 표시합니다. 성공 / 빈 목록 / 실패 톤에 맞춰 아이콘·자동 닫힘·닫기 버튼·`aria-live`를 적용했습니다.
- Playwright로 캡처한 UI 스크린샷 3종을 `docs/references/screenshots/settings-history-toast/`에 추가했습니다.
- Windows에서 `npm run dev -- --port`가 npm에 삼켜지는 경우를 피하려고 **`npm run dev:5231`** 스크립트를 추가했고, `scripts/capture-settings-toast-screenshots.mjs` + **`npm run screenshots:settings-toast`** 로 PR용 PNG를 재생성할 수 있게 했습니다. (`playwright` devDependency)

## 🔗 관련 이슈

- (없음)

## 🎯 변경 유형

- [x] 🐛 버그 수정
- [x] ✨ 새로운 기능 추가
- [ ] ♻️ 리팩토링
- [ ] 📝 문서 수정
- [x] 🎨 스타일 변경
- [ ] ⚡️ 성능 개선
- [ ] 🧪 테스트 추가/수정
- [x] 🔧 빌드/설정 변경

## 🎯 플랫폼

- [ ] 📱 모바일
- [x] 💻 웹
- [ ] 🔄 공통 (모바일 + 웹)

## 📸 스크린샷

설정 화면 → 삭제 확인 모달 → 삭제 후 토스트 (Playwright, 로컬 `dev:5231`).

![Settings](./docs/references/screenshots/settings-history-toast/01-settings.png)

![Clear history modal](./docs/references/screenshots/settings-history-toast/02-clear-history-modal.png)

![Toast after clear](./docs/references/screenshots/settings-history-toast/03-history-toast.png)

**재캡처:** `npm run dev:5231` 실행 후  
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:5231 npm run screenshots:settings-toast`  
(최초 1회 `npx playwright install chromium`)

## 📝 추가 정보

- 토스트는 하단 탭(`z-50`) 위에 보이도록 `z-[55]`로 두었습니다.
