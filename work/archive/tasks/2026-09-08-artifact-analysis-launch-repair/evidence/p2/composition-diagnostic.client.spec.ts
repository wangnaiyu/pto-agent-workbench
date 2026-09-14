// @vitest-environment jsdom
// Diagnostic only: no production behavior is changed or receipt synthesized.
import { writeFileSync } from 'node:fs'
import { expect, it, onTestFinished, vi } from 'vitest'
import { SlotTestRuntime, TestRemote, stubSettingsScope } from '@deepseek-ai/dsh-client-test-runtime'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply as workspaceApply, inject as workspaceInject } from '../src/client/index.ts'
import { apply as conversationApply, inject as conversationInject } from '../../ui-conversation/src/client/index.ts'
import { apply as triggerApply, inject as triggerInject } from '../../ui-input-trigger/src/client/index.ts'
import { apply as presetApply, inject as presetInject } from '../../ui-agent-preset/src/client/index.ts'

it('captures real four-plugin draft target drift across a controlled preset roster response', async () => {
  const runtime = await SlotTestRuntime.create()
  onTestFinished(() => runtime.dispose())
  runtime.releaseWorkspaceSource()
  const locale = new LocaleRuntime(runtime.ctx)
  runtime.ctx.provide('locale', locale)
  runtime.slots.installLocale(locale)
  runtime.ctx.provide('settingsScope', { bind: () => stubSettingsScope().scope } as never)
  let release!: (value: unknown) => void
  const roster = new Promise(resolve => { release = resolve })
  // Cleanup releases the owned barrier even if an assertion fails.
  onTestFinished(() => { release({ ok: true, value: { presets: [], authorable: false } }) })
  const admitAnalysis = vi.fn(async () => { throw new Error('admission reached') })
  const namespaces = {
    directoryPicker: {},
    settings: {},
    agentPresets: { list: () => roster },
    ptoArtifactInspection: {
      inspect: async () => ({ ok: true, value: {
        recordId: 'record-1', profile: { revision: 'revision-1', displayPath: '/fixture' },
        actions: [
          { actionId: 'open.dependency-graph', kind: 'viewer', status: 'available' },
          { actionId: 'analyze.dependency-redundancy', kind: 'analysis', status: 'available', artifactRefs: ['deps.json'], skill: { name: 'dependency-redundancy', provider: 'official-fixed', revision: 'fixed' } },
        ],
      } }),
      open: async () => ({ ok: true, value: { handleId: 'viewer-1', actionId: 'open.dependency-graph' } }),
      close: async () => ({ ok: true, value: { closed: true } }),
      admitAnalysis,
    },
  }
  Object.assign(new TestRemote(runtime.ctx), namespaces)
  for (const [name, value] of Object.entries(namespaces)) runtime.ctx.provide(`remote.${name}` as never, value as never)
  await runtime.root.declare({
    conversation: { kind: 'single', scope: 'session-maybe' },
    'shell.overlay': { kind: 'list', scope: 'root' },
    'sidebar.workspaces': { kind: 'single', scope: 'root' },
  } as never, (() => null) as never)
  await runtime.mount({ inject: [...workspaceInject], apply: workspaceApply })
  await runtime.mount({ inject: [...triggerInject], apply: triggerApply })
  await runtime.mount({ inject: [...conversationInject], apply: conversationApply })
  await runtime.mount({ inject: [...presetInject], apply: presetApply })
  const browser = runtime.slots.entries('sidebar.workspaces')[0]!.inject!() as any
  const viewer = runtime.slots.entries('shell.overlay').find(e => e.options.id === 'pto-artifact-viewer')!.inject!() as any
  const seat = runtime.slots.entries('conversation.hero.agentPreset')[0]!.inject!() as any
  browser.openRunRecordViewer('/fixture')
  await vi.waitFor(() => expect(viewer.hooks.viewer.getSnapshot().kind).toBe('open'))
  const loading = seat.load()
  viewer.analyzeRecord()
  const controller = (runtime.ctx.get('inputTriggers') as any).draft()
  const stage = controller.target()
  expect(stage.agentPreset).toBeUndefined()
  release({ ok: true, value: { presets: [{ id: 'standard', trust: 'system', isDefault: true }], authorable: true } })
  await loading
  const submit = controller.target()
  expect(submit.agentPreset).toBe('standard')
  expect(submit.draftRevision).not.toBe(stage.draftRevision)
  // Invoke the same actual trigger admission operation used by InputHub on submit.
  await expect(controller.admitMaterialized(submit, { sessionId: 'session-1' }, 'analysis', new AbortController().signal)).resolves.toBeUndefined()
  expect(admitAnalysis).not.toHaveBeenCalled()
  // Positive control: the exact stage identity reaches the rejecting Host double.
  await expect(controller.admitMaterialized(stage, { sessionId: 'session-1' }, 'analysis', new AbortController().signal)).rejects.toThrow('admission reached')
  expect(admitAnalysis).toHaveBeenCalledTimes(1)
  const guard = vi.fn(async () => { throw new Error('guard reached') })
  const disposeGuard = (runtime.ctx.get('inputTriggers') as any).registerSource({
    trigger: '/', name: 'p2-guard-probe', targets: ['draft', 'session'],
    candidates: async () => [], onPick: () => undefined, matchEnter: guard,
  })
  onTestFinished(disposeGuard)
  await expect(controller.adjudicate('analysis', new AbortController().signal, { attachments: 0 })).resolves.toBeUndefined()
  expect(guard).not.toHaveBeenCalled()
  await expect(controller.adjudicate('/analysis', new AbortController().signal, { attachments: 0 })).rejects.toThrow('guard reached')
  expect(guard).toHaveBeenCalledTimes(1)
  const evidence = { stage, submit, driftAdmissionCalls: 0, exactStageAdmissionCalls: 1,
    ordinaryTextGuardCalls: 0, slashTextGuardCalls: 1,
    boundary: 'actual four Client applies and trigger admission; Host is a rejecting double; no browser/Host integration or P2 acceptance claim' }
  if (process.env.PTO_P2_EVIDENCE) writeFileSync(process.env.PTO_P2_EVIDENCE, JSON.stringify(evidence, null, 2) + '\n')
})
