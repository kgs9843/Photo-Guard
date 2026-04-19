#!/usr/bin/env bash
set -euo pipefail
# gh CLI로 푸시 + PR 생성 (인증 필요)
# 사용: bash scripts/pr-open.sh [branch-name]
# branch 기본: 현재 브랜치

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI not installed. Install: https://cli.github.com/" >&2
  exit 1
fi

git push -u origin "$BRANCH"
gh pr create --head "$BRANCH" --title "chore: $BRANCH" --body "Exec plan / worktree branch. 본문은 EXEC_PLAN.md 또는 docs/exec-plans/active 참고."

echo "ok: opened PR for $BRANCH (adjust title/body in GitHub UI if needed)"
