# 分析启动与布局回归修复完成报告

2026-09-14。P2、P3、P4 分别完成独立实现、验收和提交，P5 在全部前置阶段接受后完成正式组合回归与文档收口。没有扩大到新功能、重写 receipt schema、Session V3 或 ConversationRoot 宽度核心，也未修改官方只读资源与原始样例。

## 实现与阶段保存

| 阶段 | 主要成果 | 工作台阶段提交 | harness 提交 |
| --- | --- | --- | --- |
| P2 | launch/Session 绑定、不可跳过 admission、失败重试与未发送草稿保护 | a68dea5bc06793df98b2f8f0c2f53db7f62080fc | e92a21adc477133a0771a6194962be901284a2ed |
| P3 | 规范 Skill 手势、Record 文件引用、overlay 退出/回开、Skill 单次注入 | 6d3c42b7f4c2d43078bf00129a6c6300a5604de0 | e80fa835192f2cc087369e06080aaf9944a6b3fa |
| P4 | 实验 Dashboard 正文宽度、容器适配、底部可达 | ae37530e92d6df320f6321a3b1c303a3f5d41d82 | 368c446657932f170a6d29fd2d275bea1c76073e |
| P5 | 无 provider/observer 注入的实际组合验证、证据与归档 | 本归档提交；完整最终配对由 repair-p5-accepted-20260914 annotated tag 记录 | 同 P4，未再修改产品 |

P0 `642632176df9f1131e9c41cbffc33c3b414184ff`、P1 `efffec604dbbd24b7b13bcad359a8c2023c85915` 原提交保留。P3/P4 最初为 WIP 保存，后续诊断证明原基线问题后另记接受 tag；不改写旧提交消息或未验收恢复点。

详细实现、验收和已获授权的最小 seam/契约说明见 [P2](p2-report.md)、[P3](p3-report.md)、[P4](p4-report.md)、[P5](p5-report.md)，以及 [P2 契约](p2-contract.md)、[P3 契约决定](p3-blocker.md)。

## 最终实际验收

完整实际 patch 中 official provider 唯一且锁定；P5 只替换目录 picker 和外部模型协议，真实 Host/Skill/工具执行，没有 provider、observer 或布局 seed 注入。

带文件的首发 admission 成功后故意制造模型 400；同 Session 普通问题重试成功。新 launch 的双击、刷新与 Enter 引用回开没有提前调用模型，发送后获得独立 Session/request。两个最终分析 Session 各只有一次 receipt source、一次 qualified Skill source，工具返回的 receipt 与注入值逐字段相同。46B 附件的 SHA 与持久存储字节一致。

真实 Qwen 图为 598 nodes / 1222 edges。reduced 与 reduced_dataflow 各移除一条相同冗余边，保留 1221 边；原始 deps.json SHA256 始终为 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`。模型为本机确定性替身，本次不声称外部模型推理能力或性能收益通过验收。

P4 13 份最终几何覆盖 1280/1600/900/700、两侧手柄、Tab 往返与资源侧栏；卡片及按钮不越界。四份底部观察均到达 maxScroll，末卡与输入区间距 40px，含增长输入区。12 条真实 durable planned 加两条明确标注的 completed/failed DTO 呈现 fixture；没有执行性能实验，终态 fixture 不算真实执行证据。

## 检查结果

| 检查 | 实际结果与证据 |
| --- | --- |
| P2 聚焦及最终影响包 | 聚焦 59/59；完整影响包 866 passed/8 baseline failures；后续修正通过相应回归，见 P2 |
| P3 引用/键盘/Host | 32/32、109/109；扩展 123 passed/1 旧工具清单失败 |
| P4 局部布局逻辑 | 10/10 + 真实几何/截图矩阵 |
| 最终完整 GUI | 4825 passed/10 baseline failures/1 skipped，逐项对照 |
| 最终完整 browser replay | 283 passed/41 baseline failures/37 skipped；51 失败块均有归因 |
| build/typecheck | 完整 build 与类型检查通过；P5 未改 harness，复用相同已验证代码与产物 |
| lint | 定向 lint 通过；全量保留 8 条 no-misused-spread，按文件/位置/规则/消息/源码匹配 |
| doc-sync / hygiene / test:docs | 34/34、16/16、16/16 |
| P5 装配/launcher | 8/8 |
| P5 客户端与 Host/PTO | 76/76；37 passed/1 旧工具清单失败 |
| P5 实际日志断言 | 42/42，真实 receipt/source/tool/附件/hash |
| 工作台结构与链接 | 整包归档后 check-workspace 通过：118 Markdown、0 errors；git diff --check 通过，未降规则 |

[P5 证据复用](evidence/p5/evidence-reuse.json) 核对 P3 实现 hash 和 P4 最终 harness SHA。复用的是实际已运行的相同代码证据，不是 canonical-only/no-op CI。未推送本次分支，未声称新的远端 CI 结果。

两个新增可疑 browser 差异均曾按授权边界停止：P3 吞吐 golden 在原基线 40 次观察中九次自然出现 decodeMs=0；P4 turn/end=0 在原版基线首次独立运行即复现，失败后等待原 settled barrier 可见 turn/end=1。诊断不修改正式测试、pacing、时钟、golden 或产品；旧失败仍保留。见 [P3 调查](p3-validation-blocker.md#专项调查结论)、[P4 调查](p4-validation-blocker.md#专项调查结论)。

## 保留问题与明确延期

- 上述既有 lint、GUI/browser、工具清单断言问题未修复，不能宣称全套门禁绿色。
- Host 重启丢失 Record 时明确要求从 Viewer 重新关联；不提供站点数据清除/跨设备后的草稿恢复保证。
- Dashboard 只查询当前已载入的 Session，重启后仅在元数据中可见的 Session 可能返回不存在；恢复同 Session 后查询可用。P4 没有混入 Host 恢复逻辑。
- selection/deeplink、持久 Analysis View、大屏 split、更多 adapter、算法更新及性能优化不在范围，保持延期；不自动启动后续任务。

这些限制已回写 [产物查看主题](../../../product/artifact-inspection/overview.md)、[输入区契约](../../../product/conversation-composer/design.md) 和各阶段报告。

## 历史、恢复与清理

所有 P0/P1/P2/P3/P4/P5 分支、P3/P4 未验收 savepoint 与 accepted tags 保留；pre/post-upstream 保存点和 annotated tag 未删除。未 amend/rebase/force-push，未执行大范围 git clean。P5 本阶段普通数据与正式产物分开，未复制原始大图、凭据或完整模型 prompt。

P5 最终 tab 8 关闭，Host/model 均退出 0；此前全部阶段进程清理见各自证据。所有隔离 home、原始日志、必要派生数据留在本机，精选唯一证据入库。

任务由 `work/inbox/tasks/2026-09-08-artifact-analysis-launch-repair` 整包迁至 `work/archive/tasks/2026-09-08-artifact-analysis-launch-repair`，修复链接，无活动副本。main/master 未更新；本次不 push/PR/merge，后续提交发布流程需要新的明确安排。
