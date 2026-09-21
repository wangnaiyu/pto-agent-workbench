# 固定目标审计

目标 upstream master / dsh-v0.1.6-alpha.2：`ddefc45fbc7f8e46dd73185e68295696d1297887`。相对前次固定上游增加 882 commits（包含 merge），2548 文件变化；fork 重放区间 30 commits。

官方 SESSION_FORMAT_VERSION 与 release record 相对此前上游未变（仍 V3）；fork V4 与 V3→V4 迁移必须保留，未发生同整数 V4 碰撞。重点变化为 Client Session 引用及 provider 所有权、SlotFactory/组件工厂、Sidebar 分组、资源/Office preview、插件管理、FS 权限与 SDK/fixture 更新。

验证面：全量构建与类型、PTO Host/Client 和相邻 session/catalog/migration、GUI 与草稿正式会话切换、Web 交互/工具/Viewer/Skill、真实外层 patch；静态文档/装配门禁。历史 V4 fixtures 不能简单覆盖新 V3 场景；按所属生成工具核验 successor。

远端 origin/main 与 origin/master 在 fetch 后分别等于本次两仓起点；无并发更新。恢复分支 codex/pre-upstream-master-20260921，候选 codex/upstream-rebase-20260921；推送前再次观察远端。
