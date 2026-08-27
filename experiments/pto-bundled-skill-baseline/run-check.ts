import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '../../harness/vendor/cordis/src/index.ts'
import CommandRuntime from '../../harness/packages/interaction/commands/src/index.ts'
import SkillRegistry from '../../harness/packages/skill/skill/src/index.ts'
import * as SkillFileSystem from '../../harness/packages/skill/skill-filesystem/src/index.ts'
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

try {
  await writeSkill(dshRoot, 'dsh-helper', 'DSH bundled control Skill')
  await writeSkill(join(workspace, '.dsh/skills'), 'project-helper', 'Workspace control Skill')
  await ctx.plugin(CommandRuntime)
  await ctx.plugin(SkillRegistry)
  await ctx.plugin(SkillFileSystem, {
    providerName: 'pto-bundled',
    includeDefaultRoots: false,
    bundledSkillDir: ptoRoot,
    watch: false,
  })
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

  const workspaceId = WorkspaceId('phase-3-workspace')
  ctx.provide('workspaceRegistry', {
    get: (id: string) => id === workspaceId
      ? { id: workspaceId, path: workspace, title: 'Phase 3 Workspace' }
      : undefined,
  } as never)
  ctx.provide('agentPresets', {
    standingKeyFor: () => Promise.resolve({ preset: 'standard' }),
    serviceForStanding: () => undefined,
  } as never)
  await ctx.plugin(ComposerCatalogGateway, {
    providerOrigins: [
      { provider: 'pto-bundled', source: 'bundled', kind: 'pto' },
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
  assert(ungroupedOrigins['dsh-helper'] === 'DSH', 'DSH bundled Skill was misclassified')
  assert(!('project-helper' in ungroupedOrigins), 'ungrouped catalog leaked a project Skill')

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
  assert(groupedOrigins['dsh-helper'] === 'DSH', 'Workspace draft misclassified DSH bundled Skill')
  assert(groupedOrigins['project-helper'] === 'Phase 3 Workspace', 'project Skill lacks Workspace origin')

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

  console.log(JSON.stringify({
    ptoRoot,
    ungrouped: ungrouped.skills.map(skill => [skill.name, skill.origin.label]),
    workspace: grouped.skills.map(skill => [skill.name, skill.origin.label]),
    bodyLoaded: true,
  }, null, 2))
} finally {
  await ctx.fiber.dispose()
  await rm(temporary, { recursive: true, force: true })
}
