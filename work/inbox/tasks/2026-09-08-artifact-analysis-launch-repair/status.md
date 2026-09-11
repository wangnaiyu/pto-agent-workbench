# 当前状态

- task-status: paused
- current-step: P0 已完成；停在 P1 独立 config repair 的授权边界
- updated: 2026-09-11
- authorization: 本轮用户仅授权 P0 重新取证、严格 A/B、分层根因分类和 P1–P5 重规划。已执行范围内临时观测与文档更新；未实施正式 repair，未 commit/push/PR，未进入 P1。上一阶段远端授权不延伸为本阶段实现授权。
- checkpoint: [P0 报告](p0-report.md)、[新计划](plan.md)和[证据](evidence/README.md)完成。A 缺 provider 导致 receipt 未生成；B 仅补 provider 后完整 receipt/Skill/真实工具成功；relaunch/retarget/reload 跳过 admission、未发草稿保护、overlay/token 和 populated layout 缺口分别分类。稳定事实已回写 artifact-inspection 与 official-skill-integration 主题。
- next-action: 停止。仅当用户明确授权 P1 后，复核实时基线并独立修工作台 provider composition；按 plan 的 P1 范围测试和验收，不自动连做 P2–P5。
- blockers: P0 无阻塞。live relaunch 的精确 Client target 变化时序、Host restart 恢复等有明确证据限制，列入后续对应阶段的实施前反例/验证；不是已完成修复。
- verification: 53 项 Client/draft/附件/准入定向测试通过；tool-pto-run 11 通过、1 个既有清单失败（预期2实际3，测试和工具源码与旧 ef0d49b 完全一致）；7 条 controller 机制断言、25 项证据一致性检查通过；工作台结构检查零错误，git diff --check 通过。未重跑完整 build/typecheck/lint/doc-sync，未声明全功能验收通过。
- baselines: 工作台 main/origin/main bc3eecff7f3d770527ef7c1dfa4ccbf16d7c09d9；harness master/origin/master ac2b72a9615cbaf23bb21951ffe1c22f3a11d807；upstream ancestor 5dda764ed3aa172535a7967b06ff95d9cbfe536a。live origin 与两仓 pre/post annotated tag、savepoint 再核对一致，无进行中 Git 操作。详见 [final state](evidence/p0-final-state.json)。
- working-tree: 外层 codex/repair-p0-20260911 分支有未提交的本任务文档/精选证据与主题事实更新；主分支 ref 未改。harness master clean，正式 patch/产品代码未改，无实验修改混入源码。未删除任何旧分支、savepoint 或 tag。
- temporary-environment: 本轮五个服务均已核实 PID 后 SIGINT 并等待退出（mock 0，A/B/C/layout 130），四个测试 tab 关闭、viewport reset。原始 exec 标识 93207/56733/99772/10481/54579 已结束，不可当作仍运行。临时根和派生输出保留用于复现，位置见 baseline；源码副本已精选到 evidence/p0-instrumentation，日志留在 /private/tmp/pto-p0-{mock,a,b,c,layout}.log。原始样例只读，输入 hash 不变。见 [teardown](evidence/p0-teardown.json)。
