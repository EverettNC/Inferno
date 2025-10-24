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
 * Behavior Capture System for Inferno AI
 * Analyzes user patterns, emotional states, and interaction behaviors
 * to provide personalized trauma-informed care
 */

interface BehaviorMetrics {
  timestamp: Date;
  sessionId: string;
  userId: number;
  
  // Interaction patterns
  responseTime: number;
  sessionDuration: number;
  exerciseCompletion: boolean;
  voiceInteractionCount: number;
  
  // Emotional indicators
  stressLevel: number; // 1-10 scale
  engagementLevel: number; // 1-10 scale
  anxietyIndicators: string[];
  positiveMarkers: string[];
  
  // Voice analysis (when available)
  speechPace?: number;
  toneVariation?: number;
  pauseFrequency?: number;
  
  // Behavioral patterns
  timeOfDay: string;
  exerciseType: string;
  completionRate: number;
  helpSeekingBehavior: boolean;
  
  // Crisis indicators
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  triggerWords: string[];
  supportNeeded: boolean;
}

interface BehaviorPattern {
  userId: number;
  patternType: 'daily_routine' | 'stress_response' | 'engagement' | 'progress' | 'crisis_risk';
  pattern: any;
  confidence: number;
  lastUpdated: Date;
  recommendations: string[];
}

class BehaviorCaptureEngine {
  private metrics: BehaviorMetrics[] = [];
  private patterns: Map<string, BehaviorPattern> = new Map();
  
  // Capture real-time behavior data
  captureInteraction(data: Partial<BehaviorMetrics>): void {
    const metric: BehaviorMetrics = {
      timestamp: new Date(),
      sessionId: this.generateSessionId(),
      userId: data.userId || 0,
      responseTime: data.responseTime || 0,
      sessionDuration: data.sessionDuration || 0,
      exerciseCompletion: data.exerciseCompletion || false,
      voiceInteractionCount: data.voiceInteractionCount || 0,
      stressLevel: data.stressLevel || 5,
      engagementLevel: data.engagementLevel || 5,
      anxietyIndicators: data.anxietyIndicators || [],
      positiveMarkers: data.positiveMarkers || [],
      timeOfDay: new Date().toTimeString().split(' ')[0],
      exerciseType: data.exerciseType || 'unknown',
      completionRate: data.completionRate || 0,
      helpSeekingBehavior: data.helpSeekingBehavior || false,
      riskLevel: this.assessRiskLevel(data),
      triggerWords: data.triggerWords || [],
      supportNeeded: data.supportNeeded || false,
      ...data
    };
    
    this.metrics.push(metric);
    this.analyzePatterns(metric);
    
    // Alert if crisis level detected
    if (metric.riskLevel === 'crisis') {
      this.triggerCrisisProtocol(metric);
    }
  }
  
  // Analyze user patterns and generate insights
  private analyzePatterns(metric: BehaviorMetrics): void {
    const userId = metric.userId.toString();
    const userMetrics = this.metrics.filter(m => m.userId === metric.userId);
    
    // Daily routine analysis
    this.analyzeRoutinePattern(userId, userMetrics);
    
    // Stress response analysis
    this.analyzeStressPattern(userId, userMetrics);
    
    // Engagement pattern analysis
    this.analyzeEngagementPattern(userId, userMetrics);
    
    // Progress tracking
    this.analyzeProgressPattern(userId, userMetrics);
    
    // Crisis risk assessment
    this.analyzeCrisisRisk(userId, userMetrics);
  }
  
  private analyzeRoutinePattern(userId: string, metrics: BehaviorMetrics[]): void {
    const timeFrequency: { [key: string]: number } = {};
    
    metrics.forEach(m => {
      const hour = new Date(m.timestamp).getHours();
      const timeSlot = this.getTimeSlot(hour);
      timeFrequency[timeSlot] = (timeFrequency[timeSlot] || 0) + 1;
    });
    
    const pattern: BehaviorPattern = {
      userId: parseInt(userId),
      patternType: 'daily_routine',
      pattern: {
        preferredTimes: timeFrequency,
        mostActiveTime: Object.keys(timeFrequency).reduce((a, b) => 
          timeFrequency[a] > timeFrequency[b] ? a : b),
        consistencyScore: this.calculateConsistency(timeFrequency)
      },
      confidence: this.calculateConfidence(metrics.length),
      lastUpdated: new Date(),
      recommendations: this.generateRoutineRecommendations(timeFrequency)
    };
    
    this.patterns.set(`${userId}_routine`, pattern);
  }
  
