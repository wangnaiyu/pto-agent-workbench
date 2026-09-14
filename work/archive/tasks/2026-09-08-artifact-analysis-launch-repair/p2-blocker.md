# P2 停止报告：提交门禁与绑定恢复契约待确认

2026-09-14。P2 尚未实施完成或验收；P3–P5 未开始。用户允许按阶段连续推进，但明确要求涉及既定架构/契约修改时立即停止。本报告只提出可审查的最小契约建议，不把它当作已获批准的新计划。

## 已确定事实

- P0/P1 提交、分支和证据完整保留；两仓各建立 `codex/repair-p2-launch-20260914`。工作台起点 `efffec604dbbd24b7b13bcad359a8c2023c85915`，harness 起点 `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807`，与 P1 交付一致。
- 真实四插件 apply 的确定性诊断通过：stage target `1:1::`；barrier 释放 preset roster 后，submit target `1:2::standard`。后者走实际 input-trigger admission 方法时未请求 Host；原 target 对照请求 Host 并按预期拒绝。不是只手写两个 revision 调 controller 的 P0 机制推断。
- `ui-input-trigger/src/client/controller.ts` 的 adjudicate 只轮询输入文本起始 trigger 匹配的 source.matchEnter；普通文本跳过，slash 对照调用。`admitMaterialized` 则只在 materialization 或 InputHub 保留的 pending retry 上被调用。
- `ui-conversation/src/client/input/hub.ts` 的 pendingDraftAdmissions 和 `ui-workspace/src/client/pto-viewer.ts` 的 analysisDraft 均只在内存。`ui-conversation/src/client/stores.ts` 持久化 draft 字符串和 View；`stageBrowserDraft(text)` 没有 typed launch 绑定或恢复语义。
- `conversation.blocks` 是 Session composer 显示层的禁用状态；`sendSession` 未将它作为强制提交 gate，不能用 UI 禁用假装覆盖程序化/恢复提交。

证据与执行边界见 [P2 诊断](evidence/p2/README.md)。1 项诊断通过证明问题，不代表 P2 通过。未执行完整 P2 launch/retry/reload/Host restart 验收矩阵。

## 为什么没有先改 revision 比较再进入下一阶段

只用 draft generation 而忽略 catalogRevision，最多修复当前漂移反例。它不能让刷新后的普通文本恢复其分析身份，也不能在无 pending admission 的 Session 上强制重验。P2 要保留普通文本输入直到 P3，不能通过提前加入 /skill 或依赖某段中文提示来绕过这个缺口。

计划允许在证明扩展不足后探索最小通用 seam；当前证据已到这个判断点。下一步要新增/修改跨插件提交与恢复契约，因此触发用户本轮的停止要求。未 monkey-patch Conversation 方法、未添加未批准的 UI plugin 公共 value export、未引入第二套 Session 或改写 receipt schema。

## 待确认的最小方案

1. 在现有 Conversation/input-trigger 提交路径增加**不依赖文本首字符的、可拒绝的提交前校验注册接口**，覆盖 draft materialization 前后与真实 Session 的默认发送/同 Session retry。拒绝保留输入，未持有分析意图的普通会话不受影响。现有 matchEnter 的 slash 命令选择语义保持原样，不把它全局改成普通输入拦截器。
2. 在现有 draft/interaction 存储体系中为 launch 绑定规定序列化和恢复语义：稳定 launch ID、record/revision/action/qualified Skill intent、materialized Session ID、pending/admitted 状态。PTO 字段与验证仍归 ui-workspace/PTO controller；通用 Conversation 只负责关联和在发送前调用校验，不理解 receipt 内容。具体字段接口需要先补一份小范围契约说明再实施，不把新字段写进 Session V3 格式或 Host receipt。
3. 刷新后先恢复并校验绑定，未能恢复则明确要求重新关联并阻止该分析发送。Host 重启若无法验证旧 process-local record/admission，则明确失效并重新关联；不承诺隐式重建，也不新增持久 Analysis View。

这是推荐的受限实现方向，不宣称已经证明它是唯一方案。若要坚持现有服务契约完全不变，应先重新界定 P2 的刷新/缺绑定退出条件；不能悄悄降低验收标准。

## 当前收口

产品实现零改动；诊断副本已从 harness 测试目录移入外层任务证据。harness HEAD 未变且 working tree clean。外层只提交本次 checkpoint、诊断和停止报告；这不是 P2 功能完成提交。两仓主分支未移动，未 push/PR/merge，未删除 P0/P1/savepoint/tag，无本轮运行中的服务。等待上述契约变更范围确认后从 P2 继续，不进入 P3–P5。
