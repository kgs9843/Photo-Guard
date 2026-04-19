/**
 * 커밋/CI 공통 검증 (크로스 플랫폼).
 * bash 없이 Node만으로 실행됩니다. (린트·포맷·타입·빌드·FSD 경계)
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
process.chdir(root)

const sh = cmd => {
  console.log(`\n== ${cmd} ==`)
  execSync(cmd, { stdio: 'inherit', shell: true, env: process.env })
}

if (!fs.existsSync(path.join(root, 'node_modules'))) {
  sh('npm install')
}

sh('npm run lint')
sh('npm run format:check')
sh('npm run type-check')
sh('npm run build')

const walk = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p)
  }
  return acc
}

const forbidden = ['pages', 'features', 'widgets', 'entities', 'processes']
const sharedRoot = path.join(root, 'src', 'shared')
for (const f of walk(sharedRoot)) {
  const text = fs.readFileSync(f, 'utf8')
  for (const layer of forbidden) {
    const re = new RegExp(`from\\s+['"]@/${layer}`, 'm')
    if (re.test(text)) {
      console.error(
        `error: FSD violation in ${f}: shared must not import @/${layer}`
      )
      process.exit(1)
    }
  }
}

console.log('\nverify-task: OK')
