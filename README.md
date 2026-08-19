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
├── prompts/             # 可复现复合 prompt
├── references/          # 稳定引用（PyPTOUX.md、sources.md）
└── docs/                # architecture / pitfalls / rules / upstream-rebase
```

## 环境要求

| 依赖 | 版本 | 说明 |
|---|---|---|
| Node.js | 22.19+ 或 24+ | 官方要求（DSH developer preview） |
| pnpm | 11.7.0（repo pin） | 通过 corepack 提供，无需全局安装 |
| git | 任意较新版本 | clone fork 与构建 |
| 磁盘 | ≥ 10GB 空闲 | 依赖 + 全量构建产物 |

## 在新机器上安装（bootstrap）

```sh
git clone git@github.com:wangnaiyu/pto-agent-workbench.git
cd pto-agent-workbench
./setup.sh        # 环境检查 → pnpm shim → clone fork → install → build（首次较慢）
./start.sh        # 启动工作台 http://127.0.0.1:3180（可传端口参数，如 ./start.sh 4180）
```

`setup.sh` 会：

1. 检查 git / node 版本（< 22.19 直接报错退出）；
2. 确保 pnpm 可用：`corepack enable --install-directory ~/.local/bin`（装到用户目录，避免 `/usr/local/bin` 权限问题；已装 pnpm 则跳过）；
3. clone fork `wangnaiyu/deepseek-harness` 到 `harness/` 并添加 `upstream` remote；
4. `pnpm install` + `pnpm run build`（全量构建）。

> `harness/` 在 `.gitignore` 中，是独立 git 仓库，不会随本仓库推送。

## 手工快速开始（等价于 setup.sh）

```sh
# 1. fork deepseek-ai/deepseek-harness 后 clone 到 harness/
cd harness
# 2. 依赖与构建（Node 22.19+ / 24+，pnpm@11.7.0 via corepack）
corepack enable
pnpm install
pnpm run build
# 3. 启动改装后的工作台（固定端口 3180，与官方实例 3080 互不冲突）
pnpm dsh --profile web --port 3180
```

> 官方 DSH 实例（默认 3080）可继续作为开发工具并行运行；改装实例使用独立端口 3180，两者互不干扰。

## 文档索引

| 文档 | 内容 |
|---|---|
| `docs/architecture.md` | DSH 机制映射：slot 扩展面、通信通道、三层改造路径 |
| `docs/pitfalls.md` | 已知问题与规避（版本、端口、动态插件、通信、slot、协作） |
| `docs/rules.md` | 规则与约定（架构分层、目录、协作、数据、发布、记录） |
| `docs/upstream-rebase.md` | fork 维护与 upstream rebase 流程 |
| `references/PyPTOUX.md` | 消费 PyPTOUX 的只读引用约定 |
| `references/sources.md` | 外部来源与出处 |
| `AGENTS.md` | 本工作区的 agent 入口 |
