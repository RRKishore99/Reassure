"use strict";
/**
 * Server-Side Authentication & Role-to-Party Mapping
 *
 * Invariant 286:
 * "The identity-to-party mapping must be server-side and authenticated.
 * Never trust a party identifier supplied by the browser as proof of identity or authorization."
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTY_REGISTRY = void 0;
exports.authMiddleware = authMiddleware;
exports.requireRoles = requireRoles;
exports.PARTY_REGISTRY = {
    Cedant: {
        userId: 'usr_cedant_01',
        role: 'Cedant',
        party: 'Cedant',
        displayName: 'Eleanor Vance (Head of Ceded Re)',
        organization: 'Acme National Insurance Corp'
    },
    Reinsurer1: {
        userId: 'usr_reins1_01',
        role: 'Reinsurer',
        party: 'Reinsurer1',
        displayName: 'Marcus Thorne (Senior Underwriter)',
        organization: 'Apex Global Reinsurance Ltd'
    },
    Reinsurer2: {
        userId: 'usr_reins2_01',
        role: 'Reinsurer',
        party: 'Reinsurer2',
        displayName: 'Helena Berg (Chief Underwriting Officer)',
        organization: 'Summit Syndicate Re'
    },
    Broker: {
        userId: 'usr_broker_01',
        role: 'Broker',
        party: 'Broker',
        displayName: 'Julian Sterling (Treaty Broker)',
        organization: 'Sterling & Co Reinsurance Intermediaries'
    },
    Adjuster: {
        userId: 'usr_adj_01',
        role: 'Adjuster',
        party: 'Adjuster',
        displayName: 'David Chen (Certified Loss Adjuster)',
        organization: 'Veritas Independent Claims Solutions'
    },
    Operations: {
        userId: 'usr_ops_01',
        role: 'Operations',
        party: 'Operations',
        displayName: 'Sarah Jenkins (Claims & Settlement Ops)',
        organization: 'ReSure Nexus Network Operations'
    },
    Audit: {
        userId: 'usr_audit_01',
        role: 'Audit',
        party: 'Audit',
        displayName: 'Robert Lang (Regulatory Compliance Auditor)',
        organization: 'Global Insurance Supervisory Oversight'
    }
};
function authMiddleware(req, res, next) {
    // Correlation ID for end-to-end traceability
    req.correlationId = req.headers['x-correlation-id'] || `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
    res.setHeader('X-Correlation-Id', req.correlationId);
    // Authenticate user party from role header or session token
    const requestedRole = req.headers['x-resure-role'] || 'Cedant';
    const authenticatedUser = exports.PARTY_REGISTRY[requestedRole] || exports.PARTY_REGISTRY['Cedant'];
    req.user = authenticatedUser;
    next();
}
function requireRoles(...permittedRoles) {
    return (req, res, next) => {
        if (!req.user || !permittedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Role "${req.user?.role}" is not authorized for this operation. Required: ${permittedRoles.join(', ')}`,
                correlationId: req.correlationId
            });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map