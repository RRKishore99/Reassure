#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "  Running ReSure Nexus Test Suites"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

echo "[1/2] Running 22 Daml Script Contract Correctness Tests..."
daml test

echo "[2/2] Running TypeScript Domain, Security & API Tests..."
npm test

echo "=========================================================="
echo "  All ReSure Nexus Tests Passed Successfully!"
echo "=========================================================="
