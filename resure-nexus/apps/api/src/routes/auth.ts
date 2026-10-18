import { Router } from 'express';
import { PARTY_REGISTRY } from '../middleware/auth';
import { services } from '../services';

const router = Router();

router.get('/me', (req, res) => {
  const metrics = services.repository.getDashboardMetrics(req.user.party, req.user.role);
  res.json({
    user: req.user,
    metrics
  });
});

router.get('/parties', (_req, res) => {
  res.json({
    parties: Object.values(PARTY_REGISTRY)
  });
});

router.post('/switch-role', (req, res) => {
  const targetRole = req.body?.role as string;
  const targetUser = PARTY_REGISTRY[targetRole];
  if (!targetUser) {
    return res.status(400).json({ error: 'InvalidRole', message: `Unknown role "${targetRole}"` });
  }
  res.json({
    user: targetUser,
    roleHeader: targetRole
  });
});

export default router;
