/**
 * Health Check and System Status API
 * Monitors clinical knowledge base, PubMed sync, and system health
 */

import { Router, Request, Response } from "express";
import { db } from "../db";
import { knowledgeBase } from "@shared/schema";
import { sql } from "drizzle-orm";
import { PollyVoiceService } from "../services/aws-polly";

const router = Router();

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
    
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error: any) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/knowledge-base
 * Check clinical knowledge base status
 */
router.get("/knowledge-base", async (_req: Request, res: Response) => {
  try {
    // Count total protocols and research articles
    const allKnowledge = await db.select().from(knowledgeBase);
    
    const protocols = allKnowledge.filter(k => k.source === "clinical-protocol");
    const research = allKnowledge.filter(k => k.source === "pubmed");
    
    // Get latest sync timestamp
    const latestResearch = research.sort((a, b) => {
      const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
      const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
      return dateB - dateA;
    })[0];
    
    // Get evidence level breakdown
    const evidenceLevels = allKnowledge.reduce((acc, item) => {
      const level = item.evidenceLevel || "unknown";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      status: "healthy",
      knowledge_base: {
        total_entries: allKnowledge.length,
        clinical_protocols: protocols.length,
        research_articles: research.length,
        evidence_levels: evidenceLevels,
        latest_research_date: latestResearch?.publicationDate || null,
        last_checked: new Date().toISOString()
      },
      protocols: protocols.map(p => ({
        title: p.title,
        source: p.source,
        evidence_level: p.evidenceLevel
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/pubmed-sync
 * Check PubMed synchronization status
 */
router.get("/pubmed-sync", async (_req: Request, res: Response) => {
  try {
    const research = await db
      .select()
      .from(knowledgeBase)
      .where(sql`${knowledgeBase.source} = 'pubmed'`);
    
    // Get sync statistics
    const totalArticles = research.length;
    const latestArticle = research.sort((a, b) => {
      const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
      const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
      return dateB - dateA;
    })[0];
    
    // Calculate sync health
    const daysSinceLastSync = latestArticle && latestArticle.publicationDate
      ? Math.floor((Date.now() - new Date(latestArticle.publicationDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    const syncHealth = daysSinceLastSync === null 
      ? "no_data"
      : daysSinceLastSync <= 7 
        ? "healthy" 
        : daysSinceLastSync <= 30 
          ? "stale" 
          : "outdated";
    
    res.json({
      status: syncHealth,
      pubmed_sync: {
        total_articles: totalArticles,
        latest_article_date: latestArticle?.publicationDate || null,
        days_since_last_sync: daysSinceLastSync,
        sync_health: syncHealth,
        last_checked: new Date().toISOString()
      },
      recent_articles: research
        .sort((a, b) => {
          const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
          const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(a => ({
          title: a.title,
          authors: a.authors,
          published: a.publicationDate,
          source_id: a.sourceId
        }))
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/voice-services
 * Check voice service availability
 */
router.get("/voice-services", async (_req: Request, res: Response) => {
  try {
    const services = {
      openai_realtime: {
        available: !!process.env.OPENAI_API_KEY,
        status: process.env.OPENAI_API_KEY ? "configured" : "missing_api_key"
      },
      aws_polly: {
        available: false,
        status: "checking..."
      }
    };
    
    // Check AWS Polly availability
    try {
      const pollyAvailable = await PollyVoiceService.isAvailable();
      services.aws_polly = {
        available: pollyAvailable,
        status: pollyAvailable 
          ? "configured" 
          : !process.env.AWS_ACCESS_KEY_ID 
            ? "missing_credentials" 
            : "sdk_not_installed"
      };
    } catch (error: any) {
      services.aws_polly = {
        available: false,
        status: error.message.includes("not installed") 
          ? "sdk_not_installed" 
          : "error"
      };
    }
    
    const overallStatus = services.openai_realtime.available || services.aws_polly.available
      ? "healthy"
      : "degraded";
    
    res.json({
      status: overallStatus,
      voice_services: services,
      last_checked: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/detailed
 * Comprehensive system health check
 */
router.get("/detailed", async (_req: Request, res: Response) => {
  try {
    // Database check
    let dbStatus = "unknown";
    try {
      await db.execute(sql`SELECT 1`);
      dbStatus = "healthy";
    } catch {
      dbStatus = "unhealthy";
    }
    
    // Knowledge base check
    const knowledge = await db.select().from(knowledgeBase);
    const protocols = knowledge.filter(k => k.source === "clinical-protocol");
    const research = knowledge.filter(k => k.source === "pubmed");
    
    // Voice services check
    const openaiAvailable = !!process.env.OPENAI_API_KEY;
    const pollyAvailable = await PollyVoiceService.isAvailable();
    
    // Overall system status
    const systemHealthy = dbStatus === "healthy" && 
                         protocols.length > 0 && 
                         (openaiAvailable || pollyAvailable);
    
    res.json({
      status: systemHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || "development"
      },
      database: {
        status: dbStatus,
        connected: dbStatus === "healthy"
      },
      knowledge_base: {
        total_entries: knowledge.length,
        clinical_protocols: protocols.length,
        research_articles: research.length
      },
      voice_services: {
        openai_realtime: openaiAvailable,
        aws_polly: pollyAvailable
      },
      features: {
        crisis_detection: true,
        trauma_protocols: protocols.length > 0,
        pubmed_integration: research.length > 0,
        voice_interaction: openaiAvailable || pollyAvailable
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
