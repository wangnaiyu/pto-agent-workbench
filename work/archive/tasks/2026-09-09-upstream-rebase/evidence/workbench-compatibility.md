# 完整组合验证

主验证：实际工作台代码与 `patches/cordis.patch.yml` + 已完整构建的隔离 rebase candidate。服务只监听 127.0.0.1:3187，独立 DSH_HOME=/private/tmp/pto-rebase-workbench-home。无外部模型调用；本机 upstream mock LLM 在3188返回固定响应。目录选择使用 upstream Web scaffold 相同的 browse 测试覆盖层。没有修改实际工作台产品文件、真实 ~/.dsh 或 ~/.dsh-pto-workbench 数据。

- 实际 CLI 未带隔离 home 的 help 探查曾被沙箱阻止写 ~/.dsh/profiles/web/cordis.yml，未获执行；后续全部 CLI 均显式设置临时 DSH_HOME。
- 应用加载、PTO sidebar、Run Records、目录导入均可用。Qwen markerless dfx_outputs 只读登记，Viewer 实际显示598 nodes /1222 edges，关闭后移除iframe。
- Analyze with AI仍只预填普通文本，保留全屏Viewer，编辑器被覆盖；未显示Skill和文件引用。
- 关闭Viewer后首发实体化Session；再次发送明确报 official Skill unavailable。该样例Session有V3 header及permission/sandbox/approval设置事件，无prompt/receipt，不能宣称成功准入。
- 重新加载清除Viewer临时状态后，普通New Session一次发送成功，mock response recovered显示在Chat，并创建真实V3 Session日志。
- Experiments在同一真实Session加载空registry。1280×720 viewport下region宽992px，滚动体1000px，max-width:none。截图在scratch/experiment-empty.png。空视图已无旧窄列现象；有内容行及其他尺寸仍应由后续P0重新验证。

## 新发现的升级前部署缺陷

工作台patch把 `skill-filesystem-pypto-official-af1d7a016ce5` 写成普通id覆盖，底层组合并无该entry。旧master和rebase candidate两套built CLI的--dump-config均报告相同entry not found，effective config均无该provider。vendor/include的patch机制两版本相同：未知id警告并跳过，新增entry必须insert。它不是本次rebase引入；runtime资源哈希正确不等于provider装配有效。原始失败文本分别保存为pto-prebaseline-config.txt与pto-rebased-config.txt。

本阶段不修改该既有产品缺陷，不声称official端到端主组合验收通过。补充验证会在独立临时覆盖层中insert同一锁定provider，以隔离检查新版qualified lookup/Host receipt/official tool机制；该补充结果必须与原始工作台结果分开报告。

## 补充隔离结果（不是实际部署验收）

临时insert同一provider后，同一Viewer入口首次点击发送成功，真实V3 Session `session-cbee89c4-2ced-4aea-b229-b3dfa966b316` 有完整 `pto-artifact-analysis` receipt，record/revision/action/artifactRefs、qualified Skill及锁定tool revision均保留；随后注入dependency-redundancy并收到本机mock response recovered。精选源字段见browser-session-summary.json。Mock不调用工具，不能把它描述为真实模型完成分析。

锁定官方Python工具独立对同一只读Qwen deps运行reduced和reduced_dataflow，两者均移除1条 `(1,1) → (3,287)`，1222原始边、1221保留、598任务。输出仅写临时目录，原始输入哈希未变化。资源锁的五项哈希均匹配。

没有外层产品兼容修改，故无compatibility PR。新upstream未破坏观察到的Viewer基础图、普通草稿首发、qualified Skill/Host receipt接口。已知repair需要重新规划：普通文本预填和Viewer覆盖仍在；补充装配下首发receipt并未丢失；实际配置的provider缺失是已被旧built CLI复现的部署问题。new-launch/retry多路径、有内容实验视图/其他窗口宽度没有完整浏览器复验，不宣称解决。自身聚焦测试覆盖相邻基础机制。

两台临时服务已停止；测试home和截图保留。Session使用拼接Zstd frames，证据读取逐frame解码；直接zstdDecompressSync只读首帧会误判只有header，现已更正。
