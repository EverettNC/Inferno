/**
 * AWS Polly Voice Hook
 * Cost-effective voice synthesis using AWS Polly
 * Uses browser's Web Speech API for recognition (FREE)
 * + OpenAI text API for responses (cheap)
 * + AWS Polly for synthesis (AWS sponsored)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

interface PollyVoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
  transcript: string;
  aiResponse: string;
  isProcessing: boolean;
}

export function usePollyVoice() {
  const [state, setState] = useState<PollyVoiceState>({
    isListening: false,
    isSpeaking: false,
    error: null,
    transcript: "",
    aiResponse: "",
    isProcessing: false
  });

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setState(prev => ({ 
        ...prev, 
        error: "Speech recognition not supported in this browser"
      }));
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      setState(prev => ({ ...prev, transcript }));

      // If final result, send to AI
      if (event.results[0].isFinal) {
        setState(prev => ({ ...prev, isListening: false, isProcessing: true }));
        await handleAIResponse(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setState(prev => ({ 
        ...prev, 
        isListening: false,
        error: `Speech recognition error: ${event.error}`
      }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setState(prev => ({ ...prev, error: "Speech recognition not available" }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        isListening: true, 
        error: null, 
        transcript: "" 
      }));
      recognitionRef.current.start();
    } catch (error: any) {
      console.error("Error starting recognition:", error);
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: error.message 
      }));
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // Handle AI response
  const handleAIResponse = async (userMessage: string) => {
    try {
      // Get AI text response
      const response = await apiRequest("/api/ai/chat", {
        method: "POST",
        body: { message: userMessage }
      });

      const aiText = response.response;
      setState(prev => ({ ...prev, aiResponse: aiText }));

      // Synthesize speech using AWS Polly
      await speakText(aiText);

    } catch (error: any) {
      console.error("Error getting AI response:", error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to get AI response",
        isProcessing: false
      }));
    }
  };

  // Speak text using AWS Polly
  const speakText = async (text: string) => {
    try {
      setState(prev => ({ ...prev, isSpeaking: true, isProcessing: false }));

      // Get audio from AWS Polly
      const response = await fetch("/api/voice/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error("Failed to synthesize speech");
      }

      // Create audio from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setState(prev => ({ 
          ...prev, 
          isSpeaking: false,
          error: "Audio playback failed"
        }));
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();

    } catch (error: any) {
      console.error("Error speaking text:", error);
      setState(prev => ({ 
        ...prev, 
        isSpeaking: false,
        isProcessing: false,
        error: error.message || "Failed to speak"
      }));
    }
  };

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Check if voice is supported
  const isVoiceSupported = () => {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  };

  return {
    ...state,
    startListening,
    stopListening,
    stopSpeaking,
    speakText,
    isVoiceSupported
  };
}
