# harness 上游 rebase（2026-09-04）

目标：把 fork 的 `master` rebase 到本次确认的 `upstream/master`，保留 PTO 工作台已有提交与行为，并完成与风险相称的验证和可恢复记录。

## 范围与授权

用户已授权检查并执行本次 harness 上游 rebase。范围包括 fetch、建立本地保存分支、rebase、冲突与兼容性处理、必要测试，以及将重写后的 `master` 以 `--force-with-lease` 更新到 fork；不含产品发布、删除旧备份分支或无关功能开发。rebase 执行时外层研发记录仅获更新授权；随后用户另行授权将已归档记录提交、推送，通过 PR 合并并清理任务分支。

## 接手

从外层根 [AGENTS](../../../../AGENTS.md) 开始，然后读项目工作流 Skill、本包 [status](status.md)、[plan](plan.md)、[上游维护流程](../../../docs/upstream-rebase.md) 和 harness 根 `AGENTS.md`。

开始基线：外层 `main` 为 `d90b8cc8177df6e046a5c10fd3add3a65a808ca2` 且干净；harness `master` 为 `489f3f65b1`，与 `origin/master` 一致且工作树干净。目标上游提交需 fetch 后记录，不能沿用历史版本号。
