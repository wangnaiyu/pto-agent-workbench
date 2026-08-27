# tools/ — host 插件（自定义工具）

目标工具（示意）：

| 工具 | 用途 |
|---|---|
| `pto_run_discover` | 在当前 Session workspace 内按内容标记有限深度发现 PyPTO 3.0 L2/L3 run |
| `pto_run_inspect` | 检查一个 run 的 evidence、补采 literal、compile health 与 rerun capability，不读取内容或推断因果 |
| `pto_experiment_plan` | 持久化绑定 baseline/source/candidate/控制条件的 Workspace experiment proposal，不授权或执行 |
| `pto_experiment_get` / `pto_experiment_list` | 查询当前 Workspace 的持久 experiment 记录 |
| `pto_experiment_compare` | 仅在 app-owned metric/task/hardware/environment/command/source/change-set identity 全部匹配时比较已完成 baseline/candidate |
| `wait_canvas_selection` | 条件 3：挂起等待 canvas 选区/标注，返回结构化 payload（需自建 seam） |
| `render_swimlane` / `render_graph` | 条件 2：把数据渲染成会话内卡片或面板 |
| `rerun_compare` | 条件 4：改码后重跑并对比 before/after |

- 实现位置：fork 的 `packages/` 下新包（host 半）。
- 通信：browser → host 走 `invoke`（JSON-only）；host 半可用 ctx.fs / ctx.bash / ctx.web。
- 当前状态：`@deepseek-ai/dsh-tool-pto-run` 与 `@deepseek-ai/dsh-pto-experiments`
  已装配进 PTO profile；后者向模型提供 proposal/query/comparison，并向可信 Host 提供不可拆分的
  identity/approval/reservation/execution/terminal 准入回路。app-owned L2 metric adapter 与 comparison Host 原语已完成；画布与渲染仍待后续切片建设。
