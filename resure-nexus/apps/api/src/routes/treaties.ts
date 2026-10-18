import { Router } from 'express';
import { CreateTreatySchema, TreatyVersion, TreatyParticipation } from '@resure-nexus/domain';
import { TEMPLATES } from '@resure-nexus/ledger-client';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List treaties
router.get('/', (_req, res) => {
  const treaties = services.repository.getTreaties();
  const participations = services.repository.getParticipations();
  res.json({
    treaties,
    participations
  });
});

// Get treaty by reference
router.get('/:ref', (req, res) => {
  const treaty = services.repository.getTreaty(req.params.ref);
  if (!treaty) {
    return res.status(404).json({ error: 'NotFound', message: `Treaty "${req.params.ref}" not found` });
  }
  const participations = services.repository.getParticipations(req.params.ref);
  res.json({ treaty, participations });
});

// Create draft treaty (Cedant or Broker)
router.post('/', requireRoles('Cedant', 'Broker', 'Operations'), async (req, res, next) => {
  try {
    const validated = CreateTreatySchema.parse(req.body);

    const treaty: TreatyVersion = {
      treatyRef: validated.treatyRef,
      version: 1,
      cedant: 'Cedant',
      broker: 'Broker',
      treatyType: validated.treatyType,
      inceptionDate: validated.inceptionDate,
      expirationDate: validated.expirationDate,
      coveredBusiness: validated.coveredBusiness,
      lossBasis: validated.lossBasis,
      currency: validated.currency,
      quotaShareTerms: validated.quotaShareTerms,
      excessOfLossTerms: validated.excessOfLossTerms,
      status: 'Draft',
      participatingReinsurers: validated.participatingReinsurers,
      evidenceRefs: validated.evidenceRefs,
      createdAt: new Date().toISOString()
    };

    // Attempt ledger creation if connected
    let contractId: string | undefined;
    const ledgerStatus = await services.ledgerClient.checkConnectivity();
    if (ledgerStatus.connected) {
      try {
        const result = await services.ledgerClient.createContract(
          TEMPLATES.TreatyVersion,
          treaty,
          req.user.party,
          { commandId: `TREATY-CREATE-${treaty.treatyRef}` }
        );
        contractId = result.contractId;
      } catch (err: any) {
        console.warn(`[WARN] Ledger command failed, recording locally: ${err.message}`);
      }
    }

    treaty.contractId = contractId;
    services.repository.saveTreaty(treaty);

    // Save individual participations
    for (const p of validated.participatingReinsurers) {
      const participation: TreatyParticipation = {
        treatyRef: treaty.treatyRef,
        treatyVersion: 1,
        cedant: treaty.cedant,
        reinsurer: p.reinsurer,
        broker: treaty.broker,
        linePercentage: p.linePercentage,
        status: 'Proposed'
      };
      services.repository.saveParticipation(participation);
    }

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'TREATY_DRAFT_CREATED',
      treatyRef: treaty.treatyRef,
      contractId,
      details: { treatyRef: treaty.treatyRef, treatyType: treaty.treatyType, currency: treaty.currency }
    });

    res.status(201).json({
      treaty,
      contractId,
      ledgerSynchronized: Boolean(contractId)
    });
  } catch (err) {
    next(err);
  }
});

// Propose treaty to market (Cedant or Broker)
router.post('/:ref/propose', requireRoles('Cedant', 'Broker'), async (req, res, next) => {
  try {
    const treaty = services.repository.getTreaty(req.params.ref);
    if (!treaty) return res.status(404).json({ error: 'NotFound', message: 'Treaty not found' });

    treaty.status = 'PendingApproval';
    services.repository.saveTreaty(treaty);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'TREATY_PROPOSED_TO_MARKET',
      treatyRef: treaty.treatyRef,
      details: { treatyRef: treaty.treatyRef }
    });

    res.json({ treaty, status: 'PendingApproval' });
  } catch (err) {
    next(err);
  }
});

// Reinsurer accepts participation line
router.post('/:ref/participations/:party/accept', requireRoles('Reinsurer'), async (req, res, next) => {
  try {
    const treatyRef = req.params.ref;
    const reinsurerParty = req.params.party;

    // Strict authorization: Reinsurer can ONLY accept for itself!
    if (req.user.party !== reinsurerParty) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Authenticated party "${req.user.party}" cannot accept participation for party "${reinsurerParty}"`
      });
    }

    const participations = services.repository.getParticipations(treatyRef);
    const p = participations.find(item => item.reinsurer === reinsurerParty);
    if (!p) {
      return res.status(404).json({ error: 'NotFound', message: `Participation for ${reinsurerParty} not found` });
    }

    p.status = 'Accepted';
    p.agreedAt = new Date().toISOString();
    services.repository.saveParticipation(p);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'PARTICIPATION_ACCEPTED',
      treatyRef,
      details: { reinsurer: reinsurerParty, linePercentage: p.linePercentage }
    });

    res.json({ participation: p });
  } catch (err) {
    next(err);
  }
});

// Cedant approves treaty into Active status
router.post('/:ref/approve', requireRoles('Cedant'), async (req, res, next) => {
  try {
    const treaty = services.repository.getTreaty(req.params.ref);
    if (!treaty) return res.status(404).json({ error: 'NotFound', message: 'Treaty not found' });

    // Validate that participating lines are accepted
    const participations = services.repository.getParticipations(treaty.treatyRef);
    const allAccepted = participations.length > 0 && participations.every(p => p.status === 'Accepted');

    if (!allAccepted) {
      return res.status(400).json({
        error: 'PreconditionFailed',
        message: 'Cannot approve treaty: Not all reinsurers have accepted their participation lines.'
      });
    }

    treaty.status = 'Active';
    services.repository.saveTreaty(treaty);

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'TREATY_ACTIVATED',
      treatyRef: treaty.treatyRef,
      details: { treatyRef: treaty.treatyRef }
    });

    res.json({ treaty, status: 'Active' });
  } catch (err) {
    next(err);
  }
});

export default router;
