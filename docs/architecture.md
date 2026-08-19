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
