# ReSure Nexus — Architecture Document

## 1. System Overview

ReSure Nexus is an advanced enterprise application for reinsurance recoverables, multi-party loss allocation, disputes, recovery adjustments, and settlement reconciliation. It coordinates workflows between:

- **Cedant** — The ceding insurer
- **Reinsurers** (multiple, independent) — Assume allocated risk portions
- **Reinsurance Broker** — Administrative coordination role
- **Loss Adjuster** — Independent assessment authority
- **Claims & Finance Operations** — Operational processing team
- **Audit/Compliance** — Read-only authorized oversight

## 2. Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ReSure Nexus Monorepo                       │
├─────────────┬───────────────┬───────────────┬──────────────────┤
│   daml/     │  apps/web/    │  apps/api/    │  packages/       │
│  (Contracts)│  (React UI)   │  (Node.js API)│  (Shared Libs)   │
└──────┬──────┴───────┬───────┴───────┬───────┴────────┬─────────┘
       │              │               │                │
       v              v               v                v
┌──────────┐  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐
│  Canton  │  │   Browser    │ │  PostgreSQL  │ │  Document   │
│  DevNet  │  │   (User)     │ │  (Projections│ │  Store      │
│  Ledger  │  │              │ │   & Meta)    │ │  (Encrypted)│
└──────────┘  └──────────────┘ └──────────────┘ └─────────────┘
```

## 3. Authority Boundaries

- **Canton Ledger** = Authoritative source for contractual state & transitions
- **PostgreSQL** = Query projections, operational metadata, user-to-party mappings, idempotency records
- **Document Store** = Secure off-ledger evidence storage with hash verification
- PostgreSQL MUST NOT independently declare claim acceptance, allocation completion, or settlement when ledger says otherwise

## 4. Data Flow

1. User → Authenticated API → Validate → Canton Ledger Command
2. Canton Ledger → Update Stream → Projection Worker → PostgreSQL
3. User → API → PostgreSQL (read projections) → Response
4. Document Upload → API → Hash Computation → Document Store + Ledger Evidence Reference

## 5. Privacy Model

| Contract Type | Cedant | Broker | Reinsurer | Adjuster | Ops | Audit |
|---|---|---|---|---|---|---|
| TreatyVersion | Signatory | Observer | - | - | Observer | Observer |
| TreatyParticipation | Signatory | Observer | Signatory | - | Observer | Observer |
| ClaimCase | Signatory | Observer | - | Observer | Observer | Observer |
| LossAssessment | Observer | Observer | - | Signatory | Observer | Observer |
| AllocationCycle | Observer | Observer | - | - | Signatory | Observer |
| RecoverableAllocation | Signatory | Observer | Signatory | - | Observer | Observer |
| ReinsurerDecision | Observer | Observer | Signatory | - | Observer | Observer |
| RecoverableSettlement | Signatory | Observer | Signatory | - | Observer | Observer |

## 6. Calculation Methodology

### Quota-Share
```
Ceded Amount = Eligible Loss × Contractual Ceded %
Capped Ceded Amount = min(Ceded Amount, Contractual Cap)
Reinsurer Allocation = Capped Ceded Amount × Reinsurer Participation %
```

### Per-Occurrence Excess of Loss (XoL)
```
Eligible Occurrence Loss = Σ(eligible losses for approved claims in frozen occurrence)
Loss Within Layer = max(0, Eligible Occurrence Loss − Attachment Point)
Gross Layer Recovery = min(Loss Within Layer, Per-Occurrence Layer Limit)
Reinsurer Allocation = Gross Layer Recovery × Reinsurer Line %
```

## 7. Verified Environment

| Component | Version | Status |
|---|---|---|
| Node.js | v24.11.1 | ✅ Installed |
| npm | 11.6.2 | ✅ Installed |
| Java (OpenJDK) | 25.0.3 LTS | ✅ Installed |
| Daml SDK | 2.10.4 | ✅ Installed |
| DPM | Not installed | ⚠️ Will use `daml` assistant |
| Python | 3.14.3 | ✅ Installed |
| Docker | Not installed | ⚠️ Not available |
| PostgreSQL | Not installed | ⚠️ Will use SQLite for dev |

## 8. Security Threat Model Summary

See [THREAT_MODEL.md](./THREAT_MODEL.md) for full details.

Key concerns:
- Party identity spoofing → Server-side party mapping, never trust browser
- Cross-reinsurer data leakage → Separate contracts per stakeholder pair
- Duplicate submission → Ledger-enforced registry + command deduplication
- Stale treaty versions → Version validation at choice exercise time
- Document tampering → SHA-256 hash verification
- Settlement fraud → Confirmed-only settlement workflow
