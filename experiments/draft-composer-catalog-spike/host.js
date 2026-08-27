let pluginContext

harness.handle('probe', async (args) => {
  if (pluginContext === undefined) throw new Error('draft catalog probe is not active')
  const commands = pluginContext.get('commands')
  const skills = pluginContext.get('skills')
  const presets = pluginContext.get('agentPresets')
  const workspaces = pluginContext.get('workspaceRegistry')
  const sessions = pluginContext.get('sessions')
  const persistence = pluginContext.get('sessionPersistence')
  if (commands === undefined || skills === undefined || presets === undefined
    || workspaces === undefined || sessions === undefined || persistence === undefined) {
    throw new Error('draft catalog probe dependencies are unavailable')
  }

  const observe = async () => ({
    liveSessionIds: sessions.list().map(session => String(session.id)).sort(),
    persisted: (await persistence.listSnapshots()).map(snapshot => ({
      id: String(snapshot.header.id),
      revision: String(snapshot.revision),
    })).sort((left, right) => left.id < right.id ? -1 : 1),
  })
  const before = await observe()
  const globalCommands = commands.listGlobalDescriptors()
  let scopedCommands = []
  let projectSkills = []

  if (args.workspaceId !== undefined) {
    const workspace = workspaces.get(args.workspaceId)
    if (workspace === undefined) throw new Error(`unknown workspace ${String(args.workspaceId)}`)
    const scope = await presets.standingKeyFor(args.agentPreset)
    scopedCommands = commands.listForScope(scope)
    const scopedSkills = presets.serviceForStanding(scope, 'skills') || skills
    projectSkills = (await scopedSkills.list({ cwd: workspace.path, scope }))
      .filter(skill => skill.invocation.userInvocable !== false
        && (skill.source === 'project-dsh' || skill.source === 'project-agents'))
      .map(skill => ({ name: skill.name, description: skill.description, source: skill.source }))
  }

  const after = await observe()
  return {
    globalCommands,
    scopedCommands,
    projectSkills,
    lifecycleUnchanged: JSON.stringify(before) === JSON.stringify(after),
    before,
    after,
  }
})

return {
  name: 'draft-composer-catalog-spike',
  inject: ['commands', 'skills', 'agentPresets', 'workspaceRegistry', 'sessions', 'sessionPersistence'],
  apply(ctx) {
    pluginContext = ctx
  },
}
