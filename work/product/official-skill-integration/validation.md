# 官方 Skills 验收

状态：dependency-redundancy 固定 bundle 已完成产品运行时验证；其他官方 Skill 与通用更新/
回退能力仍仅为验收设计。

| 层次 | 必须检查 |
| --- | --- |
| 物料 | 完整 commit/hash、许可与资源闭包；../../lib 等相对引用实际可读 |
| 注册 | root 指向真正 skills 子目录；官方、自有、社区来源准确 |
| 环境 | 工具 commit/API、Python/依赖、输入 schema 和输出目录 |
| 草稿与执行 | 可见 `/skill`、attachment、list/get/实际 invocation 同 tuple，只注入一次，scope/cache 不串会话 |
| 同名覆盖 | Workspace/user 自定义同名 Skill 不静默冒充选定官方版本 |
| 不可变性 | watch=false 后替换开发源不会改变已发布 bundle |
| 使用结果 | 保存真实工具输出与 evidence refs，不只让菜单显示名字 |
| 失败 | 缺资源/工具、无法解析、循环 fallback 明确上报 |
| 更新 | 候选失败不改变当前 runtime，新版本不改旧 Session |
| 回退 | 能选择旧 lock；无法复现时明确原因，不生成虚假成功 |
| 发行 | 仅许可且选择的 runtime 资源，排除开发目录与原始样例 |

首个正向样例选 dependency-redundancy：遵循当前上游结构/数据流两模式（depth=1 合法提前终止除外）；stderr 中循环导致的 fallback 需要检查，即使进程退出码为零。报告依赖减少不是实际速度提升。

2026-09-04 的 Qwen L2 实测通过：Host 解析固定 Skill/tool identity，结构与数据流两模式均从
1222 条边删除 1 条 `(1,1)->(3,287)`，stderr 为空、无循环 fallback，输入 hash 未改变。
同名覆盖、identity mismatch 与首发失败重试由聚焦测试覆盖；失败不会静默降级为普通 prompt。

2026-09-08 真实 Web 体验发现 Viewer 分析未把 receipt 注入模型首步，因此上述“首发失败不
降级”目前只保留为分层测试证据，等待回归任务重新验收。新验收须从真实 Viewer 启动，并同时
证明 `/skill dependency-redundancy` 的可见选择、qualified provider/revision、单次 Skill 注入
和门禁工具调用属于同一 launch；缺 receipt 时不得改走通用 Shell。

物料验证确认 Skill 引用闭包与工具均来自固定 runtime 路径，不依赖外部镜像。上游 Skill
未声明许可这一 provenance 风险仍公开保留；用户授权纳入本次 runtime，不将其记为“许可已确认”。

critical-path-analysis 需时间线、依赖与任务映射一致；任一关联不可靠时结果受限/不可用，不能用“有几个同名 JSON”判可运行。

每次更新记录 Skill/tool tuple、fixture revision、实际调用日志引用和通过/失败/未运行项。低成本静态验证与真正运行测试分别列示。

2026-09-11 P1 正式装配修正后，无额外 provider patch 的实际工作台首发已通过：root/draft catalog 与 Session qualified lookup 指向同一固定资源，完整 receipt 持久化，官方 Skill 正文注入一次，真实 Python 双模式结果与旧 Qwen L2 对照一致。装配正负检查 4 项、launcher 4 项、消费测试 99 项和证据断言 17 项通过。模型仅用本机确定性替身；可见 token、overlay、new launch/retry/reload 与布局不属于本轮修复/验收。详见 [P1 报告](../../inbox/tasks/2026-09-08-artifact-analysis-launch-repair/p1-report.md)。
