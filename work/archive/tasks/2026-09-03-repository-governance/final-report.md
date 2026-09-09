# 仓库治理完成报告

日期：2026-09-03。授权范围内的结构治理、文档迁移、项目 Skill 和验证已完成。产品实现未在本任务启动。

## 交付

- [研发总入口](../../../README.md)：work/README 统一导航；根 README 只介绍产品。
- [内容路由](../../../docs/content-routing.md)、[任务流程](../../../docs/task-workflow.md)、[规则](../../../docs/rules.md)：当前规范的唯一详细来源。
- 三个长期主题： [产物查看与 AI 分析](../../../product/artifact-inspection/overview.md)、[输入区](../../../product/conversation-composer/overview.md)、[官方 Skills 接入](../../../product/official-skill-integration/overview.md)。
- 根 AGENTS 与项目 workbench-project-workflow Skill：入口负责必读边界，Skill 按需读规范，不复制全套规则；开发与 runtime Skill 分开。
- 旧 docs / references 已治理进入 work，补上当前架构、实验执行契约、发行边界和维护清单。
- 原根 notes 共 11 份完整归档，48 个二级分区均有 [迁移映射](../../legacy-notes/migration-map.md)，原字节 SHA-256 验证通过。根 notes 已移除；未丢弃原文，可从归档取回。根 prompts 本次前已不存在，不重建。
- Inbox 支持散材料、复杂任务包及忽略的可重建 scratch。完成本包归档，不留活动副本。
- 后续 [MVP 任务包](../2026-09-03-artifact-inspection-mvp/final-report.md) 已于 2026-09-04 完成并归档；不是本轮执行授权的延伸。

## 验证与边界

[完整验证记录](evidence/verification.md)：13/13 自动化测试、结构/链接/归档检查、Skill 格式、独立四场景只读演练、启动脚本语法、模板打包 dry run、密钥扫描与 Git diff 检查通过。

验证中对现有密钥检查器做了一个相关最小修复：迁移后的 Git 删除路径不再触发读取错误，实际新文件和读取失败仍被检查。它是开发检查修复，不是产品功能变更。

没有修改 harness、产品 bundled Skill 正文、setup/start、profile 或样例/官方镜像；没有 commit、push、发布、上游更新或安装。harness HEAD 仍为 489f3f65b1e0218e4f59834e40c422dec1196f9c，工作树 clean；外层所有本轮变化保留未提交。

实际 viewer/官方 Skill 兼容、产品 E2E 和全量 build 未验证；项目 Skill 的新会话自动发现也未验证。现有 runtime 的旧数据规则与新设计差距已列入后续任务，未假装完成行为迁移。

## 下一步

由用户明确启动后续 MVP 的执行范围，再从 P0 核对真实样例、工具/Skill 版本与资源树，验证一个 Viewer 和一个官方只读分析的最小闭环。不要从历史归档中的旧“下一步”恢复其他工作。
