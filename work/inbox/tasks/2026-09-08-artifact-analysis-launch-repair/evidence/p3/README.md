# P3 证据

实施前的结论与当时待授权边界见 [停止报告](../../p3-blocker.md)，授权后的实现见 [P3 报告](../../p3-report.md)，当前进度见 [status](../../status.md)。

## 实施前契约诊断

- [source-manifest](source-manifest.json)：P2 harness HEAD、相关产品源码 hash 与诊断 hash；产品源码未修改。
- [测试源文件](p3-diagnostic.spec.ts.txt)：以现有 inspection.spec.ts 为基础，组合真实 PTO gateway 和真实 tool-skill。使用固定 skills/agent/文件 fixture，测试只选 `admits one exact`，其余 4 项未选中。测试 receipt/source 均由插件生成，不预置注入结果。
- [普通问题对照](skill-injection-control.txt)：1 passed，Skill 注入一次。
- [正式手势反例](skill-injection-diagnostic.txt)：预期一次，实际两次；1 failed，包含真实 pre-step sources。
- [初次导入错误](skill-injection-diagnostic-initial-import-error.txt)：诊断相对 import 路径修正前的 fixture 错误，不是产品回归；后续两次有效运行覆盖此问题。

复现：将测试源逐字复制到 harness `packages/host/pto-artifact-inspection/tests/p3-diagnostic.spec.ts`，在 harness 根执行：

```sh
P3_SKIP_GESTURE=1 pnpm exec vitest run packages/host/pto-artifact-inspection/tests/p3-diagnostic.spec.ts -t 'admits one exact'
pnpm exec vitest run packages/host/pto-artifact-inspection/tests/p3-diagnostic.spec.ts -t 'admits one exact'
```

第一个命令退出 0，第二个退出 1 是P2 基线的预期诊断结果。它不是已纳入正式回归套件的修复测试。测试自行回收合成数据目录与 Cordis context；本轮临时测试源已保存后移出 harness，未触碰原始样例或运行数据。没有因为诊断而启动 Host/model server。

## 授权后的实现验证

- [implementation-hashes](implementation-hashes.json)：最终实现源码/测试/manifest 与只读输入 hash；不覆盖实施前的 source-manifest。
- [focused](focused.txt)、[keyboard tests](keyboard-tests.txt)、[scope](scope.txt)：引用生命周期、P2 launch 组合、两种注册顺序的单次注入/冲突拒绝，以及真实键盘事件。
- [GUI](gui.txt)、[GUI 对照](gui-baseline-comparison.json)：10 个失败全部逐条匹配 P2。
- [load-path 基线复现](baseline-load-path.txt)、[源码对照](load-path-baseline-comparison.json)：旧工具清单失败，未改产品/测试以豁免。
- [build](build.txt)、[定向 lint](targeted-lint.txt)、[JSDoc](jsdoc.txt)、[doc-sync](docsync.txt)、[hygiene](hygiene.txt)。定向 lint 无输出且退出 0。
- [全量 lint](full-lint.txt)、[逐源码对照](lint-baseline-comparison.json)：8 个原有诊断。
- [恢复草稿](composer-restored-dom.txt)、[截图](composer-restored.png)、[删除引用拒绝](missing-reference-dom.txt)。
- [手动选择](manual-selections-dom.txt)、[截图](manual-selections.png)、[Space 回开](space-reopen-dom.txt)、[回开截图](reference-reopened.png)。
- [模型失败](model-failure-dom.txt)、[同 Session 重试](same-session-retry-dom.txt)、[新 launch](new-launch-success-dom.txt)。
- [最终 Session sources](live-session-sources.json)、[真实工具结果](live-tool-results.json)：只含修复后两个正式验收 Session。
- [模型摘要](live-model-summary.json)：包含初次 Enter 误发送和修复后运行，不能将初次 Session 误认作键盘验收通过。

live 使用真实工作台 patch，只有目录 picker 替身和回环模型；未增加 provider/observer。完整原始日志与合成隔离 home 留在本机，精选内容去掉认证参数和完整 prompt。P3 未修改任何原始样例。

## 最终浏览器验收停止

[web](web.txt) 与 [对照](web-baseline-comparison.json)：48 项对应原基线，1 项新增未归因。[比较脚本](compare-web.py) 只规范化随机 Session UUID，不更新任何测试 golden。

[新增失败块](turn-tail-new-failure.txt)、[候选单独复核](candidate-turn-tail.txt)、[基线单独复核](baseline-turn-tail.txt)、[基线完整文件](baseline-turn-tail-full.txt)、[源码/结果汇总](turn-tail-investigation.json)；五次追加基线单测为 baseline-turn-tail-repeat-1.txt 至 baseline-turn-tail-repeat-5.txt。所有重跑通过，故未将新增差异认定为已证明 baseline 问题。P3 按 [停止条件](../../p3-validation-blocker.md) 保存未验收 checkpoint，不进入 P4。

[真实交互与清理记录](live-checks.json) 区分初次 Enter 缺陷与修复后验证。
