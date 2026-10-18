"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const ledger_client_1 = require("@resure-nexus/ledger-client");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// List assessments
router.get('/', (req, res) => {
    const claimRef = req.query.claimRef;
    const assessments = services_1.services.repository.getAssessments(claimRef);
    res.json({ assessments });
});
// Submit assessment (Adjuster)
router.post('/', (0, auth_1.requireRoles)('Adjuster', 'Operations'), async (req, res, next) => {
    try {
        const validated = domain_1.SubmitAssessmentSchema.parse(req.body);
        const assessment = {
            assessmentRef: validated.assessmentRef,
            claimRef: validated.claimRef,
            adjuster: req.user.party,
            cedant: 'Cedant',
            version: 1,
            assessedLoss: validated.assessedLoss,
            deductibleApplied: validated.deductibleApplied,
            eligibleLoss: validated.eligibleLoss,
            status: 'Submitted',
            methodology: validated.methodology,
            evidenceRefs: validated.evidenceRefs,
            notes: validated.notes,
            submittedAt: new Date().toISOString()
        };
        let contractId;
        const ledgerStatus = await services_1.services.ledgerClient.checkConnectivity();
        if (ledgerStatus.connected) {
            try {
                const result = await services_1.services.ledgerClient.createContract(ledger_client_1.TEMPLATES.LossAssessment, assessment, req.user.party, { commandId: `ASSESS-CREATE-${assessment.assessmentRef}` });
                contractId = result.contractId;
            }
            catch (err) {
                console.warn(`[WARN] Ledger create failed: ${err.message}`);
            }
        }
        assessment.contractId = contractId;
        services_1.services.repository.saveAssessment(assessment);
        // Update claim status to UnderAssessment if not already
        const claim = services_1.services.repository.getClaim(assessment.claimRef);
        if (claim && claim.status === 'Reported') {
            claim.status = 'UnderAssessment';
            services_1.services.repository.saveClaim(claim);
        }
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'ASSESSMENT_SUBMITTED',
            claimRef: assessment.claimRef,
            contractId,
            details: { assessmentRef: assessment.assessmentRef, eligibleLoss: assessment.eligibleLoss }
        });
        res.status(201).json({ assessment, contractId });
    }
    catch (err) {
        next(err);
    }
});
// Approve assessment (Cedant)
router.post('/:ref/approve', (0, auth_1.requireRoles)('Cedant'), async (req, res, next) => {
    try {
        const assessments = services_1.services.repository.getAssessments();
        const assessment = assessments.find(a => a.assessmentRef === req.params.ref);
        if (!assessment)
            return res.status(404).json({ error: 'NotFound', message: 'Assessment not found' });
        assessment.status = 'Approved';
        assessment.approvedAt = new Date().toISOString();
        services_1.services.repository.saveAssessment(assessment);
        // Update claim status to Assessed
        const claim = services_1.services.repository.getClaim(assessment.claimRef);
        if (claim) {
            claim.status = 'Assessed';
            services_1.services.repository.saveClaim(claim);
        }
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'ASSESSMENT_APPROVED',
            claimRef: assessment.claimRef,
            details: { assessmentRef: assessment.assessmentRef }
        });
        res.json({ assessment, claimStatus: 'Assessed' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=assessments.js.map