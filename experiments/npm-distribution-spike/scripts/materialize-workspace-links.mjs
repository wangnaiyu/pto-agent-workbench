import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function isInside(root, target) {
  const path = relative(root, target)
  return path === '' || (!path.startsWith('..') && !isAbsolute(path))
}

function publishedTopLevelEntries(packageDir) {
  const manifestPath = join(packageDir, 'package.json')
  if (!existsSync(manifestPath)) throw new Error(`workspace link target has no package.json: ${packageDir}`)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const entries = new Set(['package.json'])
  if (!Array.isArray(manifest.files)) throw new Error(`workspace package declares no files list: ${manifestPath}`)
  for (const pattern of manifest.files) {
    if (typeof pattern !== 'string' || pattern.startsWith('!')) continue
    const normalized = pattern.replace(/^\.\//u, '')
    const segment = normalized.split('/')[0]
    if (segment !== '' && !segment.includes('*')) entries.add(segment)
  }
  return [...entries]
}

function copyPublishedPackage(source, destination) {
  mkdirSync(destination, { recursive: true })
  for (const entry of publishedTopLevelEntries(source)) {
    const from = join(source, entry)
    if (!existsSync(from)) continue
    cpSync(from, join(destination, entry), { recursive: true, dereference: false })
  }
}

function workspacePackages(harnessRoot) {
  const roots = ['apps', 'packages', 'vendor', 'native']
  const packages = new Map()
  const visit = path => {
    if (!existsSync(path)) return
    const manifestPath = join(path, 'package.json')
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
      if (typeof manifest.name === 'string') packages.set(manifest.name, path)
    }
    for (const name of readdirSync(path)) {
      if (name === 'node_modules' || name === '.git' || name === 'lib' || name === 'dist') continue
      const child = join(path, name)
      if (lstatSync(child).isDirectory()) visit(child)
    }
  }
  for (const root of roots) visit(join(harnessRoot, root))
  return packages
}

function installedPackageDirs(runtimeRoot) {
  const dirs = []
  const virtualStore = join(runtimeRoot, 'node_modules', '.pnpm')
  for (const entry of readdirSync(virtualStore)) {
    const dependencyRoot = join(virtualStore, entry, 'node_modules')
    if (!existsSync(dependencyRoot)) continue
    for (const name of readdirSync(dependencyRoot)) {
      const path = join(dependencyRoot, name)
      if (lstatSync(path).isSymbolicLink() || !lstatSync(path).isDirectory()) continue
      if (name.startsWith('@')) {
        for (const scopedName of readdirSync(path)) {
          const packageDir = join(path, scopedName)
          if (existsSync(join(packageDir, 'package.json'))) dirs.push({ dependencyRoot, packageDir })
        }
      } else if (existsSync(join(path, 'package.json'))) {
        dirs.push({ dependencyRoot, packageDir: path })
      }
    }
  }
  return dirs
}

function materializeMissingWorkspacePeers(runtimeRoot, harnessRoot) {
  const sources = workspacePackages(harnessRoot)
  let copied = 0
  for (;;) {
    let added = 0
    for (const { dependencyRoot, packageDir } of installedPackageDirs(runtimeRoot)) {
      const manifestPath = join(packageDir, 'package.json')
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
      for (const peer of Object.keys(manifest.peerDependencies ?? {})) {
        if (manifest.peerDependenciesMeta?.[peer]?.optional === true) continue
        try {
          createRequire(manifestPath).resolve(peer)
          continue
        } catch {
          // Materialize a missing in-workspace peer below.
        }
        const source = sources.get(peer)
        if (source === undefined) {
          throw new Error(`${manifest.name ?? manifestPath} has unresolved external peer ${peer}`)
        }
        const destination = join(dependencyRoot, ...peer.split('/'))
        if (existsSync(destination)) continue
        copyPublishedPackage(source, destination)
        added += 1
        copied += 1
      }
    }
    if (added === 0) return copied
  }
}

function flattenInternalPackages(runtimeRoot) {
  let linked = 0
  for (const { packageDir } of installedPackageDirs(runtimeRoot)) {
    const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
    if (typeof manifest.name !== 'string' || !manifest.name.startsWith('@deepseek-ai/')) continue
    const destination = join(runtimeRoot, 'node_modules', ...manifest.name.split('/'))
    if (existsSync(destination)) continue
    mkdirSync(dirname(destination), { recursive: true })
    symlinkSync(relative(dirname(destination), packageDir), destination, 'junction')
    linked += 1
  }
  return linked
}

function symlinksUnder(root) {
  const links = []
  const visit = path => {
    const stat = lstatSync(path)
    if (stat.isSymbolicLink()) {
      links.push(path)
      return
    }
    if (!stat.isDirectory()) return
    for (const name of readdirSync(path)) visit(join(path, name))
  }
  visit(root)
  return links
}

export function materializeWorkspaceLinks(runtimeRoot, harnessRoot) {
  const root = resolve(runtimeRoot)
  let copied = 0
  for (const link of symlinksUnder(root)) {
    const target = resolve(dirname(link), readlinkSync(link))
    if (isInside(root, target)) continue
    unlinkSync(link)
    copyPublishedPackage(target, link)
    copied += 1
  }

  const remaining = symlinksUnder(root).filter(link => {
    const target = resolve(dirname(link), readlinkSync(link))
    return !isInside(root, target)
  })
  if (remaining.length > 0) {
    throw new Error(`runtime still contains ${String(remaining.length)} external symlink(s): ${remaining[0]}`)
  }
  const peers = materializeMissingWorkspacePeers(root, resolve(harnessRoot))
  const flatLinks = flattenInternalPackages(root)
  writeFileSync(join(root, '.pto-materialized.json'), `${JSON.stringify({ formatVersion: 1, copied, peers, flatLinks })}\n`)
  return { copied, peers, flatLinks }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const runtimeRoot = process.argv[2]
  const harnessRoot = process.argv[3]
  if (runtimeRoot === undefined) throw new Error('usage: materialize-workspace-links.mjs <runtime-root>')
  if (harnessRoot === undefined) throw new Error('usage: materialize-workspace-links.mjs <runtime-root> <harness-root>')
  const result = materializeWorkspaceLinks(runtimeRoot, harnessRoot)
  process.stdout.write(`materialized ${String(result.copied)} workspace link(s), ${String(result.peers)} peer package(s), and ${String(result.flatLinks)} flat package link(s)\n`)
}
