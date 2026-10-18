"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const ledger_client_1 = require("@resure-nexus/ledger-client");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// List claims (privacy-filtered)
router.get('/', (req, res) => {
    const claims = services_1.services.repository.getClaims(req.user.party, req.user.role);
    res.json({ claims });
});
// Get claim by reference
router.get('/:ref', (req, res) => {
    const claim = services_1.services.repository.getClaim(req.params.ref);
    if (!claim) {
        return res.status(404).json({ error: 'NotFound', message: `Claim "${req.params.ref}" not found` });
    }
    // Privacy boundary: if Reinsurer, ensure authorized
    if (req.user.role === 'Reinsurer') {
        const allocations = services_1.services.repository.getRecoverableAllocations(req.user.party, req.user.role);
        const hasAccess = allocations.some(a => a.claimRef === claim.claimRef);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Forbidden', message: 'You are not authorized to view this claim' });
        }
    }
    res.json({ claim });
});
// Submit claim (Cedant)
router.post('/', (0, auth_1.requireRoles)('Cedant'), async (req, res, next) => {
    try {
        const validated = domain_1.CreateClaimSchema.parse(req.body);
        // Business identity check: duplicate prevention
        const existing = services_1.services.repository.getClaim(validated.claimRef);
        if (existing) {
            return res.status(409).json({
                error: 'DuplicateClaimReference',
                message: `Claim with reference "${validated.claimRef}" is already registered.`
            });
        }
        const claim = {
            claimRef: validated.claimRef,
            policyRef: validated.policyRef,
            cedant: req.user.party,
            dateOfLoss: validated.dateOfLoss,
            occurrenceRef: validated.occurrenceRef,
            grossLoss: validated.grossLoss,
            currency: validated.grossLoss.currency,
            applicableTreaties: validated.applicableTreaties,
            status: 'Reported',
            evidenceRefs: validated.evidenceRefs,
            lossDescription: validated.lossDescription,
            claimantOpaqueId: validated.claimantOpaqueId,
            reportedAt: new Date().toISOString()
        };
        // Attempt ledger creation
        let contractId;
        const ledgerStatus = await services_1.services.ledgerClient.checkConnectivity();
        if (ledgerStatus.connected) {
            try {
                const result = await services_1.services.ledgerClient.createContract(ledger_client_1.TEMPLATES.ClaimCase, claim, req.user.party, { commandId: `CLAIM-CREATE-${claim.claimRef}` });
                contractId = result.contractId;
            }
            catch (err) {
                console.warn(`[WARN] Ledger create failed: ${err.message}`);
            }
        }
        claim.contractId = contractId;
        services_1.services.repository.saveClaim(claim);
        // If attached to an occurrence, update occurrence association
        if (claim.occurrenceRef) {
            const occurrences = services_1.services.repository.getOccurrences();
            const occ = occurrences.find(o => o.occurrenceRef === claim.occurrenceRef);
            if (occ) {
                if (!occ.claimRefs.includes(claim.claimRef)) {
                    occ.claimRefs.push(claim.claimRef);
                    services_1.services.repository.saveOccurrence(occ);
                }
            }
        }
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'CLAIM_SUBMITTED',
            claimRef: claim.claimRef,
            contractId,
            details: { claimRef: claim.claimRef, grossLoss: claim.grossLoss, currency: claim.currency }
        });
        res.status(201).json({ claim, contractId, ledgerSynchronized: Boolean(contractId) });
    }
    catch (err) {
        next(err);
    }
});
// Update claim status (e.g. UnderAssessment, Assessed)
router.post('/:ref/status', (0, auth_1.requireRoles)('Cedant', 'Adjuster', 'Operations'), async (req, res, next) => {
    try {
        const claim = services_1.services.repository.getClaim(req.params.ref);
        if (!claim)
            return res.status(404).json({ error: 'NotFound', message: 'Claim not found' });
        const newStatus = req.body?.status;
        if (!newStatus)
            return res.status(400).json({ error: 'BadRequest', message: 'New status required' });
        claim.status = newStatus;
        services_1.services.repository.saveClaim(claim);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'CLAIM_STATUS_UPDATED',
            claimRef: claim.claimRef,
            details: { previousStatus: claim.status, newStatus }
        });
        res.json({ claim });
    }
    catch (err) {
        next(err);
    }
});
// Close claim
router.post('/:ref/close', (0, auth_1.requireRoles)('Cedant', 'Operations'), async (req, res, next) => {
    try {
        const claim = services_1.services.repository.getClaim(req.params.ref);
        if (!claim)
            return res.status(404).json({ error: 'NotFound', message: 'Claim not found' });
        claim.status = 'Closed';
        claim.closedAt = new Date().toISOString();
        services_1.services.repository.saveClaim(claim);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'CLAIM_CLOSED',
            claimRef: claim.claimRef,
            details: { claimRef: claim.claimRef }
        });
        res.json({ claim });
    }
    catch (err) {
        next(err);
    }
});
// Reopen claim
router.post('/:ref/reopen', (0, auth_1.requireRoles)('Cedant'), async (req, res, next) => {
    try {
        const claim = services_1.services.repository.getClaim(req.params.ref);
        if (!claim)
            return res.status(404).json({ error: 'NotFound', message: 'Claim not found' });
        const reason = req.body?.reason || 'Revised loss information received';
        claim.status = 'Reopened';
        claim.reopenReason = reason;
        services_1.services.repository.saveClaim(claim);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'CLAIM_REOPENED',
            claimRef: claim.claimRef,
            details: { reason }
        });
        res.json({ claim });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=claims.js.map