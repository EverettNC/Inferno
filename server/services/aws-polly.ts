/**
 * AWS Polly Text-to-Speech Service
 * High-quality voice synthesis fallback for Inferno AI
 * 
 * OPTIONAL: Requires @aws-sdk/client-polly to be installed
 * Install with: npm install @aws-sdk/client-polly
 */

interface PollyConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

interface SynthesisOptions {
  text: string;
  voice?: string;
  engine?: "standard" | "neural";
  languageCode?: string;
  outputFormat?: "mp3" | "ogg_vorbis" | "pcm";
  sampleRate?: string;
}

// Lazy-load Polly client only when needed
let PollyClient: any;
let SynthesizeSpeechCommand: any;
let DescribeVoicesCommand: any;

async function loadPollySDK() {
  if (PollyClient) return; // Already loaded
  
  try {
    const sdk = await import("@aws-sdk/client-polly");
    PollyClient = sdk.PollyClient;
    SynthesizeSpeechCommand = sdk.SynthesizeSpeechCommand;
    DescribeVoicesCommand = sdk.DescribeVoicesCommand;
  } catch (error) {
    throw new Error(
      "AWS Polly SDK not installed. Install with: npm install @aws-sdk/client-polly --legacy-peer-deps"
    );
  }
}

export class PollyVoiceService {
  private client: any;
  private defaultVoice: string = "Joanna"; // Warm, empathetic female voice
  private defaultEngine: "standard" | "neural" = "neural"; // Neural voices sound more natural

  constructor(config?: PollyConfig) {
    const region = config?.region || process.env.AWS_REGION || "us-east-1";
    const accessKeyId = config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    // Client will be initialized when needed
    this.client = null;
  }

  private async ensureClient(config?: PollyConfig) {
    if (this.client) return;
    
    await loadPollySDK();
    
    const region = config?.region || process.env.AWS_REGION || "us-east-1";
    const accessKeyId = config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

    this.client = new PollyClient({
      region,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!
      }
    });
  }

  /**
   * Synthesize speech from text
   * Returns audio data as Buffer
   */
  async synthesizeSpeech(options: SynthesisOptions): Promise<Buffer> {
    try {
      await this.ensureClient();
      
      const command = new SynthesizeSpeechCommand({
        Text: options.text,
        VoiceId: options.voice || this.defaultVoice,
        Engine: options.engine || this.defaultEngine,
        LanguageCode: options.languageCode || "en-US",
        OutputFormat: options.outputFormat || "mp3",
        SampleRate: options.sampleRate || "24000"
      });

      const response = await this.client.send(command);
      
      if (!response.AudioStream) {
        throw new Error("No audio stream returned from Polly");
      }

      // Convert ReadableStream to Buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.AudioStream as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error: any) {
      console.error("AWS Polly synthesis error:", error);
      throw new Error(`Failed to synthesize speech: ${error.message}`);
    }
  }

  /**
   * Synthesize speech with SSML for advanced control
   * SSML allows prosody, emphasis, pauses, etc.
   */
  async synthesizeSSML(ssml: string, options?: Partial<SynthesisOptions>): Promise<Buffer> {
    try {
      await this.ensureClient();
      
      const command = new SynthesizeSpeechCommand({
        Text: ssml,
        TextType: "ssml",
        VoiceId: options?.voice || this.defaultVoice,
        Engine: options?.engine || this.defaultEngine,
        LanguageCode: options?.languageCode || "en-US",
        OutputFormat: options?.outputFormat || "mp3",
        SampleRate: options?.sampleRate || "24000"
      });

      const response = await this.client.send(command);
      
      if (!response.AudioStream) {
        throw new Error("No audio stream returned from Polly");
      }

      const chunks: Uint8Array[] = [];
      for await (const chunk of response.AudioStream as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error: any) {
      console.error("AWS Polly SSML synthesis error:", error);
      throw new Error(`Failed to synthesize SSML: ${error.message}`);
    }
  }

  /**
   * Get available voices for a language
   */
  async getAvailableVoices(languageCode: string = "en-US"): Promise<any[]> {
    try {
      await this.ensureClient();
      
      const command = new DescribeVoicesCommand({
        LanguageCode: languageCode
      });

      const response = await this.client.send(command);
      return response.Voices || [];
    } catch (error: any) {
      console.error("Error fetching Polly voices:", error);
      throw new Error(`Failed to fetch voices: ${error.message}`);
    }
  }

  /**
   * Create trauma-informed SSML for empathetic delivery
   * Uses prosody, pauses, and gentle pacing
   */
  createTraumaInformedSSML(text: string): string {
    // Clean text and prepare for SSML
    const cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    // Add trauma-informed prosody
    // Slower rate, softer volume, calm pitch
    return `<speak>
      <prosody rate="slow" volume="soft" pitch="medium">
        ${cleanText}
      </prosody>
    </speak>`;
  }

  /**
   * Recommended voices for trauma-informed care
   */
  static getRecommendedVoices(): { [key: string]: string } {
    return {
      // Neural voices (most natural)
      "Joanna": "Warm, empathetic female voice (US English, Neural)",
      "Matthew": "Calm, reassuring male voice (US English, Neural)",
      "Ruth": "Gentle, compassionate female voice (US English, Neural)",
      "Stephen": "Professional, supportive male voice (US English, Neural)",
      
      // Standard voices (fallback)
      "Salli": "Friendly female voice (US English, Standard)",
      "Joey": "Approachable male voice (US English, Standard)"
    };
  }

  /**
   * Check if AWS Polly is available (SDK installed and credentials configured)
   */
  static async isAvailable(): Promise<boolean> {
    try {
      await loadPollySDK();
      const hasCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
      return hasCredentials;
    } catch {
      return false;
    }
  }
}

/**
 * Create Polly service instance
 */
export function createPollyService(config?: PollyConfig): PollyVoiceService {
  return new PollyVoiceService(config);
}

/**
 * Quick synthesis helper
 */
export async function synthesizeText(
  text: string, 
  voice?: string
): Promise<Buffer> {
  try {
    const polly = createPollyService();
    return await polly.synthesizeSpeech({ text, voice });
  } catch (error: any) {
    throw new Error(`Speech synthesis failed: ${error.message}`);
  }
}

/**
 * Trauma-informed synthesis with SSML
 */
export async function synthesizeTraumaInformed(text: string): Promise<Buffer> {
  try {
    const polly = createPollyService();
    const ssml = polly.createTraumaInformedSSML(text);
    return await polly.synthesizeSSML(ssml, {
      voice: "Joanna", // Warm, empathetic voice
      engine: "neural"
    });
  } catch (error: any) {
    throw new Error(`Trauma-informed synthesis failed: ${error.message}`);
  }
}
