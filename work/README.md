# PTO Agent Workbench 研发导航

这里承接“如何开发工作台”的长期设计、工程规范和任务过程；产品入口是 [根 README](../README.md)。本页是唯一研发总导航，不维护第二份任务进度表。

## 产品主题

| 主题 | 解决的问题 | 关键产物 |
| --- | --- | --- |
| [已有算子产物的查看与 AI 分析](product/artifact-inspection/overview.md) | 添加数据后，知道能看什么、能分析什么，并把图与分析关联起来 | [数据接入与 Profile](product/artifact-inspection/data-intake.md) · [交互流程](product/artifact-inspection/inspection-workflow.md) · [开发计划](product/artifact-inspection/implementation-plan.md) · [验收](product/artifact-inspection/validation.md) |
| [输入区与会话起步](product/conversation-composer/overview.md) | 输入框及周边区域、能力选择、分析草稿与首次发送 | [设计与契约](product/conversation-composer/design.md) · [验收](product/conversation-composer/validation.md) |
| [官方 Skills 接入与维护](product/official-skill-integration/overview.md) | 工作台如何可靠使用上游 Skills，以及开发端如何更新 | [集成设计](product/official-skill-integration/integration-design.md) · [更新流程](product/official-skill-integration/update-workflow.md) · [验收](product/official-skill-integration/validation.md) |

数据识别/Profile 与查看分析暂时同主题分文档；输入区是独立的持续交互主题。何时新增或拆分主题见 [内容路由](docs/content-routing.md)。

## 任务入口

- [仓库治理完成报告](archive/tasks/2026-09-03-repository-governance/final-report.md)：入口、迁移、项目 Skill 与验证记录。
- [后续产物查看与分析 MVP](inbox/tasks/2026-09-03-artifact-inspection-mvp/README.md)：待明确执行授权，从 P0 兼容性验证开始。
- [Inbox](inbox/README.md)：允许待整理散文件，不要求先建任务包。
- [归档](archive/README.md)：已结束任务及 [旧 notes 迁移映射](archive/legacy-notes/migration-map.md)。

## 工程与治理

- [内容归属、主题、命名与索引](docs/content-routing.md)；[任务包与交接](docs/task-workflow.md)；[项目规则](docs/rules.md)。
- [当前架构](docs/architecture.md)；[实验执行契约](docs/experiment-contract.md)；[开发与启动](docs/development.md)。
- [上游维护](docs/upstream-rebase.md)；[踩坑记录](docs/pitfalls.md)；[发行边界](docs/distribution.md)；[待复核事项](docs/maintenance-backlog.md)。
- [来源登记](references/sources.md)；[PyPTOUX 只读消费](references/PyPTOUX.md)。
- [项目工作流 Skill](../.agents/skills/workbench-project-workflow/SKILL.md)；[结构检查脚本](scripts/check-workspace.mjs)。

这些过程材料可以随源码版本管理以便恢复，但不随工作台运行时发布。work/product 描述产品与能力如何设计；work/docs 描述本仓库如何开发、运行和维护。
