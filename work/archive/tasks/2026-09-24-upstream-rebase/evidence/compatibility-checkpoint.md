# 兼容性 checkpoint（未完成）

候选 worktree：`/private/tmp/pto-harness-upstream-20260924`；分支 `codex/upstream-rebase-20260924`。主 harness master 仍在原基线，无任何推送。

- 31项 rebase 完成；候选 HEAD 后有未提交适配。
- pnpm 依赖安装成功。完整 build 尚未通过；最近 Client 编译剩测试 create response 的 cwd 类型，已修正待复验。
- preset registry 从旧 standing 访问迁移到 acquireScope lease + serviceForScope；冷 catalog await using 归还租约。已运行的 registry/composer/executor 共63项通过。
- shell.run 改 execute().result()；私有预处理消息来源改当前支持的 user；UI 图标、Client tsconfig face、RunningToolCall preparing/start 分支适配。
- 当前候选 writer V5。默认链 official V4→V5；JSONL config legacyPtoV4=true 显式选择 pre-upgrade PTO V4(V3 body)→V5，复用冻结的 upstream V3→V4 转换，不猜测事件内容。实际 outer patch 尚未接线。旧文件不覆盖，发布走既有原子 successor 机制。
- 旧 fork192份V4测试文件按原 master恢复字节；上游V4样本从固定 upstream读取，临时材料在候选 `.artifacts/pto-v4-sources/`。新增V5样本还必须经过所属 owner原生回放/归一化验证，不能仅把转换成功当通过。
- V3→V4与V5 owning测试386项第二轮384通过，剩2项为当前版本期望/后继generation拒绝语义，已修正待复验。

运行记录（exec session 仅本对话有效）：

- tsc：session44105，日志 `/tmp/pto-20260924-tsc-7.log`，2项cwd类型错误，已修正。
- 格式/JSONL/PTO聚焦验证：session92037，`/tmp/pto-20260924-compat-1.log`，结果待核对。
- 样本转换：session26886，`/tmp/pto-20260924-fixture-upgrade-3.log`，结果待核对。

后续必须完成：真实Loader装配、GUI/浏览器smoke、外层patch验证、持久化类型历史/双语文档及包门禁、range-diff审计；再按精确lease执行已授权master安全更新和配对tags。当前不能宣称升级完成。

## P1 完成 / P2 最终验证开始

- 候选目录 `/private/tmp/pto-harness-upstream-20260924`；主 checkout 与远端 master 保持原 SHA。
- 完整构建 `/tmp/pto-20260924-build-final.log` 成功；最新 Host、Client、CLI、worker、Web 产物齐全。
- `/tmp/pto-20260924-compat-3.log`：179 passed、1 skipped；`workspace-browser-4.log`：178 passed。
- SDK refresh 22 passed；headless/ACP refresh 原 144 passed/2 skipped/1 Python 版本失败，改用 bundled Python 后对应场景复验成功；SDK tool-error 当前 V5 期望已由 owner refresh。
- `/tmp/pto-20260924-final-scripts.log`：CLI/布局/预设 3 文件通过；CI runner-expression 测试的上下文需补齐，复验中。
- V4 旧历史样本保持原件，新增 V5；保留一项官方 V4 adjacent-migration 用例。语义转换由显式 lineage 所有者验证，layout gate 仅校验共享物理 framing。
- 真实浏览器的 startup/draft/first-send 与 folding/scroll 验证进行中；未访问用户 Session 根目录。
