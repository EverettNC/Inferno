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
 * AWS Polly Voice Chat Component
 * Cost-effective voice conversation using AWS-sponsored Polly
 * Browser Speech Recognition (FREE) + OpenAI Text API (cheap) + AWS Polly (sponsored)
 */

import { usePollyVoice } from "@/hooks/usePollyVoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";

export function PollyVoiceChat() {
  const {
    isListening,
    isSpeaking,
    isProcessing,
    error,
    transcript,
    aiResponse,
    startListening,
    stopListening,
    stopSpeaking,
    isVoiceSupported
  } = usePollyVoice();

  if (!isVoiceSupported()) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#060608] to-[#0a0a0c] border-[#FF6A2E]/20">
        <CardContent className="p-8 text-center space-y-4">
          <VolumeX className="w-16 h-16 text-gray-500 mx-auto" />
          <h3 className="text-xl text-white font-semibold">Speech Recognition Not Supported</h3>
          <p className="text-gray-400">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for voice features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#060608] to-[#0a0a0c] border-[#00A7FF]/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-[#00A7FF]" />
          Voice Conversation
          <span className="ml-auto text-xs font-normal px-3 py-1 rounded-full bg-[#00A7FF]/10 border border-[#00A7FF]/30 text-[#00A7FF]">
            Browser Powered (Free)
          </span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Speak naturally - your voice is transcribed, analyzed by clinical AI, and responded to with natural speech
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400" data-testid="text-error-message">
            {error}
          </div>
        )}

        {/* Voice Controls */}
        <div className="space-y-6">
          {/* Microphone Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isProcessing}
              className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-gradient-to-br from-[#FF6A2E] to-[#ff8c5e] shadow-lg shadow-[#FF6A2E]/50 scale-110'
                  : 'bg-gradient-to-br from-[#00A7FF] to-[#0088cc] shadow-lg shadow-[#00A7FF]/30 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              data-testid="button-voice-toggle"
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <Mic className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              )}
            </button>

            <div className="text-center space-y-1">
              <p className="text-white font-medium">
                {isListening 
                  ? 'Listening...' 
                  : isProcessing 
                    ? 'Processing...' 
                    : isSpeaking 
                      ? 'AI Speaking...' 
                      : 'Tap to speak'}
              </p>
              <p className="text-gray-500 text-sm">
                {isListening && 'Speak naturally, then stop to submit'}
              </p>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-[#00A7FF]/10 border border-[#00A7FF]/30">
              <Sparkles className="w-5 h-5 text-[#00A7FF] animate-pulse" />
              <span className="text-[#00A7FF] font-medium">Analyzing your message...</span>
            </div>
          )}

          {/* AI Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-[#FF6A2E]/10 border border-[#FF6A2E]/30">
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-[#FF6A2E] rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-8 bg-[#FF6A2E] rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-8 bg-[#FF6A2E] rounded animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[#FF6A2E] font-medium">AI is speaking...</span>
              <Button
                onClick={stopSpeaking}
                variant="ghost"
                size="sm"
                className="ml-auto text-[#FF6A2E] hover:bg-[#FF6A2E]/10"
                data-testid="button-stop-speaking"
              >
                <VolumeX className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          )}

          {/* Transcripts */}
          {(transcript || aiResponse) && (
            <div className="space-y-3">
              {/* User Transcript */}
              {transcript && (
                <div className="p-4 rounded-lg bg-black/40 border border-[#00A7FF]/20">
                  <p className="text-xs text-gray-500 mb-2">You said:</p>
                  <p className="text-white" data-testid="text-user-transcript">{transcript}</p>
                </div>
              )}

              {/* AI Response */}
              {aiResponse && (
                <div className="p-4 rounded-lg bg-black/40 border border-[#FF6A2E]/20">
                  <p className="text-xs text-gray-500 mb-2">AI response:</p>
                  <p className="text-white" data-testid="text-ai-response">{aiResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!transcript && !aiResponse && !isListening && (
          <div className="p-6 rounded-lg bg-black/40 border border-[#00A7FF]/10 space-y-3">
            <h3 className="text-white font-semibold">How to use Voice Conversation:</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">1.</span>
                <span>Tap the microphone button to start listening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">2.</span>
                <span>Speak naturally about what you're feeling or experiencing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">3.</span>
                <span>Tap again to stop listening and send your message</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">4.</span>
                <span>The AI will analyze your words and respond with supportive guidance</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <p className="text-xs text-gray-500">
                <strong className="text-green-400">💡 Cost-effective:</strong> This uses browser speech recognition (free), 
                OpenAI text API (cheap), and AWS Polly voice synthesis (AWS sponsored).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
