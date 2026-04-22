---
branch: 'exec-plan/privacy-terms-policy'
body_source: 'pr-body.local.md'
archived_at: '2026-04-22T07:57:05Z'
pr_url: 'https://github.com/kgs9843/Photo-Guard/pull/8'
---

## 📝 변경 사항

- `src/pages/privacy/` 문구를 **현재 구현(온디바이스 처리 + 로컬 저장)** 기준으로 재작성했습니다.
  - 이용약관 섹션 추가
  - 개인정보 처리방침을 IndexedDB/localStorage, 공유(시스템 Share/WebView) 흐름에 맞게 정리
- Playwright 스크린샷 검증을 추가했습니다.

## 🔗 관련 이슈

- (없음)

## 🎯 변경 유형

- [ ] 🐛 버그 수정
- [x] ✨ 새로운 기능 추가
- [ ] ♻️ 리팩토링
- [ ] 📝 문서 수정
- [x] 🎨 스타일 변경
- [ ] ⚡️ 성능 개선
- [x] 🧪 테스트 추가/수정
- [ ] 🔧 빌드/설정 변경

## 🎯 플랫폼

- [ ] 📱 모바일
- [x] 💻 웹
- [ ] 🔄 공통 (모바일 + 웹)

## 📸 스크린샷

- KO: `https://github.com/kgs9843/Photo-Guard/raw/exec-plan/privacy-terms-policy/docs/references/screenshots/privacy-terms-policy/01-privacy-ko.png`
- EN: `https://github.com/kgs9843/Photo-Guard/raw/exec-plan/privacy-terms-policy/docs/references/screenshots/privacy-terms-policy/02-privacy-en.png`

## 📝 추가 정보

- 스크린샷은 `e2e/privacy-terms-policy.spec.ts`로 재현 가능합니다.
