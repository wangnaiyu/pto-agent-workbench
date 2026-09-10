# R2 验证进度（2026-09-10）

依赖安装权限经用户确认，`pnpm install --no-frozen-lockfile` 成功。生成锁文件仅移除已被 upstream 删除的 session-projection-cache 依赖；8 个 fork-only package 版本对齐 0.1.5-alpha.1。

- 正常 `pnpm run typecheck` 通过（包含 Host build 与 Client tsc）。
- `pnpm run build:native-system` 通过；之前 Session 测试大量失败由缺少构建产物 system.node 引起，不是行为诊断。
- 原始聚焦 32 files / 716 tests：507 通过、209 失败；主要为 native 未构建，另有旧工具清单测试、alias 旧文件名断言、attachment 移除保护遗漏。不得把该次运行标记为通过。
- native 构建后 Session persistence + apply-inject：485/486；唯一剩余断言按旧 session.jsonl 文件名寻找当前 V3，已按 generationLogFilename 适配。
- Session jsonl + PTO executor：185/185；移除已从 upstream SubprocessHandle API 删除的 pid fixture 字段。
- Conversation 全目录、PTO UI、Client/Host composer catalog：432/432。
- 与上一阶段相同的 9 个聚焦 + 4 个相邻文件：262/262（upstream 新增测试以及本轮新 generic-file 适配测试导致数量变化）。
- `pnpm run build` 完整通过；之后 hub 文件绑定顺序有一处适配，发布前必须重建。
- `pnpm run hygiene`：16/16，无 skip。
- 文档第一轮27/34；修复失效链接、生成目录与 upstream 新 README 摘要规则；最终校验进行中。
- lint 比对、frozen install、完整工作台组合未完成，禁止更新 master。

## 定向回归

upstream 的 attachment removal 以 shell 接受为前提。重放遗漏这一条件，原 upstream apply-inject 测试失败；恢复条件后通过。

新增 generic-file 首发拒绝/重试用例先在重放实现上失败（upload 0 次），将文件绑定上传放在实体化之后、正式准入之前后通过。该适配确保 upstream 新文件 receipt 与既有 draft/准入功能组合，不实施 Viewer launch repair。相关两文件最终18/18。

## 已知问题待分类

`tool-pto-run/tests/load-path.spec.ts` 仍预期两个工具，实际升级前源码已注册三个工具；正在旧 master 原位复现实证，未修改旧断言或产品工具。

Viewer 首发 identity/receipt、new launch/retry 与实验宽度尚待升级后取证，repair 包未修改。

## R2/R3 最终补充

最终完整build通过（pto-rebase-build-final.log）；doc-sync34/34通过（pto-rebase-doc-sync-complete.log）；frozen install成功且锁文件不变。全量oxlint经生成contracts后仅同一8条baseline no-misused-spread，逐条源码相等见lint-comparison.json；不计为lint通过。

旧master原位load-path测试复现同一预期2/实际3工具失败，属于升级前遗漏的断言；未修改。别名传统/alias历史generation迁移2/2通过，178其他用例仅按过滤未运行。CI workflow + selfhosted共36/36；新upstream临时目录测试须检查fork skip提示之后的canonical-only步骤，未改workflow或降低规则。最后新增generic-file测试改为等待错误notice的可观察状态，移除固定sleep，重新运行该文件。

完整工作台与补充隔离验证见workbench-compatibility.md。无已知未解决的rebase新实质失败。Windows/真实外部模型及完整e2e未本地运行；不把canonical-only no-op视作验证。

最终apply-inject 16/16通过；正常pre-commit全部通过，兼容commit为 `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807`，隔离树干净。

实际harness master已同步ac2b72a并完成frozen install、完整build，工作树干净；build metadata ac2b72a/0.1.5-alpha.1无dirty。master触发的四workflow、28job成功，跳过步骤另列master-ci.json。

入库TXT证据已移除终端ANSI控制符和行尾空白以便审查；原始日志内容校验值保留在validation-logs.json，本地原始日志未改。
