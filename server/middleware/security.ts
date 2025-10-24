/**
 * Security Middleware
 * Authentication, authorization, MFA enforcement, and security controls
 */

import { Request, Response, NextFunction } from 'express';
import SessionManager from '../services/session-manager';
import MFAService from '../services/mfa';
import SecurityAuditLogger, { SecurityEventType, LogLevel } from '../services/security-audit';
import DataPrivacyService from '../services/data-privacy';

// Extend Express Request type to include user session
declare global {
  namespace Express {
    interface Request {
      userSession?: {
        userId: number;
        username: string;
        role?: string;
        mfaVerified?: boolean;
        loginTime?: Date;
      };
    }
  }
}

/**
 * Authentication middleware - ensures user is logged in
 */
export const requireAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userSession = SessionManager.getUserSession(req);
    
    if (!userSession || !userSession.userId) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Attach user session to request for easy access
    req.userSession = userSession;
    
    // Update activity timestamp
    SessionManager.updateActivity(req);
    
    next();
  };
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    
    if (!userSession) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = (userSession as any).role || 'user';
    
    if (!roles.includes(userRole)) {
      SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
        level: LogLevel.WARN,
        userId: userSession.userId,
        username: userSession.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'unauthorized_access_attempt',
          requiredRoles: roles,
          userRole,
          resource: req.path
        }
      });

      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        required: roles
      });
    }

    next();
  };
};

/**
 * MFA enforcement middleware
 */
export const requireMFA = (options: {
  operation?: string;
  skipIfNotEnabled?: boolean;
} = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    
    if (!userSession) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Check if MFA is required for this user/operation
    const mfaRequired = MFAService.isMFARequired((userSession as any).role, options.operation);
    
    if (!mfaRequired && options.skipIfNotEnabled) {
      return next();
    }

    // TODO: Check if user has MFA enabled in database
    const userHasMFA = false; // await storage.userHasMFA(userSession.userId);
    
    if (!userHasMFA) {
      if (mfaRequired) {
        return res.status(403).json({
          error: 'MFA setup required for this operation',
          code: 'MFA_REQUIRED',
          setupUrl: '/api/security/mfa/setup'
        });
      } else if (!options.skipIfNotEnabled) {
        return res.status(403).json({
          error: 'MFA required but not enabled',
          code: 'MFA_NOT_ENABLED'
        });
      }
    }

    // Check if MFA is verified for this session
    const mfaVerified = userSession.mfaVerified || false;
    
    if (!mfaVerified) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.AUTH_MFA_FAILURE,
        level: LogLevel.WARN,
        userId: userSession.userId,
        username: userSession.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'mfa_verification_required',
          operation: options.operation,
          resource: req.path
        }
      });

      return res.status(403).json({
        error: 'MFA verification required',
        code: 'MFA_VERIFICATION_REQUIRED',
        verifyUrl: '/api/security/mfa/verify'
      });
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = () => {
  return requireRole(['admin', 'super_admin']);
};

/**
 * Data access logging middleware
 */
export const logDataAccess = (dataType: string, action: 'read' | 'write' | 'delete' = 'read') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    const startTime = Date.now();

    // Log the data access attempt
    if (userSession) {
      await SecurityAuditLogger.logEvent({
        eventType: action === 'read' ? SecurityEventType.DATA_ACCESS : 
                   action === 'write' ? SecurityEventType.DATA_MODIFY : 
                   SecurityEventType.DATA_DELETE,
        level: LogLevel.INFO,
        userId: userSession.userId,
        username: userSession.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: req.path,
        action: `${action}_${dataType}`,
        details: {
          dataType,
          action,
          method: req.method,
          params: req.params,
          query: req.query
        }
      });
    }

    // Log completion after response
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - startTime;
      
      if (userSession) {
        SecurityAuditLogger.logEvent({
          eventType: action === 'read' ? SecurityEventType.DATA_ACCESS : 
                     action === 'write' ? SecurityEventType.DATA_MODIFY : 
                     SecurityEventType.DATA_DELETE,
          level: LogLevel.INFO,
          userId: userSession.userId,
          username: userSession.username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          resource: req.path,
          action: `${action}_${dataType}_completed`,
          details: {
            dataType,
            action,
            statusCode: res.statusCode,
            duration,
            success: res.statusCode < 400
          }
        });
      }

      return originalSend.call(this, body);
    };

    next();
  };
};

/**
 * Consent verification middleware for data processing
 */
export const requireConsent = (consentTypes: string | string[], purpose?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    
    if (!userSession) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const types = Array.isArray(consentTypes) ? consentTypes : [consentTypes];
    
    // Check consent for each required type
    for (const consentType of types) {
      const hasConsent = await DataPrivacyService.hasValidConsent(
        userSession.userId, 
        consentType as any, 
        purpose
      );
      
      if (!hasConsent) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.PRIVACY_CONSENT,
          level: LogLevel.WARN,
          userId: userSession.userId,
          username: userSession.username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            action: 'consent_required',
            consentType,
            purpose,
            resource: req.path
          }
        });

        return res.status(403).json({
          error: `Consent required for ${consentType}`,
          code: 'CONSENT_REQUIRED',
          consentType,
          purpose,
          consentUrl: '/api/security/privacy/consent'
        });
      }
    }

    next();
  };
};

