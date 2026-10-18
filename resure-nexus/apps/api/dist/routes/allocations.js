"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const domain_1 = require("@resure-nexus/domain");
const auth_1 = require("../middleware/auth");
const services_1 = require("../services");
const router = (0, express_1.Router)();
// Simulation endpoint: provides transparent calculation preview
router.post('/simulate', (req, res, next) => {
    try {
        const { treatyRef, claimRefs, occurrenceRef } = req.body;
        if (!treatyRef)
            return res.status(400).json({ error: 'BadRequest', message: 'treatyRef is required' });
        const treaty = services_1.services.repository.getTreaty(treatyRef);
        if (!treaty)
            return res.status(404).json({ error: 'NotFound', message: `Treaty "${treatyRef}" not found` });
        const participations = services_1.services.repository.getParticipations(treatyRef).filter(p => p.status === 'Accepted');
        if (participations.length === 0) {
            return res.status(400).json({
                error: 'PreconditionFailed',
                message: 'No accepted reinsurer participations found for this treaty.'
            });
        }
        const reinsurerLines = participations.map(p => ({
            reinsurer: p.reinsurer,
            linePercentage: p.linePercentage
        }));
        if (treaty.treatyType === 'QuotaShare') {
            if (!treaty.quotaShareTerms) {
                return res.status(400).json({ error: 'InvalidTreaty', message: 'Treaty is missing quota share terms' });
            }
            // Collect eligible loss from approved assessment
            if (!claimRefs || claimRefs.length === 0) {
                return res.status(400).json({ error: 'BadRequest', message: 'claimRefs array is required' });
            }
            const claimRef = claimRefs[0];
            const assessments = services_1.services.repository.getAssessments(claimRef).filter(a => a.status === 'Approved');
            if (assessments.length === 0) {
                return res.status(400).json({
                    error: 'PreconditionFailed',
                    message: `Claim "${claimRef}" has no approved loss assessment.`
                });
            }
            const eligibleLoss = assessments[0].eligibleLoss;
            const simulation = (0, domain_1.calculateQuotaShare)(eligibleLoss, treaty.quotaShareTerms.cededPercentage, reinsurerLines, treaty.quotaShareTerms.contractualCap);
            return res.json({ simulation });
        }
        else {
            // Excess of Loss (XoL)
            if (!treaty.excessOfLossTerms) {
                return res.status(400).json({ error: 'InvalidTreaty', message: 'Treaty is missing Excess of Loss terms' });
            }
            let targetClaimRefs = claimRefs || [];
            if (occurrenceRef) {
                const occurrences = services_1.services.repository.getOccurrences();
                const occ = occurrences.find(o => o.occurrenceRef === occurrenceRef);
                if (occ) {
                    targetClaimRefs = occ.claimRefs;
                }
            }
            if (targetClaimRefs.length === 0) {
                return res.status(400).json({ error: 'BadRequest', message: 'No eligible claims found for XoL occurrence calculation' });
            }
            const occurrenceClaimLosses = [];
            for (const cRef of targetClaimRefs) {
                const assessments = services_1.services.repository.getAssessments(cRef).filter(a => a.status === 'Approved');
                if (assessments.length > 0) {
                    occurrenceClaimLosses.push({
                        claimRef: cRef,
                        eligibleLoss: assessments[0].eligibleLoss
                    });
                }
            }
            if (occurrenceClaimLosses.length === 0) {
                return res.status(400).json({
                    error: 'PreconditionFailed',
                    message: 'None of the specified claims have approved loss assessments.'
                });
            }
            const simulation = (0, domain_1.calculateExcessOfLoss)(occurrenceClaimLosses, treaty.excessOfLossTerms.attachmentPoint, treaty.excessOfLossTerms.layerLimit, treaty.excessOfLossTerms.layerNumber, reinsurerLines);
            return res.json({ simulation });
        }
    }
    catch (err) {
        next(err);
    }
});
// Propose allocation cycle
router.post('/propose', (0, auth_1.requireRoles)('Operations', 'Cedant'), async (req, res, next) => {
    try {
        const validated = domain_1.ProposeAllocationSchema.parse(req.body);
        const treaty = services_1.services.repository.getTreaty(validated.treatyRef, validated.treatyVersion);
        if (!treaty) {
            return res.status(404).json({ error: 'NotFound', message: 'Specified treaty version not found' });
        }
        if (treaty.status !== 'Active') {
            return res.status(400).json({
                error: 'PreconditionFailed',
                message: `Cannot allocate against treaty with status "${treaty.status}". Treaty must be Active.`
            });
        }
        const participations = services_1.services.repository.getParticipations(treaty.treatyRef).filter(p => p.status === 'Accepted');
        if (participations.length === 0) {
            return res.status(400).json({ error: 'PreconditionFailed', message: 'No accepted reinsurer participations found' });
        }
        const reinsurerLines = participations.map(p => ({
            reinsurer: p.reinsurer,
            linePercentage: p.linePercentage
        }));
        let calculationResult;
        if (treaty.treatyType === 'QuotaShare') {
            const claimRef = validated.claimRefs[0];
            const assessments = services_1.services.repository.getAssessments(claimRef).filter(a => a.status === 'Approved');
            if (assessments.length === 0) {
                return res.status(400).json({ error: 'PreconditionFailed', message: `Claim "${claimRef}" has no approved assessment` });
            }
            calculationResult = (0, domain_1.calculateQuotaShare)(assessments[0].eligibleLoss, treaty.quotaShareTerms.cededPercentage, reinsurerLines, treaty.quotaShareTerms?.contractualCap);
        }
        else {
            // XoL
            const occurrenceClaimLosses = [];
            for (const cRef of validated.claimRefs) {
                const assessments = services_1.services.repository.getAssessments(cRef).filter(a => a.status === 'Approved');
                if (assessments.length > 0) {
                    occurrenceClaimLosses.push({ claimRef: cRef, eligibleLoss: assessments[0].eligibleLoss });
                }
            }
            calculationResult = (0, domain_1.calculateExcessOfLoss)(occurrenceClaimLosses, treaty.excessOfLossTerms.attachmentPoint, treaty.excessOfLossTerms.layerLimit, treaty.excessOfLossTerms.layerNumber, reinsurerLines);
        }
        // Save cycle
        const cycle = {
            cycleRef: validated.cycleRef,
            treatyRef: validated.treatyRef,
            treatyVersion: validated.treatyVersion,
            claimRefs: validated.claimRefs,
            occurrenceRef: validated.occurrenceRef,
            treatyType: treaty.treatyType,
            eligibleSubjectLoss: calculationResult.eligibleLoss || calculationResult.totalOccurrenceLoss,
            totalGrossRecovery: calculationResult.cappedCededAmount || calculationResult.grossLayerRecovery,
            totalAllocated: calculationResult.cappedCededAmount || calculationResult.grossLayerRecovery,
            unplacedRecovery: calculationResult.unplacedAmount,
            status: 'Proposed',
            calculationMethodology: validated.calculationMethodology,
            calculatedAt: new Date().toISOString()
        };
        services_1.services.repository.saveAllocationCycle(cycle);
        // Save bilateral RecoverableAllocations for each reinsurer
        const createdAllocations = [];
        for (let i = 0; i < calculationResult.reinsurerAllocations.length; i++) {
            const alloc = calculationResult.reinsurerAllocations[i];
            const allocationRef = `${cycle.cycleRef}-AL-${i + 1}`;
            const recAlloc = {
                allocationRef,
                cycleRef: cycle.cycleRef,
                claimRef: validated.claimRefs[0] || 'MULTI',
                treatyRef: treaty.treatyRef,
                treatyVersion: treaty.version,
                reinsurer: alloc.reinsurer,
                cedant: treaty.cedant,
                allocatedAmount: alloc.allocatedAmount,
                linePercentage: alloc.linePercentage,
                status: 'Proposed',
                calculationBreakdown: calculationResult.formula
            };
            services_1.services.repository.saveRecoverableAllocation(recAlloc);
            createdAllocations.push(recAlloc);
            services_1.services.repository.recordAuditEvent({
                eventId: `EVT-${Date.now()}-${i}`,
                timestamp: new Date().toISOString(),
                party: req.user.party,
                role: req.user.role,
                action: 'RECOVERABLE_ALLOCATED',
                allocationRef,
                treatyRef: treaty.treatyRef,
                details: { reinsurer: alloc.reinsurer, allocatedAmount: alloc.allocatedAmount }
            });
        }
        res.status(201).json({
            cycle,
            allocations: createdAllocations,
            calculation: calculationResult
        });
    }
    catch (err) {
        next(err);
    }
});
// List recoverable allocations (privacy-filtered: reinsurers see ONLY their own)
router.get('/', (req, res) => {
    const allocations = services_1.services.repository.getRecoverableAllocations(req.user.party, req.user.role);
    res.json({ allocations });
});
// List allocation cycles
router.get('/cycles', (_req, res) => {
    const cycles = services_1.services.repository.getAllocationCycles();
    res.json({ cycles });
});
// Finalize allocation cycle (creates settlements)
router.post('/cycles/:ref/finalize', (0, auth_1.requireRoles)('Operations', 'Cedant'), async (req, res, next) => {
    try {
        const cycleRef = req.params.ref;
        const cycles = services_1.services.repository.getAllocationCycles();
        const cycle = cycles.find(c => c.cycleRef === cycleRef);
        if (!cycle)
            return res.status(404).json({ error: 'NotFound', message: 'Cycle not found' });
        // Check that all allocations are accepted (none disputed or pending)
        const allocations = services_1.services.repository.getRecoverableAllocations();
        const cycleAllocations = allocations.filter(a => a.cycleRef === cycleRef);
        const hasDisputes = cycleAllocations.some(a => a.status === 'Disputed');
        if (hasDisputes) {
            return res.status(400).json({
                error: 'PreconditionFailed',
                message: 'Cannot finalize cycle: One or more allocations are in Dispute.'
            });
        }
        cycle.status = 'Finalized';
        cycle.finalizedAt = new Date().toISOString();
        services_1.services.repository.saveAllocationCycle(cycle);
        // Create settlements for accepted allocations
        const createdSettlements = [];
        for (const a of cycleAllocations) {
            a.status = 'Finalized';
            services_1.services.repository.saveRecoverableAllocation(a);
            const settlementRef = `SETTLE-${a.allocationRef}`;
            const dueDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]; // Net 30
            const settlement = {
                settlementRef,
                allocationRef: a.allocationRef,
                reinsurer: a.reinsurer,
                cedant: a.cedant,
                amountDue: a.allocatedAmount,
                amountSettled: { amount: '0.00', currency: a.allocatedAmount.currency },
                outstandingBalance: a.allocatedAmount,
                dueDate,
                status: 'Pending',
                permitPartial: true
            };
            services_1.services.repository.saveSettlement(settlement);
            createdSettlements.push(settlement);
        }
        services_1.services.repository.recordAuditEvent({
            eventId: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            party: req.user.party,
            role: req.user.role,
            action: 'CYCLE_FINALIZED_SETTLEMENTS_CREATED',
            details: { cycleRef, settlementCount: createdSettlements.length }
        });
        res.json({ cycle, settlements: createdSettlements });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=allocations.js.map