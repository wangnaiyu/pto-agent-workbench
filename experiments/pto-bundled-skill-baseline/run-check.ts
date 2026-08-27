import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '../../harness/vendor/cordis/src/index.ts'
import CommandRuntime from '../../harness/packages/interaction/commands/src/index.ts'
import SessionStore, { SessionId } from '../../harness/packages/core/session/src/index.ts'
import SystemPrompt from '../../harness/packages/core/system-prompt/src/index.ts'
import ToolRuntime from '../../harness/packages/core/tools/src/index.ts'
import { CallId } from '../../harness/packages/llm/llm/src/index.ts'
import SkillRegistry from '../../harness/packages/skill/skill/src/index.ts'
import * as SkillFileSystem from '../../harness/packages/skill/skill-filesystem/src/index.ts'
import * as ToolSkill from '../../harness/packages/skill/tool-skill/src/index.ts'
import ComposerCatalogGateway from '../../harness/packages/host/composer-catalog/src/index.ts'
import { WorkspaceId } from '../../harness/packages/workspace/workspace/src/index.ts'

const ptoRoot = fileURLToPath(new URL('../../skills/bundled/', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'pto-bundled-skill-baseline-'))
const workspace = join(temporary, 'workspace')
const dshRoot = join(temporary, 'dsh-bundled')
const dshHome = join(temporary, 'dsh-home')
const agentsHome = join(temporary, 'agents-home')
const ctx = new Context()

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

async function writeSkill(root: string, name: string, description: string): Promise<void> {
  const directory = join(root, name)
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'SKILL.md'), [
    '---',
    `name: ${name}`,
    `description: ${description}`,
    '---',
    '',
    `# ${name}`,
    '',
    'Fixture body.',
    '',
  ].join('\n'))
}

function registerCommand(name: string, description: string, provider?: string): void {
  ctx.commands.register({
    name,
    description,
    ...provider === undefined ? {} : { provider },
    handler: () => ({ kind: 'success' }),
  })
}

