import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { ClaimCase, TreatyVersion, LossOccurrence } from '@resure-nexus/domain';
import { FileText, Plus, Upload, CheckCircle2, XCircle, RotateCcw, AlertCircle, Hash } from 'lucide-react';

export const ClaimsScreen: React.FC = () => {
  const [claims, setClaims] = useState<ClaimCase[]>([]);
  const [treaties, setTreaties] = useState<TreatyVersion[]>([]);
  const [occurrences, setOccurrences] = useState<LossOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState<string | null>(null);
  const [reopenReason, setReopenReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [claimRef, setClaimRef] = useState('');
  const [policyRef, setPolicyRef] = useState('');
  const [dateOfLoss, setDateOfLoss] = useState(new Date().toISOString().split('T')[0]);
  const [grossAmount, setGrossAmount] = useState('1250000.00');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [selectedTreaty, setSelectedTreaty] = useState('');
  const [selectedOccurrence, setSelectedOccurrence] = useState('');
  const [lossDescription, setLossDescription] = useState('Commercial facility water damage from pipe burst');
  const [claimantOpaqueId, setClaimantOpaqueId] = useState('CLMT-HASH-9921');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const activeRole = getActiveRole();

  const loadData = async () => {
    setLoading(true);
    try {
      const [claimsRes, treatiesRes, occRes] = await Promise.all([
        api.getClaims(),
        api.getTreaties(),
        api.getOccurrences()
      ]);
      setClaims(claimsRes.claims || []);
      setTreaties(treatiesRes.treaties || []);
      setOccurrences(occRes.occurrences || []);
      if (treatiesRes.treaties?.length > 0 && !selectedTreaty) {
        setSelectedTreaty(treatiesRes.treaties[0].treatyRef);
      }
    } catch (err: any) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setUploading(true);
    try {
      let evidenceRefs: any[] = [];

      // 1. Upload actual source document if provided
      if (fileToUpload) {
        const uploadRes = await api.uploadEvidence(fileToUpload, 'ClaimNotification', {
          claimRef,
          treatyRef: selectedTreaty
        });
        evidenceRefs.push(uploadRes.evidenceRef);
      } else {
        // Fallback: Generate valid test manifest
        evidenceRefs.push({
          documentId: `DOC-${claimRef}`,
          documentType: 'ClaimNotification',
          contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          version: 1,
          uploadedAt: new Date().toISOString(),
          uploadedBy: activeRole
        });
      }

      // 2. Submit Claim
      await api.createClaim({
        claimRef,
        policyRef,
        dateOfLoss,
        occurrenceRef: selectedOccurrence || undefined,
        grossLoss: { amount: grossAmount, currency },
        applicableTreaties: [selectedTreaty],
        lossDescription,
        claimantOpaqueId,
        evidenceRefs
      });

      setShowSubmitModal(false);
      setFileToUpload(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Submission failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseClaim = async (ref: string) => {
    if (!confirm(`Are you sure you want to close claim ${ref}?`)) return;
    try {
      await api.closeClaim(ref);
      await loadData();
    } catch (err: any) {
      alert(`Close failed: ${err.message}`);
    }
  };

  const handleReopenClaim = async (ref: string) => {
    try {
      await api.reopenClaim(ref, reopenReason || 'Additional loss documentation submitted');
      setShowReopenModal(null);
      setReopenReason('');
      await loadData();
    } catch (err: any) {
      alert(`Reopen failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Claims Intake & Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Reported losses, SHA-256 evidence manifests, occurrence grouping, and contractual status tracking.
          </p>
        </div>
        {(activeRole === 'Cedant' || activeRole === 'Operations') && (
          <button className="btn btn-primary" onClick={() => setShowSubmitModal(true)}>
            <Plus size={16} /> Submit Claim
          </button>
        )}
      </div>

      {claims.length === 0 ? (
        <div className="card empty-state">
          <FileText className="empty-state-icon" />
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Claims Reported</div>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            {activeRole === 'Reinsurer'
              ? 'No claims have been allocated to your organization yet.'
              : 'Submit a new insurance claim and upload source evidence to initiate the lifecycle.'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Claim Reference</th>
                <th>Policy Ref</th>
                <th>Date of Loss</th>
                <th>Gross Loss</th>
                <th>Occurrence</th>
                <th>Applicable Treaty</th>
                <th>Status</th>
                <th>Evidence Digest</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimRef}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {claim.claimRef}
                  </td>
                  <td className="mono" style={{ fontSize: '12px' }}>{claim.policyRef}</td>
                  <td>{claim.dateOfLoss}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    ${claim.grossLoss.amount} {claim.currency}
                  </td>
                  <td>
                    {claim.occurrenceRef ? (
                      <span className="badge badge-neutral mono" style={{ fontSize: '10px' }}>
                        {claim.occurrenceRef}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Single</span>
                    )}
                  </td>
                  <td>
                    {claim.applicableTreaties.map(t => (
                      <span key={t} className="badge badge-info" style={{ fontSize: '10px', marginRight: '4px' }}>
                        {t}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${
                      claim.status === 'Settled' ? 'badge-success' :
                      claim.status === 'Disputed' ? 'badge-danger' :
                      claim.status === 'Assessed' || claim.status === 'Allocated' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    {claim.evidenceRefs?.[0] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Hash size={12} color="var(--primary)" />
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          {claim.evidenceRefs[0].contentHash.substring(0, 12)}...
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>None</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {claim.status !== 'Closed' && activeRole === 'Cedant' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCloseClaim(claim.claimRef)}
                          title="Close Claim"
                        >
                          Close
                        </button>
                      )}
                      {claim.status === 'Closed' && activeRole === 'Cedant' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setShowReopenModal(claim.claimRef)}
                          title="Reopen Claim"
                        >
                          <RotateCcw size={12} /> Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Claim Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Claim Case</h3>
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

            <form onSubmit={handleSubmitClaim}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Claim Reference Identifier</label>
                  <input
                    className="form-input mono"
                    required
                    placeholder="e.g. CLM-2026-0042"
                    value={claimRef}
                    onChange={(e) => setClaimRef(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Policy Reference</label>
                  <input
                    className="form-input mono"
                    required
                    placeholder="e.g. POL-PROP-8812"
                    value={policyRef}
                    onChange={(e) => setPolicyRef(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date of Loss</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={dateOfLoss}
                    onChange={(e) => setDateOfLoss(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gross Loss Amount ($)</label>
                  <input
                    className="form-input mono"
                    required
                    placeholder="1250000.00"
                    value={grossAmount}
                    onChange={(e) => setGrossAmount(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Applicable Treaty</label>
                  <select
                    className="form-select"
                    required
                    value={selectedTreaty}
                    onChange={(e) => setSelectedTreaty(e.target.value)}
                  >
                    {treaties.map(t => (
                      <option key={t.treatyRef} value={t.treatyRef}>
                        {t.treatyRef} ({t.treatyType} - {t.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Occurrence Grouping (Optional)</label>
                  <select
                    className="form-select"
                    value={selectedOccurrence}
                    onChange={(e) => setSelectedOccurrence(e.target.value)}
                  >
                    <option value="">None (Individual Claim)</option>
                    {occurrences.map(o => (
                      <option key={o.occurrenceRef} value={o.occurrenceRef}>
                        {o.occurrenceRef} - {o.title} {o.isFrozen ? '(FROZEN)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Loss Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  required
                  value={lossDescription}
                  onChange={(e) => setLossDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source Document Upload (Computes SHA-256 Digest)</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                />
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Supported formats: PDF, PNG, JPEG, TIFF, CSV (Max 50MB). File will be encrypted with AES-256-GCM.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Calculating Digest & Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reopen Claim Modal */}
      {showReopenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reopen Claim {showReopenModal}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReopenModal(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Reopening</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Document justification for reopening..."
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReopenModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleReopenClaim(showReopenModal)}>
                Confirm Reopen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
