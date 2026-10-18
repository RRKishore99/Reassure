import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { AuditTrailEvent } from '@resure-nexus/domain';
import { ShieldCheck, Hash, Download, CheckCircle2, AlertTriangle, RefreshCw, Key } from 'lucide-react';

export const AuditConsoleScreen: React.FC = () => {
  const [events, setEvents] = useState<AuditTrailEvent[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'evidence'>('events');
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<Record<string, any>>({});
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);

  const activeRole = getActiveRole();

  const loadData = async () => {
    setLoading(true);
    try {
      const [auditRes, docRes] = await Promise.all([
        api.getAuditEvents(),
        api.getEvidenceList()
      ]);
      setEvents(auditRes.events || []);
      setDocuments(docRes.documents || []);
    } catch (err: any) {
      console.error('Failed to load audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const handleVerifyDoc = async (id: string) => {
    setVerifyingDocId(id);
    try {
      const res = await api.verifyEvidence(id);
      setVerificationResult(prev => ({ ...prev, [id]: res }));
    } catch (err: any) {
      setVerificationResult(prev => ({ ...prev, [id]: { valid: false, error: err.message } }));
    } finally {
      setVerifyingDocId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Evidence & Audit Console</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Multi-party transaction provenance, SHA-256 cryptographic verification, and tamper detection.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> Refresh Trail
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <button
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('events')}
        >
          Ledger & Workflow Events ({events.length})
        </button>
        <button
          className={`btn ${activeTab === 'evidence' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('evidence')}
        >
          Secure Evidence Documents ({documents.length})
        </button>
      </div>

      {activeTab === 'events' ? (
        events.length === 0 ? (
          <div className="card empty-state">
            <ShieldCheck className="empty-state-icon" />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Audit Log Empty</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Party</th>
                  <th>Role</th>
                  <th>Target Ref</th>
                  <th>Contract / Update ID</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.eventId}>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '10px' }}>
                        {e.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{e.party}</td>
                    <td><span className="badge badge-neutral">{e.role}</span></td>
                    <td className="mono" style={{ color: 'var(--primary)', fontSize: '12px' }}>
                      {e.claimRef || e.treatyRef || e.allocationRef || '—'}
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {e.contractId ? e.contractId.substring(0, 16) + '...' : e.updateId || 'LOCAL_PROJECTION'}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      {JSON.stringify(e.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        documents.length === 0 ? (
          <div className="card empty-state">
            <Hash className="empty-state-icon" />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Evidence Documents Uploaded</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Document ID</th>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>SHA-256 Digest</th>
                  <th>Uploaded By</th>
                  <th>Size</th>
                  <th>Integrity Check</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const check = verificationResult[doc.documentId];
                  return (
                    <tr key={doc.documentId}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {doc.documentId}
                      </td>
                      <td>{doc.filename}</td>
                      <td><span className="badge badge-neutral">{doc.documentType}</span></td>
                      <td className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {doc.contentHash.substring(0, 16)}...{doc.contentHash.substring(48)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{doc.uploadedBy}</td>
                      <td className="mono" style={{ fontSize: '12px' }}>
                        {(doc.sizeBytes / 1024).toFixed(1)} KB
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled={verifyingDocId === doc.documentId}
                            onClick={() => handleVerifyDoc(doc.documentId)}
                          >
                            {verifyingDocId === doc.documentId ? 'Verifying...' : 'Verify Hash'}
                          </button>
                          {check && (
                            check.valid ? (
                              <span className="badge badge-success" style={{ fontSize: '10px' }}>
                                <CheckCircle2 size={12} /> Untampered
                              </span>
                            ) : (
                              <span className="badge badge-danger" style={{ fontSize: '10px' }}>
                                <AlertTriangle size={12} /> Tamper Detected
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};
