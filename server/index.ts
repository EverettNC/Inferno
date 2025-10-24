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


import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import session from 'express-session';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeClinicalProtocols, syncLatestResearch } from "./services/knowledge-sync";
import { startKnowledgeSyncSchedule } from "./services/knowledge-sync";
import SessionManager from "./services/session-manager";
import SecurityAuditLogger, { SecurityEventType, LogLevel } from "./services/security-audit";
import EncryptionService from "./services/encryption";
import MFAService from "./services/mfa";
import DataPrivacyService from "./services/data-privacy";

const app = express();

// Initialize security services
async function initializeSecurityServices() {
  try {
    // Initialize encryption service
    await EncryptionService.initialize();
    
    // Log security service initialization
    await SecurityAuditLogger.logEvent({
      eventType: SecurityEventType.SYSTEM_STARTUP,
      level: LogLevel.INFO,
      details: {
        services: ['encryption', 'session-management', 'mfa', 'data-privacy'],
        timestamp: new Date().toISOString()
      }
    });

    log('Security services initialized successfully');
  } catch (error) {
    log(`Failed to initialize security services: ${error}`);
    process.exit(1);
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security middlewares
app.use(helmet());

// CORS: restrict origins in production. Configure via CORS_ORIGIN env var.
const corsOrigin = process.env.CORS_ORIGIN || (app.get("env") === "development" ? "http://localhost:5173" : false);
app.use(cors({ origin: corsOrigin }));

// Session management with Redis
const sessionMiddleware = SessionManager.getSessionMiddleware();
app.use(sessionMiddleware);

// CSRF protection middleware
app.use('/api', SessionManager.csrfProtection);

// Rate limiting on API routes to mitigate abuse
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: Number(process.env.RATE_LIMIT_MAX || 60), // default 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize security services first
  await initializeSecurityServices();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5173
  // this serves both the API and the client
  const port = 5173;
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
  server.listen({
    port,
    host,
    
  }, () => {
    log(`serving on port ${port}`);
    
    // Start clinical knowledge synchronization
    startKnowledgeSyncSchedule();
  });
})();
