/**
 * Advanced Webcam Behavior Integration for Inferno AI
 * 
 * This module bridges the Python computer vision behavior analysis
 * with our TypeScript frontend, enabling real-time webcam-based
 * behavior tracking and analysis.
 * 
 * Features:
 * - Micro-expression detection
 * - Repetitive movement (tic) analysis  
 * - Eye movement tracking
 * - Head position monitoring
 * - Posture analysis
 * - Real-time pattern recognition
 */

export interface WebcamBehaviorMetrics {
  timestamp: Date;
  sessionId: string;
  
  // Computer Vision Analysis
  faceDetected: boolean;
  eyesDetected: number;
  eyePositions: EyePosition[];
  
  // Movement Analysis
  movementProportion: number;
  repetitiveMovements: RepetitivePattern[];
  
  // Expression Analysis
  dominantExpression: string;
  expressionConfidence: number;
  microExpressions: MicroExpression[];
  
  // Posture Analysis
  postureQuality: string;
  postureMovementDetected: boolean;
  
  // Pattern Recognition
  patternMatches: BehaviorPattern[];
  
  // System Status
  fps: number;
  trackingActive: boolean;
}

export interface EyePosition {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  width: number;
  height: number;
}

export interface RepetitivePattern {
  type: 'repetitive_movement' | 'tic' | 'fidget';
  frequency: number; // Hz
  consistency: number; // 0-1 confidence
  count: number;
  duration: number; // seconds
}

export interface MicroExpression {
  type: 'surprise' | 'fear' | 'disgust' | 'anger' | 'happiness' | 'sadness' | 'contempt';
  intensity: number; // 0-1
  duration: number; // milliseconds
  confidence: number; // 0-1
}

export interface BehaviorPattern {
  id: string;
  type: 'anxiety_pattern' | 'stress_pattern' | 'trauma_response' | 'engagement_pattern';
  confidence: number;
  indicators: string[];
  recommendations: string[];
}

export class WebcamBehaviorTracker {
  private isActive: boolean = false;
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;
  
  // Behavior analysis state
  private behaviorHistory: WebcamBehaviorMetrics[] = [];
  private currentSession: string = '';
  
  // Callbacks
  private onBehaviorUpdate?: (metrics: WebcamBehaviorMetrics) => void;
  private onPatternDetected?: (pattern: BehaviorPattern) => void;
  private onCrisisIndicator?: (severity: 'low' | 'medium' | 'high') => void;

  constructor() {
    console.log('🔬 Advanced Webcam Behavior Tracker initialized');
    this.currentSession = `session_${Date.now()}`;
  }

