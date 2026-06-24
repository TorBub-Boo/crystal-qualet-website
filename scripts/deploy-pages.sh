#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

git -C "$ROOT" archive HEAD | tar -x -C "$TMP"
cd "$TMP"
npx wrangler pages deploy . --project-name=crystal-qualet "$@"
