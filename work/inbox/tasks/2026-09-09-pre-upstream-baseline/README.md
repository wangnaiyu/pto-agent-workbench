# 两仓升级前基线收口

目标：保存工作台与 harness 现有成果，分别提交、推送、创建并合并 PR，形成可恢复的升级前配对基线。

授权：2026-09-09 用户明确授权本阶段两仓收口、必要检查、origin 推送、PR 创建与合并及已合并普通分支清理。禁止 upstream fetch/rebase、force push、改写 master 历史、启动分析修复任务或无关修复。

执行者：当前 Agent，两个 checkout 单 writer。入口见 [项目工作流](../../../docs/task-workflow.md)；读取 [status](status.md)、[plan](plan.md)。修复任务保持 planned。
