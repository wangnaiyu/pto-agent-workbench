# 升级计划

## 顺序与完成标准

1. 清点：登记旧 docs、references、notes 和引用；确认两仓基线；建立逐项迁移清单。
2. 治理入口：建立 work 导航、规范、项目 Skill 与根 AGENTS；旧新入口成套更新。
3. 内容迁移：原文 notes 全量归档；当前结论进入三主题或工程指南；未确认历史待办不自动进入执行范围；根 README 只面向产品。
4. 验证与交接：检查链接、命名、索引、Skill、脚本及打包边界；记录未验证项；建立后续产品实施任务包但不启动功能开发；完成本包归档。

## 已确认的结构决策

- 工程代码保留位置，研发过程集中到 work。
- work/README.md 是唯一研发总导航，不再增加 INDEX.md。
- 三主题：artifact-inspection（包含接入建档及查看分析）、conversation-composer、official-skill-integration。
- 当前规则、历史决定、执行状态分开维护；完整规则单一来源。
- 根 notes 最终移除，原文保存在 work/archive/legacy-notes；不改写原文来伪装成当前规范。
- Inbox 可放临时文件；复杂任务放 inbox/tasks；scratch 不保存唯一证据。
- 开发 Agent Skill 放 .agents/skills，与产品运行时 skills 分离。
- 产品不做数据 share-safe 分级；来源真实性、Host 权限和发布范围是独立约束。

## 验收边界

静态检查不冒充实际模型自动触发或完整产品 E2E。原脚本与运行时代码不变时，采用路径、语法及隔离 smoke 验证，不执行 setup 的联网安装或全量重构建。若需要实际变更运行时，停止并另行确定范围。
