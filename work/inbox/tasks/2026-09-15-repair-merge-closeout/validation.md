# 合并前验证依据

当前 harness outgoing base ac2b72a9615cbaf23bb21951ffe1c22f3a11d807，head 368c446657932f170a6d29fd2d275bea1c76073e，3 commits / 59 files。完整 change-scope 已保存；P5 harness SHA 未变，33 份 P3 实现 hash 与已验证证据一致。工作台产品 patch 相对 P5 没有改动，本阶段只有维护文档。

正常 harness pre-push typecheck 17.35s 通过，hook 自身执行依赖检查/产物准备；未跳过 hook，锁文件和 tracked 源码未改变。工作台结构检查 122 Markdown / 0 errors，完整工作树密钥检查 438 files 通过，维护提交正常 staged secret-check 通过。

P0–P5 原检查、真实组合证据和 known issues 见 [修复报告](../../../archive/tasks/2026-09-08-artifact-analysis-launch-repair/final-report.md)。full lint / GUI / browser 仍有逐项归因的原基线失败，不能描述成绿色。

## GitHub 证据分类

两仓 rules 返回空列表，branch protection 返回 Branch not protected；没有必需审批配置。不使用 admin bypass。无配置的门禁不意味着所有实际 CI 自动通过；新产品失败仍须诊断并阻塞合并。

harness CI 中 static、coverage、snapshots/artifacts、多项 Windows 与部分 Node/Python lane 通过 fork skip 输出成功；必须查看具体执行步骤，不能计作真实验证。其余实际 benchmarks、Node 22、native、packaging 和 runtime job 等待结果。

request-review workflow 从目标 master 执行原有 ownership map，要求 @imccyu 审查，但该账号并非 fork collaborator，GitHub API 返回 422。日志见 [失败证据](evidence/request-review-failure.txt)。这是原有 fork reviewer 配置不适用，无产品检查运行；不邀请上游人员、不改 ownership/workflow、不重跑求绿，保留失败记录。

Cloudflare preview 在 Upload to Cloudflare Pages 步骤因 CLOUDFLARE_API_TOKEN 未配置失败；构建步骤已先通过。这是非必需的 fork 预览部署配置限制，保留 [日志](evidence/preview-failure.txt)，不补配部署凭据、不修改 workflow、不重新发布。与前一阶段 runner 排队取消不同，以本次实际日志为准。
