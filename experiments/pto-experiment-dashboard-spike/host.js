let pluginContext
const activeExecutions = new Map()
let messageSequence = 0

function cancellationController() {
  const listeners = []
  const signal = {
    aborted: false,
    addEventListener(type, listener) {
      if (type === 'abort') listeners.push(listener)
    },
  }
  return {
    signal,
    abort() {
      if (signal.aborted) return
      signal.aborted = true
      for (const listener of listeners.splice(0)) listener()
    },
  }
}

function sessionTarget(raw) {
  const sessionId = String(raw.sessionId || '')
  if (sessionId === '') throw new Error('sessionId is required')
  const sessions = pluginContext.get('sessions')
  const session = sessions && sessions.get(sessionId)
  if (session === undefined) throw new Error(`unknown session ${sessionId}`)
  if (session.header.cwd === undefined) throw new Error(`session ${sessionId} has no workspace`)
  return { sessionId, cwd: session.header.cwd }
}

function project(experiment, sessionId) {
  const active = activeExecutions.get(experiment.id)
  return {
    id: experiment.id,
    status: experiment.status,
    revision: experiment.revision,
    declaredChange: experiment.change.summary,
    baselinePath: experiment.baseline.path,
    candidateOutputPath: experiment.candidateOutput.path,
    actualRunPath: experiment.actualRun === null ? null : experiment.actualRun.path,
    metric: experiment.actualRun === null ? null : experiment.actualRun.metric,
    failureReason: experiment.failure === null ? null : experiment.failure.reason,
    executionActivity: active === undefined
      ? { active: false, cancellable: false }
      : { active: true, cancellable: active.sessionId === sessionId },
    createdAt: experiment.createdAt,
    updatedAt: experiment.updatedAt,
  }
}

harness.handle('list', async (raw) => {
  if (pluginContext === undefined) throw new Error('dashboard probe is not active')
  const target = sessionTarget(raw)
  const experiments = pluginContext.get('ptoExperiments')
  if (experiments === undefined) throw new Error('ptoExperiments is unavailable')
  const result = await experiments.list({ cwd: target.cwd }, raw.limit === undefined ? 20 : raw.limit)
  return {
    experiments: result.experiments.map(experiment => project(experiment, target.sessionId)),
    total: result.total,
    truncated: result.truncated,
  }
})

harness.handle('execute', async (raw) => {
  if (pluginContext === undefined) throw new Error('dashboard probe is not active')
  const target = sessionTarget(raw)
  const experiments = pluginContext.get('ptoExperiments')
  const agents = pluginContext.get('agents')
  if (experiments === undefined || agents === undefined) throw new Error('execution dependencies are unavailable')
  const agent = agents.get(target.sessionId)
  if (agent === undefined) throw new Error(`session ${target.sessionId} has no live Agent`)
  const experimentId = String(raw.experimentId || '')
  if (activeExecutions.has(experimentId)) throw new Error(`experiment ${experimentId} already has an active dashboard execution`)
  const controller = cancellationController()
  const message = {
    id: `pto-dashboard-spike-${++messageSequence}`,
    role: 'user',
    content: [{ type: 'text', text: `Execute PTO experiment ${experimentId}@${raw.expectedRevision}.` }],
    source: { kind: 'plugin', plugin: 'pto-experiment-dashboard-spike', form: 'notice', summary: experimentId },
  }
  let complete
  let fail
  const completion = new Promise((resolve, reject) => { complete = resolve; fail = reject })
  const settled = completion.then(() => undefined, () => undefined)
  activeExecutions.set(experimentId, {
    sessionId: target.sessionId,
    cwd: target.cwd,
    agent,
    messageId: message.id,
    expectedRevision: raw.expectedRevision,
    controller,
    completion,
    settled,
    complete,
    fail,
  })
  try {
    agent.followup(message)
  } catch (error) {
    fail(error)
  }
  return completion.finally(() => {
    activeExecutions.delete(experimentId)
  })
})

harness.handle('cancel', async (raw) => {
  if (pluginContext === undefined) throw new Error('dashboard probe is not active')
  const target = sessionTarget(raw)
  const experimentId = String(raw.experimentId || '')
  const active = activeExecutions.get(experimentId)
  if (active === undefined || active.sessionId !== target.sessionId) {
    throw new Error(`session ${target.sessionId} does not own an active execution for ${experimentId}`)
  }
  active.controller.abort(new Error('cancelled by dashboard user'))
  await active.settled
  return { cancelled: true }
})

return {
  name: 'pto-experiment-dashboard-spike',
  inject: ['sessions', 'agents', 'ptoExperiments'],
  apply(ctx) {
    pluginContext = ctx
    ctx.on('agent/pre-step', async ({ agent, messages }, next) => {
      const active = [...activeExecutions.values()].find(execution =>
        execution.agent === agent && messages.some(message => message.id === execution.messageId))
      if (active === undefined) return next()
      try {
        const experiments = pluginContext.get('ptoExperiments')
        const result = await experiments.execute(
          { cwd: active.cwd, agent, signal: active.controller.signal },
          { experimentId: messages.find(message => message.id === active.messageId).source.summary, expectedRevision: active.expectedRevision },
        )
        active.complete({
          ...project(result, active.sessionId),
          executionActivity: { active: false, cancellable: false },
        })
      } catch (error) {
        active.fail(error)
      }
      return { kind: 'reject' }
    })
  },
}
