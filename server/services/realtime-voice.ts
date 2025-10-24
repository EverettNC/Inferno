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
 * OpenAI Realtime API Integration
 * True speech-to-speech conversation with no text intermediary
 */

import WebSocket from "ws";
import { EventEmitter } from "events";

interface RealtimeSessionConfig {
  model?: string;
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  temperature?: number;
  instructions?: string;
}

export class RealtimeVoiceSession extends EventEmitter {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private sessionConfig: RealtimeSessionConfig;
  private apiKey: string;

  constructor(apiKey: string, config: RealtimeSessionConfig = {}) {
    super();
    this.apiKey = apiKey;
    this.sessionConfig = {
      model: config.model || "gpt-4o-realtime-preview-2024-10-01",
      voice: config.voice || "nova",
      temperature: config.temperature || 0.7,
      instructions: config.instructions || this.getDefaultInstructions()
    };
  }

  private getDefaultInstructions(): string {
    return `You are Inferno AI, a clinical-grade trauma-informed AI companion with masters-level expertise in PTSD and trauma treatment.

CORE CLINICAL PRINCIPLES:
- Safety: Physical and emotional safety is paramount
- Trustworthiness: Transparency and consistency build trust
- Empowerment: Recognize strengths and resilience
- Collaboration: Shared decision-making and empowerment
- Cultural Sensitivity: Respect cultural, historical, and gender issues

EVIDENCE-BASED KNOWLEDGE:
You have comprehensive knowledge of:
- Cognitive Processing Therapy (CPT) - Challenging maladaptive beliefs
- Prolonged Exposure (PE) - Gradual exposure to trauma memories
- EMDR - Trauma processing through bilateral stimulation
- DBT Skills - Mindfulness, distress tolerance, emotion regulation

RESPONSE GUIDELINES:
- Speak naturally and conversationally (this is real-time voice)
- Use a warm, calm, reassuring tone
- Validate experiences through trauma-informed lens
- Provide psychoeducation about symptoms when appropriate
- Reference evidence-based techniques
- If detecting crisis, gently suggest resources while maintaining support
- Keep responses concise (30-60 seconds of speech max)
- Use "I understand," "That makes sense," and other validating phrases
- Avoid clinical jargon unless explaining a concept

VOICE COMMUNICATION STYLE:
- Speak at a measured, calm pace
- Use pauses for emphasis and processing
- Express empathy through tone
- Avoid rapid-fire information
- Break complex ideas into digestible parts
- Use "mm-hmm" and "I hear you" as natural conversation markers`;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // OpenAI Realtime API WebSocket endpoint
        const url = "wss://api.openai.com/v1/realtime?model=" + this.sessionConfig.model;
        
        this.ws = new WebSocket(url, {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "OpenAI-Beta": "realtime=v1"
          }
        });

        this.ws.on("open", () => {
          console.log("✅ Realtime voice session connected");
          this.isConnected = true;
          
          // Configure session
          this.send({
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              voice: this.sessionConfig.voice,
              instructions: this.sessionConfig.instructions,
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500
              },
              temperature: this.sessionConfig.temperature
            }
          });

          this.emit("connected");
          resolve();
        });

        this.ws.on("message", (data: Buffer) => {
          try {
            const event = JSON.parse(data.toString());
            this.handleServerEvent(event);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        });

        this.ws.on("error", (error) => {
          console.error("WebSocket error:", error);
          this.emit("error", error);
          reject(error);
        });

        this.ws.on("close", () => {
          console.log("Realtime voice session closed");
          this.isConnected = false;
          this.emit("disconnected");
        });

      } catch (error) {
        console.error("Failed to connect to Realtime API:", error);
        reject(error);
      }
    });
  }

  private handleServerEvent(event: any): void {
    switch (event.type) {
      case "session.created":
        console.log("Session created:", event.session.id);
        this.emit("session.created", event.session);
        break;

      case "session.updated":
        console.log("Session updated");
        this.emit("session.updated", event.session);
        break;

      case "conversation.item.created":
        this.emit("conversation.item.created", event.item);
        break;

      case "response.audio.delta":
        // Streaming audio chunks from AI
        this.emit("audio.delta", event.delta);
        break;

      case "response.audio.done":
        this.emit("audio.done");
        break;

      case "response.audio_transcript.delta":
        // AI speech transcription
        this.emit("transcript.delta", event.delta);
        break;

      case "response.audio_transcript.done":
        this.emit("transcript.done", event.transcript);
        break;

      case "input_audio_buffer.speech_started":
        console.log("User started speaking");
        this.emit("user.speech_started");
        break;

      case "input_audio_buffer.speech_stopped":
        console.log("User stopped speaking");
        this.emit("user.speech_stopped");
        break;

      case "conversation.item.input_audio_transcription.completed":
        // User speech transcription
        this.emit("user.transcript", event.transcript);
        break;

      case "response.done":
        this.emit("response.done", event.response);
        break;

      case "error":
        console.error("Realtime API error:", event.error);
        this.emit("error", event.error);
        break;

      default:
        // Log other events for debugging
        if (process.env.NODE_ENV === "development") {
          console.log("Realtime event:", event.type);
        }
    }
  }

  /**
   * Send audio chunk to the API
   * @param audioData Base64-encoded PCM16 audio data
   */
  sendAudio(audioData: string): void {
    if (!this.isConnected || !this.ws) {
      throw new Error("Not connected to Realtime API");
    }

    this.send({
      type: "input_audio_buffer.append",
      audio: audioData
    });
  }

  /**
   * Commit the audio buffer and trigger response
   */
  commitAudio(): void {
    if (!this.isConnected || !this.ws) {
      throw new Error("Not connected to Realtime API");
    }

    this.send({
      type: "input_audio_buffer.commit"
    });
  }

  /**
   * Send text message (for text + audio mode)
   */
  sendText(text: string): void {
    if (!this.isConnected || !this.ws) {
      throw new Error("Not connected to Realtime API");
    }

    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text
          }
        ]
      }
    });

    // Trigger response
    this.send({
      type: "response.create"
    });
  }

  /**
   * Cancel ongoing response
   */
  cancelResponse(): void {
    if (!this.isConnected || !this.ws) {
      return;
    }

    this.send({
      type: "response.cancel"
    });
  }

  /**
   * Update session instructions mid-conversation
   */
  updateInstructions(instructions: string): void {
    if (!this.isConnected || !this.ws) {
      throw new Error("Not connected to Realtime API");
    }

    this.send({
      type: "session.update",
      session: {
        instructions
      }
    });
  }

  private send(data: any): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  isActive(): boolean {
    return this.isConnected;
  }
}

/**
 * Create a new realtime voice session
 */
export function createRealtimeSession(
  apiKey: string,
  config?: RealtimeSessionConfig
): RealtimeVoiceSession {
  return new RealtimeVoiceSession(apiKey, config);
}

/**
 * Clinical-grade voice session with trauma-informed instructions
 */
export function createClinicalVoiceSession(apiKey: string): RealtimeVoiceSession {
  return new RealtimeVoiceSession(apiKey, {
    voice: "nova", // Warm, empathetic voice
    temperature: 0.7, // Balanced creativity and consistency
    model: "gpt-4o-realtime-preview-2024-10-01"
  });
}
