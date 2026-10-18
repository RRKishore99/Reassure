"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const ledger_client_1 = require("@resure-nexus/ledger-client");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// List treaties
router.get('/', (_req, res) => {
    const treaties = services_1.services.repository.getTreaties();
    const participations = services_1.services.repository.getParticipations();
    res.json({
        treaties,
        participations
    });
});
// Get treaty by reference
router.get('/:ref', (req, res) => {
    const treaty = services_1.services.repository.getTreaty(req.params.ref);
    if (!treaty) {
        return res.status(404).json({ error: 'NotFound', message: `Treaty "${req.params.ref}" not found` });
    }
    const participations = services_1.services.repository.getParticipations(req.params.ref);
    res.json({ treaty, participations });
});
// Create draft treaty (Cedant or Broker)
router.post('/', (0, auth_1.requireRoles)('Cedant', 'Broker', 'Operations'), async (req, res, next) => {
    try {
        const validated = domain_1.CreateTreatySchema.parse(req.body);
        const treaty = {
            treatyRef: validated.treatyRef,
            version: 1,
            cedant: 'Cedant',
            broker: 'Broker',
            treatyType: validated.treatyType,
            inceptionDate: validated.inceptionDate,
            expirationDate: validated.expirationDate,
            coveredBusiness: validated.coveredBusiness,
            lossBasis: validated.lossBasis,
            currency: validated.currency,
            quotaShareTerms: validated.quotaShareTerms,
            excessOfLossTerms: validated.excessOfLossTerms,
            status: 'Draft',
            participatingReinsurers: validated.participatingReinsurers,
            evidenceRefs: validated.evidenceRefs,
            createdAt: new Date().toISOString()
        };
        // Attempt ledger creation if connected
        let contractId;
        const ledgerStatus = await services_1.services.ledgerClient.checkConnectivity();
        if (ledgerStatus.connected) {
            try {
                const result = await services_1.services.ledgerClient.createContract(ledger_client_1.TEMPLATES.TreatyVersion, treaty, req.user.party, { commandId: `TREATY-CREATE-${treaty.treatyRef}` });
                contractId = result.contractId;
            }
            catch (err) {
                console.warn(`[WARN] Ledger command failed, recording locally: ${err.message}`);
            }
        }
        treaty.contractId = contractId;
        services_1.services.repository.saveTreaty(treaty);
        // Save individual participations
        for (const p of validated.participatingReinsurers) {
            const participation = {
                treatyRef: treaty.treatyRef,
                treatyVersion: 1,
                cedant: treaty.cedant,
                reinsurer: p.reinsurer,
                broker: treaty.broker,
                linePercentage: p.linePercentage,
                status: 'Proposed'
            };
            services_1.services.repository.saveParticipation(participation);
        }
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'TREATY_DRAFT_CREATED',
            treatyRef: treaty.treatyRef,
            contractId,
            details: { treatyRef: treaty.treatyRef, treatyType: treaty.treatyType, currency: treaty.currency }
        });
        res.status(201).json({
            treaty,
            contractId,
            ledgerSynchronized: Boolean(contractId)
        });
    }
    catch (err) {
        next(err);
    }
});
// Propose treaty to market (Cedant or Broker)
router.post('/:ref/propose', (0, auth_1.requireRoles)('Cedant', 'Broker'), async (req, res, next) => {
    try {
        const treaty = services_1.services.repository.getTreaty(req.params.ref);
        if (!treaty)
            return res.status(404).json({ error: 'NotFound', message: 'Treaty not found' });
        treaty.status = 'PendingApproval';
        services_1.services.repository.saveTreaty(treaty);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'TREATY_PROPOSED_TO_MARKET',
            treatyRef: treaty.treatyRef,
            details: { treatyRef: treaty.treatyRef }
        });
        res.json({ treaty, status: 'PendingApproval' });
    }
    catch (err) {
        next(err);
    }
});
// Reinsurer accepts participation line
router.post('/:ref/participations/:party/accept', (0, auth_1.requireRoles)('Reinsurer'), async (req, res, next) => {
    try {
        const treatyRef = req.params.ref;
        const reinsurerParty = req.params.party;
        // Strict authorization: Reinsurer can ONLY accept for itself!
        if (req.user.party !== reinsurerParty) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Authenticated party "${req.user.party}" cannot accept participation for party "${reinsurerParty}"`
            });
        }
        const participations = services_1.services.repository.getParticipations(treatyRef);
        const p = participations.find(item => item.reinsurer === reinsurerParty);
        if (!p) {
            return res.status(404).json({ error: 'NotFound', message: `Participation for ${reinsurerParty} not found` });
        }
        p.status = 'Accepted';
        p.agreedAt = new Date().toISOString();
        services_1.services.repository.saveParticipation(p);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'PARTICIPATION_ACCEPTED',
            treatyRef,
            details: { reinsurer: reinsurerParty, linePercentage: p.linePercentage }
        });
        res.json({ participation: p });
    }
    catch (err) {
        next(err);
    }
});
// Cedant approves treaty into Active status
router.post('/:ref/approve', (0, auth_1.requireRoles)('Cedant'), async (req, res, next) => {
    try {
        const treaty = services_1.services.repository.getTreaty(req.params.ref);
        if (!treaty)
            return res.status(404).json({ error: 'NotFound', message: 'Treaty not found' });
        // Validate that participating lines are accepted
        const participations = services_1.services.repository.getParticipations(treaty.treatyRef);
        const allAccepted = participations.length > 0 && participations.every(p => p.status === 'Accepted');
        if (!allAccepted) {
            return res.status(400).json({
                error: 'PreconditionFailed',
                message: 'Cannot approve treaty: Not all reinsurers have accepted their participation lines.'
            });
        }
        treaty.status = 'Active';
        services_1.services.repository.saveTreaty(treaty);
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'TREATY_ACTIVATED',
            treatyRef: treaty.treatyRef,
            details: { treatyRef: treaty.treatyRef }
        });
        res.json({ treaty, status: 'Active' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=treaties.js.map