# 验证矩阵

状态：2026-09-04 的 Profile/viewer/adapter 实际验证仍有效；2026-09-08 真实产品体验确认
Viewer→分析 first-send 未在实际 Web 组合中携带结构化准入，相关“已通过”结论降为历史分层
证据，等待新任务重新完成端到端验收。

## 真实数据选样

[来源登记](../../references/sources.md) 中的真实样例和 PTO-TestData 均只读。前期盘点线索包含 20260720 Qwen L2（约 18MB）、20260723 runtime（约 39MB）、20260804 compile/IR（约 330MB，单 HTML 约 305MiB），以及 legacy program/merged/memory、markerless rank/dispatch。大小仅供选样，P0 重新核对，不把目录日期当运行身份。

MVP 实测四组只读样例：20251112 three-view、20260528 A5 PMU、20260720 Qwen L2、
20260804 IR lowering。它们覆盖 evidence-pack/run、2.0-pro/3.0/unknown、dependency、legacy
证据、自包含 memory/IR 和约 305 MiB 大 HTML；原始数据未复制进 Git。

## MVP 实际结果

- 9 个聚焦测试文件 223/223；相关 lint、Host/Client 聚合构建、Web production build 与仓库
  门禁通过。
- Qwen L2 真实 Host→Tool 结构/数据流双模式均删除 1/1222 条边，目标均为
  `(1,1)->(3,287)`，stderr 无循环 fallback，输入 hash 未变化。
- 完整 Harness 浏览器中 dependency、memory、IR 均可打开；纯查看未创建 Session。
  20260804 memory 展示 34 个 compute function/743 tiles，IR 在 45 秒验收检查点已完成渲染。
- memory/IR 切换时旧 exact route 撤销，关闭后当前 route 撤销；静态 viewer 明确声明无
  selection/deeplink。
- timeline、critical path、program 与 raw pass 没有 adapter 时返回具体 unavailable reason。
  Gzip listener warning 作为本机环境观察保留，不影响本次功能通过，也不构成性能保证。

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

成功标准是受支持矩阵中的各 viewer 可打开、选定官方 Skill 能完成真实读数/分析、结论可定位证据。浏览器截图、结构快照、命令日志只是不同证据，不互相替代。后续新增格式仍须逐 adapter 留存实际 evidence，不能沿用本次通过结论。

### 2026-09-08 回归必测项

- 点击“AI 分析”后只有一个 browser draft，不创建 Session、不调用模型；输入区显示规范
  `/skill dependency-redundancy`、`@deps.json` 和短问题，不默认显示 Record 名称/revision。
- `/skill` 与 `@file` 必须复用正式选择/解析语义，不是纯文本或视觉伪装；隐藏 attachment 保留
  record、revision、provider、action、artifact 和 tool identity。
- 首次发送在真实 Web 插件组合中只创建一个 Session；Host admission 在 prompt 前完成，持久
  审计可关联 launch/request/session，模型第一步实际收到 receipt 和固定 Skill。
- admission 失败不得发送无上下文 prompt；同 launch 重试复用同一 Session。模型/工具失败也在
  同一 Session 恢复；返回 Viewer 再次有意点击则产生新 launch，发送后产生第二个 Session。
- 双击“AI 分析”或发送只产生一次 activation；已有未发送草稿不得被静默覆盖。
- 缺 receipt 时不能调用门禁工具，也不能通过通用 Shell 手动复算冒充正式结果。
- 拖动 DSH 原生正文宽度后切换自定义“实验”Tab，Dashboard 不越过
  `--dsh-chat-content-width`；四列内容按断点降为两列/单列。验证不要求修改 DSH 宽度核心。
