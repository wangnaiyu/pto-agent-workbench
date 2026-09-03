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
- 输入、菜单与 first-send 复用 [conversation-composer](../conversation-composer/overview.md)。
- 官方 Skill/工具来源、固定版本和开发端更新由 [official-skill-integration](../official-skill-integration/overview.md) 拥有；此处消费其能力。

## 状态

设计：用户已确认，2026-09-03 整理落盘。已有实现包含分组/记录入口、run 原语、自有 Skills 与实验 Dashboard；不等于本主题的端到端闭环已完成。当前目录治理没有执行 viewer、官方 Skill 或真实样例适配测试。

实施入口：[MVP 任务包](../../inbox/tasks/2026-09-03-artifact-inspection-mvp/README.md)。计划先验证适配能力，再做“能打开”和“能使用”，不以目录/文件存在声称可用。

未来数据建档若被批量比较、采集服务等独立消费者长期复用，并有独立验收节奏，再评估拆主题；不为预计增长预建子主题。
