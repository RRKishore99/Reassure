// Generated from ReSure/Treaty/TreatyParticipation.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Treaty_TreatyVersion from '../../../ReSure/Treaty/TreatyVersion/module';
import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type WithdrawProposal = {
};

export declare const WithdrawProposal:
  damlTypes.Serializable<WithdrawProposal> & {
  }
;


export declare type RejectProposal = {
  rejectionReason: string;
  rejectTime: damlTypes.Time;
};

export declare const RejectProposal:
  damlTypes.Serializable<RejectProposal> & {
  }
;


export declare type AcceptProposal = {
  acceptTime: damlTypes.Time;
  acceptEvidence: damlTypes.Optional<ReSure_Types.EvidenceRef>;
};

export declare const AcceptProposal:
  damlTypes.Serializable<AcceptProposal> & {
  }
;


export declare type TreatyParticipationProposal = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  treatyVersionCid: damlTypes.ContractId<ReSure_Treaty_TreatyVersion.TreatyVersion>;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  proposedLinePercentage: damlTypes.Numeric;
  coveredLayer: string;
  currency: ReSure_Types.Currency;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  proposedAt: damlTypes.Time;
};

export declare interface TreatyParticipationProposalInterface {
  AcceptProposal: damlTypes.Choice<TreatyParticipationProposal, AcceptProposal, damlTypes.ContractId<TreatyParticipation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipationProposal, undefined>>;
  RejectProposal: damlTypes.Choice<TreatyParticipationProposal, RejectProposal, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipationProposal, undefined>>;
  Archive: damlTypes.Choice<TreatyParticipationProposal, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipationProposal, undefined>>;
  WithdrawProposal: damlTypes.Choice<TreatyParticipationProposal, WithdrawProposal, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipationProposal, undefined>>;
}
export declare const TreatyParticipationProposal:
  damlTypes.Template<TreatyParticipationProposal, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyParticipation:TreatyParticipationProposal'> &
  damlTypes.ToInterface<TreatyParticipationProposal, never> &
  TreatyParticipationProposalInterface;

export declare namespace TreatyParticipationProposal {
  export type CreateEvent = damlLedger.CreateEvent<TreatyParticipationProposal, undefined, typeof TreatyParticipationProposal.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TreatyParticipationProposal, typeof TreatyParticipationProposal.templateId>
  export type Event = damlLedger.Event<TreatyParticipationProposal, undefined, typeof TreatyParticipationProposal.templateId>
  export type QueryResult = damlLedger.QueryResult<TreatyParticipationProposal, undefined, typeof TreatyParticipationProposal.templateId>
}



export declare type AddParticipationEvidence = {
  evidence: ReSure_Types.EvidenceRef;
  submitter: damlTypes.Party;
};

export declare const AddParticipationEvidence:
  damlTypes.Serializable<AddParticipationEvidence> & {
  }
;


export declare type ViewParticipationTerms = {
};

export declare const ViewParticipationTerms:
  damlTypes.Serializable<ViewParticipationTerms> & {
  }
;


export declare type AcceptParticipation = {
  acceptTime: damlTypes.Time;
  acceptEvidence: damlTypes.Optional<ReSure_Types.EvidenceRef>;
};

export declare const AcceptParticipation:
  damlTypes.Serializable<AcceptParticipation> & {
  }
;


export declare type TreatyParticipation = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  treatyVersionCid: damlTypes.ContractId<ReSure_Treaty_TreatyVersion.TreatyVersion>;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  linePercentage: damlTypes.Numeric;
  coveredLayer: string;
  currency: ReSure_Types.Currency;
  isAccepted: boolean;
  acceptedAt: damlTypes.Optional<damlTypes.Time>;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  createdAt: damlTypes.Time;
};

export declare interface TreatyParticipationInterface {
  AcceptParticipation: damlTypes.Choice<TreatyParticipation, AcceptParticipation, damlTypes.ContractId<TreatyParticipation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipation, undefined>>;
  ViewParticipationTerms: damlTypes.Choice<TreatyParticipation, ViewParticipationTerms, TreatyParticipation, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipation, undefined>>;
  AddParticipationEvidence: damlTypes.Choice<TreatyParticipation, AddParticipationEvidence, damlTypes.ContractId<TreatyParticipation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipation, undefined>>;
  Archive: damlTypes.Choice<TreatyParticipation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyParticipation, undefined>>;
}
export declare const TreatyParticipation:
  damlTypes.Template<TreatyParticipation, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyParticipation:TreatyParticipation'> &
  damlTypes.ToInterface<TreatyParticipation, never> &
  TreatyParticipationInterface;

export declare namespace TreatyParticipation {
  export type CreateEvent = damlLedger.CreateEvent<TreatyParticipation, undefined, typeof TreatyParticipation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TreatyParticipation, typeof TreatyParticipation.templateId>
  export type Event = damlLedger.Event<TreatyParticipation, undefined, typeof TreatyParticipation.templateId>
  export type QueryResult = damlLedger.QueryResult<TreatyParticipation, undefined, typeof TreatyParticipation.templateId>
}


