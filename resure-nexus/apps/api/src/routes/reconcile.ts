import { Router } from 'express';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// Trigger projection reconciliation from the ledger
router.post('/', requireRoles('Operations', 'Audit'), async (_req, res) => {
  const result = await services.reconciler.reconcileAll();
  if (!result.success) {
    return res.status(503).json({
      status: 'RECONCILIATION_FAILED',
      message: result.error,
      syncedTemplates: result.syncedTemplates
    });
  }

  res.json({
    status: 'RECONCILIATION_SUCCESS',
    timestamp: new Date().toISOString(),
    syncedTemplates: result.syncedTemplates
  });
});

export default router;
