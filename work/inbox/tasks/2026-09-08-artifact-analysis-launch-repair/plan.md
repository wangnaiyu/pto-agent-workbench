# 升级后实施计划

依据：[P0 报告](p0-report.md) 与 [证据索引](evidence/README.md)。本计划描述将来实施，不授予执行权限；当前步骤与授权只在 [status](status.md)。每阶段按 [任务流程](../../../docs/task-workflow.md)记录开始/完成 checkpoint。P0 后停止，不能连续进入 P1。

## P0：实际装配对照、分层取证与重定基线

唯一目标：在正式升级后三元基线上判定问题发生的层次，建立 A 真实配置 / B 仅 insert official provider 对照，重排后续修复。

范围：隔离 home、实际 built CLI/patch、确定性外部模型替身、真实 Host/Skill/工具/Session/Viewer；launch 与 retry 矩阵、附件持久化、有内容布局、源码与定向测试。仅保留取证代码和文档。

退出标准：真实配置与 provider 对照有可关联事件；区分未生成 receipt、跳过 admission、完整 receipt/工具闭环与纯查看；剩余假设标明证据等级；后续 owner 和边界明确；未实施 repair，主分支 ref 不改，临时进程退出。

交付：[p0-report.md](p0-report.md)、[evidence](evidence/README.md)、此计划。P0 不以所有功能测试变绿为目标。

## P1：独立工作台 config/composition repair

唯一目标：实际产品装配能注册锁定的 `pypto-official-af1d7a016ce5` provider；消除不存在 entry 的 id override。

- Owner / 修改范围：外层 `patches/cordis.patch.yml`，必要的外层装配检查与官方集成状态文档。默认不改 harness 源码。
- 实现边界：按 Loader 的真实 insert/override 语义表达一个 provider，保留固定 release、显式 Skill 根、`includeDefaultRoots: false`、`watch: false` 和 tool tuple。不要把临时 observer 或整个上游仓库装入产品。
- 禁止混入：Viewer/launch/retry、receipt schema、layout、开发 Skill 自动发现策略、升级或通用 provider registry 重构。
- 测试：实际 Loader 组合验证 provider 存在且唯一；root/draft 与 Session qualified lookup 指向同一锁定资源；错误 id/缺 provider 的负向装配测试必须失败；真实首发的 receipt→Skill source→真实双模式工具链；依 scope 执行外层结构检查及 harness 必要消费检查。
- 完成条件：无需额外临时 provider patch 的实际工作台能完成首次正式 analysis；不得据此宣称 relaunch/刷新/布局已修复。
- 依赖 / 启动条件：用户单独授权 P1；重读 P0 和实时 refs/patch hash；独立工作分支与独立 config commit。commit/push/PR 权限另核对。本 P0 不执行。

这是独立 config repair 工作项，独立提交/审查/验收。当前保留在同一有界任务的 P1，避免新包复制状态；如交给不同执行者，再建立只包含此阶段的任务包并引用 P0。

## P2：分析 launch 生命周期与 admission 不可跳过

唯一目标：每个有意分析 launch 在新 Session 中首发；同 launch 的失败恢复保留绑定，不能因草稿目标变化或刷新降级为普通 prompt。

- Owner / 修改范围：harness `ui-workspace` 的 PTO controller/装配；必要的 `ui-conversation` draft/input 和 input-trigger 通用 seam。先验证插件扩展路径；只有证明通用 seam 缺失才做最小内核改动并记录原因。
- 第一项实现前工作：增加真实 `ui-agent-preset + ui-workspace + ui-conversation + input-trigger` 组合的确定性反例，捕获 stage 与 submit 两个 draft target。P0 已证明 relaunch 不发 admission；preset/catalog 变化的确切时序仍不能仅凭源码推断。用 barrier 固定该顺序后再选择最小修复点。
- 数据边界：持有正式 launch identity、Record/revision/artifact/action/qualified Skill intent、materialized Session identity 和 pending admission 状态；复用现有 Session V3/附件与 draft 能力，不建立第二套 Session。普通通用文件上传成功不等于 PTO analysis identity 已有持久 attachment。
- 失败策略：retarget、编辑、取消、新 draft、reload、重复 activation 都必须有明确状态迁移；缺分析绑定应阻止分析提交并提供重新关联，不能静默 return undefined 后继续。未发送草稿要保护；双击不产生多个 activation。明确区分 admission retry 与已 admitted 的模型/tool retry。
- 保留：现有 Host receipt 字段、qualified lookup、成功 pre-step 注入与工具门禁。P0 未证明 receipt 生成器有错，不重写 schema。若 Host 重启恢复确需小改，只处理重建/明确失效已有绑定，先补证据，不扩大为持久 Analysis View。
- 禁止混入：provider 配置、可见 `/skill`/`@file` 体验、layout、算法和 Session V3 格式重构。
- 测试：first/new launch、single/double activation、materialization single-flight、A 缺 provider、同 Session admission retry、同 Session 模型失败重试、record/preset/workspace 变化、browser reload、未发草稿保护。验证 user prompt 在 admission 成功前未进入模型；不伪造 source/receipt。
- 完成条件：矩阵每行有 Session/request/record 关联与否决证据；B 的原成功与重试仍通过；无 ordinary-prompt fallback；精确说明 Host 重启是否支持恢复或明确要求重新关联。
- 依赖：P1 正式装配基线。单独提交与验收，不能因 P1 已授权自动实施。

