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
