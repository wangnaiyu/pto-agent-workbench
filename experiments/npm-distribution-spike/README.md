# npm 预构建分发 spike

目标：验证 PTO Agent 工作台能否像官方 DSH 一样，在用户机器上只依赖 Node.js/npm，通过一条 `npx` 风格命令启动，而不需要 Git、SSH、pnpm、Corepack 或本地构建。

## 结论

**可行。** macOS arm64 的本地端到端验证已通过。本次产物为 64.8 MB 的 npm tarball，其中嵌入 65.1 MB 的 gzip 运行时。验证在空的临时当前目录和独立 home 中执行，服务成功启动并返回标题为“PTO Agent 工作台”的首页。

用户侧的目标接口为：

```sh
npx -y @wangnaiyu/pto-agent-workbench
```

该名称和版本在 spike 中只是候选值，尚未发布到 npm registry。

## 最终采用的方案

发布时用 `pnpm deploy` 从当前 PTO fork 生成生产依赖闭包，然后：

1. 将 deploy 产物中指回源码 checkout 的 workspace 链接替换为发布文件；
2. 补齐 `pnpm deploy --prod` 因 workspace peer 配置而没有带入的运行时 peer package；
3. 为 DSH profile loader 生成所需的扁平 `@deepseek-ai/*` 包链接；
4. 将闭包压缩进 platform-specific npm 包，并写入 SHA-256 manifest；
5. launcher 验证校验和后，将运行时解压到 `~/.dsh-pto-workbench/runtimes/<version>-<hash>/`，然后直接运行内置 DSH CLI。

路径不再来自 checkout 或当前工作目录，所以用户把 repo 下载到哪里不会影响启动。

## 被否决的薄 launcher 方案

最初方案是让 PTO launcher 依赖官方 `@deepseek-ai/dsh`，只携带 PTO 改动的 Web 产物和 client 包。这会得到约 3 MB 的自有包，但在空 npm cache 中首次启动时，npm 花费超过 300 秒解析上百个官方包的 metadata，未能进入下载阶段。直接冷启动官方 DSH 依赖也出现相同问题。

因此本 spike 改用“发布时解决依赖、用户侧下载单一运行时”的预构建方案。包体变大，但减少了 npm metadata 往返、本地构建和包管理器差异。

## 本地验证

首次或 harness 依赖发生变化后：

```sh
cd experiments/npm-distribution-spike
npm run prepare-runtime
npm run build
npm run smoke
```

只修改 launcher 或打包脚本时可跳过 `prepare-runtime`。`smoke` 执行等价于下列命令的本地 tarball 安装：

```sh
npm exec --yes --offline --package=<pto-agent-workbench.tgz> -- \
  pto-agent-workbench web --no-open --port 0
```

验收项：

1. npm 能在空目录启动 launcher；
2. launcher 能安装并校验预构建运行时；
3. 服务能用操作系统分配的空闲端口启动；
4. HTTP 首页来自 PTO 构建，标题为“PTO Agent 工作台”。

## 正式化前必做

- 拆成一个稳定 launcher/meta 包和多个 platform runtime 包，避免同一 npm 版本无法同时表达多平台产物。
- 增加 macOS arm64/x64、Linux arm64/x64 和 Windows x64 的真机构建与烟雾测试；对未支持平台给出明确错误。
- 将当前依赖系统 `tar` 的解压改为可审计的跨平台实现，并校验路径穿越。
- 增加版本升级、并发首次启动、损坏缓存自愈、回滚和包体积门禁。
- 正式发布 npm provenance，并为 npm registry TLS/代理不可用的环境提供同样带校验的 GitHub Release 离线包。不使用 `strict-ssl=false` 规避证书错误。

## 非目标

- spike 不发布 npm 包，不写入任何账号凭据。
- spike 不宣称已支持未测试的操作系统。
- 预构建方案不能消除所有网络问题；它消除的是 SSH、Git clone、pnpm/Corepack 和依赖图冷解析。
