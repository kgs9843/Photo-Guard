# AGENTS.md — 지도(map)

이 파일은 매뉴얼이 아니라 **레포 안에서 길을 찾는 지도**입니다. 철학은 OpenAI의 [하네스 엔지니어링](https://openai.com/ko-KR/index/harness-engineering/)과 같습니다.

- **사람:** 의도·경계·검증을 설계한다.
- **에이전트/자동화:** 구현·검증·루프를 돕는다.
- **지식 SoT:** `docs/` 기록 시스템.

---

## Cursor 규칙·스킬 (자동 적용 요약)

| 구분                     | 경로                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| 제약                     | `.cursor/rules/project-constraints.mdc`                                                                |
| FSD                      | `.cursor/rules/fsd-core.mdc`                                                                           |
| 디자인                   | `.cursor/rules/design.mdc` → [`docs/design/design-system.md`](docs/design/design-system.md)            |
| 슬라이스 스캐폴드        | `.cursor/skills/fsd-slices/SKILL.md`                                                                   |
| 에이전트 실수 교훈       | `.cursor/skills/agent-lessons/SKILL.md` · 로그 [`LESSONS.md`](.cursor/skills/agent-lessons/LESSONS.md) |
| PR 전 심층 리뷰 (gstack) | 사용자 홈 `~/.cursor/skills/gstack-review/SKILL.md` (미설치면 생략) — [절 4](#4-커밋--pr--머지--정리)  |
| Playwright MCP 스크린샷  | `.cursor/skills/playwright-mcp-screenshots/SKILL.md` (PR·문서용 UI 캡처, MCP 연결 시)                  |

---

## docs 목차 (맥락이 필요할 때)

**아래 표를 위에서부터** 열어보면 됩니다. 세부는 각 파일의 링크를 따릅니다.

| 경로                                                                                 | 내용                                                                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [`docs/index.md`](docs/index.md)                                                     | `docs/` 전체 목차 SoT                                                                                                         |
| [`docs/workflows/pull-request-template.md`](docs/workflows/pull-request-template.md) | **PR 본문 SoT** — 섹션·체크리스트 순서. 채운 뒤 `pr-body.local.md` 등으로 `pr:open`에 넘김. 생략 시 템플릿 원문이 PR에 올라감 |
| [`docs/workflows/README.md`](docs/workflows/README.md)                               | 워크플로·`npm run pr:open` 안내                                                                                               |
| [`docs/workflows/code-review.md`](docs/workflows/code-review.md)                     | 기계적 검증(`verify`) vs 사람·AI 리뷰                                                                                         |
| [`docs/workflows/pr-bodies/README.md`](docs/workflows/pr-bodies/README.md)           | `pr-open` PR 본문 **아카이브**                                                                                                |
| [`docs/design/design-system.md`](docs/design/design-system.md)                       | **UI/디자인 시스템 SoT**                                                                                                      |
| [`docs/design/README.md`](docs/design/README.md)                                     | 디자인 문서 인덱스                                                                                                            |
| [`docs/exec-plans/README.md`](docs/exec-plans/README.md)                             | 실행 계획·워크트리·포트·로그                                                                                                  |
| [`docs/architecture/README.md`](docs/architecture/README.md)                         | FSD 배경·`src/` 트리                                                                                                          |
| [`docs/product/README.md`](docs/product/README.md)                                   | 제품 한 줄·여정·용어                                                                                                          |
| [`docs/references/README.md`](docs/references/README.md)                             | 외부 근거·참고 고정                                                                                                           |
| [`scripts/README.md`](scripts/README.md)                                             | 스크립트 표 (`exec-plan-init`, `verify`, Husky 보조 등)                                                                       |

---

## 핵심: `src/` 변경은 main에서 직접 하지 않기

기능·버그·리팩터 등 **소스 변경**은 기본적으로 **git worktree**에서 합니다. `main` 워킹트리의 `src/`를 바로 고치지 않습니다. 잘못돼도 **브랜치 / PR / 워크트리 제거**로 되돌릴 수 있게 하는 것이 목표입니다.

---

## 워크플로 (요약)

### 1. exec_plan + 워크트리

- 저장소 루트에서 **`npm run exec-plan-init -- <slug>`** 또는 `node scripts/exec-plan-init.mjs <slug>` (Node만, Windows PowerShell 포함).
- Git Bash·macOS·Linux: `bash scripts/exec-plan-init.sh <slug>` 동일.
- 생성물: 워크트리 `../photo-guard-worktrees/<slug>`, 제안 포트 `.dev-port`, 로그 `.exec-logs`, `docs/exec-plans/active/exec-plan-<slug>.md`, 워크트리 `EXEC_PLAN.md` (목표·접근법·단계·완료 기준).
- Cursor에서 에이전트에게 시킬 때 **`@AGENTS.md`**와 **`@docs/exec-plans/active/exec-plan-<slug>.md`**(또는 워크트리의 `EXEC_PLAN.md`)를 같이 걸면, **채워 둔 실행 계획이 대화보다 우선**한다. (규칙: `.cursor/rules/project-constraints.mdc`)

### 2. 워크트리에서 구현

- 해당 경로로 `cd` 후 `npm install`, dev 서버 등.
- Git Bash: `npm run dev -- --port $(cat .dev-port)`
- PowerShell: `Get-Content .dev-port`로 포트 읽기.
- **병합 전까지 `main`에 직접 푸시하지 않습니다.**

### 3. 검증 (`npm run verify`)

- **전역 `verify`:** ESLint, Prettier **`format:check`**, `tsc`, 빌드, FSD. PR 전·CI·수동에 사용.
- **`format:check`만 실패:** `npm run format` 후 **`npm run verify` 재실행**(필요 시 반복). 여기서 멈추지 않습니다.
- **커밋 훅:** `lint-staged`로 스테이징 포맷 → **`verify` precommit 모드**(전역 Prettier 생략, 나머지 동일). 상세는 아래 **Husky**.
- **푸시 훅:** 없음. 원격은 **CI**가 전역 `verify` 축을 맡습니다.

### 4. 커밋 → PR → 머지 → 정리

- **커밋:** Conventional Commits 권장 (`feat:`, `fix:`, `chore:` 등).
- **PR 전 (에이전트 기본 순서):** `npm run verify` 통과 **후** → **[`LESSONS.md`](.cursor/skills/agent-lessons/LESSONS.md) 확인** → **`gstack-review` 스킬**을 읽고(경로: 사용자 홈 **`~/.cursor/skills/gstack-review/SKILL.md`**. 없으면 이 단계 생략) 이번 브랜치 변경분 기준 **심층 코드 리뷰** → 지적이 타당하면 **코드에 반영**하고 필요 시 커밋 → **`npm run verify` 재확인** → 그다음 **`pr:open`**. 보안·아키텍처까지 보려면 같은 방식으로 `gstack-cso` 등 **상황에 맞는 gstack 스킬**을 추가로 참고할 수 있다.
- **리뷰·PR 과정에서 드러난 실수·빈틈**은 사용자가 지적하거나 “기록해”라고 하면 **반드시** [에이전트 교훈 스킬](.cursor/skills/agent-lessons/SKILL.md)에 따라 **`LESSONS.md`에 한 줄** 남겨 같은 실수를 반복하지 않는다.
- **PR은 같은 작업의 다음 단계.** 구현·`verify`·(가능하면 gstack 리뷰 반영)·커밋까지 끝났으면, 사용자가 “PR 올려”라고 할 때까지 **기다리지 않고** SoT 순서로 본문을 채운 뒤 **`pr:open`으로 푸시·PR 생성**을 시도하는 것이 **에이전트 기본**입니다.  
  **예외:** `gh` 없음, 오프라인, 사용자가 PR 생략을 명시.
- **명령 (저장소 루트):** `npm run pr:open` — 기본은 **`npm run verify` 후** `git push` + `gh pr create`. 본문은 [`pull-request-template.md`](docs/workflows/pull-request-template.md) 순서로 채운 **`pr-body.local.md`** 등을 넘깁니다.
- **아카이브:** 채운 본문을 넘기면 [`docs/workflows/pr-bodies/`](docs/workflows/pr-bodies/)에 자동 생성. 원격 기록으로 남기려면 **그 파일을 커밋**. 템플릿만 쓰고도 아카이브하려면 `PR_BODY_ARCHIVE=1`.
- **실행 계획:** `pr-open`이 PR을 만든 뒤, 브랜치가 `exec-plan/<slug>`이면 [`docs/exec-plans/README.md`](docs/exec-plans/README.md)대로 `active/exec-plan-<slug>.md`를 **`completed/`로 자동 이동**한다. 옮기지 않으려면 `EXEC_PLAN_NO_MOVE=1`.
- **Git Bash:** `bash scripts/pr-open.sh` (동일 동작).
- **머지·워크트리 정리:** GitHub / 사람 판단 (`gh pr merge`, `pr-merge-complete.sh`).
- **사람·팀 리뷰:** PR에서. 로컬 기계 검증만은 [`docs/workflows/code-review.md`](docs/workflows/code-review.md).

#### Windows: `pr:open`에서 `--skip-verify`

`npm run pr:open -- --skip-verify …`처럼 **플래그가 스크립트까지 안 넘어가는 경우**가 있으므로, 동일 동작은 워크트리 루트에서:

`node scripts/pr-open.mjs --skip-verify <브랜치> pr-body.local.md`

---

## 에이전트 순차 게이트

**한 단계씩만 진행**합니다. 앞 단계가 **성공으로 끝난 뒤**에만 다음으로 갑니다. 실패·스킵이면 **그 지점에서 중단**하고 원인을 고칩니다.

Husky·훅은 자동 수정이 아니라 **막기만** 하므로, 실패 단계의 로그 분석·수정·**같은 단계 재시도**까지 끝내는 것은 **에이전트/작업자 책임**입니다.

- **1 → 2:** `exec-plan-init`·워크트리 경로가 없으면 `src/` 구현으로 가지 않는다.
- **2 → 3:** `npm run verify`가 통과하지 않으면 커밋/푸시로 넘기지 않는다. Prettier만 깨지면 `npm run format` → `verify` 재시도 후, ESLint·타입·빌드·FSD 순으로 처리한다.
- **3 → PR(심층 리뷰):** `verify` 통과 뒤 **`gstack-review` 스킬이 있으면** 읽고 리뷰·개선·재`verify`까지 마친 다음 `pr:open`으로 넘긴다. 스킬 경로가 없으면 생략하고 [`code-review.md`](docs/workflows/code-review.md)만 따른다.
- **3 → PR(푸시):** 커밋까지 끝났고 원격 브랜치가 준비되었으면 **PR 단계를 빼먹지 않는다.** `pr:open` 안에서만 `verify`가 실패하는 경우(베이스·포맷 드리프트 등), **이미 동일 변경에 대해 `verify`를 통과한 뒤**라면 `node scripts/pr-open.mjs --skip-verify …`로 PR만 진행할 수 있다. **남용 금지** — CI가 최종 `verify`를 맡는다.
- **PR 본문:** [`pull-request-template.md`](docs/workflows/pull-request-template.md) 형식으로 채운 파일(예: `pr-body.local.md`)을 만든 뒤 `npm run pr:open -- <브랜치> pr-body.local.md` 또는 `npm run pr:open -- pr-body.local.md`. 인자 없이 `npm run pr:open`만 하면 SoT 원문이 그대로 올라가므로 **채운 파일을 넘기는 것이 기본**이다. 워크트리 작업이 커밋 가능한 상태로 끝나면 **“PR 올려” 지시 전에** 푸시·PR까지 진행한다. (차단: `gh` 없음, 네트워크 불가, 사용자가 PR 생략 명시.)
- **`--no-verify`:** 커밋을 훅 없이 밀어 넣지 않는다. 예외는 사람이 명시적으로 결정한다.
- **우회 env:** 긴급·인프라만. `main`에 `src/` 직접 커밋이 필요할 때만 `HUSKY_ALLOW_MAIN_SRC=1` (Unix) / `set HUSKY_ALLOW_MAIN_SRC=1` / PowerShell `$env:HUSKY_ALLOW_MAIN_SRC=1`.

---

## Husky · CI

- **pre-commit** (`node scripts/husky-pre-commit.mjs`): **①** `lint-staged`(스테이징 ESLint·Prettier) → **②** `main`에서 `src/` 직접 커밋 차단 (`git-main-src-gate.mjs`, 머지·리베이스·체리픽·리버트 중 예외) → **③** `verify-task.mjs --precommit`(전역 `prettier --check` 제외; `lint`·`type-check`·`build`·FSD는 전부). 앞 단계 실패 시 뒤 단계는 실행되지 않음.
- **pre-push:** 사용하지 않음. `git push`는 훅 없음; `--no-verify`로 넘긴 커밋도 푸시 단계에서 추가 차단하지 않음. **CI**가 `verify`로 보완.
- **CI (GitHub Actions):** `npm run verify` 한 번으로 린트·포맷·타입·빌드·FSD 경계를 맞춤.

---

## 원칙

- 레포 밖 지식은 없는 것으로 취급한다. 반복 규칙은 **문서보다 린트·타입·CI**로 강제한다.
