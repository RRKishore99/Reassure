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

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var ReSure_Types = require('../../../ReSure/Types/module');


exports.AddOccurrenceEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
  };
}
,
};



exports.AddLateClaim = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claimRef: damlTypes.Text.decoder, correctionReason: damlTypes.Text.decoder, newAggregatedLoss: ReSure_Types.MonetaryAmount.decoder, correctionTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    correctionReason: damlTypes.Text.encode(__typed__.correctionReason),
    newAggregatedLoss: ReSure_Types.MonetaryAmount.encode(__typed__.newAggregatedLoss),
    correctionTime: damlTypes.Time.encode(__typed__.correctionTime),
  };
}
,
};



exports.FreezeOccurrence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({aggregatedLoss: ReSure_Types.MonetaryAmount.decoder, freezeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    aggregatedLoss: ReSure_Types.MonetaryAmount.encode(__typed__.aggregatedLoss),
    freezeTime: damlTypes.Time.encode(__typed__.freezeTime),
  };
}
,
};



exports.RemoveClaimFromOccurrence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claimRef: damlTypes.Text.decoder, removeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    removeTime: damlTypes.Time.encode(__typed__.removeTime),
  };
}
,
};



exports.AddClaimToOccurrence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claimRef: damlTypes.Text.decoder, addTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    addTime: damlTypes.Time.encode(__typed__.addTime),
  };
}
,
};



exports.LossOccurrence = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Assessment.LossAssessment:LossOccurrence',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, adjuster: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, occurrenceRef: damlTypes.Text.decoder, dateOfOccurrence: damlTypes.Date.decoder, description: damlTypes.Text.decoder, memberClaimRefs: damlTypes.List(damlTypes.Text).decoder, isFrozen: damlTypes.Bool.decoder, frozenAt: damlTypes.Optional(damlTypes.Time).decoder, totalEligibleLoss: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, currency: ReSure_Types.Currency.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    broker: damlTypes.Party.encode(__typed__.broker),
    adjuster: damlTypes.Party.encode(__typed__.adjuster),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    occurrenceRef: damlTypes.Text.encode(__typed__.occurrenceRef),
    dateOfOccurrence: damlTypes.Date.encode(__typed__.dateOfOccurrence),
    description: damlTypes.Text.encode(__typed__.description),
    memberClaimRefs: damlTypes.List(damlTypes.Text).encode(__typed__.memberClaimRefs),
    isFrozen: damlTypes.Bool.encode(__typed__.isFrozen),
    frozenAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.frozenAt),
    totalEligibleLoss: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.totalEligibleLoss),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  AddClaimToOccurrence: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'AddClaimToOccurrence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddClaimToOccurrence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddClaimToOccurrence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossOccurrence).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossOccurrence).encode(__typed__); },
  },
  RemoveClaimFromOccurrence: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'RemoveClaimFromOccurrence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RemoveClaimFromOccurrence.decoder; }),
    argumentEncode: function (__typed__) { return exports.RemoveClaimFromOccurrence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossOccurrence).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossOccurrence).encode(__typed__); },
  },
  FreezeOccurrence: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'FreezeOccurrence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FreezeOccurrence.decoder; }),
    argumentEncode: function (__typed__) { return exports.FreezeOccurrence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossOccurrence).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossOccurrence).encode(__typed__); },
  },
  AddLateClaim: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'AddLateClaim',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddLateClaim.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddLateClaim.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossOccurrence).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossOccurrence).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AddOccurrenceEvidence: {
    template: function () { return exports.LossOccurrence; },
    choiceName: 'AddOccurrenceEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddOccurrenceEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddOccurrenceEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossOccurrence).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossOccurrence).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LossOccurrence, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.AddAssessmentEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
  };
}
,
};



exports.SupersedeAssessment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({revisedAssessment: exports.LossAssessment.decoder, supersedTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    revisedAssessment: exports.LossAssessment.encode(__typed__.revisedAssessment),
    supersedTime: damlTypes.Time.encode(__typed__.supersedTime),
  };
}
,
};



