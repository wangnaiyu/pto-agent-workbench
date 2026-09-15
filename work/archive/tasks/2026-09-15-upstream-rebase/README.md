# harness upstream rebase 与两仓基线

目标：固定最新 upstream，重放 harness fork，验证工作台兼容性，安全更新 fork master 并记录两仓配对。

授权：用户于 2026-09-15 明确要求规划并完成 upstream rebase、兼容性验证、fork master 安全更新和新两仓配对。包含实现该目标所需的保存点、兼容修复、提交和受保护推送；不包含 upstream 写入、产品发布或删除既有恢复点。

执行者：当前 Codex，单 writer。PyPTOUX 只读。读取顺序：外层 AGENTS、项目 Skill、README、status、plan；进入 harness 后读取其适用指令。

参考：[上游维护](../../../docs/upstream-rebase.md)、[上次修复配对](../../../archive/tasks/2026-09-15-repair-merge-closeout/paired-baseline.md)。
