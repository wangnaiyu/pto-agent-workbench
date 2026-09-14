# P5 当前验证与阻塞

本阶段从 P4 接受配对开始：工作台 `ae37530e92d6df320f6321a3b1c303a3f5d41d82`，harness `368c446657932f170a6d29fd2d275bea1c76073e`，两仓独立分支 `codex/repair-p5-validation-20260914`。这是未完成阶段报告，不是任务 final-report。

## 已执行

- `node --test work/scripts/official-provider-composition.test.mjs work/scripts/launch-contract.test.mjs`：8/8，真实 built CLI 装配正向及缺失/错误 override/重复 provider 负向检查。
- 直接调用现有 `node node_modules/vitest/vitest.mjs run`，选择 PTO launch assembly、Viewer、apply-inject、input-reference-submit、ui-attachment：10 files / 76 tests 全通过，覆盖上传后 admission 拒绝与同 Session 重试等组合。
- 同一 runner 选择 pto-artifact-inspection、pto-experiment-dashboard、tool-pto-run、ui-pto-experiments：37 passed / 1 failed。唯一失败为旧工具清单预期两项、实际另有 pto_record_inspect，与 P3 原始基线证据和源码 hash 一致。
- P3 实现证据中的所有源码 hash 仍一致。P4 完整 GUI/browser、build、文档、hygiene、lint 和 populated layout 完成后 harness 未改，因此保留并复用其真实结果；不重复全套测试，也不把其既有失败表述为绿色。
- 新建隔离 home，启动完整实际 patch；仅保留目录 picker 便利覆盖，没有临时 provider、observer 或布局 seed。尚未进行浏览器操作或产生本轮新的 receipt/tool 闭环。

证据见 [P5 索引](evidence/p5/README.md)。分阶段真实 Qwen 双模式、launch/引用与布局证据仍有效，但不能替代本轮尚未完成的最终实际页面观察。

## 执行环境阻塞

大组 pnpm 测试请求两次因自动审核截止超时未执行。较小默认沙箱调用随后触发 pnpm 自动安装，因缓存数据库不可写失败；它没有产生测试结果。改为直接调用已安装 Vitest 后上述两组测试正常执行，未安装依赖、未改产品规则。

浏览器打开本次 `http://127.0.0.1:52723` 两次均被自动审批审核超时拒绝；没有获得可操作页面。工具明确禁止通过其他浏览器、原始 CDP 或间接操作绕过。本阶段因此暂停实际浏览器验证，需用户指导/明确允许再次尝试；这不表示用户手动拒绝或地址已被证明不安全。

## 未完成与恢复

待重新获准访问本地测试页面后，继续实际 P1–P4 组合、Qwen 只读双模式、receipt/source/identity 一致性及附件链路观察，核对输入 hash，完成主题回写、最终报告和归档。不得将未验证项标通过，不 push/PR/merge。进程清理与当前 home 状态只看 [status](status.md)。
