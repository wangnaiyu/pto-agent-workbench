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

- [分析修复两仓合并收口](inbox/tasks/2026-09-15-repair-merge-closeout/README.md)：远端审查、顺序合并、正式配对与有限清理。

- [2026-09-09 harness upstream rebase](archive/tasks/2026-09-09-upstream-rebase/final-report.md)：固定目标、提交迁移、兼容验证与正式配对记录。

- [两仓升级前基线收口](archive/tasks/2026-09-09-pre-upstream-baseline/final-report.md)：两仓成果已合并并保存恢复点，检查与已知问题有据可查；尚未执行 upstream rebase。

- [分析启动与布局回归修复完成报告](archive/tasks/2026-09-08-artifact-analysis-launch-repair/final-report.md)：P1–P5 本地验收与提交完成，保留已归因的既有检查失败；两仓合并状态见本页收口任务。
- [仓库治理完成报告](archive/tasks/2026-09-03-repository-governance/final-report.md)：入口、迁移、项目 Skill 与验证记录。
- [2026-09-04 harness 上游 rebase](archive/tasks/2026-09-04-upstream-rebase/final-report.md)：从 alpha.5 更新到 rc.1，保留 fork 历史与工作台行为的验证记录。
- [产物查看与官方 Skill 分析 MVP](archive/tasks/2026-09-03-artifact-inspection-mvp/final-report.md)：P0–P4 实现、真实样例/浏览器验收与保留边界。
- [Inbox](inbox/README.md)：允许待整理散文件，不要求先建任务包。
- [归档](archive/README.md)：已结束任务及 [旧 notes 迁移映射](archive/legacy-notes/migration-map.md)。

## 工程与治理

- [内容归属、主题、命名与索引](docs/content-routing.md)；[任务包与交接](docs/task-workflow.md)；[项目规则](docs/rules.md)。
- [当前架构](docs/architecture.md)；[实验执行契约](docs/experiment-contract.md)；[开发与启动](docs/development.md)。
- [上游维护](docs/upstream-rebase.md)；[踩坑记录](docs/pitfalls.md)；[发行边界](docs/distribution.md)；[待复核事项](docs/maintenance-backlog.md)。
- [来源登记](references/sources.md)；[PyPTOUX 只读消费](references/PyPTOUX.md)。
- [项目工作流 Skill](../.agents/skills/workbench-project-workflow/SKILL.md)；[结构检查脚本](scripts/check-workspace.mjs)。

这些过程材料可以随源码版本管理以便恢复，但不随工作台运行时发布。work/product 描述产品与能力如何设计；work/docs 描述本仓库如何开发、运行和维护。
