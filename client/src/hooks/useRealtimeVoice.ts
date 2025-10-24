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
 * Hook for OpenAI Realtime Voice API
 * Provides speech-to-speech conversation capabilities
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface RealtimeVoiceConfig {
  autoConnect?: boolean;
}

interface RealtimeVoiceState {
  isConnected: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
  error: string | null;
  transcript: string;
  userTranscript: string;
}

export function useRealtimeVoice(config: RealtimeVoiceConfig = {}) {
  const [state, setState] = useState<RealtimeVoiceState>({
    isConnected: false,
    isRecording: false,
    isSpeaking: false,
    error: null,
    transcript: "",
    userTranscript: ""
  });

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Get WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/realtime-voice`;

      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ Connected to Realtime Voice API");
        setState(prev => ({ ...prev, isConnected: true, error: null }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleServerMessage(message);
        } catch (error) {
          console.error("Error parsing server message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setState(prev => ({ 
          ...prev, 
          error: "Connection error - please try again",
          isConnected: false 
        }));
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setState(prev => ({ ...prev, isConnected: false }));
        cleanup();
      };

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to connect",
        isConnected: false 
      }));
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    cleanup();
    setState({
      isConnected: false,
      isRecording: false,
      isSpeaking: false,
      error: null,
      transcript: "",
      userTranscript: ""
    });
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      if (!state.isConnected) {
        throw new Error("Not connected to voice service");
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000
        } 
      });
      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;

      // Create media stream source
      const source = audioContext.createMediaStreamSource(stream);

      // Create script processor for audio chunks
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (event) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const audioData = event.inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array (PCM16)
        const pcm16 = new Int16Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          const s = Math.max(-1, Math.min(1, audioData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Send binary audio data
        wsRef.current.send(pcm16.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setState(prev => ({ ...prev, isRecording: true }));

    } catch (error: any) {
      console.error("Error starting recording:", error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to access microphone"
      }));
    }
  }, [state.isConnected]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Commit audio to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "audio.commit" }));
    }

    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  // Send text message
  const sendText = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setState(prev => ({ ...prev, error: "Not connected" }));
      return;
    }

    wsRef.current.send(JSON.stringify({ 
      type: "text.send", 
      text 
    }));
  }, []);

  // Cancel current response
  const cancelResponse = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: "response.cancel" }));
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Handle messages from server
  const handleServerMessage = useCallback((message: any) => {
    switch (message.type) {
      case "session.connected":
        console.log("Session connected:", message.sessionId);
        break;

      case "audio.delta":
        // Received audio chunk from AI - queue for playback
        playAudioDelta(message.delta);
        setState(prev => ({ ...prev, isSpeaking: true }));
        break;

      case "audio.done":
        setState(prev => ({ ...prev, isSpeaking: false }));
        break;

      case "transcript.delta":
        setState(prev => ({ 
          ...prev, 
          transcript: prev.transcript + message.delta 
        }));
        break;

      case "transcript.done":
        console.log("AI transcript:", message.transcript);
        break;

      case "user.speech_started":
        console.log("User started speaking");
        break;

      case "user.speech_stopped":
        console.log("User stopped speaking");
        break;

      case "user.transcript":
        setState(prev => ({ ...prev, userTranscript: message.transcript }));
        break;

      case "response.done":
        console.log("Response complete");
        break;

      case "error":
        console.error("Server error:", message.error);
        setState(prev => ({ ...prev, error: message.error }));
        break;

      case "session.disconnected":
        disconnect();
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  }, [disconnect]);

  // Play audio delta
  const playAudioDelta = async (base64Audio: string) => {
    try {
      // Decode base64 audio
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      // Decode audio
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      
      // Queue audio
      audioQueueRef.current.push(audioBuffer);
      
      // Start playback if not already playing
      if (!isPlayingRef.current) {
        playNextAudio();
      }

    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Play next audio in queue
  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const audioBuffer = audioQueueRef.current.shift()!;
    const source = audioContextRef.current!.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current!.destination);
    
    source.onended = () => {
      playNextAudio();
    };

    source.start();
    isPlayingRef.current = true;
  };

  // Cleanup
  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  // Auto-connect on mount if configured
  useEffect(() => {
    if (config.autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [config.autoConnect, connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendText,
    cancelResponse
  };
}
