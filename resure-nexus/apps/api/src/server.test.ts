import { describe, it } from 'node:test';
import assert from 'node:assert';
import app from './server';

// Lightweight in-memory test helper
async function request(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await new Promise<{ status: number; body: any }>((resolve) => {
    const server = app.listen(0, async () => {
      const port = (server.address() as any).port;
      try {
        const fetchRes = await fetch(`http://127.0.0.1:${port}${path}`, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined
        });
        const json = await fetchRes.json().catch(() => ({}));
        server.close(() => resolve({ status: fetchRes.status, body: json }));
      } catch (err) {
        server.close(() => resolve({ status: 500, body: { error: String(err) } }));
      }
    });
  });

  return res;
}

describe('ReSure Nexus API End-to-End Suite', () => {
  it('GET /api/health returns UP status', async () => {
    const res = await request('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'UP');
  });

  it('GET /api/connectivity provides honest Canton connectivity diagnostics', async () => {
    const res = await request('/api/connectivity');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.backend);
    assert.ok(res.body.cantonLedger);
    assert.strictEqual(res.body.cantonLedger.isMocked, false);
    assert.strictEqual(res.body.projectionDatabase.status, 'ONLINE');
  });

  it('GET /api/auth/me returns current authenticated party and honest empty dashboard stats', async () => {
    const res = await request('/api/auth/me', {
      headers: { 'x-resure-role': 'Cedant' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.role, 'Cedant');
    assert.strictEqual(res.body.user.party, 'Cedant');
    assert.ok(res.body.metrics);
  });

  it('enforces role authorization on sensitive endpoints', async () => {
    // Reinsurer cannot create a treaty
    const res = await request('/api/treaties', {
      method: 'POST',
      headers: { 'x-resure-role': 'Reinsurer1' },
      body: { treatyRef: 'TRT-UNAUTH' }
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.error, 'Forbidden');
  });

  it('executes Treaty -> Participation -> Claim -> Assessment -> Allocation -> Decision lifecycle', async () => {
    const runId = Date.now().toString(36).toUpperCase();
    const treatyRef = `TRT-${runId}`;
    const claimRef = `CLM-${runId}`;
    const assessRef = `ASM-${runId}`;
    const cycleRef = `CYC-${runId}`;

    // 1. Create Quota-Share Treaty
    const treatyRes = await request('/api/treaties', {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' },
      body: {
        treatyRef,
        treatyType: 'QuotaShare',
        inceptionDate: '2026-01-01',
        expirationDate: '2026-12-31',
        coveredBusiness: 'Commercial Property',
        lossBasis: 'LossOccurring',
        currency: 'USD',
        quotaShareTerms: {
          cededPercentage: '0.40',
          contractualCap: { amount: '2000000.00', currency: 'USD' }
        },
        participatingReinsurers: [
          { reinsurer: 'Reinsurer1', linePercentage: '0.60', participationRef: `PRT-R1-${runId}` },
          { reinsurer: 'Reinsurer2', linePercentage: '0.40', participationRef: `PRT-R2-${runId}` }
        ],
        evidenceRefs: []
      }
    });
    assert.strictEqual(treatyRes.status, 201);
    assert.strictEqual(treatyRes.body.treaty.treatyRef, treatyRef);

    // 2. Reinsurers accept participation
    const acc1 = await request(`/api/treaties/${treatyRef}/participations/Reinsurer1/accept`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Reinsurer1' }
    });
    assert.strictEqual(acc1.status, 200);
    assert.strictEqual(acc1.body.participation.status, 'Accepted');

    const acc2 = await request(`/api/treaties/${treatyRef}/participations/Reinsurer2/accept`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Reinsurer2' }
    });
    assert.strictEqual(acc2.status, 200);
    assert.strictEqual(acc2.body.participation.status, 'Accepted');

    // 3. Cedant activates treaty
    const approveTreaty = await request(`/api/treaties/${treatyRef}/approve`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' }
    });
    assert.strictEqual(approveTreaty.status, 200);
    assert.strictEqual(approveTreaty.body.status, 'Active');

    // 4. Submit Claim with Evidence
    const claimRes = await request('/api/claims', {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' },
      body: {
        claimRef,
        policyRef: `POL-${runId}`,
        dateOfLoss: '2026-03-15',
        grossLoss: { amount: '1500000.00', currency: 'USD' },
        applicableTreaties: [treatyRef],
        lossDescription: 'Warehouse structural fire damage',
        claimantOpaqueId: `CLMT-${runId}`,
        evidenceRefs: [
          {
            documentId: `DOC-${runId}-1`,
            documentType: 'ClaimNotification',
            contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            version: 1,
            uploadedAt: '2026-03-16T10:00:00Z',
            uploadedBy: 'Cedant'
          }
        ]
      }
    });
    assert.strictEqual(claimRes.status, 201);
    assert.strictEqual(claimRes.body.claim.claimRef, claimRef);

    // 5. Reject Duplicate Claim Submission
    const duplicateRes = await request('/api/claims', {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' },
      body: {
        claimRef,
        policyRef: `POL-${runId}`,
        dateOfLoss: '2026-03-15',
        grossLoss: { amount: '1500000.00', currency: 'USD' },
        applicableTreaties: [treatyRef],
        lossDescription: 'Duplicate claim attempt',
        claimantOpaqueId: `CLMT-${runId}`,
        evidenceRefs: [
          {
            documentId: `DOC-${runId}-DUP`,
            documentType: 'ClaimNotification',
            contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            version: 1,
            uploadedAt: '2026-03-16T10:00:00Z',
            uploadedBy: 'Cedant'
          }
        ]
      }
    });
    assert.strictEqual(duplicateRes.status, 409);
    assert.strictEqual(duplicateRes.body.error, 'DuplicateClaimReference');

    // 6. Loss Adjuster submits assessment
    const assessRes = await request('/api/assessments', {
      method: 'POST',
      headers: { 'x-resure-role': 'Adjuster' },
      body: {
        assessmentRef: assessRef,
        claimRef,
        assessedLoss: { amount: '1400000.00', currency: 'USD' },
        deductibleApplied: { amount: '100000.00', currency: 'USD' },
        eligibleLoss: { amount: '1300000.00', currency: 'USD' },
        methodology: 'Engineering forensic assessment and inventory itemization',
        notes: 'Depreciation applied to inventory and structural framing',
        evidenceRefs: [
          {
            documentId: `DOC-${runId}-ADJ`,
            documentType: 'AdjusterReport',
            contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            version: 1,
            uploadedAt: '2026-03-18T14:00:00Z',
            uploadedBy: 'Adjuster'
          }
        ]
      }
    });
    assert.strictEqual(assessRes.status, 201);

    // 7. Cedant approves assessment
    const approveAssess = await request(`/api/assessments/${assessRef}/approve`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' }
    });
    assert.strictEqual(approveAssess.status, 200);

    // 8. Allocation simulation
    const simRes = await request('/api/allocations/simulate', {
      method: 'POST',
      headers: { 'x-resure-role': 'Operations' },
      body: {
        treatyRef,
        claimRefs: [claimRef]
      }
    });
    assert.strictEqual(simRes.status, 200);
    // $1.3M eligible * 40% ceded = $520k. R1 (60%) = $312k, R2 (40%) = $208k
    assert.strictEqual(simRes.body.simulation.cappedCededAmount.amount, '520000.00');
    assert.strictEqual(simRes.body.simulation.reinsurerAllocations[0].allocatedAmount.amount, '312000.00');
    assert.strictEqual(simRes.body.simulation.reinsurerAllocations[1].allocatedAmount.amount, '208000.00');

    // 9. Operations proposes allocation cycle
    const propRes = await request('/api/allocations/propose', {
      method: 'POST',
      headers: { 'x-resure-role': 'Operations' },
      body: {
        cycleRef,
        treatyRef,
        treatyVersion: 1,
        claimRefs: [claimRef],
        calculationMethodology: 'Standard Pro-Rata Quota Share'
      }
    });
    assert.strictEqual(propRes.status, 201);
    assert.strictEqual(propRes.body.allocations.length, 2);

    // 10. Reinsurer 1 accepts allocation
    const decRes = await request('/api/reinsurer/decisions', {
      method: 'POST',
      headers: { 'x-resure-role': 'Reinsurer1' },
      body: {
        decisionRef: `DEC-${runId}-1`,
        allocationRef: `${cycleRef}-AL-1`,
        decisionType: 'Accept',
        reason: 'Verified against treaty slip terms and eligible loss breakdown'
      }
    });
    assert.strictEqual(decRes.status, 200);
    assert.strictEqual(decRes.body.allocationStatus, 'Accepted');

    // 11. Reinsurer 2 raises a Dispute
    const dispRes = await request('/api/reinsurer/decisions', {
      method: 'POST',
      headers: { 'x-resure-role': 'Reinsurer2' },
      body: {
        decisionRef: `DEC-${runId}-2`,
        allocationRef: `${cycleRef}-AL-2`,
        decisionType: 'Dispute',
        reason: 'Disputing loss date within treaty inception window'
      }
    });
    assert.strictEqual(dispRes.status, 200);
    assert.strictEqual(dispRes.body.allocationStatus, 'Disputed');

    // 12. Finalization is blocked while dispute is unresolved
    const blockedFinalize = await request(`/api/allocations/cycles/${cycleRef}/finalize`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Operations' }
    });
    assert.strictEqual(blockedFinalize.status, 400);
    assert.strictEqual(blockedFinalize.body.error, 'PreconditionFailed');

    // 13. Resolve the Dispute
    const resolveDispute = await request(`/api/disputes/DISP-${cycleRef}-AL-2/resolve`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Cedant' },
      body: {
        resolutionSummary: 'Underwriting endorsement confirmed policy date is valid and attaching'
      }
    });
    assert.strictEqual(resolveDispute.status, 200);
    assert.strictEqual(resolveDispute.body.dispute.status, 'Resolved');

    // 14. Finalize cycle now succeeds and creates settlements
    const finalizeRes = await request(`/api/allocations/cycles/${cycleRef}/finalize`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Operations' }
    });
    assert.strictEqual(finalizeRes.status, 200);
    assert.strictEqual(finalizeRes.body.cycle.status, 'Finalized');
    assert.strictEqual(finalizeRes.body.settlements.length, 2);

    // 15. Settle with verified payment confirmation evidence
    const reconcileRes = await request(`/api/settlements/SETTLE-${cycleRef}-AL-1/reconcile`, {
      method: 'POST',
      headers: { 'x-resure-role': 'Operations' },
      body: {
        reconciliationRef: `REC-${runId}-1`,
        confirmedAmount: { amount: '312000.00', currency: 'USD' },
        reconciliationSource: 'Federal Reserve Fedwire Reference #WIRE-2026-98172',
        paymentEvidence: {
          documentId: `DOC-${runId}-WIRE`,
          documentType: 'PaymentReceipt',
          contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          version: 1,
          uploadedAt: '2026-03-25T11:00:00Z',
          uploadedBy: 'Operations'
        }
      }
    });
    assert.strictEqual(reconcileRes.status, 200);
    assert.strictEqual(reconcileRes.body.settlement.status, 'Settled');
    assert.strictEqual(reconcileRes.body.settlement.outstandingBalance.amount, '0.00');
  });
});
