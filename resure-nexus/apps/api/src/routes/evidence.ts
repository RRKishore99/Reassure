import { Router } from 'express';
import multer from 'multer';
import { DocumentType } from '@resure-nexus/domain';
import { services } from '../services';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Upload evidence document
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'BadRequest', message: 'No file uploaded' });
    }

    const documentType = (req.body.documentType as DocumentType) || 'ClaimNotification';
    const authorizedPartiesStr = req.body.authorizedParties as string | undefined;
    const authorizedParties = authorizedPartiesStr ? authorizedPartiesStr.split(',').map(s => s.trim()) : [];

    const result = await services.documentStore.saveDocument(
      req.file.buffer,
      {
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        documentType,
        uploadedBy: req.user.party,
        claimRef: req.body.claimRef,
        treatyRef: req.body.treatyRef,
        allocationRef: req.body.allocationRef
      },
      authorizedParties
    );

    res.status(201).json({
      evidenceRef: result.evidenceRef,
      metadata: {
        documentId: result.metadata.documentId,
        filename: result.metadata.filename,
        sizeBytes: result.metadata.sizeBytes,
        contentHash: result.metadata.contentHash,
        uploadedAt: result.metadata.uploadedAt,
        encrypted: result.metadata.encrypted
      }
    });
  } catch (err) {
    next(err);
  }
});

// Download and verify document
router.get('/:id/download', async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const { rawBytes, metadata } = await services.documentStore.getDocument(
      documentId,
      req.user.party,
      req.user.role
    );

    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${metadata.filename}"`);
    res.setHeader('X-Document-Hash', metadata.contentHash);
    res.setHeader('X-Integrity-Verified', 'true');
    res.send(rawBytes);
  } catch (err) {
    next(err);
  }
});

// Verify document integrity without full download
router.post('/:id/verify', async (req, res, next) => {
  try {
    const result = await services.documentStore.verifyIntegrity(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// List visible documents
router.get('/', (req, res) => {
  const documents = services.documentStore.listDocumentsForParty(req.user.party, req.user.role);
  // Redact encryption IVs and storage paths
  const sanitized = documents.map(d => ({
    documentId: d.documentId,
    filename: d.filename,
    mimeType: d.mimeType,
    documentType: d.documentType,
    contentHash: d.contentHash,
    sizeBytes: d.sizeBytes,
    uploadedAt: d.uploadedAt,
    uploadedBy: d.uploadedBy,
    claimRef: d.claimRef,
    treatyRef: d.treatyRef,
    allocationRef: d.allocationRef,
    authorizedParties: d.authorizedParties
  }));
  res.json({ documents: sanitized });
});

export default router;
