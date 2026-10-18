/**
 * ReSure Nexus — Pure, Deterministic Reinsurance Calculation Engine
 *
 * Implements Section 25 "Mandatory calculation logic" from Prompt.md:
 * - Fixed-point / BigNumber arithmetic (NEVER binary float)
 * - Quota-share allocations with cap and unplaced line retention
 * - Per-occurrence Excess-of-Loss (XoL) with layer limits & attachments
 * - Salvage, subrogation & recovery adjustments floored at zero
 * - Complete mathematical transparency with intermediate values and formulas
 */
import { Currency, MonetaryAmount } from './types';
export interface ReinsurerLineInput {
    reinsurer: string;
    linePercentage: string;
}
export interface ReinsurerAllocationResult {
    reinsurer: string;
    linePercentage: string;
    allocatedAmount: MonetaryAmount;
    roundingDelta: string;
}
export interface QuotaShareCalculationResult {
    treatyType: 'QuotaShare';
    currency: Currency;
    eligibleLoss: MonetaryAmount;
    cededPercentage: string;
    uncappedCededAmount: MonetaryAmount;
    contractualCap?: MonetaryAmount;
    cappedCededAmount: MonetaryAmount;
    totalPlacedPercentage: string;
    unplacedPercentage: string;
    unplacedAmount: MonetaryAmount;
    reinsurerAllocations: ReinsurerAllocationResult[];
    formula: string;
    intermediateSteps: {
        step: string;
        description: string;
        value: string;
    }[];
}
export interface ClaimLossInput {
    claimRef: string;
    eligibleLoss: MonetaryAmount;
}
export interface XoLCalculationResult {
    treatyType: 'ExcessOfLoss';
    currency: Currency;
    occurrenceClaims: ClaimLossInput[];
    totalOccurrenceLoss: MonetaryAmount;
    attachmentPoint: MonetaryAmount;
    layerLimit: MonetaryAmount;
    layerNumber: number;
    lossWithinLayer: MonetaryAmount;
    grossLayerRecovery: MonetaryAmount;
    isLossBelowAttachment: boolean;
    isLayerExhausted: boolean;
    totalPlacedPercentage: string;
    unplacedPercentage: string;
    unplacedAmount: MonetaryAmount;
    reinsurerAllocations: ReinsurerAllocationResult[];
    formula: string;
    intermediateSteps: {
        step: string;
        description: string;
        value: string;
    }[];
}
export interface LossAdjustmentInput {
    originalSubjectLoss: MonetaryAmount;
    salvage?: MonetaryAmount;
    subrogation?: MonetaryAmount;
    thirdPartyRecoveries?: MonetaryAmount;
}
export interface LossAdjustmentResult {
    currency: Currency;
    originalSubjectLoss: MonetaryAmount;
    totalReductions: MonetaryAmount;
    adjustedSubjectLoss: MonetaryAmount;
    isFlooredAtZero: boolean;
    breakdown: {
        salvageApplied: MonetaryAmount;
        subrogationApplied: MonetaryAmount;
        thirdPartyApplied: MonetaryAmount;
    };
    formula: string;
}
/**
 * Validates that all monetary inputs share the same currency.
 */
export declare function validateCurrencyMatch(currency: Currency, ...amounts: (MonetaryAmount | undefined)[]): void;
/**
 * Calculates Quota-Share treaty recovery allocation.
 */
export declare function calculateQuotaShare(eligibleLoss: MonetaryAmount, cededPercentage: string, reinsurers: ReinsurerLineInput[], contractualCap?: MonetaryAmount): QuotaShareCalculationResult;
/**
 * Calculates Per-Occurrence Excess of Loss (XoL) recovery allocation.
 */
export declare function calculateExcessOfLoss(occurrenceClaims: ClaimLossInput[], attachmentPoint: MonetaryAmount, layerLimit: MonetaryAmount, layerNumber: number, reinsurers: ReinsurerLineInput[]): XoLCalculationResult;
/**
 * Calculates Loss Adjustments (Salvage, Subrogation, Third-Party Recoveries).
 * Applies sequence of deductions, floored at zero.
 */
export declare function calculateLossAdjustments(input: LossAdjustmentInput): LossAdjustmentResult;
//# sourceMappingURL=calculations.d.ts.map