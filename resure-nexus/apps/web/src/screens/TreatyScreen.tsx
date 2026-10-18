import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { TreatyVersion, TreatyParticipation } from '@resure-nexus/domain';
import { FileSignature, Plus, CheckCircle, Send, AlertCircle, Layers } from 'lucide-react';

export const TreatyScreen: React.FC = () => {
  const [treaties, setTreaties] = useState<TreatyVersion[]>([]);
  const [participations, setParticipations] = useState<TreatyParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [treatyRef, setTreatyRef] = useState('');
  const [treatyType, setTreatyType] = useState<'QuotaShare' | 'ExcessOfLoss'>('QuotaShare');
  const [inceptionDate, setInceptionDate] = useState('2026-01-01');
  const [expirationDate, setExpirationDate] = useState('2026-12-31');
  const [coveredBusiness, setCoveredBusiness] = useState('Commercial Property & Marine');
  const [lossBasis, setLossBasis] = useState<'RiskAttaching' | 'LossOccurring' | 'ClaimsMade'>('LossOccurring');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [cededPercentage, setCededPercentage] = useState('0.40');
  const [contractualCap, setContractualCap] = useState('2500000.00');
  const [attachmentPoint, setAttachmentPoint] = useState('1000000.00');
  const [layerLimit, setLayerLimit] = useState('2000000.00');
  const [r1Share, setR1Share] = useState('0.60');
  const [r2Share, setR2Share] = useState('0.40');

  const activeRole = getActiveRole();

  const loadTreaties = async () => {
    setLoading(true);
    try {
      const res = await api.getTreaties();
      setTreaties(res.treaties || []);
      setParticipations(res.participations || []);
    } catch (err: any) {
      console.error('Failed to load treaties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreaties();
  }, [activeRole]);

  const handleCreateTreaty = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const payload: any = {
        treatyRef,
        treatyType,
        inceptionDate,
        expirationDate,
        coveredBusiness,
        lossBasis,
        currency,
        participatingReinsurers: [
          { reinsurer: 'Reinsurer1', linePercentage: r1Share, participationRef: `PRT-R1-${treatyRef}` },
          { reinsurer: 'Reinsurer2', linePercentage: r2Share, participationRef: `PRT-R2-${treatyRef}` }
        ],
        evidenceRefs: []
      };

      if (treatyType === 'QuotaShare') {
        payload.quotaShareTerms = {
          cededPercentage,
          contractualCap: contractualCap ? { amount: contractualCap, currency } : undefined
        };
      } else {
        payload.excessOfLossTerms = {
          attachmentPoint: { amount: attachmentPoint, currency },
          layerLimit: { amount: layerLimit, currency },
          layerNumber: 1
        };
      }

      await api.createTreaty(payload);
      setShowCreateModal(false);
      await loadTreaties();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create treaty');
    }
  };

  const handlePropose = async (ref: string) => {
    try {
      await api.proposeTreaty(ref);
      await loadTreaties();
    } catch (err: any) {
      alert(`Proposal failed: ${err.message}`);
    }
  };

  const handleAcceptParticipation = async (ref: string, reinsurerParty: string) => {
    try {
      await api.acceptParticipation(ref, reinsurerParty);
      await loadTreaties();
    } catch (err: any) {
      alert(`Acceptance failed: ${err.message}`);
    }
  };

  const handleApproveTreaty = async (ref: string) => {
    try {
      await api.approveTreaty(ref);
      await loadTreaties();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Treaty Administration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Versioned contractual agreements, participation lines, and multi-party market terms.
          </p>
        </div>
        {(activeRole === 'Cedant' || activeRole === 'Broker' || activeRole === 'Operations') && (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> New Treaty Agreement
          </button>
        )}
      </div>

      {treaties.length === 0 ? (
        <div className="card empty-state">
          <FileSignature className="empty-state-icon" />
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Treaties Configured</div>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Click "New Treaty Agreement" to define a Quota-Share or Excess-of-Loss reinsurance contract.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {treaties.map((treaty) => {
            const treatyParts = participations.filter(p => p.treatyRef === treaty.treatyRef);
            const allAccepted = treatyParts.length > 0 && treatyParts.every(p => p.status === 'Accepted');

            return (
              <div key={treaty.treatyRef} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                        {treaty.treatyRef}
                      </span>
                      <span className="badge badge-neutral">v{treaty.version}</span>
                      <span className="badge badge-info">{treaty.treatyType}</span>
                      <span className={`badge ${
                        treaty.status === 'Active' ? 'badge-success' : treaty.status === 'PendingApproval' ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {treaty.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {treaty.coveredBusiness} • Loss Basis: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{treaty.lossBasis}</span> • Currency: <span className="mono" style={{ color: 'var(--text-main)' }}>{treaty.currency}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Term: {treaty.inceptionDate} to {treaty.expirationDate}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {treaty.status === 'Draft' && (activeRole === 'Cedant' || activeRole === 'Broker') && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handlePropose(treaty.treatyRef)}>
                        <Send size={14} /> Propose to Market
                      </button>
                    )}

                    {treaty.status === 'PendingApproval' && activeRole === 'Cedant' && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={!allAccepted}
                        onClick={() => handleApproveTreaty(treaty.treatyRef)}
                        title={!allAccepted ? 'All reinsurers must accept before treaty activation' : ''}
                      >
                        <CheckCircle size={14} /> Activate Treaty
                      </button>
                    )}
                  </div>
                </div>

                {/* Terms Breakdown */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '32px'
                }}>
                  {treaty.treatyType === 'QuotaShare' && treaty.quotaShareTerms ? (
                    <>
                      <div>
                        <div className="form-label" style={{ marginBottom: '2px' }}>Ceded Percentage</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {(parseFloat(treaty.quotaShareTerms.cededPercentage) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '2px' }}>Contractual Cap</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {treaty.quotaShareTerms.contractualCap ? `$${treaty.quotaShareTerms.contractualCap.amount}` : 'None (Uncapped)'}
                        </div>
                      </div>
                    </>
                  ) : treaty.excessOfLossTerms ? (
                    <>
                      <div>
                        <div className="form-label" style={{ marginBottom: '2px' }}>Attachment Point</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                          ${treaty.excessOfLossTerms.attachmentPoint.amount}
                        </div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '2px' }}>Layer Limit</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                          ${treaty.excessOfLossTerms.layerLimit.amount} (Layer {treaty.excessOfLossTerms.layerNumber})
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Market Participations */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Participating Reinsurer Lines
                  </div>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Reinsurer Party</th>
                          <th>Line Percentage</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treatyParts.map((p) => (
                          <tr key={p.reinsurer}>
                            <td style={{ fontWeight: 600 }}>{p.reinsurer}</td>
                            <td className="mono">{(parseFloat(p.linePercentage) * 100).toFixed(1)}%</td>
                            <td>
                              <span className={`badge ${p.status === 'Accepted' ? 'badge-success' : 'badge-warning'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td>
                              {p.status === 'Proposed' && activeRole === p.reinsurer && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAcceptParticipation(treaty.treatyRef, p.reinsurer)}
                                >
                                  Accept Line
                                </button>
                              )}
                              {p.status === 'Accepted' && (
                                <span style={{ fontSize: '12px', color: 'var(--success)' }}>Agreement Binding</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Treaty Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Treaty Agreement</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>✕</button>
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

            <form onSubmit={handleCreateTreaty}>
              <div className="form-group">
                <label className="form-label">Treaty Reference Identifier</label>
                <input
                  className="form-input mono"
                  required
                  placeholder="e.g. TRT-2026-QS-01"
                  value={treatyRef}
                  onChange={(e) => setTreatyRef(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Treaty Type</label>
                  <select
                    className="form-select"
                    value={treatyType}
                    onChange={(e: any) => setTreatyType(e.target.value)}
                  >
                    <option value="QuotaShare">Quota Share (Pro-Rata)</option>
                    <option value="ExcessOfLoss">Per-Occurrence Excess of Loss (XoL)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(e: any) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Inception Date</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={inceptionDate}
                    onChange={(e) => setInceptionDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Covered Business Description</label>
                <input
                  className="form-input"
                  required
                  value={coveredBusiness}
                  onChange={(e) => setCoveredBusiness(e.target.value)}
                />
              </div>

              {treatyType === 'QuotaShare' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Ceded Share (0.0 to 1.0)</label>
                    <input
                      className="form-input mono"
                      required
                      placeholder="0.40"
                      value={cededPercentage}
                      onChange={(e) => setCededPercentage(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contractual Cap (Optional)</label>
                    <input
                      className="form-input mono"
                      placeholder="2500000.00"
                      value={contractualCap}
                      onChange={(e) => setContractualCap(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Attachment Point ($)</label>
                    <input
                      className="form-input mono"
                      required
                      placeholder="1000000.00"
                      value={attachmentPoint}
                      onChange={(e) => setAttachmentPoint(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Layer Limit ($)</label>
                    <input
                      className="form-input mono"
                      required
                      placeholder="2000000.00"
                      value={layerLimit}
                      onChange={(e) => setLayerLimit(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '12px' }}>
                <div className="form-label">Reinsurer Market Lines</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Reinsurer 1 (ApexRe) Line</label>
                    <input
                      className="form-input mono"
                      value={r1Share}
                      onChange={(e) => setR1Share(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Reinsurer 2 (SummitRe) Line</label>
                    <input
                      className="form-input mono"
                      value={r2Share}
                      onChange={(e) => setR2Share(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Treaty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
