# 已有算子产物的查看与 AI 分析

## 用户问题与范围

“我有一套 PyPTO 数据，想知道能打开哪些图，并结合图让 Agent 读数据、回答问题。”

同一主题覆盖：Workspace 数据接入与扫描、Run/Evidence Pack 识别、内部 Data Profile、证据与可用动作、既有 viewer 打开、分析草稿、Session / Analysis View 与结果关联。建档与使用属于一条连续用户链路，现阶段同主题分文档，不拆成两个平行主题。

不包含：新建算子工程、设备编译/重跑、性能自动优化、完整数据湖或统一图引擎。用户可以关联源码，但这不自动授权修改源码。

## 文档与协作

- [数据接入与内部 Profile](data-intake.md)：数据对象、事实、能力解析。
- [查看与分析交互](inspection-workflow.md)：卡片、全幅查看、草稿、持久分析视图。
- [实现计划](implementation-plan.md)：边界、适配器、阶段与交付。
- [验证矩阵](validation.md)：真实样例与负向场景。
- [本次设计决定](notes/decision-2026-09-03.md)：覆盖旧规则的依据。
- [分析启动回归修复决定](notes/decision-2026-09-08.md)：可见 `/Skill` / `@文件`、新分析与重试语义、DSH 布局边界。
- 输入、菜单与 first-send 复用 [conversation-composer](../conversation-composer/overview.md)。
- 官方 Skill/工具来源、固定版本和开发端更新由 [official-skill-integration](../official-skill-integration/overview.md) 拥有；此处消费其能力。

## 状态

2026-09-04 MVP 的 Host Record/Profile、artifact inventory、动作就绪度和静态 Viewer 能力继续有效。升级后 P0 将回归分为 provider 装配、launch/admission、可见输入和实验布局四项，原始证据见 [P0 取证](notes/p0-findings-2026-09-11.md)。不能统一归因为“Viewer 丢 receipt”：Viewer 接收完整 Record+handle，并不消费分析 receipt。

后续独立修复已形成可恢复的本地提交并通过各阶段验收：实际 patch 正式插入唯一锁定 provider；分析 launch 保留首发及失败重试绑定；规范 Skill 手势与结构化文件引用支持草稿恢复、Viewer 退出与回开、单次 Skill 注入；实验 Dashboard 消费正文宽度并按容器适配。Host receipt schema、Session V3 与 ConversationRoot 宽度实现均保持原契约。对应证据见任务的 [P1](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/p1-report.md)、[P2](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/p2-report.md)、[P3](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/p3-report.md)、[P4](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/p4-report.md) 报告。

上述结论是分阶段修复与验证，不代表主分支已发布或全套门禁绿色。既有 lint、GUI/browser 失败及重启后 Dashboard 仅查询已载入 Session 的限制仍保留；最终组合回归与收口以 [当前任务状态](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/status.md) 为准。

历史实施证据与边界见[已归档 MVP 报告](../../archive/tasks/2026-09-03-artifact-inspection-mvp/final-report.md)。
后续 selection/deeplink、持久 Analysis View 和更多 adapter 另立任务。

未来数据建档若被批量比较、采集服务等独立消费者长期复用，并有独立验收节奏，再评估拆主题；不为预计增长预建子主题。
