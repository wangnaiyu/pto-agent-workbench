# 消费 PyPTOUX 的约定

PyPTOUX（/Users/wny/Documents/1 项目 Projects/PyPTOUX）是内容与证据来源，**只读消费**。

## 常用引用

| 内容 | 路径 |
|---|---|
| PTO design system（tokens / patterns / preview） | `.agents/skills/pto-design-system/` |
| PyPTO 架构 / 编译链路 | `02-knowledge/00-shared/pypto-architecture/` |
| 数据 schema 与契约 | `02-knowledge/00-shared/pypto-data/` |
| 泳道 / 性能分析知识 | `02-knowledge/02-swimlane-profiler/`、`04-uxdesign/02-swimlane-profiler/` |
| 计算图知识 | `04-uxdesign/07-runtime-execution-graph/` |
| 硬件架构知识 | `02-knowledge/00-shared/ascend-a5-950-hardware/` |
| 双 Agent 协作 / 内容路由 / 发布约定 | `09-docs/01-conventions/` |
| 权威来源登记 | `.agents/skills/pypto-knowledge-source/references/sources.md` |

## 规则

- 只读：不在 PyPTOUX 里写工程代码；发现 drift 在工程区文档记录。
- 数据规则完整沿用（L1/L2/L3、不改写上游 literal、sources 留痕）。
- 视觉：工作台 UI 复用 pto-design-system tokens/patterns；开发期按路径引用，构建期固化快照。
- 外发路径不变：compute-graph-viewer fork PR / wangnaiyu.github.io。
- 双 Agent 分工沿用：Codex（规划/事实/构建/Git）、Claude（前端/视觉/交互）。
