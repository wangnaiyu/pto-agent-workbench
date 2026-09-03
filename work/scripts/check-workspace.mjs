#!/usr/bin/env node
// Read-only governance checks. No network, model, runtime or Git mutation.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const read = path => readFileSync(path, 'utf8')
const inside = (root, path) => {
  const rel = relative(root, path)
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel)
}

// Inline and reference-style Markdown links; skip fenced/inline code.
// Checks paths, not URL availability or Markdown heading anchors.
export function localLinks(text) {
  let fence = null
  const prose = text.split(/\r?\n/u).filter(line => {
    const marker = /^\s{0,3}(`{3,}|~{3,})/u.exec(line)?.[1]
    if (marker) {
      if (!fence) fence = marker
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null
      return false
    }
    return !fence
  }).join('\n').replace(/(`+)[\s\S]*?\1/gu, '')
  const links = []
  const patterns = [/!?\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\s*\)/gu,
    /^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gmu]
  for (const pattern of patterns) for (const m of prose.matchAll(pattern)) {
    const raw = m[1] ?? m[2]
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/iu.test(raw)) continue
    const path = raw.split(/[?#]/u)[0]
    if (!path) continue
    try { links.push(decodeURIComponent(path)) } catch { links.push(path) }
  }
  return links
}

export function checkLinks(root, files) {
  const errors = []
  for (const file of files) for (const link of localLinks(read(resolve(root, file)))) {
    const target = resolve(dirname(resolve(root, file)), link)
    if (!inside(root, target)) errors.push(`${file}: link escapes repository: ${link}`)
    else if (!existsSync(target)) errors.push(`${file}: missing link target: ${link}`)
  }
  return errors
}

export function checkLegacy(root, manifest) {
  const errors = []
  for (const entry of manifest.files ?? []) {
    const target = resolve(root, entry.archive)
    if (!inside(resolve(root, 'work/archive/legacy-notes'), target)) {
      errors.push(`archive target escapes legacy-notes: ${entry.archive}`)
      continue
    }
    if (!existsSync(target)) { errors.push(`missing archive: ${entry.archive}`); continue }
    const bytes = readFileSync(target)
    if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256)
      errors.push(`archive bytes changed: ${entry.archive}`)
    const headings = bytes.toString('utf8').split('\n').flatMap((line, i) =>
      line.startsWith('## ') ? [{ title: line.slice(3).trim(), line: i + 1 }] : [])
    if (JSON.stringify(headings) !== JSON.stringify(entry.sections.map(({ title, line }) => ({ title, line }))))
      errors.push(`section coverage differs: ${entry.archive}`)
    for (const section of entry.sections) {
      const destination = resolve(root, section.target)
      if (!inside(resolve(root, 'work'), destination) || !existsSync(destination))
        errors.push(`missing/invalid migration destination: ${section.target}`)
    }
    if (existsSync(resolve(root, entry.source))) errors.push(`legacy source still exists: ${entry.source}`)
  }
  return errors
}

export function checkTask(root, task, archived) {
  const errors = []
  for (const name of ['README.md', 'plan.md', 'status.md', 'prompts/resume.md'])
    if (!existsSync(resolve(root, task, name))) errors.push(`${task}: missing ${name}`)
  const path = resolve(root, task, 'status.md')
  if (!existsSync(path)) return errors
  const content = read(path)
  const fields = Object.fromEntries([...content.matchAll(/^- ([a-z-]+):\s*(.+)$/gmu)].map(m => [m[1], m[2]]))
  const states = ['planned', 'active', 'paused', 'blocked', 'completed', 'cancelled']
  if (!states.includes(fields['task-status'])) errors.push(`${task}: invalid task-status`)
  for (const name of ['current-step', 'updated', 'authorization', 'checkpoint', 'next-action', 'blockers', 'verification', 'working-tree'])
    if (!fields[name]) errors.push(`${task}: missing status field ${name}`)
  if (archived && !['completed', 'cancelled'].includes(fields['task-status']))
    errors.push(`${task}: nonterminal task in archive`)
  if (!archived && ['completed', 'cancelled'].includes(fields['task-status']))
    errors.push(`${task}: terminal task must move to archive`)
  if (['completed', 'cancelled'].includes(fields['task-status']) && !existsSync(resolve(root, task, 'final-report.md')))
    errors.push(`${task}: terminal task needs final-report.md`)
  return errors
}

export function checkWorkspace(root = defaultRoot) {
  const errors = []
  const git = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  if (git.status !== 0) throw new Error('Cannot enumerate outer Git workspace')
  const files = [...new Set(git.stdout.split('\0').filter(p => p && existsSync(resolve(root, p))))]
  const manifest = JSON.parse(read(resolve(root, 'work/archive/legacy-notes/migration-manifest.json')))
  const originals = new Set(manifest.files.map(f => f.archive))
  const markdown = files.filter(p => p.endsWith('.md') && !originals.has(p) && !p.startsWith('harness/') && !p.split('/').includes('scratch'))
  errors.push(...checkLinks(root, markdown), ...checkLegacy(root, manifest))
  if (manifest.files.length !== 11 || manifest.files.reduce((n, f) => n + f.sections.length, 0) !== 48)
    errors.push('Expected 11 preserved originals and 48 mapped sections')
  for (const name of ['notes', 'prompts', 'work/INDEX.md'])
    if (existsSync(resolve(root, name))) errors.push(`retired entry exists: ${name}`)
  const nav = read(resolve(root, 'work/README.md'))
  for (const item of readdirSync(resolve(root, 'work/product'), { withFileTypes: true })) {
    if (!item.isDirectory()) continue
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u.test(item.name)) errors.push(`invalid topic name: ${item.name}`)
    const overview = `product/${item.name}/overview.md`
    if (!existsSync(resolve(root, 'work', overview)) || !localLinks(nav).includes(overview))
      errors.push(`topic not indexed or missing overview: ${item.name}`)
  }
  for (const [base, archived] of [['work/inbox/tasks', false], ['work/archive/tasks', true]]) {
    if (!existsSync(resolve(root, base))) continue
    for (const item of readdirSync(resolve(root, base), { withFileTypes: true })) {
      if (!item.isDirectory()) continue
      if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(item.name)) errors.push(`invalid task ID: ${item.name}`)
      errors.push(...checkTask(root, `${base}/${item.name}`, archived))
    }
  }
  if (localLinks(read(resolve(root, 'README.md'))).some(link => link.startsWith('work/')))
    errors.push('Product README links personal development navigation')
  const skill = '.agents/skills/workbench-project-workflow/SKILL.md'
  if (!files.includes(skill)) errors.push('Project Skill is missing or ignored by Git')
  const ignore = read(resolve(root, '.gitignore'))
  for (const path of ['/work/inbox/tasks/*/scratch/', '/work/archive/tasks/*/scratch/'])
    if (!ignore.split('\n').includes(path)) errors.push(`scratch ignore missing: ${path}`)
  const pkg = JSON.parse(read(resolve(root, 'experiments/npm-distribution-spike/package/package.json')))
  if (JSON.stringify(pkg.files) !== JSON.stringify(['bin', 'runtime'])) errors.push('Re-review changed runtime package allowlist')
  return { errors, checkedMarkdown: markdown.length, originals: originals.size, sections: 48 }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = checkWorkspace(process.argv[2] ? resolve(process.argv[2]) : defaultRoot)
    if (result.errors.length) {
      process.stderr.write(result.errors.join('\n') + '\n')
      process.exitCode = 1
    } else process.stdout.write(JSON.stringify(result, null, 2) + '\n')
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1 }
}
