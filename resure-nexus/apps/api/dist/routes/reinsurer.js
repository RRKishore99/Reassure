"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// Reinsurer records decision on their allocation
router.post('/decisions', (0, auth_1.requireRoles)('Reinsurer'), async (req, res, next) => {
    try {
        const validated = domain_1.ReinsurerDecisionSchema.parse(req.body);
        const allocations = services_1.services.repository.getRecoverableAllocations();
        const allocation = allocations.find(a => a.allocationRef === validated.allocationRef);
        if (!allocation) {
            return res.status(404).json({ error: 'NotFound', message: `Allocation "${validated.allocationRef}" not found` });
        }
        // Strict privacy boundary: Reinsurer can ONLY decide on its own allocation!
        if (allocation.reinsurer !== req.user.party) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Party "${req.user.party}" is not authorized to submit decisions for allocation "${validated.allocationRef}" belonging to "${allocation.reinsurer}"`
            });
        }
        const decision = {
            decisionRef: validated.decisionRef,
            allocationRef: validated.allocationRef,
            reinsurer: req.user.party,
            cedant: allocation.cedant,
            decisionType: validated.decisionType,
            reason: validated.reason,
            evidenceRefs: validated.evidenceRefs,
            timestamp: new Date().toISOString()
        };
        services_1.services.repository.saveReinsurerDecision(decision);
        // Update allocation status based on decision
        if (validated.decisionType === 'Accept') {
            allocation.status = 'Accepted';
            services_1.services.repository.saveRecoverableAllocation(allocation);
            services_1.services.repository.recordAuditEvent({
                eventId: `EVT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                party: req.user.party,
                role: req.user.role,
                action: 'ALLOCATION_ACCEPTED_BY_REINSURER',
                allocationRef: allocation.allocationRef,
                details: { reason: validated.reason }
            });
        }
        else if (validated.decisionType === 'Dispute') {
            allocation.status = 'Disputed';
            services_1.services.repository.saveRecoverableAllocation(allocation);
            // Create formal DisputeCase
            const disputeRef = `DISP-${allocation.allocationRef}`;
            const dispute = {
                disputeRef,
                allocationRef: allocation.allocationRef,
                reinsurer: req.user.party,
                cedant: allocation.cedant,
                disputedAmount: allocation.allocatedAmount,
                reason: validated.reason,
                evidenceRefs: validated.evidenceRefs,
                status: 'Raised',
                raisedAt: new Date().toISOString()
            };
            services_1.services.repository.saveDispute(dispute);
            services_1.services.repository.recordAuditEvent({
                eventId: `EVT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                party: req.user.party,
                role: req.user.role,
                action: 'ALLOCATION_DISPUTED_BY_REINSURER',
                allocationRef: allocation.allocationRef,
                details: { disputeRef, reason: validated.reason, disputedAmount: allocation.allocatedAmount }
            });
        }
        else {
            // RequestInformation
            services_1.services.repository.recordAuditEvent({
                eventId: `EVT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                party: req.user.party,
                role: req.user.role,
                action: 'INFORMATION_REQUESTED_BY_REINSURER',
                allocationRef: allocation.allocationRef,
                details: { reason: validated.reason }
            });
        }
        res.json({ decision, allocationStatus: allocation.status });
    }
    catch (err) {
        next(err);
    }
});
// List decisions
router.get('/decisions', (req, res) => {
    const allocationRef = req.query.allocationRef;
    const decisions = services_1.services.repository.getReinsurerDecisions(allocationRef);
    res.json({ decisions });
});
exports.default = router;
//# sourceMappingURL=reinsurer.js.map