/**
 * Ledger Client Data Types
 */
export interface Contract<T = any> {
    contractId: string;
    templateId: string;
    key?: any;
    payload: T;
    signatories: string[];
    observers: string[];
    agreementText?: string;
}
export interface CommandMeta {
    commandId?: string;
    deduplicationOffset?: string;
}
export interface CommandSubmissionResult<T = any> {
    contractId: string;
    templateId: string;
    payload?: T;
    transactionId?: string;
    updateId?: string;
}
export interface LedgerConnectivityStatus {
    connected: boolean;
    endpoint: string;
    ledgerId?: string;
    responseTimeMs?: number;
    availableParties?: string[];
    error?: string;
    isMocked: false;
}
//# sourceMappingURL=types.d.ts.map