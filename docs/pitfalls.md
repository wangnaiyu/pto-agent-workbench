# 已知问题与规避

按类别分组；每条标注影响与规避方式。来源：@deepseek-ai/dsh@0.1.0-rc.7 包 README 与官方 dev 文档（2026-08 基线）。

## 1. DSH 生态与版本

- **P1.1 Developer preview 破坏性变更**：官方明示 "THERE WILL BE COMPATIBILITY-BREAKING CHANGES"。→ 定期 rebase upstream；内核改动最小化（R2）。
- **P1.2 默认分支是 `master`**（不是 main）。→ fetch/rebase 时注意。
- **P1.3 静态 client 插件构建工具未随 npm 发布**：`tsdown.client.ts`（clientBundle preset）只在源码仓 `packages/client/`；"plugin outside this repository has to reproduce that build itself"。→ 带 UI 的插件必须基于源码仓（fork）构建；纯 host 工具（无浏览器半）可独立发布。

## 2. 端口与进程

- **P2.1 端口规划**：官方实例默认 3080；本工作台固定使用 3180（`--port 3180`），两实例并存互不冲突。
- **P2.2 改装实例是独立进程**：改内核 / host 插件需重启实例；`pnpm run dev:web` 只热重载 client bundle（且需该 checkout 跑 dev:web）。

## 3. 动态插件（cordis_define / cordis_run）

- **P3.1 进程内存态**：重启即失；不能自动升级为正式插件；要保留需固化为静态插件。
- **P3.2 run 需人工审批**：带 browser half 的 run 走 `cordis/request-run` 回路，无页面连接时挂起至 turn 取消；**无超时**。headless / 自动化场景不可用。
- **P3.3 browser half 是闭包**：无 JSX / TS / import；符号面仅 `React / console / styles / host`；`setTimeout` / `fetch` / `require` 被 teaching trap 遮蔽。复杂渲染器需内联单文件。
- **P3.4 vm 沙箱不是安全边界**：官方口径 "Treat this toolset like bash access"；`vmTimeoutMs`（默认 5000ms）只限同步段。
- **P3.5 会话作用域**：一个 session 定义的包对其他 session 不存在；`invoke` / 审批是 page-global、无 session 语义。

## 4. 通信与数据通道

- **P4.1 invoke 仅 JSON**：函数 / undefined / class 实例被拒；缺省参数传 null。
- **P4.2 无 host → browser 的 invoke 反向**：host half 要主动推 UI 需走事件 / projection。
- **P4.3 canvas → agent 无现成 seam**：需自建 wait_canvas_selection 类回路（仿 request-run / userQuestions）；这是全项目唯一需要自建 DSH 扩展的点。
- **P4.4 /api 无认证层**：只有 loopback / trustedHosts 信任墙；`--host 0.0.0.0` 不支持。本地 playground 无碍，远程多用户受限。

## 5. UI 与 slot

- **P5.1 无整页 canvas 主区 slot**：details / shell.overlay / input.dock 可拼工作台；全幅主画布需自建。
- **P5.2 外部静态 client 插件要复刻 lazy-CJS factory 格式**（bundle-purity gate 禁止 import 卡片 chrome 值）。
- **P5.3 details 面板几何瞬态**：reload 重置宽度，切换 session 关闭。
- **P5.4 只有 host-plane 插件进 Settings 插件配置页**：preset 内联配置不在其中。

## 6. 工程与协作

- **P6.1 并发写冲突**：两个 agent 勿同时改同一 checkout（未提交工作树锁）。→ 单 checkout 分工，或多 checkout 各自分支。
- **P6.2 官方 DSH 会话沙箱**：会话文件权限只覆盖其工作区；给 repo A 开 workspace 后由该 workspace 的 policy 管辖。
- **P6.3 rebase 是最容易被忽略的活**：fork 后必须指定 owner 定期 rebase upstream。
- **P6.4 构建链较重**：Host tsc → tsdown host → Client tsc → tsdown client → build:web；Node 22.19+ / 24+，pnpm@11.7.0（corepack）。

## 7. 数据与内容

- **P7.1 上游 mirror 只读**：不修改本地 mirror 修正 drift，在文档记录。
- **P7.2 不改写上游 literal**（字段名、文件名、trace key 等）。
- **P7.3 L2/L3 不得伪装成 L1**；L3 不外发；L2 外发必须可见披露。
