import { Router } from 'express';
import { SubmitAssessmentSchema, LossAssessment } from '@resure-nexus/domain';
import { TEMPLATES } from '@resure-nexus/ledger-client';
import { requireRoles } from '../middleware/auth';
import { services } from '../services';

const router = Router();

// List assessments
router.get('/', (req, res) => {
  const claimRef = req.query.claimRef as string | undefined;
  const assessments = services.repository.getAssessments(claimRef);
  res.json({ assessments });
});

// Submit assessment (Adjuster)
router.post('/', requireRoles('Adjuster', 'Operations'), async (req, res, next) => {
  try {
    const validated = SubmitAssessmentSchema.parse(req.body);

    const assessment: LossAssessment = {
      assessmentRef: validated.assessmentRef,
      claimRef: validated.claimRef,
      adjuster: req.user.party,
      cedant: 'Cedant',
      version: 1,
      assessedLoss: validated.assessedLoss,
      deductibleApplied: validated.deductibleApplied,
      eligibleLoss: validated.eligibleLoss,
      status: 'Submitted',
      methodology: validated.methodology,
      evidenceRefs: validated.evidenceRefs,
      notes: validated.notes,
      submittedAt: new Date().toISOString()
    };

    let contractId: string | undefined;
    const ledgerStatus = await services.ledgerClient.checkConnectivity();
    if (ledgerStatus.connected) {
      try {
        const result = await services.ledgerClient.createContract(
          TEMPLATES.LossAssessment,
          assessment,
          req.user.party,
          { commandId: `ASSESS-CREATE-${assessment.assessmentRef}` }
        );
        contractId = result.contractId;
      } catch (err: any) {
        console.warn(`[WARN] Ledger create failed: ${err.message}`);
      }
    }

    assessment.contractId = contractId;
    services.repository.saveAssessment(assessment);

    // Update claim status to UnderAssessment if not already
    const claim = services.repository.getClaim(assessment.claimRef);
    if (claim && claim.status === 'Reported') {
      claim.status = 'UnderAssessment';
      services.repository.saveClaim(claim);
    }

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'ASSESSMENT_SUBMITTED',
      claimRef: assessment.claimRef,
      contractId,
      details: { assessmentRef: assessment.assessmentRef, eligibleLoss: assessment.eligibleLoss }
    });

    res.status(201).json({ assessment, contractId });
  } catch (err) {
    next(err);
  }
});

// Approve assessment (Cedant)
router.post('/:ref/approve', requireRoles('Cedant'), async (req, res, next) => {
  try {
    const assessments = services.repository.getAssessments();
    const assessment = assessments.find(a => a.assessmentRef === req.params.ref);
    if (!assessment) return res.status(404).json({ error: 'NotFound', message: 'Assessment not found' });

    assessment.status = 'Approved';
    assessment.approvedAt = new Date().toISOString();
    services.repository.saveAssessment(assessment);

    // Update claim status to Assessed
    const claim = services.repository.getClaim(assessment.claimRef);
    if (claim) {
      claim.status = 'Assessed';
      services.repository.saveClaim(claim);
    }

    services.repository.recordAuditEvent({
      eventId: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      party: req.user.party,
      role: req.user.role,
      action: 'ASSESSMENT_APPROVED',
      claimRef: assessment.claimRef,
      details: { assessmentRef: assessment.assessmentRef }
    });

    res.json({ assessment, claimStatus: 'Assessed' });
  } catch (err) {
    next(err);
  }
});

export default router;
