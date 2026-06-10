import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

if (!existsSync('.git')) {
  console.log('Git repository is not initialized. After git init, run: pnpm run prepare:hooks')
  process.exit(0)
}

const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  shell: true,
  stdio: 'inherit',
})

if (result.status !== 0) {
  console.error('Could not configure Git hooks path.')
  process.exit(result.status ?? 1)
}

console.log('Git hooks path configured: .githooks')
