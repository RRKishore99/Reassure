"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(err, req, res, next) {
    const correlationId = req.correlationId || 'UNKNOWN';
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Invalid request payload',
            issues: err.errors,
            correlationId
        });
    }
    // Handle known Daml / Canton errors
    const message = err.message || 'Internal server error';
    const statusCode = err.statusCode || (message.includes('Unauthorized') ? 403 : message.includes('not found') ? 404 : 400);
    // Structured logging (no secrets or sensitive data)
    console.error(`[ERROR] [${correlationId}] ${req.method} ${req.path} -> ${statusCode}: ${message}`);
    return res.status(statusCode).json({
        error: err.name || 'ApplicationError',
        message,
        correlationId
    });
}
//# sourceMappingURL=errorHandler.js.map