# 重放与兼容审计

31/31 fork 提交重放至固定 upstream 46a7f68b0922371ce7144b668b90e377d8e799f4，初始候选 3a82b9c5b7。完整对应见 range-diff-initial.txt，后续兼容收尾另作一项提交。

## 变更归属

- 保留上游 pin/archive、批量会话操作、默认工作区初始化与新 SessionReference 所有权；PTO New Session 仍为浏览器草稿，首发才实体化。选中空会话不显示但保留排序成员身份。
- 草稿 Commands/Skills、权限与模型选择适配新目录/预设 API；保留官方 Skill provider、PTO Viewer/analysis receipts、Run Records 与实验能力。
- 已删除的 agent-presets 不复活；composer-catalog 持有新 agent-preset-registry.acquireScope lease，新增最小 serviceForScope 接口访问所属隔离服务。动态/静态插件均无法独立读取这个私有 mount，故需要该最小服务 seam；不创建 Agent/Session，新增测试覆盖退役与释放。
- Shell 执行迁入 resolve/execute/result 契约；工具 running/preparing 状态按新 discriminated union 读取 args；新图标和 Client face build references 跟随上游。
- 原 PTO V4 是 V3 正文；上游 V4 已改变 tool role/source/lifecycle/catalog，不能按整数等同。新 V5 默认接收官方 V4 恒等坐标；旧 PTO corpus 使用显式 legacyPtoV4，冻结 codec 并通过上游 V3 正文转换完成升级。两条 V4 根目录不可混用，真实用户数据未打开。
- 192 份原 fork V4 fixture 逐字节不变，新增 V5 successor；重合路径保留 fork 原件，新的 V5 由官方对应源转换并通过 owning refresh/replay 验证。保留官方 V4 相邻迁移用例。18 份历史跨父子 createdAt 不一致样本不声称完整 corpus 迁移成功：独立 transcript replay 明确使用空 child 集合，真实 persistence 仍严格拒绝不一致证据。
- 官方持久化 finalized 记录/after schemas 不改；旧 fork V4 acknowledgement 原字节迁至 legacy-pto-v4 历史分支，新 V5 记录在官方线性历史之后。
- 上游 Windows observational 已并入 windows-build；保留 fork 的官方仓库条件与 hosted fallback，不恢复旧独立 job。

## 新门禁的首次 fork 基线

上游 2026-09-19 新增 unknown-cast ratchet。本次与已验证旧 fork SHA 逐 AST token 指纹比对，48 项缺失条目全部原样存在于旧 master，0 项本次新增（证据 pto-cast-audit.json）。首次接入该门禁时并入这些精确的既有 fork 债务，再 prune 已消失项；这是采用上游政策时保留两侧旧基线的一次性整合，不授权以后增加例外。没有禁用检测、添加文件级豁免或用 any 隐藏转换。一般“baseline only decreases”规则继续适用于整合后的基线。

## 已审计边界

- 无官方 upstream 写入、无产品发行、无真实用户日志升级/降级。
- 全量源码 lint、类型/构建、受影响测试、隔离真实配置与浏览器证据见 validation.md（最终验证完成后写入）。

`range-diff` 的相似度启发式把两项重改提交显示为删除/新增，而非自动配对；按提交主题及实际变更核对：7534bc7186 → 0d716b8f64，7965e590f1 → 9c7704dea8。前者的迁移接口/fixtures 适配由上游 V4 与最终 V5 收尾替代，后者的 V4 schema 记录保留在 legacy-pto-v4 且所有旧 fixture 保持不变。其余 29 项自动对应，没有遗失 PTO 能力。

归档中的 range-diff 文本仅去掉行尾空白以通过仓库 whitespace 检查；提交对应和 diff 内容未改。
