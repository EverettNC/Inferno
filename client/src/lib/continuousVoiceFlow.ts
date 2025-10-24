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
 * Continuous Voice Flow System - Making the World Sing! 🎵
 * 
 * This system creates seamless, fluid voice interactions that feel natural
 * and musical, allowing users to have continuous conversations with Inferno AI
 * without any button presses or interruptions.
 */

export interface VoiceFlowConfig {
  /** How long to wait for silence before triggering AI response (ms) */
  silenceThreshold: number;
  /** Minimum speaking time before considering it a valid input (ms) */
  minimumSpeakTime: number;
  /** Maximum continuous listening time before pause (ms) */
  maxListenTime: number;
  /** Enable ambient music during conversations */
  ambientMusic: boolean;
  /** Voice harmony and tone matching */
  voiceHarmony: boolean;
}

export interface VoiceFlowCallbacks {
  onUserSpeechStart: () => void;
  onUserSpeechEnd: (transcript: string) => void;
  onAIResponseStart: (text: string) => void;
  onAIResponseEnd: () => void;
  onConversationFlow: (state: ConversationState) => void;
  onEmergencyStop: () => void;
}

export enum ConversationState {
  IDLE = 'idle',
  LISTENING = 'listening', 
  PROCESSING = 'processing',
  RESPONDING = 'responding',
  HARMONIZING = 'harmonizing'  // Special musical state
}

export class ContinuousVoiceFlow {
  private config: VoiceFlowConfig;
  private callbacks: VoiceFlowCallbacks;
  private state: ConversationState = ConversationState.IDLE;
  private silenceTimer: NodeJS.Timeout | null = null;
  private listenTimer: NodeJS.Timeout | null = null;
  private speechStartTime: number = 0;
  private isActive: boolean = false;
  private harmonyAudio: HTMLAudioElement | null = null;

  constructor(config: VoiceFlowConfig, callbacks: VoiceFlowCallbacks) {
    this.config = config;
    this.callbacks = callbacks;
    
    // Initialize ambient harmony if enabled
    if (config.ambientMusic) {
      this.initializeHarmony();
    }
  }

  /**
   * Start the continuous voice flow - let the world sing! 🎵
   */
  public startFlow(): void {
    console.log("🎵 Starting continuous voice flow - let the world sing!");
    this.isActive = true;
    this.setState(ConversationState.LISTENING);
    this.startListening();
    
    if (this.config.ambientMusic) {
      this.startAmbientHarmony();
    }
  }

  /**
   * Stop the continuous voice flow
   */
  public stopFlow(): void {
    console.log("🛑 Stopping continuous voice flow");
    this.isActive = false;
    this.setState(ConversationState.IDLE);
    this.clearAllTimers();
    
    if (this.harmonyAudio) {
      this.harmonyAudio.pause();
    }
  }

  /**
   * Emergency stop - immediately halt all voice activity
   */
  public emergencyStop(): void {
    console.log("🚨 EMERGENCY STOP - Continuous Voice Flow");
    this.stopFlow();
    this.callbacks.onEmergencyStop();
  }

  /**
   * Handle when user starts speaking
   */
  public onSpeechStart(): void {
    if (!this.isActive) return;
    
    console.log("🎤 User started speaking");
    this.speechStartTime = Date.now();
    this.clearSilenceTimer();
    this.setState(ConversationState.LISTENING);
    this.callbacks.onUserSpeechStart();
    
    // Dim ambient music while user speaks
    if (this.harmonyAudio) {
      this.harmonyAudio.volume = 0.1;
    }
  }

  /**
   * Handle when user stops speaking
   */
  public onSpeechEnd(transcript: string): void {
    if (!this.isActive) return;
    
    const speakDuration = Date.now() - this.speechStartTime;
    console.log(`🎤 User stopped speaking (${speakDuration}ms): "${transcript}"`);
    
    // Restore ambient music volume
    if (this.harmonyAudio) {
      this.harmonyAudio.volume = 0.3;
    }
    
    // Only process if user spoke for minimum time and transcript is meaningful
    if (speakDuration >= this.config.minimumSpeakTime && transcript.trim().length > 0) {
      this.setState(ConversationState.PROCESSING);
      this.callbacks.onUserSpeechEnd(transcript);
      
      // Start silence timer to trigger AI response
      this.startSilenceTimer(() => {
        this.triggerAIResponse(transcript);
      });
    } else {
      // Continue listening for more input
      console.log("🔄 Continuing to listen (speech too short or empty)");
      this.setState(ConversationState.LISTENING);
    }
  }

