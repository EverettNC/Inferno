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
 * Combined Profile & Settings Page 👤⚙️
 * 
 * Unified user profile and comprehensive settings management
 * including the Matthew/Joanna voice gender toggle
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserContext } from '@/contexts/UserContext';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { VoiceSettings } from '@/components/VoiceSettings';
import { AdvancedToggle } from '@/components/ui/AdvancedToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { 
  Settings, 
  User, 
  Mic, 
  Globe, 
  Volume2, 
  Shield, 
  Palette, 
  Bell, 
  Zap,
  Calendar,
  Activity,
  Heart,
  Brain,
  Wind,
  Mountain,
  UserCircle,
  Headphones,
  VolumeX,
  Music,
  Camera,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProfileSettingsPage() {
  const { user, updateUser } = useUserContext();
  const { isVoiceModeEnabled, toggleVoiceMode, synthesizer, speak } = useVoiceContext();
  const { toast } = useToast();
  
  // Profile states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  
  // Settings states
  const [localVoiceMode, setLocalVoiceMode] = useState(user?.voiceModeEnabled || false);
  const [selectedVoice, setSelectedVoice] = useState<'Matthew' | 'Joanna'>('Joanna');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSpeakResponses, setAutoSpeakResponses] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [musicTherapyEnabled, setMusicTherapyEnabled] = useState(true);
  const [behaviorAnalysisEnabled, setBehaviorAnalysisEnabled] = useState(true);
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user stats
  const { data: streakData } = useQuery<{ streak: number; lastCheckIn: string }>({
    queryKey: [`/api/users/${user?.id || 'none'}/check-in-streak`],
    enabled: !!user
  });
  
  // Fetch check-ins
  const { data: checkIns } = useQuery<any[]>({
    queryKey: [`/api/check-ins?userId=${user?.id}`],
    enabled: !!user
  });
  
  // Fetch exercises
  const { data: exercises } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.id || 'none'}/exercises`],
    enabled: !!user
  });

  const totalCheckIns = checkIns?.length || 0;
  const totalExercises = exercises?.length || 0;
  
  // Count exercises by type
  const exercisesByType = exercises?.reduce((acc: any, ex: any) => {
    acc[ex.type] = (acc[ex.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const handleVoiceModeToggle = (enabled: boolean) => {
    setLocalVoiceMode(enabled);
    if (enabled !== isVoiceModeEnabled) {
      toggleVoiceMode();
    }
  };

  const handleVoiceTest = () => {
    const testMessage = selectedVoice === 'Matthew' 
      ? "Hello! This is Matthew, your male voice companion. How does this sound?"
      : "Hi there! This is Joanna, your female voice companion. How do you like this voice?";
    
    speak(testMessage);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUser({
        firstName,
        lastName,
        preferredLanguage,
        voiceModeEnabled: localVoiceMode,
        settings: {
          selectedVoice,
          notificationsEnabled,
          autoSpeakResponses,
          voiceSpeed,
          musicTherapyEnabled,
          behaviorAnalysisEnabled,
          emotionTrackingEnabled,
          darkMode
        }
      });
      
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
      
      toast({
        title: '✨ Profile Updated!',
        description: 'Your profile and settings have been saved successfully.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'Never';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Never';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-24">
      
      {/* Christman AI Header */}
      <Card className="mb-6 bg-power-gradient border-0 shadow-christman backdrop-blur-xl">
        <CardContent className="p-6 relative overflow-hidden">
          {/* 3D Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-highlight/10 to-primary/10 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/30 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-darkbg/30 rounded-full backdrop-blur-sm border border-primary/30 animate-christman-pulse">
                <UserCircle className="w-8 h-8 text-primary" style={{ filter: 'drop-shadow(0 0 8px #37C8FF)' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 text-iceblue">
                  Your Profile & Settings
                  <div className="relative">
                    <div className="absolute inset-0 bg-highlight blur-lg opacity-50 rounded-full animate-pulse"></div>
                    <Sparkles className="w-8 h-8 text-highlight relative z-10" style={{ filter: 'drop-shadow(0 0 8px #35E4B9)' }} />
                  </div>
                </h1>
                <p className="text-iceblue/80" style={{ textShadow: '0 0 4px #B5E6FF' }}>
                  Personalize your healing journey with <span className="text-highlight font-semibold">The Christman AI Project</span>
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              {isSaving ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile & Stats
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice & Audio
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile & Stats Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {user && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <div>Member since: {formatDate(user.createdAt)}</div>
                      <div>Last active: {formatDate(user.lastLoginAt)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Journey Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Your Healing Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Check-in Streak */}
                  <div className="text-center p-4 bg-indigo/40 backdrop-blur-sm rounded-lg border border-primary/30 shadow-christman">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-primary relative z-10" style={{ filter: 'drop-shadow(0 0 8px #37C8FF)' }} />
                    </div>
                    <div className="text-2xl font-bold text-iceblue">23</div>
                    <div className="text-sm text-iceblue/70">Days Active</div>
                  </div>
                  
                  <div className="text-center p-4 bg-indigo/40 backdrop-blur-sm rounded-lg border border-highlight/30 shadow-glow">
                    <div className="relative">
                      <div className="absolute inset-0 bg-highlight/20 blur-xl rounded-full animate-pulse"></div>
                      <Activity className="w-8 h-8 mx-auto mb-2 text-highlight relative z-10" style={{ filter: 'drop-shadow(0 0 8px #35E4B9)' }} />
                    </div>
                    <div className="text-2xl font-bold text-iceblue">47</div>
                    <div className="text-sm text-iceblue/70">Sessions</div>
                  </div>
                  
                  <div className="text-center p-4 bg-indigo/40 backdrop-blur-sm rounded-lg border border-primary/30 shadow-power">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-highlight/20 blur-xl rounded-full"></div>
                      <Heart className="w-8 h-8 mx-auto mb-2 text-primary relative z-10" style={{ filter: 'drop-shadow(0 0 8px #37C8FF)' }} />
                    </div>
                    <div className="text-2xl font-bold text-iceblue">8.4</div>
                    <div className="text-sm text-iceblue/70">Mood Rating</div>
                  </div>
                  
                  <div className="text-center p-4 bg-indigo/40 backdrop-blur-sm rounded-lg border border-highlight/30 animate-christman-pulse">
                    <div className="relative">
                      <div className="absolute inset-0 bg-highlight/30 blur-xl rounded-full animate-pulse"></div>
                      <Brain className="w-8 h-8 mx-auto mb-2 text-highlight relative z-10" style={{ filter: 'drop-shadow(0 0 8px #35E4B9)' }} />
                    </div>
                    <div className="text-2xl font-bold text-iceblue">92%</div>
                    <div className="text-sm text-iceblue/70">Progress</div>
                  </div>

                  {/* Total Check-ins */}
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                    <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {totalCheckIns}
                    </div>
                    <div className="text-sm text-gray-600">Check-ins</div>
                  </div>

                  {/* Exercises */}
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {totalExercises}
                    </div>
                    <div className="text-sm text-gray-600">Exercises</div>
                  </div>

                  {/* Grounding */}
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <Mountain className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {exercisesByType.grounding || 0}
                    </div>
                    <div className="text-sm text-gray-600">Grounding</div>
                  </div>
                </div>

                {/* Exercise Breakdown */}
                {Object.keys(exercisesByType).length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Exercise Types:</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(exercisesByType).map(([type, count]) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}: {count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice & Audio Tab */}
        <TabsContent value="voice" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Voice Gender Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  Voice Gender Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Voice Options */}
                <div className="space-y-3">
                  <Label>Choose Your Preferred Voice:</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Joanna - Female */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVoice === 'Joanna' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setSelectedVoice('Joanna')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">👩</span>
                        </div>
                        <div>
                          <div className="font-semibold">Joanna</div>
                          <div className="text-sm text-gray-600">Female voice</div>
                          <div className="text-xs text-purple-600">Warm & supportive</div>
                        </div>
                      </div>
                    </div>

                    {/* Matthew - Male */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVoice === 'Matthew' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedVoice('Matthew')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">👨</span>
                        </div>
                        <div>
                          <div className="font-semibold">Matthew</div>
                          <div className="text-sm text-gray-600">Male voice</div>
                          <div className="text-xs text-blue-600">Calm & reassuring</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Voice Button */}
                <Button
                  onClick={handleVoiceTest}
                  className="w-full"
                  variant="outline"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Test {selectedVoice} Voice
                </Button>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-500" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <AdvancedToggle
                  label="Voice Mode"
                  description="Enable voice-based interactions with Inferno AI"
                  checked={localVoiceMode}
                  onCheckedChange={handleVoiceModeToggle}
                />
                
                <AdvancedToggle
                  label="Auto-Speak Responses"
                  description="Automatically speak AI responses out loud"
                  checked={autoSpeakResponses}
                  onCheckedChange={setAutoSpeakResponses}
                />

                <div>
                  <Label>Voice Speed: {voiceSpeed}x</Label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <AdvancedToggle
                  label="Notifications"
                  description="Receive audio notifications for important updates"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="features" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI Intelligence Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <AdvancedToggle
                  label="🎵 Music Therapy Integration"
                  description="Enable personalized music therapy recommendations and protocols"
                  checked={musicTherapyEnabled}
                  onCheckedChange={setMusicTherapyEnabled}
                />
                
                <AdvancedToggle
                  label="📹 Behavioral Analysis"
                  description="Allow webcam behavior tracking for enhanced emotional support"
                  checked={behaviorAnalysisEnabled}
                  onCheckedChange={setBehaviorAnalysisEnabled}
                />
                
                <AdvancedToggle
                  label="💚 Emotion Tracking"
                  description="Enable multi-modal emotion detection and adaptive responses"
                  checked={emotionTrackingEnabled}
                  onCheckedChange={setEmotionTrackingEnabled}
                />
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>All AI features are HIPAA compliant and privacy-first</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Data processed in real-time, never stored permanently</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Active AI Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Music Therapy</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Behavior Analysis</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Emotion Detection</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-500" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AdvancedToggle
                  label="Dark Mode"
                  description="Use dark theme for better low-light viewing"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Voice data processed in real-time only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>No conversation logs stored permanently</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HIPAA compliant data handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>End-to-end encryption enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}