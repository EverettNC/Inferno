/**
 * Realtime Voice Chat Component
 * Speech-to-speech conversation using OpenAI Realtime API
 */

import { useState } from "react";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";

export function RealtimeVoiceChat() {
  const {
    isConnected,
    isRecording,
    isSpeaking,
    error,
    transcript,
    userTranscript,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    cancelResponse
  } = useRealtimeVoice();

  const [showTranscripts, setShowTranscripts] = useState(true);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#060608] to-[#0a0a0c] border-[#00A7FF]/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-[#00A7FF]" />
          Voice Conversation
        </CardTitle>
        <CardDescription className="text-gray-400">
          Real-time speech-to-speech conversation with clinical-grade AI support
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-[#00A7FF]/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <Button
            onClick={isConnected ? disconnect : connect}
            variant="outline"
            size="sm"
            className={`${
              isConnected 
                ? 'border-red-500/50 hover:bg-red-500/10 text-red-400' 
                : 'border-[#00A7FF]/50 hover:bg-[#00A7FF]/10 text-[#00A7FF]'
            }`}
            data-testid="button-voice-connection"
          >
            {isConnected ? (
              <>
                <PhoneOff className="w-4 h-4 mr-2" />
                Disconnect
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Voice Controls */}
        {isConnected && (
          <div className="space-y-4">
            {/* Recording Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={!isConnected}
                className={`relative w-32 h-32 rounded-full transition-all duration-300 ${
                  isRecording
                    ? 'bg-gradient-to-br from-[#FF6A2E] to-[#ff8c5e] shadow-lg shadow-[#FF6A2E]/50 scale-110'
                    : 'bg-gradient-to-br from-[#00A7FF] to-[#0088cc] shadow-lg shadow-[#00A7FF]/30 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                data-testid="button-voice-record"
              >
                {isRecording ? (
                  <MicOff className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                ) : (
                  <Mic className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
                
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                )}
              </button>

              <p className="text-gray-400 text-sm text-center">
                {isRecording 
                  ? 'Release to send' 
                  : 'Hold to speak'}
              </p>
            </div>

            {/* AI Speaking Indicator */}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-[#00A7FF]/10 border border-[#00A7FF]/30">
                <div className="flex gap-1">
                  <div className="w-2 h-8 bg-[#00A7FF] rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-8 bg-[#00A7FF] rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-8 bg-[#00A7FF] rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[#00A7FF] font-medium">AI is speaking...</span>
                <Button
                  onClick={cancelResponse}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-[#FF6A2E] hover:bg-[#FF6A2E]/10"
                  data-testid="button-cancel-response"
                >
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}

            {/* Transcripts */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowTranscripts(!showTranscripts)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                data-testid="button-toggle-transcripts"
              >
                {showTranscripts ? 'Hide' : 'Show'} Transcripts
              </Button>

              {showTranscripts && (
                <div className="space-y-3">
                  {/* User Transcript */}
                  {userTranscript && (
                    <div className="p-4 rounded-lg bg-black/40 border border-[#00A7FF]/20">
                      <p className="text-xs text-gray-500 mb-2">You said:</p>
                      <p className="text-white" data-testid="text-user-transcript">{userTranscript}</p>
                    </div>
                  )}

                  {/* AI Transcript */}
                  {transcript && (
                    <div className="p-4 rounded-lg bg-black/40 border border-[#FF6A2E]/20">
                      <p className="text-xs text-gray-500 mb-2">AI response:</p>
                      <p className="text-white" data-testid="text-ai-transcript">{transcript}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isConnected && (
          <div className="p-6 rounded-lg bg-black/40 border border-[#00A7FF]/10 space-y-3">
            <h3 className="text-white font-semibold">How to use Voice Conversation:</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">1.</span>
                <span>Click "Connect" to establish a voice session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">2.</span>
                <span>Hold the microphone button and speak naturally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">3.</span>
                <span>Release the button when finished speaking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A7FF] mt-1">4.</span>
                <span>The AI will respond with spoken and text guidance</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              This feature uses clinical-grade trauma-informed AI with real-time voice interaction.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
