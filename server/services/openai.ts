import OpenAI from "openai";

// Initialize OpenAI client lazily
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || ""
    });
  }
  return openai;
}

// Crisis detection thresholds
const CRISIS_SEVERITY = {
  NONE: 0,
  MILD: 1,
  MODERATE: 2,
  SEVERE: 3,
  EMERGENCY: 4
};

// Emergency resources
const CRISIS_RESOURCES = {
  SUICIDE_PREVENTION: "988 Suicide & Crisis Lifeline: Call or text 988",
  CRISIS_TEXT: "Crisis Text Line: Text HOME to 741741",
  VETERANS_CRISIS: "Veterans Crisis Line: Call 1-800-273-8255 and Press 1",
  DOMESTIC_VIOLENCE: "National Domestic Violence Hotline: 1-800-799-7233",
  GENERAL: "Call 911 if you're in immediate danger"
};

export async function generateResponse(input: string, context: string = ""): Promise<string> {
  try {
    // First, perform crisis detection
    const crisisAssessment = await detectCrisis(input);
    let systemPrompt = `You are Inferno AI, a trauma-informed AI companion for people with PTSD and anxiety.
    Your responses should be empathetic, supportive, and never dismissive.
    Always use a calm, reassuring tone and avoid alarming language.
    ${context}`;
    
    // Add crisis-specific instructions based on severity
    if (crisisAssessment.severity >= CRISIS_SEVERITY.MODERATE) {
      systemPrompt += `\nIMPORTANT: The user may be experiencing a ${crisisAssessment.severityLabel} crisis related to ${crisisAssessment.crisisType}.
      Use a gentle, supportive approach. Validate their feelings without judgment.
      Remind them that help is available. Suggest the following resource: ${crisisAssessment.suggestedResource}
      Focus on immediate grounding and safety rather than long-term solutions.`;
    }

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    let aiResponse = response.choices[0].message.content || "I'm sorry, I'm having trouble generating a response right now.";
    
    // For emergency situations, append crisis resources regardless of AI response
    if (crisisAssessment.severity === CRISIS_SEVERITY.EMERGENCY) {
      aiResponse += `\n\nI'm concerned about what you're sharing. Please consider reaching out for immediate help:\n${crisisAssessment.suggestedResource}`;
    }

    return aiResponse;
  } catch (error) {
    console.error("Error generating OpenAI response:", error);
    return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function detectCrisis(text: string): Promise<{
  severity: number;
  severityLabel: string;
  crisisType: string;
  suggestedResource: string;
}> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a trauma-informed risk assessment expert. Analyze the following text for signs of crisis or distress.
          Rate the severity on the following scale:
          0 - No crisis detected
          1 - Mild distress (general anxiety, sadness)
          2 - Moderate distress (heightened anxiety, specific triggers activated)
          3 - Severe distress (panic attack, flashback, intense emotional pain)
          4 - Emergency (suicidal ideation, self-harm intent, immediate danger)
          
          Also identify the primary type of crisis (e.g., "suicidal thoughts", "panic attack", "flashback", "grief", etc.)
          Respond in JSON format with the following fields: severity (number), severityLabel (string), crisisType (string).`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const messageContent = response.choices[0].message.content;
    const result = messageContent ? JSON.parse(messageContent) : {};
    
    // Determine appropriate resource based on crisis type
    let suggestedResource = CRISIS_RESOURCES.GENERAL;
    if (result.crisisType?.toLowerCase().includes("suicid")) {
      suggestedResource = CRISIS_RESOURCES.SUICIDE_PREVENTION;
    } else if (result.crisisType?.toLowerCase().includes("veteran") || result.crisisType?.toLowerCase().includes("military")) {
      suggestedResource = CRISIS_RESOURCES.VETERANS_CRISIS;
    } else if (result.crisisType?.toLowerCase().includes("domestic") || result.crisisType?.toLowerCase().includes("abuse")) {
      suggestedResource = CRISIS_RESOURCES.DOMESTIC_VIOLENCE;
    } else if (result.severity >= 2) {
      suggestedResource = CRISIS_RESOURCES.CRISIS_TEXT;
    }

    return {
      severity: result.severity || 0,
      severityLabel: result.severityLabel || "none",
      crisisType: result.crisisType || "general distress",
      suggestedResource
    };
  } catch (error) {
    console.error("Error detecting crisis:", error);
    return {
      severity: 0,
      severityLabel: "none",
      crisisType: "unknown",
      suggestedResource: CRISIS_RESOURCES.GENERAL
    };
  }
}

export async function analyzeEmotion(text: string): Promise<{
  primaryEmotion: string;
  intensity: number;
  suggestion: string;
  crisisLevel: number;
}> {
  try {
    // First, check for crisis level
    const crisisAssessment = await detectCrisis(text);
    
    // Then, analyze emotional content
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a trauma-informed emotion analysis expert specialized in PTSD and anxiety.
          Analyze the following text and identify:
          1. The primary emotion being expressed (e.g., fear, anxiety, sadness, anger, numbness, hope)
          2. The intensity of the emotion on a scale of 1-10
          3. A brief therapeutic suggestion that would be helpful for someone experiencing this emotion
          
          Respond in JSON format with the following fields:
          - primaryEmotion (string): The main emotion detected
          - intensity (number): A number from 1-10 indicating intensity
          - suggestion (string): A brief, supportive therapeutic suggestion (max 100 characters)`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const messageContent = response.choices[0].message.content;
    const result = messageContent ? JSON.parse(messageContent) : {};
    
    return {
      primaryEmotion: result.primaryEmotion || "neutral",
      intensity: result.intensity || 0,
      suggestion: result.suggestion || "Take a moment to breathe and notice your surroundings",
      crisisLevel: crisisAssessment.severity
    };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return {
      primaryEmotion: "unknown",
      intensity: 0,
      suggestion: "Practice gentle self-care and consider reaching out for support",
      crisisLevel: 0
    };
  }
}

export async function generateGroundingPrompt(sense: string): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are helping someone practice the 5-4-3-2-1 grounding technique for anxiety or PTSD. 
          Generate a specific, supportive prompt for the "${sense}" sense that encourages mindful awareness.
          Keep it brief (1-2 sentences), supportive, and trauma-informed.`
        },
        {
          role: "user",
          content: `Create a grounding prompt for the sense of ${sense}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content || `Notice ${sense} things around you right now.`;
  } catch (error) {
    console.error("Error generating grounding prompt:", error);
    return `Gently notice ${sense} things in your surroundings.`;
  }
}

export async function suggestNextMindfulnessExercise(history: string): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a trauma-informed mindfulness expert. Based on the user's history with mindfulness exercises,
          suggest the next exercise that would be most beneficial for them. Keep your suggestion brief (2-3 sentences maximum)
          and trauma-informed.`
        },
        {
          role: "user",
          content: `Based on this history with mindfulness exercises, what would you suggest next?\n\n${history}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content || "Body scan meditation may be beneficial. This practice involves bringing gentle awareness to each part of your body in sequence, noticing sensations without judgment.";
  } catch (error) {
    console.error("Error suggesting mindfulness exercise:", error);
    return "I suggest trying a simple mindful breathing exercise, focusing on each breath with gentle awareness for 5 minutes.";
  }
}