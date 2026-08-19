#!/usr/bin/env bash
# pto-agent-workbench — 一次性环境搭建脚本（在新机器上运行）
# 流程：环境检查 → 确保 pnpm（corepack shim 到用户目录）→ clone fork 到 harness/ → install → build
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HARNESS_DIR="$ROOT/harness"
FORK_REPO="git@github.com:wangnaiyu/deepseek-harness.git"
UPSTREAM_REPO="git@github.com:deepseek-ai/deepseek-harness.git"
SHIM_DIR="${PNPM_SHIM_DIR:-$HOME/.local/bin}"
MIN_NODE=22.19

say()  { printf '\033[1;36m[setup]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[setup] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

say "工作区: $ROOT"

# ── 1. 工具检查 ─────────────────────────────────────────────────────────
command -v git  >/dev/null 2>&1 || fail "未找到 git，请先安装"
command -v node >/dev/null 2>&1 || fail "未找到 node，请安装 Node.js $MIN_NODE+（官方要求 22.19+ / 24+）"

NODE_VER="$(node -p 'process.versions.node')"
say "node: $NODE_VER"
node -e "const [maj,min]=process.versions.node.split('.').map(Number); if (maj<22 || (maj===22 && min<19)) process.exit(1)" \
  || fail "Node 版本过低：需要 >= $MIN_NODE（当前 $NODE_VER）"

# ── 2. 确保 pnpm 可用（corepack shim 装到用户目录，避免 /usr/local/bin 权限问题） ──
ensure_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    say "pnpm: $(pnpm --version)"
    return 0
  fi
  command -v corepack >/dev/null 2>&1 || fail "未找到 corepack（Node 18.17+ 自带；缺失时执行: npm install -g corepack）"
  mkdir -p "$SHIM_DIR"
  say "安装 pnpm shim 到 $SHIM_DIR"
  if corepack enable --install-directory "$SHIM_DIR" >/dev/null 2>&1; then
    export PATH="$SHIM_DIR:$PATH"
    say "pnpm: $(pnpm --version)"
  else
    fail "corepack enable 失败（$SHIM_DIR 不可写？），可手动执行: corepack enable --install-directory $SHIM_DIR"
  fi
}
ensure_pnpm

# ── 3. clone fork 到 harness/（已存在则跳过；如需更新先手动处理） ──────────
if [ ! -d "$HARNESS_DIR/.git" ]; then
  say "clone fork → $HARNESS_DIR"
  git clone "$FORK_REPO" "$HARNESS_DIR"
  git -C "$HARNESS_DIR" remote add upstream "$UPSTREAM_REPO" 2>/dev/null || true
  say "已添加 upstream: $UPSTREAM_REPO"
else
  say "harness/ 已存在，跳过 clone（如需更新: cd harness && git pull origin master）"
fi

# ── 4. 安装依赖 ──────────────────────────────────────────────────────────
cd "$HARNESS_DIR"
say "pnpm install（首次较慢）..."
pnpm install || pnpm install --no-frozen-lockfile

# ── 5. 构建 ──────────────────────────────────────────────────────────────
say "pnpm run build（全量构建，首次较慢）..."
pnpm run build

say ""
say "✅ 环境搭建完成。启动工作台:"
say "   ./start.sh            # 默认端口 3180"
say "   ./start.sh 4180       # 指定端口"
say "   或手工: cd harness && pnpm dsh --profile web --port 3180"