  private analyzeStressPattern(userId: string, metrics: BehaviorMetrics[]): void {
    const recentMetrics = metrics.slice(-20); // Last 20 interactions
    const avgStress = recentMetrics.reduce((sum, m) => sum + m.stressLevel, 0) / recentMetrics.length;
    const stressTrend = this.calculateTrend(recentMetrics.map(m => m.stressLevel));
    
    const pattern: BehaviorPattern = {
      userId: parseInt(userId),
      patternType: 'stress_response',
      pattern: {
        averageStressLevel: avgStress,
        trend: stressTrend,
        triggers: this.identifyStressTriggers(recentMetrics),
        copingStrategies: this.identifyEffectiveCoping(recentMetrics)
      },
      confidence: this.calculateConfidence(recentMetrics.length),
      lastUpdated: new Date(),
      recommendations: this.generateStressRecommendations(avgStress, stressTrend)
    };
    
    this.patterns.set(`${userId}_stress`, pattern);
  }
  
  private analyzeEngagementPattern(userId: string, metrics: BehaviorMetrics[]): void {
    const avgEngagement = metrics.reduce((sum, m) => sum + m.engagementLevel, 0) / metrics.length;
    const completionRate = metrics.filter(m => m.exerciseCompletion).length / metrics.length;
    
    const pattern: BehaviorPattern = {
      userId: parseInt(userId),
      patternType: 'engagement',
      pattern: {
        averageEngagement: avgEngagement,
        completionRate: completionRate,
        preferredExercises: this.identifyPreferredExercises(metrics),
        optimalSessionLength: this.calculateOptimalSessionLength(metrics)
      },
      confidence: this.calculateConfidence(metrics.length),
      lastUpdated: new Date(),
      recommendations: this.generateEngagementRecommendations(avgEngagement, completionRate)
    };
    
    this.patterns.set(`${userId}_engagement`, pattern);
  }
  
  private analyzeProgressPattern(userId: string, metrics: BehaviorMetrics[]): void {
    const chronologicalMetrics = metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const progressScore = this.calculateProgressScore(chronologicalMetrics);
    
    const pattern: BehaviorPattern = {
      userId: parseInt(userId),
      patternType: 'progress',
      pattern: {
        overallProgress: progressScore,
        improvementAreas: this.identifyImprovementAreas(chronologicalMetrics),
        strengths: this.identifyStrengths(chronologicalMetrics),
        milestones: this.identifyMilestones(chronologicalMetrics)
      },
      confidence: this.calculateConfidence(chronologicalMetrics.length),
      lastUpdated: new Date(),
      recommendations: this.generateProgressRecommendations(progressScore)
    };
    
    this.patterns.set(`${userId}_progress`, pattern);
  }
  
  private analyzeCrisisRisk(userId: string, metrics: BehaviorMetrics[]): void {
    const recentMetrics = metrics.slice(-10);
    const riskScore = this.calculateRiskScore(recentMetrics);
    
    const pattern: BehaviorPattern = {
      userId: parseInt(userId),
      patternType: 'crisis_risk',
      pattern: {
        currentRiskScore: riskScore,
        riskFactors: this.identifyRiskFactors(recentMetrics),
        protectiveFactors: this.identifyProtectiveFactors(recentMetrics),
        earlyWarnings: this.identifyEarlyWarnings(recentMetrics)
      },
      confidence: this.calculateConfidence(recentMetrics.length),
      lastUpdated: new Date(),
      recommendations: this.generateCrisisRecommendations(riskScore)
    };
    
    this.patterns.set(`${userId}_crisis_risk`, pattern);
  }
  
  // Helper methods
  private assessRiskLevel(data: Partial<BehaviorMetrics>): 'low' | 'medium' | 'high' | 'crisis' {
    const stressLevel = data.stressLevel || 5;
    const triggerWords = data.triggerWords || [];
    const anxietyIndicators = data.anxietyIndicators || [];
    
    if (stressLevel >= 9 || triggerWords.length > 3 || anxietyIndicators.includes('crisis')) {
      return 'crisis';
    } else if (stressLevel >= 7 || triggerWords.length > 1) {
      return 'high';
    } else if (stressLevel >= 5 || anxietyIndicators.length > 0) {
      return 'medium';
    }
    return 'low';
  }
  
