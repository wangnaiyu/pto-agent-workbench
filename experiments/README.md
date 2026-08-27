# experiments/ — 动态插件 spike

- `pto-experiment-registry-spike/`：验证 app-owned experiment record、状态迁移、Workspace containment、候选输出覆盖防护与跨动态插件重启持久化；不执行真实 workload。
- `pto-experiment-dashboard-spike/`：验证跨实验面板的 Session 寻址、只读投影和 live-Agent 执行权限边界。

用 `cordis_define` / `cordis_run` 验证回路（无需重启、无需构建）：

- 泳道图面板注入 details slot
- `wait_canvas_selection` 最小回路
- before/after 对比卡片

记录要求：每个 spike 留 README 或 notes/story-YYYY-MM-DD.md，注明验证结论与是否固化。动态插件进程内存态，重启即失（P3.1）。
