"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// List disputes (privacy-filtered)
router.get('/', (req, res) => {
    const disputes = services_1.services.repository.getDisputes(req.user.party, req.user.role);
    res.json({ disputes });
});
// Resolve dispute
router.post('/:ref/resolve', (0, auth_1.requireRoles)('Cedant', 'Operations'), async (req, res, next) => {
    try {
        const validated = domain_1.ResolveDisputeSchema.parse({
            ...req.body,
            disputeRef: req.params.ref
        });
        const disputes = services_1.services.repository.getDisputes();
        const dispute = disputes.find(d => d.disputeRef === validated.disputeRef);
        if (!dispute)
            return res.status(404).json({ error: 'NotFound', message: 'Dispute not found' });
        dispute.status = 'Resolved';
        dispute.resolvedAt = new Date().toISOString();
        dispute.resolutionSummary = validated.resolutionSummary;
        services_1.services.repository.saveDispute(dispute);
        // Update associated allocation status to Accepted
        const allocations = services_1.services.repository.getRecoverableAllocations();
        const allocation = allocations.find(a => a.allocationRef === dispute.allocationRef);
        if (allocation) {
            allocation.status = 'Accepted';
            if (validated.adjustedAmount) {
                allocation.allocatedAmount = validated.adjustedAmount;
            }
            services_1.services.repository.saveRecoverableAllocation(allocation);
        }
        services_1.services.repository.recordAuditEvent({
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
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=disputes.js.map