import { Router } from 'express';
import { SettlementConfirmationSchema, SettlementReconciliation } from '@resure-nexus/domain';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List settlements (privacy filtered)
router.get('/', (req, res) => {
  const settlements = services.repository.getSettlements(req.user.party, req.user.role);
  const reconciliations = services.repository.getSettlementReconciliations();
  res.json({ settlements, reconciliations });
});

// Record verified payment confirmation evidence and reconcile settlement
router.post('/:ref/reconcile', requireRoles('Operations', 'Cedant'), async (req, res, next) => {
  try {
    const validated = SettlementConfirmationSchema.parse({
      ...req.body,
      settlementRef: req.params.ref
    });

    const settlements = services.repository.getSettlements();
    const settlement = settlements.find(s => s.settlementRef === validated.settlementRef);
    if (!settlement) {
      return res.status(404).json({ error: 'NotFound', message: `Settlement "${validated.settlementRef}" not found` });
    }

    const confirmedAmountBn = parseFloat(validated.confirmedAmount.amount) || 0;
    const priorSettledBn = parseFloat(settlement.amountSettled.amount) || 0;
    const dueBn = parseFloat(settlement.amountDue.amount) || 0;

    const newSettledBn = priorSettledBn + confirmedAmountBn;
    if (newSettledBn > dueBn) {
      return res.status(400).json({
        error: 'OverpaymentNotPermitted',
        message: `Confirmed amount (${newSettledBn.toFixed(2)}) exceeds amount due (${dueBn.toFixed(2)})`
      });
    }

    const remainingBn = Math.max(0, dueBn - newSettledBn);
    settlement.amountSettled = { amount: newSettledBn.toFixed(2), currency: settlement.amountDue.currency };
    settlement.outstandingBalance = { amount: remainingBn.toFixed(2), currency: settlement.amountDue.currency };

    // Update status based on verified evidence
    if (remainingBn === 0) {
      settlement.status = 'Settled';
    } else {
      if (!settlement.permitPartial) {
        return res.status(400).json({
          error: 'PartialSettlementNotPermitted',
          message: 'This settlement does not permit partial payments'
        });
      }
      settlement.status = 'PartialSettled';
    }

    services.repository.saveSettlement(settlement);

    const reconciliation: SettlementReconciliation = {
      reconciliationRef: validated.reconciliationRef,
      settlementRef: settlement.settlementRef,
      confirmedAmount: validated.confirmedAmount,
      reconciliationSource: validated.reconciliationSource,
      confirmedBy: req.user.party,
      confirmationTime: new Date().toISOString(),
      paymentEvidence: validated.paymentEvidence,
      remainingOutstanding: settlement.outstandingBalance
    };

    services.repository.saveSettlementReconciliation(reconciliation);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'SETTLEMENT_PAYMENT_CONFIRMED',
      allocationRef: settlement.allocationRef,
      details: {
        settlementRef: settlement.settlementRef,
        confirmedAmount: validated.confirmedAmount,
        reconciliationSource: validated.reconciliationSource,
        paymentDocumentId: validated.paymentEvidence.documentId,
        newStatus: settlement.status
      }
    });

    res.json({
      settlement,
      reconciliation,
      message: 'Settlement confirmed against verified payment source document. (Manual Finance Verification - No fake bank API called)'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
