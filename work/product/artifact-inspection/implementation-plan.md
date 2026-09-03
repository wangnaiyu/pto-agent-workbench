# 开发方案与交付阶段

本计划是后续实施依据，不代表本次治理已经授权或完成产品改码。[任务入口](../../inbox/tasks/2026-09-03-artifact-inspection-mvp/README.md)。

## 组件责任

| 组件 | 拥有的事实/行为 | 不做 |
| --- | --- | --- |
| Host recognizer / inventory | 有界扫描、Record、artifact、解析与关联事实 | 从缺 dump 推断运行失败 |
| Capability / Action resolver | 按证据、适配器与环境求动作就绪度 | 使用隐含 data grade gate |
| Viewer adapter | 输入检查、准备/启动、输出描述、清理 | 重新实现上游分析算法 |
| Client viewer host | overlay / session 视图、loading/error、持久状态 | 读任意本地路径或复制 Host 规则 |
| Session context bridge | 草稿、原子 first-send、稳定引用与结果定位 | 将 Session 与 Record/cwd 混为一体 |
| Official Skill registry/runtime | 版本、资源闭包、作用域与调用回执 | 运行时自行更新上游 |

建议接口包括 probe(input)、prepare(input, outputDir, signal)、open(prepared)、dispose(handle)，返回类型明确为 static-html、local-service 或 native-panel，附输入修订、工具版本、资源路由及可支持的 selection/deeplink 特性。接口名待 spike 后固化。

静态 HTML 优先复用；依赖本地服务的工具由 Host 管理独立端口、生命周期、日志、取消和文件授权；仅有生成 CLI 的工具先转到 app-owned 输出再打开。旧 UI 能复用就包适配器，不为统一外观重写图引擎。HTML iframe/资源路由须有隔离来源、最小 sandbox/CSP 与消息来源校验；查看原始 HTML 不能获得工作台 Host 权限。

## 代际适配

3.0 和 2.0/Pro 分 adapter family；按 schema 和工具实测，不只看文件名。混合目录按 record 选择，unknown 允许部分能力。以下仅为待验证映射：

| 数据线索 | 候选能力 | 验证重点 |
| --- | --- | --- |
| deps.json | 执行依赖图、冗余依赖分析 | schema、循环、rank/dispatch 关联、工具输入 |
| chip_swimlane_records.json 与相关映射 | 泳道、统计、关键路径组合 | 时间单位/任务身份/name_map 的必需性 |
| program.json | 编译计算图 | 不能冒充执行依赖；legacy 层级与图入口 |
| merged_swimlane.json | legacy 泳道 | 原工具版本、renderer/服务协议 |
| memory JSON / memory map HTML | 内存查看 | schema/HTML 资源、编译阶段含义 |
| pass dump / IR HTML | IR 与 Pass 查看 | 文件集合、静态资源、大文件性能 |

## P0：适配验证与契约收敛

只读盘点实际小/大、完整/部分、markerless、混合代际样例；记录工具 CLI、环境、输入输出和资源依赖。逐能力产出兼容矩阵，结论限于验证过的组合。

验证 Root overlay 无 Session 打开和会话 view 的最小承载；官方 dependency-redundancy 完整资源树能被固定版本加载和真实使用。核对 provider shadowing、工具 root/执行路径，不把 Skills 出现在菜单当成功。

退出标准：有可复现的一种 viewer + 一种官方只读 Skill 端到端样例；其他目标能力的已支持/阻塞原因可追溯。若需内核 seam，记录动态/静态插件为何不足。P0 输出固定样例清单，不承诺所有历史文件天然兼容。

## P1：通用打开骨架与数据事实

引入 Record/Profile + action readiness，保留既有注册身份的迁移策略；补 markerless/部分数据识别。建立 viewer host、adapter 生命周期、错误/取消与 app-owned cache。

优先打开已存在 HTML 和 P0 证明可用的 renderer；串起选择数据→记录→打开→关闭，无模型/Session。去除消费者对旧 aggregate health/数据级别的依赖时，兼容迁移 Host 与 bundled Skills，不只换 UI 文案。

## P2：执行依赖 + 官方冗余分析闭环

同一记录：打开依赖图→草稿→首次发送→官方 Skill + 对应工具→带证据报告→保留图。接入真实 Session scope、版本回执、上下文 preflight、重复提交防护。深链可先使用文件/实体引用，图中选区高亮不强行作为 P2 前置。

## P3：扩展“能打开 / 能使用”的覆盖

按 P0 矩阵完成泳道、关键路径、内存、IR/计算图和受支持 legacy 样例；逐一验收，不用一条成功样例概括“所有可视化”。大 HTML/JSON 用限流、索引、懒加载和取消；不整份注入聊天。

## P4：关联体验增强

选区带入、结果定位、图状态恢复、跨多 artifact 导航。根据适配器能力逐步启用；不支持交互回调的旧 viewer 仍可用于纯查看/报告。

## 验证与控制范围

Host schema/解析单测 → adapter contract tests → Session/权限集成测试 → 真实样例浏览器验收。每阶段记录原始输入未变和输出/进程已清理。详见 [验证矩阵](validation.md)。

不做新统一图引擎、自动采集/编译、全量 skill 安装、产品更新 UI、自动优化重跑、统计性能保证。性能目标由 P0 的实际机器/样例测量后确定，不预设未经测量的秒数指标。
