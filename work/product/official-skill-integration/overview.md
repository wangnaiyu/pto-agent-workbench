# 官方 Skills 接入与维护

解决两个问题：工作台 Agent 真正复用官方分析流程；开发者能从持续更新的官方仓库吸收更新，同时保证已发布版本和已有分析可复现。

- [集成设计](integration-design.md)：资源树、provider、调用、工具依赖与来源。
- [开发端更新流程](update-workflow.md)：候选源、锁定版本、验证、发布与回退。
- [验证](validation.md)：不是只检查菜单出现。
- [来源定位](../../references/sources.md)：本地镜像与当前快照。

状态：设计已确认，registry / lock / 官方 runtime bundle 尚未实施。本次创建的是开发工作流 Skill，不是这些产品能力。现有六个 pto-* bundled Skills 为工作台自有，来源不能标成 PyPTO upstream official。

用户要求的更新入口只在开发端：没有工作台 UI 检查更新按钮，也不由用户分析 Session 拉取最新 Skills。 [产物查看](../artifact-inspection/overview.md) 消费具体官方只读分析能力；[输入区](../conversation-composer/overview.md) 消费可信目录与明确选择。
