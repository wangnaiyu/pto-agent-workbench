# PTO 实验面板动态 spike

本实验验证 PTO 实验面板的数据与权限边界。面板请求只携带 `sessionId`；动态 Host half 从已有 Session 反查 Workspace cwd，再读取持久实验 registry。调用者不能提供路径，响应也不包含 storage key、scope key 或 Agent 对象。

## 运行

```sh
cd harness
pnpm exec tsx ../experiments/pto-experiment-dashboard-spike/run-spike.ts
```

## 验证点

- `list` 只使用 Session header 中的 cwd，并返回有界展示投影。
- 未知 Session 被拒绝；读取前后 Session 数量不变，也不会创建或恢复 Agent。
- 投影不含 `workspaceKey`、`targetKey` 等内部身份。
- 为后续切片预演的 `execute` 在没有该 Session 的 live Agent 时失败；成功时只能把同一 Session 的 cwd 和 Agent 交给可信 registry，并原样保留 optimistic revision。
- Dashboard 执行先投递一条私有 plugin follow-up；Agent loop 打开正常 turn 后由 Host 在 `agent/pre-step` 消费，审批审计因此合法地 turn-enclosed，且该消息不会进入模型 step。
- 长执行由 Host controller 持有；视图卸载不触发取消，重新读取仍可看到 active 状态。
- 只有原发起 Session 能显式取消；取消会中止 registry execution signal，并等待其结算后再刷新。

## 结论

跨实验列表不能从 transcript 重建：registry 是权威持久源，且需要一个 session-addressed Host projection。UI 应使用已有的 session-scoped `conversation.view`，而不是 root-scoped、默认 click-through 的 `shell.overlay`。执行入口继续使用同一 Session authority：Host 用私有 follow-up 打开审批所需的正常 turn，并在 pre-step 完成整个非模型操作；审批仍由既有 approval surface 呈现。Dashboard 只展示 active/cancellable 状态，并在长调用或显式取消结算后重新读取 registry。
