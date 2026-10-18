import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { LossAssessment, ClaimCase } from '@resure-nexus/domain';
import { Calculator, CheckCircle2, Plus, FileText, AlertCircle } from 'lucide-react';

export const AssessmentScreen: React.FC = () => {
  const [assessments, setAssessments] = useState<LossAssessment[]>([]);
  const [claims, setClaims] = useState<ClaimCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [assessmentRef, setAssessmentRef] = useState('');
  const [selectedClaimRef, setSelectedClaimRef] = useState('');
  const [assessedAmount, setAssessedAmount] = useState('1400000.00');
  const [deductibleAmount, setDeductibleAmount] = useState('100000.00');
  const [methodology, setMethodology] = useState('Forensic engineering inspection and schedule of property values reconciliation');
  const [notes, setNotes] = useState('Structural remediation verified by structural engineer report');

  const activeRole = getActiveRole();

  const loadData = async () => {
    setLoading(true);
    try {
      const [assessRes, claimsRes] = await Promise.all([
        api.getAssessments(),
        api.getClaims()
      ]);
      setAssessments(assessRes.assessments || []);
      setClaims(claimsRes.claims || []);
      if (claimsRes.claims?.length > 0 && !selectedClaimRef) {
        setSelectedClaimRef(claimsRes.claims[0].claimRef);
      }
    } catch (err: any) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  // Derived eligible loss: Assessed - Deductible
  const eligibleAmount = Math.max(0, (parseFloat(assessedAmount) || 0) - (parseFloat(deductibleAmount) || 0)).toFixed(2);

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.submitAssessment({
        assessmentRef,
        claimRef: selectedClaimRef,
        assessedLoss: { amount: assessedAmount, currency: 'USD' },
        deductibleApplied: { amount: deductibleAmount, currency: 'USD' },
        eligibleLoss: { amount: eligibleAmount, currency: 'USD' },
        methodology,
        notes,
        evidenceRefs: [
          {
            documentId: `DOC-ASM-${assessmentRef}`,
            documentType: 'AdjusterReport',
            contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            version: 1,
            uploadedAt: new Date().toISOString(),
            uploadedBy: activeRole
          }
        ]
      });

      setShowSubmitModal(false);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Submission failed');
    }
  };

  const handleApproveAssessment = async (ref: string) => {
    try {
      await api.approveAssessment(ref);
      await loadData();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Loss Assessment Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Independent adjuster inspection reports, itemized deductions, and eligible loss authorization.
          </p>
        </div>
        {(activeRole === 'Adjuster' || activeRole === 'Operations') && (
          <button className="btn btn-primary" onClick={() => setShowSubmitModal(true)}>
            <Plus size={16} /> Submit Loss Assessment
          </button>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className="card empty-state">
          <Calculator className="empty-state-icon" />
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Assessments Submitted</div>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            {activeRole === 'Adjuster'
              ? 'Click "Submit Loss Assessment" to record an independent loss adjustment report.'
              : 'Loss assessments submitted by the independent adjuster will appear here for Cedant approval.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assessments.map((a) => (
            <div key={a.assessmentRef} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                      {a.assessmentRef}
                    </span>
                    <span className="badge badge-neutral">v{a.version}</span>
                    <span className="badge badge-neutral">Claim: {a.claimRef}</span>
                    <span className={`badge ${a.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Adjuster: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{a.adjuster}</span>
                  </div>
                </div>

                {a.status === 'Submitted' && activeRole === 'Cedant' && (
                  <button className="btn btn-success btn-sm" onClick={() => handleApproveAssessment(a.assessmentRef)}>
                    <CheckCircle2 size={14} /> Approve Assessment
                  </button>
                )}
              </div>

              {/* Loss Breakdown Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-elevated)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div className="form-label" style={{ marginBottom: '2px' }}>Gross Assessed Loss</div>
                  <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                    ${a.assessedLoss.amount} {a.assessedLoss.currency}
                  </div>
                </div>
                <div>
                  <div className="form-label" style={{ marginBottom: '2px' }}>Deductible Applied</div>
                  <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)' }}>
                    -${a.deductibleApplied.amount} {a.deductibleApplied.currency}
                  </div>
                </div>
                <div>
                  <div className="form-label" style={{ marginBottom: '2px' }}>Net Eligible Subject Loss</div>
                  <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>
                    ${a.eligibleLoss.amount} {a.eligibleLoss.currency}
                  </div>
                </div>
              </div>

              <div>
                <div className="form-label">Methodology & Justification</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px' }}>
                  {a.methodology}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Assessment Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Loss Assessment</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSubmitModal(false)}>✕</button>
            </div>

            {actionError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--danger-subtle)',
                color: 'var(--danger)',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmitAssessment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assessment Reference</label>
                  <input
                    className="form-input mono"
                    required
                    placeholder="e.g. ASM-2026-001"
                    value={assessmentRef}
                    onChange={(e) => setAssessmentRef(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Claim</label>
                  <select
                    className="form-select mono"
                    required
                    value={selectedClaimRef}
                    onChange={(e) => setSelectedClaimRef(e.target.value)}
                  >
                    {claims.map(c => (
                      <option key={c.claimRef} value={c.claimRef}>
                        {c.claimRef} (${c.grossLoss.amount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Assessed Loss ($)</label>
                  <input
                    className="form-input mono"
                    required
                    value={assessedAmount}
                    onChange={(e) => setAssessedAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Deductible Applied ($)</label>
                  <input
                    className="form-input mono"
                    required
                    value={deductibleAmount}
                    onChange={(e) => setDeductibleAmount(e.target.value)}
                  />
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Calculated Eligible Subject Loss:</span>
                <span className="mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                  ${eligibleAmount} USD
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Methodology & Standards</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  required
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adjuster Notes</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
