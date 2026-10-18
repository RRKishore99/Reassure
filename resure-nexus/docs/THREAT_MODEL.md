# ReSure Nexus — Security Threat Model & Privacy Review

## 1. System Overview & Trust Boundaries

ReSure Nexus manages multi-million dollar reinsurance recoverables across legally independent organizations (Cedants, Reinsurers, Brokers, Loss Adjusters).

```
[ Browser Client ]
       │ (Untrusted boundary)
       ▼ (HTTPS + X-Correlation-ID + Server Authenticated Role)
[ Express API Server ] 
       │ 
   ┌───┴──────────────────────┬───────────────────────┐
   ▼                          ▼                       ▼
[ Canton Participant ]    [ SQLite Projections ]  [ Encrypted Store ]
(Authoritative Ledger)    (Read Cache & Idemp.)   (AES-256-GCM Blobs)
```

---

## 2. Threat Analysis & Mitigations

### Threat 1: Cross-Reinsurer Confidential Data Leakage
- **Risk:** Reinsurer A discovers Reinsurer B's participation lines, allocated recovery amounts, pricing margins, or dispute arguments.
- **Mitigation:**
  - Daml `RecoverableAllocation` contracts are bilateral: signatories are solely `cedant` and the individual `reinsurer`.
  - Canton ledger sub-transaction privacy ensures Reinsurer B never receives transaction subtrees for Reinsurer A.
  - The API projection layer strictly filters query results by `req.user.party`.

### Threat 2: Party Identity Spoofing from Browser
- **Risk:** An attacker modifies HTTP headers or cookies to masquerade as another party or role.
- **Mitigation:**
  - Identity-to-party mapping is strictly executed server-side.
  - Canton command submission tokens are signed server-side using the secret HMAC key, binding `actAs` to the verified party. The browser has no authority to mint tokens or specify party IDs.

### Threat 3: Concurrent Duplicate Claim or Allocation Submission
- **Risk:** A Cedant or script submits duplicate claims for the same loss event to collect double recoveries, or duplicate allocation cycles for the same claim segment.
- **Mitigation:**
  - Ledger-level contract keys in `ClaimRegistry` and `AllocationRegistry` enforce uniqueness at the consensus engine level.
  - Concurrency attempts trigger a Canton transaction abort.
  - API provides durable idempotency keys (`idempotency_records`) to prevent duplicate HTTP submissions.

### Threat 4: Reuse of Stale, Terminated, or Unapproved Treaty Versions
- **Risk:** Allocations are calculated against expired or draft treaty versions.
- **Mitigation:**
  - Daml allocation choices require an active `TreatyVersion` contract ID with status `Active`.
  - The calculation engine validates effective periods (`inceptionDate` <= `dateOfLoss` <= `expirationDate`).

### Threat 5: Tampered or Forged Evidence Documents
- **Risk:** An attacker modifies off-ledger damage reports, invoices, or loss adjuster estimates after submission.
- **Mitigation:**
  - SHA-256 digests are computed over raw received bytes before storage.
  - The SHA-256 hash is anchored immutably in the Daml contract `EvidenceRef`.
  - Upon retrieval or verification, the document is decrypted and re-hashed. Any byte modification raises a fatal `IntegrityError` and records a security audit alert.

### Threat 6: Fraudulent Settlement & Premature "Paid" Declaration
- **Risk:** An allocation is marked as paid without verified bank remittance, or is paid twice.
- **Mitigation:**
  - The ledger never marks an item settled without an authorized `ConfirmPayment` transaction.
  - Finance operations must provide a verified payment confirmation source reference (e.g. Fedwire / SWIFT) and attach the remittance receipt.
  - The system rejects overpayments exceeding the outstanding balance.

### Threat 7: Projection Desynchronization & Replay Attacks
- **Risk:** Server crashes cause the projection database to drift from ledger truth.
- **Mitigation:**
  - Canton ledger state is the sole authority.
  - The `ProjectionReconciler` service can rebuild the projection database idempotently from active contracts at any time.

### Threat 8: Sensitive Data Leakage in Logs
- **Risk:** Personally identifiable claimant details, credentials, or keys appear in server logs.
- **Mitigation:**
  - Claimant identities are opaque hashes (`claimantOpaqueId`).
  - Structured logs omit request bodies for file uploads and tokens.
