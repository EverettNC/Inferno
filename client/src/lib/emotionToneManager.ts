/**
 * Emotion & Tone Management System for Inferno AI 🎨🎵
 * 
 * This is the FINAL PIECE of our Musical Lounge AI - the emotional intelligence
 * that fuses voice analysis, webcam behavior tracking, and music therapy into
 * a unified, adaptive, empathetic AI companion.
 * 
 * Features:
 * - Multi-modal emotion fusion (voice + visual + behavioral)
 * - Adaptive tone control and response generation
 * - Gesture-voice synchronization
 * - Real-time emotional state management
 * - Trauma-informed emotional responses
 * - Musical emotional regulation
 */

export interface EmotionState {
  // Primary emotion detection
  primaryEmotion: EmotionType;
  secondaryEmotions: EmotionType[];
  emotionIntensity: number; // 0-1 scale
  emotionConfidence: number; // 0-1 scale
  
  // Emotional stability
  emotionStability: number; // 0-1, higher = more stable
  emotionTrend: 'rising' | 'falling' | 'stable';
  rapidChanges: boolean; // Indicates emotional volatility
  
  // Multi-modal sources
  voiceEmotionData: VoiceEmotionData;
  visualEmotionData: VisualEmotionData;
  behavioralEmotionData: BehavioralEmotionData;
  
  // Context
  timestamp: Date;
  sessionPhase: 'initial' | 'building_rapport' | 'therapeutic_work' | 'integration' | 'closure';
  traumaIndicators: TraumaIndicator[];
  
  // Response needs
  requiredToneAdjustments: ToneAdjustment[];
  recommendedInterventions: EmotionalIntervention[];
}

export enum EmotionType {
  // Basic emotions
  JOY = 'joy',
  SADNESS = 'sadness', 
  ANGER = 'anger',
  FEAR = 'fear',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
  
  // Complex emotions
  ANXIETY = 'anxiety',
  DEPRESSION = 'depression',
  EXCITEMENT = 'excitement',
  CONTENTMENT = 'contentment',
  FRUSTRATION = 'frustration',
  HOPE = 'hope',
  SHAME = 'shame',
  GUILT = 'guilt',
  RELIEF = 'relief',
  
  // Trauma-specific emotions
  HYPERVIGILANCE = 'hypervigilance',
  DISSOCIATION = 'dissociation',
  EMOTIONAL_NUMBNESS = 'emotional_numbness',
  TRIGGER_RESPONSE = 'trigger_response',
  
  // Neutral/unclear
  NEUTRAL = 'neutral',
  CONFUSED = 'confused',
  MIXED = 'mixed'
}

export interface VoiceEmotionData {
  pitch: number;
  volume: number;
  speed: number;
  tremor: number; // Voice shaking indicator
  pausePatterns: number[]; // Length of pauses
  breathingRate: number;
  emotionFromSpeech: EmotionType;
  stressIndicators: string[];
}

export interface VisualEmotionData {
  facialExpression: EmotionType;
  microExpressions: EmotionType[];
  eyeContactLevel: number; // 0-1
  bodyPosture: 'open' | 'closed' | 'defensive' | 'collapsed';
  movementEnergy: number; // 0-1 scale
  fidgetingLevel: number;
  muscularTension: number;
}

export interface BehavioralEmotionData {
  engagementLevel: number; // 0-1
  responsiveness: number; // 0-1
  socialConnection: number; // 0-1  
  coping_strategies_used: string[];
  avoidance_behaviors: string[];
  help_seeking_behaviors: string[];
}

export interface TraumaIndicator {
  type: 'flashback' | 'trigger' | 'dissociation' | 'hyperarousal' | 'avoidance';
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
  observedBehaviors: string[];
  recommendedResponse: string;
}

export interface ToneAdjustment {
  aspect: 'volume' | 'pitch' | 'speed' | 'warmth' | 'formality' | 'energy';
  direction: 'increase' | 'decrease' | 'maintain';
  magnitude: number; // 0-1 scale
  reason: string;
}

export interface EmotionalIntervention {
  type: 'grounding' | 'validation' | 'distraction' | 'breathing' | 'music_therapy' | 'crisis_protocol';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  estimatedDuration: number; // minutes
  musicTherapyProtocol?: string;
}

