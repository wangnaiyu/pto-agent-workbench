# P2：launch 生命周期与提交门禁

本页记录 P2 实现与验收证据；是否完成、当前提交和下一步以 [status](status.md) 为准。依据用户对 [最小契约](p2-contract.md) 的追加授权实施，保留 P0/P1 历史；尚未实施 P3–P5。

## 实现

Conversation 增加 owner/id/payload 提交绑定，由 Workspace 解释 PTO intent。该 intent 包含 request、Record/revision、artifact refs、action 和 qualified Skill；发送前在实际 Session 上调用原 Host admission。默认提交路径不依赖文本前缀或 draft revision 相等。每个新 launch 先暂存浏览器草稿，在 Send 时创建新 Session；同 Session 的准入/模型重试保留 request 和 Record。

浏览器交互存储保存 pending/admitted 绑定和未物化问题文本；Session 接收方先保存再移除浏览器副本。未知 owner、无效存储、准入失败或取消拒绝发送；成功标记不替代下次 Host 校验。保护未发送草稿和物化等待期，即使乐观清空输入框，也不能用另一 launch 覆盖。编辑问题不更改 intent；取消未发分析可先清空草稿再新建。Host 重启失去 Record 时明确提示重新关联，不隐式恢复记录。清除浏览器站点数据不在恢复保证内。

receipt schema、Host 成功注入、工具门禁、Session V3、官方资源 literal、PTO 算法均未修改。产品说明和双语决策记录在 harness 的 Conversation/Workspace README 与 `2026-09-14-guarded-analysis-launches` Agent Note。

## 验收矩阵

| 场景 | 证据与结果 |
| --- | --- |
| 原四插件反例 | 已保存的 composition diagnostic 证明 preset 异步更新使旧逻辑跳过 admission；修复组合测试固定同一 barrier 后通过 |
| first launch / double activation | 真实工作台双击只产生一个 launch；新建 Session 才发送，正式 receipt 和双模式工具成功 |
| new launch | 第一轮 Session `b9055d3e…`，第二轮 `fbf538e3…`，request/Record 不同；组合测试也断言两个不同 Session |
| materialization single-flight | 两次 Send 只创建一个 Session；物化 barrier 内新建草稿/再次 activation 被拒绝，原 launch 保留 |
| 缺 provider / admission retry | 四插件组合的 Host 边界拒绝时 0 prompt；恢复后在同 Session 以同 request 重试。真实 provider 缺失的 Host 拒绝另由 P1 证据覆盖；不把 stub 当真实 receipt |
| 模型失败 retry | 本地模型替身返回一次 HTTP 400；真实 Host 已生成 receipt，第二次 prompt 在同 Session 继续，request/Record 不变 |
| Record/preset/workspace 变化 | 组合测试在 stage 后切换 preset、Workspace 和 Viewer Record；首发仍绑定原 Record，下一次有意 launch 使用新 Record |
| 编辑、清空、未发保护 | 编辑保留绑定；已有文字不能被新 activation 覆盖；清空后新建撤销未发绑定，未创建 Session |
| browser reload | 首轮与最终构建各验证一次；最终构建编辑问题后刷新，文本及正式绑定恢复，首发完整成功 |
| cancellation / persistence failure | 存储测试验证取消不将 pending 标成 admitted；准入后持久化失败使所有等待者拒绝，保留 pending；无 owner/畸形数据拒绝 |
| Host restart | 同 home/port 重启后真实 Host 拒绝旧 Record，文本保留且模型调用数未增加；提示从 Viewer 重新关联 |

## 真实链路证据

[准入与工具结果](evidence/p2/live-admission.json)、[Session source](evidence/p2/live-session-sources.json)、[模型关联摘要](evidence/p2/live-model-summary.json)、[派生文件 hash](evidence/p2/live-derived-hashes.json)、[最终首发 UI](evidence/p2/final-first-send.txt)、[重启拒绝 UI](evidence/p2/host-restart-refusal.txt)。3 个 Session 均只有 1 个 `pto-artifact-analysis` source 和 1 个正式 `skill-invocation` source；模型失败重试不重复 Skill 注入。

最终构建复核 Session 为 `session-5077434e-a71c-456b-819d-334c41ae0cd0`，request 为 `pto-analysis-58a574ef-9cad-489d-b496-77d6a1dc6af4`。真实 Qwen 输入仍为 598 nodes / 1222 edges；两种模式各移除 `(1, 1) -> (3, 287)`，保留 1221 edges。原始 `deps.json` SHA256 仍为 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`。

实际产品 patch 包含 P1 正式 provider。隔离测试只添加返回值不变的 observer 和目录 picker，外部模型由确定性回环替身替代；真实 Host、Skill、工具和 Python 算法执行。这里不是模型能力验收，也不是 P5 的无 observer 装配验收。运行程序参考 [launch](evidence/p2/launch.py)、[observer](evidence/p2/observer.mjs)、P0 mock/decoder 与 P1 common patch；新建隔离根后调整 observer 路径及端口。原始大图、完整 prompt、认证 URL 不入库。

## 检查及已知失败

- 聚焦 5 文件 59/59；最终物化保护补充后控制器/组合 7/7，发送编排 29/29；完整影响包范围 866 通过、8 失败，8 项均为基线 Workspace fixture/旧 inject 断言。
- 完整 GUI 首次普通沙箱有 listen EPERM，允许回环重跑为 4810 通过、11 失败、1 跳过。其中 10 项在原基线逐项复现；新组合测试一处异步等待已修正，随后影响包和组合测试通过。
- 完整 build、typecheck、定向 lint、hygiene 16/16 通过。doc-sync 首轮 32/34，补齐新增 JSDoc/语言切换后重检为 34/34。覆盖率尝试被仓库既有 Conversation GUI coverage exclusion 排除，返回 0/0；不作为 coverage 通过证据。
- 全量 lint 仅保留 8 个 `no-misused-spread`；已按文件、行号和源码逐条与 upstream rebase 的 `lint-comparison.json` 对照，全部一致。未修改这 4 个测试文件或降低规则。
- 完整浏览器 replay 候选检查为 284 通过、40 失败、37 跳过；[基线对照](evidence/p2/web-baseline-comparison.json)覆盖全部 48 个不同失败条目（含套件钩子），只规范化随机 Session UUID 后首条错误全部一致，未出现仅候选失败的条目。Workspace 管理在原基线完整重跑也为 11 失败、1 通过。末次物化等待保护通过影响包测试和全新 built 工作台复核，未把旧红套件描述成全量验收通过。

普通发送的即时 echo 曾因无条件 await 受到影响，已改为只等待有绑定的发送，并由原编排 29/29 复核。新增测试/文档的类型、格式和 JSDoc 缺项均在本阶段收敛；不归入 baseline 豁免。

## 边界与遗留

P3 的正式 Skill/file token、overlay 关闭/引用回开尚未实现；P4 实验宽度尚未修改。Host 重启采用明确重新关联策略；跨设备/站点数据清除后的浏览器绑定恢复不提供保证。P2 harness 保存提交为 `e92a21adc477133a0771a6194962be901284a2ed`，分支为 `codex/repair-p2-launch-20260914`。正常 hooks 通过；首轮末尾空行拒绝已修正，未绕过 hook。P2 不 push/PR/merge，不更新主分支。
