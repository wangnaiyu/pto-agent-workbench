# 恢复并执行此任务

从 pto-agent-workbench 外层仓库进入。先读根 `AGENTS.md` 和项目
`workbench-project-workflow` Skill，再依次读本包 `README.md`、`status.md`、`plan.md`。随后按
README 的读取顺序加载当前步骤所需正式主题和 harness 内适用的 Agent 指令。

先核对外层与 harness 的实际 HEAD、dirty worktree、未完成进程/执行标识和当前授权。保留已有
未提交改动，不把归档任务当当前指令，不从 P0 重做已经被最新 status 明确验收的阶段。

若用户已明确授权执行本任务包，按 `work/docs/task-workflow.md` 的逐子任务 checkpoint 协议从
status 的 `current-step` 连续推进；每一阶段开始前写状态，完成验证和正式文档回写后再进入下一
阶段。若仍为 `planned` 且没有执行授权，只报告具体下一步并等待授权。

核心不可变约束：输入区只显示规范 `/skill dependency-redundancy`、`@deps.json` 和短 Prompt，
Record 名称/revision 默认隐藏但结构化 identity 必须保留；每次 Viewer 点击是新 launch，同
launch 重试复用同一 Session；缺 receipt 不降级发送或手工 Shell 复算；不修改 DSH 原生宽度
手柄，优先在工作台自有实验 View 内修复。

安装依赖、访问网络、设备运行、修改只读来源、扩大到 DSH 核心布局、commit、push 和发布均需
按实际授权处理，不能从本恢复提示推定。
