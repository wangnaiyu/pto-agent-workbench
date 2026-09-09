# AI 分析启动与对话布局回归修复

目标：修复 dependency Viewer 的“AI 分析”首次发送只投递普通文本、未绑定 Record/Skill receipt
的问题；把分析对象以简洁可见的 `/Skill`、`@文件` 和结构化 attachment 带入新会话草稿；明确
新分析与失败重试的 Session 语义；同时让工作台自有“实验”View 恢复 DSH 原生正文宽度契约。

本任务是 [2026-09-03 产物查看 MVP](../../../archive/tasks/2026-09-03-artifact-inspection-mvp/final-report.md)
的独立回归修复，不恢复或改写已归档任务。实际进度只看 [status](status.md)，执行顺序与完成
标准见 [plan](plan.md)。

## 已确认产品契约

- Viewer 按钮保持“AI 分析”。一次有意点击创建一个新 launch 和视觉上的新会话草稿页；此时
  不创建真实 Session、不调用模型。用户点击发送后才创建 Session。
- 第一版点击后退出全屏 Canvas；通过 `@deps.json` 引用重新打开 Viewer。大屏 side panel/split
  可后续实现，不是本任务完成前提。
- 输入区默认只显示：

  ```text
  /skill dependency-redundancy  @deps.json  分析冗余依赖，给出结论、证据、限制和建议。
  ```

  `/skill` 与 `@file` 必须复用正式选择/解析语义，效果等价于手动选择，不能只做视觉 token。
- 默认不显示数据集/Record 名称或 revision；provider、actionId、tool tuple、绝对路径和完整上下文
  也不在输入区展开。它们仍在结构化 attachment、Host 校验和 Session 审计中保留。
- 每次从 Viewer 有意点击“AI 分析”都产生新 launch，发送后产生新 Session；同 launch 的
  admission/model/tool 失败重试复用同一 Session。双击只算一次 activation。
- 缺 attachment/receipt 时 fail closed：不发送无上下文普通 prompt，不允许通用 Shell 手动复算
  冒充正式门禁结果。
- 保留 DSH 原生左右正文宽度手柄。具体“实验”Tab 是工作台扩展，只修其 Dashboard 布局；不为
  本任务新增 DSH 核心 `readable/wide/full-bleed/split` 模式。

正式决定见 [2026-09-08 设计记录](../../../product/artifact-inspection/notes/decision-2026-09-08.md)。

## 范围

1. 在真实当前 Web 装配中复现并定位 Viewer 草稿到 first-send admission 的断点，记录可复验
   证据，不只从 Agent 自述反推。
2. 将分析身份从 Viewer Controller 私有内存迁入正式 browser draft/attachment 状态，包含
   launchId、Record/artifact/action/qualified Skill identity 和必要 viewer reference。
3. 使用输入区正式机制程序化选择 `/skill dependency-redundancy` 与 `@deps.json`，预填短 Prompt；
   保证编辑、取消、草稿切换和未发送草稿保护。
4. 按 launchId/requestId 实现幂等 first-send：唯一 Session materialize → Host admission →
   receipt/Skill 绑定 → prompt。收敛 Skill 注入为一次，保留同 Session 重试。
5. 增加真实插件组合和浏览器端到端测试，覆盖第一次成功、准入失败重试、再次从 Viewer 新建分析、
   双击、失效 Record/Skill、缺 receipt 和禁止降级。
6. 仅在工作台自有 `ui-pto-experiments` 内适配 `--dsh-chat-content-width` 与响应式卡片；若无法在
   同一阶段通过视觉验收，暂时从装配隐藏“实验”Tab，保留工具结果详情。
7. 根据实测结果更新主题状态、验证证据和最终报告；不修改旧归档中的历史事实。

## 非目标

- SelectionRef、deeplink、图中反向定位、持久 Analysis View 或大屏 split Viewer。
- 自动判断并复用上次分析 Session，或更改“AI 分析”为“继续分析”。
- 新增 dependency 之外的官方 Skill/adapter，重写上游依赖算法或统一图引擎。
- 修改 PyPTOUX、官方只读镜像、原始样例、设备编译/运行或性能优化实验。
- 提交、push、上游同步、发布或安装新的系统依赖；需要时单独取得授权。
- 改造 DSH 原生 ConversationRoot 宽度手柄或通用 Tab 模式，除非实证表明插件侧无法修复并由
  用户另行确认 rescope。

## 授权与执行状态

用户已授权创建本任务包并更新相关产品设计文档；这不等于授权开始源码实现、提交、push 或
发布。任务初始状态为 `planned`。后续用户明确要求执行本包后，可在上述范围内按 P0–P5 连续
推进；遇到新增依赖安装、外部网络、设备执行、只读来源修改或内核 rescope 时停下请求决定。

## 接手与读取顺序

1. 从外层仓库进入，读取根 `AGENTS.md` 和
   [workbench-project-workflow Skill](../../../../.agents/skills/workbench-project-workflow/SKILL.md)。
2. 读取本包 [status](status.md) → [plan](plan.md) → 本 README；状态优先于本文的初始说明。
3. 读取 [产物查看交互](../../../product/artifact-inspection/inspection-workflow.md)、
   [输入区契约](../../../product/conversation-composer/design.md)、
   [官方 Skill 集成](../../../product/official-skill-integration/integration-design.md)和
   [工程架构](../../../docs/architecture.md)。
4. 只为理解历史证据读取旧 MVP 的
   [P2 evidence](../../../archive/tasks/2026-09-03-artifact-inspection-mvp/evidence/p2-dependency-analysis-first-send.md)，
   不执行归档恢复指令。
5. 核对外层与 harness 两个工作树；进入 harness 源码前读取其中适用的 `AGENTS.md`。当前 checkout
   有大量属于此前工作的未提交改动，必须保留，不能用 clean checkout 假设覆盖。

任务创建基线：外层 HEAD `82afed7ec374805e02c5414e000b3f4e5ea7b9df`；harness HEAD
`8a0cfdf8a8ed79e5c304be287440ebb1b001a878`。基线只用于定位，恢复时重新核对实际状态。

## 完成定义

- [plan](plan.md) 的 P0–P5 均达到退出标准，实际证据落入 [evidence](evidence/README.md)。
- 第一次真实 Viewer 点击和发送能在唯一 Session 中完成正式 Host 门禁分析；模型首步、Skill
  和工具调用均可关联同一 receipt，且不依赖手动 Shell fallback。
- 新分析、同 launch 重试、双击和未发送草稿行为符合已确认契约。
- 输入区只呈现简洁 `/skill`、`@file` 和短 Prompt；默认不显示 Record 名称/revision，同时内部
  identity 未丢失。
- “实验”View 在拖动正文宽度和窄屏下不越界，或按计划安全隐藏；DSH 原生宽度实现不被改写。
- 聚焦测试、类型/lint/build、真实 Web 浏览器路径和必要真实样例均记录通过/失败/未运行；不能
  只凭单测或截图宣称闭环。
- 稳定结论回写正式主题，`final-report.md` 完成，任务按规则归档；不自动 commit/push/publish。
