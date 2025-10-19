/**
 * AWS Polly Voice Hook
 * Cost-effective voice synthesis using AWS Polly
 * Uses browser's Web Speech API for recognition (FREE)
 * + OpenAI text API for responses (cheap)
 * + AWS Polly for synthesis (AWS sponsored, falls back to browser)
 */

import { useState, useEffect, useRef, useCallback } from "react";

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
      // Get AI text response using fetch
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const aiText = data.response;
      setState(prev => ({ ...prev, aiResponse: aiText }));

      // Synthesize speech
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

  // Speak text using browser speech synthesis (reliable fallback)
  const speakWithBrowser = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error("Browser speech synthesis not available"));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Get a natural-sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English Female'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        console.log("Browser speech synthesis completed");
        resolve();
      };

      utterance.onerror = (event) => {
        console.error("Browser speech synthesis error:", event);
        reject(new Error("Speech synthesis failed"));
      };

      console.log("Speaking with browser synthesis...");
      window.speechSynthesis.speak(utterance);
    });
  };

  // Speak text using AWS Polly (falls back to browser speech if unavailable)
  const speakText = async (text: string) => {
    setState(prev => ({ ...prev, isSpeaking: true, isProcessing: false }));

    try {
      // Try AWS Polly first
      console.log("Attempting AWS Polly synthesis...");
      const response = await fetch("/api/voice/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        console.log("AWS Polly synthesis successful");
        // AWS Polly available - use it
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

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
          URL.revokeObjectURL(audioUrl);
          // Fallback to browser speech
          speakWithBrowser(text).then(() => {
            setState(prev => ({ ...prev, isSpeaking: false }));
          }).catch((err) => {
            console.error("Browser speech fallback failed:", err);
            setState(prev => ({ ...prev, isSpeaking: false, error: "Voice playback failed" }));
          });
        };

        await audio.play();
      } else {
        // AWS Polly not available - use browser speech synthesis
        console.log("AWS Polly unavailable (status:", response.status, "), using browser speech");
        await speakWithBrowser(text);
        setState(prev => ({ ...prev, isSpeaking: false }));
      }

    } catch (error: any) {
      console.error("Error in speakText:", error);
      // Final fallback to browser speech
      try {
        console.log("Final fallback to browser speech");
        await speakWithBrowser(text);
        setState(prev => ({ ...prev, isSpeaking: false }));
      } catch (browserError: any) {
        console.error("All speech methods failed:", browserError);
        setState(prev => ({
          ...prev,
          isSpeaking: false,
          error: "Voice synthesis unavailable"
        }));
      }
    }
  };

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
