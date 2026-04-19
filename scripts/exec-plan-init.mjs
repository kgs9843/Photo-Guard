/**
 * 실행 계획 + git worktree + .dev-port + .exec-logs (크로스 플랫폼).
 * PowerShell / cmd / macOS / Linux에서 Node만으로 실행합니다.
 *
 * 사용: node scripts/exec-plan-init.mjs <slug>
 *       npm run exec-plan-init -- <slug>
 *
 * 환경변수: BASE_BRANCH (기본 main), PHOTO_GUARD_WORKTREE_ROOT (기본 <repo>/../photo-guard-worktrees)
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const slug = process.argv[2] ?? ''

if (!slug) {
  console.error('usage: node scripts/exec-plan-init.mjs <slug>')
  console.error('  example: node scripts/exec-plan-init.mjs fix-history-dedupe')
  console.error('  or: npm run exec-plan-init -- fix-history-dedupe')
  process.exit(1)
}

if (!/^[a-zA-Z0-9._-]+$/.test(slug)) {
  console.error('error: slug must be [a-zA-Z0-9._-] only')
  process.exit(1)
}

const baseBranch = process.env.BASE_BRANCH || 'main'
const wtParent = path.resolve(
  process.env.PHOTO_GUARD_WORKTREE_ROOT ||
    path.join(root, '..', 'photo-guard-worktrees')
)
const wtPath = path.join(wtParent, slug)
const branch = `exec-plan/${slug}`
const docsPlan = path.join(root, 'docs', 'exec-plans', 'active', `exec-plan-${slug}.md`)

const port = 5200 + ((slug.length * 37 + 17) % 800)

function git(args, opts = {}) {
  const r = spawnSync('git', args, {
    cwd: root,
    stdio: opts.stdio ?? 'inherit',
    env: process.env,
  })
  if (opts.allowFail) return r
  if (r.status !== 0) process.exit(r.status ?? 1)
  return r
}

function refExists(ref) {
  const r = spawnSync('git', ['show-ref', '--verify', '--quiet', ref], {
    cwd: root,
    stdio: 'ignore',
    env: process.env,
  })
  return r.status === 0
}

fs.mkdirSync(wtParent, { recursive: true })
fs.mkdirSync(path.join(root, 'docs', 'exec-plans', 'active'), { recursive: true })

if (fs.existsSync(wtPath)) {
  console.error(`error: worktree path already exists: ${wtPath}`)
  process.exit(1)
}

git(['fetch', 'origin', baseBranch], { stdio: 'pipe', allowFail: true })

if (refExists(`refs/heads/${branch}`)) {
  console.error(
    `error: branch already exists locally: ${branch} (remove or pick another slug)`
  )
  process.exit(1)
}

const baseRef = refExists(`refs/heads/${baseBranch}`) ? baseBranch : null
if (!baseRef) {
  console.warn(`warn: local branch ${baseBranch} missing; using HEAD`)
}

const worktreeArgs = ['worktree', 'add', wtPath, '-b', branch]
if (baseRef) {
  worktreeArgs.push(baseRef)
} else {
  worktreeArgs.push('HEAD')
}
git(worktreeArgs)

const execLogs = path.join(wtPath, '.exec-logs')
fs.mkdirSync(execLogs, { recursive: true })
fs.writeFileSync(path.join(wtPath, '.dev-port'), `${port}\n`, 'utf8')

const created = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
const meta = [
  `worktree=${wtPath}`,
  `branch=${branch}`,
  `port=${port}`,
  `created=${created}`,
].join('\n')
fs.writeFileSync(path.join(wtPath, '.exec-meta'), `${meta}\n`, 'utf8')

/** Markdown-friendly path (avoid unescaped backslashes in fenced content) */
const mdPath = p => p.split(path.sep).join('/')

const wtMd = mdPath(wtPath)
const planBody = `# 실행 계획: ${slug}

## 메타
- **slug**: \`${slug}\`
- **브랜치**: \`${branch}\`
- **워크트리**: \`${wtMd}\`
- **프리뷰 포트(제안)**: \`${port}\` (\`npm run dev -- --port ${port}\` 등)
- **로그 디렉터리**: \`${wtMd}/.exec-logs\`

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
  - \`git worktree remove "${wtMd}"\`
  - \`git branch -D ${branch}\` (병합되지 않은 경우)
`

fs.writeFileSync(path.join(wtPath, 'EXEC_PLAN.md'), planBody, 'utf8')
fs.writeFileSync(docsPlan, planBody, 'utf8')

console.log('')
console.log('ok: exec plan + worktree ready')
console.log(`  docs: ${docsPlan}`)
console.log(`  worktree: ${wtPath}`)
console.log(`  branch: ${branch}`)
console.log(`  port: ${port} (saved to ${path.join(wtPath, '.dev-port')})`)
console.log(`  logs: ${execLogs}`)
console.log('')
console.log('Next:')
console.log(`  cd "${wtPath}"`)
console.log('  npm install')
console.log(`  npm run dev -- --port ${port}`)
console.log(`Optional (gh): bash scripts/pr-open.sh ${branch}`)
