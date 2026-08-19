# pto-agent-workbench AGENTS

本文件是 `pto-agent-workbench` 工作区的 agent 级入口。

## 1. 定位

- 工程区：改造 DSH 为 PTO Agent 工作台。
- 内容来源：PyPTOUX（只读，见 `references/PyPTOUX.md`）。
- 运行底座：DSH profile + 插件优先，内核改动最小化。

## 2. 角色分工（沿用 PyPTOUX 双 Agent 约定）

| 角色 | 默认职责 |
|---|---|
| Codex | host 插件（自定义工具）、构建链、profile 装配、Git / upstream rebase |
| Claude | client UI 插件（泳道 / 计算图 / 内存 / 硬件面板）、工作台视觉与交互 |
| 官方 DSH | 可作编码 agent（为 repo A 开 workspace）；dogfooding：动态插件验证回路 |

## 3. 强制规则（完整版见 docs/rules.md）

- R1 同一 checkout 单 writer；交接先 commit / merge（未提交工作树锁）。
- R2 改造优先级：动态插件 spike → 静态插件 → 内核改动（需记录理由）。
- R3 依赖单向：本工作区消费 PyPTOUX，反向不成立。
- R4 数据三级策略沿用（L1/L2/L3）；L3 不外发；L2 外发必须披露。
- R5 技术事实回权威来源校验（pypto 本地镜像 / 官方文档），不改写上游 literal。
- R6 fork 维护：定期 rebase upstream（默认分支 master），内核改动越少越好。
- R7 agent 接手任务：先读本 AGENTS.md，再按需读 docs/pitfalls.md 与 PyPTOUX 对应 skill。

## 4. 任务入口

- 做 spike：`experiments/`，用 cordis_define / cordis_run 验证回路。
- 固化插件：`plugins/`（client）或 `tools/`（host），新包放 harness 的 `packages/` 下。
- 装配工作台：`patches/`。
- 记录：`notes/`、`prompts/` 对齐 PyPTOUX 记录习惯。
