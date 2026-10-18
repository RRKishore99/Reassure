"use strict";
/**
 * ReSure Nexus — Projection Reconciler Service
 *
 * Implements Section 41 & 42:
 * "The application must be able to reconcile its projections from actual ledger updates after a restart or processing failure."
 * "Reconciliation of API responses, ledger updates and database projections."
 * "Safe to replay."
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionReconciler = void 0;
const ledger_client_1 = require("@resure-nexus/ledger-client");
class ProjectionReconciler {
    ledgerClient;
    repository;
    constructor(ledgerClient, repository) {
        this.ledgerClient = ledgerClient;
        this.repository = repository;
    }
    /**
     * Reconciles all projections by querying active contracts on the authoritative Canton ledger.
     * Can be re-run safely at any time (idempotent replay).
     */
    async reconcileAll() {
        const connectivity = await this.ledgerClient.checkConnectivity();
        if (!connectivity.connected) {
            return {
                success: false,
                syncedTemplates: {},
                error: `Cannot reconcile projections: Canton Ledger API is not reachable at ${connectivity.endpoint} (${connectivity.error})`
            };
        }
        const synced = {};
        try {
            // 1. Reconcile Treaties
            const treaties = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.TreatyVersion], 'Operations');
            for (const t of treaties) {
                this.repository.saveTreaty({
                    contractId: t.contractId,
                    treatyRef: t.payload.treatyRef,
                    version: Number(t.payload.version) || 1,
                    cedant: t.payload.cedant,
                    broker: t.payload.broker,
                    treatyType: t.payload.treatyType,
                    inceptionDate: t.payload.inceptionDate,
                    expirationDate: t.payload.expirationDate,
                    coveredBusiness: t.payload.coveredBusiness,
                    lossBasis: t.payload.lossBasis,
                    currency: t.payload.currency,
                    quotaShareTerms: t.payload.quotaShareTerms,
                    excessOfLossTerms: t.payload.excessOfLossTerms,
                    status: t.payload.status,
                    participatingReinsurers: t.payload.participatingReinsurers || [],
                    evidenceRefs: t.payload.evidenceRefs || [],
                    createdAt: new Date().toISOString()
                });
            }
            synced['TreatyVersion'] = treaties.length;
            // 2. Reconcile Participations
            const participations = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.TreatyParticipation], 'Operations');
            for (const p of participations) {
                this.repository.saveParticipation({
                    contractId: p.contractId,
                    treatyRef: p.payload.treatyRef,
                    treatyVersion: Number(p.payload.treatyVersion) || 1,
                    cedant: p.payload.cedant,
                    reinsurer: p.payload.reinsurer,
                    broker: p.payload.broker,
                    linePercentage: p.payload.linePercentage,
                    status: p.payload.status
                });
            }
            synced['TreatyParticipation'] = participations.length;
            // 3. Reconcile Claims
            const claims = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.ClaimCase], 'Operations');
            for (const c of claims) {
                this.repository.saveClaim({
                    contractId: c.contractId,
                    claimRef: c.payload.claimRef,
                    policyRef: c.payload.policyRef,
                    cedant: c.payload.cedant,
                    dateOfLoss: c.payload.dateOfLoss,
                    occurrenceRef: c.payload.occurrenceRef || undefined,
                    grossLoss: c.payload.grossLoss,
                    currency: c.payload.currency,
                    applicableTreaties: c.payload.applicableTreaties || [],
                    status: c.payload.status,
                    evidenceRefs: c.payload.evidenceRefs || [],
                    lossDescription: c.payload.lossDescription || '',
                    claimantOpaqueId: c.payload.claimantOpaqueId || '',
                    reportedAt: c.payload.reportedAt || new Date().toISOString()
                });
            }
            synced['ClaimCase'] = claims.length;
            // 4. Reconcile Occurrences
            const occurrences = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.LossOccurrence], 'Operations');
            for (const o of occurrences) {
                this.repository.saveOccurrence({
                    contractId: o.contractId,
                    occurrenceRef: o.payload.occurrenceRef,
                    cedant: o.payload.cedant,
                    title: o.payload.title,
                    commencementDate: o.payload.commencementDate,
                    expirationDate: o.payload.expirationDate,
                    claimRefs: o.payload.claimRefs || [],
                    isFrozen: Boolean(o.payload.isFrozen),
                    isClosed: Boolean(o.payload.isClosed),
                    notes: o.payload.notes || ''
                });
            }
            synced['LossOccurrence'] = occurrences.length;
            // 5. Reconcile Assessments
            const assessments = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.LossAssessment], 'Operations');
            for (const a of assessments) {
                this.repository.saveAssessment({
                    contractId: a.contractId,
                    assessmentRef: a.payload.assessmentRef,
                    claimRef: a.payload.claimRef,
                    adjuster: a.payload.adjuster,
                    cedant: a.payload.cedant,
                    version: Number(a.payload.version) || 1,
                    assessedLoss: a.payload.assessedLoss,
                    deductibleApplied: a.payload.deductibleApplied,
                    eligibleLoss: a.payload.eligibleLoss,
                    status: a.payload.status,
                    methodology: a.payload.methodology,
                    evidenceRefs: a.payload.evidenceRefs || [],
                    notes: a.payload.notes || ''
                });
            }
            synced['LossAssessment'] = assessments.length;
            // 6. Reconcile Allocation Cycles & Recoverable Allocations
            const cycles = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.AllocationCycle], 'Operations');
            for (const cy of cycles) {
                this.repository.saveAllocationCycle({
                    contractId: cy.contractId,
                    cycleRef: cy.payload.cycleRef,
                    treatyRef: cy.payload.treatyRef,
                    treatyVersion: Number(cy.payload.treatyVersion) || 1,
                    claimRefs: cy.payload.claimRefs || [],
                    occurrenceRef: cy.payload.occurrenceRef || undefined,
                    treatyType: cy.payload.treatyType,
                    eligibleSubjectLoss: cy.payload.eligibleSubjectLoss,
                    totalGrossRecovery: cy.payload.totalGrossRecovery,
                    totalAllocated: cy.payload.totalAllocated,
                    unplacedRecovery: cy.payload.unplacedRecovery,
                    status: cy.payload.status,
                    calculationMethodology: cy.payload.calculationMethodology || '',
                    calculatedAt: new Date().toISOString()
                });
            }
            synced['AllocationCycle'] = cycles.length;
            const allocations = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.RecoverableAllocation], 'Operations');
            for (const al of allocations) {
                this.repository.saveRecoverableAllocation({
                    contractId: al.contractId,
                    allocationRef: al.payload.allocationRef,
                    cycleRef: al.payload.cycleRef,
                    claimRef: al.payload.claimRef,
                    treatyRef: al.payload.treatyRef,
                    treatyVersion: Number(al.payload.treatyVersion) || 1,
                    reinsurer: al.payload.reinsurer,
                    cedant: al.payload.cedant,
                    allocatedAmount: al.payload.allocatedAmount,
                    linePercentage: al.payload.linePercentage,
                    status: al.payload.status,
                    calculationBreakdown: al.payload.calculationBreakdown || ''
                });
            }
            synced['RecoverableAllocation'] = allocations.length;
            // 7. Reconcile Settlements
            const settlements = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.RecoverableSettlement], 'Operations');
            for (const s of settlements) {
                this.repository.saveSettlement({
                    contractId: s.contractId,
                    settlementRef: s.payload.settlementRef,
                    allocationRef: s.payload.allocationRef,
                    reinsurer: s.payload.reinsurer,
                    cedant: s.payload.cedant,
                    amountDue: s.payload.amountDue,
                    amountSettled: s.payload.amountSettled,
                    outstandingBalance: s.payload.outstandingBalance,
                    dueDate: s.payload.dueDate,
                    status: s.payload.status,
                    permitPartial: Boolean(s.payload.permitPartial)
                });
            }
            synced['RecoverableSettlement'] = settlements.length;
            // 8. Reconcile Disputes
            const disputes = await this.ledgerClient.queryContracts([ledger_client_1.TEMPLATES.DisputeCase], 'Operations');
            for (const d of disputes) {
                this.repository.saveDispute({
                    contractId: d.contractId,
                    disputeRef: d.payload.disputeRef,
                    allocationRef: d.payload.allocationRef,
                    reinsurer: d.payload.reinsurer,
                    cedant: d.payload.cedant,
                    disputedAmount: d.payload.disputedAmount,
                    reason: d.payload.reason,
                    evidenceRefs: d.payload.evidenceRefs || [],
                    status: d.payload.status,
                    raisedAt: new Date().toISOString(),
                    resolutionSummary: d.payload.resolutionSummary
                });
            }
            synced['DisputeCase'] = disputes.length;
            return {
                success: true,
                syncedTemplates: synced
            };
        }
        catch (err) {
            return {
                success: false,
                syncedTemplates: synced,
                error: err.message
            };
        }
    }
}
exports.ProjectionReconciler = ProjectionReconciler;
//# sourceMappingURL=reconciler.js.map