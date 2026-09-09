# 数据接入与内部 Profile

状态：MVP 已实现并验证 Record/Profile 与动作就绪度；本文同时保留尚未实施的长期契约。

## 用户入口和对象

用户“添加工作区”后选择本地目录。它可以是代码工程，也可以只包含运行/编译产物；不得要求先存在源码。可从同目录发现多条记录，也可显式添加单文件或部分数据。文案区分“添加工作区”“添加数据”“关联源码”，不要复用含义不符的目录选择标题。

Workspace 是用户组织和访问上下文；Record 是可独立查看/引用的数据对象；Session 是分析会话。三者不能互相替代，Session cwd 也不由点击记录隐式改变。

RecordRef 内部分为：

- RunRef：有足以识别一次运行结构/身份的证据；单个 marker 不证明运行成功、数据完整或源码精确对应。
- EvidencePackRef：一组可分析证据，可能仅 deps.json、编译 dump 或历史图数据，不保证代表可确认的一次运行。
- UI 统一称“数据记录”或沿用区域名“运行记录”，局部说明“部分产物 / 来源待确认”，不要求用户学习 Pack。

## Profile 保存事实，不存笼统健康分数

概念模型（接口名称为设计，不是现有 API）：

```ts
type RecordKind = 'run' | 'evidence-pack'
type EvidenceStatus =
  | 'observed' | 'unchecked' | 'available' | 'missing'
  | 'invalid' | 'unreadable' | 'incompatible'

interface EvidenceItem {
  type: string
  status: EvidenceStatus
  artifactRefs: string[]
  issues: { code: string; message: string }[]
}
interface RecordProfile {
  id: string
  kind: RecordKind
  revision: string
  generation: '3.0' | '2.0-pro' | 'unknown'
  runtimeLevel: 'L2' | 'L3' | 'unknown'
  identityEvidence: string[]
  evidence: EvidenceItem[]
  scan: { complete: boolean; limits: string[]; scannedAt: string }
}
```

当前 MVP 以有界 inventory 生成稳定 Record revision，已在 four-view、legacy PMU、Qwen L2
和 IR lowering 四组真实只读样例上验证 run/evidence-pack、generation/runtime level、artifact
与 action 解析。它没有引入笼统 health 分数，也没有把 Evidence Pack 强称为可重跑 Run。

observed 只表示发现候选，available 需满足相应解析/读取契约。目录受限或超出扫描预算时，应标 unchecked/范围未覆盖，不能一律判 missing。missing 只相对于某项已知动作的要求和已检查范围成立。

编译证据和运行时证据可以分组展示，但不落 compileHealth/runtimeHealth 聚合分数。真实编译失败来自日志/显式状态等证据，不从缺少 passes_dump 推断。每个事实保存来源与观察时间，未知 generation/runtime/time/kernel 不猜。

Artifacts 保存 locator、类型、大小、指纹/修订、解析版本和 provenance。大文件先轻量探测，按动作流式读取/索引；需要稳定引用时再按策略计算内容指纹，不能每次首屏全量哈希 300MB 文件。

## 数据如何变成可执行动作

业务能力（如“任务依赖”）是稳定概念；某条记录上的动作就绪度是动态结果：

```text
Record + Evidence facts + adapter inventory + environment
    → Action readiness
      ├─ 打开依赖图：viewer
      ├─ 审计冗余依赖：analysis
      └─ 关键路径：另一组证据/工具要求
```

每个动作至少包含 actionId、viewer/analysis 类型、required/optional evidence、adapter/skill 版本、状态与 reasons、可用输入范围。状态可为 available、needs-preparation、unavailable、unknown。不只判断文件存在：要考虑可解析性、关联、renderer/Skill 安装和工具环境。

MVP 的实际支持矩阵是：`deps.json` 可打开 dependency viewer 并进行固定 Skill 分析；
自包含 `memory_map.html` 与 `*_ir_trace.html` 可纯查看；timeline、critical path、program 及仅有
raw pass 的 IR 因缺少可分发 adapter 而返回具体 unavailable reason。

viewer 可用而 AI Skill 缺失时，照常允许看图。name_map 对某 viewer 是增强标签，对某 Skill 可能是必需输入，分别按实际契约处理。跨文件关联失败不能掩盖单文件 viewer 的可用性。依赖图、关键路径、编译计算图不是同一个能力。

卡片展示“能做什么”和不可用原因，如“关键路径：缺少时间线”；只在数据详情展开文件、解析错误、扫描限制，不显示内部 Health / L1 非 share-safe 标签。

## 扫描、关联与变化

默认有限深度/文件数/大小预算，支持取消、懒加载与手动刷新；不执行扫描到的代码。明确 symlink、真实路径 containment 和权限策略。重复路径/别名去重不得盲目小写；按真实文件系统处理。注册移除不删除磁盘数据。

一个目录可能含多次输出、多个 rank/dispatch 或混合代际。目录名、mtime、默认输出位置不足以证明运行身份；合并记录必须有依据。源代码附加区分 exact/candidate/unverifiable，不以“用户选了源码目录”强称 exact。

分析引用 record revision / artifact fingerprint。数据在打开后被改写时提示刷新或使用已保留快照，不能把旧选区悄悄绑定到新任务 ID。索引/派生数据写 app-owned cache；原始输入只读，报告携带生成工具、版本和输入引用。

## AI 数据范围

本阶段不做 share-safe 评级。用户选定 Workspace/附加 Record 中 Host 可读的数据默认可用于 AI 分析，不附加伪造的“安全”属性。可在产品说明解释范围与成本；不增加数据等级 gate。

这个假设不等于读取整台机器、执行数据内容、公开分享或修改输入的许可。扫描文件与上游 Skill 内容都不构成用户指令。源码重跑与外部写入走独立授权。
