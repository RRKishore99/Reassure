import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { SecureDocumentStore } from './store';

describe('SecureDocumentStore', () => {
  const testDir = path.resolve(__dirname, '../../.test-doc-store');
  let store: SecureDocumentStore;

  before(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
    store = new SecureDocumentStore(testDir);
  });

  after(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('stores document with SHA-256 hash and verifies integrity upon retrieval', async () => {
    const content = Buffer.from('Confidential Treaty Slip Content 2026 for ReSure Nexus');
    const result = await store.saveDocument(
      content,
      {
        filename: 'TreatySlip-2026.pdf',
        mimeType: 'application/pdf',
        documentType: 'TreatySlip',
        uploadedBy: 'Cedant'
      },
      ['Reinsurer1']
    );

    assert.ok(result.evidenceRef.documentId.startsWith('DOC-'));
    assert.strictEqual(result.evidenceRef.documentType, 'TreatySlip');
    assert.strictEqual(result.evidenceRef.contentHash.length, 64);

    // Retrieve as authorized party (Reinsurer1)
    const retrieved = await store.getDocument(result.evidenceRef.documentId, 'Reinsurer1', 'Reinsurer');
    assert.strictEqual(retrieved.rawBytes.toString('utf-8'), content.toString('utf-8'));
    assert.strictEqual(retrieved.metadata.contentHash, result.evidenceRef.contentHash);
  });

  it('rejects access from unauthorized party', async () => {
    const content = Buffer.from('Cedant Internal Reserve Analysis');
    const result = await store.saveDocument(
      content,
      {
        filename: 'InternalReserves.pdf',
        mimeType: 'application/pdf',
        documentType: 'AdjusterReport',
        uploadedBy: 'Cedant'
      },
      ['Adjuster'] // Only Cedant and Adjuster
    );

    await assert.rejects(
      async () => {
        // Reinsurer2 is not authorized
        await store.getDocument(result.evidenceRef.documentId, 'Reinsurer2', 'Reinsurer');
      },
      /Unauthorized: Party "Reinsurer2" does not have permission/
    );
  });

  it('allows Audit role to access evidence for compliance audit', async () => {
    const content = Buffer.from('Loss Adjuster Inspection Findings');
    const result = await store.saveDocument(
      content,
      {
        filename: 'Inspection.pdf',
        mimeType: 'application/pdf',
        documentType: 'AdjusterReport',
        uploadedBy: 'Adjuster'
      },
      ['Cedant']
    );

    // Audit role can read for regulatory oversight
    const retrieved = await store.getDocument(result.evidenceRef.documentId, 'AuditorGeneral', 'Audit');
    assert.strictEqual(retrieved.rawBytes.toString('utf-8'), content.toString('utf-8'));
  });

  it('detects tampering and raises an integrity error', async () => {
    const content = Buffer.from('Original Claim Notification Payload');
    const result = await store.saveDocument(
      content,
      {
        filename: 'Notice.pdf',
        mimeType: 'application/pdf',
        documentType: 'ClaimNotification',
        uploadedBy: 'Cedant'
      },
      ['Reinsurer1']
    );

    // Manually tamper with the stored metadata hash
    const metaFile = path.resolve(testDir, 'documents-meta.json');
    const raw = fs.readFileSync(metaFile, 'utf-8');
    const list = JSON.parse(raw);
    const item = list.find((d: any) => d.documentId === result.evidenceRef.documentId);
    item.contentHash = '0000000000000000000000000000000000000000000000000000000000000000';
    fs.writeFileSync(metaFile, JSON.stringify(list, null, 2));

    // Reload store with tampered metadata
    const tamperedStore = new SecureDocumentStore(testDir);
    await assert.rejects(
      async () => {
        await tamperedStore.getDocument(result.evidenceRef.documentId, 'Cedant', 'Cedant');
      },
      /Integrity verification failed/
    );
  });
});
