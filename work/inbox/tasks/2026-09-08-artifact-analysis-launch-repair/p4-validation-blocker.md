# P4 browser replay 验收停止

2026-09-14，依据用户“无法明确归因的新回归或某阶段验收条件无法满足应立即停止”的边界。P4 CSS 与布局矩阵已完成，但本阶段尚未验收；P5 未启动。

完整命令 `DSH_SNAPSHOT=replay pnpm run test:web` 退出 1：22 failed / 75 passed / 1 skipped files；41 failed / 283 passed / 37 skipped tests，耗时 1138.23 秒。51 个失败块（包括同名重复块）中 50 个名称和首条诊断匹配 P3 原始日志；1 个未匹配。不能因失败总数仍为 41 而豁免。

新差异为 `replay-round-trip.e2e.ts > rendered the settled turn: markdown, tool row, composer restore`，第 166 行期望一条 `turn/end`，实际零条。见 [失败块](evidence/p4/web-new-failure.txt)、[完整对照](evidence/p4/web-baseline-comparison.json)。

只读检查发现同文件 drive 测试的已知 echo golden 失败发生在 `await settled` 之前；后续测试看到 DONE 后立即检查 turn/end，存在继发时序影响的可能。该测试与 scaffold 源码相对 P3 完全相同，P4 唯一产品修改是 Dashboard CSS。但这些事实尚不足以证明本次具体失败属于既有基线；没有追加重跑、修改断言、调整时钟或改产品。见 [源码与假设](evidence/p4/web-investigation.json)。

P4 以未验收 WIP commit/savepoint 保存，不能视为 accepted；P0–P3 及原恢复点保留，不 push/PR/merge。恢复授权的最小范围是对此唯一 browser 差异进行隔离基线诊断与因果取证，不扩展 P4 产品修改或降低验收标准；证据充分且 P4 验收通过后才可按原连续阶段授权进入 P5。若诊断需要改产品契约或测试范围，再停下来说明。
