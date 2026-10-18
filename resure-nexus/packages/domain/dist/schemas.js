"use strict";
/**
 * ReSure Nexus — Zod Validation Schemas
 * Strict input validation for all API endpoints.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementConfirmationSchema = exports.RecoveryAdjustmentSchema = exports.ResolveDisputeSchema = exports.ReinsurerDecisionSchema = exports.ProposeAllocationSchema = exports.SubmitAssessmentSchema = exports.CreateOccurrenceSchema = exports.CreateClaimSchema = exports.CreateTreatySchema = exports.TreatyParticipationInputSchema = exports.ExcessOfLossTermsSchema = exports.QuotaShareTermsSchema = exports.EvidenceRefSchema = exports.MonetaryAmountSchema = exports.CurrencySchema = void 0;
const zod_1 = require("zod");
exports.CurrencySchema = zod_1.z.enum(['USD', 'EUR', 'GBP', 'CHF']);
exports.MonetaryAmountSchema = zod_1.z.object({
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a non-negative decimal string with up to 2 decimal places'),
    currency: exports.CurrencySchema
});
exports.EvidenceRefSchema = zod_1.z.object({
    documentId: zod_1.z.string().min(1),
    documentType: zod_1.z.enum([
        'PolicySchedule',
        'ClaimNotification',
        'AdjusterReport',
        'TreatySlip',
        'ProofOfLoss',
        'SalvageSubrogationReceipt',
        'PaymentReceipt'
    ]),
    contentHash: zod_1.z.string().regex(/^[a-f0-9]{64}$/i, 'Content hash must be a valid 64-character SHA-256 hex string'),
    version: zod_1.z.number().int().positive(),
    uploadedAt: zod_1.z.string().datetime(),
    uploadedBy: zod_1.z.string().min(1)
});
exports.QuotaShareTermsSchema = zod_1.z.object({
    cededPercentage: zod_1.z.string().regex(/^0(\.\d+)?$|^1(\.0+)?$/, 'Ceded percentage must be between 0 and 1'),
    contractualCap: exports.MonetaryAmountSchema.optional()
});
exports.ExcessOfLossTermsSchema = zod_1.z.object({
    attachmentPoint: exports.MonetaryAmountSchema,
    layerLimit: exports.MonetaryAmountSchema,
    layerNumber: zod_1.z.number().int().positive(),
    aggregateLimit: exports.MonetaryAmountSchema.optional()
});
exports.TreatyParticipationInputSchema = zod_1.z.object({
    reinsurer: zod_1.z.string().min(1),
    linePercentage: zod_1.z.string().regex(/^0(\.\d+)?$|^1(\.0+)?$/, 'Line percentage must be between 0 and 1'),
    participationRef: zod_1.z.string().min(1)
});
exports.CreateTreatySchema = zod_1.z.object({
    treatyRef: zod_1.z.string().min(1, 'Treaty reference is required'),
    treatyType: zod_1.z.enum(['QuotaShare', 'ExcessOfLoss']),
    inceptionDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    expirationDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    coveredBusiness: zod_1.z.string().min(1),
    lossBasis: zod_1.z.enum(['RiskAttaching', 'LossOccurring', 'ClaimsMade']),
    currency: exports.CurrencySchema,
    quotaShareTerms: exports.QuotaShareTermsSchema.optional(),
    excessOfLossTerms: exports.ExcessOfLossTermsSchema.optional(),
    participatingReinsurers: zod_1.z.array(exports.TreatyParticipationInputSchema).min(1),
    evidenceRefs: zod_1.z.array(exports.EvidenceRefSchema).default([])
});
exports.CreateClaimSchema = zod_1.z.object({
    claimRef: zod_1.z.string().min(1, 'Claim reference is required'),
    policyRef: zod_1.z.string().min(1, 'Policy reference is required'),
    dateOfLoss: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    occurrenceRef: zod_1.z.string().optional(),
    grossLoss: exports.MonetaryAmountSchema,
    applicableTreaties: zod_1.z.array(zod_1.z.string()).min(1, 'At least one treaty reference is required'),
    lossDescription: zod_1.z.string().min(1),
    claimantOpaqueId: zod_1.z.string().min(1),
    evidenceRefs: zod_1.z.array(exports.EvidenceRefSchema).min(1, 'At least one evidence manifest is required for claims intake')
});
exports.CreateOccurrenceSchema = zod_1.z.object({
    occurrenceRef: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    commencementDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    expirationDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    initialClaimRefs: zod_1.z.array(zod_1.z.string()).default([]),
    notes: zod_1.z.string().default('')
});
exports.SubmitAssessmentSchema = zod_1.z.object({
    assessmentRef: zod_1.z.string().min(1),
    claimRef: zod_1.z.string().min(1),
    assessedLoss: exports.MonetaryAmountSchema,
    deductibleApplied: exports.MonetaryAmountSchema,
    eligibleLoss: exports.MonetaryAmountSchema,
    methodology: zod_1.z.string().min(1, 'Assessment methodology must be documented'),
    notes: zod_1.z.string().default(''),
    evidenceRefs: zod_1.z.array(exports.EvidenceRefSchema).min(1, 'Adjuster evidence is required')
});
exports.ProposeAllocationSchema = zod_1.z.object({
    cycleRef: zod_1.z.string().min(1),
    treatyRef: zod_1.z.string().min(1),
    treatyVersion: zod_1.z.number().int().positive(),
    claimRefs: zod_1.z.array(zod_1.z.string()).min(1),
    occurrenceRef: zod_1.z.string().optional(),
    calculationMethodology: zod_1.z.string().min(1)
});
exports.ReinsurerDecisionSchema = zod_1.z.object({
    decisionRef: zod_1.z.string().min(1),
    allocationRef: zod_1.z.string().min(1),
    decisionType: zod_1.z.enum(['Accept', 'Dispute', 'RequestInformation']),
    reason: zod_1.z.string().min(1, 'Reason must be provided'),
    evidenceRefs: zod_1.z.array(exports.EvidenceRefSchema).default([])
});
exports.ResolveDisputeSchema = zod_1.z.object({
    disputeRef: zod_1.z.string().min(1),
    resolutionSummary: zod_1.z.string().min(1),
    adjustedAmount: exports.MonetaryAmountSchema.optional()
});
exports.RecoveryAdjustmentSchema = zod_1.z.object({
    adjustmentRef: zod_1.z.string().min(1),
    originalCycleRef: zod_1.z.string().min(1),
    claimRef: zod_1.z.string().min(1),
    adjustmentType: zod_1.z.enum(['Salvage', 'Subrogation', 'RevisedLoss', 'ThirdPartyRecovery']),
    adjustmentAmount: exports.MonetaryAmountSchema,
    effectiveDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    evidenceRefs: zod_1.z.array(exports.EvidenceRefSchema).min(1, 'Supporting evidence required for adjustment')
});
exports.SettlementConfirmationSchema = zod_1.z.object({
    reconciliationRef: zod_1.z.string().min(1),
    settlementRef: zod_1.z.string().min(1),
    confirmedAmount: exports.MonetaryAmountSchema,
    reconciliationSource: zod_1.z.string().min(1, 'Reconciliation source identifier required'),
    paymentEvidence: exports.EvidenceRefSchema
});
//# sourceMappingURL=schemas.js.map