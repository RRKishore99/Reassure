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


exports.WithdrawAllocationProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RequestInfoOnAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({infoRequest: damlTypes.Text.decoder, requestTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    infoRequest: damlTypes.Text.encode(__typed__.infoRequest),
    requestTime: damlTypes.Time.encode(__typed__.requestTime),
  };
}
,
};



exports.DisputeAllocationProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({disputeReason: damlTypes.Text.decoder, disputedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, disputeTime: damlTypes.Time.decoder, disputeEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    disputeReason: damlTypes.Text.encode(__typed__.disputeReason),
    disputedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.disputedAmount),
    disputeTime: damlTypes.Time.encode(__typed__.disputeTime),
    disputeEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).encode(__typed__.disputeEvidence),
  };
}
,
};



exports.AcceptAllocationProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({acceptTime: damlTypes.Time.decoder, acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    acceptTime: damlTypes.Time.encode(__typed__.acceptTime),
    acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).encode(__typed__.acceptEvidence),
  };
}
,
};



exports.AllocationProposal = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:AllocationProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, allocationRef: damlTypes.Text.decoder, cycleRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, claimRef: damlTypes.Text.decoder, occurrenceRef: damlTypes.Optional(damlTypes.Text).decoder, allocatedAmount: ReSure_Types.MonetaryAmount.decoder, linePercentage: damlTypes.Numeric(10).decoder, calculationEvidence: ReSure_Types.CalculationEvidence.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, proposedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    occurrenceRef: damlTypes.Optional(damlTypes.Text).encode(__typed__.occurrenceRef),
    allocatedAmount: ReSure_Types.MonetaryAmount.encode(__typed__.allocatedAmount),
    linePercentage: damlTypes.Numeric(10).encode(__typed__.linePercentage),
    calculationEvidence: ReSure_Types.CalculationEvidence.encode(__typed__.calculationEvidence),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    proposedAt: damlTypes.Time.encode(__typed__.proposedAt),
  };
}
,
  AcceptAllocationProposal: {
    template: function () { return exports.AllocationProposal; },
    choiceName: 'AcceptAllocationProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptAllocationProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptAllocationProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  DisputeAllocationProposal: {
    template: function () { return exports.AllocationProposal; },
    choiceName: 'DisputeAllocationProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DisputeAllocationProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.DisputeAllocationProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  RequestInfoOnAllocation: {
    template: function () { return exports.AllocationProposal; },
    choiceName: 'RequestInfoOnAllocation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestInfoOnAllocation.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestInfoOnAllocation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AllocationProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  WithdrawAllocationProposal: {
    template: function () { return exports.AllocationProposal; },
    choiceName: 'WithdrawAllocationProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.WithdrawAllocationProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.WithdrawAllocationProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AllocationProposal, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.CancelAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cancellationReason: damlTypes.Text.decoder, cancelTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cancellationReason: damlTypes.Text.encode(__typed__.cancellationReason),
    cancelTime: damlTypes.Time.encode(__typed__.cancelTime),
  };
}
,
};



exports.FinalizeAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({finalizeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    finalizeTime: damlTypes.Time.encode(__typed__.finalizeTime),
  };
}
,
};



exports.RecordReinsurerDecision = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({decision: ReSure_Types.DecisionType.decoder, decisionTime: damlTypes.Time.decoder, decisionEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    decision: ReSure_Types.DecisionType.encode(__typed__.decision),
    decisionTime: damlTypes.Time.encode(__typed__.decisionTime),
    decisionEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).encode(__typed__.decisionEvidence),
  };
}
,
};



