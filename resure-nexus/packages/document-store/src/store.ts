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

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Role } from '@resure-nexus/domain';
import {
  DocumentUploadMeta,
  StoredDocumentMeta,
  SavedDocumentResult,
  DocumentAccessAuditEntry
} from './types';

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'text/csv',
  'application/json',
  'application/xml',
  'text/plain'
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export class SecureDocumentStore {
  private readonly storageDir: string;
  private readonly metadataFile: string;
  private readonly auditLogFile: string;
  private readonly masterKey: Buffer;
  private metadataMap: Map<string, StoredDocumentMeta> = new Map();
  private auditLog: DocumentAccessAuditEntry[] = [];

  constructor(baseDir: string = './.data/document-store', secretHex?: string) {
    this.storageDir = path.resolve(baseDir, 'encrypted-blobs');
    this.metadataFile = path.resolve(baseDir, 'documents-meta.json');
    this.auditLogFile = path.resolve(baseDir, 'audit-trail.json');

    // Ensure directories exist
    fs.mkdirSync(this.storageDir, { recursive: true });

    // Deterministic or provided 256-bit AES master key
    if (secretHex && secretHex.length === 64) {
      this.masterKey = Buffer.from(secretHex, 'hex');
    } else {
      // Create or load local key
      const keyFile = path.resolve(baseDir, 'store.key');
      if (fs.existsSync(keyFile)) {
        this.masterKey = fs.readFileSync(keyFile);
      } else {
        this.masterKey = crypto.randomBytes(32);
        fs.writeFileSync(keyFile, this.masterKey, { mode: 0o600 });
      }
    }

    this.loadState();
  }

  private loadState(): void {
    if (fs.existsSync(this.metadataFile)) {
      try {
        const raw = fs.readFileSync(this.metadataFile, 'utf-8');
        const items = JSON.parse(raw) as StoredDocumentMeta[];
        this.metadataMap = new Map(items.map(m => [m.documentId, m]));
      } catch (err) {
        console.error('Failed to load document metadata:', err);
      }
    }
    if (fs.existsSync(this.auditLogFile)) {
      try {
        const raw = fs.readFileSync(this.auditLogFile, 'utf-8');
        this.auditLog = JSON.parse(raw) as DocumentAccessAuditEntry[];
      } catch (err) {
        console.error('Failed to load document audit log:', err);
      }
    }
  }

  private persistState(): void {
    fs.writeFileSync(this.metadataFile, JSON.stringify(Array.from(this.metadataMap.values()), null, 2), 'utf-8');
    fs.writeFileSync(this.auditLogFile, JSON.stringify(this.auditLog, null, 2), 'utf-8');
  }

  private logAudit(
    documentId: string,
    requestingParty: string,
    role: Role,
    action: DocumentAccessAuditEntry['action'],
    details: string
  ): void {
    const entry: DocumentAccessAuditEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      documentId,
      requestingParty,
      role,
      action,
      details
    };
    this.auditLog.push(entry);
    this.persistState();
  }

  /**
   * Save a document with AES-256-GCM encryption and SHA-256 digest verification.
   */
  async saveDocument(
    rawBytes: Buffer,
    uploadMeta: DocumentUploadMeta,
    authorizedParties: string[] = []
  ): Promise<SavedDocumentResult> {
    if (rawBytes.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size ${rawBytes.length} exceeds maximum permitted limit (${MAX_FILE_SIZE_BYTES} bytes).`);
    }

    if (!ALLOWED_MIME_TYPES.has(uploadMeta.mimeType)) {
      throw new Error(`MIME type "${uploadMeta.mimeType}" is not permitted. Permitted: ${Array.from(ALLOWED_MIME_TYPES).join(', ')}`);
    }

    // 1. Calculate genuine SHA-256 digest
    const hash = crypto.createHash('sha256').update(rawBytes).digest('hex');

    // 2. Generate unique document ID
    const documentId = `DOC-${Date.now().toString(36).toUpperCase()}-${hash.substring(0, 8).toUpperCase()}`;

    // 3. Encrypt payload using AES-256-GCM
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    const encrypted = Buffer.concat([cipher.update(rawBytes), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // 4. Save encrypted blob
    const storageFilename = `${documentId}.enc`;
    const filePath = path.join(this.storageDir, storageFilename);
    fs.writeFileSync(filePath, encrypted);

    // 5. Store metadata
    const parties = new Set([uploadMeta.uploadedBy, ...authorizedParties]);
    const storedMeta: StoredDocumentMeta = {
      ...uploadMeta,
      documentId,
      contentHash: hash,
      sizeBytes: rawBytes.length,
      uploadedAt: new Date().toISOString(),
      encrypted: true,
      ivHex: iv.toString('hex'),
      authTagHex: authTag.toString('hex'),
      storageFilename,
      authorizedParties: Array.from(parties)
    };

    this.metadataMap.set(documentId, storedMeta);
    this.logAudit(documentId, uploadMeta.uploadedBy, 'Operations', 'UPLOAD', `Uploaded ${uploadMeta.filename} (${rawBytes.length} bytes), SHA-256: ${hash}`);
    this.persistState();

    return {
      evidenceRef: {
        documentId,
        documentType: uploadMeta.documentType,
        contentHash: hash,
        version: 1,
        uploadedAt: storedMeta.uploadedAt,
        uploadedBy: uploadMeta.uploadedBy
      },
      metadata: storedMeta
    };
  }

  /**
   * Retrieve and decrypt a document, verifying integrity and checking access permissions.
   */
  async getDocument(
    documentId: string,
    requestingParty: string,
    role: Role
  ): Promise<{ rawBytes: Buffer; metadata: StoredDocumentMeta }> {
    const meta = this.metadataMap.get(documentId);
    if (!meta) {
      throw new Error(`Document not found: "${documentId}"`);
    }

    // Access control: Audit and Operations have oversight, otherwise party must be authorized
    const isAuthorized =
      role === 'Audit' ||
      role === 'Operations' ||
      meta.authorizedParties.includes(requestingParty) ||
      meta.uploadedBy === requestingParty;

    if (!isAuthorized) {
      this.logAudit(
        documentId,
        requestingParty,
        role,
        'ACCESS_DENIED',
        `Party "${requestingParty}" with role "${role}" denied access to document ${documentId}`
      );
      throw new Error(`Unauthorized: Party "${requestingParty}" does not have permission to view document "${documentId}"`);
    }

    const filePath = path.join(this.storageDir, meta.storageFilename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Encrypted blob file missing for document "${documentId}"`);
    }

    const encryptedData = fs.readFileSync(filePath);
    const iv = Buffer.from(meta.ivHex, 'hex');
    const authTag = Buffer.from(meta.authTagHex, 'hex');

    // Decrypt AES-256-GCM
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
    decipher.setAuthTag(authTag);
    const rawBytes = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    // Verify SHA-256 cryptographic integrity
    const computedHash = crypto.createHash('sha256').update(rawBytes).digest('hex');
    if (computedHash.toLowerCase() !== meta.contentHash.toLowerCase()) {
      this.logAudit(
        documentId,
        requestingParty,
        role,
        'INTEGRITY_MISMATCH',
        `CRITICAL: Tamper detected on document ${documentId}! Expected ${meta.contentHash}, got ${computedHash}`
      );
      throw new Error(`Integrity verification failed for document ${documentId}. Computed digest does not match recorded digest!`);
    }

    this.logAudit(documentId, requestingParty, role, 'READ', `Retrieved and verified integrity for ${documentId}`);

    return { rawBytes, metadata: meta };
  }

  /**
   * Tamper-detection verification check without returning file contents.
   */
  async verifyIntegrity(documentId: string): Promise<{ valid: boolean; contentHash: string; calculatedHash: string }> {
    const meta = this.metadataMap.get(documentId);
    if (!meta) {
      throw new Error(`Document not found: "${documentId}"`);
    }

    const filePath = path.join(this.storageDir, meta.storageFilename);
    if (!fs.existsSync(filePath)) {
      return { valid: false, contentHash: meta.contentHash, calculatedHash: 'FILE_MISSING' };
    }

    const encryptedData = fs.readFileSync(filePath);
    const iv = Buffer.from(meta.ivHex, 'hex');
    const authTag = Buffer.from(meta.authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
    decipher.setAuthTag(authTag);
    const rawBytes = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    const computedHash = crypto.createHash('sha256').update(rawBytes).digest('hex');

    const valid = computedHash.toLowerCase() === meta.contentHash.toLowerCase();
    this.logAudit(
      documentId,
      'SYSTEM',
      'Operations',
      'VERIFY_INTEGRITY',
      `Integrity check: ${valid ? 'PASSED' : 'FAILED'} (Hash: ${computedHash})`
    );

    return {
      valid,
      contentHash: meta.contentHash,
      calculatedHash: computedHash
    };
  }

  /**
   * List documents authorized for a given party.
   */
  listDocumentsForParty(requestingParty: string, role: Role): StoredDocumentMeta[] {
    return Array.from(this.metadataMap.values()).filter(doc => {
      if (role === 'Audit' || role === 'Operations') return true;
      return doc.uploadedBy === requestingParty || doc.authorizedParties.includes(requestingParty);
    });
  }

  /**
   * Get audit log entries (Audit role or Operations role).
   */
  getAuditLog(role: Role): DocumentAccessAuditEntry[] {
    if (role !== 'Audit' && role !== 'Operations') {
      throw new Error('Only Audit or Operations roles can inspect the security audit trail');
    }
    return [...this.auditLog];
  }
}
