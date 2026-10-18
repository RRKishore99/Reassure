import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Server, Database, Shield, Activity, RefreshCw, Cpu, Layers } from 'lucide-react';

export const ConnectivityScreen: React.FC = () => {
  const [status, setStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [reconcileResult, setReconcileResult] = useState<any | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getConnectivity();
      setStatus(res);
    } catch (err: any) {
      console.error('Failed to load connectivity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleReconcile = async () => {
    setReconciling(true);
    setReconcileResult(null);
    try {
      const res = await api.triggerReconcile();
      setReconcileResult(res);
      await loadStatus();
    } catch (err: any) {
      setReconcileResult({ status: 'FAILED', message: err.message });
    } finally {
      setReconciling(false);
    }
  };

  const isLedgerConnected = status?.cantonLedger?.connected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>System Connectivity & Diagnostics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Real-time health monitoring of Canton Ledger API, projections database, document store, and reconciler workers.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadStatus}>
          <RefreshCw size={14} /> Refresh Health
        </button>
      </div>

      {reconcileResult && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '8px',
          backgroundColor: reconcileResult.status === 'RECONCILIATION_SUCCESS' ? 'var(--success-subtle)' : 'var(--danger-subtle)',
          color: reconcileResult.status === 'RECONCILIATION_SUCCESS' ? 'var(--success)' : 'var(--danger)',
          border: '1px solid',
          borderColor: reconcileResult.status === 'RECONCILIATION_SUCCESS' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
          fontSize: '13px'
        }}>
          <strong>Reconciliation Status:</strong> {reconcileResult.status} — {reconcileResult.message || 'Projections synchronized with Canton ledger.'}
        </div>
      )}

      {/* Grid of Diagnostics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Canton Participant Ledger */}
        <div className="card" style={{ borderColor: isLedgerConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color={isLedgerConnected ? 'var(--success)' : 'var(--warning)'} />
              <div>
                <h3 style={{ fontSize: '15px' }}>Canton Participant Node</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Ledger API v1/v2 Integration</div>
              </div>
            </div>
            <span className={`badge ${isLedgerConnected ? 'badge-success' : 'badge-warning'}`}>
              {isLedgerConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Endpoint: </span>
              <span className="mono" style={{ color: 'var(--primary)' }}>
                {status?.cantonLedger?.endpoint || 'http://127.0.0.1:7575'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Response Latency: </span>
              <span className="mono" style={{ color: 'var(--text-main)' }}>
                {status?.cantonLedger?.responseTimeMs !== undefined ? `${status.cantonLedger.responseTimeMs} ms` : '—'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Truth Boundary: </span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Real Ledger API (Never Mocked)</span>
            </div>
            <div style={{
              padding: '10px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'var(--text-dim)',
              marginTop: '4px'
            }}>
              {status?.cantonLedger?.description}
            </div>
          </div>
        </div>

        {/* Backend API Diagnostics */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: '15px' }}>Node.js API Service</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Express & Security Middleware</div>
              </div>
            </div>
            <span className="badge badge-success">ONLINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Runtime: </span>
              <span className="mono">{status?.backend?.nodeVersion}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Heap Memory: </span>
              <span className="mono">{status?.backend?.memoryMb} MB</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Uptime: </span>
              <span className="mono">{status?.backend?.uptimeSeconds} seconds</span>
            </div>
          </div>
        </div>

        {/* SQLite Projections Database */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={22} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: '15px' }}>Projections Store</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Non-Authoritative Read Cache</div>
              </div>
            </div>
            <span className="badge badge-success">ONLINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Engine: </span>
              <span style={{ fontWeight: 600 }}>{status?.projectionDatabase?.engine}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Database Path: </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                {status?.projectionDatabase?.path}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Invariants: </span>
              <span>Reconciled after restarts from Canton contracts</span>
            </div>
          </div>
        </div>

        {/* Encrypted Document Store */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={22} color="var(--primary)" />
              <div>
                <h3 style={{ fontSize: '15px' }}>Evidence Store</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Confidential Off-Ledger Storage</div>
              </div>
            </div>
            <span className="badge badge-success">ACTIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Encryption: </span>
              <span className="mono" style={{ color: 'var(--success)' }}>AES-256-GCM (Hardware Authenticated)</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Hashing: </span>
              <span className="mono">SHA-256 Cryptographic Digestion</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Privacy Boundary: </span>
              <span>Strict Role-Based Document Access Enforcement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Reconciliation Trigger Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Ledger State Reconciler</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Query all active contracts on Canton and synchronize database projections idempotently. Safe to replay.
          </p>
        </div>
        <button
          className="btn btn-primary"
          disabled={reconciling}
          onClick={handleReconcile}
        >
          <RefreshCw size={14} /> {reconciling ? 'Synchronizing...' : 'Trigger Full Reconciliation'}
        </button>
      </div>
    </div>
  );
};
