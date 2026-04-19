/**
 * main 브랜치에서 src/ 직접 커밋을 막습니다 (AGENTS.md 워크플로).
 * 머지·체리픽 등 Git이 자동으로 스테이징하는 경우는 예외입니다.
 *
 * 우회(긴급만): HUSKY_ALLOW_MAIN_SRC=1
 * $env:HUSKY_ALLOW_MAIN_SRC = '1'; git commit -m "여기에 메시지"
 * 끝나고 다시 삭제
 * Remove-Item Env:\HUSKY_ALLOW_MAIN_SRC
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function sh(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: 'utf8',
    cwd: root,
    stdio: opts.stdio ?? 'pipe',
    ...opts,
  }).trim()
}

if (process.env.HUSKY_ALLOW_MAIN_SRC === '1') {
  process.exit(0)
}

const branch = sh('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' })
if (branch !== 'main') {
  process.exit(0)
}

function gitPathExists(relCmd) {
  try {
    const rel = sh(`git rev-parse --git-path ${relCmd}`, { stdio: 'pipe' })
    const abs = path.isAbsolute(rel) ? rel : path.resolve(root, rel)
    return fs.existsSync(abs)
  } catch {
    return false
  }
}

if (
  gitPathExists('MERGE_HEAD') ||
  gitPathExists('CHERRY_PICK_HEAD') ||
  gitPathExists('REVERT_HEAD')
) {
  process.exit(0)
}

try {
  const gitDir = sh('git rev-parse --absolute-git-dir', { stdio: 'pipe' })
  if (
    fs.existsSync(path.join(gitDir, 'rebase-merge')) ||
    fs.existsSync(path.join(gitDir, 'rebase-apply'))
  ) {
    process.exit(0)
  }
} catch {
  // ignore
}

const staged = sh('git diff --cached --name-only', { stdio: 'pipe' })
if (!staged) {
  process.exit(0)
}

const hitsSrc = staged
  .split(/\r?\n/)
  .filter(Boolean)
  .some(f => f === 'src' || f.startsWith('src/'))

if (!hitsSrc) {
  process.exit(0)
}

console.error('')
console.error(
  '[husky] main-src gate: main 브랜치에 src/ 변경을 직접 커밋할 수 없습니다.'
)
console.error(
  '  → worktree에서 브랜치 작업 후 PR로 합치세요. AGENTS.md 워크플로 참고.'
)
console.error('  → 긴급 예외만: HUSKY_ALLOW_MAIN_SRC=1 git commit ...')
console.error('')
process.exit(1)
