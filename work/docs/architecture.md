# 当前工程架构

状态：2026-09-24 upstream rebase。harness fork `19c1a836a76824be9a2be8773f419d392de01d4b` 基于 upstream `46a7f68b0922371ce7144b668b90e377d8e799f4`，版本 0.1.7-rc.1。外层起点为 `16bb4c30cac7b8a423ed08fec34d65fa80058fd2`。正式三元配对以两仓 `post-upstream-baseline-20260924` annotated tag 为准；验证与限制见[升级报告](../archive/tasks/2026-09-24-upstream-rebase/final-report.md)。

## 实现边界

DSH 提供 Cordis 插件、profile、Host 工具、会话与浏览器 UI。外层仓库保存启动/装配脚本、运行时 Skills、可复验 spike；harness 是独立 Git 仓库，正式 PTO Host/Client 包在其 packages 中。

扩展顺序仍为动态插件验证、静态插件固化、必要的最小内核 seam。alpha.2 已退役 cordis_define / cordis_run；Creator 保留 cordis_inspect_list / cordis_inspect_query 只读检查，持久插件按 bundle 编写并经 plugin_manager 安装。动态验证须使用当前插件装配机制，进程内状态不能当作持久业务存储。root profile 使用 patches/cordis.patch.yml 装配；不能只修改源码而遗漏 manifest/bundle 的正式构建。

## UI 承载与通信

| 扩展面 | 当前职责与后续边界 |
| --- | --- |
| sidebar、header 等 slots | PTO 品牌、工作区分组、会话/运行记录入口 |
| conversation.input.dock 等输入区扩展 | 草稿目录与输入上下文；见 [输入区主题](../product/conversation-composer/design.md) |
| conversation.view | 已用于持久实验 Dashboard；拟承接分析视图，不再描述成“完全没有主画布扩展面” |
| shell.overlay | 已承载 Session 无关的全幅产物 Viewer；分析入口仍保留 overlay，后续 repair 需重新取证 |
| resource sidebar | upstream 新的文件/资源侧栏；旧 Details 已退役 |
| 工具比较行内折叠 | 按工具名呈现完整冻结比较证据，保留七维身份；使用原生 details，未恢复退役的 ToolDetails slot |

`ui-pto-experiments` 仍注册“实验”View。2026-09-15 隔离实例1280×720下空实验区域宽992px、无max-width约束；该历史测量不是当前版本的全尺寸验收。本轮聚焦浏览器验证覆盖草稿、首发、折叠、滚动和 Skill 展示；未扩大有内容实验视图的产品结论。

Client 以 SessionReference 的 retain/release 管理所有权，SessionBinding 承载组件作用域状态；主界面由 uiWorkspace 保持 mainView 引用。冷草稿目录在查询期间持有 AgentPresetRegistry 的 revision lease，通过最小 `serviceForScope` seam 读取隔离服务。PTO 浏览器草稿不持有 Session，首次发送等待引用就绪并按序准备 preset、目录与附件；异步完成只清理对应 revision。ConversationMainPanel 使用上游 conversation.content factory。

Client → Host 通过 typed invoke/host.call；Host → Client 通过事件或会话投影。具体 API 以本地 harness 对应版本代码为准。分析选区回流仍需共享结构化上下文契约；不预设一定要阻塞模型等待选区，可先由用户显式“加入分析草稿”完成。

Session 当前写入 V5，保留跨进程文件租约与不可变历史代。官方 V4 与旧 PTO V4 正文不同，外层 patch 为旧 PTO 根目录显式设置 `legacyPtoV4: true`；旧 V4 经上游正文转换后发布已校验 V5，官方 V4 使用默认路径。两条 V4 根目录不可混用，V5 统一可读。PTO目录别名为新会话选择目录，已发现目录保持不变，前代日志不覆盖。浏览器草稿通用文件在实体化后绑定上传；正式能力准入仍保留既有拒绝/重试语义。

## 已有业务切片

- 工作区/未分组、运行记录注册与会话归组，不表示完整数据 Profile 和全量 viewer 已落地。
- 草稿能力目录、统一 Commands / Skills 来源、显式 Skill 手势、首次发送再准入。
- pto_run_discover / pto_run_inspect保留旧run契约；pto_record_inspect与artifact inspection支持markerless记录、Viewer和分析receipt。
- skills/bundled 内六个pto-*是工作台自有流程。官方 Skill/resources/tool 已按 release-lock 固定；实际 patch 的 provider insert 已在先前修复基线落地，本次核验唯一有效 provider。真实工具与官方两模式分析成功，确定性本地模型替身驱动的验证不等同真实模型评估。
- 持久实验 proposal/query、可信 execute、L2 指标与比较、Dashboard，详见 [实验契约](experiment-contract.md)。

旧 run-only 识别、聚合 evidence health、数据分级与本文所链接的已确认产品方案存在差距。迁移文档不会改变运行时；实际调整应由 [MVP 计划](../product/artifact-inspection/implementation-plan.md) 分阶段验证。

## 下一阶段设计

[产物查看主题](../product/artifact-inspection/overview.md) 负责 Record / Data Profile、单项 evidence、Action readiness、viewer、Session 关联。 [官方 Skills 主题](../product/official-skill-integration/overview.md) 负责源版本、完整资源包、工具契约与调用溯源。共同消费 Host 事实，不把算法复制进 UI 或 Prompt。

工作台的源码/测试与运行时资源保持现有位置。work 是研发过程区，不是 Host 扫描目录、插件自动发现根或产品发行资源。
