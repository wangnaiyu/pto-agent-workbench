# 重放与消费者适配审计

固定 upstream 与升级前 SHA 见 baseline.json。隔离目录 `/private/tmp/pto-harness-upstream-20260915`，分支 `codex/upstream-rebase-20260915`；恢复分支 `codex/pre-upstream-master-20260915`。

- 旧 master 唯一 merge 163e8ddd 的 tree 等于第二 parent 368c446657（上次收口已证实，最终审计复核），重放扁平化 merge 拓扑。
- 408f1cc：PTO hero 品牌保留，上游 official hero 已不注册，生成 slot catalog 合并只列 PTO；最终须重新生成。
- 6a37837：欢迎区从 ConversationRoot 迁移到上游新 ConversationContent；保留 ConversationMainPanel 与全局 panels。
- 0547177：保留 run records，使用上游新的 recency/manual 排序机制，未恢复已退役 sessionUpdatedAtByAccount。
- a782e67：alias 源码自动合并；双语同源段落自动合并，pairing 哈希重记。
- 13c873b：延迟实体化、草稿模型/权限、Host cwd 逻辑迁移；删除的 FakeApiClient 与 connection fixture 不恢复，需在新 test-support owner 更新默认 cwd。ConversationContent 接收草稿位置逻辑。权限选择器已从 InputBar 移出：不恢复旧 Access UI，需要 R2 把草稿权限接到新插件组件。workspace 新排序测试仍需更新 blank 隐藏预期。
- c886a00：保留 upstream lifecycle 事件筛选与 policy preflight，在有效步骤添加 canonical guard；测试需 R2 执行复核。
- f822cf3：保留 Blacksmith/selfhosted 路由，在 fork 使用公开 runner 与 no-op；新增上游步骤需 R2 检查 guard 完整性。
- 4b77250：composer remote 与上游新 remote 列表并存；生成目录最终统一重建。
- 57b5e6c：draft trigger 与上游文件 action、菜单 label/icon 并存；保留上游 400px 上限并加入 PTO 来源与描述截断。新 Preview 与 draft target 类型待 typecheck。
- 0ad688e：显式 /skill 手势保留，文档保留上游模型可调用/工具可见性限定。
- 81c4bee：正式目录准入与新 abortable Skill fetch 合并；保留 fixture 的 openSession + 新草稿状态。

以下补充后续提交的消费者审计；具体通过数量以验证报告为准，range-diff 单独不能证明运行正确。


## 后续提交与最终消费者

- 67d209f0：保留可信实验准入、执行和对比链；适配新 subprocess/readonly FS。实际官方两模式工具分析及 GUI/PTO 单元覆盖。
- 8f6e8833：保留来源、截断、草稿能力选择；新版 command definition 身份用于本地化，草稿补共用模糊匹配。
- f783220a、112a112c、d7f443d3：包依赖、Typert、执行合同随本次统一版本更新；安装、构建、hygiene 和执行测试覆盖。
- fc8ecaa0、4d538cc0：保留草稿 Agent 默认选择与 slash launcher；新 Command、IME、caret 语义由 lifecycle 14 项及 GUI 覆盖。
- 6a27634c、977c3795：继承 fork runner/版本策略，新版 0.1.6 manifest 与 CI canonical guard 已检查。
- ff994e59：仪表盘基于 Session snapshot 的测试语义保留。
- 01d945d3：不恢复删除的空 invariant 或已退役客户端合同，按新版能力归属完成迁移。
- dfee89b2：保留 artifact inspection、官方 Skill；删除残留的 remote→声明文件路径别名，独立 HMR 通过。
- ac2b72a9：保留持久化来源与侧栏集成；冻结 V3 schema 后新增 V4，旧 generation 字节保持。
- e92a21ad：保留 launch binding 与 retry 准入；工作台实际运行两种官方约简模式成功，retry 单元证据与 live 成功路径分开报告。
- e80fa835：保留正式引用、附件与 Skill 上下文；补齐正式目录源路径及规范 `/skill name` 的发送后预览，真实浏览器重载通过。
- 368c4466：保留 P4 布局和仪表盘，GUI 全量与实际 Viewer 核验覆盖。

28 个旧非 merge 提交均在 commit-mapping.json 一一映射；21 个非 patch-equivalent 的适配不能解读为丢弃提交。额外兼容提交 198b703 与其后的 V4/浏览器合同修复属于本次升级修复层。
