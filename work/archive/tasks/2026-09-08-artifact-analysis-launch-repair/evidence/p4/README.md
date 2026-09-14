# P4 布局证据

解释见 [P4 报告](../../p4-report.md)，当前状态看 [status](../../status.md)。

## 最终构建

- [源码 hash](source-manifest.json)：Dashboard CSS 变化，ConversationRoot 与 Host 查询源码对 P3 无差异。
- [最终几何](layout-metrics.json)：13 个观察点，含所有卡片/按钮边界、正文偏好、列数与容器宽度。
- [底部测量](bottom-metrics.json)：四个场景均到达真实 Conversation scrollport 底部，输入区留白 40px。
- [最终 DOM](final-dom.txt)、[运行观察与清理](runtime-observations.json)。
- 截图：[1280](final-1280-default.png)、[1600](final-1600.png)、[900](final-900.png)、[700](final-700.png)、[700 底部](final-700-bottom.png)、[1280 侧栏](final-1280-sidebar.png)、[1280 侧栏底部](final-1280-sidebar-bottom.png)、[900 侧栏](final-900-sidebar.png)、[增长输入区](final-grown-composer.png)。

## 数据和复现

[planned.json](planned.json) 是真实 Host plan 返回的十二条持久计划记录。另两条终态卡片来自 [seed](seed.mjs) 中明确标注的 DTO 呈现 fixture：它们用于布局检查，metric 为 null，没有执行实验或生成性能结论。seed 通过真实 Remote 查询后附加 fixture，未改 DOM，也未进入产品 patch。

隔离环境组装参考 [launch](launch.py)、[测试 patch](common.patch.yml) 与 [P0 回环模型](../p0-instrumentation/mock.mjs)。使用新的 mkdtemp 根、真实工作台 patch 和仅浏览器目录 picker/布局 fixture 覆盖；将 patch 中的临时 seed 路径更新为新根。创建 workspace/source、workspace/baseline-with-a-long-recognized-fixture-name/kernel_config.py，初始化 mock-control.json 后启动模型及 Host。模型启动时 P0_ROOT 指向该隔离根；launch 使用 mock-ready.json。这里保留脚本的原路径是为了审计，不能原地复用或覆盖历史 home。

planned 的执行命令明确为不可执行的测试占位；测试只查看、拖动、切 Tab 和编辑未发送草稿。浏览器 viewport 由 CUA 设置为计划中的尺寸，侧栏/手柄/滚动均由真实 UI 操作；几何读取只读 DOM。原始工具日志、全部测量和隔离数据仍在本机；证据中不保存认证 URL 或完整模型 prompt。

## 检查与初稿

[局部测试](local-tests.txt)、[完整 GUI](gui.txt)、[GUI 基线对照](gui-baseline-comparison.json)、[build](build.txt)、[doc-sync](docsync.txt)、[hygiene](hygiene.txt)、[快速文档检查](doc-quick.txt)、[lint](full-lint.txt) 与 [逐项对照](lint-baseline-comparison.json)。GUI 十个失败均匹配 P3，不视为绿色套件。

[初稿测量](initial-layout-metrics.json) 对应底部留白调整前的布局，只作过程证据。900px 的初稿 transition 样本已标记不作为验收；最终 900px 以稳定后的 680px 为准。

## 完整 browser replay 停止

[日志摘录](web.txt)、[逐块对照](web-baseline-comparison.json)、[比较脚本](compare-web.py)、[新失败完整块](web-new-failure.txt)、[源码/假设](web-investigation.json)。51 块中 50 块匹配 P3，另 1 块未归因；遵守阶段边界停止，见 [停止报告](../../p4-validation-blocker.md)。脚本读取保留在本机的 P3/P4 完整原始日志；重新运行需先准备对应日志，不把 curated 摘录冒充完整日志。

## 专项归因完成

[原版基线](round-trip-baseline.txt)、[诊断输出](round-trip-observed.txt)、[原断言前与 barrier 后事件](round-trip-observations.json)、[诊断源码](round-trip-diagnostic.e2e.ts.txt)、[结论/hash](round-trip-resolution.json)、[51 块更新对照](web-baseline-comparison-resolved.json)。原停止记录保留；没有改正式测试以通过检查。
