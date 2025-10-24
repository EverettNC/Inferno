/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


/**
 * Security Audit Logger
 * Comprehensive logging system for security events, user actions, and compliance
 */

import winston from 'winston';
import { Request } from 'express';

// Log levels for security events
export enum SecurityEventType {
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  AUTH_LOGOUT = 'auth_logout',
  AUTH_MFA_SETUP = 'auth_mfa_setup',
  AUTH_MFA_SUCCESS = 'auth_mfa_success',
  AUTH_MFA_FAILURE = 'auth_mfa_failure',
  DATA_ACCESS = 'data_access',
  DATA_MODIFY = 'data_modify',
  DATA_DELETE = 'data_delete',
  DATA_EXPORT = 'data_export',
  PRIVACY_CONSENT = 'privacy_consent',
  PRIVACY_WITHDRAWAL = 'privacy_withdrawal',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  CONFIG_CHANGE = 'config_change',
  ERROR_SECURITY = 'error_security',
  SYSTEM_STARTUP = 'system_startup',
  CONSENT_GRANTED = 'consent_granted',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  DATA_EXPORT_REQUESTED = 'data_export_requested',
  DATA_EXPORT_COMPLETED = 'data_export_completed',
  DATA_EXPORT_FAILED = 'data_export_failed',
  DATA_DELETION_REQUESTED = 'data_deletion_requested',
  DATA_DELETION_VERIFICATION_FAILED = 'data_deletion_verification_failed',
  DATA_DELETION_BLOCKED_LEGAL_HOLD = 'data_deletion_blocked_legal_hold',
  DATA_DELETION_SCHEDULED = 'data_deletion_scheduled',
  DATA_DELETION_COMPLETED = 'data_deletion_completed',
  DATA_DELETION_FAILED = 'data_deletion_failed',
  DATA_RETENTION_EVALUATED = 'data_retention_evaluated'
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface SecurityEvent {
  eventType: SecurityEventType;
  level: LogLevel;
  userId?: number;
  username?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details?: Record<string, any>;
  timestamp: Date;
  correlationId: string;
}

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'inferno-ai-security' },
  transports: [
    // File transport for security events
    new winston.transports.File({
      filename: 'logs/security-audit.log',
      level: 'info',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    }),
    
    // Separate file for critical security events
    new winston.transports.File({
      filename: 'logs/security-critical.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 20,
      tailable: true
    }),
    
    // Console output for development
    ...(process.env.NODE_ENV === 'development' ? [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ] : [])
  ],
});

export class SecurityAuditLogger {
  
  /**
   * Generate a correlation ID for tracking related events
   */
  static generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Extract request metadata for logging
   */
  static extractRequestMetadata(req: Request): Partial<SecurityEvent> {
    return {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      sessionId: req.sessionID,
      correlationId: req.headers['x-correlation-id'] as string || this.generateCorrelationId()
    };
  }

  /**
   * Log a security event
   */
  static logEvent(event: Omit<SecurityEvent, 'timestamp' | 'correlationId'> & { correlationId?: string }): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
      correlationId: event.correlationId || this.generateCorrelationId()
    };

    logger.log(event.level, 'Security Event', securityEvent);

    // Additional alerting for critical events
    if (event.level === LogLevel.CRITICAL) {
      this.alertCriticalEvent(securityEvent);
    }
  }

  /**
   * Log authentication success
   */
  static logAuthSuccess(req: Request, userId: number, username: string): void {
    this.logEvent({
      eventType: SecurityEventType.AUTH_SUCCESS,
      level: LogLevel.INFO,
      userId,
      username,
      action: 'login',
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log authentication failure
   */
  static logAuthFailure(req: Request, username?: string, reason?: string): void {
    this.logEvent({
      eventType: SecurityEventType.AUTH_FAILURE,
      level: LogLevel.WARN,
      username,
      action: 'login_failed',
      details: { reason },
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log data access events
   */
  static logDataAccess(req: Request, userId: number, resource: string, action: string): void {
    this.logEvent({
      eventType: SecurityEventType.DATA_ACCESS,
      level: LogLevel.INFO,
      userId,
      resource,
      action,
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log data modification events
   */
  static logDataModify(req: Request, userId: number, resource: string, action: string, details?: Record<string, any>): void {
    this.logEvent({
      eventType: SecurityEventType.DATA_MODIFY,
      level: LogLevel.INFO,
      userId,
      resource,
      action,
      details,
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log suspicious activity
   */
  static logSuspiciousActivity(req: Request, reason: string, details?: Record<string, any>): void {
    this.logEvent({
      eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
      level: LogLevel.ERROR,
      action: 'suspicious_activity_detected',
      details: { reason, ...details },
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log rate limit exceeded
   */
  static logRateLimitExceeded(req: Request, limit: number): void {
    this.logEvent({
      eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
      level: LogLevel.WARN,
      action: 'rate_limit_exceeded',
      details: { limit, path: req.path },
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Log MFA events
   */
  static logMFAEvent(req: Request, userId: number, eventType: SecurityEventType, success: boolean, details?: Record<string, any>): void {
    this.logEvent({
      eventType,
      level: success ? LogLevel.INFO : LogLevel.WARN,
      userId,
      action: eventType,
      details,
      ...this.extractRequestMetadata(req)
    });
  }

  /**
   * Alert on critical security events
   */
  private static alertCriticalEvent(event: SecurityEvent): void {
    // In production, this would integrate with alerting systems
    // For now, we'll log to console and could add email/Slack notifications
    console.error('🚨 CRITICAL SECURITY EVENT:', event);
    
    // TODO: Implement external alerting
    // - Email notifications
    // - Slack/Teams alerts  
    // - PagerDuty integration
    // - Security incident management system
  }

  /**
   * Health check for audit logging system
   */
  static async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Test logging functionality
      logger.info('Health check - audit logging system operational');
      
      return {
        status: 'healthy',
        details: {
          logLevel: logger.level,
          transports: logger.transports.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

// Create logs directory if it doesn't exist
import { mkdirSync, existsSync } from 'fs';
if (!existsSync('logs')) {
  mkdirSync('logs', { recursive: true });
}

export default SecurityAuditLogger;