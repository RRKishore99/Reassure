// Generated from ReSure/Claim/ClaimCase.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type SupersedeEvidence = {
  newHash: string;
  newVersion: damlTypes.Int;
  updateTime: damlTypes.Time;
};

export declare const SupersedeEvidence:
  damlTypes.Serializable<SupersedeEvidence> & {
  }
;


export declare type VerifyEvidence = {
  verifier: damlTypes.Party;
  verifyTime: damlTypes.Time;
};

export declare const VerifyEvidence:
  damlTypes.Serializable<VerifyEvidence> & {
  }
;


export declare type ClaimEvidenceManifest = {
  owner: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  claimRef: string;
  documentType: ReSure_Types.DocumentType;
  contentHash: string;
  documentVersion: damlTypes.Int;
  documentId: string;
  uploadedAt: damlTypes.Time;
  uploadedBy: damlTypes.Party;
  verifiedAt: damlTypes.Optional<damlTypes.Time>;
  verifiedBy: damlTypes.Optional<damlTypes.Party>;
  description: string;
};

export declare interface ClaimEvidenceManifestInterface {
  VerifyEvidence: damlTypes.Choice<ClaimEvidenceManifest, VerifyEvidence, damlTypes.ContractId<ClaimEvidenceManifest>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimEvidenceManifest, undefined>>;
  Archive: damlTypes.Choice<ClaimEvidenceManifest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimEvidenceManifest, undefined>>;
  SupersedeEvidence: damlTypes.Choice<ClaimEvidenceManifest, SupersedeEvidence, damlTypes.ContractId<ClaimEvidenceManifest>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimEvidenceManifest, undefined>>;
}
export declare const ClaimEvidenceManifest:
  damlTypes.Template<ClaimEvidenceManifest, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Claim.ClaimCase:ClaimEvidenceManifest'> &
  damlTypes.ToInterface<ClaimEvidenceManifest, never> &
  ClaimEvidenceManifestInterface;

export declare namespace ClaimEvidenceManifest {
  export type CreateEvent = damlLedger.CreateEvent<ClaimEvidenceManifest, undefined, typeof ClaimEvidenceManifest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClaimEvidenceManifest, typeof ClaimEvidenceManifest.templateId>
  export type Event = damlLedger.Event<ClaimEvidenceManifest, undefined, typeof ClaimEvidenceManifest.templateId>
  export type QueryResult = damlLedger.QueryResult<ClaimEvidenceManifest, undefined, typeof ClaimEvidenceManifest.templateId>
}



export declare type UpdateClaimAmount = {
  newGrossAmount: ReSure_Types.MonetaryAmount;
  newNetAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  updateTime: damlTypes.Time;
  updateEvidence: ReSure_Types.EvidenceRef;
};

export declare const UpdateClaimAmount:
  damlTypes.Serializable<UpdateClaimAmount> & {
  }
;


export declare type AddClaimEvidence = {
  evidence: ReSure_Types.EvidenceRef;
};

export declare const AddClaimEvidence:
  damlTypes.Serializable<AddClaimEvidence> & {
  }
;


export declare type ReopenClaim = {
  reopenTime: damlTypes.Time;
  reason: string;
};

export declare const ReopenClaim:
  damlTypes.Serializable<ReopenClaim> & {
  }
;


export declare type CloseClaim = {
  closeTime: damlTypes.Time;
};

export declare const CloseClaim:
  damlTypes.Serializable<CloseClaim> & {
  }
;


export declare type MarkClaimFullySettled = {
  settlementTime: damlTypes.Time;
};

export declare const MarkClaimFullySettled:
  damlTypes.Serializable<MarkClaimFullySettled> & {
  }
;


export declare type MarkClaimPartiallySettled = {
  settlementTime: damlTypes.Time;
};

export declare const MarkClaimPartiallySettled:
  damlTypes.Serializable<MarkClaimPartiallySettled> & {
  }
;


export declare type MarkClaimAllocated = {
  allocationTime: damlTypes.Time;
};

export declare const MarkClaimAllocated:
  damlTypes.Serializable<MarkClaimAllocated> & {
  }
;


export declare type MarkClaimAssessed = {
  assessmentTime: damlTypes.Time;
};

export declare const MarkClaimAssessed:
  damlTypes.Serializable<MarkClaimAssessed> & {
  }
;


export declare type SubmitForAssessment = {
  submissionTime: damlTypes.Time;
};

export declare const SubmitForAssessment:
  damlTypes.Serializable<SubmitForAssessment> & {
  }
;


export declare type ClaimCase = {
  cedant: damlTypes.Party;
  broker: damlTypes.Party;
  adjuster: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  claimRef: string;
  policyRef: string;
  dateOfLoss: damlTypes.Date;
  occurrenceRef: damlTypes.Optional<string>;
  grossAmount: ReSure_Types.MonetaryAmount;
  netAmount: damlTypes.Optional<ReSure_Types.MonetaryAmount>;
  applicableTreatyRefs: string[];
  claimStatus: ReSure_Types.ClaimStatus;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  submittedAt: damlTypes.Time;
  submittedBy: damlTypes.Party;
  lastUpdatedAt: damlTypes.Time;
  notes: string;
};

export declare interface ClaimCaseInterface {
  SubmitForAssessment: damlTypes.Choice<ClaimCase, SubmitForAssessment, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  MarkClaimAssessed: damlTypes.Choice<ClaimCase, MarkClaimAssessed, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  MarkClaimAllocated: damlTypes.Choice<ClaimCase, MarkClaimAllocated, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  MarkClaimPartiallySettled: damlTypes.Choice<ClaimCase, MarkClaimPartiallySettled, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  MarkClaimFullySettled: damlTypes.Choice<ClaimCase, MarkClaimFullySettled, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  CloseClaim: damlTypes.Choice<ClaimCase, CloseClaim, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  ReopenClaim: damlTypes.Choice<ClaimCase, ReopenClaim, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  AddClaimEvidence: damlTypes.Choice<ClaimCase, AddClaimEvidence, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  UpdateClaimAmount: damlTypes.Choice<ClaimCase, UpdateClaimAmount, damlTypes.ContractId<ClaimCase>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
  Archive: damlTypes.Choice<ClaimCase, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimCase, undefined>>;
}
export declare const ClaimCase:
  damlTypes.Template<ClaimCase, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Claim.ClaimCase:ClaimCase'> &
  damlTypes.ToInterface<ClaimCase, never> &
  ClaimCaseInterface;

export declare namespace ClaimCase {
  export type CreateEvent = damlLedger.CreateEvent<ClaimCase, undefined, typeof ClaimCase.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClaimCase, typeof ClaimCase.templateId>
  export type Event = damlLedger.Event<ClaimCase, undefined, typeof ClaimCase.templateId>
  export type QueryResult = damlLedger.QueryResult<ClaimCase, undefined, typeof ClaimCase.templateId>
}


