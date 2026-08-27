import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { AGENT_A, setup } from '../../harness/packages/extensions/cordis-host-runner/tests/helpers.ts'

async function main(): Promise<void> {
  const hostCode = await readFile(fileURLToPath(new URL('./host.js', import.meta.url)), 'utf8')
  const { ctx, runner } = await setup()
  const session = { header: { id: AGENT_A.id, cwd: '/workspace/pto' } }
  const agents = new Map<string, unknown>()
  let listCalls = 0
  let executeCalls = 0
  let listScope: unknown
  let executeScope: unknown
  let executeInput: unknown
  let finishExecution: (() => void) | undefined
  const turnEvents: string[] = []
  let modelSteps = 0
  const record = {
    id: 'pto-exp-1', status: 'planned', revision: 0,
    workspaceKey: 'must-not-cross-wire',
    change: { summary: 'Change one schedule edge' },
    baseline: { path: '/workspace/pto/baseline', targetKey: 'opaque-baseline' },
    candidateOutput: { path: '/workspace/pto/candidate', targetKey: 'opaque-candidate' },
    actualRun: null,
    failure: null,
    createdAt: '2026-08-27T01:00:00.000Z',
    updatedAt: '2026-08-27T01:00:00.000Z',
  }
  ctx.provide('sessions', {
    get: (id: string) => id === AGENT_A.id ? session : undefined,
    list: () => [session],
  } as never)
  ctx.provide('agents', { get: (id: string) => agents.get(id) } as never)
  ctx.provide('ptoExperiments', {
    list(scope: unknown, limit: number) {
      listCalls += 1
      listScope = scope
      assert.equal(limit, 7)
      return Promise.resolve({ experiments: [record], total: 1, truncated: false })
    },
    execute(scope: { signal?: AbortSignal }, input: unknown) {
      executeCalls += 1
      executeScope = scope
      executeInput = input
      return new Promise(resolve => {
        finishExecution = () => resolve({ ...record, status: scope.signal?.aborted ? 'cancelled' : 'completed', revision: 4 })
        scope.signal?.addEventListener('abort', () => finishExecution?.(), { once: true })
      })
    },
  } as never)

  const { pluginId, packageId } = runner.define({
    sessionId: AGENT_A.id,
    plugin: { kind: 'new', idPrefix: 'ptdash' },
    name: 'PTO experiment dashboard spike',
    purpose: 'Prove session-addressed list and live-Agent execution authority',
    code: { host: hostCode },
  })
  const run = await runner.run(AGENT_A, pluginId, packageId, 'run')
  assert.equal(run.ok, true)
  if (!run.ok) throw new Error(run.message)

  const invoke = async (method: string, args: Record<string, unknown>) => {
    const result = await runner.invoke(pluginId, run.pluginRunId, method, args)
    if (!result.ok) throw new Error(result.message)
    return result.value
  }
  const rejected = async (method: string, args: Record<string, unknown>, pattern: RegExp) => {
    const result = await runner.invoke(pluginId, run.pluginRunId, method, args)
    assert.equal(result.ok, false)
    if (result.ok) throw new Error(`${method} unexpectedly succeeded`)
    assert.match(result.message, pattern)
  }

  const sessionsBefore = ctx.get('sessions')?.list().length
  const projected = await invoke('list', { sessionId: AGENT_A.id, limit: 7 }) as Record<string, unknown>
  assert.equal(JSON.stringify(listScope), JSON.stringify({ cwd: '/workspace/pto' }))
  assert.equal(listCalls, 1)
  assert.equal(ctx.get('sessions')?.list().length, sessionsBefore)
  assert.equal(agents.size, 0)
  assert.deepEqual(projected, {
    experiments: [{
      id: 'pto-exp-1', status: 'planned', revision: 0,
      declaredChange: 'Change one schedule edge',
      baselinePath: '/workspace/pto/baseline',
      candidateOutputPath: '/workspace/pto/candidate',
      actualRunPath: null, metric: null, failureReason: null,
      executionActivity: { active: false, cancellable: false },
      createdAt: '2026-08-27T01:00:00.000Z',
      updatedAt: '2026-08-27T01:00:00.000Z',
    }],
    total: 1,
    truncated: false,
  })
  assert.equal(JSON.stringify(projected).includes('targetKey'), false)
  assert.equal(JSON.stringify(projected).includes('workspaceKey'), false)

  await rejected('list', { sessionId: 'foreign', limit: 7 }, /unknown session foreign/u)
  await rejected('execute', {
    sessionId: AGENT_A.id, experimentId: 'pto-exp-1', expectedRevision: 0,
  }, /no live Agent/u)
  assert.equal(executeCalls, 0)

  const liveAgent = {
    ...AGENT_A,
    followup(message: unknown) {
      queueMicrotask(() => {
        turnEvents.push('turn/start')
        void ctx.waterfall('agent/pre-step', {
          agent: liveAgent,
          messages: [message],
          turn: 1,
          step: 1,
          signal: new AbortController().signal,
        } as never, () => {
          modelSteps += 1
          return Promise.resolve({ kind: 'enter' as const, messages: [message] } as never)
        }).then((decision) => {
          assert.equal((decision as { kind: string }).kind, 'reject')
          turnEvents.push('turn/end')
        })
      })
    },
  }
  agents.set(AGENT_A.id, liveAgent)
  const execution = invoke('execute', {
    sessionId: AGENT_A.id, experimentId: 'pto-exp-1', expectedRevision: 0,
  })
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.equal((executeScope as { cwd: string }).cwd, '/workspace/pto')
  assert.equal((executeScope as { agent: unknown }).agent, liveAgent)
  assert.equal((executeScope as { signal: AbortSignal }).signal.aborted, false)
  assert.equal(JSON.stringify(executeInput), JSON.stringify({ experimentId: 'pto-exp-1', expectedRevision: 0 }))
  assert.equal(executeCalls, 1)

  const whileUnmounted = await invoke('list', { sessionId: AGENT_A.id, limit: 7 }) as {
    experiments: Array<{ executionActivity: { active: boolean; cancellable: boolean } }>
  }
  assert.deepEqual(whileUnmounted.experiments[0]?.executionActivity, { active: true, cancellable: true })
  const cancelled = await invoke('cancel', { sessionId: AGENT_A.id, experimentId: 'pto-exp-1' })
  assert.deepEqual(cancelled, { cancelled: true })
  const terminal = await execution as { status: string; executionActivity: { active: boolean } }
  assert.equal(terminal.status, 'cancelled')
  assert.equal(terminal.executionActivity.active, false)
  assert.equal((executeScope as { signal: AbortSignal }).signal.aborted, true)
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.deepEqual(turnEvents, ['turn/start', 'turn/end'])
  assert.equal(modelSteps, 0)

  const afterCancellation = await invoke('list', { sessionId: AGENT_A.id, limit: 7 }) as {
    experiments: Array<{ executionActivity: { active: boolean; cancellable: boolean } }>
  }
  assert.deepEqual(afterCancellation.experiments[0]?.executionActivity, { active: false, cancellable: false })

  console.log(JSON.stringify({
    projected,
    authority: 'session cwd + live Agent',
    approvalTurnBridge: 'private follow-up consumed at pre-step without model call',
    remountCancellation: 'passed',
  }, null, 2))
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
