# 本轮检查

日期：2026-09-09；harness 保存提交 e95e118b26761c20381f278b8d98c15ee56fc886；工作台初始保存提交 563ec644372442ae670ec8ee5218fecd30ae429a。

## 通过

- `node work/scripts/check-workspace.mjs`：86 Markdown、11 originals、48 sections，0 errors（最终文件数随记录增加）。
- 两仓 `git diff --check`；工作台正常 pre-commit secret check；harness 正常 pre-commit 的双语、staged lint、第三方 notice、空白与 vendor guard。
- harness `pnpm exec vitest run`：inspection、tool-pto-run、skill、tool-skill、pto-viewer、rows、workspace-browser、apply-inject、app-frame 九个文件，223/223。
- 另跑上述 lint 涉及的 4 个相邻测试文件：20/20 通过；已有 lint 诊断不等于这些行为测试失败。
- harness `pnpm run build`：完整构建通过；后续仅补充注释、文档、生成目录及格式。
- harness `pnpm run doc-sync`：最终 32 passed、0 failed、0 skipped（含文档站构建、doc-typecheck、生成 freshness、双语和 README 检查）。
- harness `pnpm run hygiene`：最终 16 passed、0 failed、0 skipped（含 package invariants、NodeNext、runtime closure、Cordis 配置与依赖检查）。
- release-lock 全部 3 个 Skill 闭包文件以及工具、LICENSE 的 SHA-256 匹配；初始两仓文件清单中所有应保留文件均存在于保存提交。

## 已修复的交付缺项

ignored `lib/dfx/capture.md` 精确纳入 Git；release-lock 证据路径随归档修正。补齐新 Host README 目录、已知问题、invariant 省略理由，API JSDoc、服务分类和生成目录/双语配对。pre-commit 修正 arrow 参数括号；手工拆分过长 import-list 行。均不实施 Viewer/首发/布局修复。

## 已存在且保留的 lint 失败

`pnpm run lint` 首轮另报 2 个本次提交的格式错误，已修复；最终 `pnpm run lint:contracts-ready` 仅剩 8 个 `typescript(no-misused-spread)` 错误，位于未修改的 4 个测试文件：

- ui-conversation/tests/apply-wiring.client.spec.tsx:17
- ui-conversation/tests/assembly-surfaces.client.spec.tsx:63、85、112、177
- ui-tool/tests/assembly-surfaces.client.spec.tsx:82
- ui-tool/tests/toolview-slot.client.spec.tsx:68、213

在 origin/master 8a0cfdf8a8 的独立 detached worktree 复核，同一 8 个诊断全部复现。复核使用现有 node_modules，不安装依赖；隔离 worktree 另有 5 个未构建类型解析诊断，不将该次运行描述成完全等价的全量 lint。上述 4 文件在当前变更中没有修改。未降低 lint 规则或跳过 Git hooks。

## 不作成功声明的范围

Viewer 到首次发送的完整浏览器组合仍有结构化身份/receipt 丢失回归；新 launch/同 Session 重试和实验 View 宽度留待独立 repair。本阶段未运行真实模型分析、完整 coverage、设备执行，也未新增完整 first-send recorded-session 场景。历史 MVP 浏览器记录不是本轮通过证据。

普通 sandbox 下 tsx IPC 和 GitHub 网络被拒后，按规则提升权限运行原检查。完整日志在任务 scratch；本文件保存可恢复结论，PR/CI 结果另见状态和完成报告。
