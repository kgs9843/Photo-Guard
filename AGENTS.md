# AGENTS.md — 지도(map)

이 파일은 매뉴얼이 아니라 **레포 안에서 길을 찾는 지도**입니다. 철학은 OpenAI의 [하네스 엔지니어링](https://openai.com/ko-KR/index/harness-engineering/)과 같습니다. **사람이 의도·경계·검증을 설계하고**, 에이전트/자동화가 구현·루프를 돕습니다. 지식의 SoT는 `docs/` 기록 시스템입니다.

## 핵심: `src/` 변경은 main에서 직접 하지 않기

기능·버그·리팩터 등 **소스 변경 작업**은 기본적으로 **git worktree**에서 합니다. `main` 워킹트리의 `src/`를 바로 고치지 않습니다. 잘못돼도 **브랜치/PR/워크트리 제거**로 되돌릴 수 있게 하는 것이 목표입니다.

## 워크플로 (요약)

1. **exec_plan 생성** — 저장소 루트에서 **`npm run exec-plan-init -- <slug>`** 또는 `node scripts/exec-plan-init.mjs <slug>`(Node만, Windows PowerShell 포함). Git Bash·macOS·Linux에서는 `bash scripts/exec-plan-init.sh <slug>`도 동일합니다.  
   워크트리(`../photo-guard-worktrees/<slug>`), 제안 포트(`.dev-port`), 로그(`.exec-logs`), `docs/exec-plans/active/exec-plan-<slug>.md` + 워크트리 `EXEC_PLAN.md`에 **목표·접근법·단계·완료 기준** 템플릿을 둡니다. PR 초안은 `bash scripts/pr-open.sh` 또는 `gh`로 진행합니다.

2. **워크트리에서 구현** — `cd` 해당 경로 후 `npm install`, `npm run dev -- --port $(cat .dev-port)` 등. **병합 전까지 `main`에 직접 푸시하지 않습니다.**

3. **검증** — `npm run verify` (`scripts/verify-task.mjs`): ESLint, Prettier, `tsc`, 빌드, FSD(`shared`가 상위 레이어 import 금지). **커밋·푸시 훅**에서도 동일 검증이 순차 적용됩니다(아래 **Husky**).

4. **커밋 → PR → 머지 → 정리** — Conventional Commits 권장(`feat:`, `fix:`, `chore:` 등). 머지 후 `git worktree remove …`, 필요 시 `docs/exec-plans/completed/`로 계획 문서 이동. `bash scripts/pr-merge-complete.sh` 참고.

## 에이전트 순차 게이트(프롬프트)

에이전트/자동화는 **아래를 한 번에 건너뛰지 말고**, 앞 단계가 **성공으로 끝난 뒤에만** 다음 단계를 진행합니다. 한 단계라도 실패·스킵이면 **그 지점에서 중단**하고 원인을 고칩니다. Husky·훅은 **자동으로 고쳐 주지 않고** 막기만 하므로, **실패한 그 단계에서** 로그를 보고 원인 분석·수정·재시도(같은 단계 재실행)까지 끝내는 것은 **에이전트/작업자의 책임**입니다.

- **1 → 2**: `exec-plan-init`가 끝나지 않았거나 워크트리 경로가 없으면, `src/` 구현 단계로 가지 않습니다.
- **2 → 3**: `npm run verify`가 통과하지 않으면 커밋/푸시로 넘기지 않습니다(로컬에서 먼저 고침).
- **`--no-verify` 금지(원칙)**: 커밋/푸시를 훅 없이 밀어 넣지 않습니다. 예외가 필요하면 사람이 명시적으로 결정합니다.
- **우회 환경변수**는 긴급·인프라 작업에만: `main`에 `src/`를 직접 커밋해야 할 때만 `HUSKY_ALLOW_MAIN_SRC=1`(Unix) / `set HUSKY_ALLOW_MAIN_SRC=1` 후 커밋(PowerShell은 `$env:HUSKY_ALLOW_MAIN_SRC=1`).

## Husky(실패 시 다음 단계 차단)

- **pre-commit** (`node scripts/husky-pre-commit.mjs`): **1)** `lint-staged` → 실패 시 종료 → **2)** `main`에서 `src/` 직접 커밋 차단(`node scripts/git-main-src-gate.mjs`, 머지·리베이스·체리픽·리버트 진행 중은 예외) → **3)** `npm run verify`. 앞 단계가 실패하면 뒤 단계는 실행되지 않습니다.
- **pre-push**: `npm run verify` 한 번 더(`git push` 직전). `--no-verify`로 커밋을 넘겨도 푸시 전에 걸릴 수 있습니다.
- **CI**: GitHub Actions의 `verify`와 동일한 축으로 맞춥니다.

## 시작 문서

- `docs/index.md` — 목차 SoT
- `docs/exec-plans/README.md` — 실행 계획·워크트리 운영
- `scripts/README.md` — 스크립트 표
- `.cursor/rules/project-constraints.mdc`, `.cursor/rules/fsd-core.mdc`, `.cursor/skills/fsd-slices/SKILL.md`

## CI

GitHub Actions는 `npm run verify` 한 번으로 린트·포맷·타입·빌드·FSD 경계를 맞춥니다.

## 원칙

- 레포 밖 지식은 없는 것으로 취급. 반복 규칙은 **문서보다 린트·타입·CI**로 강제합니다.
