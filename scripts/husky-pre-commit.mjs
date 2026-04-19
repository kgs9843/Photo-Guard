/**
 * pre-commit 단계 게이트: 이전 단계가 실패하면 다음 단계를 실행하지 않습니다.
 * 1) lint-staged  2) main+src 차단  3) npm run verify
 */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function run(label, cmd) {
  console.error(`\n[husky] ${label}`)
  execSync(cmd, { stdio: 'inherit', cwd: root, env: process.env, shell: true })
}

try {
  run('1/3 lint-staged (실패 시 이후 단계 없음)', 'npx lint-staged')
  run('2/3 main-src gate', 'node scripts/git-main-src-gate.mjs')
  run('3/3 verify', 'npm run verify')
} catch {
  process.exit(1)
}
