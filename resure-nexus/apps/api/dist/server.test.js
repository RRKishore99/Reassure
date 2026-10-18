"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const server_1 = __importDefault(require("./server"));
// Lightweight in-memory test helper
async function request(path, options = {}) {
    const method = options.method || 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    const res = await new Promise((resolve) => {
        const server = server_1.default.listen(0, async () => {
            const port = server.address().port;
            try {
                const fetchRes = await fetch(`http://127.0.0.1:${port}${path}`, {
                    method,
                    headers,
                    body: options.body ? JSON.stringify(options.body) : undefined
                });
                const json = await fetchRes.json().catch(() => ({}));
                server.close(() => resolve({ status: fetchRes.status, body: json }));
            }
            catch (err) {
                server.close(() => resolve({ status: 500, body: { error: String(err) } }));
            }
        });
    });
    return res;
}
(0, node_test_1.describe)('ReSure Nexus API End-to-End Suite', () => {
    (0, node_test_1.it)('GET /api/health returns UP status', async () => {
        const res = await request('/api/health');
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.strictEqual(res.body.status, 'UP');
    });
    (0, node_test_1.it)('GET /api/connectivity provides honest Canton connectivity diagnostics', async () => {
        const res = await request('/api/connectivity');
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.ok(res.body.backend);
        node_assert_1.default.ok(res.body.cantonLedger);
        node_assert_1.default.strictEqual(res.body.cantonLedger.isMocked, false);
        node_assert_1.default.strictEqual(res.body.projectionDatabase.status, 'ONLINE');
    });
    (0, node_test_1.it)('GET /api/auth/me returns current authenticated party and honest empty dashboard stats', async () => {
        const res = await request('/api/auth/me', {
            headers: { 'x-resure-role': 'Cedant' }
        });
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.strictEqual(res.body.user.role, 'Cedant');
        node_assert_1.default.strictEqual(res.body.user.party, 'Cedant');
        node_assert_1.default.ok(res.body.metrics);
    });
    (0, node_test_1.it)('enforces role authorization on sensitive endpoints', async () => {
        // Reinsurer cannot create a treaty
        const res = await request('/api/treaties', {
            method: 'POST',
            headers: { 'x-resure-role': 'Reinsurer1' },
            body: { treatyRef: 'TRT-UNAUTH' }
        });
        node_assert_1.default.strictEqual(res.status, 403);
        node_assert_1.default.strictEqual(res.body.error, 'Forbidden');
    });
    (0, node_test_1.it)('executes Treaty -> Participation -> Claim -> Assessment -> Allocation -> Decision lifecycle', async () => {
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
        node_assert_1.default.strictEqual(treatyRes.status, 201);
        node_assert_1.default.strictEqual(treatyRes.body.treaty.treatyRef, treatyRef);
        // 2. Reinsurers accept participation
        const acc1 = await request(`/api/treaties/${treatyRef}/participations/Reinsurer1/accept`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Reinsurer1' }
        });
        node_assert_1.default.strictEqual(acc1.status, 200);
        node_assert_1.default.strictEqual(acc1.body.participation.status, 'Accepted');
        const acc2 = await request(`/api/treaties/${treatyRef}/participations/Reinsurer2/accept`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Reinsurer2' }
        });
        node_assert_1.default.strictEqual(acc2.status, 200);
        node_assert_1.default.strictEqual(acc2.body.participation.status, 'Accepted');
        // 3. Cedant activates treaty
        const approveTreaty = await request(`/api/treaties/${treatyRef}/approve`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Cedant' }
        });
        node_assert_1.default.strictEqual(approveTreaty.status, 200);
        node_assert_1.default.strictEqual(approveTreaty.body.status, 'Active');
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
        node_assert_1.default.strictEqual(claimRes.status, 201);
        node_assert_1.default.strictEqual(claimRes.body.claim.claimRef, claimRef);
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
        node_assert_1.default.strictEqual(duplicateRes.status, 409);
        node_assert_1.default.strictEqual(duplicateRes.body.error, 'DuplicateClaimReference');
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
        node_assert_1.default.strictEqual(assessRes.status, 201);
        // 7. Cedant approves assessment
        const approveAssess = await request(`/api/assessments/${assessRef}/approve`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Cedant' }
        });
        node_assert_1.default.strictEqual(approveAssess.status, 200);
        // 8. Allocation simulation
        const simRes = await request('/api/allocations/simulate', {
            method: 'POST',
            headers: { 'x-resure-role': 'Operations' },
            body: {
                treatyRef,
                claimRefs: [claimRef]
            }
        });
        node_assert_1.default.strictEqual(simRes.status, 200);
        // $1.3M eligible * 40% ceded = $520k. R1 (60%) = $312k, R2 (40%) = $208k
        node_assert_1.default.strictEqual(simRes.body.simulation.cappedCededAmount.amount, '520000.00');
        node_assert_1.default.strictEqual(simRes.body.simulation.reinsurerAllocations[0].allocatedAmount.amount, '312000.00');
        node_assert_1.default.strictEqual(simRes.body.simulation.reinsurerAllocations[1].allocatedAmount.amount, '208000.00');
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
        node_assert_1.default.strictEqual(propRes.status, 201);
        node_assert_1.default.strictEqual(propRes.body.allocations.length, 2);
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
        node_assert_1.default.strictEqual(decRes.status, 200);
        node_assert_1.default.strictEqual(decRes.body.allocationStatus, 'Accepted');
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
        node_assert_1.default.strictEqual(dispRes.status, 200);
        node_assert_1.default.strictEqual(dispRes.body.allocationStatus, 'Disputed');
        // 12. Finalization is blocked while dispute is unresolved
        const blockedFinalize = await request(`/api/allocations/cycles/${cycleRef}/finalize`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Operations' }
        });
        node_assert_1.default.strictEqual(blockedFinalize.status, 400);
        node_assert_1.default.strictEqual(blockedFinalize.body.error, 'PreconditionFailed');
        // 13. Resolve the Dispute
        const resolveDispute = await request(`/api/disputes/DISP-${cycleRef}-AL-2/resolve`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Cedant' },
            body: {
                resolutionSummary: 'Underwriting endorsement confirmed policy date is valid and attaching'
            }
        });
        node_assert_1.default.strictEqual(resolveDispute.status, 200);
        node_assert_1.default.strictEqual(resolveDispute.body.dispute.status, 'Resolved');
        // 14. Finalize cycle now succeeds and creates settlements
        const finalizeRes = await request(`/api/allocations/cycles/${cycleRef}/finalize`, {
            method: 'POST',
            headers: { 'x-resure-role': 'Operations' }
        });
        node_assert_1.default.strictEqual(finalizeRes.status, 200);
        node_assert_1.default.strictEqual(finalizeRes.body.cycle.status, 'Finalized');
        node_assert_1.default.strictEqual(finalizeRes.body.settlements.length, 2);
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
        node_assert_1.default.strictEqual(reconcileRes.status, 200);
        node_assert_1.default.strictEqual(reconcileRes.body.settlement.status, 'Settled');
        node_assert_1.default.strictEqual(reconcileRes.body.settlement.outstandingBalance.amount, '0.00');
    });
});
//# sourceMappingURL=server.test.js.map