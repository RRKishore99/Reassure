/**
 * ReSure Nexus — Web API Client
 * Sends authenticated requests with active role context.
 */

import {
  TreatyVersion,
  TreatyParticipation,
  ClaimCase,
  LossOccurrence,
  LossAssessment,
  AllocationCycle,
  RecoverableAllocation,
  ReinsurerDecision,
  DisputeCase,
  RecoveryAdjustment,
  RecoverableSettlement,
  SettlementReconciliation,
  AuditTrailEvent,
  Role,
  PartyMapping
} from '@resure-nexus/domain';

let currentRole: string = localStorage.getItem('resure_role') || 'Cedant';

export function setActiveRole(role: string): void {
  currentRole = role;
  localStorage.setItem('resure_role', role);
}

export function getActiveRole(): string {
  return currentRole;
}

async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('X-ReSure-Role', currentRole);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}: ${res.statusText}`);
  }

  return data;
}

export const api = {
  // Auth & Session
  async getMe(): Promise<{ user: PartyMapping; metrics: any }> {
    return apiRequest('/auth/me');
  },
  async getParties(): Promise<{ parties: PartyMapping[] }> {
    return apiRequest('/auth/parties');
  },
  async switchRole(role: string): Promise<{ user: PartyMapping }> {
    setActiveRole(role);
    return apiRequest('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  // Health & Connectivity
  async getConnectivity(): Promise<any> {
    return apiRequest('/connectivity');
  },

  // Treaties
  async getTreaties(): Promise<{ treaties: TreatyVersion[]; participations: TreatyParticipation[] }> {
    return apiRequest('/treaties');
  },
  async createTreaty(payload: any): Promise<{ treaty: TreatyVersion }> {
    return apiRequest('/treaties', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async proposeTreaty(ref: string): Promise<{ treaty: TreatyVersion }> {
    return apiRequest(`/treaties/${ref}/propose`, { method: 'POST' });
  },
  async acceptParticipation(ref: string, reinsurerParty: string): Promise<any> {
    return apiRequest(`/treaties/${ref}/participations/${reinsurerParty}/accept`, { method: 'POST' });
  },
  async approveTreaty(ref: string): Promise<{ treaty: TreatyVersion }> {
    return apiRequest(`/treaties/${ref}/approve`, { method: 'POST' });
  },

  // Claims
  async getClaims(): Promise<{ claims: ClaimCase[] }> {
    return apiRequest('/claims');
  },
  async createClaim(payload: any): Promise<{ claim: ClaimCase }> {
    return apiRequest('/claims', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async closeClaim(ref: string): Promise<{ claim: ClaimCase }> {
    return apiRequest(`/claims/${ref}/close`, { method: 'POST' });
  },
  async reopenClaim(ref: string, reason: string): Promise<{ claim: ClaimCase }> {
    return apiRequest(`/claims/${ref}/reopen`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  // Occurrences
  async getOccurrences(): Promise<{ occurrences: LossOccurrence[] }> {
    return apiRequest('/occurrences');
  },
  async createOccurrence(payload: any): Promise<{ occurrence: LossOccurrence }> {
    return apiRequest('/occurrences', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async addClaimToOccurrence(ref: string, claimRef: string): Promise<any> {
    return apiRequest(`/occurrences/${ref}/claims`, {
      method: 'POST',
      body: JSON.stringify({ claimRef })
    });
  },
  async freezeOccurrence(ref: string): Promise<any> {
    return apiRequest(`/occurrences/${ref}/freeze`, { method: 'POST' });
  },

  // Assessments
  async getAssessments(claimRef?: string): Promise<{ assessments: LossAssessment[] }> {
    const q = claimRef ? `?claimRef=${claimRef}` : '';
    return apiRequest(`/assessments${q}`);
  },
  async submitAssessment(payload: any): Promise<{ assessment: LossAssessment }> {
    return apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async approveAssessment(ref: string): Promise<{ assessment: LossAssessment }> {
    return apiRequest(`/assessments/${ref}/approve`, { method: 'POST' });
  },

  // Allocations & Workbench
  async simulateAllocation(payload: { treatyRef: string; claimRefs?: string[]; occurrenceRef?: string }): Promise<any> {
    return apiRequest('/allocations/simulate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async proposeAllocation(payload: any): Promise<any> {
    return apiRequest('/allocations/propose', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async getAllocations(): Promise<{ allocations: RecoverableAllocation[] }> {
    return apiRequest('/allocations');
  },
  async getAllocationCycles(): Promise<{ cycles: AllocationCycle[] }> {
    return apiRequest('/allocations/cycles');
  },
  async finalizeCycle(ref: string): Promise<any> {
    return apiRequest(`/allocations/cycles/${ref}/finalize`, { method: 'POST' });
  },

  // Reinsurer Decisions
  async submitDecision(payload: any): Promise<any> {
    return apiRequest('/reinsurer/decisions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Disputes
  async getDisputes(): Promise<{ disputes: DisputeCase[] }> {
    return apiRequest('/disputes');
  },
  async resolveDispute(ref: string, payload: any): Promise<any> {
    return apiRequest(`/disputes/${ref}/resolve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Adjustments
  async getAdjustments(): Promise<{ adjustments: RecoveryAdjustment[] }> {
    return apiRequest('/adjustments');
  },
  async createAdjustment(payload: any): Promise<any> {
    return apiRequest('/adjustments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Settlements
  async getSettlements(): Promise<{ settlements: RecoverableSettlement[]; reconciliations: SettlementReconciliation[] }> {
    return apiRequest('/settlements');
  },
  async reconcileSettlement(ref: string, payload: any): Promise<any> {
    return apiRequest(`/settlements/${ref}/reconcile`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Evidence Documents
  async uploadEvidence(file: File, documentType: string, extra?: Record<string, string>): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        formData.append(k, v);
      }
    }
    return apiRequest('/evidence/upload', {
      method: 'POST',
      body: formData
    });
  },
  async verifyEvidence(id: string): Promise<{ valid: boolean; contentHash: string; calculatedHash: string }> {
    return apiRequest(`/evidence/${id}/verify`, { method: 'POST' });
  },
  async getEvidenceList(): Promise<{ documents: any[] }> {
    return apiRequest('/evidence');
  },

  // Audit
  async getAuditEvents(): Promise<{ events: AuditTrailEvent[] }> {
    return apiRequest('/audit');
  },

  // Reconcile Projections
  async triggerReconcile(): Promise<any> {
    return apiRequest('/reconcile', { method: 'POST' });
  }
};
