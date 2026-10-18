"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCurrencyMatch = validateCurrencyMatch;
exports.calculateQuotaShare = calculateQuotaShare;
exports.calculateExcessOfLoss = calculateExcessOfLoss;
exports.calculateLossAdjustments = calculateLossAdjustments;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// Configure BigNumber for financial calculation (ROUND_HALF_UP or ROUND_HALF_EVEN, 2 decimal places for cents)
bignumber_js_1.default.config({
    DECIMAL_PLACES: 28,
    ROUNDING_MODE: bignumber_js_1.default.ROUND_HALF_EVEN
});
function parseAmount(m) {
    const bn = new bignumber_js_1.default(m.amount);
    if (bn.isNaN()) {
        throw new Error(`Invalid monetary amount: "${m.amount}"`);
    }
    if (bn.isNegative()) {
        throw new Error(`Negative monetary amount not permitted: "${m.amount}"`);
    }
    return bn;
}
function formatCents(bn) {
    return bn.toFixed(2, bignumber_js_1.default.ROUND_HALF_EVEN);
}
/**
 * Validates that all monetary inputs share the same currency.
 */
function validateCurrencyMatch(currency, ...amounts) {
    for (const amt of amounts) {
        if (amt && amt.currency !== currency) {
            throw new Error(`Currency mismatch: expected ${currency}, got ${amt.currency}`);
        }
    }
}
/**
 * Calculates Quota-Share treaty recovery allocation.
 */
function calculateQuotaShare(eligibleLoss, cededPercentage, reinsurers, contractualCap) {
    const currency = eligibleLoss.currency;
    validateCurrencyMatch(currency, contractualCap);
    const lossBn = parseAmount(eligibleLoss);
    const cededPctBn = new bignumber_js_1.default(cededPercentage);
    if (cededPctBn.isNegative() || cededPctBn.isGreaterThan(1)) {
        throw new Error(`Invalid ceded percentage: ${cededPercentage}. Must be between 0 and 1.`);
    }
    // 1. Ceded amount = eligible loss * ceded percentage
    const uncappedCededBn = lossBn.multipliedBy(cededPctBn);
    // 2. Apply contractual cap if configured
    let cappedCededBn = uncappedCededBn;
    if (contractualCap) {
        const capBn = parseAmount(contractualCap);
        cappedCededBn = bignumber_js_1.default.min(uncappedCededBn, capBn);
    }
    // 3. Validate reinsurer participations
    let totalPlacedPctBn = new bignumber_js_1.default(0);
    for (const r of reinsurers) {
        const lineBn = new bignumber_js_1.default(r.linePercentage);
        if (lineBn.isNegative() || lineBn.isGreaterThan(1)) {
            throw new Error(`Invalid line percentage for reinsurer ${r.reinsurer}: ${r.linePercentage}`);
        }
        totalPlacedPctBn = totalPlacedPctBn.plus(lineBn);
    }
    if (totalPlacedPctBn.isGreaterThan(1)) {
        throw new Error(`Total reinsurer participation cannot exceed 100%. Sum: ${totalPlacedPctBn.toString()}`);
    }
    const unplacedPctBn = new bignumber_js_1.default(1).minus(totalPlacedPctBn);
    // 4. Calculate individual allocations
    let totalAllocatedCents = new bignumber_js_1.default(0);
    const reinsurerAllocations = [];
    for (const r of reinsurers) {
        const lineBn = new bignumber_js_1.default(r.linePercentage);
        const rawAllocated = cappedCededBn.multipliedBy(lineBn);
        const roundedAllocated = new bignumber_js_1.default(formatCents(rawAllocated));
        const roundingDelta = rawAllocated.minus(roundedAllocated).toFixed(4);
        totalAllocatedCents = totalAllocatedCents.plus(roundedAllocated);
        reinsurerAllocations.push({
            reinsurer: r.reinsurer,
            linePercentage: r.linePercentage,
            allocatedAmount: {
                amount: formatCents(roundedAllocated),
                currency
            },
            roundingDelta
        });
    }
    // 5. Unplaced recovery retained by Cedant
    const unplacedAmountBn = cappedCededBn.multipliedBy(unplacedPctBn);
    const formattedUnplaced = formatCents(unplacedAmountBn);
    return {
        treatyType: 'QuotaShare',
        currency,
        eligibleLoss: { amount: formatCents(lossBn), currency },
        cededPercentage,
        uncappedCededAmount: { amount: formatCents(uncappedCededBn), currency },
        contractualCap: contractualCap ? { amount: formatCents(parseAmount(contractualCap)), currency } : undefined,
        cappedCededAmount: { amount: formatCents(cappedCededBn), currency },
        totalPlacedPercentage: totalPlacedPctBn.toString(),
        unplacedPercentage: unplacedPctBn.toString(),
        unplacedAmount: { amount: formattedUnplaced, currency },
        reinsurerAllocations,
        formula: `Ceded Amount = ${lossBn.toString()} × ${cededPctBn.toString()} = ${uncappedCededBn.toString()}` +
            (contractualCap ? `; Capped at min(${uncappedCededBn.toString()}, ${contractualCap.amount}) = ${cappedCededBn.toString()}` : ''),
        intermediateSteps: [
            { step: '1. Subject Loss', description: 'Assessed eligible loss', value: `${formatCents(lossBn)} ${currency}` },
            { step: '2. Ceded Share', description: `Applied ceded percentage of ${cededPctBn.multipliedBy(100).toString()}%`, value: `${formatCents(uncappedCededBn)} ${currency}` },
            { step: '3. Cap Application', description: contractualCap ? `Capped at contractual limit of ${contractualCap.amount}` : 'No cap applied', value: `${formatCents(cappedCededBn)} ${currency}` },
            { step: '4. Placement Analysis', description: `Placed: ${totalPlacedPctBn.multipliedBy(100).toString()}%, Retained by Cedant: ${unplacedPctBn.multipliedBy(100).toString()}%`, value: `${formattedUnplaced} ${currency} retained` }
        ]
    };
}
/**
 * Calculates Per-Occurrence Excess of Loss (XoL) recovery allocation.
 */
