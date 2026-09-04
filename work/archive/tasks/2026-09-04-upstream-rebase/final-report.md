# 完成报告

## 结果

harness fork 的 `master` 已从 `489f3f65b1e0218e4f59834e40c422dec1196f9c` rebase 到上游 `76fda729799fe9b3848dbe2c211d4b231032b81e`（`0.1.2-rc.1`），并以精确 force-with-lease 更新到 `8a0cfdf8a8ed79e5c304be287440ebb1b001a878`。推送后重新 fetch，local `master` 与 `origin/master` 一致，且相对 `upstream/master` 为 `0 behind / 24 ahead`。

旧 fork 历史保存在本地分支 `codex/pre-rebase-master-20260904`。`range-diff` 显示原 23 个 fork 提交全部有对应重放项，没有丢弃或跳过；第 24 个提交是本次 rc.1 兼容适配。

## 兼容处理

- 唯一 rebase 冲突位于 `.github/workflows/issue-policy.yml`。解决后同时保留 fork 非 canonical 仓库 no-op 和上游仅真人 PR 获取 Project read token/执行校验的条件，并同步 CI 测试。
- 7 个 PTO 自有包版本对齐 `0.1.2-rc.1`；按 rc.1 门禁移除没有有效运行时断言的空 invariant companion 及其 export、构建入口、类型别名和依赖，在双语 README 记录不发布原因。
- 更新 ApprovalService 测试 fake 的 Session 顺序读取契约；对齐上游视觉规则和 Workspace 测试的可访问名称定位；重新生成 Client slot catalog 和 lockfile。
- 精确清理两个由旧构建产物形成的 ignored “幽灵包”目录，没有清理其他 ignored 或未跟踪内容。

## 验证证据

- `pnpm install --frozen-lockfile`：通过，供应链策略通过。
- rebase 审计：原 23 个提交在 `range-diff` 中一一对应；最终 `upstream/master...master` 为 `0 24`。
- 服务端受影响范围：67 files / 1058 tests 初跑仅 ApprovalService fake 的 6 项失败；适配后该文件 7 tests 通过。最终 7 个工作台包聚焦测试 14 files / 60 tests 全部通过。
- Client GUI：全量初跑 295 files 通过、3 files 失败；修复样式门禁和重复 treeitem 定位后，3 个失败文件定向复跑 12 tests 全部通过。没有把定向复跑记成一次新的全量 clean run。
- `pnpm run build`：完整 Host、Client 与 Web production build 通过。
- `pnpm run doc-sync`：32 项通过。
- `pnpm run hygiene`：提交态 16/16 通过。
- pre-commit：翻译配对、lint、第三方声明、空白与 vendor guard 通过。
- pre-push：完整 Host build 和 Host/Client contract typecheck 通过。

完整 `DSH_SNAPSHOT=replay pnpm run test:web` 的构建阶段通过；浏览器阶段 80 files / 294 tests 通过，11 files / 13 tests 失败，另有 1 file / 18 tests 跳过。失败集中于 fork 已确认的“首次 prompt 才创建 Session”行为与上游空 Session 断言不一致，以及 fork 增加 Cordis UI 后 assembled fixture 缺少相应 RPC；定向重跑仍可复现，因此没有修改产品行为去迎合相反断言，也没有把该套件标为通过。

## 远端结果

- GitHub Actions 全部成功：[Sandbox](https://github.com/wangnaiyu/deepseek-harness/actions/runs/33829490849)、[Landlock Run](https://github.com/wangnaiyu/deepseek-harness/actions/runs/33829490867)、[Release (dsh)](https://github.com/wangnaiyu/deepseek-harness/actions/runs/33829490998)、[Release (vendor)](https://github.com/wangnaiyu/deepseek-harness/actions/runs/33829490869)。
- Release (dsh) 仅有 GitHub 对部分 action 仍声明 Node.js 20 的非阻断弃用提示；runner 已强制用 Node.js 24，工作流结论仍为 success。
- 本次没有发布产品，也没有删除旧备份分支。
- 外层 `work` 记录在 rebase 完成后获得独立授权，以单独 PR 提交并合并；该操作不属于 harness 产品发布。

## 正式记录

当前基线已回写 [架构](../../../docs/architecture.md)，rebase 和精确 lease 规则已回写 [上游维护](../../../docs/upstream-rebase.md)，rc.1 新门禁经验已回写 [踩坑](../../../docs/pitfalls.md)。
