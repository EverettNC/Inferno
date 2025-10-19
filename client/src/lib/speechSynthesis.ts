// Function to check if browser supports the Web Speech API Synthesis
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window || true; // Always return true since we have server-side fallback
}

// Speech synthesis class with server-side fallback
export class SpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private rate = 1;
  private pitch = 1;
  private volume = 1;
  private isSpeaking = false;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private selectedVoice: "Joanna" | "Matthew" = "Joanna"; // Default voice
  private lastSpeakTime = 0;
  private debounceMs = 1000; // Prevent rapid-fire requests

  constructor() {
    if (isSpeechSynthesisSupported()) {
      this.synth = window.speechSynthesis;
      // Try to set a default voice (preferably a female voice which is often preferred for assistants)
      this.setDefaultVoice();
    }
  }

  private setDefaultVoice(): void {
    if (!this.synth) return;

    // Wait for voices to be loaded
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        this.selectDefaultVoice();
      });
    } else {
      this.selectDefaultVoice();
    }
  }

  private selectDefaultVoice(): void {
    if (!this.synth) return;
    
    const voices = this.synth.getVoices();
    
    // First try to find a female US English voice
    let defaultVoice = voices.find(
      voice => voice.lang === 'en-US' && voice.name.includes('Female')
    );
    
    // If not found, try any US English voice
    if (!defaultVoice) {
      defaultVoice = voices.find(voice => voice.lang === 'en-US');
    }
    
    // Fallback to the first available voice
    if (!defaultVoice && voices.length > 0) {
      defaultVoice = voices[0];
    }
    
    this.voice = defaultVoice || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.voice = voice;
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.1, Math.min(10, rate));
  }

  public setPitch(pitch: number): void {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public speak(text: string): boolean {
    // Emergency stop if already speaking
    if (this.isSpeaking) {
      console.log("Already speaking, stopping current speech first");
      this.stop();
      return false;
    }

    // Debounce rapid requests
    const now = Date.now();
    if (now - this.lastSpeakTime < this.debounceMs) {
      console.log("Speech request debounced - too soon after last request");
      return false;
    }
    this.lastSpeakTime = now;

    // Try server-side synthesis first (AWS Polly), then fallback to browser
    this.speakWithServer(text).catch(() => {
      // Fallback to browser synthesis
      this.speakWithBrowser(text);
    });
    return true;
  }

  private async speakWithServer(text: string): Promise<void> {
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          voice: this.selectedVoice, // Use selected voice
          engine: 'standard'
        }),
      });

      if (!response.ok) {
        throw new Error('Server synthesis failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.currentAudio = new Audio(audioUrl);
      
      this.currentAudio.onplay = () => {
        this.isSpeaking = true;
        if (this.onStartCallback) this.onStartCallback();
      };
      
      this.currentAudio.onended = () => {
        this.isSpeaking = false;
        if (this.onEndCallback) this.onEndCallback();
        URL.revokeObjectURL(audioUrl);
      };
      
      this.currentAudio.onerror = () => {
        this.isSpeaking = false;
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error('Audio playback failed'));
        }
      };
      
      this.currentAudio.volume = this.volume;
      await this.currentAudio.play();
      
    } catch (error) {
      throw new Error(`Server synthesis failed: ${error}`);
    }
  }

  private speakWithBrowser(text: string): boolean {
    if (!this.synth) {
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error("Speech synthesis not supported"));
      }
      return false;
    }

    // Cancel any current speech
    this.synth.cancel();
    
    // Stop any server audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
    
    utterance.onerror = (event) => {
      this.isSpeaking = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error(`Speech synthesis error: ${event.error}`));
      }
    };
    
    this.synth.speak(utterance);
    return true;
  }

  public stop(): void {
    console.log("🛑 STOPPING ALL SPEECH");
    
    // Stop browser synthesis
    if (this.synth) {
      this.synth.cancel();
    }
    
    // Stop server audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    this.isSpeaking = false;
    
    // Call end callback
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  public pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  public resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
    if (this.currentAudio) {
      this.currentAudio.play();
    }
  }

  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }

  public setPollyVoice(voice: "Joanna" | "Matthew"): void {
    this.selectedVoice = voice;
  }

  public getPollyVoice(): "Joanna" | "Matthew" {
    return this.selectedVoice;
  }

  public getAvailablePollyVoices(): Array<{id: string, name: string, gender: string}> {
    return [
      { id: "Joanna", name: "Joanna", gender: "Female" },
      { id: "Matthew", name: "Matthew", gender: "Male" }
    ];
  }

  public onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  public onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }
}
