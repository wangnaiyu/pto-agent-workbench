import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { Context } from '../../harness/vendor/cordis/src/index.ts'
import CommandRuntime from '../../harness/packages/interaction/commands/src/index.ts'
import SessionStore from '../../harness/packages/core/session/src/index.ts'
import { createScope } from '../../harness/packages/core/scope/src/index.ts'
import SkillRegistry from '../../harness/packages/skill/skill/src/index.ts'
import { AGENT_A, setup } from '../../harness/packages/extensions/cordis-host-runner/tests/helpers.ts'

async function main(): Promise<void> {
const hostCode = await readFile(fileURLToPath(new URL('./host.js', import.meta.url)), 'utf8')
const harness = await setup()
const { ctx, runner } = harness
await ctx.plugin(SessionStore)
await ctx.plugin(CommandRuntime)
await ctx.plugin(SkillRegistry)

ctx.commands.register({
  name: 'global-only',
  description: 'Global command',
  handler: () => ({ kind: 'success' }),
})
ctx.commands.register({
  name: 'shared',
  description: 'Global shared command',
  handler: () => ({ kind: 'success' }),
})

const standingKey = { preset: 'standard' }
const standing = createScope(ctx, standingKey)
await standing.ctx.plugin(Object.assign((inner) => {
  inner.commands.register({
    name: 'agent-only',
    description: 'Agent command',
    handler: () => ({ kind: 'success' }),
  })
  inner.commands.register({
    name: 'shared',
    description: 'Agent override',
    handler: () => ({ kind: 'success' }),
  })
}, { inject: ['commands'] }))

let rootSkillLists = 0
ctx.skills.registerProvider(() => ({
  name: 'root-fixture',
  async list() {
    rootSkillLists += 1
    return [{
      name: 'wrong-root-skill',
      description: 'Must not replace the preset registry',
      invocation: { modelInvocable: true, userInvocable: true },
      source: 'project-dsh',
      provider: 'root-fixture',
      rank: 10,
      locator: 'wrong-root-skill',
    }]
  },
  async get() { return undefined },
}))

const presetContext = new Context()
await presetContext.plugin(SkillRegistry)
let presetSkillLists = 0
presetContext.skills.registerProvider(() => ({
  name: 'preset-fixture',
  async list(options) {
    presetSkillLists += 1
    assert.equal(options.cwd, '/workspace/project')
    return [
      {
        name: 'project-skill',
        description: 'Workspace project skill',
        invocation: { modelInvocable: true, userInvocable: true },
        source: 'project-agents',
        provider: 'preset-fixture',
        rank: 10,
        locator: 'project-skill',
      },
      {
        name: 'user-skill',
        description: 'Excluded user skill',
        invocation: { modelInvocable: true, userInvocable: true },
        source: 'user-agents',
        provider: 'preset-fixture',
        rank: 20,
        locator: 'user-skill',
      },
    ]
  },
  async get() { return undefined },
}))

let standingReads = 0
ctx.provide('agentPresets', {
  standingKeyFor(id?: string) {
    standingReads += 1
    assert.equal(id, 'standard')
    return Promise.resolve(standingKey)
  },
  serviceForStanding(key: object, name: string) {
    assert.equal(key, standingKey)
    assert.equal(name, 'skills')
    return presetContext.skills
  },
} as never)
ctx.provide('workspaceRegistry', {
  get(id: string) {
    return id === 'workspace-1'
      ? { id, path: '/workspace/project', title: 'Project', sessionIds: [] }
      : undefined
  },
} as never)
let persistenceReads = 0
ctx.provide('sessionPersistence', {
  listSnapshots() {
    persistenceReads += 1
    return Promise.resolve([{ header: { id: 'existing-session' }, revision: 'rev-7' }])
  },
} as never)

const { pluginId, packageId } = runner.define({
  sessionId: AGENT_A.id,
  plugin: { kind: 'new', idPrefix: 'draft' },
  name: 'Draft composer catalog spike',
  purpose: 'Read draft commands and project skills without creating a Session',
  code: { host: hostCode },
})
const run = await runner.run(AGENT_A, pluginId, packageId, 'run')
assert.equal(run.ok, true)
if (!run.ok) throw new Error(run.message)
assert.equal(run.status, 'running')

const invoke = async (args: Record<string, unknown>) => {
  const result = await runner.invoke(pluginId, run.pluginRunId, 'probe', args)
  assert.equal(result.ok, true)
  if (!result.ok) throw new Error(result.message)
  return result.value as {
    globalCommands: Array<{ name: string; description: string }>
    scopedCommands: Array<{ name: string; description: string }>
    projectSkills: Array<{ name: string; description: string; source: string }>
    lifecycleUnchanged: boolean
    before: unknown
    after: unknown
  }
}

const ungrouped = await invoke({})
assert.deepEqual(ungrouped.globalCommands.map(command => command.name), ['global-only', 'shared'])
assert.deepEqual(ungrouped.scopedCommands, [])
assert.deepEqual(ungrouped.projectSkills, [])
assert.equal(ungrouped.lifecycleUnchanged, true)
assert.equal(standingReads, 0)
assert.equal(rootSkillLists, 0)
assert.equal(presetSkillLists, 0)

const workspace = await invoke({ workspaceId: 'workspace-1', agentPreset: 'standard' })
assert.deepEqual(workspace.globalCommands.map(command => command.name), ['global-only', 'shared'])
assert.deepEqual(workspace.scopedCommands.map(command => command.name), ['agent-only', 'global-only', 'shared'])
assert.equal(workspace.scopedCommands.find(command => command.name === 'shared')?.description, 'Agent override')
assert.deepEqual(workspace.projectSkills, [{
  name: 'project-skill',
  description: 'Workspace project skill',
  source: 'project-agents',
}])
assert.equal(workspace.lifecycleUnchanged, true)
assert.equal(standingReads, 1)
assert.equal(rootSkillLists, 0)
assert.equal(presetSkillLists, 1)
assert.equal(ctx.sessions.list().length, 0)
assert.equal(persistenceReads, 4)

console.log(JSON.stringify({ ungrouped, workspace }, null, 2))
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