function calculateExcessOfLoss(occurrenceClaims, attachmentPoint, layerLimit, layerNumber, reinsurers) {
    const currency = attachmentPoint.currency;
    validateCurrencyMatch(currency, layerLimit);
    for (const c of occurrenceClaims) {
        validateCurrencyMatch(currency, c.eligibleLoss);
    }
    const attachBn = parseAmount(attachmentPoint);
    const limitBn = parseAmount(layerLimit);
    if (limitBn.isLessThanOrEqualTo(0)) {
        throw new Error(`Layer limit must be greater than zero. Got ${limitBn.toString()}`);
    }
    // 1. Eligible occurrence loss = sum of eligible losses for approved claims in frozen occurrence
    let totalOccurrenceLossBn = new bignumber_js_1.default(0);
    for (const c of occurrenceClaims) {
        totalOccurrenceLossBn = totalOccurrenceLossBn.plus(parseAmount(c.eligibleLoss));
    }
    // 2. Loss within layer = max(0, eligible occurrence loss - attachment point)
    const lossAboveAttach = totalOccurrenceLossBn.minus(attachBn);
    const lossWithinLayerBn = bignumber_js_1.default.max(new bignumber_js_1.default(0), lossAboveAttach);
    // 3. Gross layer recovery = min(loss within layer, applicable layer limit)
    const grossLayerRecoveryBn = bignumber_js_1.default.min(lossWithinLayerBn, limitBn);
    const isLossBelowAttachment = totalOccurrenceLossBn.isLessThanOrEqualTo(attachBn);
    const isLayerExhausted = lossWithinLayerBn.isGreaterThanOrEqualTo(limitBn);
    // 4. Validate reinsurer participations
    let totalPlacedPctBn = new bignumber_js_1.default(0);
    for (const r of reinsurers) {
        const lineBn = new bignumber_js_1.default(r.linePercentage);
        if (lineBn.isNegative() || lineBn.isGreaterThan(1)) {
            throw new Error(`Invalid line percentage for reinsurer ${r.reinsurer}: ${r.linePercentage}`);
        }
        totalPlacedPctBn = totalPlacedPctBn.plus(lineBn);
    }
    if (totalPlacedPctBn.isGreaterThan(1)) {
        throw new Error(`Total reinsurer participation cannot exceed 100%. Sum: ${totalPlacedPctBn.toString()}`);
    }
    const unplacedPctBn = new bignumber_js_1.default(1).minus(totalPlacedPctBn);
    // 5. Individual reinsurer allocations
    const reinsurerAllocations = [];
    for (const r of reinsurers) {
        const lineBn = new bignumber_js_1.default(r.linePercentage);
        const rawAllocated = grossLayerRecoveryBn.multipliedBy(lineBn);
        const roundedAllocated = new bignumber_js_1.default(formatCents(rawAllocated));
        const roundingDelta = rawAllocated.minus(roundedAllocated).toFixed(4);
        reinsurerAllocations.push({
            reinsurer: r.reinsurer,
            linePercentage: r.linePercentage,
            allocatedAmount: {
                amount: formatCents(roundedAllocated),
                currency
            },
            roundingDelta
        });
    }
    // 6. Unplaced amount retained by Cedant
    const unplacedAmountBn = grossLayerRecoveryBn.multipliedBy(unplacedPctBn);
    return {
        treatyType: 'ExcessOfLoss',
        currency,
        occurrenceClaims,
        totalOccurrenceLoss: { amount: formatCents(totalOccurrenceLossBn), currency },
        attachmentPoint: { amount: formatCents(attachBn), currency },
        layerLimit: { amount: formatCents(limitBn), currency },
        layerNumber,
        lossWithinLayer: { amount: formatCents(lossWithinLayerBn), currency },
        grossLayerRecovery: { amount: formatCents(grossLayerRecoveryBn), currency },
        isLossBelowAttachment,
        isLayerExhausted,
        totalPlacedPercentage: totalPlacedPctBn.toString(),
        unplacedPercentage: unplacedPctBn.toString(),
        unplacedAmount: { amount: formatCents(unplacedAmountBn), currency },
        reinsurerAllocations,
        formula: `Gross Recovery = min(max(0, ${formatCents(totalOccurrenceLossBn)} - ${formatCents(attachBn)}), ${formatCents(limitBn)}) = ${formatCents(grossLayerRecoveryBn)}`,
        intermediateSteps: [
            { step: '1. Occurrence Aggregate', description: `Sum of ${occurrenceClaims.length} approved occurrence claim(s)`, value: `${formatCents(totalOccurrenceLossBn)} ${currency}` },
            { step: '2. Attachment Evaluation', description: `Deduct attachment point of ${formatCents(attachBn)}`, value: `${formatCents(lossWithinLayerBn)} ${currency} above attachment` },
            { step: '3. Layer Capping', description: `Apply layer limit of ${formatCents(limitBn)} (Layer ${layerNumber})`, value: `${formatCents(grossLayerRecoveryBn)} ${currency} gross recovery` },
            { step: '4. Placement Distribution', description: `Placed: ${totalPlacedPctBn.multipliedBy(100).toString()}%, Retained by Cedant: ${unplacedPctBn.multipliedBy(100).toString()}%`, value: `${formatCents(unplacedAmountBn)} ${currency} unplaced` }
        ]
    };
}
/**
 * Calculates Loss Adjustments (Salvage, Subrogation, Third-Party Recoveries).
 * Applies sequence of deductions, floored at zero.
 */
