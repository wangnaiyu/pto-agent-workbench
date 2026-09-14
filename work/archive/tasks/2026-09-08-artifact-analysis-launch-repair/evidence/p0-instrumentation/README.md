# P0 instrumentation / test-only evidence

这些文件是本轮实际临时脚本的副本，不属于产品配置或发布内容。原始运行根见 ../p0-baseline.json；保存为复现依据，不建议原样复用旧 home/认证状态。

- observer.mjs：包装真实 Host inspection/qualified lookup/Skill snapshot 方法，保留 this/参数/结果/异常；plugin disposal 还原方法。没有伪造 receipt。
- common.patch.yml：A/B 相同的 browse picker + observer。
- provider.patch.yml：只有 B/C 临时 insert 锁定 official provider。
- launch.py：独立 home，实际 built CLI 从外层根 cwd 启动；清除父 Session 环境变量，使用 localhost 模型替身；不运行会写真实用户 home 的 start.sh。
- mock.mjs：外部模型替身；工具参数从真实 analysis context 提取；Host 执行真实工具；failNext 控制仅产生一次 HTTP400。
- layout-observer.mjs / layout.patch.yml / launch-layout.py：单独 layout 实验，通过真实 plan 服务写 3 条未执行提案。不是核心 A/B 差异。
- decode-sessions.mts：逐个完整 Zstd frame 解码所有 Workspace buckets，不覆盖原 Session 文件。
- proof-controller.mts：导入真实 controller，检查目标不匹配/生命周期行为；明确不能证明 live preset 的确切时序。

复现时分配新的 mkdtemp 根与 listen(0) 端口；把副本中的旧根替换为新根、核对当前 built hash，使用独立 home。只在显式授权的 P0/测试范围运行，完成后核实 PID 并等待退出。不得将 provider/observer 临时 patch 装入正式配置来声称产品已修复。
