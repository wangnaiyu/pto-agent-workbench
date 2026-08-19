# plugins/ — 静态 client 插件（工作台 UI）

目标面板：泳道图、计算图、内存使用、硬件架构。

- 实现位置：fork 的 `packages/` 下新包（client 插件需 `dsh.client` 导出）。
- 挂载 slot：`details`（右栏）、`shell.overlay`（全幅浮层）、`conversation.input.dock`（底栏）。
- 视觉：复用 PyPTOUX pto-design-system tokens/patterns。
- 当前状态：待起步（先 experiments/ 验证回路）。
