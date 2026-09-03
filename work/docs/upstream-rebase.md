# harness 上游维护

本流程仅在用户授权更新上游时执行。接手普通开发任务不自动 fetch/rebase，治理文档更不需要改变 fork。

## 更新前

读取适用 Agent 指令、[规则](rules.md) 和 [踩坑](pitfalls.md)。分别记录外层与 harness 的 HEAD、分支、工作树状态；确认实际远端/目标版本，不沿用历史命令中的固定分支。存在他人未提交内容先协调，不能 reset/checkout 覆盖。

明确保存点、回退方案、插件差异和预计构建面。建立本次有界任务包；旧备份是否删除另行确认。

## 更新与验证

1. 在 harness 内按批准范围 fetch 并核对目标 commit、release/package 变化。
2. 按实际分支关系选择 rebase 或 merge，先检查冲突，再逐项处理。禁止以“采用上游”为由丢弃 PTO 的已确认行为。
3. 对照 slot、session handle、tool result、provider 与 manifest/bundle 契约检查消费者。
4. 执行受影响测试；依赖/装配发生变化时运行官方完整构建，并用隔离实例验证核心界面。记录命令、版本、失败及已知基线问题。
5. 回写当前架构/踩坑及任务验证证据；区分历史已通过、本次通过和未验证。

是否提交、推送，以及需要改写远端历史时的处理，均按用户的具体授权执行；本流程不提供默认 force push。发布也不是维护任务的隐含后续动作。

## 已知版本记录

当前治理起点为 alpha.5，精确 HEAD 见 [架构](architecture.md)。rc.8、alpha.1 到 alpha.5 的迁移过程已进入 [旧记录归档](../archive/legacy-notes/README.md)。其中的临时路径和测试数量仅对当次任务成立。
