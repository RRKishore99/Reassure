// Generated from ReSure/Settlement/Settlement.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as ReSure_Types from '../../../ReSure/Types/module';

export declare type MarkFullyReconciled = {
  reconcileTime: damlTypes.Time;
};

export declare const MarkFullyReconciled:
  damlTypes.Serializable<MarkFullyReconciled> & {
  }
;


export declare type SettlementReconciliation = {
  operations: damlTypes.Party;
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  audit: damlTypes.Party;
  reconciliationRef: string;
  settlementRef: string;
  allocationRef: string;
  confirmedReference: string;
  sourceEvidence: ReSure_Types.EvidenceRef;
  confirmationTime: damlTypes.Time;
  reconciledAmount: ReSure_Types.MonetaryAmount;
  outstandingAmount: ReSure_Types.MonetaryAmount;
  reconciledBy: damlTypes.Party;
  isFullyReconciled: boolean;
  createdAt: damlTypes.Time;
};

export declare interface SettlementReconciliationInterface {
  Archive: damlTypes.Choice<SettlementReconciliation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<SettlementReconciliation, undefined>>;
  MarkFullyReconciled: damlTypes.Choice<SettlementReconciliation, MarkFullyReconciled, damlTypes.ContractId<SettlementReconciliation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<SettlementReconciliation, undefined>>;
}
export declare const SettlementReconciliation:
  damlTypes.Template<SettlementReconciliation, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Settlement.Settlement:SettlementReconciliation'> &
  damlTypes.ToInterface<SettlementReconciliation, never> &
  SettlementReconciliationInterface;

export declare namespace SettlementReconciliation {
  export type CreateEvent = damlLedger.CreateEvent<SettlementReconciliation, undefined, typeof SettlementReconciliation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SettlementReconciliation, typeof SettlementReconciliation.templateId>
  export type Event = damlLedger.Event<SettlementReconciliation, undefined, typeof SettlementReconciliation.templateId>
  export type QueryResult = damlLedger.QueryResult<SettlementReconciliation, undefined, typeof SettlementReconciliation.templateId>
}



export declare type AddPaymentEvidence = {
  evidence: ReSure_Types.EvidenceRef;
  submitter: damlTypes.Party;
};

export declare const AddPaymentEvidence:
  damlTypes.Serializable<AddPaymentEvidence> & {
  }
;


export declare type ReconcileSettlement = {
  reconciliationRef: string;
  reconcileTime: damlTypes.Time;
};

export declare const ReconcileSettlement:
  damlTypes.Serializable<ReconcileSettlement> & {
  }
;


export declare type MarkSettlementOverdue = {
  overdueTime: damlTypes.Time;
};

export declare const MarkSettlementOverdue:
  damlTypes.Serializable<MarkSettlementOverdue> & {
  }
;


export declare type ConfirmPayment = {
  confirmedAmount: ReSure_Types.MonetaryAmount;
  evidence: ReSure_Types.EvidenceRef;
  confirmTime: damlTypes.Time;
  confirmer: damlTypes.Party;
};

export declare const ConfirmPayment:
  damlTypes.Serializable<ConfirmPayment> & {
  }
;


export declare type InstructSettlement = {
  instructTime: damlTypes.Time;
};

export declare const InstructSettlement:
  damlTypes.Serializable<InstructSettlement> & {
  }
;


export declare type RecoverableSettlement = {
  cedant: damlTypes.Party;
  reinsurer: damlTypes.Party;
  broker: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
  settlementRef: string;
  allocationRef: string;
  cycleRef: string;
  claimRef: string;
  treatyRef: string;
  amountDue: ReSure_Types.MonetaryAmount;
  amountPaid: ReSure_Types.MonetaryAmount;
  amountOutstanding: ReSure_Types.MonetaryAmount;
  currency: ReSure_Types.Currency;
  dueDate: damlTypes.Optional<damlTypes.Date>;
  settlementStatus: ReSure_Types.SettlementStatus;
  isPartialSettlementPermitted: boolean;
  paymentEvidence: ReSure_Types.EvidenceRef[];
  reconciliationRefs: string[];
  createdAt: damlTypes.Time;
  lastUpdatedAt: damlTypes.Time;
};

export declare interface RecoverableSettlementInterface {
  InstructSettlement: damlTypes.Choice<RecoverableSettlement, InstructSettlement, damlTypes.ContractId<RecoverableSettlement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
  ConfirmPayment: damlTypes.Choice<RecoverableSettlement, ConfirmPayment, damlTypes.ContractId<RecoverableSettlement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
  MarkSettlementOverdue: damlTypes.Choice<RecoverableSettlement, MarkSettlementOverdue, damlTypes.ContractId<RecoverableSettlement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
  ReconcileSettlement: damlTypes.Choice<RecoverableSettlement, ReconcileSettlement, damlTypes.ContractId<RecoverableSettlement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
  AddPaymentEvidence: damlTypes.Choice<RecoverableSettlement, AddPaymentEvidence, damlTypes.ContractId<RecoverableSettlement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
  Archive: damlTypes.Choice<RecoverableSettlement, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RecoverableSettlement, undefined>>;
}
export declare const RecoverableSettlement:
  damlTypes.Template<RecoverableSettlement, undefined, '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Settlement.Settlement:RecoverableSettlement'> &
  damlTypes.ToInterface<RecoverableSettlement, never> &
  RecoverableSettlementInterface;

export declare namespace RecoverableSettlement {
  export type CreateEvent = damlLedger.CreateEvent<RecoverableSettlement, undefined, typeof RecoverableSettlement.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RecoverableSettlement, typeof RecoverableSettlement.templateId>
  export type Event = damlLedger.Event<RecoverableSettlement, undefined, typeof RecoverableSettlement.templateId>
  export type QueryResult = damlLedger.QueryResult<RecoverableSettlement, undefined, typeof RecoverableSettlement.templateId>
}