  /**
   * Start webcam behavior tracking
   */
  async startTracking(): Promise<boolean> {
    try {
      console.log('📹 Starting webcam behavior tracking...');
      
      // Request webcam access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          frameRate: 30 
        } 
      });
      
      // Create video element
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.playsInline = true;
      
      // Create canvas for frame processing
      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 480;
      this.context = this.canvas.getContext('2d');
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        this.video!.onloadedmetadata = resolve;
      });
      
      // Start the Python behavior capture backend
      await this.startBehaviorCaptureBackend();
      
      // Start frame analysis
      this.startFrameAnalysis();
      
      this.isActive = true;
      console.log('✅ Webcam behavior tracking started successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to start webcam behavior tracking:', error);
      return false;
    }
  }

  /**
   * Stop webcam behavior tracking
   */
  async stopTracking(): Promise<void> {
    console.log('🛑 Stopping webcam behavior tracking...');
    
    this.isActive = false;
    
    // Stop frame analysis
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    // Stop webcam stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Stop backend
    await this.stopBehaviorCaptureBackend();
    
    console.log('✅ Webcam behavior tracking stopped');
  }

  /**
   * Start the Python behavior capture backend
   */
  private async startBehaviorCaptureBackend(): Promise<void> {
    try {
      const response = await fetch('/api/behavior/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Backend start failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🚀 Behavior capture backend started:', result);
      
    } catch (error) {
      console.error('❌ Failed to start behavior capture backend:', error);
      throw error;
    }
  }

  /**
   * Stop the Python behavior capture backend
   */
  private async stopBehaviorCaptureBackend(): Promise<void> {
    try {
      const response = await fetch('/api/behavior/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ Behavior capture backend stopped');
      }
      
    } catch (error) {
      console.error('❌ Failed to stop behavior capture backend:', error);
    }
  }

  /**
   * Start frame analysis loop
   */
  private startFrameAnalysis(): void {
    this.analysisInterval = setInterval(async () => {
      if (!this.isActive || !this.video || !this.canvas || !this.context) {
        return;
      }
      
      try {
        // Capture current frame
        this.context.drawImage(this.video, 0, 0, 640, 480);
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = imageData.split(',')[1]; // Remove data:image/jpeg;base64,
        
        // Send frame to Python backend for analysis
        const analysisResult = await this.processFrame(base64Data);
        
        if (analysisResult.success) {
          const metrics = this.parseAnalysisResult(analysisResult);
          this.behaviorHistory.push(metrics);
          
          // Trigger callbacks
          if (this.onBehaviorUpdate) {
            this.onBehaviorUpdate(metrics);
          }
          
          // Check for patterns
          this.checkForCriticalPatterns(metrics);
          
          // Limit history size
          if (this.behaviorHistory.length > 1000) {
            this.behaviorHistory = this.behaviorHistory.slice(-500);
          }
        }
        
      } catch (error) {
        console.error('❌ Frame analysis error:', error);
      }
    }, 100); // 10 FPS analysis
  }

  /**
   * Send frame to Python backend for processing
   */
  private async processFrame(base64Frame: string): Promise<any> {
    try {
      const response = await fetch('/api/behavior/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frame: base64Frame })
      });
      
      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return { success: true, data: result };
      
    } catch (error) {
      console.error('❌ Frame processing failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Parse analysis result from Python backend
   */
  private parseAnalysisResult(result: any): WebcamBehaviorMetrics {
    const data = result.data;
    
    return {
      timestamp: new Date(),
      sessionId: this.currentSession,
      
      // Face and eye detection
      faceDetected: data.results?.eye_tracker?.face_detected || false,
      eyesDetected: data.results?.eye_tracker?.eyes_detected || 0,
      eyePositions: data.results?.eye_tracker?.eye_positions || [],
      
      // Movement analysis
      movementProportion: data.results?.tic_detector?.movement_proportion || 0,
      repetitiveMovements: this.parseRepetitiveMovements(data.results?.tic_detector?.repetitive_movements || []),
      
      // Expression analysis
      dominantExpression: data.results?.expression_analyzer?.dominant_expression || 'neutral',
      expressionConfidence: data.results?.expression_analyzer?.expression_confidence || 0,
      microExpressions: data.results?.expression_analyzer?.micro_expressions || [],
      
      // Posture analysis
      postureQuality: data.results?.posture_tracker?.posture_quality || 'unknown',
      postureMovementDetected: data.results?.posture_tracker?.movement_detected || false,
      
      // Pattern matching
      patternMatches: data.results?.pattern_matches || [],
      
      // System status
      fps: this.extractFPS(data),
      trackingActive: data.tracking || false
    };
  }

  /**
   * Parse repetitive movement data
   */
  private parseRepetitiveMovements(movements: any[]): RepetitivePattern[] {
    return movements.map(movement => ({
      type: movement.type || 'repetitive_movement',
      frequency: movement.frequency || 0,
      consistency: movement.consistency || 0,
      count: movement.count || 0,
      duration: movement.count / Math.max(movement.frequency, 0.1) // Estimate duration
    }));
  }

  /**
   * Extract FPS from analysis data
   */
  private extractFPS(data: any): number {
    // Try to extract FPS from various possible locations in the response
    return data.fps || 0;
  }

  /**
   * Check for critical behavior patterns that need immediate attention
   */
  private checkForCriticalPatterns(metrics: WebcamBehaviorMetrics): void {
    let criticalIndicators = 0;
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    // Check for high movement/agitation
    if (metrics.movementProportion > 0.1) {
      criticalIndicators++;
    }
    
    // Check for repetitive movements (possible tics or self-harm behaviors)
    if (metrics.repetitiveMovements.length > 0) {
      const highFrequencyTics = metrics.repetitiveMovements.filter(m => m.frequency > 2.0);
      if (highFrequencyTics.length > 0) {
        criticalIndicators += 2;
      }
    }
    
    // Check expression patterns
    if (metrics.dominantExpression === 'fear' || metrics.dominantExpression === 'anger') {
      criticalIndicators++;
    }
    
    // Check for pattern matches indicating distress
    const distressPatterns = metrics.patternMatches.filter(p => 
      p.type === 'anxiety_pattern' || p.type === 'trauma_response'
    );
    if (distressPatterns.length > 0) {
      criticalIndicators += distressPatterns.length;
    }
    
    // Determine severity
    if (criticalIndicators >= 4) {
      severity = 'high';
    } else if (criticalIndicators >= 2) {
      severity = 'medium';
    }
    
    // Trigger crisis callback if needed
    if (severity !== 'low' && this.onCrisisIndicator) {
      this.onCrisisIndicator(severity);
    }
  }

  /**
   * Get behavior analysis summary
   */
  getBehaviorSummary(): any {
    if (this.behaviorHistory.length === 0) {
      return null;
    }
    
    const recent = this.behaviorHistory.slice(-50); // Last 50 measurements
    
    return {
      sessionId: this.currentSession,
      totalMeasurements: this.behaviorHistory.length,
      recentMeasurements: recent.length,
      avgMovement: recent.reduce((sum, m) => sum + m.movementProportion, 0) / recent.length,
      faceDetectionRate: recent.filter(m => m.faceDetected).length / recent.length,
      dominantExpressions: this.getTopExpressions(recent),
      repetitivePatterns: this.getRepetitivePatternSummary(recent),
      avgFPS: recent.reduce((sum, m) => sum + m.fps, 0) / recent.length
    };
  }

  /**
   * Get top expressions from recent measurements
   */
  private getTopExpressions(measurements: WebcamBehaviorMetrics[]): string[] {
    const expressionCounts = new Map<string, number>();
    
    measurements.forEach(m => {
      const count = expressionCounts.get(m.dominantExpression) || 0;
      expressionCounts.set(m.dominantExpression, count + 1);
    });
    
    return Array.from(expressionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  }

  /**
   * Get summary of repetitive patterns
   */
  private getRepetitivePatternSummary(measurements: WebcamBehaviorMetrics[]): any {
    const allPatterns = measurements.flatMap(m => m.repetitiveMovements);
    
    if (allPatterns.length === 0) {
      return { detected: false };
    }
    
    const avgFrequency = allPatterns.reduce((sum, p) => sum + p.frequency, 0) / allPatterns.length;
    const maxConsistency = Math.max(...allPatterns.map(p => p.consistency));
    
    return {
      detected: true,
      count: allPatterns.length,
      avgFrequency,
      maxConsistency,
      types: Array.from(new Set(allPatterns.map(p => p.type)))
    };
  }

  /**
   * Set behavior update callback
   */
  onBehaviorUpdateCallback(callback: (metrics: WebcamBehaviorMetrics) => void): void {
    this.onBehaviorUpdate = callback;
  }

  /**
   * Set pattern detection callback
   */
  onPatternDetectedCallback(callback: (pattern: BehaviorPattern) => void): void {
    this.onPatternDetected = callback;
  }

  /**
   * Set crisis indicator callback
   */
  onCrisisIndicatorCallback(callback: (severity: 'low' | 'medium' | 'high') => void): void {
    this.onCrisisIndicator = callback;
  }

  /**
   * Get current tracking status
   */
  isTracking(): boolean {
    return this.isActive;
  }

  /**
   * Get behavior history
   */
  getBehaviorHistory(): WebcamBehaviorMetrics[] {
    return [...this.behaviorHistory];
  }
}