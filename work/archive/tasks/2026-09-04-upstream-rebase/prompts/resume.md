# 恢复此任务

从 pto-agent-workbench 外层仓库进入，先读根 AGENTS、项目工作流 Skill，再读本包 README、status、plan、上游维护流程与 harness 根 AGENTS。核对外层和 harness 的真实 HEAD、工作树、保存分支、远端引用及任何进行中的 rebase，不以记录替代现场状态。

只从 status 所列未完成阶段继续。保留用户和工作台改动；禁止 reset 或 raw `--force`。更新 fork 前确认 `origin/master` 未从已记录的 lease 值移动，只使用 `--force-with-lease`。外层记录的提交、推送和产品发布不在本任务授权内。
