# 实施计划

各阶段是可独立验收子任务。执行每一阶段前后必须按
[任务流程](../../../docs/task-workflow.md)更新 `status.md` checkpoint；已有授权时可连续推进，
新增权限或范围变化时停下。

## P0：真实回归复现与契约盘点

动作：在当前实际 Web 装配中从 dependency Viewer 点击“AI 分析”并发送；记录 Client launch/
draft、Session 创建、Host `admitAnalysis`、pre-step message source、Skill/tool 可见性和持久日志。
核对 DSH `/skill`、`@reference`、browser draft、Session materialize 的正式接口，以及 width handle
和 `ui-pto-experiments` 的源码来源。

交付：`evidence/p0-runtime-reproduction.md`，含精确断点、基线、调用顺序和现有测试为何漏检。

退出标准：能用可观察事实说明结构化身份在哪一步丢失；确认最小插件/通用 seam 修改范围；没有
开始以手工 Shell 结果代替正式链路。

## P1：结构化 launch draft 与简洁输入

动作：定义正式 `AnalysisLaunchDraft`/attachment identity；点击“AI 分析”生成新 launch，关闭
全屏 Canvas并进入新会话草稿页。通过输入区正式选择路径填入 `/skill dependency-redundancy`、
`@deps.json` 与短 Prompt；提供从文件引用重新打开 Viewer、取消和未发送草稿保护。

必须保证：Record 名称/revision 等全量上下文默认不显示，但仍存在于 attachment；可见 Skill 和
qualified provider/revision 保持绑定；Skill 只注入一次。

交付：Client 实现、契约测试与 `evidence/p1-analysis-draft.md`。

退出标准：点击不创建 Session/模型；UI 与手动选择语义等价；双击只创建一个 launch；已有草稿
不静默丢失。

## P2：原子 first-send 与同 Session 重试

动作：按 launchId/requestId 将 Session materialize、Host revalidation/admission、receipt/Skill
持久绑定和 prompt 发送组成不可降级事务。区分 admission attempt 与 launch：Record/Skill 变化
经用户确认后可在同 Session 发起新 attempt，但不能重新 materialize Session。收敛通用
`/skill` 与 PTO bridge，避免重复 Skill 注入。

交付：Client/Host 实现、持久审计投影、顺序/幂等/失败测试与
`evidence/p2-first-send-transaction.md`。

退出标准：准入成功前模型看不到普通 prompt；失败保留输入和 attachment；同 launch 所有重试
复用唯一 Session；缺 receipt 的门禁工具和通用 Shell fallback 均不能形成正式结果。

## P3：自定义实验 View 恢复上游布局契约

动作：不修改 DSH width handle，在 `ui-pto-experiments` 内让 Dashboard 消费
`--dsh-chat-content-width`、`min-width: 0` 与 `box-sizing: border-box`，四列卡片按断点降为两列/
单列。验证 Chat 中拖动宽度后切换“实验”以及窗口缩放。插件侧无法稳定修复时，从产品 bundle
隐藏 Dashboard Tab，但保留 tool view，并记录原因。

交付：插件 CSS/测试、视觉证据和 `evidence/p3-experiment-layout.md`。

退出标准：实验内容不越过用户设置的正文轴；当前修复对上游 ConversationRoot width 代码零改动，
或任何不可避免的内核改动已停止并取得用户 rescope。

## P4：真实组合与浏览器验收

动作：补一个跨 `ui-workspace`、`ui-conversation`、input-trigger、Skill runtime、Host inspection 的
真实组合测试；在完整 Harness 浏览器用只读 Qwen L2 dependency 记录验证首次成功、准入失败
重试、返回 Viewer 后第二次新分析、双击、草稿冲突和实验宽度。检查 Session/模型消息 source、
receipt、Skill invocation、工具两模式输出与 Session 数量。

交付：自动化测试、真实浏览器记录与 `evidence/p4-integrated-validation.md`。

退出标准：测试不使用伪造 admission source；第一次分析正式成功；第二次 Viewer 点击按预期产生
新 Session；失败恢复不产生额外 Session；原始样例 hash 不变，临时进程/输出按契约清理。

## P5：回写、报告与归档

动作：运行风险相称的 lint、typecheck、聚焦/聚合测试和 production build；更新产物查看、输入区、
官方 Skill、架构和踩坑文档的实际状态；完成 `final-report.md`，检查链接和工作树，再按任务流程
整包归档并更新研发导航。

退出标准：设计、实现、验证状态一致；旧 MVP 只作为历史证据引用；遗留项有明确归属；未自动
commit、push、发布、更新上游或修改只读来源。
