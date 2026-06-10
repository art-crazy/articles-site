import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const maxLines = 300
const strict = process.argv.includes('--strict')

const checkedExtensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mjs',
  '.scss',
  '.ts',
  '.tsx',
])

const ignoredDirectories = new Set([
  '.git',
  '.githooks',
  '.idea',
  '.next',
  '.vscode',
  'coverage',
  'dist',
  'media',
  'node_modules',
])

const ignoredFiles = new Set([
  'next-env.d.ts',
  'pnpm-lock.yaml',
  'src/app/(payload)/admin/importMap.js',
  'src/payload-types.ts',
])

const toPosix = (filePath) => filePath.split(path.sep).join('/')

const countLines = (content) => {
  if (content.length === 0) {
    return 0
  }

  const trailingNewline = content.endsWith('\n') ? 1 : 0
  return content.split(/\r\n|\r|\n/).length - trailingNewline
}

const shouldCheckFile = (relativePath) => {
  if (ignoredFiles.has(relativePath)) {
    return false
  }

  if (/^src\/migrations\/.+\.json$/.test(relativePath)) {
    return false
  }

  return checkedExtensions.has(path.extname(relativePath))
}

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    const relativePath = toPosix(path.relative(root, fullPath))

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await walk(fullPath)))
      }

      continue
    }

    if (entry.isFile() && shouldCheckFile(relativePath)) {
      files.push({ fullPath, relativePath })
    }
  }

  return files
}

const files = await walk(root)
const tooLargeFiles = []

for (const file of files) {
  const content = await readFile(file.fullPath, 'utf8')
  const lines = countLines(content)

  if (lines > maxLines) {
    tooLargeFiles.push({ ...file, lines })
  }
}

if (tooLargeFiles.length === 0) {
  console.log(`File length check: all checked files are ${maxLines} lines or shorter.`)
  process.exit(0)
}

const title = strict ? 'File length check failed' : 'File length recommendation'

console.warn(`${title}: keep files at ${maxLines} lines or shorter.`)

for (const file of tooLargeFiles) {
  console.warn(`- ${file.relativePath}: ${file.lines} lines`)
}

if (!strict) {
  console.warn('Advisory mode: commit is not blocked. Use --strict to fail on this check.')
  process.exit(0)
}

process.exit(1)
