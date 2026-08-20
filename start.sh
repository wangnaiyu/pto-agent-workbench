#!/usr/bin/env bash
# pto-agent-workbench — 启动工作台（改装 dsh web 实例）
# 用法: ./start.sh [port]   默认端口 3180（与官方实例 3080 互不冲突）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HARNESS_DIR="$ROOT/harness"
SHIM_DIR="${PNPM_SHIM_DIR:-$HOME/.local/bin}"
PORT="${1:-3180}"
# 会话隔离：工作台固定使用独立 DSH_HOME（~/.dsh-pto-workbench），与官方实例 3080 的 ~/.dsh
# 互不共享会话/数据。注意不能用 "${DSH_HOME:-默认}" 的写法——调用方（如官方实例的 agent bash）
# 注入的 DSH_HOME 已被设置，会顶掉默认值；因此无条件覆盖。
export DSH_HOME="$HOME/.dsh-pto-workbench"
# 清理调用方（官方实例 agent 会话）继承的会话注入变量，避免污染工作台进程
unset DSH_SHELL DSH_SESSION_ID DSH_SESSION_JSONL DSH_WEB_URL 2>/dev/null || true

[ -d "$HARNESS_DIR/.git" ] || { echo "[start] ERROR: 未找到 harness/，请先运行 ./setup.sh" >&2; exit 1; }

# 确保 pnpm 可用
if ! command -v pnpm >/dev/null 2>&1; then
  export PATH="$SHIM_DIR:$PATH"
fi
command -v pnpm >/dev/null 2>&1 || { echo "[start] ERROR: pnpm 不可用，请先运行 ./setup.sh" >&2; exit 1; }

cd "$HARNESS_DIR"
echo "[start] 启动 pto-agent-workbench: http://127.0.0.1:$PORT"
exec pnpm dsh --profile web --port "$PORT"
