# 旧 notes 迁移映射

迁移日期：2026-09-03。11 份原文件、48 个二级分区逐项登记。原始内容字节不变，以 [机器清单](migration-manifest.json) 中的 SHA-256 校验；原 README 改名 original-readme。行号对应归档原文，不是当前方案的实现状态。

retained：保留结论；retained-with-limits：保留但带版本/范围限制；partly-superseded：部分被新方案替代；superseded：现行规则已替代；historical-only：执行过程/旧验证只作为历史。

## 分区去向

| 原文件 / 分区行 | 分区 | 处理 | 当前主归属 |
| --- | --- | --- | --- |
| [README.md:5](original-readme.md) | 规则 | superseded | [content-routing.md](../../docs/content-routing.md) |
| [decision-2026-08-20.md:3](decision-2026-08-20.md) | 移除“双 Agent 协作分工”限制 | retained | [rules.md](../../docs/rules.md) |
| [decision-2026-08-20.md:36](decision-2026-08-20.md) | PTO Agent 工作台改用预构建发行包 | retained-with-limits | [distribution.md](../../docs/distribution.md) |
| [decision-2026-08-20.md:56](decision-2026-08-20.md) | 工作台任务起始对象与信息架构 | partly-superseded | [data-intake.md](../../product/artifact-inspection/data-intake.md) |
| [decision-2026-08-25.md:3](decision-2026-08-25.md) | 新会话输入框 `+` 的草稿能力目录 | retained-with-limits | [design.md](../../product/conversation-composer/design.md) |
| [decision-2026-08-25.md:491](decision-2026-08-25.md) | PTO 持久实验 Dashboard 切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [decision-2026-08-25.md:520](decision-2026-08-25.md) | PTO Dashboard 用户执行切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-20.md:3](update-2026-08-20.md) | notes 记录规则确立 | superseded | [content-routing.md](../../docs/content-routing.md) |
| [update-2026-08-20.md:41](update-2026-08-20.md) | 双 Agent 分工移除 | retained | [rules.md](../../docs/rules.md) |
| [update-2026-08-20.md:55](update-2026-08-20.md) | prompts/ 移除（记录层调整） | retained-with-limits | [content-routing.md](../../docs/content-routing.md) |
| [update-2026-08-20.md:79](update-2026-08-20.md) | 3180 会话隔离（DSH_HOME 独立） | retained | [development.md](../../docs/development.md) |
| [update-2026-08-20.md:110](update-2026-08-20.md) | 3180 左上角产品名改版（deepseek → PTO Agent 工作台，HARNESS → DSH） | superseded | [architecture.md](../../docs/architecture.md) |
| [update-2026-08-20.md:147](update-2026-08-20.md) | 3180 浏览器标签页标题品牌化（PTO Agent 工作台） | retained-with-limits | [architecture.md](../../docs/architecture.md) |
| [update-2026-08-20.md:179](update-2026-08-20.md) | 推送与 PR（2026-08-20 追加） | historical-only | [upstream-rebase.md](../../docs/upstream-rebase.md) |
| [update-2026-08-20.md:196](update-2026-08-20.md) | harness fork rebase 至上游 rc.8 + PTO 品牌迁移到 slot 机制 | historical-only | [upstream-rebase.md](../../docs/upstream-rebase.md) |
| [update-2026-08-20.md:231](update-2026-08-20.md) | PTO 品牌标签布局修复 | historical-only | [architecture.md](../../docs/architecture.md) |
| [update-2026-08-20.md:253](update-2026-08-20.md) | 工作区标题栏新增“新会话”入口 | retained-with-limits | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-20.md:276](update-2026-08-20.md) | 侧边栏“会话 / 运行历史”双 Tab | retained-with-limits | [architecture.md](../../docs/architecture.md) |
| [update-2026-08-20.md:301](update-2026-08-20.md) | 空白对话页欢迎语与输入区布局调整 | retained-with-limits | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-20.md:324](update-2026-08-20.md) | 初始对话区滚动条修复 | retained-with-limits | [validation.md](../../product/conversation-composer/validation.md) |
| [update-2026-08-20.md:345](update-2026-08-20.md) | 安装与启动发行方案 | retained-with-limits | [distribution.md](../../docs/distribution.md) |
| [update-2026-08-20.md:366](update-2026-08-20.md) | 工作台任务起始对象与信息架构（六议题定稿） | partly-superseded | [data-intake.md](../../product/artifact-inspection/data-intake.md) |
| [update-2026-08-21.md:3](update-2026-08-21.md) | review / decision / clarification 分区元数据格式统一 | superseded | [content-routing.md](../../docs/content-routing.md) |
| [update-2026-08-24.md:3](update-2026-08-24.md) | 侧边栏信息架构落地（decision-2026-08-20 §1） | partly-superseded | [data-intake.md](../../product/artifact-inspection/data-intake.md) |
| [update-2026-08-24.md:52](update-2026-08-24.md) | 会话未分组常驻与空态归组 | retained-with-limits | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-24.md:79](update-2026-08-24.md) | 未分组会话的 default 持久化桶 | retained-with-limits | [architecture.md](../../docs/architecture.md) |
| [update-2026-08-25.md:3](update-2026-08-25.md) | 新会话输入框 `+` 的草稿能力目录：动态 spike | historical-only | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-26.md:3](update-2026-08-26.md) | 新会话输入框 `+` 的草稿能力目录：Host 静态目录 | retained | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-26.md:34](update-2026-08-26.md) | 新会话输入框 `+` 的草稿能力目录：PTO bundled provider 基线 | partly-superseded | [integration-design.md](../../product/official-skill-integration/integration-design.md) |
| [update-2026-08-26.md:61](update-2026-08-26.md) | 新会话输入框 `+` 的草稿能力目录：Client 统一 source | retained | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-26.md:85](update-2026-08-26.md) | 新会话输入框 `+` 的草稿能力目录：显式 Skill 手势 | retained | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-26.md:106](update-2026-08-26.md) | 新会话输入框 `+` 的草稿能力目录：首次发送再校验 | retained | [design.md](../../product/conversation-composer/design.md) |
| [update-2026-08-26.md:132](update-2026-08-26.md) | PTO 插件与业务 Skills：运行产物准入纵向切片 | partly-superseded | [data-intake.md](../../product/artifact-inspection/data-intake.md) |
| [update-2026-08-26.md:163](update-2026-08-26.md) | PTO 插件与业务 Skills：失败分诊纵向切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-26.md:191](update-2026-08-26.md) | PTO 插件与业务 Skills：候选优化实验切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-26.md:219](update-2026-08-26.md) | PTO 插件与业务 Skills：Before/After 比较切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:3](update-2026-08-27.md) | 第八阶段启动：集成与回归 | historical-only | [validation.md](../../product/conversation-composer/validation.md) |
| [update-2026-08-27.md:21](update-2026-08-27.md) | PTO Dashboard 用户执行切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:41](update-2026-08-27.md) | PTO 持久实验 Dashboard 切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:63](update-2026-08-27.md) | PTO 插件与业务 Skills：实验复盘切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:96](update-2026-08-27.md) | PTO 业务 Skills：联合边界复核 | partly-superseded | [integration-design.md](../../product/official-skill-integration/integration-design.md) |
| [update-2026-08-27.md:120](update-2026-08-27.md) | PTO experiment contract / registry 动态 spike | historical-only | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:148](update-2026-08-27.md) | PTO experiment proposal/query 静态固化 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:174](update-2026-08-27.md) | PTO 可信实验执行准入切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:185](update-2026-08-27.md) | PTO app-owned 指标采集与比较切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-27.md:211](update-2026-08-27.md) | PTO evidence-gated comparison UI 切片 | retained-with-limits | [experiment-contract.md](../../docs/experiment-contract.md) |
| [update-2026-08-28.md:3](update-2026-08-28.md) | harness 上游 rebase 与 3180 兼容修复 | historical-only | [pitfalls.md](../../docs/pitfalls.md) |
| [update-2026-09-03.md:3](update-2026-09-03.md) | harness 上游连续 rebase（alpha.4 → alpha.5） | retained-with-limits | [architecture.md](../../docs/architecture.md) |

