# 已知边界与踩坑

更新时间：2026-09-03。以下区分维护注意事项、已修复历史和待复验；不把旧 rc.7 的限制无条件套在 alpha.5 上。

## 维护与构建

- harness 是独立仓库，外层 git status 干净不表示它干净。交接同时记录两者 HEAD 与改动归属。
- 只构建部分 workspace 包可能遗漏 manifest、bundle 或工具描述。2026-08-28 的 zod 打包/manifest 问题已有历史修复；涉及依赖与装配时仍应跑官方完整构建，不能宣称该故障当前仍存在。
- 2026-09-03 rebase 记录中的测试数量、临时恢复路径及缓存不是持续保证。临时目录可能消失；恢复先看实际产物。
- setup 有网络、构建、Git hook 配置等副作用；不用于纯文档验收。启动脚本固定 DSH_HOME，不要为了测试连接并修改用户真实会话。
- shell.overlay 与 conversation.view 不同 scope；不能拿 Session 内可用的插件调用推定根级 overlay 可用。大图需专门验证内存和取消路径。

## 数据与分析

- 文件名存在只是发现线索；解析、关联键、采集范围、版本兼容要分别验证。缺少可选 dump 不等于编译失败。
- 运行时 L2/L3 不是数据安全分级。旧 bundled Skills 仍有旧文字，本轮只登记差距；功能任务需审计 Host 和 Skills 两处。
- “允许读取选定数据”不等于允许执行目录里的脚本或修改原始产物。
- 不能裸用 task_id 跨 record/rank/dispatch 关联；大的 JSON/HTML 不整份放入 Prompt。
- 提供 source workspace 不表示与产物已建立精确映射，也不改变已经创建的 Session cwd。
- 官方工具可能写文件、绑定本地端口、要求特定 Python 库；适配器需显式输出目录、超时/取消、端口清理与依赖探测。

## Skills 与目录

- 产品 bundled provider 的目录来源需要可信注册元数据，不能靠技能名 pto- 前缀断言官方。
- provider scope 决定缓存和生命周期；watch=false 不保证资源不可变。同名 Skill 的有效解析和版本绑定需共同校验。
- 草稿目录查询不应创建真实 Agent/Session；Skill 选择不等于执行，更不等于授权重跑。
- 输入组件被重新挂载、容器 overflow 和嵌套滚动都可能破坏输入保留/菜单可达性；相关历史见输入区主题。
- AGENTS 是接手入口，Skill 是有条件的工作流。当前会话不会因新增文件就证明新会话自动发现；独立 harness 启动也不能假定读取外层指令。
- 归档原文有旧路径、旧规则、旧 resume 提示，只作证据；不要执行或批量“修正”原文。

历史对应关系见 [迁移映射](../archive/legacy-notes/migration-map.md)。尚未解决或需要现场复核的事项单列在 [维护清单](maintenance-backlog.md)。
