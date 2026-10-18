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


exports.TestParties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cedant: damlTypes.Party.decoder, reinsurer1: damlTypes.Party.decoder, reinsurer2: damlTypes.Party.decoder, broker: damlTypes.Party.decoder, adjuster: damlTypes.Party.decoder, operations: damlTypes.Party.decoder, audit: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    cedant: damlTypes.Party.encode(__typed__.cedant),
    reinsurer1: damlTypes.Party.encode(__typed__.reinsurer1),
    reinsurer2: damlTypes.Party.encode(__typed__.reinsurer2),
    broker: damlTypes.Party.encode(__typed__.broker),
    adjuster: damlTypes.Party.encode(__typed__.adjuster),
    operations: damlTypes.Party.encode(__typed__.operations),
    audit: damlTypes.Party.encode(__typed__.audit),
  };
}
,
};

