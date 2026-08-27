# PTO experiment contract / registry 动态 spike

本实验验证第七阶段在真实执行前需要的 app-owned experiment 记录形态。它不编译、不运行设备 workload，也不把动态插件的私有 RPC 当成正式授权边界。

## 运行

```sh
cd harness
pnpm exec tsx ../experiments/pto-experiment-registry-spike/run-spike.ts
```

`host.js` 是可直接交给 `cordis_define` 的纯 JavaScript Host half。`run-spike.ts` 使用真实 `DynamicCordisRunnerService`、`ctx.fs`、domain data form 与 JSON backend，停止并重新启动动态插件后复读同一条记录。

## 合同基线

一条 experiment 使用 Host 生成的 id、原子整记录 revision 和 append-only event ledger，绑定：

- Session Workspace 与已识别 baseline run；
- source workspace，以及仍需 adapter 证明的 source identity；
- environment identity；
- 单一 declared change 与 evidence refs；
- 当前不存在、且与 baseline disjoint 的 candidate output；
- stop conditions、rollback plan；
- 独立 authorization receipt；
- execution 后实际出现在候选路径的 recognized run。

状态只允许：

```text
planned → authorized → running → completed
   │           │          ├────→ failed
   └───────────┴──────────└────→ cancelled
```

每次改变必须携带 `expectedRevision`；terminal record 不再接受迁移。模型可见面只开放 `pto_experiment_plan/get/list`，没有 authorize/begin/complete 工具。

## 验证点

- baseline 按 PyPTO 3.0 marker 识别，目录名不参与身份判断。
- source/baseline/candidate 都受 Session Workspace containment 约束；candidate 还必须位于 source 下、与 baseline 不相交且当前不存在。
- 同一 candidate output 不能被两个 experiment 占用。
- source/environment identity 未绑定时拒绝 authorization；过期 revision 拒绝状态迁移。
- execution 开始前重新检查 baseline marker、filesystem identity 与 candidate absence，避免已知覆盖。
- completion 只接受预先绑定的 candidate output，且该目录必须已经成为 recognized PyPTO run。
- JSON domain 在动态插件停止/重启后保留完整状态与 event ledger；其他 Workspace 不可读取。

## Spike 边界与结论

- PyPTO 当前 `ir.compile()` 会对显式 `output_dir` 使用 `exist_ok=True`，所以 registry 的“absent observed”只是规划事实；正式 executor 仍必须在执行开始时原子占用输出路径，并处理检查—创建竞争。
- 动态插件的 `harness.handle` 可验证状态机形态，却可由插件自己的 browser half 调用，不能证明动作来自 DSH 可信 UI、用户消息或 executor。因此本实验把 identity/authorization/execution transition 固定标记为 `spike-simulated`。
- 静态 Host package `@deepseek-ai/dsh-pto-experiments` 已固化 zod domain 与模型可见 plan/get/list；它没有迁入本 spike 的 simulated handler，而是新增独立可信 Host `execute()` 路径。
- 静态 package 复用 PTO run package 导出的 `recognizePtoRun()`，并已实现 authorization receipt、Git/PyPTO identity adapter、原子 candidate reservation 与 executor-only transition；不另造第二份 marker 规则。
