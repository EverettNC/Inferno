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
 * Voice Synthesis Routes
 * AWS Polly-powered text-to-speech endpoints
 */

import { Router, Request, Response } from "express";
import { synthesizeTraumaInformed, PollyVoiceService } from "../services/aws-polly";
import { z } from "zod";

const router = Router();

// Request validation schema
const synthesizeRequestSchema = z.object({
  text: z.string().min(1).max(3000),
  voice: z.enum(["Joanna", "Matthew"]).optional().default("Joanna"),
  engine: z.enum(["standard", "neural"]).optional().default("standard")
});

/**
 * POST /api/voice/synthesize
 * Synthesize speech from text using AWS Polly
 */
router.post("/synthesize", async (req: Request, res: Response) => {
  try {
    // Validate request
    const { text, voice, engine } = synthesizeRequestSchema.parse(req.body);

    // Check if Polly is available
    const pollyAvailable = await PollyVoiceService.isAvailable();
    if (!pollyAvailable) {
      return res.status(503).json({
        error: "Voice synthesis service not available",
        message: "AWS Polly credentials not configured"
      });
    }

    // Synthesize speech with selected voice
    const audioBuffer = await synthesizeTraumaInformed(text, voice);

    // Set response headers for audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "Cache-Control": "no-cache"
    });

    // Send audio
    res.send(audioBuffer);

  } catch (error: any) {
    console.error("Voice synthesis error:", error);
    
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid request",
        message: error.errors
      });
    }

    res.status(500).json({
      error: "Synthesis failed",
      message: error.message || "Failed to synthesize speech"
    });
  }
});

/**
 * GET /api/voice/voices
 * Get available Polly voices
 */
router.get("/voices", async (_req: Request, res: Response) => {
  try {
    const pollyAvailable = await PollyVoiceService.isAvailable();
    
    if (!pollyAvailable) {
      return res.status(503).json({
        error: "Voice service not available",
        voices: []
      });
    }

    // Return recommended trauma-informed voices
    const recommendedVoices = PollyVoiceService.getRecommendedVoices();
    
    res.json({
      voices: Object.entries(recommendedVoices).map(([id, description]) => ({
        id,
        description
      })),
      recommended: "Joanna" // Default warm, empathetic voice
    });

  } catch (error: any) {
    console.error("Error fetching voices:", error);
    res.status(500).json({
      error: "Failed to fetch voices",
      message: error.message
    });
  }
});

/**
 * GET /api/voice/status
 * Check voice synthesis service status
 */
router.get("/status", async (_req: Request, res: Response) => {
  try {
    const pollyAvailable = await PollyVoiceService.isAvailable();
    
    res.json({
      available: pollyAvailable,
      provider: "AWS Polly",
      status: pollyAvailable ? "ready" : "unavailable",
      features: {
        neural_voices: pollyAvailable,
        trauma_informed_ssml: pollyAvailable,
        multiple_languages: pollyAvailable
      }
    });

  } catch (error: any) {
    res.status(500).json({
      available: false,
      status: "error",
      message: error.message
    });
  }
});

export default router;