exports.RejectAssessment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({rejector: damlTypes.Party.decoder, rejectionReason: damlTypes.Text.decoder, rejectTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    rejector: damlTypes.Party.encode(__typed__.rejector),
    rejectionReason: damlTypes.Text.encode(__typed__.rejectionReason),
    rejectTime: damlTypes.Time.encode(__typed__.rejectTime),
  };
}
,
};



exports.ApproveAssessment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({approver: damlTypes.Party.decoder, approvalTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    approver: damlTypes.Party.encode(__typed__.approver),
    approvalTime: damlTypes.Time.encode(__typed__.approvalTime),
  };
}
,
};



exports.SubmitAssessment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({submitTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    submitTime: damlTypes.Time.encode(__typed__.submitTime),
  };
}
,
};



exports.LossAssessment = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Assessment.LossAssessment:LossAssessment',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({adjuster: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, claimRef: damlTypes.Text.decoder, assessmentRef: damlTypes.Text.decoder, assessmentVersion: damlTypes.Int.decoder, assessedAmount: ReSure_Types.MonetaryAmount.decoder, deductibleAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, salvageAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, subrogationAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, otherRecoveries: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, eligibleLoss: ReSure_Types.MonetaryAmount.decoder, methodology: damlTypes.Text.decoder, lossBasisApplied: ReSure_Types.LossBasis.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, assessmentStatus: ReSure_Types.AssessmentStatus.decoder, submittedAt: damlTypes.Time.decoder, approvedAt: damlTypes.Optional(damlTypes.Time).decoder, approvedBy: damlTypes.Optional(damlTypes.Party).decoder, previousVersion: damlTypes.Optional(damlTypes.Text).decoder, notes: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    adjuster: damlTypes.Party.encode(__typed__.adjuster),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    assessmentRef: damlTypes.Text.encode(__typed__.assessmentRef),
    assessmentVersion: damlTypes.Int.encode(__typed__.assessmentVersion),
    assessedAmount: ReSure_Types.MonetaryAmount.encode(__typed__.assessedAmount),
    deductibleAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.deductibleAmount),
    salvageAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.salvageAmount),
    subrogationAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.subrogationAmount),
    otherRecoveries: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.otherRecoveries),
    eligibleLoss: ReSure_Types.MonetaryAmount.encode(__typed__.eligibleLoss),
    methodology: damlTypes.Text.encode(__typed__.methodology),
    lossBasisApplied: ReSure_Types.LossBasis.encode(__typed__.lossBasisApplied),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    assessmentStatus: ReSure_Types.AssessmentStatus.encode(__typed__.assessmentStatus),
    submittedAt: damlTypes.Time.encode(__typed__.submittedAt),
    approvedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.approvedAt),
    approvedBy: damlTypes.Optional(damlTypes.Party).encode(__typed__.approvedBy),
    previousVersion: damlTypes.Optional(damlTypes.Text).encode(__typed__.previousVersion),
    notes: damlTypes.Text.encode(__typed__.notes),
  };
}
,
  SubmitAssessment: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'SubmitAssessment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SubmitAssessment.decoder; }),
    argumentEncode: function (__typed__) { return exports.SubmitAssessment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossAssessment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossAssessment).encode(__typed__); },
  },
  ApproveAssessment: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'ApproveAssessment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveAssessment.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveAssessment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossAssessment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossAssessment).encode(__typed__); },
  },
  RejectAssessment: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'RejectAssessment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectAssessment.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectAssessment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossAssessment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossAssessment).encode(__typed__); },
  },
  SupersedeAssessment: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'SupersedeAssessment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SupersedeAssessment.decoder; }),
    argumentEncode: function (__typed__) { return exports.SupersedeAssessment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.LossAssessment), damlTypes.ContractId(exports.LossAssessment)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.LossAssessment), damlTypes.ContractId(exports.LossAssessment)).encode(__typed__); },
  },
  AddAssessmentEvidence: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'AddAssessmentEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddAssessmentEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddAssessmentEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LossAssessment).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LossAssessment).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.LossAssessment; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LossAssessment, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

