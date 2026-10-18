import { Router } from 'express';
import { RecoveryAdjustmentSchema, RecoveryAdjustment } from '@resure-nexus/domain';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List adjustments
router.get('/', (_req, res) => {
  const adjustments = services.repository.getRecoveryAdjustments();
  res.json({ adjustments });
});

// Propose recovery adjustment (salvage, subrogation, third-party recovery)
router.post('/', requireRoles('Cedant', 'Operations'), async (req, res, next) => {
  try {
    const validated = RecoveryAdjustmentSchema.parse(req.body);

    const cycles = services.repository.getAllocationCycles();
    const cycle = cycles.find(c => c.cycleRef === validated.originalCycleRef);
    if (!cycle) {
      return res.status(404).json({ error: 'NotFound', message: `Original cycle "${validated.originalCycleRef}" not found` });
    }

    const priorRecovery = cycle.totalGrossRecovery;
    const priorAmount = parseFloat(priorRecovery.amount) || 0;
    const adjustmentAmount = parseFloat(validated.adjustmentAmount.amount) || 0;

    // Reductions from salvage or subrogation reduce subject recovery (floored at 0)
    const revisedAmount = Math.max(0, priorAmount - adjustmentAmount).toFixed(2);

    const adjustment: RecoveryAdjustment = {
      adjustmentRef: validated.adjustmentRef,
      originalCycleRef: validated.originalCycleRef,
      claimRef: validated.claimRef,
      adjustmentType: validated.adjustmentType,
      adjustmentAmount: validated.adjustmentAmount,
      priorRecovery,
      revisedRecovery: { amount: revisedAmount, currency: priorRecovery.currency },
      effectiveDate: validated.effectiveDate,
      evidenceRefs: validated.evidenceRefs,
      approvedBy: req.user.party
    };

    services.repository.saveRecoveryAdjustment(adjustment);

    // Update cycle status to Adjusted
    cycle.status = 'Adjusted';
    services.repository.saveAllocationCycle(cycle);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'RECOVERY_ADJUSTMENT_APPLIED',
      claimRef: validated.claimRef,
      details: {
        adjustmentRef: adjustment.adjustmentRef,
        adjustmentType: adjustment.adjustmentType,
        adjustmentAmount: adjustment.adjustmentAmount,
        revisedRecovery: adjustment.revisedRecovery
      }
    });

    res.status(201).json({ adjustment, cycleStatus: 'Adjusted' });
  } catch (err) {
    next(err);
  }
});

export default router;
