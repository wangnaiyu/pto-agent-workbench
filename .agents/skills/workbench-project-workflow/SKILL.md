---
name: workbench-project-workflow
description: Locate and organize pto-agent-workbench development documents and topics, triage or migrate work materials, and create, resume, checkpoint or archive bounded task packages. Use for development-content lookup, repository content changes and task handoff; not for general product questions or PTO runtime data analysis.
---

# 项目内容组织与任务交接

本 Skill 服务开发工作台的 Agent，不是工作台产品内部的 PTO 分析能力。仅在 pto-agent-workbench 外层工程使用；不得把它装入产品 skills/bundled。它引用仓库内规范，复制到其他仓库不会自动成为通用 Skill。

## 定位与按需读取

先确认外层根目录并读 [AGENTS](../../../AGENTS.md)。通过 [研发导航](../../../work/README.md) 找到相关主题或用户指定的任务，不加载全部主题/归档。

- 新增、更新、查找或迁移研发内容：读 [内容路由](../../../work/docs/content-routing.md)，再读目标主题 overview 和相关正文。
- 创建、恢复、推进或结束复杂任务：读 [任务流程](../../../work/docs/task-workflow.md)，再读该包 README、status 和当前阶段 plan。
- 涉及授权、只读来源、工程/过程边界或规则冲突：读 [基本规则](../../../work/docs/rules.md)。

## 执行

1. 确认任务意图是评审、修改、恢复还是归档，并保留原授权范围。阅读/评审不隐含写文件，设计确认不隐含功能开发、提交或发布。
2. 按内容用途选唯一主归属。数据接入/Profile 与产物查看分析属于同一场景主题；跨主题内容链接复用。不要按代码模块或文件数量自动拆主题。
3. 如恢复已有任务，先核对 status 与真实文件、外层/harness 两个工作树。只继续当前未完成步骤，保留他人改动，不从第一步重做。
4. 在正确位置修改正式内容。将证据与解释分开，标明设计、实现、验证的实际状态；不把历史笔记直接复制成另一份当前规范。
5. 仅在新增主题/关键产物/路径迁移时更新总导航；有长期价值的决定进入主题 notes。已有任务在关键 checkpoint 更新 status，不把进度再复制到 Prompt 或 README。
6. 迁移检查入站链接与目标内容；归档保留来源和替代映射。结束任务前确认稳定内容已回写，再按规范整包归档并更新引用。

## 交付检查

检查本次涉及的路径、链接、索引和状态，报告实际验证与未验证项。若使用 [结构校验脚本](../../../work/scripts/check-workspace.mjs)，它只验证机械约束，不能证明设计正确或模型自动触发成功。

不为零散 Inbox 材料或小修复强制创建任务包；不要求每次更新都有 Prompt/整套模板。不执行归档中的旧恢复指令，不读取凭据或复制原始样例来填满任务包。查不到目标时先检索与检查；只有实质改变范围或无法安全判断的问题才请求用户决定。
