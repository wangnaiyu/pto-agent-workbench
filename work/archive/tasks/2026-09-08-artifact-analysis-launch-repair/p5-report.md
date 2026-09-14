# P5：正式组合验收与收口

P5 在 P4 接受配对 `ae37530e92d6df320f6321a3b1c303a3f5d41d82` / `368c446657932f170a6d29fd2d275bea1c76073e` 之后独立执行，harness 产品与正式测试未再修改。本阶段只补最终组合证据与工作台文档；原审核阻塞 checkpoint `a30813f92d7f98c1e358c8ea013cc40e00914d61` 保留。

## 最终实际组合

完整正式工作台 patch 无临时 provider/observer 或布局 seed，只有浏览器目录 picker 便利覆盖；使用隔离 home 与确定性回环模型，真实 Host、Skill、工具和 Python 算法执行。不是外部模型智能效果或设备性能验收。

1. 从 Run Records 打开 Qwen dfx_outputs，Viewer 显示 598 nodes / 1222 edges。
2. 点击分析退出 overlay，规范 `/skill dependency-redundancy`、结构化 deps.json 引用和短问题进入草稿；没有模型调用。
3. 加入 46B 隔离附件后 Send，正式 receipt/Skill 注入并持久化文件；模型按测试设定返回 HTTP 400。
4. 普通短问题在同一 Session 重试，只有一次 receipt source 和一次 Skill source，真实工具双模式完成。
5. 再次打开同一输入并双击分析，只产生一个新草稿；刷新恢复，Enter 回开真实 Viewer。期间模型请求保持 6，发送才产生新 Session/request。
6. 新 launch 首发成功，仍各一次 receipt/Skill source；实验 Tab 正常显示空态，Chat/Experiments 往返正常。有内容的宽度/侧栏/底部矩阵按相同 harness SHA 复用 P4 实际证据。

| Session | request | 结果 |
| --- | --- | --- |
| session-71b1f5d0-76e9-47db-ab25-104f5af0115e | pto-analysis-c5a3bede-2d7f-4584-99bb-e62359e78993 | error → completed，同 Session，附件保持持久化 |
| session-1140634d-d542-4162-9697-7fda1b3492a9 | pto-analysis-aac3322f-5f6a-4629-9a36-8a62c910d64b | 一次 completed，新 launch |

每次真实 reduced/reduced_dataflow 均移除 `(1, 1) -> (3, 287)`，保留 1221/1222 边，无 stderr；这不能推导性能收益。原始输入 hash 为 `97ee1e49bf14d9c8dfa69ef1464c0d551bc535dfa9615609c68d5526dd383a4b`，与所有前阶段一致。

## 检查与复用边界

- 实际 built CLI provider 正负装配与 launcher：8/8。
- PTO launch/Viewer、apply-inject、reference-submit、ui-attachment：10 files / 76 tests 全通过；包括附件物化重绑定与 admission 拒绝后重试。详细 Host 缺 provider/重启拒绝等负向矩阵保留 P2/P3 分层证据，不把 stub 称为真实 receipt。
- Host artifact inspection/experiment dashboard、tool-pto-run、实验 UI：37 passed / 1 原有工具清单失败，测试与入口源码 hash 匹配原基线。
- 实际 Session/工具/附件/只读输入断言：42/42。
- P3 实现 hash 全部一致；P4 最终 GUI 4825 passed/10 known failures/1 skipped，browser 283 passed/41 known failures/37 skipped，build、doc-sync 34/34、hygiene 16/16、test:docs 16/16 结果有效。全量 lint 8 条诊断已逐文件/行/规则/消息/源码匹配。未重复未受变更影响的全套检查，未降低门禁。
- 当前工作台结构与归档链接检查见最终提交；它只证明机械约束，不替代上述运行证据。

原 browser 审核两次超时，用户再次明确授权后仍有一次超时，工具允许的同 API 重试最终获准；没有切换浏览器/CDP 绕过。大组 pnpm 调用审核超时和沙箱缓存错误没有计入测试结果，改为直接使用已安装 Vitest 后正常执行。

证据与可复验脚本见 [P5 索引](evidence/p5/README.md)。P5 tab 8 已关闭；Host exec 4316 / PID 43743、model exec 63361 / PID 43739 经唯一 fixture 身份校验退出，均为 0。隔离根、原始日志、派生结果与旧恢复点全部保留，无大范围 clean。最终总结见 [final-report](final-report.md)。
