# 初始盘点

2026-09-09 本地与 origin：工作台 main 82afed7ec374805e02c5414e000b3f4e5ea7b9df；harness master 8a0cfdf8a8ed79e5c304be287440ebb1b001a878。与用户记录一致；未访问 upstream。

外层原有 22 个 tracked 变更和 24 个 untracked 文件；harness 原有 39 个 tracked 变更和 12 个 untracked 文件。外层旧 MVP 删除对应整包归档，新 repair 包仍 planned。源码、测试、装配、官方固定物料及研发材料均保存；初始逐文件 SHA-256 和状态见同目录 JSON/TXT。

外层 ignored lib/dfx/capture.md 是 release-lock 必需资源，hash 与锁一致，必须入库；用精确路径例外保留。release-lock 的两条证据链接随已完成归档更新。官方源文件未修改。

harness ignored 共 554 个目录/条目，主要是 node_modules、lib、tsbuildinfo、apps/web/dist、website 生成目录、coverage、.dsh-build 和 .artifacts。旧 screenshots 和 examples 用途不作删除推断，全部留本地；不纳入本次 Git 提交。初始文件快照与 binary patch 在本包 ignored scratch，最终 Git commits/savepoints 承担正式恢复。

已知 Viewer 首发缺结构化 admission/receipt、launch 重试语义和实验页宽度问题由独立 repair 包处理。本阶段不修复，也不以历史 223/223 或截图代替本轮验收。
