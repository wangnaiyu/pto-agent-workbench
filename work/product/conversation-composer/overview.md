# 输入区与会话起步

持续主题：输入框及周边区域、Commands / Skills 菜单、上下文选择、附件、草稿到 Session 的第一次发送与恢复。不是只记录某个 + 按钮，也不扩大为所有会话功能。

- [设计与契约](design.md)：已有交互基线及新分析草稿的补充。
- [验收](validation.md)：共用输入状态、目录 scope 与 first-send。
- [历史来源](../../archive/legacy-notes/migration-map.md)：08-25 至 08-27 的设计、实现与回归记录。

状态：草稿目录和首次发送准入已有代码及历史验证；本次未重新跑浏览器或 harness 测试。Record/Selection 分析草稿是已确认待开发扩展，协作 [产物查看主题](../artifact-inspection/overview.md)；官方 Skill 来源/固定版本由 [官方 Skills 主题](../official-skill-integration/overview.md) 拥有。

本主题拥有通用输入交互，不重复维护数据识别规则或官方 Skill 清单。每次新增周边能力先判断是否复用现有输入/草稿状态，避免为新视图克隆 composer。
