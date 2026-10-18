// Generated from ReSure/Allocation/AllocationCycle.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type WithdrawAllocationProposal = {
};

export declare const WithdrawAllocationProposal:
  damlTypes.Serializable<WithdrawAllocationProposal> & {
  }
;


export declare type RequestInfoOnAllocation = {
  infoRequest: string;
  requestTime: damlTypes.Time;
};

export declare const RequestInfoOnAllocation:
  damlTypes.Serializable<RequestInfoOnAllocation> & {
  }
;


export declare type DisputeAllocationProposal = {
  disputeReason: string;
  disputedAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  disputeTime: damlTypes.Time;
  disputeEvidence: damlTypes.Optional<ReSure_Types.EvidenceRef>;
};

export declare const DisputeAllocationProposal:
  damlTypes.Serializable<DisputeAllocationProposal> & {
  }
;


export declare type AcceptAllocationProposal = {
  acceptTime: damlTypes.Time;
  acceptEvidence: damlTypes.Optional<ReSure_Types.EvidenceRef>;
};

export declare const AcceptAllocationProposal:
  damlTypes.Serializable<AcceptAllocationProposal> & {
  }
;


export declare type AllocationProposal = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  allocationRef: string;
  cycleRef: string;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  claimRef: string;
  occurrenceRef: damlTypes.Optional<string>;
  allocatedAmount: ReSure_Types.MonetaryAmount;
  linePercentage: damlTypes.Numeric;
  calculationEvidence: ReSure_Types.CalculationEvidence;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  proposedAt: damlTypes.Time;
};

export declare interface AllocationProposalInterface {
  AcceptAllocationProposal: damlTypes.Choice<AllocationProposal, AcceptAllocationProposal, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationProposal, undefined>>;
  DisputeAllocationProposal: damlTypes.Choice<AllocationProposal, DisputeAllocationProposal, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationProposal, undefined>>;
  RequestInfoOnAllocation: damlTypes.Choice<AllocationProposal, RequestInfoOnAllocation, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationProposal, undefined>>;
  Archive: damlTypes.Choice<AllocationProposal, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationProposal, undefined>>;
  WithdrawAllocationProposal: damlTypes.Choice<AllocationProposal, WithdrawAllocationProposal, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationProposal, undefined>>;
}
export declare const AllocationProposal:
  damlTypes.Template<AllocationProposal, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:AllocationProposal'> &
  damlTypes.ToInterface<AllocationProposal, never> &
  AllocationProposalInterface;

export declare namespace AllocationProposal {
  export type CreateEvent = damlLedger.CreateEvent<AllocationProposal, undefined, typeof AllocationProposal.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AllocationProposal, typeof AllocationProposal.templateId>
  export type Event = damlLedger.Event<AllocationProposal, undefined, typeof AllocationProposal.templateId>
  export type QueryResult = damlLedger.QueryResult<AllocationProposal, undefined, typeof AllocationProposal.templateId>
}



export declare type CancelAllocation = {
  cancellationReason: string;
  cancelTime: damlTypes.Time;
};

export declare const CancelAllocation:
  damlTypes.Serializable<CancelAllocation> & {
  }
;


export declare type FinalizeAllocation = {
  finalizeTime: damlTypes.Time;
};

export declare const FinalizeAllocation:
  damlTypes.Serializable<FinalizeAllocation> & {
  }
;


export declare type RecordReinsurerDecision = {
  decision: ReSure_Types.DecisionType;
  decisionTime: damlTypes.Time;
  decisionEvidence: damlTypes.Optional<ReSure_Types.EvidenceRef>;
};

export declare const RecordReinsurerDecision:
  damlTypes.Serializable<RecordReinsurerDecision> & {
  }
;


export declare type RecoverableAllocation = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  allocationRef: string;
  cycleRef: string;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  claimRef: string;
  occurrenceRef: damlTypes.Optional<string>;
  allocatedAmount: ReSure_Types.MonetaryAmount;
  linePercentage: damlTypes.Numeric;
  calculationEvidence: ReSure_Types.CalculationEvidence;
  reinsurerDecision: damlTypes.Optional<ReSure_Types.DecisionType>;
  decisionAt: damlTypes.Optional<damlTypes.Time>;
  isFinalized: boolean;
  isCancelled: boolean;
  createdAt: damlTypes.Time;
  evidenceRefs: ReSure_Types.EvidenceRef[];
};

