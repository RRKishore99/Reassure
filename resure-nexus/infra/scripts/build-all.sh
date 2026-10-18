#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "  Building ReSure Nexus Monorepo & Daml Package"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "[1/3] Building Daml DAR package..."
daml build

echo "[2/3] Generating TypeScript bindings from DAR..."
daml codegen js .daml/dist/resure-nexus-1.0.0.dar -o daml.js

echo "[3/3] Building TypeScript packages and applications..."
npm run build

echo "=========================================================="
echo "  Build Completed Successfully!"
echo "=========================================================="
