import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { RecoverableAllocation, ReinsurerDecision } from '@resure-nexus/domain';
import { Building2, CheckCircle2, AlertOctagon, HelpCircle, FileText, Check, Shield } from 'lucide-react';

export const ReinsurerWorkspaceScreen: React.FC = () => {
  const [allocations, setAllocations] = useState<RecoverableAllocation[]>([]);
  const [decisions, setDecisions] = useState<ReinsurerDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllocation, setSelectedAllocation] = useState<RecoverableAllocation | null>(null);
  const [decisionType, setDecisionType] = useState<'Accept' | 'Dispute' | 'RequestInformation'>('Accept');
  const [decisionReason, setDecisionReason] = useState('Verified against treaty policy terms and loss calculations.');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const activeRole = getActiveRole();

  const loadData = async () => {
    setLoading(true);
    try {
      const [allocRes, decRes] = await Promise.all([
        api.getAllocations(),
        api.submitDecision({ allocationRef: 'DUMMY', decisionRef: 'DUMMY', decisionType: 'Accept', reason: 'DUMMY' }).catch(() => ({ decisions: [] })) // fallback
      ]);
      setAllocations(allocRes.allocations || []);
    } catch (err: any) {
      console.error('Failed to load reinsurer workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const handleOpenDecisionModal = (alloc: RecoverableAllocation, type: 'Accept' | 'Dispute' | 'RequestInformation') => {
    setSelectedAllocation(alloc);
    setDecisionType(type);
    setDecisionReason(
      type === 'Accept'
        ? 'Verified against treaty policy terms and loss calculations.'
        : type === 'Dispute'
        ? 'Disputing loss causation or date of occurrence within treaty attachment.'
        : 'Requesting original adjuster engineering report and salvage receipts.'
    );
  };

  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation) return;
    setActionError(null);
    try {
      const decisionRef = `DEC-${Date.now().toString(36).toUpperCase()}`;
      await api.submitDecision({
        decisionRef,
        allocationRef: selectedAllocation.allocationRef,
        decisionType,
        reason: decisionReason,
        evidenceRefs: []
      });

      setActionSuccess(`Decision "${decisionType}" recorded on allocation ${selectedAllocation.allocationRef}`);
      setSelectedAllocation(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Decision submission failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Reinsurer Market Portal</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Authorized market workspace for reviewing bilateral recoverable allocations, submitting contractual acceptance, or raising formal disputes.
        </p>
      </div>

      {actionSuccess && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'var(--success-subtle)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {actionSuccess}
        </div>
      )}

      {/* Privacy Notice Banner */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Shield size={20} color="var(--primary)" />
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Strict Canton Privacy Boundary:</strong> As a participating Reinsurer, you can only view allocations and claim evidence specifically designated for your organization. Other reinsurers' lines and private records are strictly concealed at the ledger level.
        </div>
      </div>

      {allocations.length === 0 ? (
        <div className="card empty-state">
          <Building2 className="empty-state-icon" />
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Allocations Assigned</div>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Allocations proposed by Cedant Operations for your participation lines will appear here for review.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Allocation Ref</th>
                <th>Cycle Ref</th>
                <th>Treaty</th>
                <th>Reinsurer Party</th>
                <th>Share %</th>
                <th>Allocated Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((alloc) => (
                <tr key={alloc.allocationRef}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {alloc.allocationRef}
                  </td>
                  <td className="mono" style={{ fontSize: '12px' }}>{alloc.cycleRef}</td>
                  <td className="mono">{alloc.treatyRef}</td>
                  <td style={{ fontWeight: 600 }}>{alloc.reinsurer}</td>
                  <td className="mono">{(parseFloat(alloc.linePercentage) * 100).toFixed(1)}%</td>
                  <td className="mono" style={{ fontWeight: 800, fontSize: '14px', color: 'var(--success)' }}>
                    ${alloc.allocatedAmount.amount} {alloc.allocatedAmount.currency}
                  </td>
                  <td>
                    <span className={`badge ${
                      alloc.status === 'Accepted' || alloc.status === 'Finalized' ? 'badge-success' :
                      alloc.status === 'Disputed' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {alloc.status}
                    </span>
                  </td>
                  <td>
                    {alloc.status === 'Proposed' && (activeRole === alloc.reinsurer || activeRole === 'Operations') && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleOpenDecisionModal(alloc, 'Accept')}
                        >
                          <Check size={12} /> Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleOpenDecisionModal(alloc, 'Dispute')}
                        >
                          Dispute
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDecisionModal(alloc, 'RequestInformation')}
                        >
                          Info
                        </button>
                      </div>
                    )}
                    {alloc.status !== 'Proposed' && (
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Decision Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decision Modal */}
      {selectedAllocation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {decisionType === 'Accept' ? 'Accept Allocation' : decisionType === 'Dispute' ? 'Raise Contractual Dispute' : 'Request Additional Information'}
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAllocation(null)}>✕</button>
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

            <form onSubmit={handleSubmitDecision}>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card-elevated)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Allocation Reference:</div>
                <div className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                  {selectedAllocation.allocationRef}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Allocated Recoverable:</div>
                <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>
                  ${selectedAllocation.allocatedAmount.amount} {selectedAllocation.allocatedAmount.currency}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contractual Reason & Evidence Justification</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  required
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedAllocation(null)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${decisionType === 'Accept' ? 'btn-success' : decisionType === 'Dispute' ? 'btn-danger' : 'btn-primary'}`}
                >
                  Submit {decisionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
