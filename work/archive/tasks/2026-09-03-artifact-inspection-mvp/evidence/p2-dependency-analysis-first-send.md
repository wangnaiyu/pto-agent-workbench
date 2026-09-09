# P2 依赖分析 first-send 闭环证据

日期：2026-09-04。P2 以固定官方 Skill、固定官方工具、真实 Session scope 准入和只读真实样例为边界；
不修改样例、PyPTO 源码或官方镜像。

## Runtime 固定内容

- 官方 Skill provider：`pypto-official-af1d7a016ce5`；完整 commit
  `af1d7a016ce50ba109c4b4224580a6b758bde7da`。
- runtime 保留 `SKILL.md`、`agents/openai.yaml` 和必需引用 `lib/dfx/capture.md` 的固定目录与逐文件
  SHA-256；registry/lock 将纳入依据记录为 `user-authorized`，许可状态仍为
  `not-declared-upstream`。详见 [资源闭包审计](p2-official-skill-closure-audit.md)。
- 官方工具来自 PyPTO runtime commit
  `77fa0171c24a4e1c323fb29a6a86239df93edb58`，runtime 同时保留原脚本头部和上游 `LICENSE`；
  工具 SHA-256 为 `24b1c5c...`，许可证 SHA-256 为 `1da223...`。
- 部署使用独立 provider instance；工作台自有 `pto-bundled` 同名内容不能替代上述 qualified identity。

## 已实现契约

- Skill registry 新增 `getQualified({ name, provider }, scope)`：只有当前 scope 的有效 winner provider
  精确匹配才返回定义；同名 shadowing 会抛出 mismatch，禁止静默降级。
- Viewer 中的分析动作生成结构化 browser draft；只有用户首次发送并物化真实 Session 后，Host 才校验
  request-id、Session、record、revision、action 和 Skill 三元组。
- request-id 重放同一 payload 返回同一不可变回执；换 payload 会拒绝。准入成功后，首个模型 step 注入
  `pto-artifact-analysis` 上下文和带实际 provider 的 `skill-invocation` 内容。
- 模型工具 `pto_dependency_redundancy` 只能读取该 Session 已准入的同一 record/revision，输入必须位于登记
  Record 内；输出仅写 app-owned 目录。它固定执行 `reduced` 与 `reduced_dataflow` 两种模式，分别保留
  headline、冗余边、stderr/cycle 状态、输出引用和结论限制。
- 分析草稿和 Session 物化不关闭 viewer，因此首次发送期间原图和其浏览状态保留；当前静态 HTML 适配器
  仍明确声明 selection/deeplink 不支持。

## 自动化验证

- Host/Profile/Client/root-overlay/Skill/tool-skill 八个聚焦测试文件共 206/206 通过。
- Host 准入测试覆盖精确 Skill 三元组、request-id 幂等与篡改拒绝，并通过真实 `agent/pre-step`
  waterfall 验证结构化回执和 provider-qualified Skill 内容被注入。
- Skill registry 测试覆盖同名不同 provider 的 fail-closed 行为；tool-skill 测试覆盖调用来源记录实际
  provider。
- Host 与相关 Client TypeScript 检查通过；package dependency policy、workspace constraints、tsconfig
  paths 与 Cordis catalog 检查通过。

## 真实 Qwen Host→工具验证

固定输入为 Qwen 样例中 markerless `dfx_outputs` 目录；Host 将它登记为 evidence-pack，revision 为
`inventory-v1-557be9e7`。这是刻意选择的最小 Record 边界，不冒充父目录的 3.0/L2 run identity。

验证使用 runtime 内 vendored 脚本、真实 LocalSubprocessRuntime、真实 ToolRuntime 和 Host Remote 准入，
只有 Agent/Skill lookup 使用固定测试 scope：

- 回执绑定 record revision、官方 Skill commit 和工具 commit；ToolRuntime 结果 `isError=false`。
- `reduced`：`removed 1 redundant edge(s) of 1222 (1221 kept)`。
- `reduced_dataflow`：`removed 1 redundant edge(s) of 1222 (1221 kept)`。
- 两种模式均定位 `(1, 1) -> (3, 287)`；stderr 空，`cycleWarning=false`。
- 两份派生文本均为 113,947 bytes、5,442 行，只写入 `/private/tmp/pto-p2-analysis/...`；验证后清理。
- 输入 `deps.json` 的 SHA-256 复核为
  `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`，与 P0 前值一致。

报告限制保持显式：这是一个捕获图和一种拓扑；删除冗余依赖本身不能证明测得的性能提升。
