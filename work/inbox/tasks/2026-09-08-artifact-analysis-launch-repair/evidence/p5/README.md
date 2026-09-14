# P5 验证证据（尚未完成）

- [实际装配和 launcher](composition.txt)：8/8。
- [客户端 launch/引用/附件](client.txt)：76/76。
- [Host/PTO/实验基础能力](host-scope.txt)：37 passed / 1 既有工具清单失败，未降低规则。
- [既有证据复用与源码 hash](evidence-reuse.json)：P3 实现所有记录 hash 一致；P4 完整门禁和布局验证后的 harness HEAD 未变化。
- [启动脚本](launch.py)、[目录 picker 覆盖](common.patch.yml)：正式产品 patch 无临时 provider/observer；模型替身复用 P0 mock。临时路径仅是本次审计定位，恢复需建立新根或显式复用旧根，不覆盖历史 home。

本轮真实浏览器打开 loopback 工作台连续两次因自动审核超时被工具拒绝，均未获得可用页面；没有替代浏览器、原始 CDP 或间接方式绕过。P5 没有完成新的 Session/receipt/tool 闭环，不能把此前分阶段证据标为本轮新验证。当前状态和后续动作见 [status](../../status.md)。
