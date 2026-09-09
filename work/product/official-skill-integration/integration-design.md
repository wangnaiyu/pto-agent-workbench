# 官方 Skills 集成设计

状态：dependency-redundancy 的最小固定 bundle、qualified resolver 和真实调用闭环已实现；
下面的通用 source registry、更新/回退和多 Skill 管理仍是目标契约。

## 四层分离

1. Source registry：开发端登记仓库、许可、来源类别、相对 Skill 根、关联工具、选用/排除范围。
2. Release lock / bundle：固定 source commit、完整资源闭包及 hash、兼容工具版本；构建不可变产物。
3. Runtime provider：发现已发布 bundle、返回 Skill 正文与资源路径，固定 scope，不触发上游更新。
4. Analysis action：将 Record/Artifact 引用、具体 Skill/tool 版本及用户问题传给真实 Session，记录调用回执。

开发项目 Skill 位于根 .agents/skills；现有产品自有 Skills 位于 skills/bundled。官方 Skill
bundle 是另一条明确来源的装配，不把整个开发目录/外部仓库扫进运行时。MVP 已把
dependency-redundancy 的固定内容放入 `skills/official`，并把配套标准库工具放入 Host runtime
资源；运行时不依赖用户机器上的镜像或临时安装。

## 选择官方资源

优先验证 pypto-skills-github 的 dependency-redundancy、critical-path-analysis。generate-ir-trace 等作为后续候选；构建、设备运行、环境安装、源码改写等 Skill 不默认启用。cannbot-skills 内不同组来源分别确认；一个仓库下的全部内容不天然拥有同样官方身份。

读取 SKILL.md 及其引用的 lib、references、scripts；例如 ../../lib/dfx/capture.md 的相对关系必须保留。可按 plugin 子树原样携带或构建经验证的资源闭包，不能把所有 SKILL.md 平铺。显式注册 skills 子目录，不把仓库根当可被 provider 自动递归发现的 skill root。

Skill、agent preset、plugin/MCP 是不同包形态，按各自可信适配器接入。不会因文件名叫 plugin.json 就自动启用 hooks、安装器或远端服务。保留上游 literal，工作台路由/权限/输出适配放独立 wrapper；确需 patch 时登记差异与测试。

## Provider 与调用一致性

当前 DSH 目录和 skill 工具存在按 name + scope 解析的行为，同名 workspace/user/provider Skill 可覆盖。菜单上看到官方标签，不能保证执行时仍是同一份。需要在共享调用路径校验 requested provider、Skill 名、bundle revision/hash 与实际解析结果；不一致就失败并提示，不 silently fallback。

MVP 采用 qualified Skill request 与 resolver seam，first-send 校验 provider、名称和 revision；
不匹配即 fail closed，不用 prompt 文字替代身份校验。后续通用 registry 仍复用这条解析边界。

Viewer 发起的分析在输入区显示规范 `/skill dependency-redundancy`，使用户理解它等价于手动
选择 Skill；内部 attachment 仍固定 qualified provider/revision。可见 `/skill` 与 PTO admission
表达同一个调用意图，最终只能产生一次 Skill 注入：不能只按名称绕过 qualified 校验，也不能
让通用 `/skill` 与 PTO bridge 各注入一遍。provider/revision 默认不在输入区展开，可在引用详情
或 Session 审计中查看。

provider 缓存、instance scope 和 list/get 读取生命周期必须一起审计。watch=false 只是不监听，不保证 fresh get 读取的资源不可变。发布 bundle 本身只读不可变，已有 Session 固定 bundle revision；恢复时缺旧 bundle则明确冲突，不改为最新。

## 工具和证据

Skill 文本可加载不表示可执行。每项动作检查配套 tool commit/API、Python/依赖/服务、输入 schema、rank/dispatch 关联与输出写入范围。官方 repo root/tool root 不从 Session cwd 猜测；Host 用已解析 locator，且记录实际路径/版本。

调用回执建议包含 invocation/request ID、session/action ID、selected Skill identity、实际 bundle/tool tuple、Record revision、输入 artifact refs、命令/结果引用与限制。日志最小化，只记录必要事实，不复制完整大数据或凭据。

分析用临时派生文件写到明确 app-owned 输出目录，保留输入 provenance。读数失败、缺依赖、官方工具 fallback 都应体现在动作或结果中，不把自然语言解释当运行证明。

## 既有自有 Skills 的迁移

现有 intake/analyze/debug/optimize/compare/review 可以继续承担工作台路由与报告组织，具体算法优先调用官方能力。先逐项审计旧数据级别、run-only 假设、重复知识和命令依赖，再决定保留、薄封装或替换；不能一次全部删除。

本次只修改开发说明的“官方”误称；runtime 内容保持原位，实际策略对齐列为后续 P0/P1 工作。自动化测试应覆盖同一记录在 Viewer、自有 Skill、官方 Skill 之间一致的能力判断。
