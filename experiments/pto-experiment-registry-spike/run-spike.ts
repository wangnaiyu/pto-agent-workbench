import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import LocalFileSystem from '../../harness/packages/fs/fs-local/src/index.ts'
import { CallId } from '../../harness/packages/llm/llm/src/index.ts'
import Storage from '../../harness/packages/storage/storage/src/index.ts'
import * as StorageDomain from '../../harness/packages/storage/storage-domain/src/index.ts'
import * as StorageJson from '../../harness/packages/storage/storage-json/src/index.ts'
import { AGENT_A, setup } from '../../harness/packages/extensions/cordis-host-runner/tests/helpers.ts'

interface ExperimentRecord {
  id: string
  status: 'planned' | 'authorized' | 'running' | 'completed' | 'failed' | 'cancelled'
  revision: number
  workspacePath: string
  baseline: { path: string; kind: 'l2' | 'l3'; marker: string; identityStatus: string }
  source: { path: string; identity: { status: string; trust: string } }
  environment: { identity: { status: string; trust: string } }
  candidateOutput: { path: string; precondition: string }
  authorization: null | { actor: string; receiptRef: string; trust: string }
  actualRun: null | { path: string; kind: 'l2' | 'l3'; identityStatus: string }
  events: Array<{ revision: number; type: string; state: string }>
}

