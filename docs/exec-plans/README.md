# 실행 계획(exec plans)

[하네스 엔지니어링](https://openai.com/ko-KR/index/harness-engineering/)에서 말하듯, **계획은 일급 아티팩트**입니다. `src/` 변경 작업은 가능하면 **격리된 git worktree** 안에서 진행하고, 여기에 요약·접근법·완료 기준을 남깁니다.

## 디렉터리

- `active/`: 진행 중인 실행 계획 본문(템플릿 채운 마크다운)
- `completed/`: 완료 후 아카이브(선택)

워크트리 전용 `EXEC_PLAN.md`는 `exec-plan-init`(Node 또는 셸)이 워크트리 루트에도 복사해 둡니다.

## 생성

저장소 루트에서 **권장(Node, Windows 포함)**:

```bash
npm run exec-plan-init -- <slug>
```

Git Bash / macOS / Linux:

```bash
bash scripts/exec-plan-init.sh <slug>
```

`gh` CLI가 있으면 PR 초안까지 열 수 있습니다(`npm run pr:open` — 본문은 [`docs/workflows/pull-request-template.md`](../workflows/pull-request-template.md) SoT).
