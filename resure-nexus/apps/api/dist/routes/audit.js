"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = require("../services");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const limit = Math.min(200, Number(req.query.limit) || 100);
    const events = services_1.services.repository.getAuditEvents(limit);
    // If role is Reinsurer, filter out events that pertain strictly to other reinsurers
    if (req.user.role === 'Reinsurer') {
        const filtered = events.filter(e => {
            if (e.party === req.user.party)
                return true;
            if (e.details?.reinsurer && e.details.reinsurer !== req.user.party)
                return false;
            return true;
        });
        return res.json({ events: filtered });
    }
    res.json({ events });
});
exports.default = router;
//# sourceMappingURL=audit.js.map