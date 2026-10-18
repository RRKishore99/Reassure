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


exports.DeactivateSettlementRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({deactivateTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    deactivateTime: damlTypes.Time.encode(__typed__.deactivateTime),
  };
}
,
};



exports.SettlementRegistry = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:SettlementRegistry',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({registrar: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, settlementRef: damlTypes.Text.decoder, allocationRef: damlTypes.Text.decoder, registeredAt: damlTypes.Time.decoder, isActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    registrar: damlTypes.Party.encode(__typed__.registrar),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    audit: damlTypes.Party.encode(__typed__.audit),
    settlementRef: damlTypes.Text.encode(__typed__.settlementRef),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    registeredAt: damlTypes.Time.encode(__typed__.registeredAt),
    isActive: damlTypes.Bool.encode(__typed__.isActive),
  };
}
,
  Archive: {
    template: function () { return exports.SettlementRegistry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  DeactivateSettlementRegistration: {
    template: function () { return exports.SettlementRegistry; },
    choiceName: 'DeactivateSettlementRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DeactivateSettlementRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.DeactivateSettlementRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.SettlementRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.SettlementRegistry).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SettlementRegistry, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.DeactivateOccurrenceRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({deactivateTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    deactivateTime: damlTypes.Time.encode(__typed__.deactivateTime),
  };
}
,
};



exports.OccurrenceRegistry = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:OccurrenceRegistry',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({registrar: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, occurrenceRef: damlTypes.Text.decoder, registeredAt: damlTypes.Time.decoder, isActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    registrar: damlTypes.Party.encode(__typed__.registrar),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    audit: damlTypes.Party.encode(__typed__.audit),
    occurrenceRef: damlTypes.Text.encode(__typed__.occurrenceRef),
    registeredAt: damlTypes.Time.encode(__typed__.registeredAt),
    isActive: damlTypes.Bool.encode(__typed__.isActive),
  };
}
,
  DeactivateOccurrenceRegistration: {
    template: function () { return exports.OccurrenceRegistry; },
    choiceName: 'DeactivateOccurrenceRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DeactivateOccurrenceRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.DeactivateOccurrenceRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OccurrenceRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OccurrenceRegistry).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.OccurrenceRegistry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.OccurrenceRegistry, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.DeactivateAllocationRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({deactivateTime: damlTypes.Time.decoder, reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    deactivateTime: damlTypes.Time.encode(__typed__.deactivateTime),
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.AllocationRegistry = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:AllocationRegistry',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.Party, damlTypes.Text, damlTypes.Text, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.Party, damlTypes.Text, damlTypes.Text, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({registrar: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, reinsurer: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, claimRef: damlTypes.Text.decoder, treatyRef: damlTypes.Text.decoder, treatyVersion: damlTypes.Int.decoder, allocationRef: damlTypes.Text.decoder, registeredAt: damlTypes.Time.decoder, isActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    registrar: damlTypes.Party.encode(__typed__.registrar),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer: damlTypes.Party.encode(__typed__.reinsurer),
    audit: damlTypes.Party.encode(__typed__.audit),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    treatyRef: damlTypes.Text.encode(__typed__.treatyRef),
    treatyVersion: damlTypes.Int.encode(__typed__.treatyVersion),
    allocationRef: damlTypes.Text.encode(__typed__.allocationRef),
    registeredAt: damlTypes.Time.encode(__typed__.registeredAt),
    isActive: damlTypes.Bool.encode(__typed__.isActive),
  };
}
,
  DeactivateAllocationRegistration: {
    template: function () { return exports.AllocationRegistry; },
    choiceName: 'DeactivateAllocationRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DeactivateAllocationRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.DeactivateAllocationRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationRegistry).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AllocationRegistry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AllocationRegistry, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);



exports.DeactivateClaimRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({deactivateTime: damlTypes.Time.decoder, reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    deactivateTime: damlTypes.Time.encode(__typed__.deactivateTime),
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.ClaimRegistry = damlTypes.assembleTemplate(
{
  templateId: '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a:ReSure.Registry.UniqueRegistry:ClaimRegistry',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({registrar: damlTypes.Party.decoder, cedant: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, claimRef: damlTypes.Text.decoder, policyRef: damlTypes.Text.decoder, registeredAt: damlTypes.Time.decoder, isActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    registrar: damlTypes.Party.encode(__typed__.registrar),
    cedant: damlTypes.Party.encode(__typed__.cedant),
    audit: damlTypes.Party.encode(__typed__.audit),
    claimRef: damlTypes.Text.encode(__typed__.claimRef),
    policyRef: damlTypes.Text.encode(__typed__.policyRef),
    registeredAt: damlTypes.Time.encode(__typed__.registeredAt),
    isActive: damlTypes.Bool.encode(__typed__.isActive),
  };
}
,
  DeactivateClaimRegistration: {
    template: function () { return exports.ClaimRegistry; },
    choiceName: 'DeactivateClaimRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DeactivateClaimRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.DeactivateClaimRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ClaimRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ClaimRegistry).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ClaimRegistry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ClaimRegistry, ['7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a', '7c7162be1056d706c3c443d1d331b816dcd749efe40723101efd2cbb088ef29a']);

