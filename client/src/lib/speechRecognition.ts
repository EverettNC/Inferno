// Function to check if browser supports the Web Speech API
export function isSpeechRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Speech recognition class
export class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (isSpeechRecognitionSupported()) {
      // Initialize the SpeechRecognition object
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // Default to English
      
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        
        if (result.isFinal && this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      };
      
      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(`Speech recognition error: ${event.error}`));
        }
      };
      
      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStartCallback) {
          this.onStartCallback();
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };
    }
  }

  public setLanguage(languageCode: string): void {
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }

  public start(): boolean {
    if (!this.recognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error("Speech recognition not supported"));
      }
      return false;
    }
    
    if (!this.isListening) {
      try {
        this.recognition.start();
        return true;
      } catch (error) {
        if (this.onErrorCallback) {
          this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
        }
        return false;
      }
    }
    
    return true; // Already listening
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public onResult(callback: (text: string) => void): void {
    this.onResultCallback = callback;
  }

  public onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  public onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }
}
