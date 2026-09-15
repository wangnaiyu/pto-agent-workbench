# 2026-09-15 升级配对基线

两仓同名 annotated tag：`post-upstream-baseline-20260915`。tag message 使用同一 JSON，包含最终工作台提交、harness 提交、固定 upstream、旧恢复点、验证报告路径和 CI 查询快照。最终工作台 SHA 由提交后写入 tag，避免在提交内容中自引用。

- harness `master`：`70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb`。
- fixed upstream：`0d1f50007f9bca3f52b06e1c3074fa14d5fb0720`（0.1.6-alpha.1）。
- 工作台升级前 `main`：`8f8ff6131c3887caba07db728d3f9a3a504fc3a6`；最终 `main` 为本报告所在配对 tag 的 peeled commit。
- harness 升级前 `master`：`163e8ddd21f6b3e5ad82de0fb3c0cfcede3fcf7b`；已保存为本地及远端 `codex/pre-upstream-master-20260915`。
- 远端候选：`codex/upstream-rebase-20260915`，与最终 master 相同。
- V3 冻结源：`198b703def3a092a2771c8ed6489b044c0e07ba4`，两个 source tags `pto-v3-integration-checkpoint-20260915`、`dsh-pto-v3-integration-checkpoint-20260915` 已保存；它们不是正式验收基线。

## 验证与恢复

[验证报告](validation.md) 明确区分本机、真实工具/模拟模型、历史 corpus 与远端 CI。两仓基线标签只表示这组已记录的源码和验证结果，不表示未执行的平台矩阵或真实模型 API 已通过。

查验时在两仓分别读取 `git show post-upstream-baseline-20260915` 和 `git rev-parse post-upstream-baseline-20260915^{commit}`，对照相同 JSON。旧配对 tags 与恢复分支全部保留。

需要回退代码时，从旧配对或恢复分支建立独立 checkout，先核验工作树和新版数据。V4 数据没有降级支持；不得把旧代码直接指向已迁移 V4 的用户数据目录。再次改写 master 要重新观察当前远端 SHA 并使用精确 lease；本记录不是未来回退授权。
