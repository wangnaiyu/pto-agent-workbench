# fork 维护与 upstream rebase

## 前置

- upstream: `git@github.com:deepseek-ai/deepseek-harness.git`（默认分支 `master`）
- fork: `git@github.com:wangnaiyu/deepseek-harness.git`（假定）
- 本工作区 clone 位于 `harness/`

## 流程

```sh
cd harness
git remote add upstream git@github.com:deepseek-ai/deepseek-harness.git   # 首次
git fetch upstream
git checkout master          # 或你的开发分支
git rebase upstream/master
# 解决冲突：优先保留 upstream 变更；若本工作区改动因冲突变复杂，
# 说明该改动属于"内核层"，考虑改走插件层实现（R1）
pnpm install && pnpm run build && pnpm run typecheck
git push --force-with-lease origin master
```

## 纪律

- 频率：至少每 1–2 周一次，或每次开工前一次（P6.3）。
- 内核改动（packages/ 内、非新增包）越少，冲突越少。
- 新增包（如 pto 工作台 client 插件）几乎不冲突；修改既有包（layout、apiproxy、tool 体系）高风险。
- rebase 后必须跑 build + typecheck（P6.4 构建链）。
