/**
 * Canton / Daml JWT Token Minting for Authenticated Ledger API access
 */
import { CantonConfig } from './config';
export interface DamlLedgerClaims {
    ledgerId?: string;
    applicationId: string;
    actAs: string[];
    readAs: string[];
    admin: boolean;
}
export declare function createPartyToken(party: string, readParties: string[], config: CantonConfig, isAdmin?: boolean): string;
//# sourceMappingURL=token.d.ts.map