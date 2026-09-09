# 当前工程架构

状态：2026-09-04 维护基线。外层初始 HEAD d90b8cc8177df6e046a5c10fd3add3a65a808ca2；harness HEAD 8a0cfdf8a8ed79e5c304be287440ebb1b001a878，包版本 0.1.2-rc.1。这里区分源码现状与下一阶段设计，不把历史回归结果当作本次测试。

## 实现边界

DSH 提供 Cordis 插件、profile、Host 工具、会话与浏览器 UI。外层仓库保存启动/装配脚本、运行时 Skills、可复验 spike；harness 是独立 Git 仓库，正式 PTO Host/Client 包在其 packages 中。

扩展顺序为动态 cordis_define / cordis_run 验证、静态插件固化、必要的最小内核 seam。动态插件需要运行准入，进程内状态不能当作持久业务存储。root profile 使用 patches/cordis.patch.yml 装配；不能只修改源码而遗漏 manifest/bundle 的正式构建。

## UI 承载与通信

| 扩展面 | 当前职责与后续边界 |
| --- | --- |
| sidebar、header 等 slots | PTO 品牌、工作区分组、会话/运行记录入口 |
| conversation.input.dock 等输入区扩展 | 草稿目录与输入上下文；见 [输入区主题](../product/conversation-composer/design.md) |
| conversation.view | 已用于持久实验 Dashboard；拟承接分析视图，不再描述成“完全没有主画布扩展面” |
| shell.overlay | 全幅、Session 无关查看的候选落点；Root scope 可用性需 P0 spike 验证 |
| details | 当前对象的局部属性，不应承担所有大图的唯一主画布 |
| tool.result.detailview | 以工具名匹配的冻结实验比较结果呈现，不等同于任意工具调用或实时查询面板 |

对话正文的左右对称宽度手柄与 `--dsh-chat-content-width` 属于 DSH 上游阅读宽度设计；工作台
自行增加的是通过 `ui-pto-experiments` 注册的具体“实验”View。自定义 View 应消费上游宽度轴
并在窄宽度响应式降列，不修改 DSH 核心去猜 View 类型。若自定义 View 无法满足该契约，应先
从产品装配隐藏，而不是让内容越过用户设置的正文边界。

Client → Host 通过 typed invoke/host.call；Host → Client 通过事件或会话投影。具体 API 以本地 harness 对应版本代码为准。分析选区回流仍需共享结构化上下文契约；不预设一定要阻塞模型等待选区，可先由用户显式“加入分析草稿”完成。

## 已有业务切片

- 工作区/未分组、运行记录注册与会话归组，不表示完整数据 Profile 和全量 viewer 已落地。
- 草稿能力目录、统一 Commands / Skills 来源、显式 Skill 手势、首次发送再准入。
- pto_run_discover / pto_run_inspect：有限扫描、PyPTO 3.0 marker、能力探测等旧版 run 契约。
- skills/bundled 内六个 pto-* 是工作台自有流程，不是 PyPTO 官方 Skill 的镜像。
- 持久实验 proposal/query、可信 execute、L2 指标与比较、Dashboard，详见 [实验契约](experiment-contract.md)。

旧 run-only 识别、聚合 evidence health、数据分级与本文所链接的已确认产品方案存在差距。迁移文档不会改变运行时；实际调整应由 [MVP 计划](../product/artifact-inspection/implementation-plan.md) 分阶段验证。

## 下一阶段设计

[产物查看主题](../product/artifact-inspection/overview.md) 负责 Record / Data Profile、单项 evidence、Action readiness、viewer、Session 关联。 [官方 Skills 主题](../product/official-skill-integration/overview.md) 负责源版本、完整资源包、工具契约与调用溯源。共同消费 Host 事实，不把算法复制进 UI 或 Prompt。

工作台的源码/测试与运行时资源保持现有位置。work 是研发过程区，不是 Host 扫描目录、插件自动发现根或产品发行资源。
