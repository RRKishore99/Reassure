# ReSure Nexus — Canton DevNet Deployment & Verification Runbook

## 1. Prerequisites & Environment Check

Before initiating deployment to Canton DevNet or a Canton participant node:

```bash
# 1. Verify installed Daml SDK and Java
daml version
java -version
node --version
```

| Component | Target Version | Status |
|---|---|---|
| Daml SDK | 2.10.4 | Installed (`/Users/rajurajkishore/.daml/bin/daml`) |
| Java OpenJDK | 25.0.3 LTS | Installed |
| Node.js | v24.11.1 | Installed |
| Target LF | 1.15 | Configured in `daml.yaml` |

---

## 2. Compiling the Daml DAR Package

```bash
cd resure-nexus
daml build
```
- Output: `.daml/dist/resure-nexus-1.0.0.dar`
- Generated TypeScript Bindings: `daml codegen js .daml/dist/resure-nexus-1.0.0.dar -o daml.js`

---

## 3. Running Daml Script Correctness Suite

Verify all 22 contractual lifecycle, boundary, authorization, and invariant tests:

```bash
cd resure-nexus
daml test
```
- Expectation: 22/22 tests OK, 0 failures.

---

## 4. Local Canton Participant / Sandbox Launch

To run the local Canton participant sandbox and HTTP JSON API daemon:

```bash
# Terminal 1: Launch Canton Sandbox
daml sandbox --port 6865 --dar .daml/dist/resure-nexus-1.0.0.dar

# Terminal 2: Launch HTTP JSON API daemon
daml json-api --ledger-host 127.0.0.1 --ledger-port 6865 --http-port 7575 --allow-insecure-tokens
```

---

## 5. DevNet Deployment Procedure

When connecting to an authorized Canton DevNet participant endpoint:

### Step 1: Upload DAR Package to DevNet Participant
```bash
daml ledger upload-dar \
  --host devnet-participant.canton.network \
  --port 443 \
  --pem participant.key \
  --crt participant.crt \
  .daml/dist/resure-nexus-1.0.0.dar
```

### Step 2: Allocate Network Parties
```bash
# Allocate Cedant
daml ledger allocate-parties --host <host> --port <port> Cedant
# Allocate Reinsurers
daml ledger allocate-parties --host <host> --port <port> Reinsurer1 Reinsurer2
# Allocate Broker, Adjuster, Operations, Audit
daml ledger allocate-parties --host <host> --port <port> Broker Adjuster Operations Audit
```

### Step 3: Configure Environment Variables
In `.env` or deployment environment:
```env
CANTON_JSON_API_URL=https://devnet-participant.canton.network:7575
CANTON_LEDGER_ID=devnet-reassurance-network
CANTON_APPLICATION_ID=resure-nexus
CANTON_JWT_SECRET=production-secure-canton-secret
PORT=4000
```

### Step 4: Start Backend and Frontend
```bash
npm run build
npm run dev:api &
npm run dev:web &
```

---

## 6. DevNet Verification Checklist

- [x] Daml Package compiles without errors (`resure-nexus-1.0.0.dar`).
- [x] All 22 Daml contract tests pass (`daml test`).
- [x] Backend API passes all 5 integration test suites.
- [x] Mathematical calculation engine verified against invariant test vectors.
- [x] Document store verifies SHA-256 digests and detects tampering.
- [x] Frontend operations console builds cleanly and serves all 10 operations screens.
- [ ] Genuine Canton DevNet public participant endpoint connection:
  - *Current Status:* Local sandbox and participant tooling verified; genuine public DevNet connection requires participant credentials and TLS certificates from Canton Foundation network operator.
