# PTO Agent Workbench

基于 DeepSeek Harness（DSH）的 PTO 算子设计、调试、调优与复盘工作台。

工作台把会话、运行记录与专用工具放在同一界面中，逐步连接已有算子数据、可视化和 AI 分析。底座采用 DSH profile 与插件扩展。

## 当前能力与边界

- 工作区分组、会话与运行记录入口。
- Commands / Skills 草稿目录，以及首次发送时的上下文准入。
- 工作台自有 PTO 分析、诊断、优化、比较与复盘 Skills。
- 受授权约束的实验记录、执行与比较面板。

这些是当前源码包含的切片，不代表覆盖所有 PyPTO 数据与设备环境。既有泳道、依赖图、内存/IR 可视化的统一打开，以及上游官方分析 Skills 的固定版本接入，仍在开发规划中。

## 安装与启动

发行目标是预构建运行时：用户只需兼容的 Node.js，通过 npm launcher 启动工作台。仓库记录的发行状态仍为本地包验证阶段，尚未确认正式发布；目前不要把目标 npx 接口视为已可用安装方式。

当前可从源码运行。在仓库目录执行：

```sh
./setup.sh
./start.sh
```

需要 Node.js 22.19+ 或 24+（不支持 Node 23）、Git，以及访问依赖源的网络；setup 会下载依赖并构建。start 使用已构建的 CLI，默认打开服务地址 http://127.0.0.1:3180；可用 `./start.sh 4180` 改端口。

工作台使用独立的 `~/.dsh-pto-workbench/` 保存会话与凭据，与 DSH 默认目录分离。模型凭据通过工作台配置，不要写入项目文件。

## 技术组成

- harness：DSH fork，包含静态 Host / Client 实现。
- patches：PTO profile 装配。
- skills/bundled：工作台随附的运行时 Skills；不等同于 PyPTO 上游官方 Skills。
- plugins、tools、experiments：插件边界及技术验证材料。

打开已有数据、发起 AI 分析和执行算子是不同动作。是否能执行取决于数据、工具、环境及用户授权；缺少可选数据不应被等同于运行失败。
