# P3 验收停止：新增 browser replay 失败尚未归因

用户已批准此前 [P3 契约调整](p3-blocker.md)，本页不是再次请求同一范围授权。P3 实现与真实交互验证见 [报告](p3-report.md)；当前状态以 [status](status.md) 为准。

## 停止条件

最终 P3 完整 browser replay 为 283 passed / 41 failed / 37 skipped。49 个不同失败条目中，48 个与 P2 的基线诊断逐条对应；新增一项 `turn-tail-actions.e2e.ts > withholds the footer while the turn runs and grants it at turn/end`。运行中 ARIA 预期包含吞吐量 `{{throughput}} tok/s`，实际不包含；没有其他该快照差异。详见 [完整失败块](evidence/p3/turn-tail-new-failure.txt) 与 [全套对照](evidence/p3/web-baseline-comparison.json)。

P3 候选单独重跑该用例通过。原升级后基线 `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807` 上首次及追加五次单用例均通过；按原文件顺序完整运行也为 7 passed / 1 skipped，未复现缺失吞吐量。该测试、scaffold、golden、StatsPills 和 turn-metrics 源码与原基线完全相同，见 [源码与诊断记录](evidence/p3/turn-tail-investigation.json)。

现有 TimePill 在 `decodeMs > 0` 时才显示吞吐量，因此时间采样波动是合理假设；尚无证据证明完整候选中的缺失就是原基线已有波动，不能把“单独重跑通过”作为归因或豁免。没有修改测试、快照、normalizer、超时阈值或相关产品代码来绕过它。

用户明确要求发现“无法明确归因的新回归”或阶段验收条件无法满足时立即停止。本项是新增且尚未归因的检查失败，尚未断言为产品回归；为遵守该条件，P3 保留未验收状态，P4/P5 未启动。

## 已保存与下一节点

P3 源码、测试、双语文档和精选证据保存为独立 WIP checkpoint；它不是 P3 验收通过提交。保留 P0/P1/P2 分支、所有 savepoint 和升级前后恢复点，不改写历史；无 push/PR/merge。临时 Host/model、全部验证进程均已结束，原始本机数据保留。

需要用户决定是否允许在 P3 内继续对这项 browser replay 差异做专项取证，以确定候选发送链路影响与既有时间采样波动的区别。此决定不应隐含允许修改无关 UI/计时契约或放宽快照；如果最终需要这些修改，仍需单独提出范围。只有归因清楚且 P3 原验收标准满足后，才能按已有授权进入 P4、P5。

## 专项调查结论

用户允许继续专项取证后，在未改产品源码的原升级后基线中运行原用例的观察副本：相同 fixture/golden/默认 pacing/真实时钟和清理，仅在 ARIA 捕获后将时间与显示结果写出，并在同一进程逐项实例化 40 次。31 passed / 9 failed；九次失败的首 token 与 assistant/message 完成时间完全相同，decodeMs 为 0，均不显示吞吐量。其他 31 次 decodeMs 大于 0，均显示吞吐量。九次失败的完整 golden diff 与原 P3 失败逐字一致。

默认 replay 是未节奏化的 burst，真实 Date.now 只有毫秒分辨率；Host stream、session-stats projection 和 StatsPills 都按现有实现允许零解码时长，而 running golden 要求一定出现吞吐量。相关八份源文件/golden 与基线 hash 一致。这是已复现的基线 replay/golden 时间采样不稳定性；没有修改 clock、pacing、产品、fixture、normalizer 或 golden。原完整候选未记录时间，故不声称观测到了该次具体 decodeMs；归因依据为原基线的相同失败、相同数据路径和完整 diff。

证据：[40 次观测](evidence/p3/timing-observations.json)、[原断言结果](evidence/p3/timing-baseline.txt)、[诊断源](evidence/p3/timing-diagnostic.e2e.ts.txt)、[归因与源码 hash](evidence/p3/timing-resolution.json)、[更新后的全套对照](evidence/p3/web-baseline-comparison-resolved.json)。初次 12 次观察副本只使用被 fixture 抑制的 console 输出，全部通过，未作为时间证据；最终批次改为捕获后写独立 JSON，保留所有失败而非挑通过结果。

专项进程 exec 14395 已退出 1（九条原断言失败），原始过程数据保留；临时测试副本逐字保存后移出基线测试发现路径。harness 正式源码与 P3 保存提交一致。该停止原因已解除，P3 可依既定范围验收；不因此宣称完整套件绿色，也不在本任务修复基线计时/golden 问题。
