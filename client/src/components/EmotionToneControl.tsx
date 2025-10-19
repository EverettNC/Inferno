/**
 * Emotion & Tone Management Dashboard 🎨🎵
 * 
 * The FINAL PIECE of our Musical Lounge AI - a comprehensive dashboard
 * that displays and manages the emotional intelligence of our system.
 * 
 * Features:
 * - Real-time emotion visualization
 * - Multi-modal emotion fusion display
 * - Adaptive tone control interface
 * - Trauma indicator alerts
 * - Emotional intervention recommendations
 * - Session emotional journey tracking
 */

import { useState, useEffect } from 'react';
import { EmotionToneManager, EmotionState, EmotionType, ToneAdjustment, EmotionalIntervention } from '@/lib/emotionToneManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Eye, 
  Volume2, 
  TrendingUp, 
  AlertTriangle,
  Music,
  Activity,
  Mic,
  Camera,
  Zap,
  Smile,
  Frown,
  Meh,
  Settings
} from 'lucide-react';

interface EmotionToneControlProps {
  webcamBehaviorData?: any;
  voiceAnalysisData?: any;
  onToneAdjustment?: (adjustments: ToneAdjustment[]) => void;
  onEmotionalCrisis?: (severity: string) => void;
}

export function EmotionToneControl({ 
  webcamBehaviorData, 
  voiceAnalysisData, 
  onToneAdjustment, 
  onEmotionalCrisis 
}: EmotionToneControlProps) {
  const [emotionManager] = useState(() => new EmotionToneManager());
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionState[]>([]);
  const [activeInterventions, setActiveInterventions] = useState<EmotionalIntervention[]>([]);
  const [toneAdjustments, setToneAdjustments] = useState<ToneAdjustment[]>([]);

  useEffect(() => {
    // Set up emotion manager callbacks
    emotionManager.onEmotionChange((emotion: EmotionState) => {
      setCurrentEmotion(emotion);
      setEmotionHistory(prev => [...prev.slice(-20), emotion]); // Keep last 20 states
    });

    emotionManager.onToneAdjustment((adjustments: ToneAdjustment[]) => {
      setToneAdjustments(adjustments);
      if (onToneAdjustment) {
        onToneAdjustment(adjustments);
      }
    });

    emotionManager.onEmotionalCrisis((crisis) => {
      if (onEmotionalCrisis) {
        onEmotionalCrisis(crisis.severity);
      }
    });

    return () => {
      if (isActive) {
        emotionManager.stopMonitoring();
      }
    };
  }, [emotionManager, isActive, onToneAdjustment, onEmotionalCrisis]);

  // Process new data when it arrives
  useEffect(() => {
    if (!isActive) return;

    try {
      const voiceData = voiceAnalysisData ? convertVoiceData(voiceAnalysisData) : undefined;
      const visualData = webcamBehaviorData ? convertWebcamData(webcamBehaviorData) : undefined;
      const behavioralData = generateBehavioralData(voiceData, visualData);

      emotionManager.processEmotionData(voiceData, visualData, behavioralData);
    } catch (error) {
      console.error('Error processing emotion data:', error);
    }
  }, [webcamBehaviorData, voiceAnalysisData, isActive, emotionManager]);

  const handleStartMonitoring = () => {
    emotionManager.startMonitoring();
    setIsActive(true);
  };

  const handleStopMonitoring = () => {
    emotionManager.stopMonitoring();
    setIsActive(false);
    setCurrentEmotion(null);
    setActiveInterventions([]);
    setToneAdjustments([]);
  };

  const getEmotionEmoji = (emotion: EmotionType): string => {
    const emojiMap: { [key in EmotionType]: string } = {
      [EmotionType.JOY]: '😊',
      [EmotionType.SADNESS]: '😢',
      [EmotionType.ANGER]: '😠',
      [EmotionType.FEAR]: '😨',
      [EmotionType.SURPRISE]: '😲',
      [EmotionType.DISGUST]: '🤢',
      [EmotionType.ANXIETY]: '😰',
      [EmotionType.DEPRESSION]: '😔',
      [EmotionType.EXCITEMENT]: '🤩',
      [EmotionType.CONTENTMENT]: '😌',
      [EmotionType.FRUSTRATION]: '😤',
      [EmotionType.HOPE]: '🌟',
      [EmotionType.SHAME]: '😳',
      [EmotionType.GUILT]: '😞',
      [EmotionType.RELIEF]: '😮‍💨',
      [EmotionType.HYPERVIGILANCE]: '👀',
      [EmotionType.DISSOCIATION]: '😶‍🌫️',
      [EmotionType.EMOTIONAL_NUMBNESS]: '😶',
      [EmotionType.TRIGGER_RESPONSE]: '⚡',
      [EmotionType.NEUTRAL]: '😐',
      [EmotionType.CONFUSED]: '🤔',
      [EmotionType.MIXED]: '🌀'
    };
    return emojiMap[emotion] || '🤔';
  };

  const getEmotionColor = (emotion: EmotionType): string => {
    const colorMap: { [key in EmotionType]: string } = {
      [EmotionType.JOY]: 'text-yellow-600',
      [EmotionType.SADNESS]: 'text-blue-600',
      [EmotionType.ANGER]: 'text-red-600',
      [EmotionType.FEAR]: 'text-purple-600',
      [EmotionType.ANXIETY]: 'text-orange-600',
      [EmotionType.DEPRESSION]: 'text-gray-600',
      [EmotionType.CONTENTMENT]: 'text-green-600',
      [EmotionType.NEUTRAL]: 'text-gray-500',
      [EmotionType.SURPRISE]: 'text-pink-600',
      [EmotionType.DISGUST]: 'text-brown-600',
      [EmotionType.EXCITEMENT]: 'text-red-500',
      [EmotionType.FRUSTRATION]: 'text-red-700',
      [EmotionType.HOPE]: 'text-blue-500',
      [EmotionType.SHAME]: 'text-red-800',
      [EmotionType.GUILT]: 'text-gray-700',
      [EmotionType.RELIEF]: 'text-green-500',
      [EmotionType.HYPERVIGILANCE]: 'text-yellow-700',
      [EmotionType.DISSOCIATION]: 'text-gray-400',
      [EmotionType.EMOTIONAL_NUMBNESS]: 'text-gray-300',
      [EmotionType.TRIGGER_RESPONSE]: 'text-red-900',
      [EmotionType.CONFUSED]: 'text-purple-500',
      [EmotionType.MIXED]: 'text-indigo-600'
    };
    return colorMap[emotion] || 'text-gray-500';
  };

  const renderCurrentEmotion = () => {
    if (!currentEmotion) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primary Emotion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Primary Emotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {getEmotionEmoji(currentEmotion.primaryEmotion)}
              </span>
              <div>
                <div className={`text-lg font-medium capitalize ${getEmotionColor(currentEmotion.primaryEmotion)}`}>
                  {currentEmotion.primaryEmotion.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-600">
                  {(currentEmotion.emotionIntensity * 100).toFixed(0)}% intensity
                </div>
                <div className="text-xs text-gray-500">
                  {(currentEmotion.emotionConfidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            </div>
            
            {/* Intensity Progress */}
            <div className="mt-3">
              <Progress 
                value={currentEmotion.emotionIntensity * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emotional Stability */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Emotional State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Stability</span>
                <Badge variant={currentEmotion.emotionStability > 0.7 ? 'default' : 'destructive'}>
                  {(currentEmotion.emotionStability * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Trend</span>
                <div className="flex items-center gap-1">
                  {currentEmotion.emotionTrend === 'rising' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {currentEmotion.emotionTrend === 'falling' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                  {currentEmotion.emotionTrend === 'stable' && <Meh className="h-3 w-3 text-gray-500" />}
                  <span className="text-sm capitalize">{currentEmotion.emotionTrend}</span>
                </div>
              </div>

              {currentEmotion.rapidChanges && (
                <Badge variant="outline" className="w-full text-center">
                  ⚡ Rapid emotional changes detected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Phase */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Session Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Phase:</span>
                <div className="font-medium capitalize">
                  {currentEmotion.sessionPhase.replace('_', ' ')}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Secondary Emotions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentEmotion.secondaryEmotions.map((emotion, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {getEmotionEmoji(emotion)} {emotion.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMultiModalData = () => {
    if (!currentEmotion) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Voice Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Mic className="h-4 w-4 text-blue-500" />
              Voice Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Pitch: {(currentEmotion.voiceEmotionData.pitch * 100).toFixed(0)}%</div>
              <div>Volume: {(currentEmotion.voiceEmotionData.volume * 100).toFixed(0)}%</div>
              <div>Speed: {(currentEmotion.voiceEmotionData.speed * 100).toFixed(0)}%</div>
              <div>Tremor: {(currentEmotion.voiceEmotionData.tremor * 100).toFixed(0)}%</div>
            </div>
            
            {currentEmotion.voiceEmotionData.stressIndicators.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600">Stress Indicators:</div>
                <div className="flex flex-wrap gap-1">
                  {currentEmotion.voiceEmotionData.stressIndicators.map((indicator, idx) => (
                    <Badge key={idx} variant="destructive" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visual Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-500" />
              Visual Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Eye Contact: {(currentEmotion.visualEmotionData.eyeContactLevel * 100).toFixed(0)}%</div>
              <div>Movement: {(currentEmotion.visualEmotionData.movementEnergy * 100).toFixed(0)}%</div>
              <div>Fidgeting: {(currentEmotion.visualEmotionData.fidgetingLevel * 100).toFixed(0)}%</div>
              <div className="col-span-2">
                Posture: <span className="capitalize">{currentEmotion.visualEmotionData.bodyPosture}</span>
              </div>
            </div>
            
            {currentEmotion.visualEmotionData.microExpressions.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600">Micro-expressions:</div>
                <div className="flex flex-wrap gap-1">
                  {currentEmotion.visualEmotionData.microExpressions.map((expr, idx) => (
                    <span key={idx} className="text-sm">
                      {getEmotionEmoji(expr)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Behavioral Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Behavioral Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Engagement:</span>
                <span>{(currentEmotion.behavioralEmotionData.engagementLevel * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Responsiveness:</span>
                <span>{(currentEmotion.behavioralEmotionData.responsiveness * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Social Connection:</span>
                <span>{(currentEmotion.behavioralEmotionData.socialConnection * 100).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Emotion & Tone Management
          </CardTitle>
          <CardDescription>
            Multi-modal emotional intelligence and adaptive tone control
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            {!isActive ? (
              <Button onClick={handleStartMonitoring} className="bg-red-500 hover:bg-red-600">
                <Heart className="h-4 w-4 mr-2" />
                Start Emotion Monitoring
              </Button>
            ) : (
              <Button onClick={handleStopMonitoring} variant="destructive">
                <Heart className="h-4 w-4 mr-2" />
                Stop Monitoring
              </Button>
            )}
            
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trauma Indicators Alert */}
      {currentEmotion && currentEmotion.traumaIndicators.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Trauma Indicators Detected</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {currentEmotion.traumaIndicators.map((indicator, idx) => (
                <div key={idx} className="text-sm">
                  <strong>{indicator.type}:</strong> {indicator.recommendedResponse}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {isActive && currentEmotion && (
        <Tabs defaultValue="emotion" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emotion">Current Emotion</TabsTrigger>
            <TabsTrigger value="multimodal">Multi-Modal Data</TabsTrigger>
            <TabsTrigger value="tone">Tone Adjustments</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="emotion" className="mt-4">
            {renderCurrentEmotion()}
          </TabsContent>

          <TabsContent value="multimodal" className="mt-4">
            {renderMultiModalData()}
          </TabsContent>

          <TabsContent value="tone" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Active Tone Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {toneAdjustments.length > 0 ? (
                  <div className="space-y-3">
                    {toneAdjustments.map((adjustment, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium capitalize">
                          {adjustment.aspect}: {adjustment.direction} by {(adjustment.magnitude * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {adjustment.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tone adjustments needed - maintaining natural tone
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Recommended Interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentEmotion.recommendedInterventions.length > 0 ? (
                  <div className="space-y-3">
                    {currentEmotion.recommendedInterventions.map((intervention, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="font-medium capitalize">
                            {intervention.type.replace('_', ' ')}
                          </div>
                          <Badge variant={
                            intervention.priority === 'urgent' ? 'destructive' :
                            intervention.priority === 'high' ? 'default' : 'secondary'
                          }>
                            {intervention.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {intervention.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: {intervention.estimatedDuration} minutes
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No interventions needed - emotional state is stable
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>🎨 <strong>Multi-Modal Emotion Intelligence</strong> • Voice + Visual + Behavioral fusion</p>
            <p>🎵 <strong>Adaptive Tone Control</strong> • Real-time response optimization</p>
            <p>🛡️ <strong>Trauma-Informed</strong> • Crisis detection and intervention protocols</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for data conversion
function convertVoiceData(voiceData: any) {
  // Convert voice analysis data to EmotionToneManager format
  return {
    pitch: voiceData.pitch || 0.5,
    volume: voiceData.volume || 0.5, 
    speed: voiceData.speed || 0.5,
    tremor: voiceData.tremor || 0,
    pausePatterns: voiceData.pausePatterns || [],
    breathingRate: voiceData.breathingRate || 0.5,
    emotionFromSpeech: voiceData.emotion || 'neutral',
    stressIndicators: voiceData.stressIndicators || []
  };
}

function convertWebcamData(webcamData: any) {
  // Convert webcam behavior data to EmotionToneManager format
  return {
    facialExpression: webcamData.dominantExpression || 'neutral',
    microExpressions: webcamData.microExpressions || [],
    eyeContactLevel: webcamData.eyeContactLevel || 0.5,
    bodyPosture: webcamData.postureQuality === 'upright' ? 'open' : 'closed',
    movementEnergy: webcamData.movementProportion || 0,
    fidgetingLevel: webcamData.repetitiveMovements?.length || 0,
    muscularTension: 0.5
  };
}

function generateBehavioralData(voiceData: any, visualData: any) {
  // Generate behavioral data from voice and visual inputs
  return {
    engagementLevel: visualData ? visualData.eyeContactLevel : 0.5,
    responsiveness: voiceData ? Math.min(voiceData.volume + voiceData.speed, 1.0) : 0.5,
    socialConnection: 0.5, // Would be calculated based on conversation patterns
    coping_strategies_used: [],
    avoidance_behaviors: visualData?.eyeContactLevel < 0.3 ? ['avoiding_eye_contact'] : [],
    help_seeking_behaviors: []
  };
}