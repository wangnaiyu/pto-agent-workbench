# P3 契约与 owner 边界停止报告

检查基线：harness `e92a21adc477133a0771a6194962be901284a2ed`，工作台 P2 `a68dea5bc06793df98b2f8f0c2f53db7f62080fc`。P2 结果见 [报告](p2-report.md)。本页是 P3 实施前审计与待确认方案，不是 P3 完成报告；当前进度看 [status](status.md)。

## 触发停止的事实

1. **正式引用不能通过已批准的文本保存契约恢复。** `GuardedDrafts.stage(binding, text, begin)` 只接收文本，保存结构只有 `text`，恢复调用 `setDraft(saved.text)`。手动文件选择通过 `ReferenceInsert` 和 `insertReference` 创建有 source/ref/label 的原子节点；仅预填 `@deps.json` 不等价。P2 批准的是 launch identity + 草稿文本恢复，未批准引用快照的跨刷新恢复契约。现有 shell 可恢复本次失败发送中的 occurrences，但它不是供插件 staging/跨刷新使用的公共入口。
2. **引用没有回开入口。** `ReferenceChip` 只渲染 span，节点没有 owner activation 回调；`ReferenceCodec` 只有 clipboard/serialize。要满足计划的“通过引用重新打开 Viewer”，需增加通用引用激活 seam，不能依赖 DOM 事件旁路、内部 Lexical 节点访问或把 receipt 塞进 HTML handle。
3. **正式 Skill 文本会重复注入，且涉及 P3 当前 owner 之外的 Host。** 使用真实 `PtoArtifactInspectionGateway` 与 `tool-skill` 插件的确定性 pre-step 组合：普通问题 → 1 条 `skill-invocation`；相同 admission 加 `/skill dependency-redundancy` → 2 条。测试的 skills/agent/文件是固定 fixture，receipt 与两次注入均来自真实插件，没有伪造 source。它不是完整工作台运行证据，但已经直接否决“只改前端即可满足恰好一次”。两个 Host 源文件从升级后原始基线 `ac2b72a...` 到 P2 HEAD 无差异，属于 P3 新手势会触发的既有集成缺口，未将其称为本次已提交代码的新回归。

其他约束也已核对：draft 的正式 Skill 选择由 `ui-composer-catalog` 生成 `/skill <name>`，Session 由 `ui-skill` 生成相同文本；PTO qualified tuple 仍须由 admission 保证。普通 `ui-reference` 不服务 draft，且现有文件引用提示语定义为 workspace-relative，不能把 cwd 外的数据伪装为这个 resolver 的 `@deps.json`。

源码 SHA256、可复现诊断和结果见 [P3 证据](evidence/p3/README.md)。未实施 P3 产品修改，未进入 P4/P5。

## 待确认的最小范围调整

保持 P3 产品目标，只补以下必要契约和 owner 范围；这是提案，尚未实施：

- **Conversation/reference owner：**允许 guarded browser draft 接收、保存、恢复已有 reference occurrence 的稳定数据投影，沿用当前编辑器插入/序列化语义；向 owner 校验暴露实际提交的文本和引用投影。支持已有 P2 文本记录，存储失败或引用 owner 缺失继续 fail closed。只扩展浏览器交互存储，不改 Session V3/receipt schema，不另造 Session。
- **Input-trigger/reference owner：**增加可选的 source-owned 引用激活入口，让点击和键盘激活交给 PTO owner。普通引用行为保持。PTO resolver 使用 Record/revision/artifact identity，不用猜测的 cwd-relative 路径；回开仍通过 Host 取得完整 record + 新 handle，旧 handle 按既有 close 生命周期释放。
- **PTO 可见意图校验：**短问题可自由编辑；删除或改坏必需 Skill/file token 时，阻止此 bound launch 并提示重新选择/关联。不会因为改了可见 token 就静默切换 qualified Skill、脱离 Record 或降级普通 prompt；明确清除草稿后仍按 P2 规则可新建 launch。
- **Host owner 扩展：**将 `pto-artifact-inspection` 的 pre-step 注入协作纳入 P3；以 admitted qualified Skill 为准，与正式 `tool-skill` 手势注入达成一次注入。先验证插件层能按相同 name/provider/正文身份消重，并处理不同注册顺序与同名不同 provider 的负例；只有插件层不足时才提出进一步的 `tool-skill` 变更，不能自行扩大到通用 Skill registry 重构。Host receipt 的字段、生成、工具门禁均不变。

验证需覆盖手动/程序化选择等价、刷新和失败重试、token 删除/修改/重新选择、引用回开和过期 Record 拒绝、不同 provider/注册顺序下的一次注入，以及 P2 矩阵不回退。通过后 P3 单独提交，再按已授权顺序进入 P4、P5。

## 停止依据与保存

用户本轮明确要求：发现需要修改既定架构/契约、扩大 scope 或无法满足阶段验收时立即停止，不自行进入下一阶段。上述公共契约扩展和 Host owner 扩展触发此条件；不是工具权限拒绝，也不是要求重新批准已有 P2 或逐阶段授权。

P0/P1/P2 提交、两仓 P2 分支与已有 savepoint 均保留。P3 分支只保存本报告和诊断证据；harness 产品树恢复为 P2 clean 状态。临时诊断测试仅删除本轮创建且已逐字保存到证据目录的文件，没有广泛 clean。未 push、PR、merge。