/**
 * Rate limiting per user middleware
 */
export const rateLimit = (options: {
  maxRequests: number;
  windowMinutes: number;
  skipSuccessfulRequests?: boolean;
}) => {
  const requests = new Map<string, { count: number; resetAt: Date }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    const identifier = userSession ? 
      `user:${userSession.userId}` : 
      `ip:${req.ip}`;
    
    const now = new Date();
    const window = requests.get(identifier);
    
    if (!window || now > window.resetAt) {
      // Reset or initialize window
      requests.set(identifier, {
        count: 1,
        resetAt: new Date(now.getTime() + options.windowMinutes * 60 * 1000)
      });
      return next();
    }
    
    if (window.count >= options.maxRequests) {
      if (userSession) {
        SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
          level: LogLevel.WARN,
          userId: userSession.userId,
          username: userSession.username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            action: 'rate_limit_exceeded',
            maxRequests: options.maxRequests,
            windowMinutes: options.windowMinutes,
            resource: req.path
          }
        });
      }

      return res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((window.resetAt.getTime() - now.getTime()) / 1000)
      });
    }
    
    window.count++;
    
    // If skipSuccessfulRequests is true, decrement on successful response
    if (options.skipSuccessfulRequests) {
      const originalSend = res.send;
      res.send = function(body) {
        if (res.statusCode < 400) {
          const currentWindow = requests.get(identifier);
          if (currentWindow && currentWindow.count > 0) {
            currentWindow.count--;
          }
        }
        return originalSend.call(this, body);
      };
    }
    
    next();
  };
};

/**
 * Sensitive operation middleware (requires recent authentication + MFA)
 */
export const requireFreshAuth = (maxAgeMinutes: number = 15) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.userSession || SessionManager.getUserSession(req);
    
    if (!userSession) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const loginTime = userSession.loginTime || new Date(0);
    const maxAge = maxAgeMinutes * 60 * 1000;
    const isRecent = (Date.now() - loginTime.getTime()) < maxAge;
    
    if (!isRecent) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
        level: LogLevel.WARN,
        userId: userSession.userId,
        username: userSession.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'stale_authentication',
          loginAge: Date.now() - loginTime.getTime(),
          maxAgeAllowed: maxAge,
          resource: req.path
        }
      });

      return res.status(403).json({
        error: 'Recent authentication required',
        code: 'FRESH_AUTH_REQUIRED',
        maxAge: maxAgeMinutes,
        loginUrl: '/api/auth/login'
      });
    }

    next();
  };
};

/**
 * IP whitelist middleware
 */
export const requireWhitelistedIP = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!allowedIPs.includes(clientIP)) {
      const userSession = req.userSession || SessionManager.getUserSession(req);
      
      SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
        level: LogLevel.ERROR,
        userId: userSession?.userId,
        username: userSession?.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'ip_not_whitelisted',
          clientIP,
          allowedIPs,
          resource: req.path
        }
      });

      return res.status(403).json({
        error: 'Access denied from this IP address',
        code: 'IP_NOT_ALLOWED'
      });
    }

    next();
  };
};

/**
 * Security headers middleware (additional to helmet)
 */
export const securityHeaders = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Additional security headers beyond helmet
    res.setHeader('X-Request-ID', req.get('X-Request-ID') || `req_${Date.now()}_${Math.random()}`);
    res.setHeader('X-API-Version', '1.0');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    next();
  };
};

// Combined security middleware for high-security endpoints
export const highSecurity = (options: {
  requireMFA?: boolean;
  requireAdmin?: boolean;
  requireConsent?: string[];
  maxAgeMinutes?: number;
  rateLimit?: { maxRequests: number; windowMinutes: number };
} = {}) => {
  const middlewares = [
    requireAuth(),
    securityHeaders()
  ];

  if (options.requireAdmin) {
    middlewares.push(requireAdmin());
  }

  if (options.requireMFA) {
    middlewares.push(requireMFA());
  }

  if (options.requireConsent) {
    middlewares.push(requireConsent(options.requireConsent));
  }

  if (options.maxAgeMinutes) {
    middlewares.push(requireFreshAuth(options.maxAgeMinutes));
  }

  if (options.rateLimit) {
    middlewares.push(rateLimit(options.rateLimit));
  }

  return middlewares;
};

export default {
  requireAuth,
  requireRole,
  requireMFA,
  requireAdmin,
  logDataAccess,
  requireConsent,
  rateLimit,
  requireFreshAuth,
  requireWhitelistedIP,
  securityHeaders,
  highSecurity
};