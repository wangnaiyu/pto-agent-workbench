// Temporary Git fixture; never stages or commits the real repository.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, unlinkSync, symlinkSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const checker = resolve(dirname(fileURLToPath(import.meta.url)), '../../.githooks/check-secrets.mjs')
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'pto-secret-contract-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
  }
  git('init', '-q')
  const scan = () => spawnSync(process.execPath, [checker, '--working-tree'], { cwd: root, encoding: 'utf8' })
  return { root, git, scan }
}

test('secret checker accepts migrated tracked files and still scans new destinations', t => {
  const { root, git, scan } = fixture(t)
  writeFileSync(join(root, 'old.md'), 'safe content')
  git('add', '--', 'old.md')
  unlinkSync(join(root, 'old.md'))
  writeFileSync(join(root, 'new.md'), 'safe content')
  const result = scan()
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /scanned 1 working-tree file/u)
})

test('secret checker blocks synthetic token in an untracked migration destination without disclosing it', t => {
  const { root, git, scan } = fixture(t)
  writeFileSync(join(root, 'old.md'), 'safe content')
  git('add', '--', 'old.md')
  unlinkSync(join(root, 'old.md'))
  const synthetic = 'sk-' + 'Z'.repeat(32)
  writeFileSync(join(root, 'new.md'), synthetic)
  const result = scan()
  assert.equal(result.status, 1)
  assert.match(result.stderr, /new.md: model-provider API key/u)
  assert.ok(!result.stderr.includes(synthetic))
})

test('secret checker still fails closed on unreadable non-deleted entries', t => {
  const { root, scan } = fixture(t)
  symlinkSync('missing-target', join(root, 'broken.md'))
  const result = scan()
  assert.equal(result.status, 1)
  assert.match(result.stderr, /broken.md: could not inspect/u)
})
