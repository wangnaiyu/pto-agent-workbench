# harness 0.1.7-rc.1 升级报告

2026-09-24，fork master 已从 `a11460d434e652fde77d35e7558056a59cb3256f` 安全更新至 `19c1a836a76824be9a2be8773f419d392de01d4b`，固定 upstream 为 `46a7f68b0922371ce7144b668b90e377d8e799f4`（0.1.7-rc.1）。上游区间增加 1617 个提交、涉及 5142 个文件。31 个 fork 提交重放，另有 1 个兼容收尾提交；两项重改提交的 range-diff 人工对应见[审计](evidence/replay-audit.md)。

## 兼容结果

保留 PTO 品牌、Run Records、Viewer 与分析 receipt、实验能力、官方 Skill 固定来源、草稿首发与目录准入。适配 AgentPresetRegistry lease、SessionReference、Shell execute/result、新 tool preparing 状态及上游 Workspace pin/archive/batch 行为。冷目录通过最小 serviceForScope seam 读取预设隔离服务，不创建 Agent 或 Session；默认工作区初始化后仍暂存浏览器草稿。

本轮遇到实质持久化冲突：旧 PTO V4 为 V3 正文，上游 V4 已变更工具结果、来源、生命周期和子会话目录。新 writer 使用 V5；默认处理官方 V4，外层 patch 用显式 `legacyPtoV4: true` 处理旧 PTO 根目录。原件不改，只发布校验后的 successor；两条 V4 根目录不能混用。192 份旧 fork V4 fixture 全部 byte-identical。官方 finalized/schema history 保持不变，旧 fork V4 acknowledgement 原字节放入独立历史目录。真实用户会话未打开或迁移。

## 验证

- 冻结安装、完整 Host/Client/CLI/worker/Web 构建、源码 lint、正常 pre-commit 与两次 pre-push 类型钩子通过。
- 受影响 PTO/JSONL/Skill/草稿/UI 测试最终 2034 通过、1 skip（唯一失败文件修复后单独复验）；最终格式与 preset 聚焦 527 通过，其他新增生命周期/迁移测试见[账本](evidence/validation.md)。各集合有交集，不累加为唯一总数。
- SDK/headless/ACP 离线回放 168 通过、2 skip；真实 Chromium 的启动、首发、折叠、滚动、目录恢复和 Skill/Cordis 展示 15 通过。
- 外层真实 patch 的未分组与默认 Workspace Chromium smoke 各 1 通过：PTO brand、精确官方 provider、冷草稿目录、零 Session、无 console error/warning；配置 dump 无缺失 entry 警告。[截图](evidence/workbench-browser.png)。
- 精确提交的 4 项 push workflows 全部成功；双版本 npm 布局首次超时，原样重试 267.94 秒通过，本地同命令和固定 upstream manifests 对照也通过，未放宽门禁。
- doc-sync 42 gates、hygiene 18 gates 全通过；外层 17 个测试通过，结构检查零错误。
- 新 unknown-cast ratchet 首次接入时保留了逐旧 SHA/token 证明的 fork 历史债务，没有本次新指纹；详见[精确证据](evidence/pto-cast-audit.json)。

## 安全更新与两仓配对

先推送恢复分支 `codex/pre-upstream-master-20260924` 和候选 `codex/upstream-rebase-20260924`，再次 fetch 确认 master 原 OID，再以 `--force-with-lease=refs/heads/master:a11460d434e652fde77d35e7558056a59cb3256f` 更新。随后直接查询远端，master 与 candidate 相同，恢复分支仍指向旧 master。无 raw force、无 hook bypass。原 checkout 在 clean 状态下使用 reset --keep 同步。

正式配对为两仓 `post-upstream-baseline-20260924` annotated tag；相同 JSON 载荷记录 outer/harness/upstream 完整 SHA、writer V5、恢复分支、报告和验证路径。外层收口 SHA 以 tag 为准，避免文档自引用。旧 tags、恢复分支与隔离候选继续保留。远端核验和 CI 状态见[安全更新证据](evidence/safe-update.md)。没有官方 upstream 写入或主动产品发行。

本地主 checkout 增量构建曾读到旧 Desktop lib/types 的 removeLinkProjections 导出；经上游受保护 clean 清理可重建输出和四个退役包残留，完整构建随后成功，CLI 版本与实际 provider composition 均核验通过。该问题不涉及已通过干净构建的提交源码。

## 边界

没有测试真实模型/API、完整跨平台 PR 矩阵、原生 Electron 或真实用户数据升级/降级。历史跨父子 createdAt 不一致仍拒绝；独立 transcript replay 成功不代表整个旧 corpus 可迁移。混合 V4 根目录需先明确分离。新的产品设计、发行和真实日志迁移不在本次授权范围。

稳定结论已回写[架构](../../../docs/architecture.md)、[上游维护](../../../docs/upstream-rebase.md)和[踩坑](../../../docs/pitfalls.md)。
