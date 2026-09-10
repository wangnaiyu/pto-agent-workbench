# harness upstream rebase 阶段报告

本阶段采用固定 upstream 重放 fork 历史；未启动或修改 `work/inbox/tasks/2026-09-08-artifact-analysis-launch-repair`。接手时两仓HEAD、origin、保存点与上一阶段记录一致；后续变化均为本维护任务所产生。

## 版本与历史

| 项目 | 完整SHA |
| --- | --- |
| 升级前工作台main（也是本轮产品组合验证基线） | `90390059746c29a71bd5315e1dce5101bb803aec` |
| 升级前harness master | `ef0d49b574f544c997e914b4254e38080730f45a` |
| 固定upstream master，0.1.5-alpha.1 | `5dda764ed3aa172535a7967b06ff95d9cbfe536a` |
| merge-base | `76fda729799fe9b3848dbe2c211d4b231032b81e` |
| 初始replay candidate | `dfee89b2e0e6ca090f911b136315f235133aec78` |
| compatibility commit / 最终candidate / fork master | `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807` |

upstream target提交时间2026-09-08T23:25:45+08:00，自merge-base新增1108提交，208个双方共同修改路径。关键变化为Session V3相邻generation迁移和文件租约、显式Agent/Inbox、通用附件上传、system-prompt surface、新资源侧栏及native/runtime装配。

旧fork有25个非merge提交：7个正常重放、17个发生语义冲突适配、1个冗余InputNotice清理在前置冲突处理中吸收，得到24个replay提交；另加一个兼容提交。旧PR #5的merge仅扁平化拓扑，不丢内容。完整逐条对应见[映射](evidence/commit-mapping.md)、[JSON](evidence/commit-mapping.json)和[range-diff](evidence/range-diff.txt)。没有因upstream“等价实现”而删除PTO能力，没有有意删除有效功能。

重要决策见[审计](evidence/upstream-audit.md)：alias沿用新版generation/lease，前代不覆盖；browser draft通用文件在实体化后上传并保留准入失败后的附件；保持upstream附件移除保护；旧ToolDetails不恢复，完整七维比较证据迁至工具行原生折叠；保留qualified Skill、artifact inspection/receipt及run-records，不加入Viewer repair。manifest版本与锁文件对齐新版，生成目录与双语文档按新规则更新。

## 实际验证

| 检查 | 结果 |
| --- | --- |
| 正常typecheck（含Host build和Client tsc）及每次pre-push hook | 通过，无hook绕过 |
| 隔离candidate完整build，native system addon | 通过；最终hub适配后已完整重建 |
| 实际harness master checkout依赖与完整build | 通过；客户端build metadata为ac2b72a、0.1.5-alpha.1，无dirty标记 |
| frozen install | 通过；只移除upstream退役的projection-cache锁条目 |
| 上一阶段9聚焦+4相邻文件 | 262/262通过 |
| Conversation全目录、PTO UI、Client/Host composer catalog | 432/432通过 |
| JSONL + PTO executor | 185/185通过 |
| 传统/alias前代generation迁移 | 2/2通过（其余178按名称过滤，非全量结果） |
| 最终apply-inject文件 | 16/16通过；等待可观察notice，无新增固定sleep |
| CI workflow与selfhosted路由 | 36/36通过 |
| hygiene | 16/16通过 |
| doc-sync | 34/34通过 |
| 全量lint | 未通过：8条与旧基线源码逐条相同的no-misused-spread，见[比对](evidence/lint-comparison.json) |
| 工作台结构校验、staged secret-check | 通过；最终归档路径再校验 |

测试组存在重叠，不相加。初轮native缺失及实际适配失败保留在[验证过程](evidence/validation-progress.md)，不能冒充通过。兼容提交正常pre-commit通过。新增通用文件回归用例在适配前因upload未发生失败，适配后通过；未降低测试/CI规则。

master更新后28个job成功：native21、sandbox4、release pack/layout3；个别步骤依平台/仓库规则跳过，不汇总为全套产品验收。

master更新前审计PR与旧历史冲突，GitHub没有运行PR CI，不计为通过。更新后四个workflow成功，逐job/step证据见[master CI](evidence/master-ci.json)。canonical-only/no-op以及skipped步骤不作为真实验证；未宣称本地执行Windows或真实外部模型e2e。完整日志校验值及精选尾段见[验证日志索引](evidence/validation-logs.json)。

## 工作台组合与已知问题

本阶段没有外层产品compatibility adaptation；外层仅维护文档，故无产品适配commit/PR。完整built组合隔离运行于临时DSH_HOME与本机mock模型，原始数据只读。Viewer实际598nodes/1222edges，普通New Session一次发送成功。

新发现但属于升级前的问题：实际patch将不存在的official provider当作普通id覆盖，旧/新built CLI均entry not found并跳过。文件与锁定资源哈希全部匹配，但实际official路径拒绝准入。它不是rebase新失败，本阶段未修复。

明确分开的临时insert补充验证中，Viewer首次发送产生完整record/revision/action/artifactRefs、qualified Skill和tool revision receipt，随后注入dependency-redundancy并收到本机mock响应；不表示真实模型完成分析。锁定官方Python工具独立运行reduced与reduced_dataflow均移除 `(1,1) → (3,287)` 一条边，1221边保留，源哈希不变。

Viewer仍普通文本预填并保留覆盖composer的overlay。空实验视图1280×720下992px、max-width:none；有内容视图、多尺寸以及完整new-launch/retry路径未完成浏览器复验，不能宣称已修好。后续P0应基于[组合取证](evidence/workbench-compatibility.md)重新规划，不机械沿用旧“全部首发receipt丢失”的判断。

另一旧失败为tool-pto-run load-path测试预期2工具、实际3工具；在升级前master原位复现，未改断言。8条lint亦为旧问题。没有发现尚未解决的rebase新实质失败或必须外层适配的新接口问题；没有确认独立upstream缺陷。

## 远端更新、正式配对与恢复

[harness PR #6](https://github.com/wangnaiyu/deepseek-harness/pull/6)已MERGED，SHA为ac2b72a9615cbaf23bb21951ffe1c22f3a11d807。执行精确 `--force-with-lease=refs/heads/master:ef0d49b574f544c997e914b4254e38080730f45a`，推送明确candidate到refs/heads/master。GitHub识别其包含PR head后标记合并；没有普通merge/squash、裸force或再次追随upstream。见[远端证据](evidence/remote-adoption.json)。首次SSH分支推送中断后先确认未写入，使用认证HTTPS重试成功。

最终工作台main为本归档PR合并后的主分支。两仓annotated tag `post-upstream-baseline-20260910` 的JSON消息保存其完整workbench SHA、harness SHA、固定upstream SHA，避免在提交正文中伪造该提交自身/未来merge SHA。该tag是正式三元配对的可恢复机器记录。

全部升级前savepoint/baseline branches、annotated pre-upstream tag和原有harness备份保留；另外保留本轮审计分支、初始replay-savepoint和隔离worktree供后续升级验证查阅，不删除恢复点，不运行git clean。临时服务已停止，必要日志/截图和隔离运行数据保留。PR合并与tag推送后的两仓main/master状态以最终现场核对和交付消息为准。

## 后续边界

本次升级及基线记录完成后，repair P0具备开始前置条件：固定新版三元组、原始恢复点、映射、验证和已知问题分类可用。P0需要先重新验证实际official provider装配，再判断Viewer首发、launch/retry和width任务范围；本阶段没有启动P0–P5，也没有修改repair任务包。
