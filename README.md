# pto-agent-workbench

把 DeepSeek Harness（`dsh`）改造为 **PTO 算子设计 / 调试 / 调优 / 复盘** 的 Agent 工作台。

- **本工作区 = 工程区**：DSH fork（`harness/`）、静态插件（`plugins/`）、自定义工具（`tools/`）、profile 装配（`patches/`）、spike（`experiments/`）、工程文档（`docs/`）。
- **PyPTOUX = 内容与证据来源**（只读消费）：PTO design system、业务知识、数据契约、L1 素材、数据规则。约定见 `references/PyPTOUX.md`。
- **运行底座 = DSH**：profile + 插件优先，fork 内核改动最小化（rebase 友好）。

## 工作台目标（4 条件）

| # | 条件 | 对应机制（详见 docs/architecture.md） |
|---|---|---|
| 1 | agent 解读 / 分析 / 修复真实运行数据 | bash / fs / read_image / MCP / skills |
| 2 | 自定义 canvas / side panel（计算图、泳道、内存、硬件架构） | client 插件 + details / shell.overlay / input.dock slot |
| 3 | canvas 操作 / 选区 / 标注传回 agent | 自建 `wait_canvas_selection` 类回路（仿 cordis/request-run、userQuestions） |
| 4 | 改码重跑、对比、仿真 before & after | 持久 bash + background jobs + 自定义工具 + session fork |

## 目录结构

```
pto-agent-workbench/
├── AGENTS.md            # 本工作区 agent 入口（角色、规则摘要）
├── README.md
├── harness/             # deepseek-harness fork clone（独立 git 仓库，.gitignore 排除）
├── plugins/             # 静态 client 插件（工作台 UI 面板）
├── tools/               # host 插件（自定义工具）
├── patches/             # profile 装配层（cordis.patch.yml、profile manifest）
├── skills/              # PTO agent 工作流指令 / skills
├── experiments/         # 动态插件（cordis_define / cordis_run）spike
├── notes/               # 决策、review、update 记录
├── references/          # 稳定引用（PyPTOUX.md、sources.md）
└── docs/                # architecture / pitfalls / rules / upstream-rebase
```

## 安装与启动

面向普通用户的发行形式与官方 DSH 一致：机器上只需要 **Node.js 22.19+ 或 24+**（含 npm），然后执行一条命令：

```sh
npx -y @wangnaiyu/pto-agent-workbench
```

launcher 默认在 `http://127.0.0.1:3180` 启动 Web 工作台；也可传入 `--port 4180`。运行时与用户的当前目录、repo 实际下载路径无关，程序与会话数据统一放在 `~/.dsh-pto-workbench/`。

> **发行状态：** 一命令接口已在 macOS arm64 的本地 tarball 上端到端验证通过，但 npm 包尚未正式发布，所以上述命令目前是确定的发行接口，还不是可对外使用的安装命令。发布前还需补齐 macOS / Linux / Windows 构建矩阵与 npm provenance。

普通用户不再需要 Git、SSH key、pnpm、Corepack、源码 clone 或本地全量构建。这也意味着 README 不再保留一份与安装脚本重复的“手工快速开始”。

`npx` 仍需要通过 HTTPS 访问 npm registry；这是单命令方案无法消除的最后一类网络依赖。正式发布会同时提供带校验的 GitHub Release 离线包；TLS/SSL 错误应修复代理或 CA，不应通过关闭证书校验规避。

### 源码开发（发布前的当前入口）

如果要修改工作台，或在 npm 首版发布前从本仓库运行，请使用：

```sh
./setup.sh
./start.sh
```

详细的依赖、镜像与故障排查参见 [`docs/development.md`](docs/development.md)。这是开发者流程，不是面向普通用户的备用安装教程。

## 文档索引

| 文档 | 内容 |
|---|---|
| `docs/architecture.md` | DSH 机制映射：slot 扩展面、通信通道、三层改造路径 |
| `docs/development.md` | 源码 checkout 搭建、启动、网络与镜像配置 |
| `docs/pitfalls.md` | 已知问题与规避（版本、端口、动态插件、通信、slot、协作） |
| `docs/rules.md` | 规则与约定（架构分层、目录、协作、数据、发布、记录） |
| `docs/upstream-rebase.md` | fork 维护与 upstream rebase 流程 |
| `references/PyPTOUX.md` | 消费 PyPTOUX 的只读引用约定 |
| `references/sources.md` | 外部来源与出处 |
| `AGENTS.md` | 本工作区的 agent 入口 |
