# P1 结果：正式 official provider 装配

P1 完成；仅修正工作台正式 provider composition，P2–P5 未实施。状态与下一步以 [status](status.md) 为准。

## 保存与范围

先将已有 P0 的 65 个文档/精选证据文件独立保存为 `642632176df9f1131e9c41cbffc33c3b414184ff`（`codex/repair-p0-20260911`）。随后在独立分支 `codex/repair-p1-official-provider-20260911` 实施本阶段。

唯一产品修改是 `patches/cordis.patch.yml`：将 nonexistent-entry id override 改为顶层 insert。实际 Loader 原先报告 entry not found 并跳过；现在正式 web profile 恰有一个启用的 `pypto-official-af1d7a016ce5` provider。固定 Skill release/root、`includeDefaultRoots: false`、`watch: false`、inspector Skill/tool tuple 全部保持原值。新增外层装配检查及必要状态文档；harness、receipt schema、Viewer/launch/retry/layout、官方资源 literal 均未修改。

两仓主分支未推进：workbench main/origin/main `bc3eecff7f3d770527ef7c1dfa4ccbf16d7c09d9`；harness master/origin/master `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807`。本次不 push/PR/合并，不删除旧分支、tag 或恢复点。

## 实际验证

- 真实 built CLI `web --dump-config`：先在原 patch 上因 provider count 0 失败，修正后 count 1 且无 missing-entry warning。未用只查 YAML 文本的断言替代 Loader 组合。
- `node --test work/scripts/official-provider-composition.test.mjs work/scripts/launch-contract.test.mjs`：8/8。缺 provider、旧错误 override、重复 provider 三个负向组合均被正确拒绝。
- 实际隔离工作台，只有正式 patch 与 observer/目录选择器测试 overlay，**无临时 provider patch**：新会话草稿菜单出现 dependency-redundancy；root/draft snapshot 与 Session qualified lookup 均指向固定 release 的同一 resourceBase。
- Viewer→Analyze with AI→首次发送：Host 生成完整 receipt，持久 Session 的 receipt 与工具回执完全一致；固定 provider 的 Skill source 仅一次，注入正文包含官方原文。实际 `pto_dependency_redundancy` 调用锁定 Python，两模式都从 1222 边移除同一条 `(1, 1) -> (3, 287)`，1221 保留，无 stderr/cycle fallback。输入 SHA-256 未变。17 条证据断言通过。
- harness `pnpm exec vitest run` 对 `pto-artifact-inspection/inspection.spec.ts`、`skill-filesystem/skill-filesystem.spec.ts`、`skill/skill.spec.ts`、`tool-skill/tool-skill.spec.ts`：4 文件 99/99 通过。
- 外层结构、秘密扫描、diff whitespace 检查见 [quality](evidence/p1/quality.txt)。此次为外层 config/doc/check 改动，未修改 harness 包/类型/构建产物，使用已有匹配 ac2b72a 的 build；未重跑全量 build/typecheck/lint/doc-sync，不声称完整功能验收通过。

详细命令、hash、trace、来源及复现步骤见 [P1 证据](evidence/p1/README.md)。本机 deterministic mock 只替代外部模型，真实 Host、Session、Skill 与 Python 工具未替换；不评估真实模型的回答质量。初始输出文件断言错误地要求 stdout headline 出现在派生图文件，核对源码后改按派生图 SUMMARY 的 1221 边验证；这是验证脚本修正，产品运行没有失败。

## 留给后续阶段

本次首发仍是原普通文字草稿、Viewer overlay 仍需手动关闭；可见 Skill/file token、overlay 等待 P3。new launch/retarget/reload/retry 的 admission 生命周期问题等待 P2；实验宽度等待 P4。本阶段没有重测这些 P0 已取证的完整矩阵，也未将首发成功推断成它们已修复。

P0 记录的全量 lint 8 项历史 diagnostics 和 tool-pto-run 清单预期 2/实际 3 的既有失败未处理，本阶段未重跑这两个全量/相邻检查。不存在本阶段已观察到的新产品失败。

本次临时 Web 与模型服务已核实 PID 后 SIGTERM，均退出 0；测试 tab 关闭，隔离数据及所有旧恢复点保留。下一步仅等待用户单独授权 P2；不自动进入任何后续阶段。
