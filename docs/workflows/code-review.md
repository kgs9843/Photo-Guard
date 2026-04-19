# 코드 리뷰: 무엇까지 자동화할 수 있나

## 로컬에서 “기계적”으로 할 수 있는 것

- **`npm run verify`** — ESLint, Prettier, TypeScript, 프로덕션 빌드, FSD 경계. **스타일·타입·빌드 깨짐**을 잡는 데 가깝고, **설계·요구사항 적합성**은 다루지 않습니다.
- **`npm run pr:open`** — 기본적으로 PR을 열기 **전에** 위 `verify`를 한 번 더 돌립니다(건너뛰기: `-- --skip-verify`).
- **Husky** — **커밋(pre-commit)** 시 `lint-staged`·게이트·`verify`를 돌립니다. 푸시 전 동일 검사는 두지 않습니다.

즉 “리뷰”라기보다 **자동 점검(gate)** 입니다.

## 사람·팀 리뷰가 필요한 것

- 요구사항에 맞는지, 엣지 케이스, 보안·프라이버시, 네이밍·구조 선택 등은 **GitHub PR 리뷰**(코멘트·승인)로 처리하는 것이 일반적입니다.

## AI가 PR 전체를 “리뷰”해 주게 하려면

- 이 레포만으로는 **기본 제공되지 않습니다.** Cursor에서 PR diff를 열고 질문하거나, **GitHub Copilot for Pull Requests**, **외부 리뷰 봇** 등을 따로 켜야 합니다.
- 자동화하려면 GitHub Actions에서 `gh pr diff`를 받아 외부 API로 보내는 식의 **맞춤 워크플로**가 필요합니다(비용·토큰·정책 검토).

## 권장 흐름

1. 로컬: `npm run pr:open`(기본 시 verify 포함) 또는 `npm run verify`만 따로.
2. PR: `npm run pr:open`으로 초안 생성 후 **GitHub에서 리뷰어 지정·코멘트**.
3. 머지: 조건 충족 후 `gh pr merge` 또는 웹 UI.
