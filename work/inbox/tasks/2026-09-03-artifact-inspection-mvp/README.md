# 产物查看与官方 Skill 分析 MVP

目标：用户添加已有数据后能打开受支持可视化，并用固定版本官方 Skill 在关联 Session 中完成有证据的分析。方案已确认；本任务包作为治理交付创建，产品实现尚未开始。

## 范围与授权

范围为 P0 适配验证、P1 打开骨架、P2 依赖分析闭环、P3 覆盖扩展、P4 关联增强。按阶段验收，不将所有可视化天然可用作为前提。不含设备重跑/源码优化、发布、上游自动更新或产品 Skills 更新 UI。

执行者：待启动时指定。当前仅授权本任务包建档；开始产品实现前由用户明确启动范围。创建 planned 包不是执行指令。

## 接手

从根 AGENTS 开始，然后读 [status](status.md)、[plan](plan.md)、[主题](../../../product/artifact-inspection/overview.md)、[官方接入](../../../product/official-skill-integration/overview.md) 与 [输入区](../../../product/conversation-composer/overview.md)。恢复提示见 [resume](prompts/resume.md)。

设计落盘基线：外层 d90b8cc8177df6e046a5c10fd3add3a65a808ca2 之上的治理未提交变更；harness 489f3f65b1e0218e4f59834e40c422dec1196f9c（alpha.5）。执行时重新核对两工作树，不能以本记录覆盖实际状态。
