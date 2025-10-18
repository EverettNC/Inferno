/**
 * AWS Polly Text-to-Speech Service
 * High-quality voice synthesis fallback for Inferno AI
 */

import { 
  PollyClient, 
  SynthesizeSpeechCommand,
  DescribeVoicesCommand,
  Voice 
} from "@aws-sdk/client-polly";

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

export class PollyVoiceService {
  private client: PollyClient;
  private defaultVoice: string = "Joanna"; // Warm, empathetic female voice
  private defaultEngine: "standard" | "neural" = "neural"; // Neural voices sound more natural

  constructor(config?: PollyConfig) {
    const region = config?.region || process.env.AWS_REGION || "us-east-1";
    const accessKeyId = config?.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = config?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    this.client = new PollyClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }

  /**
   * Synthesize speech from text
   * Returns audio data as Buffer
   */
  async synthesizeSpeech(options: SynthesisOptions): Promise<Buffer> {
    try {
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
  async getAvailableVoices(languageCode: string = "en-US"): Promise<Voice[]> {
    try {
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
