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

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import healthRoutes from './routes/health';
import treatyRoutes from './routes/treaties';
import claimRoutes from './routes/claims';
import occurrenceRoutes from './routes/occurrences';
import assessmentRoutes from './routes/assessments';
import allocationRoutes from './routes/allocations';
import reinsurerRoutes from './routes/reinsurer';
import disputeRoutes from './routes/disputes';
import adjustmentRoutes from './routes/adjustments';
import settlementRoutes from './routes/settlements';
import evidenceRoutes from './routes/evidence';
import auditRoutes from './routes/audit';
import reconcileRoutes from './routes/reconcile';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', {
  skip: (req) => req.path === '/api/health'
}));

// Apply server-side authentication and correlation tracking
app.use(authMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);
app.use('/api/treaties', treatyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/occurrences', occurrenceRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/reinsurer', reinsurerRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/adjustments', adjustmentRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reconcile', reconcileRoutes);

// Error Handling Middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  ReSure Nexus API Server online on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Endpoint: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

export default app;
