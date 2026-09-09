# P2 官方 Skill 闭包与调用 seam 审计

日期：2026-09-04。此记录保存 P2 开始时的闭包与许可审计，以及随后获得的明确产品授权；不把该授权描述成上游许可证。

## 固定候选来源

- 本地只读镜像：`pypto-skills-github`，remote 为
  `git@github.com:hw-native-sys/pypto-skills.git`，HEAD
  `af1d7a016ce50ba109c4b4224580a6b758bde7da`，工作树干净。
- 目标 Skill：`plugins/pypto-user/skills/dependency-redundancy/SKILL.md`。
- 必需相对引用：`plugins/pypto-user/lib/dfx/capture.md`；因此只复制或挂载 Skill 目录并不构成资源闭包。
- 配套 viewer/tool 来自独立固定的 `pypto-3.0-github` runtime submodule，P0 已记录其版本与真实输出。

## 许可复核

对整个 `pypto-skills-github` 工作树查找大小写不敏感的 `LICENSE*`、`COPYING*` 与 `NOTICE*`，
没有结果；目标 `SKILL.md` 与引用资源也没有文件级许可声明。仓库来源或“官方”身份本身不授予复制、
修改或再分发权。

初次审计时，既有授权只允许继续只读检查和本机测试，不能默认把 Skill 正文及 `lib` 资源复制进
工作台可分发 runtime，也不能生成一个内容相同但换名的 wrapper 来规避来源许可。

用户于 2026-09-04 随后明确决定：“可以把 skill/资源直接纳入可分发 runtime。”因此本任务可把固定
版本的目标 Skill 与必要资源闭包直接纳入发行内容。registry/lock 必须把许可状态记录为
`not-declared-upstream`，把纳入依据单列为 `user-authorized`，并固定来源 commit 与内容摘要；不得由此
推导或伪写 MIT、Apache-2.0 等上游未声明的许可证。若未来正式获得上游许可，应通过独立更新审计替换
该状态，而不是改写本次历史证据。

## 现有 first-send seam

- browser draft 直到第一次发送才由 `uiWorkspace.materializeSessionDraft()` 创建真实 Session；同一 draft
  revision 的并发物化会合并。
- draft 输入在 Session 创建后迁移到正式 shell，再调用所有 input-trigger source 的
  `admitMaterialized()`；拒绝会保留正文并在可见 Session 上显示错误。
- `ui-composer-catalog` 会在 first-send 重读 Session catalog，并校验 `/skill <name>` 的来源与调用策略
  是否相对草稿快照改变。
- Host 的 user-explicit `/skill <name>` 最终仍按 name + 有效 scope 解析 winner；当前参数不携带
  expected provider、bundle revision 或 content digest。同名 workspace/user/provider Skill 因此可能覆盖。

## 所需最小实现 seam

P2 不能只靠 Prompt 要求模型“使用官方版本”。至少需要：

1. 结构化 analysis draft attachment，携带 record id/revision、artifact refs、action id 和 requested
   Skill provider/revision；原始图数据不进入正文。
2. first-send admission 在创建的 Session scope 中重检 record revision、action readiness、Skill
   provider/revision 与 tool tuple；失败保留正文且不发模型请求。
3. user-explicit Skill 注入或专用可信调用入口按 qualified identity 加载 exact definition；name-only
   winner 不匹配时 fail closed，不 silent fallback。
4. Session/分析回执记录实际 Skill/tool tuple、record revision、输入 refs、工具输出 refs 与限制。

用户已授权固定 Skill/资源闭包进入可分发 runtime；前 1–4 项因此可直接针对该固定 provider 实现并
完成真实正向验收。配套工具若来自独立来源，仍须单独保留其版本、许可与内容摘要事实。
