import { DocumentType, EvidenceRef, Role } from '@resure-nexus/domain';

export interface DocumentUploadMeta {
  filename: string;
  mimeType: string;
  documentType: DocumentType;
  uploadedBy: string; // Canton Party ID
  claimRef?: string;
  treatyRef?: string;
  allocationRef?: string;
}

export interface StoredDocumentMeta extends DocumentUploadMeta {
  documentId: string;
  contentHash: string; // SHA-256 hex
  sizeBytes: number;
  uploadedAt: string;
  encrypted: boolean;
  ivHex: string;
  authTagHex: string;
  storageFilename: string;
  authorizedParties: string[];
}

export interface SavedDocumentResult {
  evidenceRef: EvidenceRef;
  metadata: StoredDocumentMeta;
}

export interface DocumentAccessAuditEntry {
  id: string;
  timestamp: string;
  documentId: string;
  requestingParty: string;
  role: Role;
  action: 'UPLOAD' | 'READ' | 'VERIFY_INTEGRITY' | 'ACCESS_DENIED' | 'INTEGRITY_MISMATCH';
  details: string;
}
