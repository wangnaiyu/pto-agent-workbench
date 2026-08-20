# 源码开发

本文档只面向需要修改 PTO Agent 工作台的开发者。普通用户的正式入口是 README 中的单条 `npx` 命令，不需要执行本文档的 clone、install 或 build。

## 环境要求

| 依赖 | 要求 | 说明 |
|---|---|---|
| Node.js | 22.19+ 或 24+ | Node 23 不受支持 |
| npm | 随 Node.js 提供 | 用来临时执行 repo pin 的 pnpm |
| Git | 较新版本 | 仅源码 checkout 需要 |
| 磁盘 | 建议 10 GB 空闲 | 源码依赖与全量构建产物 |

`setup.sh` 默认使用 HTTPS clone，不需要 SSH key；它不依赖 Corepack 或全局 pnpm，而是由 npm 临时提供 `pnpm@11.7.0`。

## 搭建与启动

```sh
./setup.sh
./start.sh          # http://127.0.0.1:3180
./start.sh 4180     # 自定义端口
```

两个脚本都根据自身所在目录定位 repo，所以不要求 checkout 在固定路径，也不要求从 repo 根目录调用。`start.sh` 直接运行已构建的 Node.js CLI，启动时不再依赖 pnpm。

`harness/` 是独立的 fork checkout，被工程仓库的 `.gitignore` 排除。`setup.sh` 对已存在的 checkout 保持不动，不会自动 pull 或覆盖本地改动。

## 提交前密钥检查

`setup.sh` 会把本仓库的 `core.hooksPath` 配置为 `.githooks`。之后每次提交前，hook 都会扫描暂存区实际将写入提交的文件；命中时只报告文件路径和规则名，不打印疑似密钥值。

也可以随时手工扫描当前受控和未跟踪文件：

```sh
node .githooks/check-secrets.mjs --working-tree
```

检查是最后一道防误提交门禁，不能代替凭据隔离。真实模型 API key 只应通过工作台凭据界面写入仓库外的 `~/.dsh-pto-workbench/.credentials.yaml`，不要写入脚本、文档、项目 `.env` 或命令参数。

## 网络与镜像

Git clone 默认使用：

```text
https://github.com/wangnaiyu/deepseek-harness.git
```

脚本最多尝试 3 次，重试时强制 Git 使用 HTTP/1.1，以兼容部分 HTTP/2 代理和老网关。如果所在网络只能访问镜像，可显式覆盖：

```sh
PTO_FORK_REPO=https://git.example.com/deepseek-harness.git ./setup.sh
```

如果 npm registry 不可达，可使用组织内可信镜像：

```sh
PTO_NPM_REGISTRY=https://registry.example.com ./setup.sh
```

TLS/SSL 报错应修复代理或 CA 信任链。不要用 `strict-ssl=false` 绕过证书校验，这会使依赖下载失去中间人攻击保护。

## 数据隔离

工作台始终使用 `~/.dsh-pto-workbench/` 作为 `DSH_HOME`，与官方 DSH 默认的 `~/.dsh/` 分开。调用时会清理从其他 DSH 会话继承的 session 环境变量，避免 3080 / 3180 实例串联。
