# scripts/

GitHub / 로컬 자동화용 스크립트입니다. **실행 계획 초기화**는 Node 버전을 권장합니다(Windows PowerShell 포함 크로스 플랫폼). 그 외 셸 스크립트는 **Git Bash**(Windows) 또는 macOS/Linux `bash`를 가정합니다.

| 스크립트                                 | 설명                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exec-plan-init.mjs`                     | **권장**: 위와 동일, Node만 필요. `npm run exec-plan-init -- <slug>`                                                                                                                                                                                                       |
| `exec-plan-init.sh`                      | Git Bash / Unix: 실행 계획 + worktree + `.dev-port` + `.exec-logs`                                                                                                                                                                                                         |
| `verify-task.mjs`                        | **`npm run verify`** 전체; **`--precommit`** 시 전역 Prettier 체크 생략(Husky 3단계)                                                                                                                                                                                       |
| `husky-pre-commit.mjs`                   | Husky: lint-staged → main/src 게이트 → `verify-task.mjs --precommit`                                                                                                                                                                                                       |
| `git-main-src-gate.mjs`                  | `main`에서 `src/` 직접 커밋 차단(머지 등 예외). `HUSKY_ALLOW_MAIN_SRC=1` 우회                                                                                                                                                                                              |
| `verify-task.sh`                         | 위 `.mjs`를 호출하는 thin wrapper (Git Bash 등)                                                                                                                                                                                                                            |
| `check-fsd-boundaries.sh`                | `shared`가 상위 레이어를 import 하는지 검사 (수동 실행용)                                                                                                                                                                                                                  |
| `pr-open.mjs`                            | **`npm run pr:open`** — `verify` 후(또는 `--skip-verify`) push + `gh pr create`; `[branch] [body-file]` 또는 `pr-body.local.md` 한 인자. 브랜치가 `exec-plan/<slug>`이면 `docs/exec-plans/active/exec-plan-<slug>.md` → `completed/` 자동 이동(`EXEC_PLAN_NO_MOVE=1` 생략) |
| `pr-open.sh`                             | Git Bash용: `node scripts/pr-open.mjs` 호출(동일 동작)                                                                                                                                                                                                                     |
| `pr-merge-complete.sh`                   | `gh pr merge` + `git worktree remove` (인자 필요)                                                                                                                                                                                                                          |
| `capture-settings-toast-screenshots.mjs` | Playwright: 설정·삭제 확인·토스트 PNG → `docs/references/screenshots/settings-history-toast/`. 먼저 `npm run dev:5231`, 이후 `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5231 npm run screenshots:settings-toast`                                                                |

## npm 스크립트

- `npm run verify` — 린트, **전역** Prettier 체크, 타입, 빌드, FSD(CI·PR 전·수동)
- `npm run verify:precommit` — 위와 동일하나 **전역 Prettier 체크 생략**(Husky가 내부 호출; 스테이징은 lint-staged)
- `npm run exec-plan-init -- <slug>` — 실행 계획 + worktree 생성(`exec-plan-init.mjs`)
- `npm run dev:5231` — 스크린샷·로컬 확인용 Vite (`127.0.0.1:5231`)
- `npm run screenshots:settings-toast` — Playwright 캡처( Chromium은 `npx playwright install chromium` )

## 환경 변수

| 변수                        | 기본                              | 설명                                                                            |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `BASE_BRANCH`               | `main`                            | worktree 생성 시 베이스                                                         |
| `PHOTO_GUARD_WORKTREE_ROOT` | `<repo>/../photo-guard-worktrees` | 워크트리 부모 경로                                                              |
| `HUSKY_ALLOW_MAIN_SRC`      | (없음)                            | `1`이면 main+src 게이트만 우회                                                  |
| `PR_BODY_ARCHIVE`           | (없음)                            | `1`이면 `pr-open.sh`가 SoT 템플릿만 써도 `docs/workflows/pr-bodies/`에 아카이브 |
| `VERIFY_PRECOMMIT`          | (없음)                            | `1`이면 `verify-task`가 `--precommit`과 동일(전역 format:check 생략)            |
