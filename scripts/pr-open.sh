#!/usr/bin/env bash
set -euo pipefail
# 푸시 + PR 생성 — Node 구현 호출 (Windows PowerShell 포함).
# 사용법·아카이브 규칙: scripts/pr-open.mjs 주석, docs/workflows/README.md

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec node "$ROOT/scripts/pr-open.mjs" "$@"
