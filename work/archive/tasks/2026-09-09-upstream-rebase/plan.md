# 实施计划

1. R0 恢复核对与固定目标：两仓/origin/savepoints/锁状态可靠，fetch upstream，固定 SHA 与版本，审计分叉和共享修改区。
2. R1 隔离 rebase：保留 master，在独立 worktree/branch 重放；逐项记录语义冲突与 old→new mapping，range-diff 审计不丢有效 PTO intent。
3. R2 harness 验证与兼容适配：按新 AGENTS 运行聚焦/相邻测试、build/typecheck/docs/hygiene/lint；分类旧问题、上游问题、新回归，禁止带实质新失败更新 master。
4. R3 完整工作台组合：隔离实例验证 pinned resources、装配、Profile/Viewer/Skill/Host，并重新观察首发和布局；必要外层 compatibility changes 走 PR 合并。
5. R4 安全更新：复核恢复点与远端旧 SHA，保存候选和审计证据；精确 force-with-lease 更新 fork master，同步本地并验证固定 upstream 是祖先。
6. R5 三元基线与收尾：保存 workbench/harness/upstream 完整 SHA、检查、冲突和映射，报告并归档；保留升级前恢复点，停止不执行 repair。

每项开始/完成落盘 checkpoint；长时间命令记录可查询标识与日志，不能把部分检查当完整验收。
