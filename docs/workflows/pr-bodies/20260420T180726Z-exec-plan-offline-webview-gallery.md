---
branch: 'exec-plan/offline-webview-gallery'
body_source: 'pr-body.local.md'
archived_at: '2026-04-20T18:07:26Z'
pr_url: 'https://github.com/kgs9843/Photo-Guard/pull/5'
---

# Pull request 본문 템플릿 (SoT)

## 📝 변경 사항

- **오프라인 전용 페이지 제거:** `OnlineBoundary`와 `pages/offline` 슬라이스를 삭제하고, 웹은 항상 앱 셸을 렌더합니다. 오프라인 UX는 네이티브 앱에서 처리한다는 전제에 맞춥니다.
- **WebView 갤러리 저장·공유:** Android WebView에서 `<a download>` / `navigator.share`가 동작하지 않는 경우를 위해 `window.ReactNativeWebView.postMessage`로 base64 페이로드를 보내는 경로를 추가했습니다. 히스토리 상세·클리닝 완료 화면의 저장/공유 버튼이 이 경로를 사용합니다.
- **문서:** `docs/references/react-native-webview-bridge.md`에 `PHOTO_GUARD_SAVE_IMAGE` / `PHOTO_GUARD_SHARE` 메시지 계약을 정리했습니다. 네이티브에서 `onMessage`로 수신 후 MediaStore 저장·`Intent.ACTION_SEND` 처리가 필요합니다.

## 🔗 관련 이슈

- (없음)

## 🎯 변경 유형

- [x] 🐛 버그 수정
- [x] ✨ 새로운 기능 추가
- [ ] ♻️ 리팩토링
- [x] 📝 문서 수정
- [ ] 🎨 스타일 변경
- [ ] ⚡️ 성능 개선
- [ ] 🧪 테스트 추가/수정
- [ ] 🔧 빌드/설정 변경

## 🎯 플랫폼

- [x] 📱 모바일
- [x] 💻 웹
- [x] 🔄 공통 (모바일 + 웹)

## 📸 스크린샷

- Playwright MCP가 현재 Cursor 세션에 등록되어 있지 않아 자동 캡처는 생략했습니다.
- **로컬 확인:** 워크트리에서 `npm run dev -- --port 5268` 후 `http://localhost:5268` — 히스토리 상세·클리닝 완료 화면에서 저장/공유 UI는 이전과 동일하게 보입니다. APK/WebView에서는 네이티브 `onMessage` 구현 후 동작을 확인해 주세요.

## 📝 추가 정보

- **필수 후속 작업 (RN):** 웹만 배포하면 WebView에서 저장/공유는 여전히 동작하지 않을 수 있습니다. `react-native-webview`의 `onMessage`에서 위 문서의 JSON 타입을 파싱해 갤러리 저장·공유 인텐트를 구현해야 합니다.
