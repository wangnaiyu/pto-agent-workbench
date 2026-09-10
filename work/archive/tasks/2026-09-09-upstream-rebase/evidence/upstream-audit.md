# 固定目标与迁移审计

固定 target 为 `5dda764ed3aa172535a7967b06ff95d9cbfe536a`（0.1.5-alpha.1，2026-09-08T23:25:45+08:00）；旧 fork 为 `ef0d49b574f544c997e914b4254e38080730f45a`，merge-base 为 `76fda729799fe9b3848dbe2c211d4b231032b81e`。完整提交清单见同目录 TXT。上游新增 1108 commits，fork 有 25 个非 merge commits 加一个无独立内容的 PR merge；208 个共同修改路径。普通重放将扁平化 PR #5 的拓扑，内容仍由 e95e118 对应提交保存，不将它计为丢弃功能。

- Session：released JSONL adjacent migration 到 V3，版本化 successor 保留旧 generation；持久化新增跨进程 lease。PTO directory alias 必须接入新的 generation/path 解析，不能恢复旧读写路径。
- Agent/Host：Agent identity 显式化，Inbox 改为 durable projection，system prompt 进入 surface node；PTO 事件/投影和 pre-step 拦截必须沿用新生命周期。
- Conversation：文件上传与 attachment admission、重复 request admission、非空 prompt 检查、异步 upload/submit 状态变化。延迟建 Session、草稿 capability、qualified Skill 与 PTO admission 要保留，但不借此修复既有 Viewer first-send receipt 丢失。
- Workspace/layout：新增 workspace-files/resources、ui-sidebar 的 file tabs/text preview、ui-dockkit 和 responsive right column；原 ToolDetails/Chat Details 被删除。PTO Viewer 与 experiment view 应使用有效的新装配入口，不恢复已退役的 Details。
- Skill：新增 slash chip 与 fuzzy ranking；审计 qualified lookup/invocation 仍保留唯一 provider 身份和调用语义。
- Composition/runtime：native 包迁至 node-addon-system，CLI/desktop/runtime packaging 和 manifests 升级。PTO 插件版本、依赖、typert 及 generated catalogs 需要与固定目标一致。

## 冲突决策

| 原提交 | 位置 | 选择及理由 | 后续验证 |
|---|---|---|---|
| 523c27c361 | web-app/package.json | 在 upstream 已重排的依赖中保留 PTO brand，只保留一个 ui-commands 条目 | closure/build |
| 523c27c361 | config-catalog.i18n.yaml | 两侧正文自动合并，使用项目 pairing resolver 重新确认记录 | doc-sync |

| 89bc5ef0 | startup hero test | 保留 PTO 无 fish headline 的既有品牌意图 | browser |
| a3decdf0 | WorkspaceBrowser/Rows | 合并 search reveal、workspace ready 与 fork run-records 区域 | workspace tests |
| c3d488f6 | JSONL alias | 别名用于 versioned path 和锁目录；旧目录扫描/迁移遵循 generation 机制，不恢复 packChunks | persistence |
| 07677563 | draft/attachments | attachmentIds 和通用文件上传：browser draft 暂存，materialize 后绑定 Session 上传；保留延迟创建 | integration |
| 63018294 | CI | 7 个既有 larger-runner no-op 按新 jobs 重放；独立 benchmark 保留真实 workload，不恢复旧 Wine PR lane | ci-workflow |
| 03d3b41b / ceb8fb9b | notes | 冻结 upstream archives，纠正 Git 相似性误识别的 sidecar rename，未改 canonical-feedback/native-containment/Agent identity 新 note | docs |
| ceb8fb9b / f3109497 | Skill | canonical /skill 与 qualified identity 保留，并保留 upstream fuzzy ranking、localized commands 和 attachments | Skill |
| 477d66bc | removed ToolDetails | 不恢复 conversation.details.tool；PTO 比较证据迁到工具卡可展开内容。Dashboard width 不改 | presentation |
| ad0c556d | stale InputNotice | 前置 07677563 适配已删除该 import，Git 自动省略空提交；不是声称 upstream 实现 PTO | mapping |
| 925715ab | web fixtures | 保留 upstream 当前文案、Queue 按钮、因果等待与 V3 fixture，沿用 fork composer helper | browser |
| e95e118b | artifact baseline | 保留 artifact inspection、official Skill、Host receipt、pending draft admission；合并 Remote/file-upload。退役 Details 的旧 layout tests 由新 layout suite 取代，overlay 仍需补测 | focused |

Generated catalogs 冲突时暂留 target，已在最终源码完成后重新生成并通过doc-sync34/34。初始重放完成 24 个新提交，1 个 import 清理被吸收，PR #5 merge 拓扑扁平化；完整映射见 commit-mapping.json。初始 replay SHA dfee89b2e0e6ca090f911b136315f235133aec78 已保留在本地 codex/replay-savepoint-20260909。

最终兼容提交ac2b72a9615cbaf23bb21951ffe1c22f3a11d807补齐通用文件准入失败时的上传保留、附件移除保护、V3 alias测试、版本/依赖与生成目录；CI测试适配canonical-only步骤位置，workflow规则未降低。
