# harness upstream rebase 与工作台兼容性

目标：固定最新 upstream master，隔离重放有效 fork 提交，审计 old→new 映射，验证 harness 与完整工作台组合，再用精确 lease 更新 fork master 并保存新的三元基线。

授权：2026-09-09 用户明确要求完成上述阶段，允许 upstream fetch、rebase、必要兼容修改、提交/PR/合并以及满足验证和远端 lease 条件后的 fork master 安全更新。只使用明确 ref 与实时旧 SHA 的 force-with-lease；远端移动即停止。既有项目规则不要求在当前明确授权之外重复确认；若自动审核拒绝或出现新权限范围，则停在最小必要节点。

非目标：不实施 artifact-analysis-launch-repair；只重新取证已知问题，不混入 first-send/launch/retry/width 修复。不删除旧恢复点，不修改只读来源，不部署。

执行者：当前 Agent；外层与隔离 harness checkout 单 writer。恢复先读外层 AGENTS、项目 Skill、本包 [status](status.md) 和 [plan](plan.md)，再读隔离 checkout 的最新 AGENTS。上一阶段见 [报告](../../../archive/tasks/2026-09-09-pre-upstream-baseline/final-report.md)。
