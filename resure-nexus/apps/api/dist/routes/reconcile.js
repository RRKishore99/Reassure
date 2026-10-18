"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// Trigger projection reconciliation from the ledger
router.post('/', (0, auth_1.requireRoles)('Operations', 'Audit'), async (_req, res) => {
    const result = await services_1.services.reconciler.reconcileAll();
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
exports.default = router;
//# sourceMappingURL=reconcile.js.map