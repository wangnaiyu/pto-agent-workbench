# 远端更新与配对证据

2026-09-21重新fetch后，fork origin/master仍为 `70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb`，upstream/master仍为 `ddefc45fbc7f8e46dd73185e68295696d1297887`。外层 origin/main 与本地起点仍同为 `6f015cfdce43b992da24a02ac39e7f4efd34cb7b`。

正常推送恢复ref及候选后，以精确lease更新master。两个push的正常pre-push类型hook都成功，未跳过hook。再次fetch/ls-remote得到：

| fork ref | OID |
| --- | --- |
| master | a11460d434e652fde77d35e7558056a59cb3256f |
| codex/upstream-rebase-20260921 | a11460d434e652fde77d35e7558056a59cb3256f |
| codex/pre-upstream-master-20260921 | 70e5ab14c8fc0081be6d2b1c8aff6b46682d4ecb |

原harness master工作树先检查clean，再reset --keep到发布值，锁定安装和完整构建通过。9个旧包ignored残留经预览、确认无tracked和普通untracked文件后精确清理；constraints及完整构建重验通过，记录254个client artifacts。外层17测试和实际provider检查再验通过。

## CI

4个目标提交push workflow均completed/success，原始元数据见[ci.json](ci.json)：

- [Release (dsh)](https://github.com/wangnaiyu/deepseek-harness/actions/runs/35565843981)：Dependency layout、Pack npm tarballs（含Verify packed install）成功。
- [Sandbox](https://github.com/wangnaiyu/deepseek-harness/actions/runs/35565843911)：Ubuntu x64/arm64 Landlock、Ubuntu bwrap、macOS seatbelt全部成功。
- [Node Addon System](https://github.com/wangnaiyu/deepseek-harness/actions/runs/35565844129)：linux-x64、linux-arm64、darwin-x64、darwin-arm64成功。
- [Release (vendor)](https://github.com/wangnaiyu/deepseek-harness/actions/runs/35565843838)：Pack npm tarballs成功。

这些是push触发的实际检查，不等同完整pull_request矩阵。没有执行npm publication或产品发行。

## 配对方式

两仓annotated tag：`post-upstream-baseline-20260921`。相同JSON记录baseline、workbench完整SHA、harness完整SHA、upstream完整SHA、版本、V4、前次基线、恢复分支、验证报告与限制。外层提交不可自包含自身SHA，故以两份tag的JSON为唯一配对值；用git for-each-ref读取contents并比对，用ls-remote的peeled ref核验提交。

外层main正常fast-forward推送；tag各自显式推送，不使用--tags批量发布旧本地标签。旧恢复点全部保留。候选与上游对照worktree保留在临时目录供复核，不能将临时目录视为永久恢复点；永久恢复依据是远端ref/tag。

临时32193工作台实例已停止。测试只使用隔离DSH_HOME、虚拟fixture及无效测试凭据，没有迁移真实会话。
