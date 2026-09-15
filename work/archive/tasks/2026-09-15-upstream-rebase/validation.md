# 升级兼容性验证

证据范围：隔离候选 `/private/tmp/pto-harness-upstream-20260915`，固定 upstream `0d1f50007f9bca3f52b06e1c3074fa14d5fb0720`。最终提交及远端状态见配对记录；此处只报告实际执行过的检查。

## 通过的检查

| 范围 | 结果 |
| --- | --- |
| 依赖与编译 | frozen lockfile 安装、完整 build 通过；Node 24.14.1 / pnpm 11.7.0 |
| GUI 全量 | 409 文件，5700 passed、1 skipped；之后新增的 Skill / Escape 代码另有所属单元与浏览器复验 |
| V4 迁移、catalog、JSONL | 503 passed；built migration worker 1 passed |
| SDK / ACP / headless replay | 149 passed、2 skipped；需要 Python 的 fixture 使用现有 bundled Python，未改用例来兼容系统旧 Python |
| 历史 fixture 策略 | corpus 3 passed；旧 V2/V3 正文未覆写，新增 V4 successor；10 个历史角色、8 个场景，保留上限未放宽 |
| Skill / Composer | 47 项目录与消费者测试、20 项引用/preview fixture/mock 测试通过 |
| Escape | 同选区发布不重开菜单，查询改变可重开；所属控制器 69 项通过 |
| HMR | 单独运行真实源码编辑、页面身份不变、源码与产物恢复，1 passed |
| 外层脚本 | 17 passed；最终候选的官方 provider 装配检查唯一且无 warning |
| 静态门禁 | 完整 lint 通过；doc-sync 最终完整 41/41 通过；hygiene 15 项通过后唯一 i18n 项修复复验通过 |

日志摘要、命令结果和 SHA-256 见 [verification-checkpoints.json](evidence/verification-checkpoints.json)。临时日志路径用于本机排查，精选结论在本包持久保留。

## 浏览器复验范围

全量首轮为 111 文件（76 passed、34 failed、1 skipped），用于发现跨越 1088 个 upstream 提交的装配变化。失败项按真实根因修复，没有删测或改为 skip：

- 上游测试前置假定选目录即创建 Session，与 PTO 延迟首发语义冲突；正式会话功能 fixture 显式建立并关联 Session，草稿测试验证零空行。
- 新 Remote 合同、assembled mock 的 durable seq、权限 slot 和命令本地化不一致。
- 新 V4 current fixture 与历史 predecessor 分开；golden 由 owner refresh 后严格 replay。
- 规范 Skill 引用缺少发送后装饰和源路径预览；HMR 的旧 remote 声明别名破坏源码打包。
- Escape 关闭后迟到的同选区发布重开菜单。

最终统一 replay 覆盖此前失败的 33 文件（HMR 独立运行）：32 文件、114 项通过，剩余 Escape 用例随后由修复后的聚焦复验收口。最终权限、生命周期、Skill 聚焦复验为 3 文件 / 23 passed；不能把全量首轮报告描述成全量通过。

## 实际工作台验证与限制

在隔离临时数据目录运行真实外层 patch，使用确定性的本地模型协议替身驱动实际工具与官方 Skill；不等同真实模型能力评估，也未使用生产用户 Session。

- Viewer 为 598 nodes / 1222 edges，分析芯片与产物重开可用。
- 官方 `reduced` / `reduced_dataflow` 两模式各移除 1 条冗余边，保留 1221 条，无环。
- 原始官方输入前后 SHA-256 均为 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`。
- 首发仅实体化一个 Session，官方 Skill provider/revision 与工具 revision 在 receipt 中一致。
- 本次 live 路径没有单独执行 failNext/retry 注入；retry 只引用所属单元测试证据。
- 测试结束后停止自有 Host/mock 并关闭临时浏览器页；原始数据、凭据和临时 trace 不进入版本库。

详情见 [runtime-verification.json](evidence/runtime-verification.json)。`pto-upgrade-fixtures-20260915.mjs` 是历史 fixture 维护工具证据，不是产品启动入口。

## 已归因的上游门禁问题与未验证项

`verify-client-domain-graph` 在候选与固定 upstream 原树均报完全相同的 25 个跨域导入问题；逐行对比通过，见 [upstream-domain-graph.json](evidence/upstream-domain-graph.json)。本次没有新增该类违规，也没有修改门禁或将其标为通过。

真实 provider API、完整覆盖率与跨平台矩阵未在本机执行；CI 状态以推送后的远端查询为准，canonical-only 跳过不能算成功验证。

最终远端 CI：新 master 的 4 个 push workflow 全部 completed/success（Release vendor、Release dsh、Node Addon System、Sandbox）。详情见 [ci-postpush.json](evidence/ci-postpush.json)；这不替代未触发的 pull_request 主矩阵。原 checkout 的锁定安装、完整构建和官方 provider 唯一性检查均通过。
