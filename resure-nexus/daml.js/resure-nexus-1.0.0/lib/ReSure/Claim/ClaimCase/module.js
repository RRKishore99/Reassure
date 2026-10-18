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


exports.SupersedeEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newHash: damlTypes.Text.decoder, newVersion: damlTypes.Int.decoder, updateTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    newHash: damlTypes.Text.encode(__typed__.newHash),
    newVersion: damlTypes.Int.encode(__typed__.newVersion),
    updateTime: damlTypes.Time.encode(__typed__.updateTime),
  };
}
,
};



exports.VerifyEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, verifyTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
    verifyTime: damlTypes.Time.encode(__typed__.verifyTime),
  };
}
,
};



exports.ClaimEvidenceManifest = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Claim.ClaimCase:ClaimEvidenceManifest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, claimRef: damlTypes.Text.decoder, documentType: ReSure_Types.DocumentType.decoder, contentHash: damlTypes.Text.decoder, documentVersion: damlTypes.Int.decoder, documentId: damlTypes.Text.decoder, uploadedAt: damlTypes.Time.decoder, uploadedBy: damlTypes.Party.decoder, verifiedAt: damlTypes.Optional(damlTypes.Time).decoder, verifiedBy: damlTypes.Optional(damlTypes.Party).decoder, description: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    documentType: ReSure_Types.DocumentType.encode(__typed__.documentType),
    contentHash: damlTypes.Text.encode(__typed__.contentHash),
    documentVersion: damlTypes.Int.encode(__typed__.documentVersion),
    documentId: damlTypes.Text.encode(__typed__.documentId),
    uploadedAt: damlTypes.Time.encode(__typed__.uploadedAt),
    uploadedBy: damlTypes.Party.encode(__typed__.uploadedBy),
    verifiedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.verifiedAt),
    verifiedBy: damlTypes.Optional(damlTypes.Party).encode(__typed__.verifiedBy),
    description: damlTypes.Text.encode(__typed__.description),
  };
}
,
  VerifyEvidence: {
    template: function () { return exports.ClaimEvidenceManifest; },
    choiceName: 'VerifyEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.VerifyEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.VerifyEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimEvidenceManifest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimEvidenceManifest).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ClaimEvidenceManifest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  SupersedeEvidence: {
    template: function () { return exports.ClaimEvidenceManifest; },
    choiceName: 'SupersedeEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SupersedeEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.SupersedeEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimEvidenceManifest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimEvidenceManifest).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ClaimEvidenceManifest, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.UpdateClaimAmount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newGrossAmount: ReSure_Types.MonetaryAmount.decoder, newNetAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, updateTime: damlTypes.Time.decoder, updateEvidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    newGrossAmount: ReSure_Types.MonetaryAmount.encode(__typed__.newGrossAmount),
    newNetAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.newNetAmount),
    updateTime: damlTypes.Time.encode(__typed__.updateTime),
    updateEvidence: ReSure_Types.EvidenceRef.encode(__typed__.updateEvidence),
  };
}
,
};



exports.AddClaimEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
  };
}
,
};



exports.ReopenClaim = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reopenTime: damlTypes.Time.decoder, reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    reopenTime: damlTypes.Time.encode(__typed__.reopenTime),
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.CloseClaim = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({closeTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    closeTime: damlTypes.Time.encode(__typed__.closeTime),
  };
}
,
};



exports.MarkClaimFullySettled = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({settlementTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    settlementTime: damlTypes.Time.encode(__typed__.settlementTime),
  };
}
,
};



exports.MarkClaimPartiallySettled = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({settlementTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    settlementTime: damlTypes.Time.encode(__typed__.settlementTime),
  };
}
,
};



exports.MarkClaimAllocated = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({allocationTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    allocationTime: damlTypes.Time.encode(__typed__.allocationTime),
  };
}
,
};



exports.MarkClaimAssessed = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assessmentTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    assessmentTime: damlTypes.Time.encode(__typed__.assessmentTime),
  };
}
,
};



exports.SubmitForAssessment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({submissionTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    submissionTime: damlTypes.Time.encode(__typed__.submissionTime),
  };
}
,
};



exports.ClaimCase = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Claim.ClaimCase:ClaimCase',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, adjuster: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, claimRef: damlTypes.Text.decoder, policyRef: damlTypes.Text.decoder, dateOfLoss: damlTypes.Date.decoder, occurrenceRef: damlTypes.Optional(damlTypes.Text).decoder, grossAmount: ReSure_Types.MonetaryAmount.decoder, netAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).decoder, applicableTreatyRefs: damlTypes.List(damlTypes.Text).decoder, claimStatus: ReSure_Types.ClaimStatus.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, submittedAt: damlTypes.Time.decoder, submittedBy: damlTypes.Party.decoder, lastUpdatedAt: damlTypes.Time.decoder, notes: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    broker: damlTypes.Party.encode(__typed__.broker),
    adjuster: damlTypes.Party.encode(__typed__.adjuster),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    policyRef: damlTypes.Text.encode(__typed__.policyRef),
    dateOfLoss: damlTypes.Date.encode(__typed__.dateOfLoss),
    occurrenceRef: damlTypes.Optional(damlTypes.Text).encode(__typed__.occurrenceRef),
    grossAmount: ReSure_Types.MonetaryAmount.encode(__typed__.grossAmount),
    netAmount: damlTypes.Optional(ReSure_Types.MonetaryAmount).encode(__typed__.netAmount),
    applicableTreatyRefs: damlTypes.List(damlTypes.Text).encode(__typed__.applicableTreatyRefs),
    claimStatus: ReSure_Types.ClaimStatus.encode(__typed__.claimStatus),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    submittedAt: damlTypes.Time.encode(__typed__.submittedAt),
    submittedBy: damlTypes.Party.encode(__typed__.submittedBy),
    lastUpdatedAt: damlTypes.Time.encode(__typed__.lastUpdatedAt),
    notes: damlTypes.Text.encode(__typed__.notes),
  };
}
,
  SubmitForAssessment: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'SubmitForAssessment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SubmitForAssessment.decoder; }),
    argumentEncode: function (__typed__) { return exports.SubmitForAssessment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  MarkClaimAssessed: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'MarkClaimAssessed',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkClaimAssessed.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkClaimAssessed.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  MarkClaimAllocated: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'MarkClaimAllocated',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkClaimAllocated.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkClaimAllocated.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  MarkClaimPartiallySettled: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'MarkClaimPartiallySettled',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkClaimPartiallySettled.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkClaimPartiallySettled.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  MarkClaimFullySettled: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'MarkClaimFullySettled',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkClaimFullySettled.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkClaimFullySettled.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  CloseClaim: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'CloseClaim',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CloseClaim.decoder; }),
    argumentEncode: function (__typed__) { return exports.CloseClaim.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  ReopenClaim: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'ReopenClaim',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ReopenClaim.decoder; }),
    argumentEncode: function (__typed__) { return exports.ReopenClaim.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  AddClaimEvidence: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'AddClaimEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddClaimEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddClaimEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  UpdateClaimAmount: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'UpdateClaimAmount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateClaimAmount.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateClaimAmount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimCase).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimCase).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ClaimCase; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ClaimCase, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

