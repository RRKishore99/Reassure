"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureDocumentStore = exports.MAX_FILE_SIZE_BYTES = exports.ALLOWED_MIME_TYPES = void 0;
const crypto = __importStar(require("node:crypto"));
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
exports.ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'text/csv',
    'application/json',
    'application/xml',
    'text/plain'
]);
exports.MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
class SecureDocumentStore {
    storageDir;
    metadataFile;
    auditLogFile;
    masterKey;
    metadataMap = new Map();
    auditLog = [];
    constructor(baseDir = './.data/document-store', secretHex) {
        this.storageDir = path.resolve(baseDir, 'encrypted-blobs');
        this.metadataFile = path.resolve(baseDir, 'documents-meta.json');
        this.auditLogFile = path.resolve(baseDir, 'audit-trail.json');
        // Ensure directories exist
        fs.mkdirSync(this.storageDir, { recursive: true });
        // Deterministic or provided 256-bit AES master key
        if (secretHex && secretHex.length === 64) {
            this.masterKey = Buffer.from(secretHex, 'hex');
        }
        else {
            // Create or load local key
            const keyFile = path.resolve(baseDir, 'store.key');
            if (fs.existsSync(keyFile)) {
                this.masterKey = fs.readFileSync(keyFile);
            }
            else {
                this.masterKey = crypto.randomBytes(32);
                fs.writeFileSync(keyFile, this.masterKey, { mode: 0o600 });
            }
        }
        this.loadState();
    }
    loadState() {
        if (fs.existsSync(this.metadataFile)) {
            try {
                const raw = fs.readFileSync(this.metadataFile, 'utf-8');
                const items = JSON.parse(raw);
                this.metadataMap = new Map(items.map(m => [m.documentId, m]));
            }
            catch (err) {
                console.error('Failed to load document metadata:', err);
            }
        }
        if (fs.existsSync(this.auditLogFile)) {
            try {
                const raw = fs.readFileSync(this.auditLogFile, 'utf-8');
                this.auditLog = JSON.parse(raw);
            }
            catch (err) {
                console.error('Failed to load document audit log:', err);
            }
        }
    }
    persistState() {
        fs.writeFileSync(this.metadataFile, JSON.stringify(Array.from(this.metadataMap.values()), null, 2), 'utf-8');
        fs.writeFileSync(this.auditLogFile, JSON.stringify(this.auditLog, null, 2), 'utf-8');
    }
    logAudit(documentId, requestingParty, role, action, details) {
        const entry = {
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
    async saveDocument(rawBytes, uploadMeta, authorizedParties = []) {
        if (rawBytes.length > exports.MAX_FILE_SIZE_BYTES) {
            throw new Error(`File size ${rawBytes.length} exceeds maximum permitted limit (${exports.MAX_FILE_SIZE_BYTES} bytes).`);
        }
        if (!exports.ALLOWED_MIME_TYPES.has(uploadMeta.mimeType)) {
            throw new Error(`MIME type "${uploadMeta.mimeType}" is not permitted. Permitted: ${Array.from(exports.ALLOWED_MIME_TYPES).join(', ')}`);
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
        const storedMeta = {
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
    async getDocument(documentId, requestingParty, role) {
        const meta = this.metadataMap.get(documentId);
        if (!meta) {
            throw new Error(`Document not found: "${documentId}"`);
        }
        // Access control: Audit and Operations have oversight, otherwise party must be authorized
        const isAuthorized = role === 'Audit' ||
            role === 'Operations' ||
            meta.authorizedParties.includes(requestingParty) ||
            meta.uploadedBy === requestingParty;
        if (!isAuthorized) {
            this.logAudit(documentId, requestingParty, role, 'ACCESS_DENIED', `Party "${requestingParty}" with role "${role}" denied access to document ${documentId}`);
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
            this.logAudit(documentId, requestingParty, role, 'INTEGRITY_MISMATCH', `CRITICAL: Tamper detected on document ${documentId}! Expected ${meta.contentHash}, got ${computedHash}`);
            throw new Error(`Integrity verification failed for document ${documentId}. Computed digest does not match recorded digest!`);
        }
        this.logAudit(documentId, requestingParty, role, 'READ', `Retrieved and verified integrity for ${documentId}`);
        return { rawBytes, metadata: meta };
    }
    /**
     * Tamper-detection verification check without returning file contents.
     */
    async verifyIntegrity(documentId) {
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
        this.logAudit(documentId, 'SYSTEM', 'Operations', 'VERIFY_INTEGRITY', `Integrity check: ${valid ? 'PASSED' : 'FAILED'} (Hash: ${computedHash})`);
        return {
            valid,
            contentHash: meta.contentHash,
            calculatedHash: computedHash
        };
    }
    /**
     * List documents authorized for a given party.
     */
    listDocumentsForParty(requestingParty, role) {
        return Array.from(this.metadataMap.values()).filter(doc => {
            if (role === 'Audit' || role === 'Operations')
                return true;
            return doc.uploadedBy === requestingParty || doc.authorizedParties.includes(requestingParty);
        });
    }
    /**
     * Get audit log entries (Audit role or Operations role).
     */
    getAuditLog(role) {
        if (role !== 'Audit' && role !== 'Operations') {
            throw new Error('Only Audit or Operations roles can inspect the security audit trail');
        }
        return [...this.auditLog];
    }
}
exports.SecureDocumentStore = SecureDocumentStore;
//# sourceMappingURL=store.js.map