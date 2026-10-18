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


exports.AddAdjustmentEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
  };
}
,
};



exports.ApproveAdjustment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({approver: damlTypes.Party.decoder, approvalTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    approver: damlTypes.Party.encode(__typed__.approver),
    approvalTime: damlTypes.Time.encode(__typed__.approvalTime),
  };
}
,
};



exports.RecoveryAdjustment = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.Disputes:RecoveryAdjustment',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operations: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, adjustmentRef: damlTypes.Text.decoder, allocationRef: damlTypes.Text.decoder, cycleRef: damlTypes.Text.decoder, claimRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, adjustmentType: ReSure_Types.AdjustmentType.decoder, originalAmount: ReSure_Types.MonetaryAmount.decoder, adjustmentAmount: ReSure_Types.MonetaryAmount.decoder, revisedAmount: ReSure_Types.MonetaryAmount.decoder, reason: damlTypes.Text.decoder, calculationEvidence: ReSure_Types.CalculationEvidence.decoder, predecessorRef: damlTypes.Optional(damlTypes.Text).decoder, predecessorVersion: damlTypes.Int.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, isApproved: damlTypes.Bool.decoder, approvedAt: damlTypes.Optional(damlTypes.Time).decoder, approvedBy: damlTypes.Optional(damlTypes.Party).decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operations: damlTypes.Party.encode(__typed__.operations),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    audit: damlTypes.Party.encode(__typed__.audit),
    adjustmentRef: damlTypes.Text.encode(__typed__.adjustmentRef),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    adjustmentType: ReSure_Types.AdjustmentType.encode(__typed__.adjustmentType),
    originalAmount: ReSure_Types.MonetaryAmount.encode(__typed__.originalAmount),
    adjustmentAmount: ReSure_Types.MonetaryAmount.encode(__typed__.adjustmentAmount),
    revisedAmount: ReSure_Types.MonetaryAmount.encode(__typed__.revisedAmount),
    reason: damlTypes.Text.encode(__typed__.reason),
    calculationEvidence: ReSure_Types.CalculationEvidence.encode(__typed__.calculationEvidence),
    predecessorRef: damlTypes.Optional(damlTypes.Text).encode(__typed__.predecessorRef),
    predecessorVersion: damlTypes.Int.encode(__typed__.predecessorVersion),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    isApproved: damlTypes.Bool.encode(__typed__.isApproved),
    approvedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.approvedAt),
    approvedBy: damlTypes.Optional(damlTypes.Party).encode(__typed__.approvedBy),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  ApproveAdjustment: {
    template: function () { return exports.RecoveryAdjustment; },
    choiceName: 'ApproveAdjustment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveAdjustment.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveAdjustment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoveryAdjustment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoveryAdjustment).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RecoveryAdjustment; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AddAdjustmentEvidence: {
    template: function () { return exports.RecoveryAdjustment; },
    choiceName: 'AddAdjustmentEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddAdjustmentEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddAdjustmentEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RecoveryAdjustment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RecoveryAdjustment).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RecoveryAdjustment, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.AddDisputeEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, submitter: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
    submitter: damlTypes.Party.encode(__typed__.submitter),
  };
}
,
};



exports.WithdrawDispute = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({withdrawalReason: damlTypes.Text.decoder, withdrawTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    withdrawalReason: damlTypes.Text.encode(__typed__.withdrawalReason),
    withdrawTime: damlTypes.Time.encode(__typed__.withdrawTime),
  };
}
,
};



exports.EscalateDispute = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({escalationReason: damlTypes.Text.decoder, escalateTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    escalationReason: damlTypes.Text.encode(__typed__.escalationReason),
    escalateTime: damlTypes.Time.encode(__typed__.escalateTime),
  };
}
,
};



exports.ResolveDispute = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({resolutionText: damlTypes.Text.decoder, finalAmount: ReSure_Types.MonetaryAmount.decoder, resolveTime: damlTypes.Time.decoder, resolver: damlTypes.Party.decoder, resolutionEvidence: damlTypes.List(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    resolutionText: damlTypes.Text.encode(__typed__.resolutionText),
    finalAmount: ReSure_Types.MonetaryAmount.encode(__typed__.finalAmount),
    resolveTime: damlTypes.Time.encode(__typed__.resolveTime),
    resolver: damlTypes.Party.encode(__typed__.resolver),
    resolutionEvidence: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.resolutionEvidence),
  };
}
,
};



exports.SubmitDisputeForReview = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reviewTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    reviewTime: damlTypes.Time.encode(__typed__.reviewTime),
  };
}
,
};



exports.DisputeCase = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Allocation.Disputes:DisputeCase',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, disputeRef: damlTypes.Text.decoder, allocationRef: damlTypes.Text.decoder, cycleRef: damlTypes.Text.decoder, claimRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, disputedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, originalAmount: ReSure_Types.MonetaryAmount.decoder, reason: damlTypes.Text.decoder, supportingEvidence: damlTypes.List(ReSure_Types.EvidenceRef).decoder, disputeStatus: ReSure_Types.DisputeStatus.decoder, resolution: damlTypes.Optional(damlTypes.Text).decoder, resolvedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, resolvedAt: damlTypes.Optional(damlTypes.Time).decoder, resolvedBy: damlTypes.Optional(damlTypes.Party).decoder, raisedAt: damlTypes.Time.decoder, raisedBy: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    disputeRef: damlTypes.Text.encode(__typed__.disputeRef),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    cycleRef: damlTypes.Text.encode(__typed__.cycleRef),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    disputedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.disputedAmount),
    originalAmount: ReSure_Types.MonetaryAmount.encode(__typed__.originalAmount),
    reason: damlTypes.Text.encode(__typed__.reason),
    supportingEvidence: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.supportingEvidence),
    disputeStatus: ReSure_Types.DisputeStatus.encode(__typed__.disputeStatus),
    resolution: damlTypes.Optional(damlTypes.Text).encode(__typed__.resolution),
    resolvedAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.resolvedAmount),
    resolvedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.resolvedAt),
    resolvedBy: damlTypes.Optional(damlTypes.Party).encode(__typed__.resolvedBy),
    raisedAt: damlTypes.Time.encode(__typed__.raisedAt),
    raisedBy: damlTypes.Party.encode(__typed__.raisedBy),
  };
}
,
  SubmitDisputeForReview: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'SubmitDisputeForReview',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SubmitDisputeForReview.decoder; }),
    argumentEncode: function (__typed__) { return exports.SubmitDisputeForReview.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisputeCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisputeCase).encode(__typed__); },
  },
  ResolveDispute: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'ResolveDispute',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ResolveDispute.decoder; }),
    argumentEncode: function (__typed__) { return exports.ResolveDispute.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisputeCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisputeCase).encode(__typed__); },
  },
  EscalateDispute: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'EscalateDispute',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.EscalateDispute.decoder; }),
    argumentEncode: function (__typed__) { return exports.EscalateDispute.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisputeCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisputeCase).encode(__typed__); },
  },
  WithdrawDispute: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'WithdrawDispute',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.WithdrawDispute.decoder; }),
    argumentEncode: function (__typed__) { return exports.WithdrawDispute.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisputeCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisputeCase).encode(__typed__); },
  },
  AddDisputeEvidence: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'AddDisputeEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddDisputeEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddDisputeEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisputeCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisputeCase).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DisputeCase; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DisputeCase, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

