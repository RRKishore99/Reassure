/**
 * ReSure Nexus — Secure Off-Ledger Evidence Document Store
 *
 * Features:
 * - SHA-256 cryptographic digest calculation over raw bytes
 * - Real AES-256-GCM local encrypted storage for confidential evidence
 * - Strict integrity verification upon retrieval (tamper detection)
 * - Off-ledger storage to prevent PII and large payloads on the ledger
 * - Role and party-based authorization checking
 * - Detailed security audit trail of all access and verification attempts
 */
import { Role } from '@resure-nexus/domain';
import { DocumentUploadMeta, StoredDocumentMeta, SavedDocumentResult, DocumentAccessAuditEntry } from './types';
export declare const ALLOWED_MIME_TYPES: Set<string>;
export declare const MAX_FILE_SIZE_BYTES: number;
export declare class SecureDocumentStore {
    private readonly storageDir;
    private readonly metadataFile;
    private readonly auditLogFile;
    private readonly masterKey;
    private metadataMap;
    private auditLog;
    constructor(baseDir?: string, secretHex?: string);
    private loadState;
    private persistState;
    private logAudit;
    /**
     * Save a document with AES-256-GCM encryption and SHA-256 digest verification.
     */
    saveDocument(rawBytes: Buffer, uploadMeta: DocumentUploadMeta, authorizedParties?: string[]): Promise<SavedDocumentResult>;
    /**
     * Retrieve and decrypt a document, verifying integrity and checking access permissions.
     */
    getDocument(documentId: string, requestingParty: string, role: Role): Promise<{
        rawBytes: Buffer;
        metadata: StoredDocumentMeta;
    }>;
    /**
     * Tamper-detection verification check without returning file contents.
     */
    verifyIntegrity(documentId: string): Promise<{
        valid: boolean;
        contentHash: string;
        calculatedHash: string;
    }>;
    /**
     * List documents authorized for a given party.
     */
    listDocumentsForParty(requestingParty: string, role: Role): StoredDocumentMeta[];
    /**
     * Get audit log entries (Audit role or Operations role).
     */
    getAuditLog(role: Role): DocumentAccessAuditEntry[];
}
//# sourceMappingURL=store.d.ts.map