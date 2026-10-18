"use strict";
/**
 * ReSure Nexus — Enterprise API Server
 *
 * Provides authenticated, permission-aware REST API endpoints for:
 * - Treaty Administration & Participations
 * - Claims Intake & Evidence Manifests
 * - Loss Occurrences & Freeze Protection
 * - Loss Assessments & Approvals
 * - Allocation Workbench (Quota-Share & XoL)
 * - Reinsurer Decisions & Dispute Resolution
 * - Post-Settlement Loss Adjustments
 * - Settlement Confirmation & Reconciliation
 * - Secure Evidence Upload, Retrieval & Tamper Verification
 * - Audit Trail & Honest Ledger Health Diagnostics
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_2 = __importDefault(require("./routes/auth"));
const health_1 = __importDefault(require("./routes/health"));
const treaties_1 = __importDefault(require("./routes/treaties"));
const claims_1 = __importDefault(require("./routes/claims"));
const occurrences_1 = __importDefault(require("./routes/occurrences"));
const assessments_1 = __importDefault(require("./routes/assessments"));
const allocations_1 = __importDefault(require("./routes/allocations"));
const reinsurer_1 = __importDefault(require("./routes/reinsurer"));
const disputes_1 = __importDefault(require("./routes/disputes"));
const adjustments_1 = __importDefault(require("./routes/adjustments"));
const settlements_1 = __importDefault(require("./routes/settlements"));
const evidence_1 = __importDefault(require("./routes/evidence"));
const audit_1 = __importDefault(require("./routes/audit"));
const reconcile_1 = __importDefault(require("./routes/reconcile"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
// Security & Utility Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)('combined', {
    skip: (req) => req.path === '/api/health'
}));
// Apply server-side authentication and correlation tracking
app.use(auth_1.authMiddleware);
// API Routes
app.use('/api/auth', auth_2.default);
app.use('/api', health_1.default);
app.use('/api/treaties', treaties_1.default);
app.use('/api/claims', claims_1.default);
app.use('/api/occurrences', occurrences_1.default);
app.use('/api/assessments', assessments_1.default);
app.use('/api/allocations', allocations_1.default);
app.use('/api/reinsurer', reinsurer_1.default);
app.use('/api/disputes', disputes_1.default);
app.use('/api/adjustments', adjustments_1.default);
app.use('/api/settlements', settlements_1.default);
app.use('/api/evidence', evidence_1.default);
app.use('/api/audit', audit_1.default);
app.use('/api/reconcile', reconcile_1.default);
// Error Handling Middleware
app.use(errorHandler_1.errorHandler);
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`  ReSure Nexus API Server online on port ${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`  Endpoint: http://localhost:${PORT}`);
        console.log(`====================================================`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map