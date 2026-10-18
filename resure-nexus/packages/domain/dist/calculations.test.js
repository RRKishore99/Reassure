"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const calculations_1 = require("./calculations");
(0, node_test_1.describe)('Domain Calculations — Invariant Test Vectors', () => {
    (0, node_test_1.describe)('Quota Share Invariants', () => {
        (0, node_test_1.it)('calculates proportional allocation with multiple reinsurers and unplaced line', () => {
            const result = (0, calculations_1.calculateQuotaShare)({ amount: '1000000.00', currency: 'USD' }, '0.50', // 50% ceded = $500,000
            [
                { reinsurer: 'ApexRe', linePercentage: '0.60' }, // 60% of ceded = $300,000
                { reinsurer: 'SummitRe', linePercentage: '0.30' } // 30% of ceded = $150,000
                // Unplaced = 10% = $50,000
            ]);
            node_assert_1.default.strictEqual(result.cappedCededAmount.amount, '500000.00');
            node_assert_1.default.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '300000.00');
            node_assert_1.default.strictEqual(result.reinsurerAllocations[1].allocatedAmount.amount, '150000.00');
            node_assert_1.default.strictEqual(result.unplacedAmount.amount, '50000.00');
            node_assert_1.default.strictEqual(result.unplacedPercentage, '0.1');
        });
        (0, node_test_1.it)('applies contractual cap before allocation', () => {
            const result = (0, calculations_1.calculateQuotaShare)({ amount: '2000000.00', currency: 'USD' }, '0.50', // Ceded would be $1,000,000
            [{ reinsurer: 'ApexRe', linePercentage: '1.00' }], { amount: '750000.00', currency: 'USD' } // Cap at $750,000
            );
            node_assert_1.default.strictEqual(result.cappedCededAmount.amount, '750000.00');
            node_assert_1.default.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '750000.00');
        });
        (0, node_test_1.it)('rejects participation sum greater than 100%', () => {
            node_assert_1.default.throws(() => {
                (0, calculations_1.calculateQuotaShare)({ amount: '100000.00', currency: 'USD' }, '0.50', [
                    { reinsurer: 'ApexRe', linePercentage: '0.70' },
                    { reinsurer: 'SummitRe', linePercentage: '0.40' } // Total 110%
                ]);
            }, /Total reinsurer participation cannot exceed 100%/);
        });
        (0, node_test_1.it)('rejects currency mismatch between loss and cap', () => {
            node_assert_1.default.throws(() => {
                (0, calculations_1.calculateQuotaShare)({ amount: '100000.00', currency: 'USD' }, '0.50', [{ reinsurer: 'ApexRe', linePercentage: '1.00' }], { amount: '50000.00', currency: 'EUR' });
            }, /Currency mismatch/);
        });
    });
    (0, node_test_1.describe)('Excess of Loss (XoL) Invariants', () => {
        const attach = { amount: '1000000.00', currency: 'USD' };
        const limit = { amount: '2000000.00', currency: 'USD' };
        const reinsurers = [{ reinsurer: 'ApexRe', linePercentage: '1.00' }];
        (0, node_test_1.it)('yields zero recovery when loss is below attachment point', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '800000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '0.00');
            node_assert_1.default.strictEqual(result.isLossBelowAttachment, true);
            node_assert_1.default.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '0.00');
        });
        (0, node_test_1.it)('yields zero recovery when loss is exactly at attachment point', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '1000000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '0.00');
            node_assert_1.default.strictEqual(result.isLossBelowAttachment, true);
        });
        (0, node_test_1.it)('calculates recovery between attachment and limit', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '1500000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            // Loss within layer = $1.5M - $1.0M = $500k
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '500000.00');
            node_assert_1.default.strictEqual(result.isLayerExhausted, false);
            node_assert_1.default.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '500000.00');
        });
        (0, node_test_1.it)('caps recovery at layer limit when loss equals attachment + limit', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '3000000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            // Loss within layer = $3.0M - $1.0M = $2.0M (exhausts limit)
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '2000000.00');
            node_assert_1.default.strictEqual(result.isLayerExhausted, true);
        });
        (0, node_test_1.it)('caps recovery at layer limit when loss is well above limit', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '10000000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '2000000.00');
            node_assert_1.default.strictEqual(result.isLayerExhausted, true);
        });
        (0, node_test_1.it)('aggregates multiple claims within a single loss occurrence', () => {
            const result = (0, calculations_1.calculateExcessOfLoss)([
                { claimRef: 'CLM-01', eligibleLoss: { amount: '600000.00', currency: 'USD' } },
                { claimRef: 'CLM-02', eligibleLoss: { amount: '700000.00', currency: 'USD' } }
            ], attach, limit, 1, [
                { reinsurer: 'ApexRe', linePercentage: '0.60' },
                { reinsurer: 'SummitRe', linePercentage: '0.40' }
            ]);
            // Total occurrence loss = $1.3M -> Above attach by $300k
            node_assert_1.default.strictEqual(result.totalOccurrenceLoss.amount, '1300000.00');
            node_assert_1.default.strictEqual(result.grossLayerRecovery.amount, '300000.00');
            node_assert_1.default.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '180000.00'); // 60%
            node_assert_1.default.strictEqual(result.reinsurerAllocations[1].allocatedAmount.amount, '120000.00'); // 40%
            node_assert_1.default.strictEqual(result.unplacedAmount.amount, '0.00');
        });
        (0, node_test_1.it)('rejects negative or zero layer limits', () => {
            node_assert_1.default.throws(() => {
                (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '100000.00', currency: 'USD' } }], attach, { amount: '0.00', currency: 'USD' }, 1, reinsurers);
            }, /Layer limit must be greater than zero/);
        });
        (0, node_test_1.it)('rejects negative loss amounts', () => {
            node_assert_1.default.throws(() => {
                (0, calculations_1.calculateExcessOfLoss)([{ claimRef: 'CLM-01', eligibleLoss: { amount: '-1000.00', currency: 'USD' } }], attach, limit, 1, reinsurers);
            }, /Negative monetary amount not permitted/);
        });
    });
    (0, node_test_1.describe)('Loss Adjustment Invariants', () => {
        (0, node_test_1.it)('deducts salvage and subrogation in sequence', () => {
            const result = (0, calculations_1.calculateLossAdjustments)({
                originalSubjectLoss: { amount: '500000.00', currency: 'USD' },
                salvage: { amount: '50000.00', currency: 'USD' },
                subrogation: { amount: '100000.00', currency: 'USD' }
            });
            node_assert_1.default.strictEqual(result.totalReductions.amount, '150000.00');
            node_assert_1.default.strictEqual(result.adjustedSubjectLoss.amount, '350000.00');
            node_assert_1.default.strictEqual(result.isFlooredAtZero, false);
        });
        (0, node_test_1.it)('floors adjusted loss at zero when reductions exceed subject loss', () => {
            const result = (0, calculations_1.calculateLossAdjustments)({
                originalSubjectLoss: { amount: '100000.00', currency: 'USD' },
                salvage: { amount: '80000.00', currency: 'USD' },
                subrogation: { amount: '50000.00', currency: 'USD' }
            });
            node_assert_1.default.strictEqual(result.totalReductions.amount, '130000.00');
            node_assert_1.default.strictEqual(result.adjustedSubjectLoss.amount, '0.00');
            node_assert_1.default.strictEqual(result.isFlooredAtZero, true);
        });
    });
});
//# sourceMappingURL=calculations.test.js.map