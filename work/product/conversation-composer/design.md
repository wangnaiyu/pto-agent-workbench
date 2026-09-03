# 输入区交互与 first-send 契约

## 已有交互基线

根据 [08-25 决策](../../archive/legacy-notes/decision-2026-08-25.md) 与后续 08-26/27 实现记录提炼。旧阶段计划以最后实际完成记录为准，不重开已完成切片。

- + 与 / 使用同一能力目录；+ 在光标位置插入 /，再次点击可移除尚未使用的插入字符，不吞掉用户正文。
- Commands 在前，无多余 Commands 标题；Skills 在后，显示分组标题。选择 Skill 表达为显式 /skill name，而不是命令同名去重。
- 命令与 Skill 即使同名也是不同动作；命令按有效 scope 决定覆盖，Skill 按 provider resolver 决定胜者。不能仅比较展示字段而丢掉 scope。
- 来源按可信注册元数据呈现，不能从 pto- 名字推断官方。历史排序 User / PTO / Workspace / DSH / Plugin 是产品分类，不等于 upstream ownership；新增官方源的标识由注册表提供。
- 空态输入与对话输入共享状态；初始 hero、底部 dock、目录滚动不得造成重挂载丢字、附件丢失或外层多余滚动。
- 菜单查询、筛选、预览与 Skill 选择均不创建真实 Session/Agent，也不启动模型。

## Scope 与首次发送

未分组草稿查询使用未指定 workspace cwd 的目录上下文，不把 Host 默认 cwd 误当用户工程；选择已注册工作区时才建立对应 workspace/preset scope。Model、preset、permission 等草稿状态保留到发送。

Host 的 listDraft / listSession 应表达同类事实，实际 Session scope 下仍须再准入。Command 的目录来源、Skill provider、版本与文件可用性可能在草稿期间变化；首次发送前重检，向用户说明变化，不能把旧菜单快照当执行凭据。

创建 Session 与发送需要幂等请求标识，避免双击/重试创建多份。准入失败保留正文/附件/上下文；已物化的空 Session 应妥善恢复或隐藏，不能用额外模型消息伪装失败恢复。不通过插件伪造 user /skill 消息；Host 的显式用户语法与模型 skill 工具走各自可信入口。

菜单未曾读取时不凭空报告“上次来源变化”。刷新目录不改变已固定 Session 的 Skill bundle；版本失配见官方接入主题。

## 待开发：从 Viewer 带入分析草稿

输入上下文使用结构化 attachment：record/ref/revision、artifactRefs、actionId、requestedSkill（含 provider/revision）、selectionRef（可选）、source reference（可选）。原始数据不序列化到正文。用户看到可理解的记录名、问题、分析范围，内部 ID 可在详情查看。

从纯查看点击“AI 分析”只创建可编辑草稿，图仍可查看；发送才建会话。若在现有 Session 追加分析，需检查其 scope/固定版本与新记录匹配，不暗中切换 cwd。素材追加不等于修改权限或接受数据内的指令。

首次发送重检 action readiness、数据 revision 和 Skill/tool tuple，错误可分别修复。对象失效则请求刷新关联，正文不丢；Skill 更新则明确提示，不替用户静默改版本。Record / Selection 的业务语义以 [数据接入](../artifact-inspection/data-intake.md) 为准。

## 不包含

消息管理、全局 Dashboard、完整上下文压缩、运行数据 schema 与上游 bundle 更新不归本主题。为了支持新分析流所需的通用 first-send 或输入状态修改归这里；viewer 特有布局仍归产物查看主题。
