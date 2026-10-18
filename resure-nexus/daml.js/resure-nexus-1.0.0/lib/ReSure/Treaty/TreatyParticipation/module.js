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

var ReSure_Treaty_TreatyVersion = require('../../../ReSure/Treaty/TreatyVersion/module');
var ReSure_Types = require('../../../ReSure/Types/module');


exports.WithdrawProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RejectProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({rejectionReason: damlTypes.Text.decoder, rejectTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    rejectionReason: damlTypes.Text.encode(__typed__.rejectionReason),
    rejectTime: damlTypes.Time.encode(__typed__.rejectTime),
  };
}
,
};



exports.AcceptProposal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({acceptTime: damlTypes.Time.decoder, acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    acceptTime: damlTypes.Time.encode(__typed__.acceptTime),
    acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).encode(__typed__.acceptEvidence),
  };
}
,
};



exports.TreatyParticipationProposal = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyParticipation:TreatyParticipationProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, treatyVersionCid: damlTypes.ContractId(ReSure_Treaty_TreatyVersion.TreatyVersion).decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, proposedLinePercentage: damlTypes.Numeric(10).decoder, coveredLayer: damlTypes.Text.decoder, currency: ReSure_Types.Currency.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, proposedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    treatyVersionCid: damlTypes.ContractId(ReSure_Treaty_TreatyVersion.TreatyVersion).encode(__typed__.treatyVersionCid),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    proposedLinePercentage: damlTypes.Numeric(10).encode(__typed__.proposedLinePercentage),
    coveredLayer: damlTypes.Text.encode(__typed__.coveredLayer),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    proposedAt: damlTypes.Time.encode(__typed__.proposedAt),
  };
}
,
  AcceptProposal: {
    template: function () { return exports.TreatyParticipationProposal; },
    choiceName: 'AcceptProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyParticipation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyParticipation).encode(__typed__); },
  },
  RejectProposal: {
    template: function () { return exports.TreatyParticipationProposal; },
    choiceName: 'RejectProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TreatyParticipationProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  WithdrawProposal: {
    template: function () { return exports.TreatyParticipationProposal; },
    choiceName: 'WithdrawProposal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.WithdrawProposal.decoder; }),
    argumentEncode: function (__typed__) { return exports.WithdrawProposal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TreatyParticipationProposal, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.AddParticipationEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, submitter: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
    submitter: damlTypes.Party.encode(__typed__.submitter),
  };
}
,
};



exports.ViewParticipationTerms = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.AcceptParticipation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({acceptTime: damlTypes.Time.decoder, acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).decoder, }); }),
  encode: function (__typed__) {
  return {
    acceptTime: damlTypes.Time.encode(__typed__.acceptTime),
    acceptEvidence: damlTypes.Optional(ReSure_Types.EvidenceRef).encode(__typed__.acceptEvidence),
  };
}
,
};



exports.TreatyParticipation = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyParticipation:TreatyParticipation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, treatyVersionCid: damlTypes.ContractId(ReSure_Treaty_TreatyVersion.TreatyVersion).decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, linePercentage: damlTypes.Numeric(10).decoder, coveredLayer: damlTypes.Text.decoder, currency: ReSure_Types.Currency.decoder, isAccepted: damlTypes.Bool.decoder, acceptedAt: damlTypes.Optional(damlTypes.Time).decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    treatyVersionCid: damlTypes.ContractId(ReSure_Treaty_TreatyVersion.TreatyVersion).encode(__typed__.treatyVersionCid),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    linePercentage: damlTypes.Numeric(10).encode(__typed__.linePercentage),
    coveredLayer: damlTypes.Text.encode(__typed__.coveredLayer),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    isAccepted: damlTypes.Bool.encode(__typed__.isAccepted),
    acceptedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.acceptedAt),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  AcceptParticipation: {
    template: function () { return exports.TreatyParticipation; },
    choiceName: 'AcceptParticipation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptParticipation.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptParticipation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyParticipation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyParticipation).encode(__typed__); },
  },
  ViewParticipationTerms: {
    template: function () { return exports.TreatyParticipation; },
    choiceName: 'ViewParticipationTerms',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ViewParticipationTerms.decoder; }),
    argumentEncode: function (__typed__) { return exports.ViewParticipationTerms.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.TreatyParticipation.decoder; }),
    resultEncode: function (__typed__) { return exports.TreatyParticipation.encode(__typed__); },
  },
  AddParticipationEvidence: {
    template: function () { return exports.TreatyParticipation; },
    choiceName: 'AddParticipationEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddParticipationEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddParticipationEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyParticipation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyParticipation).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TreatyParticipation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TreatyParticipation, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

