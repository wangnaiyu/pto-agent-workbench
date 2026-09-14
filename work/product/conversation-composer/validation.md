# 输入区验收

历史 08-26/27 测试仍是旧版本证据。2026-09-04 曾在分层测试中验证 Record 分析草稿和
first-send 重试，但 2026-09-08 真实 Web 组合没有向模型首步注入结构化准入；因此不能再用
这些分层测试宣称 Viewer 分析端到端通过。

| 场景 | 验收点 |
| --- | --- |
| +、/、搜索、退出菜单 | 一套目录；光标/输入不丢；不多插入字符 |
| 同名 command 与 skill | 都保留，采用正确显式手势与各自覆盖规则 |
| 未分组 / 工作区草稿 | scope 正确，查询不建 Agent/Session、不读无关工程 Skills |
| 工作区/preset/model/permission 变化 | 共用状态、草稿保留，目录及时刷新 |
| 首次发送时 provider/文件变化 | 实际 Session 再校验，错误可见，不执行错误 Skill |
| 双击、网络错误、空 Session | 幂等、可恢复，无重复模型请求或丢失附件 |
| 窄屏/长目录/hero 与 dock 切换 | 菜单可滚动、焦点与输入保留，不出现多重外层滚动 |
| viewer → 分析草稿 → 发送 | 图状态保留、上下文结构化、正文可改，纯查看不触发模型 |
| 已有 Session 附加另一记录 | 不变更 cwd；数据、工具和 bundle 失配显式提示 |

新的端到端验收必须从实际 Viewer 按钮启动，断言输入区出现 `/skill dependency-redundancy`、
`@deps.json` 和短 Prompt，且默认不显示 Record 名称/revision；点击发送后再从 Host/Session
证据确认唯一 Session、admission 顺序、receipt、固定 Skill 与模型首步输入。不得用 Controller
fake、人工 admission source 或单张截图替代这条组合验证。

还需分别验证：同 launch 准入失败重试不新建 Session；返回 Viewer 再次点击形成新 launch；
双击合并；已有未发送草稿不丢；缺 receipt 时纯文本不发送且 Shell fallback 不可用。

应记录 UI 行为、Host 调用次数/参数、Session 数量与请求身份；单张截图不能证明无后台 Session 创建。模型调用、工具授权和目录选择分别验证。

## 2026-09-14 修复组合验收

P1–P4 独立阶段与 P5 正式组合已完成本地验收；实际首发、同 Session 模型重试、新 launch、规范引用、附件持久化与只读双模式工具证据见 [最终报告](../../archive/tasks/2026-09-08-artifact-analysis-launch-repair/final-report.md)。实验布局使用真实持久 planned 与明确标注的终态呈现 fixture。保留已归因 lint/GUI/browser 红项；不宣称全套 CI 绿色、外部模型智能效果或性能收益，不自动推送发布。
