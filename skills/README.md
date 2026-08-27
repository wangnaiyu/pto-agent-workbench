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
- `pto-analyze`：先调用 PTO run 原语完成 L2/L3 识别与能力探测，再按 runtime performance、accuracy 或 compiler transformation 路由只读分析。
- `pto-debug`：区分可选 DFX 未采集与运行未完成/失败，按首个失败边界组织编译、运行或精度问题的只读诊断。
- `pto-optimize`：把有证据的瓶颈与源码/config anchor 转成可审阅的候选实验、验证口径、停止条件和回滚计划，不直接声称“最优”。
- `pto-compare`：通过显式 comparison identity 门禁比较 baseline/candidate；不可比时禁止 delta，可比时区分 collected、simulated 与 projected 结论。
- `pto-review`：把 intake、分析/调试、候选、授权、执行与比较结果整理成 claim–evidence–decision 账本，保留缺失阶段和负向结果。

组合路由按用户意图而不是按文件类型决定：`pto-analyze` 回答“产物显示了什么”，`pto-debug` 回答“失败/错误结果为何发生以及什么检查能区分原因”，`pto-optimize` 只把已有结论变成候选实验，`pto-compare` 只裁决已存在且通过 identity gate 的 baseline/candidate，`pto-review` 只整理已有链路。当前这些 Skills 不拥有获授权后的源码修改、构建、设备执行或持久 experiment identity；该执行事务属于后续插件契约。
