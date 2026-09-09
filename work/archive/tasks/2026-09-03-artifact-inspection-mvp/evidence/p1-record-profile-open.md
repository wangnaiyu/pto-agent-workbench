# P1 Record/Profile 与通用打开证据

日期：2026-09-04。P1 实现、自动化验证与真实浏览器验收均已完成。

## 已实现契约

- 在现有 `tool-pto-run` 中加入只读 `Record -> Profile -> ActionReadiness` 识别层，兼容 marker
  run、markerless evidence-pack 与旧记录；缺少产物只降低动作可用性，不推断 run 失败。
- Profile 保留可核验的相对路径、Host 文件版本、大小、证据状态、扫描截断原因与 revision；
  `deps.json` 仅在大小上限内浅校验，HTML 不执行。
- 新增 Host `ptoArtifactInspection` Remote：只有显式选择的目录可登记；打开前按 revision
  重新检查；只为当前可用的自包含 HTML 注册随机 token 的 exact route；关闭或插件卸载即撤销。
- Viewer route 不提供目录 prefix，拒绝非 GET/HEAD，使用 `no-store`、`nosniff`、
  `no-referrer` 和 sandbox CSP；文件版本变化时返回 409。
- Workspace browser 的旧 run record 入口保持可用，点击记录可在根级 `shell.overlay` 打开 viewer，
  不要求或创建 Session；loading、error、close 和 late-result cleanup 都由 root-scoped controller 管理。
- 当前首选动作依次为 dependency graph、memory map；viewer 明确声明 selection/deeplink 不支持。

## 已运行验证

- 六个聚焦测试文件共 131/131 通过：纯识别/Profile、Host exact-route 生命周期、Client controller、
  Workspace record/keyboard 行为和无 Session 的 root overlay。
- Host 与 Client 聚合 TypeScript 检查均退出 0。
- package dependency policy 通过：55 个包符合发布依赖规则。
- Client 全量 `tsdown` 退出 0；补齐 `zod` 运行时依赖并刷新冻结 workspace 链接后，
  `UNRESOLVED_IMPORT` 不再出现。
- `apps/web` 生产 Vite 构建退出 0；仅有既有 Vite 迁移与 chunk-size 警告。
- 真实 Qwen L2 样例经纯识别层得到 run、3.0、L2、revision
  `inventory-v1-6f5c6744`，识别 dependency graph/viewer、timeline、name map 和 critical path，
  `open.dependency-graph` 为 available。样例保持只读。
- `git diff --check` 在外层与 harness 均通过。

## 真实浏览器验收

用户知悉完整 Harness Web 同时暴露本机 workspace/session 能力后明确授权。验收服务仅绑定
`127.0.0.1` 的 OS 随机端口，使用 `--no-open`，并通过既有环境判断选择 Web 内目录浏览；结束后
以 SIGINT 关闭，退出码 130 符合用户中断。

- 从运行记录页显式选择真实 Qwen L2 的 `_jit_decode_fwd_20260720_010517` 目录，记录登记成功，
  未创建 Session。
- 点击记录后 root overlay 打开 `dfx_outputs/deps_viewer.html`。iframe 实际呈现图、图例及交互提示，
  可见统计为 598 nodes / 1,222 edges；toolbar 显示精确相对产物路径。
- 关闭查看器后 iframe 与 toolbar 均从 DOM 消失，Client 已调用 Host close 释放当前 handle。
- 验收中发现导入按钮只在 mouse hover 时显示、分组行不可聚焦。已补充 run-record group 的
  `tabIndex`、Enter/Space toggle 与 focus 显示规则，并加入回归断言；这使唯一导入入口可由键盘到达。
- 在服务运行期间重建 Client 后的页面 reload 产生 dynamic inspector Remote 取消日志；这些日志发生在
  live rebuild/reload 边界，未阻止 record inspect、exact route、iframe render 或 close。服务退出时另有
 既有 Gzip `MaxListenersExceededWarning`，不归因于 viewer 路径，作为环境观察保留。
