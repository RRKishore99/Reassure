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


exports.ApprovalState = {
  ApprovalPending: 'ApprovalPending',
  ApprovalEffective: 'ApprovalEffective',
  ApprovalSuperseded: 'ApprovalSuperseded',
  ApprovalTerminated: 'ApprovalTerminated',
  keys: ['ApprovalPending','ApprovalEffective','ApprovalSuperseded','ApprovalTerminated',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.ApprovalState.ApprovalPending), jtv.constant(exports.ApprovalState.ApprovalEffective), jtv.constant(exports.ApprovalState.ApprovalSuperseded), jtv.constant(exports.ApprovalState.ApprovalTerminated)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.AdjustmentType = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('SalvageRecovery'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('SubrogationRecovery'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('RevisedAssessment'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('CorrectedCalculation'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('ContractualAdjustment'), value: damlTypes.Text.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'SalvageRecovery': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'SubrogationRecovery': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'RevisedAssessment': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'CorrectedCalculation': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'ContractualAdjustment': return {tag: __typed__.tag, value: damlTypes.Text.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type AdjustmentType';
  }
}
,
};



exports.CalculationEvidence = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({formula: damlTypes.Text.decoder, inputs: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).decoder, intermediates: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).decoder, roundingRule: exports.RoundingRule.decoder, result: damlTypes.Numeric(10).decoder, calculatedAt: damlTypes.Time.decoder, calculatedBy: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    formula: damlTypes.Text.encode(__typed__.formula),
    inputs: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).encode(__typed__.inputs),
    intermediates: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).encode(__typed__.intermediates),
    roundingRule: exports.RoundingRule.encode(__typed__.roundingRule),
    result: damlTypes.Numeric(10).encode(__typed__.result),
    calculatedAt: damlTypes.Time.encode(__typed__.calculatedAt),
    calculatedBy: damlTypes.Party.encode(__typed__.calculatedBy),
  };
}
,
};



exports.RoundingRule = {
  RoundHalfUp: 'RoundHalfUp',
  RoundHalfDown: 'RoundHalfDown',
  RoundHalfEven: 'RoundHalfEven',
  RoundDown: 'RoundDown',
  ResidualToLeadReinsurer: 'ResidualToLeadReinsurer',
  keys: ['RoundHalfUp','RoundHalfDown','RoundHalfEven','RoundDown','ResidualToLeadReinsurer',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.RoundingRule.RoundHalfUp), jtv.constant(exports.RoundingRule.RoundHalfDown), jtv.constant(exports.RoundingRule.RoundHalfEven), jtv.constant(exports.RoundingRule.RoundDown), jtv.constant(exports.RoundingRule.ResidualToLeadReinsurer)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.DateRange = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({startDate: damlTypes.Date.decoder, endDate: damlTypes.Date.decoder, }); }),
  encode: function (__typed__) {
  return {
    startDate: damlTypes.Date.encode(__typed__.startDate),
    endDate: damlTypes.Date.encode(__typed__.endDate),
  };
}
,
};



exports.MonetaryAmount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, currency: exports.Currency.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    currency: exports.Currency.encode(__typed__.currency),
  };
}
,
};



exports.EvidenceRef = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({documentId: damlTypes.Text.decoder, documentType: exports.DocumentType.decoder, contentHash: damlTypes.Text.decoder, version: damlTypes.Int.decoder, uploadedAt: damlTypes.Time.decoder, uploadedBy: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    documentId: damlTypes.Text.encode(__typed__.documentId),
    documentType: exports.DocumentType.encode(__typed__.documentType),
    contentHash: damlTypes.Text.encode(__typed__.contentHash),
    version: damlTypes.Int.encode(__typed__.version),
    uploadedAt: damlTypes.Time.encode(__typed__.uploadedAt),
    uploadedBy: damlTypes.Party.encode(__typed__.uploadedBy),
  };
}
,
};



