import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { AuditTrailEvent } from '@resure-nexus/domain';
import {
  FileText,
  AlertCircle,
  Clock,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<AuditTrailEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meRes, auditRes] = await Promise.all([
        api.getMe(),
        api.getAuditEvents()
      ]);
      setMetrics(meRes.metrics);
      setEvents(auditRes.events || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Awaiting Assessment',
      value: metrics?.claimsAwaitingAssessment ?? 0,
      description: 'Reported claims requiring adjuster inspection',
      icon: <Clock size={20} color="var(--warning)" />,
      badgeColor: 'badge-warning'
    },
    {
      title: 'Awaiting Reinsurer Response',
      value: metrics?.claimsAwaitingReinsurerResponse ?? 0,
      description: 'Allocations pending market acceptance',
      icon: <FileText size={20} color="var(--primary)" />,
      badgeColor: 'badge-info'
    },
    {
      title: 'Outstanding Recoverables',
      value: `$${metrics?.outstandingRecoverables ?? '0.00'}`,
      description: 'Total active billed recoverable balance',
      icon: <TrendingUp size={20} color="var(--success)" />,
      badgeColor: 'badge-success'
    },
    {
      title: 'Disputed Recoverables',
      value: `$${metrics?.disputedRecoverables ?? '0.00'}`,
      description: 'Allocations formally contested by reinsurers',
      icon: <AlertOctagon size={20} color="var(--danger)" />,
      badgeColor: 'badge-danger'
    },
    {
      title: 'Accepted Unsettled',
      value: `$${metrics?.acceptedUnsettledRecoverables ?? '0.00'}`,
      description: 'Accepted allocations awaiting payment receipt',
      icon: <AlertCircle size={20} color="var(--accent-gold)" />,
      badgeColor: 'badge-warning'
    },
    {
      title: 'Overdue Items',
      value: metrics?.overdueSettlementItems ?? 0,
      description: 'Settlements past agreed net-30 terms',
      icon: <AlertCircle size={20} color="var(--danger)" />,
      badgeColor: 'badge-danger'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Operational Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Authoritative ledger metrics, contract lifecycle stages, and confirmed multi-party event stream.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadData}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {card.title}
              </span>
              <div style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)'
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Ledger Confirmed Events */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3>Recent Ledger Events</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Real-time audit log of multi-party contract state transitions verified on Canton.
            </p>
          </div>
          <span className="badge badge-neutral">Truthful Ledger Projections</span>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck className="empty-state-icon" />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Events Recorded Yet</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Begin by creating a treaty version or submitting a claim from the navigation sidebar.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Submitting Party</th>
                  <th>Role</th>
                  <th>Reference</th>
                  <th>Contract / Update ID</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map((evt) => (
                  <tr key={evt.eventId}>
                    <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '10px' }}>
                        {evt.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{evt.party}</td>
                    <td>
                      <span className="badge badge-neutral">{evt.role}</span>
                    </td>
                    <td className="mono" style={{ color: 'var(--primary)', fontSize: '12px' }}>
                      {evt.claimRef || evt.treatyRef || evt.allocationRef || '—'}
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {evt.contractId ? evt.contractId.substring(0, 18) + '...' : 'LOCAL_OFF_LEDGER'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
