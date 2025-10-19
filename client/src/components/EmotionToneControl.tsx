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
    const colorMap: Record<EmotionType, string> = {
      [EmotionType.JOY]: 'text-highlight',           // Sky Glow Teal for positive emotions
      [EmotionType.SADNESS]: 'text-primary',        // Electric Cyan for calm emotions
      [EmotionType.ANGER]: 'text-red-400',          // Softer red for intensity
      [EmotionType.FEAR]: 'text-purple-400',        // Softer purple
      [EmotionType.ANXIETY]: 'text-orange-400',     // Softer orange
      [EmotionType.DEPRESSION]: 'text-iceblue/60',  // Muted ice blue
      [EmotionType.CONTENTMENT]: 'text-highlight',  // Sky Glow Teal for positive states
      [EmotionType.NEUTRAL]: 'text-iceblue',        // Neon Ice Blue for neutral
      [EmotionType.SURPRISE]: 'text-primary',       // Electric Cyan for surprise
      [EmotionType.DISGUST]: 'text-yellow-600',     // Yellow-brown for disgust
      [EmotionType.EXCITEMENT]: 'text-highlight',   // Sky Glow Teal for excitement
      [EmotionType.FRUSTRATION]: 'text-red-500',    // Red for frustration
      [EmotionType.HOPE]: 'text-primary',           // Electric Cyan for hope
      [EmotionType.SHAME]: 'text-red-600',          // Deeper red for shame
      [EmotionType.GUILT]: 'text-iceblue/70',       // Muted ice blue for guilt
      [EmotionType.RELIEF]: 'text-highlight',       // Sky Glow Teal for relief
      [EmotionType.HYPERVIGILANCE]: 'text-yellow-500', // Yellow for hypervigilance
      [EmotionType.DISSOCIATION]: 'text-iceblue/50',   // Very muted ice blue
      [EmotionType.EMOTIONAL_NUMBNESS]: 'text-iceblue/40', // Barely visible ice blue
      [EmotionType.TRIGGER_RESPONSE]: 'text-red-700',      // Deep red for triggers
      [EmotionType.CONFUSED]: 'text-primary/70',           // Muted electric cyan
      [EmotionType.MIXED]: 'text-highlight/80'             // Muted sky glow teal
    };
    return colorMap[emotion] || 'text-iceblue';
  };

  const renderCurrentEmotion = () => {
    if (!currentEmotion) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primary Emotion */}
        <Card className="bg-indigo/60 border-primary/20 backdrop-blur-lg shadow-power">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-iceblue">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-sm opacity-40 rounded-full"></div>
                <Heart className="h-4 w-4 text-primary relative z-10" />
              </div>
              Current Emotion
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-darkbg/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-highlight/20 blur-xl rounded-full animate-christman-pulse"></div>
                <span className="text-4xl relative z-10" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}>
                  {getEmotionEmoji(currentEmotion.primaryEmotion)}
                </span>
              </div>
              <div>
                <div className={`text-lg font-medium capitalize ${getEmotionColor(currentEmotion.primaryEmotion)} drop-shadow-lg`}
                     style={{ textShadow: '0 0 4px currentColor' }}>
                  {currentEmotion.primaryEmotion.replace('_', ' ')}
                </div>
                <div className="text-sm text-iceblue/70">
                  Confidence: {Math.round(currentEmotion.confidence * 100)}%
                </div>
                <div className="text-xs text-iceblue/50">
                  Last updated: {new Date(currentEmotion.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <Progress 
                value={currentEmotion.confidence * 100} 
                className="h-3 bg-indigo/50"
                style={{
                  background: 'linear-gradient(to right, rgba(55, 200, 255, 0.2), rgba(53, 228, 185, 0.2))'
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Emotional Stability */}
        <Card className="bg-indigo/60 border-highlight/20 backdrop-blur-lg shadow-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-iceblue">
              <div className="relative">
                <div className="absolute inset-0 bg-highlight blur-sm opacity-40 rounded-full animate-pulse"></div>
                <Activity className="h-4 w-4 text-highlight relative z-10" />
              </div>
              Emotional State
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-darkbg/30 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-iceblue/80">Stability</span>
                <Badge 
                  variant={currentEmotion.emotionStability > 0.7 ? 'default' : 'destructive'}
                  className={currentEmotion.emotionStability > 0.7 
                    ? 'bg-highlight/20 text-highlight border-highlight/30' 
                    : 'bg-red-500/20 text-red-400 border-red-400/30'
                  }
                >
                  {(currentEmotion.emotionStability * 100).toFixed(0)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-iceblue/80">Trend</span>
                <div className="flex items-center gap-1">
                  {currentEmotion.emotionTrend === 'rising' && <TrendingUp className="h-3 w-3 text-highlight" style={{ filter: 'drop-shadow(0 0 4px #35E4B9)' }} />}
                  {currentEmotion.emotionTrend === 'falling' && <TrendingUp className="h-3 w-3 text-red-400 rotate-180" style={{ filter: 'drop-shadow(0 0 4px #f87171)' }} />}
                  {currentEmotion.emotionTrend === 'stable' && <Meh className="h-3 w-3 text-primary" style={{ filter: 'drop-shadow(0 0 4px #37C8FF)' }} />}
                  <span className="text-sm capitalize text-iceblue/70">{currentEmotion.emotionTrend}</span>
                </div>
              </div>

              {currentEmotion.rapidChanges && (
                <Badge variant="outline" className="w-full text-center bg-indigo/30 border-primary/30 text-primary animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Rapid emotional changes detected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Phase */}
        <Card className="bg-indigo/60 border-primary/20 backdrop-blur-lg shadow-christman">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-iceblue">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-sm opacity-40 rounded-full animate-christman-pulse"></div>
                <Zap className="h-4 w-4 text-primary relative z-10" />
              </div>
              Session Context
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-darkbg/30 rounded-lg">
            <div className="space-y-2">
              <div>
                <span className="text-sm text-iceblue/60">Phase:</span>
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
    <div className="w-full max-w-6xl mx-auto space-y-6 relative">
      {/* Christman AI Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkbg via-indigo to-darkbg rounded-3xl opacity-50 blur-3xl -z-10"></div>
      
      {/* Header */}
      <Card className="bg-indigo/80 border-primary/30 backdrop-blur-xl shadow-christman">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-iceblue">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-50 rounded-full animate-christman-pulse"></div>
              <Heart className="h-6 w-6 text-primary relative z-10" style={{ filter: 'drop-shadow(0 0 8px #37C8FF)' }} />
            </div>
            <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent font-bold">
              Emotion & Tone Management
            </span>
          </CardTitle>
          <CardDescription className="text-iceblue/70">
            Multi-modal emotional intelligence powered by <span className="text-highlight font-semibold">The Christman AI Project</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="bg-darkbg/50 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {!isActive ? (
              <Button 
                onClick={handleStartMonitoring} 
                className="bg-power-gradient hover:shadow-glow text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-105"
                style={{ 
                  boxShadow: '0 10px 20px rgba(55, 200, 255, 0.4)', 
                  textShadow: '0 0 4px #37C8FF' 
                }}
              >
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