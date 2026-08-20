# notes/

记录层：过程判断、状态、验证、决策与待办。不承载正式交付物，也不替代 overview.md、PRD、报告或原型实现。

## 规则

### 1. 核心定位

记录过程判断、状态、验证、决策和待办；**不承载正式交付物**，也不替代 overview.md、PRD、报告或原型实现。

### 2. 同步维护

Agents 新建或更新正式输出时，默认同步维护 `notes/` 和 `prompts/`。

### 3. 命名规范

`<slug>-YYYY-MM-DD.md`（各类型按需存在，不强制每次生成）：

| 文件 | 用途 |
|---|---|
| `notes/update-YYYY-MM-DD.md` | 更新摘要、事实依据、重要判断、决策、影响范围、验证结果、未解决问题、后续动作 |
| `notes/story-YYYY-MM-DD.md` | 用户场景、体验脚本、叙事脚本、体验走查剧本、demo story |
| `notes/review-YYYY-MM-DD.md` | 原型验证、cross-review、对 Codex owner 内容的澄清或修订建议 |
| `notes/decision-YYYY-MM-DD.md` | 已接收、需要长期保留的正式设计决策 |
| `notes/clarification-YYYY-MM-DD.md` | 正式澄清记录 |
| `notes/sample-data.md` | Demo 样例数据、数据等级、来源及生成规则 |
| `notes/spec.md` | prototype toolkit 的稳定契约 |
| `notes/backlog.md` | 工具或 toolkit 的稳定待办 |

### 4. 语言

正文、标题和说明默认使用中文；路径、文件名及代码标识保持英文。

### 5. 同日唯一性（所有类型）

同一天每种类型只保留一个 `<slug>-YYYY-MM-DD.md`；同一天多次更新，追加到原文件，不另建碎片文件；多个无关工作流放在同一个文件中，以 `## <workflow-or-topic>` 分区，内部使用 `###`；不得创建 `<slug>-YYYY-MM-DD-<topic>.md` 一类变体。

### 6. 琐碎变更

纯错别字、链接修复、机械格式化可以并入当天记录；当天尚无记录时可以不新建，但交付时应说明属于 trivial change。

### 7. frontmatter

review、decision、clarification 类文件必须包含：

```yaml
---
owner: <agent>
status: proposed
source: cross-review
decision: pending
---
```

- `owner` 可用值：`DeepSeek`、`Codex`、`Claude`
- `status` 可用值：`proposed`、`accepted`、`superseded`
- `source` 可用值：`DeepSeek`、`codex`、`claude`、`user`、`cross-review`
- `decision` 可用值：`pending`、`accepted`、`rejected`、`superseded`
- 若 `status: proposed` 或 `decision: pending`，正文必须说明待 Agents / 用户确认的问题；确认后由 Agents 更新状态或把结论合并进 `prd.md`、`ux-analysis.md`、`interaction-spec.md` 等正式文件。
- 多个无关工作流同文件并存时（见第 5 条），各工作流的正文说明放在其 `## <workflow-or-topic>` 分区下面，不集中堆在文件开头。

## 相邻目录

- `prompts/`：可复现复合 prompt（与 notes/ 在正式输出变更时默认同步维护）。
