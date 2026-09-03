# 开发端官方 Skills 更新流程

仅开发者维护；产品没有 Skills 检查/更新 UI，Agent 分析时不自行拉取上游。更新须有明确范围与执行授权；本轮只设计机制，不 fetch 或安装。

## 版本物料

建议由未来构建代码维护 source registry 与 release lock（文件名/位置在 P0 固化），不要把本主题说明文档当机器注册表。

Registry 至少含 sourceId、repo URL、来源类别、许可、skillRoots、selectedSkills、资源引用边界、tool source/compatibility 和 optional patches。Lock 至少含完整 commit、bundle/content digest、实际 Skill identities、工具固定版本、资源闭包清单和验证结果引用。官方来源声明与是否已通过本工作台验证分字段保存。

## 更新链路

```text
开发端检查候选 revision
  → 审阅 Skill / 资源 / CLI / 许可差异
  → 构建隔离候选 bundle + lock
  → 输入兼容与调用测试 + 真实样例回归
  → 审阅合入
  → 获授权发布固定版本
```

1. 在授权的开发副本获取候选 commit；不覆盖当前 runtime bundle，也不顺手更新用户给定只读研究镜像。
2. 比较正文、间接资源、脚本参数、agent/plugin manifests、依赖和输出 schema。高风险新增行为须显式决定是否启用；来源“官方”不替代审计。
3. 构建保留相对引用的完整子树/闭包，生成 hash/lock。兼容性必须包含配套 tools，不能只 pin 文本版本。
4. 在隔离测试目录用指定样例运行。缺失资源、同名覆盖、不同 scope、无环境、失败和 fallback 都要验证。
5. 提交候选 diff、兼容矩阵、变更说明与回退目标，按实际权限合入/发布；不由“测试通过”自动推送。
6. 新 Session 默认使用发布配置中的固定 bundle；已有 Session 继续旧 revision。若需迁移，以明确提示/记录执行，不能偷偷换包。

## 回退与复现

保留已发布 bundle/lock 与必要工具版本；恢复分析时先解析精确 tuple。当前环境无法提供旧工具或资源时，记录不可复现的原因，不能声称旧结论重新验证过。

回退只切换后续默认版本，不改写历史调用 receipt。发布清单显式包含选用 runtime 资源，排除 work、开发 Skill、镜像 .git、原始大数据与临时测试产物。

## 更新何时影响产品设计

新增/移除 capability、证据要求、输出定位或用户可见风险时，同步更新动作定义与对应主题/验收；只有文案修订且契约不变时不拆新主题。若官方新增能力不在当前 MVP，不自动扩大任务范围。
