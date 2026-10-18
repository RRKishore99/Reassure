// Generated from Test/ReSureTests.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type TestParties = {
  cedant: damlTypes.Party;
  reinsurer1: damlTypes.Party;
  reinsurer2: damlTypes.Party;
  broker: damlTypes.Party;
  adjuster: damlTypes.Party;
  operations: damlTypes.Party;
  audit: damlTypes.Party;
};

export declare const TestParties:
  damlTypes.Serializable<TestParties> & {
  }
;

