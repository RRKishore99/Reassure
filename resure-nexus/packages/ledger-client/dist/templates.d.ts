/**
 * Canonical Template IDs for ReSure Nexus
 */
export declare const TEMPLATES: {
    readonly TreatyVersion: "resure-nexus:ReSure.Treaty.TreatyVersion:TreatyVersion";
    readonly TreatyParticipation: "resure-nexus:ReSure.Treaty.TreatyParticipation:TreatyParticipation";
    readonly ClaimCase: "resure-nexus:ReSure.Claim.ClaimCase:ClaimCase";
    readonly LossOccurrence: "resure-nexus:ReSure.Claim.ClaimCase:LossOccurrence";
    readonly ClaimEvidenceManifest: "resure-nexus:ReSure.Claim.ClaimCase:ClaimEvidenceManifest";
    readonly LossAssessment: "resure-nexus:ReSure.Assessment.LossAssessment:LossAssessment";
    readonly AllocationCycle: "resure-nexus:ReSure.Allocation.AllocationCycle:AllocationCycle";
    readonly RecoverableAllocation: "resure-nexus:ReSure.Allocation.AllocationCycle:RecoverableAllocation";
    readonly ReinsurerDecision: "resure-nexus:ReSure.Allocation.AllocationCycle:ReinsurerDecision";
    readonly DisputeCase: "resure-nexus:ReSure.Allocation.Disputes:DisputeCase";
    readonly RecoveryAdjustment: "resure-nexus:ReSure.Allocation.Disputes:RecoveryAdjustment";
    readonly RecoverableSettlement: "resure-nexus:ReSure.Settlement.Settlement:RecoverableSettlement";
    readonly SettlementReconciliation: "resure-nexus:ReSure.Settlement.Settlement:SettlementReconciliation";
    readonly ClaimRegistry: "resure-nexus:ReSure.Registry.UniqueRegistry:ClaimRegistry";
    readonly AllocationRegistry: "resure-nexus:ReSure.Registry.UniqueRegistry:AllocationRegistry";
};
export type TemplateName = keyof typeof TEMPLATES;
//# sourceMappingURL=templates.d.ts.map