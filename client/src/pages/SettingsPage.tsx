import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { VoiceSettings } from '@/components/VoiceSettings';
import { AdvancedToggle } from '@/components/ui/AdvancedToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Settings, User, Mic, Globe, Volume2, Shield, Palette, Bell, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useUserContext();
  const { isVoiceModeEnabled, toggleVoiceMode, synthesizer, speak } = useVoiceContext();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [localVoiceMode, setLocalVoiceMode] = useState(user?.voiceModeEnabled || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSpeakResponses, setAutoSpeakResponses] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [darkMode, setDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleVoiceModeToggle = (enabled: boolean) => {
    setLocalVoiceMode(enabled);
    if (enabled !== isVoiceModeEnabled) {
      toggleVoiceMode();
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUser({
        firstName,
        lastName,
        preferredLanguage,
        voiceModeEnabled: localVoiceMode
      });
      
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #00A7FF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 167, 255, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #00A7FF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 167, 255, 0.3);
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3 flex items-center gap-3">
          <Settings className="w-8 h-8 text-accent" />
          Settings
        </h1>
        <p className="text-lg text-text-secondary">
          Customize your Inferno AI experience
        </p>
      </div>
      
      {/* Enhanced Profile Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-electric-cyan flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName ? user.firstName[0].toUpperCase() : user?.username[0].toUpperCase()}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-24 text-xs"
              >
                Upload
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="username" className="text-text-secondary">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="bg-bg-tertiary border-border text-text-secondary cursor-not-allowed"
                  data-testid="input-username"
                />
                <p className="text-xs text-text-secondary mt-1">Username cannot be changed</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-text-primary">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="bg-input-bg border-input-border focus:ring-accent focus:border-accent"
                    data-testid="input-firstname"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-text-primary">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="bg-input-bg border-input-border focus:ring-accent focus:border-accent"
                    data-testid="input-lastname"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <Label htmlFor="bio" className="text-text-primary">About Me</Label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself, your journey, or anything you'd like to share..."
              className="w-full mt-2 px-3 py-3 bg-input-bg border border-input-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-text-primary resize-none"
              rows={4}
            />
            <p className="text-xs text-text-secondary mt-2">
              This helps personalize your Inferno AI experience (optional)
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              📊 Progress Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-sm text-text-secondary">Days Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-cyan">8</div>
                <div className="text-sm text-text-secondary">Exercises Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">85%</div>
                <div className="text-sm text-text-secondary">Weekly Check-ins</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Enhanced Voice & Audio Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-accent" />
            Voice & Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Mode Toggle */}
          <AdvancedToggle
            enabled={localVoiceMode}
            onToggle={handleVoiceModeToggle}
            label="Voice Mode"
            description="Enable voice input and AI speech responses throughout the app"
          />

          {/* Voice Selection */}
          {localVoiceMode && (
            <div className="border-t border-border pt-6">
              <div className="mb-4">
                <Label className="text-text-primary mb-3 block text-base font-semibold">Voice Selection</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="radio"
                      id="voice-joanna"
                      name="voice-selection"
                      value="Joanna"
                      checked={synthesizer?.getPollyVoice() === "Joanna"}
                      onChange={() => synthesizer?.setPollyVoice("Joanna")}
                      className="sr-only"
                    />
                    <label
                      htmlFor="voice-joanna"
                      className={`
                        block p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${synthesizer?.getPollyVoice() === "Joanna" 
                          ? 'border-accent bg-accent/10 text-accent' 
                          : 'border-border bg-bg-tertiary text-text-secondary hover:border-accent/50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">👩</span>
                        <div className="text-center">
                          <div className="font-semibold">Joanna</div>
                          <div className="text-sm opacity-75">Female Voice</div>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="voice-matthew"
                      name="voice-selection"
                      value="Matthew"
                      checked={synthesizer?.getPollyVoice() === "Matthew"}
                      onChange={() => synthesizer?.setPollyVoice("Matthew")}
                      className="sr-only"
                    />
                    <label
                      htmlFor="voice-matthew"
                      className={`
                        block p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${synthesizer?.getPollyVoice() === "Matthew" 
                          ? 'border-accent bg-accent/10 text-accent' 
                          : 'border-border bg-bg-tertiary text-text-secondary hover:border-accent/50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">👨</span>
                        <div className="text-center">
                          <div className="font-semibold">Matthew</div>
                          <div className="text-sm opacity-75">Male Voice</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Voice Test Button */}
                <div className="mt-4 text-center">
                  <Button
                    onClick={() => {
                      const currentVoice = synthesizer?.getPollyVoice() || "Joanna";
                      speak(`Hello, this is ${currentVoice} speaking. This is a voice test.`);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-accent border-accent hover:bg-accent hover:text-white"
                  >
                    🎤 Test Selected Voice
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Auto-speak responses */}
          <AdvancedToggle
            enabled={autoSpeakResponses}
            onToggle={setAutoSpeakResponses}
            label="Auto-speak AI Responses"
            description="Automatically read AI responses aloud when voice mode is enabled"
            disabled={!localVoiceMode}
          />

          {/* Voice Speed Control */}
          {localVoiceMode && (
            <div>
              <Label className="text-text-primary mb-2 block">Voice Speed</Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary">Slow</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-text-secondary">Fast</span>
                <span className="text-sm text-accent font-medium min-w-[3rem]">
                  {voiceSpeed}x
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdvancedToggle
            enabled={darkMode}
            onToggle={setDarkMode}
            label="Dark Mode"
            description="Use dark theme throughout the application"
          />
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdvancedToggle
            enabled={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            label="Push Notifications"
            description="Receive notifications for check-ins, reminders, and updates"
          />
        </CardContent>
      </Card>
      
      {/* Language Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="language" className="text-text-primary">Preferred Language</Label>
          <select
            id="language"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full mt-2 px-3 py-2 bg-input-bg border border-input-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-text-primary"
            data-testid="select-language"
          >
            <option value="en">English</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
          <p className="text-xs text-text-secondary mt-2">
            This will affect the language used in voice responses and guidance
          </p>
        </CardContent>
      </Card>
      
      {/* Privacy & Security */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border">
            <h3 className="font-medium text-text-primary mb-2">Data Usage</h3>
            <p className="text-sm text-text-secondary mb-3">
              Your voice data is processed securely and never stored permanently. 
              All interactions are encrypted and follow HIPAA compliance standards.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="text-accent border-accent hover:bg-accent hover:text-white"
            >
              View Privacy Policy
            </Button>
          </div>
          
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border">
            <h3 className="font-medium text-text-primary mb-2">Account Security</h3>
            <p className="text-sm text-text-secondary mb-3">
              Change your password or review account security settings.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="text-accent border-accent hover:bg-accent hover:text-white"
            >
              Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => {
            // Reset to original values
            setFirstName(user?.firstName || '');
            setLastName(user?.lastName || '');
            setLocalVoiceMode(user?.voiceModeEnabled || false);
          }}
          className="px-6 py-2"
        >
          Reset Changes
        </Button>
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-8 py-2 bg-gradient-to-r from-accent to-electric-cyan hover:from-accent-subtle hover:to-accent text-white rounded-lg transition font-medium shadow-lg"
          data-testid="button-save-settings"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Save All Changes
            </div>
          )}
        </Button>
      </div>
      
      {/* Account Info */}
      <Card className="mt-6 bg-bg-secondary border-border">
        <CardContent className="p-4">
          <div className="text-xs text-text-secondary space-y-1">
            <p>Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
            <p className="text-text-secondary/50">Need help? Contact support at support@infernoai.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
