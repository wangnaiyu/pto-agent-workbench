# P4 browser replay 验收停止

2026-09-14，依据用户“无法明确归因的新回归或某阶段验收条件无法满足应立即停止”的边界。P4 CSS 与布局矩阵已完成，但本阶段尚未验收；P5 未启动。

完整命令 `DSH_SNAPSHOT=replay pnpm run test:web` 退出 1：22 failed / 75 passed / 1 skipped files；41 failed / 283 passed / 37 skipped tests，耗时 1138.23 秒。51 个失败块（包括同名重复块）中 50 个名称和首条诊断匹配 P3 原始日志；1 个未匹配。不能因失败总数仍为 41 而豁免。

新差异为 `replay-round-trip.e2e.ts > rendered the settled turn: markdown, tool row, composer restore`，第 166 行期望一条 `turn/end`，实际零条。见 [失败块](evidence/p4/web-new-failure.txt)、[完整对照](evidence/p4/web-baseline-comparison.json)。

只读检查发现同文件 drive 测试的已知 echo golden 失败发生在 `await settled` 之前；后续测试看到 DONE 后立即检查 turn/end，存在继发时序影响的可能。该测试与 scaffold 源码相对 P3 完全相同，P4 唯一产品修改是 Dashboard CSS。但这些事实尚不足以证明本次具体失败属于既有基线；没有追加重跑、修改断言、调整时钟或改产品。见 [源码与假设](evidence/p4/web-investigation.json)。

P4 以未验收 WIP commit/savepoint 保存，不能视为 accepted；P0–P3 及原恢复点保留，不 push/PR/merge。恢复授权的最小范围是对此唯一 browser 差异进行隔离基线诊断与因果取证，不扩展 P4 产品修改或降低验收标准；证据充分且 P4 验收通过后才可按原连续阶段授权进入 P5。若诊断需要改产品契约或测试范围，再停下来说明。

## 专项调查结论

用户授权后，在原始升级后基线 `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807` 的隔离副本运行原版完整文件，首次即复现相同第 166 行失败：4 passed / 4 failed，退出 1。测试、scaffold、support、config 和 fixture 均与当前源码及该 Git 基线逐字一致。

独立诊断副本保留原断言、paceMs=15、真实时钟和原清理；仅记录断言前的内存事件，在失败回调中等待 drive 已创建的真实 settled promise 后记录另一份事件。再次复现相同断言失败：原断言 turn/end=0；原 barrier 完成后 turn/end=1；driveAwaitReached 始终为 false。未改产品、正式测试、golden 或门禁。自有诊断副本已保存后移出测试发现目录。

因此该差异属于既有 drive golden 失败绕过 settled barrier 后的下游时序断言问题，不是 P4 引入的事件丢失。原 P4 全量运行没有事件时间线，以上因果观察来自明确标注的基线诊断，不冒充原运行直接观测。基线中的既有失败保持未修复。

证据：[原版基线](evidence/p4/round-trip-baseline.txt)、[诊断运行](evidence/p4/round-trip-observed.txt)、[事件](evidence/p4/round-trip-observations.json)、[诊断源码](evidence/p4/round-trip-diagnostic.e2e.ts.txt)、[结论与 hash](evidence/p4/round-trip-resolution.json)、[51 块最终对照](evidence/p4/web-baseline-comparison-resolved.json)。

P4 现已完成阶段验收，完整套件仍为红色；原未验收 WIP/savepoint 历史保留，接受配对另建 annotated tag。可按原连续阶段授权进入 P5，仍不 push/PR/merge。