async function main(): Promise<void> {
  const temporary = await mkdtemp(join(tmpdir(), 'pto-experiment-registry-spike-'))
  const workspace = join(temporary, 'workspace')
  const source = join(workspace, 'operator-source')
  const baseline = join(workspace, 'captured-baseline')
  const storageRoot = join(temporary, 'app-state')
  const candidate = join(source, 'build_output', 'candidate-1')
  await mkdir(source, { recursive: true })
  await mkdir(baseline, { recursive: true })
  await writeFile(join(baseline, 'kernel_config.py'), '# L2 marker\n')

  const hostCode = await readFile(fileURLToPath(new URL('./host.js', import.meta.url)), 'utf8')
  const harness = await setup()
  const { ctx, runner } = harness
  try {
    await ctx.plugin(Storage)
    await ctx.plugin(StorageJson, { root: storageRoot })
    await ctx.plugin(StorageDomain, { backend: 'json' })
    await ctx.plugin(LocalFileSystem, { cwd: workspace })
    ;(AGENT_A as unknown as { session: { header: { cwd: string } } }).session = { header: { cwd: workspace } }

    const { pluginId, packageId } = runner.define({
      sessionId: AGENT_A.id,
      plugin: { kind: 'new', idPrefix: 'ptoexp' },
      name: 'PTO experiment registry spike',
      purpose: 'Validate durable experiment identity and guarded state transitions without executing a workload',
      code: { host: hostCode },
    })
    const firstRun = await runner.run(AGENT_A, pluginId, packageId, 'run')
    if (!firstRun.ok) throw new Error(firstRun.message)
    assert.equal(firstRun.ok, true)

    let calls = 0
    const call = async (name: string, arguments_: unknown): Promise<ExperimentRecord | ExperimentRecord[]> => {
      const result = await ctx.tools.execute({
        name,
        arguments: arguments_,
        callId: CallId(`pto-experiment-${++calls}`),
        signal: new AbortController().signal,
        agent: AGENT_A,
      })
      assert.equal(result.isError, false, result.content.map(block => block.type === 'text' ? block.text : '').join(''))
      return result.value as unknown as ExperimentRecord | ExperimentRecord[]
    }
    const callFails = async (name: string, arguments_: unknown, pattern: RegExp): Promise<void> => {
      const result = await ctx.tools.execute({
        name,
        arguments: arguments_,
        callId: CallId(`pto-experiment-${++calls}`),
        signal: new AbortController().signal,
        agent: AGENT_A,
      })
      assert.equal(result.isError, true)
      assert.match(result.content.map(block => block.type === 'text' ? block.text : '').join(''), pattern)
    }
    const invoke = async (runId: string, method: string, args: Record<string, unknown>): Promise<ExperimentRecord> => {
      const result = await runner.invoke(pluginId, runId as never, method, args as never)
      if (!result.ok) throw new Error(result.message)
      assert.equal(result.ok, true)
      return result.value as unknown as ExperimentRecord
    }
    const invokeFails = async (runId: string, method: string, args: Record<string, unknown>, pattern: RegExp): Promise<void> => {
      const result = await runner.invoke(pluginId, runId as never, method, args as never)
      assert.equal(result.ok, false)
      if (result.ok) throw new Error('expected invoke failure')
      assert.match(result.message, pattern)
    }

    assert.deepEqual(ctx.tools.schemas(AGENT_A).map(schema => schema.name).filter(name => name.startsWith('pto_experiment_')), [
      'pto_experiment_plan',
      'pto_experiment_get',
      'pto_experiment_list',
    ])

    const planned = await call('pto_experiment_plan', {
      source_workspace_path: source,
      baseline_run_path: baseline,
      candidate_output_path: candidate,
      declared_change: 'Change one tiling choice while retaining the baseline inputs.',
      evidence_refs: ['analysis#claim-3'],
      stop_conditions: 'Stop on compile/runtime failure or correctness guard failure.',
      rollback_plan: 'Discard the candidate working copy and retain the immutable baseline.',
    }) as ExperimentRecord
    assert.equal(planned.status, 'planned')
    assert.equal(planned.revision, 0)
    assert.equal(planned.baseline.kind, 'l2')
    assert.equal(planned.baseline.identityStatus, 'unverified')
    assert.equal(planned.source.identity.status, 'unverified')
    assert.equal(planned.candidateOutput.precondition, 'absent-observed')
    assert.equal(planned.authorization, null)

    await callFails('pto_experiment_plan', {
      source_workspace_path: source,
      baseline_run_path: baseline,
      candidate_output_path: candidate,
      declared_change: 'Duplicate output reservation.',
      evidence_refs: [],
      stop_conditions: 'Stop.',
      rollback_plan: 'Rollback.',
    }, /already owned/)
    await callFails('pto_experiment_plan', {
      source_workspace_path: source,
      baseline_run_path: baseline,
      candidate_output_path: baseline,
      declared_change: 'Overwrite baseline.',
      evidence_refs: [],
      stop_conditions: 'Stop.',
      rollback_plan: 'Rollback.',
    }, /candidate output must stay inside source|disjoint/)

    await invokeFails(firstRun.pluginRunId, 'authorize', {
      experimentId: planned.id,
      expectedRevision: 0,
      actor: 'user-1',
      receiptRef: 'session:S-a/message:10',
    }, /identities must be verified/)

    const identified = await invoke(firstRun.pluginRunId, 'bind-identities', {
      experimentId: planned.id,
      expectedRevision: 0,
      source: {
        value: 'repo:operator@commit:abc123+clean',
        adapter: 'git-worktree-spike',
        evidence: ['git-head:abc123', 'git-dirty:false'],
      },
      environment: {
        value: 'pypto:4fde258f|runtime:799640e6|platform:a2a3sim',
        adapter: 'environment-spike',
        evidence: ['pypto-head:4fde258f', 'runtime-head:799640e6'],
      },
    })
    assert.equal(identified.status, 'planned')
    assert.equal(identified.revision, 1)
    assert.equal(identified.source.identity.trust, 'spike-simulated')

    await invokeFails(firstRun.pluginRunId, 'authorize', {
      experimentId: planned.id,
      expectedRevision: 0,
      actor: 'user-1',
      receiptRef: 'session:S-a/message:10',
    }, /stale experiment revision/)
    const authorized = await invoke(firstRun.pluginRunId, 'authorize', {
      experimentId: planned.id,
      expectedRevision: 1,
      actor: 'user-1',
      receiptRef: 'session:S-a/message:10',
    })
    assert.equal(authorized.status, 'authorized')
    assert.equal(authorized.authorization?.trust, 'spike-simulated')

    const running = await invoke(firstRun.pluginRunId, 'begin', {
      experimentId: planned.id,
      expectedRevision: 2,
    })
    assert.equal(running.status, 'running')
    assert.equal(running.candidateOutput.precondition, 'absent-rechecked')

    await mkdir(candidate, { recursive: true })
    await writeFile(join(candidate, 'kernel_config.py'), '# candidate L2 marker\n')
    const completed = await invoke(firstRun.pluginRunId, 'complete', {
      experimentId: planned.id,
      expectedRevision: 3,
      actualRunPath: candidate,
    })
    assert.equal(completed.status, 'completed')
    assert.equal(completed.revision, 4)
    assert.equal(completed.actualRun?.identityStatus, 'registry-bound')
    assert.deepEqual(completed.events.map(item => item.type), [
      'planned',
      'identities-bound',
      'authorized',
      'execution-started',
      'execution-completed',
    ])
    await invokeFails(firstRun.pluginRunId, 'cancel', {
      experimentId: planned.id,
      expectedRevision: 4,
      actor: 'user-1',
      reason: 'too late',
    }, /status completed/)

    const listed = await call('pto_experiment_list', {}) as ExperimentRecord[]
    assert.deepEqual(listed.map(record => record.id), [planned.id])

    await runner.stop(AGENT_A, pluginId)
    const persistedText = await readFile(join(storageRoot, 'pto_experiment_spike.json'), 'utf8')
    assert.match(persistedText, /"status": "completed"/)
    assert.match(persistedText, /"candidateOutput"/)

    const secondRun = await runner.run(AGENT_A, pluginId, packageId, 'run')
    if (!secondRun.ok) throw new Error(secondRun.message)
    assert.equal(secondRun.ok, true)
    const reopened = await call('pto_experiment_get', { experiment_id: planned.id }) as ExperimentRecord
    assert.equal(reopened.status, 'completed')
    assert.equal(reopened.revision, 4)
    assert.equal(reopened.actualRun?.path, candidate)

    const foreignWorkspace = join(temporary, 'other-workspace')
    await mkdir(foreignWorkspace)
    ;(AGENT_A as unknown as { session: { header: { cwd: string } } }).session.header.cwd = foreignWorkspace
    await callFails('pto_experiment_get', { experiment_id: planned.id }, /another Workspace/)
    ;(AGENT_A as unknown as { session: { header: { cwd: string } } }).session.header.cwd = workspace

    console.log(JSON.stringify({
      experiment: reopened,
      durableFile: join(storageRoot, 'pto_experiment_spike.json'),
      modelVisibleTools: ctx.tools.schemas(AGENT_A).map(schema => schema.name).filter(name => name.startsWith('pto_experiment_')),
      simulatedPrivateTransitions: ['bind-identities', 'authorize', 'begin', 'complete', 'fail', 'cancel'],
    }, null, 2))
  } finally {
    await ctx.fiber.dispose()
    await rm(temporary, { recursive: true, force: true })
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
