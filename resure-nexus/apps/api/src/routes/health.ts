import { Router } from 'express';
import { services } from '../services';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'ReSure Nexus API',
    version: '1.0.0'
  });
});

router.get('/connectivity', async (req, res) => {
  const ledgerStatus = await services.ledgerClient.checkConnectivity();

  const status = {
    backend: {
      status: 'ONLINE',
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    },
    cantonLedger: {
      ...ledgerStatus,
      description: ledgerStatus.connected
        ? 'Connected to Canton Ledger API'
        : 'Canton Ledger API disconnected. Ensure Canton / Sandbox JSON API is running on configured port.'
    },
    projectionDatabase: {
      status: 'ONLINE',
      engine: 'SQLite (WAL Mode)',
      path: './.data/resure-projections.db'
    },
    documentStore: {
      status: 'ONLINE',
      type: 'Encrypted Local Content-Addressed Store',
      cipher: 'AES-256-GCM',
      digestAlgorithm: 'SHA-256'
    },
    activeSession: {
      authenticatedParty: req.user.party,
      role: req.user.role,
      displayName: req.user.displayName,
      organization: req.user.organization
    }
  };

  res.json(status);
});

export default router;
