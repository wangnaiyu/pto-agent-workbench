# P4 关联体验与降级证据

日期：2026-09-04。P4 在现有静态 HTML 能力边界内提供可验证的关联，不为无回调的上游
viewer 伪造选区、高亮或深链。

## 已实现

- 同一 Record revision 有多个 available viewer 时，toolbar 显示依赖图/内存图/IR 切换；
  新 exact route 成功后才发布新 handle，然后撤销旧 route。
- 静态 handle 在 wire 和 UI 中固定声明 `selection=false` / `deeplink=false`，工具栏显示
  “仅查看；无选区/定位回流”。因此切换 viewer 会释放旧 iframe 内部状态，不声称跨 viewer
  恢复 zoom/filter/selection。
- 分析草稿保持当前 viewer 打开；草稿 identity 现包含 browser draft revision、catalog
  revision、workspace 和 preset，防止旧结构化分析附着到后续无关草稿。
- first-send 正式准入失败后，已创建 Session 保留草稿与准入 identity；用户在同一
  Session 重试时必须再次通过准入才可发送，不重复创建 Session，也不降级成普通 prompt。

## 验证

- Client controller 测试验证多 viewer 切换沿用同一 record/revision，并关闭前一 handle。
- Conversation 集成测试验证首次准入拒绝后，第二次提交重做准入、只物化一个
  Session，准入通过后才发 prompt。
- 完整 Harness 浏览器验收在同一 20260804 Record 中从 memory 切到 IR、再切回 memory；
  每次新 route 成功后旧 route 均返回 404，关闭 overlay 后当前 route 也返回 404，且全过程
  保持“仅查看；无选区/定位回流”声明。
- 相关 lint、TypeScript、package dependency/workspace/tsconfig/Cordis catalog 门禁通过；
  Host/Client 聚合构建通过。

本阶段未增加上游 viewer 不具备的 selection/deeplink 协议，也未实现持久 Analysis View。
这些不影响本 MVP 的纯查看、固定 Skill 首发分析和显式降级闭环。
