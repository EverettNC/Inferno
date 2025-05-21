import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { SpeechRecognizer, isSpeechRecognitionSupported } from "@/lib/speechRecognition";
import { SpeechSynthesizer, isSpeechSynthesisSupported } from "@/lib/speechSynthesis";
import { useUserContext } from "@/contexts/UserContext";

interface VoiceContextType {
  isVoiceModeEnabled: boolean;
  toggleVoiceMode: () => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isSpeechSupported: boolean;
  lastTranscript: string;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizer, setRecognizer] = useState<SpeechRecognizer | null>(null);
  const [synthesizer, setSynthesizer] = useState<SpeechSynthesizer | null>(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const { user, updateUser } = useUserContext();
  
  const isSpeechSupported = isSpeechRecognitionSupported() && isSpeechSynthesisSupported();

  // Initialize speech components
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const speechRecognizer = new SpeechRecognizer();
      speechRecognizer.onResult((text) => {
        setLastTranscript(text);
      });
      speechRecognizer.onStart(() => {
        setIsListening(true);
      });
      speechRecognizer.onEnd(() => {
        setIsListening(false);
      });
      setRecognizer(speechRecognizer);
    }
    
    if (isSpeechSynthesisSupported()) {
      const speechSynthesizer = new SpeechSynthesizer();
      speechSynthesizer.onStart(() => {
        setIsSpeaking(true);
      });
      speechSynthesizer.onEnd(() => {
        setIsSpeaking(false);
      });
      setSynthesizer(speechSynthesizer);
    }
    
    // Set initial voice mode from user preferences if available
    if (user?.voiceModeEnabled) {
      setIsVoiceModeEnabled(user.voiceModeEnabled);
    }
  }, [user]);

  const toggleVoiceMode = () => {
    const newMode = !isVoiceModeEnabled;
    setIsVoiceModeEnabled(newMode);
    
    // Save preference to user profile if logged in
    if (user) {
      updateUser({ voiceModeEnabled: newMode }).catch(console.error);
    }
    
    // Stop listening if turning off voice mode
    if (!newMode && isListening && recognizer) {
      recognizer.stop();
    }
  };

  const startListening = () => {
    if (recognizer && isVoiceModeEnabled) {
      recognizer.start();
    }
  };

  const stopListening = () => {
    if (recognizer) {
      recognizer.stop();
    }
  };

  const speak = (text: string) => {
    if (synthesizer && isVoiceModeEnabled) {
      synthesizer.speak(text);
    }
  };

  const stopSpeaking = () => {
    if (synthesizer) {
      synthesizer.stop();
    }
  };

  return (
    <VoiceContext.Provider 
      value={{ 
        isVoiceModeEnabled, 
        toggleVoiceMode,
        isListening,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        isSpeaking,
        isSpeechSupported,
        lastTranscript
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
}
