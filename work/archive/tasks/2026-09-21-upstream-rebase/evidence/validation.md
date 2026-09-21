# 升级验证账本

环境：macOS arm64，Node 24.14.1，pnpm 11.7.0，Chromium。Python 使用 Codex bundled runtime（上游要求 >=3.10；系统 3.9 不适用）。验证在隔离候选 checkout 中执行，真实工作台 patch 使用独立 DSH_HOME，不触及用户真实会话。

| 检查 | 本次结果 |
| --- | --- |
| pnpm install --frozen-lockfile | 323 workspaces，成功；无 lockfile 变更 |
| pnpm run build | 官方完整构建成功，254 client artifacts |
| GUI 全量 | 449 files，6302 passed / 1 skipped |
| 最终 draft/preset/lifecycle 定向 | 3 files，57 passed |
| PTO / query / migration / navigation | 30 files，901 passed |
| 历史 corpus 与 replay 单测 | 2 files，590 passed |
| DSH_EXAMPLE_MODE=lib DSH_SNAPSHOT=replay pnpm run test:snapshot | 7 files，166 passed / 2 skipped |
| built-migration-worker.e2e.ts | 1 passed |
| pnpm run doc-sync | 41 passed / 0 failed |
| hygiene | 首轮15/16；9个fork包版本统一alpha.2后constraints补验通过 |
| 外层 node --test work/scripts/*.test.mjs | 17 passed |
| 外层 check-official-provider.mjs + 候选 harness | 恰好一个固定版本官方provider；无missing-entry警告 |

最终浏览器矩阵 `test:web:ci`：先串行 HMR 1 passed，再并发4 workers，120 files passed / 1 skipped，430 tests passed / 15 skipped；总计431 passed。跳过项为原有条件（真实凭据/平台），未新增skip。最终 lint 通过。两次正常push类型hook通过，4个push workflow全部success；范围见safe-update.md。未验证真实模型付费调用、Windows/Linux 或 Electron 原生桌面。

## 发现与修正

- 新 SessionReference/SessionBinding 生命周期下保留 PTO 草稿；first-send 等 reference.ready，异步准备完成后再次核验 revision，避免清空较新的草稿。preset coalescer 修正共享对象判定；attachment teardown 使用 binding.sessionId。
- 上游新 Workspace tree 保留；目录选择仍不创建空 Session，已有历史显式 seed。折叠后的行名含计数，选择器锚定项目行；祖先高亮、排序、折叠持久化实测。
- /permission 完成前不能继续写下一条提示；多行工作流 prompt 使用原生 insertText，一次发送并核验全文。预期只新增显式本地命令行。
- 新 plugin-manager/office 组合更新 V4 successors；新增 V3场景通过既有 prepareSessionSnapshotFixtureForComparison 生成 V4，证明旧输入未改变。23项新上游改变过的源fixture重新生成后代。
- retired-tools 的当前后代标为 V4。empty-response-retry 的冗余 V0历史样本提升为已有当前writer产物；保留旧session.jsonl，历史预算仍10，没有放宽上限。
- 修复双语配对和生成目录。历史格式文档的冻结源码标签从实时路径门禁中排除，仍接受 schema 与文档链接检查，避免为已移动的 tool-present 篡改历史 schema。

## 上游源码模式问题

默认 src/tsx 回放出现工具调度 `Cannot read properties of undefined (reading 'prepare')`。在固定 upstream ddefc45 的独立干净 worktree，安装锁定依赖并构建 Host/native 后，用同一 fs-read 场景复现。候选与固定 upstream 的 packages/core/tools/src 和 packages/core/agent-loop/src 无差异。本次未修改这些内核实现。

CI 所用 lib 构建产物模式完整166项通过；该源码模式问题单独登记，不把它记成通过，也不跳过失败用例来伪装全绿。

实际外层 patch：独立 DSH_HOME，明确无效测试键，仅绕过凭据引导，不发送模型请求。PTO品牌、Run Records切换、0 pageerror通过，见 runtime-smoke.txt / runtime-smoke.png。临时实例已停止。

原checkout清理9处上游已删除包的ignored产物后，constraints、完整build、外层17测试和provider再次通过。正式启动目录与发布master一致。
