# 输入区与会话起步

持续主题：输入框及周边区域、Commands / Skills 菜单、上下文选择、附件、草稿到 Session 的第一次发送与恢复。不是只记录某个 + 按钮，也不扩大为所有会话功能。

- [设计与契约](design.md)：已有交互基线及新分析草稿的补充。
- [验收](validation.md)：共用输入状态、目录 scope 与 first-send。
- [历史来源](../../archive/legacy-notes/migration-map.md)：08-25 至 08-27 的设计、实现与回归记录。

状态：草稿目录和通用首次发送准入已有基线；2026-09-08 真实体验确认 Viewer 发起的 Record
分析草稿没有在实际 Web 组合中把结构化准入带到模型首步，2026-09-04 的闭环结论仅保留为
历史分层测试证据。修复任务将使用可见 `/skill`、`@file` 和正式 attachment 重建这条路径。
SelectionRef 尚未实现，静态 viewer 明确不支持选区/深链。协作 [产物查看主题](../artifact-inspection/overview.md)；官方 Skill 来源/固定版本由
[官方 Skills 主题](../official-skill-integration/overview.md) 拥有。

本主题拥有通用输入交互，不重复维护数据识别规则或官方 Skill 清单。每次新增周边能力先判断是否复用现有输入/草稿状态，避免为新视图克隆 composer。
