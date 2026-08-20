#!/usr/bin/env bash
# pto-agent-workbench — 从源码 checkout 启动工作台
# 用法: ./start.sh [port]   默认端口 3180
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HARNESS_DIR="$ROOT/harness"
DSH_BIN="$HARNESS_DIR/apps/cli/lib/bin.js"
PORT="${1:-3180}"
# 会话隔离：工作台固定使用独立 DSH_HOME（~/.dsh-pto-workbench），与官方实例 3080 的 ~/.dsh
# 互不共享会话/数据。注意不能用 "${DSH_HOME:-默认}" 的写法——调用方（如官方实例的 agent bash）
# 注入的 DSH_HOME 已被设置，会顶掉默认值；因此无条件覆盖。
export DSH_HOME="$HOME/.dsh-pto-workbench"
# 清理调用方（官方实例 agent 会话）继承的会话注入变量，避免污染工作台进程
unset DSH_SHELL DSH_SESSION_ID DSH_SESSION_JSONL DSH_WEB_URL 2>/dev/null || true

[ -f "$DSH_BIN" ] || { echo "[start] ERROR: 未找到已构建的 DSH，请先运行 ./setup.sh" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[start] ERROR: 未找到 Node.js" >&2; exit 1; }

echo "[start] 启动 pto-agent-workbench: http://127.0.0.1:$PORT"
exec node "$DSH_BIN" web --port "$PORT"
