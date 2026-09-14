# P2 实施前诊断（未验收）

2026-09-14，基于工作台 `efffec604dbbd24b7b13bcad359a8c2023c85915` 和 harness `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807`。未修改产品实现。

[诊断源码](composition-diagnostic.client.spec.ts) 在真实 SlotTestRuntime 上装配四个真实 Client apply：ui-agent-preset、ui-workspace、ui-conversation、ui-input-trigger。preset roster 使用显式 promise barrier，stage 后才释放响应；捕获真实 trigger target，并调用 InputHub 同一个 admitMaterialized 操作。Host 是拒绝调用的测试替身，不合成 receipt。此测试不等于浏览器、Host、真实模型链路或完整 P2 验收。

[结果](composition.json)：stage `1:1::` → submit `1:2::standard`；漂移时 Host admission 0 次，原 target 对照 1 次且按预期拒绝。额外注册一个拒绝型 matchEnter source：普通文本调用 0 次，slash 文本 1 次。这确认现有 trigger seam 不能作为独立于文本前缀的提交门禁。

执行：临时将诊断源码复制到 `harness/packages/client/ui-workspace/tests/p2-composition-diagnostic.client.spec.ts`，在 harness cwd 运行 `PTO_P2_EVIDENCE=<独占临时目录>/composition.json pnpm exec vitest run packages/client/ui-workspace/tests/p2-composition-diagnostic.client.spec.ts`。完成后移回本证据目录，不将临时诊断混作已实现的产品回归测试。复现前确认目标路径不存在，完成后只清理自己复制的诊断文件。`PTO_P2_EVIDENCE` 可省略。

[最终运行日志](composition-tests.txt)：1 文件 1 诊断测试通过。runtime teardown、barrier 释放、临时 source disposer 均注册到 onTestFinished；未创建网络服务/浏览器 tab。首次命令在外层 cwd 和一次错误 --project client 参数未执行测试，纠正 cwd/参数后通过；新增 prefix 对照与结果文件记录后再次通过，不是产品失败。

刷新缺口的判断来自当前源码及已有 P0 reload 证据：PtoViewerController.analysisDraft、InputHub.pendingDraftAdmissions 只在内存；Conversation store 只持久化文本/View。此次未重做完整浏览器 reload/Host restart 矩阵。待确认的最小契约建议见 [P2 停止报告](../../p2-blocker.md)。