## 大分区中的关键替代与补充

单一二级分区可能横跨多个能力；下列补充防止按文件整体搬迁时漏掉决定：

| 旧内容 | 现行去向/处理 |
| --- | --- |
| 08-20 marker 不足即拒绝记录 | [数据接入](../../product/artifact-inspection/data-intake.md)：允许 Evidence Pack；身份与可执行性分离 |
| 无 source badge、compile/runtime health | 同上：按具体动作说明约束，保存单项证据事实；关联源码不等于精确 join |
| 内部数据级别约束产品准入 | [规则](../../docs/rules.md)：不做 share-safe 评级；数据可读范围不等于执行或发布授权 |
| Workspace / Run / Session、默认输出覆盖、rank/dispatch | [数据接入](../../product/artifact-inspection/data-intake.md) 保留职责/身份边界；[维护清单](../../docs/maintenance-backlog.md) 保留待验 fixture/overwrite 问题 |
| 08-25 大分区后半的 intake/debug/optimize/compare/review 与实验执行 | [实验契约](../../docs/experiment-contract.md) 保留 Host transaction、比较与 Dashboard；不全归输入区 |
| “PTO 官方 bundled”、baseUrl/根发现旧假设 | [官方接入](../../product/official-skill-integration/integration-design.md)：自有/上游来源分开，完整资源树与固定 tuple；早期根定位错误不再当现状 |
| “无主画布 slot”、首版无 renderer 等阶段判断 | [架构](../../docs/architecture.md) 保留已实现 conversation.view / tool.result.detailview；[查看流程](../../product/artifact-inspection/inspection-workflow.md) 明确新 viewer 待实施 |
| 固定 metadata 格式、根 notes/prompts 规则 | [内容路由](../../docs/content-routing.md)：主题内长期记录；任务状态入包；根目录不再保留 notes/prompts |
| 旧推送/PR、发布目标、备份/缓存清理 | [维护流程](../../docs/upstream-rebase.md) 与 [发行边界](../../docs/distribution.md)：不继承授权，不自动发布/删除 |
| 多阶段“下一步”、历史测试计数 | 被后续实际记录推进的步骤不重新启动；测试仅对当次版本有效，当前进度以任务 status 为准 |

## 其他入口迁移

原 docs 中的 architecture、development、pitfalls、rules、upstream-rebase 更新到 work/docs；references 的三个文件更新到 work/references。它们是持续维护文档，因此内容经过修订，不宣称字节保留；原版本可从迁移前 Git commit 取回。

根 README 不再列研发目录/任务；研发总入口为 [work/README](../../README.md)。根 AGENTS 显式路由新规范与项目 Skill。根 prompts 在本次前已移除，本次不重建；未来有价值的 Prompt 按主题/任务归属保存。

外部 PyPTOUX 与上游镜像保持只读，其中可能存在旧路径引用，本次未扫描/修订所有反向引用。需要追溯时使用本映射，不为迁移擅自改动外部工程。
