# 产物查看与官方 Skill 分析 MVP 完成报告

日期：2026-09-04。任务 P0–P4 已完成并验收；实现、主题回写和任务证据均保留在工作树，
未 commit、push 或 publish。

## 交付结果

- Host 建立只读 `Record → Profile → ActionReadiness`：支持 run/evidence-pack、稳定 revision、
  有界 artifact inventory、精确 unavailable reason 和打开前复核。
- 新增 `ptoArtifactInspection` Host 能力与 Client root overlay。纯查看不创建 Session；静态
  HTML 只经不可猜 token 的 exact-file route 提供，关闭、切换或卸载时撤销。
- 已支持 dependency、memory-map 与自包含 IR viewer。timeline、critical path、program 和
  raw pass 在没有受支持、可分发 adapter 时显式 unavailable。
- dependency 分析接入固定官方 `dependency-redundancy` Skill 与工具；qualified provider/revision
  不匹配时 fail closed，不允许同名 Skill 或普通 prompt 静默替代。
- 分析草稿结构化绑定 record/artifact/action/Skill identity。首次发送准入失败后保留同一
  Session 和草稿，重试必须重新准入，成功后才发模型请求。
- 同一 Record 可在多个 available viewer 间切换。当前静态 handle 明确声明
  `selection=false`、`deeplink=false`，不伪造跨图选区、高亮或图状态恢复。

## 固定物料与来源

- 官方 Skill provider：`pypto-official-af1d7a016ce5`；来源 commit
  `af1d7a016ce50ba109c4b4224580a6b758bde7da`。
- Skill runtime 包含 `SKILL.md`、`agents/openai.yaml` 与必需引用 `lib/dfx/capture.md`，逐文件
  hash 和 inclusion basis 见[闭包审计](evidence/p2-official-skill-closure-audit.md)。
- 配套工具来自 PyPTO runtime commit
  `77fa0171c24a4e1c323fb29a6a86239df93edb58`，保留原脚本头和上游 LICENSE。
- 用户明确授权把上述固定 Skill/资源纳入可分发 runtime。上游 Skill 未声明许可证的 provenance
  风险仍记录为 `not-declared-upstream`；该授权不被表述成上游许可。

## 验证结果

- 9 个聚焦测试文件共 223/223；相关 lint、Host/Client TypeScript 与聚合构建、Web production
  build、55-package dependency policy、workspace constraints、tsconfig paths、Cordis catalog、
  双语 README 门禁和两个仓库的 `git diff --check` 均通过。
- 四组真实只读样例完成 Profile/动作核对：20251112 three-view、20260528 A5 PMU、
  20260720 Qwen L2、20260804 IR lowering。
- Qwen L2 的真实 Host→Tool 结构/数据流双模式都从 1,222 条边删除 1 条
  `(1,1) → (3,287)`；stderr 空、无循环 fallback，输入 SHA-256 前后相同。该结果不被解释为
  已测得性能提升。
- 完整 Harness 浏览器验收中，Qwen dependency viewer 呈现 598 nodes/1,222 edges；20260804
  memory viewer 呈现 34 个 compute function/743 tiles；约 305 MiB IR trace 在 45 秒验收
  检查点已完成并呈现 23 changed/23 no-op/46 visible。
- 浏览器实测 memory→IR→memory 切换时旧 route 均为 404；关闭后当前 route 为 404，iframe 与
  toolbar 消失。当前 route 存活时带 CSP、no-store、nosniff 和 no-referrer。所有验收服务与
  进程已停止，外部样例未修改。

分阶段证据：

- [P0 兼容性与 seam](evidence/p0-compatibility.md)
- [P1 Record/Profile 与通用打开](evidence/p1-record-profile-open.md)
- [P2 first-send 分析闭环](evidence/p2-dependency-analysis-first-send.md)
- [P2 Skill 闭包审计](evidence/p2-official-skill-closure-audit.md)
- [P3 viewer 覆盖](evidence/p3-viewer-coverage.md)
- [P4 关联与降级](evidence/p4-association-and-degradation.md)

## 保留边界与后续项

- 本任务未实现 selection/deeplink、持久 Analysis View、timeline/critical-path/program/raw-pass
  adapter，也未承诺大文件性能指标；这些需求应另建任务并逐 adapter 验收。
- 完整 Harness 日志出现既有 Gzip `MaxListenersExceededWarning`。它未阻塞本次渲染、切换或
  清理，保留为环境观察，后续若做性能/长时运行专项再单独定位。
- 未执行设备重跑、源码优化、上游更新、外部样例写入、PyPTOUX/官方镜像修改、发布或推送。

## 正式文档

稳定产品结论已回写[产物查看](../../../product/artifact-inspection/overview.md)、
[官方 Skill 接入](../../../product/official-skill-integration/overview.md)与
[输入区/first-send](../../../product/conversation-composer/overview.md)。任务包作为历史证据归档；
未来工作从正式主题另建有界任务，不恢复本包为活动状态。
