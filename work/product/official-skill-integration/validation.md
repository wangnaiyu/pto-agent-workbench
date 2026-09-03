# 官方 Skills 验收

状态：测试设计，尚未安装/更新官方 bundle 或执行下面案例。本轮项目开发 Skill 的验证不等于产品官方 Skills 的验证。

| 层次 | 必须检查 |
| --- | --- |
| 物料 | 完整 commit/hash、许可与资源闭包；../../lib 等相对引用实际可读 |
| 注册 | root 指向真正 skills 子目录；官方、自有、社区来源准确 |
| 环境 | 工具 commit/API、Python/依赖、输入 schema 和输出目录 |
| 草稿与执行 | list/get/实际 invocation 同 tuple，scope/cache 不串会话 |
| 同名覆盖 | Workspace/user 自定义同名 Skill 不静默冒充选定官方版本 |
| 不可变性 | watch=false 后替换开发源不会改变已发布 bundle |
| 使用结果 | 保存真实工具输出与 evidence refs，不只让菜单显示名字 |
| 失败 | 缺资源/工具、无法解析、循环 fallback 明确上报 |
| 更新 | 候选失败不改变当前 runtime，新版本不改旧 Session |
| 回退 | 能选择旧 lock；无法复现时明确原因，不生成虚假成功 |
| 发行 | 仅许可且选择的 runtime 资源，排除开发目录与原始样例 |

首个正向样例选 dependency-redundancy：遵循当前上游结构/数据流两模式（depth=1 合法提前终止除外）；stderr 中循环导致的 fallback 需要检查，即使进程退出码为零。报告依赖减少不是实际速度提升。

critical-path-analysis 需时间线、依赖与任务映射一致；任一关联不可靠时结果受限/不可用，不能用“有几个同名 JSON”判可运行。

每次更新记录 Skill/tool tuple、fixture revision、实际调用日志引用和通过/失败/未运行项。低成本静态验证与真正运行测试分别列示。
