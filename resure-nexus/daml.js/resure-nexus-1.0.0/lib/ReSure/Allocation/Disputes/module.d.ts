// Generated from ReSure/Allocation/Disputes.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type AddAdjustmentEvidence = {
  evidence: ReSure_Types.EvidenceRef;
};

export declare const AddAdjustmentEvidence:
  damlTypes.Serializable<AddAdjustmentEvidence> & {
  }
;


export declare type ApproveAdjustment = {
  approver: damlTypes.Party;
  approvalTime: damlTypes.Time;
};

export declare const ApproveAdjustment:
  damlTypes.Serializable<ApproveAdjustment> & {
  }
;


export declare type RecoveryAdjustment = {
  operations: damlTypes.Party;
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  audit: damlTypes.Party;
  adjustmentRef: string;
  allocationRef: string;
  cycleRef: string;
  claimRef: string;
  treatyRef: string;
  adjustmentType: ReSure_Types.AdjustmentType;
  originalAmount: ReSure_Types.MonetaryAmount;
  adjustmentAmount: ReSure_Types.MonetaryAmount;
  revisedAmount: ReSure_Types.MonetaryAmount;
  reason: string;
  calculationEvidence: ReSure_Types.CalculationEvidence;
  predecessorRef: damlTypes.Optional<string>;
  predecessorVersion: damlTypes.Int;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  isApproved: boolean;
  approvedAt: damlTypes.Optional<damlTypes.Time>;
  approvedBy: damlTypes.Optional<damlTypes.Party>;
  createdAt: damlTypes.Time;
};

export declare interface RecoveryAdjustmentInterface {
  ApproveAdjustment: damlTypes.Choice<RecoveryAdjustment, ApproveAdjustment, damlTypes.ContractId<RecoveryAdjustment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoveryAdjustment, undefined>>;
  Archive: damlTypes.Choice<RecoveryAdjustment, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoveryAdjustment, undefined>>;
  AddAdjustmentEvidence: damlTypes.Choice<RecoveryAdjustment, AddAdjustmentEvidence, damlTypes.ContractId<RecoveryAdjustment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoveryAdjustment, undefined>>;
}
export declare const RecoveryAdjustment:
  damlTypes.Template<RecoveryAdjustment, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.Disputes:RecoveryAdjustment'> &
  damlTypes.ToInterface<RecoveryAdjustment, never> &
  RecoveryAdjustmentInterface;

export declare namespace RecoveryAdjustment {
  export type CreateEvent = damlLedger.CreateEvent<RecoveryAdjustment, undefined, typeof RecoveryAdjustment.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RecoveryAdjustment, typeof RecoveryAdjustment.templateId>
  export type Event = damlLedger.Event<RecoveryAdjustment, undefined, typeof RecoveryAdjustment.templateId>
  export type QueryResult = damlLedger.QueryResult<RecoveryAdjustment, undefined, typeof RecoveryAdjustment.templateId>
}



export declare type AddDisputeEvidence = {
  evidence: ReSure_Types.EvidenceRef;
  submitter: damlTypes.Party;
};

export declare const AddDisputeEvidence:
  damlTypes.Serializable<AddDisputeEvidence> & {
  }
;


export declare type WithdrawDispute = {
  withdrawalReason: string;
  withdrawTime: damlTypes.Time;
};

export declare const WithdrawDispute:
  damlTypes.Serializable<WithdrawDispute> & {
  }
;


export declare type EscalateDispute = {
  escalationReason: string;
  escalateTime: damlTypes.Time;
};

export declare const EscalateDispute:
  damlTypes.Serializable<EscalateDispute> & {
  }
;


export declare type ResolveDispute = {
  resolutionText: string;
  finalAmount: ReSure_Types.MonetaryAmount;
  resolveTime: damlTypes.Time;
  resolver: damlTypes.Party;
  resolutionEvidence: ReSure_Types.EvidenceRef[];
};

export declare const ResolveDispute:
  damlTypes.Serializable<ResolveDispute> & {
  }
;


export declare type SubmitDisputeForReview = {
  reviewTime: damlTypes.Time;
};

export declare const SubmitDisputeForReview:
  damlTypes.Serializable<SubmitDisputeForReview> & {
  }
;


export declare type DisputeCase = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  disputeRef: string;
  allocationRef: string;
  cycleRef: string;
  claimRef: string;
  treatyRef: string;
  disputedAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  originalAmount: ReSure_Types.MonetaryAmount;
  reason: string;
  supportingEvidence: ReSure_Types.EvidenceRef[];
  disputeStatus: ReSure_Types.DisputeStatus;
  resolution: damlTypes.Optional<string>;
  resolvedAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  resolvedAt: damlTypes.Optional<damlTypes.Time>;
  resolvedBy: damlTypes.Optional<damlTypes.Party>;
  raisedAt: damlTypes.Time;
  raisedBy: damlTypes.Party;
};

export declare interface DisputeCaseInterface {
  SubmitDisputeForReview: damlTypes.Choice<DisputeCase, SubmitDisputeForReview, damlTypes.ContractId<DisputeCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
  ResolveDispute: damlTypes.Choice<DisputeCase, ResolveDispute, damlTypes.ContractId<DisputeCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
  EscalateDispute: damlTypes.Choice<DisputeCase, EscalateDispute, damlTypes.ContractId<DisputeCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
  WithdrawDispute: damlTypes.Choice<DisputeCase, WithdrawDispute, damlTypes.ContractId<DisputeCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
  AddDisputeEvidence: damlTypes.Choice<DisputeCase, AddDisputeEvidence, damlTypes.ContractId<DisputeCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
  Archive: damlTypes.Choice<DisputeCase, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DisputeCase, undefined>>;
}
export declare const DisputeCase:
  damlTypes.Template<DisputeCase, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.Disputes:DisputeCase'> &
  damlTypes.ToInterface<DisputeCase, never> &
  DisputeCaseInterface;

export declare namespace DisputeCase {
  export type CreateEvent = damlLedger.CreateEvent<DisputeCase, undefined, typeof DisputeCase.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DisputeCase, typeof DisputeCase.templateId>
  export type Event = damlLedger.Event<DisputeCase, undefined, typeof DisputeCase.templateId>
  export type QueryResult = damlLedger.QueryResult<DisputeCase, undefined, typeof DisputeCase.templateId>
}


