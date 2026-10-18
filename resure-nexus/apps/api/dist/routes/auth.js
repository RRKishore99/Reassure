"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
router.get('/me', (req, res) => {
    const metrics = services_1.services.repository.getDashboardMetrics(req.user.party, req.user.role);
    res.json({
        user: req.user,
        metrics
    });
});
router.get('/parties', (_req, res) => {
    res.json({
        parties: Object.values(auth_1.PARTY_REGISTRY)
    });
});
router.post('/switch-role', (req, res) => {
    const targetRole = req.body?.role;
    const targetUser = auth_1.PARTY_REGISTRY[targetRole];
    if (!targetUser) {
        return res.status(400).json({ error: 'InvalidRole', message: `Unknown role "${targetRole}"` });
    }
    res.json({
        user: targetUser,
        roleHeader: targetRole
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map