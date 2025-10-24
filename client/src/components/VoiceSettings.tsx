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


import React from 'react';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { ContinuousVoiceControl } from '@/components/ContinuousVoiceControl';

interface VoiceSettingsProps {
  className?: string;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ className }) => {
  const { synthesizer, speak, stopSpeaking, isSpeaking } = useVoiceContext();

  const availableVoices = [
    { id: "Joanna", name: "Joanna", gender: "Female" },
    { id: "Matthew", name: "Matthew", gender: "Male" }
  ];

  const currentVoice = synthesizer?.getPollyVoice() || "Joanna";

  const handleVoiceChange = (voiceId: "Joanna" | "Matthew") => {
    if (synthesizer) {
      // Stop any current speech first
      stopSpeaking();
      
      // Wait a moment then change voice
      setTimeout(() => {
        synthesizer.setPollyVoice(voiceId);
        // Test the new voice with a short message
        speak(`Voice changed to ${voiceId}.`);
      }, 500);
    }
  };

  const handleEmergencyStop = () => {
    stopSpeaking();
    if (synthesizer) {
      synthesizer.stop();
    }
  };

  return (
    <div className={`voice-settings ${className || ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Voice Selection
        </h3>
        {isSpeaking && (
          <button
            onClick={handleEmergencyStop}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
          >
            🛑 STOP
          </button>
        )}
      </div>
      <div className="space-y-2">
        {availableVoices.map((voice) => (
          <label
            key={voice.id}
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <input
              type="radio"
              name="voice"
              value={voice.id}
              checked={currentVoice === voice.id}
              onChange={() => handleVoiceChange(voice.id as "Joanna" | "Matthew")}
              disabled={isSpeaking}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {voice.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {voice.gender} voice • Test voice when selected
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* 🎵 Continuous Voice Flow Control */}
      <div className="mt-8">
        <ContinuousVoiceControl />
      </div>
    </div>
  );
};

export default VoiceSettings;