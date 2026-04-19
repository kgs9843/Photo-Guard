# AGENTS.md — 지도(map)

이 파일은 매뉴얼이 아니라 **레포 안에서 길을 찾는 지도**입니다. 철학은 OpenAI의 [하네스 엔지니어링](https://openai.com/ko-KR/index/harness-engineering/)과 같습니다. **사람이 의도·경계·검증을 설계하고**, 에이전트/자동화가 구현·루프를 돕습니다. 지식의 SoT는 `docs/` 기록 시스템입니다.

## 문서 목차 (docs — 참고할 때)

에이전트/사람이 맥락이 필요하면 **아래 경로를 연 순서대로** 보면 됩니다. 상세는 각 파일 안의 링크를 따릅니다.

| 경로                                                                                 | 내용                                                                                                                                  |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/index.md`](docs/index.md)                                                     | `docs/` 전체 목차 SoT                                                                                                                 |
| [`docs/workflows/pull-request-template.md`](docs/workflows/pull-request-template.md) | **PR 본문 형식(SoT)** — 섹션·체크리스트 순서. 채운 뒤 `npm run pr:open -- … pr-body.local.md` 등으로 넘김, 생략 시 원문이 PR에 올라감 |
| [`docs/workflows/README.md`](docs/workflows/README.md)                               | 워크플로·`npm run pr:open` 안내                                                                                                       |
| [`docs/workflows/code-review.md`](docs/workflows/code-review.md)                     | 기계적 검증(`verify`) vs 사람·AI 리뷰                                                                                                 |
| [`docs/workflows/pr-bodies/README.md`](docs/workflows/pr-bodies/README.md)           | `pr-open`으로 올린 PR 본문 **아카이브**(채운 body 넘길 때 자동 생성)                                                                  |
| [`docs/design/design-system.md`](docs/design/design-system.md)                       | **UI/디자인 시스템(SoT)** — 색·타이포·서피스·컴포넌트                                                                                 |
| [`docs/design/README.md`](docs/design/README.md)                                     | 디자인 문서 인덱스                                                                                                                    |
| [`docs/exec-plans/README.md`](docs/exec-plans/README.md)                             | 실행 계획·워크트리·포트·로그                                                                                                          |
| [`docs/architecture/README.md`](docs/architecture/README.md)                         | FSD 배경·`src/` 트리 (규칙은 `.cursor/rules/fsd-core.mdc`)                                                                            |
| [`docs/product/README.md`](docs/product/README.md)                                   | 제품 한 줄·여정·용어                                                                                                                  |
| [`docs/references/README.md`](docs/references/README.md)                             | 외부 근거·참고 고정                                                                                                                   |
| [`scripts/README.md`](scripts/README.md)                                             | 스크립트 표 (`exec-plan-init`, `verify`, Husky 보조 등)                                                                               |

Cursor 규칙(요약·자동 적용): `.cursor/rules/project-constraints.mdc`, `.cursor/rules/fsd-core.mdc`, `.cursor/rules/design.mdc`(→ 위 design-system 링크), `.cursor/skills/fsd-slices/SKILL.md`

## 핵심: `src/` 변경은 main에서 직접 하지 않기

기능·버그·리팩터 등 **소스 변경 작업**은 기본적으로 **git worktree**에서 합니다. `main` 워킹트리의 `src/`를 바로 고치지 않습니다. 잘못돼도 **브랜치/PR/워크트리 제거**로 되돌릴 수 있게 하는 것이 목표입니다.

## 워크플로 (요약)

1. **exec_plan 생성** — 저장소 루트에서 **`npm run exec-plan-init -- <slug>`** 또는 `node scripts/exec-plan-init.mjs <slug>`(Node만, Windows PowerShell 포함). Git Bash·macOS·Linux에서는 `bash scripts/exec-plan-init.sh <slug>`도 동일합니다.  
   워크트리(`../photo-guard-worktrees/<slug>`), 제안 포트(`.dev-port`), 로그(`.exec-logs`), `docs/exec-plans/active/exec-plan-<slug>.md` + 워크트리 `EXEC_PLAN.md`에 **목표·접근법·단계·완료 기준** 템플릿을 둡니다.

2. **워크트리에서 구현** — `cd` 해당 경로 후 `npm install`, `npm run dev -- --port $(cat .dev-port)` 등(Git Bash). PowerShell은 `Get-Content .dev-port`로 포트 읽기. **병합 전까지 `main`에 직접 푸시하지 않습니다.**

3. **검증** — `npm run verify` (`scripts/verify-task.mjs`): ESLint, Prettier, `tsc`, 빌드, FSD(`shared`가 상위 레이어 import 금지). **커밋 훅(pre-commit)**에서 순차 적용됩니다(아래 **Husky**). 푸시 직전에는 같은 검사를 다시 하지 않습니다(이중 방지); 원격은 **CI**가 맡습니다.

4. **커밋 → PR → 머지 → 정리** — Conventional Commits 권장(`feat:`, `fix:`, `chore:` 등). **PR:** 커밋 후 저장소 루트에서 **`npm run pr:open`** — 기본으로 **`npm run verify` 다음** `git push` + `gh pr create`(본문은 SoT 템플릿 또는 `npm run pr:open -- pr-body.local.md`처럼 채운 md). 검증 생략은 `-- --skip-verify`. 성공 시 채운 본문을 넘긴 경우 [`docs/workflows/pr-bodies/`](docs/workflows/pr-bodies/)에 아카이브되며, **원격 기록으로 남기려면 그 파일을 커밋**합니다. 템플릿만 쓰고도 아카이브하려면 `PR_BODY_ARCHIVE=1`. Git Bash에서는 `bash scripts/pr-open.sh`(동일 동작). **머지·워크트리 정리**는 GitHub/사람 판단(`gh pr merge`, `pr-merge-complete.sh`). 사람·팀 **코드 리뷰**는 PR에서 진행; 로컬 기계 검증만은 [`docs/workflows/code-review.md`](docs/workflows/code-review.md) 참고.

## 에이전트 순차 게이트(프롬프트)

에이전트/자동화는 **아래를 한 번에 건너뛰지 말고**, 앞 단계가 **성공으로 끝난 뒤에만** 다음 단계를 진행합니다. 한 단계라도 실패·스킵이면 **그 지점에서 중단**하고 원인을 고칩니다. Husky·훅은 **자동으로 고쳐 주지 않고** 막기만 하므로, **실패한 그 단계에서** 로그를 보고 원인 분석·수정·재시도(같은 단계 재실행)까지 끝내는 것은 **에이전트/작업자의 책임**입니다.

- **PR 전:** [`docs/workflows/pull-request-template.md`](docs/workflows/pull-request-template.md) 형식으로 본문을 채운 파일(예: 루트 `pr-body.local.md`)을 만든 뒤 **`npm run pr:open -- <브랜치> pr-body.local.md`** 또는 현재 브랜치면 **`npm run pr:open -- pr-body.local.md`**. 인자 없이 `npm run pr:open`만 하면 SoT 템플릿 원문이 올라가므로 **에이전트는 채운 파일을 넘기는 것을 기본**으로 한다.
- **1 → 2**: `exec-plan-init`가 끝나지 않았거나 워크트리 경로가 없으면, `src/` 구현 단계로 가지 않습니다.
- **2 → 3**: `npm run verify`가 통과하지 않으면 커밋/푸시로 넘기지 않습니다(로컬에서 먼저 고침).
- **`--no-verify` 금지(원칙)**: 커밋을 훅 없이 밀어 넣지 않습니다(푸시 훅은 사용하지 않음). 예외가 필요하면 사람이 명시적으로 결정합니다.
- **우회 환경변수**는 긴급·인프라 작업에만: `main`에 `src/`를 직접 커밋해야 할 때만 `HUSKY_ALLOW_MAIN_SRC=1`(Unix) / `set HUSKY_ALLOW_MAIN_SRC=1` 후 커밋(PowerShell은 `$env:HUSKY_ALLOW_MAIN_SRC=1`).

## Husky(실패 시 다음 단계 차단)

- **pre-commit** (`node scripts/husky-pre-commit.mjs`): **1)** `lint-staged` → 실패 시 종료 → **2)** `main`에서 `src/` 직접 커밋 차단(`node scripts/git-main-src-gate.mjs`, 머지·리베이스·체리픽·리버트 진행 중은 예외) → **3)** `npm run verify`. 앞 단계가 실패하면 뒤 단계는 실행되지 않습니다.
- **pre-push**: 사용하지 않음(위 `verify`와 중복이라 제거). `git push`는 훅 검사 없이 진행되며, **`--no-verify`로 넘긴 커밋**도 푸시 단계에서 추가로 막지 않습니다. 대신 **CI**에서 `verify`가 돕니다.
- **CI**: GitHub Actions의 `verify`와 동일한 축으로 맞춥니다.

## CI

GitHub Actions는 `npm run verify` 한 번으로 린트·포맷·타입·빌드·FSD 경계를 맞춥니다.

## 원칙

- 레포 밖 지식은 없는 것으로 취급. 반복 규칙은 **문서보다 린트·타입·CI**로 강제합니다.
