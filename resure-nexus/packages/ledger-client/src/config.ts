/**
 * Canton Ledger Client Configuration
 */

export interface CantonConfig {
  httpJsonUrl: string; // Canton HTTP JSON API URL (e.g. http://127.0.0.1:7575)
  ledgerId?: string; // Optional ledgerId filter
  applicationId: string; // e.g. "resure-nexus"
  jwtSecret: string; // Shared secret for token signing in dev / Canton auth
  timeoutMs: number;
}

export function loadCantonConfig(): CantonConfig {
  return {
    httpJsonUrl: process.env.CANTON_JSON_API_URL || 'http://127.0.0.1:7575',
    ledgerId: process.env.CANTON_LEDGER_ID || undefined,
    applicationId: process.env.CANTON_APPLICATION_ID || 'resure-nexus',
    jwtSecret: process.env.CANTON_JWT_SECRET || 'resure-nexus-canton-auth-secret-key-32b',
    timeoutMs: Number(process.env.CANTON_TIMEOUT_MS) || 15000
  };
}
