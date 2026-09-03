# 既有实验执行与比较契约

状态：2026-09-03 从历史实现记录提炼的维护基线；本轮未重跑设备任务或 UI 回归。这个工程契约保留既有能力，不把它冒充下一阶段“打开产物”的已完成实现。来源：[2026-08-25 决策](../archive/legacy-notes/decision-2026-08-25.md)、[2026-08-27 更新](../archive/legacy-notes/update-2026-08-27.md)。

## 流程分工

- analyze/debug 解释既有证据与首个失败边界；optimize 产出候选、风险、验证口径和回滚建议。
- compare 裁决已有且可比的观测；review 整理 claim–evidence–decision，不能补造缺失结果。
- Skills 不自行完成执行事务。Host 拥有 baseline/source/environment/command/output identity、审批凭据与生命周期。
- 模型面开放 pto_experiment_plan / get / list / compare。plan 只产生 planned@revision=0；不能通过拆散的 bind/authorize/begin/complete 工具绕过单一 execute 准入。

## 执行和恢复

用户 one-shot 审批后，Host 重新核对 Git/PyPTO identity、环境和路径；候选目录的“此前不存在”不是锁。reserveDirectory 以 fail-if-present 原子占位，先持久化 running，再启动 workload。退出码零仍需认可的实际产物，不能直接完成。

执行只能使用实际批准的声明变更与命令。Host 重启后遗留的前台 running 失去执行上下文时 fail closed；占位后失败可能留下空目录，不能自动覆盖或复用。持久状态、审批记录和清理动作需要分别处理。

## 指标与 UI

首版 L2 metric adapter 复用上游 swimlane converter，保存 makespan 与 task/hardware/source/environment/command/artifact identity。只比较同一 Workspace 内 registered runs，相关 identity 全部匹配才计算 delta。缺少 threshold/repetition rule 的单次观测仍可为 inconclusive；completed run 也可能没有可用指标。

比较工具的冻结结果交给 tool.result.detailview；UI 不随意重新查询并改变历史结论。持久 Dashboard 使用 conversation.view，以 sessionId 确定权限，不接受 Client 任意 cwd。用户执行经 private non-model turn 进入审批/审计，不把点击当作模型建议或普通聊天。

长操作需要明确取消与终态处理。卸载面板不等于取消任务；仅来源 Session 可取消，终态持久化不能被已取消的前端等待信号吞掉。

## 当前边界

历史范围主要是 3.0 L2 单次实验，不能推广为 L3/legacy、统计显著性、全局后台调度或普适设备运行支持。原有 run recognizer 与指标适配器是否接受 Evidence Pack，由后续兼容设计决定；新增“可读证据对象”不自动获得可执行实验身份。
