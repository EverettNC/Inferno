// Function to check if browser supports the Web Speech API Synthesis
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

// Speech synthesis class
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
    
    this.voice = defaultVoice;
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
    if (!this.synth) {
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error("Speech synthesis not supported"));
      }
      return false;
    }

    // Cancel any current speech
    this.synth.cancel();

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
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public isSpeakingNow(): boolean {
    return this.isSpeaking;
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
