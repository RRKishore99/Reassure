/**
 * ReSure Nexus — Projection Reconciler Service
 *
 * Implements Section 41 & 42:
 * "The application must be able to reconcile its projections from actual ledger updates after a restart or processing failure."
 * "Reconciliation of API responses, ledger updates and database projections."
 * "Safe to replay."
 */
import { CantonLedgerClient } from '@resure-nexus/ledger-client';
import { ProjectionRepository } from './repository';
export declare class ProjectionReconciler {
    private readonly ledgerClient;
    private readonly repository;
    constructor(ledgerClient: CantonLedgerClient, repository: ProjectionRepository);
    /**
     * Reconciles all projections by querying active contracts on the authoritative Canton ledger.
     * Can be re-run safely at any time (idempotent replay).
     */
    reconcileAll(): Promise<{
        success: boolean;
        syncedTemplates: Record<string, number>;
        error?: string;
    }>;
}
//# sourceMappingURL=reconciler.d.ts.map