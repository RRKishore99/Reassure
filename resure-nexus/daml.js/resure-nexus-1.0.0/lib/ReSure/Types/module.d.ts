// Generated from ReSure/Types.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';

export declare type ApprovalState =
  | 'ApprovalPending'
  | 'ApprovalEffective'
  | 'ApprovalSuperseded'
  | 'ApprovalTerminated'
;

export declare const ApprovalState:
  damlTypes.Serializable<ApprovalState> & {
  }
& { readonly keys: ApprovalState[] } & { readonly [e in ApprovalState]: e }
;


export declare type AdjustmentType =
  |  { tag: 'SalvageRecovery'; value: {} }
  |  { tag: 'SubrogationRecovery'; value: {} }
  |  { tag: 'RevisedAssessment'; value: {} }
  |  { tag: 'CorrectedCalculation'; value: {} }
  |  { tag: 'ContractualAdjustment'; value: string }
;

export declare const AdjustmentType:
  damlTypes.Serializable<AdjustmentType> & {
  }
;


export declare type CalculationEvidence = {
  formula: string;
  inputs: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<string, string>[];
  intermediates: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<string, string>[];
  roundingRule: RoundingRule;
  result: damlTypes.Numeric;
  calculatedAt: damlTypes.Time;
  calculatedBy: damlTypes.Party;
};

export declare const CalculationEvidence:
  damlTypes.Serializable<CalculationEvidence> & {
  }
;


export declare type RoundingRule =
  | 'RoundHalfUp'
  | 'RoundHalfDown'
  | 'RoundHalfEven'
  | 'RoundDown'
  | 'ResidualToLeadReinsurer'
;

export declare const RoundingRule:
  damlTypes.Serializable<RoundingRule> & {
  }
& { readonly keys: RoundingRule[] } & { readonly [e in RoundingRule]: e }
;


export declare type DateRange = {
  startDate: damlTypes.Date;
  endDate: damlTypes.Date;
};

export declare const DateRange:
  damlTypes.Serializable<DateRange> & {
  }
;


export declare type MonetaryAmount = {
  amount: damlTypes.Numeric;
  currency: Currency;
};

export declare const MonetaryAmount:
  damlTypes.Serializable<MonetaryAmount> & {
  }
;


export declare type EvidenceRef = {
  documentId: string;
  documentType: DocumentType;
  contentHash: string;
  version: damlTypes.Int;
  uploadedAt: damlTypes.Time;
  uploadedBy: damlTypes.Party;
};

export declare const EvidenceRef:
  damlTypes.Serializable<EvidenceRef> & {
  }
;


export declare type DocumentType =
  |  { tag: 'PolicySchedule'; value: {} }
  |  { tag: 'ClaimNotification'; value: {} }
  |  { tag: 'LossAdjusterReport'; value: {} }
  |  { tag: 'SalvageReport'; value: {} }
  |  { tag: 'SubrogationReport'; value: {} }
  |  { tag: 'TreatySlip'; value: {} }
  |  { tag: 'EndorsementSlip'; value: {} }
  |  { tag: 'BordereauExtract'; value: {} }
  |  { tag: 'PaymentAdvice'; value: {} }
  |  { tag: 'SettlementConfirmation'; value: {} }
  |  { tag: 'AuditReport'; value: {} }
  |  { tag: 'OtherDocument'; value: string }
;

export declare const DocumentType:
  damlTypes.Serializable<DocumentType> & {
  }
;


export declare type DisputeStatus =
  | 'DisputeRaised'
  | 'DisputeUnderReview'
  | 'DisputeResolved'
  | 'DisputeEscalated'
  | 'DisputeWithdrawn'
;

export declare const DisputeStatus:
  damlTypes.Serializable<DisputeStatus> & {
  }
& { readonly keys: DisputeStatus[] } & { readonly [e in DisputeStatus]: e }
;


export declare type SettlementStatus =
  | 'SettlementPending'
  | 'SettlementInstructed'
  | 'SettlementConfirmed'
  | 'SettlementPartiallyPaid'
  | 'SettlementReconciled'
  | 'SettlementOverdue'
;

export declare const SettlementStatus:
  damlTypes.Serializable<SettlementStatus> & {
  }
& { readonly keys: SettlementStatus[] } & { readonly [e in SettlementStatus]: e }
;


export declare type DecisionType =
  | 'DecisionAccept'
  | 'DecisionDispute'
  | 'DecisionRequestInfo'
;

export declare const DecisionType:
  damlTypes.Serializable<DecisionType> & {
  }
& { readonly keys: DecisionType[] } & { readonly [e in DecisionType]: e }
;


export declare type AllocationStatus =
  | 'AllocationProposed'
  | 'AllocationPendingReinsurer'
  | 'AllocationAccepted'
  | 'AllocationDisputed'
  | 'AllocationFinalized'
  | 'AllocationAdjusted'
;

export declare const AllocationStatus:
  damlTypes.Serializable<AllocationStatus> & {
  }
& { readonly keys: AllocationStatus[] } & { readonly [e in AllocationStatus]: e }
;


export declare type AssessmentStatus =
  | 'AssessmentDraft'
  | 'AssessmentSubmitted'
  | 'AssessmentApproved'
  | 'AssessmentRejected'
  | 'AssessmentSuperseded'
;

export declare const AssessmentStatus:
  damlTypes.Serializable<AssessmentStatus> & {
  }
& { readonly keys: AssessmentStatus[] } & { readonly [e in AssessmentStatus]: e }
;


export declare type ClaimStatus =
  | 'ClaimSubmitted'
  | 'ClaimUnderAssessment'
  | 'ClaimAssessed'
  | 'ClaimAllocated'
  | 'ClaimPartiallySettled'
  | 'ClaimFullySettled'
  | 'ClaimClosed'
  | 'ClaimReopened'
;

export declare const ClaimStatus:
  damlTypes.Serializable<ClaimStatus> & {
  }
& { readonly keys: ClaimStatus[] } & { readonly [e in ClaimStatus]: e }
;


export declare type LossBasis =
  |  { tag: 'GrossLoss'; value: {} }
  |  { tag: 'NetOfDeductible'; value: {} }
  |  { tag: 'NetOfSalvageSubrogation'; value: {} }
  |  { tag: 'NetOfAll'; value: {} }
  |  { tag: 'CustomBasis'; value: string }
;

export declare const LossBasis:
  damlTypes.Serializable<LossBasis> & {
  }
;


export declare type TreatyType =
  | 'QuotaShare'
  | 'ExcessOfLoss'
  | 'SurplusShare'
  | 'StopLoss'
;

export declare const TreatyType:
  damlTypes.Serializable<TreatyType> & {
  }
& { readonly keys: TreatyType[] } & { readonly [e in TreatyType]: e }
;


export declare type Currency =
  |  { tag: 'USD'; value: {} }
  |  { tag: 'EUR'; value: {} }
  |  { tag: 'GBP'; value: {} }
  |  { tag: 'CHF'; value: {} }
  |  { tag: 'JPY'; value: {} }
  |  { tag: 'CAD'; value: {} }
  |  { tag: 'AUD'; value: {} }
  |  { tag: 'SGD'; value: {} }
  |  { tag: 'HKD'; value: {} }
  |  { tag: 'Other'; value: string }
;

export declare const Currency:
  damlTypes.Serializable<Currency> & {
  }
;