exports.RecoverableAllocation = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:RecoverableAllocation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, allocationRef: damlTypes.Text.decoder, cycleRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, claimRef: damlTypes.Text.decoder, occurrenceRef: damlTypes.Optional(damlTypes.Text).decoder, allocatedAmount: ReSure_Types.MonetaryAmount.decoder, linePercentage: damlTypes.Numeric(10).decoder, calculationEvidence: ReSure_Types.CalculationEvidence.decoder, reinsurerDecision: damlTypes.Optional(ReSure_Types.DecisionType).decoder, decisionAt: damlTypes.Optional(damlTypes.Time).decoder, isFinalized: damlTypes.Bool.decoder, isCancelled: damlTypes.Bool.decoder, createdAt: damlTypes.Time.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    occurrenceRef: damlTypes.Optional(damlTypes.Text).encode(__typed__.occurrenceRef),
    allocatedAmount: ReSure_Types.MonetaryAmount.encode(__typed__.allocatedAmount),
    linePercentage: damlTypes.Numeric(10).encode(__typed__.linePercentage),
    calculationEvidence: ReSure_Types.CalculationEvidence.encode(__typed__.calculationEvidence),
    reinsurerDecision: damlTypes.Optional(ReSure_Types.DecisionType).encode(__typed__.reinsurerDecision),
    decisionAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.decisionAt),
    isFinalized: damlTypes.Bool.encode(__typed__.isFinalized),
    isCancelled: damlTypes.Bool.encode(__typed__.isCancelled),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
  };
}
,
  RecordReinsurerDecision: {
    template: function () { return exports.RecoverableAllocation; },
    choiceName: 'RecordReinsurerDecision',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RecordReinsurerDecision.decoder; }),
    argumentEncode: function (__typed__) { return exports.RecordReinsurerDecision.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  FinalizeAllocation: {
    template: function () { return exports.RecoverableAllocation; },
    choiceName: 'FinalizeAllocation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FinalizeAllocation.decoder; }),
    argumentEncode: function (__typed__) { return exports.FinalizeAllocation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  CancelAllocation: {
    template: function () { return exports.RecoverableAllocation; },
    choiceName: 'CancelAllocation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelAllocation.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelAllocation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoverableAllocation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoverableAllocation).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RecoverableAllocation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RecoverableAllocation, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.MarkAllocationAdjusted = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({adjustmentTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    adjustmentTime: damlTypes.Time.encode(__typed__.adjustmentTime),
  };
}
,
};



exports.MarkAllocationDisputed = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({disputeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    disputeTime: damlTypes.Time.encode(__typed__.disputeTime),
  };
}
,
};



exports.FinalizeAllocationCycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({finalizeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    finalizeTime: damlTypes.Time.encode(__typed__.finalizeTime),
  };
}
,
};



exports.AllocationCycle = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.AllocationCycle:AllocationCycle',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operations: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, cycleRef: damlTypes.Text.decoder, claimRefs: damlTypes.List(damlTypes.Text).decoder, occurrenceRef: damlTypes.Optional(damlTypes.Text).decoder, assessmentRef: damlTypes.Text.decoder, assessmentVersion: damlTypes.Int.decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, treatyType: ReSure_Types.TreatyType.decoder, eligibleLoss: ReSure_Types.MonetaryAmount.decoder, calculatedRecoverable: ReSure_Types.MonetaryAmount.decoder, calculationEvidence: ReSure_Types.CalculationEvidence.decoder, currency: ReSure_Types.Currency.decoder, allocationStatus: ReSure_Types.AllocationStatus.decoder, createdAt: damlTypes.Time.decoder, finalizedAt: damlTypes.Optional(damlTypes.Time).decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    operations: damlTypes.Party.encode(__typed__.operations),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    broker: damlTypes.Party.encode(__typed__.broker),
    audit: damlTypes.Party.encode(__typed__.audit),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    claimRefs: damlTypes.List(damlTypes.Text).encode(__typed__.claimRefs),
    occurrenceRef: damlTypes.Optional(damlTypes.Text).encode(__typed__.occurrenceRef),
    assessmentRef: damlTypes.Text.encode(__typed__.assessmentRef),
    assessmentVersion: damlTypes.Int.encode(__typed__.assessmentVersion),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    treatyType: ReSure_Types.TreatyType.encode(__typed__.treatyType),
    eligibleLoss: ReSure_Types.MonetaryAmount.encode(__typed__.eligibleLoss),
    calculatedRecoverable: ReSure_Types.MonetaryAmount.encode(__typed__.calculatedRecoverable),
    calculationEvidence: ReSure_Types.CalculationEvidence.encode(__typed__.calculationEvidence),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    allocationStatus: ReSure_Types.AllocationStatus.encode(__typed__.allocationStatus),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    finalizedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.finalizedAt),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
  };
}
,
  FinalizeAllocationCycle: {
    template: function () { return exports.AllocationCycle; },
    choiceName: 'FinalizeAllocationCycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FinalizeAllocationCycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.FinalizeAllocationCycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationCycle).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationCycle).encode(__typed__); },
  },
  MarkAllocationDisputed: {
    template: function () { return exports.AllocationCycle; },
    choiceName: 'MarkAllocationDisputed',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkAllocationDisputed.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkAllocationDisputed.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationCycle).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationCycle).encode(__typed__); },
  },
  MarkAllocationAdjusted: {
    template: function () { return exports.AllocationCycle; },
    choiceName: 'MarkAllocationAdjusted',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkAllocationAdjusted.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkAllocationAdjusted.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationCycle).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationCycle).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AllocationCycle; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AllocationCycle, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

