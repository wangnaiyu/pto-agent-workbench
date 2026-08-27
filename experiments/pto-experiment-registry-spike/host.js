let pluginContext
let experiments
let idCounter = 0

const STATES = new Set(['planned', 'authorized', 'running', 'completed', 'failed', 'cancelled'])

function plainObject(value, label) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`)
  }
  return value
}

function nonEmpty(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${label} must be a non-empty string`)
  }
  return value.trim()
}

function stringArray(value, label) {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || item.trim() === '')) {
    throw new TypeError(`${label} must be an array of non-empty strings`)
  }
  return value.map(item => item.trim())
}

function safeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(`${label} must be a non-negative safe integer`)
  return value
}

function parseRecord(value) {
  const record = plainObject(value, 'experiment record')
  if (record.schemaVersion !== 1) throw new TypeError('experiment record schemaVersion must be 1')
  nonEmpty(record.id, 'experiment id')
  nonEmpty(record.workspaceKey, 'workspace key')
  nonEmpty(record.workspacePath, 'workspace path')
  if (!STATES.has(record.status)) throw new TypeError(`unknown experiment status ${String(record.status)}`)
  safeInteger(record.revision, 'experiment revision')
  plainObject(record.baseline, 'baseline')
  nonEmpty(record.baseline.path, 'baseline path')
  nonEmpty(record.baseline.targetKey, 'baseline target key')
  if (record.baseline.kind !== 'l2' && record.baseline.kind !== 'l3') throw new TypeError('baseline kind must be l2 or l3')
  nonEmpty(record.baseline.marker, 'baseline marker')
  plainObject(record.source, 'source')
  nonEmpty(record.source.path, 'source path')
  nonEmpty(record.source.targetKey, 'source target key')
  plainObject(record.source.identity, 'source identity')
  plainObject(record.environment, 'environment')
  plainObject(record.environment.identity, 'environment identity')
  plainObject(record.candidateOutput, 'candidate output')
  nonEmpty(record.candidateOutput.path, 'candidate output path')
  nonEmpty(record.candidateOutput.targetKey, 'candidate output target key')
  plainObject(record.change, 'declared change')
  nonEmpty(record.change.summary, 'declared change summary')
  stringArray(record.change.evidenceRefs, 'declared change evidence refs')
  plainObject(record.controls, 'experiment controls')
  nonEmpty(record.controls.stopConditions, 'stop conditions')
  nonEmpty(record.controls.rollbackPlan, 'rollback plan')
  if (!Array.isArray(record.events) || record.events.length !== record.revision + 1) {
    throw new TypeError('experiment event ledger must contain exactly revision + 1 events')
  }
  const last = plainObject(record.events.at(-1), 'last experiment event')
  if (last.revision !== record.revision || last.state !== record.status) {
    throw new TypeError('last experiment event must match the materialized revision and status')
  }
  nonEmpty(record.createdAt, 'createdAt')
  nonEmpty(record.updatedAt, 'updatedAt')
  return record
}

const experimentSchema = { parse: parseRecord }
const domainSpec = {
  name: 'pto_experiment_spike',
  version: 1,
  tables: { experiments: { valueSchema: experimentSchema } },
}