export declare interface RecoverableAllocationInterface {
  RecordReinsurerDecision: damlTypes.Choice<RecoverableAllocation, RecordReinsurerDecision, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableAllocation, undefined>>;
  FinalizeAllocation: damlTypes.Choice<RecoverableAllocation, FinalizeAllocation, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableAllocation, undefined>>;
  CancelAllocation: damlTypes.Choice<RecoverableAllocation, CancelAllocation, damlTypes.ContractId<RecoverableAllocation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableAllocation, undefined>>;
  Archive: damlTypes.Choice<RecoverableAllocation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableAllocation, undefined>>;
}
export declare const RecoverableAllocation:
  damlTypes.Template<RecoverableAllocation, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:RecoverableAllocation'> &
  damlTypes.ToInterface<RecoverableAllocation, never> &
  RecoverableAllocationInterface;

export declare namespace RecoverableAllocation {
  export type CreateEvent = damlLedger.CreateEvent<RecoverableAllocation, undefined, typeof RecoverableAllocation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RecoverableAllocation, typeof RecoverableAllocation.templateId>
  export type Event = damlLedger.Event<RecoverableAllocation, undefined, typeof RecoverableAllocation.templateId>
  export type QueryResult = damlLedger.QueryResult<RecoverableAllocation, undefined, typeof RecoverableAllocation.templateId>
}



export declare type MarkAllocationAdjusted = {
  adjustmentTime: damlTypes.Time;
};

export declare const MarkAllocationAdjusted:
  damlTypes.Serializable<MarkAllocationAdjusted> & {
  }
;


export declare type MarkAllocationDisputed = {
  disputeTime: damlTypes.Time;
};

export declare const MarkAllocationDisputed:
  damlTypes.Serializable<MarkAllocationDisputed> & {
  }
;


export declare type FinalizeAllocationCycle = {
  finalizeTime: damlTypes.Time;
};

export declare const FinalizeAllocationCycle:
  damlTypes.Serializable<FinalizeAllocationCycle> & {
  }
;


export declare type AllocationCycle = {
  operations: damlTypes.Party;
  cedant: damlTypes.Party;
  broker: damlTypes.Party;
  audit: damlTypes.Party;
  cycleRef: string;
  claimRefs: string[];
  occurrenceRef: damlTypes.Optional<string>;
  assessmentRef: string;
  assessmentVersion: damlTypes.Int;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  treatyType: ReSure_Types.TreatyType;
  eligibleLoss: ReSure_Types.MonetaryAmount;
  calculatedRecoverable: ReSure_Types.MonetaryAmount;
  calculationEvidence: ReSure_Types.CalculationEvidence;
  currency: ReSure_Types.Currency;
  allocationStatus: ReSure_Types.AllocationStatus;
  createdAt: damlTypes.Time;
  finalizedAt: damlTypes.Optional<damlTypes.Time>;
  evidenceRefs: ReSure_Types.EvidenceRef[];
};

export declare interface AllocationCycleInterface {
  FinalizeAllocationCycle: damlTypes.Choice<AllocationCycle, FinalizeAllocationCycle, damlTypes.ContractId<AllocationCycle>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationCycle, undefined>>;
  MarkAllocationDisputed: damlTypes.Choice<AllocationCycle, MarkAllocationDisputed, damlTypes.ContractId<AllocationCycle>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationCycle, undefined>>;
  MarkAllocationAdjusted: damlTypes.Choice<AllocationCycle, MarkAllocationAdjusted, damlTypes.ContractId<AllocationCycle>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationCycle, undefined>>;
  Archive: damlTypes.Choice<AllocationCycle, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationCycle, undefined>>;
}
export declare const AllocationCycle:
  damlTypes.Template<AllocationCycle, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:AllocationCycle'> &
  damlTypes.ToInterface<AllocationCycle, never> &
  AllocationCycleInterface;

export declare namespace AllocationCycle {
  export type CreateEvent = damlLedger.CreateEvent<AllocationCycle, undefined, typeof AllocationCycle.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AllocationCycle, typeof AllocationCycle.templateId>
  export type Event = damlLedger.Event<AllocationCycle, undefined, typeof AllocationCycle.templateId>
  export type QueryResult = damlLedger.QueryResult<AllocationCycle, undefined, typeof AllocationCycle.templateId>
}


