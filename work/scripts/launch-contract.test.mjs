// Isolated launcher contract only: fake CLI prints arguments/env, never starts DSH.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
function fixture(t, withPatch = true) {
  const root = mkdtempSync(join(tmpdir(), 'pto-launch-contract-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  copyFileSync(join(repository, 'start.sh'), join(root, 'start.sh'))
  mkdirSync(join(root, 'harness/apps/cli/lib'), { recursive: true })
  mkdirSync(join(root, 'patches'), { recursive: true })
  if (withPatch) copyFileSync(join(repository, 'patches/cordis.patch.yml'), join(root, 'patches/cordis.patch.yml'))
  writeFileSync(join(root, 'harness/apps/cli/lib/bin.js'), `console.log(JSON.stringify({args: process.argv.slice(2), root: process.env.PTO_WORKBENCH_ROOT, data: process.env.DSH_HOME, inherited: ['DSH_SHELL','DSH_SESSION_ID','DSH_SESSION_JSONL','DSH_WEB_URL'].filter(k=>process.env[k]!==undefined)}))`)
  return root
}

for (const port of [undefined, '4180']) test(`launcher resolves its own root and port ${port ?? 'default'}`, t => {
  const root = fixture(t)
  const run = spawnSync('bash', [join(root, 'start.sh'), ...(port ? [port] : [])], {
    cwd: tmpdir(), encoding: 'utf8', env: { ...process.env, DSH_HOME: '/not-used', DSH_SHELL: 'inherited',
      DSH_SESSION_ID: 'inherited', DSH_SESSION_JSONL: 'inherited', DSH_WEB_URL: 'inherited' },
  })
  assert.equal(run.status, 0, run.stderr)
  const output = JSON.parse(run.stdout.trim().split('\n').at(-1))
  assert.equal(output.root, root)
  assert.equal(output.data, join(process.env.HOME ?? homedir(), '.dsh-pto-workbench'))
  assert.deepEqual(output.inherited, [])
  assert.deepEqual(output.args, ['web', '--patch', join(root, 'patches/cordis.patch.yml'), '--port', port ?? '3180'])
})

test('launcher refuses missing patch before fake CLI execution', t => {
  const root = fixture(t, false)
  const run = spawnSync('bash', [join(root, 'start.sh')], { cwd: tmpdir(), encoding: 'utf8' })
  assert.equal(run.status, 1)
  assert.match(run.stderr, /未找到工作台 patch/u)
  assert.doesNotMatch(run.stdout, /"args"/u)
})

test('runtime profile stays rooted in product bundled skills', () => {
  const patch = readFileSync(join(repository, 'patches/cordis.patch.yml'), 'utf8')
  assert.match(patch, /PTO_WORKBENCH_ROOT/u)
  assert.match(patch, /skills\/bundled/u)
  assert.doesNotMatch(patch, /\.agents\/skills|work\/product/u)
})
