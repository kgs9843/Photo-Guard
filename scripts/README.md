# scripts/

GitHub / 로컬 자동화용 스크립트입니다. **실행 계획 초기화**는 Node 버전을 권장합니다(Windows PowerShell 포함 크로스 플랫폼). 그 외 셸 스크립트는 **Git Bash**(Windows) 또는 macOS/Linux `bash`를 가정합니다.

| 스크립트                  | 설명                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| `exec-plan-init.mjs`      | **권장**: 위와 동일, Node만 필요. `npm run exec-plan-init -- <slug>`          |
| `exec-plan-init.sh`       | Git Bash / Unix: 실행 계획 + worktree + `.dev-port` + `.exec-logs`            |
| `verify-task.mjs`         | **실제 검증 엔트리**(Node, 크로스 플랫폼). `npm run verify`가 실행            |
| `husky-pre-commit.mjs`    | Husky pre-commit: lint-staged → main/src 게이트 → verify(순차)                |
| `git-main-src-gate.mjs`   | `main`에서 `src/` 직접 커밋 차단(머지 등 예외). `HUSKY_ALLOW_MAIN_SRC=1` 우회 |
| `verify-task.sh`          | 위 `.mjs`를 호출하는 thin wrapper (Git Bash 등)                               |
| `check-fsd-boundaries.sh` | `shared`가 상위 레이어를 import 하는지 검사 (수동 실행용)                     |
| `pr-open.sh`              | `git push` + `gh pr create`                                                   |
| `pr-merge-complete.sh`    | `gh pr merge` + `git worktree remove` (인자 필요)                             |

## npm 스크립트

- `npm run verify` — 린트, 포맷, 타입, 빌드, FSD 경계(커밋 전 Husky에서 호출)
- `npm run exec-plan-init -- <slug>` — 실행 계획 + worktree 생성(`exec-plan-init.mjs`)

## 환경 변수

| 변수                        | 기본                              | 설명                           |
| --------------------------- | --------------------------------- | ------------------------------ |
| `BASE_BRANCH`               | `main`                            | worktree 생성 시 베이스        |
| `PHOTO_GUARD_WORKTREE_ROOT` | `<repo>/../photo-guard-worktrees` | 워크트리 부모 경로             |
| `HUSKY_ALLOW_MAIN_SRC`      | (없음)                            | `1`이면 main+src 게이트만 우회 |
