# 来源登记与本机定位

采样日期：2026-09-03。下列 Git 值为本地 HEAD，不表示远端最新，也不证明工具与样例已兼容。镜像只读；版本候选更新须另有授权。

## 工程来源

| ID | 来源/定位 | 用途与可信边界 |
| --- | --- | --- |
| dsh-upstream | https://github.com/deepseek-ai/deepseek-harness | DSH 官方机制；核对目标版本 |
| dsh-fork | 本仓库 harness；HEAD 489f3f65b1e0218e4f59834e40c422dec1196f9c | 当前源码基线 0.1.2-alpha.5；与外层独立 Git |
| pyptoux | /Users/wny/Documents/1 项目 Projects/PyPTOUX | 只读产品/业务研究，非 PyPTO 官方实现权威 |
| codex-agents | https://learn.chatgpt.com/docs/agent-configuration/agents-md | 项目指令发现与作用域参考 |
| codex-skills | https://learn.chatgpt.com/docs/build-skills | Skill 发现与渐进加载参考；本地 harness 启动需独立检查 |

## PyPTO 与工具快照

本机镜像公共前缀：`/Users/wny/Documents/2 领域 Area/工作/EASY CANN/样例工程&文件`。以下相对子目录只是本机 locator，不应硬编码进 Host；在其他机器重新配置并核对 commit。

| ID / 子目录 | 本地 HEAD | 用途 |
| --- | --- | --- |
| pypto | 23b68ae91b1cb293a625c286729920fbe7c33edf | 既有 PyPTO 镜像及 .agents/skills |
| pypto-3.0-github | fba9f7b1e95b5501ccb3e7f68de97e767a0ff0e9 | 3.0 对应源代码 |
| pypto-tools | cb083ebbef52ec44a59430ad857b95848f4e85b5 | 用户提供的 2.0/Pro 工具，按样例实测 |
| pypto-tools-github | 955cfcfc01c7028f0e9bef01b3fdabc04e90de9e | 用户提供的 3.0 工具，按 schema/CLI 实测 |
| pypto-skills-github | af1d7a016ce50ba109c4b4224580a6b758bde7da | PyPTO 官方 plugin/skill 结构；分析能力候选 |
| cannbot-skills | 592f652cd702d81267b6b3616bb52e7bd595bb6f | 含不同来源组，逐项确认来源与适用范围 |
| PTO-TestData | 数据目录，无版本兼容性承诺 | 开发测试资料，不默认复制进仓库 |

已有算子样例根：`/Users/wny/Documents/2 领域 Area/工作/EASY CANN/样例数据`。优先引用或建立精选小 fixture，不把大数据与个人本机路径装进运行时包。

## 来源的使用

完整读取真正使用的 SKILL.md 及其必需引用，保留相对资源树；不能只复制一个 Skill 入口。官方 upstream 的更新机制和候选 registry 属于 [官方 Skills 主题](../product/official-skill-integration/update-workflow.md)，本表不是 runtime provider registry。

PyPTOUX 和 quick chat 是设计来源；工具 CLI/schema、数据事实回固定版本源码/实际样例验证。技术记录应标明“已读取”“已运行”“推断”“待验证”，不要混用。
