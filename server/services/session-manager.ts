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
 * Session Management Service
 * Secure session handling with Redis store, CSRF protection, and security controls
 */

import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { Request, Response, NextFunction } from 'express';
import csrf from 'csrf';

export interface SessionConfig {
  secret: string;
  redisUrl?: string;
  maxAge?: number;
  secure?: boolean;
  domain?: string;
}

export interface UserSession {
  userId: number;
  username: string;
  isAuthenticated: boolean;
  mfaVerified: boolean;
  loginTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  permissions?: string[];
}

export class SessionManager {
  private redisClient: any;
  private csrfTokens: any;
  private store: any;

  constructor(private config: SessionConfig) {
    this.initializeRedis();
    this.initializeCSRF();
  }

  /**
   * Initialize Redis client and store
   */
  private async initializeRedis(): Promise<void> {
    try {
      const redisUrl = this.config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redisClient = createClient({
        url: redisUrl,
        retry_unfulfilled_commands: true,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
        }
      });

      this.redisClient.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis connected for session storage');
      });

      await this.redisClient.connect();
      
      // Initialize Redis store for sessions
      this.store = new RedisStore({
        client: this.redisClient,
        prefix: 'inferno:sess:',
        ttl: this.config.maxAge ? this.config.maxAge / 1000 : 86400, // 24 hours default
      });

    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      console.log('Falling back to memory store (not recommended for production)');
      this.store = new session.MemoryStore();
    }
  }

  /**
   * Initialize CSRF protection
   */
  private initializeCSRF(): void {
    this.csrfTokens = new csrf();
  }

  /**
   * Get Express session middleware
   */
  getSessionMiddleware() {
    return session({
      name: 'inferno.sid',
      secret: this.config.secret,
      store: this.store,
      resave: false,
      saveUninitialized: false,
      rolling: true, // Reset expiry on activity
      cookie: {
        secure: this.config.secure ?? (process.env.NODE_ENV === 'production'),
        httpOnly: true,
        maxAge: this.config.maxAge || 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict',
        domain: this.config.domain
      },
      genid: () => {
        // Generate secure session ID
        return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      }
    });
  }

  /**
   * Create user session
   */
  static createUserSession(req: Request, userId: number, username: string): void {
    const userSession: UserSession = {
      userId,
      username,
      isAuthenticated: true,
      mfaVerified: false,
      loginTime: new Date(),
      lastActivity: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    };

    (req.session as any).user = userSession;
  }

  /**
   * Update session activity
   */
  static updateActivity(req: Request): void {
    if ((req.session as any)?.user) {
      (req.session as any).user.lastActivity = new Date();
    }
  }

  /**
   * Set MFA verification status
   */
  static setMFAVerified(req: Request, verified: boolean): void {
    if ((req.session as any)?.user) {
      (req.session as any).user.mfaVerified = verified;
    }
  }

  /**
   * Get user session data
   */
  static getUserSession(req: Request): UserSession | null {
    return (req.session as any)?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(req: Request): boolean {
    const userSession = this.getUserSession(req);
    return userSession?.isAuthenticated === true;
  }

  /**
   * Check if user has completed MFA
   */
  static isMFAVerified(req: Request): boolean {
    const userSession = this.getUserSession(req);
    return userSession?.mfaVerified === true;
  }

  /**
   * Destroy user session
   */
  static destroySession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(req: Request): string {
    const secret = (req.session as any)?.csrfSecret || this.csrfTokens.secretSync();
    (req.session as any).csrfSecret = secret;
    return this.csrfTokens.create(secret);
  }

  /**
   * Verify CSRF token
   */
  verifyCSRFToken(req: Request, token: string): boolean {
    const secret = (req.session as any)?.csrfSecret;
    if (!secret) return false;
    return this.csrfTokens.verify(secret, token);
  }

  /**
   * CSRF protection middleware
   */
  static csrfProtection(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip for API endpoints that use other auth methods
    if (req.path.startsWith('/api/auth/') || req.path.startsWith('/api/realtime-voice')) {
      return next();
    }

    const token = req.body._csrf || req.headers['x-csrf-token'] || req.headers['csrf-token'];
    
    if (!token || !SessionManager.verifyCSRFToken(req, token as string)) {
      return res.status(403).json({ 
        error: 'Invalid CSRF token',
        code: 'CSRF_MISMATCH' 
      });
    }

    next();
  }

  /**
   * Authentication middleware
   */
  static requireAuth() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!SessionManager.isAuthenticated(req)) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NOT_AUTHENTICATED' 
        });
      }
      
      // Update activity timestamp
      SessionManager.updateActivity(req);
      next();
    };
  }

  /**
   * MFA verification middleware
   */
  static requireMFA() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!SessionManager.isAuthenticated(req)) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'NOT_AUTHENTICATED' 
        });
      }

      if (!SessionManager.isMFAVerified(req)) {
        return res.status(403).json({ 
          error: 'MFA verification required',
          code: 'MFA_REQUIRED' 
        });
      }

      SessionManager.updateActivity(req);
      next();
    };
  }

  /**
   * Session timeout middleware
   */
  static sessionTimeout(maxInactiveMinutes: number = 30) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userSession = SessionManager.getUserSession(req);
      
      if (userSession) {
        const lastActivity = new Date(userSession.lastActivity);
        const now = new Date();
        const minutesInactive = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
        
        if (minutesInactive > maxInactiveMinutes) {
          SessionManager.destroySession(req);
          return res.status(401).json({ 
            error: 'Session expired due to inactivity',
            code: 'SESSION_TIMEOUT' 
          });
        }
      }
      
      next();
    };
  }

  /**
   * Get active sessions count for a user
   */
  async getActiveSessionsCount(userId: number): Promise<number> {
    try {
      const keys = await this.redisClient.keys('inferno:sess:*');
      let count = 0;

      for (const key of keys) {
        const sessionData = await this.redisClient.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.user?.userId === userId) {
            count++;
          }
        }
      }

      return count;
    } catch (error) {
      console.error('Error counting active sessions:', error);
      return 0;
    }
  }

  /**
   * Terminate all sessions for a user (useful for logout from all devices)
   */
  async terminateUserSessions(userId: number): Promise<number> {
    try {
      const keys = await this.redisClient.keys('inferno:sess:*');
      let terminated = 0;

      for (const key of keys) {
        const sessionData = await this.redisClient.get(key);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          if (parsed.user?.userId === userId) {
            await this.redisClient.del(key);
            terminated++;
          }
        }
      }

      return terminated;
    } catch (error) {
      console.error('Error terminating user sessions:', error);
      return 0;
    }
  }

  /**
   * Health check for session management
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Test Redis connection
      await this.redisClient.ping();
      
      return {
        status: 'healthy',
        details: {
          redisConnected: true,
          storeType: this.store.constructor.name,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          redisConnected: false,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Cleanup expired sessions (run periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const keys = await this.redisClient.keys('inferno:sess:*');
      let cleaned = 0;

      for (const key of keys) {
        const ttl = await this.redisClient.ttl(key);
        if (ttl === -1) { // No expiry set
          await this.redisClient.expire(key, 86400); // Set 24h expiry
        } else if (ttl === -2) { // Key doesn't exist
          cleaned++;
        }
      }

      return cleaned;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  }

  // Static instance for global access
  private static instance: SessionManager;

  /**
   * Initialize the global session manager instance
   */
  static initialize(config?: SessionConfig): SessionManager {
    if (!this.instance) {
      const defaultConfig: SessionConfig = {
        secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
        redisUrl: process.env.REDIS_URL,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production'
      };
      this.instance = new SessionManager({ ...defaultConfig, ...config });
    }
    return this.instance;
  }

  /**
   * Get the global session middleware
   */
  static getSessionMiddleware() {
    if (!this.instance) {
      this.initialize();
    }
    return this.instance.getSessionMiddleware();
  }

  /**
   * Get the session manager instance
   */
  static getInstance(): SessionManager {
    if (!this.instance) {
      this.initialize();
    }
    return this.instance;
  }

  /**
   * Verify CSRF token statically
   */
  static verifyCSRFToken(req: Request, token: string): boolean {
    if (!this.instance) {
      this.initialize();
    }
    return this.instance.verifyCSRFToken(req, token);
  }
}

export default SessionManager;