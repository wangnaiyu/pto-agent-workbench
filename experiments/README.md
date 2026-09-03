# experiments/ — 动态插件 spike

- `pto-experiment-registry-spike/`：验证 app-owned experiment record、状态迁移、Workspace containment、候选输出覆盖防护与跨动态插件重启持久化；不执行真实 workload。
- `pto-experiment-dashboard-spike/`：验证跨实验面板的 Session 寻址、只读投影和 live-Agent 执行权限边界。

用 `cordis_define` / `cordis_run` 验证回路（无需重启、无需构建）：

- 泳道图面板注入 details slot
- `wait_canvas_selection` 最小回路
- before/after 对比卡片

记录要求：每个可复验 spike 留自己的 README，注明验证结论与是否固化；长期产品判断回写对应 work/product 主题，过程状态进入相关任务包。不重建根 notes。目录与记录规则见 [内容路由](../work/docs/content-routing.md)。动态插件是进程内存态，重启即失。
