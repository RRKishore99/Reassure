# ReSure Nexus — Calculation Methodology & Test Vectors

## 1. Core Principles

All monetary computations in ReSure Nexus enforce Section 25 of the architecture specification:
- **Zero Binary Float Arithmetic:** Computations strictly use fixed-point arithmetic (`bignumber.js` in TypeScript, `Decimal` in Daml).
- **Rounding Policy:** Standard financial Banker's Rounding (`ROUND_HALF_EVEN`) to 2 decimal places for cents.
- **Rounding Residuals:** Rounding deltas are explicitly calculated and recorded to preserve financial integrity.
- **Incomplete Placement:** If reinsurers assume less than 100% of a placed layer/share, the unplaced proportion is explicitly accounted for and retained by the Cedant.

---

## 2. Quota-Share Treaty Allocation Engine

### Mathematical Formula
1. **Uncapped Ceded Amount:**
   $$\text{Ceded Amount} = \text{Eligible Loss} \times \text{Ceded Percentage}$$

2. **Application of Contractual Cap:**
   $$\text{Capped Ceded Amount} = \min(\text{Ceded Amount}, \text{Contractual Cap})$$

3. **Individual Reinsurer Allocations:**
   For each participating reinsurer $i$ with line percentage $p_i$:
   $$\text{Allocation}_i = \text{Capped Ceded Amount} \times p_i$$

4. **Unplaced Line Retained by Cedant:**
   $$\text{Unplaced Amount} = \text{Capped Ceded Amount} \times \left(1 - \sum p_i\right)$$

---

## 3. Per-Occurrence Excess-of-Loss (XoL) Engine

### Mathematical Formula
1. **Aggregated Occurrence Loss:**
   Sum of eligible assessed losses for all approved claims within the frozen loss occurrence:
   $$\text{Occurrence Loss} = \sum_{c \in \text{Occurrence}} \text{Eligible Loss}(c)$$

2. **Loss Within Layer:**
   $$\text{Loss Within Layer} = \max(0, \text{Occurrence Loss} - \text{Attachment Point})$$

3. **Gross Layer Recovery:**
   $$\text{Gross Recovery} = \min(\text{Loss Within Layer}, \text{Per-Occurrence Layer Limit})$$

4. **Reinsurer Share Allocation:**
   $$\text{Allocation}_i = \text{Gross Recovery} \times p_i$$

---

## 4. Post-Settlement Loss Adjustments

Where salvage proceeds, subrogation recoveries, or third-party indemnities are received:
$$\text{Adjusted Loss} = \max(0, \text{Original Loss} - (\text{Salvage} + \text{Subrogation} + \text{Third-Party}))$$
- Sequence of deductions reduces subject loss.
- Invariant: Adjusted subject loss is strictly floored at 0.00 (cannot turn negative).

---

## 5. Verified Numerical Test Vectors

| Test Vector ID | Scenario | Input Values | Expected Output | Status |
|---|---|---|---|---|
| **TV-01** | Quota-Share with Cap & Unplaced Line | Loss: $2,000,000<br>Ceded: 50%<br>Cap: $750,000<br>ApexRe: 60%, SummitRe: 30% | Capped: $750,000<br>ApexRe: $450,000<br>SummitRe: $225,000<br>Cedant Unplaced: $75,000 (10%) | ✅ Passed |
| **TV-02** | XoL Loss Below Attachment | Occurrence Loss: $800,000<br>Attach: $1,000,000<br>Limit: $2,000,000 | Gross Recovery: $0.00<br>All Reinsurer Shares: $0.00 | ✅ Passed |
| **TV-03** | XoL Loss Exactly at Attachment | Occurrence Loss: $1,000,000<br>Attach: $1,000,000<br>Limit: $2,000,000 | Gross Recovery: $0.00 | ✅ Passed |
| **TV-04** | XoL Loss Between Attach & Limit | Occurrence Loss: $1,500,000<br>Attach: $1,000,000<br>Limit: $2,000,000 | Gross Recovery: $500,000<br>Reinsurer (100%): $500,000 | ✅ Passed |
| **TV-05** | XoL Layer Limit Exhausted | Occurrence Loss: $5,000,000<br>Attach: $1,000,000<br>Limit: $2,000,000 | Loss Above Attach: $4,000,000<br>Gross Recovery (Capped): $2,000,000 | ✅ Passed |
| **TV-06** | Multi-Claim Occurrence Aggregation | Claim 1: $600,000<br>Claim 2: $700,000<br>Attach: $1,000,000<br>Limit: $2,000,000 | Aggregated Loss: $1,300,000<br>Gross Recovery: $300,000<br>ApexRe (60%): $180,000<br>SummitRe (40%): $120,000 | ✅ Passed |
| **TV-07** | Loss Adjustment with Zero Floor | Original Loss: $100,000<br>Salvage: $80,000<br>Subrogation: $50,000 | Total Reductions: $130,000<br>Adjusted Loss: $0.00 (Floored) | ✅ Passed |
| **TV-08** | Incomplete Participation Lines | Gross Recovery: $1,000,000<br>ApexRe: 60%<br>SummitRe: 25% | ApexRe: $600,000<br>SummitRe: $250,000<br>Cedant Retained: $150,000 (15%) | ✅ Passed |
