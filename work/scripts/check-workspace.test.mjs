import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createHash } from 'node:crypto'
import { localLinks, checkLinks, checkLegacy, checkTask } from './check-workspace.mjs'

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'pto-workspace-check-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const put = (path, body = '') => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), body)
  }
  return { root, put }
}

test('links: local, angle, encoded, reference; not external or code', () => {
  assert.deepEqual(localLinks('[a](a.md) [b](<two words.md>) [c](a%20b.md#h) [web](https://example.test) `x [n](no.md)`\n[id]: target.md\n```md\n[no](missing.md)\n```'),
    ['a.md', 'two words.md', 'a b.md', 'target.md'])
})

test('links: correct relative target passes; missing and escaping fail', t => {
  const { root, put } = fixture(t)
  put('work/README.md', '[ok](docs/a.md) [bad](absent.md) [escape](../../outside.md)')
  put('work/docs/a.md', 'ok')
  const errors = checkLinks(root, ['work/README.md'])
  assert.equal(errors.length, 2)
  assert.ok(errors.some(e => e.includes('missing link target')))
  assert.ok(errors.some(e => e.includes('escapes repository')))
})

test('archive: detects byte changes and unmapped headings', t => {
  const { root, put } = fixture(t)
  const body = '# old\n\n## A\noriginal\n'
  const archive = 'work/archive/legacy-notes/old.md'
  put(archive, body)
  put('work/docs/a.md', '# current')
  const entry = { source: 'notes/old.md', archive, sha256: createHash('sha256').update(body).digest('hex'),
    sections: [{ title: 'A', line: 3, target: 'work/docs/a.md' }] }
  assert.deepEqual(checkLegacy(root, { files: [entry] }), [])
  put(archive, body + '\n## B\nnew\n')
  const errors = checkLegacy(root, { files: [entry] })
  assert.ok(errors.some(e => e.includes('bytes changed')))
  assert.ok(errors.some(e => e.includes('section coverage')))
})

test('archive: a surviving old source and missing destination fail', t => {
  const { root, put } = fixture(t)
  const body = '## A\n'
  put('notes/old.md', body)
  put('work/archive/legacy-notes/old.md', body)
  const errors = checkLegacy(root, { files: [{ source: 'notes/old.md', archive: 'work/archive/legacy-notes/old.md',
    sha256: createHash('sha256').update(body).digest('hex'), sections: [{ title: 'A', line: 1, target: 'work/missing.md' }] }] })
  assert.ok(errors.some(e => e.includes('legacy source still exists')))
  assert.ok(errors.some(e => e.includes('migration destination')))
})

function taskStatus(state) {
  return `- task-status: ${state}\n` + ['current-step', 'updated', 'authorization', 'checkpoint', 'next-action', 'blockers', 'verification', 'working-tree']
    .map(key => `- ${key}: recorded`).join('\n') + '\n'
}

test('task: planned is valid but cannot be archived as completed', t => {
  const { root, put } = fixture(t)
  const task = 'work/inbox/tasks/2026-09-03-demo'
  for (const name of ['README.md', 'plan.md', 'prompts/resume.md']) put(`${task}/${name}`)
  put(`${task}/status.md`, taskStatus('planned'))
  assert.deepEqual(checkTask(root, task, false), [])
  assert.ok(checkTask(root, task, true).some(e => e.includes('nonterminal')))
  put(`${task}/status.md`, taskStatus('completed'))
  assert.ok(checkTask(root, task, false).some(e => e.includes('must move to archive')))
  assert.ok(checkTask(root, task, true).some(e => e.includes('final-report')))
  put(`${task}/final-report.md`, 'verified')
  assert.deepEqual(checkTask(root, task, true), [])
})

test('task: incomplete handoff is detected', t => {
  const { root, put } = fixture(t)
  put('task/status.md', '- task-status: mystery\n')
  const errors = checkTask(root, 'task', false)
  assert.ok(errors.some(e => e.includes('invalid task-status')))
  assert.ok(errors.some(e => e.includes('authorization')))
  assert.ok(errors.some(e => e.includes('prompts/resume.md')))
})
