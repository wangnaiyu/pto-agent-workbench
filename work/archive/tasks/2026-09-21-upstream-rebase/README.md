# harness upstream rebase 与两仓配对

目标：固定并审计 upstream 最新 master，将 fork 差异重放、修复兼容、完成验证，安全更新 fork master 并记录两仓配对。

授权：用户于 2026-09-21 明确要求规划并完成 upstream rebase、兼容性验证、fork master 安全更新及新两仓配对。涵盖必要候选/恢复分支、兼容修复提交、精确 lease 推送和基线 tags、外层维护记录提交与同步；不包含上游写入、产品发行、旧恢复点清理或真实用户数据迁移。

执行者：当前 Codex，单 writer。先读外层 AGENTS、项目 Skill，再读本包 status、plan；进入 harness 遵循其适用指令。

关联：[上游维护](../../../docs/upstream-rebase.md)、[架构](../../../docs/architecture.md)。