## P3：Viewer 到 composer 的可见交互

唯一目标：让已经正确绑定的分析意图以规范 `/skill dependency-redundancy`、`@deps.json` 和短问题进入草稿，并在 activation 后退出 overlay。

- Owner / 修改范围：harness `ui-workspace` Viewer overlay/controller 与正式 composer 选择/reference seam；必要的 PTO file-reference resolver。`deps.json` 在本例位于 Session cwd 之外，不能用一个猜测的 cwd-relative `@deps.json` 冒充正式引用。
- Scope：复用真实选择/解析语义；展示与内部 qualified identity 是同一意图；保留简洁文案及通过引用重新打开 Viewer。Record/ref/revision 等内部信息不铺满输入区。
- 禁止混入：配置、receipt schema 重写、Session/launch 规则改定、layout、selection/deeplink 或大型 split/Analysis View。
- 测试：手动选择与程序化选择效果等价，删除/编辑 token 后行为清晰，实际 Record 引用正确，overlay 关闭与回开句柄生命周期，Skill 注入恰好一次；P2 全矩阵不回退。
- 完成条件：不再只有普通文字预填；真实 invocation 不重复；Viewer 接收完整 record+handle 的现有行为保持；没有把 receipt 强塞进静态 HTML handle。
- 依赖：P2 的 launch 状态稳定。原 P1 可见交互移至此处，避免和底层绑定/配置混为一个提交。

## P4：独立实验 View 宽度与容器适配

唯一目标：有内容的实验卡片遵守用户正文宽度，并在窄屏和资源侧栏挤压下可用。

- Owner / 修改范围：harness `ui-pto-experiments` 的 Dashboard/CSS/局部测试。
- Scope：消费现有 `--dsh-chat-content-width` 或正式等价宽度 seam；约束 grid 的最小内容宽度、卡片溢出、底部 composer 遮挡和可滚达性。根据容器可用宽度决定列数，不能只按全窗口宽度判断资源侧栏场景。
- 禁止混入：Viewer、provider、receipt、Session；不重写 upstream ConversationRoot 手柄或引入通用 readable/wide/full-bleed 系统。不要以隐藏 Tab 代替默认验收；如插件侧确实无法处理，应停止并请求 rescope。
- 测试：使用真实 durable planned 记录与长文本，补 completed/failed 表现；1280/1600 宽屏、900/700 窄屏、左右手柄内外拖动、Chat/Experiments 切换、资源侧栏打开、滚到底部。记录 DOM 几何和截图，不只单测 class 名。
- 完成条件：卡片宽度随正文轴变化；内容与操作不横向越界，底部可访问；upstream 核心宽度代码零改动。P0 的 896px 不动、700px/侧栏溢出反例变绿。
- 依赖：技术上可独立于 P2/P3 验证，但仍需本阶段明确授权及独立提交，不能提前混修。

## P5：实际产品组合验收与文档收口

唯一目标：在正式 P1–P4 组合上证明契约成立并结束任务。

- Owner / 范围：两个仓库各自的集成测试与文档 owner；跨插件 Loader/process/browser 证据，产品主题状态与最终报告。
- 测试：完整实际 patch（无临时 provider/observer 依赖）、P2 launch/负向矩阵、P3 规范输入、P4 populated layout；真实只读 Qwen 两种工具模式、receipt/source/identity 一致性、附件 upload/rebind/拒绝重试、原始输入 hash 和临时进程退出。
- 按最终改动 scope 跑当前 AGENTS/CI 要求的 GUI/浏览器、typecheck、lint、build、hygiene、doc-sync。升级前 8 条 lint 与旧工具清单失败若还在，按文件/诊断逐项比对，不能只按数量豁免。
- 禁止混入：新功能、版本升级、阈值降低、source/receipt 伪造、通用 Shell 结果替代正式门禁，以及未获授权的 commit/push/发布。
- 完成条件：所有阶段正式退出标准满足；实际产品与测试装配不再有关键差异；对未完成项目做明确延期决定；稳定事实回写主题，最终报告完成后按规则整包归档。
- 依赖：P1–P4 均完成且权限已核对。P0 本身不归档整个任务。

## 与原计划的对应

| 原阶段/假设 | 重排决定 |
| --- | --- |
| P0 找到“Viewer 丢 identity”断点 | 改为配置与运行链路 A/B；该统一归因已撤销 |
| 原 P1 launch + token + overlay | launch 放 P2；可见交互放 P3；先独立 P1 config |
| 原 P2 全量重做原子 receipt/Skill | 保留成功 Host receipt；仅修已证明的 launch/admission 生命周期缺口 |
| 原 P3 实验宽度 | 独立 P4；保留宽度目标，增加资源侧栏/容器与真实内容反例 |
| 原 P4 集成 + P5 文档 | 合并为 P5；每个前置阶段仍有自己的定向验证 |
