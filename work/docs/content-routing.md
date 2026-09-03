# 内容路由与主题治理

状态：2026-09-03 用户确认后的现行规则。本文是目录、主题、命名和索引维护的唯一详细规范；旧记录中的同类约定不再作为默认入口。

## 目录职责

| 内容意图 | 位置 |
| --- | --- |
| 可运行工程、测试、构建、运行时 Skill、配置 | 现有 harness、plugins、tools、patches、skills 与代码包 |
| 可复验的技术 spike | 根 experiments；一次性中间文件不因此成为正式实验 |
| 产品与能力如何设计：业务分析、UX、技术方案、兼容矩阵 | work/product/<topic> |
| 本仓库如何开发、维护和治理 | work/docs |
| 外部来源登记、只读引用及本地环境定位 | work/references |
| 未整理文件、反馈、截图、输入材料 | work/inbox；允许直接暂存散文件或按批次分组 |
| 跨 Session 的有界复杂任务 | work/inbox/tasks/<YYYY-MM-DD-slug> |
| 已结束任务或冻结历史 | work/archive |

根 README 只介绍产品，不列个人研发主题或任务台账。work/README.md 是唯一研发总导航，不另建 INDEX。AGENTS 与 .agents/skills 是工具发现需要的根级例外；开发用 Skill 不进入产品 skills/bundled。

目录按用途，不按文件扩展名或“是否完成”划分。正式 HTML 报告可以在主题内；可执行 spike 在 experiments；设计成熟后仍留在原主题。大体积原始数据优先引用，不复制进工作仓库。

## 主题边界

主题围绕持续演进的用户问题或可复用能力，不按一次任务、日期、按钮或代码模块自动拆分。先复用已有主题；一条用户链路内紧密配合的内容优先同主题分文档。

当前主题与关键产物只登记在 [研发导航](../README.md)。尤其数据接入、识别和 Profile 与产物查看/AI 分析同属 artifact-inspection，不新建重复的 workspace-data/data-analysis 主题。

出现独立消费者、独立任务与验收节奏，且合并已增加查阅负担时，才评估拆分。文件变多不是充分理由；没有实际内容不预建 shared 桶或主题。跨主题内容有一个主归属，其他主题链接引用。

每个主题以 overview.md 说明解决的问题、包含/不包含范围、协作主题、当前设计/实现/验证状态及产物导航。正文可以先合为 design.md，复杂后按需要拆分；不强制 UX、技术、来源、模板全套齐备。

## 当前结论、历史与进度

- 主题正式文档表达当前有效设计；标明设计确认与实现、验证之间的差距。
- 主题 notes 记录有保留价值的判断、评审、决定和变更，不替代正式方案。
- 某次任务的实际进度仅以该任务 status.md 为准，主题可链接任务而不复制状态表。
- 结构性决策（内核/slot/通信边界、重要产品或治理取舍）保留日期、依据、状态、影响与替代关系。重大规则变更由用户决定，Agent 不自行扩大政策。
- 历史中的“accepted/complete”只对当时范围和版本有效。不能按“文件最新”自行裁决冲突；查明适用范围与用户决定，无法判断则登记问题。
- 稳定结论及时回写，不等任务归档才整理。不用复制原文的方式维护两份当前方案。

## 命名与记录

- 目录使用稳定英文 kebab-case；主题不加日期、v2/final 或优先级编号。正文默认中文，上游字段、路径、文件名和 API literal 原样保留。
- 常用正式文件：overview.md、design.md、data-intake.md、inspection-workflow.md、technical-design.md、implementation-plan.md、validation.md、sources.md。按实际用途选择，不以文件名暗示文档已验收。
- 主题记录：notes/update-YYYY-MM-DD.md、decision-YYYY-MM-DD.md、review-YYYY-MM-DD.md、story-YYYY-MM-DD.md、clarification-YYYY-MM-DD.md；同一主题同日同类型合并，分区记录不同工作，不再把全仓无关主题挤在一个日文件。
- decision/review/clarification 保留简短元数据：日期、记录者、来源、状态（proposed/accepted/rejected/superseded）。不强制固定 Agent 名单、标点或字段排列；原文历史不批量改格式。
- prompts/YYYY-MM-DD-slug.md 保存可复用的目标、上下文引用和输出约束，不保存聊天逐字稿。不要求每次更新都创建 Prompt；纯错别字和链接修复不新建记录。
- 任务 ID 使用 YYYY-MM-DD-slug，同日重名增加有意义的区分词；归档保留 ID。具体任务文件约定见 [任务流程](task-workflow.md)。

## 检索与索引

先按主题名/问题查 work/README.md，再读主题 overview 与相关正文；恢复指定任务时优先直达其 status。历史仅在当前文档的引用或明确审计需求下读取，不扫描归档 Skills 当作当前能力。

新增、合并、迁移主题或新增关键产物时，同步更新 work/README.md 和主题 overview。普通 note 不逐项进入全仓索引。源登记在 work/references/sources.md；主题 sources 只记录该分析的快照与证据，不复制源仓库注册表。

仓库内使用相对链接。外部本机目录只作为环境定位记录，不成为硬编码工程契约；跨设备需重新确认。迁移后检查链接并提供旧到新映射；只读外部仓库中的旧引用登记影响，不擅自改写。
