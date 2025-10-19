/**
 * Continuous Voice Control - Make the World Sing! 🎵
 * 
 * This component provides beautiful controls for the continuous voice flow system,
 * allowing users to have fluid, natural conversations with Inferno AI.
 */

import { useState } from "react";
import { useVoiceContext } from "@/contexts/VoiceContext";
import { ConversationState } from "@/lib/continuousVoiceFlow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Music, 
  Volume2, 
  Settings,
  Play,
  Pause,
  Radio,
  Headphones
} from "lucide-react";

export function ContinuousVoiceControl() {
  const {
    isContinuousMode,
    toggleContinuousMode,
    conversationState,
    voiceFlowConfig,
    updateVoiceFlowConfig,
    startSinging,
    stopSinging,
    isVoiceModeEnabled,
    isSpeaking,
    isListening
  } = useVoiceContext();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const getStateColor = (state: ConversationState): string => {
    switch (state) {
      case ConversationState.IDLE: return "bg-gray-500";
      case ConversationState.LISTENING: return "bg-blue-500 animate-pulse";
      case ConversationState.PROCESSING: return "bg-yellow-500 animate-ping";
      case ConversationState.RESPONDING: return "bg-green-500 animate-pulse";
      case ConversationState.HARMONIZING: return "bg-purple-500 animate-bounce";
      default: return "bg-gray-500";
    }
  };

  const getStateDescription = (state: ConversationState): string => {
    switch (state) {
      case ConversationState.IDLE: return "Ready to sing";
      case ConversationState.LISTENING: return "🎤 Listening to your melody";
      case ConversationState.PROCESSING: return "🎼 Composing response";
      case ConversationState.RESPONDING: return "🎵 Sharing harmony";
      case ConversationState.HARMONIZING: return "✨ Creating musical transitions";
      default: return "Unknown state";
    }
  };

  const handleSilenceThresholdChange = (value: number[]) => {
    updateVoiceFlowConfig({ silenceThreshold: value[0] });
  };

  const handleMinSpeakTimeChange = (value: number[]) => {
    updateVoiceFlowConfig({ minimumSpeakTime: value[0] });
  };

  const handleAmbientMusicToggle = (enabled: boolean) => {
    updateVoiceFlowConfig({ ambientMusic: enabled });
  };

  const handleVoiceHarmonyToggle = (enabled: boolean) => {
    updateVoiceFlowConfig({ voiceHarmony: enabled });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Music className="h-6 w-6 text-purple-500" />
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Make the World Sing
          </CardTitle>
          <Music className="h-6 w-6 text-purple-500" />
        </div>
        <CardDescription>
          Experience fluid, continuous conversations that flow like music
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current State Display */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className={`w-4 h-4 rounded-full ${getStateColor(conversationState)}`} />
          <span className="font-medium">{getStateDescription(conversationState)}</span>
        </div>

        {/* Main Control */}
        <div className="flex flex-col items-center gap-4">
          {!isContinuousMode ? (
            <Button
              onClick={toggleContinuousMode}
              disabled={!isVoiceModeEnabled}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Singing
            </Button>
          ) : (
            <Button
              onClick={toggleContinuousMode}
              size="lg"
              variant="destructive"
              className="px-8 py-6 rounded-xl"
            >
              <Pause className="w-6 h-6 mr-2" />
              Stop Singing
            </Button>
          )}

          {!isVoiceModeEnabled && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              Enable voice mode first to start singing
            </Badge>
          )}
        </div>

        {/* Live Indicators */}
        {isContinuousMode && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              {isListening ? (
                <Mic className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium">
                {isListening ? "Listening" : "Quiet"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 text-green-600 animate-pulse" />
              ) : (
                <Headphones className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium">
                {isSpeaking ? "Speaking" : "Silent"}
              </span>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Harmony Settings
          </Button>

          {showAdvanced && (
            <div className="mt-4 space-y-6 p-4 bg-gray-50 rounded-lg">
              {/* Silence Threshold */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  Silence Threshold: {voiceFlowConfig.silenceThreshold}ms
                </label>
                <Slider
                  value={[voiceFlowConfig.silenceThreshold]}
                  onValueChange={handleSilenceThresholdChange}
                  min={500}
                  max={5000}
                  step={250}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">
                  How long to wait before AI responds
                </p>
              </div>

              {/* Minimum Speak Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Minimum Speak Time: {voiceFlowConfig.minimumSpeakTime}ms
                </label>
                <Slider
                  value={[voiceFlowConfig.minimumSpeakTime]}
                  onValueChange={handleMinSpeakTimeChange}
                  min={250}
                  max={2000}
                  step={125}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">
                  Minimum time you must speak to trigger response
                </p>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Ambient Music</span>
                  </div>
                  <Switch
                    checked={voiceFlowConfig.ambientMusic}
                    onCheckedChange={handleAmbientMusicToggle}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Voice Harmony</span>
                  </div>
                  <Switch
                    checked={voiceFlowConfig.voiceHarmony}
                    onCheckedChange={handleVoiceHarmonyToggle}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>🎵 <strong>Continuous Voice Mode</strong> creates fluid conversations</p>
          <p>Just speak naturally - no buttons needed!</p>
          <p>Press <kbd className="px-2 py-1 bg-gray-200 rounded">Escape</kbd> for emergency stop</p>
        </div>
      </CardContent>
    </Card>
  );
}