import { existsSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { materializeWorkspaceLinks } from './materialize-workspace-links.mjs'

const SPIKE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WORKBENCH_ROOT = resolve(SPIKE_ROOT, '..', '..')
const HARNESS_ROOT = join(WORKBENCH_ROOT, 'harness')
const RUNTIME_ROOT = join(SPIKE_ROOT, 'runtime-cache', 'dsh-deploy')

if (!existsSync(join(HARNESS_ROOT, '.git'))) throw new Error(`missing harness checkout at ${HARNESS_ROOT}`)
rmSync(RUNTIME_ROOT, { recursive: true, force: true })

const result = spawnSync('pnpm', [
  '--filter', '@deepseek-ai/dsh', '--prod', 'deploy', '--legacy', RUNTIME_ROOT,
], {
  cwd: HARNESS_ROOT,
  stdio: 'inherit',
})
if (result.error !== undefined) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
const materialized = materializeWorkspaceLinks(RUNTIME_ROOT, HARNESS_ROOT)
process.stdout.write(`prepare-runtime: materialized ${String(materialized.copied)} workspace link(s), ${String(materialized.peers)} peer package(s), and ${String(materialized.flatLinks)} flat package link(s)\n`)
