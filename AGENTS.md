# pto-agent-workbench AGENTS

本文件是 `pto-agent-workbench` 工作区的 agent 级入口。

## 1. 定位

- 工程区：改造 DSH 为 PTO Agent 工作台。
- 内容来源：PyPTOUX（只读，见 `references/PyPTOUX.md`）。
- 运行底座：DSH profile + 插件优先，内核改动最小化。

## 2. 多 agent 协同（暂不预设）

本工程不设固定角色分工（不再沿用 PyPTOUX 双 Agent 约定）；先由实际工作流跑出经验，再复盘沉淀多 agent 协同规则（决策记录：notes/decision-2026-08-20.md）。

## 3. 强制规则（完整版见 docs/rules.md）

- R1 改造优先级：动态插件 spike → 静态插件 → 内核改动（需记录理由）。
- R2 依赖单向：本工作区消费 PyPTOUX，反向不成立。
- R6 同一 checkout 单 writer；交接先 commit / merge（未提交工作树锁）。
- R7 agent 接手任务：先读本 AGENTS.md，再按需读 docs/pitfalls.md 与 PyPTOUX 对应 skill。
- R8 数据三级策略沿用（L1/L2/L3）；L3 不外发；L2 外发必须披露。
- R9 技术事实回权威来源校验（pypto 本地镜像 / 官方文档），不改写上游 literal。

## 4. 任务入口

- 做 spike：`experiments/`，用 cordis_define / cordis_run 验证回路。
- 固化插件：`plugins/`（client）或 `tools/`（host），新包放 harness 的 `packages/` 下。
- 装配工作台：`patches/`。
- 记录：`notes/`（notes 记录规范见 `notes/README.md`）。
