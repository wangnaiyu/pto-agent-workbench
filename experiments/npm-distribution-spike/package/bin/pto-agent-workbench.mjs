#!/usr/bin/env node

import { spawn } from 'node:child_process'
import {
  createReadStream,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url))
const PACKAGE_MANIFEST = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'))
const RUNTIME_MANIFEST = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'runtime', 'manifest.json'), 'utf8'))

function fail(message) {
  process.stderr.write(`[pto] ERROR: ${message}\n`)
  process.exit(1)
}

function checkNodeVersion() {
  const [major, minor] = process.versions.node.split('.').map(Number)
  if ((major === 22 && minor >= 19) || major >= 24) return
  fail(`Node.js ${process.versions.node} is unsupported; install Node.js 22.19+ or 24+`)
}

async function sha256(path) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

function runtimeReady(runtimeDir) {
  const marker = join(runtimeDir, '.pto-runtime.json')
  if (!existsSync(marker) || !existsSync(join(runtimeDir, 'lib', 'bin.js'))) return false
  try {
    return JSON.parse(readFileSync(marker, 'utf8')).sha256 === RUNTIME_MANIFEST.sha256
  } catch {
    return false
  }
}

async function prepareRuntime(home) {
  if (RUNTIME_MANIFEST.platform !== process.platform || RUNTIME_MANIFEST.arch !== process.arch) {
    fail(`this package targets ${RUNTIME_MANIFEST.platform}-${RUNTIME_MANIFEST.arch}, current platform is ${process.platform}-${process.arch}`)
  }
  const runtimeParent = join(home, 'runtimes')
  const runtimeDir = join(runtimeParent, `${PACKAGE_MANIFEST.version}-${RUNTIME_MANIFEST.sha256.slice(0, 12)}`)
  if (runtimeReady(runtimeDir)) return runtimeDir

  mkdirSync(runtimeParent, { recursive: true })
  const archive = join(PACKAGE_ROOT, 'runtime', RUNTIME_MANIFEST.archive)
  if (await sha256(archive) !== RUNTIME_MANIFEST.sha256) fail(`runtime archive checksum mismatch: ${archive}`)

  const temporary = mkdtempSync(join(runtimeParent, '.extract-'))
  try {
    process.stdout.write(`[pto] installing prebuilt runtime for ${process.platform}-${process.arch}...\n`)
    const extract = spawn('tar', ['-xzf', archive, '-C', temporary], { stdio: 'inherit' })
    const exitCode = await new Promise((resolveExit, reject) => {
      extract.on('error', reject)
      extract.on('exit', code => resolveExit(code ?? 1))
    })
    if (exitCode !== 0) fail(`runtime extraction failed with exit code ${String(exitCode)}`)
    if (!existsSync(join(temporary, 'lib', 'bin.js'))) fail('runtime archive contains no dsh executable')
    writeFileSync(join(temporary, '.pto-runtime.json'), `${JSON.stringify({ sha256: RUNTIME_MANIFEST.sha256 })}\n`)
    try {
      renameSync(temporary, runtimeDir)
    } catch (error) {
      if (!runtimeReady(runtimeDir)) throw error
    }
  } finally {
    if (existsSync(temporary)) rmSync(temporary, { recursive: true, force: true })
  }
  return runtimeDir
}

function launcherArgs(argv) {
  const args = argv[0] === 'web' ? argv.slice(1) : [...argv]
  if (!args.includes('--port')) args.unshift('--port', '3180')
  return ['web', ...args]
}

checkNodeVersion()
const workbenchHome = resolve(process.env.PTO_WORKBENCH_HOME ?? join(homedir(), '.dsh-pto-workbench'))
const runtimeDir = await prepareRuntime(workbenchHome)

const dshBin = join(runtimeDir, 'lib', 'bin.js')
const environment = { ...process.env, DSH_HOME: workbenchHome }
for (const name of ['DSH_SHELL', 'DSH_SESSION_ID', 'DSH_SESSION_JSONL', 'DSH_WEB_URL']) {
  delete environment[name]
}

const child = spawn(process.execPath, [dshBin, ...launcherArgs(process.argv.slice(2))], {
  env: environment,
  stdio: 'inherit',
})
child.on('error', error => fail(error.message))
child.on('exit', (code, signal) => {
  if (signal === 'SIGINT') process.exit(130)
  if (signal === 'SIGTERM') process.exit(143)
  process.exit(code ?? 1)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