export class EmotionToneManager {
  private currentEmotionState: EmotionState | null = null;
  private emotionHistory: EmotionState[] = [];
  private sessionContext: any = {};
  private isActive: boolean = false;
  
  // Fusion weights for multi-modal emotion detection
  private fusionWeights = {
    voice: 0.4,
    visual: 0.35, 
    behavioral: 0.25
  };
  
  // Callbacks
  private onEmotionChangeCallback?: (emotion: EmotionState) => void;
  private onToneAdjustmentCallback?: (adjustments: ToneAdjustment[]) => void;
  private onEmotionalCrisisCallback?: (crisis: TraumaIndicator) => void;

  constructor() {
    console.log('🎨 Emotion & Tone Management System initialized');
  }

  /**
   * Start emotion and tone monitoring
   */
  startMonitoring(): void {
    this.isActive = true;
    console.log('🎵 Starting emotion and tone monitoring...');
    
    // Initialize session context
    this.sessionContext = {
      startTime: new Date(),
      phase: 'initial',
      establishedBaseline: false,
      userPreferences: {},
      traumaHistory: []
    };
  }

  /**
   * Stop emotion and tone monitoring
   */
  stopMonitoring(): void {
    this.isActive = false;
    console.log('🛑 Emotion and tone monitoring stopped');
  }

  /**
   * Process multi-modal emotion data and generate unified emotion state
   */
  processEmotionData(
    voiceData?: VoiceEmotionData,
    visualData?: VisualEmotionData, 
    behavioralData?: BehavioralEmotionData
  ): EmotionState {
    
    if (!this.isActive) {
      throw new Error('Emotion monitoring not active');
    }

    // Fuse multi-modal emotion data
    const fusedEmotion = this.fuseEmotionData(voiceData, visualData, behavioralData);
    
    // Detect trauma indicators
    const traumaIndicators = this.detectTraumaIndicators(voiceData, visualData, behavioralData);
    
    // Determine session phase
    const sessionPhase = this.determineSessionPhase();
    
    // Calculate emotional stability
    const stability = this.calculateEmotionalStability(fusedEmotion);
    
    // Generate tone adjustments
    const toneAdjustments = this.generateToneAdjustments(fusedEmotion, traumaIndicators);
    
    // Generate interventions
    const interventions = this.generateEmotionalInterventions(fusedEmotion, traumaIndicators);
    
    // Create emotion state
    const emotionState: EmotionState = {
      primaryEmotion: fusedEmotion.primary,
      secondaryEmotions: fusedEmotion.secondary,
      emotionIntensity: fusedEmotion.intensity,
      emotionConfidence: fusedEmotion.confidence,
      emotionStability: stability.score,
      emotionTrend: stability.trend,
      rapidChanges: stability.rapidChanges,
      voiceEmotionData: voiceData || this.getDefaultVoiceData(),
      visualEmotionData: visualData || this.getDefaultVisualData(),
      behavioralEmotionData: behavioralData || this.getDefaultBehavioralData(),
      timestamp: new Date(),
      sessionPhase,
      traumaIndicators,
      requiredToneAdjustments: toneAdjustments,
      recommendedInterventions: interventions
    };
    
    // Store state and history
    this.currentEmotionState = emotionState;
    this.emotionHistory.push(emotionState);
    
    // Limit history size
    if (this.emotionHistory.length > 100) {
      this.emotionHistory = this.emotionHistory.slice(-50);
    }
    
    // Trigger callbacks
    if (this.onEmotionChangeCallback) {
      this.onEmotionChangeCallback(emotionState);
    }
    
    if (toneAdjustments.length > 0 && this.onToneAdjustmentCallback) {
      this.onToneAdjustmentCallback(toneAdjustments);
    }
    
    // Check for emotional crisis
    const criticalTrauma = traumaIndicators.find(t => t.severity === 'severe');
    if (criticalTrauma && this.onEmotionalCrisisCallback) {
      this.onEmotionalCrisisCallback(criticalTrauma);
    }
    
    console.log(`🎨 Emotion processed: ${emotionState.primaryEmotion} (${(emotionState.emotionIntensity * 100).toFixed(0)}% intensity)`);
    
    return emotionState;
  }

