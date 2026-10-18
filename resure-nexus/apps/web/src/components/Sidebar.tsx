import React from 'react';
import {
  LayoutDashboard,
  FileSignature,
  FileText,
  Calculator,
  PieChart,
  Building2,
  AlertOctagon,
  CreditCard,
  ShieldCheck,
  Server
} from 'lucide-react';

export type ScreenId =
  | 'dashboard'
  | 'treaties'
  | 'claims'
  | 'assessments'
  | 'workbench'
  | 'reinsurer'
  | 'disputes'
  | 'settlement'
  | 'audit'
  | 'connectivity';

interface SidebarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  metrics?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onSelectScreen, metrics }) => {
  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'treaties', label: 'Treaty Administration', icon: <FileSignature size={18} /> },
    {
      id: 'claims',
      label: 'Claims Intake',
      icon: <FileText size={18} />,
      badge: metrics?.claimsAwaitingAssessment || undefined
    },
    { id: 'assessments', label: 'Loss Assessment', icon: <Calculator size={18} /> },
    { id: 'workbench', label: 'Allocation Workbench', icon: <PieChart size={18} /> },
    {
      id: 'reinsurer',
      label: 'Reinsurer Workspace',
      icon: <Building2 size={18} />,
      badge: metrics?.claimsAwaitingReinsurerResponse || undefined
    },
    {
      id: 'disputes',
      label: 'Disputes & Adjustments',
      icon: <AlertOctagon size={18} />
    },
    {
      id: 'settlement',
      label: 'Settlement & Reconciliation',
      icon: <CreditCard size={18} />,
      badge: metrics?.overdueSettlementItems || undefined
    },
    { id: 'audit', label: 'Evidence & Audit', icon: <ShieldCheck size={18} /> },
    { id: 'connectivity', label: 'System Connectivity', icon: <Server size={18} /> }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: '4px'
    }}>
      <div style={{
        padding: '8px 12px 14px',
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
        Operational Console
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-dim)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  backgroundColor: 'var(--accent-gold-subtle)',
                  color: 'var(--accent-gold)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Environment: <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Canton DevNet v2.10</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
          Package: <span className="mono" style={{ color: 'var(--primary)', fontSize: '10px' }}>resure-nexus:1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
