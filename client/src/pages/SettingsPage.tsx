import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useVoiceContext } from '@/contexts/VoiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Settings, User, Mic, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useUserContext();
  const { isVoiceModeEnabled } = useVoiceContext();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [localVoiceMode, setLocalVoiceMode] = useState(user?.voiceModeEnabled || false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-7 h-7 text-accent" />
          Settings
        </h1>
        <p className="text-text-secondary">
          Manage your account and preferences
        </p>
      </div>
      
      {/* Profile Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
      
      {/* Voice Settings */}
      <Card className="mb-6 bg-bg-secondary border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium mb-1">Enable Voice Mode</h3>
              <p className="text-sm text-text-secondary">
                Allow the AI to speak responses and use voice input throughout the app
              </p>
            </div>
            <Switch
              checked={localVoiceMode}
              onCheckedChange={setLocalVoiceMode}
              className="ml-4"
              data-testid="switch-voice-mode"
            />
          </div>
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
      
      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-6 py-2 bg-accent hover:bg-accent-subtle text-white rounded-lg transition font-medium"
          data-testid="button-save-settings"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
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
