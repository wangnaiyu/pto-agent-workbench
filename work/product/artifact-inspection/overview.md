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

2026-09-04 MVP 的 Host Record/Profile、artifact inventory、动作就绪度和静态 Viewer 能力继续有效。升级后 P0 在正式三元基线上重新核验：实际工作台 patch 未实例化锁定 official provider，导致首次 admission 拒绝、receipt 未生成；隔离环境仅补 provider 后，receipt/Skill/真实工具链完整。

独立剩余问题是 relaunch/目标变化/刷新可能跳过 admission、未发送草稿保护、普通预填与 overlay 未退出，以及有内容实验页不跟正文宽度、窄容器溢出。不能再统一归因为“Viewer 丢 receipt”。纯 Viewer 已接收完整 record+handle，它在 admission 前打开，并不消费分析 receipt。

事实与限制见 [2026-09-11 P0 取证](notes/p0-findings-2026-09-11.md)，当前任务见 [分析启动与布局回归修复](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/README.md)。P0 只取证和重排计划，产品尚未修复；新 launch、同 launch retry、规范输入和宽度的已确认产品意图不变。

历史实施证据与边界见[已归档 MVP 报告](../../archive/tasks/2026-09-03-artifact-inspection-mvp/final-report.md)。
后续 selection/deeplink、持久 Analysis View 和更多 adapter 另立任务。

未来数据建档若被批量比较、采集服务等独立消费者长期复用，并有独立验收节奏，再评估拆主题；不为预计增长预建子主题。
