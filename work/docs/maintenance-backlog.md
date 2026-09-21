# 维护与产品遗留事项

这是从历史中提炼的待复核清单，不是新的执行授权或当前任务进度表。已解决事项不按旧“下一步”重新启动。

| 事项 | 归属与处理条件 | 原始依据 |
| --- | --- | --- |
| alpha.2 src/tsx 工具回放出现 prepare 未定义 | 固定 upstream ddefc45 独立复现；lib 完整回放和浏览器 HMR 通过。下次维护复核源码加载身份问题，不能扩大为运行时故障或伪称已修复 | [09-21 验证](../archive/tasks/2026-09-21-upstream-rebase/evidence/validation.md) |
| 添加运行数据仍出现通用 Workspace 目录选择文案 | artifact-inspection；实现对应动作时区分添加工作区、添加数据、关联源码 | [08-24 更新](../archive/legacy-notes/update-2026-08-24.md) |
| 目录大小写、别名、重复注册、扫描边界及输出覆写 | 数据接入方案覆盖预期；P0/P1 用实际路径与多代样例验证，不能假定已修复 | [08-20 决策](../archive/legacy-notes/decision-2026-08-20.md) |
| 精确 source join 的正负 fixture、运行记录到 Session 的反向索引 | 前者按具体分析需要补；后者非本次最小闭环前置 | [08-20 决策](../archive/legacy-notes/decision-2026-08-20.md) |
| 旧 run-only / health / 数据等级规则及自有 Skill 的来源表述 | 后续 MVP 先审计 Host、目录、六个 runtime Skills 的一致性，本次只改设计/开发说明 | [08-26 更新](../archive/legacy-notes/update-2026-08-26.md) |
| 跨平台发行、升级、provenance、离线包 | 独立发行任务，见发行边界 | [08-20 决策](../archive/legacy-notes/decision-2026-08-20.md) |
| 旧测试基线问题、缓存和备份 | 必须在目标版本复现后再立修复任务；清除备份需明确目标与授权 | [08-28 更新](../archive/legacy-notes/update-2026-08-28.md)、[09-03 更新](../archive/legacy-notes/update-2026-09-03.md) |
| L3/legacy 实验指标、重复采样与显著性、push/poll 生命周期 | 不并入只读 viewer MVP；另有真实需求时规划 | [08-25 决策](../archive/legacy-notes/decision-2026-08-25.md) |

草稿目录的早期动态 spike 限制、Skill 根定位 baseUrl 错误、品牌 direct edit、zod bundle 问题，都有后续修复记录；保留在归档/踩坑而非列为当前 blocker。
