/**
 * Canton / Daml JWT Token Minting for Authenticated Ledger API access
 */

import jwt from 'jsonwebtoken';
import { CantonConfig } from './config';

export interface DamlLedgerClaims {
  ledgerId?: string;
  applicationId: string;
  actAs: string[];
  readAs: string[];
  admin: boolean;
}

export function createPartyToken(
  party: string,
  readParties: string[],
  config: CantonConfig,
  isAdmin: boolean = false
): string {
  const readAs = Array.from(new Set([party, ...readParties]));

  const payload = {
    'https://daml.com/ledger-api': {
      ledgerId: config.ledgerId,
      applicationId: config.applicationId,
      actAs: [party],
      readAs,
      admin: isAdmin
    } as DamlLedgerClaims,
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours
  };

  return jwt.sign(payload, config.jwtSecret, { algorithm: 'HS256' });
}