  private triggerCrisisProtocol(metric: BehaviorMetrics): void {
    console.log('🚨 CRISIS PROTOCOL TRIGGERED', {
      userId: metric.userId,
      riskLevel: metric.riskLevel,
      timestamp: metric.timestamp
    });
    
    // In a real implementation, this would:
    // 1. Alert emergency contacts
    // 2. Provide immediate crisis resources
    // 3. Log the incident
    // 4. Potentially contact emergency services
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getTimeSlot(hour: number): string {
    if (hour < 6) return 'late_night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
  
  private calculateConsistency(timeFrequency: { [key: string]: number }): number {
    const values = Object.values(timeFrequency);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.max(0, 1 - (variance / mean)); // Normalized consistency score
  }
  
  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 3) return 'stable';
    
    const recent = values.slice(-5);
    const earlier = values.slice(-10, -5);
    
    if (earlier.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    if (recentAvg < earlierAvg - 0.5) return 'improving'; // Lower stress is better
    if (recentAvg > earlierAvg + 0.5) return 'declining';
    return 'stable';
  }
  
  private calculateConfidence(sampleSize: number): number {
    if (sampleSize < 5) return 0.3;
    if (sampleSize < 15) return 0.6;
    if (sampleSize < 30) return 0.8;
    return 0.95;
  }
  
  // Additional helper methods would be implemented for each analysis function
  private identifyStressTriggers(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying stress triggers
    return [];
  }
  
  private identifyEffectiveCoping(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying effective coping strategies
    return [];
  }
  
  private generateRoutineRecommendations(timeFrequency: { [key: string]: number }): string[] {
    // Implementation for generating routine recommendations
    return [];
  }
  
  private generateStressRecommendations(avgStress: number, trend: string): string[] {
    // Implementation for generating stress management recommendations
    return [];
  }
  
  private generateEngagementRecommendations(avgEngagement: number, completionRate: number): string[] {
    // Implementation for generating engagement recommendations
    return [];
  }
  
  private generateProgressRecommendations(progressScore: number): string[] {
    // Implementation for generating progress recommendations
    return [];
  }
  
  private generateCrisisRecommendations(riskScore: number): string[] {
    // Implementation for generating crisis prevention recommendations
    return [];
  }
  
  private identifyPreferredExercises(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying preferred exercises
    return [];
  }
  
  private calculateOptimalSessionLength(metrics: BehaviorMetrics[]): number {
    // Implementation for calculating optimal session length
    return 15; // Default 15 minutes
  }
  
  private calculateProgressScore(metrics: BehaviorMetrics[]): number {
    // Implementation for calculating overall progress score
    return 0.7; // Default score
  }
  
  private identifyImprovementAreas(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying areas needing improvement
    return [];
  }
  
  private identifyStrengths(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying user strengths
    return [];
  }
  
  private identifyMilestones(metrics: BehaviorMetrics[]): any[] {
    // Implementation for identifying achieved milestones
    return [];
  }
  
  private calculateRiskScore(metrics: BehaviorMetrics[]): number {
    // Implementation for calculating crisis risk score
    return 0.3; // Default low risk
  }
  
  private identifyRiskFactors(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying risk factors
    return [];
  }
  
  private identifyProtectiveFactors(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying protective factors
    return [];
  }
  
  private identifyEarlyWarnings(metrics: BehaviorMetrics[]): string[] {
    // Implementation for identifying early warning signs
    return [];
  }
  
  // Public API methods
  getUserPatterns(userId: number): BehaviorPattern[] {
    return Array.from(this.patterns.values()).filter(p => p.userId === userId);
  }
  
  getInsights(userId: number): any {
    const patterns = this.getUserPatterns(userId);
    return {
      summary: this.generateInsightSummary(patterns),
      recommendations: this.generatePersonalizedRecommendations(patterns),
      alerts: this.checkForAlerts(patterns)
    };
  }
  
  private generateInsightSummary(patterns: BehaviorPattern[]): any {
    // Implementation for generating insight summary
    return {};
  }
  
  private generatePersonalizedRecommendations(patterns: BehaviorPattern[]): string[] {
    // Implementation for generating personalized recommendations
    return [];
  }
  
  private checkForAlerts(patterns: BehaviorPattern[]): any[] {
    // Implementation for checking alerts
    return [];
  }
}

// Export singleton instance
export const behaviorCapture = new BehaviorCaptureEngine();
export type { BehaviorMetrics, BehaviorPattern };