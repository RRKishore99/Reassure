/**
 * ReSure Nexus — Shared Domain Types
 * Precise type definitions matching the Daml smart contract model.
 * Monies are handled as numeric strings to guarantee exact fixed-point precision.
 */
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF';
export interface MonetaryAmount {
    amount: string;
    currency: Currency;
}
export type TreatyType = 'QuotaShare' | 'ExcessOfLoss';
export type LossBasis = 'RiskAttaching' | 'LossOccurring' | 'ClaimsMade';
export type TreatyStatus = 'Draft' | 'PendingApproval' | 'Active' | 'Superseded' | 'Terminated';
export type ParticipationStatus = 'Proposed' | 'Accepted' | 'Rejected' | 'Amended';
export type ClaimStatus = 'Reported' | 'UnderAssessment' | 'Assessed' | 'Allocating' | 'Allocated' | 'Disputed' | 'Settling' | 'Settled' | 'Closed' | 'Reopened';
export type AssessmentStatus = 'Draft' | 'Submitted' | 'Approved' | 'Disputed' | 'Superseded';
export type AllocationStatus = 'Draft' | 'Proposed' | 'Accepted' | 'Disputed' | 'Adjusted' | 'Finalized';
export type ReinsurerDecisionType = 'Accept' | 'Dispute' | 'RequestInformation';
export type DisputeStatus = 'Raised' | 'UnderReview' | 'Resolved';
export type SettlementStatus = 'Pending' | 'Confirmed' | 'PartialSettled' | 'Settled';
export type DocumentType = 'PolicySchedule' | 'ClaimNotification' | 'AdjusterReport' | 'TreatySlip' | 'ProofOfLoss' | 'SalvageSubrogationReceipt' | 'PaymentReceipt';
export type Role = 'Cedant' | 'Reinsurer' | 'Broker' | 'Adjuster' | 'Operations' | 'Audit';
export interface PartyMapping {
    role: Role;
    party: string;
    displayName: string;
    organization: string;
}
export interface EvidenceRef {
    documentId: string;
    documentType: DocumentType;
    contentHash: string;
    version: number;
    uploadedAt: string;
    uploadedBy: string;
}
export interface QuotaShareTerms {
    cededPercentage: string;
    contractualCap?: MonetaryAmount;
}
export interface ExcessOfLossTerms {
    attachmentPoint: MonetaryAmount;
    layerLimit: MonetaryAmount;
    layerNumber: number;
    aggregateLimit?: MonetaryAmount;
}
export interface TreatyParticipationShare {
    reinsurer: string;
    linePercentage: string;
    participationRef: string;
}
export interface TreatyVersion {
    contractId?: string;
    treatyRef: string;
    version: number;
    cedant: string;
    broker: string;
    treatyType: TreatyType;
    inceptionDate: string;
    expirationDate: string;
    coveredBusiness: string;
    lossBasis: LossBasis;
    currency: Currency;
    quotaShareTerms?: QuotaShareTerms;
    excessOfLossTerms?: ExcessOfLossTerms;
    status: TreatyStatus;
    participatingReinsurers: TreatyParticipationShare[];
    evidenceRefs: EvidenceRef[];
    amendmentReason?: string;
    createdAt: string;
    supersededAt?: string;
}
export interface TreatyParticipation {
    contractId?: string;
    treatyRef: string;
    treatyVersion: number;
    cedant: string;
    reinsurer: string;
    broker: string;
    linePercentage: string;
    layerNumber?: number;
    status: ParticipationStatus;
    agreedAt?: string;
    rejectionReason?: string;
}
export interface ClaimCase {
    contractId?: string;
    claimRef: string;
    policyRef: string;
    cedant: string;
    dateOfLoss: string;
    occurrenceRef?: string;
    grossLoss: MonetaryAmount;
    currency: Currency;
    applicableTreaties: string[];
    status: ClaimStatus;
    evidenceRefs: EvidenceRef[];
    lossDescription: string;
    claimantOpaqueId: string;
    reportedAt: string;
    closedAt?: string;
    reopenReason?: string;
}
export interface LossOccurrence {
    contractId?: string;
    occurrenceRef: string;
    cedant: string;
    title: string;
    commencementDate: string;
    expirationDate: string;
    claimRefs: string[];
    isFrozen: boolean;
    frozenAt?: string;
    isClosed: boolean;
    notes: string;
}
export interface LossAssessment {
    contractId?: string;
    assessmentRef: string;
    claimRef: string;
    adjuster: string;
    cedant: string;
    version: number;
    assessedLoss: MonetaryAmount;
    deductibleApplied: MonetaryAmount;
    eligibleLoss: MonetaryAmount;
    status: AssessmentStatus;
    methodology: string;
    evidenceRefs: EvidenceRef[];
    notes: string;
    submittedAt?: string;
    approvedAt?: string;
}
export interface RecoverableAllocation {
    contractId?: string;
    allocationRef: string;
    cycleRef: string;
    claimRef: string;
    treatyRef: string;
    treatyVersion: number;
    reinsurer: string;
    cedant: string;
    allocatedAmount: MonetaryAmount;
    linePercentage: string;
    status: AllocationStatus;
    calculationBreakdown: string;
}
export interface AllocationCycle {
    contractId?: string;
    cycleRef: string;
    treatyRef: string;
    treatyVersion: number;
    claimRefs: string[];
    occurrenceRef?: string;
    treatyType: TreatyType;
    eligibleSubjectLoss: MonetaryAmount;
    totalGrossRecovery: MonetaryAmount;
    totalAllocated: MonetaryAmount;
    unplacedRecovery: MonetaryAmount;
    status: AllocationStatus;
    calculationMethodology: string;
    calculatedAt: string;
    finalizedAt?: string;
}
export interface ReinsurerDecision {
    contractId?: string;
    decisionRef: string;
    allocationRef: string;
    reinsurer: string;
    cedant: string;
    decisionType: ReinsurerDecisionType;
    reason: string;
    evidenceRefs: EvidenceRef[];
    timestamp: string;
}
export interface DisputeCase {
    contractId?: string;
    disputeRef: string;
    allocationRef: string;
    reinsurer: string;
    cedant: string;
    disputedAmount: MonetaryAmount;
    reason: string;
    evidenceRefs: EvidenceRef[];
    status: DisputeStatus;
    raisedAt: string;
    resolvedAt?: string;
    resolutionSummary?: string;
}
export interface RecoveryAdjustment {
    contractId?: string;
    adjustmentRef: string;
    originalCycleRef: string;
    claimRef: string;
    adjustmentType: 'Salvage' | 'Subrogation' | 'RevisedLoss' | 'ThirdPartyRecovery';
    adjustmentAmount: MonetaryAmount;
    priorRecovery: MonetaryAmount;
    revisedRecovery: MonetaryAmount;
    effectiveDate: string;
    evidenceRefs: EvidenceRef[];
    approvedBy: string;
}
export interface RecoverableSettlement {
    contractId?: string;
    settlementRef: string;
    allocationRef: string;
    reinsurer: string;
    cedant: string;
    amountDue: MonetaryAmount;
    amountSettled: MonetaryAmount;
    outstandingBalance: MonetaryAmount;
    dueDate: string;
    status: SettlementStatus;
    permitPartial: boolean;
}
export interface SettlementReconciliation {
    contractId?: string;
    reconciliationRef: string;
    settlementRef: string;
    confirmedAmount: MonetaryAmount;
    reconciliationSource: string;
    confirmedBy: string;
    confirmationTime: string;
    paymentEvidence: EvidenceRef;
    remainingOutstanding: MonetaryAmount;
}
export interface AuditTrailEvent {
    eventId: string;
    timestamp: string;
    party: string;
    role: Role;
    action: string;
    contractId?: string;
    updateId?: string;
    claimRef?: string;
    treatyRef?: string;
    allocationRef?: string;
    details: Record<string, unknown>;
}
//# sourceMappingURL=types.d.ts.map