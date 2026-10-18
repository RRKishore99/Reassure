import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateQuotaShare,
  calculateExcessOfLoss,
  calculateLossAdjustments,
  validateCurrencyMatch
} from './calculations';

describe('Domain Calculations — Invariant Test Vectors', () => {
  describe('Quota Share Invariants', () => {
    it('calculates proportional allocation with multiple reinsurers and unplaced line', () => {
      const result = calculateQuotaShare(
        { amount: '1000000.00', currency: 'USD' },
        '0.50', // 50% ceded = $500,000
        [
          { reinsurer: 'ApexRe', linePercentage: '0.60' }, // 60% of ceded = $300,000
          { reinsurer: 'SummitRe', linePercentage: '0.30' } // 30% of ceded = $150,000
          // Unplaced = 10% = $50,000
        ]
      );

      assert.strictEqual(result.cappedCededAmount.amount, '500000.00');
      assert.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '300000.00');
      assert.strictEqual(result.reinsurerAllocations[1].allocatedAmount.amount, '150000.00');
      assert.strictEqual(result.unplacedAmount.amount, '50000.00');
      assert.strictEqual(result.unplacedPercentage, '0.1');
    });

    it('applies contractual cap before allocation', () => {
      const result = calculateQuotaShare(
        { amount: '2000000.00', currency: 'USD' },
        '0.50', // Ceded would be $1,000,000
        [{ reinsurer: 'ApexRe', linePercentage: '1.00' }],
        { amount: '750000.00', currency: 'USD' } // Cap at $750,000
      );

      assert.strictEqual(result.cappedCededAmount.amount, '750000.00');
      assert.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '750000.00');
    });

    it('rejects participation sum greater than 100%', () => {
      assert.throws(() => {
        calculateQuotaShare(
          { amount: '100000.00', currency: 'USD' },
          '0.50',
          [
            { reinsurer: 'ApexRe', linePercentage: '0.70' },
            { reinsurer: 'SummitRe', linePercentage: '0.40' } // Total 110%
          ]
        );
      }, /Total reinsurer participation cannot exceed 100%/);
    });

    it('rejects currency mismatch between loss and cap', () => {
      assert.throws(() => {
        calculateQuotaShare(
          { amount: '100000.00', currency: 'USD' },
          '0.50',
          [{ reinsurer: 'ApexRe', linePercentage: '1.00' }],
          { amount: '50000.00', currency: 'EUR' }
        );
      }, /Currency mismatch/);
    });
  });

  describe('Excess of Loss (XoL) Invariants', () => {
    const attach = { amount: '1000000.00', currency: 'USD' as const };
    const limit = { amount: '2000000.00', currency: 'USD' as const };
    const reinsurers = [{ reinsurer: 'ApexRe', linePercentage: '1.00' }];

    it('yields zero recovery when loss is below attachment point', () => {
      const result = calculateExcessOfLoss(
        [{ claimRef: 'CLM-01', eligibleLoss: { amount: '800000.00', currency: 'USD' } }],
        attach,
        limit,
        1,
        reinsurers
      );

      assert.strictEqual(result.grossLayerRecovery.amount, '0.00');
      assert.strictEqual(result.isLossBelowAttachment, true);
      assert.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '0.00');
    });

    it('yields zero recovery when loss is exactly at attachment point', () => {
      const result = calculateExcessOfLoss(
        [{ claimRef: 'CLM-01', eligibleLoss: { amount: '1000000.00', currency: 'USD' } }],
        attach,
        limit,
        1,
        reinsurers
      );

      assert.strictEqual(result.grossLayerRecovery.amount, '0.00');
      assert.strictEqual(result.isLossBelowAttachment, true);
    });

    it('calculates recovery between attachment and limit', () => {
      const result = calculateExcessOfLoss(
        [{ claimRef: 'CLM-01', eligibleLoss: { amount: '1500000.00', currency: 'USD' } }],
        attach,
        limit,
        1,
        reinsurers
      );

      // Loss within layer = $1.5M - $1.0M = $500k
      assert.strictEqual(result.grossLayerRecovery.amount, '500000.00');
      assert.strictEqual(result.isLayerExhausted, false);
      assert.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '500000.00');
    });

    it('caps recovery at layer limit when loss equals attachment + limit', () => {
      const result = calculateExcessOfLoss(
        [{ claimRef: 'CLM-01', eligibleLoss: { amount: '3000000.00', currency: 'USD' } }],
        attach,
        limit,
        1,
        reinsurers
      );

      // Loss within layer = $3.0M - $1.0M = $2.0M (exhausts limit)
      assert.strictEqual(result.grossLayerRecovery.amount, '2000000.00');
      assert.strictEqual(result.isLayerExhausted, true);
    });

    it('caps recovery at layer limit when loss is well above limit', () => {
      const result = calculateExcessOfLoss(
        [{ claimRef: 'CLM-01', eligibleLoss: { amount: '10000000.00', currency: 'USD' } }],
        attach,
        limit,
        1,
        reinsurers
      );

      assert.strictEqual(result.grossLayerRecovery.amount, '2000000.00');
      assert.strictEqual(result.isLayerExhausted, true);
    });

    it('aggregates multiple claims within a single loss occurrence', () => {
      const result = calculateExcessOfLoss(
        [
          { claimRef: 'CLM-01', eligibleLoss: { amount: '600000.00', currency: 'USD' } },
          { claimRef: 'CLM-02', eligibleLoss: { amount: '700000.00', currency: 'USD' } }
        ],
        attach,
        limit,
        1,
        [
          { reinsurer: 'ApexRe', linePercentage: '0.60' },
          { reinsurer: 'SummitRe', linePercentage: '0.40' }
        ]
      );

      // Total occurrence loss = $1.3M -> Above attach by $300k
      assert.strictEqual(result.totalOccurrenceLoss.amount, '1300000.00');
      assert.strictEqual(result.grossLayerRecovery.amount, '300000.00');
      assert.strictEqual(result.reinsurerAllocations[0].allocatedAmount.amount, '180000.00'); // 60%
      assert.strictEqual(result.reinsurerAllocations[1].allocatedAmount.amount, '120000.00'); // 40%
      assert.strictEqual(result.unplacedAmount.amount, '0.00');
    });

    it('rejects negative or zero layer limits', () => {
      assert.throws(() => {
        calculateExcessOfLoss(
          [{ claimRef: 'CLM-01', eligibleLoss: { amount: '100000.00', currency: 'USD' } }],
          attach,
          { amount: '0.00', currency: 'USD' },
          1,
          reinsurers
        );
      }, /Layer limit must be greater than zero/);
    });

    it('rejects negative loss amounts', () => {
      assert.throws(() => {
        calculateExcessOfLoss(
          [{ claimRef: 'CLM-01', eligibleLoss: { amount: '-1000.00', currency: 'USD' } }],
          attach,
          limit,
          1,
          reinsurers
        );
      }, /Negative monetary amount not permitted/);
    });
  });

  describe('Loss Adjustment Invariants', () => {
    it('deducts salvage and subrogation in sequence', () => {
      const result = calculateLossAdjustments({
        originalSubjectLoss: { amount: '500000.00', currency: 'USD' },
        salvage: { amount: '50000.00', currency: 'USD' },
        subrogation: { amount: '100000.00', currency: 'USD' }
      });

      assert.strictEqual(result.totalReductions.amount, '150000.00');
      assert.strictEqual(result.adjustedSubjectLoss.amount, '350000.00');
      assert.strictEqual(result.isFlooredAtZero, false);
    });

    it('floors adjusted loss at zero when reductions exceed subject loss', () => {
      const result = calculateLossAdjustments({
        originalSubjectLoss: { amount: '100000.00', currency: 'USD' },
        salvage: { amount: '80000.00', currency: 'USD' },
        subrogation: { amount: '50000.00', currency: 'USD' }
      });

      assert.strictEqual(result.totalReductions.amount, '130000.00');
      assert.strictEqual(result.adjustedSubjectLoss.amount, '0.00');
      assert.strictEqual(result.isFlooredAtZero, true);
    });
  });
});
