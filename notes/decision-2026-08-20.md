---
owner: DeepSeek
status: accepted
source: user
decision: accepted
---

# decision-2026-08-20: 移除"双 Agent 协作分工"限制

## 背景

工程骨架沿用了 PyPTOUX 的"双 Agent 协作分工"约定：

- AGENTS.md §2「角色分工」：Codex → host 插件 / 构建 / 装配 / rebase；Claude → client UI / 工作台视觉；官方 DSH → dogfooding 动态插件验证。
- docs/rules.md R7「分工」：同上的角色映射。
- references/PyPTOUX.md：「双 Agent 分工沿用：Codex（规划/事实/构建/Git）、Claude（前端/视觉/交互）」。

## 决策

本工程内不再按"双 Agent 协作分工"执行，移除该限制：

- AGENTS.md §2 改为「多 agent 协同（暂不预设）」，不设固定角色分工。
- docs/rules.md 删除 R7「分工」，R8–R14 顺延为 R7–R13。
- references/PyPTOUX.md 删除「双 Agent 分工沿用」条目（PyPTOUX 自身的约定仍可作为其内容参考，但不约束本工程）。

## 理由

双 Agent 分工是 PyPTOUX（内容与知识库项目）的内部约定，直接套用到本工程（DSH 改造工程）没有实际运行验证；真实的协同需求要等工作台工作流实际跑起来才知道。先去掉硬性限制，避免预设角色束缚实际协作方式。

## 影响

- 单 writer / 交接纪律（现 R6）不受影响，继续有效。
- 只移除"角色分工"限制；接手流程（现 R7）、改造优先级（R1）、数据规则（R8/R9）、发布（R10/R11）、记录（R12/R13）等其余规则不变。

## 后续

待工作流实际跑通一段时间后，复盘真实多 agent 协同模式，再沉淀正式规则（回填本记录或另立新 decision）。
