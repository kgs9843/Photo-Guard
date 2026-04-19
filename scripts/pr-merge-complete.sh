#!/usr/bin/env bash
set -euo pipefail
# PR 머지 후 워크트리 정리(수동 확인 후 실행 권장)
# 사용: bash scripts/pr-merge-complete.sh <pr-number> <worktree-path>
# 예: bash scripts/pr-merge-complete.sh 42 ../photo-guard-worktrees/my-slug

PR="${1:-}"
WT="${2:-}"

if [[ -z "$PR" || -z "$WT" ]]; then
  echo "usage: bash scripts/pr-merge-complete.sh <pr-number> <worktree-path>" >&2
  echo "  1) gh pr merge $PR --squash  (또는 --merge)" >&2
  echo "  2) git worktree remove <path>" >&2
  exit 1
fi

if command -v gh >/dev/null 2>&1; then
  gh pr merge "$PR" --squash --delete-branch
else
  echo "error: gh not found; merge the PR in the GitHub UI" >&2
  exit 1
fi

if [[ -d "$WT" ]]; then
  git worktree remove "$WT" || true
fi

echo "ok: PR $PR merged (branch deleted if gh succeeded) and worktree removed if path existed"
