# patches/ — profile 装配层

工作台 profile 的组合记录：

- `cordis.patch.yml`：工作台 profile 的用户 patch 层（启用插件、覆盖配置）。
- profile manifest / `dsh plugin --profile <name>` 使用记录。
- 装配原则：能 patch 不 fork；能插件不内核（R1）。

当前装配：`start.sh` 通过 `--patch patches/cordis.patch.yml` 加载工作台覆盖层；
Host cwd 的会话保留真实 cwd，物理会话桶使用 `sessions/default/`。

该覆盖层同时启用独立的 `pto-bundled` 文件系统 Skill provider，只扫描
`skills/bundled/`，并通过 `composer-catalog.providerOrigins` 把其
`bundled` source 显式标记为产品来源 `PTO`。用户、项目、DSH bundled 和第三方
provider 不继承这个标签。
