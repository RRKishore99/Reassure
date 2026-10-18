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


exports.AddTreatyEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({evidence: ReSure_Types.EvidenceRef.decoder, }); }),
  encode: function (__typed__) {
  return {
    evidence: ReSure_Types.EvidenceRef.encode(__typed__.evidence),
  };
}
,
};



exports.TerminateTreaty = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({terminationTime: damlTypes.Time.decoder, reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    terminationTime: damlTypes.Time.encode(__typed__.terminationTime),
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.SupersedeTreatyVersion = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newTreatyData: exports.TreatyVersion.decoder, amendmentTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    newTreatyData: exports.TreatyVersion.encode(__typed__.newTreatyData),
    amendmentTime: damlTypes.Time.encode(__typed__.amendmentTime),
  };
}
,
};



exports.ApproveTreaty = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({approver: damlTypes.Party.decoder, approvalTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    approver: damlTypes.Party.encode(__typed__.approver),
    approvalTime: damlTypes.Time.encode(__typed__.approvalTime),
  };
}
,
};



exports.TreatyVersion = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Treaty.TreatyVersion:TreatyVersion',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, treatyRef: damlTypes.Text.decoder, version: damlTypes.Int.decoder, treatyType: ReSure_Types.TreatyType.decoder, effectivePeriod: ReSure_Types.DateRange.decoder, coveredBusiness: damlTypes.Text.decoder, lossBasis: ReSure_Types.LossBasis.decoder, currency: ReSure_Types.Currency.decoder, cededPercentage: damlTypes.Optional(damlTypes.Numeric(10)).decoder, contractualCap: damlTypes.Optional(damlTypes.Numeric(10)).decoder, attachmentPoint: damlTypes.Optional(damlTypes.Numeric(10)).decoder, layerLimit: damlTypes.Optional(damlTypes.Numeric(10)).decoder, deductibleRules: damlTypes.Text.decoder, eligibleLossMethod: damlTypes.Text.decoder, approvalState: ReSure_Types.ApprovalState.decoder, evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).decoder, createdAt: damlTypes.Time.decoder, previousVersion: damlTypes.Optional(damlTypes.ContractId(exports.TreatyVersion)).decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    broker: damlTypes.Party.encode(__typed__.broker),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    version: damlTypes.Int.encode(__typed__.version),
    treatyType: ReSure_Types.TreatyType.encode(__typed__.treatyType),
    effectivePeriod: ReSure_Types.DateRange.encode(__typed__.effectivePeriod),
    coveredBusiness: damlTypes.Text.encode(__typed__.coveredBusiness),
    lossBasis: ReSure_Types.LossBasis.encode(__typed__.lossBasis),
    currency: ReSure_Types.Currency.encode(__typed__.currency),
    cededPercentage: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.cededPercentage),
    contractualCap: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.contractualCap),
    attachmentPoint: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.attachmentPoint),
    layerLimit: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.layerLimit),
    deductibleRules: damlTypes.Text.encode(__typed__.deductibleRules),
    eligibleLossMethod: damlTypes.Text.encode(__typed__.eligibleLossMethod),
    approvalState: ReSure_Types.ApprovalState.encode(__typed__.approvalState),
    evidenceRefs: damlTypes.List(ReSure_Types.EvidenceRef).encode(__typed__.evidenceRefs),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    previousVersion: damlTypes.Optional(damlTypes.ContractId(exports.TreatyVersion)).encode(__typed__.previousVersion),
  };
}
,
  ApproveTreaty: {
    template: function () { return exports.TreatyVersion; },
    choiceName: 'ApproveTreaty',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveTreaty.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveTreaty.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyVersion).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyVersion).encode(__typed__); },
  },
  SupersedeTreatyVersion: {
    template: function () { return exports.TreatyVersion; },
    choiceName: 'SupersedeTreatyVersion',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SupersedeTreatyVersion.decoder; }),
    argumentEncode: function (__typed__) { return exports.SupersedeTreatyVersion.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TreatyVersion), damlTypes.ContractId(exports.TreatyVersion)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TreatyVersion), damlTypes.ContractId(exports.TreatyVersion)).encode(__typed__); },
  },
  TerminateTreaty: {
    template: function () { return exports.TreatyVersion; },
    choiceName: 'TerminateTreaty',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateTreaty.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateTreaty.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyVersion).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyVersion).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TreatyVersion; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AddTreatyEvidence: {
    template: function () { return exports.TreatyVersion; },
    choiceName: 'AddTreatyEvidence',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddTreatyEvidence.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddTreatyEvidence.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TreatyVersion).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TreatyVersion).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TreatyVersion, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

