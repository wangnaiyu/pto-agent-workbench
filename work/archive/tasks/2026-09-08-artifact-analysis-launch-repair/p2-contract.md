# P2 最小提交/恢复契约

状态：2026-09-14 用户允许 [停止报告](p2-blocker.md) 的受限方案；本页细化实现边界。

- Conversation 提供可注册的提交绑定校验。绑定由 owner + 稳定 id + JSON payload 构成，PTO 数据仅由 ui-workspace 解释。普通无绑定输入不受影响；unknown owner、无效存储、缺失绑定不能当成功。
- 首发先校验浏览器绑定，再 materialize；绑定先转移到真实 Session 并持久保存，再执行 Host admission 和 prompt。重复校验串行/合并，失败保留绑定和文本，同 Session retry 复用同一 request ID。
- 默认 Session send 路径强制调用该 gate，不依赖 slash 文本、按钮 disabled 或 InputTriggerSource.matchEnter。已有 slash 命令语义不变。
- 使用现有 Conversation 浏览器交互存储所在 origin 的 localStorage，独立 versioned 键保存 launch 绑定与浏览器草稿文本；这不是 Session log。存储失败阻止该 launch，不能静默清除门禁。PTO payload 不包含凭据、原始文件内容、Host receipt 或第二份 Session 历史。
- 新 draft 不覆盖未发送文本；需先清除草稿后重新关联。新 Viewer activation 创建新 launch，双击被合并；编辑问题保留结构化 intent。preset/workspace 变化不修改 launch identity，最终在真实 Session scope 重新校验固定 tuple。
- 刷新恢复关联后每次发送仍向 Host 校验；Host 重启失去记录时明确要求从 Viewer 重新关联，不隐式重建。取消在准入/物化途中不能进入 prompt；已物化身份仍保留用于同 Session 恢复。

仅本阶段实现/验收 launch 与 fail-closed。P3 才引入可见 Skill/file reference，P4 才修改布局。
