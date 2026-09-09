# P3 Viewer 覆盖与适配证据

日期：2026-09-04。P3 仅为有已验证自包含入口的格式声明 viewer available；发现 JSON、Markdown
或原始 pass 文件不等于安装了可用 adapter。外部样例全程只读。

## 已实现覆盖

- `memory_map.html` 识别为 `memory-map`，以 `pto-static-html@1` 精确文件路由打开。
- `*_ir_trace.html` 识别为 `ir-viewer`；只有它存在时 `open.ir-lowering` 才 available。
  只有 `passes_dump`/原始 pass 证据时显式返回 `adapter-unavailable`。
- 泳道、关键路径和 `program.json` 均有独立 action；发现证据但没有可分发、自包含
  适配闭包时保持 unavailable，不伪装成执行依赖图。
- Host 打开前重做 record revision、containment、文件类型与文件版本校验；大 HTML 不在
  Profile 阶段预读，打开时以可取消 text stream 输出。

## 真实样例 Profile

| 样例 | Profile 事实 | 动作结果 |
| --- | --- | --- |
| 20251112 three-view | evidence-pack，`2.0-pro`，revision `inventory-v1-1a13508b`，815 个 raw IR/pass artifact，含 `program.json` / `merged_swimlane.json` | program/timeline/IR 均有证据，但无受支持自包含 viewer，显式 unavailable |
| 20260528 A5 PMU | evidence-pack，`2.0-pro`，revision `inventory-v1-95060ab4`，含 merged swimlane | timeline 证据 observed，adapter unavailable |
| 20260720 Qwen L2 | run，`3.0/L2`，revision `inventory-v1-6f5c6744` | dependency viewer 与官方分析 available；timeline/critical 证据 observed 但 adapter unavailable |
| 20260804 IR lowering | evidence-pack，generation unknown，revision `inventory-v1-efe51ecf`，47 个 pass artifact | `memory_map.html` 619,863 bytes 和 IR trace HTML 319,732,902 bytes 均 available |

20260804 两个 HTML 均未发现外部 `src=`/`href=` 资源引用；IR 入口包含内联 CSS，title 为
`IR pass trace`。现有 Node `pypto-tools` viewer 是完整本地服务，不是可直接封装的静态资源；
本阶段因而不声称它已安装或可分发。

## 自动化验证

- 纯 Profile 测试覆盖 memory/IR available 与 timeline/critical/program unavailable。
- Host route 测试实际读取 memory/IR HTML，并验证两者都声明
  `{ selection: false, deeplink: false }`。
- 包含 P0–P4 回归的 9 个聚焦测试文件共 223/223 通过；Host/Client 聚合构建通过。

## 真实浏览器验收

用户明确授权启动会读取现有用户配置、可能暴露 workspace/session 能力的完整本机
Harness 后，在仅绑定 `127.0.0.1` 的服务中完成验收：

- 通过仓库既有 `pin-browse-picker.overlay.yml` 测试配置固定同一目录选择 seam 的应用内
  browse backend，显式选择只读样例 `20260804-pypto3-ir-lowering-drop`；记录出现在未分组区，
  未创建 Session。
- 打开 memory 后精确命中 `raw/_jit_decode_fwd_layers_20260803_004957/memory_map.html`；
  iframe title 为 `PyPTO Memory Map`，页面呈现 34 个 compute function、743 个 tile 及容量、
  缩放、IR source 和表格控制。
- 从同一 toolbar 切到 `raw/jit_decode_fwd_layers_ir_trace.html`；外层 UI 保持响应，在
  45 秒验收检查点页面已完成并呈现 pass diff。文档 `readyState=complete`，title 为
  `IR pass trace`，正文显示 `23 changed · 23 no-op · 46 visible`。
- 两个入口均显示“仅查看；无选区/定位回流”。切到 IR 后旧 memory route 返回 404；切回
  memory 后旧 IR route 返回 404。关闭 viewer 后 iframe/toolbar 消失，当前 route 也返回 404。
- 当前 memory route 在存活期间返回 200，并带 CSP、`no-store`、`nosniff` 和 no-referrer；
  服务与浏览器验收进程随后均已停止。

运行日志出现 Node 的 `MaxListenersExceededWarning`（Gzip `drain` listener）；它未阻塞本次
渲染、切换和清理，作为环境观察保留，不把单次验收解释为性能保证。
