# ReSure Nexus — Advanced Reinsurance Recoverables & Multi-Party Loss Allocation Network

[![Daml SDK](https://img.shields.io/badge/Daml%20SDK-2.10.4-blue.svg)](https://docs.canton.network/)
[![Canton Network](https://img.shields.io/badge/Network-Canton%20DevNet-darkblue.svg)](https://docs.canton.network/)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B%20%7C%20v24-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-45%2F45%20Passed%20(100%25)-success.svg)](#testing-strategy)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey.svg)](LICENSE)

**ReSure Nexus** is an enterprise-grade distributed reinsurance recoverables network built on **Canton** and **Daml**. It coordinates the multi-party contractual lifecycle between ceding insurers (Cedants), multiple competing reinsurers, reinsurance brokers, independent loss adjusters, operations teams, and regulatory auditors.

By harnessing Canton’s native **sub-transaction privacy** and Daml’s authoritative state machine, ReSure Nexus solves the fundamental multi-party reinsurance coordination problem: **establishing a synchronized, auditable shared workflow without leaking confidential commercial terms, line percentages, or private claims data between competing market participants.**

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ReSure Nexus Monorepo                              │
├──────────────┬────────────────┬────────────────┬────────────────────────────┤
│   daml/      │   apps/web/    │   apps/api/    │   packages/                │
│  (Contracts) │  (React Console│ (Node.js API)  │  (Shared Architecture)     │
└──────┬───────┴────────┬───────┴────────┬───────┴────────────┬───────────────┘
       │                │                │                    │
       │                ▼                ▼                    ▼
       │         ┌─────────────┐  ┌─────────────┐     ┌────────────────┐
       │         │  10 Screen  │  │ Express REST│     │ @domain        │
       │         │  Financial  │  │ & Auth Mappings   │ @document-store│
       │         │  Dashboard  │  │ (Role-to-Party)   │ @ledger-client │
       │         └─────────────┘  └──────┬──────┘     │ @projections   │
       │                                 │            └────────────────┘
       ▼                                 ▼                     │
┌──────────────┐                 ┌──────────────┐              ▼
│ Canton DevNet│ ◄───────────────┤  SQLite/PG   │       ┌──────────────┐
│ Ledger Node  │  Command Stream │  Projections │       │ AES-256-GCM  │
│(Authoritative│                 │ (Replay-Safe)│       │ Encrypted CAS│
└──────────────┘                 └──────────────┘       └──────────────┘
```

---

## 🌟 Key Capabilities

### 1. Authoritative Daml Contract Layer
- **Treaty Versions & Market Participations**: Immutable, versioned treaty agreements supporting Quota-Share and Excess-of-Loss terms. Reinsurers bind their lines through cryptographic bilateral agreements.
- **Catastrophe Loss Occurrences**: Governance of multi-claim aggregation with explicit occurrence membership freeze protection to prevent claims-splitting around attachment points.
- **Independent Loss Adjustment**: Certified loss adjusters record forensic damage assessments, itemized deductibles, and eligible subject losses for Cedant approval.
- **Sub-Transaction Bilateral Privacy**: Reinsurer allocations are issued as discrete bilateral contracts. Competitor reinsurers cannot see each other's allocated shares or terms.
- **Dispute Lifecycle**: Formal dispute cases immediately freeze recoverable finalization until settled through authorized compromise terms.
- **Duplicate Prevention Registry**: Ledger-level contract keys (`ClaimRegistry`, `AllocationRegistry`) reject duplicate claims and duplicate allocations at the consensus layer.

### 2. Pure Fixed-Point Calculation Engine
- **Zero Binary Float Arithmetic**: Implemented in TypeScript using `bignumber.js` to eliminate IEEE-754 binary floating-point errors.
- **Quota-Share Engine**: Calculates ceded shares, evaluates contractual caps, distributes reinsurer lines, and retains unplaced line proportions with the Cedant.
- **Per-Occurrence Excess-of-Loss (XoL) Engine**: Aggregates frozen occurrence claims, evaluates attachment points, and enforces layer limits with exact rounding residual tracking.
- **Loss Adjustments**: Sequence of salvage proceeds, subrogation recoveries, and third-party indemnities floored at zero.

### 3. Secure Off-Ledger Evidence Store
- **AES-256-GCM Encryption**: Document contents are encrypted on disk with unique IVs and authenticated tags.
- **SHA-256 Cryptographic Anchoring**: Raw bytes are digested before storage and anchored immutably in ledger contracts.
- **On-the-Fly Tamper Detection**: Documents are decrypted and re-hashed upon retrieval; any unauthorized modification raises an immediate security alarm.

### 4. Enterprise Operations Console (10 Screens)
1. **Dashboard**: Honest metrics (zero/empty states when unpopulated) and real-time ledger-confirmed event stream.
2. **Treaty Administration**: Terms inspector, QuotaShare/XoL parameters, market participation status, and creation modal.
3. **Claims Intake**: Multi-party claims registration, occurrence assignment, and source document upload with live SHA-256 calculation.
4. **Loss Assessment Workspace**: Independent adjuster reporting, itemized deductions, and Cedant approval.
5. **Allocation Workbench**: Interactive calculation simulator displaying formulas, intermediate values, caps, attachment points, and proposal dispatch.
6. **Reinsurer Workspace**: Strict bilateral privacy view for participating reinsurers to accept, dispute, or request information.
7. **Dispute & Adjustment Management**: Contested claims resolution and post-settlement salvage/subrogation recovery adjustments.
8. **Settlement & Reconciliation**: Recoverable settlement tracking requiring verified payment receipts (no fake bank APIs).
9. **Evidence & Audit Console**: Transaction provenance, update IDs, and instant SHA-256 tamper-evident verification.
10. **System Connectivity**: Live diagnostics for Canton Participant, Ledger API, SQLite cache, and on-demand projection reconciliation.

---

## 👥 Multi-Party Privacy & Stakeholder Model

| Network Party | Role | Daml Contract Signatory Rights | Visibility Boundary |
|---|---|---|---|
| `Cedant` | Primary Insurer | Author of Treaties, Claims, Cycle Proposals | Sees all own claims, treaties, and allocations |
| `Reinsurer1` (ApexRe) | Participating Reinsurer | Accepts/Disputes Bilateral Allocation & Settlement | **Isolated**: Sees only its own participation lines & allocations |
| `Reinsurer2` (SummitRe) | Participating Reinsurer | Accepts/Disputes Bilateral Allocation & Settlement | **Isolated**: Sees only its own participation lines & allocations |
| `Broker` | Intermediary | Administrative placement coordination | Observer on treaties and non-confidential claims |
| `Adjuster` (Veritas) | Independent Adjuster | Signs & submits Loss Assessments | Claims under inspection, assessment reports |
| `Operations` | Operations & Finance | Proposes cycles, verifies payment receipts | Full operational oversight |
| `Audit` | Regulatory Oversight | Read-only compliance auditor | Read-only access across all confirmed ledger events |

---

## 📂 Repository Structure

```text
resure-nexus/
├── daml/                           # Authoritative Daml smart contracts
│   ├── src/
│   │   ├── ReSure/
│   │   │   ├── Treaty/             # TreatyVersion & TreatyParticipation
│   │   │   ├── Claim/              # ClaimCase, LossOccurrence, ClaimEvidence
│   │   │   ├── Assessment/         # LossAssessment
│   │   │   ├── Allocation/         # AllocationCycle, RecoverableAllocation, Disputes
│   │   │   ├── Settlement/         # RecoverableSettlement & SettlementReconciliation
│   │   │   └── Registry/           # Unique Claim & Allocation Registries
│   │   └── Test/
│   │       └── ReSureTests.daml    # 22 Daml Script comprehensive tests
│   └── daml.yaml                   # SDK 2.10.4 & LF 1.15 configuration
├── packages/
│   ├── domain/                     # Pure BigNumber calculation engine & schemas
│   ├── ledger-client/              # Typed Canton Ledger API adapter & JWT token minting
│   ├── document-store/             # AES-256-GCM encrypted off-ledger store & SHA-256
│   └── projections/                # WAL SQLite schema & idempotent Reconciler service
├── apps/
│   ├── api/                        # Express TypeScript backend with role-to-party mapping
│   └── web/                        # React 18 + TypeScript + Vite enterprise console
├── infra/
│   └── scripts/                    # Automation scripts (build-all, test-all, run-dev)
└── docs/                           # Architecture, threat model, runbooks & audit reports
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Daml SDK**: `2.10.4` ([Installation Guide](https://docs.daml.com/getting-started/installation.html))
- **Java**: OpenJDK `17` or `21+` (OpenJDK 25 LTS supported)
- **Node.js**: `v20.0.0+` (v24 LTS tested)
- **npm**: `v10+`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/Reassure.git
cd Reassure/resure-nexus
npm install
```

### 2. Compile Daml Package & Generate TypeScript Bindings
```bash
./infra/scripts/build-all.sh
```
This builds:
- `.daml/dist/resure-nexus-1.0.0.dar`
- Official typed TypeScript bindings in `daml.js/`
- All 6 monorepo workspaces (`@resure-nexus/domain`, `@resure-nexus/ledger-client`, etc.)

### 3. Run Automated Test Suites
Execute the complete verification pipeline:
```bash
./infra/scripts/test-all.sh
```
Expected output:
```text
==========================================================
  Running ReSure Nexus Test Suites
==========================================================
[1/2] Running 22 Daml Script Contract Correctness Tests...
Test Summary: 22 ok, 0 failures.

[2/2] Running TypeScript Domain, Security & API Tests...
✔ Domain Calculations — 14 Invariant Tests (100% Pass)
✔ Secure Document Store — 4 Encryption & Tamper Tests (100% Pass)
✔ API Full-Stack Suite — 5 Multi-Party Lifecycle Tests (100% Pass)
✔ Web Console — TypeScript Typecheck (0 Errors)
==========================================================
  All ReSure Nexus Tests Passed Successfully!
==========================================================
```

### 4. Start Full-Stack Development Console
```bash
./infra/scripts/run-dev.sh
```
- **Backend API**: `http://localhost:4000` (Health: `http://localhost:4000/api/health`)
- **Web Console**: `http://localhost:5173`

---

## 🔬 Testing Strategy Matrix

| Test Layer | Framework | Coverage | Verification File |
|---|---|---|---|
| **Layer A: Daml Contracts** | Daml Script | State transitions, authorization boundaries, contract keys, duplicate prevention, occurrence freeze, dispute blocks | [`ReSureTests.daml`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/daml/src/Test/ReSureTests.daml) |
| **Layer B: Calculation Engine** | Node Test Runner | Quota-Share caps, XoL attachment/limit boundaries, occurrence aggregation, zero floor on salvage | [`calculations.test.ts`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/packages/domain/src/calculations.test.ts) |
| **Layer B: Document Store** | Node Crypto | AES-256-GCM encryption, SHA-256 verification, tamper detection, access control | [`store.test.ts`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/packages/document-store/src/store.test.ts) |
| **Layer B: End-to-End API** | Express Integration | Authenticated personas, duplicate claim HTTP 409, multi-party decision workflow, settlement reconciliation | [`server.test.ts`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/apps/api/src/server.test.ts) |
| **Layer C: Frontend Console** | TypeScript & Vite | 10 screens type checking, form validation, live proxying | [`apps/web/src/App.tsx`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/apps/web/src/App.tsx) |
| **Layer D: DevNet Integration** | Canton CLI / Runbook | Participant node connectivity, DAR packaging, party allocation | [`DEVNET_RUNBOOK.md`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/docs/DEVNET_RUNBOOK.md) |

---

## 📚 Architectural Documentation

Comprehensive operational and technical guides are available in the [`docs/`](file:///Users/rajurajkishore/Desktop/Canton/Reassure/resure-nexus/docs) directory:

- [**System Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md): Authority boundaries, ledger streams, and components.
- [**Authorization Matrix (`docs/AUTHORIZATION_MATRIX.md`)**](docs/AUTHORIZATION_MATRIX.md): Detailed 15-contract signatory, observer, and controller rights.
- [**Calculation Methodology (`docs/CALCULATION_METHODOLOGY.md`)**](docs/CALCULATION_METHODOLOGY.md): Mathematical formulas and 8 numerical test vectors.
- [**Security Threat Model (`docs/THREAT_MODEL.md`)**](docs/THREAT_MODEL.md): Analysis of identity spoofing, data leakage, and tampered evidence mitigations.
- [**Canton DevNet Runbook (`docs/DEVNET_RUNBOOK.md`)**](docs/DEVNET_RUNBOOK.md): Deployment instructions for public Canton DevNet participants.
- [**Recovery & Reset Runbook (`docs/RECOVERY_RUNBOOK.md`)**](docs/RECOVERY_RUNBOOK.md): Restart reconciliation and DevNet reset handling.
- [**Verification Report (`docs/VERIFICATION_REPORT.md`)**](docs/VERIFICATION_REPORT.md): Complete milestone audit and acceptance report.

---

## 🔒 Security & Privacy Principles

1. **Never Trust the Browser**: Client headers only request persona switching; all identity-to-party mapping and Canton authorization tokens are minted securely server-side.
2. **Truthful Connectivity**: The application reports real ledger connectivity (`isMocked: false`) and displays truthful zero states when unpopulated.
3. **Confirmed-Only Settlement**: Recoverables are never marked "Paid" without authorized settlement confirmation linked to verified remittance evidence.

---

## 📄 License

This project is licensed under the Apache 2.0 License.
