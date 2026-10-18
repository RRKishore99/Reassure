/**
 * Projection Repository
 * CRUD and query functions for all domain projections.
 */

import { ProjectionDatabase } from './db';
import {
  TreatyVersion,
  TreatyParticipation,
  ClaimCase,
  LossOccurrence,
  LossAssessment,
  AllocationCycle,
  RecoverableAllocation,
  ReinsurerDecision,
  DisputeCase,
  RecoveryAdjustment,
  RecoverableSettlement,
  SettlementReconciliation,
  AuditTrailEvent,
  Role
} from '@resure-nexus/domain';

export class ProjectionRepository {
  constructor(private readonly db: ProjectionDatabase) {}

  private get raw() {
    return this.db.getRawDb();
  }

  // Idempotency support
  recordIdempotency(key: string, result: any): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO idempotency_records (idempotency_key, created_at, status, result_json)
      VALUES (?, ?, 'COMPLETED', ?)
    `);
    stmt.run(key, new Date().toISOString(), JSON.stringify(result));
  }

  getIdempotency(key: string): any | null {
    const row = this.raw.prepare('SELECT result_json FROM idempotency_records WHERE idempotency_key = ?').get(key) as any;
    if (row && row.result_json) {
      return JSON.parse(row.result_json);
    }
    return null;
  }

  // Audit Events
  recordAuditEvent(event: AuditTrailEvent): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO audit_events (
        event_id, timestamp, party, role, action, contract_id, update_id,
        claim_ref, treaty_ref, allocation_ref, details_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      event.eventId,
      event.timestamp,
      event.party,
      event.role,
      event.action,
      event.contractId || null,
      event.updateId || null,
      event.claimRef || null,
      event.treatyRef || null,
      event.allocationRef || null,
      JSON.stringify(event.details || {})
    );
  }

  getAuditEvents(limit: number = 100): AuditTrailEvent[] {
    const rows = this.raw.prepare('SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT ?').all(limit) as any[];
    return rows.map(r => ({
      eventId: r.event_id,
      timestamp: r.timestamp,
      party: r.party,
      role: r.role as Role,
      action: r.action,
      contractId: r.contract_id,
      updateId: r.update_id,
      claimRef: r.claim_ref,
      treatyRef: r.treaty_ref,
      allocationRef: r.allocation_ref,
      details: JSON.parse(r.details_json || '{}')
    }));
  }

  // Treaties
  saveTreaty(treaty: TreatyVersion): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO treaties (
        treaty_ref, version, cedant, broker, treaty_type, inception_date,
        expiration_date, covered_business, loss_basis, currency, status,
        raw_json, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      treaty.treatyRef,
      treaty.version,
      treaty.cedant,
      treaty.broker,
      treaty.treatyType,
      treaty.inceptionDate,
      treaty.expirationDate,
      treaty.coveredBusiness,
      treaty.lossBasis,
      treaty.currency,
      treaty.status,
      JSON.stringify(treaty),
      treaty.contractId || null,
      new Date().toISOString()
    );
  }

  getTreaties(): TreatyVersion[] {
    const rows = this.raw.prepare('SELECT raw_json FROM treaties ORDER BY treaty_ref, version DESC').all() as any[];
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getTreaty(treatyRef: string, version?: number): TreatyVersion | null {
    let row: any;
    if (version !== undefined) {
      row = this.raw.prepare('SELECT raw_json FROM treaties WHERE treaty_ref = ? AND version = ?').get(treatyRef, version);
    } else {
      row = this.raw.prepare('SELECT raw_json FROM treaties WHERE treaty_ref = ? ORDER BY version DESC LIMIT 1').get(treatyRef);
    }
    return row ? JSON.parse(row.raw_json) : null;
  }

  // Participations
  saveParticipation(p: TreatyParticipation): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO treaty_participations (
        treaty_ref, version, reinsurer, line_percentage, status, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(p.treatyRef, p.treatyVersion, p.reinsurer, p.linePercentage, p.status, p.contractId || null, new Date().toISOString());
  }

  getParticipations(treatyRef?: string): TreatyParticipation[] {
    let rows: any[];
    if (treatyRef) {
      rows = this.raw.prepare('SELECT * FROM treaty_participations WHERE treaty_ref = ?').all(treatyRef);
    } else {
      rows = this.raw.prepare('SELECT * FROM treaty_participations').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      treatyRef: r.treaty_ref,
      treatyVersion: r.version,
      cedant: '',
      reinsurer: r.reinsurer,
      broker: '',
      linePercentage: r.line_percentage,
      status: r.status as any
    }));
  }

  // Claims
  saveClaim(claim: ClaimCase): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO claims (
        claim_ref, policy_ref, cedant, date_of_loss, occurrence_ref,
        gross_amount, currency, status, raw_json, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      claim.claimRef,
      claim.policyRef,
      claim.cedant,
      claim.dateOfLoss,
      claim.occurrenceRef || null,
      claim.grossLoss.amount,
      claim.currency,
      claim.status,
      JSON.stringify(claim),
      claim.contractId || null,
      new Date().toISOString()
    );

    // Save evidence manifests
    if (claim.evidenceRefs) {
      const evStmt = this.raw.prepare(`
        INSERT OR REPLACE INTO claim_evidence (
          document_id, claim_ref, document_type, content_hash, version, uploaded_at, uploaded_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const ev of claim.evidenceRefs) {
        evStmt.run(ev.documentId, claim.claimRef, ev.documentType, ev.contentHash, ev.version, ev.uploadedAt, ev.uploadedBy);
      }
    }
  }

  getClaims(filterParty?: string, role?: Role): ClaimCase[] {
    const rows = this.raw.prepare('SELECT raw_json FROM claims ORDER BY date_of_loss DESC').all() as any[];
    const all = rows.map(r => JSON.parse(r.raw_json) as ClaimCase);

    // Enforce privacy boundaries:
    // Cedant, Adjuster, Operations, Audit see claims. Reinsurers see claims ONLY if allocated to them or under their treaty
    if (role === 'Reinsurer' && filterParty) {
      const allocatedClaimRefs = new Set(
        this.raw.prepare('SELECT claim_ref FROM recoverable_allocations WHERE reinsurer = ?').all(filterParty).map((r: any) => r.claim_ref)
      );
      return all.filter(c => allocatedClaimRefs.has(c.claimRef));
    }
    return all;
  }

  getClaim(claimRef: string): ClaimCase | null {
    const row = this.raw.prepare('SELECT raw_json FROM claims WHERE claim_ref = ?').get(claimRef) as any;
    return row ? JSON.parse(row.raw_json) : null;
  }

  // Occurrences
  saveOccurrence(occ: LossOccurrence): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO occurrences (
        occurrence_ref, cedant, title, commencement_date, expiration_date,
        is_frozen, is_closed, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      occ.occurrenceRef,
      occ.cedant,
      occ.title,
      occ.commencementDate,
      occ.expirationDate,
      occ.isFrozen ? 1 : 0,
      occ.isClosed ? 1 : 0,
      occ.contractId || null,
      new Date().toISOString()
    );

    const relStmt = this.raw.prepare('INSERT OR IGNORE INTO occurrence_claims (occurrence_ref, claim_ref) VALUES (?, ?)');
    for (const claimRef of occ.claimRefs) {
      relStmt.run(occ.occurrenceRef, claimRef);
    }
  }

  getOccurrences(): LossOccurrence[] {
    const rows = this.raw.prepare('SELECT * FROM occurrences ORDER BY commencement_date DESC').all() as any[];
    return rows.map(r => {
      const claims = this.raw.prepare('SELECT claim_ref FROM occurrence_claims WHERE occurrence_ref = ?').all(r.occurrence_ref) as any[];
      return {
        contractId: r.contract_id,
        occurrenceRef: r.occurrence_ref,
        cedant: r.cedant,
        title: r.title,
        commencementDate: r.commencement_date,
        expirationDate: r.expiration_date,
        isFrozen: Boolean(r.is_frozen),
        isClosed: Boolean(r.is_closed),
        claimRefs: claims.map(c => c.claim_ref),
        notes: ''
      };
    });
  }

  // Assessments
  saveAssessment(a: LossAssessment): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO assessments (
        assessment_ref, claim_ref, adjuster, version, assessed_amount,
        deductible_amount, eligible_amount, currency, status, methodology,
        contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      a.assessmentRef,
      a.claimRef,
      a.adjuster,
      a.version,
      a.assessedLoss.amount,
      a.deductibleApplied.amount,
      a.eligibleLoss.amount,
      a.eligibleLoss.currency,
      a.status,
      a.methodology,
      a.contractId || null,
      new Date().toISOString()
    );
  }

  getAssessments(claimRef?: string): LossAssessment[] {
    let rows: any[];
    if (claimRef) {
      rows = this.raw.prepare('SELECT * FROM assessments WHERE claim_ref = ? ORDER BY version DESC').all(claimRef);
    } else {
      rows = this.raw.prepare('SELECT * FROM assessments ORDER BY updated_at DESC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      assessmentRef: r.assessment_ref,
      claimRef: r.claim_ref,
      adjuster: r.adjuster,
      cedant: '',
      version: r.version,
      assessedLoss: { amount: r.assessed_amount, currency: r.currency },
      deductibleApplied: { amount: r.deductible_amount, currency: r.currency },
      eligibleLoss: { amount: r.eligible_amount, currency: r.currency },
      status: r.status as any,
      methodology: r.methodology,
      evidenceRefs: [],
      notes: ''
    }));
  }

  // Allocations & Cycles
  saveAllocationCycle(c: AllocationCycle): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO allocation_cycles (
        cycle_ref, treaty_ref, treaty_version, occurrence_ref, treaty_type,
        eligible_subject_loss, total_gross_recovery, total_allocated,
        unplaced_recovery, currency, status, calculation_methodology,
        contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      c.cycleRef,
      c.treatyRef,
      c.treatyVersion,
      c.occurrenceRef || null,
      c.treatyType,
      c.eligibleSubjectLoss.amount,
      c.totalGrossRecovery.amount,
      c.totalAllocated.amount,
      c.unplacedRecovery.amount,
      c.eligibleSubjectLoss.currency,
      c.status,
      c.calculationMethodology,
      c.contractId || null,
      new Date().toISOString()
    );
  }

  getAllocationCycles(): AllocationCycle[] {
    const rows = this.raw.prepare('SELECT * FROM allocation_cycles ORDER BY updated_at DESC').all() as any[];
    return rows.map(r => ({
      contractId: r.contract_id,
      cycleRef: r.cycle_ref,
      treatyRef: r.treaty_ref,
      treatyVersion: r.treaty_version,
      claimRefs: [],
      occurrenceRef: r.occurrence_ref,
      treatyType: r.treaty_type as any,
      eligibleSubjectLoss: { amount: r.eligible_subject_loss, currency: r.currency },
      totalGrossRecovery: { amount: r.total_gross_recovery, currency: r.currency },
      totalAllocated: { amount: r.total_allocated, currency: r.currency },
      unplacedRecovery: { amount: r.unplaced_recovery, currency: r.currency },
      status: r.status as any,
      calculationMethodology: r.calculation_methodology,
      calculatedAt: r.updated_at
    }));
  }

  saveRecoverableAllocation(a: RecoverableAllocation): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO recoverable_allocations (
        allocation_ref, cycle_ref, claim_ref, treaty_ref, reinsurer,
        allocated_amount, currency, line_percentage, status,
        contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      a.allocationRef,
      a.cycleRef,
      a.claimRef,
      a.treatyRef,
      a.reinsurer,
      a.allocatedAmount.amount,
      a.allocatedAmount.currency,
      a.linePercentage,
      a.status,
      a.contractId || null,
      new Date().toISOString()
    );
  }

  getRecoverableAllocations(filterParty?: string, role?: Role): RecoverableAllocation[] {
    let rows: any[];
    if (role === 'Reinsurer' && filterParty) {
      // Reinsurer sees ONLY their own allocations!
      rows = this.raw.prepare('SELECT * FROM recoverable_allocations WHERE reinsurer = ? ORDER BY updated_at DESC').all(filterParty);
    } else {
      rows = this.raw.prepare('SELECT * FROM recoverable_allocations ORDER BY updated_at DESC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      allocationRef: r.allocation_ref,
      cycleRef: r.cycle_ref,
      claimRef: r.claim_ref,
      treatyRef: r.treaty_ref,
      treatyVersion: 1,
      reinsurer: r.reinsurer,
      cedant: 'Cedant',
      allocatedAmount: { amount: r.allocated_amount, currency: r.currency },
      linePercentage: r.line_percentage,
      status: r.status as any,
      calculationBreakdown: ''
    }));
  }

  // Reinsurer Decisions
  saveReinsurerDecision(d: ReinsurerDecision): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO reinsurer_decisions (
        decision_ref, allocation_ref, reinsurer, decision_type, reason, timestamp, contract_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(d.decisionRef, d.allocationRef, d.reinsurer, d.decisionType, d.reason, d.timestamp, d.contractId || null);
  }

  getReinsurerDecisions(allocationRef?: string): ReinsurerDecision[] {
    let rows: any[];
    if (allocationRef) {
      rows = this.raw.prepare('SELECT * FROM reinsurer_decisions WHERE allocation_ref = ?').all(allocationRef);
    } else {
      rows = this.raw.prepare('SELECT * FROM reinsurer_decisions ORDER BY timestamp DESC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      decisionRef: r.decision_ref,
      allocationRef: r.allocation_ref,
      reinsurer: r.reinsurer,
      cedant: 'Cedant',
      decisionType: r.decision_type as any,
      reason: r.reason,
      evidenceRefs: [],
      timestamp: r.timestamp
    }));
  }

  // Disputes
  saveDispute(d: DisputeCase): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO disputes (
        dispute_ref, allocation_ref, reinsurer, disputed_amount, currency,
        reason, status, resolution_summary, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      d.disputeRef,
      d.allocationRef,
      d.reinsurer,
      d.disputedAmount.amount,
      d.disputedAmount.currency,
      d.reason,
      d.status,
      d.resolutionSummary || null,
      d.contractId || null,
      new Date().toISOString()
    );
  }

  getDisputes(filterParty?: string, role?: Role): DisputeCase[] {
    let rows: any[];
    if (role === 'Reinsurer' && filterParty) {
      rows = this.raw.prepare('SELECT * FROM disputes WHERE reinsurer = ?').all(filterParty);
    } else {
      rows = this.raw.prepare('SELECT * FROM disputes ORDER BY updated_at DESC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      disputeRef: r.dispute_ref,
      allocationRef: r.allocation_ref,
      reinsurer: r.reinsurer,
      cedant: 'Cedant',
      disputedAmount: { amount: r.disputed_amount, currency: r.currency },
      reason: r.reason,
      evidenceRefs: [],
      status: r.status as any,
      raisedAt: r.updated_at,
      resolutionSummary: r.resolution_summary
    }));
  }

  // Recovery Adjustments
  saveRecoveryAdjustment(adj: RecoveryAdjustment): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO recovery_adjustments (
        adjustment_ref, original_cycle_ref, claim_ref, adjustment_type,
        adjustment_amount, prior_recovery, revised_recovery, currency,
        approved_by, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      adj.adjustmentRef,
      adj.originalCycleRef,
      adj.claimRef,
      adj.adjustmentType,
      adj.adjustmentAmount.amount,
      adj.priorRecovery.amount,
      adj.revisedRecovery.amount,
      adj.adjustmentAmount.currency,
      adj.approvedBy,
      adj.contractId || null,
      new Date().toISOString()
    );
  }

  getRecoveryAdjustments(): RecoveryAdjustment[] {
    const rows = this.raw.prepare('SELECT * FROM recovery_adjustments ORDER BY updated_at DESC').all() as any[];
    return rows.map(r => ({
      contractId: r.contract_id,
      adjustmentRef: r.adjustment_ref,
      originalCycleRef: r.original_cycle_ref,
      claimRef: r.claim_ref,
      adjustmentType: r.adjustment_type as any,
      adjustmentAmount: { amount: r.adjustment_amount, currency: r.currency },
      priorRecovery: { amount: r.prior_recovery, currency: r.currency },
      revisedRecovery: { amount: r.revised_recovery, currency: r.currency },
      effectiveDate: r.updated_at,
      evidenceRefs: [],
      approvedBy: r.approved_by
    }));
  }

  // Settlements
  saveSettlement(s: RecoverableSettlement): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO settlements (
        settlement_ref, allocation_ref, reinsurer, cedant,
        amount_due, amount_settled, outstanding_balance, currency,
        due_date, status, permit_partial, contract_id, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      s.settlementRef,
      s.allocationRef,
      s.reinsurer,
      s.cedant,
      s.amountDue.amount,
      s.amountSettled.amount,
      s.outstandingBalance.amount,
      s.amountDue.currency,
      s.dueDate,
      s.status,
      s.permitPartial ? 1 : 0,
      s.contractId || null,
      new Date().toISOString()
    );
  }

  getSettlements(filterParty?: string, role?: Role): RecoverableSettlement[] {
    let rows: any[];
    if (role === 'Reinsurer' && filterParty) {
      rows = this.raw.prepare('SELECT * FROM settlements WHERE reinsurer = ?').all(filterParty);
    } else {
      rows = this.raw.prepare('SELECT * FROM settlements ORDER BY due_date ASC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      settlementRef: r.settlement_ref,
      allocationRef: r.allocation_ref,
      reinsurer: r.reinsurer,
      cedant: r.cedant,
      amountDue: { amount: r.amount_due, currency: r.currency },
      amountSettled: { amount: r.amount_settled, currency: r.currency },
      outstandingBalance: { amount: r.outstanding_balance, currency: r.currency },
      dueDate: r.due_date,
      status: r.status as any,
      permitPartial: Boolean(r.permit_partial)
    }));
  }

  // Settlement Reconciliations
  saveSettlementReconciliation(r: SettlementReconciliation): void {
    const stmt = this.raw.prepare(`
      INSERT OR REPLACE INTO settlement_reconciliations (
        reconciliation_ref, settlement_ref, confirmed_amount, currency,
        reconciliation_source, confirmed_by, confirmation_time,
        payment_document_id, contract_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      r.reconciliationRef,
      r.settlementRef,
      r.confirmedAmount.amount,
      r.confirmedAmount.currency,
      r.reconciliationSource,
      r.confirmedBy,
      r.confirmationTime,
      r.paymentEvidence.documentId,
      r.contractId || null
    );
  }

  getSettlementReconciliations(settlementRef?: string): SettlementReconciliation[] {
    let rows: any[];
    if (settlementRef) {
      rows = this.raw.prepare('SELECT * FROM settlement_reconciliations WHERE settlement_ref = ?').all(settlementRef);
    } else {
      rows = this.raw.prepare('SELECT * FROM settlement_reconciliations ORDER BY confirmation_time DESC').all();
    }
    return rows.map(r => ({
      contractId: r.contract_id,
      reconciliationRef: r.reconciliation_ref,
      settlementRef: r.settlement_ref,
      confirmedAmount: { amount: r.confirmed_amount, currency: r.currency },
      reconciliationSource: r.reconciliation_source,
      confirmedBy: r.confirmed_by,
      confirmationTime: r.confirmation_time,
      paymentEvidence: {
        documentId: r.payment_document_id,
        documentType: 'PaymentReceipt',
        contentHash: '',
        version: 1,
        uploadedAt: r.confirmation_time,
        uploadedBy: r.confirmed_by
      },
      remainingOutstanding: { amount: '0.00', currency: r.currency }
    }));
  }

  // Honest Dashboard Statistics (Section 40)
  getDashboardMetrics(party?: string, role?: Role): {
    claimsAwaitingAssessment: number;
    claimsAwaitingReinsurerResponse: number;
    outstandingRecoverables: string;
    disputedRecoverables: string;
    acceptedUnsettledRecoverables: string;
    overdueSettlementItems: number;
    recentLedgerEvents: number;
    currency: string;
  } {
    const claims = this.getClaims(party, role);
    const awaitingAssessment = claims.filter(c => c.status === 'Reported' || c.status === 'UnderAssessment').length;

    const allocations = this.getRecoverableAllocations(party, role);
    const awaitingReinsurer = allocations.filter(a => a.status === 'Proposed').length;

    let totalOutstanding = 0;
    let totalDisputed = 0;
    let totalAcceptedUnsettled = 0;
    let overdueCount = 0;
    const now = new Date().toISOString();

    const settlements = this.getSettlements(party, role);
    for (const s of settlements) {
      const balance = parseFloat(s.outstandingBalance.amount) || 0;
      totalOutstanding += balance;
      if (s.status === 'Pending' || s.status === 'PartialSettled') {
        totalAcceptedUnsettled += balance;
        if (s.dueDate && s.dueDate < now) {
          overdueCount++;
        }
      }
    }

    const disputes = this.getDisputes(party, role);
    for (const d of disputes) {
      if (d.status === 'Raised' || d.status === 'UnderReview') {
        totalDisputed += parseFloat(d.disputedAmount.amount) || 0;
      }
    }

    const recentEvents = this.getAuditEvents(10).length;

    return {
      claimsAwaitingAssessment: awaitingAssessment,
      claimsAwaitingReinsurerResponse: awaitingReinsurer,
      outstandingRecoverables: totalOutstanding.toFixed(2),
      disputedRecoverables: totalDisputed.toFixed(2),
      acceptedUnsettledRecoverables: totalAcceptedUnsettled.toFixed(2),
      overdueSettlementItems: overdueCount,
      recentLedgerEvents: recentEvents,
      currency: 'USD'
    };
  }
}