try {
  await writeSkill(dshRoot, 'dsh-helper', 'DSH bundled control Skill')
  await writeSkill(join(dshHome, 'skills'), 'user-helper', 'User control Skill')
  await writeSkill(join(workspace, '.dsh/skills'), 'project-helper', 'Workspace control Skill')
  await ctx.plugin(SessionStore)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  ctx.provide('agents', { get: () => undefined } as never)
  await ctx.plugin(CommandRuntime)
  await ctx.plugin(SkillRegistry)
  await ctx.plugin(SkillFileSystem, {
    providerName: 'pto-bundled',
    includeDefaultRoots: false,
    bundledSkillDir: ptoRoot,
    watch: false,
  })
  await ctx.plugin(ToolSkill)
  await ctx.plugin(SkillFileSystem, {
    providerName: 'dsh-bundled',
    includeDefaultRoots: false,
    bundledSkillDir: dshRoot,
    watch: false,
  })
  await ctx.plugin(SkillFileSystem, {
    providerName: 'filesystem',
    includeDefaultRoots: true,
    dshHome,
    agentsHome,
    watch: false,
  })

  ctx.skills.register({
    name: 'profiler-helper',
    description: 'Profiler plugin Skill',
    source: 'registry',
    provider: 'profiler.skills',
    content: '# Profiler helper',
  })

  registerCommand('dsh-global', 'DSH global command')
  registerCommand('pto-analyze', 'PTO command sharing a name with a Skill', 'pto.commands')
  registerCommand('profiler-open', 'Profiler plugin command', 'profiler.commands')

  const standingKey = { preset: 'standard' }
  const workspaceId = WorkspaceId('phase-3-workspace')
  const sessionId = SessionId('phase-8-session')
  ctx.provide('workspaceRegistry', {
    get: (id: string) => id === workspaceId
      ? { id: workspaceId, path: workspace, title: 'Phase 3 Workspace', sessionIds: [sessionId] }
      : undefined,
    list: () => [{ id: workspaceId, path: workspace, title: 'Phase 3 Workspace', sessionIds: [sessionId] }],
  } as never)
  ctx.provide('agentPresets', {
    standingKeyFor: () => Promise.resolve(standingKey),
    serviceForStanding: () => undefined,
    serviceFor: () => undefined,
  } as never)
  await ctx.plugin(ComposerCatalogGateway, {
    providerOrigins: [
      { provider: 'pto-bundled', source: 'bundled', kind: 'pto' },
      { provider: 'pto.commands', kind: 'pto' },
      { provider: 'profiler.commands', kind: 'plugin', label: 'Profiler' },
      { provider: 'profiler.skills', kind: 'plugin', label: 'Profiler' },
    ],
  })
  const catalog = ctx.get('composerCatalog') as ComposerCatalogGateway

  const ungrouped = await catalog.listDraft({})
  const ungroupedOrigins = Object.fromEntries(
    ungrouped.skills.map(skill => [skill.name, skill.origin.label]),
  )
  assert(ungroupedOrigins['pto-evidence-intake'] === 'PTO', 'PTO Skill is not labelled PTO')
  assert(ungroupedOrigins['pto-analyze'] === 'PTO', 'PTO analyze Skill is not labelled PTO')
  assert(ungroupedOrigins['pto-compare'] === 'PTO', 'PTO compare Skill is not labelled PTO')
  assert(ungroupedOrigins['pto-debug'] === 'PTO', 'PTO debug Skill is not labelled PTO')
  assert(ungroupedOrigins['pto-optimize'] === 'PTO', 'PTO optimize Skill is not labelled PTO')
  assert(ungroupedOrigins['pto-review'] === 'PTO', 'PTO review Skill is not labelled PTO')
  assert(ungroupedOrigins['user-helper'] === 'User', 'User Skill is not labelled User')
  assert(ungroupedOrigins['profiler-helper'] === 'Profiler', 'plugin Skill lacks its friendly origin')
  assert(ungroupedOrigins['dsh-helper'] === 'DSH', 'DSH bundled Skill was misclassified')
  assert(!('project-helper' in ungroupedOrigins), 'ungrouped catalog leaked a project Skill')
  const ungroupedCommands = Object.fromEntries(
    ungrouped.commands.map(command => [command.name, command.origin.label]),
  )
  assert(ungroupedCommands['dsh-global'] === 'DSH', 'global command is not labelled DSH')
  assert(ungroupedCommands['pto-analyze'] === 'PTO', 'PTO command is not labelled PTO')
  assert(ungroupedCommands['profiler-open'] === 'Profiler', 'plugin command lacks its friendly origin')

  const grouped = await catalog.listDraft({ workspaceId, agentPreset: 'standard' })
  const groupedOrigins = Object.fromEntries(
    grouped.skills.map(skill => [skill.name, skill.origin.label]),
  )
  assert(groupedOrigins['pto-evidence-intake'] === 'PTO', 'Workspace draft lost the PTO Skill')
  assert(groupedOrigins['pto-analyze'] === 'PTO', 'Workspace draft lost the PTO analyze Skill')
  assert(groupedOrigins['pto-compare'] === 'PTO', 'Workspace draft lost the PTO compare Skill')
  assert(groupedOrigins['pto-debug'] === 'PTO', 'Workspace draft lost the PTO debug Skill')
  assert(groupedOrigins['pto-optimize'] === 'PTO', 'Workspace draft lost the PTO optimize Skill')
  assert(groupedOrigins['pto-review'] === 'PTO', 'Workspace draft lost the PTO review Skill')
  assert(groupedOrigins['user-helper'] === 'User', 'Workspace draft lost the User Skill')
  assert(groupedOrigins['profiler-helper'] === 'Profiler', 'Workspace draft lost the plugin Skill')
  assert(groupedOrigins['dsh-helper'] === 'DSH', 'Workspace draft misclassified DSH bundled Skill')
  assert(groupedOrigins['project-helper'] === 'Phase 3 Workspace', 'project Skill lacks Workspace origin')
  const groupedCommands = Object.fromEntries(
    grouped.commands.map(command => [command.name, command.origin.label]),
  )
  assert(groupedCommands['dsh-global'] === 'DSH', 'Workspace draft lost the DSH command')
  assert(grouped.commands.some(command => command.name === 'pto-analyze'), 'same-name PTO command disappeared')
  assert(grouped.skills.some(skill => skill.name === 'pto-analyze'), 'same-name PTO Skill disappeared')

  ctx.sessions.create(sessionId, { meta: { cwd: workspace, agentPreset: 'standard' } })
  const sessionsBeforeFormalRead = ctx.sessions.list().length
  const formal = await catalog.listSession({ sessionId })
  assert(ctx.sessions.list().length === sessionsBeforeFormalRead, 'formal catalog created another Session')
  assert(formal.commands.some(command => command.name === 'dsh-global' && command.origin.label === 'DSH'), 'formal Session lost the DSH command')
  assert(formal.skills.some(skill => skill.name === 'project-helper' && skill.origin.label === 'Phase 3 Workspace'), 'formal Session lost the Workspace Skill')
  assert(formal.skills.some(skill => skill.name === 'user-helper' && skill.origin.label === 'User'), 'formal Session lost the User Skill')
  assert(formal.skills.some(skill => skill.name === 'profiler-helper' && skill.origin.label === 'Profiler'), 'formal Session lost the plugin Skill')

  const definition = await ctx.skills.get('pto-evidence-intake', { cwd: workspace })
  assert(definition?.content.includes('PTO Evidence Intake'), 'PTO Skill body did not load')
  const analyze = await ctx.skills.get('pto-analyze', { cwd: workspace })
  assert(analyze?.content.includes('PTO Analyze'), 'PTO analyze Skill body did not load')
  const compare = await ctx.skills.get('pto-compare', { cwd: workspace })
  assert(compare?.content.includes('PTO Compare'), 'PTO compare Skill body did not load')
  const debug = await ctx.skills.get('pto-debug', { cwd: workspace })
  assert(debug?.content.includes('PTO Debug'), 'PTO debug Skill body did not load')
  const optimize = await ctx.skills.get('pto-optimize', { cwd: workspace })
  assert(optimize?.content.includes('PTO Optimize'), 'PTO optimize Skill body did not load')
  const review = await ctx.skills.get('pto-review', { cwd: workspace })
  assert(review?.content.includes('PTO Review'), 'PTO review Skill body did not load')

  const toolResult = await ctx.tools.execute({
    name: 'skill',
    arguments: { name: 'pto-analyze' },
    callId: CallId('phase-8-pto-analyze'),
    signal: new AbortController().signal,
    agent: { session: { header: { cwd: workspace } } } as never,
  })
  assert(!toolResult.isError, 'Agent skill tool could not load PTO analyze')
  assert(toolResult.value.name === 'pto-analyze', 'skill tool returned the wrong Skill')
  assert(toolResult.value.provider === 'pto-bundled', 'skill tool lost PTO provider ownership')
  assert(toolResult.value.resourceBase?.kind === 'directory'
    && toolResult.value.resourceBase.path === join(ptoRoot, 'pto-analyze'), 'skill tool returned the wrong PTO resource root')
  const toolText = toolResult.content[0]
  assert(toolText?.type === 'text' && toolText.text.includes('<skill_content name="pto-analyze">'), 'skill tool omitted canonical PTO content')
  assert(toolText.type === 'text' && toolText.text.includes('PTO Analyze'), 'skill tool omitted the PTO analyze body')

  console.log(JSON.stringify({
    ptoRoot,
    ungroupedCommands: ungrouped.commands.map(command => [command.name, command.origin.label]),
    ungrouped: ungrouped.skills.map(skill => [skill.name, skill.origin.label]),
    workspaceCommands: grouped.commands.map(command => [command.name, command.origin.label]),
    workspace: grouped.skills.map(skill => [skill.name, skill.origin.label]),
    formalSession: {
      commands: formal.commands.map(command => [command.name, command.origin.label]),
      skills: formal.skills.map(skill => [skill.name, skill.origin.label]),
    },
    bodyLoaded: true,
    agentToolLoaded: toolResult.value.name,
  }, null, 2))
} finally {
  await ctx.fiber.dispose()
  await rm(temporary, { recursive: true, force: true })
}
