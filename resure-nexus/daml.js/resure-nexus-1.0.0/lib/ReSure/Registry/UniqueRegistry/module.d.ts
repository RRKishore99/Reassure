// Generated from ReSure/Registry/UniqueRegistry.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type DeactivateSettlementRegistration = {
  deactivateTime: damlTypes.Time;
};

export declare const DeactivateSettlementRegistration:
  damlTypes.Serializable<DeactivateSettlementRegistration> & {
  }
;


export declare type SettlementRegistry = {
  registrar: damlTypes.Party;
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  audit: damlTypes.Party;
  settlementRef: string;
  allocationRef: string;
  registeredAt: damlTypes.Time;
  isActive: boolean;
};

export declare interface SettlementRegistryInterface {
  Archive: damlTypes.Choice<SettlementRegistry, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, SettlementRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SettlementRegistry, SettlementRegistry.Key>>;
  DeactivateSettlementRegistration: damlTypes.Choice<SettlementRegistry, DeactivateSettlementRegistration, damlTypes.ContractId<SettlementRegistry>, SettlementRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SettlementRegistry, SettlementRegistry.Key>>;
}
export declare const SettlementRegistry:
  damlTypes.Template<SettlementRegistry, SettlementRegistry.Key, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:SettlementRegistry'> &
  damlTypes.ToInterface<SettlementRegistry, never> &
  SettlementRegistryInterface;

export declare namespace SettlementRegistry {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<SettlementRegistry, SettlementRegistry.Key, typeof SettlementRegistry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SettlementRegistry, typeof SettlementRegistry.templateId>
  export type Event = damlLedger.Event<SettlementRegistry, SettlementRegistry.Key, typeof SettlementRegistry.templateId>
  export type QueryResult = damlLedger.QueryResult<SettlementRegistry, SettlementRegistry.Key, typeof SettlementRegistry.templateId>
}



export declare type DeactivateOccurrenceRegistration = {
  deactivateTime: damlTypes.Time;
};

export declare const DeactivateOccurrenceRegistration:
  damlTypes.Serializable<DeactivateOccurrenceRegistration> & {
  }
;


export declare type OccurrenceRegistry = {
  registrar: damlTypes.Party;
  cedant: damlTypes.Party;
  audit: damlTypes.Party;
  occurrenceRef: string;
  registeredAt: damlTypes.Time;
  isActive: boolean;
};

export declare interface OccurrenceRegistryInterface {
  DeactivateOccurrenceRegistration: damlTypes.Choice<OccurrenceRegistry, DeactivateOccurrenceRegistration, damlTypes.ContractId<OccurrenceRegistry>, OccurrenceRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<OccurrenceRegistry, OccurrenceRegistry.Key>>;
  Archive: damlTypes.Choice<OccurrenceRegistry, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, OccurrenceRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<OccurrenceRegistry, OccurrenceRegistry.Key>>;
}
export declare const OccurrenceRegistry:
  damlTypes.Template<OccurrenceRegistry, OccurrenceRegistry.Key, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:OccurrenceRegistry'> &
  damlTypes.ToInterface<OccurrenceRegistry, never> &
  OccurrenceRegistryInterface;

export declare namespace OccurrenceRegistry {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<OccurrenceRegistry, OccurrenceRegistry.Key, typeof OccurrenceRegistry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OccurrenceRegistry, typeof OccurrenceRegistry.templateId>
  export type Event = damlLedger.Event<OccurrenceRegistry, OccurrenceRegistry.Key, typeof OccurrenceRegistry.templateId>
  export type QueryResult = damlLedger.QueryResult<OccurrenceRegistry, OccurrenceRegistry.Key, typeof OccurrenceRegistry.templateId>
}



export declare type DeactivateAllocationRegistration = {
  deactivateTime: damlTypes.Time;
  reason: string;
};

export declare const DeactivateAllocationRegistration:
  damlTypes.Serializable<DeactivateAllocationRegistration> & {
  }
;


export declare type AllocationRegistry = {
  registrar: damlTypes.Party;
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  audit: damlTypes.Party;
  claimRef: string;
  treatyRef: string;
  treatyVersion: damlTypes.Int;
  allocationRef: string;
  registeredAt: damlTypes.Time;
  isActive: boolean;
};

export declare interface AllocationRegistryInterface {
  DeactivateAllocationRegistration: damlTypes.Choice<AllocationRegistry, DeactivateAllocationRegistration, damlTypes.ContractId<AllocationRegistry>, AllocationRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationRegistry, AllocationRegistry.Key>>;
  Archive: damlTypes.Choice<AllocationRegistry, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AllocationRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationRegistry, AllocationRegistry.Key>>;
}
export declare const AllocationRegistry:
  damlTypes.Template<AllocationRegistry, AllocationRegistry.Key, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:AllocationRegistry'> &
  damlTypes.ToInterface<AllocationRegistry, never> &
  AllocationRegistryInterface;

export declare namespace AllocationRegistry {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4<damlTypes.Party, string, string, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<AllocationRegistry, AllocationRegistry.Key, typeof AllocationRegistry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AllocationRegistry, typeof AllocationRegistry.templateId>
  export type Event = damlLedger.Event<AllocationRegistry, AllocationRegistry.Key, typeof AllocationRegistry.templateId>
  export type QueryResult = damlLedger.QueryResult<AllocationRegistry, AllocationRegistry.Key, typeof AllocationRegistry.templateId>
}



export declare type DeactivateClaimRegistration = {
  deactivateTime: damlTypes.Time;
  reason: string;
};

export declare const DeactivateClaimRegistration:
  damlTypes.Serializable<DeactivateClaimRegistration> & {
  }
;


export declare type ClaimRegistry = {
  registrar: damlTypes.Party;
  cedant: damlTypes.Party;
  audit: damlTypes.Party;
  claimRef: string;
  policyRef: string;
  registeredAt: damlTypes.Time;
  isActive: boolean;
};

export declare interface ClaimRegistryInterface {
  DeactivateClaimRegistration: damlTypes.Choice<ClaimRegistry, DeactivateClaimRegistration, damlTypes.ContractId<ClaimRegistry>, ClaimRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimRegistry, ClaimRegistry.Key>>;
  Archive: damlTypes.Choice<ClaimRegistry, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, ClaimRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ClaimRegistry, ClaimRegistry.Key>>;
}
export declare const ClaimRegistry:
  damlTypes.Template<ClaimRegistry, ClaimRegistry.Key, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:ClaimRegistry'> &
  damlTypes.ToInterface<ClaimRegistry, never> &
  ClaimRegistryInterface;

export declare namespace ClaimRegistry {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<ClaimRegistry, ClaimRegistry.Key, typeof ClaimRegistry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClaimRegistry, typeof ClaimRegistry.templateId>
  export type Event = damlLedger.Event<ClaimRegistry, ClaimRegistry.Key, typeof ClaimRegistry.templateId>
  export type QueryResult = damlLedger.QueryResult<ClaimRegistry, ClaimRegistry.Key, typeof ClaimRegistry.templateId>
}


