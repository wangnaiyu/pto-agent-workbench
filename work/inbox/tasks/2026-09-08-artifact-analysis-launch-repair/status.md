# 当前状态

- task-status: active
- current-step: P4 专项调查结束，阶段验收通过；准备记录接受配对后进入 P5
- updated: 2026-09-14
- authorization: 用户最新“允许”授权 P4 唯一 browser 差异隔离基线诊断；原先“允许”继续 P3 验收差异专项调查，保持既定范围和验收标准；用户进一步明确“允许” p3-blocker.md 的最小范围调整；用户追加允许 p2-blocker.md 中的最小提交门禁与 launch 绑定恢复契约；Host receipt schema、Session V3 格式保持不变。用户授权按既定计划连续实施 P2–P5；P2/P3/P4 分别验收和独立提交，前序通过才能继续。契约/架构变更、scope 扩大、无法归因新回归或验收无法满足时立即停止。P5 完成前不 push/PR/merge；保留 P0/P1、分支、savepoint 和证据，不改写历史。
- checkpoint: P2 两仓提交与矩阵验收完成；P3 正式交互、Host 单次注入及 P2 回归通过，全部 49 个 browser 失败条目已有基线证据。P3 harness e80fa835192f2cc087369e06080aaf9944a6b3fa，原 WIP 配对保存点完整保留；补充接受记录见 repair-p3-accepted-20260914 tag 与 [P3 报告](p3-report.md)。
- next-action: 提交专项证据并创建 P4 接受配对 tag；随后按原连续阶段授权在独立 P5 分支执行完整实际组合回归与文档收口。
- blockers: 当前无未决阻塞。P4 唯一新差异已在原版基线自然复现，并证明为 drive 失败跳过 settled barrier 的下游时序问题；不修复既有测试缺陷。
- verification: P2 聚焦 59/59；最终影响包 866 通过、8 项基线失败；完整 GUI 及 browser replay 的已知失败均逐项归因，见报告。最终 build/typecheck、定向 lint、doc-sync 34/34、hygiene 16/16、外层结构检查通过。全量 lint 的 8 个既有诊断与前阶段文件/源码逐项一致。没有宣称全功能或全套件绿色。
- baselines: 工作台 main/origin/main bc3eecff7f3d770527ef7c1dfa4ccbf16d7c09d9；harness master/origin/master ac2b72a9615cbaf23bb21951ffe1c22f3a11d807；upstream ancestor 5dda764ed3aa172535a7967b06ff95d9cbfe536a。live origin 与两仓 pre/post annotated tag、savepoint 再核对一致，无进行中 Git 操作。详见 [final state](evidence/p0-final-state.json)。
- working-tree: 两仓在独立 codex/repair-p4-layout-20260914；harness 未验收 WIP 已提交 368c446657932f170a6d29fd2d275bea1c76073e，工作台本次提交保存 P4 报告/证据/停止状态。P3 接受配对为 workbench 6d3c42b7f4c2d43078bf00129a6c6300a5604de0 + harness e80fa835192f2cc087369e06080aaf9944a6b3fa，repair-p3-accepted-20260914 tag 保留。
- running-checks: 已全部结束。P4 browser replay exec 62390 退出 1，原日志 /private/tmp/pto-p4-web.txt；283 passed/41 failed/37 skipped，51 失败块中 50 匹配 P3。GUI 4825 passed/10 baseline failures/1 skipped；build 通过、doc-sync 34/34、hygiene 16/16、test:docs 16/16。8 条 lint 逐项与 P3 一致。全部真实布局 Host/model 已退出 0，tab 4 关闭且 viewport reset；隔离 home 与数据保留。
- p3-verification: 聚焦 32/32、键盘/输入 109/109；扩展 Host/Skill/tool 123 passed / 1 旧工具清单失败，该失败在原升级后基线独立复现且源码 hash 一致。真实 Enter/Space/点击、引用恢复/拒绝、手动选择、同 Session 模型重试及新 launch 已验证；两条最终 Session 各一次 receipt/Skill source，实际双模式工具成功。初次 Enter 冒泡误发送已修复并复验。报告及精选证据见 [P3](p3-report.md)，browser replay 新增项已在基线复现并归因，P3 验收通过；P4 已实施且专项归因后验收通过，P5 尚未实施。
- temporary-environment: P2 隔离根及原始运行数据保留；两个 Host 和本地模型替身已核实 PID 后退出，exec 21980/13131/2361 均返回 0，两个临时标签页关闭。原基线构建/测试副本 /private/tmp/pto-p2-baseline-check 保留。精选证据在 evidence/p2，不依赖临时日志恢复结论。

- p4-verification: 最终 13 份几何快照覆盖 1280/1600/900/700、左右手柄、Tab 往返和资源侧栏；均无横向溢出，所有按钮在卡片边界内。4 份底部观察均 scrollTop == maxScroll，末卡与输入区间距 40px，含增长输入区。12 条真实持久 planned + 2 条明确标注的 completed/failed DTO 呈现 fixture；未执行实验。证据见 evidence/p4。P4 完整 browser replay 曾有一个未归因差异；已按授权调查、自然基线复现并归因，P4 现已验收。原停止 checkpoint 保留。

- p4-savepoint: harness 368c446657932f170a6d29fd2d275bea1c76073e；两仓当前配对由 repair-p4-validation-checkpoint-20260914 annotated tag 保存，codex/savepoint-p4-validation-20260914 指向同一未验收 checkpoint。该保存点不代表 P4 accepted。

- p4-diagnostic: 原版隔离基线 exec 23259 与诊断副本 exec 27944 均结束，4 passed/4 failed；原断言零条 turn/end，真实 settled barrier 后一条。正式产品/测试未改，临时诊断源已从基线副本移出。见 [专项结论](p4-validation-blocker.md#专项调查结论)。
