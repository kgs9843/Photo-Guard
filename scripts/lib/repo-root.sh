#!/usr/bin/env bash
# 저장소 루트(최상위 .git)로 이동
repo_root() {
  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  if ! git -C "$dir" rev-parse --git-dir >/dev/null 2>&1; then
    echo "error: not a git repository: $dir" >&2
    return 1
  fi
  echo "$dir"
}
