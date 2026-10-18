import { Router } from 'express';
import { ResolveDisputeSchema } from '@resure-nexus/domain';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List disputes (privacy-filtered)
router.get('/', (req, res) => {
  const disputes = services.repository.getDisputes(req.user.party, req.user.role);
  res.json({ disputes });
});

// Resolve dispute
router.post('/:ref/resolve', requireRoles('Cedant', 'Operations'), async (req, res, next) => {
  try {
    const validated = ResolveDisputeSchema.parse({
      ...req.body,
      disputeRef: req.params.ref
    });

    const disputes = services.repository.getDisputes();
    const dispute = disputes.find(d => d.disputeRef === validated.disputeRef);
    if (!dispute) return res.status(404).json({ error: 'NotFound', message: 'Dispute not found' });

    dispute.status = 'Resolved';
    dispute.resolvedAt = new Date().toISOString();
    dispute.resolutionSummary = validated.resolutionSummary;
    services.repository.saveDispute(dispute);

    // Update associated allocation status to Accepted
    const allocations = services.repository.getRecoverableAllocations();
    const allocation = allocations.find(a => a.allocationRef === dispute.allocationRef);
    if (allocation) {
      allocation.status = 'Accepted';
      if (validated.adjustedAmount) {
        allocation.allocatedAmount = validated.adjustedAmount;
      }
      services.repository.saveRecoverableAllocation(allocation);
    }

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'DISPUTE_RESOLVED',
      allocationRef: dispute.allocationRef,
      details: {
        disputeRef: dispute.disputeRef,
        resolutionSummary: validated.resolutionSummary,
        adjustedAmount: validated.adjustedAmount
      }
    });

    res.json({ dispute, allocation });
  } catch (err) {
    next(err);
  }
});

export default router;
