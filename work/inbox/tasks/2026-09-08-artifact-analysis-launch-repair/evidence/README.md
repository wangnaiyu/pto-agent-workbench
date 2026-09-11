# 证据索引

解释和分类以 [P0 报告](../p0-report.md) 为准，当前进度只看 [status](../status.md)。本目录不授予执行权限。

## P0：2026-09-11 升级后取证

| 证据 | 用途 |
| --- | --- |
| [baseline](p0-baseline.json)、[final state](p0-final-state.json) | 两仓 SHA、tag/savepoint、远端和工作树核对 |
| [prior assumptions](p0-prior-assumptions.md) | 升级前假设与本轮待证问题；最终分类见报告 |
| [A Host](p0-a-host-trace.jsonl)、[B Host](p0-b-host-trace.jsonl)、[C Host](p0-c-host-trace.jsonl) | 实际配置、仅补 provider、文本/模型失败/目标切换对照 |
| [model trace](p0-model-trace.jsonl) | 本机模型替身收到的实际上下文与真实工具返回；无外部模型质量声明 |
| [Session events](p0-session-events.json) | 全部完整 Zstd frames 解码后精选的持久事件/receipt/Skill source |
| [closure hashes](p0-closure-hashes.json) | 实际 patch/build、固定 Skill/Python、只读 deps.json |
| [attachment](p0-attachment.json) | 通用文件从草稿到 Session，输入/存储 hash 一致 |
| [layout Host](p0-layout-host-trace.jsonl)、[metrics](p0-layout-metrics.json) | 真实服务 3 条 durable planned 提案及多 viewport/手柄/侧栏几何 |
| [default](p0-layout-default.png)、[1600](p0-layout-1600.png)、[900](p0-layout-900.png)、[700](p0-layout-700.png)、[sidebar](p0-layout-sidebar.png) | 有内容实验页的视觉证据；仅 planned 状态 |
| `p0-*-dom.txt` | 首发、重试、relaunch、未发草稿/刷新、Workspace 和附件的实际 DOM |
| [focused tests](p0-focused-tests.txt)、[run tools](p0-run-tools-tests.txt)、[controller proof](p0-controller-proof.json)、[validation](p0-validation.json) | 实际执行命令、检查层级和结果 |
| [instrumentation](p0-instrumentation.md)、[test-only source](p0-instrumentation/README.md) | 隔离方式、唯一 A/B 差异、可复用观测代码 |
| [teardown](p0-teardown.json) | 本轮服务退出、浏览器关闭与保留临时数据的范围 |

记录保留完整 Session/request/Record 标识；只去掉临时 Viewer 路由，未把身份差异归一化。Session 证据不复制完整系统提示或全部 Skill 正文，保留 source、必要分析文本和正文 hash。未复制原始大数据、认证 URL 或真实凭据。

## P1

正式 provider 装配修复及无临时 provider patch 的真实首发验收见 [P1 证据](p1/README.md)。上面的 P0 记录保留为历史对照。
