import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { DisputeCase, RecoveryAdjustment, AllocationCycle } from '@resure-nexus/domain';
import { AlertOctagon, CheckCircle2, RotateCw, Plus, DollarSign, History } from 'lucide-react';

export const DisputeManagementScreen: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [adjustments, setAdjustments] = useState<RecoveryAdjustment[]>([]);
  const [cycles, setCycles] = useState<AllocationCycle[]>([]);
  const [activeTab, setActiveTab] = useState<'disputes' | 'adjustments'>('disputes');
  const [loading, setLoading] = useState(true);

  // Resolution Dialog State
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [adjustedAmount, setAdjustedAmount] = useState('');

  // Adjustment Dialog State
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjRef, setAdjRef] = useState(`ADJ-${Date.now().toString(36).toUpperCase()}`);
  const [selectedCycleRef, setSelectedCycleRef] = useState('');
  const [targetClaimRef, setTargetClaimRef] = useState('');
  const [adjType, setAdjType] = useState<'Salvage' | 'Subrogation' | 'RevisedLoss' | 'ThirdPartyRecovery'>('Salvage');
  const [adjAmount, setAdjAmount] = useState('50000.00');

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const activeRole = getActiveRole();

  const loadData = async () => {
    setLoading(true);
    try {
      const [dispRes, adjRes, cycRes] = await Promise.all([
        api.getDisputes(),
        api.getAdjustments(),
        api.getAllocationCycles()
      ]);
      setDisputes(dispRes.disputes || []);
      setAdjustments(adjRes.adjustments || []);
      setCycles(cycRes.cycles || []);
      if (cycRes.cycles?.length > 0 && !selectedCycleRef) {
        setSelectedCycleRef(cycRes.cycles[0].cycleRef);
      }
    } catch (err: any) {
      console.error('Failed to load disputes/adjustments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    setActionError(null);
    try {
      await api.resolveDispute(selectedDispute.disputeRef, {
        resolutionSummary,
        adjustedAmount: adjustedAmount ? { amount: adjustedAmount, currency: selectedDispute.disputedAmount.currency } : undefined
      });

      setActionSuccess(`Dispute "${selectedDispute.disputeRef}" resolved successfully!`);
      setSelectedDispute(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Dispute resolution failed');
    }
  };

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.createAdjustment({
        adjustmentRef: adjRef,
        originalCycleRef: selectedCycleRef,
        claimRef: targetClaimRef || 'CLM-PRIMARY',
        adjustmentType: adjType,
        adjustmentAmount: { amount: adjAmount, currency: 'USD' },
        effectiveDate: new Date().toISOString().split('T')[0],
        evidenceRefs: [
          {
            documentId: `DOC-${adjRef}`,
            documentType: 'SalvageSubrogationReceipt',
            contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            version: 1,
            uploadedAt: new Date().toISOString(),
            uploadedBy: activeRole
          }
        ]
      });

      setActionSuccess(`Recovery adjustment "${adjRef}" applied to cycle "${selectedCycleRef}". Prior recovery revised.`);
      setShowAdjustmentModal(false);
      setAdjRef(`ADJ-${Date.now().toString(36).toUpperCase()}`);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Adjustment creation failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Disputes & Recovery Adjustments</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Resolution workflows for contested allocations, salvage, subrogation, and post-settlement adjustments.
          </p>
        </div>
        {(activeRole === 'Cedant' || activeRole === 'Operations') && (
          <button className="btn btn-primary" onClick={() => setShowAdjustmentModal(true)}>
            <Plus size={16} /> New Recovery Adjustment
          </button>
        )}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <button
          className={`btn ${activeTab === 'disputes' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('disputes')}
        >
          Active Disputes ({disputes.length})
        </button>
        <button
          className={`btn ${activeTab === 'adjustments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('adjustments')}
        >
          Recovery Adjustments ({adjustments.length})
        </button>
      </div>

      {activeTab === 'disputes' ? (
        disputes.length === 0 ? (
          <div className="card empty-state">
            <CheckCircle2 className="empty-state-icon" style={{ color: 'var(--success)' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Active Contractual Disputes</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>All market allocations are in good standing.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Dispute Ref</th>
                  <th>Allocation Ref</th>
                  <th>Reinsurer Party</th>
                  <th>Disputed Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d) => (
                  <tr key={d.disputeRef}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--danger)' }}>
                      {d.disputeRef}
                    </td>
                    <td className="mono">{d.allocationRef}</td>
                    <td style={{ fontWeight: 600 }}>{d.reinsurer}</td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      ${d.disputedAmount.amount} {d.disputedAmount.currency}
                    </td>
                    <td style={{ fontSize: '12px', maxWidth: '320px' }}>{d.reason}</td>
                    <td>
                      <span className={`badge ${d.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      {d.status === 'Raised' && (activeRole === 'Cedant' || activeRole === 'Operations') && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedDispute(d);
                            setAdjustedAmount(d.disputedAmount.amount);
                            setResolutionSummary('Agreed compromise settlement following review of documentation');
                          }}
                        >
                          Resolve Dispute
                        </button>
                      )}
                      {d.status === 'Resolved' && (
                        <span style={{ fontSize: '11px', color: 'var(--success)' }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        adjustments.length === 0 ? (
          <div className="card empty-state">
            <DollarSign className="empty-state-icon" />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Recovery Adjustments</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Salvage proceeds and subrogation recoveries can be applied to reduce prior gross recoveries.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Adjustment Ref</th>
                  <th>Original Cycle Ref</th>
                  <th>Type</th>
                  <th>Deduction Amount</th>
                  <th>Prior Recovery</th>
                  <th>Revised Recovery</th>
                  <th>Effective Date</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((a) => (
                  <tr key={a.adjustmentRef}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {a.adjustmentRef}
                    </td>
                    <td className="mono">{a.originalCycleRef}</td>
                    <td><span className="badge badge-info">{a.adjustmentType}</span></td>
                    <td className="mono" style={{ color: 'var(--danger)', fontWeight: 700 }}>
                      -${a.adjustmentAmount.amount} {a.adjustmentAmount.currency}
                    </td>
                    <td className="mono">${a.priorRecovery.amount}</td>
                    <td className="mono" style={{ color: 'var(--success)', fontWeight: 700 }}>
                      ${a.revisedRecovery.amount}
                    </td>
                    <td>{a.effectiveDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Resolve Dispute Modal */}
      {selectedDispute && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Resolve Dispute {selectedDispute.disputeRef}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDispute(null)}>✕</button>
            </div>

            <form onSubmit={handleResolveDispute}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contested Reason:</div>
                <div style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 500, marginTop: '2px' }}>
                  {selectedDispute.reason}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Agreed Adjusted Amount ($)</label>
                <input
                  className="form-input mono"
                  required
                  value={adjustedAmount}
                  onChange={(e) => setAdjustedAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Findings & Endorsement Terms</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDispute(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Post-Settlement Recovery Adjustment</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAdjustmentModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateAdjustment}>
              <div className="form-group">
                <label className="form-label">Adjustment Reference</label>
                <input className="form-input mono" required value={adjRef} onChange={(e) => setAdjRef(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Original Allocation Cycle</label>
                  <select
                    className="form-select mono"
                    required
                    value={selectedCycleRef}
                    onChange={(e) => setSelectedCycleRef(e.target.value)}
                  >
                    {cycles.map(c => (
                      <option key={c.cycleRef} value={c.cycleRef}>
                        {c.cycleRef} (${c.totalGrossRecovery.amount})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Adjustment Type</label>
                  <select
                    className="form-select"
                    value={adjType}
                    onChange={(e: any) => setAdjType(e.target.value)}
                  >
                    <option value="Salvage">Salvage Proceeds</option>
                    <option value="Subrogation">Subrogation Recovery</option>
                    <option value="ThirdPartyRecovery">Third-Party Recovery</option>
                    <option value="RevisedLoss">Revised Loss Assessment</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deduction Recovery Amount ($)</label>
                <input
                  className="form-input mono"
                  required
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                />
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  This amount will reduce the subject loss and revised recovery according to contractual terms, floored at zero.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdjustmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