function table() {
  if (experiments === undefined) throw new Error('PTO experiment registry spike is not active')
  return experiments
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function publicRecord(record) {
  const approvalReceipt = record.authorization === null ? null : clone(record.authorization)
  return {
    schemaVersion: record.schemaVersion,
    id: record.id,
    status: record.status,
    revision: record.revision,
    workspacePath: record.workspacePath,
    baseline: {
      path: record.baseline.path,
      kind: record.baseline.kind,
      marker: record.baseline.marker,
      identityStatus: record.baseline.identityStatus,
      observedAt: record.baseline.observedAt,
    },
    source: { path: record.source.path, identity: clone(record.source.identity) },
    environment: { identity: clone(record.environment.identity) },
    candidateOutput: {
      path: record.candidateOutput.path,
      precondition: record.candidateOutput.precondition,
      observedAt: record.candidateOutput.observedAt,
    },
    change: clone(record.change),
    controls: clone(record.controls),
    authorization: approvalReceipt,
    actualRun: record.actualRun === null ? null : {
      path: record.actualRun.path,
      kind: record.actualRun.kind,
      marker: record.actualRun.marker,
      identityStatus: record.actualRun.identityStatus,
      observedAt: record.actualRun.observedAt,
    },
    failure: record.failure === null ? null : clone(record.failure),
    events: clone(record.events),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

function executionWorkspace(exec) {
  const cwd = exec && exec.agent && exec.agent.session && exec.agent.session.header
    ? exec.agent.session.header.cwd
    : undefined
  if (typeof cwd !== 'string' || cwd === '') throw new Error('PTO experiment tools require a Session workspace')
  return cwd
}

async function directory(fs, path, cwd, label) {
  const target = await fs.resolve(path, { cwd })
  const info = await fs.stat(target)
  if (info === undefined || info.type !== 'directory') throw new Error(`${label} must name an existing directory`)
  return { target, info }
}

async function recognizeRun(fs, target) {
  const entries = await fs.listDir(target)
  if (entries.some(entry => entry.name === 'kernel_config.py' && entry.type === 'file')) {
    return { kind: 'l2', marker: 'kernel_config.py' }
  }
  const orchestration = entries.find(entry => entry.name === 'orchestration' && entry.type === 'directory')
  if (orchestration !== undefined) {
    const children = await fs.listDir(orchestration.target)
    if (children.some(entry => entry.name === 'host_orch.py' && entry.type === 'file')) {
      return { kind: 'l3', marker: 'orchestration/host_orch.py' }
    }
  }
  throw new Error('baseline_run_path is not a recognized PyPTO 3.0 run')
}

function identity(status, value, adapter, evidence, trust) {
  return {
    status,
    value,
    adapter,
    evidence,
    trust,
  }
}

function nextId() {
  let id
  do {
    idCounter += 1
    id = `exp-${Date.now().toString(36)}-${idCounter.toString(36)}`
  } while (table().get(id) !== undefined)
  return id
}

function event(revision, type, state, actor, details) {
  return {
    revision,
    type,
    state,
    actor,
    at: new Date().toISOString(),
    details,
  }
}

function transition(current, type, status, actor, details, patch) {
  const revision = current.revision + 1
  const updatedAt = new Date().toISOString()
  return {
    ...current,
    ...patch,
    status,
    revision,
    updatedAt,
    events: [...current.events, event(revision, type, status, actor, details)],
  }
}

function expectedRevision(args) {
  return safeInteger(args.expectedRevision, 'expectedRevision')
}

async function update(args, allowedStates, type, status, actor, details, patch) {
  const id = nonEmpty(args.experimentId, 'experimentId')
  const expected = expectedRevision(args)
  return table().update(id, (current) => {
    if (current.revision !== expected) {
      throw new Error(`stale experiment revision: expected ${expected}, current ${current.revision}`)
    }
    if (!allowedStates.includes(current.status)) {
      throw new Error(`cannot ${type} experiment in status ${current.status}`)
    }
    return transition(current, type, status, actor, details, patch)
  })
}

async function plan(args, exec) {
  const fs = pluginContext.fs
  const cwd = executionWorkspace(exec)
  const workspace = await directory(fs, cwd, cwd, 'Session workspace')
  const source = await directory(fs, nonEmpty(args.source_workspace_path, 'source_workspace_path'), cwd, 'source_workspace_path')
  const baseline = await directory(fs, nonEmpty(args.baseline_run_path, 'baseline_run_path'), cwd, 'baseline_run_path')
  const candidate = await fs.resolve(nonEmpty(args.candidate_output_path, 'candidate_output_path'), { cwd })
  if (!fs.contains(workspace.target, source.target) || !fs.contains(workspace.target, baseline.target)
    || !fs.contains(workspace.target, candidate) || !fs.contains(source.target, candidate)) {
    throw new Error('source, baseline, and candidate output must stay inside the Session workspace; candidate output must stay inside source')
  }
  if (fs.contains(baseline.target, candidate) || fs.contains(candidate, baseline.target)) {
    throw new Error('candidate output must be disjoint from the immutable baseline run')
  }
  if (await fs.stat(candidate) !== undefined) throw new Error('candidate_output_path must not exist when the experiment is planned')
  const recognition = await recognizeRun(fs, baseline.target)
  for (const [, current] of table().entries()) {
    if (current.workspaceKey === String(workspace.target.targetKey)
      && current.candidateOutput.targetKey === String(candidate.targetKey)) {
      throw new Error(`candidate output is already owned by experiment ${current.id}`)
    }
  }

  const id = nextId()
  const createdAt = new Date().toISOString()
  const record = {
    schemaVersion: 1,
    id,
    workspaceKey: String(workspace.target.targetKey),
    workspacePath: workspace.target.displayPath,
    status: 'planned',
    revision: 0,
    baseline: {
      path: baseline.target.displayPath,
      targetKey: String(baseline.target.targetKey),
      kind: recognition.kind,
      marker: recognition.marker,
      identityStatus: 'unverified',
      observedAt: createdAt,
    },
    source: {
      path: source.target.displayPath,
      targetKey: String(source.target.targetKey),
      identity: identity('unverified', null, null, [], 'none'),
    },
    environment: { identity: identity('unverified', null, null, [], 'none') },
    candidateOutput: {
      path: candidate.displayPath,
      targetKey: String(candidate.targetKey),
      precondition: 'absent-observed',
      observedAt: createdAt,
    },
    change: {
      summary: nonEmpty(args.declared_change, 'declared_change'),
      evidenceRefs: stringArray(args.evidence_refs || [], 'evidence_refs'),
    },
    controls: {
      stopConditions: nonEmpty(args.stop_conditions, 'stop_conditions'),
      rollbackPlan: nonEmpty(args.rollback_plan, 'rollback_plan'),
    },
    authorization: null,
    actualRun: null,
    failure: null,
    events: [event(0, 'planned', 'planned', 'agent-proposal', {
      outputPrecondition: 'absent-observed',
      identityStatus: 'unverified',
    })],
    createdAt,
    updatedAt: createdAt,
  }
  parseRecord(record)
  await table().put(id, record)
  return publicRecord(record)
}

async function getForExecution(args, exec) {
  const id = nonEmpty(args.experiment_id, 'experiment_id')
  const record = table().get(id)
  if (record === undefined) throw new Error(`unknown experiment ${id}`)
  const cwd = executionWorkspace(exec)
  const workspace = await pluginContext.fs.resolve(cwd, { cwd })
  if (record.workspaceKey !== String(workspace.targetKey)) throw new Error(`experiment ${id} belongs to another Workspace`)
  return publicRecord(record)
}

async function listForExecution(_args, exec) {
  const cwd = executionWorkspace(exec)
  const workspace = await pluginContext.fs.resolve(cwd, { cwd })
  return [...table().entries()]
    .map(([, record]) => record)
    .filter(record => record.workspaceKey === String(workspace.targetKey))
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
    .map(publicRecord)
}

harness.handle('bind-identities', async (raw) => {
  const args = plainObject(raw, 'bind-identities args')
  const source = plainObject(args.source, 'source identity')
  const environment = plainObject(args.environment, 'environment identity')
  const sourceIdentity = identity(
    'verified',
    nonEmpty(source.value, 'source identity value'),
    nonEmpty(source.adapter, 'source identity adapter'),
    stringArray(source.evidence, 'source identity evidence'),
    'spike-simulated',
  )
  const environmentIdentity = identity(
    'verified',
    nonEmpty(environment.value, 'environment identity value'),
    nonEmpty(environment.adapter, 'environment identity adapter'),
    stringArray(environment.evidence, 'environment identity evidence'),
    'spike-simulated',
  )
  const current = table().get(nonEmpty(args.experimentId, 'experimentId'))
  if (current === undefined) throw new Error(`unknown experiment ${String(args.experimentId)}`)
  return publicRecord(await update(
    args,
    ['planned'],
    'identities-bound',
    'planned',
    'identity-adapter',
    { trust: 'spike-simulated' },
    {
      source: { ...current.source, identity: sourceIdentity },
      environment: { identity: environmentIdentity },
    },
  ))
})

harness.handle('authorize', async (raw) => {
  const args = plainObject(raw, 'authorize args')
  const current = table().get(nonEmpty(args.experimentId, 'experimentId'))
  if (current === undefined) throw new Error(`unknown experiment ${String(args.experimentId)}`)
  if (current.source.identity.status !== 'verified' || current.environment.identity.status !== 'verified') {
    throw new Error('source and environment identities must be verified before authorization')
  }
  const receipt = {
    actor: nonEmpty(args.actor, 'authorization actor'),
    receiptRef: nonEmpty(args.receiptRef, 'authorization receiptRef'),
    authorizedAt: new Date().toISOString(),
    trust: 'spike-simulated',
  }
  return publicRecord(await update(
    args,
    ['planned'],
    'authorized',
    'authorized',
    receipt.actor,
    { receiptRef: receipt.receiptRef, trust: receipt.trust },
    { authorization: receipt },
  ))
})

harness.handle('begin', async (raw) => {
  const args = plainObject(raw, 'begin args')
  const current = table().get(nonEmpty(args.experimentId, 'experimentId'))
  if (current === undefined) throw new Error(`unknown experiment ${String(args.experimentId)}`)
  if (current.status !== 'authorized') throw new Error(`cannot begin experiment in status ${current.status}`)
  const fs = pluginContext.fs
  const workspace = await directory(fs, current.workspacePath, current.workspacePath, 'recorded Workspace')
  const source = await directory(fs, current.source.path, current.workspacePath, 'recorded source')
  const baseline = await directory(fs, current.baseline.path, current.workspacePath, 'recorded baseline')
  const candidate = await fs.resolve(current.candidateOutput.path, { cwd: current.workspacePath })
  if (String(workspace.target.targetKey) !== current.workspaceKey
    || String(source.target.targetKey) !== current.source.targetKey
    || String(baseline.target.targetKey) !== current.baseline.targetKey
    || String(candidate.targetKey) !== current.candidateOutput.targetKey) {
    throw new Error('recorded filesystem identity changed before execution')
  }
  if (await fs.stat(candidate) !== undefined) throw new Error('candidate output appeared after planning; refusing overwrite')
  const recognition = await recognizeRun(fs, baseline.target)
  if (recognition.kind !== current.baseline.kind || recognition.marker !== current.baseline.marker) {
    throw new Error('baseline recognition changed before execution')
  }
  return publicRecord(await update(
    args,
    ['authorized'],
    'execution-started',
    'running',
    'experiment-executor',
    { outputPrecondition: 'absent-rechecked' },
    { candidateOutput: { ...current.candidateOutput, precondition: 'absent-rechecked', observedAt: new Date().toISOString() } },
  ))
})

harness.handle('complete', async (raw) => {
  const args = plainObject(raw, 'complete args')
  const current = table().get(nonEmpty(args.experimentId, 'experimentId'))
  if (current === undefined) throw new Error(`unknown experiment ${String(args.experimentId)}`)
  if (current.status !== 'running') throw new Error(`cannot complete experiment in status ${current.status}`)
  const fs = pluginContext.fs
  const actual = await directory(fs, nonEmpty(args.actualRunPath, 'actualRunPath'), current.workspacePath, 'actualRunPath')
  if (String(actual.target.targetKey) !== current.candidateOutput.targetKey) {
    throw new Error('actual run must be the candidate output bound by the experiment')
  }
  const recognition = await recognizeRun(fs, actual.target)
  const actualRun = {
    path: actual.target.displayPath,
    targetKey: String(actual.target.targetKey),
    kind: recognition.kind,
    marker: recognition.marker,
    identityStatus: 'registry-bound',
    observedAt: new Date().toISOString(),
  }
  return publicRecord(await update(
    args,
    ['running'],
    'execution-completed',
    'completed',
    'experiment-executor',
    { actualRunPath: actualRun.path },
    { actualRun },
  ))
})

harness.handle('fail', async (raw) => {
  const args = plainObject(raw, 'fail args')
  const failure = {
    summary: nonEmpty(args.summary, 'failure summary'),
    evidenceRefs: stringArray(args.evidenceRefs || [], 'failure evidence refs'),
  }
  return publicRecord(await update(
    args,
    ['running'],
    'execution-failed',
    'failed',
    'experiment-executor',
    failure,
    { failure },
  ))
})

harness.handle('cancel', async (raw) => {
  const args = plainObject(raw, 'cancel args')
  const actor = nonEmpty(args.actor, 'cancel actor')
  const reason = nonEmpty(args.reason, 'cancel reason')
  return publicRecord(await update(
    args,
    ['planned', 'authorized', 'running'],
    'cancelled',
    'cancelled',
    actor,
    { reason, trust: 'spike-simulated' },
    {},
  ))
})

return {
  name: 'pto-experiment-registry-spike',
  inject: ['tools', 'fs', 'storageDomain'],
  async apply(ctx) {
    pluginContext = ctx
    const domain = await ctx.storageDomain.open(domainSpec)
    experiments = domain.table('experiments')
    ctx.effect(() => async () => {
      experiments = undefined
      pluginContext = undefined
      await domain.close()
    }, 'pto-experiment-registry-spike.domain')

    const output = {
      schema: { type: 'json' },
      render(_args, value) { return [{ type: 'text', text: JSON.stringify(value, null, 2) }] },
    }
    harness.registerTool(ctx, harness.defineTool({
      name: 'pto_experiment_plan',
      description: 'Create a durable PTO experiment proposal with a disjoint absent candidate output; does not authorize or execute it.',
      parameters: {
        source_workspace_path: { type: 'string', required: true },
        baseline_run_path: { type: 'string', required: true },
        candidate_output_path: { type: 'string', required: true },
        declared_change: { type: 'string', required: true },
        evidence_refs: { type: 'array', items: { type: 'string' } },
        stop_conditions: { type: 'string', required: true },
        rollback_plan: { type: 'string', required: true },
      },
      output,
      async execute(args, exec) { return plan(args, exec) },
    }))
    harness.registerTool(ctx, harness.defineTool({
      name: 'pto_experiment_get',
      description: 'Read one PTO experiment record owned by the current Session Workspace.',
      parameters: { experiment_id: { type: 'string', required: true } },
      output,
      isConcurrencySafe: () => true,
      async execute(args, exec) { return getForExecution(args, exec) },
    }))
    harness.registerTool(ctx, harness.defineTool({
      name: 'pto_experiment_list',
      description: 'List PTO experiment records owned by the current Session Workspace.',
      parameters: {},
      output,
      isConcurrencySafe: () => true,
      async execute(args, exec) { return listForExecution(args, exec) },
    }))
  },
}
