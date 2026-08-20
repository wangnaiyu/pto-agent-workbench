#!/usr/bin/env bash
# pto-agent-workbench — 源码开发环境搭建（普通用户将改用 npm 预构建发行包）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HARNESS_DIR="$ROOT/harness"
FORK_REPO="${PTO_FORK_REPO:-https://github.com/wangnaiyu/deepseek-harness.git}"
UPSTREAM_REPO="${PTO_UPSTREAM_REPO:-https://github.com/deepseek-ai/deepseek-harness.git}"
PINNED_PNPM="11.7.0"
NPM_REGISTRY="${PTO_NPM_REGISTRY:-}"

say()  { printf '\033[1;36m[setup]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[setup] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

say "工作区: $ROOT"

# 源码开发才需要 git；正式 npm 发行包的用户不需要。
command -v git >/dev/null 2>&1 || fail "未找到 git；源码开发需要 git"
command -v node >/dev/null 2>&1 || fail "未找到 Node.js；需要 22.19+ 或 24+"
command -v npm >/dev/null 2>&1 || fail "未找到 npm；请使用官方 Node.js 发行版"

if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$ROOT" config --local core.hooksPath .githooks
  say "pre-commit secret 检查：已启用"
fi

NODE_VER="$(node -p 'process.versions.node')"
say "node: $NODE_VER"
node -e "const [major, minor] = process.versions.node.split('.').map(Number); process.exit((major === 22 && minor >= 19) || major >= 24 ? 0 : 1)" \
  || fail "Node.js $NODE_VER 不受支持；需要 22.19+ 或 24+（Node 23 也不在支持范围）"

# 不依赖 Corepack 或全局 pnpm。Node 25 已不再随附 Corepack，因此通过 npm
# 按 repo pin 临时执行 pnpm。已安装且版本一致时直接复用。
PNPM_CMD=()
if command -v pnpm >/dev/null 2>&1 && [ "$(pnpm --version)" = "$PINNED_PNPM" ]; then
  PNPM_CMD=(pnpm)
  say "pnpm: $PINNED_PNPM（已安装）"
else
  NPM_EXEC_ARGS=(exec --yes)
  if [ -n "$NPM_REGISTRY" ]; then
    NPM_EXEC_ARGS+=("--registry=$NPM_REGISTRY")
    say "npm registry: $NPM_REGISTRY"
  fi
  PNPM_CMD=(npm "${NPM_EXEC_ARGS[@]}" "--package=pnpm@$PINNED_PNPM" -- pnpm)
  say "pnpm: $PINNED_PNPM（由 npm 临时提供）"
fi

clone_harness() {
  local attempt
  for attempt in 1 2 3; do
    say "clone fork（HTTPS，第 $attempt/3 次）→ $HARNESS_DIR"
    if [ "$attempt" -eq 1 ]; then
      git clone --filter=blob:none --single-branch "$FORK_REPO" "$HARNESS_DIR" && return 0
    else
      # 部分代理或老网关对 HTTP/2 长连接不稳定，重试时改用 HTTP/1.1。
      git -c http.version=HTTP/1.1 clone --filter=blob:none --single-branch "$FORK_REPO" "$HARNESS_DIR" && return 0
    fi
    if [ -e "$HARNESS_DIR" ]; then
      fail "clone 失败后留下了 $HARNESS_DIR；请检查或移走该目录后重试"
    fi
  done
  fail "GitHub HTTPS clone 连续失败；请检查代理、CA 证书或使用 PTO_FORK_REPO 指定可访问镜像"
}

if [ ! -d "$HARNESS_DIR/.git" ]; then
  [ ! -e "$HARNESS_DIR" ] || fail "$HARNESS_DIR 已存在但不是 git checkout"
  clone_harness
  git -C "$HARNESS_DIR" remote add upstream "$UPSTREAM_REPO" 2>/dev/null || true
  say "已添加 upstream: $UPSTREAM_REPO"
else
  say "harness/ 已存在，跳过 clone"
fi

cd "$HARNESS_DIR"
say "pnpm install --frozen-lockfile（首次较慢）..."
if ! "${PNPM_CMD[@]}" install --frozen-lockfile; then
  fail "依赖安装失败。如为 TLS/SSL 问题，请配置正确的代理或 CA，或通过 PTO_NPM_REGISTRY 指定可信镜像；不要关闭 strict-ssl"
fi

say "pnpm run build（全量构建，首次较慢）..."
"${PNPM_CMD[@]}" run build

say ""
say "✅ 源码环境搭建完成。运行 ./start.sh 启动（默认端口 3180）"
