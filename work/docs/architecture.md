# 当前工程架构

状态：2026-09-10 upstream rebase 维护基线。harness fork `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807` 基于固定 upstream `5dda764ed3aa172535a7967b06ff95d9cbfe536a`，包版本0.1.5-alpha.1。外层产品验证基于 `90390059746c29a71bd5315e1dce5101bb803aec`，本阶段外层只更新维护记录。正式三元配对以两仓 `post-upstream-baseline-20260910` annotated tag 为准；验证与限制见[迁移报告](../archive/tasks/2026-09-09-upstream-rebase/final-report.md)。

## 实现边界

DSH 提供 Cordis 插件、profile、Host 工具、会话与浏览器 UI。外层仓库保存启动/装配脚本、运行时 Skills、可复验 spike；harness 是独立 Git 仓库，正式 PTO Host/Client 包在其 packages 中。

扩展顺序为动态 cordis_define / cordis_run 验证、静态插件固化、必要的最小内核 seam。动态插件需要运行准入，进程内状态不能当作持久业务存储。root profile 使用 patches/cordis.patch.yml 装配；不能只修改源码而遗漏 manifest/bundle 的正式构建。

## UI 承载与通信

| 扩展面 | 当前职责与后续边界 |
| --- | --- |
| sidebar、header 等 slots | PTO 品牌、工作区分组、会话/运行记录入口 |
| conversation.input.dock 等输入区扩展 | 草稿目录与输入上下文；见 [输入区主题](../product/conversation-composer/design.md) |
| conversation.view | 已用于持久实验 Dashboard；拟承接分析视图，不再描述成“完全没有主画布扩展面” |
| shell.overlay | 已承载 Session 无关的全幅产物 Viewer；分析入口仍保留 overlay，后续 repair 需重新取证 |
| resource sidebar | upstream 新的文件/资源侧栏；旧 Details 已退役 |
| 工具比较行内折叠 | 按工具名呈现完整冻结比较证据，保留七维身份；使用原生 details，未恢复退役的 ToolDetails slot |

`ui-pto-experiments` 仍注册“实验”View。upstream 本轮重构了资源侧栏与布局；隔离实例1280×720下空实验区域宽992px、无max-width约束。该观察不证明有内容视图和所有窗口尺寸已满足产品要求，不能沿用rc.1的宽度假设直接修复。

Client → Host 通过 typed invoke/host.call；Host → Client 通过事件或会话投影。具体 API 以本地 harness 对应版本代码为准。分析选区回流仍需共享结构化上下文契约；不预设一定要阻塞模型等待选区，可先由用户显式“加入分析草稿”完成。

Session持久化采用V3相邻generation迁移与跨进程文件租约；PTO目录别名为新会话选择目录，已发现目录保持不变，前代日志不覆盖。浏览器草稿通用文件在实体化后绑定上传；正式能力准入仍保留既有拒绝/重试语义。

## 已有业务切片

- 工作区/未分组、运行记录注册与会话归组，不表示完整数据 Profile 和全量 viewer 已落地。
- 草稿能力目录、统一 Commands / Skills 来源、显式 Skill 手势、首次发送再准入。
- pto_run_discover / pto_run_inspect保留旧run契约；pto_record_inspect与artifact inspection支持markerless记录、Viewer和分析receipt。
- skills/bundled 内六个pto-*是工作台自有流程。官方Skill/resources/tool已按release-lock固定，但实际patch引用不存在的provider entry，旧/新harness均跳过；文件完整不等于装配成功。临时insert测试验证qualified Skill与receipt可用，实际部署缺陷尚未修复。
- 持久实验 proposal/query、可信 execute、L2 指标与比较、Dashboard，详见 [实验契约](experiment-contract.md)。

旧 run-only 识别、聚合 evidence health、数据分级与本文所链接的已确认产品方案存在差距。迁移文档不会改变运行时；实际调整应由 [MVP 计划](../product/artifact-inspection/implementation-plan.md) 分阶段验证。

## 下一阶段设计

[产物查看主题](../product/artifact-inspection/overview.md) 负责 Record / Data Profile、单项 evidence、Action readiness、viewer、Session 关联。 [官方 Skills 主题](../product/official-skill-integration/overview.md) 负责源版本、完整资源包、工具契约与调用溯源。共同消费 Host 事实，不把算法复制进 UI 或 Prompt。

工作台的源码/测试与运行时资源保持现有位置。work 是研发过程区，不是 Host 扫描目录、插件自动发现根或产品发行资源。
