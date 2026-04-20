---
name: agent-lessons
description: >-
  Photo Guard: user-corrected agent mistakes logged in LESSONS.md so agents do not
  repeat them. Read LESSONS.md before non-trivial repo work and before PR after
  gstack-review. When the user points out a mistake or asks to record it (기록해,
  다시 하지 마, 실수, 같은 실수), or when a review/PR gap should not recur,
  append a concise dated line to LESSONS.md per this skill. Use when the user
  mentions agent-lessons, 실수 기록, 교훈, PR 빈틈, or anti-patterns for this project.
---

# 에이전트 교훈 (Photo Guard)

## 작업 전

- 이 레포에서 **기능·버그·리팩터·PR 준비** 등 `src/`·스크립트·설정을 바꿀 때는 **`LESSONS.md`를 먼저 읽는다.** (짧은 질문만 있으면 생략 가능.)
- **`npm run verify` 통과 후 `pr:open` 직전:** `AGENTS.md` 순서대로 **`gstack-review`를 적용한 뒤**, 다시 **`LESSONS.md`를 훑어** 로그에 있는 금지 사항이 이번 수정에 없는지 확인한다.
- 사용자가 **`@.cursor/skills/agent-lessons/LESSONS.md`** 또는 이 스킬을 걸면 **반드시** 로그를 반영한다.

## PR · 리뷰 직후

- 사용자가 “리뷰에서 이걸 놓쳤다”“PR 전에 이렇게 했어야 했다”고 하면 **기록 요청이 없어도** 한 줄 남기는 것을 **제안**하고, 사용자가 동의하거나 이미 분명히 남기라고 하면 **`LESSONS.md`에 추가**한다.
- 에이전트가 **같은 패턴의 실수를 두 번** 발견하면(예: 동일 린트/타입/UX 실수), 사용자 말 없이도 **`LESSONS.md`에 일반화한 한 줄**을 추가한다(과도한 자동 기록은 피하고 **재현 가능한 규칙**만).

## 사용자가 실수를 지적했을 때

1. **의도 확인:** 단순 톤 vs “앞으로 이렇게 하지 마” / “기록해” — 후자면 로그에 남긴다.
2. **`LESSONS.md`에 한 줄 추가** (파일 끝, `---` 아래 목록에 이어서):
   - 형식: `- **YYYY-MM-DD** — 하지 말 것: … / 대신: …`
   - **한 줄**에 맞출 것. 장문 금지.
3. **중복:** 같은 주제가 이미 있으면 새 줄 대신 기존 항목을 **짧게 보강**하거나, 더 일반적인 한 줄로 **치환**한다(사용자 확인이 필요하면 묻는다).

## 기록하지 않는 것

- 일회성 취향(이번 답변만 해당)이고 “기록” 요청이 없을 때.
- `AGENTS.md`·다른 규칙에 이미 동일 내용이 있을 때 — 로그에 중복 쓰지 않고 **규칙 링크만** 남기거나 생략.

## 유지보수

- 로그가 **20줄을 넘으면**, 오래된 항목 중 **이미 규칙/문서로 흡수된 것**은 삭제하거나 `docs/`로 옮길 수 있다(사용자와 합의 시).
