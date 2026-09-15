# 两仓修复合并收口报告

2026-09-15。P0–P5 成果按 harness → 工作台的顺序通过普通 merge commit 合入目标主分支。保留原阶段 SHA，无 squash、rebase、主分支 force-push、产品发布或无关修复。

## PR 与正式配对

| PR | 结果 | 合并 SHA |
| --- | --- | --- |
| [harness #7](https://github.com/wangnaiyu/deepseek-harness/pull/7) | MERGED，2026-09-15 06:16:45 UTC | 163e8ddd21f6b3e5ad82de0fb3c0cfcede3fcf7b |
| [工作台 #12](https://github.com/wangnaiyu/pto-agent-workbench/pull/12) | MERGED，2026-09-15 06:18:44 UTC | 003535d76634114a2858652da24e7526e556fa9c |

本报告所在的纯文档收尾 PR 在 #12 之后合并，其 merge SHA 才是最终工作台 main。避免用提交自身不能包含的 SHA 建立循环，最终两仓完整 SHA 写入两仓同名 annotated tag `repair-merged-baseline-20260915` 并推送；其 annotation 同时保存两仓 SHA 与本轮固定 upstream `5dda764ed3aa172535a7967b06ff95d9cbfe536a`。最终 PR 地址、merge SHA 和 tag 发布结果在该收尾 PR 描述中记录。tag 生成前仅把 #7/#12 当作已完成的功能合并，不宣称最终配对完成。

harness merge tree 与已验收候选 `368c446657932f170a6d29fd2d275bea1c76073e` 完全一致；P2 `e92a21adc477133a0771a6194962be901284a2ed`、P3 `e80fa835192f2cc087369e06080aaf9944a6b3fa`、P4 `368c446657932f170a6d29fd2d275bea1c76073e` 均为 master 祖先。工作台 #12 merge tree 与 PR head `411660104d2ac0926421c7e9fb3eab892ad19db8` 完全一致；运行时 patch 相对 P5 `452e631c880082d832eb36f386fc6439df233be3` 未变。本阶段增加的均为维护文档和证据。

## 实际检查与限制

- harness 正常 pre-push typecheck 通过，未跳过 hooks；outgoing scope 59 files / 3 commits，P5 harness SHA 一致、33 份 P3 实现 hash 一致。依赖准备没有改变 tracked 源码或锁文件。
- 原 P2–P5 build/typecheck、定向测试、实际首发/同 Session 重试/new launch/引用/附件/只读双模式工具、布局验证按相同源码复用，详见 [修复报告](../2026-09-08-artifact-analysis-launch-repair/final-report.md)。没有因普通 merge commit 重跑全套耗时测试。
- harness PR 最终 51 checks：49 success、2 failure，无 pending。实际 benchmark、Node 22、native matrix、主包与 vendor 打包、Linux/Windows release-shaped runtime 通过。canonical-only job 的成功与无凭据 real-API step 的跳过不计真实验证；细项见 [CI 分类](evidence/ci-classification.json) 与 final-jobs 证据。
- `request-review` 执行目标 master 旧 ownership，非 fork collaborator 导致 API 422；Cloudflare preview 构建成功，上传缺 token 失败。两仓无 branch protection/rules required checks；这两项是非必需外部配置失败，保留红项，未改 workflow、邀请上游 reviewer、补配部署凭据或使用 admin bypass。
- 工作台无 GitHub CI checks，不能描述为远端 CI 通过；本地最终结构/链接检查 125 Markdown / 0 errors、diff whitespace 和正常 commit secret-check 通过，完整工作树密钥检查扫描 438 files。
- 原 lint 8 条、GUI 10 项、browser 41 项和旧工具清单断言失败仍按原报告保留；Host 重启需重新关联 Record、Dashboard 只查询已载入 Session 的限制未修复。

## 清理与恢复

已经删除 9 个本地普通分支：两仓 P2/P3/P4/P5 阶段分支，以及工作台 #12 的 codex/repair-merge-closeout-20260915。对应已存在的 3 个远端分支也已删除（两仓 P5、工作台 #12 分支）。每项先验证为目标主分支祖先；远端删除使用精确已观察 SHA lease，仅删除引用，不重写提交历史。完整旧 SHA、目标主分支与结果见 [清理证据](evidence/cleanup-result.json)。本报告的普通文档 PR 分支在其 merge 确认后按相同条件删除，结果写入该 PR 描述及最终交付。

保留并已推送工作台 P0/P1 分支、两仓 P3/P4 validation savepoint、全部 repair accepted/checkpoint tags。升级前 savepoint/baseline、pre/post-upstream tags、既有 backup/pre-rebase/replay-savepoint 和旧 upstream-rebase 维护分支原值保留；未把历史恢复引用当作普通 PR 分支删除。见 [保留引用核验](evidence/retained-refs.json)。

未执行大范围 git clean；所有既有隔离 home、原始日志、必要运行数据与复现证据保留。临时 gh run watch 已随 CI 完成退出 0；本阶段未启动产品进程。最终主分支同步与 tag 核验在收尾 PR 合并后执行，不自动启动下一任务。

任务由 work/inbox/tasks/2026-09-15-repair-merge-closeout 整包归档至 work/archive/tasks/2026-09-15-repair-merge-closeout，修复入站链接，保留历史 checkpoint 与证据，无活动副本。
