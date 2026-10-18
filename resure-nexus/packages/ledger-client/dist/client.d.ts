/**
 * ReSure Nexus — Canton Ledger API Client
 *
 * Enforces:
 * - Real Canton HTTP JSON API transactions (Section 13: "Runtime transaction submission and contract queries must use a real Canton Ledger API connection")
 * - Invariant 14: "Never silently switch to mocked ledger responses"
 * - Idempotent command submission using unique command IDs and deduplication
 * - Precise error mapping (PreconditionFailed, AuthorizationError, DuplicateKey)
 */
import { CantonConfig } from './config';
import { Contract, CommandSubmissionResult, LedgerConnectivityStatus, CommandMeta } from './types';
export declare class CantonLedgerClient {
    private readonly config;
    constructor(config?: Partial<CantonConfig>);
    /**
     * Generates a unique command ID for idempotent submission.
     */
    generateCommandId(prefix?: string): string;
    /**
     * Checks the genuine connection to the Canton participant.
     * Reports truthful connectivity status (never fakes connected status).
     */
    checkConnectivity(): Promise<LedgerConnectivityStatus>;
    /**
     * Submits a Create command to the ledger.
     */
    createContract<T = any>(templateId: string, payload: Record<string, any>, submittingParty: string, meta?: CommandMeta): Promise<CommandSubmissionResult<T>>;
    /**
     * Submits an Exercise command to execute a choice on an active contract.
     */
    exerciseChoice<T = any>(templateId: string, contractId: string, choice: string, argument: Record<string, any>, submittingParty: string, meta?: CommandMeta): Promise<CommandSubmissionResult<T>>;
    /**
     * Queries active contracts matching template IDs and optional filter.
     */
    queryContracts<T = any>(templateIds: string[], requestingParty: string, query?: Record<string, any>): Promise<Contract<T>[]>;
    /**
     * Fetches an individual contract by ID.
     */
    fetchContract<T = any>(contractId: string, requestingParty: string): Promise<Contract<T> | null>;
}
//# sourceMappingURL=client.d.ts.map