/**
 * Projection Repository
 * CRUD and query functions for all domain projections.
 */
import { ProjectionDatabase } from './db';
import { TreatyVersion, TreatyParticipation, ClaimCase, LossOccurrence, LossAssessment, AllocationCycle, RecoverableAllocation, ReinsurerDecision, DisputeCase, RecoveryAdjustment, RecoverableSettlement, SettlementReconciliation, AuditTrailEvent, Role } from '@resure-nexus/domain';
export declare class ProjectionRepository {
    private readonly db;
    constructor(db: ProjectionDatabase);
    private get raw();
    recordIdempotency(key: string, result: any): void;
    getIdempotency(key: string): any | null;
    recordAuditEvent(event: AuditTrailEvent): void;
    getAuditEvents(limit?: number): AuditTrailEvent[];
    saveTreaty(treaty: TreatyVersion): void;
    getTreaties(): TreatyVersion[];
    getTreaty(treatyRef: string, version?: number): TreatyVersion | null;
    saveParticipation(p: TreatyParticipation): void;
    getParticipations(treatyRef?: string): TreatyParticipation[];
    saveClaim(claim: ClaimCase): void;
    getClaims(filterParty?: string, role?: Role): ClaimCase[];
    getClaim(claimRef: string): ClaimCase | null;
    saveOccurrence(occ: LossOccurrence): void;
    getOccurrences(): LossOccurrence[];
    saveAssessment(a: LossAssessment): void;
    getAssessments(claimRef?: string): LossAssessment[];
    saveAllocationCycle(c: AllocationCycle): void;
    getAllocationCycles(): AllocationCycle[];
    saveRecoverableAllocation(a: RecoverableAllocation): void;
    getRecoverableAllocations(filterParty?: string, role?: Role): RecoverableAllocation[];
    saveReinsurerDecision(d: ReinsurerDecision): void;
    getReinsurerDecisions(allocationRef?: string): ReinsurerDecision[];
    saveDispute(d: DisputeCase): void;
    getDisputes(filterParty?: string, role?: Role): DisputeCase[];
    saveRecoveryAdjustment(adj: RecoveryAdjustment): void;
    getRecoveryAdjustments(): RecoveryAdjustment[];
    saveSettlement(s: RecoverableSettlement): void;
    getSettlements(filterParty?: string, role?: Role): RecoverableSettlement[];
    saveSettlementReconciliation(r: SettlementReconciliation): void;
    getSettlementReconciliations(settlementRef?: string): SettlementReconciliation[];
    getDashboardMetrics(party?: string, role?: Role): {
        claimsAwaitingAssessment: number;
        claimsAwaitingReinsurerResponse: number;
        outstandingRecoverables: string;
        disputedRecoverables: string;
        acceptedUnsettledRecoverables: string;
        overdueSettlementItems: number;
        recentLedgerEvents: number;
        currency: string;
    };
}
//# sourceMappingURL=repository.d.ts.map