# 本次验证记录

日期：2026-09-03。执行环境 Node.js v24.14.1 / Python 3.9.6。所有结果限于本次外层仓库治理；未以此声称产品功能兼容或部署成功。

## 实际执行

| 检查 | 结果与范围 |
| --- | --- |
| node work/scripts/check-workspace.mjs | 归档后复验 60 份 Markdown、主题索引、任务字段/终态、11 份原文 hash / 48 分区覆盖，零错误 |
| node --test work/scripts/*.test.mjs | 13/13 通过：6 个结构/负向用例、4 个隔离启动/装配用例、3 个密钥扫描迁移回归 |
| skill-creator/scripts/quick_validate.py .agents/skills/workbench-project-workflow | Skill is valid；仅格式/命名，不证明自动触发 |
| bash -n setup.sh start.sh | 通过；脚本本身未修改 |
| node --check 新结构检查脚本及现有密钥脚本 | 通过 |
| node .githooks/check-secrets.mjs --self-test | 通过 |
| node .githooks/check-secrets.mjs --working-tree | 修正已删除路径枚举后通过；最终扫描 98 个现存文件，不打印敏感值 |
| git diff --check | 通过；不表示新文件内容/产品语义已自动审查 |
| npm pack --dry-run --json --ignore-scripts --offline | 在发行 spike 的 package 模板中执行；2 个文件：bin/pto-agent-workbench.mjs、package.json；未包含 work 或项目 Skill |
| 两仓 Git 检查 | 外层仅本轮变更，HEAD 不变；harness HEAD 不变且 clean；11 份原文 hash 另与迁移前 Git objects 核对一致 |

npm 检查只是当前模板清单；未生成完整 runtime archive，不能推定未来发行包或其他打包路径自动合规。隔离 launcher 测试复制 start.sh 和 patch 到临时目录并运行假 CLI，只检查根定位、端口、环境与失败路径；未启动用户真实 DSH_HOME 或访问设备。

## 独立只读交接演练

按 skill-creator 的独立前向验证建议，委派一个不继承本轮结论的只读验证者，仅给出 Skill 与四个真实请求：

1. 完善 Data Profile 设计：实际定位 artifact-inspection/data-intake.md，不新建重复主题。
2. 研究输入框旁的附件/范围：实际定位 conversation-composer/design.md，并按需引用数据/Viewer 语义。
3. 尚无行动计划的截图/说明：选择 work/inbox，不强制任务包/主题。
4. 查看 MVP 下一步：读取包状态，识别 planned/awaiting-execution-authorization，未启动 P0。

实际读取的引用均可达。验证发现 description 排除普通只读问题与正文允许“查找研发内容”略有歧义，已窄幅修订为明确包含 development-content lookup、排除 general product questions；随后格式校验通过。未测试新 Codex 会话自动发现、UI 菜单或提示命中率；根 AGENTS 提供显式读取 fallback。

## 发现与处理

原密钥检查器把迁移后尚在 Git index 的旧路径当成 ENOENT 错误。本次只改 working-tree 枚举：去掉 Git --deleted 路径并去重，staged 检查和检测规则未改。新增临时 Git fixture 测试确认：

- 删除旧路径/新增安全目的文件可通过。
- 新目的文件中的合成测试 token 仍会阻止通过，日志不暴露值。
- 非删除文件的读取失败仍阻止通过。

不修改 runtime、harness、官方镜像或原始样例来完成这次验收。

## 未验证

未跑 harness 全量测试/构建、真实浏览器 viewer、官方分析 Skill、设备运行、完整预构建包或跨平台发布。原文历史测试数量仅为历史。外部镜像/链接的全量反向引用、远端 URL 和 Markdown 标题锚点不在结构脚本覆盖范围。
