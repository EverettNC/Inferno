import OpenAI from "openai";

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function generateResponse(input: string, context: string = ""): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Inferno AI, a trauma-informed AI companion for people with PTSD and anxiety.
          Your responses should be empathetic, supportive, and never dismissive.
          Always use a calm, reassuring tone and avoid alarming language.
          If the user appears to be in crisis, gently suggest resources like the Crisis Text Line (Text HOME to 741741) or the National Suicide Prevention Lifeline (988).
          ${context}`
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I'm having trouble generating a response right now.";
  } catch (error) {
    console.error("Error generating OpenAI response:", error);
    return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function analyzeEmotion(text: string): Promise<{
  primaryEmotion: string;
  intensity: number;
  suggestion: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze the emotional content of the following text from someone who may be experiencing PTSD or anxiety symptoms.
          Identify:
          1. The primary emotion (e.g., anxiety, sadness, anger, fear, calm, etc.)
          2. The intensity of the emotion on a scale of 1-10
          3. A brief, trauma-informed suggestion for a coping mechanism that might help
          
          Format your response as JSON with keys: primaryEmotion, intensity, suggestion.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      primaryEmotion: result.primaryEmotion || "neutral",
      intensity: result.intensity || 5,
      suggestion: result.suggestion || "Consider taking a few deep breaths."
    };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return {
      primaryEmotion: "neutral",
      intensity: 5,
      suggestion: "Consider practicing a grounding technique like the 5-4-3-2-1 exercise."
    };
  }
}

export async function generateGroundingPrompt(sense: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
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

    return response.choices[0].message.content || "Take a moment to notice what you can perceive with your senses.";
  } catch (error) {
    console.error("Error generating grounding prompt:", error);
    return "Take a moment to notice what you can perceive with your senses.";
  }
}

export async function suggestNextMindfulnessExercise(history: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Based on the user's history of mindfulness practice and their reported experiences, suggest the most appropriate next mindfulness exercise.
          Choose between: "Body Scan Meditation", "Loving-Kindness Meditation", and "Mountain Meditation".
          Consider what might be most beneficial based on their past experiences.`
        },
        {
          role: "user",
          content: `My history with mindfulness exercises: ${history}`
        }
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const suggestion = response.choices[0].message.content || "";
    
    // Extract the exercise name from the response
    if (suggestion.includes("Body Scan")) {
      return "bodyScan";
    } else if (suggestion.includes("Loving-Kindness")) {
      return "lovingKindness";
    } else if (suggestion.includes("Mountain")) {
      return "mountain";
    } else {
      // Default to body scan if we can't extract a specific exercise
      return "bodyScan";
    }
  } catch (error) {
    console.error("Error suggesting mindfulness exercise:", error);
    return "bodyScan";
  }
}