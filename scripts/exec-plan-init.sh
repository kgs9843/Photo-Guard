#!/usr/bin/env bash
set -euo pipefail

# 실행 계획 + worktree + 포트 + 로그 디렉터리 + active 문서 한 번에 생성
# 사용: bash scripts/exec-plan-init.sh <slug>
# 선택 환경변수: BASE_BRANCH (기본 main), PHOTO_GUARD_WORKTREE_ROOT (기본: 저장소 상위 photo-guard-worktrees)
# <!-- 채팅 : @AGENTS.md @docs/exec-plans/active/exec-plan-foo.md -->

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SLUG="${1:-}"

if [[ -z "$SLUG" ]]; then
  echo "usage: bash scripts/exec-plan-init.sh <slug>" >&2
  echo "  example: bash scripts/exec-plan-init.sh fix-history-dedupe" >&2
  exit 1
fi

if [[ "$SLUG" =~ [^a-zA-Z0-9._-] ]]; then
  echo "error: slug must be [a-zA-Z0-9._-] only" >&2
  exit 1
fi

BASE_BRANCH="${BASE_BRANCH:-main}"
WT_PARENT="${PHOTO_GUARD_WORKTREE_ROOT:-$ROOT/../photo-guard-worktrees}"
WT_PATH="$WT_PARENT/$SLUG"
BRANCH="exec-plan/$SLUG"
DOCS_PLAN="$ROOT/docs/exec-plans/active/exec-plan-$SLUG.md"

mkdir -p "$WT_PARENT"
mkdir -p "$ROOT/docs/exec-plans/active"

# 포트: 5200–5999 범위에서 slug 기반 결정 (충돌 시 .dev-port 수동 수정)
PORT=$((5200 + (${#SLUG} * 37 + 17) % 800))

if [[ -d "$WT_PATH" ]]; then
  echo "error: worktree path already exists: $WT_PATH" >&2
  exit 1
fi

cd "$ROOT"
git fetch origin "$BASE_BRANCH" 2>/dev/null || true

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "error: branch already exists locally: $BRANCH (remove or pick another slug)" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
  git worktree add "$WT_PATH" -b "$BRANCH" "$BASE_BRANCH"
else
  echo "warn: local branch $BASE_BRANCH missing; using HEAD" >&2
  git worktree add "$WT_PATH" -b "$BRANCH" HEAD
fi

mkdir -p "$WT_PATH/.exec-logs"
echo "$PORT" >"$WT_PATH/.dev-port"
echo "worktree=$WT_PATH" >"$WT_PATH/.exec-meta"
echo "branch=$BRANCH" >>"$WT_PATH/.exec-meta"
echo "port=$PORT" >>"$WT_PATH/.exec-meta"
echo "created=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >>"$WT_PATH/.exec-meta"

PLAN_BODY="# 실행 계획: $SLUG

## 메타
- **slug**: \`$SLUG\`
- **브랜치**: \`$BRANCH\`
- **워크트리**: \`$WT_PATH\`
- **프리뷰 포트(제안)**: \`$PORT\` (\`npm run dev -- --port $PORT\` 등)
- **로그 디렉터리**: \`$WT_PATH/.exec-logs\`

## 1. 목표
<!-- 한 문장으로 무엇을 달성하는지 -->

## 2. 접근법
<!-- 왜 이 방식인지, 대안과 트레이드오프 -->

## 3. 단계별 계획
1.
2.
3.

## 4. 완료 기준
- [ ] \`npm run verify\` 통과
- [ ] \`src/\` 변경이 요구사항과 일치
- [ ] (선택) 수동 시나리오 확인

## 5. 롤백
- \`main\`은 직접 수정하지 않음. 문제 시 이 브랜치/PR 폐기 후 워크트리 제거:
  - \`git worktree remove \"$WT_PATH\"\`
  - \`git branch -D $BRANCH\` (병합되지 않은 경우)
"

echo "$PLAN_BODY" >"$WT_PATH/EXEC_PLAN.md"
echo "$PLAN_BODY" >"$DOCS_PLAN"

echo ""
echo "ok: exec plan + worktree ready"
echo "  docs: $DOCS_PLAN"
echo "  worktree: $WT_PATH"
echo "  branch: $BRANCH"
echo "  port: $PORT (saved to $WT_PATH/.dev-port)"
echo "  logs: $WT_PATH/.exec-logs"
echo ""
echo "Next: cd \"$WT_PATH\" && npm install && npm run dev -- --port $PORT"
echo "Optional (PR): npm run pr:open -- $BRANCH   (또는 bash scripts/pr-open.sh; 본문: docs/workflows/pull-request-template.md)"
