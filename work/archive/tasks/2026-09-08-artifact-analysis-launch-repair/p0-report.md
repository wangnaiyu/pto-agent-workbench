# 升级后 P0：因果链、问题分类与后续边界

日期：2026-09-11。本报告只总结取证与计划重定基线，不代表产品已修复。后续 P1–P5 未实施；当前任务进度及执行权限以 [status](status.md) 为准。

## 实际基线和实验边界

| 项目 | 本轮实际值 |
| --- | --- |
| 工作台 main / origin/main / 接手 HEAD | `bc3eecff7f3d770527ef7c1dfa4ccbf16d7c09d9` |
| harness master / origin/master / built CLI | `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807` |
| 固定 upstream ancestor | `5dda764ed3aa172535a7967b06ff95d9cbfe536a` |
| 对应版本 | 0.1.5-alpha.1，built client commit `ac2b72a` |
| 正式 annotated tag | 两仓 `post-upstream-baseline-20260910` 均 peel 到上列主分支 SHA |
| 本轮工作分支 | 外层 `codex/repair-p0-20260911`，HEAD 不变，仅文档/证据未提交 |

接手时两树 clean、主分支与 live origin 一致，无进行中的 Git 操作；旧 baseline/savepoint branches 和 annotated tag 完整。与用户给定升级后基线无差异。记录见 [baseline](evidence/p0-baseline.json)，结束复核见 [final state](evidence/p0-final-state.json)。没有 upstream fetch/rebase、主分支更新、提交、push 或 PR。

使用真实工作台 `patches/cordis.patch.yml` 和实际 harness built CLI。与上一阶段测试方法的一个区别是：本轮从外层根 cwd 启动，符合从根运行 `start.sh` 的实际效果，而不是从 harness cwd 启动。未调用会固定真实用户 home 的 `start.sh`；四个 Web 实例各用独立临时 home。这个区别影响默认 Session cwd 与 project Skill discovery，不是代码基线差异。

A/B 共同增加上游 browse directory picker 和同一个只记录返回值/异常的 Host observer；B 唯一业务差异为 `insert` 固定 official provider。A 完成失败首发和重试后才启动 B。C 是新 home 的 B 配置，用于文本编辑和模型失败；layout 是独立 B 配置加测试提案生成器，不参与核心 A/B 因果比较。

模型是 localhost 确定性外部替身，不发送外部模型请求。它从实际收到的 `pto_artifact_analysis` 上下文提取 Record tuple，再请求真实 `pto_dependency_redundancy`；分析结果由真实 Host 子进程运行官方 Python 工具产生。模型结论文案是 mock，不能证明真实模型质量。详见 [instrumentation](evidence/p0-instrumentation.md)。

## 真实装配为何缺 provider

工作台 patch 第 25 行用普通 `- id: skill-filesystem-pypto-official-af1d7a016ce5` 覆盖一个基础 profile 中不存在的 entry。Loader 的 `applyEntryPatches` 明确对未匹配 id 报警并跳过；只有 `insert` 才新增 entry。填写 `name` 不把 override 变成 insert。`composer-catalog.providerOrigins` 只是来源展示元数据，不能注册 Skill provider。

实际运行快照：

- A root catalog 只有六个 `pto-bundled` Skill，没有 `dependency-redundancy`。外层 cwd 的 Session 另外发现 `filesystem/project-agents` 的 `workbench-project-workflow`；这来自 preset 的项目发现，是实际环境事实，本阶段未修改这一独立策略。
- B root catalog 为上列六个 + `pypto-official-af1d7a016ce5/dependency-redundancy`。Session qualified lookup 返回固定 release 内的 SKILL.md、正确 resourceBase、`userInvocable=true`。
- 配套文件实际上存在且 hash 正确；所以不是 bundle 缺文件或算法缺依赖，而是 runtime composition 未实例化 provider。
- inspector 根据配置的 Skill/tool tuple 和 artifact evidence 把 analysis action 标为 available，尚未在这个阶段确认 Session 中的 provider。真正 qualified 校验发生在 admission。

该配置缺陷在上一阶段对旧 master 与新 master 都已复现，不能归为此次 upstream rebase 新引入。源码入口：外层 `patches/cordis.patch.yml:25`；harness `vendor/include/src/index.ts:58`；`packages/host/pto-artifact-inspection/src/index.ts:375`。本 P0 没有正式修改 patch。

## A/B 核心对照

