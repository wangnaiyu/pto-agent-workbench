# P3 实施前契约诊断

结论与待授权边界见 [停止报告](../../p3-blocker.md)，当前进度见 [status](../../status.md)。

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

第一个命令退出 0，第二个退出 1 是当前基线的预期诊断结果。它不是已纳入正式回归套件的修复测试。测试自行回收合成数据目录与 Cordis context；本轮临时测试源已保存后移出 harness，未触碰原始样例或运行数据。没有因为诊断而启动 Host/model server。