function calculateLossAdjustments(input) {
    const currency = input.originalSubjectLoss.currency;
    validateCurrencyMatch(currency, input.salvage, input.subrogation, input.thirdPartyRecoveries);
    const originalBn = parseAmount(input.originalSubjectLoss);
    const salvageBn = input.salvage ? parseAmount(input.salvage) : new bignumber_js_1.default(0);
    const subrogationBn = input.subrogation ? parseAmount(input.subrogation) : new bignumber_js_1.default(0);
    const thirdPartyBn = input.thirdPartyRecoveries ? parseAmount(input.thirdPartyRecoveries) : new bignumber_js_1.default(0);
    const totalReductionsBn = salvageBn.plus(subrogationBn).plus(thirdPartyBn);
    const unadjustedNetBn = originalBn.minus(totalReductionsBn);
    const isFlooredAtZero = unadjustedNetBn.isNegative();
    const adjustedBn = bignumber_js_1.default.max(new bignumber_js_1.default(0), unadjustedNetBn);
    return {
        currency,
        originalSubjectLoss: { amount: formatCents(originalBn), currency },
        totalReductions: { amount: formatCents(totalReductionsBn), currency },
        adjustedSubjectLoss: { amount: formatCents(adjustedBn), currency },
        isFlooredAtZero,
        breakdown: {
            salvageApplied: { amount: formatCents(salvageBn), currency },
            subrogationApplied: { amount: formatCents(subrogationBn), currency },
            thirdPartyApplied: { amount: formatCents(thirdPartyBn), currency }
        },
        formula: `Adjusted Loss = max(0, ${formatCents(originalBn)} - (${formatCents(salvageBn)} [Salvage] + ${formatCents(subrogationBn)} [Subrogation] + ${formatCents(thirdPartyBn)} [Third-Party])) = ${formatCents(adjustedBn)}`
    };
}
//# sourceMappingURL=calculations.js.map