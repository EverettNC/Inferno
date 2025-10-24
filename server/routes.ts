import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import bcrypt from 'bcryptjs';
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCheckInSchema, 
  insertExerciseSchema 
} from "@shared/schema";
import { z } from "zod";
import aiRoutes from "./routes/ai";
import healthRoutes from "./routes/health";
import voiceRoutes from "./routes/voice";
import securityRoutes from "./routes/security";
import { setupRealtimeVoiceWebSocket } from "./routes/realtime-voice";
import SecurityAuditLogger, { SecurityEventType, LogLevel } from "./services/security-audit";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount AI routes
  app.use('/api/ai', aiRoutes);
  
  // Mount health check routes
  app.use('/api/health', healthRoutes);
  
  // Mount voice synthesis routes (AWS Polly)
  app.use('/api/voice', voiceRoutes);
  
  // Mount security routes (MFA, privacy, audit)
  app.use('/api/security', securityRoutes);
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const startTime = Date.now();
    let userId: number | undefined;
    
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.AUTH_FAILURE,
          level: LogLevel.WARN,
          username: validatedData.username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            reason: 'username_already_exists',
            action: 'register',
            duration: Date.now() - startTime
          }
        });
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      userId = user.id;
      
      // Log successful registration
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.AUTH_SUCCESS,
        level: LogLevel.INFO,
        userId: user.id,
        username: user.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'register',
          duration: Date.now() - startTime
        }
      });
      
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.AUTH_FAILURE,
        level: LogLevel.ERROR,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'register',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        }
      });
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const startTime = Date.now();
    let userId: number | undefined;
    
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.AUTH_FAILURE,
          level: LogLevel.WARN,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            reason: 'missing_credentials',
            action: 'login',
            duration: Date.now() - startTime
          }
        });
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);

      if (!user) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.AUTH_FAILURE,
          level: LogLevel.WARN,
          username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            reason: 'user_not_found',
            action: 'login',
            duration: Date.now() - startTime
          }
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      userId = user.id;
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.AUTH_FAILURE,
          level: LogLevel.WARN,
          userId: user.id,
          username: user.username,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            reason: 'invalid_password',
            action: 'login',
            duration: Date.now() - startTime
          }
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Log successful login
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.AUTH_SUCCESS,
        level: LogLevel.INFO,
        userId: user.id,
        username: user.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'login',
          duration: Date.now() - startTime
        }
      });
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.ERROR_SECURITY,
        level: LogLevel.ERROR,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          action: 'login',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        }
      });
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.DATA_ACCESS,
          level: LogLevel.WARN,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          resource: 'user_profile',
          details: {
            reason: 'invalid_user_id',
            requestedId: req.params.id,
            duration: Date.now() - startTime
          }
        });
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.DATA_ACCESS,
          level: LogLevel.WARN,
          userId: id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          resource: 'user_profile',
          details: {
            reason: 'user_not_found',
            requestedId: id,
            duration: Date.now() - startTime
          }
        });
        return res.status(404).json({ message: "User not found" });
      }
      
      // Log successful data access
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.DATA_ACCESS,
        level: LogLevel.INFO,
        userId: id,
        username: user.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'user_profile',
        action: 'read',
        details: {
          duration: Date.now() - startTime
        }
      });
      
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.ERROR_SECURITY,
        level: LogLevel.ERROR,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'user_profile',
        details: {
          action: 'read',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        }
      });
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.DATA_MODIFY,
          level: LogLevel.WARN,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          resource: 'user_profile',
          details: {
            reason: 'invalid_user_id',
            requestedId: req.params.id,
            duration: Date.now() - startTime
          }
        });
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        await SecurityAuditLogger.logEvent({
          eventType: SecurityEventType.DATA_MODIFY,
          level: LogLevel.WARN,
          userId: id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          resource: 'user_profile',
          details: {
            reason: 'user_not_found',
            requestedId: id,
            duration: Date.now() - startTime
          }
        });
        return res.status(404).json({ message: "User not found" });
      }
      
      // Log the modification attempt
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.DATA_MODIFY,
        level: LogLevel.INFO,
        userId: id,
        username: user.username,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'user_profile',
        action: 'update',
        details: {
          modifiedFields: Object.keys(req.body),
          duration: Date.now() - startTime
        }
      });
      
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      await SecurityAuditLogger.logEvent({
        eventType: SecurityEventType.ERROR_SECURITY,
        level: LogLevel.ERROR,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'user_profile',
        details: {
          action: 'update',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime
        }
      });
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Check-in routes
  app.post("/api/check-ins", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCheckInSchema.parse(req.body);
      const checkIn = await storage.createCheckIn(validatedData);
      res.status(201).json(checkIn);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Failed to create check-in" });
      }
    }
  });
  
  app.get("/api/users/:userId/check-ins", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const checkIns = await storage.getCheckInsByUserId(userId);
      res.status(200).json(checkIns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch check-ins" });
    }
  });
  
  app.get("/api/users/:userId/check-in-streak", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const streak = await storage.getCheckInStreak(userId);
      const lastCheckIn = await storage.getLastCheckInDate(userId);
      
      res.status(200).json({ streak, lastCheckIn });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch check-in streak" });
    }
  });
  
  // Exercise routes
  app.post("/api/exercises", async (req: Request, res: Response) => {
    try {
      const validatedData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(validatedData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.format() });
      } else {
        res.status(500).json({ message: "Failed to create exercise" });
      }
    }
  });
  
  app.get("/api/users/:userId/exercises", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const exercises = await storage.getExercisesByUserId(userId);
      res.status(200).json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });
  
  app.patch("/api/exercises/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exercise ID" });
      }
      
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      const updatedExercise = await storage.updateExercise(id, req.body);
      if (!updatedExercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });
  
  // Resource routes
  app.get("/api/resources", async (_req: Request, res: Response) => {
    try {
      const resources = await storage.getAllResources();
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });
  
  app.get("/api/resources/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const resources = await storage.getResourcesByCategory(category);
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket for Realtime Voice API
  setupRealtimeVoiceWebSocket(httpServer);
  
  return httpServer;
}
