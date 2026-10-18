#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "  Starting ReSure Nexus Full-Stack Development Services"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

trap 'kill $(jobs -p) 2>/dev/null || true' EXIT

echo "Starting Backend API on port 4000..."
npm run dev:api &
API_PID=$!

echo "Starting Web Console on port 5173..."
npm run dev:web &
WEB_PID=$!

echo "Services active: API (PID $API_PID), Web (PID $WEB_PID)"
echo "Visit http://localhost:5173 in your browser."

wait
