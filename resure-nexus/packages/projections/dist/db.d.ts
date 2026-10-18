/**
 * ReSure Nexus — Projection Database & Schema Management
 * SQLite storage engine for query projections, idempotency, and audit trails.
 */
import Database from 'better-sqlite3';
export declare class ProjectionDatabase {
    private db;
    constructor(dbPath?: string);
    getRawDb(): Database.Database;
    private initSchema;
    close(): void;
}
//# sourceMappingURL=db.d.ts.map