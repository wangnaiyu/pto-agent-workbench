# P0 兼容性与 seam 证据

日期：2026-09-04。本记录区分已运行、已读取和设计决策；不把样例目录日期当作 run identity。所有外部镜像与样例均只读消费。

## 固定来源

- `pypto-skills-github`: `af1d7a016ce50ba109c4b4224580a6b758bde7da`。
- `pypto-3.0-github`: `b8165168ec16198fa2b26a0f88b1c08415d5668c`；其 `runtime` submodule 为 `77fa0171c24a4e1c323fb29a6a86239df93edb58`。
- 官方 Skill 入口：`plugins/pypto-user/skills/dependency-redundancy/SKILL.md`。已完整读取它与必需引用 `plugins/pypto-user/lib/dfx/capture.md`，并核对 `agents/openai.yaml` 与 plugin manifest `0.2.0`。
- viewer/tool 实现：`runtime/simpler_setup/tools/deps_viewer.py`，头部声明 CANN Open Software License Agreement 2.0。

## 真实运行

### 小样例

输入为 PTO-TestData 中 `TestPagedAttentionUnroll_Case1_20260624_113522/deps.json`：

- 文件 68,564 bytes，SHA-256 `40b4c9...`；JSON 中 64 个 task、80 条唯一边、133 个 tensor。
- 以系统 `/usr/bin/python3` 直接运行 `deps_viewer.py --format text --transitive-reduction reduced`：删除 0/80，退出码 0，stderr 空。
- 以 `reduced_dataflow` 再运行：删除 0/80，退出码 0，stderr 空。
- 两份文本输出相同：12,504 bytes、570 行，SHA-256 `bd3c713...`。工具添加 perf sidecar 后报告 80 个输出 task。

### Qwen L2 样例

输入为
`20260720-pypto3-qwen3-14b-decode-fwd-l2/raw/_jit_decode_fwd_20260720_010517/dfx_outputs/deps.json`：

- 文件 412,557 bytes，SHA-256 `97ee1e49...`；594 个 JSON task、1,222 条唯一边、62 个 tensor。
- 边来源：`creator=9`、`tensormap=34`、`explicit=1179`；DAG 深度 29。
- `reduced` 与 `reduced_dataflow` 均删除 1/1,222，为 `(1,1) -> (3,287)`；均退出 0 且 stderr 空。
- 两份文本输出相同：113,947 bytes、5,442 行，SHA-256 `4c70df8c...`。工具加入 sidecar 后显示 598 个 task。

上述执行遵循官方 Skill 的必要规则：先检查边来源与深度，同时运行 `reduced` 与 `reduced_dataflow`，单独记录 stderr/cycle，不从拓扑结果推断性能。执行前后样例 hash 不变。

## Viewer 适配

Qwen 样例已有 `deps_viewer.html`：915,634 bytes，SHA-256 `db42e920...`，title 为 `deps.json — 598 nodes, 1222 edges`。HTML 内含交互控件、1 个 script、6 个 SVG 和 1 个 style，未发现外部 `src`/`href`，可按 `static-html` 载入。

本机没有 Graphviz `dot`，因此不声称已现场生成新 HTML。`python -m simpler_setup.tools.deps_viewer` 受子模块中缺失 `simpler` 包影响，但该标准库文本模式脚本可直接运行。

浏览器直连原始样例目录的 HTTP 服务因数据暴露风险未获准，`file://` 又被浏览器安全策略拦截；未绕过该限制。P1 将以 Host 登记的单文件 token route 完成真实浏览器验证，不暴露原始目录。

## 样例兼容矩阵

| 样例 | 已核对事实 | MVP 定位 |
| --- | --- | --- |
| 20251112 three-view | legacy `program.json` / merged swimlane | P3 legacy adapter，不伪装为 3.0 run |
| 20260528 A5 PMU | legacy merged swimlane | P3 swimlane adapter |
| 20260720 Qwen L2 | deps/name map/L2/merged，带预生成 deps viewer | P1/P2 纵向样例 |
| 20260723 runtime drop | markerless Qwen 副本；MoE rank0/rank1 deps/timing/names | P1 evidence-pack + rank adapter |
| 20260804 IR lowering drop | `memory_map.html`、passes，约 305 MiB 的 IR trace HTML，无 deps/timing | P3/P4；大文件不预读 |

## seam 决策

1. 采用静态 plugin 实现持久记录、Host 检查与 viewer route；dynamic spike 不承担长期状态和 first-send 契约。
2. 不修改 shell 内核。`shell.overlay` 是 root-scope list slot，AppFrame 在 SessionProvider 之外渲染。新增回归测试已在无当前 Session 时渲染 overlay；`app-frame.client.spec.tsx` 27/27 通过。
3. viewer 只通过不可猜 token 的 exact-file route 提供，路径必须来自已登记 Record/Profile；不开放原始目录 prefix。
4. 识别结果为 `Record -> Profile -> ActionReadiness`，缺失产物只影响动作可用性，不推断 run 成功/失败。
5. 官方 Skill 必须显式绑定 provider/revision，解析不匹配时 fail closed；不用同名本地 Skill 静默降级。
6. `pypto-skills-github` 根未发现 repository LICENSE，所以当前不把 Skill 资源复制进可分发 runtime。P2 可验证固定本机来源，但发行前必须补充许可与供应链来源。

### 2026-09-04 P2 授权补记

第 6 点是 P0 当时的发行阻塞事实。用户随后明确授权将该固定版本 Skill 与必要资源直接纳入本任务的
可分发 runtime；P2 因而按 `user-authorized` inclusion basis 实施。此授权不把上游未声明的许可伪写成
某种开源许可证，来源 commit、逐文件摘要和风险仍由
[P2 资源闭包审计](p2-official-skill-closure-audit.md)保留。
