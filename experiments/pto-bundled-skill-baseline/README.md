# PTO bundled Skill baseline check

验证第三阶段的静态装配边界，并在第八阶段作为多来源联合回归：

- 读取工作台真实 `skills/bundled/` root；
- 通过真实 `skill-filesystem` provider 注册 `pto-bundled`；
- 通过真实 `composerCatalog.listDraft()` 验证 PTO、DSH、User、Workspace 和第三方插件 Skill 来源不混淆；
- 在同一装配中验证 DSH/PTO/插件全局命令，以及同名 Command/Skill 都保留；Agent preset 命令的 scope winner 由 harness 静态集成测试覆盖；
- 验证未分组草稿不泄漏 project Skill，Workspace 草稿才显示该条目；
- 从 draft 目录切换到正式 Session 目录，验证 cwd、preset 和 Workspace 归属不丢失，且读取不会额外创建 Session；
- 加载 `pto-evidence-intake`、`pto-analyze`、`pto-debug`、`pto-optimize`、`pto-compare` 和 `pto-review` 完整正文，确认官方 Skill 都不是仅能被目录扫描的空 fixture。
- 通过真实 ToolRuntime/ToolSkill 执行 `skill({name: "pto-analyze"})`，确认 Agent 路径加载的 provider、resource root 和模型可见正文仍属于 `pto-bundled`。

运行：

```sh
harness/node_modules/.bin/tsx experiments/pto-bundled-skill-baseline/run-check.ts
```
