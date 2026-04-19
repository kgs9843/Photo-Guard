/**
 * 푸시 + GitHub PR 생성 (크로스 플랫폼). `gh` CLI 필요.
 *
 *   npm run pr:open
 *   npm run pr:open -- [branch] [body-file]
 *   npm run pr:open -- --skip-verify
 *   npm run pr:open -- pr-body.local.md
 *
 * 환경변수: PR_BODY_ARCHIVE=1 (SoT 템플릿만 써도 pr-bodies 아카이브)
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    ...opts,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

function shOut(cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
  })
  if (r.status !== 0) return ''
  return (r.stdout || '').trim()
}

function ghPrUrl(branchName) {
  const r = spawnSync(
    'gh',
    [
      'pr',
      'list',
      '--head',
      branchName,
      '--limit',
      '1',
      '--json',
      'url',
      '--jq',
      '.[0].url',
    ],
    { cwd: root, encoding: 'utf8', env: process.env }
  )
  const t = (r.stdout || '').trim()
  if (!t || t === 'null') return ''
  return t
}

function ghExists() {
  const r = spawnSync('gh', ['--version'], {
    cwd: root,
    stdio: 'ignore',
    env: process.env,
  })
  return r.status === 0
}

function utcStampForFilename() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T` +
    `${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  )
}

function utcIsoSeconds() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

function resolveBodyPath(bodyArg) {
  if (!bodyArg) {
    return path.join(root, 'docs', 'workflows', 'pull-request-template.md')
  }
  if (path.isAbsolute(bodyArg)) {
    return bodyArg
  }
  if (/^[A-Za-z]:[\\/]/.test(bodyArg)) {
    return bodyArg
  }
  return path.join(root, bodyArg)
}

function bodySourceForYaml(bodyPath) {
  const rel = path.relative(root, bodyPath)
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
    return rel.split(path.sep).join('/')
  }
  return bodyPath
}

function parseArgs(argv) {
  const skipVerify = argv.includes('--skip-verify')
  const raw = argv.filter(a => a !== '--skip-verify')

  let branch = shOut('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  let bodyArg = ''

  if (raw.length === 0) {
    return { branch, bodyArg: '', skipVerify }
  }

  if (raw.length === 1) {
    const a = raw[0]
    const asFile = path.join(root, a)
    if (a.endsWith('.md') && fs.existsSync(asFile)) {
      return { branch, bodyArg: a, skipVerify }
    }
    return { branch: a, bodyArg: '', skipVerify }
  }

  return { branch: raw[0], bodyArg: raw[1] || '', skipVerify }
}

const argv = process.argv.slice(2)
const { branch, bodyArg, skipVerify } = parseArgs(argv)

if (!branch) {
  console.error('error: could not resolve git branch')
  process.exit(1)
}

if (!ghExists()) {
  console.error('error: gh CLI not installed. https://cli.github.com/')
  process.exit(1)
}

if (!skipVerify) {
  console.error('\n[pr-open] npm run verify (건너뛰려면 --skip-verify)\n')
  const r = spawnSync('npm', ['run', 'verify'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

const bodyPath = resolveBodyPath(bodyArg)
if (!fs.existsSync(bodyPath)) {
  console.error(`error: PR body file not found: ${bodyPath}`)
  process.exit(1)
}

const shouldArchive =
  Boolean(bodyArg) || process.env.PR_BODY_ARCHIVE === '1'

run('git', ['push', '-u', 'origin', branch])
run('gh', [
  'pr',
  'create',
  '--head',
  branch,
  '--title',
  `chore: ${branch}`,
  '--body-file',
  bodyPath,
])

if (shouldArchive) {
  const archiveDir = path.join(root, 'docs', 'workflows', 'pr-bodies')
  fs.mkdirSync(archiveDir, { recursive: true })
  const stamp = utcStampForFilename()
  const safeBranch = branch.replace(/\//g, '-')
  const archivePath = path.join(archiveDir, `${stamp}-${safeBranch}.md`)
  const prUrl = ghPrUrl(branch)
  const bodyText = fs.readFileSync(bodyPath, 'utf8')
  const meta = [
    '---',
    `branch: ${JSON.stringify(branch)}`,
    `body_source: ${JSON.stringify(bodySourceForYaml(bodyPath))}`,
    `archived_at: ${JSON.stringify(utcIsoSeconds())}`,
  ]
  if (prUrl) meta.push(`pr_url: ${JSON.stringify(prUrl)}`)
  meta.push('---', '', bodyText)
  fs.writeFileSync(archivePath, meta.join('\n'), 'utf8')
  console.error(`\narchived: ${archivePath} (commit to keep in repo history)`)
}

console.error(`\nok: opened PR for ${branch} (body-file: ${bodyPath})`)
