# 修复合并配对记录

harness [PR #7](https://github.com/wangnaiyu/deepseek-harness/pull/7) 已于 2026-09-15T06:16:45Z 以 merge commit 合并至 wangnaiyu/deepseek-harness:master。

- harness 最终 master：`163e8ddd21f6b3e5ad82de0fb3c0cfcede3fcf7b`。
- 已验证候选：`368c446657932f170a6d29fd2d275bea1c76073e`；merge commit tree 与候选完全一致，P2/P3/P4 原 SHA 均为其祖先。
- 保留 upstream 固定基线：`5dda764ed3aa172535a7967b06ff95d9cbfe536a`。
- 工作台已验证产品基线：`452e631c880082d832eb36f386fc6439df233be3`；本维护阶段仅文档变化，产品 patch 未变。
- 工作台 [PR #12](https://github.com/wangnaiyu/pto-agent-workbench/pull/12) 在 harness 合并后记录本配对，再完成 merge commit。最终工作台主分支 SHA 与完整配对在收尾 annotated tag `repair-merged-baseline-20260915` 保存；未生成前不得当作已完成。

实际 CI：49 success / 2 已归因非必需 fork 配置 failure；canonical-only 不计真实验证。详见 [验证](validation.md) 和 [harness 合并证据](evidence/harness-merged.json)。
