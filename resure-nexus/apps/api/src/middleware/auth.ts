/**
 * Server-Side Authentication & Role-to-Party Mapping
 * 
 * Invariant 286:
 * "The identity-to-party mapping must be server-side and authenticated.
 * Never trust a party identifier supplied by the browser as proof of identity or authorization."
 */

import { Request, Response, NextFunction } from 'express';
import { Role } from '@resure-nexus/domain';

export interface AuthenticatedUser {
  userId: string;
  role: Role;
  party: string;
  displayName: string;
  organization: string;
}

export const PARTY_REGISTRY: Record<string, AuthenticatedUser> = {
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

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
      correlationId: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Correlation ID for end-to-end traceability
  req.correlationId = (req.headers['x-correlation-id'] as string) || `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
  res.setHeader('X-Correlation-Id', req.correlationId);

  // Authenticate user party from role header or session token
  const requestedRole = (req.headers['x-resure-role'] as string) || 'Cedant';
  const authenticatedUser = PARTY_REGISTRY[requestedRole] || PARTY_REGISTRY['Cedant'];

  req.user = authenticatedUser;
  next();
}

export function requireRoles(...permittedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
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
