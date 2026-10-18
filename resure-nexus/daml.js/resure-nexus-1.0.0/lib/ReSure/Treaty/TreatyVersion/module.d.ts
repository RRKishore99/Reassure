// Generated from ReSure/Treaty/TreatyVersion.daml
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

export declare type AddTreatyEvidence = {
  evidence: ReSure_Types.EvidenceRef;
};

export declare const AddTreatyEvidence:
  damlTypes.Serializable<AddTreatyEvidence> & {
  }
;


export declare type TerminateTreaty = {
  terminationTime: damlTypes.Time;
  reason: string;
};

export declare const TerminateTreaty:
  damlTypes.Serializable<TerminateTreaty> & {
  }
;


export declare type SupersedeTreatyVersion = {
  newTreatyData: TreatyVersion;
  amendmentTime: damlTypes.Time;
};

export declare const SupersedeTreatyVersion:
  damlTypes.Serializable<SupersedeTreatyVersion> & {
  }
;


export declare type ApproveTreaty = {
  approver: damlTypes.Party;
  approvalTime: damlTypes.Time;
};

export declare const ApproveTreaty:
  damlTypes.Serializable<ApproveTreaty> & {
  }
;


export declare type TreatyVersion = {
  cedant: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  treatyRef: string;
  version: damlTypes.Int;
  treatyType: ReSure_Types.TreatyType;
  effectivePeriod: ReSure_Types.DateRange;
  coveredBusiness: string;
  lossBasis: ReSure_Types.LossBasis;
  currency: ReSure_Types.Currency;
  cededPercentage: damlTypes.Optional<damlTypes.Numeric>;
  contractualCap: damlTypes.Optional<damlTypes.Numeric>;
  attachmentPoint: damlTypes.Optional<damlTypes.Numeric>;
  layerLimit: damlTypes.Optional<damlTypes.Numeric>;
  deductibleRules: string;
  eligibleLossMethod: string;
  approvalState: ReSure_Types.ApprovalState;
  evidenceRefs: ReSure_Types.EvidenceRef[];
  createdAt: damlTypes.Time;
  previousVersion: damlTypes.Optional<damlTypes.ContractId<TreatyVersion>>;
};

export declare interface TreatyVersionInterface {
  ApproveTreaty: damlTypes.Choice<TreatyVersion, ApproveTreaty, damlTypes.ContractId<TreatyVersion>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyVersion, undefined>>;
  SupersedeTreatyVersion: damlTypes.Choice<TreatyVersion, SupersedeTreatyVersion, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<TreatyVersion>, damlTypes.ContractId<TreatyVersion>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyVersion, undefined>>;
  TerminateTreaty: damlTypes.Choice<TreatyVersion, TerminateTreaty, damlTypes.ContractId<TreatyVersion>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyVersion, undefined>>;
  Archive: damlTypes.Choice<TreatyVersion, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyVersion, undefined>>;
  AddTreatyEvidence: damlTypes.Choice<TreatyVersion, AddTreatyEvidence, damlTypes.ContractId<TreatyVersion>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TreatyVersion, undefined>>;
}
export declare const TreatyVersion:
  damlTypes.Template<TreatyVersion, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyVersion:TreatyVersion'> &
  damlTypes.ToInterface<TreatyVersion, never> &
  TreatyVersionInterface;

export declare namespace TreatyVersion {
  export type CreateEvent = damlLedger.CreateEvent<TreatyVersion, undefined, typeof TreatyVersion.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TreatyVersion, typeof TreatyVersion.templateId>
  export type Event = damlLedger.Event<TreatyVersion, undefined, typeof TreatyVersion.templateId>
  export type QueryResult = damlLedger.QueryResult<TreatyVersion, undefined, typeof TreatyVersion.templateId>
}


