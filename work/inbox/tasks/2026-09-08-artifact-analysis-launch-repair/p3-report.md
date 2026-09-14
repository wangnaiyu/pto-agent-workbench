# P3：可见分析意图与引用生命周期

本页记录用户批准 [P3 契约调整](p3-blocker.md) 后的实现和验证；当前验收状态与提交以 [status](status.md) 为准。

## 实现与边界

Workspace 将规范 `/skill dependency-redundancy`、真正的 `@deps.json` 原子引用和简短问题同时暂存，成功后关闭 Viewer。引用携带 source-owned Record/revision/artifact 标识，序列化先向真实 Host 刷新并核对 revision，不猜测 Session cwd 下的文件。手动菜单选择与程序化填充使用相同引用表示；鼠标、Enter、Space 经引用所属 source 重新获取完整 Record 和新 handle，替换或迟到的 handle 均释放。

Conversation 保存引用 occurrence，并用现有编辑器节点重建；提交校验接收序列化前捕获的文本与引用。首次 admission 前必须保留所选 Skill 和同一 Record 引用，删除/替换后明确拒绝，可通过正式菜单重新选择。已经 admitted 的纯问题重试沿用 P2 规则，不强迫重复手势。旧 P2 文本绑定仍可读取。新增字段只属于浏览器交互状态；receipt schema 和 Session V3 未改变。

PTO Host 通过现有 Cordis prepend waterfall 在 tool-skill 之后处理结果，核对同名 Skill 的 provider 和实际内容，只保留一次 qualified 注入；冲突时拒绝。两种插件注册顺序均覆盖。未修改 tool-skill 实现、官方源码、算法、provider 装配、实验布局或 P2 launch 规则。

## 真实工作台验收

使用最终构建、正式 P1 patch 和只替代目录选择器的 convenience patch；无临时 provider 或 observer。外部模型由回环确定性替身提供，Host receipt、Skill source、PTO 工具和 Python 双模式算法均实际执行。这不是模型能力评测；P5 仍需整体组合验收。

| 场景 | 实际结果 |
| --- | --- |
| 双击 Analyze | 只有一个未发 launch；overlay 关闭，显示规范 Skill、原子文件引用和短问题 |
| 刷新浏览器 | 文本与真正的原子引用一起恢复，仍能回开同一 Record |
| 引用键盘/鼠标激活 | 修正后 Enter、Space、点击均回开 Viewer；Enter 前后模型请求计数均为 3，未物化 Session |
| 删除文件引用后 Send | 明确提示重新选择；模型请求计数仍为 3，未创建 Session |
| 手动重新选择 | `@dep` 菜单选择 deps.json，正式 Skill 菜单选择 dependency-redundancy；继续关联原 Record |
| 模型失败/重试 | 首次故意 HTTP 400 后，在同一 Session 输入纯问题成功；整个 Session 只有一次 receipt source 和一次 Skill source |
| 再次有意 launch | 新 Session、新 request、新 Record；工具双模式成功，仍只有一次 receipt source 和一次 Skill source |

最终两条实际 Session 为 `session-0d84063d-deff-4494-9975-91a25e3a4bad` 与 `session-c7a053c0-83e2-40d6-a505-15ea901367f4`。关联 request 分别为 `pto-analysis-dd0a2f05-fde2-44b9-8a27-c08b91d27bda`、`pto-analysis-984186da-9335-4ace-a8f2-98f6e1053a6e`。关联 Record、receipt 和工具数据见 [Session sources](evidence/p3/live-session-sources.json)、[实际工具结果](evidence/p3/live-tool-results.json)；可见交互见 [证据索引](evidence/p3/README.md)。

真实只读样例仍为 598 nodes / 1222 edges；reduced 和 reduced_dataflow 各移除一条边、保留 1221 edges。原始 deps.json SHA256 仍为 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`。原始图、完整 prompt 和认证 URL 未入库。两个隔离 home、原始日志和已有关联证据保留；临时 Host/model 已退出，浏览器标签页已关闭。

初次真实键盘取证发现 Enter 冒泡到 Lexical 默认发送，导致意外首发；这是 P3 新问题，已在引用按钮 capture handler 修复，并由真实浏览器重新验收。初次 Session 的模型摘要保留作为过程证据，不混入上述两条最终验收 Session。

## 检查

- 聚焦 32/32；键盘与输入相关测试 109/109；扩展 Host/Skill/tool 范围 123 passed / 1 known failure。
- 完整 GUI：4825 passed / 10 failed / 1 skipped。全部 10 项失败名称和首条诊断与 P2 基线对应，见 [比较](evidence/p3/gui-baseline-comparison.json)。新增捕获内容参数要求更新原 sink spy 的参数断言；原发送语义未改变。
- 完整 build、typecheck、定向 lint、export JSDoc 通过；doc-sync 34/34，hygiene 16/16，工作台结构检查通过。
- 全量 lint 保留 8 条既有 no-misused-spread，按文件/行/源码逐项匹配，见 [比较](evidence/p3/lint-baseline-comparison.json)。未降低规则。
- tool-pto-run 的 load-path 旧测试仍预期两个工具、实际三个；在原升级后基线独立复现，测试和入口源码 hash 完全一致，见 [比较](evidence/p3/load-path-baseline-comparison.json)。本阶段不修复。
- 完整 browser replay：283 passed / 41 failed / 37 skipped。49 个失败条目中 48 个匹配 P2；新增 turn-tail 吞吐量文本差异未在原基线复现，单独重跑通过不作为豁免。按用户要求停止 P3 验收，详见 [验收停止报告](p3-validation-blocker.md)。

## 遗留

Host 重启/Record 失效仍明确要求重新关联，站点存储清除不保证草稿恢复。P4 实验布局尚未修改；P5 整体回归尚未开始。P0/P1/P2 提交、分支和 savepoint 保留，本阶段无 push/PR/merge 或历史改写。

P3 WIP harness 保存提交：`e80fa835192f2cc087369e06080aaf9944a6b3fa`，正常 pre-commit hooks 通过。两仓完整保存 SHA 见 annotated tag `repair-p3-validation-checkpoint-20260914`，另保留 `codex/savepoint-p3-validation-20260914`。这是一组未验收恢复点，不是正式升级/产品主分支基线。
