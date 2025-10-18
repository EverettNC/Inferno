/**
 * Voice Mode Page
 * Dedicated page for real-time voice conversation
 */

import { useEffect } from "react";
import { RealtimeVoiceChat } from "@/components/RealtimeVoiceChat";
import { Volume2, Shield, Brain, Heart } from "lucide-react";

export function VoiceModePage() {
  useEffect(() => {
    document.title = "Voice Mode | Inferno AI";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060608] via-[#0a0a0c] to-[#060608] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Volume2 className="w-12 h-12 text-[#00A7FF]" />
            <h1 className="text-5xl font-bold text-white">
              Voice Mode
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real-time speech-to-speech conversation with clinical-grade trauma-informed AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-black/40 border border-[#00A7FF]/20 space-y-3">
            <Brain className="w-8 h-8 text-[#00A7FF]" />
            <h3 className="text-white font-semibold">Clinical Intelligence</h3>
            <p className="text-gray-400 text-sm">
              Masters-level trauma expertise with evidence-based therapeutic protocols
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/40 border border-[#FF6A2E]/20 space-y-3">
            <Shield className="w-8 h-8 text-[#FF6A2E]" />
            <h3 className="text-white font-semibold">Trauma-Informed</h3>
            <p className="text-gray-400 text-sm">
              SAMHSA principles integrated with automatic crisis detection
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/40 border border-[#00A7FF]/20 space-y-3">
            <Heart className="w-8 h-8 text-[#00A7FF]" />
            <h3 className="text-white font-semibold">Real-Time Support</h3>
            <p className="text-gray-400 text-sm">
              Immediate, empathetic responses with natural voice interaction
            </p>
          </div>
        </div>

        {/* Voice Chat Component */}
        <RealtimeVoiceChat />

        {/* Privacy Notice */}
        <div className="mt-8 p-4 rounded-lg bg-black/40 border border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">
            🔒 Your voice conversations are processed in real-time and are not stored. 
            All interactions are private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