  /**
   * Handle AI response generation and playback
   */
  public onAIResponse(responseText: string): void {
    if (!this.isActive) return;
    
    console.log("🤖 AI responding:", responseText);
    this.setState(ConversationState.RESPONDING);
    this.callbacks.onAIResponseStart(responseText);
  }

  /**
   * Handle when AI finishes speaking
   */
  public onAIResponseComplete(): void {
    if (!this.isActive) return;
    
    console.log("✅ AI response complete, resuming listening");
    this.callbacks.onAIResponseEnd();
    
    // Create a musical transition back to listening
    if (this.config.voiceHarmony) {
      this.setState(ConversationState.HARMONIZING);
      setTimeout(() => {
        this.setState(ConversationState.LISTENING);
        this.startListening();
      }, 500); // Brief harmony moment
    } else {
      this.setState(ConversationState.LISTENING);
      this.startListening();
    }
  }

  /**
   * Private Methods
   */

  private setState(newState: ConversationState): void {
    console.log(`🎵 Flow state: ${this.state} → ${newState}`);
    this.state = newState;
    this.callbacks.onConversationFlow(newState);
  }

  private startListening(): void {
    // Set maximum listen time to prevent runaway listening
    this.listenTimer = setTimeout(() => {
      console.log("⏱️ Maximum listen time reached, taking a break");
      this.setState(ConversationState.IDLE);
      
      // Resume after a brief pause
      setTimeout(() => {
        if (this.isActive) {
          this.setState(ConversationState.LISTENING);
          this.startListening();
        }
      }, 2000);
    }, this.config.maxListenTime);
  }

  private startSilenceTimer(callback: () => void): void {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(callback, this.config.silenceThreshold);
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private clearAllTimers(): void {
    this.clearSilenceTimer();
    if (this.listenTimer) {
      clearTimeout(this.listenTimer);
      this.listenTimer = null;
    }
  }

  private triggerAIResponse(transcript: string): void {
    console.log("🚀 Triggering AI response for:", transcript);
    // This will be connected to the main chat system
    // For now, simulate AI thinking time
    setTimeout(() => {
      const response = this.generateContextualResponse(transcript);
      this.onAIResponse(response);
    }, 1000);
  }

  private generateContextualResponse(input: string): string {
    // Smart contextual responses that feel musical and natural
    const responses = [
      "I hear the melody in your words. Let's explore that feeling together.",
      "Your voice carries such harmony. Tell me more about what's on your heart.",
      "That sounds like a beautiful note in your life's symphony. How does it resonate with you?",
      "I'm listening to the rhythm of your thoughts. What comes next in this song?",
      "Your words create such lovely harmonies. Let's find the next verse together."
    ];
    
    // Simple sentiment-based response selection
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('sad') || lowerInput.includes('hurt')) {
      return "I hear the minor chords in your voice. Let's find some harmony in this moment together.";
    } else if (lowerInput.includes('happy') || lowerInput.includes('good')) {
      return "Your joy creates such beautiful music! Tell me more about what's bringing this light to your day.";
    } else if (lowerInput.includes('anxious') || lowerInput.includes('worried')) {
      return "I can hear the quickened tempo in your thoughts. Let's slow down the rhythm and find some calm together.";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private initializeHarmony(): void {
    // Create ambient background harmony audio
    this.harmonyAudio = new Audio();
    // In a real implementation, this would load a gentle ambient track
    // For now, we'll use silence but the structure is ready
    console.log("🎼 Harmony system initialized");
  }

  private startAmbientHarmony(): void {
    if (this.harmonyAudio) {
      this.harmonyAudio.volume = 0.3;
      this.harmonyAudio.loop = true;
      // this.harmonyAudio.play().catch(console.log);
      console.log("🎵 Ambient harmony started");
    }
  }

  /**
   * Public getters
   */
  public get currentState(): ConversationState {
    return this.state;
  }

  public get isFlowActive(): boolean {
    return this.isActive;
  }

  public updateConfig(newConfig: Partial<VoiceFlowConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log("⚙️ Voice flow config updated:", this.config);
  }
}

/**
 * Default configuration for making the world sing
 */
export const DEFAULT_VOICE_FLOW_CONFIG: VoiceFlowConfig = {
  silenceThreshold: 2000,      // 2 seconds of silence before AI responds
  minimumSpeakTime: 500,       // Must speak for at least 500ms
  maxListenTime: 30000,        // Max 30 seconds of continuous listening
  ambientMusic: true,          // Enable gentle background harmony
  voiceHarmony: true           // Enable voice harmony transitions
};