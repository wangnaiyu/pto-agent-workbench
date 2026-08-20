import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const SPIKE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WORKBENCH_ROOT = resolve(SPIKE_ROOT, '..', '..')
const HARNESS_ROOT = join(WORKBENCH_ROOT, 'harness')
const TEMPLATE_ROOT = join(SPIKE_ROOT, 'package')
const RUNTIME_ROOT = join(SPIKE_ROOT, 'runtime-cache', 'dsh-deploy')
const DIST_ROOT = join(SPIKE_ROOT, 'dist')
const STAGE_ROOT = join(DIST_ROOT, 'package')
const PACK_ROOT = join(DIST_ROOT, 'pack')

function fail(message) {
  throw new Error(`build-package: ${message}`)
}

if (!existsSync(join(HARNESS_ROOT, '.git'))) fail(`missing harness checkout at ${HARNESS_ROOT}`)
if (!existsSync(join(RUNTIME_ROOT, 'lib', 'bin.js'))) fail('missing runtime-cache; run npm run prepare-runtime first')
const virtualStore = join(RUNTIME_ROOT, 'node_modules', '.pnpm')
const frontendEntry = readdirSync(virtualStore).find(name => name.startsWith('@deepseek-ai+dsh-web-frontend@'))
if (frontendEntry === undefined) fail('prepared runtime contains no dsh-web-frontend package')
const deployedFrontend = join(
  virtualStore,
  frontendEntry,
  'node_modules',
  '@deepseek-ai',
  'dsh-web-frontend',
  'dist',
  'index.html',
)
if (!existsSync(deployedFrontend) || !readFileSync(deployedFrontend, 'utf8').includes('<title>PTO Agent 工作台</title>')) {
  fail('prepared runtime is not a PTO Agent workbench build')
}

rmSync(DIST_ROOT, { recursive: true, force: true })
mkdirSync(PACK_ROOT, { recursive: true })
cpSync(TEMPLATE_ROOT, STAGE_ROOT, { recursive: true })
const stageManifestPath = join(STAGE_ROOT, 'package.json')
const stageManifest = JSON.parse(readFileSync(stageManifestPath, 'utf8'))
stageManifest.os = [process.platform]
stageManifest.cpu = [process.arch]
writeFileSync(stageManifestPath, `${JSON.stringify(stageManifest, null, 2)}\n`)

const runtimeDir = join(STAGE_ROOT, 'runtime')
mkdirSync(runtimeDir, { recursive: true })
const archiveName = `dsh-${process.platform}-${process.arch}.tar.gz`
const archive = join(runtimeDir, archiveName)
execFileSync('tar', ['-czf', archive, '-C', RUNTIME_ROOT, '.'], { stdio: 'inherit' })
const archiveBytes = readFileSync(archive)
writeFileSync(join(runtimeDir, 'manifest.json'), `${JSON.stringify({
  formatVersion: 1,
  platform: process.platform,
  arch: process.arch,
  archive: archiveName,
  sha256: createHash('sha256').update(archiveBytes).digest('hex'),
  compressedBytes: archiveBytes.byteLength,
}, null, 2)}\n`)

const output = execFileSync('npm', ['pack', '--pack-destination', PACK_ROOT], {
  cwd: STAGE_ROOT,
  env: { ...process.env, NPM_CONFIG_CACHE: join(DIST_ROOT, '.npm-cache') },
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
}).trim()
const tarball = join(PACK_ROOT, basename(output.split(/\r?\n/u).at(-1)))
writeFileSync(join(DIST_ROOT, 'tarball-path.txt'), `${tarball}\n`)
process.stdout.write(`${tarball}\n`)
