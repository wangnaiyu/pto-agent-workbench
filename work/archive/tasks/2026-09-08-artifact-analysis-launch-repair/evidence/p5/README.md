# P5 正式组合验证证据

- [实际装配和 launcher](composition.txt)：8/8。
- [客户端 launch/引用/附件](client.txt)：76/76。
- [Host/PTO/实验基础能力](host-scope.txt)：37 passed / 1 既有工具清单失败，未降低规则。
- [证据复用与源码 hash](evidence-reuse.json)：P3 实现 hash 全部一致；P4 完整 GUI/browser、build、文档、hygiene、lint 和有内容布局验证后的 harness HEAD 未变。保留真实失败分类，不把红套件描述成绿色。
- [真实日志断言](live-verification.json)、[验证脚本](verify-live.py)：42/42；读取 decoded Session 和真实工具输出，不生成 receipt、source 或工具结果。
- [模型调用摘要](model-summary.json)、[最终清理](final-runtime.json)。模型只作确定性协议替身，实际 Host、Skill、Python 工具和原始 Qwen 图参与验证。

## 实际界面

[规范草稿](first-draft-dom.txt) / [截图](first-draft.png)、[草稿附件](draft-with-attachment-dom.txt)、[首发模型错误](model-failure-dom.txt)、[同 Session 重试](retry-success-dom.txt) / [截图](retry-success.png)、[刷新恢复](restored-draft-dom.txt)、[Enter 引用回开](reference-reopened-dom.txt)、[新 launch](new-launch-success-dom.txt) / [截图](new-launch-success.png)、[实验 Tab 基础装配](experiment-base-dom.txt)。

新 launch 的双击、刷新和引用回开期间模型请求数保持 6；发送后生成第二个分析 Session。第一个分析 Session 首发附件持久化，模型 400 后纯问题重试成功；整个 Session 仅一次 receipt/Skill source。第二个 Session 首发成功且有新 request，两者各执行真实 reduced/reduced_dataflow。原图 hash 未变。

P2 缺 provider/准入拒绝、物化 single-flight、Workspace/preset/Record 变化和 Host 重启拒绝矩阵按原阶段分层证据保留；本轮重跑的客户端组合包含附件重绑定和 admission 拒绝后重试，不把 test stub 当真实 receipt。完整有内容实验布局复用 P4 的 12 条持久 planned + 2 条明确标注的终态 DTO 呈现 fixture；本轮正式产品没有注入该 seed，也没有执行实验。

## 复现与历史阻塞

[启动脚本](launch.py)、[目录 picker 覆盖](common.patch.yml) 与 P0 mock/decoder。恢复时创建新隔离根并将 mock 与脚本置于根内，显式传入该根；不覆盖历史 home。解码后执行 `python3 verify-live.py <fixture-root> <original-deps.json> <report.json>`，脚本核对真实 source、receipt、工具输出、附件存储及输入 hash。

早先浏览器自动审核超时和退出记录保留在 [初次运行](runtime.json)，不冒充成功验证。用户再次明确授权后，同一 browser API 重试获准，完成上述真实路径；没有切换浏览器/CDP 绕过。所有成功和失败运行的隔离根均保留，未保存认证 URL 或完整 prompt，未复制原始大图。
