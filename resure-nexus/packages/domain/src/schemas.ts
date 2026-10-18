/**
 * ReSure Nexus — Zod Validation Schemas
 * Strict input validation for all API endpoints.
 */

import { z } from 'zod';

export const CurrencySchema = z.enum(['USD', 'EUR', 'GBP', 'CHF']);

export const MonetaryAmountSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a non-negative decimal string with up to 2 decimal places'),
  currency: CurrencySchema
});

export const EvidenceRefSchema = z.object({
  documentId: z.string().min(1),
  documentType: z.enum([
    'PolicySchedule',
    'ClaimNotification',
    'AdjusterReport',
    'TreatySlip',
    'ProofOfLoss',
    'SalvageSubrogationReceipt',
    'PaymentReceipt'
  ]),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/i, 'Content hash must be a valid 64-character SHA-256 hex string'),
  version: z.number().int().positive(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string().min(1)
});

export const QuotaShareTermsSchema = z.object({
  cededPercentage: z.string().regex(/^0(\.\d+)?$|^1(\.0+)?$/, 'Ceded percentage must be between 0 and 1'),
  contractualCap: MonetaryAmountSchema.optional()
});

export const ExcessOfLossTermsSchema = z.object({
  attachmentPoint: MonetaryAmountSchema,
  layerLimit: MonetaryAmountSchema,
  layerNumber: z.number().int().positive(),
  aggregateLimit: MonetaryAmountSchema.optional()
});

export const TreatyParticipationInputSchema = z.object({
  reinsurer: z.string().min(1),
  linePercentage: z.string().regex(/^0(\.\d+)?$|^1(\.0+)?$/, 'Line percentage must be between 0 and 1'),
  participationRef: z.string().min(1)
});

export const CreateTreatySchema = z.object({
  treatyRef: z.string().min(1, 'Treaty reference is required'),
  treatyType: z.enum(['QuotaShare', 'ExcessOfLoss']),
  inceptionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  coveredBusiness: z.string().min(1),
  lossBasis: z.enum(['RiskAttaching', 'LossOccurring', 'ClaimsMade']),
  currency: CurrencySchema,
  quotaShareTerms: QuotaShareTermsSchema.optional(),
  excessOfLossTerms: ExcessOfLossTermsSchema.optional(),
  participatingReinsurers: z.array(TreatyParticipationInputSchema).min(1),
  evidenceRefs: z.array(EvidenceRefSchema).default([])
});

export const CreateClaimSchema = z.object({
  claimRef: z.string().min(1, 'Claim reference is required'),
  policyRef: z.string().min(1, 'Policy reference is required'),
  dateOfLoss: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  occurrenceRef: z.string().optional(),
  grossLoss: MonetaryAmountSchema,
  applicableTreaties: z.array(z.string()).min(1, 'At least one treaty reference is required'),
  lossDescription: z.string().min(1),
  claimantOpaqueId: z.string().min(1),
  evidenceRefs: z.array(EvidenceRefSchema).min(1, 'At least one evidence manifest is required for claims intake')
});

export const CreateOccurrenceSchema = z.object({
  occurrenceRef: z.string().min(1),
  title: z.string().min(1),
  commencementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  initialClaimRefs: z.array(z.string()).default([]),
  notes: z.string().default('')
});

export const SubmitAssessmentSchema = z.object({
  assessmentRef: z.string().min(1),
  claimRef: z.string().min(1),
  assessedLoss: MonetaryAmountSchema,
  deductibleApplied: MonetaryAmountSchema,
  eligibleLoss: MonetaryAmountSchema,
  methodology: z.string().min(1, 'Assessment methodology must be documented'),
  notes: z.string().default(''),
  evidenceRefs: z.array(EvidenceRefSchema).min(1, 'Adjuster evidence is required')
});

export const ProposeAllocationSchema = z.object({
  cycleRef: z.string().min(1),
  treatyRef: z.string().min(1),
  treatyVersion: z.number().int().positive(),
  claimRefs: z.array(z.string()).min(1),
  occurrenceRef: z.string().optional(),
  calculationMethodology: z.string().min(1)
});

export const ReinsurerDecisionSchema = z.object({
  decisionRef: z.string().min(1),
  allocationRef: z.string().min(1),
  decisionType: z.enum(['Accept', 'Dispute', 'RequestInformation']),
  reason: z.string().min(1, 'Reason must be provided'),
  evidenceRefs: z.array(EvidenceRefSchema).default([])
});

export const ResolveDisputeSchema = z.object({
  disputeRef: z.string().min(1),
  resolutionSummary: z.string().min(1),
  adjustedAmount: MonetaryAmountSchema.optional()
});

export const RecoveryAdjustmentSchema = z.object({
  adjustmentRef: z.string().min(1),
  originalCycleRef: z.string().min(1),
  claimRef: z.string().min(1),
  adjustmentType: z.enum(['Salvage', 'Subrogation', 'RevisedLoss', 'ThirdPartyRecovery']),
  adjustmentAmount: MonetaryAmountSchema,
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  evidenceRefs: z.array(EvidenceRefSchema).min(1, 'Supporting evidence required for adjustment')
});

export const SettlementConfirmationSchema = z.object({
  reconciliationRef: z.string().min(1),
  settlementRef: z.string().min(1),
  confirmedAmount: MonetaryAmountSchema,
  reconciliationSource: z.string().min(1, 'Reconciliation source identifier required'),
  paymentEvidence: EvidenceRefSchema
});
