"use strict";
/**
 * Canton Ledger Client Configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCantonConfig = loadCantonConfig;
function loadCantonConfig() {
    return {
        httpJsonUrl: process.env.CANTON_JSON_API_URL || 'http://127.0.0.1:7575',
        ledgerId: process.env.CANTON_LEDGER_ID || undefined,
        applicationId: process.env.CANTON_APPLICATION_ID || 'resure-nexus',
        jwtSecret: process.env.CANTON_JWT_SECRET || 'resure-nexus-canton-auth-secret-key-32b',
        timeoutMs: Number(process.env.CANTON_TIMEOUT_MS) || 15000
    };
}
//# sourceMappingURL=config.js.map