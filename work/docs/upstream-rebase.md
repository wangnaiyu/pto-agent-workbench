# harness 上游维护

本流程仅在用户授权更新上游时执行。接手普通开发任务不自动 fetch/rebase，治理文档更不需要改变 fork。

## 更新前

读取适用 Agent 指令、[规则](rules.md) 和 [踩坑](pitfalls.md)。分别记录外层与 harness 的 HEAD、分支、工作树状态；确认实际远端/目标版本，不沿用历史命令中的固定分支。存在他人未提交内容先协调，不能 reset/checkout 覆盖。

明确保存点、回退方案、插件差异和预计构建面。建立本次有界任务包；旧备份是否删除另行确认。

## 更新与验证

1. 在 harness 内按批准范围 fetch 并核对目标 commit、release/package 变化。
2. 按实际分支关系选择 rebase 或 merge，先检查冲突，再逐项处理。禁止以“采用上游”为由丢弃 PTO 的已确认行为。
3. 用保存分支与重放后区间做 `range-diff`，确认每个 fork 提交都有对应项；有内容变化的项另行审计，不能只比较提交数量。
4. 对照 slot、session handle、tool result、provider 与 manifest/bundle 契约检查消费者。
5. 执行受影响测试；依赖/装配发生变化时运行官方完整构建，并用隔离实例验证核心界面。记录命令、版本、失败及已知基线问题。
6. 回写当前架构/踩坑及任务验证证据；区分历史已通过、本次通过和未验证。

是否提交、推送，以及需要改写远端历史时的处理，均按用户的具体授权执行；本流程不提供默认 force push。已授权改写历史时，推送前重新 fetch，并只用带目标 ref 与已观察远端 OID 的精确 `--force-with-lease=<ref>:<oid>`；远端移动就停止。发布也不是维护任务的隐含后续动作。

## 已知版本记录

当前维护基线为 0.1.6-alpha.2，固定 upstream 与 fork 完整 SHA 见[架构](architecture.md)，30 项重放及 1 项兼容收尾、V4 successor 和验证见[2026-09-21 升级报告](../archive/tasks/2026-09-21-upstream-rebase/final-report.md)。正式配对为两仓 `post-upstream-baseline-20260921` annotated tag。旧 master `70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb` 保存于 fork 远端 `codex/pre-upstream-master-20260921`；候选 `codex/upstream-rebase-20260921` 与此前所有基线 tags 继续保留。

上一 alpha.1 基线见[2026-09-15 报告](../archive/tasks/2026-09-15-upstream-rebase/final-report.md)及两仓 `post-upstream-baseline-20260915` tag。回退源码可使用保存 ref；不得把源码回退理解成真实会话降级或覆盖旧 generation。

本 fork 的 Session V4 承载 PTO analysis source 扩展。下次上游使用同一整数版本时必须对照实际 schema，不能仅按版本号合并。旧日志不覆盖，当前版本 successor 由所属 fixture 工具生成。

前次 0.1.5 维护见[2026-09-09 报告](../archive/tasks/2026-09-09-upstream-rebase/final-report.md)，rc.1 过程见[2026-09-04 任务](../archive/tasks/2026-09-04-upstream-rebase/final-report.md)，更早迁移见[旧记录](../archive/legacy-notes/README.md)。旧测试数量只对当次任务成立。两仓 `pre-upstream-baseline-20260909`、`post-upstream-baseline-20260910`、`repair-merged-baseline-20260915` 等恢复记录不删除。
