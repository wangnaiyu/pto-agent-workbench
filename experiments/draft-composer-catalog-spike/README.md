# 草稿能力目录动态 spike

本实验验证 `work/archive/legacy-notes/decision-2026-08-25.md` 第一阶段：动态 Host 插件在不创建 Agent 或 Session 的情况下读取全局命令、指定 preset 的 standing-scope 命令，以及指定 Workspace 的项目 Skills。

## 运行

```sh
cd harness
pnpm exec tsx ../experiments/draft-composer-catalog-spike/run-spike.ts
```

`host.js` 是可直接交给 `cordis_define` 的纯 JavaScript Host half 函数体。`run-spike.ts` 通过真实 `DynamicCordisRunnerService.define()`、`run()` 和 package-private `invoke()` 执行它，并用受控的命令层、Skill registry、Workspace 和持久化快照验证结果。

## 验证点

- 未分组请求只返回全局命令，且不读取 preset 或任何 Skill registry。
- Workspace 请求读取全局命令与 standing-scope 有效命令，能观察 Agent 新增命令和同名覆盖。
- 项目 Skills 来自 preset 对应的 Skill registry；根 registry 中故意放置的同源诱饵不会进入结果。
- 只保留 `project-dsh`、`project-agents` 且用户可调用的 Skills，wire 结果不含路径、provider 或 locator。
- 每次查询前后比较 live Session id 与持久化 session revision；两种请求都必须得到 `lifecycleUnchanged: true`。

## 结论

完整只读回路可行，但纯动态插件不能凭现有 API 正确完成。命令注册表原本只有 Agent-bound `list(agent)`，preset roster 也只能借助 Agent 读取 isolate realm 内的服务；实验因此依赖两个最小只读扩展：`commands.listGlobalDescriptors()` / `commands.listForScope()`，以及 `agentPresets.serviceForStanding()`。它们不提供草稿执行，也不改变 Session 创建语义。

下一阶段把协议适配、来源过滤、冲突裁决、局部错误和 generation 固化到静态 Host 边缘 package；动态插件仍保持进程内实验，不进入发布装配。
