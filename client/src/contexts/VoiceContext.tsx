import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { SpeechRecognizer, isSpeechRecognitionSupported } from "@/lib/speechRecognition";
import { SpeechSynthesizer, isSpeechSynthesisSupported } from "@/lib/speechSynthesis";
import { useUserContext } from "@/contexts/UserContext";
import { 
  ContinuousVoiceFlow, 
  ConversationState, 
  VoiceFlowConfig, 
  VoiceFlowCallbacks,
  DEFAULT_VOICE_FLOW_CONFIG 
} from "@/lib/continuousVoiceFlow";

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
  synthesizer: SpeechSynthesizer | null;
  
  // 🎵 Continuous Voice Flow Features
  isContinuousMode: boolean;
  toggleContinuousMode: () => void;
  conversationState: ConversationState;
  voiceFlowConfig: VoiceFlowConfig;
  updateVoiceFlowConfig: (config: Partial<VoiceFlowConfig>) => void;
  startSinging: () => void; // Start continuous conversation flow
  stopSinging: () => void;  // Stop continuous conversation flow
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
  
  // 🎵 Continuous Voice Flow State
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>(ConversationState.IDLE);
  const [voiceFlowConfig, setVoiceFlowConfig] = useState<VoiceFlowConfig>(DEFAULT_VOICE_FLOW_CONFIG);
  const [voiceFlow, setVoiceFlow] = useState<ContinuousVoiceFlow | null>(null);
  
  const isSpeechSupported = isSpeechRecognitionSupported() && isSpeechSynthesisSupported();

  // Emergency stop function
  const emergencyStop = useCallback(() => {
    console.log("🚨 EMERGENCY STOP TRIGGERED");
    if (synthesizer) {
      synthesizer.stop();
    }
    if (voiceFlow) {
      voiceFlow.emergencyStop();
    }
    setIsSpeaking(false);
    setIsContinuousMode(false);
  }, [synthesizer, voiceFlow]);

  // 🎵 Continuous Voice Flow Callbacks
  const voiceFlowCallbacks: VoiceFlowCallbacks = {
    onUserSpeechStart: () => {
      console.log("🎤 Continuous flow: User started speaking");
    },
    onUserSpeechEnd: (transcript: string) => {
      console.log("🎤 Continuous flow: User ended speaking:", transcript);
      setLastTranscript(transcript);
      // Here we would normally send to AI chat system
    },
    onAIResponseStart: (text: string) => {
      console.log("🤖 Continuous flow: AI responding:", text);
      if (synthesizer) {
        synthesizer.speak(text);
      }
    },
    onAIResponseEnd: () => {
      console.log("✅ Continuous flow: AI response complete");
    },
    onConversationFlow: (state: ConversationState) => {
      setConversationState(state);
    },
    onEmergencyStop: () => {
      emergencyStop();
    }
  };

  // Global hotkey for emergency stop (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSpeaking) {
        emergencyStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emergencyStop, isSpeaking]);

  // Initialize speech components
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const speechRecognizer = new SpeechRecognizer();
      speechRecognizer.onResult((text) => {
        setLastTranscript(text);
        // If continuous mode is active, let voice flow handle it
        if (voiceFlow?.isFlowActive) {
          voiceFlow.onSpeechEnd(text);
        }
      });
      speechRecognizer.onStart(() => {
        setIsListening(true);
        // If continuous mode is active, let voice flow handle it
        if (voiceFlow?.isFlowActive) {
          voiceFlow.onSpeechStart();
        }
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
        // If continuous mode is active, let voice flow handle it
        if (voiceFlow?.isFlowActive) {
          voiceFlow.onAIResponseComplete();
        }
      });
      setSynthesizer(speechSynthesizer);
    }
    
    // Set initial voice mode from user preferences if available
    if (user?.voiceModeEnabled) {
      setIsVoiceModeEnabled(user.voiceModeEnabled);
    }
    
    // Set initial continuous mode from localStorage
    const savedContinuousMode = localStorage.getItem('continuousVoiceMode');
    if (savedContinuousMode) {
      setIsContinuousMode(savedContinuousMode === 'true');
    }
  }, [user, voiceFlow]);

  // Initialize continuous voice flow when synthesizer is ready
  useEffect(() => {
    if (synthesizer && !voiceFlow) {
      const flow = new ContinuousVoiceFlow(voiceFlowConfig, voiceFlowCallbacks);
      setVoiceFlow(flow);
      console.log("🎵 Continuous Voice Flow initialized!");
    }
  }, [synthesizer, voiceFlow, voiceFlowConfig, voiceFlowCallbacks]);

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
    console.log("🛑 Stop speaking called from context");
    if (synthesizer) {
      synthesizer.stop();
    }
    setIsSpeaking(false);
    emergencyStop();
  };

  // 🎵 Continuous Voice Flow Methods
  const toggleContinuousMode = () => {
    const newMode = !isContinuousMode;
    setIsContinuousMode(newMode);
    
    if (newMode) {
      console.log("🎵 Starting continuous voice mode - let the world sing!");
      startSinging();
    } else {
      console.log("🛑 Stopping continuous voice mode");
      stopSinging();
    }
    
    // Save preference to user profile (for now, store in localStorage)
    if (user) {
      localStorage.setItem('continuousVoiceMode', newMode.toString());
    }
  };

  const startSinging = () => {
    if (voiceFlow && isVoiceModeEnabled) {
      voiceFlow.startFlow();
      if (recognizer) {
        recognizer.start();
      }
      console.log("🎵 THE WORLD IS SINGING! Continuous conversation started!");
    }
  };

  const stopSinging = () => {
    if (voiceFlow) {
      voiceFlow.stopFlow();
    }
    if (recognizer && isListening) {
      recognizer.stop();
    }
    setConversationState(ConversationState.IDLE);
    console.log("🛑 Continuous singing stopped");
  };

  const updateVoiceFlowConfig = (config: Partial<VoiceFlowConfig>) => {
    const newConfig = { ...voiceFlowConfig, ...config };
    setVoiceFlowConfig(newConfig);
    if (voiceFlow) {
      voiceFlow.updateConfig(config);
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
        lastTranscript,
        synthesizer,
        // 🎵 Continuous Voice Flow
        isContinuousMode,
        toggleContinuousMode,
        conversationState,
        voiceFlowConfig,
        updateVoiceFlowConfig,
        startSinging,
        stopSinging
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
