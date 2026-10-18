# ReSure Nexus — Contract Lifecycle & Authorization Matrix

This document defines the authoritative stakeholder model, signatories, observers, and choice controllers across all Daml contracts in **ReSure Nexus**.

---

## 1. Network Parties & Roles

| Party ID | Role | Business Function | Typical Organization |
|---|---|---|---|
| `Cedant` | Ceding Insurer | Submits claims, defines treaties, approves assessments, initiates recovery cycles | Primary Insurer (e.g. Acme Assurance) |
| `Reinsurer1` | Participating Reinsurer | Assumes risk lines, accepts/disputes recoverable allocations, makes settlement payments | Lead Reinsurer (e.g. ApexRe) |
| `Reinsurer2` | Participating Reinsurer | Assumes risk lines, accepts/disputes recoverable allocations | Follow Reinsurer (e.g. SummitRe) |
| `Broker` | Intermediary | Administrative placement coordination, market communication | Reinsurance Broker (e.g. Sterling & Co) |
| `Adjuster` | Independent Loss Adjuster | Submits forensic assessment reports, itemized deductions, eligible loss determinations | Independent Adjuster (e.g. Veritas Adjusters) |
| `Operations` | Network Operations & Finance | Proposes allocation cycles, finalizes cycles, verifies payment receipts | Operations & Settlement Team |
| `Audit` | Regulatory & Compliance | Read-only oversight across all lifecycle events, provenance inspection | External Auditor / Supervisory Authority |

---

## 2. Daml Contract Authorization Matrix

| Template | Signatories | Observers | Choice | Controller | Business Effect |
|---|---|---|---|---|---|
| **TreatyVersion** | `cedant` | `broker`, `audit`, `operations` | `ProposeTreaty` | `cedant` | Submits draft terms to market |
| | | | `ApproveTreaty` | `cedant` | Activates treaty once all lines are accepted |
| | | | `TerminateTreaty` | `cedant` | Cancels or terminates treaty terms |
| **TreatyParticipation** | `cedant`, `reinsurer` | `broker`, `audit`, `operations` | `AcceptParticipation` | `reinsurer` | Reinsurer binds itself to contractual line |
| | | | `RejectParticipation` | `reinsurer` | Reinsurer formally declines proposed line |
| **ClaimCase** | `cedant` | `adjuster`, `broker`, `audit`, `operations` | `MarkUnderAssessment` | `cedant`, `adjuster` | Assigns claim for adjuster inspection |
| | | | `MarkAssessed` | `cedant` | Authorizes approved assessment amount |
| | | | `CloseClaim` | `cedant`, `operations` | Marks claim fully settled or closed |
| | | | `ReopenClaim` | `cedant` | Reopens closed claim with justification |
| **LossOccurrence** | `cedant` | `audit`, `operations` | `AddClaimToOccurrence` | `cedant`, `operations` | Associates claim into catastrophe group |
| | | | `FreezeOccurrence` | `cedant`, `operations` | Freezes membership prior to allocation |
| **LossAssessment** | `adjuster` | `cedant`, `audit`, `operations` | `ApproveAssessment` | `cedant` | Cedant ratifies adjuster's eligible loss |
| | | | `DisputeAssessment` | `cedant` | Returns report for revision |
| **AllocationCycle** | `operations` | `cedant`, `audit` | `FinalizeAllocationCycle`| `operations` | Finalizes cycle; spawns bilateral settlements |
| | | | `MarkAllocationDisputed`| `operations` | Freezes finalization while in dispute |
| **RecoverableAllocation**| `cedant`, `reinsurer` | `operations`, `audit` | `AcceptAllocation` | `reinsurer` | Reinsurer accepts bilateral recovery share |
| | | | `DisputeAllocation` | `reinsurer` | Reinsurer disputes; raises DisputeCase |
| **DisputeCase** | `reinsurer` | `cedant`, `operations`, `audit` | `ResolveDispute` | `cedant`, `operations`| Concludes dispute with compromise terms |
| **RecoveryAdjustment** | `approvedBy` (Cedant/Ops)| `audit`, `operations` | — | — | Deducts salvage/subrogation from cycle |
| **RecoverableSettlement**| `cedant`, `reinsurer` | `operations`, `audit` | `ConfirmPayment` | `operations` | Records payment against verified receipt |
| **SettlementReconciliation**| `confirmedBy` (Ops)| `cedant`, `reinsurer`, `audit` | — | — | Immutable payment audit trail record |
| **ClaimRegistry** | `registrar` (Ops) | `cedant`, `audit` | `DeactivateClaim` | `registrar` | Ledger key maintains unique claim reference |
| **AllocationRegistry** | `registrar` (Ops) | `cedant`, `reinsurer`, `audit`| — | — | Key prevents duplicate (Claim, Treaty, Reinsurer) |

---

## 3. Privacy Boundary & Canton Stakeholder Guarantees

1. **Bilateral Isolation Between Reinsurers:**
   - Under Canton's sub-transaction privacy, `RecoverableAllocation` contracts have only the `cedant` and the specific `reinsurer` as stakeholders.
   - `Reinsurer1` cannot query, view, or decrypt allocations, line percentages, or disputes belonging to `Reinsurer2`.
2. **Server-Side Party Authentication:**
   - Client requests specify a authenticated role context. The backend validates and maps the identity to a server-controlled Canton party ID. The browser cannot spoof stakeholder authorization.
3. **Off-Ledger Evidence Privacy:**
   - Raw claims files, adjuster notes, medical/salvage records, and bank receipts are kept in AES-256-GCM encrypted off-ledger storage. Only the cryptographic SHA-256 digest is anchored on the ledger.
