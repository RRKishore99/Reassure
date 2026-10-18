import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ScreenId } from './components/Sidebar';
import { api, getActiveRole } from './api';

import { DashboardScreen } from './screens/DashboardScreen';
import { TreatyScreen } from './screens/TreatyScreen';
import { ClaimsScreen } from './screens/ClaimsScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { AllocationWorkbenchScreen } from './screens/AllocationWorkbenchScreen';
import { ReinsurerWorkspaceScreen } from './screens/ReinsurerWorkspaceScreen';
import { DisputeManagementScreen } from './screens/DisputeManagementScreen';
import { SettlementScreen } from './screens/SettlementScreen';
import { AuditConsoleScreen } from './screens/AuditConsoleScreen';
import { ConnectivityScreen } from './screens/ConnectivityScreen';

export const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [role, setRole] = useState(getActiveRole());

  const loadMetrics = async () => {
    try {
      const res = await api.getMe();
      setMetrics(res.metrics);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [role, activeScreen]);

  const handleRoleChanged = (newRole: string) => {
    setRole(newRole);
    loadMetrics();
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'treaties':
        return <TreatyScreen />;
      case 'claims':
        return <ClaimsScreen />;
      case 'assessments':
        return <AssessmentScreen />;
      case 'workbench':
        return <AllocationWorkbenchScreen />;
      case 'reinsurer':
        return <ReinsurerWorkspaceScreen />;
      case 'disputes':
        return <DisputeManagementScreen />;
      case 'settlement':
        return <SettlementScreen />;
      case 'audit':
        return <AuditConsoleScreen />;
      case 'connectivity':
        return <ConnectivityScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        metrics={metrics}
      />
      <div className="main-layout">
        <Header onRoleChanged={handleRoleChanged} />
        <main className="content-area">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};
