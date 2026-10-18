import { Router } from 'express';
import { CreateOccurrenceSchema, LossOccurrence } from '@resure-nexus/domain';
import { TEMPLATES } from '@resure-nexus/ledger-client';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List occurrences
router.get('/', (_req, res) => {
  const occurrences = services.repository.getOccurrences();
  res.json({ occurrences });
});

// Create occurrence
router.post('/', requireRoles('Cedant', 'Operations'), async (req, res, next) => {
  try {
    const validated = CreateOccurrenceSchema.parse(req.body);

    const occ: LossOccurrence = {
      occurrenceRef: validated.occurrenceRef,
      cedant: req.user.party,
      title: validated.title,
      commencementDate: validated.commencementDate,
      expirationDate: validated.expirationDate,
      claimRefs: validated.initialClaimRefs,
      isFrozen: false,
      isClosed: false,
      notes: validated.notes
    };

    let contractId: string | undefined;
    const ledgerStatus = await services.ledgerClient.checkConnectivity();
    if (ledgerStatus.connected) {
      try {
        const result = await services.ledgerClient.createContract(
          TEMPLATES.LossOccurrence,
          occ,
          req.user.party,
          { commandId: `OCC-CREATE-${occ.occurrenceRef}` }
        );
        contractId = result.contractId;
      } catch (err: any) {
        console.warn(`[WARN] Ledger create failed: ${err.message}`);
      }
    }

    occ.contractId = contractId;
    services.repository.saveOccurrence(occ);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'OCCURRENCE_CREATED',
      contractId,
      details: { occurrenceRef: occ.occurrenceRef, title: occ.title }
    });

    res.status(201).json({ occurrence: occ, contractId });
  } catch (err) {
    next(err);
  }
});

// Add claim to occurrence
router.post('/:ref/claims', requireRoles('Cedant', 'Operations'), async (req, res, next) => {
  try {
    const occRef = req.params.ref;
    const claimRef = req.body?.claimRef;
    if (!claimRef) return res.status(400).json({ error: 'BadRequest', message: 'claimRef is required' });

    const occurrences = services.repository.getOccurrences();
    const occ = occurrences.find(o => o.occurrenceRef === occRef);
    if (!occ) return res.status(404).json({ error: 'NotFound', message: 'Occurrence not found' });

    if (occ.isFrozen) {
      return res.status(400).json({
        error: 'OccurrenceFrozen',
        message: 'Cannot add claim: Occurrence membership is frozen.'
      });
    }

    if (occ.claimRefs.includes(claimRef)) {
      return res.status(409).json({
        error: 'DuplicateClaimInOccurrence',
        message: `Claim "${claimRef}" is already part of occurrence "${occRef}"`
      });
    }

    occ.claimRefs.push(claimRef);
    services.repository.saveOccurrence(occ);

    // Update claim's occurrenceRef
    const claim = services.repository.getClaim(claimRef);
    if (claim) {
      claim.occurrenceRef = occRef;
      services.repository.saveClaim(claim);
    }

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'CLAIM_ADDED_TO_OCCURRENCE',
      claimRef,
      details: { occurrenceRef: occRef, claimRef }
    });

    res.json({ occurrence: occ });
  } catch (err) {
    next(err);
  }
});

// Freeze occurrence membership
router.post('/:ref/freeze', requireRoles('Cedant', 'Operations'), async (req, res, next) => {
  try {
    const occRef = req.params.ref;
    const occurrences = services.repository.getOccurrences();
    const occ = occurrences.find(o => o.occurrenceRef === occRef);
    if (!occ) return res.status(404).json({ error: 'NotFound', message: 'Occurrence not found' });

    occ.isFrozen = true;
    occ.frozenAt = new Date().toISOString();
    services.repository.saveOccurrence(occ);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'OCCURRENCE_MEMBERSHIP_FROZEN',
      details: { occurrenceRef: occRef, claimCount: occ.claimRefs.length }
    });

    res.json({ occurrence: occ });
  } catch (err) {
    next(err);
  }
});

export default router;
