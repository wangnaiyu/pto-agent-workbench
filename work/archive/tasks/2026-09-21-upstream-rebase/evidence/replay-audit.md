# 提交重放审计

初步候选 `7965e590f1`，30 项全部有对应，0 项丢弃；逐提交 range-diff 见 range-diff-initial.txt。`=` 8 项，`!` 22 项。此阶段仅重放完成，不表示兼容验证通过。

冲突处理依据：

- 品牌/导航：保留 PTO 名称与 Run Records，保留 upstream Desktop toggle、Plugins 面板、Workspace tree 与嵌入式 Conversation factory；布局和 golden 需运行验证。
- 首发实体化：采用 upstream SessionReference / SessionBinding 所有权，不恢复已删除的 sessions.open/clear 全局导航；草稿保持无 Session，正式导航由 uiWorkspace 保有 mainView 引用。
- preset、输入触发器和模型目录：保留 binding-keyed weak registry、现有 teardown，补充独立 draft registry 与首发准备。
- Remote/依赖：合并 composer catalog、PTO inspection/experiment 与 upstream plugin-manager/office-to-pdf；tool-present 路径按 upstream 移至 deliverables。
- CI：保留 fork 条件与 upstream 新的 apt 镜像修复；未放宽断言。
- Escape：fork escapedHit 修复由 upstream dismissed 状态机承接；它还覆盖 Shift+Tab、指针关闭与异步焦点，保留上游测试并将在本次验证。
- V4：完整保留 fork V3 schema、V3→V4 相邻迁移、V4 successor 与 analysis source 类型；upstream 新增 V3 场景及旧 V4 successor 是否应更新须由 corpus/replay 验证。
- 生成目录和翻译 hash：冲突时暂保留新版结构，最终需官方生成器和双语配对校验；不把临时 hash 当作验证通过。
- 测试：已在冲突中保留新版 retain/release 的主要测试结构；草稿与旧 API mock 的自动合并仍需编译/GUI 测试发现并逐项迁移。

## Final audit

All 30 original fork commits have counterparts; no dropped commits. One additional compatibility commit: a11460d434e652fde77d35e7558056a59cb3256f. The complete range-diff can be reproduced with `git range-diff 0d1f50007f9bca3f52b06e1c3074fa14d5fb0720..70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb ddefc45fbc7f8e46dd73185e68295696d1297887..a11460d434e652fde77d35e7558056a59cb3256f`. Compact correspondence and output digest are retained in range-diff-final.txt; large generated-fixture patches are not duplicated here.

The retained fork surfaces and all post-rebase corrections are covered by validation.md. No new global tools/agent-loop kernel workaround was introduced for the independently reproduced upstream src-loader failure.
