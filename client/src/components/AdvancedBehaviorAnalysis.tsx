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
 * Advanced Webcam Behavior Analysis Component 🔬👁️
 * 
 * This component provides a sophisticated interface for real-time
 * webcam-based behavior analysis using computer vision.
 * 
 * Features:
 * - Live webcam feed with overlay analysis
 * - Real-time behavior metrics display
 * - Pattern detection alerts
 * - Crisis intervention triggers
 * - Comprehensive behavior reporting
 */

import { useState, useEffect, useRef } from 'react';
import { WebcamBehaviorTracker, WebcamBehaviorMetrics, BehaviorPattern } from '@/lib/webcamBehaviorTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Eye, 
  Camera, 
  CameraOff, 
  Activity, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Circle,
  TrendingUp,
  Users
} from 'lucide-react';

interface AdvancedBehaviorAnalysisProps {
  onCrisisDetected?: (severity: 'low' | 'medium' | 'high') => void;
  onBehaviorInsight?: (insight: string) => void;
}

export function AdvancedBehaviorAnalysis({ 
  onCrisisDetected, 
  onBehaviorInsight 
}: AdvancedBehaviorAnalysisProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<WebcamBehaviorMetrics | null>(null);
  const [behaviorSummary, setBehaviorSummary] = useState<any>(null);
  const [detectedPatterns, setDetectedPatterns] = useState<BehaviorPattern[]>([]);
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const trackerRef = useRef<WebcamBehaviorTracker | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Initialize tracker
    trackerRef.current = new WebcamBehaviorTracker();
    
    // Set up callbacks
    trackerRef.current.onBehaviorUpdateCallback((metrics: WebcamBehaviorMetrics) => {
      setCurrentMetrics(metrics);
      
      // Update summary periodically
      if (Date.now() % 5000 < 100) { // Roughly every 5 seconds
        const summary = trackerRef.current?.getBehaviorSummary();
        setBehaviorSummary(summary);
      }
    });

    trackerRef.current.onPatternDetectedCallback((pattern: BehaviorPattern) => {
      setDetectedPatterns(prev => [...prev.slice(-4), pattern]); // Keep last 5 patterns
      
      if (onBehaviorInsight) {
        onBehaviorInsight(`Detected ${pattern.type}: ${pattern.indicators.join(', ')}`);
      }
    });

    trackerRef.current.onCrisisIndicatorCallback((severity: 'low' | 'medium' | 'high') => {
      setCrisisLevel(severity);
      
      if (onCrisisDetected) {
        onCrisisDetected(severity);
      }
      
      // Auto-clear crisis level after 10 seconds
      setTimeout(() => setCrisisLevel(null), 10000);
    });

    return () => {
      // Cleanup
      if (trackerRef.current?.isTracking()) {
        trackerRef.current.stopTracking();
      }
    };
  }, [onCrisisDetected, onBehaviorInsight]);

  const handleStartTracking = async () => {
    if (!trackerRef.current) return;
    
    setError(null);
    
    try {
      const success = await trackerRef.current.startTracking();
      
      if (success) {
        setIsTracking(true);
        setPermissionGranted(true);
        console.log('🎉 Advanced behavior tracking started!');
      } else {
        setError('Failed to start behavior tracking');
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error('❌ Error starting behavior tracking:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPermissionGranted(false);
    }
  };

  const handleStopTracking = async () => {
    if (!trackerRef.current) return;
    
    try {
      await trackerRef.current.stopTracking();
      setIsTracking(false);
      setCurrentMetrics(null);
      setBehaviorSummary(null);
      setCrisisLevel(null);
      console.log('✅ Behavior tracking stopped');
    } catch (error) {
      console.error('❌ Error stopping behavior tracking:', error);
      setError(`Error stopping tracking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getExpressionEmoji = (expression: string): string => {
    const emojiMap: { [key: string]: string } = {
      'neutral': '😐',
      'happiness': '😊',
      'sadness': '😢',
      'anger': '😠',
      'fear': '😨',
      'surprise': '😲',
      'disgust': '🤢',
      'contempt': '😒'
    };
    return emojiMap[expression] || '🤔';
  };

  const getCrisisColor = (level: string): string => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const renderCurrentMetrics = () => {
    if (!currentMetrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Face Detection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Face Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {currentMetrics.faceDetected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm">
                    {currentMetrics.faceDetected ? 'Detected' : 'Not detected'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Eyes: {currentMetrics.eyesDetected}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono">{currentMetrics.fps.toFixed(1)}</div>
                <div className="text-xs text-gray-600">FPS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movement Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Activity Level</span>
                <span className="text-sm font-mono">
                  {(currentMetrics.movementProportion * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={currentMetrics.movementProportion * 100} 
                className="h-2"
              />
              {currentMetrics.repetitiveMovements.length > 0 && (
                <div className="text-xs text-amber-600">
                  {currentMetrics.repetitiveMovements.length} repetitive pattern(s) detected
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expression Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Expression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getExpressionEmoji(currentMetrics.dominantExpression)}
                </span>
                <div>
                  <div className="text-sm font-medium capitalize">
                    {currentMetrics.dominantExpression}
                  </div>
                  <div className="text-xs text-gray-600">
                    {(currentMetrics.expressionConfidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBehaviorSummary = () => {
    if (!behaviorSummary) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Session Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive behavior analysis from this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{behaviorSummary.totalMeasurements}</div>
              <div className="text-xs text-gray-600">Total Measurements</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(behaviorSummary.faceDetectionRate * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Face Detection</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(behaviorSummary.avgMovement * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Avg Movement</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{behaviorSummary.avgFPS.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Avg FPS</div>
            </div>
          </div>
          
          {behaviorSummary.repetitivePatterns?.detected && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-amber-800 mb-1">
                Repetitive Patterns Detected
              </div>
              <div className="text-xs text-amber-600">
                {behaviorSummary.repetitivePatterns.count} patterns, 
                avg frequency: {behaviorSummary.repetitivePatterns.avgFrequency.toFixed(1)} Hz
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-600" />
            Advanced Behavior Analysis
          </CardTitle>
          <CardDescription>
            Real-time webcam-based behavior tracking using computer vision
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            {!isTracking ? (
              <Button 
                onClick={handleStartTracking}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Behavior Analysis
              </Button>
            ) : (
              <Button 
                onClick={handleStopTracking}
                variant="destructive"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Analysis
              </Button>
            )}
            
            <Badge variant={isTracking ? 'default' : 'secondary'}>
              {isTracking ? 'Tracking Active' : 'Inactive'}
            </Badge>
            
            {permissionGranted === false && (
              <Badge variant="destructive">
                Camera Permission Denied
              </Badge>
            )}
          </div>
          
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Crisis Alert */}
      {crisisLevel && (
        <Alert variant={crisisLevel === 'high' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Behavior Alert - {crisisLevel.toUpperCase()} Level</AlertTitle>
          <AlertDescription>
            {crisisLevel === 'high' && 'High stress or distress indicators detected. Consider immediate support.'}
            {crisisLevel === 'medium' && 'Moderate stress indicators observed. Monitoring recommended.'}
            {crisisLevel === 'low' && 'Mild stress indicators noted. Continue monitoring.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Metrics */}
      {isTracking && currentMetrics && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Real-time Analysis</h3>
          {renderCurrentMetrics()}
        </div>
      )}

      {/* Detected Patterns */}
      {detectedPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detected Behavior Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detectedPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {pattern.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pattern.indicators.join(', ')}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {(pattern.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Summary */}
      {isTracking && renderBehaviorSummary()}

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>🔬 <strong>Computer Vision Analysis</strong> • Micro-expressions, eye tracking, movement patterns</p>
            <p>🛡️ <strong>Privacy Protected</strong> • All analysis happens locally, no video stored</p>
            <p>🎯 <strong>Trauma-Informed</strong> • Designed for therapeutic monitoring and crisis detection</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}