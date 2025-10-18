/**
 * WebSocket routes for OpenAI Realtime Voice API
 */

import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createClinicalVoiceSession, RealtimeVoiceSession } from "../services/realtime-voice";

// Store active sessions by user/connection ID
const activeSessions = new Map<string, RealtimeVoiceSession>();

export function setupRealtimeVoiceWebSocket(server: HTTPServer): void {
  const wss = new WebSocketServer({ 
    server,
    path: "/api/realtime-voice"
  });

  console.log("✅ Realtime voice WebSocket server ready on /api/realtime-voice");

  wss.on("connection", async (clientWs: WebSocket) => {
    console.log("📞 New realtime voice connection");
    
    const sessionId = generateSessionId();
    let realtimeSession: RealtimeVoiceSession | null = null;

    try {
      // Create OpenAI Realtime session
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY not configured");
      }

      realtimeSession = createClinicalVoiceSession(apiKey);
      activeSessions.set(sessionId, realtimeSession);

      // Forward events from OpenAI to client
      realtimeSession.on("connected", () => {
        send(clientWs, { type: "session.connected", sessionId });
      });

      realtimeSession.on("audio.delta", (audioDelta: string) => {
        send(clientWs, { type: "audio.delta", delta: audioDelta });
      });

      realtimeSession.on("audio.done", () => {
        send(clientWs, { type: "audio.done" });
      });

      realtimeSession.on("transcript.delta", (delta: string) => {
        send(clientWs, { type: "transcript.delta", delta });
      });

      realtimeSession.on("transcript.done", (transcript: string) => {
        send(clientWs, { type: "transcript.done", transcript });
      });

      realtimeSession.on("user.speech_started", () => {
        send(clientWs, { type: "user.speech_started" });
      });

      realtimeSession.on("user.speech_stopped", () => {
        send(clientWs, { type: "user.speech_stopped" });
      });

      realtimeSession.on("user.transcript", (transcript: string) => {
        send(clientWs, { type: "user.transcript", transcript });
      });

      realtimeSession.on("response.done", (response: any) => {
        send(clientWs, { type: "response.done", response });
      });

      realtimeSession.on("error", (error: any) => {
        console.error("Realtime session error:", error);
        send(clientWs, { type: "error", error: error.message || "Unknown error" });
      });

      realtimeSession.on("disconnected", () => {
        send(clientWs, { type: "session.disconnected" });
        clientWs.close();
      });

      // Connect to OpenAI
      await realtimeSession.connect();

    } catch (error: any) {
      console.error("Failed to create realtime session:", error);
      send(clientWs, { 
        type: "error", 
        error: error.message || "Failed to establish voice session" 
      });
      clientWs.close();
      return;
    }

    // Handle messages from client
    clientWs.on("message", (data: Buffer | string) => {
      try {
        if (!realtimeSession) {
          send(clientWs, { type: "error", error: "Session not initialized" });
          return;
        }

        // Handle binary audio data
        if (data instanceof Buffer || data instanceof ArrayBuffer) {
          // Binary audio frame from client - send directly to OpenAI
          const audioBase64 = Buffer.from(data).toString("base64");
          realtimeSession.sendAudio(audioBase64);
          return;
        }

        // Handle JSON control messages
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "audio.append":
            // Client sending base64 encoded audio chunk
            realtimeSession.sendAudio(message.audio);
            break;

          case "audio.commit":
            // Client finished speaking
            realtimeSession.commitAudio();
            break;

          case "text.send":
            // Client sending text message
            realtimeSession.sendText(message.text);
            break;

          case "response.cancel":
            // Client wants to interrupt AI response
            realtimeSession.cancelResponse();
            break;

          case "session.update":
            // Update session instructions mid-conversation
            if (message.instructions) {
              realtimeSession.updateInstructions(message.instructions);
            }
            break;

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error: any) {
        console.error("Error handling client message:", error);
        send(clientWs, { type: "error", error: error.message });
      }
    });

    // Cleanup on disconnect
    clientWs.on("close", () => {
      console.log("📞 Realtime voice connection closed");
      
      if (realtimeSession) {
        realtimeSession.disconnect();
        activeSessions.delete(sessionId);
      }
    });

    clientWs.on("error", (error) => {
      console.error("Client WebSocket error:", error);
      
      if (realtimeSession) {
        realtimeSession.disconnect();
        activeSessions.delete(sessionId);
      }
    });
  });
}

function send(ws: WebSocket, data: any): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Cleanup utility
export function cleanupInactiveSessions(): void {
  activeSessions.forEach((session, sessionId) => {
    if (!session.isActive()) {
      session.disconnect();
      activeSessions.delete(sessionId);
    }
  });
}

// Run cleanup every 5 minutes
setInterval(cleanupInactiveSessions, 5 * 60 * 1000);
