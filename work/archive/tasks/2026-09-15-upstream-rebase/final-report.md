# harness 0.1.6 升级与配对记录

## 结果

harness fork 已从固定 upstream 0.1.5 升级至 `0d1f50007f9bca3f52b06e1c3074fa14d5fb0720`（0.1.6-alpha.1），纳入 1088 个上游提交。28 个 fork 非 merge 提交全部重放；兼容修复后 `master` 为 `70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb`。

远端 master 使用旧 SHA 的精确 lease 原子更新，正常 pre-commit 和 pre-push 类型检查通过。旧 master 恢复分支、候选分支、V3 source tags 均保存，远端 ref 与最终候选相同。原 checkout 使用 `reset --keep` 更新后，锁定安装、完整构建及官方 provider 装配检查通过且工作树干净。

正式新配对为两仓 `post-upstream-baseline-20260915` annotated tag，完整三元 SHA 与恢复方法见[配对记录](paired-baseline.md)。外层产品资源未改写，只有候选 harness 路径装配检查与维护文档更新。

## 主要兼容修复

- 将 PTO 草稿/欢迎区迁到新版 ConversationContent，保留首发才创建 Session、Run Records 和 Ungrouped 行为。
- 对接新版权限 slot、命令身份/本地化、正式目录与附件/Remote 合同；补齐规范 Skill 发送后引用与源文件预览。
- 依据上游持久化历史门禁冻结 V3 schema，新增 V4 相邻迁移与 successor fixtures，保留前代字节和历史策略。
- 更新 SSH/文件系统/子进程消费者与 fork CI guard，修复 HMR 声明别名，以及 Escape 后同选区发布重开菜单的问题。

## 验证

完整构建、lint、doc-sync 41/41、hygiene 分项复验通过；GUI 全量 5700 passed/1 skipped，V4 核心 503 passed，SDK/ACP/headless replay 149 passed/2 skipped。浏览器首轮发现的全部失败均经修复复验；最终统一 replay 32 文件/114 项通过后，最后 Escape 及相邻场景 3 文件/23 项通过，HMR 单独通过。不能把首轮完整 Web 报告说成全量通过。

隔离实际工作台中，Viewer 598 nodes/1222 edges，官方 `reduced` 与 `reduced_dataflow` 各移除 1 条冗余边；输入 hash 不变、首发一个 Session、Skill/tool receipt 对齐。模型端为本地确定性协议替身，实际工具执行为真实代码。详见[验证与限制](validation.md)及 [receipt](evidence/runtime-verification.json)。

## 保留问题

- domain graph 的 25 项失败在固定 upstream 原树逐行相同；本次没有降低门禁，记录为上游已知问题。
- fork Session V4 与未来 upstream 同整数版本需要比对 schema 后设计迁移；不支持数据降级。
- 父目录记录根下 `dfx_outputs/deps.json` 的 action 引用限制与旧 fork 相同；支持的 `dfx_outputs` 根已验证。
- 远端 4 个 push workflow 全部成功，见 [查询快照](evidence/ci-postpush.json)及远端链接；主 `ci.yml` 只由 pull_request 触发，此次直接更新 master 未运行该矩阵。没有另行触发发布或真实 API 验证。

正式维护入口已更新：[架构](../../../docs/architecture.md)、[上游维护](../../../docs/upstream-rebase.md)、[踩坑](../../../docs/pitfalls.md)。
