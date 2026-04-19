#!/usr/bin/env bash
set -euo pipefail
# FSD: shared 레이어는 pages/features/widgets/entities/processes 를 import 할 수 없음.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

violations=0
for layer in pages features widgets entities processes; do
  if grep -RInE "from ['\"]@/${layer}" src/shared 2>/dev/null; then
    echo "error: src/shared must not import @/${layer} (FSD boundary)" >&2
    violations=1
  fi
done

exit "$violations"
