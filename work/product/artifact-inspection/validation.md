# 验证矩阵

状态：待后续 P0 建立实际结果。本轮只落盘设计，以下“应当”均不是已通过报告。

## 真实数据选样

[来源登记](../../references/sources.md) 中的真实样例和 PTO-TestData 均只读。前期盘点线索包含 20260720 Qwen L2（约 18MB）、20260723 runtime（约 39MB）、20260804 compile/IR（约 330MB，单 HTML 约 305MiB），以及 legacy program/merged/memory、markerless rank/dispatch。大小仅供选样，P0 重新核对，不把目录日期当运行身份。

矩阵每行登记 sample locator/指纹、generation、文件/schema、工具 commit/命令、环境、viewer 入口、Skill commit、实际输出、耗时/资源、限制与原始数据完整性。只选代表数据，原始数据不复制进 Git。

## 场景与预期

| 场景 | 必须满足 |
| --- | --- |
| 完整 3.0 数据 | 根据真实输入打开已适配 viewer；查看无 Session/模型 |
| 仅 deps.json / 无 marker | Evidence Pack 仍可打开依赖图；不足以认定可重跑 Run |
| 仅编译 / 缺 runtime | 可用编译图照常打开；运行时能力解释缺失而不是标运行失败 |
| legacy / unknown / 混合代际 | 分 adapter 求能力，不能只按目录名标 3.0 |
| 缺 name_map / deps / timeline | 区分 viewer 可降级和具体 Skill 的硬依赖 |
| 解析失败 / 无权限 / 未完成扫描 | 保留 invalid/unreadable/unchecked 区别 |
| 重复路径、symlink、大小写和输出重用 | 去重/containment 可解释；原始文件不被修改/删除 |
| 大 HTML/JSON、准备取消、服务异常 | 可取消、UI 不长时间冻结；无残余服务或原数据写入 |
| 无 Skill / 无工具 / 版本不配 | Viewer 独立可用；分析提供具体阻塞 |
| 双击发送 / preflight 失败 / 模型失败 | 无重复 Session，输入附件保留，可重试并有真实失败记录 |
| 图→分析→恢复会话 | 状态保留；Skill/数据修订一致，失配显式提示 |
| 跨 rank/dispatch 重复 task ID | 引用不串图；图与报告采用相同 identity |
| 静态 HTML 不支持选区回调 | 仍可打开，明确不支持交互回流，不伪造高亮 |
| 关联源码但无 exact join | 只标候选；不变更已有 Session cwd，不执行/改源码 |

## AI 分析验证

不只看自然语言“读过数据”：保留实际 Skill 调用版本、工具命令/输出、输入 artifact 引用及报告证据。官方冗余依赖分析需按上游契约执行结构与数据流两模式（depth=1 的合法提前终止另记），检查 stderr 中的循环 fallback，不能以 exit=0 单独判成功。

关键路径须有时间线与依赖的可靠关联；报告拓扑简化不等于测得性能提升。无时间数据时不得生成 measured speedup。

成功标准是受支持矩阵中的各 viewer 可打开、选定官方 Skill 能完成真实读数/分析、结论可定位证据。浏览器截图、结构快照、命令日志只是不同证据，不互相替代。实际验证结果写对应任务 evidence / final-report，本文保持验收契约。
