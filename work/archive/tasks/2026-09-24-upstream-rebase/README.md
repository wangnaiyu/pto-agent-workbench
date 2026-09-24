# harness upstream rebase 与两仓基线

目标：固定本次 upstream，重放 fork、验证兼容、安全更新 fork master，并保存新的两仓配对基线。

授权：2026-09-24 用户明确要求规划并完成上述操作；包含必要兼容修复、提交、fork master 精确 lease 推送和两仓配对记录。不上推官方 upstream，不发布产品，不删除既有恢复点，不操作真实用户会话。执行者为当前 Codex，单 writer。

读取顺序：外层 AGENTS、项目 Skill、status、plan、证据。遵守 [上游维护](../../../docs/upstream-rebase.md)。
