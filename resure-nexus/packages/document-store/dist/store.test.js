"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const store_1 = require("./store");
(0, node_test_1.describe)('SecureDocumentStore', () => {
    const testDir = path.resolve(__dirname, '../../.test-doc-store');
    let store;
    (0, node_test_1.before)(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
        store = new store_1.SecureDocumentStore(testDir);
    });
    (0, node_test_1.after)(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
    });
    (0, node_test_1.it)('stores document with SHA-256 hash and verifies integrity upon retrieval', async () => {
        const content = Buffer.from('Confidential Treaty Slip Content 2026 for ReSure Nexus');
        const result = await store.saveDocument(content, {
            filename: 'TreatySlip-2026.pdf',
            mimeType: 'application/pdf',
            documentType: 'TreatySlip',
            uploadedBy: 'Cedant'
        }, ['Reinsurer1']);
        node_assert_1.default.ok(result.evidenceRef.documentId.startsWith('DOC-'));
        node_assert_1.default.strictEqual(result.evidenceRef.documentType, 'TreatySlip');
        node_assert_1.default.strictEqual(result.evidenceRef.contentHash.length, 64);
        // Retrieve as authorized party (Reinsurer1)
        const retrieved = await store.getDocument(result.evidenceRef.documentId, 'Reinsurer1', 'Reinsurer');
        node_assert_1.default.strictEqual(retrieved.rawBytes.toString('utf-8'), content.toString('utf-8'));
        node_assert_1.default.strictEqual(retrieved.metadata.contentHash, result.evidenceRef.contentHash);
    });
    (0, node_test_1.it)('rejects access from unauthorized party', async () => {
        const content = Buffer.from('Cedant Internal Reserve Analysis');
        const result = await store.saveDocument(content, {
            filename: 'InternalReserves.pdf',
            mimeType: 'application/pdf',
            documentType: 'AdjusterReport',
            uploadedBy: 'Cedant'
        }, ['Adjuster'] // Only Cedant and Adjuster
        );
        await node_assert_1.default.rejects(async () => {
            // Reinsurer2 is not authorized
            await store.getDocument(result.evidenceRef.documentId, 'Reinsurer2', 'Reinsurer');
        }, /Unauthorized: Party "Reinsurer2" does not have permission/);
    });
    (0, node_test_1.it)('allows Audit role to access evidence for compliance audit', async () => {
        const content = Buffer.from('Loss Adjuster Inspection Findings');
        const result = await store.saveDocument(content, {
            filename: 'Inspection.pdf',
            mimeType: 'application/pdf',
            documentType: 'AdjusterReport',
            uploadedBy: 'Adjuster'
        }, ['Cedant']);
        // Audit role can read for regulatory oversight
        const retrieved = await store.getDocument(result.evidenceRef.documentId, 'AuditorGeneral', 'Audit');
        node_assert_1.default.strictEqual(retrieved.rawBytes.toString('utf-8'), content.toString('utf-8'));
    });
    (0, node_test_1.it)('detects tampering and raises an integrity error', async () => {
        const content = Buffer.from('Original Claim Notification Payload');
        const result = await store.saveDocument(content, {
            filename: 'Notice.pdf',
            mimeType: 'application/pdf',
            documentType: 'ClaimNotification',
            uploadedBy: 'Cedant'
        }, ['Reinsurer1']);
        // Manually tamper with the stored metadata hash
        const metaFile = path.resolve(testDir, 'documents-meta.json');
        const raw = fs.readFileSync(metaFile, 'utf-8');
        const list = JSON.parse(raw);
        const item = list.find((d) => d.documentId === result.evidenceRef.documentId);
        item.contentHash = '0000000000000000000000000000000000000000000000000000000000000000';
        fs.writeFileSync(metaFile, JSON.stringify(list, null, 2));
        // Reload store with tampered metadata
        const tamperedStore = new store_1.SecureDocumentStore(testDir);
        await node_assert_1.default.rejects(async () => {
            await tamperedStore.getDocument(result.evidenceRef.documentId, 'Cedant', 'Cedant');
        }, /Integrity verification failed/);
    });
});
//# sourceMappingURL=store.test.js.map