| 观察层 | A：实际配置 | B：仅补 provider |
| --- | --- | --- |
| inspect / profile | 成功；完整 Record、inventory revision、artifact refs | 成功；相同样例/相同 inventory revision |
| Viewer | 发送前成功打开 `deps_viewer.html`；598 nodes / 1222 edges | 相同 |
| Analyze 按钮 | 新 browser draft，普通中文问题；overlay 留在原处 | 相同 |
| 默认 Workspace/cwd | UI `default`；Session header 为外层根 cwd | 相同 |
| 首次 submit | 物化一个 Session，再调用 admission | 同左 |
| qualified lookup | 返回 null | 锁定 official Skill，资源根正确 |
| admission | 抛出 Skill unavailable | 返回完整 receipt |
| receipt | **未生成** | 进入 pre-step、Session V3 source、model context 与 tool result |
| 实际工具 | 没有调用，首发模型请求也未发生 | 真实 pinned Python 两种模式都执行成功 |
| Viewer 独立表现 | 完整 record+handle；保留 overlay，无 `/skill`/`@file` 可见语义 | 未因 provider 改变 |

A 关键 Host seq：30 admission request → 35 qualified request → 36 null → 37 admission error；再次 Send 为 42→47→48→49，requestId 和 SessionId 完全相同。首发与该次重试均未发送模型请求。之后有意刷新产生另一条行为，不能把刷新后的普通 prompt 混入“A 首发失败”的证据。

B 关键 Host seq：30 admission request → 35 qualified request → 36 qualified result → 37 receipt → 42 runDependencyAnalysis request → 46 tool result。model request 1/3 收到同一上下文；request 2 是无 tools 的标题生成。Session V3 `user/message` seq 12 的 source 为 `pto-artifact-analysis`，seq 13 为一次 `skill-invocation`。

证据：[A trace](evidence/p0-a-host-trace.jsonl)、[B trace](evidence/p0-b-host-trace.jsonl)、[model trace](evidence/p0-model-trace.jsonl)、[Session events](evidence/p0-session-events.json)。

## 完整 identity 数据流

1. **选择记录**：用户只读选择 Qwen `dfx_outputs`。Host `inspect` 注册 Record，profile 为 `evidence-pack`，revision 为 `inventory-v1-557be9e7`。markerless 子目录的 `generation/runtimeLevel=unknown`、`identityEvidence=[]` 是分类事实，不是途中丢 identity。
2. **打开 Viewer**：Client 发 `{recordId, revision, actionId: open.dependency-graph}`；Host 再 inspectTarget，返回 `{handleId, actionId, title, artifactRef, kind, urlPath, features}`。Client state 同时保存完整 `record` 和 `handle`，overlay 消费两者。静态 iframe 只加载已授权 HTML 路由，不接收 analysis receipt；该 Viewer 在 analysis admission 之前就已打开。
3. **生成草稿**：`PtoViewerController.stageAnalysis` 把 Record/action/requestId 与一个 `${revision}:${catalogRevision}:${workspaceId}:${agentPreset}` 字符串放入 root controller 的私有 `analysisDraft`，正文只有中文问题。它不是通用文件 attachment，也不是可恢复的正式 launch attachment。
4. **首次发送**：InputHub 捕获 draft target，materialize Session，转移正文/通用附件，准备上传，调用 input-trigger admission。PTO bridge 根据字符串匹配决定是否调用 Host。未匹配时返回 undefined，bridge 不检查该结果，通用流程可继续发送。
5. **Host admission**：先检查 request 重复及 fingerprint、Record/revision/action/Skill tuple，再在真实 Session Agent scope 做 qualified lookup；成功后才创建 receipt，记录 request/session/record/revision/action/artifactRefs/Skill+revision/tool+revision。A 在这里未生成 receipt；B 在这里完整生成。
6. **pre-step / invocation**：Host 查 Session admission，向消息添加 `source.kind=pto-artifact-analysis`（内含完整 receipt）和一次 `skill-invocation`。去重查询已提出消息和 Session events，C 重试未重复注入。模型收到明确 scoped Record/action/artifact/Skill/tool/request 文本，完整结构化 receipt 保存在 Session source。
7. **执行**：工具收到 exact record/revision，核对本 Session admission，再 inspectTarget/revision，解析该 Record 的 `deps.json`，运行锁定 Python。B/C 的工具输出 receipt 与 admission 和 Session source 相同。两模式均报告 1222 边中移除 1 条 `(1, 1) -> (3, 287)`、保留 1221；这不是性能收益证明。
8. **持久化**：Session V3 的拼接 Zstd frames 全部解码后检查事件；不能只解第一帧 header。A 刷新前没有 user 分析消息，刷新后普通消息被记录；B 首发和 C 首发+重试均有 receipt/source。Host 当前 admission/Record 索引仍是内存 map；本轮未做 Host 重启恢复实验，不把 browser reload 结论外推为 Host restart 支持。

