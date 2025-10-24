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


import { useState, useEffect } from 'react';
import { useVoiceContext } from '@/contexts/VoiceContext';

interface UseVoiceModeProps {
  onTranscript?: (text: string) => void;
  autoStart?: boolean;
}

export default function useVoiceMode({ onTranscript, autoStart = false }: UseVoiceModeProps = {}) {
  const { 
    isVoiceModeEnabled, 
    isListening, 
    startListening, 
    stopListening, 
    lastTranscript 
  } = useVoiceContext();

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (autoStart && isVoiceModeEnabled && !isListening) {
      startListening();
      setIsRecording(true);
    }
  }, [isVoiceModeEnabled, autoStart, isListening, startListening]);

  useEffect(() => {
    if (onTranscript && lastTranscript) {
      onTranscript(lastTranscript);
    }
  }, [lastTranscript, onTranscript]);

  const handleStartRecording = () => {
    if (isVoiceModeEnabled && !isListening) {
      startListening();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (isVoiceModeEnabled && isListening) {
      stopListening();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    isVoiceModeEnabled,
    lastTranscript,
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
  };
}
