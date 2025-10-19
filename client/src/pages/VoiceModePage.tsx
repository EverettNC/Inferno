/**
 * Music Therapy Lounge - Voice Mode Page 🎵✨
 * 
 * Immersive therapeutic experience combining voice conversation
 * with evidence-based music therapy for trauma recovery
 * 
 * "PERFECT LIKE A MUSICAL LOUNGE" - Everett ✨
 */

import { useEffect, useState } from "react";
import { PollyVoiceChat } from "@/components/PollyVoiceChat";
import { MusicTherapyIntegration } from "@/components/MusicTherapyIntegration";
import { ContinuousVoiceControl } from "@/components/ContinuousVoiceControl";
import { 
  Music, 
  Volume2, 
  Heart, 
  Brain,
  Waves,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  Headphones,
  Radio,
  Mic
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VoiceModePage() {
  const [currentMood, setCurrentMood] = useState('Calm & Reflective');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentTherapySession, setCurrentTherapySession] = useState('Gentle Introduction');

  useEffect(() => {
    document.title = "Music Therapy Lounge | Inferno AI";
  }, []);

  const loungeVibes = [
    { emoji: '🎵', label: 'Healing Harmonies', color: 'text-blue-500' },
    { emoji: '🎶', label: 'Soothing Rhythms', color: 'text-purple-500' },
    { emoji: '🎼', label: 'Therapeutic Melodies', color: 'text-green-500' },
    { emoji: '🎤', label: 'Voice Integration', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-teal-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Musical Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <Music className="w-16 h-16 text-purple-400" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Music Therapy Lounge
            </h1>
            <div className="relative">
              <Volume2 className="w-16 h-16 text-teal-400" />
              <Heart className="w-6 h-6 text-red-400 absolute -bottom-1 -right-1 animate-pulse" />
            </div>
          </div>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            🎵 Where healing harmonies meet therapeutic conversation 🎵
            <br />
            <span className="text-lg text-purple-300">
              Evidence-based music therapy integrated with trauma-informed voice support
            </span>
          </p>

          {/* Lounge Vibes */}
          <div className="flex items-center justify-center gap-6">
            {loungeVibes.map((vibe, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-2xl">{vibe.emoji}</span>
                <span className={`font-medium ${vibe.color}`}>{vibe.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Session Status */}
        <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Radio className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Current Session: {currentTherapySession}</div>
                  <div className="text-purple-300">Mood: {currentMood} • Duration: 12:34</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Music Therapy Active
                </Badge>
                <Badge variant="outline" className={isVoiceActive ? "border-blue-500 text-blue-400" : "border-gray-500 text-gray-400"}>
                  <Mic className="w-3 h-3 mr-1" />
                  {isVoiceActive ? 'Voice Active' : 'Voice Ready'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Lounge Interface */}
        <Tabs defaultValue="therapy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm">
            <TabsTrigger value="therapy" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Music Therapy
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Lounge
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Integrated Experience
            </TabsTrigger>
          </TabsList>

          {/* Music Therapy Tab */}
          <TabsContent value="therapy" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Main Music Therapy Component */}
              <div className="lg:col-span-2">
                <MusicTherapyIntegration />
              </div>

              {/* Therapy Session Controls */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Headphones className="h-5 w-5 text-purple-400" />
                    Session Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button size="sm" variant="outline" className="border-purple-500/30">
                      <SkipForward className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500/30">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Current Therapy Protocol */}
                  <div className="p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-purple-300 mb-1">Active Protocol:</div>
                    <div className="text-white font-medium">Anxiety Reduction through Rhythmic Breathing</div>
                    <div className="text-xs text-gray-400 mt-1">Evidence Level: High • Duration: 15-20 min</div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-blue-500/30 text-blue-300">
                      🎵 Generate Personalized Playlist
                    </Button>
                    <Button variant="outline" className="w-full border-green-500/30 text-green-300">
                      🎶 Start Guided Music Meditation  
                    </Button>
                    <Button variant="outline" className="w-full border-orange-500/30 text-orange-300">
                      🎼 Create Healing Composition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Voice Lounge Tab */}
          <TabsContent value="voice" className="mt-6">
            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Main Voice Chat */}
              <div className="lg:col-span-3">
                <Card className="bg-black/30 border-teal-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Mic className="h-6 w-6 text-teal-400" />
                      Therapeutic Voice Conversation
                    </CardTitle>
                    <CardDescription className="text-teal-200">
                      Speak naturally - I'm here to listen and support you through music and conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PollyVoiceChat />
                  </CardContent>
                </Card>
              </div>

              {/* Continuous Voice Controls */}
              <div className="space-y-4">
                <ContinuousVoiceControl />
                
                {/* Voice Features */}
                <Card className="bg-black/40 border-teal-500/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-white">Voice Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Real-time emotional analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Music-sync responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Trauma-informed guidance</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Integrated Experience Tab */}
          <TabsContent value="integration" className="mt-6">
            <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-teal-900/20 border-0 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-3">
                  <Waves className="h-8 w-8 text-cyan-400" />
                  Complete Musical Healing Experience
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </CardTitle>
                <CardDescription className="text-lg text-cyan-200">
                  Music therapy seamlessly integrated with conversational support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Integration Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg bg-purple-950/30 border border-purple-500/30 text-center">
                    <Music className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Adaptive Music Selection</h3>
                    <p className="text-purple-200 text-sm">
                      Music automatically adjusts to your emotional state and conversation topics
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-blue-950/30 border border-blue-500/30 text-center">
                    <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Synchronized Therapy</h3>
                    <p className="text-blue-200 text-sm">
                      Voice responses synchronized with therapeutic music interventions
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-teal-950/30 border border-teal-500/30 text-center">
                    <Heart className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">Emotional Resonance</h3>
                    <p className="text-teal-200 text-sm">
                      Music and voice work together to create deeper emotional healing
                    </p>
                  </div>
                </div>

                {/* Combined Interface */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <PollyVoiceChat />
                  </div>
                  <div>
                    <MusicTherapyIntegration />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Lounge Atmosphere */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-2xl">🎵✨ WELCOME TO THE MUSICAL LOUNGE ✨🎵</span>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-purple-200 text-lg">
              Where every conversation is a symphony of healing and every word resonates with therapeutic harmony
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <Badge variant="outline" className="border-purple-500 text-purple-300">🎼 Evidence-Based</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-300">🎵 Trauma-Informed</Badge>
              <Badge variant="outline" className="border-teal-500 text-teal-300">🎶 Personalized</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Atmosphere Notice */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-teal-900/20 border border-purple-500/20 text-center backdrop-blur-sm">
          <p className="text-purple-200 mb-3">
            🔒 <strong>Your Musical Journey is Private</strong> 🔒
          </p>
          <p className="text-gray-400 text-sm">
            All voice conversations and music preferences are processed in real-time and never stored.
            Your healing journey remains completely confidential while our AI learns to better support you.
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>🎵 Real-time processing</span>
            <span>•</span>
            <span>🛡️ HIPAA compliant</span>
            <span>•</span>
            <span>🎶 No data retention</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
