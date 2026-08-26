# skills/ — PTO agent 工作流指令

PTO 算子设计 / 调试 / 调优 / 复盘 的 agent 工作流定义（agent instructions / skills）：

- 数据解读与证据准入
- 诊断与优化建议
- before/after 复跑验证
- 复盘报告

与 PyPTOUX 的 skill 体系互补：PyPTOUX 管内容与检索，本目录管工作台内的 agent 行为。当前状态：已建立 PTO bundled provider 基线，后续按真实工作流逐项扩展。

## 发布边界

- `bundled/` 是 PTO profile 唯一装配的官方业务 Skill root。
- profile 使用独立技术 provider `pto-bundled`，并在草稿能力目录的可信
  `providerOrigins` 中把 `pto-bundled + bundled` 映射为产品来源 `PTO`。
- 根目录说明文件、未来开发素材和项目 Skills 不进入这个 root，因此不会被误发现或误标为 PTO。
- `bundled` 只是 DSH 的技术 source；没有上述 profile 映射时不得自行解释为 PTO。

当前基线 Skill：

- `pto-evidence-intake`：在诊断、调优或复盘前整理输入材料、数据等级、证据来源和 claim 校验状态。
