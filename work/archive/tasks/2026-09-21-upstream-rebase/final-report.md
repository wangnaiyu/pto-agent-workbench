# harness 0.1.6-alpha.2 升级报告

2026-09-21，按本任务明确授权将 fork master 从 `70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb` 更新至 `a11460d434e652fde77d35e7558056a59cb3256f`，固定 upstream 为 `ddefc45fbc7f8e46dd73185e68295696d1297887`（dsh-v0.1.6-alpha.2）。上游区间增加882个提交、涉及2548个文件。30个fork提交全部重放，无丢弃；新增1个兼容收尾提交。

## 行为与兼容

保留 PTO 品牌、Run Records、Viewer与分析receipt、实验能力、官方Skill固定来源和 Session V4。客户端适配 SessionReference/SessionBinding、conversation.content factory 和 Workspace tree；目录选择仍仅生成浏览器草稿，首次发送等待正式引用与有序准备，异步完成不清空后来的草稿。

上游的新 plugin_manager、Office和插件目录进入正式装配；退役的 cordis_define/cordis_run 不再恢复。当前V4 fixtures按新V3来源生成successor；旧代保留，历史corpus预算未放宽。文档与生成catalog按当前官方生成器同步。未新增针对上游src-loader问题的全局内核补丁。

## 验证

- 锁定安装、官方完整构建、正常pre-commit及pre-push类型hook通过。
- GUI全量6302 passed / 1 skipped；最终草稿与preset定向57 passed；PTO/query/migration/navigation 901 passed。
- 离线lib回放166 passed / 2 skipped；迁移worker通过；历史corpus单测590 passed。
- 浏览器完整矩阵430 passed / 15 skipped，另串行源码HMR 1 passed。没有新增skip或放宽失败断言。
- doc-sync 41通过；hygiene首轮15/16，fork包版本统一后constraints通过；lint通过。
- 外层17项测试通过。实际外层patch唯一官方provider、PTO品牌和Run Records界面检查通过，pageerror为0；测试隔离DSH_HOME，不触及真实会话，也不发送模型请求。

详细命令、初始失败、修复和环境见[验证账本](evidence/validation.md)，提交对应见[重放审计](evidence/replay-audit.md)。原工作目录同步后发现9个已删除包的ignored构建残留；预览并确认无tracked/普通untracked内容后，仅清理这9处，再检查和重建。

## 安全更新与配对

推送前重新fetch确认origin/master仍为旧OID，upstream仍为固定目标。先正常推送远端恢复分支 `codex/pre-upstream-master-20260921` 及候选 `codex/upstream-rebase-20260921`，随后以 `--force-with-lease=refs/heads/master:70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb` 更新fork master。两次pre-push类型hook均通过，远端master与候选一致。原checkout以reset --keep同步，无用户改动被覆盖。

正式配对名称为两仓 `post-upstream-baseline-20260921` annotated tag。两份tag保存相同JSON，包含外层收口提交、harness提交、固定upstream SHA、验证与报告路径；外层SHA以tag为准，避免文档自引用提交哈希。旧tags和恢复分支继续保留。本次没有推送官方upstream，也没有发布产品或清理旧恢复点。

CI最终状态与两仓远端核验记录见配对tag和[安全更新证据](evidence/safe-update.md)。

## 限制和后续边界

固定upstream原树独立复现默认src/tsx工具回放的 `prepare` 未定义；lib完整回放和浏览器HMR通过。该问题已进入[维护清单](../../../docs/maintenance-backlog.md)，没有伪称已修复。没有验证真实模型API调用、跨平台完整PR矩阵、Electron原生窗口或真实用户V4数据降级。

稳定结论已回写[架构](../../../docs/architecture.md)、[上游维护](../../../docs/upstream-rebase.md)及[踩坑](../../../docs/pitfalls.md)。本任务为源码维护与基线收口；新的产品设计、源码loader修复、真实数据迁移与发行另立范围。