exports.DocumentType = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('PolicySchedule'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('ClaimNotification'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('LossAdjusterReport'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('SalvageReport'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('SubrogationReport'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('TreatySlip'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('EndorsementSlip'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('BordereauExtract'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('PaymentAdvice'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('SettlementConfirmation'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('AuditReport'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('OtherDocument'), value: damlTypes.Text.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'PolicySchedule': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'ClaimNotification': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'LossAdjusterReport': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'SalvageReport': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'SubrogationReport': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'TreatySlip': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'EndorsementSlip': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'BordereauExtract': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'PaymentAdvice': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'SettlementConfirmation': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'AuditReport': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'OtherDocument': return {tag: __typed__.tag, value: damlTypes.Text.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type DocumentType';
  }
}
,
};



exports.DisputeStatus = {
  DisputeRaised: 'DisputeRaised',
  DisputeUnderReview: 'DisputeUnderReview',
  DisputeResolved: 'DisputeResolved',
  DisputeEscalated: 'DisputeEscalated',
  DisputeWithdrawn: 'DisputeWithdrawn',
  keys: ['DisputeRaised','DisputeUnderReview','DisputeResolved','DisputeEscalated','DisputeWithdrawn',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.DisputeStatus.DisputeRaised), jtv.constant(exports.DisputeStatus.DisputeUnderReview), jtv.constant(exports.DisputeStatus.DisputeResolved), jtv.constant(exports.DisputeStatus.DisputeEscalated), jtv.constant(exports.DisputeStatus.DisputeWithdrawn)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.SettlementStatus = {
  SettlementPending: 'SettlementPending',
  SettlementInstructed: 'SettlementInstructed',
  SettlementConfirmed: 'SettlementConfirmed',
  SettlementPartiallyPaid: 'SettlementPartiallyPaid',
  SettlementReconciled: 'SettlementReconciled',
  SettlementOverdue: 'SettlementOverdue',
  keys: ['SettlementPending','SettlementInstructed','SettlementConfirmed','SettlementPartiallyPaid','SettlementReconciled','SettlementOverdue',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.SettlementStatus.SettlementPending), jtv.constant(exports.SettlementStatus.SettlementInstructed), jtv.constant(exports.SettlementStatus.SettlementConfirmed), jtv.constant(exports.SettlementStatus.SettlementPartiallyPaid), jtv.constant(exports.SettlementStatus.SettlementReconciled), jtv.constant(exports.SettlementStatus.SettlementOverdue)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.DecisionType = {
  DecisionAccept: 'DecisionAccept',
  DecisionDispute: 'DecisionDispute',
  DecisionRequestInfo: 'DecisionRequestInfo',
  keys: ['DecisionAccept','DecisionDispute','DecisionRequestInfo',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.DecisionType.DecisionAccept), jtv.constant(exports.DecisionType.DecisionDispute), jtv.constant(exports.DecisionType.DecisionRequestInfo)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.AllocationStatus = {
  AllocationProposed: 'AllocationProposed',
  AllocationPendingReinsurer: 'AllocationPendingReinsurer',
  AllocationAccepted: 'AllocationAccepted',
  AllocationDisputed: 'AllocationDisputed',
  AllocationFinalized: 'AllocationFinalized',
  AllocationAdjusted: 'AllocationAdjusted',
  keys: ['AllocationProposed','AllocationPendingReinsurer','AllocationAccepted','AllocationDisputed','AllocationFinalized','AllocationAdjusted',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AllocationStatus.AllocationProposed), jtv.constant(exports.AllocationStatus.AllocationPendingReinsurer), jtv.constant(exports.AllocationStatus.AllocationAccepted), jtv.constant(exports.AllocationStatus.AllocationDisputed), jtv.constant(exports.AllocationStatus.AllocationFinalized), jtv.constant(exports.AllocationStatus.AllocationAdjusted)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.AssessmentStatus = {
  AssessmentDraft: 'AssessmentDraft',
  AssessmentSubmitted: 'AssessmentSubmitted',
  AssessmentApproved: 'AssessmentApproved',
  AssessmentRejected: 'AssessmentRejected',
  AssessmentSuperseded: 'AssessmentSuperseded',
  keys: ['AssessmentDraft','AssessmentSubmitted','AssessmentApproved','AssessmentRejected','AssessmentSuperseded',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AssessmentStatus.AssessmentDraft), jtv.constant(exports.AssessmentStatus.AssessmentSubmitted), jtv.constant(exports.AssessmentStatus.AssessmentApproved), jtv.constant(exports.AssessmentStatus.AssessmentRejected), jtv.constant(exports.AssessmentStatus.AssessmentSuperseded)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.ClaimStatus = {
  ClaimSubmitted: 'ClaimSubmitted',
  ClaimUnderAssessment: 'ClaimUnderAssessment',
  ClaimAssessed: 'ClaimAssessed',
  ClaimAllocated: 'ClaimAllocated',
  ClaimPartiallySettled: 'ClaimPartiallySettled',
  ClaimFullySettled: 'ClaimFullySettled',
  ClaimClosed: 'ClaimClosed',
  ClaimReopened: 'ClaimReopened',
  keys: ['ClaimSubmitted','ClaimUnderAssessment','ClaimAssessed','ClaimAllocated','ClaimPartiallySettled','ClaimFullySettled','ClaimClosed','ClaimReopened',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.ClaimStatus.ClaimSubmitted), jtv.constant(exports.ClaimStatus.ClaimUnderAssessment), jtv.constant(exports.ClaimStatus.ClaimAssessed), jtv.constant(exports.ClaimStatus.ClaimAllocated), jtv.constant(exports.ClaimStatus.ClaimPartiallySettled), jtv.constant(exports.ClaimStatus.ClaimFullySettled), jtv.constant(exports.ClaimStatus.ClaimClosed), jtv.constant(exports.ClaimStatus.ClaimReopened)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.LossBasis = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('GrossLoss'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('NetOfDeductible'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('NetOfSalvageSubrogation'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('NetOfAll'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('CustomBasis'), value: damlTypes.Text.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'GrossLoss': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'NetOfDeductible': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'NetOfSalvageSubrogation': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'NetOfAll': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'CustomBasis': return {tag: __typed__.tag, value: damlTypes.Text.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type LossBasis';
  }
}
,
};



exports.TreatyType = {
  QuotaShare: 'QuotaShare',
  ExcessOfLoss: 'ExcessOfLoss',
  SurplusShare: 'SurplusShare',
  StopLoss: 'StopLoss',
  keys: ['QuotaShare','ExcessOfLoss','SurplusShare','StopLoss',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.TreatyType.QuotaShare), jtv.constant(exports.TreatyType.ExcessOfLoss), jtv.constant(exports.TreatyType.SurplusShare), jtv.constant(exports.TreatyType.StopLoss)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.Currency = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('USD'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('EUR'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('GBP'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('CHF'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('JPY'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('CAD'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('AUD'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('SGD'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('HKD'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('Other'), value: damlTypes.Text.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'USD': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'EUR': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'GBP': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'CHF': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'JPY': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'CAD': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'AUD': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'SGD': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'HKD': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'Other': return {tag: __typed__.tag, value: damlTypes.Text.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Currency';
  }
}
,
};

