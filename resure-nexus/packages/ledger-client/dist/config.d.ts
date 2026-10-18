/**
 * Canton Ledger Client Configuration
 */
export interface CantonConfig {
    httpJsonUrl: string;
    ledgerId?: string;
    applicationId: string;
    jwtSecret: string;
    timeoutMs: number;
}
export declare function loadCantonConfig(): CantonConfig;
//# sourceMappingURL=config.d.ts.map