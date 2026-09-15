# 两仓升级前基线收口报告

2026-09-09。现有成果已分别保存、推送并合入目标主分支；普通 PR 分支已完成有限清理。没有执行 upstream fetch/rebase、force push、改写 master 历史或启动分析修复。

## 已合并成果

| 仓库 | 初始保存提交 | 现有改动 PR head | 功能合并主分支 SHA | PR |
| --- | --- | --- | --- | --- |
| 工作台 | 563ec644372442ae670ec8ee5218fecd30ae429a | 7a84a27d6cfdbd31c90f10e13346f7c6b378ea61 | a2b92456c2d9605946cba10ff51d0659ac3dd92a | [#9，MERGED](https://github.com/wangnaiyu/pto-agent-workbench/pull/9) |
| harness fork | e95e118b26761c20381f278b8d98c15ee56fc886 | e95e118b26761c20381f278b8d98c15ee56fc886 | ef0d49b574f544c997e914b4254e38080730f45a | [#5，MERGED](https://github.com/wangnaiyu/deepseek-harness/pull/5) |

工作台 #9 的 3 个提交依次保存原始成果、检查配对和 harness 合并证据。本报告通过额外仅文档 PR 归档，不修改运行时代码。最终正式配对以两仓同名 `pre-upstream-baseline-20260909` annotated tag 的 JSON 正文为准：正文包含两仓完整主分支 SHA；`codex/baseline-pre-upstream-20260909` 同时固定最终主分支。这样能保存收尾文档合并后的真实 SHA，避免把未发生的 merge SHA 写进提交。

## 保存范围

原始外层 22 个 tracked 变更、24 个 untracked 文件及 harness 39 个 tracked 变更、12 个 untracked 文件均已盘点；初始逐文件哈希见 evidence。旧 MVP 归档、新 repair 包、官方 Skill/resource/tool、源码、测试、配置与生成目录已纳入各自仓库。

额外找回被 `lib/` 规则忽略的官方 `lib/dfx/capture.md`，内容与 release-lock 哈希一致；用精确路径例外纳入 Git。官方 literal、LICENSE 和只读来源未改。初始文件清单中的每个应保留文件均存在于保存提交，未丢弃有效改动。

## 验证与保留问题

[检查证据](evidence/checks.md)记录实际命令、初次失败、收口修正和复验结果；[远端结果](evidence/harness-pr-checks.json)保存 27 个成功检查及一个取消预览。

聚焦 223/223、相邻 20/20、完整 build、正常 pre-push typecheck、doc-sync 32/32、hygiene 16/16 通过。工作台结构、正常 secret hook 和 diff whitespace 通过。fork CI 的 canonical-only lanes 使用 no-op，不能据此宣称真实全量 coverage 通过。

全量 lint 保留 4 个未改动测试文件的 8 个 no-misused-spread 诊断，在原始 origin/master 独立 worktree 复现。本阶段未降低规则或绕过 hooks。新增交付的 README、JSDoc、服务分类、生成目录和格式缺项已补齐。

Viewer 首发结构化 identity/receipt 丢失、新 launch/同 Session 重试与实验 View 宽度仍由 [repair 任务](../../../archive/tasks/2026-09-08-artifact-analysis-launch-repair/README.md)处理，任务保持 planned。本阶段未执行真实模型分析、设备操作或完整 first-send recorded-session/browser 验收。

Cloudflare preview 指定上游专用 runner，排队时没有 runner 分配，且不是必需检查。本次只取消该 PR 的未启动预览发布，不修改 workflow 或仓库配置，不算通过。

## 清理与恢复

- 两仓 `codex/pre-upstream-baseline-20260909` 普通分支本地/远端已删除，删除前验证各自对主分支独有提交数为 0，远端 SHA 与已合并 head 一致。
- 两仓 `codex/savepoint-pre-upstream-20260909` 初始保存分支本地/远端保留；最终 baseline 分支与 annotated tag 保留供后续 rebase 比较和恢复。
- harness 原有 backup/pre-upstream-rebase-20260828、20260831、20260901，以及 codex/pre-rebase-master-20260902、20260903、20260904 全部保留。
- 删除本任务创建的原始基线 lint 临时 worktree 及其依赖 symlink；未删除原有 artifacts、截图、数据、node_modules、构建缓存或不确定用途目录，未执行 git clean。
- 本包 scratch 保留初始 binary patch、文件快照和检查日志，整包归档时一起迁移，继续被 Git 忽略。正式 Git savepoints、清单和摘要承担可恢复依据。

进入独立 upstream rebase 的保存、合并与清洁主分支前置条件已经具备。开始下一阶段时仍须重新核对实时状态、固定上游目标并建立独立维护任务；本报告不代表已经升级或验证新上游。
