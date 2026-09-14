# P1 正式 provider 装配证据

2026-09-11，在 P0 提交 `642632176df9f1131e9c41cbffc33c3b414184ff` 上，仅正式 patch 的 official provider 条目改为 insert。harness 保持 `ac2b72a9615cbaf23bb21951ffe1c22f3a11d807`。

- [装配反例](composition-before.txt)、[装配/launcher 测试](composition-tests.json)：真实 CLI web profile 组合；修复前缺 provider，修复后唯一；三个负向变体均被拒绝。
- [Host trace](host-trace.jsonl)、[草稿 catalog](draft-catalog-dom.txt)、[首次发送 DOM](first-send-dom.txt)：无额外 provider patch 的实际工作台；root catalog 与 Session qualified lookup 同固定资源。
- [Session 精选事件](session-events.json)、[模型替身观测](model-trace.jsonl)、[17 条断言与物料/输出 hash](validation.json)：完整 receipt、一次固定 Skill 注入、真实双模式 Python 工具返回及只读输入。
- [harness 消费测试](consumer-tests.txt)：4 文件 99/99；[清理](teardown.json)：仅本次两个进程，均退出 0，测试 tab 已关闭。

[launch.py](launch.py) 仅加载正式工作台 patch 与 [common.patch.yml](common.patch.yml)。后者仅切换测试目录选择器并装 [只读 observer](observer.mjs)，不添加 Skill provider，不改变 admission 返回值。模型替身和 Session 全帧解码沿用 [P0 mock](../p0-instrumentation/mock.mjs)、[P0 decoder](../p0-instrumentation/decode-sessions.mts)；日志中的 P0 文案/变量名来自复用测试替身，不是本次临时 provider 对照。对外模型质量未验证。

复现时建立新的临时目录，复制上述 mock/decoder/launch/observer/common，更新 common 中 observer 绝对路径，设置本地 mock 的 P0_ROOT、空 mock-control.json；mock-ready 后执行 launch.py p1。DSH_HOME 隔离；样例沿用 P0 授权的只读 Qwen L2 deps.json。不得复用正式用户 DSH_HOME。浏览器通过 Run Records→打开样例→Viewer→Analyze with AI→手动关闭 Viewer→发送进行；Commands 菜单只观察并撤销临时 `/`，不额外选 Skill。解码全部 Zstd frames 后运行 [curate.py](curate.py) 校验和精选证据（其中指针文件指向本次临时根，复现时需更新）。

输出图的完整派生文本及完整 Session 留在隔离临时根；只入库摘要/hash、必要事件与观测。不复制大图、完整系统提示、原始样例、认证 URL 或凭据。Viewer route 在 Host trace 中去除，Session/request/record 身份原样保留。
