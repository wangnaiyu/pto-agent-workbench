# 恢复指令

从工作台根目录读取 AGENTS.md 与 workbench-project-workflow Skill，再读本包 README、status、plan 和 p0-report。status 是唯一当前步骤来源；执行权限以最新用户指令为准，不能根据计划编号自动连续推进。

核对外层与独立 harness 的分支、HEAD、工作树、live origin、post-upstream tag 与保留恢复点。先核实已有运行标识/日志和证据，不重复启动已完成的隔离实验。任务证据中的临时 provider/observer/model 只用于 P0，不是正式产品补丁。

后续 config/composition repair、launch 生命周期、可见输入和实验布局按 plan 分开验收。P0 成功对照已证明正确的 Host receipt 生成器不作为默认改写对象；精确 relaunch target 时序仍需在实现前补确定性组合反例。不得未经授权进入下一阶段、commit/push、改写远端或清理旧恢复点。
