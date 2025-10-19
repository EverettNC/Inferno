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
    
    // Add dynamic Christman AI 3D particle effect styles
    const style = document.createElement('style')
    style.textContent = `
      .glow-text {
        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
      }
      .floating-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #37C8FF, #35E4B9);
        border-radius: 50%;
        animation: christman-float 6s ease-in-out infinite;
        box-shadow: 0 0 10px currentColor;
      }
      @keyframes christman-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
      }
      .pulse-glow {
        animation: christman-pulse-glow 2s ease-in-out infinite;
      }
      @keyframes christman-pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(55, 200, 255, 0.4);
        }
        50% { 
          box-shadow: 0 0 40px rgba(53, 228, 185, 0.7), 0 0 60px rgba(55, 200, 255, 0.5);
        }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, []);

  const loungeVibes = [
    { emoji: '🎵', label: 'Healing Harmonies', color: 'text-blue-500' },
    { emoji: '🎶', label: 'Soothing Rhythms', color: 'text-purple-500' },
    { emoji: '🎼', label: 'Therapeutic Melodies', color: 'text-green-500' },
    { emoji: '🎤', label: 'Voice Integration', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkbg via-indigo to-darkbg p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced Christman AI Floating Particles */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-60 animate-bounce animate-christman-pulse" style={{ animationDelay: '0s', animationDuration: '3s', filter: 'drop-shadow(0 0 15px #37C8FF)' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-highlight rounded-full opacity-70 animate-bounce animate-christman-pulse" style={{ animationDelay: '1s', animationDuration: '4s', filter: 'drop-shadow(0 0 12px #35E4B9)' }}></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-primary rounded-full opacity-50 animate-bounce animate-christman-pulse" style={{ animationDelay: '2s', animationDuration: '5s', filter: 'drop-shadow(0 0 18px #37C8FF)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-highlight rounded-full opacity-80 animate-bounce animate-christman-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.5s', filter: 'drop-shadow(0 0 10px #35E4B9)' }}></div>
        
        {/* Additional Christman AI Elements */}
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-christman-glow rounded-full opacity-40 animate-bounce" style={{ animationDelay: '3s', animationDuration: '6s', filter: 'blur(0.5px) drop-shadow(0 0 15px currentColor)' }}></div>
        <div className="absolute bottom-40 right-1/4 w-4 h-4 bg-power-gradient rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.5s', filter: 'blur(0.5px) drop-shadow(0 0 12px currentColor)' }}></div>
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-iceblue rounded-full opacity-60 animate-bounce" style={{ animationDelay: '4s', animationDuration: '3s', filter: 'drop-shadow(0 0 8px #B5E6FF)' }}></div>
        
        {/* 3D Geometric Shapes */}
        <div className="absolute top-16 right-16 w-20 h-20 border-2 border-primary/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 left-16 w-16 h-16 border-2 border-highlight/30 rotate-12 animate-pulse"></div>
        
        {/* Flowing Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-20">
            <defs>
              <linearGradient id="christmanFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#37C8FF', stopOpacity: 0.4 }} />
                <stop offset="50%" style={{ stopColor: '#35E4B9', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#37C8FF', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
            <path d="M0,100 Q300,50 600,100 T1200,100" stroke="url(#christmanFlowGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M0,300 Q400,250 800,300 T1600,300" stroke="url(#christmanFlowGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Musical Header with 3D Effects */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="relative transform hover:scale-110 transition-all duration-500">
              <div className="absolute inset-0 bg-primary blur-xl opacity-30 rounded-full animate-christman-pulse"></div>
              <Music className="w-16 h-16 text-primary relative z-10 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px #37C8FF)' }} />
              <Sparkles className="w-6 h-6 text-highlight absolute -top-2 -right-2 animate-pulse drop-shadow-lg" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-christman-glow blur-2xl opacity-20 rounded-lg animate-pulse"></div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#00A7FF] via-[#FF6A2E] to-[#00A7FF] bg-clip-text text-transparent relative z-10 drop-shadow-2xl" 
                  style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Music Therapy Lounge
              </h1>
            </div>
            <div className="relative transform hover:scale-110 transition-all duration-500">
              <div className="absolute inset-0 bg-[#FF6A2E] blur-xl opacity-30 rounded-full animate-pulse"></div>
              <Volume2 className="w-16 h-16 text-[#FF6A2E] relative z-10 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px #FF6A2E)' }} />
              <Heart className="w-6 h-6 text-[#00A7FF] absolute -bottom-1 -right-1 animate-pulse drop-shadow-lg" />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF]/10 to-[#FF6A2E]/10 blur-xl rounded-lg"></div>
            <p className="text-2xl text-white max-w-4xl mx-auto relative z-10 drop-shadow-lg">
              🎵 <span className="text-[#00A7FF] font-semibold glow-text">Where healing harmonies meet therapeutic conversation</span> 🎵
              <br />
              <span className="text-lg text-[#FF6A2E] glow-text">
                Evidence-based music therapy integrated with trauma-informed voice support
              </span>
            </p>
          </div>

          {/* Lounge Vibes with 3D Effects */}
          <div className="flex items-center justify-center gap-8">
            {loungeVibes.map((vibe, idx) => (
              <div key={idx} className="group flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-[#00A7FF]/20 hover:border-[#FF6A2E]/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF]/20 to-[#FF6A2E]/20 blur-md rounded-full group-hover:blur-lg transition-all"></div>
                  <span className="text-3xl relative z-10 drop-shadow-lg group-hover:animate-bounce">{vibe.emoji}</span>
                </div>
                <span className={`font-medium text-white group-hover:text-[#00A7FF] transition-colors drop-shadow-lg`}>
                  {vibe.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Session Status with 3D Effects */}
        <Card className="bg-black/40 border-[#00A7FF]/30 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF]/5 to-[#FF6A2E]/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A7FF] to-[#FF6A2E]"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative p-3 bg-[#00A7FF]/20 rounded-full border border-[#00A7FF]/30">
                  <div className="absolute inset-0 bg-[#00A7FF] blur-md opacity-20 rounded-full animate-pulse"></div>
                  <Radio className="w-6 h-6 text-[#00A7FF] relative z-10 drop-shadow-lg" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg drop-shadow-lg">Current Session: <span className="text-[#00A7FF]">{currentTherapySession}</span></div>
                  <div className="text-[#FF6A2E] drop-shadow-lg">Mood: <span className="text-white">{currentMood}</span> • Duration: <span className="text-[#00A7FF]">12:34</span></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#00A7FF] text-[#00A7FF] bg-[#00A7FF]/10 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-[#00A7FF] rounded-full mr-2 animate-pulse drop-shadow-lg"></div>
                  Music Therapy Active
                </Badge>
                <Badge variant="outline" className={`border-[#FF6A2E] text-[#FF6A2E] bg-[#FF6A2E]/10 backdrop-blur-sm`}>
                  <Mic className="w-3 h-3 mr-1 drop-shadow-lg" />
                  {isVoiceActive ? 'Voice Active' : 'Voice Ready'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Lounge Interface with 3D Tabs */}
        <Tabs defaultValue="therapy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-md border border-[#00A7FF]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF]/10 via-transparent to-[#FF6A2E]/10"></div>
            <TabsTrigger value="therapy" className="flex items-center gap-2 relative z-10 data-[state=active]:bg-[#00A7FF]/20 data-[state=active]:text-[#00A7FF] transition-all duration-300 hover:bg-[#00A7FF]/10 transform hover:scale-105">
              <Music className="h-4 w-4 drop-shadow-lg" />
              <span className="drop-shadow-lg">Music Therapy</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2 relative z-10 data-[state=active]:bg-[#FF6A2E]/20 data-[state=active]:text-[#FF6A2E] transition-all duration-300 hover:bg-[#FF6A2E]/10 transform hover:scale-105">
              <Volume2 className="h-4 w-4 drop-shadow-lg" />
              <span className="drop-shadow-lg">Voice Lounge</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2 relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00A7FF]/20 data-[state=active]:to-[#FF6A2E]/20 transition-all duration-300 hover:bg-[#00A7FF]/10 transform hover:scale-105">
              <Waves className="h-4 w-4 drop-shadow-lg" />
              <span className="drop-shadow-lg">Integrated Experience</span>
            </TabsTrigger>
          </TabsList>

          {/* Music Therapy Tab */}
          <TabsContent value="therapy" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Main Music Therapy Component */}
              <div className="lg:col-span-2">
                <MusicTherapyIntegration />
              </div>

              {/* Therapy Session Controls with 3D Effects */}
              <Card className="bg-black/50 border-[#00A7FF]/30 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00A7FF]/5 to-[#FF6A2E]/5"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#00A7FF] blur-md opacity-30 rounded-full animate-pulse"></div>
                      <Headphones className="h-5 w-5 text-[#00A7FF] relative z-10" />
                    </div>
                    Session Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  
                  {/* 3D Playback Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button size="sm" variant="outline" className="border-[#00A7FF]/50 text-[#00A7FF] hover:bg-[#00A7FF]/20 transform hover:scale-110 transition-all duration-300">
                      <SkipForward className="h-4 w-4 rotate-180 drop-shadow-lg" />
                    </Button>
                    <Button size="lg" className="bg-gradient-to-r from-[#00A7FF] to-[#FF6A2E] hover:from-[#FF6A2E] hover:to-[#00A7FF] transform hover:scale-110 transition-all duration-500 shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px #00A7FF)' }}>
                      <Play className="h-5 w-5 drop-shadow-lg" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#FF6A2E]/50 text-[#FF6A2E] hover:bg-[#FF6A2E]/20 transform hover:scale-110 transition-all duration-300">
                      <SkipForward className="h-4 w-4 drop-shadow-lg" />
                    </Button>
                  </div>

                  {/* Current Therapy Protocol with 3D Effect */}
                  <div className="p-4 bg-black/40 rounded-lg border border-[#00A7FF]/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF]/5 to-[#FF6A2E]/5"></div>
                    <div className="relative z-10">
                      <div className="text-sm text-[#00A7FF] mb-1 drop-shadow-lg">Active Protocol:</div>
                      <div className="text-white font-medium drop-shadow-lg">Anxiety Reduction through Rhythmic Breathing</div>
                      <div className="text-xs text-[#FF6A2E] mt-1 drop-shadow-lg">Evidence Level: High • Duration: 15-20 min</div>
                    </div>
                  </div>

                  {/* 3D Quick Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-[#00A7FF]/50 text-[#00A7FF] hover:bg-[#00A7FF]/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                      🎵 Generate Personalized Playlist
                    </Button>
                    <Button variant="outline" className="w-full border-[#FF6A2E]/50 text-[#FF6A2E] hover:bg-[#FF6A2E]/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                      🎶 Start Guided Music Meditation  
                    </Button>
                    <Button variant="outline" className="w-full border-[#00A7FF]/50 text-white hover:bg-gradient-to-r hover:from-[#00A7FF]/20 hover:to-[#FF6A2E]/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                      🎼 Create Healing Composition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Voice Lounge Tab with 3D Design */}
          <TabsContent value="voice" className="mt-6">
            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Main Voice Chat with 3D Effects */}
              <div className="lg:col-span-3">
                <Card className="bg-black/50 border-[#FF6A2E]/30 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A2E]/5 to-[#00A7FF]/5"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6A2E] to-[#00A7FF]"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#FF6A2E] blur-md opacity-30 rounded-full animate-pulse"></div>
                        <Mic className="h-6 w-6 text-[#FF6A2E] relative z-10" />
                      </div>
                      Therapeutic Voice Conversation
                    </CardTitle>
                    <CardDescription className="text-[#00A7FF] drop-shadow-lg">
                      Speak naturally - I'm here to listen and support you through music and conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <PollyVoiceChat />
                  </CardContent>
                </Card>
              </div>

              {/* Continuous Voice Controls with 3D */}
              <div className="space-y-4">
                <ContinuousVoiceControl />
                
                {/* Voice Features with 3D Effects */}
                <Card className="bg-black/50 border-[#00A7FF]/30 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00A7FF]/5 to-[#FF6A2E]/5"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-sm text-white drop-shadow-lg">Voice Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 group hover:transform hover:translate-x-2 transition-all duration-300">
                      <div className="w-2 h-2 bg-[#00A7FF] rounded-full animate-pulse drop-shadow-lg group-hover:scale-150 transition-all"></div>
                      <span className="text-sm text-white drop-shadow-lg">Real-time emotional analysis</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:transform hover:translate-x-2 transition-all duration-300">
                      <div className="w-2 h-2 bg-[#FF6A2E] rounded-full animate-pulse drop-shadow-lg group-hover:scale-150 transition-all" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-sm text-white drop-shadow-lg">Music-sync responses</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:transform hover:translate-x-2 transition-all duration-300">
                      <div className="w-2 h-2 bg-[#00A7FF] rounded-full animate-pulse drop-shadow-lg group-hover:scale-150 transition-all" style={{ animationDelay: '1s' }}></div>
                      <span className="text-sm text-white drop-shadow-lg">Trauma-informed guidance</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Integrated Experience Tab with Full 3D */}
          <TabsContent value="integration" className="mt-6">
            <Card className="bg-black/50 border-0 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A7FF]/10 via-black/20 to-[#FF6A2E]/10"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00A7FF] via-[#FF6A2E] to-[#00A7FF] animate-pulse"></div>
              
              <CardHeader className="text-center relative z-10">
                <CardTitle className="text-3xl text-white flex items-center justify-center gap-4 drop-shadow-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00A7FF] blur-xl opacity-40 rounded-full animate-pulse"></div>
                    <Waves className="h-10 w-10 text-[#00A7FF] relative z-10" style={{ filter: 'drop-shadow(0 0 20px #00A7FF)' }} />
                  </div>
                  <span className="bg-gradient-to-r from-[#00A7FF] via-[#FF6A2E] to-[#00A7FF] bg-clip-text text-transparent">
                    Complete Musical Healing Experience
                  </span>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FF6A2E] blur-xl opacity-40 rounded-full animate-pulse"></div>
                    <Sparkles className="h-10 w-10 text-[#FF6A2E] relative z-10" style={{ filter: 'drop-shadow(0 0 20px #FF6A2E)' }} />
                  </div>
                </CardTitle>
                <CardDescription className="text-xl text-[#00A7FF] drop-shadow-lg">
                  Music therapy seamlessly integrated with conversational support
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                
                {/* 3D Integration Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="group p-6 rounded-lg bg-black/40 border border-[#00A7FF]/30 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00A7FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-[#00A7FF] blur-lg opacity-30 rounded-full group-hover:blur-xl group-hover:opacity-50 transition-all duration-500"></div>
                        <Music className="w-12 h-12 text-[#00A7FF] mx-auto relative z-10 drop-shadow-lg" />
                      </div>
                      <h3 className="text-white font-semibold mb-2 drop-shadow-lg">Adaptive Music Selection</h3>
                      <p className="text-[#00A7FF] text-sm drop-shadow-lg">
                        Music automatically adjusts to your emotional state and conversation topics
                      </p>
                    </div>
                  </div>

                  <div className="group p-6 rounded-lg bg-black/40 border border-[#FF6A2E]/30 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A2E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-[#FF6A2E] blur-lg opacity-30 rounded-full group-hover:blur-xl group-hover:opacity-50 transition-all duration-500"></div>
                        <Brain className="w-12 h-12 text-[#FF6A2E] mx-auto relative z-10 drop-shadow-lg" />
                      </div>
                      <h3 className="text-white font-semibold mb-2 drop-shadow-lg">Synchronized Therapy</h3>
                      <p className="text-[#FF6A2E] text-sm drop-shadow-lg">
                        Voice responses synchronized with therapeutic music interventions
                      </p>
                    </div>
                  </div>

                  <div className="group p-6 rounded-lg bg-black/40 border border-[#00A7FF]/30 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00A7FF]/5 to-[#FF6A2E]/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00A7FF] to-[#FF6A2E] blur-lg opacity-30 rounded-full group-hover:blur-xl group-hover:opacity-50 transition-all duration-500"></div>
                        <Heart className="w-12 h-12 text-white mx-auto relative z-10 drop-shadow-lg" />
                      </div>
                      <h3 className="text-white font-semibold mb-2 drop-shadow-lg">Emotional Resonance</h3>
                      <p className="text-white text-sm drop-shadow-lg">
                        Music and voice work together to create deeper emotional healing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Combined Interface with 3D Effects */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A2E]/5 to-transparent rounded-lg"></div>
                    <PollyVoiceChat />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-l from-[#00A7FF]/5 to-transparent rounded-lg"></div>
                    <MusicTherapyIntegration />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 3D Christman AI Lounge Atmosphere */}
        <Card className="bg-indigo/40 border-primary/30 backdrop-blur-md relative overflow-hidden shadow-christman">
          <div className="absolute inset-0 bg-christman-glow opacity-5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-power-gradient animate-pulse"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-highlight blur-lg opacity-50 rounded-full animate-christman-pulse"></div>
                <Sparkles className="w-8 h-8 text-highlight relative z-10 animate-bounce" style={{ filter: 'drop-shadow(0 0 10px #35E4B9)' }} />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-christman-glow blur-xl opacity-30 rounded-lg"></div>
                <span className="text-3xl bg-christman-glow bg-clip-text text-transparent font-bold relative z-10 drop-shadow-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  🎵✨ THE CHRISTMAN AI MUSICAL LOUNGE ✨🎵
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-50 rounded-full animate-christman-pulse"></div>
                <Sparkles className="w-8 h-8 text-primary relative z-10 animate-bounce" style={{ filter: 'drop-shadow(0 0 10px #37C8FF)', animationDelay: '0.5s' }} />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-highlight/10 blur-xl rounded-lg"></div>
              <p className="text-xl text-iceblue relative z-10 drop-shadow-lg">
                Where every conversation is a <span className="text-primary font-semibold glow-text">symphony of healing</span> and every word resonates with <span className="text-highlight font-semibold glow-text">therapeutic harmony</span>
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6">
              <Badge variant="outline" className="border-primary text-primary bg-primary/10 backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                🎼 Evidence-Based
              </Badge>
              <Badge variant="outline" className="border-highlight text-highlight bg-highlight/10 backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                🎵 Trauma-Informed
              </Badge>
              <Badge variant="outline" className="border-iceblue text-iceblue bg-iceblue/10 backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                🎶 Personalized
              </Badge>
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
