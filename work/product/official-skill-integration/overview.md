# 官方 Skills 接入与维护

解决两个问题：工作台 Agent 真正复用官方分析流程；开发者能从持续更新的官方仓库吸收更新，同时保证已发布版本和已有分析可复现。

- [集成设计](integration-design.md)：资源树、provider、调用、工具依赖与来源。
- [开发端更新流程](update-workflow.md)：候选源、锁定版本、验证、发布与回退。
- [验证](validation.md)：不是只检查菜单出现。
- [来源定位](../../references/sources.md)：本地镜像与当前快照。

状态：首个固定官方 runtime 能力已于 2026-09-04 落地：dependency-redundancy Skill、引用资源
和对应工具以固定 revision 纳入可分发 runtime，并通过 qualified resolver 绑定到分析动作。
这不是通用 registry/更新系统；现有六个 pto-* bundled Skills 仍是工作台自有，不能标成
PyPTO upstream official。

用户已明确授权本次分发固定资源；上游 Skill 没有声明许可的 provenance 风险仍记录在物料
manifest/验收中，授权不等于补足许可。工具自身的许可随分发副本保留。

更新入口仍只在开发端：没有工作台 UI 检查更新按钮，也不由用户分析 Session 拉取最新
Skills。[产物查看](../artifact-inspection/overview.md) 消费具体官方只读分析能力；[输入区](../conversation-composer/overview.md) 消费可信目录与明确选择。
