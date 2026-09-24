# 固定上游审计

固定目标 46a7f68b0922371ce7144b668b90e377d8e799f4（0.1.7-rc.1）；旧 upstream ddefc45fbc7f8e46dd73185e68295696d1297887。上游增加1617 commits、5142 files；fork 31 commits。两仓远端与本地起点相等。

恢复点：harness 本地 codex/pre-upstream-master-20260924 = a11460d434e652fde77d35e7558056a59cb3256f。候选 checkout /private/tmp/pto-harness-upstream-20260924，分支 codex/upstream-rebase-20260924。主 checkout 与 master 保持原基线直至验证完成。

重点：upstream V4 含 tool-role 格式转换，fork 原 V4 是 V3 正文恒等扩展，不能按数字合并；需明确兼容方案。另检查 session reference、conversation slots、tool results、provider/manifest，以及 workspace dependency ranges（DSH workspace:*，vendor/native workspace:~）。

回退：更新前候选可保留并回到旧 master；更新后若需回退源码，使用保存分支并重新核验远端精确 lease。源码回退不意味着新会话可降级，禁止覆盖旧日志代。
