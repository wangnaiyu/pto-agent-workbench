# PTO bundled Skill baseline check

验证第三阶段的静态装配边界：

- 读取工作台真实 `skills/bundled/` root；
- 通过真实 `skill-filesystem` provider 注册 `pto-bundled`；
- 通过真实 `composerCatalog.listDraft()` 验证 PTO、DSH 和 Workspace 三类来源不混淆；
- 验证未分组草稿不泄漏 project Skill，Workspace 草稿才显示该条目；
- 加载完整 PTO Skill 正文，确认文件不是仅能被目录扫描的空 fixture。

运行：

```sh
harness/node_modules/.bin/tsx experiments/pto-bundled-skill-baseline/run-check.ts
```
