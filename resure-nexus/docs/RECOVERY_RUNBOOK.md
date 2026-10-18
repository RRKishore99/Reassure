# ReSure Nexus — Recovery & Re-Onboarding Runbook

## 1. Overview

Canton DevNet is a staging network subject to periodic network resets. Furthermore, backend instances may experience unexpected crashes, pod restarts, or database volume failures.

This runbook outlines the exact operational procedures for:
1. Reconciling database projections after an application restart.
2. Handling a Canton DevNet network reset.
3. Resolving command timeouts where ledger outcome is initially unknown.

---

## 2. Replay-Safe Projection Reconciliation

The SQLite database (`resure-projections.db`) serves as a query cache and operational index. It is **non-authoritative**. The Canton ledger is the sole source of truth.

### Automatic Reconciliation on Startup
When the API server starts, or when invoked by an authorized operator:
```bash
curl -X POST http://localhost:4000/api/reconcile \
  -H "X-ReSure-Role: Operations"
```

### How the Reconciler Works
1. Queries the Canton Ledger API for all active contracts matching templates:
   - `TreatyVersion`, `TreatyParticipation`
   - `ClaimCase`, `LossOccurrence`, `LossAssessment`
   - `AllocationCycle`, `RecoverableAllocation`
   - `DisputeCase`, `RecoveryAdjustment`, `RecoverableSettlement`
2. Idempotently upserts each contract into SQLite using `INSERT OR REPLACE`.
3. Re-establishes all active contract IDs and multi-party stakeholder records.
4. Safe to execute repeatedly without duplicating business data.

---

## 3. Handling a Canton DevNet Reset

When the Canton DevNet network resets:
1. Previous contract IDs, party allocations, and transaction offsets are permanently cleared.
2. **Do not attempt to restore stale contract IDs into the new network.**
3. Re-execute the deployment sequence:
   ```bash
   # 1. Clean local projections database
   rm -f .data/resure-projections.db*

   # 2. Re-upload DAR package to the new participant
   daml ledger upload-dar --host <new-host> --port <new-port> .daml/dist/resure-nexus-1.0.0.dar

   # 3. Re-allocate network parties
   daml ledger allocate-parties --host <new-host> --port <new-port> Cedant Reinsurer1 Reinsurer2 Broker Adjuster Operations Audit

   # 4. Restart API service
   npm run dev:api
   ```
4. The application initializes with a truthful empty state ready for genuine contract entry.

---

## 4. Handling Unknown Command Submission Outcomes

If an HTTP submission to the Canton Ledger API times out or terminates with a network error before receiving a confirmation response:
1. The backend assigns a unique `commandId` (e.g. `CMD-TREATY-CREATE-TRT-01`) before submission.
2. If retried, the ledger's deduplication mechanism detects the identical `commandId` and prevents duplicate contract execution.
3. The operator can invoke `POST /api/reconcile` to inspect whether the contract was created on the ledger.
