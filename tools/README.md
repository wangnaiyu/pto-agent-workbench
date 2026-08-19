# tools/ — host 插件（自定义工具）

目标工具（示意）：

| 工具 | 用途 |
|---|---|
| `wait_canvas_selection` | 条件 3：挂起等待 canvas 选区/标注，返回结构化 payload（需自建 seam） |
| `render_swimlane` / `render_graph` | 条件 2：把数据渲染成会话内卡片或面板 |
| `rerun_compare` | 条件 4：改码后重跑并对比 before/after |

- 实现位置：fork 的 `packages/` 下新包（host 半）。
- 通信：browser → host 走 `invoke`（JSON-only）；host 半可用 ctx.fs / ctx.bash / ctx.web。
- 当前状态：待起步。
