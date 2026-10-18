// Generated from ReSure/Assessment/LossAssessment.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type AddOccurrenceEvidence = {
  evidence: ReSure_Types.EvidenceRef;
};

export declare const AddOccurrenceEvidence:
  damlTypes.Serializable<AddOccurrenceEvidence> & {
  }
;


export declare type AddLateClaim = {
  claimRef: string;
  correctionReason: string;
  newAggregatedLoss: ReSure_Types.MonetaryAmount;
  correctionTime: damlTypes.Time;
};

export declare const AddLateClaim:
  damlTypes.Serializable<AddLateClaim> & {
  }
;


export declare type FreezeOccurrence = {
  aggregatedLoss: ReSure_Types.MonetaryAmount;
  freezeTime: damlTypes.Time;
};

export declare const FreezeOccurrence:
  damlTypes.Serializable<FreezeOccurrence> & {
  }
;


export declare type RemoveClaimFromOccurrence = {
  claimRef: string;
  removeTime: damlTypes.Time;
};

export declare const RemoveClaimFromOccurrence:
  damlTypes.Serializable<RemoveClaimFromOccurrence> & {
  }
;


export declare type AddClaimToOccurrence = {
  claimRef: string;
  addTime: damlTypes.Time;
};

export declare const AddClaimToOccurrence:
  damlTypes.Serializable<AddClaimToOccurrence> & {
  }
;


export declare type LossOccurrence = {
  cedant: damlTypes.Party;
  broker: damlTypes.Party;
  adjuster: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  occurrenceRef: string;
  dateOfOccurrence: damlTypes.Date;
  description: string;
  memberClaimRefs: string[];
  isFrozen: boolean;
  frozenAt: damlTypes.Optional<damlTypes.Time>;
  totalEligibleLoss: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  currency: ReSure_Types.Currency;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  createdAt: damlTypes.Time;
};

export declare interface LossOccurrenceInterface {
  AddClaimToOccurrence: damlTypes.Choice<LossOccurrence, AddClaimToOccurrence, damlTypes.ContractId<LossOccurrence>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
  RemoveClaimFromOccurrence: damlTypes.Choice<LossOccurrence, RemoveClaimFromOccurrence, damlTypes.ContractId<LossOccurrence>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
  FreezeOccurrence: damlTypes.Choice<LossOccurrence, FreezeOccurrence, damlTypes.ContractId<LossOccurrence>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
  AddLateClaim: damlTypes.Choice<LossOccurrence, AddLateClaim, damlTypes.ContractId<LossOccurrence>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
  Archive: damlTypes.Choice<LossOccurrence, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
  AddOccurrenceEvidence: damlTypes.Choice<LossOccurrence, AddOccurrenceEvidence, damlTypes.ContractId<LossOccurrence>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossOccurrence, undefined>>;
}
export declare const LossOccurrence:
  damlTypes.Template<LossOccurrence, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Assessment.LossAssessment:LossOccurrence'> &
  damlTypes.ToInterface<LossOccurrence, never> &
  LossOccurrenceInterface;

export declare namespace LossOccurrence {
  export type CreateEvent = damlLedger.CreateEvent<LossOccurrence, undefined, typeof LossOccurrence.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LossOccurrence, typeof LossOccurrence.templateId>
  export type Event = damlLedger.Event<LossOccurrence, undefined, typeof LossOccurrence.templateId>
  export type QueryResult = damlLedger.QueryResult<LossOccurrence, undefined, typeof LossOccurrence.templateId>
}



export declare type AddAssessmentEvidence = {
  evidence: ReSure_Types.EvidenceRef;
};

export declare const AddAssessmentEvidence:
  damlTypes.Serializable<AddAssessmentEvidence> & {
  }
;


export declare type SupersedeAssessment = {
  revisedAssessment: LossAssessment;
  supersedTime: damlTypes.Time;
};

export declare const SupersedeAssessment:
  damlTypes.Serializable<SupersedeAssessment> & {
  }
;


export declare type RejectAssessment = {
  rejector: damlTypes.Party;
  rejectionReason: string;
  rejectTime: damlTypes.Time;
};

export declare const RejectAssessment:
  damlTypes.Serializable<RejectAssessment> & {
  }
;


export declare type ApproveAssessment = {
  approver: damlTypes.Party;
  approvalTime: damlTypes.Time;
};

export declare const ApproveAssessment:
  damlTypes.Serializable<ApproveAssessment> & {
  }
;


export declare type SubmitAssessment = {
  submitTime: damlTypes.Time;
};

export declare const SubmitAssessment:
  damlTypes.Serializable<SubmitAssessment> & {
  }
;


export declare type LossAssessment = {
  adjuster: damlTypes.Party;
  cedant: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  claimRef: string;
  assessmentRef: string;
  assessmentVersion: damlTypes.Int;
  assessedAmount: ReSure_Types.MonetaryAmount;
  deductibleAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  salvageAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  subrogationAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  otherRecoveries: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  eligibleLoss: ReSure_Types.MonetaryAmount;
  methodology: string;
  lossBasisApplied: ReSure_Types.LossBasis;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  assessmentStatus: ReSure_Types.AssessmentStatus;
  submittedAt: damlTypes.Time;
  approvedAt: damlTypes.Optional<damlTypes.Time>;
  approvedBy: damlTypes.Optional<damlTypes.Party>;
  previousVersion: damlTypes.Optional<string>;
  notes: string;
};

export declare interface LossAssessmentInterface {
  SubmitAssessment: damlTypes.Choice<LossAssessment, SubmitAssessment, damlTypes.ContractId<LossAssessment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
  ApproveAssessment: damlTypes.Choice<LossAssessment, ApproveAssessment, damlTypes.ContractId<LossAssessment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
  RejectAssessment: damlTypes.Choice<LossAssessment, RejectAssessment, damlTypes.ContractId<LossAssessment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
  SupersedeAssessment: damlTypes.Choice<LossAssessment, SupersedeAssessment, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<LossAssessment>, damlTypes.ContractId<LossAssessment>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
  AddAssessmentEvidence: damlTypes.Choice<LossAssessment, AddAssessmentEvidence, damlTypes.ContractId<LossAssessment>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
  Archive: damlTypes.Choice<LossAssessment, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LossAssessment, undefined>>;
}
export declare const LossAssessment:
  damlTypes.Template<LossAssessment, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Assessment.LossAssessment:LossAssessment'> &
  damlTypes.ToInterface<LossAssessment, never> &
  LossAssessmentInterface;

export declare namespace LossAssessment {
  export type CreateEvent = damlLedger.CreateEvent<LossAssessment, undefined, typeof LossAssessment.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LossAssessment, typeof LossAssessment.templateId>
  export type Event = damlLedger.Event<LossAssessment, undefined, typeof LossAssessment.templateId>
  export type QueryResult = damlLedger.QueryResult<LossAssessment, undefined, typeof LossAssessment.templateId>
}


