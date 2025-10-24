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


import { Router, Request, Response } from "express";
import { 
  generateResponse, 
  analyzeEmotion, 
  generateGroundingPrompt, 
  suggestNextMindfulnessExercise 
} from "../services/openai";

const router = Router();

// Generate AI response
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const response = await generateResponse(message, context || "");
    res.json({ response });
  } catch (error) {
    console.error("Error in AI chat endpoint:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Analyze emotion
router.post("/analyze-emotion", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const analysis = await analyzeEmotion(message);
    res.json(analysis);
  } catch (error) {
    console.error("Error in emotion analysis endpoint:", error);
    res.status(500).json({ error: "Failed to analyze emotion" });
  }
});

// Generate grounding prompt
router.get("/grounding-prompt/:sense", async (req: Request, res: Response) => {
  try {
    const { sense } = req.params;
    const prompt = await generateGroundingPrompt(sense);
    res.json({ prompt });
  } catch (error) {
    console.error("Error in grounding prompt endpoint:", error);
    res.status(500).json({ error: "Failed to generate grounding prompt" });
  }
});

// Suggest next mindfulness exercise
router.post("/suggest-mindfulness", async (req: Request, res: Response) => {
  try {
    const { history } = req.body;
    
    if (!history) {
      return res.status(400).json({ error: "History is required" });
    }
    
    const suggestion = await suggestNextMindfulnessExercise(history);
    res.json({ suggestion });
  } catch (error) {
    console.error("Error in mindfulness suggestion endpoint:", error);
    res.status(500).json({ error: "Failed to suggest mindfulness exercise" });
  }
});

export default router;