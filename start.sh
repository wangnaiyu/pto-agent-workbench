#!/usr/bin/env bash
# pto-agent-workbench — 启动工作台（改装 dsh web 实例）
# 用法: ./start.sh [port]   默认端口 3180（与官方实例 3080 互不冲突）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HARNESS_DIR="$ROOT/harness"
SHIM_DIR="${PNPM_SHIM_DIR:-$HOME/.local/bin}"
PORT="${1:-3180}"

[ -d "$HARNESS_DIR/.git" ] || { echo "[start] ERROR: 未找到 harness/，请先运行 ./setup.sh" >&2; exit 1; }

# 确保 pnpm 可用
if ! command -v pnpm >/dev/null 2>&1; then
  export PATH="$SHIM_DIR:$PATH"
fi
command -v pnpm >/dev/null 2>&1 || { echo "[start] ERROR: pnpm 不可用，请先运行 ./setup.sh" >&2; exit 1; }

cd "$HARNESS_DIR"
echo "[start] 启动 pto-agent-workbench: http://127.0.0.1:$PORT"
exec pnpm dsh --profile web --port "$PORT"
