# P4：实验 View 正文宽度与容器适配

本阶段依据已授权 [plan](plan.md#p4独立实验-view-宽度与容器适配)，在 P3 接受配对 `6d3c42b7f4c2d43078bf00129a6c6300a5604de0` / `e80fa835192f2cc087369e06080aaf9944a6b3fa` 之后独立实施。当前验收与提交状态只看 [status](status.md)。

## 实现

唯一产品修改为 ui-pto-experiments 的 dashboard.module.css。标题、提示和卡片列表消费现有 `--dsh-chat-content-width`，同时受可用容器宽度约束；单列列表使用 minmax(0, 1fr)，卡片与标识符允许收缩。事实列以列表的 inline-size container 判断四列/两列/一列，标题与底部操作在小容器内换行。长字段保留原完整 title，不改数据或按钮动作。

真实取证确认这个 Tab 参与 Conversation 的滚动文档流，sticky composer 本身已占位。面板保留 24px 底部 padding 和原列表 margin，卡片 scroll-margin 使用既有 composer 实测高度；没有增加嵌套滚动区或重复预留整块输入区高度。初稿的额外留白已在最终构建前移除，初稿样本与最终证据分开保存。

ConversationRoot TSX/CSS、Host、Viewer、provider、receipt/Session、实验执行和 comparison result 均未修改。双语 README 与 Agent Note 说明布局 owner；没有为这项 CSS 修改引入只断言 class 名的重复测试。

## 实际布局矩阵

在完整工作台和最终 built harness 中，通过真实 `ptoExperiments.plan` 生成 12 条持久 planned 记录，使用长问题、路径和目录名。另有两条明确标注的 completed/failed DTO 呈现 fixture，用于显示分支、长 ID 与错误文案验证，metric 为 null；这两条不是已执行的实验记录，不计作实验执行或性能验证。所有样例均位于隔离 home/Workspace。

| 最终场景 | 实测结果 |
| --- | --- |
| 1280 默认 | 卡片 680px，四列，无横向溢出 |
| 1600 默认 | 卡片约 844.8px，四列，无横向溢出 |
| 900 稳定态 | 卡片 680px，四列，无横向溢出；初稿动画中的 663px 样本不作最终结论 |
| 700 稳定态 | 卡片 572px，两列，无横向溢出 |
| 1280 资源侧栏 | 卡片 352px，两列，刷新按钮及底部操作在容器内换行 |
| 900 资源侧栏 | 卡片 328px，两列，无横向溢出 |
| 1600 右手柄外/内 | 约 984.8 → 884.8px，实际卡片随偏好变化 |
| 1600 左手柄外/内 | 约 984.8 → 824.8px，实际卡片随偏好变化 |
| Chat / Experiments 往返 | 两边偏好均约 824.8px；实验卡片保持相同宽度 |
| 最底部 | 700、1280/900 侧栏及增长输入区四例均到达 maxScroll；末卡底部与输入区顶部间距 40px |

最终 13 份 [几何](evidence/p4/layout-metrics.json) 中全部 card button 的水平边界位于 card 内，root scrollWidth 不超过 clientWidth；[底部测量](evidence/p4/bottom-metrics.json) 记录真正的 Conversation scrollport，而非假定 Dashboard 自身在滚动。截图与 fixture 来源见 [证据索引](evidence/p4/README.md)。测试用增长草稿已清空，没有发送或执行。

## 检查与遗留

- 原局部测试 10/10；完整 GUI 4825 passed / 10 failed / 1 skipped。10 项名称和诊断逐条与 P3 相同，见 [对照](evidence/p4/gui-baseline-comparison.json)。
- 最终完整 build 通过，包含类型与产物生成；doc-sync 34/34，hygiene 16/16。没有降低 lint/test/CI 规则。
- `pnpm run test:docs` 全部通过。构建后直接运行全量 lint 阶段 `node --import tsx/esm scripts/run-oxlint.ts .`，退出 1；8 条 no-misused-spread 的文件/行/规则/消息及源码逐项匹配 P3，见 [lint 对照](evidence/p4/lint-baseline-comparison.json)。没有在 browser replay 期间重新生成构建产物。
- 完整 browser replay：283 passed / 41 failed / 37 skipped，退出 1。51 个失败块中 50 个匹配 P3，1 个 turn/end 数量差异在后续授权诊断中由原版基线自然复现并归因。全部 51 个失败块现有基线证据；[专项结论](p4-validation-blocker.md#专项调查结论)。P4 阶段验收通过，但完整套件未变绿。
- 重启后旧 Session 仅在元数据列表可见时，Dashboard 查询曾返回 session 不存在；同 Session 普通消息恢复后查询成功，持久 planned 记录仍在。该 Host 查询只读取 sessions.get，不自动恢复 Session；[对应源码](evidence/p4/source-manifest.json) 与 P3 一致，本阶段没有改它或将它掩盖成 CSS 修复。
- planned 记录的 Execute 按钮未点击；completed/failed 仅呈现 fixture。Host/model 进程均已确认退出 0，tab 4 关闭，viewport override 重置；隔离 home 和原始记录保留。

本阶段不 push/PR/merge，不修改主分支、P3 接受点或此前恢复点；P5 仍需完成正式组合回归和文档收口。

## 未验收保存点

harness WIP commit：`368c446657932f170a6d29fd2d275bea1c76073e`，正常 pre-commit 通过；工作台证据与本报告独立提交。两仓完整配对由 `repair-p4-validation-checkpoint-20260914` annotated tag 记录，并保留 `codex/savepoint-p4-validation-20260914`。这些恢复点不代表 P4 已验收，P0–P3 历史和恢复点均保留。

## 接受记录

本次专项诊断仅补证据，不修改 harness 产品/正式测试。原版基线 4 passed/4 failed，其中相同 turn/end 断言自然失败；诊断观察到原 barrier 完成前零条、完成后一条。P4 接受配对由 `repair-p4-accepted-20260914` annotated tag 记录；原 WIP 提交和未验收 tag 保留。
