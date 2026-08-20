# 规则与约定

编号 R 开头，与 AGENTS.md 摘要对应。

## 1. 架构分层（最高优先级）

- **R1 改造优先级**：动态插件 spike → 静态插件（packages/ 新包）→ 内核改动（需记录理由）。
- **R2 依赖单向**：本工作区消费 PyPTOUX（只读）；PyPTOUX 不反向依赖工程区。
- **R3 新能力先验证再固化**：任何 canvas 回路 / 工具先 experiments/ spike，验证后固化静态插件。

## 2. 目录与命名

- **R4** 目录名英文 kebab-case；正文默认中文；canonical 文件名：README.md / architecture.md / pitfalls.md / rules.md / sources.md / story-YYYY-MM-DD.md。
- **R5** 结构：plugins（client）/ tools（host）/ patches（装配）/ skills / experiments / notes / prompts / references / docs。

## 3. 编码 agent 协作

> 多 agent 协同规则暂不预设（原"双 Agent 分工"已移除，decision 见 notes/decision-2026-08-20-drop-dual-agent-division.md）；待工作流实际跑通后复盘沉淀。

- **R6 同一 checkout 单 writer**；交接先 commit / merge；多 checkout 各自分支。
- **R7 接手流程**：先读本工作区 AGENTS.md → docs/pitfalls.md → 按任务参考 PyPTOUX skill。

## 4. 数据与事实

- **R8** 数据三级策略沿用（L1 / L2 / L3），登记与披露规则同 PyPTOUX。
- **R9** 技术事实回权威来源（pypto 本地镜像 / 官方文档）；issue 只证明反馈出现，不证明 API / 性能。

## 5. 发布

- **R10** 成熟 demo：compute-graph-viewer fork PR；个人页：wangnaiyu.github.io。
- **R11** 发布前 share-safe 检查 + 数据等级披露。

## 6. 记录

- **R12** prompts/ 存可复现复合 prompt；notes/ 记决策、状态、验证与待办，记录规则与命名见 notes/README.md。
- **R13** 结构性决策（内核改动、新增 slot、通信 seam）必须写 decision 记录。