  /**
   * Fuse emotion data from multiple modalities
   */
  private fuseEmotionData(
    voice?: VoiceEmotionData,
    visual?: VisualEmotionData,
    behavioral?: BehavioralEmotionData
  ): any {
    
    const emotionScores = new Map<EmotionType, number>();
    
    // Process voice emotions
    if (voice) {
      const voiceWeight = this.fusionWeights.voice;
      emotionScores.set(voice.emotionFromSpeech, (emotionScores.get(voice.emotionFromSpeech) || 0) + voiceWeight);
      
      // Add stress-based emotions
      if (voice.stressIndicators.length > 0) {
        emotionScores.set(EmotionType.ANXIETY, (emotionScores.get(EmotionType.ANXIETY) || 0) + voiceWeight * 0.5);
      }
    }
    
    // Process visual emotions
    if (visual) {
      const visualWeight = this.fusionWeights.visual;
      emotionScores.set(visual.facialExpression, (emotionScores.get(visual.facialExpression) || 0) + visualWeight);
      
      // Add micro-expressions
      visual.microExpressions.forEach(emotion => {
        emotionScores.set(emotion, (emotionScores.get(emotion) || 0) + visualWeight * 0.3);
      });
      
      // Body language indicators
      if (visual.bodyPosture === 'defensive' || visual.bodyPosture === 'closed') {
        emotionScores.set(EmotionType.ANXIETY, (emotionScores.get(EmotionType.ANXIETY) || 0) + visualWeight * 0.4);
      }
    }
    
    // Process behavioral emotions
    if (behavioral) {
      const behavioralWeight = this.fusionWeights.behavioral;
      
      if (behavioral.engagementLevel < 0.3) {
        emotionScores.set(EmotionType.DEPRESSION, (emotionScores.get(EmotionType.DEPRESSION) || 0) + behavioralWeight * 0.6);
      }
      
      if (behavioral.avoidance_behaviors.length > 0) {
        emotionScores.set(EmotionType.ANXIETY, (emotionScores.get(EmotionType.ANXIETY) || 0) + behavioralWeight * 0.5);
      }
    }
    
    // Find primary and secondary emotions
    const sortedEmotions = Array.from(emotionScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const primary = sortedEmotions[0] ? sortedEmotions[0][0] : EmotionType.NEUTRAL;
    const secondary = sortedEmotions.slice(1, 3).map(entry => entry[0]);
    
    const maxScore = sortedEmotions[0] ? sortedEmotions[0][1] : 0;
    const intensity = Math.min(maxScore * 1.5, 1.0); // Boost intensity slightly
    const confidence = sortedEmotions.length > 1 ? 
      (sortedEmotions[0][1] - sortedEmotions[1][1]) / sortedEmotions[0][1] : 1.0;
    
    return {
      primary,
      secondary,
      intensity,
      confidence: Math.min(confidence, 1.0)
    };
  }

  /**
   * Detect trauma-specific indicators
   */
  private detectTraumaIndicators(
    voice?: VoiceEmotionData,
    visual?: VisualEmotionData,
    behavioral?: BehavioralEmotionData
  ): TraumaIndicator[] {
    
    const indicators: TraumaIndicator[] = [];
    
    // Voice-based trauma indicators
    if (voice) {
      if (voice.tremor > 0.7) {
        indicators.push({
          type: 'hyperarousal',
          severity: 'moderate',
          confidence: voice.tremor,
          observedBehaviors: ['voice tremor', 'increased pitch'],
          recommendedResponse: 'Use calming, slower speech pace'
        });
      }
      
      if (voice.pausePatterns.some(pause => pause > 5)) {
        indicators.push({
          type: 'dissociation',
          severity: 'mild',
          confidence: 0.6,
          observedBehaviors: ['long pauses in speech'],
          recommendedResponse: 'Gentle grounding techniques'
        });
      }
    }
    
    // Visual-based trauma indicators  
    if (visual) {
      if (visual.eyeContactLevel < 0.2) {
        indicators.push({
          type: 'avoidance',
          severity: 'mild',
          confidence: 0.7,
          observedBehaviors: ['avoiding eye contact'],
          recommendedResponse: 'Respect boundaries, don\'t force eye contact'
        });
      }
      
      if (visual.bodyPosture === 'collapsed') {
        indicators.push({
          type: 'dissociation',
          severity: 'moderate',
          confidence: 0.8,
          observedBehaviors: ['collapsed posture', 'low energy'],
          recommendedResponse: 'Check for dissociation, use grounding'
        });
      }
    }
    
    // Behavioral trauma indicators
    if (behavioral) {
      if (behavioral.avoidance_behaviors.length > 2) {
        indicators.push({
          type: 'avoidance',
          severity: 'moderate',
          confidence: 0.75,
          observedBehaviors: behavioral.avoidance_behaviors,
          recommendedResponse: 'Gentle exposure, respect boundaries'
        });
      }
    }
    
    return indicators;
  }

  /**
   * Generate tone adjustments based on emotion state
   */
  private generateToneAdjustments(fusedEmotion: any, traumaIndicators: TraumaIndicator[]): ToneAdjustment[] {
    const adjustments: ToneAdjustment[] = [];
    
    // Adjust based on primary emotion
    switch (fusedEmotion.primary) {
      case EmotionType.ANXIETY:
        adjustments.push({
          aspect: 'speed',
          direction: 'decrease',
          magnitude: 0.6,
          reason: 'Slow speech to reduce anxiety'
        });
        adjustments.push({
          aspect: 'volume',
          direction: 'decrease', 
          magnitude: 0.3,
          reason: 'Lower volume for calming effect'
        });
        break;
        
      case EmotionType.SADNESS:
        adjustments.push({
          aspect: 'warmth',
          direction: 'increase',
          magnitude: 0.7,
          reason: 'Increase warmth for comfort'
        });
        adjustments.push({
          aspect: 'pitch',
          direction: 'decrease',
          magnitude: 0.4,
          reason: 'Lower pitch for soothing tone'
        });
        break;
        
      case EmotionType.ANGER:
        adjustments.push({
          aspect: 'volume',
          direction: 'decrease',
          magnitude: 0.5,
          reason: 'Avoid escalating anger'
        });
        adjustments.push({
          aspect: 'speed',
          direction: 'decrease',
          magnitude: 0.4,
          reason: 'Measured pace to de-escalate'
        });
        break;
        
      case EmotionType.FEAR:
        adjustments.push({
          aspect: 'warmth',
          direction: 'increase',
          magnitude: 0.8,
          reason: 'Maximize safety and comfort'
        });
        adjustments.push({
          aspect: 'energy',
          direction: 'decrease',
          magnitude: 0.6,
          reason: 'Calm energy to reduce fear'
        });
        break;
    }
    
    // Adjust based on trauma indicators
    traumaIndicators.forEach(indicator => {
      switch (indicator.type) {
        case 'hyperarousal':
          adjustments.push({
            aspect: 'speed',
            direction: 'decrease',
            magnitude: 0.7,
            reason: 'Counter hyperarousal with slow pace'
          });
          break;
          
        case 'dissociation':
          adjustments.push({
            aspect: 'volume',
            direction: 'increase',
            magnitude: 0.3,
            reason: 'Gentle volume increase for grounding'
          });
          break;
      }
    });
    
    return adjustments;
  }

  /**
   * Generate emotional interventions
   */
  private generateEmotionalInterventions(fusedEmotion: any, traumaIndicators: TraumaIndicator[]): EmotionalIntervention[] {
    const interventions: EmotionalIntervention[] = [];
    
    // High-intensity negative emotions
    if (fusedEmotion.intensity > 0.7 && 
        [EmotionType.ANXIETY, EmotionType.FEAR, EmotionType.ANGER].includes(fusedEmotion.primary)) {
      
      interventions.push({
        type: 'breathing',
        priority: 'high',
        description: 'Guided breathing exercise to regulate intense emotions',
        estimatedDuration: 3
      });
      
      interventions.push({
        type: 'music_therapy',
        priority: 'medium', 
        description: 'Calming music therapy protocol for emotional regulation',
        estimatedDuration: 10,
        musicTherapyProtocol: 'emotional_regulation'
      });
    }
    
    // Dissociation indicators
    if (traumaIndicators.some(t => t.type === 'dissociation')) {
      interventions.push({
        type: 'grounding',
        priority: 'high',
        description: '5-4-3-2-1 grounding technique to reconnect with present',
        estimatedDuration: 5
      });
    }
    
    // Depression indicators
    if (fusedEmotion.primary === EmotionType.DEPRESSION) {
      interventions.push({
        type: 'validation',
        priority: 'medium',
        description: 'Emotional validation and gentle encouragement',
        estimatedDuration: 5
      });
      
      interventions.push({
        type: 'music_therapy',
        priority: 'medium',
        description: 'Uplifting music therapy to improve mood',
        estimatedDuration: 15,
        musicTherapyProtocol: 'mood_elevation'
      });
    }
    
    return interventions;
  }

  /**
   * Calculate emotional stability metrics
   */
  private calculateEmotionalStability(fusedEmotion: any): any {
    if (this.emotionHistory.length < 3) {
      return {
        score: 0.5,
        trend: 'stable',
        rapidChanges: false
      };
    }
    
    const recent = this.emotionHistory.slice(-5);
    const intensities = recent.map(e => e.emotionIntensity);
    const emotions = recent.map(e => e.primaryEmotion);
    
    // Calculate intensity variance
    const avgIntensity = intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
    const variance = intensities.reduce((sum, i) => sum + Math.pow(i - avgIntensity, 2), 0) / intensities.length;
    const stability = Math.max(0, 1 - variance * 2);
    
    // Detect trend
    const recentIntensity = intensities[intensities.length - 1];
    const earlierIntensity = intensities[0];
    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    
    if (recentIntensity - earlierIntensity > 0.2) {
      trend = 'rising';
    } else if (earlierIntensity - recentIntensity > 0.2) {
      trend = 'falling';
    }
    
    // Detect rapid changes
    const uniqueEmotions = new Set(emotions).size;
    const rapidChanges = uniqueEmotions > 3;
    
    return {
      score: stability,
      trend,
      rapidChanges
    };
  }

  /**
   * Determine current session phase
   */
  private determineSessionPhase(): EmotionState['sessionPhase'] {
    const sessionDuration = Date.now() - this.sessionContext.startTime?.getTime() || 0;
    const minutes = sessionDuration / (1000 * 60);
    
    if (minutes < 5) return 'initial';
    if (minutes < 15) return 'building_rapport';
    if (minutes < 40) return 'therapeutic_work';
    if (minutes < 50) return 'integration';
    return 'closure';
  }

  /**
   * Get current emotion state
   */
  getCurrentEmotionState(): EmotionState | null {
    return this.currentEmotionState;
  }

  /**
   * Get emotion history
   */
  getEmotionHistory(): EmotionState[] {
    return [...this.emotionHistory];
  }

  /**
   * Set emotion change callback
   */
  onEmotionChange(callback: (emotion: EmotionState) => void): void {
    this.onEmotionChangeCallback = callback;
  }

  /**
   * Set tone adjustment callback
   */
  onToneAdjustment(callback: (adjustments: ToneAdjustment[]) => void): void {
    this.onToneAdjustmentCallback = callback;
  }

  /**
   * Set emotional crisis callback
   */
  onEmotionalCrisis(callback: (crisis: TraumaIndicator) => void): void {
    this.onEmotionalCrisisCallback = callback;
  }

  // Default data generators
  private getDefaultVoiceData(): VoiceEmotionData {
    return {
      pitch: 0.5,
      volume: 0.5,
      speed: 0.5,
      tremor: 0,
      pausePatterns: [],
      breathingRate: 0.5,
      emotionFromSpeech: EmotionType.NEUTRAL,
      stressIndicators: []
    };
  }

  private getDefaultVisualData(): VisualEmotionData {
    return {
      facialExpression: EmotionType.NEUTRAL,
      microExpressions: [],
      eyeContactLevel: 0.5,
      bodyPosture: 'open',
      movementEnergy: 0.5,
      fidgetingLevel: 0,
      muscularTension: 0.5
    };
  }

  private getDefaultBehavioralData(): BehavioralEmotionData {
    return {
      engagementLevel: 0.5,
      responsiveness: 0.5,
      socialConnection: 0.5,
      coping_strategies_used: [],
      avoidance_behaviors: [],
      help_seeking_behaviors: []
    };
  }
}