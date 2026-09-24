# 安全更新证据

- 旧 fork master：a11460d434e652fde77d35e7558056a59cb3256f。
- 固定 upstream：46a7f68b0922371ce7144b668b90e377d8e799f4（0.1.7-rc.1）。
- 候选：19c1a836a76824be9a2be8773f419d392de01d4b，31 个重放提交 + 1 个兼容收尾。
- 普通提交的 pre-commit 通过：32 staged bilingual pairs、lint、third-party notices、whitespace、vendor manifest guard；提交后 clean。
- 推送前 fresh `git fetch origin master` 确认 master 仍等于旧 OID。
- 分支正常推送成功；pre-push typecheck 通过（14.73s）。
- 再次 fresh fetch 确认原 OID，然后执行 `git push --force-with-lease=refs/heads/master:a11460d434e652fde77d35e7558056a59cb3256f origin HEAD:refs/heads/master`，pre-push typecheck 通过（12.02s）。没有 raw force、没有 hook bypass。
- 推送后 fetch + ls-remote 核验：master 和 codex/upstream-rebase-20260924 均为候选完整 SHA；codex/pre-upstream-master-20260924 为原 SHA。
- 主 checkout 在无 tracked/普通 untracked 改动时用 reset --keep 同步；安装/重建日志 /tmp/pto-20260924-main-{install,build}.log，执行句柄21410（仅本会话）。旧目录 ignored 产物另行只读核对。
- GitHub 精确提交的 4 项 push workflows 最终全部 success，见 ci-final.json；没有主动产品 release。

## 本地运行树同步

主 checkout 已为 19c1a836a76824be9a2be8773f419d392de01d4b 且 tracked/普通 untracked clean。第一次增量 build 暴露旧 Desktop lib/types 导出残留；上游 RepositoryCleaner 检查边界及未知文件后清理 331 个可重建路径，包括 4 个退役包的 lib/node_modules 残留。没有调用宽泛 git clean，没有删除用户数据。完整重建成功（main-build-clean.log），本地 CLI 及 provider smoke 随后核验。

## 首轮远端 CI 与后续核验

Node Addon System、Release(vendor)、Sandbox 已 success。Release(dsh) 的 Pack npm tarballs success；Dependency layout 的 verify-npm-install-layout 在 300000ms 超时（35956627780）。检查使用本地合成registry，不能归因为外部网络。原检查未改，执行同命令本地复验与固定 upstream manifests 对照；仅重试该失败job一次。原样重试成功：267.94 秒完成，未修改 300 秒阈值、测试或门禁。

普通单版本 npm 解析（npm 11.11.0）通过：0.1.7-rc.1，24.85s，669 metadata requests；66 个本地 registry 404 名称按上游脚本的 optional 处理。未获取 archive、未发布包。双版本检查仍须独立评价。

本地完整双版本布局检查通过：276 个 DSH 包/版本、2552 条内部边，224.98 秒，两代共用单一 Cordis。固定 upstream SHA 的 manifests 对照也通过：267 个包/版本、2442 条内部边，205.85 秒；该对照复用当前外部依赖存储，不是独立全新 upstream 安装。证据见 npm-layout-local.txt、npm-layout-upstream.txt、upstream-layout-comparison.ts.txt。首次超时属本次观察到的耗时波动，不宣称已证明性能根因。

最终远端 CI：Node Addon System（35956627834）、Release(vendor)（35956627929）、Sandbox（35956627832）、Release(dsh)（35956627780，attempt 2）全部 success；精确 head 均为 19c1a836a76824be9a2be8773f419d392de01d4b。详见 ci-final.json、ci-retry.json、ci-layout-success.txt；首次失败日志同时保留。
