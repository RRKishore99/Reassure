"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var ReSure_Types = require('../../../ReSure/Types/module');


exports.MarkFullyReconciled = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reconcileTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    reconcileTime: damlTypes.Time.encode(__typed__.reconcileTime),
  };
}
,
};



exports.SettlementReconciliation = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Settlement.Settlement:SettlementReconciliation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operations: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, reconciliationRef: damlTypes.Text.decoder, settlementRef: damlTypes.Text.decoder, allocationRef: damlTypes.Text.decoder, confirmedReference: damlTypes.Text.decoder, sourceEvidence: ReSure_Types.EvidenceRef.decoder, confirmationTime: damlTypes.Time.decoder, reconciledAmount: ReSure_Types.MonetaryAmount.decoder, outstandingAmount: ReSure_Types.MonetaryAmount.decoder, reconciledBy: damlTypes.Party.decoder, isFullyReconciled: damlTypes.Bool.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operations: damlTypes.Party.encode(__typed__.operations),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    audit: damlTypes.Party.encode(__typed__.audit),
    reconciliationRef: damlTypes.Text.encode(__typed__.reconciliationRef),
    settlementRef: damlTypes.Text.encode(__typed__.settlementRef),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    confirmedReference: damlTypes.Text.encode(__typed__.confirmedReference),
    sourceEvidence: ReSure_Types.EvidenceRef.encode(__typed__.sourceEvidence),
    confirmationTime: damlTypes.Time.encode(__typed__.confirmationTime),
    reconciledAmount: ReSure_Types.MonetaryAmount.encode(__typed__.reconciledAmount),
    outstandingAmount: ReSure_Types.MonetaryAmount.encode(__typed__.outstandingAmount),
    reconciledBy: damlTypes.Party.encode(__typed__.reconciledBy),
    isFullyReconciled: damlTypes.Bool.encode(__typed__.isFullyReconciled),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  Archive: {
    template: function () { return exports.SettlementReconciliation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MarkFullyReconciled: {
    template: function () { return exports.SettlementReconciliation; },
    choiceName: 'MarkFullyReconciled',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkFullyReconciled.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkFullyReconciled.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.SettlementReconciliation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.SettlementReconciliation).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SettlementReconciliation, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.AddPaymentEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, submitter: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
    submitter: damlTypes.Party.encode(__typed__.submitter),
  };
}
,
};



exports.ReconcileSettlement = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reconciliationRef: damlTypes.Text.decoder, reconcileTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    reconciliationRef: damlTypes.Text.encode(__typed__.reconciliationRef),
    reconcileTime: damlTypes.Time.encode(__typed__.reconcileTime),
  };
}
,
};



exports.MarkSettlementOverdue = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({overdueTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    overdueTime: damlTypes.Time.encode(__typed__.overdueTime),
  };
}
,
};



exports.ConfirmPayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({confirmedAmount: ReSure_Types.MonetaryAmount.decoder, evidence: ReSure_Types.EvidenceRef.decoder, confirmTime: damlTypes.Time.decoder, confirmer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    confirmedAmount: ReSure_Types.MonetaryAmount.encode(__typed__.confirmedAmount),
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
    confirmTime: damlTypes.Time.encode(__typed__.confirmTime),
    confirmer: damlTypes.Party.encode(__typed__.confirmer),
  };
}
,
};



exports.InstructSettlement = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({instructTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    instructTime: damlTypes.Time.encode(__typed__.instructTime),
  };
}
,
};



exports.RecoverableSettlement = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Settlement.Settlement:RecoverableSettlement',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, settlementRef: damlTypes.Text.decoder, allocationRef: damlTypes.Text.decoder, cycleRef: damlTypes.Text.decoder, claimRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, amountDue: ReSure_Types.MonetaryAmount.decoder, amountPaid: ReSure_Types.MonetaryAmount.decoder, amountOutstanding: ReSure_Types.MonetaryAmount.decoder, currency: ReSure_Types.Currency.decoder, dueDate: damlTypes.Optional(damlTypes.Date).decoder, settlementStatus: ReSure_Types.SettlementStatus.decoder, isPartialSettlementPermitted: damlTypes.Bool.decoder, paymentEvidence: damlTypes.List(ReSure_Types.EvidenceRef).decoder, reconciliationRefs: damlTypes.List(damlTypes.Text).decoder, createdAt: damlTypes.Time.decoder, lastUpdatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    settlementRef: damlTypes.Text.encode(__typed__.settlementRef),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    amountDue: ReSure_Types.MonetaryAmount.encode(__typed__.amountDue),
    amountPaid: ReSure_Types.MonetaryAmount.encode(__typed__.amountPaid),
    amountOutstanding: ReSure_Types.MonetaryAmount.encode(__typed__.amountOutstanding),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    dueDate: damlTypes.Optional(damlTypes.Date).encode(__typed__.dueDate),
    settlementStatus: ReSure_Types.SettlementStatus.encode(__typed__.settlementStatus),
    isPartialSettlementPermitted: damlTypes.Bool.encode(__typed__.isPartialSettlementPermitted),
    paymentEvidence: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.paymentEvidence),
    reconciliationRefs: damlTypes.List(damlTypes.Text).encode(__typed__.reconciliationRefs),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    lastUpdatedAt: damlTypes.Time.encode(__typed__.lastUpdatedAt),
  };
}
,
  InstructSettlement: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'InstructSettlement',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.InstructSettlement.decoder; }),
    argumentEncode: function (__typed__) { return exports.InstructSettlement.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableSettlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableSettlement).encode(__typed__); },
  },
  ConfirmPayment: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'ConfirmPayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmPayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmPayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableSettlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableSettlement).encode(__typed__); },
  },
  MarkSettlementOverdue: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'MarkSettlementOverdue',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkSettlementOverdue.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkSettlementOverdue.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableSettlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableSettlement).encode(__typed__); },
  },
  ReconcileSettlement: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'ReconcileSettlement',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ReconcileSettlement.decoder; }),
    argumentEncode: function (__typed__) { return exports.ReconcileSettlement.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableSettlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableSettlement).encode(__typed__); },
  },
  AddPaymentEvidence: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'AddPaymentEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddPaymentEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddPaymentEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableSettlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableSettlement).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RecoverableSettlement; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RecoverableSettlement, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

