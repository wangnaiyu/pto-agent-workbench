import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SPIKE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tarball = readFileSync(join(SPIKE_ROOT, 'dist', 'tarball-path.txt'), 'utf8').trim()
const smokeRoot = mkdtempSync(join(tmpdir(), 'pto-npx-smoke-'))
const home = join(smokeRoot, 'home')
let output = ''
let child

function signalChild(signal) {
  if (child?.exitCode !== null || child.pid === undefined) return
  if (process.platform === 'win32') child.kill(signal)
  else process.kill(-child.pid, signal)
}

async function stop() {
  signalChild('SIGTERM')
  await Promise.race([
    new Promise(resolveExit => {
      if (child === undefined || child.exitCode !== null) resolveExit()
      else child.once('exit', resolveExit)
    }),
    new Promise(resolveTimeout => setTimeout(resolveTimeout, 5_000)),
  ])
  if (child?.exitCode === null) signalChild('SIGKILL')
}

try {
  child = spawn('npm', [
    'exec', '--yes', '--offline', '--loglevel=info', `--package=${tarball}`, '--',
    'pto-agent-workbench', 'web', '--no-open', '--port', '0',
  ], {
    cwd: smokeRoot,
    env: {
      ...process.env,
      PTO_WORKBENCH_HOME: home,
      DSH_TELEMETRY_DISABLED: '1',
      NPM_CONFIG_CACHE: join(smokeRoot, 'npm-cache'),
      NPM_CONFIG_UPDATE_NOTIFIER: 'false',
    },
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', chunk => { output += chunk; process.stdout.write(chunk) })
  child.stderr.on('data', chunk => { output += chunk; process.stderr.write(chunk) })

  const url = await new Promise((resolveUrl, reject) => {
    const timeout = setTimeout(() => reject(new Error(`server did not start within 180s\n${output}`)), 180_000)
    const inspect = () => {
      const match = output.match(/dsh web: (http:\/\/127\.0\.0\.1:\d+)/u)
      if (match === null) return
      clearTimeout(timeout)
      resolveUrl(match[1])
    }
    child.stdout.on('data', inspect)
    child.stderr.on('data', inspect)
    child.on('exit', code => {
      clearTimeout(timeout)
      reject(new Error(`launcher exited before readiness with code ${String(code)}\n${output}`))
    })
  })

  const response = await fetch(url)
  const html = await response.text()
  if (!response.ok) throw new Error(`GET ${url} returned ${String(response.status)}`)
  if (!html.includes('<title>PTO Agent 工作台</title>')) {
    throw new Error('served frontend is not the PTO Agent workbench build')
  }
  process.stdout.write(`smoke: PASS ${url} served the PTO build from one npm exec command\n`)
} finally {
  await stop()
  rmSync(smokeRoot, { recursive: true, force: true })
}
