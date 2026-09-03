# 发行与研发内容边界

状态：2026-09-03。预构建发行是既有方向，历史本地 macOS arm64 tarball 验证不等于 npm 正式发布。本轮不查询远端发布状态、不构建或发布新包。

## 目录不是发布策略

工程实现与运行资源位于既有代码目录；work、开发用 .agents/skills、临时任务与外部源定位不进入运行时。过程文档可以进入源码 Git；源码可追溯和产品包最小化是两个不同问题。

当前 experiments/npm-distribution-spike 的 package 模板只允许 bin、runtime；build-package 从模板打包，运行时来自 harness deploy 产物，并非复制整个外层根目录。这是本轮可检查的边界，不是未来新增打包路径自动合规的保证。

每个发行路径都应有显式 allowlist。新增 GitHub Release、容器、静态资源打包等路径时复核排除 work、开发 Skill、凭据、原始数据、scratch、无关 cache；对最终包清单再检查，不能只依赖 .gitignore。

## 后续发行工作

仍需实际确认多平台构建与启动、版本升级/回退、下载完整性、provenance、离线包，以及官方 Skill/工具的许可和固定版本资源如何进入 runtime。正式发布需要独立授权与任务，不沿用早期 demo target 或旧推送记录。

更换目录不能修改 setup/start 的根定位、PTO_WORKBENCH_ROOT 或 bundled provider 发现位置。只有开发 Skill 新增，产品 skills/bundled 保持原位。