`tool-pto-run` 是另一组 Workspace-confined 的发现/只读 profile 工具（`pto_run_discover` / `pto_run_inspect` / `pto_record_inspect`）。实际 model tool roster 包含它们，Viewer UI 路径走 Host inspector Remote，并非自动调用 `pto_run_inspect`。不能把未调用这一工具误判为 inspection 未执行；它的独立定向验证见检查记录。

只读输入与 closure hash 见 [hashes](evidence/p0-closure-hashes.json)：deps.json 412557 bytes，SHA256 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`；官方工具 SHA256 `24b1c5c069d08dfe198a21ad272b5cafab82237b897504ccca633109fcebc116`。没有更改官方 literal 或原始输入。

## launch / retry / draft 行为矩阵

以下 Session ID 用缩写，完整值在事件证据与表后映射。Viewer 每次 inspect 同一路径得到稳定于该 Host 的 Record；不同隔离 Host 的 Record UUID 不同是正常结果，不能跨 A/B 比较 UUID 相等。

| 场景 | Session / admission / receipt | artifact / Viewer / 重试后的状态 |
| --- | --- | --- |
| A 首次 Analyze，未发 | 尚未物化；仅 browser draft | 完整 Record+handle；中文预填，overlay 未关闭 |
| A 首次 Send | A1；qualified null，receipt 未生成 | 无模型/工具；正文保留；错误短暂性 UI 不能替代 Host trace |
| A 原地再次 Send | 仍 A1，同 requestId，再次明确拒绝 | 无额外 Session，无模型；这一条 retry 身份正确 |
| A admission 失败后 browser reload 再 Send | 仍 A1；未重新 admission，无 receipt | 保留的普通文字发送到模型；model request 8 无 analysis context，**fail-open** |
| B 全新首发 | B1；完整 admission/receipt | 真实工具双模式成功；overlay 需手动关闭，未出现正式 token |
| B 在已有 B1 后双击 Analyze 再 Send | 只创建 B2 一个新 Session；**无 admission** | 同 Record/profile，普通模型 request 4 无 context；不能把“仅一个 Session”当双击 launch 已正确去重 |
| B 再次单击 Analyze 再 Send | B3 新 Session；**无 admission** | 普通模型 request 6 无 context；问题不只发生于双击 |
| C 全新首发，仅编辑正文，故意模型 HTTP400 | C1；receipt 已生成并持久注入，工具尚未执行 | 普通文本编辑本身未破坏首次绑定；UI 明示 turn failed |
| C 在失败 turn 后手动发送“重试” | 同 C1；沿用原 receipt，不重复 admission/Skill source | 真实工具成功；这是同 Session 后续 turn，不是不存在的专用 Retry 按钮 |
| C 新分析后改 Workspace 再 Send | C2；header 为所选临时 Workspace；无 admission/receipt | draft target 变化后普通文本进入模型；原 Record 未自动换成该 Workspace 的数据 |
| C 未发送分析 draft 编辑后再次 Analyze | 未发送期间无新增 Session；旧编辑被普通预填无提示覆盖 | overlay 仍开；已证实未发草稿保护缺失 |
| C 未物化分析 draft browser reload | 未创建新 Session；恢复为最近 Workspace 的空草稿 | 预填/私有 analysis identity 不恢复，Send disabled；不同于 A 已物化失败稿 |
| 通用附件首发 | C3；Session file block 含 attachmentId/name/bytes | 66 bytes 输入/存储 hash 相同；UI 显示文件。该通用链路成功不等于 PTO 私有 identity 已持久化 |

ID 映射：A1 `session-1df0121f-aea3-49d2-921f-093848292155`；B1 `session-eb63b95f-1095-48c1-a2a7-bbac19cbf351`；B2 `session-5c018fd4-92f6-4d39-8e80-37f1a75bddc8`；B3 `session-81427bc7-7fbf-49ea-9f3e-88a391151e2c`；C1 `session-1cf0e5a2-3017-44ef-b133-50afc9f2c521`；C2 `session-a390f085-fcca-45af-93a6-9b544c85b8ba`；C3 `session-17f4bf74-df19-4433-9cc6-8092309739e4`。

源码/证明边界：实际 controller 的 7 条断言证明 target 字符串变化会静默跳过 Remote、关闭 Viewer 保留 requestId、新 staging 替换 requestId、新 controller 没有恢复状态。真实 B relaunch 的确切字符串变化时序尚未从 Client 内部观测；`ui-agent-preset` 的异步 seat load/syncDraftPreset 是候选影响点，不作已证实唯一根因。P2 实施前必须用真实组合和 barrier 捕获两个 target，不能单凭这个推断修改 upstream preset。

通用附件源路径 `InputHub.sinkDraft → prepareDraftFiles → Session shell` 已由真实上传/持久化与现有拒绝重试测试分别证明。Playwright click 的 filechooser 超时后，CUA 原生 AX click 成功；保留此方法差异，不归为产品 bug。组合“PTO admission 拒绝 + 文件”本轮有定向测试、没有第二个完整浏览器文件用例。[附件证据](evidence/p0-attachment.json)。

## 有内容的 experiment view/layout

通过真实 `ptoExperiments.plan` 在独立 home 创建 3 条 synthetic **planned** durable records；没有执行任何提案，没有伪造 DOM 或 completed/性能结果。实际 `ptoExperimentDashboard.listSession` 投影给正常 UI，显示 `Showing 3 of 3`。源 Workspace 是专用临时目录，`baseline/kernel_config.py` 只作测试识别标记。

| 场景 | 正文 CSS 轴 | 实验卡片宽 / 容器宽 | 结果 |
| --- | --- | --- | --- |
| 1280×720 默认 | adaptive，680px | 896 / 992px | 卡片未跟随正文轴 |
| 同 viewport 手柄内拖 | 640px | 896 / 992px | composer 变窄，卡片不动 |
| 同 viewport 手柄外拖 | 780px | 896 / 992px | composer 变宽，卡片不动 |
| 1600×900 | 780px 偏好 | 960 / 1312px | 受自有 max-width:960 限制 |
| 900×720 稳定后 | 668px | 约795 / 836px | 四列；无容器级水平溢出但未按正文轴 |
| 700×720 稳定后 | 640px（手柄隐藏） | 约795 / 636px | 两列仍溢出，scrollWidth 811 > clientWidth 636 |
| 1280×720 打开资源侧栏 | 640px（手柄隐藏） | 约795 / 416px | scrollWidth 843 > 416，操作超出可见区域 |

测量含两条刚 resize 的过渡样本，报告只用 marked `settled` 数据作窄屏结论。原始数据、截图见 [metrics](evidence/p0-layout-metrics.json)、[默认页](evidence/p0-layout-default.png)、[700px](evidence/p0-layout-700.png)、[资源侧栏](evidence/p0-layout-sidebar.png)。

`ui-pto-experiments/dashboard.module.css` 独立使用 max-width:960，不消费 inherited `--dsh-chat-content-width`；单列 grid 的最小内容宽度、nowrap 长内容及仅按 viewport 的 720px 断点，在小容器下暴露问题。upstream 资源侧栏缩小了可用容器，但不需要先改核心 layout；P4 先在插件内解决。纯 Viewer overlay 不在这些实验页测量中；因此这个问题不是 Viewer overlay 引起。

本轮只验证 planned 内容。completed/failed card、完整最底部滚达性在 P4/P5 补验，不能把这些截图当全布局验收。

## 原问题重分类

| 分类 | P0 结论与依据 | 后续归属 |
| --- | --- | --- |
| 工作台 configuration/composition | 已证实 official provider 缺实例；A/B 精确反转首发结果 | 独立 P1 |
| upstream 新架构适配 | Session V3 / generic attachment / preset-aware draft / resources sidebar 改变消费契约；不证明 upstream 自身有错 | P2/P3/P4 在现有 seam 上适配 |
| Session/Conversation/launch | 同页 admission retry 和模型后续 turn 可复用；relaunch、retarget、reload、未发草稿保护有明确缺口 | P2 |
| Skill/provider/admission/receipt | 配置正确且匹配 draft 时 qualified lookup、receipt 和单次 Skill 注入完整；未匹配时未调用 admission | P1/P2；不默认改 schema |
| artifact inspection 数据传递 | 实测 record/revision/artifact 到 inspect/open/tool 正确；两种工具模式成功 | 保持，作为回归门禁 |
| Viewer 消费/展示 | full record+handle 存在；静态 Viewer 本来不接 receipt。独立缺陷是 overlay 未退出、普通预填缺规范 token | P3 |
| experiment layout | 有内容时不跟宽度轴，窄屏/侧栏有水平溢出 | P4 |
| 已不存在/本轮未复现的旧疑点 | “任何首次发送都丢 identity”“新分析必复用旧 Session”“模型失败必再建 Session”均不符合当前矩阵 | 删除无依据通用修复，不能声称全被 upstream 修好 |
| 升级前误归因 | 把 A receipt 未生成归给 Viewer；把 Python 文件存在等同 runtime provider 已装配 | 撤销，回写产品事实 |
| 仍需进一步取证 | live relaunch 精确 Client target 变化时序、Host restart 恢复、PTO+文件完整浏览器拒绝恢复、completed/failed 布局 | 对应阶段红测/扩展验收，不作为 P0 已证明事实 |

关键旧假设被推翻：**不是一条“Viewer 丢 receipt”的统一故障链**。A 是装配失败导致未生成；B 首发已完整；B relaunch/目标变化与 A reload 是 admission 被跳过；Viewer 的静态图接收契约和分析 receipt 是不同阶段。

已确认产品意图（新 launch、新 draft、发送才 materialize、同 launch retry、简洁真实 token、关闭 overlay、宽度契约）保持不变。只是原始修复位置与顺序需要重排。[新 P1–P5](plan.md)分别为：config → launch 生命周期 → 可见 Viewer/composer 交互 → experiment layout → 实际组合验收/收口。

## 验证和限制

- 实际 A/B/C 浏览器与 Host/Session 证据如上；B/C 两次真实 `pto_dependency_redundancy` 双模式均成功。没有真实外部 LLM 质量验收，也未执行设备实验。
- `pnpm exec vitest run packages/client/ui-conversation/tests/apply-inject.client.spec.tsx packages/client/ui-workspace/tests/pto-viewer.client.spec.ts packages/client/ui-workspace/tests/workspaces-service.client.spec.ts packages/client/ui-agent-preset/tests/apply.client.spec.ts`：4 files / 53 tests passed，含通用附件拒绝后恢复；日志见 [focused tests](evidence/p0-focused-tests.txt)。
- 实际 controller 的 P0-only 7 断言通过：[proof](evidence/p0-controller-proof.json)。它证明机制，不替代真实 relaunch 时序。
- `pnpm exec vitest run packages/pto/tool-pto-run/tests/tool-pto-run.spec.ts packages/pto/tool-pto-run/tests/load-path.spec.ts`：11 passed / 1 failed。失败仍是 load-path 旧清单预期两个工具，实际多出 `pto_record_inspect`；测试与工具源码对升级前 `ef0d49b…` 的 diff 为空。没有修复或豁免此失败。其余证据一致性、工作台结构与 whitespace 检查见 [validation](evidence/p0-validation.json)。
- 本轮没有正式产品代码修改，未重复完整 build/typecheck/lint/doc-sync。上一阶段的 8 条已逐源码确认 lint diagnostics、旧工具清单“预期2/实际3”本轮再次复现且源码一致；8 条 lint 只引用上一阶段证据，本轮没有重新运行 lint，也没有将它们修复。
- 现有单测为什么漏检：PTO controller 测试 mock 固定 revision，甚至期望 mismatch 返回 undefined；通用 InputHub 测试注入成功/失败 controller，不装实际 workbench patch 和 PTO bridge；这两层各自通过，不能证明完整配置与 preset 时序正确。

## 保存、清理和下一步

证据与可复用 P0-only observer/mock/启动脚本保存在 [evidence](evidence/README.md)，不依赖聊天记忆或唯一 scratch。认证 URL 不写入正式证据；原始大数据不复制。临时 homes、官方工具派生输出和完整本地日志保留作复现证据，没有大范围 clean；它们不属于产品补丁。

五个本轮进程已核实 PID 后 SIGINT 并等待退出：mock exit 0，四个 Web exit 130（主动停止，非测试超时）；所有测试 tab 关闭、viewport reset。[teardown](evidence/p0-teardown.json)。没有删除旧 savepoint/tag/分支。

P0 输出为报告和计划，工作台分支保留未提交文档/证据；harness 源码与正式 patch 不变。两仓 main/master ref 及 live origin 仍以 [结束核对](evidence/p0-final-state.json)为准。

下一步只可能是 **P1 独立 provider 装配修复**，须有新的明确实施授权并再次核对基线；不能从本报告自动启动。P1 的成功也不代表整个 repair 完成。整个任务继续保留在 inbox，不归档、不把 final-report 写成修复完成。
