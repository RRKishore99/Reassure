import React, { useEffect, useState } from 'react';
import { api, getActiveRole } from '../api';
import { TreatyVersion, ClaimCase, LossOccurrence, AllocationCycle } from '@resure-nexus/domain';
import { PieChart, Play, CheckCircle, ArrowRight, Layers, AlertCircle, Info } from 'lucide-react';

export const AllocationWorkbenchScreen: React.FC = () => {
  const [treaties, setTreaties] = useState<TreatyVersion[]>([]);
  const [claims, setClaims] = useState<ClaimCase[]>([]);
  const [occurrences, setOccurrences] = useState<LossOccurrence[]>([]);
  const [cycles, setCycles] = useState<AllocationCycle[]>([]);
  const [selectedTreatyRef, setSelectedTreatyRef] = useState('');
  const [selectedClaimRef, setSelectedClaimRef] = useState('');
  const [selectedOccurrenceRef, setSelectedOccurrenceRef] = useState('');
  const [cycleRef, setCycleRef] = useState(`CYC-${Date.now().toString(36).toUpperCase()}`);
  const [methodologyNotes, setMethodologyNotes] = useState('Standard Contractual Terms Loss Allocation');
  const [simulation, setSimulation] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const activeRole = getActiveRole();

  const loadData = async () => {
    try {
      const [tRes, cRes, oRes, cycRes] = await Promise.all([
        api.getTreaties(),
        api.getClaims(),
        api.getOccurrences(),
        api.getAllocationCycles()
      ]);
      const activeTreaties = (tRes.treaties || []).filter(t => t.status === 'Active');
      setTreaties(activeTreaties);
      setClaims(cRes.claims || []);
      setOccurrences(oRes.occurrences || []);
      setCycles(cycRes.cycles || []);

      if (activeTreaties.length > 0 && !selectedTreatyRef) {
        setSelectedTreatyRef(activeTreaties[0].treatyRef);
      }
      if (cRes.claims?.length > 0 && !selectedClaimRef) {
        setSelectedClaimRef(cRes.claims[0].claimRef);
      }
    } catch (err: any) {
      console.error('Failed to load workbench data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const selectedTreaty = treaties.find(t => t.treatyRef === selectedTreatyRef);

  const handleSimulate = async () => {
    setSimulating(true);
    setActionError(null);
    setSimulation(null);
    try {
      const payload: any = {
        treatyRef: selectedTreatyRef
      };
      if (selectedTreaty?.treatyType === 'QuotaShare') {
        payload.claimRefs = [selectedClaimRef];
      } else {
        if (selectedOccurrenceRef) {
          payload.occurrenceRef = selectedOccurrenceRef;
        } else {
          payload.claimRefs = [selectedClaimRef];
        }
      }

      const res = await api.simulateAllocation(payload);
      setSimulation(res.simulation);
    } catch (err: any) {
      setActionError(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const handleProposeCycle = async () => {
    if (!simulation) return;
    setActionError(null);
    try {
      const payload: any = {
        cycleRef,
        treatyRef: selectedTreatyRef,
        treatyVersion: selectedTreaty?.version || 1,
        claimRefs: selectedTreaty?.treatyType === 'QuotaShare' ? [selectedClaimRef] : (selectedOccurrenceRef ? [] : [selectedClaimRef]),
        occurrenceRef: selectedOccurrenceRef || undefined,
        calculationMethodology: methodologyNotes
      };

      await api.proposeAllocation(payload);
      setActionSuccess(`Allocation Cycle "${cycleRef}" proposed successfully! Bilateral recoverable allocations created.`);
      setSimulation(null);
      setCycleRef(`CYC-${Date.now().toString(36).toUpperCase()}`);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to propose allocation cycle');
    }
  };

  const handleFinalizeCycle = async (ref: string) => {
    try {
      await api.finalizeCycle(ref);
      setActionSuccess(`Cycle "${ref}" finalized! Recoverable settlements created.`);
      await loadData();
    } catch (err: any) {
      alert(`Finalize failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Allocation Workbench</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Pure deterministic loss allocation simulation, transparency breakdowns, caps, attachment point evaluation, and proposal dispatch.
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

      {actionError && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'var(--danger-subtle)',
          color: 'var(--danger)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {actionError}
        </div>
      )}

      {/* Simulator Inputs Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '15px' }}>Configure Calculation Engine</h3>
          </div>
          <span className="badge badge-info">Pure BigNumber Engine (No Float)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Active Treaty</label>
            <select
              className="form-select mono"
              value={selectedTreatyRef}
              onChange={(e) => setSelectedTreatyRef(e.target.value)}
            >
              {treaties.map(t => (
                <option key={t.treatyRef} value={t.treatyRef}>
                  {t.treatyRef} ({t.treatyType})
                </option>
              ))}
            </select>
          </div>

          {selectedTreaty?.treatyType === 'QuotaShare' ? (
            <div className="form-group">
              <label className="form-label">Approved Subject Claim</label>
              <select
                className="form-select mono"
                value={selectedClaimRef}
                onChange={(e) => setSelectedClaimRef(e.target.value)}
              >
                {claims.map(c => (
                  <option key={c.claimRef} value={c.claimRef}>
                    {c.claimRef} (${c.grossLoss.amount} - {c.status})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Loss Occurrence</label>
              <select
                className="form-select mono"
                value={selectedOccurrenceRef}
                onChange={(e) => setSelectedOccurrenceRef(e.target.value)}
              >
                <option value="">Select Occurrence...</option>
                {occurrences.map(o => (
                  <option key={o.occurrenceRef} value={o.occurrenceRef}>
                    {o.occurrenceRef} ({o.claimRefs.length} claims {o.isFrozen ? '- FROZEN' : '- OPEN'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">New Cycle Identifier</label>
            <input
              className="form-input mono"
              value={cycleRef}
              onChange={(e) => setCycleRef(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={simulating || !selectedTreatyRef}
          >
            <Play size={14} /> {simulating ? 'Calculating...' : 'Simulate Calculation'}
          </button>
        </div>
      </div>

      {/* Simulation Result Transparency Card */}
      {simulation && (
        <div className="card" style={{ borderColor: 'var(--primary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success">Simulation Verified</span>
                <span className="badge badge-neutral">{simulation.treatyType}</span>
                {simulation.isLayerExhausted && <span className="badge badge-danger">Layer Limit Exhausted</span>}
                {simulation.isLossBelowAttachment && <span className="badge badge-warning">Loss Below Attachment</span>}
              </div>
              <div className="mono" style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '8px' }}>
                {simulation.formula}
              </div>
            </div>

            {(activeRole === 'Operations' || activeRole === 'Cedant') && (
              <button className="btn btn-success" onClick={handleProposeCycle}>
                <CheckCircle size={16} /> Propose Allocation Cycle
              </button>
            )}
          </div>

          {/* Intermediate Steps Timeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {simulation.intermediateSteps?.map((step: any, idx: number) => (
              <div key={idx} style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card-elevated)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{step.step}</div>
                <div className="mono" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                  {step.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{step.description}</div>
              </div>
            ))}
          </div>

          {/* Reinsurer Line Allocations Table */}
          <div>
            <div className="form-label">Calculated Reinsurer Allocations</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Reinsurer</th>
                    <th>Participation Line</th>
                    <th>Allocated Amount</th>
                    <th>Rounding Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {simulation.reinsurerAllocations?.map((r: any) => (
                    <tr key={r.reinsurer}>
                      <td style={{ fontWeight: 600 }}>{r.reinsurer}</td>
                      <td className="mono">{(parseFloat(r.linePercentage) * 100).toFixed(1)}%</td>
                      <td className="mono" style={{ fontWeight: 800, color: 'var(--success)', fontSize: '14px' }}>
                        ${r.allocatedAmount.amount} {r.allocatedAmount.currency}
                      </td>
                      <td className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {r.roundingDelta}
                      </td>
                    </tr>
                  ))}
                  {/* Unplaced Retention Row */}
                  <tr style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
                    <td style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Cedant (Unplaced Line Retained)</td>
                    <td className="mono">{(parseFloat(simulation.unplacedPercentage) * 100).toFixed(1)}%</td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ${simulation.unplacedAmount.amount} {simulation.unplacedAmount.currency}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-dim)' }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Existing Cycles Table */}
      <div className="card">
        <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Existing Allocation Cycles</h3>
        {cycles.length === 0 ? (
          <div className="empty-state">
            <PieChart className="empty-state-icon" />
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No Allocation Cycles Found</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cycle Ref</th>
                  <th>Treaty Ref</th>
                  <th>Type</th>
                  <th>Subject Loss</th>
                  <th>Gross Recovery</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((c) => (
                  <tr key={c.cycleRef}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{c.cycleRef}</td>
                    <td className="mono">{c.treatyRef}</td>
                    <td><span className="badge badge-neutral">{c.treatyType}</span></td>
                    <td className="mono">${c.eligibleSubjectLoss.amount}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>${c.totalGrossRecovery.amount}</td>
                    <td>
                      <span className={`badge ${
                        c.status === 'Finalized' ? 'badge-success' :
                        c.status === 'Disputed' ? 'badge-danger' :
                        c.status === 'Adjusted' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'Proposed' && (activeRole === 'Operations' || activeRole === 'Cedant') && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleFinalizeCycle(c.cycleRef)}
                        >
                          Finalize
                        </button>
                      )}
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
