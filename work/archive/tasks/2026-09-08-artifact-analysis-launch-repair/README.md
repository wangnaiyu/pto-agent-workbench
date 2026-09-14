# AI 分析启动与对话布局回归修复

本包已完成并归档；结论、阶段提交、证据与遗留问题见 [最终报告](final-report.md)。历史授权与阶段说明不自动启动新的工作。

目标：使实际工作台具备可靠的 artifact analysis 启动体验，同时让自有实验 View 遵守正文宽度契约。升级后 P0 已把根因拆为独立 provider 装配缺失、launch/admission 生命周期缺口、可见输入与 overlay 交互、实验布局；不能继续把它们统一称为“Viewer 丢 receipt”。证据与事实见 [P0 报告](p0-report.md)。

阶段执行与提交/发布权限以最新用户授权为准，不能由本包或旧授权自动触发；当前状态和下一动作只看 [status](status.md)。阶段结果分别见 [P0 报告](p0-report.md) 与 [P1 报告](p1-report.md)。

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

## 范围与后续拆分

- P0：真实配置 / 仅补 provider 的隔离 A/B，完整数据流与 launch、附件、布局取证，重定计划。
- P1：独立工作台 config/composition repair；只让固定 official provider 在真实 Loader 组合中存在。
- P2：正式 launch 生命周期与不允许跳过 admission 的失败恢复；保留已验证正确的 Host receipt schema。
- P3：复用正式选择/reference 语义的简洁输入、overlay 退出和引用回开。
- P4：自有 experiment Dashboard 的正文宽度与容器响应式修复。
- P5：正式组合验收、文档收口和归档。

每阶段 owner、禁止混入、测试与退出标准见 [plan](plan.md)。P0-only instrumentation 全部位于隔离临时环境及任务证据；它们不是产品实现。

## 非目标

- SelectionRef、deeplink、图中反向定位、持久 Analysis View 或大屏 split Viewer。
- 自动判断并复用上次分析 Session，或更改“AI 分析”为“继续分析”。
- 新增 dependency 之外的官方 Skill/adapter，重写上游依赖算法或统一图引擎。
- 修改 PyPTOUX、官方只读镜像、原始样例、设备编译/运行或性能优化实验。
- 提交、push、上游同步、发布或安装新的系统依赖；需要时单独取得授权。
- 改造 DSH 原生 ConversationRoot 宽度手柄或通用 Tab 模式，除非实证表明插件侧无法修复并由
  用户另行确认 rescope。

## 授权

2026-09-11 用户明确仅授权 P0：隔离取证、必要 instrumentation、证据保存、根因分类与后续计划调整。不能因为上阶段已授权 rebase/远端写入而扩大到本阶段修复、提交或发布。恢复时读取最新用户授权和 [status](status.md)。

## 接手与读取顺序

1. 从外层仓库进入，读取根 `AGENTS.md` 和
   [workbench-project-workflow Skill](../../../../.agents/skills/workbench-project-workflow/SKILL.md)。
2. 读取本包 [status](status.md) → [plan](plan.md) → 本 README；状态优先于本文的初始说明。
3. 读取 [产物查看交互](../../../product/artifact-inspection/inspection-workflow.md)、
   [输入区契约](../../../product/conversation-composer/design.md)、
   [官方 Skill 集成](../../../product/official-skill-integration/integration-design.md)和
   [工程架构](../../../docs/architecture.md)。
4. 先读 [P0 报告](p0-report.md) 与 [升级后报告](../../../archive/tasks/2026-09-09-upstream-rebase/final-report.md)。只为理解历史证据读取旧 MVP 的
   [P2 evidence](../../../archive/tasks/2026-09-03-artifact-inspection-mvp/evidence/p2-dependency-analysis-first-send.md)，
   不执行归档恢复指令。
5. 核对外层与 harness 两个工作树；进入 harness 源码前读取其中适用的 `AGENTS.md`。接手时重新确认两仓真实分支、HEAD、远端和未提交改动；不能机械沿用原任务创建时的脏树假设。

任务创建基线：外层 HEAD `82afed7ec374805e02c5414e000b3f4e5ea7b9df`；harness HEAD
`8a0cfdf8a8ed79e5c304be287440ebb1b001a878`。以上是任务创建时历史定位，不是当前实施基线。升级后正式三元基线见 [P0 报告](p0-report.md)；恢复时仍重新核对。

## 完成定义

- [plan](plan.md) 的 P0–P5 均达到退出标准，实际证据落入 [evidence](evidence/README.md)。
- 第一次真实 Viewer 点击和发送能在唯一 Session 中完成正式 Host 门禁分析；模型首步、Skill
  和工具调用均可关联同一 receipt，且不依赖手动 Shell fallback。
- 新分析、同 launch 重试、双击和未发送草稿行为符合已确认契约。
- 输入区只呈现简洁 `/skill`、`@file` 和短 Prompt；默认不显示 Record 名称/revision，同时内部
  identity 未丢失。
- “实验”View 在拖动正文宽度、窄屏与资源侧栏下不越界；不默认以隐藏 Tab 代替验收，DSH 原生宽度实现不被改写。
- 聚焦测试、类型/lint/build、真实 Web 浏览器路径和必要真实样例均记录通过/失败/未运行；不能
  只凭单测或截图宣称闭环。
- 稳定结论回写正式主题，`final-report.md` 完成，任务按规则归档；不自动 commit/push/publish。
