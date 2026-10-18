import { Router } from 'express';
import { services } from '../services';

const router = Router();

router.get('/', (req, res) => {
  const limit = Math.min(200, Number(req.query.limit) || 100);
  const events = services.repository.getAuditEvents(limit);

  // If role is Reinsurer, filter out events that pertain strictly to other reinsurers
  if (req.user.role === 'Reinsurer') {
    const filtered = events.filter(e => {
      if (e.party === req.user.party) return true;
      if (e.details?.reinsurer && e.details.reinsurer !== req.user.party) return false;
      return true;
    });
    return res.json({ events: filtered });
  }

  res.json({ events });
});

export default router;
