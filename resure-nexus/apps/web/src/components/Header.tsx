import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { PartyMapping } from '@resure-nexus/domain';
import { Shield, Activity, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onRoleChanged: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onRoleChanged }) => {
  const [currentUser, setCurrentUser] = useState<PartyMapping | null>(null);
  const [parties, setParties] = useState<PartyMapping[]>([]);
  const [connectivity, setConnectivity] = useState<any>(null);

  const activeRole = getActiveRole();

  useEffect(() => {
    loadSession();
    const interval = setInterval(loadConnectivity, 10000);
    return () => clearInterval(interval);
  }, [activeRole]);

  const loadSession = async () => {
    try {
      const [meRes, partiesRes, connRes] = await Promise.all([
        api.getMe(),
        api.getParties(),
        api.getConnectivity()
      ]);
      setCurrentUser(meRes.user);
      setParties(partiesRes.parties);
      setConnectivity(connRes);
    } catch (err) {
      console.error('Session load error:', err);
    }
  };

  const loadConnectivity = async () => {
    try {
      const conn = await api.getConnectivity();
      setConnectivity(conn);
    } catch {
      // Ignored in poll
    }
  };

  const handleRoleSelect = async (role: string) => {
    try {
      await api.switchRole(role);
      onRoleChanged(role);
      await loadSession();
    } catch (err) {
      console.error('Switch role error:', err);
    }
  };

  const isLedgerConnected = connectivity?.cantonLedger?.connected;

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--primary-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <Shield size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ReSure Nexus</span>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}>CANTON</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            Reinsurance Recoverables & Loss Allocation Network
          </div>
        </div>
      </div>

      {/* Network Status & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Canton Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isLedgerConnected ? 'var(--success-subtle)' : 'var(--warning-subtle)',
          border: `1px solid ${isLedgerConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          fontSize: '12px',
          fontWeight: 600,
          color: isLedgerConnected ? 'var(--success)' : 'var(--warning)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isLedgerConnected ? 'var(--success)' : 'var(--warning)',
            boxShadow: `0 0 8px ${isLedgerConnected ? 'var(--success)' : 'var(--warning)'}`
          }} />
          <span>{isLedgerConnected ? 'Canton Participant: Connected' : 'Canton API: Disconnected'}</span>
        </div>

        {/* Persona Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Active Role:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
            value={activeRole}
            onChange={(e) => handleRoleSelect(e.target.value)}
          >
            {parties.map((p) => (
              <option key={p.party} value={p.party}>
                {p.role} — {p.party} ({p.organization})
              </option>
            ))}
          </select>
        </div>

        {/* User Card */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: 'var(--primary)'
            }}>
              {currentUser.role.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.displayName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Party: <span className="mono" style={{ color: 'var(--text-muted)' }}>{currentUser.party}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
