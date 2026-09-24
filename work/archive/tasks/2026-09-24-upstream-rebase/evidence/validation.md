# 兼容性验证账本

环境：macOS arm64、Node 24.14.1、pnpm 11.7.0，Python PTC 使用 Codex bundled Python（系统 3.9 不满足测试的 >=3.10 要求）。所有 profile/Session 操作使用私有临时目录。完整构建与浏览器均使用候选 checkout。

| 验证 | 最终结果 | 日志 `/tmp/pto-20260924-…` |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | 339 workspace，lockfile 一致 | frozen-install.log |
| `pnpm run build` | Host/Client/CLI/worker/Web 完整通过 | build-final.log |
| 受影响 PTO、JSONL、Skill、草稿及 UI 回归 | 102 文件通过；唯一失败文件为 commands mock 重复注册，修复后该文件 70 项全通过；共 2034 通过、1 skip | compat-final.log、command-final.log |
| 最终格式 owning、预设、rescope | 28 文件、527 通过 | final-format-tests.log |
| 迁移 CLI/历史布局/预设生命周期 | 3 文件、90 项通过；同批 CI 测试的缺少 GitHub context 已修复并在最终兼容集通过 | final-scripts.log、compat-final.log |
| 真实 PTO receipt lineage + JSONL publication + composer-catalog | 20 通过；文本/zstd、只读不发布、一次性写、重开与原件字节不变、错误 lineage 拒绝 | lineage-final.log |
| corpus policy | 16 通过，保留官方 V4 adjacent-migration | corpus-final.log |
| SDK + headless + ACP keyless replay | 168 通过、2 skip；V5 由各自 owner refresh 后只读回放 | replay-final.log |
| Chromium startup/draft/first-send/目录恢复/folding/scroll | 11 通过 | browser-replay.log |
| Chromium Skill invocation / retired Cordis history | 4 通过 | browser-skill-replay.log |
| 实际外层 patch Chromium smoke | 未分组与默认 Workspace 两条独立 smoke 各 1 通过：PTO brand、官方 provider、冷草稿 catalog，零 Session、无 console error/warning | workbench-browser.log、workbench-browser-scoped.log |
| 外层实际 patch `--dump-config` | 唯一官方 provider、精确版本与工具路径，无 patch warning | outer-provider.log |
| `pnpm run doc-sync` | 42 gates 全通过，包含 type history、格式 refs、双语、生成目录及文档构建 | doc-sync-5.log |
| `pnpm run hygiene` | 18 gates 全通过 | hygiene-3.log |
| `pnpm run lint:contracts-ready` | 全源码通过 | lint-3.log |
| 外层脚本测试/结构 | 17 通过；结构 0 errors | outer-tests.log、outer-structure.log |
| 不可变历史样本审计 | 192 原 fork V4 文件全部 byte-identical；200 个 V5 successor（含 scenario 新代） | pto-immutable-audit.json |

同一用例在不同聚焦集合中可能重复，上表数量不相加为唯一测试总数。之前失败均有对应修复与复验；没有跳过 Git hooks，没有禁用门禁。新 ratchet 采用旧 fork 的精确债务证据见 replay-audit.md 与 pto-cast-audit.json。

未验证：真实模型/API 凭据调用、全部 PR Linux/Windows/macOS 平台矩阵、原生 Electron、真实用户历史根目录升级/降级。没有真实用户日志迁移；混合 V4 根目录不可直接打开，历史父子身份不一致仍严格拒绝。snapshot 的独立 transcript 成功不等于全 corpus 迁移成功。

主 checkout 在上游 guarded clean 后的完整 build 亦通过，CLI `--version` 为 `0.1.7-rc.1`，实际外层 provider smoke 无警告；对应 main-build-clean.log / main-provider.log。旧 ignored 产物清理不属于源码修复。

最终 push CI 的 4 个 workflows 全部 success，精确提交与链接见 [CI 结果](ci-final.json)。Dependency layout 首次 300 秒超时，原样重试 267.94 秒通过；本地同命令 224.98 秒通过，固定 upstream manifests 对照 205.85 秒通过，未放宽原门禁。该对照共享外部依赖存储；不是独立 upstream checkout 全验证。
