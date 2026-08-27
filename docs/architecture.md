# 架构：DSH 机制映射与改造路径

基于 @deepseek-ai/dsh@0.1.0-rc.7 实际核实（包 README + 源码枚举，2026-08 基线）。

## 1. DSH 运行模型

- Cordis 插件框架 + profile 叠加配置（bundles → 用户 cordis.patch.yml → --patch）。
- client 插件 = 浏览器端 React，`ctx.slots.register/inject` 挂进声明好的 slot；`/plugins` 路由加载 bundle 的 `/client` 导出。
- 双 half 动态插件：cordis_define / cordis_run / cordis_stop —— agent 运行时自举 host half（node:vm）+ browser half（浏览器 UI）。

## 2. 三层改造路径

| 层 | 手段 | 适用 | 持久性 |
|---|---|---|---|
| L0 spike | cordis_define / cordis_run 动态插件 | 验证回路、快速实验 | 进程内存，重启即失，run 需人工审批 |
| L1 插件 | 静态 client / host 插件（fork 的 packages/ 下新包） | 正式工作台 UI 与工具 | 随 profile 持久，构建期固化 |
| L2 内核 | 修改 fork 源码（layout shell、新增整页 slot、tool-presentation 等） | 只有插件层做不了才动 | 随 fork 持久；rebase 成本高，需记录理由 |

## 3. Slot 扩展面（实际枚举）

| 类别 | slot key | 用途 |
|---|---|---|
| 布局 | `details` | 右侧可调宽面板 → 泳道 / 内存 / 硬件面板 |
| 布局 | `shell.overlay` | 全帧浮层 → 全幅计算图 |
| 布局 | `sidebar.*`、`sidebar.settings` | 左侧栏扩展 |
| 布局 | `conversation.input.dock` | composer 下方 dock → 工作台底栏 |
| 内联 | `tool.call.toolview`（按工具名 keyed） | 自定义工具结果卡片（泳道卡片等） |
| 内联 | `conversation.chat.node`（按 kind keyed） | 自定义会话节点 |
| 整层 | `conversation.view` / `conversation` / `model` | 整页替换评估空间 |

> 没有现成的"整页 canvas 主区"slot：全幅主画布需自建 layout seat 或评估 conversation.view（P5.1）。

## 4. 通信通道

- browser → host：`host.call`（invoke，JSON-only）。
- host → browser：WebSocket 下行事件（events.mux / events.host）+ sessionProjections（whole-value JSON 投影）。
- 模型阻塞回路先例：`cordis/request-run`（run 挂起，页面人工审批结算）；`userQuestions.ask()`（ask_user_question 挂起/结算）。
- **canvas → agent 无现成 seam**：自建 `wait_canvas_selection` 类工具，仿 request-run / userQuestions 模式（P4.3）。

## 5. Agent 工具面（条件 1、4 的能力）

bash（含持久 bash）、fs read/edit/glob/grep、read_image、web_search/web_fetch、background jobs（job_output/job_kill）、subagent / subagent_fork、workflow、skill、MCP client、ask_user_question。

## 6. 目标工作台映射

| 条件 | 落点 |
|---|---|
| 1 解读真实数据 | bash + fs 读 program.json / merged_swimlane.json / Pass_*；read_image 自查；数据规则沿用 PyPTOUX |
| 2 自定义面板 | client 插件注册 details / shell.overlay / input.dock；复用 pto-design-system 视觉 |
| 3 选区回流 | 自建 wait_canvas_selection：browser half 捕获 → invoke → host half 结算挂起工具调用 → 结构化 payload 回 agent |
| 4 改码重跑对比 | 持久 bash + background jobs 跑编译；diff 卡片；session fork 保基线；before/after 渲染对比 |

## 7. 首个 PTO 业务纵向切片

第七阶段先固化所有后续工作流共用的 run artifact 准入：

```text
pto_run_discover / pto_run_inspect  （Host 原语）
                    ↓
 pto-analyze / pto-debug / pto-optimize / pto-compare / pto-review
                         （bundled Skills）
                    ↓
       read / bash 等 DSH 通用工具  （按证据能力读取）
```

- Host 原语拥有 PyPTO 3.0 L2/L3 marker、有限扫描、workspace containment、evidence capability、补采 literal、compile health 和 rerun capability 契约。
- `pto-analyze` 拥有性能、精度、编译问题的工作流路由；`pto-debug` 拥有首个失败边界、候选原因与判别动作的只读诊断流程；`pto-optimize` 把已支持的结论转成带源码/config anchor、验证口径、风险和回滚的候选实验；`pto-compare` 先验证跨 run identity，再区分 collected/simulated/projected delta；`pto-review` 把全过程收敛为可审计 claim–evidence–decision 记录。五者都不复制底层识别和 literal 规则。
- 组合边界以用户问题为准：`analyze` 回答“证据显示了什么”，`debug` 回答“显式失败或错误结果为何发生、下一判别动作是什么”，`optimize` 产出 proposal，`compare` 裁决已存在的可比 run，`review` 整理已有决策链。相同 tensor 或 compiler artifact 可被不同 Skill 使用，但 claim 目的与输出职责不能混合。
- 五个命名 Skill 闭合认知与决策链；获授权后的 experiment transaction 由 app-owned Host contract 闭合，绑定不可变 baseline、可恢复 source workspace、environment、声明变更、新 output directory、停止/回滚、authorization receipt 与 actual run identity。app-owned L2 metric adapter 与 comparison Host 原语已消费该 contract，证据门控 UI 继续作为后续 consumer。
- `experiments/pto-experiment-registry-spike/` 已验证状态机；静态 Host package `@deepseek-ai/dsh-pto-experiments` 已把 zod schema、JSON 持久化、proposal/query 与可信 execution admission 固化进 PTO profile。
- 模型面开放 `pto_experiment_plan / get / list / compare`。planning 只写 `planned@revision=0`；identity binding、experiment-bound receipt、reservation、`running` 与 terminal transition 只能由 Host 的单一复合 `execute()` 路径提交，不暴露 bind/authorize/begin/complete 模型工具。`compare` 只从已持久的 app-owned observation 派生结果，不修改 lifecycle。
- `candidate_output` 的 absent observation 不是锁。`ctx.fs.reserveDirectory()` 以 fail-if-present 原子创建空目录；executor 在用户 one-shot 审批后重复 clean Git/PyPTO identity 与 path 检查，占用成功并持久 `running` 后才启动 workload。exit zero 仍必须通过共享 run recognizer 才可 completed；Host 重启后遗留 `running` 会 fail closed 为 failed。
- L2 completion 后的固定 metric adapter 复用 PyPTO 官方 swimlane converter，持久 makespan 与 task/hardware/source/environment/command/artifact identity。只有同一 Workspace 内两个 registered run 的七个比较维度全部匹配时才计算 delta；单次观测无 threshold/repetition rule 时仍为 `inconclusive`。
- 首版不新增 Client renderer；后续 overlay/details 必须消费同一 capability 结果做 evidence gate。
- 首版不提供 `/analyze`：复杂分析属于 Skill，命令只留给无需模型推理的确定性操作。
