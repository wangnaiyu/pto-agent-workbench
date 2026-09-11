# 查看与分析：交互方案

状态：纯查看 overlay 与同 Record viewer 切换已实现。升级后 P0 已将实际首发失败重分类为 provider 装配缺失和独立 launch/admission 生命周期缺口；下文规范 token、overlay 退出与恢复语义仍是待实现目标，不能描述为当前产品全部具备。事实见 [P0 取证](notes/p0-findings-2026-09-11.md)。持久 Analysis View、选区与深链仍是后续能力。

## 卡片回答三个问题

每张数据记录卡片优先呈现名称、可确认的代际/运行信息、可用动作。时间未知就不显示伪造的运行时间；数据不完整不全卡标红。

主动作“打开”提供泳道、执行依赖、计算图、内存、IR 等当前真正可用项；独立“AI 分析”提供有证据与 Skill 支持的具体问题。暂不可用项可解释“缺少 deps.json”“工具未配置”“格式尚未支持”，避免空点后才失败。数据详情承接来源、文件和诊断事实。

一次动作有明确对象和目的；禁止点开记录就自动建聊天或调用模型。

## 最小路径

```text
选定数据 → 发现记录 / 可用动作
            ├─ 打开 → 全幅 Viewer → 关闭回列表
            │           └─ AI 分析 → 草稿 → 发送
            └─ AI 分析 → 草稿 ─────────→ Session + 持久 Analysis View
```

纯查看不创建 Session、不调用模型，必要时可启动本地格式转换/静态服务，显示准备进度和取消。失败保留记录与原始输入，不产生空白会话。打开来源未知的 HTML 仍需隔离资源与脚本权限。

分析动作先生成可编辑的新会话草稿；明确点击发送才创建 Session 并执行 AI 分析。不要为
查看或进入草稿偷偷运行模型。MVP 已验证打开真实记录不会创建 Session；分析首发须按下文
的新契约重新完成端到端验收。

## AI 分析启动体验

按钮保持简洁文案“AI 分析”。一次有意点击代表一次新的分析启动：冻结当前 Record、artifact、
action 和固定 Skill，退出全屏 Canvas，进入视觉上的“新会话草稿页”。第一版直接关闭 Canvas，
并允许通过文件引用重新打开；大屏 Viewer + 会话分栏是后续增强，不阻塞正确性修复。

草稿复用输入区已有的显式选择语义，默认可见内容只有：

```text
/skill dependency-redundancy  @deps.json  分析冗余依赖，给出结论、证据、限制和建议。
```

- Skill 使用规范的 `/skill <name>` 选择；文件使用 `@<filename>` 引用。点击“AI 分析”在语义上
  等价于用户手动选择了这项 Skill 和这个文件，不做只有外观的假 token。
- 默认不展示数据集/Record 名称或 revision，也不把 provider、actionId、tool tuple、绝对路径
  和全量上下文铺在输入区。它们仍以结构化 attachment 携带，可在引用详情或 Session 审计中查看。
- 建议问题保持短、准确、可编辑；原始数据和完整分析指令不序列化进正文。

从 Viewer 再次点击“AI 分析”会产生新的 launch；发送后建立新的 Session。失败面上的“重试”
属于原 launch：复用同一 Session 和附件，不创建第二个 Session。双击等同一次 activation，
必须 single-flight；已有未发送分析草稿时不得静默覆盖，应让用户继续原草稿或明确放弃后新建。

## 三种承载状态，不是固定三列

| 状态 | 主体位置 | 辅助信息与生命周期 |
| --- | --- | --- |
| 纯查看 | shell.overlay 全幅 Viewer | 无 Session；临时打开，关闭回记录 |
| 分析中 | conversation.view 持久 Analysis View | 与真实 Session 共存；聊天可收起/切换，不创建第二套消息 |
| 对象详情 | details / 内联 inspector | 当前任务/边/内存区的局部属性；窄屏折叠，不挤压主图 |

大图优先面积，不让 side panel 成为所有可视化的固定窄窗。只展示受适配器支持的操作；
不暗示所有旧 HTML 都有双向选区联动。当前静态 HTML handle 固定声明
`selection=false` / `deeplink=false`，toolbar 明示“仅查看；无选区/定位回流”；切换会释放旧
iframe route，不承诺恢复其内部 zoom/filter 状态。

## 草稿和结果

草稿携带 launchId、RecordRef、ArtifactRefs、Action、Skill 版本与可选 SelectionRef；正文为
用户可编辑的短问题，不塞入整份数据。首次发送前由 Host 校验对象仍存在、修订/工具/Skill
匹配；失败保留输入与附件，重试不能重复建 Session。此前分层测试未证明真实 Web 组合完成了
该绑定；新的验收必须检查模型首步收到准入回执。详见 [输入区契约](../conversation-composer/design.md)。

Agent 读取官方 Skill 和必要数据，结果按“结论—证据—限制—下一步”组织。可报告文件路径/实体 ID/时间段，逐步增加“在图中定位”。必须带 record、artifact revision、rank/dispatch 等身份命名空间；裸 task ID 不能跨记录定位。

支持选择局部范围后“加入分析草稿”，这是明确用户动作；不因 hover 或 zoom 自动向模型发送内容。选区、历史结果、当前图版本不一致时标注不可定位原因。

## 失败与恢复

- 缺证据：仍打开可用 viewer；分析提供补充材料说明，不自动改项目编译配置。
- 准备慢：显示阶段、取消和错误详情；是否后台继续由明确能力决定，不假定刷新一定可恢复。
- 模型/工具失败：保存真实失败与已生成产物，支持同上下文重试，不伪造结论。
- 准入缺失：在 Session 内显示“数据关联失败”和原地重试，不把普通问题单独发送给模型；Agent
  不得用通用 Shell 对 Session 外数据手动复算后宣称正式分析成功。
- 恢复 Session：恢复固定的 Record/Skill/tool 引用，输入已失效时请求重新关联，不静默切到最新。
- 关联源码：只增加 source reference；已创建 Session 的 cwd 不可变。需要改码/重跑时另建关联工程 Session，直到明确设计 rescope。
