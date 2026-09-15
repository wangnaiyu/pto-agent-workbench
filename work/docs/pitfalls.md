# 已知边界与踩坑

更新时间：2026-09-04。以下区分维护注意事项、已修复历史和待复验；不把旧版本的限制无条件套在 rc.1 上。

## 维护与构建

- harness 是独立仓库，外层 git status 干净不表示它干净。交接同时记录两者 HEAD 与改动归属。
- 只构建部分 workspace 包可能遗漏 manifest、bundle 或工具描述。2026-08-28 的 zod 打包/manifest 问题已有历史修复；涉及依赖与装配时仍应跑官方完整构建，不能宣称该故障当前仍存在。
- 2026-09-03 rebase 记录中的测试数量、临时恢复路径及缓存不是持续保证。临时目录可能消失；恢复先看实际产物。
- rc.1 的 package invariant 门禁不接受只为占位而存在的空 companion。包没有独立可变状态时，应同时移除 invariant export、构建入口、类型别名和依赖，并在包 README 记录不发布原因；不能保留一个永远通过的假检查。
- 仓库约束会按 `packages/*/*` 识别包根；旧 checkout 遗留的 ignored `lib`/`node_modules` 目录也可能形成“幽灵包”。先预览再精确清理对应 ignored 目录，不要扩大到整个工作树。
- ApprovalService 相关测试 fake 需实现当前 Session 的顺序读取契约（`seq`、`eventAt()`，事件同时含 `type` 与 `data`）；只模拟 `append()` 会在 rc.1 上误报业务失败。
- setup 有网络、构建、Git hook 配置等副作用；不用于纯文档验收。启动脚本固定 DSH_HOME，不要为了测试连接并修改用户真实会话。
- shell.overlay 与 conversation.view 不同 scope；不能拿 Session 内可用的插件调用推定根级 overlay 可用。大图需专门验证内存和取消路径。

## 数据与分析

- 文件名存在只是发现线索；解析、关联键、采集范围、版本兼容要分别验证。缺少可选 dump 不等于编译失败。
- 运行时 L2/L3 不是数据安全分级。旧 bundled Skills 仍有旧文字，本轮只登记差距；功能任务需审计 Host 和 Skills 两处。
- “允许读取选定数据”不等于允许执行目录里的脚本或修改原始产物。
- 不能裸用 task_id 跨 record/rank/dispatch 关联；大的 JSON/HTML 不整份放入 Prompt。
- 提供 source workspace 不表示与产物已建立精确映射，也不改变已经创建的 Session cwd。
- 官方工具可能写文件、绑定本地端口、要求特定 Python 库；适配器需显式输出目录、超时/取消、端口清理与依赖探测。

## 本轮 upstream 兼容事实

- Cordis patch的普通id只覆盖已有entry；缺失id会警告并跳过，新增插件须insert。实际工作台的official provider配置在升级前后均触发此问题；资源哈希正确不能证明运行时已挂载。详见[组合证据](../archive/tasks/2026-09-09-upstream-rebase/evidence/workbench-compatibility.md)。
- 新Session日志由多个独立Zstd frame拼接；只解压第一帧会误判缺少事件，取证须按generation实现扫描全部frame。别名迁移不能移动或覆盖旧generation。
- 普通PR合并不会采用rebase历史。本次在精确lease更新后，GitHub将候选PR识别为MERGED；更新前因历史冲突未启动PR CI，不得把零检查视作通过。

## Skills 与目录

- 产品 bundled provider 的目录来源需要可信注册元数据，不能靠技能名 pto- 前缀断言官方。
- provider scope 决定缓存和生命周期；watch=false 不保证资源不可变。同名 Skill 的有效解析和版本绑定需共同校验。
- 草稿目录查询不应创建真实 Agent/Session；Skill 选择不等于执行，更不等于授权重跑。
- 输入组件被重新挂载、容器 overflow 和嵌套滚动都可能破坏输入保留/菜单可达性；相关历史见输入区主题。
- AGENTS 是接手入口，Skill 是有条件的工作流。当前会话不会因新增文件就证明新会话自动发现；独立 harness 启动也不能假定读取外层指令。
- 归档原文有旧路径、旧规则、旧 resume 提示，只作证据；不要执行或批量“修正”原文。

历史对应关系见 [迁移映射](../archive/legacy-notes/migration-map.md)。尚未解决或需要现场复核的事项单列在 [维护清单](maintenance-backlog.md)。


## 0.1.6 上游适配

- `ConversationRoot` 已是薄路由出口，工作台草稿/欢迎区应接到 `ConversationContent`；目录选择仍保持 PTO 的“首发才创建 Session”，浏览器 fixture 不可依赖空 Session 行。
- 上游 `llm-deepseek` 默认使用 Messages 协议。已有 Chat Completions mock/兼容端点应显式配置 `protocol: chat-completions`，不能拿旧响应协议测试新版默认配置。
- 正式 Skill 目录需保留可选源路径供预览；草稿目录省略路径。规范 `/skill name` 的发送后装饰必须从日志注入确认 Skill 身份，预览指向 name。
- 不给生成 `/remote` 包导出添加指向 `.d.ts` 的运行时路径别名。正式 build 可能通过，`dev:web` 的源码解析仍会报 missing export；用真实 HMR 验证。
- 本 fork 当前 Session V4 承接 PTO analysis source 扩展，V3→V4 正文恒等迁移且冻结旧代文件。下次 upstream 也使用整数 V4 时，先比对格式含义和 schema，再设计迁移；不得仅凭相同版本号接收数据。
- 运行记录以 `dfx_outputs` 为根的 `deps.json` 引用已验证；以其父目录为根、提交 `dfx_outputs/deps.json` 的分析 action 在旧 fork 也受限制。本次不扩大记录根解析范围。
